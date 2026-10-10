import { useState, useEffect, useRef } from '@wordpress/element';
import { apiFetch } from '../utils';

/**
 * Loads a map-scoped REST collection (objects / areas / labels / hierarchy)
 * once per mount of the calling component and hands the rows to the
 * parent-owned list state. MapEditorApp loads objects, areas and labels this
 * way when the editor opens; the Hierarchy panel loads its regions when its
 * tab is opened. Errors are swallowed — the list simply starts empty.
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
