import wpApiFetch from '@wordpress/api-fetch';

export type ApiMethod = 'GET' | 'POST' | 'PATCH' | 'DELETE';

/**
 * Builds a thin wrapper over @wordpress/api-fetch pinned to one REST
 * namespace. Nonce and REST root come from core's api-fetch middleware. The
 * returned function resolves with the parsed JSON body and rejects with the
 * REST error object ({ code, message, data }) on any non-2xx response —
 * callers read `.message` off the rejection.
 */
export function createApiFetch( namespace: string ) {
	return function apiFetch< T = unknown >(
		method: ApiMethod,
		path: string,
		data?: unknown
	): Promise< T > {
		return wpApiFetch< T >( {
			path: namespace + path,
			method,
			data,
		} );
	};
}
