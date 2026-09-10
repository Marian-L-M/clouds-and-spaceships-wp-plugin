import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import { PanelBody, ComboboxControl, Placeholder, Spinner } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { useSelect } from '@wordpress/data';
import { decodeEntities } from '@wordpress/html-entities';
import { __ } from '@wordpress/i18n';

const STATUS_LABELS = {
	draft:   __( 'Draft', 'clouds-and-spaceships' ),
	private: __( 'Private', 'clouds-and-spaceships' ),
};

function storyLabel( record ) {
	const title  = decodeEntities( record.title?.rendered || '' ) || __( '(no title)', 'clouds-and-spaceships' );
	const status = STATUS_LABELS[ record.status ];
	return status ? `${ title } — ${ status }` : title;
}

export default function Edit( { attributes, setAttributes } ) {
	const { storyId } = attributes;
	const [ search, setSearch ] = useState( '' );

	const { story, searchResults, isSearching } = useSelect(
		( select ) => {
			const { getEntityRecord, getEntityRecords, isResolving } = select( 'core' );
			const query = {
				per_page: 20,
				status:   [ 'publish', 'draft', 'private' ],
				...( search ? { search } : {} ),
			};
			return {
				story:         storyId ? getEntityRecord( 'postType', 'cns_story', storyId ) : null,
				searchResults: getEntityRecords( 'postType', 'cns_story', query ),
				isSearching:   isResolving( 'getEntityRecords', [ 'postType', 'cns_story', query ] ),
			};
		},
		[ storyId, search ]
	);

	const isLoading = storyId && story === undefined;

	const options = [
		// Keep the current selection visible even when it doesn't match the search.
		...( storyId && story ? [ { value: String( storyId ), label: storyLabel( story ) } ] : [] ),
		...( searchResults ?? [] )
			.filter( ( r ) => r.id !== storyId )
			.map( ( r ) => ( { value: String( r.id ), label: storyLabel( r ) } ) ),
	];

	return (
		<>
			<InspectorControls>
				<PanelBody title={ __( 'Story Settings', 'clouds-and-spaceships' ) }>
					<ComboboxControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={ __( 'Story', 'clouds-and-spaceships' ) }
						placeholder={ __( 'Search stories…', 'clouds-and-spaceships' ) }
						value={ storyId ? String( storyId ) : null }
						options={ options }
						onFilterValueChange={ setSearch }
						onChange={ ( value ) =>
							setAttributes( { storyId: parseInt( value ?? '', 10 ) || 0 } )
						}
						allowReset
						help={
							isSearching
								? __( 'Searching…', 'clouds-and-spaceships' )
								: __( 'Type to search stories by title.', 'clouds-and-spaceships' )
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div { ...useBlockProps() }>
				{ isLoading && <Spinner /> }

				{ ! storyId && (
					<Placeholder
						icon="book"
						label={ __( 'CNS Story', 'clouds-and-spaceships' ) }
						instructions={ __( 'Pick a story in the block settings panel to embed it.', 'clouds-and-spaceships' ) }
					/>
				) }

				{ storyId > 0 && ! isLoading && story && (
					<div className="cns-story-block-preview">
						<div className="cns-story-block-preview__label">
							{ __( 'Story:', 'clouds-and-spaceships' ) }
						</div>
						<div className="cns-story-block-preview__title">
							{ decodeEntities( story.title?.rendered || '' ) || __( '(no title)', 'clouds-and-spaceships' ) }
						</div>
						<p className="cns-story-block-preview__note">
							{ __( 'The interactive canvas renders on the frontend.', 'clouds-and-spaceships' ) }
						</p>
					</div>
				) }

				{ storyId > 0 && ! isLoading && ! story && (
					<Placeholder
						icon="warning"
						label={ __( 'Story not found', 'clouds-and-spaceships' ) }
						instructions={ __( 'No story found with the given ID.', 'clouds-and-spaceships' ) }
					/>
				) }
			</div>
		</>
	);
}
