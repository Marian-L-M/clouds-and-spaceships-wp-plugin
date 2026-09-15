<?php

defined('ABSPATH') || exit;

function cns_map_suite_permission_check(): true|WP_Error {
	if (current_user_can('manage_maps')) {
		return true;
	}
	return new WP_Error(
		'rest_forbidden',
		__('You do not have permission to manage maps.', 'clouds-and-spaceships'),
		['status' => is_user_logged_in() ? 403 : 401]
	);
}

add_action('rest_api_init', 'cns_map_suite_register_rest_routes');

function cns_map_suite_register_rest_routes(): void {

	// ── Map settings save ─────────────────────────────────────────────────────

	register_rest_route('cns-map-suite/v1', '/maps', [
		'methods'             => 'POST',
		'callback'            => 'cns_map_suite_rest_save_map',
		'permission_callback' => 'cns_map_suite_permission_check',
		'args'                => [
			'map_id' => [
				'type'              => 'integer',
				'default'           => 0,
				'sanitize_callback' => 'absint',
			],
			'title' => [
				'type'              => 'string',
				'default'           => '',
				'sanitize_callback' => 'sanitize_text_field',
			],
			'description' => [
				'type'              => 'string',
				'default'           => '',
				'sanitize_callback' => 'wp_kses_post',
			],
			'status' => [
				'type'    => 'string',
				'default' => 'draft',
				'enum'    => ['publish', 'draft', 'private'],
			],
			'width' => [
				'type'    => 'integer',
				'default' => 1000,
				'minimum' => 100,
			],
			'aspect_ratio' => [
				'type'    => 'number',
				'default' => 1.0,
				'minimum' => 0.1,
			],
			'time' => [
				'type'    => 'integer',
				'default' => 0,
			],
			'image_id' => [
				'type'              => 'integer',
				'default'           => 0,
				'sanitize_callback' => 'absint',
			],
			'image_x' => [
				'type'    => 'number',
				'default' => 0.0,
			],
			'image_y' => [
				'type'    => 'number',
				'default' => 0.0,
			],
			'image_width' => [
				'type'    => 'number',
				'default' => 1.0,
				'minimum' => 0.01,
			],
			'is_master' => [
				'type'    => 'boolean',
				'default' => false,
			],
			'bg_type' => [
				'type'    => 'string',
				'default' => 'color',
				'enum'    => ['color', 'image'],
			],
			'bg_color' => [
				'type'              => 'string',
				'default'           => '#1a1a2e',
				'sanitize_callback' => fn($v) => cns_map_suite_sanitize_color((string) $v, '#1a1a2e'),
			],
			'bg_image_id' => [
				'type'              => 'integer',
				'default'           => 0,
				'sanitize_callback' => 'absint',
			],
			'thumbnail_id' => [
				'type'              => 'integer',
				'default'           => 0,
				'sanitize_callback' => 'absint',
			],
		],
	]);

	// ── Icon library ──────────────────────────────────────────────────────────

	register_rest_route('cns-map-suite/v1', '/icons', [
		[
			'methods'             => 'GET',
			'callback'            => 'cns_map_suite_rest_list_icons',
			'permission_callback' => 'cns_map_suite_permission_check',
		],
		[
			'methods'             => 'POST',
			'callback'            => 'cns_map_suite_rest_add_icon',
			'permission_callback' => 'cns_map_suite_permission_check',
			'args'                => [
				'attachment_id' => [
					'type'              => 'integer',
					'required'          => true,
					'sanitize_callback' => 'absint',
				],
			],
		],
	]);

	register_rest_route('cns-map-suite/v1', '/icons/(?P<id>\d+)', [
		'methods'             => 'DELETE',
		'callback'            => 'cns_map_suite_rest_remove_icon',
		'permission_callback' => 'cns_map_suite_permission_check',
	]);

	// ── Map objects ───────────────────────────────────────────────────────────

	register_rest_route('cns-map-suite/v1', '/maps/(?P<map_id>\d+)/objects', [
		[
			'methods'             => 'GET',
			'callback'            => 'cns_map_suite_rest_list_objects',
			'permission_callback' => 'cns_map_suite_permission_check',
		],
		[
			'methods'             => 'POST',
			'callback'            => 'cns_map_suite_rest_create_object',
			'permission_callback' => 'cns_map_suite_permission_check',
			'args'                => cns_map_suite_object_rest_args(),
		],
	]);

	register_rest_route('cns-map-suite/v1', '/objects/(?P<id>\d+)', [
		[
			'methods'             => 'POST',
			'callback'            => 'cns_map_suite_rest_update_object',
			'permission_callback' => 'cns_map_suite_permission_check',
			'args'                => cns_map_suite_object_rest_args(),
		],
		[
			'methods'             => 'DELETE',
			'callback'            => 'cns_map_suite_rest_delete_object',
			'permission_callback' => 'cns_map_suite_permission_check',
		],
	]);

	register_rest_route('cns-map-suite/v1', '/objects/(?P<id>\d+)/position', [
		'methods'             => 'PATCH',
		'callback'            => 'cns_map_suite_rest_move_object',
		'permission_callback' => 'cns_map_suite_permission_check',
		'args'                => [
			'x' => ['required' => true, 'type' => 'integer', 'minimum' => 0],
			'y' => ['required' => true, 'type' => 'integer', 'minimum' => 0],
		],
	]);

	// ── Map areas ─────────────────────────────────────────────────────────────────

	register_rest_route('cns-map-suite/v1', '/maps/(?P<map_id>\d+)/areas', [
		[
			'methods'             => 'GET',
			'callback'            => 'cns_map_suite_rest_list_areas',
			'permission_callback' => 'cns_map_suite_permission_check',
		],
		[
			'methods'             => 'POST',
			'callback'            => 'cns_map_suite_rest_create_area',
			'permission_callback' => 'cns_map_suite_permission_check',
			'args'                => cns_map_suite_area_rest_args(),
		],
	]);

	register_rest_route('cns-map-suite/v1', '/areas/(?P<id>\d+)', [
		[
			'methods'             => 'POST',
			'callback'            => 'cns_map_suite_rest_update_area',
			'permission_callback' => 'cns_map_suite_permission_check',
			'args'                => cns_map_suite_area_rest_args(),
		],
		[
			'methods'             => 'DELETE',
			'callback'            => 'cns_map_suite_rest_delete_area',
			'permission_callback' => 'cns_map_suite_permission_check',
		],
	]);

	// Geometry-only writes: the editor persists canvas node edits immediately
	// (like object/label position PATCHes); the full POST save carries the
	// rest of the form.
	register_rest_route('cns-map-suite/v1', '/areas/(?P<id>\d+)/nodes', [
		'methods'             => 'PATCH',
		'callback'            => 'cns_map_suite_rest_update_area_nodes',
		'permission_callback' => 'cns_map_suite_permission_check',
		'args'                => [
			'nodes' => [
				'type' => 'string',
			],
			'shape_type' => [
				'type' => 'string',
				'enum' => cns_map_suite_shape_types(),
			],
		],
	]);

	// ── Map labels ────────────────────────────────────────────────────────────────

	register_rest_route('cns-map-suite/v1', '/maps/(?P<map_id>\d+)/labels', [
		[
			'methods'             => 'GET',
			'callback'            => 'cns_map_suite_rest_list_labels',
			'permission_callback' => 'cns_map_suite_permission_check',
		],
		[
			'methods'             => 'POST',
			'callback'            => 'cns_map_suite_rest_create_label',
			'permission_callback' => 'cns_map_suite_permission_check',
			'args'                => cns_map_suite_label_rest_args(),
		],
	]);

	register_rest_route('cns-map-suite/v1', '/labels/(?P<id>\d+)', [
		[
			'methods'             => 'POST',
			'callback'            => 'cns_map_suite_rest_update_label',
			'permission_callback' => 'cns_map_suite_permission_check',
			'args'                => cns_map_suite_label_rest_args(),
		],
		[
			'methods'             => 'DELETE',
			'callback'            => 'cns_map_suite_rest_delete_label',
			'permission_callback' => 'cns_map_suite_permission_check',
		],
	]);

	// Anchor point and/or label-box offset; all params optional so the dot
	// and the box can be moved independently from the editor canvas.
	register_rest_route('cns-map-suite/v1', '/labels/(?P<id>\d+)/position', [
		'methods'             => 'PATCH',
		'callback'            => 'cns_map_suite_rest_move_label',
		'permission_callback' => 'cns_map_suite_permission_check',
		'args'                => [
			'x'        => ['type' => 'integer', 'minimum' => 0],
			'y'        => ['type' => 'integer', 'minimum' => 0],
			'offset_x' => ['type' => 'integer', 'minimum' => -2000, 'maximum' => 2000],
			'offset_y' => ['type' => 'integer', 'minimum' => -2000, 'maximum' => 2000],
		],
	]);

	// ── Map hierarchy ─────────────────────────────────────────────────────────────

	register_rest_route('cns-map-suite/v1', '/maps/(?P<map_id>\d+)/hierarchy', [
		[
			'methods'             => 'GET',
			'callback'            => 'cns_map_suite_rest_list_hierarchy',
			'permission_callback' => 'cns_map_suite_permission_check',
		],
		[
			'methods'             => 'POST',
			'callback'            => 'cns_map_suite_rest_create_hierarchy_region',
			'permission_callback' => 'cns_map_suite_permission_check',
			'args'                => cns_map_suite_hierarchy_rest_args(),
		],
	]);

	register_rest_route('cns-map-suite/v1', '/hierarchy/(?P<id>\d+)', [
		[
			'methods'             => 'POST',
			'callback'            => 'cns_map_suite_rest_update_hierarchy_region',
			'permission_callback' => 'cns_map_suite_permission_check',
			'args'                => cns_map_suite_hierarchy_rest_args(),
		],
		[
			'methods'             => 'DELETE',
			'callback'            => 'cns_map_suite_rest_delete_hierarchy_region',
			'permission_callback' => 'cns_map_suite_permission_check',
		],
	]);

	// Returns all parent maps for a given child map (maps where this map is a child region).
	register_rest_route('cns-map-suite/v1', '/maps/(?P<map_id>\d+)/parents', [
		'methods'             => 'GET',
		'callback'            => 'cns_map_suite_rest_list_parents',
		'permission_callback' => 'cns_map_suite_permission_check',
	]);
}

