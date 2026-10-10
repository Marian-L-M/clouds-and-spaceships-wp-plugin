import { useState, useRef, useEffect } from '@wordpress/element';
import { ComboboxControl } from '@wordpress/components';
import { useEntityRecords } from '@wordpress/core-data';
import { decodeEntities } from '@wordpress/html-entities';
import { __, sprintf } from '@wordpress/i18n';

interface MapRecord {
	id: number;
	title: { rendered: string };
}

interface Props {
	mapId: number | null;
	mapTitle: string;
	onChange: ( id: number | null, title: string ) => void;
}

/**
 * Async map picker: ComboboxControl over core-data's useEntityRecords for
 * the `clouansp_map` post type — resolution state, caching, and request plumbing
 * all come from the wp/core-data store.
 */
export default function MapPicker( { mapId, mapTitle, onChange }: Props ) {
	const [ search, setSearch ] = useState( '' );
	const timer = useRef< number | null >( null );

	useEffect(
		() => () => {
			if ( timer.current ) window.clearTimeout( timer.current );
		},
		[]
	);

	const { records } = useEntityRecords< MapRecord >(
		'postType',
		'clouansp_map',
		{
			search,
			per_page: 20,
			status: 'publish,private,draft',
		},
		{ enabled: search.length >= 2 }
	);

	const options = [
		...( mapId
			? [
					{
						value: String( mapId ),
						label:
							mapTitle ||
							sprintf(
								/* translators: %d: map post ID. */
								__( 'Map #%d', 'clouds-and-spaceships' ),
								mapId
							),
					},
			  ]
			: [] ),
		...( records ?? [] )
			.filter( ( r ) => r.id !== mapId )
			.map( ( r ) => ( {
				value: String( r.id ),
				label:
					decodeEntities( r.title.rendered ) ||
					__( '(no title)', 'clouds-and-spaceships' ),
			} ) ),
	];

	// Debounce the store query so we don't resolve every keystroke.
	function handleFilterValueChange( input: string ) {
		if ( timer.current ) window.clearTimeout( timer.current );
		timer.current = window.setTimeout( () => setSearch( input ), 300 );
	}

	return (
		<ComboboxControl
			label={ __( 'Map', 'clouds-and-spaceships' ) }
			hideLabelFromVision
			placeholder={ __( 'Search maps…', 'clouds-and-spaceships' ) }
			value={ mapId ? String( mapId ) : null }
			options={ options }
			onFilterValueChange={ handleFilterValueChange }
			onChange={ ( value ) => {
				if ( ! value ) {
					onChange( null, '' );
					return;
				}
				const opt = options.find( ( o ) => o.value === value );
				onChange( parseInt( value, 10 ), opt?.label || '' );
			} }
			allowReset
		/>
	);
}
