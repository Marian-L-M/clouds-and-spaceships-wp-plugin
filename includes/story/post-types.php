<?php

defined('ABSPATH') || exit;

function cns_story_suite_register_post_types(): void {
	// Optional native admin-menu entries (toggled in the plugin settings).
	// The custom CNS editor pages remain the primary management UI; these
	// expose the standard WP list tables in the sidebar for quick access.
	$show_stories_menu    = (bool) get_option('cns_story_suite_show_stories_menu', false);
	$show_substories_menu = (bool) get_option('cns_story_suite_show_substories_menu', false);

	// ── Story CPT ─────────────────────────────────────────────────────────────
	register_post_type('cns_story', [
		'labels' => [
			'name'               => __('Stories', 'clouds-and-spaceships'),
			'singular_name'      => __('Story', 'clouds-and-spaceships'),
			'add_new'            => __('Add New Story', 'clouds-and-spaceships'),
			'add_new_item'       => __('Add New Story', 'clouds-and-spaceships'),
			'edit_item'          => __('Edit Story', 'clouds-and-spaceships'),
			'new_item'           => __('New Story', 'clouds-and-spaceships'),
			'view_item'          => __('View Story', 'clouds-and-spaceships'),
			'search_items'       => __('Search Stories', 'clouds-and-spaceships'),
			'not_found'          => __('No stories found', 'clouds-and-spaceships'),
			'not_found_in_trash' => __('No stories found in trash', 'clouds-and-spaceships'),
		],
		'public'              => true,
		'publicly_queryable'  => true,
		'show_in_rest'        => true,
		'show_ui'             => true,
		'show_in_menu'        => $show_stories_menu,
		'menu_icon'           => 'dashicons-book',
		'menu_position'       => 58,
		'show_in_nav_menus'   => true,
		'exclude_from_search' => false,
		'has_archive'         => cns_archive_enabled('cns_story'),
		'rewrite'             => ['slug' => cns_archive_slug('cns_story')],
		'supports'            => ['title', 'editor', 'excerpt', 'thumbnail', 'custom-fields'],
		'taxonomies'          => ['post_tag', 'category'],
		'capability_type'     => 'post',
	]);

	// ── Substory CPT ─────────────────────────────────────────────────────────
	register_post_type('cns_substory', [
		'labels' => [
			'name'               => __('Substories', 'clouds-and-spaceships'),
			'singular_name'      => __('Substory', 'clouds-and-spaceships'),
			'add_new'            => __('Add New Substory', 'clouds-and-spaceships'),
			'add_new_item'       => __('Add New Substory', 'clouds-and-spaceships'),
			'edit_item'          => __('Edit Substory', 'clouds-and-spaceships'),
			'new_item'           => __('New Substory', 'clouds-and-spaceships'),
			'view_item'          => __('View Substory', 'clouds-and-spaceships'),
			'search_items'       => __('Search Substories', 'clouds-and-spaceships'),
			'not_found'          => __('No substories found', 'clouds-and-spaceships'),
			'not_found_in_trash' => __('No substories found in trash', 'clouds-and-spaceships'),
		],
		'public'              => true,
		'publicly_queryable'  => true,
		'show_in_rest'        => true,
		'show_ui'             => true,
		'show_in_menu'        => $show_substories_menu,
		'menu_icon'           => 'dashicons-media-document',
		'menu_position'       => 58,
		'show_in_nav_menus'   => true,
		'exclude_from_search' => false,
		'has_archive'         => false,
		'rewrite'             => ['slug' => 'substories'],
		'supports'            => ['title', 'editor', 'excerpt', 'thumbnail', 'custom-fields'],
		'capability_type'     => 'post',
	]);
}
add_action('init', 'cns_story_suite_register_post_types');

// ── Story meta fields ─────────────────────────────────────────────────────────

function cns_story_suite_register_post_meta(): void {
	$story_fields = [
		'_cns_story_map_id'        => 'integer',
		'_cns_story_line_color'    => 'string',
		'_cns_story_line_width'    => 'number',
		'_cns_story_line_style'    => 'string',
		'_cns_story_start_node_id' => 'integer',
		'_cns_story_marker_color'          => 'string',
		'_cns_story_marker_size'           => 'number',
		'_cns_story_marker_type'           => 'string',
		'_cns_story_marker_icon_id'        => 'integer',
		'_cns_story_marker_icon_offset_x'  => 'number',
		'_cns_story_marker_icon_offset_y'  => 'number',
	];

	foreach ($story_fields as $key => $type) {
		register_post_meta('cns_story', $key, [
			'type'          => $type,
			'single'        => true,
			'show_in_rest'  => false,
			'auth_callback' => fn() => current_user_can('edit_posts'),
		]);
	}
}
add_action('init', 'cns_story_suite_register_post_meta');

// ── Disable block editor for story CPT (uses custom canvas editor) ────────────

function cns_story_suite_disable_gutenberg(bool $use_editor, string $post_type): bool {
	if ($post_type === 'cns_story') {
		return false;
	}
	return $use_editor;
}
add_filter('use_block_editor_for_post_type', 'cns_story_suite_disable_gutenberg', 10, 2);

// ── Inject story block on single story pages ──────────────────────────────────

function cns_story_suite_inject_story_content(string $content): string {
	static $rendering = false;
	if ($rendering || ! is_singular('cns_story') || ! in_the_loop() || ! is_main_query()) {
		return $content;
	}
	$rendering = true;
	$result    = render_block([
		'blockName' => 'cns-story-suite/story',
		'attrs'     => ['storyId' => get_the_ID()],
	]);
	$rendering = false;
	return $result;
}
add_filter('the_content', 'cns_story_suite_inject_story_content', 5);

// ── Helpers ───────────────────────────────────────────────────────────────────

function cns_story_suite_get_all_stories(int $take = -1, int $skip = 0, bool $trash = false): array {
	return get_posts([
		'post_type'      => 'cns_story',
		'posts_per_page' => $take,
		'offset'         => $skip,
		'post_status'    => $trash ? ['trash'] : ['publish', 'draft', 'private'],
		'orderby'        => 'date',
		'order'          => 'DESC',
	]);
}

function cns_story_suite_count_stories(bool $trash = false): int {
	$counts = wp_count_posts('cns_story');
	return $trash
		? (int) $counts->trash
		: (int) $counts->publish + (int) $counts->draft + (int) $counts->private;
}
