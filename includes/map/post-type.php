<?php

defined('ABSPATH') || exit;

// Register Map post type
function cns_map_suite_register_post_type(): void {
	// An enabled archive also means maps should be findable: a listing nobody
	// can search or link to from a menu would be half a feature.
	$archive_enabled = cns_archive_enabled('maps');

	register_post_type('maps', [
		'labels' => [
			'name'               => __('Maps', 'clouds-and-spaceships'),
			'singular_name'      => __('Map', 'clouds-and-spaceships'),
			'add_new'            => __('Add New Map', 'clouds-and-spaceships'),
			'add_new_item'       => __('Add New Map', 'clouds-and-spaceships'),
			'edit_item'          => __('Edit Map', 'clouds-and-spaceships'),
			'new_item'           => __('New Map', 'clouds-and-spaceships'),
			'view_item'          => __('View Map', 'clouds-and-spaceships'),
			'search_items'       => __('Search Maps', 'clouds-and-spaceships'),
			'not_found'          => __('No maps found', 'clouds-and-spaceships'),
			'not_found_in_trash' => __('No maps found in trash', 'clouds-and-spaceships'),
		],
		'public'              => true,
		'publicly_queryable'  => true,
		'show_in_rest'        => true,   // Required for block editor REST queries.
		'show_ui'             => true,
		// Off by default: maps are managed from the CNS editor pages. The
		// setting adds the standard WP list screen to the sidebar as well.
		'show_in_menu'        => (bool) get_option('cns_map_suite_show_maps_menu', false),
		'show_in_nav_menus'   => $archive_enabled,
		'exclude_from_search' => ! $archive_enabled,
		'has_archive'         => $archive_enabled,
		'rewrite'             => ['slug' => cns_archive_slug('maps')],
		'supports'            => ['title', 'editor', 'thumbnail', 'custom-fields', 'excerpt'],
		'capability_type'     => 'post',
	]);
}
add_action('init', 'cns_map_suite_register_post_type');

function cns_map_suite_register_post_meta(): void {
	$fields = [
		'_cns_map_featured'     => 'boolean',
		'_cns_map_width'        => 'integer',
		'_cns_map_aspect_ratio' => 'number',
		'_cns_map_time'         => 'integer',
		'_cns_map_image_id'     => 'integer',
		'_cns_map_image_x'      => 'number',
		'_cns_map_image_y'      => 'number',
		'_cns_map_image_width'  => 'number',
		'_cns_map_is_master'    => 'boolean',
		'_cns_map_bg_type'      => 'string',
		'_cns_map_bg_color'     => 'string',
		'_cns_map_bg_image_id'  => 'integer',
	];

	foreach ($fields as $key => $type) {
		register_post_meta('maps', $key, [
			'type'          => $type,
			'single'        => true,
			'show_in_rest'  => false,
			'auth_callback' => fn() => current_user_can('edit_posts'),
		]);
	}
}
add_action('init', 'cns_map_suite_register_post_meta');

// Disable Gutenberg for the maps CPT; Custom editor used.
function cns_map_suite_disable_gutenberg(bool $use_editor, string $post_type): bool {
	if ($post_type === 'maps') {
		return false;
	}
	return $use_editor;
}
add_filter('use_block_editor_for_post_type', 'cns_map_suite_disable_gutenberg', 10, 2);


// ── Standalone map page ───────────────────────────────────────────────────────
// On /maps/slug/ the CPT has no native content (Gutenberg disabled).
// Render the map block so the page shows the interactive canvas.
function cns_map_suite_inject_map_content(string $content): string {
	static $rendering = false;
	if ($rendering || ! is_singular('maps') || ! in_the_loop() || ! is_main_query()) {
		return $content;
	}
	$rendering = true;
	$result    = render_block([
		'blockName' => 'cns-map-suite/map',
		'attrs'     => ['mapId' => get_the_ID()],
	]);
	$rendering = false;
	return $result;
}
add_filter('the_content', 'cns_map_suite_inject_map_content', 5);

// Enqueue block assets early (styles in <head>) for single map pages.
// render_block() handles the viewScript, but style must be queued before wp_head().
function cns_map_suite_enqueue_map_page_assets(): void {
	$block = WP_Block_Type_Registry::get_instance()->get_registered('cns-map-suite/map');
	if (!is_singular('maps') || !$block) {
		return;
	}
	foreach ($block->style_handles as $handle) {
		wp_enqueue_style($handle);
	}
	foreach ($block->view_script_handles as $handle) {
		wp_enqueue_script($handle);
	}
}
add_action('wp_enqueue_scripts', 'cns_map_suite_enqueue_map_page_assets');

function cns_map_suite_get_all_maps(int $take = -1, int $skip = 0): array {
	return get_posts([
		'post_type'      => 'maps',
		'posts_per_page' => $take,
		'offset'         => $skip,
		'post_status'    => ['publish', 'draft', 'private'],
		'orderby'        => 'date',
		'order'          => 'DESC',
	]);
}

function cns_map_suite_count_maps(): int {
	$counts = wp_count_posts('maps');
	return (int) $counts->publish + (int) $counts->draft + (int) $counts->private;
}
