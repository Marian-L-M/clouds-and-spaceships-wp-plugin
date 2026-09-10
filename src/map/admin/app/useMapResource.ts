import { useState, useEffect, useRef } from '@wordpress/element';
import { apiFetch } from '../utils';

/**
 * Loads a map-scoped REST collection (objects / areas / labels / hierarchy)
 * once per panel mount and hands the rows to the parent-owned list state.
 * Errors are swallowed — the panel simply starts empty, matching the
 * previous inline behavior in every panel.
 */
export function useMapResource<T>(
	mapId: number,
	resource: string,
	onLoaded: ( items: T[] ) => void,
): void {
	const [ initialized, setInitialized ] = useState( false );
	const onLoadedRef   = useRef( onLoaded );
	onLoadedRef.current = onLoaded;

	useEffect( () => {
		if ( initialized || ! mapId ) return;
		apiFetch< T[] >( 'GET', `/maps/${ mapId }/${ resource }` )
			.then( ( data ) => { if ( Array.isArray( data ) ) onLoadedRef.current( data ); } )
			.catch( () => {} )
			.finally( () => setInitialized( true ) );
	}, [ mapId ] );
}
