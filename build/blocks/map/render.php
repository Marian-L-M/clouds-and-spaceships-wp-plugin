<?php

/**
 * Server-side render for the cns-map-suite/map block.
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block content (unused; dynamic block).
 * @var WP_Block $block      Block instance.
 */

defined('ABSPATH') || exit;

$map_id = (int) ($attributes['mapId'] ?? 0);

// No ID means the block is standing in for "whichever map is being viewed" —
// how the single-maps template uses it. Core seeds postId/postType from the
// global post, so this only resolves on a map's own page.
if (! $map_id && ($block->context['postType'] ?? '') === 'maps') {
	$map_id = (int) ($block->context['postId'] ?? 0);
}

if (! $map_id) {
	return;
}

$map = get_post($map_id);

if (! $map || $map->post_type !== 'maps') {
	return;
}

// Respect post status: draft/pending only visible to map managers; private requires read_private_posts.
if ($map->post_status === 'private' && ! current_user_can('read_private_posts')) {
	return;
}
if (! in_array($map->post_status, ['publish', 'private'], true) && ! current_user_can('manage_maps')) {
	return;
}

// ── Map data (shared API — single source of truth, also used by story-suite) ──

$data = cns_map_suite_get_map_data($map_id, [
	'hierarchy'         => true,
	'parents'           => true,
	'resolve_infoboxes' => true,
]);

if (! $data) {
	return;
}

// MasterMap regions: apply the same visibility rules to each child map that
// gate the map itself above — otherwise draft/private child maps would leak
// their title/excerpt/thumbnail/URL to visitors and navigate to a 404.
$visible_regions = array_values(array_filter(
	$data['hierarchy_regions'],
	static function (array $region): bool {
		$status = $region['child_map_status'] ?? '';
		if ($status === 'publish') {
			return true;
		}
		if ($status === 'private') {
			return current_user_can('read_private_posts');
		}
		return $status !== '' && current_user_can('manage_maps');
	}
));

$width  = $data['width'];
$height = $data['height'];

$map_data = [
	'mapId'            => $map_id,
	'width'            => $width,
	'height'           => $height,
	'bgType'           => $data['bg_type'],
	'bgColor'          => $data['bg_color'],
	'bgImageUrl'       => $data['bg_image_url'],
	'imgUrl'           => $data['image_url'],
	'imageX'           => $data['image_x'],
	'imageY'           => $data['image_y'],
	'imageW'           => $data['image_w'],
	'objects'          => $data['objects'],
	'areas'            => $data['areas'],
	'labels'           => $data['labels'],
	'hierarchyRegions' => $visible_regions,
	'parentMaps'       => $data['parent_maps'],
	// Which layers the author left on. The frontend starts from these and
	// lets the visitor toggle from there.
	'showAreas'        => cns_map_suite_layer_visible($map_id, '_cns_map_show_areas'),
	'showObjects'      => cns_map_suite_layer_visible($map_id, '_cns_map_show_objects'),
	'showLabels'       => cns_map_suite_layer_visible($map_id, '_cns_map_show_labels'),
];

// If any item resolves to wiki infoboxes, load the infobox block styles so the
// injected markup renders correctly inside the drawer. (The infobox collapse
// Interactivity runtime is intentionally not needed — view.js drives the
// drawer's expand/collapse itself.)
$has_infoboxes = false;
foreach (['objects', 'areas', 'labels'] as $group) {
	foreach ($data[$group] as $row) {
		if (! empty($row['infobox_resolved']['infoboxes'])) {
			$has_infoboxes = true;
			break 2;
		}
	}
}
if ($has_infoboxes) {
	foreach (['wp-block-cns-wiki-suite-infobox', 'wp-block-cns-wiki-suite-infobox-group', 'wp-block-cns-wiki-suite-infobox-row'] as $handle) {
		wp_enqueue_style($handle);
	}
}

// The block renders the map itself and nothing else. Everything around it —
// title, author, last-updated date, the description held in post_content — is
// the single-map template's job (includes/map-template.php), so a map embedded
// in another post brings only its canvas along.
// Zoom control colors: the map's own override, else the global default, else
// nothing — in which case no style attribute is emitted and style.scss keeps
// the built-in look. See cns_map_suite_zoom_colors().
$zoom_style = cns_map_suite_zoom_color_style($map_id);

$wrapper_attrs = get_block_wrapper_attributes(array_filter([
	'class'       => 'cns-map',
	'data-map-id' => (string) $map_id,
	'style'       => $zoom_style,
]));
?>
<div <?php echo $wrapper_attrs; ?>>
	<div class="cns-map-canvas-wrap">
		<canvas
			class="cns-map-canvas"
			width="<?php echo esc_attr($width); ?>"
			height="<?php echo esc_attr($height); ?>"
			aria-label="<?php echo esc_attr($map->post_title); ?>"
		></canvas>
	</div>
	<script type="application/json" data-cns-map><?php echo wp_json_encode($map_data, JSON_HEX_TAG | JSON_HEX_AMP); ?></script>
	<noscript>
		<p><?php
			printf(
				/* translators: %s: map title */
				esc_html__('Map: %s — JavaScript is required to view this interactive map.', 'clouds-and-spaceships'),
				esc_html($map->post_title)
			);
		?></p>
	</noscript>
</div>