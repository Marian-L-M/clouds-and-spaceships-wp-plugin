import {
	Button,
	Flex,
	FlexBlock,
	FlexItem,
	Popover,
} from '@wordpress/components';
import { useRef, useEffect, useState } from '@wordpress/element';
import { plus } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import ObjectsCanvas from '../canvases/ObjectsCanvas';
import ObjectsList from '../lists/ObjectsList';
import { settingsToDrawState } from '../../canvas';
import {
	defaultObjectFormData,
	collectObjectPayload,
} from '../forms/ObjectForm';
import { useCanvasKeyboard, createDebouncedNudge } from '../useCanvasKeyboard';
import { useMapResource } from '../useMapResource';
import type { MapSettings, MapObject, ObjectSavePayload } from '../../../types';

// Internal clipboard for ⌘/Ctrl+C/V. Module scope so it survives tab
// switches within the editor page (not across page loads / other maps).
let objectClipboard: ObjectSavePayload | null = null;

interface Props {
	mapId: number;
	settings: MapSettings;
	objects: MapObject[];
	selectedObjectId: number | null;
	onObjectsLoaded: ( objects: MapObject[] ) => void;
	onSelect: ( id: number ) => void;
	onDeselect: () => void;
	onAdd: ( payload: ObjectSavePayload ) => Promise< MapObject >;
	onPositionUpdate: ( id: number, x: number, y: number ) => Promise< void >;
	onLocalUpdate: ( id: number, patch: Partial< MapObject > ) => void;
	onDuplicate: ( id: number ) => Promise< void >;
	onDelete: ( id: number ) => Promise< void >;
}

export default function ObjectsPanel( {
	mapId,
	settings,
	objects,
	selectedObjectId,
	onObjectsLoaded,
	onSelect,
	onDeselect,
	onAdd,
	onPositionUpdate,
	onLocalUpdate,
	onDuplicate,
	onDelete,
}: Props ) {
	useMapResource< MapObject >( mapId, 'objects', onObjectsLoaded );

	// The nudge factory is created once; these refs feed it live values.
	const stateRef = useRef( { objects, selectedObjectId } );
	stateRef.current = { objects, selectedObjectId };
	const propsRef = useRef( { onPositionUpdate, onLocalUpdate } );
	propsRef.current = { onPositionUpdate, onLocalUpdate };

	// ── Keyboard shortcuts (active while the Objects tab is mounted) ───────────

	const selectedObject =
		objects.find( ( o ) => o.id === selectedObjectId ) || null;

	const nudger = useRef(
		createDebouncedNudge(
			() => {
				const s = stateRef.current;
				return (
					s.objects.find( ( o ) => o.id === s.selectedObjectId ) ||
					null
				);
			},
			( id, x, y ) => propsRef.current.onLocalUpdate( id, { x, y } ),
			( id, x, y ) => void propsRef.current.onPositionUpdate( id, x, y )
		)
	);
	useEffect( () => () => nudger.current.flush(), [] ); // persist pending nudge on tab leave

	async function pasteObject() {
		if ( ! objectClipboard ) return;
		// Cascade repeated pastes instead of stacking copies exactly on top
		// of each other.
		const payload = {
			...objectClipboard,
			x: objectClipboard.x + 24,
			y: objectClipboard.y + 24,
		};
		objectClipboard = payload;
		const created = await onAdd( payload );
		onSelect( created.id );
	}

	useCanvasKeyboard( {
		copy: () => {
			if ( ! selectedObject ) return false;
			objectClipboard = collectObjectPayload(
				defaultObjectFormData( selectedObject, null, null )
			);
			return true;
		},
		paste: () => {
			if ( ! objectClipboard ) return false;
			void pasteObject();
			return true;
		},
		duplicate: () => {
			if ( ! selectedObject ) return false;
			void onDuplicate( selectedObject.id );
			return true;
		},
		remove: () => {
			if ( ! selectedObject ) return false;
			if (
				confirm( __( 'Delete this object?', 'clouds-and-spaceships' ) )
			)
				void onDelete( selectedObject.id );
			return true;
		},
		nudge: ( dx, dy ) => nudger.current.nudge( dx, dy ),
	} );

	// New objects are created immediately and edited in the context panel —
	// same flow as areas and labels (the modal is gone).
	async function handleCreateAt( x: number, y: number ) {
		const payload = collectObjectPayload( {
			...defaultObjectFormData( null, x, y ),
			title: __( 'New Object', 'clouds-and-spaceships' ),
		} );
		const created = await onAdd( payload );
		onSelect( created.id );
	}

	function handleAdd() {
		const cx = Math.round( settings.width / 2 );
		const cy = Math.round( settings.width / settings.aspectRatio / 2 );
		void handleCreateAt( cx, cy );
	}

	async function handleDelete( id: number ) {
		if ( ! confirm( __( 'Delete this object?', 'clouds-and-spaceships' ) ) )
			return;
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
			data-panel="objects"
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
										<p
											style={ {
												padding: '0 1em',
												width: 320,
												maxWidth: '100%',
											} }
										>
											Objects are clickable icons on the
											map that are linked to an infobox.
										</p>
										<ol
											style={ {
												width: 320,
												maxWidth: '100%',
											} }
										>
											<li>
												{ __(
													'After creating a new object, you can toggle its display mode in the context sidebar.',
													'clouds-and-spaceships'
												) }
											</li>
											<li>
												{ __(
													'Click an object to pick it up — it follows the cursor.',
													'clouds-and-spaceships'
												) }
											</li>
											<li>
												{ __(
													'Click again or press Enter to place object',
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
													'Click empty canvas to place a new object at position.',
													'clouds-and-spaceships'
												) }
											</li>
											<li>
												{ __(
													' Edit object contents it in the side panel. ',
													'clouds-and-spaceships'
												) }
											</li>
											<li>
												{ __(
													'While object seleted, Enter picks it up, arrow keys nudge, Ctrl/⌘+C & V copy & paste, Ctrl/⌘+D duplicates, Delete removes.',
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
							onClick={ handleAdd }
						>
							{ __( 'Add Object', 'clouds-and-spaceships' ) }
						</Button>
					</Flex>
				</FlexBlock>
				<ObjectsCanvas
					drawState={ drawState }
					objects={ objects }
					selectedObjectId={ selectedObjectId }
					onSelect={ onSelect }
					onDeselect={ onDeselect }
					onPositionUpdate={ onPositionUpdate }
					onPlace={ ( x, y ) => void handleCreateAt( x, y ) }
				/>

				<ObjectsList
					objects={ objects }
					onEdit={ ( obj ) => onSelect( obj.id ) }
					onDuplicate={ ( id ) => void onDuplicate( id ) }
					onDelete={ handleDelete }
				/>
			</Flex>
		</div>
	);
}
