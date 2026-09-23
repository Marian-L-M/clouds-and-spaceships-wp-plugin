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
import { LABEL_FONTS } from '../shared/labelFonts';
import {
	OBJECT_DISPLAY_MODES,
	OBJECT_DISPLAY_MODE_DEFAULT,
	OBJECT_TYPES,
	OBJECT_TYPE_DEFAULT,
} from '../../../choices';
import type {
	ObjectCanvasStyles,
	ObjectDisplayMode,
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
	const isIconMode = formData.display_mode === 'icon';
	const isTextMode = formData.display_mode === 'text';

	return (
		<>
			{ /* ── Display mode ── */ }
			<section className="cns-modal-section">
				<h3>{ __( 'Display Settings', 'clouds-and-spaceships' ) }</h3>
				<div className="cns-grid">
					<div className="cns-grid__row">
						<RadioControl
							label={ __( 'Mode', 'clouds-and-spaceships' ) }
							selected={ formData.display_mode }
							options={ OBJECT_DISPLAY_MODES }
							onChange={ ( v ) =>
								set( 'display_mode', v as ObjectDisplayMode )
							}
						/>
						<p className="description">
							{ isTextMode
								? __(
										'Text mode draws the object title on a rectangular backdrop.',
										'clouds-and-spaceships'
								  )
								: isIconMode
								? __(
										'Icon mode draws the icon on a round background.',
										'clouds-and-spaceships'
								  )
								: __(
										'Shape modes draw a filled shape at the object position.',
										'clouds-and-spaceships'
								  ) }
						</p>
					</div>
				</div>
			</section>

			{ /* ── Icon ── */ }
			{ isIconMode && (
				<section className="cns-modal-section">
					<h3>{ __( 'Icon', 'clouds-and-spaceships' ) }</h3>
					<div className="cns-grid">
						<div className="cns-grid__row">
							<RadioControl
								label={ __(
									'Icon source',
									'clouds-and-spaceships'
								) }
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
									selectedIconId={
										formData.icon_image_id_svg
									}
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
											icon_image_id_custom: att
												? att.id
												: 0,
											icon_image_url: att ? att.url : '',
										} )
									}
								/>
							</div>
						) }
					</div>
				</section>
			) }

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
							label={ __(
								'Object Time',
								'clouds-and-spaceships'
							) }
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
							label={
								isIconMode
									? __(
											'Icon Size (px)',
											'clouds-and-spaceships'
									  )
									: __( 'Size (px)', 'clouds-and-spaceships' )
							}
							min={ 8 }
							max={ 128 }
							step={ 1 }
							value={ formData.style_size }
							onChange={ ( v ) => set( 'style_size', v ?? 32 ) }
						/>
					</div>
					<div className="cns-grid__group">
						<ColorField
							label={ __(
								'Background Color',
								'clouds-and-spaceships'
							) }
							value={ formData.style_bg }
							onChange={ ( v ) => set( 'style_bg', v ) }
						/>
					</div>
					<div className="cns-grid__group">
						<RangeControl
							label={ __(
								'Border Thickness (px)',
								'clouds-and-spaceships'
							) }
							min={ 0 }
							max={ 10 }
							step={ 0.5 }
							withInputField
							value={ formData.style_border_width }
							onChange={ ( v ) =>
								set( 'style_border_width', v ?? 0 )
							}
						/>
					</div>
					<div className="cns-grid__group">
						<ColorField
							label={ __(
								'Border Color',
								'clouds-and-spaceships'
							) }
							value={ formData.style_border_color }
							onChange={ ( v ) => set( 'style_border_color', v ) }
						/>
					</div>
				</div>
				<p className="description">
					{ isIconMode
						? __(
								'The background fills the round shape behind the icon.',
								'clouds-and-spaceships'
						  )
						: isTextMode
						? __(
								'The background fills the rectangle behind the text.',
								'clouds-and-spaceships'
						  )
						: __(
								'The background fills the shape itself.',
								'clouds-and-spaceships'
						  ) }
				</p>
			</section>

			{ /* ── Text ── */ }
			{ isTextMode && (
				<section className="cns-modal-section">
					<h3>{ __( 'Text', 'clouds-and-spaceships' ) }</h3>
					<div className="cns-grid cns-grid__12">
						<div className="cns-grid__group">
							<SelectControl
								label={ __(
									'Font Family',
									'clouds-and-spaceships'
								) }
								value={ formData.style_font_family }
								options={ LABEL_FONTS }
								onChange={ ( v ) =>
									set( 'style_font_family', v )
								}
							/>
						</div>
						<div className="cns-grid__group">
							<NumberControl
								label={ __(
									'Font Size (px)',
									'clouds-and-spaceships'
								) }
								min={ 6 }
								max={ 96 }
								step={ 1 }
								value={ formData.style_font_size }
								onChange={ ( v ) =>
									set(
										'style_font_size',
										parseInt( v ?? '', 10 ) || 14
									)
								}
							/>
						</div>
						<div className="cns-grid__group">
							<ColorField
								label={ __(
									'Font Color',
									'clouds-and-spaceships'
								) }
								value={ formData.style_text_color }
								onChange={ ( v ) =>
									set( 'style_text_color', v )
								}
							/>
						</div>
					</div>
					<p className="description">
						{ __(
							'Text mode draws the object title above.',
							'clouds-and-spaceships'
						) }
					</p>
				</section>
			) }

			{ /* ── Icon colors ── */ }
			{ isIconMode && (
				<section className="cns-modal-section">
					<h3>{ __( 'Icon Colors', 'clouds-and-spaceships' ) }</h3>
					<div className="cns-grid cns-grid__12">
						<div className="cns-grid__group">
							<ColorField
								label={ __(
									'Fill Color',
									'clouds-and-spaceships'
								) }
								value={ formData.style_fill }
								onChange={ ( v ) => set( 'style_fill', v ) }
							/>
						</div>
						<div className="cns-grid__group">
							<ColorField
								label={ __(
									'Stroke Color',
									'clouds-and-spaceships'
								) }
								value={ formData.style_stroke }
								onChange={ ( v ) => set( 'style_stroke', v ) }
							/>
						</div>
					</div>
					<p className="description">
						{ __(
							'Fill and stroke recolor the icon artwork, and apply to SVG icons only.',
							'clouds-and-spaceships'
						) }
					</p>
				</section>
			) }
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
	const styles = obj?.canvas_styles;
	return {
		display_mode: styles?.displayMode || OBJECT_DISPLAY_MODE_DEFAULT,
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
		style_size: styles?.size || 32,
		style_fill: styles?.fillStyle || '#ffffff',
		style_stroke: styles?.strokeStyle || '#2271b1',
		style_bg: styles?.bgColor || '#2271b1',
		style_border_color: styles?.borderColor || '#1e1e1e',
		style_border_width: styles?.borderWidth ?? 0,
		style_font_family: styles?.textFontFamily || 'sans-serif',
		style_font_size: styles?.textFontSize || 14,
		style_text_color: styles?.textColor || '#ffffff',
	};
}

