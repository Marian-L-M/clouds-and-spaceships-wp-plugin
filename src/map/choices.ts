import { __ } from '@wordpress/i18n';

/**
 * Enumerated choices that back both a TypeScript union and a form dropdown.
 *
 * Each choice list is the single source of truth: the union type is derived
 * from it, so adding or removing an entry updates the type, the dropdown, and
 * every exhaustiveness check at once. The exported default goes with the list
 * so the form and the REST layer cannot disagree about it.
 *
 * Keep in sync with the matching helpers under "Enumerated choices" in
 * includes/map/admin/api.php — the REST layer rejects any value not on its list.
 */

// ── Area types ────────────────────────────────────────────────────────────────
// Keep in sync with clouansp_map_suite_area_types() in includes/map/admin/api.php.

const AREA_TYPE_CHOICES = [
	{ value: 'POLITICAL', label: __( 'Political', 'clouds-and-spaceships' ) },
	{ value: 'GEOGRAPHY', label: __( 'Geography', 'clouds-and-spaceships' ) },
	{ value: 'HISTORY', label: __( 'History', 'clouds-and-spaceships' ) },
	{ value: 'NATURAL', label: __( 'Natural', 'clouds-and-spaceships' ) },
	{ value: 'EVENT', label: __( 'Event', 'clouds-and-spaceships' ) },
	{ value: 'OTHER', label: __( 'Other', 'clouds-and-spaceships' ) },
] as const;

export type AreaType = ( typeof AREA_TYPE_CHOICES )[ number ][ 'value' ];

/** Mutable copy for `SelectControl`, which does not accept readonly options. */
export const AREA_TYPES: { value: AreaType; label: string }[] = [
	...AREA_TYPE_CHOICES,
];

export const AREA_TYPE_DEFAULT: AreaType = 'POLITICAL';

// ── Object types ──────────────────────────────────────────────────────────────
// Keep in sync with clouansp_map_suite_object_types() in includes/map/admin/api.php.

const OBJECT_TYPE_CHOICES = [
	{ value: 'LOCATION', label: __( 'Location', 'clouds-and-spaceships' ) },
	{ value: 'HISTORY', label: __( 'History', 'clouds-and-spaceships' ) },
	{ value: 'NATURAL', label: __( 'Natural', 'clouds-and-spaceships' ) },
	{ value: 'EVENT', label: __( 'Event', 'clouds-and-spaceships' ) },
	{ value: 'OTHER', label: __( 'Other', 'clouds-and-spaceships' ) },
] as const;

export type ObjectType = ( typeof OBJECT_TYPE_CHOICES )[ number ][ 'value' ];

export const OBJECT_TYPES: { value: ObjectType; label: string }[] = [
	...OBJECT_TYPE_CHOICES,
];

export const OBJECT_TYPE_DEFAULT: ObjectType = 'LOCATION';

// ── Object display modes ──────────────────────────────────────────────────────
// How an object draws itself on the canvas, mirroring the story node's shape
// list. Keep in sync with clouansp_map_suite_object_display_modes() in
// includes/map/admin/api.php.

const OBJECT_DISPLAY_MODE_CHOICES = [
	{ value: 'round', label: __( 'Round', 'clouds-and-spaceships' ) },
	{ value: 'square', label: __( 'Square', 'clouds-and-spaceships' ) },
	{ value: 'diamond', label: __( 'Diamond', 'clouds-and-spaceships' ) },
	{ value: 'icon', label: __( 'Icon', 'clouds-and-spaceships' ) },
	{ value: 'text', label: __( 'Text', 'clouds-and-spaceships' ) },
] as const;

export type ObjectDisplayMode =
	( typeof OBJECT_DISPLAY_MODE_CHOICES )[ number ][ 'value' ];

export const OBJECT_DISPLAY_MODES: {
	value: ObjectDisplayMode;
	label: string;
}[] = [ ...OBJECT_DISPLAY_MODE_CHOICES ];

export const OBJECT_DISPLAY_MODE_DEFAULT: ObjectDisplayMode = 'icon';

// ── Shape types ───────────────────────────────────────────────────────────────
// Shared by areas and hierarchy regions. Keep in sync with
// clouansp_map_suite_shape_types() in includes/map/admin/api.php.

const SHAPE_TYPE_CHOICES = [
	{ value: 'POLYGON', label: __( 'Polygon (Nodes)', 'clouds-and-spaceships' ) },
	{ value: 'RECTANGLE', label: __( 'Rectangle', 'clouds-and-spaceships' ) },
	{ value: 'BEZIER', label: __( 'Bezier Curve', 'clouds-and-spaceships' ) },
	{ value: 'CIRCLE', label: __( 'Circle / Oval', 'clouds-and-spaceships' ) },
] as const;

export type ShapeType = ( typeof SHAPE_TYPE_CHOICES )[ number ][ 'value' ];

export const SHAPE_TYPES: { value: ShapeType; label: string }[] = [
	...SHAPE_TYPE_CHOICES,
];

export const SHAPE_TYPE_DEFAULT: ShapeType = 'POLYGON';
