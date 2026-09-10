import { __ } from '@wordpress/i18n';
import { InspectorControls, useBlockProps } from '@wordpress/block-editor';
import {
	PanelBody,
	ToggleControl,
	__experimentalToggleGroupControl as ToggleGroupControl,
	__experimentalToggleGroupControlOption as ToggleGroupControlOption,
} from '@wordpress/components';
import ServerSideRender from '@wordpress/server-side-render';

import './editor.scss';
import metadata from './block.json';

export default function Edit( { attributes, setAttributes } ) {
	const { groupBy, showEmptyNotice } = attributes;

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
