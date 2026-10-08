<?php

defined('ABSPATH') || exit;

/**
 * Stories + Substories tabs on the shared CNS settings page, which the plugin
 * builds itself — no standalone menu is needed.
 */
add_filter('clouansp_admin_tabs', function (array $tabs): array {
	$tabs['stories'] = [
		'menu_title' => __('Stories', 'clouds-and-spaceships'),
		'title'      => __('Stories', 'clouds-and-spaceships'),
		'capability' => 'clouansp_manage_stories',
		'callback'   => 'clouansp_story_suite_render_overview',
		'priority'   => 40,
	];
	$tabs['substories'] = [
		'menu_title' => __('Substories', 'clouds-and-spaceships'),
		'title'      => __('Substories', 'clouds-and-spaceships'),
		'capability' => 'edit_posts',
		'callback'   => 'clouansp_story_suite_render_substories',
		'priority'   => 41,
	];
	return $tabs;
});

/**
 * Hidden sub-page for the story editor (accessible by URL, not shown in menu).
 */
function clouansp_story_suite_register_menus(): void {
	add_submenu_page(
		'clouansp-settings',
		__('Story Editor', 'clouds-and-spaceships'),
		__('Story Editor', 'clouds-and-spaceships'),
		'clouansp_manage_stories',
		CLOUANSP_STORY_PAGE_EDITOR,
		'clouansp_story_suite_render_editor'
	);
	remove_submenu_page('clouansp-settings', CLOUANSP_STORY_PAGE_EDITOR);
}
add_action('admin_menu', 'clouansp_story_suite_register_menus', 10);

/**
 * Canonical page slug for the current request. The default tab is also served
 * from the bare clouansp-settings slug, so resolve that back to our tab pages.
 */
function clouansp_story_suite_current_page(): string {
	// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- routing only; reads which admin page is being rendered.
	$page = sanitize_key(wp_unslash($_GET['page'] ?? ''));
	if ($page === 'clouansp-settings') {
		$active = clouansp_admin_active_tab();
		if ($active === 'stories')    return CLOUANSP_STORY_PAGE_SETTINGS;
		if ($active === 'substories') return CLOUANSP_STORY_PAGE_SETTINGS_SUBSTORIES;
	}
	return $page;
}

// ── Asset enqueuing ───────────────────────────────────────────────────────────

/**
 * Initial state for the story editor app, exposed as window.clouanspStoryEditor
 * by clouansp_story_suite_enqueue_admin_assets().
 */
function clouansp_story_suite_editor_data(): array {
	// Read-only: picks which story to load. Nothing changes state, and every
	// write goes through the REST API's permission callbacks.
	// phpcs:ignore WordPress.Security.NonceVerification.Recommended
	$story_id = isset($_GET['story_id']) ? (int) $_GET['story_id'] : 0;
	$story    = $story_id ? get_post($story_id) : null;
	$is_new   = (! $story || $story->post_type !== 'clouansp_story');

	$view_url = (! $is_new && $story && in_array($story->post_status, ['publish', 'private'], true))
		? get_permalink($story->ID)
		: '';

	return [
		'storyId'         => $story_id,
		'isNew'           => $is_new,
		'status'          => $story ? $story->post_status : 'draft',
		'title'           => $story ? $story->post_title : '',
		'overviewUrl'     => add_query_arg(['page' => CLOUANSP_STORY_PAGE_SETTINGS], admin_url('admin.php')),
		'viewUrl'         => $view_url ?: '',
		'substoryBaseUrl' => add_query_arg(['post_type' => 'clouansp_substory'], admin_url('edit.php')),
	];
}

function clouansp_story_suite_enqueue_admin_assets(): void {
	$page = clouansp_story_suite_current_page();

	// Only the story editor mounts a React app. The Stories and Substories tabs
	// are server-rendered and are styled by the admin-settings bundle that every
	// CNS settings page loads.
	if ($page !== CLOUANSP_STORY_PAGE_EDITOR) {
		return;
	}

	$css_file = CLOUANSP_DIR . 'build/story-admin/index.css';
	if (file_exists($css_file)) {
		wp_enqueue_style(
			'clouansp-story-admin',
			CLOUANSP_URL . 'build/story-admin/index.css',
			[],
			CLOUANSP_VERSION
		);
	}

	$asset = clouansp_asset('story-admin/index');

	wp_enqueue_script(
		'clouansp-story-admin',
		CLOUANSP_URL . 'build/story-admin/index.js',
		array_merge(['wp-color-picker'], $asset['dependencies']),
		$asset['version'],
		true
	);

	wp_localize_script('clouansp-story-admin', 'clouanspStorySuite', [
		'restUrl'       => rest_url('clouansp-story-suite/v1'),
		'mapRestUrl'    => rest_url('clouansp-map-suite/v1'),
		'wpRestUrl'     => rest_url('wp/v2'),
		'nonce'         => wp_create_nonce('wp_rest'),
		'overviewUrl'   => add_query_arg(['page' => CLOUANSP_STORY_PAGE_SETTINGS], admin_url('admin.php')),
		'editorUrl'     => add_query_arg(['page' => CLOUANSP_STORY_PAGE_EDITOR], admin_url('admin.php')),
		'substoriesUrl' => admin_url('edit.php?post_type=clouansp_substory'),
	]);

	wp_add_inline_script(
		'clouansp-story-admin',
		'window.clouanspStoryEditor = ' . wp_json_encode(clouansp_story_suite_editor_data()) . ';',
		'before'
	);

	wp_enqueue_media();
	wp_enqueue_style('wp-color-picker');
	// Styles for @wordpress/components (the script dep comes from the generated
	// asset file, but the stylesheet must be enqueued manually).
	wp_enqueue_style('wp-components');
}
add_action('admin_enqueue_scripts', 'clouansp_story_suite_enqueue_admin_assets');

