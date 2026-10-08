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

$story_id = (int) ($attributes['storyId'] ?? 0);

// No ID means "whichever story is being viewed" — how the single-clouansp_story
// template uses it. Core seeds postId/postType from the global post, so this
// only resolves on a story's own page.
if (! $story_id && ($block->context['postType'] ?? '') === 'clouansp_story') {
	$story_id = (int) ($block->context['postId'] ?? 0);
}

if (! $story_id) {
	return '';
}

$story = get_post($story_id);
if (! $story || $story->post_type !== 'clouansp_story') {
	return '';
}

// Respect post status: private requires read_private_posts; draft/pending only
// visible to story managers. Mirrors the gate in clouansp-map-suite's map render.php.
if ($story->post_status === 'private' && ! current_user_can('read_private_posts')) {
	return '';
}
if (! in_array($story->post_status, ['publish', 'private'], true) && ! current_user_can('clouansp_manage_stories')) {
	return '';
}

global $wpdb;

$map_id           = (int)    get_post_meta($story_id, '_clouansp_story_map_id', true);
$line_color       = (string) (get_post_meta($story_id, '_clouansp_story_line_color', true)   ?: '#ffffff');
$line_width       = (float)  (get_post_meta($story_id, '_clouansp_story_line_width', true)   ?: 3.0);
$line_style       = (string) (get_post_meta($story_id, '_clouansp_story_line_style', true)   ?: 'solid');
$start_node       = (int)    get_post_meta($story_id, '_clouansp_story_start_node_id', true);
$marker_color     = (string) (get_post_meta($story_id, '_clouansp_story_marker_color', true)          ?: '#00aaff');
$marker_size      = (float)  (get_post_meta($story_id, '_clouansp_story_marker_size', true)           ?: 5.0);
$marker_type      = (string) (get_post_meta($story_id, '_clouansp_story_marker_type', true)           ?: 'ring');
$marker_icon_id   = (int)    get_post_meta($story_id, '_clouansp_story_marker_icon_id', true);
$marker_icon_url  = $marker_icon_id ? (wp_get_attachment_url($marker_icon_id) ?: '') : '';
$off_x_raw        = get_post_meta($story_id, '_clouansp_story_marker_icon_offset_x', true);
$off_y_raw        = get_post_meta($story_id, '_clouansp_story_marker_icon_offset_y', true);
$marker_off_x     = ($off_x_raw !== '' && $off_x_raw !== false) ? (float) $off_x_raw : 0.0;
$marker_off_y     = ($off_y_raw !== '' && $off_y_raw !== false) ? (float) $off_y_raw : -30.0;

// Raw clouansp_story_* rows come from the render cache (includes/cache.php);
// serialization below stays live because it applies per-user visibility rules.
$story_rows = clouansp_cache_get('story', $story_id);
if (! isset($story_rows['nodes'], $story_rows['paths'], $story_rows['edges'])) {
	$story_rows = [
		'nodes' => $wpdb->get_results(
			$wpdb->prepare(
				"SELECT * FROM {$wpdb->prefix}clouansp_story_nodes WHERE story_id = %d ORDER BY created_at ASC, id ASC",
				$story_id
			),
			ARRAY_A
		) ?: [],
		'paths' => $wpdb->get_results(
			$wpdb->prepare(
				"SELECT * FROM {$wpdb->prefix}clouansp_story_paths WHERE story_id = %d ORDER BY sort_order ASC, id ASC",
				$story_id
			),
			ARRAY_A
		) ?: [],
		'edges' => $wpdb->get_results(
			$wpdb->prepare(
				"SELECT * FROM {$wpdb->prefix}clouansp_story_edges WHERE story_id = %d ORDER BY sort_order ASC, id ASC",
				$story_id
			),
			ARRAY_A
		) ?: [],
	];
	clouansp_cache_set('story', $story_id, $story_rows);
}

$raw_nodes = $story_rows['nodes'];
$raw_paths = $story_rows['paths'];
$raw_edges = $story_rows['edges'];

