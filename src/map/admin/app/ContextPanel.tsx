import { useState, useEffect } from '@wordpress/element';
import { Button, Flex, FlexBlock, FlexItem } from '@wordpress/components';
import { useDispatch } from '@wordpress/data';
import { store as noticesStore } from '@wordpress/notices';
import { close, copy } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import ObjectForm, {
	defaultObjectFormData,
	collectObjectPayload,
	objectCanvasStylesFromForm,
} from './forms/ObjectForm';
import LabelForm, {
	defaultLabelFormData,
	collectLabelPayload,
} from './forms/LabelForm';
import AreaForm, { defaultAreaFormData } from './forms/AreaForm';
import HierarchyRegionForm, {
	defaultHierarchyFormData,
} from './forms/HierarchyRegionForm';
import NodeList from './forms/NodeList';
import RegionNodeList from './forms/RegionNodeList';
import { iconLibraryCache, loadIconLibraryIntoCache } from '../icons';
import type {
	Tab,
	MapObject,
	MapArea,
	MapLabel,
	HierarchyRegion,
	HierarchyFormData,
	ObjectFormData,
	AreaFormData,
	LabelFormData,
	ObjectSavePayload,
	LabelSavePayload,
	ShapeType,
	Node,
	LibraryIcon,
} from '../../types';

type Selection =
	| { kind: 'object'; item: MapObject }
	| { kind: 'label'; item: MapLabel }
	| { kind: 'region'; item: HierarchyRegion }
	| { kind: 'area'; item: MapArea };

interface Props {
	activeTab: Tab;
	selectedObject: MapObject | null;
	selectedArea: MapArea | null;
	selectedLabel: MapLabel | null;
	selectedRegion: HierarchyRegion | null;
	onObjectSave: (
		payload: ObjectSavePayload
	) => Promise< MapObject | undefined >;
	onObjectDelete: () => Promise< void >;
	onObjectClose: () => void;
	onObjectDuplicate: () => void;
	onObjectLocalUpdate: ( id: number, patch: Partial< MapObject > ) => void;
	onLabelSave: (
		payload: LabelSavePayload
	) => Promise< MapLabel | undefined >;
	onLabelDelete: () => Promise< void >;
	onLabelClose: () => void;
	onLabelDuplicate: () => void;
	onLabelLocalUpdate: ( id: number, patch: Partial< MapLabel > ) => void;
	onAreaSave: ( formData: AreaFormData ) => Promise< MapArea | undefined >;
	onAreaDelete: () => Promise< void >;
	onAreaClose: () => void;
	onAreaDuplicate: () => void;
	onAreaLocalUpdate: ( id: number, patch: Partial< MapArea > ) => void;
	onAreaNodesUpdate: ( areaId: number, nodes: Node[] ) => void;
	onAreaShapeTypeChange: ( areaId: number, shapeType: ShapeType ) => void;
	onRegionSave: (
		formData: HierarchyFormData
	) => Promise< HierarchyRegion | undefined >;
	onRegionDelete: () => Promise< void >;
	onRegionClose: () => void;
	onRegionLocalUpdate: (
		id: number,
		patch: Partial< HierarchyRegion >
	) => void;
	onRegionNodesUpdate: ( regionId: number, nodes: Node[] ) => void;
	onRegionShapeTypeChange: ( regionId: number, shapeType: ShapeType ) => void;
}

