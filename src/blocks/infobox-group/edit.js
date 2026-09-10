import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InnerBlocks,
	InspectorControls,
	PanelColorSettings,
} from '@wordpress/block-editor';
import {
	PanelBody,
	PanelRow,
	SelectControl,
	TextControl,
} from '@wordpress/components';
import './editor.scss';

export default function Edit( { attributes, setAttributes } ) {
	const { bg_color, text_color, contrast_color } = attributes;

	function updateGroupTitle( value ) {
		setAttributes( { group_title: value } );
	}
	const TEMPLATE = [ [ 'cns-wiki-suite/infobox-row', {} ] ];

	return (
		<div
			{ ...useBlockProps() }
			style={ { backgroundColor: bg_color, color: text_color } }
		>
			<InspectorControls>
				<PanelBody title="Infobox Group Settings" initialOpen={ true }>
					<PanelRow>
						<SelectControl
							label={ __( 'Display Mode', 'clouds-and-spaceships' ) }
							value={ attributes.display_mode }
							options={ [
								{ label: 'Inherit', value: 'inherit' },
								{
									label: 'Collapse Default',
									value: 'collapse-ibg__default',
								},
								{
									label: 'Collapse Mobile',
									value: 'collapse-ibg__mobile',
								},
								{
									label: 'Never Collapse',
									value: 'collapse-ibg__never',
								},
							] }
							onChange={ ( value ) =>
								setAttributes( { display_mode: value } )
							}
							__next40pxDefaultSize
						/>
					</PanelRow>
				</PanelBody>
				<PanelColorSettings
					title={ __( 'Color Settings', 'clouds-and-spaceships' ) }
					initialOpen={ false }
					colorSettings={ [
						{
							value: bg_color,
							onChange: ( value ) =>
								setAttributes( { bg_color: value } ),
							label: __( 'Background color', 'clouds-and-spaceships' ),
						},
						{
							value: text_color,
							onChange: ( value ) =>
								setAttributes( { text_color: value } ),
							label: __( 'Text color', 'clouds-and-spaceships' ),
						},
						{
							value: contrast_color,
							onChange: ( value ) =>
								setAttributes( { contrast_color: value } ),
							label: __( 'Contrast color', 'clouds-and-spaceships' ),
						},
					] }
				/>
			</InspectorControls>
			<div className="infobox-group__outer">
				<h3
					className="infobox-group__title"
					style={ { backgroundColor: contrast_color } }
				>
					<TextControl
						placeholder="Group title"
						value={ attributes.group_title }
						onChange={ updateGroupTitle }
						style={ { fontSize: '20px' } }
					/>
				</h3>
				<div className="infobox-group__inner">
					<InnerBlocks template={ TEMPLATE } />
				</div>
			</div>
		</div>
	);
}
