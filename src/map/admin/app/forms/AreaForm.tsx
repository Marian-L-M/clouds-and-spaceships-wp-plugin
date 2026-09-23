import {
	SelectControl,
	TextControl,
	ToggleControl,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import ColorField from '../../../../shared/admin/ColorField';
import { LABEL_FONTS } from '../shared/labelFonts';
import InfoboxSection, { infoboxFormDefaults } from './shared/InfoboxSection';
import {
	AREA_TYPES,
	AREA_TYPE_DEFAULT,
	SHAPE_TYPES,
	SHAPE_TYPE_DEFAULT,
} from '../../../choices';
import type {
	AreaFormData,
	AreaType,
	ShapeType,
	MapArea,
} from '../../../types';

interface Props {
	formData: AreaFormData;
	onChange: ( formData: AreaFormData ) => void;
	onShapeTypeChange: ( shapeType: ShapeType ) => void;
}

export default function AreaForm( {
	formData,
	onChange,
	onShapeTypeChange,
}: Props ) {
	function set< K extends keyof AreaFormData >(
		key: K,
		val: AreaFormData[ K ]
	) {
		onChange( { ...formData, [ key ]: val } );
	}

	function handleShapeChange( value: string ) {
		const st = value as ShapeType;
		set( 'shape_type', st );
		onShapeTypeChange?.( st );
	}

	return (
		<>
			<section className="cns-modal-section">
				<h3>{ __( 'Details', 'clouds-and-spaceships' ) }</h3>
				<div className="cns-grid cns-grid__12">
					<div className="cns-grid__group cns-grid__span-full">
						<TextControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __( 'Title', 'clouds-and-spaceships' ) }
							value={ formData.title }
							onChange={ ( v ) => set( 'title', v ) }
						/>
					</div>
					<div className="cns-grid__group">
						<SelectControl
							label={ __( 'Type', 'clouds-and-spaceships' ) }
							value={ formData.type }
							options={ AREA_TYPES }
							onChange={ ( v ) => set( 'type', v as AreaType ) }
						/>
					</div>
					<div className="cns-grid__group">
						<SelectControl
							label={ __( 'Shape', 'clouds-and-spaceships' ) }
							value={ formData.shape_type }
							options={ SHAPE_TYPES }
							onChange={ handleShapeChange }
						/>
					</div>
					{ /* Oops you found a placeholder for a future functionality. Please keep it commented out. */ }
					{ /* <div className="cns-grid__group">
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
					</div> */ }
				</div>
			</section>

			<InfoboxSection formData={ formData } onChange={ onChange } />

			<section className="cns-modal-section">
				<h3>{ __( 'Design', 'clouds-and-spaceships' ) }</h3>
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
					<div className="cns-grid__group">
						<NumberControl
							__next40pxDefaultSize
							label={ __(
								'Stroke Width (px)',
								'clouds-and-spaceships'
							) }
							min={ 1 }
							max={ 10 }
							step={ 1 }
							value={ formData.style_stroke_width }
							onChange={ ( v ) =>
								set(
									'style_stroke_width',
									parseInt( v ?? '', 10 ) || 2
								)
							}
						/>
					</div>
				</div>

				<h4>{ __( 'Label', 'clouds-and-spaceships' ) }</h4>
				<p className="description">
					{ __(
						'The canvas label uses the Infobox title, falling back to the area’s own title.',
						'clouds-and-spaceships'
					) }
				</p>
				<div className="cns-grid cns-grid__12">
					<div className="cns-grid__group cns-grid__span-full">
						<ToggleControl
							__nextHasNoMarginBottom
							label={ __(
								'Hide label on canvas',
								'clouds-and-spaceships'
							) }
							checked={ formData.style_label_hidden }
							onChange={ ( v ) => set( 'style_label_hidden', v ) }
						/>
					</div>
					<div className="cns-grid__group">
						<SelectControl
							__next40pxDefaultSize
							__nextHasNoMarginBottom
							label={ __(
								'Font Family',
								'clouds-and-spaceships'
							) }
							value={ formData.style_label_font_family }
							options={ LABEL_FONTS }
							onChange={ ( v ) =>
								set( 'style_label_font_family', v )
							}
						/>
					</div>
					<div className="cns-grid__group">
						<NumberControl
							__next40pxDefaultSize
							label={ __(
								'Font Size (px)',
								'clouds-and-spaceships'
							) }
							min={ 6 }
							max={ 96 }
							step={ 1 }
							value={ formData.style_label_font_size }
							onChange={ ( v ) =>
								set(
									'style_label_font_size',
									parseInt( v ?? '', 10 ) || 12
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
							value={ formData.style_label_color }
							onChange={ ( v ) => set( 'style_label_color', v ) }
						/>
					</div>
				</div>
			</section>
		</>
	);
}

export function defaultAreaFormData( area?: MapArea ): AreaFormData {
	const styles = area?.canvas_styles || {};
	return {
		title: area?.title || '',
		type: ( area?.type as AreaType | undefined ) || AREA_TYPE_DEFAULT,
		shape_type: area?.shape_type || SHAPE_TYPE_DEFAULT,
		object_time: area?.object_time ?? 0,
		...infoboxFormDefaults( area ?? null ),
		style_fill: styles.fill || '#2271b14d',
		style_stroke: styles.stroke || '#2271b1',
		style_stroke_width: styles.strokeWidth || 2,
		style_label_hidden: styles.labelHidden ?? false,
		style_label_font_family: styles.labelFontFamily || 'sans-serif',
		style_label_font_size: styles.labelFontSize || 12,
		style_label_color: styles.labelColor || '#ffffff',
	};
}
