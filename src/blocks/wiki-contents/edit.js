import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	useInnerBlocksProps,
	store as blockEditorStore,
} from '@wordpress/block-editor';
import { useDispatch, useSelect } from '@wordpress/data';
import { createBlock } from '@wordpress/blocks';
import { useEffect } from '@wordpress/element';
import {
	PanelBody,
	RangeControl,
	RadioControl,
	TabPanel,
} from '@wordpress/components';
import './editor.scss';

const ALLOWED_BLOCKS = [ 'cns-wiki-suite/wiki-card' ];

// Site-wide grid defaults (CNS → Wiki tab), injected by PHP before this
// script. Grid attributes stay unset until the user touches them, so blocks
// without explicit values follow these settings — here and on the frontend.
const GRID_DEFAULTS = {
	columnsMobile: 1,
	columnsTablet: 2,
	columnsDesktop: 3,
	columnGap: 16,
	rowGap: 16,
	...( window.cnsWikiGridDefaults || {} ),
};

function GridTabs( { breakpoint, attributes, setAttributes } ) {
	const columnKey = `columns${ breakpoint }`;

	return (
		<RangeControl
			label={ __( 'Columns', 'clouds-and-spaceships' ) }
			value={ attributes[ columnKey ] ?? GRID_DEFAULTS[ columnKey ] }
			onChange={ ( v ) => setAttributes( { [ columnKey ]: v } ) }
			min={ 1 }
			max={ 6 }
			__nextHasNoMarginBottom
			__next40pxDefaultSize
		/>
	);
}

function NewestPreviewGrid( { columns, numberOfPosts, columnGap, rowGap } ) {
	return (
		<div
			className="wiki-contents__grid wiki-contents__grid--preview"
			style={ {
				'--wiki-columns-desktop': columns,
				'--wiki-column-gap': `${ columnGap }px`,
				'--wiki-row-gap': `${ rowGap }px`,
			} }
		>
			{ Array( numberOfPosts )
				.fill( null )
				.map( ( _, i ) => (
					<div key={ i } className="wiki-contents__placeholder-cell">
						<span className="wiki-contents__placeholder-label">
							{ __( 'Wiki', 'clouds-and-spaceships' ) } { i + 1 }
						</span>
					</div>
				) ) }
		</div>
	);
}

export default function Edit( { attributes, setAttributes, clientId } ) {
	const { mode, numberOfPosts } = attributes;
	const columnsMobile  = attributes.columnsMobile  ?? GRID_DEFAULTS.columnsMobile;
	const columnsTablet  = attributes.columnsTablet  ?? GRID_DEFAULTS.columnsTablet;
	const columnsDesktop = attributes.columnsDesktop ?? GRID_DEFAULTS.columnsDesktop;
	const columnGap      = attributes.columnGap      ?? GRID_DEFAULTS.columnGap;
	const rowGap         = attributes.rowGap         ?? GRID_DEFAULTS.rowGap;

	const { replaceInnerBlocks } = useDispatch( blockEditorStore );
	const innerBlocks = useSelect(
		( select ) => select( blockEditorStore ).getBlocks( clientId ),
		[ clientId ]
	);

	// Keep inner block count in sync with numberOfPosts when in manual mode.
	// Additions append empty cards; reductions trim from the end preserving selections.
	useEffect( () => {
		if ( mode !== 'manual' ) return;
		const current = innerBlocks.length;
		if ( current === numberOfPosts ) return;

		if ( current < numberOfPosts ) {
			const added = Array( numberOfPosts - current )
				.fill( null )
				.map( () => createBlock( 'cns-wiki-suite/wiki-card', {} ) );
			replaceInnerBlocks( clientId, [ ...innerBlocks, ...added ], false );
		} else {
			replaceInnerBlocks( clientId, innerBlocks.slice( 0, numberOfPosts ), false );
		}
	}, [ numberOfPosts, mode ] );

	const gridStyle = {
		'--wiki-columns-desktop': columnsDesktop,
		'--wiki-columns-tablet':  columnsTablet,
		'--wiki-columns-mobile':  columnsMobile,
		'--wiki-column-gap':      `${ columnGap }px`,
		'--wiki-row-gap':         `${ rowGap }px`,
	};

	// Always mount InnerBlocks so WordPress state is preserved when toggling modes.
	// In newest mode the inner blocks container is hidden via CSS.
	const innerBlocksProps = useInnerBlocksProps(
		{
			className: 'wiki-contents__grid',
			style: {
				...gridStyle,
				...( mode === 'newest' ? { display: 'none' } : {} ),
			},
		},
		{
			allowedBlocks: ALLOWED_BLOCKS,
			templateLock: false,
		}
	);

	const blockProps = useBlockProps( { className: 'wiki-contents' } );

	return (
		<div { ...blockProps }>
			<InspectorControls>
				<PanelBody title={ __( 'Display Mode', 'clouds-and-spaceships' ) } initialOpen={ true }>
					<RadioControl
						selected={ mode }
						options={ [
							{ label: __( 'Manual selection', 'clouds-and-spaceships' ),  value: 'manual' },
							{ label: __( 'Newest wikis (auto)', 'clouds-and-spaceships' ), value: 'newest' },
						] }
						onChange={ ( val ) => setAttributes( { mode: val } ) }
					/>
				</PanelBody>

				<PanelBody title={ __( 'Grid Settings', 'clouds-and-spaceships' ) } initialOpen={ true }>
					<RangeControl
						label={ __( 'Number of posts', 'clouds-and-spaceships' ) }
						value={ numberOfPosts }
						onChange={ ( v ) => setAttributes( { numberOfPosts: v } ) }
						min={ 1 }
						max={ 24 }
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<TabPanel
						tabs={ [
							{ name: 'Mobile',  title: __( 'Mobile',  'clouds-and-spaceships' ) },
							{ name: 'Tablet',  title: __( 'Tablet',  'clouds-and-spaceships' ) },
							{ name: 'Desktop', title: __( 'Desktop', 'clouds-and-spaceships' ) },
						] }
						initialTabName="Desktop"
					>
						{ ( tab ) => (
							<GridTabs
								breakpoint={ tab.name }
								attributes={ attributes }
								setAttributes={ setAttributes }
							/>
						) }
					</TabPanel>
					<RangeControl
						label={ __( 'Column gap (px)', 'clouds-and-spaceships' ) }
						value={ columnGap }
						onChange={ ( v ) => setAttributes( { columnGap: v } ) }
						min={ 0 }
						max={ 80 }
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
					<RangeControl
						label={ __( 'Row gap (px)', 'clouds-and-spaceships' ) }
						value={ rowGap }
						onChange={ ( v ) => setAttributes( { rowGap: v } ) }
						min={ 0 }
						max={ 80 }
						__nextHasNoMarginBottom
						__next40pxDefaultSize
					/>
				</PanelBody>
			</InspectorControls>

			{ mode === 'newest' && (
				<NewestPreviewGrid
					columns={ columnsDesktop }
					numberOfPosts={ numberOfPosts }
					columnGap={ columnGap }
					rowGap={ rowGap }
				/>
			) }

			<div { ...innerBlocksProps } />
		</div>
	);
}