// ── Map settings ──────────────────────────────────────────────────────────────

function cns_map_suite_rest_save_map(WP_REST_Request $request): WP_REST_Response|WP_Error {
	$map_id = $request->get_param('map_id');
	$title  = $request->get_param('title') ?: __('(no title)', 'clouds-and-spaceships');

	$post_data = [
		'post_type'    => 'maps',
		'post_title'   => $title,
		'post_content' => (string) $request->get_param('description'),
		'post_status'  => $request->get_param('status'),
	];

	if ($map_id > 0) {
		$existing = get_post($map_id);
		if (! $existing || $existing->post_type !== 'maps') {
			return new WP_Error('invalid_map', __('Map not found.', 'clouds-and-spaceships'), ['status' => 404]);
		}
		$post_data['ID'] = $map_id;
		// wp_update_post/wp_insert_post expect slashed data; REST params are unslashed.
		$result = wp_update_post(wp_slash($post_data), true);
	} else {
		$result = wp_insert_post(wp_slash($post_data), true);
	}

	if (is_wp_error($result)) {
		return $result;
	}

	$map_id = (int) $result;

	$meta = [
		'_cns_map_width'        => (int) $request->get_param('width'),
		'_cns_map_aspect_ratio' => (float) $request->get_param('aspect_ratio'),
		'_cns_map_time'         => (int) $request->get_param('time'),
		'_cns_map_image_id'     => (int) $request->get_param('image_id'),
		'_cns_map_image_x'      => (float) $request->get_param('image_x'),
		'_cns_map_image_y'      => (float) $request->get_param('image_y'),
		'_cns_map_image_width'  => (float) $request->get_param('image_width'),
		'_cns_map_is_master'    => (bool) $request->get_param('is_master'),
		'_cns_map_bg_type'      => (string) $request->get_param('bg_type'),
		'_cns_map_bg_color'     => cns_map_suite_sanitize_color((string) $request->get_param('bg_color'), '#1a1a2e'),
		'_cns_map_bg_image_id'  => (int) $request->get_param('bg_image_id'),
	];

	foreach ($meta as $key => $value) {
		update_post_meta($map_id, $key, $value);
	}

	$thumbnail_id = (int) ($request->get_param('thumbnail_id') ?? 0);
	if ($thumbnail_id) {
		set_post_thumbnail($map_id, $thumbnail_id);
	} else {
		delete_post_thumbnail($map_id);
	}

	$saved_status = $request->get_param('status');
	$created      = $request->get_param('map_id') === 0;

	return new WP_REST_Response([
		'map_id'   => $map_id,
		'status'   => $saved_status,
		'created'  => $created,
		'edit_url' => add_query_arg(
			['page' => CNS_MAP_PAGE_EDITOR, 'map_id' => $map_id],
			admin_url('admin.php')
		),
		'view_url' => in_array($saved_status, ['publish', 'private'], true)
			? (get_permalink($map_id) ?: '')
			: '',
	], $created ? 201 : 200);
}

// ── Icons ─────────────────────────────────────────────────────────────────────

function cns_map_suite_rest_list_icons(): WP_REST_Response {
	$attachments = get_posts([
		'post_type'      => 'attachment',
		'post_mime_type' => 'image/svg+xml',
		'post_status'    => 'inherit',
		// Hard cap so the endpoint stays bounded; add pagination if the
		// library ever approaches this.
		'posts_per_page' => 500,
		'meta_query'     => [['key' => '_cns_map_icon', 'value' => '1']],
		'orderby'        => 'title',
		'order'          => 'ASC',
	]);

	$icons = array_map(fn($att) => [
		'id'    => $att->ID,
		'title' => $att->post_title ?: basename(get_attached_file($att->ID) ?: ''),
		'url'   => wp_get_attachment_url($att->ID),
	], $attachments);

	return new WP_REST_Response(array_values($icons), 200);
}

function cns_map_suite_rest_add_icon(WP_REST_Request $request): WP_REST_Response|WP_Error {
	$id         = $request->get_param('attachment_id');
	$attachment = get_post($id);

	if (!$attachment || $attachment->post_type !== 'attachment') {
		return new WP_Error('not_found', __('Attachment not found.', 'clouds-and-spaceships'), ['status' => 404]);
	}
	if (get_post_mime_type($id) !== 'image/svg+xml') {
		return new WP_Error('not_svg', __('Only SVG files can be added to the icon library.', 'clouds-and-spaceships'), ['status' => 400]);
	}

	update_post_meta($id, '_cns_map_icon', '1');

	return new WP_REST_Response([
		'id'    => $id,
		'title' => $attachment->post_title ?: basename(get_attached_file($id) ?: ''),
		'url'   => wp_get_attachment_url($id),
	], 200);
}

function cns_map_suite_rest_remove_icon(WP_REST_Request $request): WP_REST_Response|WP_Error {
	$id = (int) $request->get_param('id');
	if (!get_post($id)) {
		return new WP_Error('not_found', __('Icon not found.', 'clouds-and-spaceships'), ['status' => 404]);
	}
	delete_post_meta($id, '_cns_map_icon');
	return new WP_REST_Response(['deleted' => true], 200);
}

// ── Shared color sanitizer ────────────────────────────────────────────────────

