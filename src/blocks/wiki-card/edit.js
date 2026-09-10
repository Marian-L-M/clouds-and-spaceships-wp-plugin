import { __ } from '@wordpress/i18n';
import {
	useBlockProps,
	InspectorControls,
	PanelColorSettings,
} from '@wordpress/block-editor';
import {
	Button,
	Modal,
	PanelBody,
	PanelRow,
	Placeholder,
	SearchControl,
	SelectControl,
	Spinner,
	ToggleControl,
} from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreDataStore, useEntityRecords } from '@wordpress/core-data';
import { useMemo, useState } from '@wordpress/element';
import './editor.scss';

/**
 * Viewable post types that are still never valid card targets. Everything else
 * WordPress reports as viewable — core's `post`/`page` plus any registered CPT —
 * is offered. Non-viewable internal types (wp_block, wp_template, wp_navigation,
 * revisions, menu items…) are filtered out by the `viewable` flag itself.
 */
const EXCLUDED_POST_TYPES = [ 'attachment' ];

function PostSelectorModal( { currentPostType, onSelect, onClose } ) {
	const [ search, setSearch ] = useState( '' );
	const [ postType, setPostType ] = useState( currentPostType );

	const postTypes = useSelect(
		( select ) => select( coreDataStore ).getPostTypes(),
		[]
	);

	const postTypeOptions = useMemo( () => {
		const options = ( postTypes ?? [] )
			.filter(
				( type ) =>
					type.viewable && ! EXCLUDED_POST_TYPES.includes( type.slug )
			)
			.map( ( type ) => ( {
				label: type.labels?.singular_name || type.name || type.slug,
				value: type.slug,
			} ) )
			.sort( ( a, b ) => a.label.localeCompare( b.label ) );

		// Until the types resolve, keep the current type selectable so the
		// controlled SelectControl never renders with a value it has no option for.
		if ( ! options.length ) {
			return [ { label: currentPostType, value: currentPostType } ];
		}
		return options;
	}, [ postTypes, currentPostType ] );

	const { records, isResolving } = useEntityRecords( 'postType', postType, {
		search,
		per_page: 10,
		_fields: 'id,title',
		status: 'publish',
	} );

	return (
		<Modal
			title={ __( 'Select a post', 'clouds-and-spaceships' ) }
			onRequestClose={ onClose }
			className="wiki-card-modal"
		>
			<SelectControl
				label={ __( 'Post type', 'clouds-and-spaceships' ) }
				value={ postType }
				options={ postTypeOptions }
				onChange={ setPostType }
				disabled={ ! postTypes }
				__next40pxDefaultSize
			/>
			<SearchControl
				value={ search }
				onChange={ setSearch }
				placeholder={ __( 'Search…', 'clouds-and-spaceships' ) }
				__next40pxDefaultSize
			/>
			<div className="wiki-card-modal__results">
				{ isResolving && <Spinner /> }
				{ ! isResolving && records?.length === 0 && (
					<p className="wiki-card-modal__empty">
						{ __( 'No posts found.', 'clouds-and-spaceships' ) }
					</p>
				) }
				{ records?.map( ( post ) => (
					<button
						key={ post.id }
						className="wiki-card-modal__result"
						onClick={ () => onSelect( post.id, postType ) }
						type="button"
					>
						{ post.title?.rendered ?? post.title?.raw ?? `#${ post.id }` }
					</button>
				) ) }
			</div>
		</Modal>
	);
}

function CardPreview( { postId, postType, attributes } ) {
	const {
		backgroundColor,
		textColor,
		showThumbnail,
		showTitle,
		showCategories,
		showExcerpt,
		showTags,
		showLink,
	} = attributes;

	const { post, mediaUrl, catTerms, tagTerms } = useSelect(
		( select ) => {
			const { getEntityRecord, getMedia } = select( coreDataStore );
			const p = getEntityRecord( 'postType', postType, postId );
			const mediaId = p?.featured_media;
			const media = mediaId ? getMedia( mediaId ) : null;

			const catTerms = ( p?.categories ?? [] )
				.map( ( id ) => getEntityRecord( 'taxonomy', 'category', id ) )
				.filter( Boolean );

			const tagTerms = ( p?.tags ?? [] )
				.map( ( id ) => getEntityRecord( 'taxonomy', 'post_tag', id ) )
				.filter( Boolean );

			return {
				post: p,
				mediaUrl:
					media?.media_details?.sizes?.medium?.source_url ||
					media?.source_url ||
					null,
				catTerms,
				tagTerms,
			};
		},
		[ postId, postType ]
	);

	if ( ! post ) {
		return (
			<div className="wiki-card wiki-card--loading" style={ { backgroundColor } }>
				<Spinner />
			</div>
		);
	}

	const title = post.title?.rendered ?? '';
	const excerpt = post.excerpt?.rendered ?? '';

	const cardStyle = { backgroundColor };
	if ( textColor ) cardStyle.color = textColor;

	return (
		<div className="wiki-card" style={ cardStyle }>
			{ showThumbnail && mediaUrl && (
				<div className="wiki-card__thumbnail">
					<img src={ mediaUrl } alt={ title } />
				</div>
			) }
			{ showTitle && <h3 className="wiki-card__title">{ title }</h3> }
			{ showCategories && catTerms.length > 0 && (
				<div className="wiki-card__categories">
					{ catTerms.map( ( term ) => (
						<span key={ term.id } className="wiki-card__term wiki-card__term--category">
							{ term.name }
						</span>
					) ) }
				</div>
			) }
			{ showExcerpt && excerpt && (
				<div
					className="wiki-card__excerpt"
					dangerouslySetInnerHTML={ { __html: excerpt } }
				/>
			) }
			{ showTags && tagTerms.length > 0 && (
				<div className="wiki-card__tags">
					{ tagTerms.map( ( term ) => (
						<span key={ term.id } className="wiki-card__term wiki-card__term--tag">
							{ term.name }
						</span>
					) ) }
				</div>
			) }
			{ showLink && (
				<span className="wiki-card__link">
					{ __( 'Read more', 'clouds-and-spaceships' ) }
				</span>
			) }
		</div>
	);
}

