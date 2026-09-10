import {
	Button,
	Flex,
	FlexBlock,
	FlexItem,
	Popover,
} from '@wordpress/components';
import { plus } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import HierarchyCanvas from '../canvases/HierarchyCanvas';
import HierarchyRegionList from '../lists/HierarchyRegionList';
import { settingsToDrawState } from '../../canvas';
import { getDefaultNodes } from '../../areas';
import { useMapResource } from '../useMapResource';
import { SHAPE_TYPE_DEFAULT } from '../../../choices';
import type {
	MapSettings,
	HierarchyRegion,
	Node,
	ParentMapRef,
} from '../../../types';
import { useState } from '@wordpress/element';

interface Props {
	mapId: number;
	settings: MapSettings;
	regions: HierarchyRegion[];
	selectedRegionId: number | null;
	parentMaps: ParentMapRef[];
	onRegionsLoaded: ( regions: HierarchyRegion[] ) => void;
	onSelect: ( id: number ) => void;
	onDeselect: () => void;
	onNodesUpdate: ( regionId: number, nodes: Node[] ) => void;
	onDelete: ( id: number ) => Promise< void >;
}

export default function HierarchyPanel( {
	mapId,
	settings,
	regions,
	selectedRegionId,
	parentMaps,
	onRegionsLoaded,
	onSelect,
	onDeselect,
	onNodesUpdate,
	onDelete,
}: Props ) {
	useMapResource< HierarchyRegion >( mapId, 'hierarchy', onRegionsLoaded );

	async function handleAddRegion() {
		if ( ! mapId ) return;
		// Create a placeholder region with no child yet; user assigns it in the context panel.
		// We use child_map_id=0 as a sentinel and immediately select it.
		// The REST API requires a valid child_map_id, so we create with the map's own ID as
		// a placeholder — but the API rejects self-links. Instead, just insert an empty polygon
		// that the user fills in via the context form.
		//
		// Strategy: optimistically add a local-only "draft" region, select it for editing.
		// It won't be persisted until the user saves from the context panel (which requires
		// a valid child_map_id). We mark it with id=-1 as an unsaved sentinel.
		const draft: HierarchyRegion = {
			id: -1,
			parent_map_id: mapId,
			child_map_id: 0,
			shape_type: SHAPE_TYPE_DEFAULT,
			nodes: getDefaultNodes( SHAPE_TYPE_DEFAULT ),
			canvas_styles: {
				fill: '#e8a020',
				stroke: '#e8a020',
				strokeWidth: 2,
			},
			title_override: null,
			description_override: null,
			child_map_title: '',
			child_map_excerpt: '',
			child_map_status: '',
			child_map_thumbnail: '',
			child_map_url: '',
			created_at: '',
			updated_at: '',
		};
		onRegionsLoaded( [ ...regions, draft ] );
		onSelect( -1 );
	}

	async function handleDelete( id: number ) {
		if ( id === -1 ) {
			// Unsaved draft — just remove locally.
			onRegionsLoaded( regions.filter( ( r ) => r.id !== -1 ) );
			onDeselect();
			return;
		}
		if (
			! confirm( __( 'Delete this hierarchy region?', 'clouds-and-spaceships' ) )
		)
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
			data-panel="hierarchy"
			role="tabpanel"
		>
			<Flex gap={ 2 } direction="column" align="center">
				<div className="cns-objects-layout">
					{ /* ── Parent maps breadcrumb scaffold ── */ }
					{ parentMaps.length > 0 && (
						<div className="cns-hierarchy-parents">
							<span className="cns-hierarchy-parents__label">
								{ __( 'Parent maps:', 'clouds-and-spaceships' ) }
							</span>
							{ parentMaps.map( ( p ) => (
								<a
									key={ p.map_id }
									href={ p.url }
									className="cns-hierarchy-parents__link"
								>
									{ p.thumbnail && (
										<img src={ p.thumbnail } alt="" />
									) }
									{ p.title }
								</a>
							) ) }
						</div>
					) }
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
														'Draw a polygon region that links to a child map.',
														'clouds-and-spaceships'
													) }
												</li>
												<li>
													{ __(
														'Click a node to reposition it.',
														'clouds-and-spaceships'
													) }
												</li>
												<li>
													{ __(
														'Click empty canvas on a selected region to add a node.',
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
								onClick={ handleAddRegion }
							>
								{ __( 'Add Region', 'clouds-and-spaceships' ) }
							</Button>
						</Flex>
					</FlexBlock>

					<HierarchyCanvas
						drawState={ drawState }
						regions={ regions }
						selectedRegionId={ selectedRegionId }
						onSelect={ onSelect }
						onDeselect={ onDeselect }
						onNodesChange={ onNodesUpdate }
					/>

					<HierarchyRegionList
						regions={ regions.filter( ( r ) => r.id !== -1 ) }
						onSelect={ onSelect }
						onDelete={ handleDelete }
					/>
				</div>
			</Flex>
		</div>
	);
}