// ── Map editor integration ────────────────────────────────────────────────────
//
// The map editor's Stories tab mounts this bundle; the map editor calls this
// directly.

function clouansp_story_suite_enqueue_map_panel(): void {
	$asset = clouansp_asset('map-panel/index');

	wp_enqueue_script(
		'clouansp-story-map-panel',
		CLOUANSP_URL . 'build/map-panel/index.js',
		$asset['dependencies'],
		$asset['version'],
		true
	);

	wp_localize_script('clouansp-story-map-panel', 'clouanspStorySuite', [
		'restUrl'   => rest_url('clouansp-story-suite/v1'),
		'nonce'     => wp_create_nonce('wp_rest'),
		'editorUrl' => add_query_arg(['page' => CLOUANSP_STORY_PAGE_EDITOR], admin_url('admin.php')),
	]);
}

// ── Render callbacks ──────────────────────────────────────────────────────────

function clouansp_story_suite_render_overview(): void {
	include CLOUANSP_DIR . 'includes/story/admin/views/overview.php';
}

function clouansp_story_suite_render_editor(): void {
	include CLOUANSP_DIR . 'includes/story/admin/views/editor.php';
}

function clouansp_story_suite_render_substories(): void {
	include CLOUANSP_DIR . 'includes/story/admin/views/substories-overview.php';
}

// ── Handle overview actions ───────────────────────────────────────────────────

add_action('admin_init', function (): void {
	// Settings save — must run in admin_init so headers aren't yet sent.
	if (
		isset($_POST['clouansp_story_action']) &&
		$_POST['clouansp_story_action'] === 'save_settings' &&
		check_admin_referer('clouansp_story_save_settings') &&
		current_user_can('clouansp_manage_stories')
	) {
		update_option('clouansp_story_suite_delete_substories_on_uninstall', ! empty($_POST['delete_substories_on_uninstall']));
		update_option('clouansp_story_suite_show_stories_menu',     ! empty($_POST['show_stories_menu']));
		update_option('clouansp_story_suite_show_substories_menu',  ! empty($_POST['show_substories_menu']));

		// Archive. The slug and enabled flag are watched in includes/archive.php,
		// which schedules a rewrite flush for the next init.
		update_option('clouansp_story_suite_archive_enabled', ! empty($_POST['archive_enabled']));

		$slug = preg_replace('/[^a-z0-9\-]/', '', strtolower(sanitize_text_field(wp_unslash($_POST['archive_slug'] ?? ''))));
		update_option('clouansp_story_suite_archive_slug', $slug ?: 'stories');

		// Paging and sort order are not owned here: the plugin registers no
		// story archive template, so the theme and Reading Settings decide.

		// Stands in for stories with no featured image of their own. Anything
		// that is not an image attachment is stored as 0 (no placeholder).
		$placeholder = absint($_POST['placeholder_thumb_id'] ?? 0);
		update_option(
			'clouansp_story_suite_placeholder_thumb_id',
			$placeholder && wp_attachment_is_image($placeholder) ? $placeholder : 0
		);

		$return_page = sanitize_key($_GET['page'] ?? CLOUANSP_STORY_PAGE_SETTINGS);
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
	$page   = clouansp_story_suite_current_page();
	$action = sanitize_key($_GET['action'] ?? '');

	$actions = ['delete' => 'trashed', 'restore' => 'restored', 'delete-forever' => 'deleted'];
	if ($page !== CLOUANSP_STORY_PAGE_SETTINGS || ! isset($actions[$action])) {
		return;
	}

	// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- the nonce is verified on the next line, with the resolved id.
	$story_id = (int) sanitize_text_field(wp_unslash($_GET['story_id'] ?? 0));
	if (! $story_id || ! check_admin_referer('clouansp_' . $action . '_story_' . $story_id)) {
		return;
	}

	$story = get_post($story_id);
	if ($story && $story->post_type === 'clouansp_story' && current_user_can('clouansp_manage_stories')) {
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