export default function Edit( { attributes, setAttributes } ) {
	const {
		postId,
		postType,
		backgroundColor,
		textColor,
		showThumbnail,
		showTitle,
		showCategories,
		showExcerpt,
		showTags,
		showLink,
	} = attributes;

	const [ isModalOpen, setIsModalOpen ] = useState( false );

	const handleSelect = ( id, type ) => {
		setAttributes( { postId: id, postType: type } );
		setIsModalOpen( false );
	};

	return (
		<div { ...useBlockProps() }>
			<InspectorControls>
				<PanelBody title={ __( 'Card Settings', 'clouds-and-spaceships' ) } initialOpen={ true }>
					<ToggleControl
						label={ __( 'Show thumbnail', 'clouds-and-spaceships' ) }
						checked={ showThumbnail }
						onChange={ ( val ) => setAttributes( { showThumbnail: val } ) }
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={ __( 'Show title', 'clouds-and-spaceships' ) }
						checked={ showTitle }
						onChange={ ( val ) => setAttributes( { showTitle: val } ) }
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={ __( 'Show categories', 'clouds-and-spaceships' ) }
						checked={ showCategories }
						onChange={ ( val ) => setAttributes( { showCategories: val } ) }
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={ __( 'Show excerpt', 'clouds-and-spaceships' ) }
						checked={ showExcerpt }
						onChange={ ( val ) => setAttributes( { showExcerpt: val } ) }
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={ __( 'Show tags', 'clouds-and-spaceships' ) }
						checked={ showTags }
						onChange={ ( val ) => setAttributes( { showTags: val } ) }
						__nextHasNoMarginBottom
					/>
					<ToggleControl
						label={ __( 'Show read more link', 'clouds-and-spaceships' ) }
						checked={ showLink }
						onChange={ ( val ) => setAttributes( { showLink: val } ) }
						__nextHasNoMarginBottom
					/>
				</PanelBody>
				<PanelColorSettings
					title={ __( 'Color', 'clouds-and-spaceships' ) }
					initialOpen={ false }
					colorSettings={ [
						{
							value: backgroundColor,
							onChange: ( val ) =>
								setAttributes( { backgroundColor: val ?? '#f0f0f0' } ),
							label: __( 'Background color', 'clouds-and-spaceships' ),
						},
						{
							value: textColor,
							onChange: ( val ) =>
								setAttributes( { textColor: val ?? '' } ),
							label: __( 'Text color', 'clouds-and-spaceships' ),
						},
					] }
				/>
				{ postId > 0 && (
					<PanelBody title={ __( 'Post', 'clouds-and-spaceships' ) } initialOpen={ false }>
						<PanelRow>
							<Button
								variant="secondary"
								onClick={ () => setIsModalOpen( true ) }
							>
								{ __( 'Change post', 'clouds-and-spaceships' ) }
							</Button>
						</PanelRow>
					</PanelBody>
				) }
			</InspectorControls>

			{ isModalOpen && (
				<PostSelectorModal
					currentPostType={ postType }
					onSelect={ handleSelect }
					onClose={ () => setIsModalOpen( false ) }
				/>
			) }

			{ postId === 0 ? (
				<Placeholder
					icon="index-card"
					label={ __( 'Wiki Card', 'clouds-and-spaceships' ) }
					instructions={ __( 'Select a post to display as a card.', 'clouds-and-spaceships' ) }
				>
					<Button variant="primary" onClick={ () => setIsModalOpen( true ) }>
						{ __( 'Select post', 'clouds-and-spaceships' ) }
					</Button>
				</Placeholder>
			) : (
				<CardPreview postId={ postId } postType={ postType } attributes={ attributes } />
			) }
		</div>
	);
}
