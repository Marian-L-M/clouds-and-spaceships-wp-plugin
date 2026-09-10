import { useState, useRef, useEffect } from '@wordpress/element';
import { ComboboxControl } from '@wordpress/components';
import wpApiFetch from '@wordpress/api-fetch';
import { __ } from '@wordpress/i18n';
import type { PostSearchResult } from '../../../types';

interface Props {
	label?: string;
	help?: string;
	/** wp/v2/search subtype filter, e.g. 'any' (default) or 'maps'. */
	subtype?: string;
	selectedId: number;
	selectedLabel: string;
	onChange: ( item: { id: number; title: string } | null ) => void;
}

/**
 * Async post picker on top of ComboboxControl: typing queries the wp/v2
 * search endpoint (debounced) and fills the options list; clearing the
 * control resets the selection.
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
	const timer = useRef< number | null >( null );

	useEffect(
		() => () => {
			if ( timer.current ) window.clearTimeout( timer.current );
		},
		[]
	);

	// The current selection must be present in `options` for the control to
	// render its label, so it is prepended to the fetched results.
	const options = [
		...( selectedId > 0
			? [
					{
						value: String( selectedId ),
						label: selectedLabel || `#${ selectedId }`,
					},
			  ]
			: [] ),
		...results
			.filter( ( r ) => r.id !== selectedId )
			.map( ( r ) => ( {
				value: String( r.id ),
				label:
					subtype === 'any' && r.subtype
						? `${ r.title } (${ r.subtype })`
						: r.title,
			} ) ),
	];

	function handleFilterValueChange( input: string ) {
		if ( timer.current ) window.clearTimeout( timer.current );
		if ( input.length < 2 ) return;
		timer.current = window.setTimeout( async () => {
			try {
				const data = await wpApiFetch< PostSearchResult[] >( {
					path:
						'/wp/v2/search?search=' +
						encodeURIComponent( input ) +
						`&type=post&subtype=${ subtype }&per_page=10`,
				} );
				if ( Array.isArray( data ) ) setResults( data );
			} catch {
				/* silent */
			}
		}, 350 );
	}

	return (
		<ComboboxControl
			__next40pxDefaultSize
			__nextHasNoMarginBottom
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
				const opt = options.find( ( o ) => o.value === value );
				onChange( {
					id: parseInt( value, 10 ),
					title: opt?.label || '',
				} );
			} }
			allowReset
		/>
	);
}