export default function ContextPanel( {
	activeTab,
	selectedObject,
	selectedArea,
	selectedLabel,
	selectedRegion,
	onObjectSave,
	onObjectDelete,
	onObjectClose,
	onObjectDuplicate,
	onObjectLocalUpdate,
	onLabelSave,
	onLabelDelete,
	onLabelClose,
	onLabelDuplicate,
	onLabelLocalUpdate,
	onAreaSave,
	onAreaDelete,
	onAreaClose,
	onAreaDuplicate,
	onAreaLocalUpdate,
	onAreaNodesUpdate,
	onAreaShapeTypeChange,
	onRegionSave,
	onRegionDelete,
	onRegionClose,
	onRegionLocalUpdate,
	onRegionNodesUpdate,
	onRegionShapeTypeChange,
}: Props ) {
	const [ objFormData, setObjFormData ] = useState< ObjectFormData | null >(
		null
	);
	const [ areaFormData, setAreaFormData ] = useState< AreaFormData | null >(
		null
	);
	const [ labelFormData, setLabelFormData ] =
		useState< LabelFormData | null >( null );
	const [ regionFormData, setRegionFormData ] =
		useState< HierarchyFormData | null >( null );
	const [ icons, setIcons ] = useState< LibraryIcon[] >(
		iconLibraryCache || []
	);
	const [ saving, setSaving ] = useState( false );
	const { createSuccessNotice, createErrorNotice } =
		useDispatch( noticesStore );

	useEffect( () => {
		if ( selectedObject ) {
			setObjFormData(
				defaultObjectFormData( selectedObject, null, null )
			);
			if ( ! iconLibraryCache ) {
				loadIconLibraryIntoCache().then( () =>
					setIcons( iconLibraryCache || [] )
				);
			}
		}
	}, [ selectedObject?.id ] );

	// Canvas drags and keyboard nudges move the object on the list; the form was
	// only filled when the selection changed, so its X/Y went stale and Save
	// posted the pre-drag coordinates back — reverting the move. Mirror the live
	// position into the form instead.
	//
	// Only the coordinates are copied, unlike the label effect below which
	// rebuilds the whole form: label edits round-trip through the list via
	// onLabelLocalUpdate, so a full reset is a no-op there. Object edits do not,
	// so rebuilding here would throw away any unsaved title or style the user
	// had typed before dragging.
	useEffect( () => {
		if ( ! selectedObject ) return;
		const { x, y } = selectedObject;
		setObjFormData( ( prev ) =>
			prev && ( prev.x !== x || prev.y !== y )
				? { ...prev, x, y }
				: prev
		);
	}, [ selectedObject?.x, selectedObject?.y ] );

	useEffect( () => {
		if ( selectedArea ) {
			setAreaFormData( defaultAreaFormData( selectedArea ) );
		}
	}, [ selectedArea?.id ] );

	// Geometry deps: canvas drags update x/y/offsets on the list — the form
	// must pick those up. Form-driven live edits round-trip to the same
	// values, so the reset is a no-op for them.
	useEffect( () => {
		if ( selectedLabel ) {
			setLabelFormData(
				defaultLabelFormData( selectedLabel, null, null )
			);
		}
	}, [
		selectedLabel?.id,
		selectedLabel?.x,
		selectedLabel?.y,
		selectedLabel?.offset_x,
		selectedLabel?.offset_y,
	] );

	useEffect( () => {
		if ( selectedRegion ) {
			setRegionFormData( defaultHierarchyFormData( selectedRegion ) );
		}
	}, [ selectedRegion?.id ] );

	// Priority when several are somehow set: object > label > region > area.
	const maybeSelection: Selection | null = selectedObject
		? { kind: 'object', item: selectedObject }
		: selectedLabel
		? { kind: 'label', item: selectedLabel }
		: selectedRegion
		? { kind: 'region', item: selectedRegion }
		: selectedArea
		? { kind: 'area', item: selectedArea }
		: null;

	if ( ! maybeSelection ) {
		return (
			<aside
				className="cns-map-editor__context"
				aria-label="Context panel"
			>
				<Flex
					direction={ 'column' }
					align={ 'center' }
					justify={ 'center' }
					className="cns-map-editor__context-empty"
				>
					<p>
						{ __(
							'Select on canvas to edit in sidebar',
							'clouds-and-spaceships'
						) }
					</p>
				</Flex>
			</aside>
		);
	}

	// Non-null past the guard; a plain rebind so nested handlers below
	// see the narrowed type (TS drops early-return narrowing in closures).
	const selection: Selection = maybeSelection;

	const title =
		selection.kind === 'object'
			? selection.item.title || '(no title)'
			: selection.kind === 'label'
			? selection.item.text || '(empty label)'
			: selection.kind === 'region'
			? selection.item.child_map_title || 'New Region'
			: selection.item.title || '(no title)';

	// Region has no duplicate action; the others share one button.
	const onDuplicate =
		selection.kind === 'object'
			? onObjectDuplicate
			: selection.kind === 'label'
			? onLabelDuplicate
			: selection.kind === 'area'
			? onAreaDuplicate
			: null;

	async function handleSave() {
		setSaving( true );
		try {
			switch ( selection.kind ) {
				case 'object':
					if ( objFormData ) {
						const data = await onObjectSave(
							collectObjectPayload( objFormData )
						);
						if ( data?.title )
							setObjFormData( ( prev ) =>
								prev ? { ...prev, title: data.title } : prev
							);
					}
					break;
				case 'label':
					if ( labelFormData ) {
						const data = await onLabelSave(
							collectLabelPayload( labelFormData )
						);
						if ( data )
							setLabelFormData(
								defaultLabelFormData( data, null, null )
							);
					}
					break;
				case 'region':
					if ( regionFormData ) {
						const data = await onRegionSave( regionFormData );
						if ( data )
							setRegionFormData(
								defaultHierarchyFormData( data )
							);
					}
					break;
				case 'area':
					if ( areaFormData ) await onAreaSave( areaFormData );
					break;
			}
			createSuccessNotice( __( 'Saved.', 'clouds-and-spaceships' ), {
				type: 'snackbar',
			} );
		} catch ( err ) {
			createErrorNotice(
				( err as Error ).message ||
					__( 'Save failed.', 'clouds-and-spaceships' ),
				{ type: 'snackbar' }
			);
		} finally {
			setSaving( false );
		}
	}

	async function handleDelete() {
		switch ( selection.kind ) {
			case 'object':
				if ( ! confirm( 'Delete this object?' ) ) return;
				await onObjectDelete();
				break;
			case 'label':
				if ( ! confirm( 'Delete this label?' ) ) return;
				await onLabelDelete();
				break;
			case 'region':
				if ( ! confirm( 'Delete this hierarchy region?' ) ) return;
				await onRegionDelete();
				break;
			case 'area':
				if ( ! confirm( 'Delete this area?' ) ) return;
				await onAreaDelete();
				break;
		}
	}

	function handleClose() {
		switch ( selection.kind ) {
			case 'object':
				onObjectClose();
				break;
			case 'label':
				onLabelClose();
				break;
			case 'region':
				onRegionClose();
				break;
			case 'area':
				onAreaClose();
				break;
		}
	}

	return (
		<aside
			className="cns-map-editor__context"
			aria-label="Context panel"
			id="cns-context-form"
		>
			<div className="cns-map-editor__context-header">
				<Flex align="center" justify="space-between">
					<FlexBlock className="cns-map-editor__context-title">
						<h3>{ title }</h3>
					</FlexBlock>
					<FlexItem>
						<Flex
							gap={ 2 }
							align="center"
							className="cns-map-editor__context-title-actions"
						>
							{ onDuplicate && (
								<Button
									size="small"
									icon={ copy }
									label={ __( 'Duplicate', 'clouds-and-spaceships' ) }
									onClick={ onDuplicate }
								/>
							) }
							<Button
								size="small"
								icon={ close }
								label={ __( 'Close', 'clouds-and-spaceships' ) }
								onClick={ handleClose }
							/>
						</Flex>
					</FlexItem>
				</Flex>
			</div>

			<div className="cns-map-editor__context-body">
				{ selection.kind === 'object' && objFormData && (
					<ObjectForm
						formData={ objFormData }
						onChange={ ( fd ) => {
							setObjFormData( fd );
							// Live preview, as for labels below: mirror the
							// form onto the in-memory object so the canvas
							// repaints as you edit (Save persists it).
							if ( ! selectedObject ) {
								return;
							}
							const isSvg = fd.icon_source !== 'image';
							const iconId = isSvg
								? fd.icon_image_id_svg || 0
								: fd.icon_image_id_custom || 0;
							onObjectLocalUpdate( selectedObject.id, {
								title: fd.title,
								type: fd.type,
								x: fd.x,
								y: fd.y,
								object_time: fd.object_time,
								icon_image_id: iconId || null,
								// The canvas draws from the URL, not the ID, so
								// a newly picked icon needs one straight away.
								// The library holds only SVGs; a custom image
								// clears the mime so it takes the bitmap path.
								icon_url: isSvg
									? icons.find( ( i ) => i.id === iconId )
											?.url ?? ''
									: fd.icon_image_url,
								icon_mime: isSvg ? 'image/svg+xml' : '',
								infobox_source: fd.infobox_source,
								linked_post_id: fd.linked_post_id,
								infobox_data: {
									title: fd.infobox_title,
									description: fd.infobox_description,
									image_id: fd.infobox_image_id,
								},
								canvas_styles:
									objectCanvasStylesFromForm( fd ),
							} );
						} }
						icons={ icons }
					/>
				) }
				{ selection.kind === 'label' && labelFormData && (
					<LabelForm
						formData={ labelFormData }
						onChange={ ( fd ) => {
							setLabelFormData( fd );
							// Live preview: mirror every form change onto
							// the in-memory label so the canvas updates
							// immediately (Save persists it).
							if ( selectedLabel ) {
								onLabelLocalUpdate( selectedLabel.id, {
									text: fd.text,
									placement: fd.placement,
									x: fd.x,
									y: fd.y,
									offset_x: fd.offset_x,
									offset_y: fd.offset_y,
									infobox_source: fd.infobox_source,
									linked_post_id: fd.linked_post_id,
									infobox_data: {
										title: fd.infobox_title,
										description: fd.infobox_description,
										image_id: fd.infobox_image_id,
									},
									canvas_styles: {
										bgColor: fd.style_bg,
										borderColor: fd.style_border,
										textColor: fd.style_text_color,
										fontSize: fd.style_font_size,
									},
								} );
							}
						} }
					/>
				) }
				{ selection.kind === 'area' && areaFormData && (
					<>
						<AreaForm
							formData={ areaFormData }
							onChange={ ( fd ) => {
								setAreaFormData( fd );
								// shape_type is deliberately absent — it goes
								// through onShapeTypeChange, which normalizes
								// the nodes for the new shape.
								if ( ! selectedArea ) {
									return;
								}
								onAreaLocalUpdate( selectedArea.id, {
									title: fd.title,
									type: fd.type,
									object_time: fd.object_time,
									infobox_source: fd.infobox_source,
									linked_post_id: fd.linked_post_id,
									infobox_data: {
										title: fd.infobox_title,
										description: fd.infobox_description,
										image_id: fd.infobox_image_id,
									},
									canvas_styles: {
										fill: fd.style_fill,
										stroke: fd.style_stroke,
										strokeWidth: fd.style_stroke_width,
										labelHidden: fd.style_label_hidden,
										labelFontFamily:
											fd.style_label_font_family,
										labelFontSize: fd.style_label_font_size,
										labelColor: fd.style_label_color,
									},
								} );
							} }
							onShapeTypeChange={ ( st ) => {
								if ( selectedArea )
									onAreaShapeTypeChange?.(
										selectedArea.id,
										st
									);
								setAreaFormData( ( prev ) =>
									prev ? { ...prev, shape_type: st } : prev
								);
							} }
						/>
						{ selectedArea && (
							<NodeList
								area={ selectedArea }
								onNodesChange={ ( nodes ) =>
									onAreaNodesUpdate?.(
										selectedArea.id,
										nodes
									)
								}
							/>
						) }
					</>
				) }
				{ selection.kind === 'region' && regionFormData && (
					<>
						<HierarchyRegionForm
							formData={ regionFormData }
							region={ selectedRegion }
							onChange={ ( fd ) => {
								setRegionFormData( fd );
								// As for areas: shape_type stays with
								// onShapeTypeChange so nodes get normalized.
								if ( ! selectedRegion ) {
									return;
								}
								onRegionLocalUpdate( selectedRegion.id, {
									child_map_id: fd.child_map_id,
									// regionLabelText falls back to this, so
									// picking another child map relabels the
									// shape right away.
									child_map_title: fd.child_map_label,
									title_override: fd.title_override,
									description_override:
										fd.description_override,
									canvas_styles: {
										fill: fd.style_fill,
										stroke: fd.style_stroke,
										strokeWidth: fd.style_stroke_width,
										labelHidden: fd.style_label_hidden,
										labelFontFamily:
											fd.style_label_font_family,
										labelFontSize: fd.style_label_font_size,
										labelColor: fd.style_label_color,
										tipBgColor: fd.style_tip_bg,
										tipBorderColor: fd.style_tip_border,
										tipTextColor: fd.style_tip_text,
									},
								} );
							} }
							onShapeTypeChange={ ( st ) => {
								if ( selectedRegion )
									onRegionShapeTypeChange?.(
										selectedRegion.id,
										st
									);
								setRegionFormData( ( prev ) =>
									prev ? { ...prev, shape_type: st } : prev
								);
							} }
						/>
						{ selectedRegion && (
							<RegionNodeList
								region={ selectedRegion }
								onNodesChange={ ( nodes ) =>
									onRegionNodesUpdate(
										selectedRegion.id,
										nodes
									)
								}
							/>
						) }
					</>
				) }
			</div>
			<Flex
				className="cns-map-editor__context-footer"
				justify="end"
				align="center"
				gap={ 2 }
			>
				<Button
					variant="primary"
					isBusy={ saving }
					disabled={ saving }
					onClick={ handleSave }
				>
					{ __( 'Save', 'clouds-and-spaceships' ) }
				</Button>
				<Button
					variant="secondary"
					isDestructive
					onClick={ handleDelete }
				>
					{ __( 'Delete', 'clouds-and-spaceships' ) }
				</Button>
			</Flex>
		</aside>
	);
}