/**
 * The form's styling as the canvas reads it — the inverse of the style half of
 * defaultObjectFormData. The context panel mirrors this onto the in-memory
 * object so edits preview immediately, which is also why it lives beside the
 * form: a style field added to one side has to appear on the other.
 */
export function objectCanvasStylesFromForm(
	formData: ObjectFormData
): ObjectCanvasStyles {
	return {
		displayMode: formData.display_mode || OBJECT_DISPLAY_MODE_DEFAULT,
		size: formData.style_size || 32,
		fillStyle: formData.style_fill || '#ffffff',
		strokeStyle: formData.style_stroke || '#2271b1',
		bgColor: formData.style_bg || '#2271b1',
		borderColor: formData.style_border_color || '#1e1e1e',
		borderWidth: formData.style_border_width ?? 0,
		textFontFamily: formData.style_font_family || 'sans-serif',
		textFontSize: formData.style_font_size || 14,
		textColor: formData.style_text_color || '#ffffff',
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
		display_mode: formData.display_mode || OBJECT_DISPLAY_MODE_DEFAULT,
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
		style_bg: formData.style_bg || '#2271b1',
		style_border_color: formData.style_border_color || '#1e1e1e',
		style_border_width: formData.style_border_width ?? 0,
		style_font_family: formData.style_font_family || 'sans-serif',
		style_font_size: formData.style_font_size || 14,
		style_text_color: formData.style_text_color || '#ffffff',
	};
}
