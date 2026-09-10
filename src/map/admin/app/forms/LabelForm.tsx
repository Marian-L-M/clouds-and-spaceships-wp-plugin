import {
	RadioControl,
	RangeControl,
	TextControl,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import ColorField from '../../../../shared/admin/ColorField';
import InfoboxSection, { infoboxFormDefaults } from './shared/InfoboxSection';
import type { LabelFormData, LabelSavePayload, LabelPlacement, MapLabel } from '../../../types';

interface Props {
	formData: LabelFormData;
	onChange: ( formData: LabelFormData ) => void;
}

export default function LabelForm( { formData, onChange }: Props ) {
	function set<K extends keyof LabelFormData>( key: K, val: LabelFormData[ K ] ) {
		onChange( { ...formData, [ key ]: val } );
	}

	const isIndicator = formData.placement === 'indicator';

	return (
		<>
			{ /* ── Text ── */ }
			<section className="cns-modal-section">
				<h3>{ __( 'Label', 'clouds-and-spaceships' ) }</h3>
				<div className="cns-grid cns-grid__12">
					<div className="cns-grid__group cns-grid__span-full">
						<TextControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Text', 'clouds-and-spaceships' ) }
							value={ formData.text }
							onChange={ ( v ) => set( 'text', v ) }
						/>
					</div>
					<div className="cns-grid__group">
						<NumberControl
							__next40pxDefaultSize
							label={ __( 'Label Time', 'clouds-and-spaceships' ) }
							value={ formData.object_time }
							step={ 1 }
							onChange={ ( v ) =>
								set( 'object_time', parseInt( v ?? '', 10 ) || 0 )
							}
						/>
					</div>
				</div>
			</section>

			{ /* ── Placement ── */ }
			<section className="cns-modal-section">
				<h3>{ __( 'Placement', 'clouds-and-spaceships' ) }</h3>
				<div className="cns-grid cns-grid__12">
					<div className="cns-grid__group cns-grid__span-full">
						<RadioControl
							label={ __( 'Placement mode', 'clouds-and-spaceships' ) }
							hideLabelFromVision
							selected={ isIndicator ? 'indicator' : 'centered' }
							options={ [
								{ label: __( 'Centered on point', 'clouds-and-spaceships' ), value: 'centered' },
								{ label: __( 'Indicator (line & dot)', 'clouds-and-spaceships' ), value: 'indicator' },
							] }
							onChange={ ( v ) => set( 'placement', v as LabelPlacement ) }
						/>
					</div>
					<div className="cns-grid__group">
						<NumberControl
							__next40pxDefaultSize
							label={ __( 'X (px)', 'clouds-and-spaceships' ) }
							value={ formData.x }
							step={ 1 }
							onChange={ ( v ) => set( 'x', parseInt( v ?? '', 10 ) || 0 ) }
						/>
					</div>
					<div className="cns-grid__group">
						<NumberControl
							__next40pxDefaultSize
							label={ __( 'Y (px)', 'clouds-and-spaceships' ) }
							value={ formData.y }
							step={ 1 }
							onChange={ ( v ) => set( 'y', parseInt( v ?? '', 10 ) || 0 ) }
						/>
					</div>
					{ isIndicator && (
						<>
							<div className="cns-grid__group">
								<NumberControl
									__next40pxDefaultSize
									label={ __( 'Label Offset X (px)', 'clouds-and-spaceships' ) }
									value={ formData.offset_x }
									step={ 1 }
									onChange={ ( v ) =>
										set( 'offset_x', parseInt( v ?? '', 10 ) || 0 )
									}
								/>
							</div>
							<div className="cns-grid__group">
								<NumberControl
									__next40pxDefaultSize
									label={ __( 'Label Offset Y (px)', 'clouds-and-spaceships' ) }
									value={ formData.offset_y }
									step={ 1 }
									onChange={ ( v ) =>
										set( 'offset_y', parseInt( v ?? '', 10 ) || 0 )
									}
								/>
							</div>
						</>
					) }
				</div>
				{ isIndicator && (
					<p className="description">
						{ __(
							'The dot marks the X/Y point; the label box sits at the offset, connected by a line.',
							'clouds-and-spaceships'
						) }
					</p>
				) }
			</section>

			{ /* ── Infobox ── */ }
			<InfoboxSection formData={ formData } onChange={ onChange } />
			<p className="description">
				{ __(
					'Labels with infobox content open the infobox drawer when clicked on the map; labels without stay purely decorative.',
					'clouds-and-spaceships'
				) }
			</p>

			{ /* ── Design ── */ }
			<section className="cns-modal-section">
				<h3>{ __( 'Design', 'clouds-and-spaceships' ) }</h3>
				<div className="cns-grid cns-grid__12">
					<div className="cns-grid__group cns-grid__span-full">
						<RangeControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Font Size (px)', 'clouds-and-spaceships' ) }
							min={ 8 } max={ 64 } step={ 1 }
							value={ formData.style_font_size }
							onChange={ ( v ) => set( 'style_font_size', v ?? 14 ) }
						/>
					</div>
					<div className="cns-grid__group">
						<ColorField
							label={ __( 'Background Color', 'clouds-and-spaceships' ) }
							value={ formData.style_bg }
							onChange={ ( v ) => set( 'style_bg', v ) }
						/>
					</div>
					<div className="cns-grid__group">
						<ColorField
							label={ __( 'Border Color', 'clouds-and-spaceships' ) }
							value={ formData.style_border }
							onChange={ ( v ) => set( 'style_border', v ) }
						/>
					</div>
					<div className="cns-grid__group">
						<ColorField
							label={ __( 'Text Color', 'clouds-and-spaceships' ) }
							value={ formData.style_text_color }
							onChange={ ( v ) => set( 'style_text_color', v ) }
						/>
					</div>
				</div>
			</section>
		</>
	);
}

export function defaultLabelFormData(
	label: MapLabel | null,
	x: number | null,
	y: number | null,
): LabelFormData {
	return {
		text:                label?.text      || '',
		placement:           label?.placement || 'centered',
		x:                   label ? label.x : ( x ?? 0 ),
		y:                   label ? label.y : ( y ?? 0 ),
		offset_x:            label?.offset_x ?? 40,
		offset_y:            label?.offset_y ?? -40,
		object_time:         label?.object_time ?? 0,
		...infoboxFormDefaults( label ),
		style_bg:            label?.canvas_styles?.bgColor     || '#ffffff',
		style_border:        label?.canvas_styles?.borderColor || '#1e1e1e',
		style_text_color:    label?.canvas_styles?.textColor   || '#1e1e1e',
		style_font_size:     label?.canvas_styles?.fontSize    || 14,
	};
}

export function collectLabelPayload( formData: LabelFormData ): LabelSavePayload {
	const { infobox_image_url, linked_post_label, ...payload } = formData;
	return payload;
}
