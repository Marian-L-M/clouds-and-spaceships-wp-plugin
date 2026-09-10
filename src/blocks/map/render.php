<?php

defined('ABSPATH') || exit;

$map_id = (int) ($attributes['mapId'] ?? 0);

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

// Map description (post_content, maintained via the editor's Description tab).
// Rendered only here, beneath the block — contexts that use the map as a base
// (story blocks, master-map regions) read map data through the shared API and
// never see it.
$description = trim($map->post_content);

$wrapper_attrs = get_block_wrapper_attributes([
	'class'       => 'cns-map',
	'data-map-id' => (string) $map_id,
]);
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
	<div class="cns-map-contents-wrap">
		<article>
			<?php the_modified_date("Y.m.d")?>
		<?php if ('' !== $description) : ?>
			<div class="cns-map-description"><?php echo wp_kses_post(wpautop($description)); ?></div>
		<?php endif; ?>
		</article>
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