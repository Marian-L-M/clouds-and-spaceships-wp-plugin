/**
 * Enumerated choices that back both a TypeScript union and a form dropdown.
 *
 * Each choice list is the single source of truth: the union type is derived
 * from it, so adding or removing an entry updates the type, the dropdown, and
 * every exhaustiveness check at once. The exported default goes with the list
 * so the form and the REST layer cannot disagree about it.
 *
 * Keep in sync with the matching helpers under "Enumerated choices" in
 * includes/admin/api.php — the REST layer rejects any value not on its list.
 */

// ── Area types ────────────────────────────────────────────────────────────────
// Keep in sync with cns_map_suite_area_types() in includes/admin/api.php.

const AREA_TYPE_CHOICES = [
	{ value: 'POLITICAL', label: 'Political' },
	{ value: 'GEOGRAPHY', label: 'Geography' },
	{ value: 'HISTORY', label: 'History' },
	{ value: 'NATURAL', label: 'Natural' },
	{ value: 'EVENT', label: 'Event' },
	{ value: 'OTHER', label: 'Other' },
] as const;

export type AreaType = ( typeof AREA_TYPE_CHOICES )[ number ][ 'value' ];

/** Mutable copy for `SelectControl`, which does not accept readonly options. */
export const AREA_TYPES: { value: AreaType; label: string }[] = [
	...AREA_TYPE_CHOICES,
];

export const AREA_TYPE_DEFAULT: AreaType = 'POLITICAL';

// ── Object types ──────────────────────────────────────────────────────────────
// Keep in sync with cns_map_suite_object_types() in includes/admin/api.php.

const OBJECT_TYPE_CHOICES = [
	{ value: 'LOCATION', label: 'Location' },
	{ value: 'HISTORY', label: 'History' },
	{ value: 'NATURAL', label: 'Natural' },
	{ value: 'EVENT', label: 'Event' },
	{ value: 'OTHER', label: 'Other' },
] as const;

export type ObjectType = ( typeof OBJECT_TYPE_CHOICES )[ number ][ 'value' ];

export const OBJECT_TYPES: { value: ObjectType; label: string }[] = [
	...OBJECT_TYPE_CHOICES,
];

export const OBJECT_TYPE_DEFAULT: ObjectType = 'LOCATION';

// ── Shape types ───────────────────────────────────────────────────────────────
// Shared by areas and hierarchy regions. Keep in sync with
// cns_map_suite_shape_types() in includes/admin/api.php.

const SHAPE_TYPE_CHOICES = [
	{ value: 'POLYGON', label: 'Polygon (Nodes)' },
	{ value: 'RECTANGLE', label: 'Rectangle' },
	{ value: 'BEZIER', label: 'Bezier Curve' },
	{ value: 'CIRCLE', label: 'Circle / Oval' },
] as const;

export type ShapeType = ( typeof SHAPE_TYPE_CHOICES )[ number ][ 'value' ];

export const SHAPE_TYPES: { value: ShapeType; label: string }[] = [
	...SHAPE_TYPE_CHOICES,
];

export const SHAPE_TYPE_DEFAULT: ShapeType = 'POLYGON';
