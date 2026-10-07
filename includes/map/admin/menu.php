<?php

defined('ABSPATH') || exit;


/**
 * Maps + Icons tabs on the shared CNS settings page, which the plugin builds
 * itself — no standalone menu is needed.
 */
add_filter('clouansp_admin_tabs', function (array $tabs): array {
	$tabs['maps'] = [
		'menu_title' => __('Maps', 'clouds-and-spaceships'),
		'title'      => __('Maps', 'clouds-and-spaceships'),
		'capability' => 'manage_maps',
		'callback'   => 'clouansp_map_suite_render_overview',
		'priority'   => 30,
	];
	$tabs['icons'] = [
		'menu_title' => __('Icons', 'clouds-and-spaceships'),
		'title'      => __('Icons', 'clouds-and-spaceships'),
		'capability' => 'manage_maps',
		'callback'   => 'clouansp_map_suite_render_icons',
		'priority'   => 31,
	];
	return $tabs;
});

/**
 * Register editor as a hidden sub-page (accessible by URL, not shown in menu).
 */
function clouansp_map_suite_register_menus(): void {
	add_submenu_page(
		'clouansp-settings',
		__('Map Editor', 'clouds-and-spaceships'),
		__('Map Editor', 'clouds-and-spaceships'),
		'manage_maps',
		CLOUANSP_MAP_PAGE_EDITOR,
		'clouansp_map_suite_render_editor'
	);
	remove_submenu_page('clouansp-settings', CLOUANSP_MAP_PAGE_EDITOR);
}
add_action('admin_menu', 'clouansp_map_suite_register_menus', 10);

/**
 * Canonical page slug for the current request. The default tab is also served
 * from the bare clouansp-settings slug, so resolve that back to our tab pages.
 */
function clouansp_map_suite_current_page(): string {
	// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- routing only; reads which admin page is being rendered.
	$page = sanitize_key(wp_unslash($_GET['page'] ?? ''));
	if ($page === 'clouansp-settings') {
		$active = clouansp_admin_active_tab();
		if ($active === 'maps')  return CLOUANSP_MAP_PAGE_SETTINGS_MAPS;
		if ($active === 'icons') return CLOUANSP_MAP_PAGE_SETTINGS_ICONS;
	}
	return $page;
}

add_action('admin_init', function (): void {
	// Both tabs post to handlers in actions.php; each block there checks its own
	// action name, capability and nonce, so loading the file on either is safe.
	if (in_array(
		clouansp_map_suite_current_page(),
		[CLOUANSP_MAP_PAGE_SETTINGS_MAPS, CLOUANSP_MAP_PAGE_SETTINGS_ICONS],
		true
	)) {
		require_once CLOUANSP_DIR . 'includes/map/admin/actions.php';
	}
});



function clouansp_map_suite_enqueue_admin_assets(): void {
	$screen = get_current_screen();
	if (! $screen) {
		return;
	}

	$page = clouansp_map_suite_current_page();

	// Only the screens that mount a React app need this bundle: the map editor
	// and the Icons library. The Maps tab is server-rendered and gets its
	// layout — and its delete confirmations — from the admin-settings bundle
	// that every CNS settings page loads.
	$needs_app = in_array($page, [
		CLOUANSP_MAP_PAGE_EDITOR,
		CLOUANSP_MAP_PAGE_SETTINGS_ICONS,
	], true);

	if (! $needs_app) {
		return;
	}

	// Load assets
	wp_enqueue_style(
		'clouansp-map-admin',
		CLOUANSP_URL . 'build/map-admin/index.css',
		[],
		CLOUANSP_VERSION
	);

	$admin_asset = clouansp_asset( 'map-admin/index' );

	wp_enqueue_script(
		'clouansp-map-admin',
		CLOUANSP_URL . 'build/map-admin/index.js',
		array_merge( [ 'wp-color-picker' ], $admin_asset['dependencies'] ),
		$admin_asset['version'],
		true
	);

	// No path: wp.org language packs land in WP_LANG_DIR, where core looks by
	// default.
	wp_set_script_translations('clouansp-map-admin', 'clouds-and-spaceships');

	wp_localize_script('clouansp-map-admin', 'clouanspMapSuite', [
		'restUrl'   => rest_url('clouansp-map-suite/v1'),
		'wpRestUrl' => rest_url('wp/v2'),
		'nonce'     => wp_create_nonce('wp_rest'),
		'iconsUrl'  => add_query_arg(['page' => CLOUANSP_MAP_PAGE_SETTINGS_ICONS], admin_url('admin.php')),
	]);

	// Both remaining screens mount a React app built on @wordpress/components.
	wp_enqueue_media();
	wp_enqueue_style('wp-color-picker');
	// The script dep comes from the generated asset file, but the stylesheet
	// must be enqueued manually.
	wp_enqueue_style('wp-components');

	if ($page === CLOUANSP_MAP_PAGE_EDITOR) {
		// Classic TinyMCE editor for the Description tab (wp.editor / wp.oldEditor).
		wp_enqueue_editor();
		// The editor's Stories tab is rendered by the story suite's panel bundle.
		clouansp_story_suite_enqueue_map_panel();
	}
}

add_action('admin_enqueue_scripts', 'clouansp_map_suite_enqueue_admin_assets');


// Render callbacks for custom pages
function clouansp_map_suite_render_overview(): void {
	include CLOUANSP_DIR . 'includes/map/admin/views/overview.php';
}

function clouansp_map_suite_render_editor(): void {
	include CLOUANSP_DIR . 'includes/map/admin/views/editor.php';
}

function clouansp_map_suite_render_icons(): void {
	include CLOUANSP_DIR . 'includes/map/admin/views/icons.php';
}