/**
 * Validates a canvas color value (hex, rgb()/rgba(), hsl()/hsla()); anything
 * else falls back to the given default. Values end up in canvas fill/stroke
 * styles and injected SVG attributes, so only real colors are stored.
 */
function cns_map_suite_sanitize_color(string $value, string $default): string {
	$value = trim($value);
	// 3, 6, or 8 hex digits. Core's sanitize_hex_color() stops at 6, but colors
	// carry their alpha in the value here, so #rrggbbaa has to pass too.
	if (preg_match('/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6}|[A-Fa-f0-9]{8})$/', $value)) {
		return strtolower($value);
	}
	if (preg_match('/^(rgb|rgba|hsl|hsla)\([\d\s.,%\/]+\)$/', $value)) {
		return $value;
	}
	return $default;
}

/**
 * Region label fonts. Canvas takes a CSS font shorthand, and an unrecognised
 * family makes the whole `ctx.font` assignment silently no-op — so the family
 * is matched against this list rather than passed through.
 */
// ── Enumerated choices ────────────────────────────────────────────────────────
// The allowed values for the enum-backed columns. Each list is mirrored by a
// choice list in src/choices.ts, which derives the matching TypeScript union
// and the form dropdown from it — keep the two sides in sync.

function cns_map_suite_area_types(): array {
	return ['POLITICAL', 'GEOGRAPHY', 'HISTORY', 'NATURAL', 'EVENT', 'OTHER'];
}

function cns_map_suite_object_types(): array {
	return ['LOCATION', 'HISTORY', 'NATURAL', 'EVENT', 'OTHER'];
}

/** Shared by areas and hierarchy regions. */
function cns_map_suite_shape_types(): array {
	return ['POLYGON', 'RECTANGLE', 'BEZIER', 'CIRCLE'];
}

function cns_map_suite_label_font_families(): array {
	return [
		'sans-serif',
		'serif',
		'monospace',
		'Georgia, serif',
		'"Times New Roman", serif',
		'Arial, sans-serif',
		'Verdana, sans-serif',
		'"Trebuchet MS", sans-serif',
		'"Courier New", monospace',
	];
}

function cns_map_suite_sanitize_font_family(string $value): string {
	$value = trim($value);
	return in_array($value, cns_map_suite_label_font_families(), true)
		? $value
		: 'sans-serif';
}

// ── Shared infobox / row helpers ──────────────────────────────────────────────
// Objects, areas, and labels share the same infobox model: an optional
// connected post (linked_post_id, independent of the content source) plus
// manual infobox_data. These helpers are the single source of truth for the
// REST args, the request → row fields, and JSON-column normalization.

function cns_map_suite_infobox_rest_args(): array {
	return [
		'infobox_source' => [
			'type'    => 'string',
			'default' => 'manual',
			'enum'    => ['manual', 'post'],
		],
		'linked_post_id' => [
			'type'              => 'integer',
			'default'           => 0,
			'sanitize_callback' => 'absint',
		],
		'infobox_title' => [
			'type'              => 'string',
			'default'           => '',
			'sanitize_callback' => 'sanitize_text_field',
		],
		'infobox_description' => [
			'type'    => 'string',
			'default' => '',
		],
		'infobox_image_id' => [
			'type'              => 'integer',
			'default'           => 0,
			'sanitize_callback' => 'absint',
		],
		// Per-item display flags (default on to preserve pre-flag behaviour).
		'display_infobox' => [
			'type'              => 'boolean',
			'default'           => true,
			'sanitize_callback' => 'rest_sanitize_boolean',
		],
		'show_title' => [
			'type'              => 'boolean',
			'default'           => true,
			'sanitize_callback' => 'rest_sanitize_boolean',
		],
		'show_excerpt' => [
			'type'              => 'boolean',
			'default'           => true,
			'sanitize_callback' => 'rest_sanitize_boolean',
		],
		'show_thumbnail' => [
			'type'              => 'boolean',
			'default'           => true,
			'sanitize_callback' => 'rest_sanitize_boolean',
		],
	];
}

/**
 * Extracts the infobox DB fields from a request, validating the connected
 * post. Returns ['linked_post_id' => ?int, 'infobox_source' => string,
 * 'infobox_data' => string(JSON)] or a 400 WP_Error for a missing post.
 */
function cns_map_suite_infobox_fields_from_request(WP_REST_Request $request): array|WP_Error {
	$linked_post_id = $request->get_param('linked_post_id') ?: null;
	if ($linked_post_id && !get_post($linked_post_id)) {
		return new WP_Error('invalid_post', __('Linked post not found.', 'clouds-and-spaceships'), ['status' => 400]);
	}

	return [
		'linked_post_id' => $linked_post_id,
		'infobox_source' => $request->get_param('infobox_source'),
		'infobox_data'   => wp_json_encode([
			'title'           => (string) $request->get_param('infobox_title'),
			'description'     => wp_kses_post($request->get_param('infobox_description')),
			'image_id'        => (int) $request->get_param('infobox_image_id'),
			'display_infobox' => (bool) $request->get_param('display_infobox'),
			'show_title'      => (bool) $request->get_param('show_title'),
			'show_excerpt'    => (bool) $request->get_param('show_excerpt'),
			'show_thumbnail'  => (bool) $request->get_param('show_thumbnail'),
		]),
	];
}

/** Decodes JSON columns (empty → (object)[]) and int-casts ID/coordinate columns. */
function cns_map_suite_normalize_row(array $row, array $json_cols, array $int_cols): array {
	foreach ($json_cols as $col) {
		$row[$col] = !empty($row[$col]) ? json_decode($row[$col], true) : (object) [];
	}
	foreach ($int_cols as $col) {
		$row[$col] = (int) ($row[$col] ?? 0);
	}
	return $row;
}

// ── Objects — shared args ─────────────────────────────────────────────────────

function cns_map_suite_object_rest_args(): array {
	return array_merge(cns_map_suite_infobox_rest_args(), [
		'icon_image_id' => [
			'type'              => 'integer',
			'default'           => 0,
			'sanitize_callback' => 'absint',
		],
		'title' => [
			'type'              => 'string',
			'default'           => '',
			'sanitize_callback' => 'sanitize_text_field',
		],
		'type' => [
			'type'    => 'string',
			'default' => 'LOCATION',
			'enum'    => cns_map_suite_object_types(),
		],
		'x' => [
			'type'    => 'integer',
			'default' => 0,
		],
		'y' => [
			'type'    => 'integer',
			'default' => 0,
		],
		'object_time' => [
			'type'    => 'integer',
			'default' => 0,
		],
		'style_size' => [
			'type'    => 'integer',
			'default' => 32,
			'minimum' => 8,
			'maximum' => 128,
		],
		'style_fill' => [
			'type'              => 'string',
			'default'           => '#ffffff',
			'sanitize_callback' => fn($v) => cns_map_suite_sanitize_color((string) $v, '#ffffff'),
		],
		'style_stroke' => [
			'type'              => 'string',
			'default'           => '#2271b1',
			'sanitize_callback' => fn($v) => cns_map_suite_sanitize_color((string) $v, '#2271b1'),
		],
	]);
}

// ── Objects — helpers ─────────────────────────────────────────────────────────

function cns_map_suite_object_styles_from_args(WP_REST_Request $request): string {
	return wp_json_encode([
		'size'        => (int) $request->get_param('style_size'),
		'fillStyle'   => (string) $request->get_param('style_fill'),
		'strokeStyle' => (string) $request->get_param('style_stroke'),
	]);
}

