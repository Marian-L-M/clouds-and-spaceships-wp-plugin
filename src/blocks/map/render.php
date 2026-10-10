<?php

/**
 * Server-side render for the clouansp-map-suite/map block.
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block content (unused; dynamic block).
 * @var WP_Block $block      Block instance.
 */

defined('ABSPATH') || exit;

$clouansp_map_id = (int) ($attributes['mapId'] ?? 0);

// No ID means the block is standing in for "whichever map is being viewed" —
// how the single-maps template uses it. Core seeds postId/postType from the
// global post, so this only resolves on a map's own page.
if (! $clouansp_map_id && ($block->context['postType'] ?? '') === 'clouansp_map') {
	$clouansp_map_id = (int) ($block->context['postId'] ?? 0);
}

if (! $clouansp_map_id) {
	return;
}

$clouansp_map = get_post($clouansp_map_id);

if (! $clouansp_map || $clouansp_map->post_type !== 'clouansp_map') {
	return;
}

// Respect post status: draft/pending only visible to map managers; private requires read_private_posts.
if ($clouansp_map->post_status === 'private' && ! current_user_can('read_private_posts')) {
	return;
}
if (! in_array($clouansp_map->post_status, ['publish', 'private'], true) && ! current_user_can('clouansp_manage_maps')) {
	return;
}

// ── Map data (shared API — single source of truth, also used by the story block) ──

$clouansp_data = clouansp_map_suite_get_map_data($clouansp_map_id, [
	'hierarchy'         => true,
	'parents'           => true,
	'resolve_infoboxes' => true,
]);

if (! $clouansp_data) {
	return;
}

// MasterMap regions: apply the same visibility rules to each child map that
// gate the map itself above — otherwise draft/private child maps would leak
// their title/excerpt/thumbnail/URL to visitors and navigate to a 404.
$clouansp_visible_regions = array_values(array_filter(
	$clouansp_data['hierarchy_regions'],
	static function (array $region): bool {
		$status = $region['child_map_status'] ?? '';
		if ($status === 'publish') {
			return true;
		}
		if ($status === 'private') {
			return current_user_can('read_private_posts');
		}
		return $status !== '' && current_user_can('clouansp_manage_maps');
	}
));

$clouansp_width  = $clouansp_data['width'];
$clouansp_height = $clouansp_data['height'];

$clouansp_map_data = [
	'mapId'            => $clouansp_map_id,
	'width'            => $clouansp_width,
	'height'           => $clouansp_height,
	'bgType'           => $clouansp_data['bg_type'],
	'bgColor'          => $clouansp_data['bg_color'],
	'bgImageUrl'       => $clouansp_data['bg_image_url'],
	'imgUrl'           => $clouansp_data['image_url'],
	'imageX'           => $clouansp_data['image_x'],
	'imageY'           => $clouansp_data['image_y'],
	'imageW'           => $clouansp_data['image_w'],
	'objects'          => $clouansp_data['objects'],
	'areas'            => $clouansp_data['areas'],
	'labels'           => $clouansp_data['labels'],
	'hierarchyRegions' => $clouansp_visible_regions,
	'parentMaps'       => $clouansp_data['parent_maps'],
	// Which layers the author left on. The frontend starts from these and
	// lets the visitor toggle from there.
	'showAreas'        => clouansp_map_suite_layer_visible($clouansp_map_id, '_clouansp_map_show_areas'),
	'showObjects'      => clouansp_map_suite_layer_visible($clouansp_map_id, '_clouansp_map_show_objects'),
	'showLabels'       => clouansp_map_suite_layer_visible($clouansp_map_id, '_clouansp_map_show_labels'),
];

// Wiki infoboxes shown in the drawer need no extra enqueue here:
// clouansp_map_suite_get_map_data() above renders them with render_block(),
// which enqueues each infobox block's own stylesheet. (Their Interactivity runtime is not needed either — view.js
// drives the drawer's expand/collapse itself.)

// The block renders the map itself and nothing else. Everything around it —
// title, author, last-updated date, the description held in post_content — is
// the single-map template's job (includes/map-template.php), so a map embedded
// in another post brings only its canvas along.
// Zoom control colors: the map's own override, else the global default, else
// nothing — in which case no style attribute is emitted and style.scss keeps
// the built-in look. See clouansp_map_suite_zoom_colors().
$clouansp_zoom_style = clouansp_map_suite_zoom_color_style($clouansp_map_id);

$clouansp_wrapper_attrs = get_block_wrapper_attributes(array_filter([
	'class'       => 'clouansp-map',
	'data-map-id' => (string) $clouansp_map_id,
	'style'       => $clouansp_zoom_style,
]));
?>
<div <?php echo $clouansp_wrapper_attrs; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() escapes its own output. ?>>
	<div class="clouansp-map-canvas-wrap">
		<canvas
			class="clouansp-map-canvas"
			width="<?php echo esc_attr($clouansp_width); ?>"
			height="<?php echo esc_attr($clouansp_height); ?>"
			aria-label="<?php echo esc_attr($clouansp_map->post_title); ?>"
		></canvas>
	</div>
	<script type="application/json" data-clouansp-map><?php echo wp_json_encode($clouansp_map_data, JSON_HEX_TAG | JSON_HEX_AMP); ?></script>
	<noscript>
		<p><?php
			printf(
				/* translators: %s: map title */
				esc_html__('Map: %s — JavaScript is required to view this interactive map.', 'clouds-and-spaceships'),
				esc_html($clouansp_map->post_title)
			);
		?></p>
	</noscript>
</div>