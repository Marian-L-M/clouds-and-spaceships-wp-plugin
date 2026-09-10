import {
	Button,
	Flex,
	FlexBlock,
	FlexItem,
	Popover,
} from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { useState, useEffect } from '@wordpress/element';
import { plus } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import { store as noticesStore } from '@wordpress/notices';

import AreasCanvas from '../canvases/AreasCanvas';
import AreasList from '../lists/AreasList';
import { apiFetch } from '../../utils';
import { settingsToDrawState } from '../../canvas';
import { getDefaultNodes, moveAreaNode, canRemoveAreaNode } from '../../areas';
import { defaultAreaFormData } from '../forms/AreaForm';
import { useCanvasKeyboard } from '../useCanvasKeyboard';
import { useMapResource } from '../useMapResource';
import { SHAPE_TYPE_DEFAULT } from '../../../choices';
import type { MapSettings, MapArea, AreaFormData, Node } from '../../../types';

// Internal clipboard for ⌘/Ctrl+C/V. Module scope so it survives tab
// switches within the editor page (not across page loads / other maps).
let areaClipboard: { form: AreaFormData; nodes: Node[] } | null = null;

interface Props {
	mapId: number;
	settings: MapSettings;
	areas: MapArea[];
	selectedAreaId: number | null;
	onAreasLoaded: ( areas: MapArea[] ) => void;
	onSelect: ( id: number ) => void;
	onDeselect: () => void;
	onNodesUpdate: ( areaId: number, nodes: Node[] ) => void;
	onDuplicate: ( id: number ) => Promise< void >;
	onDelete: ( id: number ) => Promise< void >;
}

