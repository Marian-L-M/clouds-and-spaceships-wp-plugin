<?php

defined('ABSPATH') || exit;

/**
 * Stories + Substories tabs on the shared CNS settings page, which the plugin
 * builds itself — no standalone menu is needed.
 */
add_filter('cns_admin_tabs', function (array $tabs): array {
	$tabs['stories'] = [
		'menu_title' => __('Stories', 'clouds-and-spaceships'),
		'title'      => __('Stories', 'clouds-and-spaceships'),
		'capability' => 'manage_stories',
		'callback'   => 'cns_story_suite_render_overview',
		'priority'   => 40,
	];
	$tabs['substories'] = [
		'menu_title' => __('Substories', 'clouds-and-spaceships'),
		'title'      => __('Substories', 'clouds-and-spaceships'),
		'capability' => 'edit_posts',
		'callback'   => 'cns_story_suite_render_substories',
		'priority'   => 41,
	];
	return $tabs;
});

/**
 * Hidden sub-page for the story editor (accessible by URL, not shown in menu).
 */
function cns_story_suite_register_menus(): void {
	add_submenu_page(
		'cns-settings',
		__('Story Editor', 'clouds-and-spaceships'),
		__('Story Editor', 'clouds-and-spaceships'),
		'manage_stories',
		CNS_STORY_PAGE_EDITOR,
		'cns_story_suite_render_editor'
	);
	remove_submenu_page('cns-settings', CNS_STORY_PAGE_EDITOR);
}
add_action('admin_menu', 'cns_story_suite_register_menus', 10);

/**
 * Canonical page slug for the current request. The default tab is also served
 * from the bare cns-settings slug, so resolve that back to our tab pages.
 */
function cns_story_suite_current_page(): string {
	// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- routing only; reads which admin page is being rendered.
	$page = sanitize_key(wp_unslash($_GET['page'] ?? ''));
	if ($page === 'cns-settings') {
		$active = cns_admin_active_tab();
		if ($active === 'stories')    return CNS_STORY_PAGE_SETTINGS;
		if ($active === 'substories') return CNS_STORY_PAGE_SETTINGS_SUBSTORIES;
	}
	return $page;
}

// ── Asset enqueuing ───────────────────────────────────────────────────────────

function cns_story_suite_enqueue_admin_assets(): void {
	$page = cns_story_suite_current_page();

	// Only the story editor mounts a React app. The Stories and Substories tabs
	// are server-rendered and are styled by the admin-settings bundle that every
	// CNS settings page loads.
	if ($page !== CNS_STORY_PAGE_EDITOR) {
		return;
	}

	$css_file = CNS_DIR . 'build/story-admin/index.css';
	if (file_exists($css_file)) {
		wp_enqueue_style(
			'cns-story-admin',
			CNS_URL . 'build/story-admin/index.css',
			[],
			CNS_VERSION
		);
	}

	$asset = cns_asset('story-admin/index');

	wp_enqueue_script(
		'cns-story-admin',
		CNS_URL . 'build/story-admin/index.js',
		array_merge(['wp-color-picker'], $asset['dependencies']),
		$asset['version'],
		true
	);

	wp_localize_script('cns-story-admin', 'cnsStorySuite', [
		'restUrl'       => rest_url('cns-story-suite/v1'),
		'mapRestUrl'    => rest_url('cns-map-suite/v1'),
		'wpRestUrl'     => rest_url('wp/v2'),
		'nonce'         => wp_create_nonce('wp_rest'),
		'overviewUrl'   => add_query_arg(['page' => CNS_STORY_PAGE_SETTINGS], admin_url('admin.php')),
		'editorUrl'     => add_query_arg(['page' => CNS_STORY_PAGE_EDITOR], admin_url('admin.php')),
		'substoriesUrl' => admin_url('edit.php?post_type=cns_substory'),
	]);

	wp_enqueue_media();
	wp_enqueue_style('wp-color-picker');
	// Styles for @wordpress/components (the script dep comes from the generated
	// asset file, but the stylesheet must be enqueued manually).
	wp_enqueue_style('wp-components');
}
add_action('admin_enqueue_scripts', 'cns_story_suite_enqueue_admin_assets');

// ── Map editor integration ────────────────────────────────────────────────────
//
// The map editor's Stories tab mounts this bundle. It used to reach the map
// suite through the `cns_map_suite_editor_enqueue_assets` action because the
// two were separate plugins; the map editor now calls this directly.

