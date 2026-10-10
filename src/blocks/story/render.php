<?php
/**
 * Server-side render for clouansp-story-suite/story block.
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block content (unused; dynamic block).
 * @var WP_Block $block      Block instance.
 */

defined('ABSPATH') || exit;

/**
 * Direct database access notice.
 *
 * Reads the plugin's own clouansp_story_* tables, which have no WordPress API
 * equivalent, with every value passed through $wpdb->prepare(). The raw rows
 * are cached through clouansp_cache_get()/clouansp_cache_set() in includes/cache.php;
 * only the per-user serialization below stays live, because it applies
 * visibility rules that must not be shared between visitors.
 */
// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching

$clouansp_story_id = (int) ($attributes['storyId'] ?? 0);

// No ID means "whichever story is being viewed" — how the single-clouansp_story
// template uses it. Core seeds postId/postType from the global post, so this
// only resolves on a story's own page.
if (! $clouansp_story_id && ($block->context['postType'] ?? '') === 'clouansp_story') {
	$clouansp_story_id = (int) ($block->context['postId'] ?? 0);
}

if (! $clouansp_story_id) {
	return '';
}

$clouansp_story = get_post($clouansp_story_id);
if (! $clouansp_story || $clouansp_story->post_type !== 'clouansp_story') {
	return '';
}

// Respect post status: private requires read_private_posts; draft/pending only
// visible to story managers. Mirrors the gate in the map block's render.php.
if ($clouansp_story->post_status === 'private' && ! current_user_can('read_private_posts')) {
	return '';
}
if (! in_array($clouansp_story->post_status, ['publish', 'private'], true) && ! current_user_can('clouansp_manage_stories')) {
	return '';
}

global $wpdb;

$clouansp_map_id           = (int)    get_post_meta($clouansp_story_id, '_clouansp_story_map_id', true);
$clouansp_line_color       = (string) (get_post_meta($clouansp_story_id, '_clouansp_story_line_color', true)   ?: '#ffffff');
$clouansp_line_width       = (float)  (get_post_meta($clouansp_story_id, '_clouansp_story_line_width', true)   ?: 3.0);
$clouansp_line_style       = (string) (get_post_meta($clouansp_story_id, '_clouansp_story_line_style', true)   ?: 'solid');
$clouansp_start_node       = (int)    get_post_meta($clouansp_story_id, '_clouansp_story_start_node_id', true);
$clouansp_marker_color     = (string) (get_post_meta($clouansp_story_id, '_clouansp_story_marker_color', true)          ?: '#00aaff');
$clouansp_marker_size      = (float)  (get_post_meta($clouansp_story_id, '_clouansp_story_marker_size', true)           ?: 5.0);
$clouansp_marker_type      = (string) (get_post_meta($clouansp_story_id, '_clouansp_story_marker_type', true)           ?: 'ring');
$clouansp_marker_icon_id   = (int)    get_post_meta($clouansp_story_id, '_clouansp_story_marker_icon_id', true);
$clouansp_marker_icon_url  = $clouansp_marker_icon_id ? (wp_get_attachment_url($clouansp_marker_icon_id) ?: '') : '';
$clouansp_off_x_raw        = get_post_meta($clouansp_story_id, '_clouansp_story_marker_icon_offset_x', true);
$clouansp_off_y_raw        = get_post_meta($clouansp_story_id, '_clouansp_story_marker_icon_offset_y', true);
$clouansp_marker_off_x     = ($clouansp_off_x_raw !== '' && $clouansp_off_x_raw !== false) ? (float) $clouansp_off_x_raw : 0.0;
$clouansp_marker_off_y     = ($clouansp_off_y_raw !== '' && $clouansp_off_y_raw !== false) ? (float) $clouansp_off_y_raw : -30.0;

// Raw clouansp_story_* rows come from the render cache (includes/cache.php);
// serialization below stays live because it applies per-user visibility rules.
$clouansp_story_rows = clouansp_cache_get('story', $clouansp_story_id);
if (! isset($clouansp_story_rows['nodes'], $clouansp_story_rows['paths'], $clouansp_story_rows['edges'])) {
	$clouansp_story_rows = [
		'nodes' => $wpdb->get_results(
			$wpdb->prepare(
				"SELECT * FROM {$wpdb->prefix}clouansp_story_nodes WHERE story_id = %d ORDER BY created_at ASC, id ASC",
				$clouansp_story_id
			),
			ARRAY_A
		) ?: [],
		'paths' => $wpdb->get_results(
			$wpdb->prepare(
				"SELECT * FROM {$wpdb->prefix}clouansp_story_paths WHERE story_id = %d ORDER BY sort_order ASC, id ASC",
				$clouansp_story_id
			),
			ARRAY_A
		) ?: [],
		'edges' => $wpdb->get_results(
			$wpdb->prepare(
				"SELECT * FROM {$wpdb->prefix}clouansp_story_edges WHERE story_id = %d ORDER BY sort_order ASC, id ASC",
				$clouansp_story_id
			),
			ARRAY_A
		) ?: [],
	];
	clouansp_cache_set('story', $clouansp_story_id, $clouansp_story_rows);
}