function cns_map_suite_normalize_object_row(array $row): array {
	$row = cns_map_suite_normalize_row(
		$row,
		['canvas_styles', 'infobox_data'],
		['id', 'map_id', 'linked_post_id', 'icon_image_id', 'x', 'y', 'object_time']
	);
	$row['icon_url']  = $row['icon_image_id'] ? (wp_get_attachment_url((int) $row['icon_image_id']) ?: '') : '';
	$row['icon_mime'] = $row['icon_image_id'] ? (get_post_mime_type((int) $row['icon_image_id']) ?: '') : '';
	return $row;
}

// ── Objects — CRUD ────────────────────────────────────────────────────────────

function cns_map_suite_rest_list_objects(WP_REST_Request $request): WP_REST_Response|WP_Error {
	global $wpdb;
	$map_id = (int) $request->get_param('map_id');

	if (!get_post($map_id) || get_post_type($map_id) !== 'maps') {
		return new WP_Error('invalid_map', __('Map not found.', 'clouds-and-spaceships'), ['status' => 404]);
	}

	$rows = $wpdb->get_results(
		$wpdb->prepare("SELECT * FROM {$wpdb->prefix}cns_map_objects WHERE map_id = %d ORDER BY id ASC", $map_id),
		ARRAY_A
	);

	return new WP_REST_Response(array_map('cns_map_suite_normalize_object_row', $rows ?: []), 200);
}

function cns_map_suite_rest_create_object(WP_REST_Request $request): WP_REST_Response|WP_Error {
	global $wpdb;
	$map_id = (int) $request->get_param('map_id');

	if (!get_post($map_id) || get_post_type($map_id) !== 'maps') {
		return new WP_Error('invalid_map', __('Map not found.', 'clouds-and-spaceships'), ['status' => 404]);
	}

	$ib = cns_map_suite_infobox_fields_from_request($request);
	if (is_wp_error($ib)) {
		return $ib;
	}

	$wpdb->insert(
		$wpdb->prefix . 'cns_map_objects',
		[
			'map_id'         => $map_id,
			'linked_post_id' => $ib['linked_post_id'],
			'type'           => $request->get_param('type'),
			'svg_slug'       => '',
			'icon_image_id'  => $request->get_param('icon_image_id') ?: null,
			'title'          => $request->get_param('title'),
			'x'              => $request->get_param('x'),
			'y'              => $request->get_param('y'),
			'object_time'    => $request->get_param('object_time'),
			'infobox_source' => $ib['infobox_source'],
			'infobox_data'   => $ib['infobox_data'],
			'canvas_styles'  => cns_map_suite_object_styles_from_args($request),
		],
		['%d', '%d', '%s', '%s', '%d', '%s', '%d', '%d', '%d', '%s', '%s', '%s']
	);

	if (!$wpdb->insert_id) {
		return new WP_Error('db_error', __('Failed to save object.', 'clouds-and-spaceships'), ['status' => 500]);
	}

	$row = $wpdb->get_row(
		$wpdb->prepare("SELECT * FROM {$wpdb->prefix}cns_map_objects WHERE id = %d", $wpdb->insert_id),
		ARRAY_A
	);

	return new WP_REST_Response(cns_map_suite_normalize_object_row($row), 201);
}

function cns_map_suite_rest_update_object(WP_REST_Request $request): WP_REST_Response|WP_Error {
	global $wpdb;
	$id = (int) $request->get_param('id');

	$existing = $wpdb->get_row(
		$wpdb->prepare("SELECT id FROM {$wpdb->prefix}cns_map_objects WHERE id = %d", $id)
	);

	if (!$existing) {
		return new WP_Error('not_found', __('Object not found.', 'clouds-and-spaceships'), ['status' => 404]);
	}

	$ib = cns_map_suite_infobox_fields_from_request($request);
	if (is_wp_error($ib)) {
		return $ib;
	}

	$result = $wpdb->update(
		$wpdb->prefix . 'cns_map_objects',
		[
			'linked_post_id' => $ib['linked_post_id'],
			'type'           => $request->get_param('type'),
			'icon_image_id'  => $request->get_param('icon_image_id') ?: null,
			'title'          => $request->get_param('title'),
			'x'              => $request->get_param('x'),
			'y'              => $request->get_param('y'),
			'object_time'    => $request->get_param('object_time'),
			'infobox_source' => $ib['infobox_source'],
			'infobox_data'   => $ib['infobox_data'],
			'canvas_styles'  => cns_map_suite_object_styles_from_args($request),
		],
		['id' => $id],
		['%d', '%s', '%d', '%s', '%d', '%d', '%d', '%s', '%s', '%s'],
		['%d']
	);

	if ($result === false) {
		return new WP_Error('db_error', __('Failed to update object.', 'clouds-and-spaceships'), ['status' => 500]);
	}

	$row = $wpdb->get_row(
		$wpdb->prepare("SELECT * FROM {$wpdb->prefix}cns_map_objects WHERE id = %d", $id),
		ARRAY_A
	);

	return new WP_REST_Response(cns_map_suite_normalize_object_row($row), 200);
}

function cns_map_suite_rest_delete_object(WP_REST_Request $request): WP_REST_Response|WP_Error {
	global $wpdb;
	$id = (int) $request->get_param('id');

	$existing = $wpdb->get_row(
		$wpdb->prepare("SELECT id FROM {$wpdb->prefix}cns_map_objects WHERE id = %d", $id)
	);

	if (!$existing) {
		return new WP_Error('not_found', __('Object not found.', 'clouds-and-spaceships'), ['status' => 404]);
	}

	$wpdb->delete($wpdb->prefix . 'cns_map_objects', ['id' => $id], ['%d']);
	return new WP_REST_Response(['deleted' => true], 200);
}

// ── Areas — shared args ───────────────────────────────────────────────────────

function cns_map_suite_area_rest_args(): array {
	return array_merge(cns_map_suite_infobox_rest_args(), [
		'title' => [
			'type'              => 'string',
			'default'           => '',
			'sanitize_callback' => 'sanitize_text_field',
		],
		'type' => [
			'type'    => 'string',
			'default' => 'POLITICAL',
			'enum'    => cns_map_suite_area_types(),
		],
		'shape_type' => [
			'type'    => 'string',
			'default' => 'POLYGON',
			'enum'    => cns_map_suite_shape_types(),
		],
		'object_time' => [
			'type'    => 'integer',
			'default' => 0,
		],
		'nodes' => [
			'type'    => 'string',
			'default' => '[]',
		],
		'style_fill' => [
			'type'              => 'string',
			'default'           => '#2271b14d',
			'sanitize_callback' => fn($v) => cns_map_suite_sanitize_color((string) $v, '#2271b14d'),
		],
		'style_stroke' => [
			'type'              => 'string',
			'default'           => '#2271b1',
			'sanitize_callback' => fn($v) => cns_map_suite_sanitize_color((string) $v, '#2271b1'),
		],
		'style_stroke_width' => [
			'type'    => 'integer',
			'default' => 2,
			'minimum' => 1,
			'maximum' => 10,
		],
		'style_label_hidden' => [
			'type'    => 'boolean',
			'default' => false,
		],
		'style_label_font_family' => [
			'type'              => 'string',
			'default'           => 'sans-serif',
			'sanitize_callback' => fn($v) => cns_map_suite_sanitize_font_family((string) $v),
		],
		'style_label_font_size' => [
			'type'    => 'integer',
			'default' => 12,
			'minimum' => 6,
			'maximum' => 96,
		],
		'style_label_color' => [
			'type'              => 'string',
			'default'           => '#ffffff',
			'sanitize_callback' => fn($v) => cns_map_suite_sanitize_color((string) $v, '#ffffff'),
		],
	]);
}

// ── Areas — helpers ───────────────────────────────────────────────────────────