function cns_story_suite_enqueue_map_panel(): void {
	$asset = cns_asset('map-panel/index');

	wp_enqueue_script(
		'cns-story-map-panel',
		CNS_URL . 'build/map-panel/index.js',
		$asset['dependencies'],
		$asset['version'],
		true
	);

	wp_localize_script('cns-story-map-panel', 'cnsStorySuite', [
		'restUrl'   => rest_url('cns-story-suite/v1'),
		'nonce'     => wp_create_nonce('wp_rest'),
		'editorUrl' => add_query_arg(['page' => CNS_STORY_PAGE_EDITOR], admin_url('admin.php')),
	]);
}

// ── Render callbacks ──────────────────────────────────────────────────────────

function cns_story_suite_render_overview(): void {
	include CNS_DIR . 'includes/story/admin/views/overview.php';
}

function cns_story_suite_render_editor(): void {
	include CNS_DIR . 'includes/story/admin/views/editor.php';
}

function cns_story_suite_render_substories(): void {
	include CNS_DIR . 'includes/story/admin/views/substories-overview.php';
}

// ── Handle overview actions ───────────────────────────────────────────────────

add_action('admin_init', function (): void {
	// Settings save — must run in admin_init so headers aren't yet sent.
	if (
		isset($_POST['cns_story_action']) &&
		$_POST['cns_story_action'] === 'save_settings' &&
		check_admin_referer('cns_story_save_settings') &&
		current_user_can('manage_stories')
	) {
		update_option('cns_story_suite_delete_on_uninstall',   ! empty($_POST['delete_on_uninstall']));
		update_option('cns_story_suite_show_stories_menu',     ! empty($_POST['show_stories_menu']));
		update_option('cns_story_suite_show_substories_menu',  ! empty($_POST['show_substories_menu']));

		// Archive. The slug and enabled flag are watched in includes/archive.php,
		// which schedules a rewrite flush for the next init.
		update_option('cns_story_suite_archive_enabled', ! empty($_POST['archive_enabled']));

		$slug = preg_replace('/[^a-z0-9\-]/', '', strtolower(sanitize_text_field(wp_unslash($_POST['archive_slug'] ?? ''))));
		update_option('cns_story_suite_archive_slug', $slug ?: 'stories');

		update_option(
			'cns_story_suite_archive_per_page',
			max(1, (int) sanitize_text_field(wp_unslash($_POST['archive_per_page'] ?? CNS_ARCHIVE_DEFAULT_PER_PAGE)))
		);

		$order = sanitize_key((string) ($_POST['archive_order'] ?? ''));
		update_option(
			'cns_story_suite_archive_order',
			array_key_exists($order, cns_archive_order_options()) ? $order : CNS_ARCHIVE_DEFAULT_ORDER
		);
		$return_page = sanitize_key($_GET['page'] ?? CNS_STORY_PAGE_SETTINGS);
		wp_safe_redirect(add_query_arg(['page' => $return_page, 'settings-saved' => '1'], admin_url('admin.php')));
		exit;
	}
});

// Trash / restore / permanent delete. "Delete" moves the story to trash and
// keeps its node/path/edge rows, so restoring is lossless; rows are purged by
// the before_delete_post hook (includes/database.php) only when the post is
// permanently deleted — from here, from the trash being emptied, or from any
// other deletion path.
add_action('admin_init', function (): void {
	$page   = cns_story_suite_current_page();
	$action = sanitize_key($_GET['action'] ?? '');

	$actions = ['delete' => 'trashed', 'restore' => 'restored', 'delete-forever' => 'deleted'];
	if ($page !== CNS_STORY_PAGE_SETTINGS || ! isset($actions[$action])) {
		return;
	}

	// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- the nonce is verified on the next line, with the resolved id.
	$story_id = (int) sanitize_text_field(wp_unslash($_GET['story_id'] ?? 0));
	if (! $story_id || ! check_admin_referer('cns_' . $action . '_story_' . $story_id)) {
		return;
	}

	$story = get_post($story_id);
	if ($story && $story->post_type === 'cns_story' && current_user_can('manage_stories')) {
		switch ($action) {
			case 'delete':
				wp_trash_post($story_id);
				break;
			case 'restore':
				wp_untrash_post($story_id);
				break;
			case 'delete-forever':
				wp_delete_post($story_id, true);
				break;
		}
	}

	wp_safe_redirect(add_query_arg(['page' => $page, $actions[$action] => '1'], admin_url('admin.php')));
	exit;
});