$clouansp_raw_nodes = $clouansp_story_rows['nodes'];
$clouansp_raw_paths = $clouansp_story_rows['paths'];
$clouansp_raw_edges = $clouansp_story_rows['edges'];

// Row shaping is shared with the REST API (includes/story/serializers.php);
// $public = true gates unpublished substories and omits edit URLs.
$clouansp_paths = array_map(
	fn(array $r): array => clouansp_story_suite_serialize_path($r, true),
	$clouansp_raw_paths
);

clouansp_story_suite_prime_node_caches($clouansp_raw_nodes);

$clouansp_nodes = array_map(
	fn(array $row): array => clouansp_story_suite_serialize_node($row, true),
	$clouansp_raw_nodes
);

$clouansp_edges = array_map(fn(array $e): array => [
	'id'          => (int) $e['id'],
	'fromNodeId'  => (int) $e['from_node_id'],
	'toNodeId'    => (int) $e['to_node_id'],
	'sortOrder'   => (int) $e['sort_order'],
	'lineColor'   => $e['line_color'] ?? null,
	'lineWidth'   => isset($e['line_width'])   ? (float) $e['line_width']   : null,
	'lineStyle'   => $e['line_style']  ?? null,
], $clouansp_raw_edges);

// Map render data, with infoboxes resolved for the frontend click handlers.
// All map access goes through the public map-data API (includes/map/map-data.php),
// via clouansp_story_suite_get_map_render_data() in includes/story/admin/api.php.
$clouansp_map_data = null;
if ($clouansp_map_id) {
	$clouansp_map_data = clouansp_story_suite_get_map_render_data($clouansp_map_id, true);

	// MasterMap regions: hide child maps the visitor may not see (mirrors the
	// visibility rules in the map block's render.php) so draft/private
	// child titles/thumbnails don't leak to the frontend.
	if ($clouansp_map_data && ! empty($clouansp_map_data['hierarchyRegions'])) {
		$clouansp_map_data['hierarchyRegions'] = array_values(array_filter(
			$clouansp_map_data['hierarchyRegions'],
			static function (array $region): bool {
				$status = $region['status'] ?? '';
				if ($status === 'publish') {
					return true;
				}
				if ($status === 'private') {
					return current_user_can('read_private_posts');
				}
				return $status !== '' && current_user_can('clouansp_manage_maps');
			}
		));
	}
}

// Hides the story window, leaving the node dialog as the only way to read a
// node. Read before $clouansp_block_data so the markup below can drop the element.
$clouansp_hide_window = (bool) get_post_meta($clouansp_story_id, '_clouansp_story_hide_window', true);

$clouansp_block_data = [
	'story' => [
		'id'                => $clouansp_story_id,
		// Which base-map layers the author left on. The frontend starts from
		// these and lets the visitor toggle from there.
		'showAreas'         => clouansp_story_suite_layer_visible($clouansp_story_id, '_clouansp_story_show_areas'),
		'showObjects'       => clouansp_story_suite_layer_visible($clouansp_story_id, '_clouansp_story_show_objects'),
		'showLabels'        => clouansp_story_suite_layer_visible($clouansp_story_id, '_clouansp_story_show_labels'),
		// Opt-in front-end behaviour; both default off.
		'disableMapClick'   => (bool) get_post_meta($clouansp_story_id, '_clouansp_story_disable_map_click', true),
		'hideWindow'        => $clouansp_hide_window,
		'lineColor'         => $clouansp_line_color,
		'lineWidth'         => $clouansp_line_width,
		'lineStyle'         => $clouansp_line_style,
		'startNodeId'       => $clouansp_start_node ?: null,
		'markerColor'       => $clouansp_marker_color,
		'markerSize'        => $clouansp_marker_size,
		'markerType'        => $clouansp_marker_type,
		'markerIconUrl'     => $clouansp_marker_icon_url,
		'markerIconOffsetX' => $clouansp_marker_off_x,
		'markerIconOffsetY' => $clouansp_marker_off_y,
	],
	'mapData' => $clouansp_map_data,
	'paths'   => $clouansp_paths,
	'nodes'   => $clouansp_nodes,
	'edges'   => $clouansp_edges,
];

// Zoom/fullscreen control colors come from the linked map, so a story's chrome
// matches the map it is built on. Empty when the map sets neither and there is
// no global default, which leaves the stylesheet fallback in charge.
$clouansp_zoom_style = $clouansp_map_id ? clouansp_map_suite_zoom_color_style($clouansp_map_id) : '';

$clouansp_wrapper_attributes = get_block_wrapper_attributes(array_filter([
	'class' => 'clouansp-story-block' . ($clouansp_hide_window ? ' clouansp-story-block--no-window' : ''),
	'style' => $clouansp_zoom_style,
]));
?>
<div <?php echo $clouansp_wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() escapes its own output. ?> data-story-data="<?php echo esc_attr(wp_json_encode($clouansp_block_data)); ?>">
	<div class="clouansp-story-block__canvas-wrap">
		<canvas class="clouansp-story-canvas"></canvas>
	</div>
	<?php if (! $clouansp_hide_window) : ?>
		<div class="clouansp-story-window"></div>
	<?php endif; ?>
</div>