function cns_map_suite_area_styles_from_args(WP_REST_Request $request): string {
	return wp_json_encode([
		'fill'            => (string) $request->get_param('style_fill'),
		'stroke'          => (string) $request->get_param('style_stroke'),
		'strokeWidth'     => (int)    $request->get_param('style_stroke_width'),
		'labelHidden'     => (bool)   $request->get_param('style_label_hidden'),
		'labelFontFamily' => (string) $request->get_param('style_label_font_family'),
		'labelFontSize'   => (int)    $request->get_param('style_label_font_size'),
		'labelColor'      => (string) $request->get_param('style_label_color'),
	]);
}

function cns_map_suite_normalize_area_row(array $row): array {
	$row = cns_map_suite_normalize_row(
		$row,
		['canvas_styles', 'infobox_data'],
		['id', 'map_id', 'linked_post_id', 'background_image_id', 'object_time']
	);
	// Nodes are a list, so empty must decode to [] (not the (object)[] the
	// generic helper uses for style/infobox bags).
	$row['nodes'] = is_string($row['nodes'] ?? null) && $row['nodes'] !== ''
		? (json_decode($row['nodes'], true) ?: [])
		: [];
	return $row;
}

// ── Areas — CRUD ──────────────────────────────────────────────────────────────

function cns_map_suite_rest_list_areas(WP_REST_Request $request): WP_REST_Response|WP_Error {
	global $wpdb;
	$map_id = (int) $request->get_param('map_id');

	if (!get_post($map_id) || get_post_type($map_id) !== 'maps') {
		return new WP_Error('invalid_map', __('Map not found.', 'clouds-and-spaceships'), ['status' => 404]);
	}

	$rows = $wpdb->get_results(
		$wpdb->prepare("SELECT * FROM {$wpdb->prefix}cns_map_areas WHERE map_id = %d ORDER BY id ASC", $map_id),
		ARRAY_A
	);

	return new WP_REST_Response(array_map('cns_map_suite_normalize_area_row', $rows ?: []), 200);
}

function cns_map_suite_rest_create_area(WP_REST_Request $request): WP_REST_Response|WP_Error {
	global $wpdb;
	$map_id = (int) $request->get_param('map_id');

	if (!get_post($map_id) || get_post_type($map_id) !== 'maps') {
		return new WP_Error('invalid_map', __('Map not found.', 'clouds-and-spaceships'), ['status' => 404]);
	}

	$nodes_raw     = $request->get_param('nodes');
	$nodes_decoded = json_decode($nodes_raw, true);
	if (!is_array($nodes_decoded)) $nodes_decoded = [];

	$ib = cns_map_suite_infobox_fields_from_request($request);
	if (is_wp_error($ib)) {
		return $ib;
	}

	$wpdb->insert(
		$wpdb->prefix . 'cns_map_areas',
		[
			'map_id'         => $map_id,
			'linked_post_id' => $ib['linked_post_id'],
			'type'           => $request->get_param('type'),
			'shape_type'     => $request->get_param('shape_type'),
			'title'          => $request->get_param('title'),
			'object_time'    => $request->get_param('object_time'),
			'nodes'          => wp_json_encode($nodes_decoded),
			'infobox_source' => $ib['infobox_source'],
			'infobox_data'   => $ib['infobox_data'],
			'canvas_styles'  => cns_map_suite_area_styles_from_args($request),
		],
		['%d', '%d', '%s', '%s', '%s', '%d', '%s', '%s', '%s', '%s']
	);

	if (!$wpdb->insert_id) {
		return new WP_Error('db_error', __('Failed to save area.', 'clouds-and-spaceships'), ['status' => 500]);
	}

	$row = $wpdb->get_row(
		$wpdb->prepare("SELECT * FROM {$wpdb->prefix}cns_map_areas WHERE id = %d", $wpdb->insert_id),
		ARRAY_A
	);

	return new WP_REST_Response(cns_map_suite_normalize_area_row($row), 201);
}

function cns_map_suite_rest_update_area(WP_REST_Request $request): WP_REST_Response|WP_Error {
	global $wpdb;
	$id = (int) $request->get_param('id');

	$existing = $wpdb->get_row(
		$wpdb->prepare("SELECT id FROM {$wpdb->prefix}cns_map_areas WHERE id = %d", $id)
	);

	if (!$existing) {
		return new WP_Error('not_found', __('Area not found.', 'clouds-and-spaceships'), ['status' => 404]);
	}

	$nodes_raw     = $request->get_param('nodes');
	$nodes_decoded = json_decode($nodes_raw, true);
	if (!is_array($nodes_decoded)) $nodes_decoded = [];

	$ib = cns_map_suite_infobox_fields_from_request($request);
	if (is_wp_error($ib)) {
		return $ib;
	}

	$result = $wpdb->update(
		$wpdb->prefix . 'cns_map_areas',
		[
			'linked_post_id' => $ib['linked_post_id'],
			'type'           => $request->get_param('type'),
			'shape_type'     => $request->get_param('shape_type'),
			'title'          => $request->get_param('title'),
			'object_time'    => $request->get_param('object_time'),
			'nodes'          => wp_json_encode($nodes_decoded),
			'infobox_source' => $ib['infobox_source'],
			'infobox_data'   => $ib['infobox_data'],
			'canvas_styles'  => cns_map_suite_area_styles_from_args($request),
		],
		['id' => $id],
		['%d', '%s', '%s', '%s', '%d', '%s', '%s', '%s', '%s'],
		['%d']
	);

	if ($result === false) {
		return new WP_Error('db_error', __('Failed to update area.', 'clouds-and-spaceships'), ['status' => 500]);
	}

	$row = $wpdb->get_row(
		$wpdb->prepare("SELECT * FROM {$wpdb->prefix}cns_map_areas WHERE id = %d", $id),
		ARRAY_A
	);

	return new WP_REST_Response(cns_map_suite_normalize_area_row($row), 200);
}

function cns_map_suite_rest_update_area_nodes(WP_REST_Request $request): WP_REST_Response|WP_Error {
	global $wpdb;
	$id = (int) $request->get_param('id');

	$existing = $wpdb->get_row(
		$wpdb->prepare("SELECT id FROM {$wpdb->prefix}cns_map_areas WHERE id = %d", $id)
	);

	if (!$existing) {
		return new WP_Error('not_found', __('Area not found.', 'clouds-and-spaceships'), ['status' => 404]);
	}

	$updates = [];
	$formats = [];

	if ($request->has_param('nodes')) {
		$nodes = json_decode((string) $request->get_param('nodes'), true);
		if (!is_array($nodes)) {
			return new WP_Error('invalid_nodes', __('Nodes must be a JSON array.', 'clouds-and-spaceships'), ['status' => 400]);
		}
		$updates['nodes'] = wp_json_encode($nodes);
		$formats[]        = '%s';
	}
	if ($request->has_param('shape_type')) {
		$updates['shape_type'] = $request->get_param('shape_type');
		$formats[]             = '%s';
	}

	if (!$updates) {
		return new WP_Error('missing_params', __('Provide nodes and/or shape_type.', 'clouds-and-spaceships'), ['status' => 400]);
	}

	$result = $wpdb->update(
		$wpdb->prefix . 'cns_map_areas',
		$updates,
		['id' => $id],
		$formats,
		['%d']
	);

	if ($result === false) {
		return new WP_Error('db_error', __('Failed to update area nodes.', 'clouds-and-spaceships'), ['status' => 500]);
	}

	$row = $wpdb->get_row(
		$wpdb->prepare("SELECT * FROM {$wpdb->prefix}cns_map_areas WHERE id = %d", $id),
		ARRAY_A
	);

	return new WP_REST_Response(cns_map_suite_normalize_area_row($row), 200);
}

function cns_map_suite_rest_delete_area(WP_REST_Request $request): WP_REST_Response|WP_Error {
	global $wpdb;
	$id = (int) $request->get_param('id');

	$existing = $wpdb->get_row(
		$wpdb->prepare("SELECT id FROM {$wpdb->prefix}cns_map_areas WHERE id = %d", $id)
	);

	if (!$existing) {
		return new WP_Error('not_found', __('Area not found.', 'clouds-and-spaceships'), ['status' => 404]);
	}

	$wpdb->delete($wpdb->prefix . 'cns_map_areas', ['id' => $id], ['%d']);
	return new WP_REST_Response(['deleted' => true], 200);
}

