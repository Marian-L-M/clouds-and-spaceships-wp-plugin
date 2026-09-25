<?php

defined('ABSPATH') || exit;

/**
 * Bridges the stock WordPress screens for the `maps` post type back to the CNS
 * map editor. Those screens only appear when "Show Maps in the WordPress admin
 * sidebar" is enabled, but they stay reachable by URL either way — so both
 * entry points are registered unconditionally and gated on capability instead.
 */

/**
 * "Edit map element" row action on the maps list table, appended after the
 * last core action (View/Preview).
 */
function cns_map_suite_post_row_actions(array $actions, WP_Post $post): array {
	if ($post->post_type !== 'cns_map' || ! current_user_can('manage_maps')) {
		return $actions;
	}

	$actions['cns_map_editor'] = sprintf(
		'<a href="%s">%s</a>',
		esc_url(cns_map_suite_editor_url($post->ID)),
		esc_html__('Edit map element', 'clouds-and-spaceships')
	);

	return $actions;
}
add_filter('post_row_actions', 'cns_map_suite_post_row_actions', 10, 2);

/**
 * "Edit map element" button beside "Add New Map" on the single-post edit
 * screen. edit-form-advanced.php prints the heading and the Add New link with
 * no action hook in between, so the link is inserted client-side.
 */
function cns_map_suite_post_screen_title_action(): void {
	$screen = get_current_screen();
	if (! $screen || $screen->base !== 'post' || $screen->post_type !== 'cns_map') {
		return;
	}
	// post-new.php has an auto-draft only — there is no map element to edit yet.
	if ($screen->action === 'add' || ! current_user_can('manage_maps')) {
		return;
	}

	// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- reads the post being viewed to pick a redirect; changes nothing.
	$post_id = (int) sanitize_text_field(wp_unslash($_GET['post'] ?? 0));
	if ($post_id <= 0) {
		return;
	}

	wp_print_inline_script_tag(sprintf(
		<<<'JS'
		( function () {
			var wrap = document.querySelector( '.wrap' );
			if ( ! wrap ) return;
			var heading = wrap.querySelector( 'h1.wp-heading-inline' ) || wrap.querySelector( 'h1' );
			if ( ! heading ) return;
			var link = document.createElement( 'a' );
			link.href = %s;
			link.className = 'page-title-action';
			link.textContent = %s;
			var addNew = wrap.querySelector( 'a.page-title-action' );
			var anchor = addNew || heading;
			anchor.parentNode.insertBefore( link, anchor.nextSibling );
		} )();
		JS,
		wp_json_encode(cns_map_suite_editor_url($post_id)),
		wp_json_encode(__('Edit map element', 'clouds-and-spaceships'))
	));
}
add_action('admin_print_footer_scripts', 'cns_map_suite_post_screen_title_action');
