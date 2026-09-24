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
		// 'author' lets core/post-author render the byline on the single-story
		// template; without it the block deliberately outputs nothing.
		'supports'            => ['title', 'editor', 'author', 'excerpt', 'thumbnail', 'custom-fields'],
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
		// Which layers of the linked map the story shows. Absent means "on",
		// so stories saved before these existed keep rendering the full map.
		'_cns_story_show_areas'    => 'boolean',
		'_cns_story_show_objects'  => 'boolean',
		'_cns_story_show_labels'   => 'boolean',
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

// ── Standalone story page ─────────────────────────────────────────────────────
// Single stories render through the single-cns_story block template, which
// shares one layout file with maps — see includes/map-template.php.

// ── Helpers ───────────────────────────────────────────────────────────────────

/**
 * Shared query args for the admin story list.
 *
 * $search matches the title only. The overview lists stories by name, so a
 * full-text match would surface stories whose body happens to mention the term
 * while their title does not — confusing in a list that shows no body text.
 */
function cns_story_suite_story_query_args(bool $trash = false, string $search = ''): array {
	$args = [
		'post_type'   => 'cns_story',
		'post_status' => $trash ? ['trash'] : ['publish', 'draft', 'private'],
		'orderby'     => 'date',
		'order'       => 'DESC',
	];

	if ($search !== '') {
		$args['s']              = $search;
		$args['search_columns'] = ['post_title'];
	}

	return $args;
}

function cns_story_suite_get_all_stories(int $take = -1, int $skip = 0, bool $trash = false, string $search = ''): array {
	return get_posts(array_merge(cns_story_suite_story_query_args($trash, $search), [
		'posts_per_page' => $take,
		'offset'         => $skip,
	]));
}

function cns_story_suite_count_stories(bool $trash = false, string $search = ''): int {
	// The unfiltered totals come from the cached per-status counts; only a
	// search needs a real query, and then found_posts is the cheapest answer.
	if ($search === '') {
		$counts = wp_count_posts('cns_story');
		return $trash
			? (int) $counts->trash
			: (int) $counts->publish + (int) $counts->draft + (int) $counts->private;
	}

	$query = new WP_Query(array_merge(cns_story_suite_story_query_args($trash, $search), [
		'posts_per_page'         => 1,
		'fields'                 => 'ids',
		'update_post_meta_cache' => false,
		'update_post_term_cache' => false,
	]));

	return (int) $query->found_posts;
}
