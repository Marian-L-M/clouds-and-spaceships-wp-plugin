import { __ } from '@wordpress/i18n';
import {
	InspectorControls,
	PanelColorSettings,
	useBlockProps,
} from '@wordpress/block-editor';
import {
	PanelBody,
	RangeControl,
	ToggleControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';

import './editor.scss';
import metadata from './block.json';

export default function Edit( { attributes, setAttributes } ) {
	const {
		groupBy,
		showEmptyNotice,
		titleFontSize,
		titleColor,
		itemFontSize,
		itemColor,
		columns,
	} = attributes;

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Glossary Index', 'clouds-and-spaceships' ) }>
					<ToggleGroupControl
						label={ __( 'Group entries by', 'clouds-and-spaceships' ) }
						value={ groupBy }
						isBlock
						onChange={ ( value ) =>
							setAttributes( { groupBy: value } )
						}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					>
						<ToggleGroupControlOption
							value="alphabetical"
							label={ __( 'A–Z', 'clouds-and-spaceships' ) }
						/>
						<ToggleGroupControlOption
							value="category"
							label={ __( 'Category', 'clouds-and-spaceships' ) }
						/>
					</ToggleGroupControl>
					<ToggleControl
						label={ __( 'Show notice when empty', 'clouds-and-spaceships' ) }
						checked={ showEmptyNotice }
						onChange={ ( value ) =>
							setAttributes( { showEmptyNotice: value } )
						}
						__nextHasNoMarginBottom
					/>
				</PanelBody>
				<PanelBody
					title={ __( 'Layout', 'clouds-and-spaceships' ) }
					initialOpen={ false }
				>
					<RangeControl
						label={ __( 'Entries per row', 'clouds-and-spaceships' ) }
						help={ __(
							'Leave empty to fit as many as the width allows. A set count drops to one column on narrow screens.',
							'clouds-and-spaceships'
						) }
						value={ columns }
						onChange={ ( value ) =>
							setAttributes( { columns: value } )
						}
						min={ 1 }
						max={ 6 }
						allowReset
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>
				<PanelBody
					title={ __( 'Typography', 'clouds-and-spaceships' ) }
					initialOpen={ false }
				>
					<RangeControl
						label={ __( 'Heading size (px)', 'clouds-and-spaceships' ) }
						help={ __(
							'Leave empty to use the theme’s own heading size.',
							'clouds-and-spaceships'
						) }
						value={ titleFontSize }
						onChange={ ( value ) =>
							setAttributes( { titleFontSize: value } )
						}
						min={ 10 }
						max={ 64 }
						allowReset
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
					<RangeControl
						label={ __( 'Entry size (px)', 'clouds-and-spaceships' ) }
						help={ __(
							'Leave empty to use the theme’s own body size.',
							'clouds-and-spaceships'
						) }
						value={ itemFontSize }
						onChange={ ( value ) =>
							setAttributes( { itemFontSize: value } )
						}
						min={ 10 }
						max={ 40 }
						allowReset
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</PanelBody>
				<PanelColorSettings
					title={ __( 'Color Settings', 'clouds-and-spaceships' ) }
					initialOpen={ false }
					colorSettings={ [
						{
							value: titleColor,
							onChange: ( value ) =>
								setAttributes( { titleColor: value } ),
							label: __(
								'Heading color',
								'clouds-and-spaceships'
							),
						},
						{
							value: itemColor,
							onChange: ( value ) =>
								setAttributes( { itemColor: value } ),
							label: __( 'Entry color', 'clouds-and-spaceships' ),
						},
					] }
				/>
			</InspectorControls>
			<div { ...useBlockProps() }>
				<ServerSideRender
					block={ metadata.name }
					attributes={ attributes }
				/>
			</div>
		</>
	);
}
