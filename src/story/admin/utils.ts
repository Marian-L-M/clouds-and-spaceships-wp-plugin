import { createApiFetch } from '../../shared/admin/api';

/** Story-suite REST namespace. */
export const apiFetch = createApiFetch( '/cns-story-suite/v1' );

/** Map-suite REST namespace — the story editor reads map data through it. */
export const mapApiFetch = createApiFetch( '/cns-map-suite/v1' );