export default function AreasPanel( {
	mapId,
	settings,
	areas,
	selectedAreaId,
	onAreasLoaded,
	onSelect,
	onDeselect,
	onNodesUpdate,
	onDuplicate,
	onDelete,
}: Props ) {
	useMapResource< MapArea >( mapId, 'areas', onAreasLoaded );
	const { createErrorNotice } = useDispatch( noticesStore );

	// ── Keyboard shortcuts (active while the Areas tab is mounted) ─────────────

	const selectedArea = areas.find( ( a ) => a.id === selectedAreaId ) || null;
	const canvasW = settings.width || 1000;
	const canvasH = canvasW / ( settings.aspectRatio || 1 );

	// Keyboard-focused node of the selected area (Tab cycles it): arrows then
	// nudge that node instead of the whole area, Delete removes it, Esc clears
	// the focus (handled in the canvas, before deselecting).
	const [ focusedNodeIdx, setFocusedNodeIdx ] = useState< number | null >(
		null
	);

	useEffect( () => {
		setFocusedNodeIdx( null );
	}, [ selectedAreaId ] );

	// Node-list edits can shrink the node set — keep the focus index valid.
	const nodeCount = selectedArea ? ( selectedArea.nodes || [] ).length : 0;
	useEffect( () => {
		if ( focusedNodeIdx !== null && focusedNodeIdx >= nodeCount ) {
			setFocusedNodeIdx( nodeCount ? nodeCount - 1 : null );
		}
	}, [ nodeCount ] );

	async function pasteArea() {
		if ( ! areaClipboard ) return;
		// Cascade repeated pastes instead of stacking copies exactly on top
		// of each other (nodes are normalized 0–1, so shift by 24 px worth).
		const nodes = areaClipboard.nodes.map( ( n ) => ( {
			...n,
			x: n.x + 24 / canvasW,
			y: n.y + 24 / canvasH,
		} ) );
		areaClipboard = { ...areaClipboard, nodes };
		try {
			const data = await apiFetch< MapArea >(
				'POST',
				`/maps/${ mapId }/areas`,
				{
					...areaClipboard.form,
					nodes: JSON.stringify( nodes ),
				}
			);
			onAreasLoaded( [ ...areas, data ] );
			onSelect( data.id );
		} catch {
			/* paste failures are silent, as before */
		}
	}

	useCanvasKeyboard( {
		copy: () => {
			if ( ! selectedArea ) return false;
			areaClipboard = {
				form: defaultAreaFormData( selectedArea ),
				nodes: ( selectedArea.nodes || [] ).map( ( n ) => ( {
					...n,
				} ) ),
			};
			return true;
		},
		paste: () => {
			if ( ! areaClipboard ) return false;
			void pasteArea();
			return true;
		},
		duplicate: () => {
			if ( ! selectedArea ) return false;
			void onDuplicate( selectedArea.id );
			return true;
		},
		// With a node focused, Delete removes that node (where the shape
		// allows); otherwise it deletes the whole area after a confirm.
		remove: () => {
			if ( ! selectedArea ) return false;
			if ( focusedNodeIdx !== null ) {
				if ( canRemoveAreaNode( selectedArea ) ) {
					const nodes = ( selectedArea.nodes || [] ).filter(
						( _, i ) => i !== focusedNodeIdx
					);
					onNodesUpdate( selectedArea.id, nodes );
					// The clamp effect keeps the index valid; move focus to
					// the previous node so repeated Deletes walk backwards.
					setFocusedNodeIdx(
						focusedNodeIdx > 0 ? focusedNodeIdx - 1 : 0
					);
				}
				return true; // claim the key even when the shape can't shrink
			}
			if ( confirm( __( 'Delete this area?', 'clouds-and-spaceships' ) ) )
				void onDelete( selectedArea.id );
			return true;
		},
		// Arrow keys nudge the focused node, or move the whole area when no
		// node is focused. Local update + persistence ride on the debounced
		// geometry save in MapEditorApp.
		nudge: ( dx, dy ) => {
			if ( ! selectedArea ) return false;
			if (
				focusedNodeIdx !== null &&
				( selectedArea.nodes || [] )[ focusedNodeIdx ]
			) {
				const node = selectedArea.nodes[ focusedNodeIdx ];
				const newX = Math.min(
					1,
					Math.max( 0, node.x + dx / canvasW )
				);
				const newY = Math.min(
					1,
					Math.max( 0, node.y + dy / canvasH )
				);
				onNodesUpdate(
					selectedArea.id,
					moveAreaNode( selectedArea, focusedNodeIdx, newX, newY )
				);
				return true;
			}
			const nodes = ( selectedArea.nodes || [] ).map( ( n ) => ( {
				...n,
				x: n.x + dx / canvasW,
				y: n.y + dy / canvasH,
			} ) );
			onNodesUpdate( selectedArea.id, nodes );
			return true;
		},
		// Tab / Shift+Tab cycle through the selected area's nodes.
		tab: ( backwards ) => {
			if ( ! selectedArea || ! nodeCount ) return false;
			setFocusedNodeIdx( ( prev ) => {
				if ( prev === null ) return backwards ? nodeCount - 1 : 0;
				return (
					( prev + ( backwards ? -1 : 1 ) + nodeCount ) % nodeCount
				);
			} );
			return true;
		},
	} );

	async function handleAddArea() {
		if ( ! mapId ) return;
		const defaultNodes = getDefaultNodes( SHAPE_TYPE_DEFAULT );
		try {
			const data = await apiFetch< MapArea >(
				'POST',
				`/maps/${ mapId }/areas`,
				{
					title: __( 'New Area', 'clouds-and-spaceships' ),
					nodes: JSON.stringify( defaultNodes ),
					style_fill: '#2271b1',
					style_stroke: '#2271b1',
					style_stroke_width: 2,
				}
			);
			onAreasLoaded( [ ...areas, data ] );
			onSelect( data.id );
		} catch ( err ) {
			createErrorNotice(
				( err as Error ).message ||
					__( 'Failed to create area.', 'clouds-and-spaceships' ),
				{ type: 'snackbar' }
			);
		}
	}

	async function handleDelete( id: number ) {
		if ( ! confirm( 'Delete this area?' ) ) return;
		await onDelete( id );
	}

	const drawState = settingsToDrawState( settings );

	// Help information
	const [ isVisibleHelpInformation, setIsVisibleHelpInformation ] =
		useState( false );
	const toggleVisibleHelpInformation = () => {
		setIsVisibleHelpInformation( ( state: boolean ) => ! state );
	};

	return (
		<div
			className="cns-tab-panel cns-tab-panel--active"
			data-panel="areas"
			role="tabpanel"
		>
			<Flex gap={ 2 } direction="column" align="center">
				<FlexBlock style={ { width: '100%' } }>
					<Flex gap={ 4 } align="start" justify="space-between">
						<FlexItem>
							<Button
								variant="tertiary"
								onClick={ toggleVisibleHelpInformation }
							>
								Help Information
								{ isVisibleHelpInformation && (
									<Popover
										headerTitle="Help Information"
										expandOnMobile
									>
										<ol
											style={ {
												width: 320,
												maxWidth: '100%',
											} }
										>
											<li>
												{ __(
													'Click a node to pick it up — it follows the cursor.',
													'clouds-and-spaceships'
												) }
											</li>
											<li>
												{ __(
													'Click or press Enter to place node.',
													'clouds-and-spaceships'
												) }
											</li>
											<li>
												{ __(
													'Press Esc to cancel current placement.',
													'clouds-and-spaceships'
												) }
											</li>
											<li>
												{ __(
													'Click empty space on a selected area to add a node. ',
													'clouds-and-spaceships'
												) }
											</li>
											<li>
												{ __(
													'With an area selected: arrow keys move the whole area (Shift = 10 px).',
													'clouds-and-spaceships'
												) }
											</li>
											<li>
												{ __(
													' Tab/Shift+Tab cycles nodes; Arrows nudge node; Delete removes node.',
													'clouds-and-spaceships'
												) }
											</li>
											<li>
												{ __(
													'Ctrl/⌘+C & V copy & paste, Ctrl/⌘+D duplicates, Delete removes the area.',
													'clouds-and-spaceships'
												) }
											</li>
										</ol>
									</Popover>
								) }
							</Button>
						</FlexItem>
						<Button
							variant="primary"
							icon={ plus }
							onClick={ handleAddArea }
						>
							{ __( 'Add Area', 'clouds-and-spaceships' ) }
						</Button>
					</Flex>
				</FlexBlock>
				<AreasCanvas
					drawState={ drawState }
					areas={ areas }
					selectedAreaId={ selectedAreaId }
					focusedNodeIdx={ focusedNodeIdx }
					onSelect={ onSelect }
					onDeselect={ onDeselect }
					onNodesChange={ onNodesUpdate }
					onNodeFocusChange={ setFocusedNodeIdx }
				/>
				<AreasList
					areas={ areas }
					onSelect={ onSelect }
					onDuplicate={ ( id ) => void onDuplicate( id ) }
					onDelete={ handleDelete }
				/>
			</Flex>
		</div>
	);
}