// ── Labels — shared args ──────────────────────────────────────────────────────

function cns_map_suite_label_rest_args(): array {
	return array_merge(cns_map_suite_infobox_rest_args(), [
		'text' => [
			'type'              => 'string',
			'default'           => '',
			'sanitize_callback' => 'sanitize_text_field',
		],
		'object_time' => [
			'type'    => 'integer',
			'default' => 0,
		],
		'placement' => [
			'type'    => 'string',
			'default' => 'centered',
			'enum'    => ['centered', 'indicator'],
		],
		'x' => [
			'type'    => 'integer',
			'default' => 0,
		],
		'y' => [
			'type'    => 'integer',
			'default' => 0,
		],
		'offset_x' => [
			'type'    => 'integer',
			'default' => 40,
			'minimum' => -2000,
			'maximum' => 2000,
		],
		'offset_y' => [
			'type'    => 'integer',
			'default' => -40,
			'minimum' => -2000,
			'maximum' => 2000,
		],
		'style_bg' => [
			'type'              => 'string',
			'default'           => '#ffffff',
			'sanitize_callback' => fn($v) => cns_map_suite_sanitize_color((string) $v, '#ffffff'),
		],
		'style_border' => [
			'type'              => 'string',
			'default'           => '#1e1e1e',
			'sanitize_callback' => fn($v) => cns_map_suite_sanitize_color((string) $v, '#1e1e1e'),
		],
		'style_text_color' => [
			'type'              => 'string',
			'default'           => '#1e1e1e',
			'sanitize_callback' => fn($v) => cns_map_suite_sanitize_color((string) $v, '#1e1e1e'),
		],

		'style_font_size' => [
			'type'    => 'integer',
			'default' => 14,
			'minimum' => 8,
			'maximum' => 64,
		],
	]);
}

// ── Labels — helpers ──────────────────────────────────────────────────────────

// Infobox fields (linked_post_id / infobox_source / infobox_data) are merged
// in by the handlers via cns_map_suite_infobox_fields_from_request(); the
// insert/update format arrays follow this order plus those three.
function cns_map_suite_label_row_from_args(WP_REST_Request $request): array {
	return [
		'text'          => $request->get_param('text'),
		'placement'     => $request->get_param('placement'),
		'x'             => (int) $request->get_param('x'),
		'y'             => (int) $request->get_param('y'),
		'offset_x'      => (int) $request->get_param('offset_x'),
		'offset_y'      => (int) $request->get_param('offset_y'),
		'object_time'   => (int) $request->get_param('object_time'),
		'canvas_styles' => wp_json_encode([
			'bgColor'     => (string) $request->get_param('style_bg'),
			'borderColor' => (string) $request->get_param('style_border'),
			'textColor'   => (string) $request->get_param('style_text_color'),
			'fontSize'    => (int) $request->get_param('style_font_size'),
		]),
	];
}

function cns_map_suite_normalize_label_row(array $row): array {
	$row = cns_map_suite_normalize_row(
		$row,
		['canvas_styles', 'infobox_data'],
		['id', 'map_id', 'linked_post_id', 'x', 'y', 'offset_x', 'offset_y', 'object_time']
	);
	$row['infobox_source'] = $row['infobox_source'] ?? 'manual';
	return $row;
}

// ── Labels — CRUD ─────────────────────────────────────────────────────────────

function cns_map_suite_rest_list_labels(WP_REST_Request $request): WP_REST_Response|WP_Error {
	global $wpdb;
	$map_id = (int) $request->get_param('map_id');

	if (!get_post($map_id) || get_post_type($map_id) !== 'maps') {
		return new WP_Error('invalid_map', __('Map not found.', 'clouds-and-spaceships'), ['status' => 404]);
	}

	$rows = $wpdb->get_results(
		$wpdb->prepare("SELECT * FROM {$wpdb->prefix}cns_map_labels WHERE map_id = %d ORDER BY id ASC", $map_id),
		ARRAY_A
	);

	return new WP_REST_Response(array_map('cns_map_suite_normalize_label_row', $rows ?: []), 200);
}

function cns_map_suite_rest_create_label(WP_REST_Request $request): WP_REST_Response|WP_Error {
	global $wpdb;
	$map_id = (int) $request->get_param('map_id');

	if (!get_post($map_id) || get_post_type($map_id) !== 'maps') {
		return new WP_Error('invalid_map', __('Map not found.', 'clouds-and-spaceships'), ['status' => 404]);
	}

	$ib = cns_map_suite_infobox_fields_from_request($request);
	if (is_wp_error($ib)) {
		return $ib;
	}

	$row           = array_merge(cns_map_suite_label_row_from_args($request), $ib);
	$row['map_id'] = $map_id;

	$wpdb->insert(
		$wpdb->prefix . 'cns_map_labels',
		$row,
		// text, placement, x, y, offset_x, offset_y, object_time,
		// canvas_styles, linked_post_id, infobox_source, infobox_data, map_id
		['%s', '%s', '%d', '%d', '%d', '%d', '%d', '%s', '%d', '%s', '%s', '%d']
	);

	if (!$wpdb->insert_id) {
		return new WP_Error('db_error', __('Failed to save label.', 'clouds-and-spaceships'), ['status' => 500]);
	}

	$saved = $wpdb->get_row(
		$wpdb->prepare("SELECT * FROM {$wpdb->prefix}cns_map_labels WHERE id = %d", $wpdb->insert_id),
		ARRAY_A
	);

	return new WP_REST_Response(cns_map_suite_normalize_label_row($saved), 201);
}

function cns_map_suite_rest_update_label(WP_REST_Request $request): WP_REST_Response|WP_Error {
	global $wpdb;
	$id = (int) $request->get_param('id');

	$existing = $wpdb->get_row(
		$wpdb->prepare("SELECT id FROM {$wpdb->prefix}cns_map_labels WHERE id = %d", $id)
	);

	if (!$existing) {
		return new WP_Error('not_found', __('Label not found.', 'clouds-and-spaceships'), ['status' => 404]);
	}

	$ib = cns_map_suite_infobox_fields_from_request($request);
	if (is_wp_error($ib)) {
		return $ib;
	}

	$result = $wpdb->update(
		$wpdb->prefix . 'cns_map_labels',
		array_merge(cns_map_suite_label_row_from_args($request), $ib),
		['id' => $id],
		// text, placement, x, y, offset_x, offset_y, object_time,
		// canvas_styles, linked_post_id, infobox_source, infobox_data
		['%s', '%s', '%d', '%d', '%d', '%d', '%d', '%s', '%d', '%s', '%s'],
		['%d']
	);

	if ($result === false) {
		return new WP_Error('db_error', __('Failed to update label.', 'clouds-and-spaceships'), ['status' => 500]);
	}

	$row = $wpdb->get_row(
		$wpdb->prepare("SELECT * FROM {$wpdb->prefix}cns_map_labels WHERE id = %d", $id),
		ARRAY_A
	);

	return new WP_REST_Response(cns_map_suite_normalize_label_row($row), 200);
}

function cns_map_suite_rest_delete_label(WP_REST_Request $request): WP_REST_Response|WP_Error {
	global $wpdb;
	$id = (int) $request->get_param('id');

	$existing = $wpdb->get_row(
		$wpdb->prepare("SELECT id FROM {$wpdb->prefix}cns_map_labels WHERE id = %d", $id)
	);

	if (!$existing) {
		return new WP_Error('not_found', __('Label not found.', 'clouds-and-spaceships'), ['status' => 404]);
	}

	$wpdb->delete($wpdb->prefix . 'cns_map_labels', ['id' => $id], ['%d']);
	return new WP_REST_Response(['deleted' => true], 200);
}

