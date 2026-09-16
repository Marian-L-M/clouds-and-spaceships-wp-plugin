<?php

defined('ABSPATH') || exit;


/**
 * Maps + Icons tabs on the shared CNS settings page. The framework builds the
 * page whether or not the CNS theme is active, so no standalone menu is needed.
 */
add_filter('cns_admin_tabs', function (array $tabs): array {
	$tabs['maps'] = [
		'menu_title' => __('Maps', 'clouds-and-spaceships'),
		'title'      => __('Maps', 'clouds-and-spaceships'),
		'capability' => 'manage_maps',
		'callback'   => 'cns_map_suite_render_overview',
		'priority'   => 30,
	];
	$tabs['icons'] = [
		'menu_title' => __('Icons', 'clouds-and-spaceships'),
		'title'      => __('Icons', 'clouds-and-spaceships'),
		'capability' => 'manage_maps',
		'callback'   => 'cns_map_suite_render_icons',
		'priority'   => 31,
	];
	return $tabs;
});

/**
 * Register editor as a hidden sub-page (accessible by URL, not shown in menu).
 */
function cns_map_suite_register_menus(): void {
	add_submenu_page(
		'cns-settings',
		__('Map Editor', 'clouds-and-spaceships'),
		__('Map Editor', 'clouds-and-spaceships'),
		'manage_maps',
		CNS_MAP_PAGE_EDITOR,
		'cns_map_suite_render_editor'
	);
	remove_submenu_page('cns-settings', CNS_MAP_PAGE_EDITOR);
}
add_action('admin_menu', 'cns_map_suite_register_menus', 10);

/**
 * Canonical page slug for the current request. The default tab is also served
 * from the bare cns-settings slug, so resolve that back to our tab pages.
 */
function cns_map_suite_current_page(): string {
	$page = sanitize_key($_GET['page'] ?? '');
	if ($page === 'cns-settings') {
		$active = cns_admin_active_tab();
		if ($active === 'maps')  return CNS_MAP_PAGE_SETTINGS_MAPS;
		if ($active === 'icons') return CNS_MAP_PAGE_SETTINGS_ICONS;
	}
	return $page;
}

add_action('admin_init', function (): void {
	// Both tabs post to handlers in actions.php; each block there checks its own
	// action name, capability and nonce, so loading the file on either is safe.
	if (in_array(
		cns_map_suite_current_page(),
		[CNS_MAP_PAGE_SETTINGS_MAPS, CNS_MAP_PAGE_SETTINGS_ICONS],
		true
	)) {
		require_once CNS_DIR . 'includes/map/admin/actions.php';
	}
});



function cns_map_suite_enqueue_admin_assets(): void {
	$screen = get_current_screen();
	if (! $screen) {
		return;
	}

	$page = cns_map_suite_current_page();

	// Only the screens that mount a React app need this bundle: the map editor
	// and the Icons library. The Maps tab is server-rendered and gets its
	// layout — and its delete confirmations — from the admin-settings bundle
	// that every CNS settings page loads.
	$needs_app = in_array($page, [
		CNS_MAP_PAGE_EDITOR,
		CNS_MAP_PAGE_SETTINGS_ICONS,
	], true);

	if (! $needs_app) {
		return;
	}

	// Load assets
	wp_enqueue_style(
		'cns-map-admin',
		CNS_URL . 'build/map-admin/index.css',
		[],
		CNS_VERSION
	);

	$admin_asset_file = CNS_DIR . 'build/map-admin/index.asset.php';
	$admin_asset      = file_exists( $admin_asset_file )
		? require $admin_asset_file
		: [ 'dependencies' => [], 'version' => CNS_VERSION ];

	wp_enqueue_script(
		'cns-map-admin',
		CNS_URL . 'build/map-admin/index.js',
		array_merge( [ 'wp-color-picker', 'cns-toast' ], $admin_asset['dependencies'] ),
		$admin_asset['version'],
		true
	);

	wp_set_script_translations(
		'cns-map-admin',
		'clouds-and-spaceships',
		CNS_DIR . 'languages'
	);

	wp_localize_script('cns-map-admin', 'cnsMapSuite', [
		'restUrl'   => rest_url('cns-map-suite/v1'),
		'wpRestUrl' => rest_url('wp/v2'),
		'nonce'     => wp_create_nonce('wp_rest'),
		'iconsUrl'  => add_query_arg(['page' => CNS_MAP_PAGE_SETTINGS_ICONS], admin_url('admin.php')),
	]);

	// Both remaining screens mount a React app built on @wordpress/components.
	wp_enqueue_media();
	wp_enqueue_style('wp-color-picker');
	// The script dep comes from the generated asset file, but the stylesheet
	// must be enqueued manually.
	wp_enqueue_style('wp-components');

	if ($page === CNS_MAP_PAGE_EDITOR) {
		// Classic TinyMCE editor for the Description tab (wp.editor / wp.oldEditor).
		wp_enqueue_editor();
		// The editor's Stories tab is rendered by the story suite's panel bundle.
		cns_story_suite_enqueue_map_panel();
	}
}

add_action('admin_enqueue_scripts', 'cns_map_suite_enqueue_admin_assets');


// Render callbacks for custom pages
function cns_map_suite_render_overview(): void {
	include CNS_DIR . 'includes/map/admin/views/overview.php';
}

function cns_map_suite_render_editor(): void {
	include CNS_DIR . 'includes/map/admin/views/editor.php';
}

function cns_map_suite_render_icons(): void {
	include CNS_DIR . 'includes/map/admin/views/icons.php';
}
