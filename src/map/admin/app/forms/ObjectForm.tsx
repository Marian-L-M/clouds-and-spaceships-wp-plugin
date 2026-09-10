import {
	ExternalLink,
	RadioControl,
	RangeControl,
	SelectControl,
	TextControl,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import MediaPicker from '../shared/MediaPicker';
import IconPicker from '../shared/IconPicker';
import ColorField from '../../../../shared/admin/ColorField';
import InfoboxSection, { infoboxFormDefaults } from './shared/InfoboxSection';
import { OBJECT_TYPES, OBJECT_TYPE_DEFAULT } from '../../../choices';
import type {
	ObjectFormData,
	ObjectSavePayload,
	ObjectType,
	LibraryIcon,
	MapObject,
} from '../../../types';

interface Props {
	formData: ObjectFormData;
	onChange: ( formData: ObjectFormData ) => void;
	icons: LibraryIcon[];
}

const ICON_OPTIONS = [
	{
		label: __( 'From library', 'clouds-and-spaceships' ),
		value: 'svg',
	},
	{
		label: __( 'Custom image', 'clouds-and-spaceships' ),
		value: 'image',
	},
];

export default function ObjectForm( { formData, onChange, icons }: Props ) {
	function set< K extends keyof ObjectFormData >(
		key: K,
		val: ObjectFormData[ K ]
	) {
		onChange( { ...formData, [ key ]: val } );
	}

	const isSvgSource = formData.icon_source !== 'image';

	return (
		<>
			{ /* ── Icon ── */ }
			<section className="cns-modal-section">
				<h3>{ __( 'Icon', 'clouds-and-spaceships' ) }</h3>
				<div className="cns-grid">
					<div className="cns-grid__row">
						<RadioControl
							label={ __( 'Icon source', 'clouds-and-spaceships' ) }
							hideLabelFromVision
							selected={ isSvgSource ? 'svg' : 'image' }
							options={ ICON_OPTIONS }
							onChange={ ( v ) =>
								set( 'icon_source', v as 'svg' | 'image' )
							}
						/>
					</div>
					{ isSvgSource && (
						<div className="cns-grid__row cns__fx-col">
							<IconPicker
								icons={ icons }
								selectedIconId={ formData.icon_image_id_svg }
								onSelect={ ( id ) =>
									set( 'icon_image_id_svg', id )
								}
							/>
							<p className="description">
								<ExternalLink
									href={ window.cnsMapSuite.iconsUrl }
								>
									{ __(
										'Manage icon library',
										'clouds-and-spaceships'
									) }
								</ExternalLink>
							</p>
						</div>
					) }
					{ ! isSvgSource && (
						<div className="cns-grid__row">
							<MediaPicker
								imageId={ formData.icon_image_id_custom }
								imageUrl={ formData.icon_image_url }
								title={ __(
									'Select Icon Image',
									'clouds-and-spaceships'
								) }
								onChange={ ( att ) =>
									onChange( {
										...formData,
										icon_image_id_custom: att ? att.id : 0,
										icon_image_url: att ? att.url : '',
									} )
								}
							/>
						</div>
					) }
				</div>
			</section>

			{ /* ── Details ── */ }
			<section className="cns-modal-section">
				<h3>{ __( 'Details', 'clouds-and-spaceships' ) }</h3>
				<div className="cns-grid cns-grid__12">
					<div className="cns-grid__row">
						<TextControl
							__next40pxDefaultSize
							label={ __( 'Title', 'clouds-and-spaceships' ) }
							value={ formData.title }
							onChange={ ( v ) => set( 'title', v ) }
						/>
					</div>
					<div className="cns-grid__group">
						<SelectControl
							label={ __( 'Type', 'clouds-and-spaceships' ) }
							value={ formData.type }
							options={ OBJECT_TYPES }
							onChange={ ( v ) => set( 'type', v as ObjectType ) }
						/>
					</div>
					<div className="cns-grid__group">
						<NumberControl
							__next40pxDefaultSize
							label={ __( 'Object Time', 'clouds-and-spaceships' ) }
							value={ formData.object_time }
							step={ 1 }
							onChange={ ( v ) =>
								set(
									'object_time',
									parseInt( v ?? '', 10 ) || 0
								)
							}
						/>
					</div>
					<div className="cns-grid__group">
						<NumberControl
							__next40pxDefaultSize
							label={ __( 'X (px)', 'clouds-and-spaceships' ) }
							value={ formData.x }
							step={ 1 }
							onChange={ ( v ) =>
								set( 'x', parseInt( v ?? '', 10 ) || 0 )
							}
						/>
					</div>
					<div className="cns-grid__group">
						<NumberControl
							__next40pxDefaultSize
							label={ __( 'Y (px)', 'clouds-and-spaceships' ) }
							value={ formData.y }
							step={ 1 }
							onChange={ ( v ) =>
								set( 'y', parseInt( v ?? '', 10 ) || 0 )
							}
						/>
					</div>
				</div>
			</section>

			{ /* ── Infobox ── */ }
			<InfoboxSection formData={ formData } onChange={ onChange } />

			{ /* ── Design ── */ }
			<section className="cns-modal-section">
				<h3>{ __( 'Design', 'clouds-and-spaceships' ) }</h3>
				<div className="cns-grid cns-grid__12">
					<div className="cns-grid__group cns-grid__span-full">
						<RangeControl
							__next40pxDefaultSize
							label={ __( 'Icon Size (px)', 'clouds-and-spaceships' ) }
							min={ 8 }
							max={ 128 }
							step={ 1 }
							value={ formData.style_size }
							onChange={ ( v ) => set( 'style_size', v ?? 32 ) }
						/>
					</div>
					<div className="cns-grid__group">
						<ColorField
							label={ __( 'Fill Color', 'clouds-and-spaceships' ) }
							value={ formData.style_fill }
							onChange={ ( v ) => set( 'style_fill', v ) }
						/>
					</div>
					<div className="cns-grid__group">
						<ColorField
							label={ __( 'Stroke Color', 'clouds-and-spaceships' ) }
							value={ formData.style_stroke }
							onChange={ ( v ) => set( 'style_stroke', v ) }
						/>
					</div>
				</div>
				<p className="description">
					{ __(
						'Fill and stroke are applied to SVG icons only.',
						'clouds-and-spaceships'
					) }
				</p>
			</section>
		</>
	);
}

export function defaultObjectFormData(
	obj: MapObject | null,
	x: number | null,
	y: number | null
): ObjectFormData {
	const isSvg =
		! obj || ! obj.icon_image_id || obj.icon_mime === 'image/svg+xml';
	return {
		icon_source: isSvg ? 'svg' : 'image',
		icon_image_id_svg:
			isSvg && obj?.icon_image_id ? obj.icon_image_id : null,
		icon_image_id_custom:
			! isSvg && obj?.icon_image_id ? obj.icon_image_id : 0,
		icon_image_url: obj?.icon_url && ! isSvg ? obj.icon_url : '',
		title: obj?.title || '',
		type: obj?.type || OBJECT_TYPE_DEFAULT,
		object_time: obj?.object_time ?? 0,
		x: obj ? obj.x : x ?? 0,
		y: obj ? obj.y : y ?? 0,
		...infoboxFormDefaults( obj ),
		style_size: obj?.canvas_styles?.size || 32,
		style_fill: obj?.canvas_styles?.fillStyle || '#ffffff',
		style_stroke: obj?.canvas_styles?.strokeStyle || '#2271b1',
	};
}

export function collectObjectPayload(
	formData: ObjectFormData
): ObjectSavePayload {
	const iconImageId =
		formData.icon_source === 'svg'
			? formData.icon_image_id_svg || 0
			: formData.icon_image_id_custom || 0;
	return {
		icon_image_id: iconImageId,
		title: formData.title || '',
		type: formData.type || OBJECT_TYPE_DEFAULT,
		x: formData.x || 0,
		y: formData.y || 0,
		object_time: formData.object_time || 0,
		infobox_source: formData.infobox_source || 'manual',
		linked_post_id: formData.linked_post_id || 0,
		infobox_title: formData.infobox_title || '',
		infobox_description: formData.infobox_description || '',
		infobox_image_id: formData.infobox_image_id || 0,
		display_infobox: formData.display_infobox,
		show_title: formData.show_title,
		show_excerpt: formData.show_excerpt,
		show_thumbnail: formData.show_thumbnail,
		style_size: formData.style_size || 32,
		style_fill: formData.style_fill || '#ffffff',
		style_stroke: formData.style_stroke || '#2271b1',
	};
}