// Row shaping is shared with the REST API (includes/serializers.php);
// $public = true gates unpublished substories and omits edit URLs.
$paths = array_map(
	fn(array $r): array => clouansp_story_suite_serialize_path($r, true),
	$raw_paths
);

clouansp_story_suite_prime_node_caches($raw_nodes);

$nodes = array_map(
	fn(array $row): array => clouansp_story_suite_serialize_node($row, true),
	$raw_nodes
);

$edges = array_map(fn(array $e): array => [
	'id'          => (int) $e['id'],
	'fromNodeId'  => (int) $e['from_node_id'],
	'toNodeId'    => (int) $e['to_node_id'],
	'sortOrder'   => (int) $e['sort_order'],
	'lineColor'   => $e['line_color'] ?? null,
	'lineWidth'   => isset($e['line_width'])   ? (float) $e['line_width']   : null,
	'lineStyle'   => $e['line_style']  ?? null,
], $raw_edges);

// Map render data, with infoboxes resolved for the frontend click handlers.
// All map access goes through map-suite's public API (via the adapter in api.php).
$map_data = null;
if ($map_id && function_exists('clouansp_story_suite_get_map_render_data')) {
	$map_data = clouansp_story_suite_get_map_render_data($map_id, true);

	// MasterMap regions: hide child maps the visitor may not see (mirrors the
	// visibility rules in clouansp-map-suite's map render.php) so draft/private
	// child titles/thumbnails don't leak to the frontend.
	if ($map_data && ! empty($map_data['hierarchyRegions'])) {
		$map_data['hierarchyRegions'] = array_values(array_filter(
			$map_data['hierarchyRegions'],
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
// node. Read before $block_data so the markup below can drop the element.
$hide_window = (bool) get_post_meta($story_id, '_clouansp_story_hide_window', true);

$block_data = [
	'story' => [
		'id'                => $story_id,
		// Which base-map layers the author left on. The frontend starts from
		// these and lets the visitor toggle from there.
		'showAreas'         => clouansp_story_suite_layer_visible($story_id, '_clouansp_story_show_areas'),
		'showObjects'       => clouansp_story_suite_layer_visible($story_id, '_clouansp_story_show_objects'),
		'showLabels'        => clouansp_story_suite_layer_visible($story_id, '_clouansp_story_show_labels'),
		// Opt-in front-end behaviour; both default off.
		'disableMapClick'   => (bool) get_post_meta($story_id, '_clouansp_story_disable_map_click', true),
		'hideWindow'        => $hide_window,
		'lineColor'         => $line_color,
		'lineWidth'         => $line_width,
		'lineStyle'         => $line_style,
		'startNodeId'       => $start_node ?: null,
		'markerColor'       => $marker_color,
		'markerSize'        => $marker_size,
		'markerType'        => $marker_type,
		'markerIconUrl'     => $marker_icon_url,
		'markerIconOffsetX' => $marker_off_x,
		'markerIconOffsetY' => $marker_off_y,
	],
	'mapData' => $map_data,
	'paths'   => $paths,
	'nodes'   => $nodes,
	'edges'   => $edges,
];

// Zoom/fullscreen control colors come from the linked map, so a story's chrome
// matches the map it is built on. Empty when the map sets neither and there is
// no global default, which leaves the stylesheet fallback in charge.
$zoom_style = ($map_id && function_exists('clouansp_map_suite_zoom_color_style'))
	? clouansp_map_suite_zoom_color_style($map_id)
	: '';

$wrapper_attributes = get_block_wrapper_attributes(array_filter([
	'class' => 'clouansp-story-block' . ($hide_window ? ' clouansp-story-block--no-window' : ''),
	'style' => $zoom_style,
]));
?>
<div <?php echo $wrapper_attributes; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() escapes its own output. ?> data-story-data="<?php echo esc_attr(wp_json_encode($block_data)); ?>">
	<div class="clouansp-story-block__canvas-wrap">
		<canvas class="clouansp-story-canvas"></canvas>
	</div>
	<?php if (! $hide_window) : ?>
		<div class="clouansp-story-window"></div>
	<?php endif; ?>
</div>