function cns_map_suite_rest_move_label(WP_REST_Request $request): WP_REST_Response|WP_Error {
	global $wpdb;
	$id = (int) $request->get_param('id');

	$existing = $wpdb->get_row(
		$wpdb->prepare("SELECT id FROM {$wpdb->prefix}cns_map_labels WHERE id = %d", $id)
	);

	if (!$existing) {
		return new WP_Error('not_found', __('Label not found.', 'clouds-and-spaceships'), ['status' => 404]);
	}

	$updates = [];
	foreach (['x', 'y', 'offset_x', 'offset_y'] as $field) {
		if ($request->has_param($field)) {
			$updates[$field] = (int) $request->get_param($field);
		}
	}

	if (!$updates) {
		return new WP_Error('missing_params', __('Provide x/y and/or offset_x/offset_y.', 'clouds-and-spaceships'), ['status' => 400]);
	}

	$wpdb->update(
		$wpdb->prefix . 'cns_map_labels',
		$updates,
		['id' => $id],
		array_fill(0, count($updates), '%d'),
		['%d']
	);

	$row = $wpdb->get_row(
		$wpdb->prepare("SELECT * FROM {$wpdb->prefix}cns_map_labels WHERE id = %d", $id),
		ARRAY_A
	);

	return new WP_REST_Response(cns_map_suite_normalize_label_row($row), 200);
}

// ── Hierarchy — shared args ───────────────────────────────────────────────────

function cns_map_suite_hierarchy_rest_args(): array {
	return [
		'child_map_id' => [
			'type'              => 'integer',
			'required'          => true,
			'sanitize_callback' => 'absint',
		],
		'shape_type' => [
			'type'    => 'string',
			'default' => 'POLYGON',
			'enum'    => cns_map_suite_shape_types(),
		],
		'nodes' => [
			'type'    => 'string',
			'default' => '[]',
		],
		'style_fill' => [
			'type'              => 'string',
			'default'           => '#e8a02040',
			'sanitize_callback' => fn($v) => cns_map_suite_sanitize_color((string) $v, '#e8a02040'),
		],
		'style_stroke' => [
			'type'              => 'string',
			'default'           => '#e8a020',
			'sanitize_callback' => fn($v) => cns_map_suite_sanitize_color((string) $v, '#e8a020'),
		],
		'style_stroke_width' => [
			'type'    => 'integer',
			'default' => 2,
			'minimum' => 1,
			'maximum' => 10,
		],
		'style_label_hidden' => [
			'type'    => 'boolean',
			'default' => false,
		],
		'style_label_font_family' => [
			'type'              => 'string',
			'default'           => 'sans-serif',
			'sanitize_callback' => fn($v) => cns_map_suite_sanitize_font_family((string) $v),
		],
		'style_label_font_size' => [
			'type'    => 'integer',
			'default' => 12,
			'minimum' => 6,
			'maximum' => 96,
		],
		'style_label_color' => [
			'type'              => 'string',
			'default'           => '#ffffff',
			'sanitize_callback' => fn($v) => cns_map_suite_sanitize_color((string) $v, '#ffffff'),
		],
		'style_tip_bg' => [
			'type'              => 'string',
			'default'           => '#000000d1',
			'sanitize_callback' => fn($v) => cns_map_suite_sanitize_color((string) $v, '#000000d1'),
		],
		'style_tip_border' => [
			'type'              => 'string',
			'default'           => '#ffffff26',
			'sanitize_callback' => fn($v) => cns_map_suite_sanitize_color((string) $v, '#ffffff26'),
		],
		'style_tip_text' => [
			'type'              => 'string',
			'default'           => '#ffffff',
			'sanitize_callback' => fn($v) => cns_map_suite_sanitize_color((string) $v, '#ffffff'),
		],
		'title_override' => [
			'type'    => 'string',
			'default' => '',
		],
		'description_override' => [
			'type'    => 'string',
			'default' => '',
		],
	];
}

// ── Hierarchy — helpers ───────────────────────────────────────────────────────

function cns_map_suite_normalize_hierarchy_row(array $row): array {
	$row['nodes']         = $row['nodes']         ? json_decode($row['nodes'], true) : [];
	$row['canvas_styles'] = $row['canvas_styles']  ? json_decode($row['canvas_styles'], true) : (object) [];
	$row['shape_type']    = (string) (($row['shape_type'] ?? '') ?: 'POLYGON');
	foreach (['id', 'parent_map_id', 'child_map_id'] as $k) {
		$row[$k] = (int) ($row[$k] ?? 0);
	}
	$row['title_override']       = $row['title_override']       ?? null;
	$row['description_override'] = $row['description_override'] ?? null;

	// Attach child map preview data for the admin UI.
	$child = get_post((int) $row['child_map_id']);
	$row['child_map_title']     = $child ? ($child->post_title ?: __('(no title)', 'clouds-and-spaceships')) : '';
	// Raw excerpt only — get_the_excerpt() would fall back to trimming
	// post_content, which now holds the map description. The description must
	// not surface where a map is merely used as a base (region previews).
	$row['child_map_excerpt']   = $child ? $child->post_excerpt : '';
	$row['child_map_status']    = $child ? $child->post_status : '';
	$image_id = $child ? (int) get_post_meta($child->ID, '_cns_map_image_id', true) : 0;
	$row['child_map_thumbnail'] = $image_id ? (wp_get_attachment_image_url($image_id, 'thumbnail') ?: '') : '';
	$row['child_map_url']       = $child ? (get_permalink($child) ?: '') : '';

	return $row;
}

// ── Hierarchy — CRUD ──────────────────────────────────────────────────────────

function cns_map_suite_rest_list_hierarchy(WP_REST_Request $request): WP_REST_Response|WP_Error {
	global $wpdb;
	$map_id = (int) $request->get_param('map_id');

	if (!get_post($map_id) || get_post_type($map_id) !== 'maps') {
		return new WP_Error('invalid_map', __('Map not found.', 'clouds-and-spaceships'), ['status' => 404]);
	}

	$rows = $wpdb->get_results(
		$wpdb->prepare("SELECT * FROM {$wpdb->prefix}cns_map_hierarchy WHERE parent_map_id = %d ORDER BY id ASC", $map_id),
		ARRAY_A
	);

	return new WP_REST_Response(array_map('cns_map_suite_normalize_hierarchy_row', $rows ?: []), 200);
}

