import { useState, useRef, useEffect } from '@wordpress/element';
import { ComboboxControl } from '@wordpress/components';
import { useSelect } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { decodeEntities } from '@wordpress/html-entities';
import wpApiFetch from '@wordpress/api-fetch';
import { __, sprintf } from '@wordpress/i18n';
import type { PostSearchResult } from '../../../types';

interface Props {
	label?: string;
	help?: string;
	/**
	 * 'any' (default) searches every public post type through wp/v2/search,
	 * which only ever returns published posts. A post type name, e.g.
	 * 'clouansp_map', searches that type's own collection instead, drafts and
	 * private posts included.
	 */
	subtype?: string;
	selectedId: number;
	selectedLabel: string;
	onChange: ( item: { id: number; title: string } | null ) => void;
}

const STATUS_LABELS: Record< string, string > = {
	draft: __( 'Draft', 'clouds-and-spaceships' ),
	pending: __( 'Pending', 'clouds-and-spaceships' ),
	private: __( 'Private', 'clouds-and-spaceships' ),
};

/**
 * Runs a search (`search=…`) or an ID lookup (`include=…`) against the
 * endpoint that matches `subtype`.
 */
async function fetchPosts(
	subtype: string,
	query: string
): Promise< PostSearchResult[] > {
	if ( subtype === 'any' ) {
		const data = await wpApiFetch<
			{ id: number; title: string; subtype: string }[]
		>( {
			path: `/wp/v2/search?${ query }&type=post&subtype=any&per_page=10`,
		} );
		return data.map( ( r ) => ( {
			id: r.id,
			title: decodeEntities( r.title ),
			subtype: r.subtype,
			status: 'publish',
		} ) );
	}

	// The plugin's post types keep the default rest_base, which is the post
	// type name.
	const data = await wpApiFetch<
		{ id: number; title: { rendered: string }; status: string }[]
	>( {
		path: `/wp/v2/${ subtype }?${ query }&status=publish,draft,private&per_page=10&_fields=id,title,status`,
	} );
	return data.map( ( r ) => ( {
		id: r.id,
		title: decodeEntities( r.title.rendered ),
		subtype,
		status: r.status,
	} ) );
}

/**
 * Async post picker on top of ComboboxControl: typing queries the REST API
 * (debounced) and fills the options list; clearing the control resets the
 * selection.
 *
 * Titles are decoded before they become option labels. ComboboxControl
 * matches what is typed against the label, so an encoded title ("Bob&#8217;s
 * Map") would also never match "Bob's".
 */
export default function PostSearch( {
	label = __( 'Connected post', 'clouds-and-spaceships' ),
	help,
	subtype = 'any',
	selectedId,
	selectedLabel,
	onChange,
}: Props ) {
	const [ results, setResults ] = useState< PostSearchResult[] >( [] );
	const [ resolvedLabel, setResolvedLabel ] = useState( '' );
	const timer = useRef< number | null >( null );

	useEffect(
		() => () => {
			if ( timer.current ) window.clearTimeout( timer.current );
		},
		[]
	);

	// A form that only knows the selected post's ID (the infobox's connected
	// post) passes no label; look the title up so the field shows the post's
	// current name rather than a number.
	useEffect( () => {
		setResolvedLabel( '' );
		if ( selectedId <= 0 || selectedLabel ) return;
		let cancelled = false;
		fetchPosts( subtype, `include=${ selectedId }` )
			.then( ( [ post ] ) => {
				if ( ! cancelled && post ) setResolvedLabel( post.title );
			} )
			.catch( () => {} );
		return () => {
			cancelled = true;
		};
	}, [ selectedId, selectedLabel, subtype ] );

	// Display names for the post types in mixed ('any') results.
	const postTypes = useSelect(
		( select ) =>
			subtype === 'any'
				? ( select( coreStore ).getPostTypes( { per_page: -1 } ) as
						| { slug: string; labels?: { singular_name?: string } }[]
						| null )
				: null,
		[ subtype ]
	);

	function resultLabel( r: PostSearchResult ): string {
		const title = r.title || __( '(no title)', 'clouds-and-spaceships' );
		if ( subtype === 'any' ) {
			const typeName =
				postTypes?.find( ( t ) => t.slug === r.subtype )?.labels
					?.singular_name || r.subtype;
			return `${ title } (${ typeName })`;
		}
		const status = STATUS_LABELS[ r.status ];
		return status
			? sprintf(
					/* translators: 1: post title, 2: post status, e.g. "Draft". */
					__( '%1$s — %2$s', 'clouds-and-spaceships' ),
					title,
					status
			  )
			: title;
	}

	// The current selection must be present in `options` for the control to
	// render its label, so it is prepended to the fetched results.
	const options = [
		...( selectedId > 0
			? [
					{
						value: String( selectedId ),
						label:
							selectedLabel ||
							resolvedLabel ||
							sprintf(
								/* translators: %d: post ID. */
								__( 'Post #%d', 'clouds-and-spaceships' ),
								selectedId
							),
					},
			  ]
			: [] ),
		...results
			.filter( ( r ) => r.id !== selectedId )
			.map( ( r ) => ( { value: String( r.id ), label: resultLabel( r ) } ) ),
	];

	function handleFilterValueChange( input: string ) {
		if ( timer.current ) window.clearTimeout( timer.current );
		if ( input.length < 2 ) return;
		timer.current = window.setTimeout( async () => {
			try {
				setResults(
					await fetchPosts(
						subtype,
						`search=${ encodeURIComponent( input ) }`
					)
				);
			} catch {
				/* silent */
			}
		}, 350 );
	}

	return (
		<ComboboxControl
			label={ label }
			help={ help }
			placeholder={ __( 'Type to search…', 'clouds-and-spaceships' ) }
			value={ selectedId > 0 ? String( selectedId ) : null }
			options={ options }
			onFilterValueChange={ handleFilterValueChange }
			onChange={ ( value ) => {
				if ( ! value ) {
					onChange( null );
					return;
				}
				const id = parseInt( value, 10 );
				// Hand back the plain title, without the type or status suffix.
				const picked = results.find( ( r ) => r.id === id );
				onChange( {
					id,
					title: picked ? picked.title : selectedLabel || resolvedLabel,
				} );
			} }
			allowReset
		/>
	);
}