function cns_map_suite_rest_create_hierarchy_region(WP_REST_Request $request): WP_REST_Response|WP_Error {
	global $wpdb;
	$map_id      = (int) $request->get_param('map_id');
	$child_map_id = (int) $request->get_param('child_map_id');

	if (!get_post($map_id) || get_post_type($map_id) !== 'maps') {
		return new WP_Error('invalid_map', __('Map not found.', 'clouds-and-spaceships'), ['status' => 404]);
	}
	if (!get_post($child_map_id) || get_post_type($child_map_id) !== 'maps') {
		return new WP_Error('invalid_child', __('Child map not found.', 'clouds-and-spaceships'), ['status' => 404]);
	}
	if ($map_id === $child_map_id) {
		return new WP_Error('self_link', __('A map cannot link to itself.', 'clouds-and-spaceships'), ['status' => 400]);
	}

	$nodes_raw     = $request->get_param('nodes');
	$nodes_decoded = json_decode($nodes_raw, true);
	if (!is_array($nodes_decoded)) $nodes_decoded = [];

	$canvas_styles = wp_json_encode([
		'fill'            => (string) $request->get_param('style_fill'),
		'stroke'          => (string) $request->get_param('style_stroke'),
		'strokeWidth'     => (int)    $request->get_param('style_stroke_width'),
		'labelHidden'     => (bool)   $request->get_param('style_label_hidden'),
		'labelFontFamily' => (string) $request->get_param('style_label_font_family'),
		'labelFontSize'   => (int)    $request->get_param('style_label_font_size'),
		'labelColor'      => (string) $request->get_param('style_label_color'),
		'tipBgColor'      => (string) $request->get_param('style_tip_bg'),
		'tipBorderColor'  => (string) $request->get_param('style_tip_border'),
		'tipTextColor'    => (string) $request->get_param('style_tip_text'),
	]);

	$title_override       = (string) $request->get_param('title_override');
	$description_override = (string) $request->get_param('description_override');

	$inserted = $wpdb->insert(
		$wpdb->prefix . 'cns_map_hierarchy',
		[
			'parent_map_id'        => $map_id,
			'child_map_id'         => $child_map_id,
			'shape_type'           => $request->get_param('shape_type'),
			'nodes'                => wp_json_encode($nodes_decoded),
			'canvas_styles'        => $canvas_styles,
			'title_override'       => $title_override !== '' ? $title_override : null,
			'description_override' => $description_override !== '' ? $description_override : null,
		],
		['%d', '%d', '%s', '%s', '%s', '%s', '%s']
	);

	if (!$inserted) {
		// Duplicate (parent+child pair already exists): return existing row.
		$row = $wpdb->get_row(
			$wpdb->prepare(
				"SELECT * FROM {$wpdb->prefix}cns_map_hierarchy WHERE parent_map_id = %d AND child_map_id = %d",
				$map_id, $child_map_id
			),
			ARRAY_A
		);
		if ($row) return new WP_REST_Response(cns_map_suite_normalize_hierarchy_row($row), 200);
		return new WP_Error('db_error', __('Failed to save hierarchy region.', 'clouds-and-spaceships'), ['status' => 500]);
	}

	$row = $wpdb->get_row(
		$wpdb->prepare("SELECT * FROM {$wpdb->prefix}cns_map_hierarchy WHERE id = %d", $wpdb->insert_id),
		ARRAY_A
	);

	return new WP_REST_Response(cns_map_suite_normalize_hierarchy_row($row), 201);
}

function cns_map_suite_rest_update_hierarchy_region(WP_REST_Request $request): WP_REST_Response|WP_Error {
	global $wpdb;
	$id = (int) $request->get_param('id');

	$existing = $wpdb->get_row(
		$wpdb->prepare("SELECT id FROM {$wpdb->prefix}cns_map_hierarchy WHERE id = %d", $id)
	);
	if (!$existing) {
		return new WP_Error('not_found', __('Hierarchy region not found.', 'clouds-and-spaceships'), ['status' => 404]);
	}

	$nodes_raw     = $request->get_param('nodes');
	$nodes_decoded = json_decode($nodes_raw, true);
	if (!is_array($nodes_decoded)) $nodes_decoded = [];

	$canvas_styles = wp_json_encode([
		'fill'            => (string) $request->get_param('style_fill'),
		'stroke'          => (string) $request->get_param('style_stroke'),
		'strokeWidth'     => (int)    $request->get_param('style_stroke_width'),
		'labelHidden'     => (bool)   $request->get_param('style_label_hidden'),
		'labelFontFamily' => (string) $request->get_param('style_label_font_family'),
		'labelFontSize'   => (int)    $request->get_param('style_label_font_size'),
		'labelColor'      => (string) $request->get_param('style_label_color'),
		'tipBgColor'      => (string) $request->get_param('style_tip_bg'),
		'tipBorderColor'  => (string) $request->get_param('style_tip_border'),
		'tipTextColor'    => (string) $request->get_param('style_tip_text'),
	]);

	$title_override       = (string) $request->get_param('title_override');
	$description_override = (string) $request->get_param('description_override');

	$wpdb->update(
		$wpdb->prefix . 'cns_map_hierarchy',
		[
			'shape_type'           => $request->get_param('shape_type'),
			'nodes'                => wp_json_encode($nodes_decoded),
			'canvas_styles'        => $canvas_styles,
			'title_override'       => $title_override !== '' ? $title_override : null,
			'description_override' => $description_override !== '' ? $description_override : null,
		],
		['id' => $id],
		['%s', '%s', '%s', '%s', '%s'],
		['%d']
	);

	$row = $wpdb->get_row(
		$wpdb->prepare("SELECT * FROM {$wpdb->prefix}cns_map_hierarchy WHERE id = %d", $id),
		ARRAY_A
	);

	return new WP_REST_Response(cns_map_suite_normalize_hierarchy_row($row), 200);
}

function cns_map_suite_rest_delete_hierarchy_region(WP_REST_Request $request): WP_REST_Response|WP_Error {
	global $wpdb;
	$id = (int) $request->get_param('id');

	$existing = $wpdb->get_row(
		$wpdb->prepare("SELECT id FROM {$wpdb->prefix}cns_map_hierarchy WHERE id = %d", $id)
	);
	if (!$existing) {
		return new WP_Error('not_found', __('Hierarchy region not found.', 'clouds-and-spaceships'), ['status' => 404]);
	}

	$wpdb->delete($wpdb->prefix . 'cns_map_hierarchy', ['id' => $id], ['%d']);
	return new WP_REST_Response(['deleted' => true], 200);
}

function cns_map_suite_rest_list_parents(WP_REST_Request $request): WP_REST_Response|WP_Error {
	global $wpdb;
	$map_id = (int) $request->get_param('map_id');

	if (!get_post($map_id) || get_post_type($map_id) !== 'maps') {
		return new WP_Error('invalid_map', __('Map not found.', 'clouds-and-spaceships'), ['status' => 404]);
	}

	$rows = $wpdb->get_results(
		$wpdb->prepare(
			"SELECT h.id, h.parent_map_id FROM {$wpdb->prefix}cns_map_hierarchy h WHERE h.child_map_id = %d",
			$map_id
		),
		ARRAY_A
	);

	$parents = array_map(function ($row) {
		$parent = get_post((int) $row['parent_map_id']);
		$image_id = $parent ? (int) get_post_meta($parent->ID, '_cns_map_image_id', true) : 0;
		return [
			'map_id'    => (int) $row['parent_map_id'],
			'title'     => $parent ? ($parent->post_title ?: __('(no title)', 'clouds-and-spaceships')) : '',
			'status'    => $parent ? $parent->post_status : '',
			'thumbnail' => $image_id ? (wp_get_attachment_image_url($image_id, 'thumbnail') ?: '') : '',
			'url'       => $parent ? (get_permalink($parent) ?: '') : '',
		];
	}, $rows ?: []);

	return new WP_REST_Response(array_values($parents), 200);
}

// ── Objects — move ────────────────────────────────────────────────────────────

function cns_map_suite_rest_move_object(WP_REST_Request $request): WP_REST_Response|WP_Error {
	global $wpdb;
	$id = (int) $request->get_param('id');

	$existing = $wpdb->get_row(
		$wpdb->prepare("SELECT id FROM {$wpdb->prefix}cns_map_objects WHERE id = %d", $id)
	);

	if (!$existing) {
		return new WP_Error('not_found', __('Object not found.', 'clouds-and-spaceships'), ['status' => 404]);
	}

	$wpdb->update(
		$wpdb->prefix . 'cns_map_objects',
		['x' => (int) $request->get_param('x'), 'y' => (int) $request->get_param('y')],
		['id' => $id],
		['%d', '%d'],
		['%d']
	);

	$row = $wpdb->get_row(
		$wpdb->prepare("SELECT * FROM {$wpdb->prefix}cns_map_objects WHERE id = %d", $id),
		ARRAY_A
	);

	return new WP_REST_Response(cns_map_suite_normalize_object_row($row), 200);
}
