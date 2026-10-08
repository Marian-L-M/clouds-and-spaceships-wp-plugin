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
		'capability' => 'clouansp_manage_maps',
		'callback'   => 'clouansp_map_suite_render_overview',
		'priority'   => 30,
	];
	$tabs['icons'] = [
		'menu_title' => __('Icons', 'clouds-and-spaceships'),
		'title'      => __('Icons', 'clouds-and-spaceships'),
		'capability' => 'clouansp_manage_maps',
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
		'clouansp_manage_maps',
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

/**
 * Initial state for the map editor app, exposed as window.clouanspMapEditor by
 * clouansp_map_suite_enqueue_admin_assets().
 */
function clouansp_map_suite_editor_data(): array {
	// Read-only: picks which map to load. Nothing changes state, and every write
	// goes through the REST API's permission callbacks.
	// phpcs:ignore WordPress.Security.NonceVerification.Recommended
	$map_id    = isset($_GET['map_id']) ? (int) $_GET['map_id'] : 0;
	$map       = $map_id ? get_post($map_id) : null;
	$is_new    = (! $map || $map->post_type !== 'clouansp_map');
	$is_master = $map_id ? (bool) get_post_meta($map_id, '_clouansp_map_is_master', true) : false;

	$meta = $map_id ? [
		'width'        => (int) (get_post_meta($map_id, '_clouansp_map_width', true) ?: 1000),
		'aspect_ratio' => (float) (get_post_meta($map_id, '_clouansp_map_aspect_ratio', true) ?: 1.0),
		'time'         => (int) get_post_meta($map_id, '_clouansp_map_time', true),
		'image_id'     => (int) get_post_meta($map_id, '_clouansp_map_image_id', true),
		'image_x'      => (float) get_post_meta($map_id, '_clouansp_map_image_x', true),
		'image_y'      => (float) get_post_meta($map_id, '_clouansp_map_image_y', true),
		'image_width'  => (float) (get_post_meta($map_id, '_clouansp_map_image_width', true) ?: 1.0),
		'bg_type'      => get_post_meta($map_id, '_clouansp_map_bg_type', true) ?: 'color',
		'bg_color'     => get_post_meta($map_id, '_clouansp_map_bg_color', true) ?: '#1a1a2e',
		'bg_image_id'  => (int) get_post_meta($map_id, '_clouansp_map_bg_image_id', true),
		'zoom_main'    => (string) get_post_meta($map_id, '_clouansp_map_zoom_main_color', true),
		'zoom_accent'  => (string) get_post_meta($map_id, '_clouansp_map_zoom_accent_color', true),
	] : [
		'width' => 1000, 'aspect_ratio' => 1.0,
		'time' => 0, 'image_id' => 0, 'image_x' => 0.0, 'image_y' => 0.0, 'image_width' => 1.0,
		'bg_type' => 'color', 'bg_color' => '#1a1a2e', 'bg_image_id' => 0,
		'zoom_main' => '', 'zoom_accent' => '',
	];

	$image_url     = $meta['image_id']    ? wp_get_attachment_image_url($meta['image_id'], 'large') : '';
	$bg_image_url  = $meta['bg_image_id'] ? wp_get_attachment_image_url($meta['bg_image_id'], 'large') : '';
	$thumbnail_id  = $map_id ? (int) get_post_thumbnail_id($map_id) : 0;
	$thumbnail_url = $thumbnail_id ? (wp_get_attachment_image_url($thumbnail_id, 'medium') ?: '') : '';
	$view_url      = (! $is_new && $map && in_array($map->post_status, ['publish', 'private'], true))
		? get_permalink($map->ID)
		: '';

	// Hand-off to the stock post editor from the Description tab. Empty for unsaved
	// maps and for users who may not edit the post, so the button can stay hidden.
	$wp_edit_url = (! $is_new && $map && current_user_can('edit_post', $map->ID))
		? (get_edit_post_link($map->ID, 'raw') ?: '')
		: '';

	// Parent maps — maps that include this map as a hierarchy child region.
	// One prepared read against a plugin-owned custom table, for this admin
	// screen only: no WordPress API covers it, and the editor must show current
	// rows rather than a cached copy.
	$parent_maps = [];
	if ($map_id && ! $is_new) {
		global $wpdb;
		// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
		$parent_rows = $wpdb->get_results(
			$wpdb->prepare(
				"SELECT parent_map_id FROM {$wpdb->prefix}clouansp_map_hierarchy WHERE child_map_id = %d",
				$map_id
			),
			ARRAY_A
		);
		foreach ($parent_rows as $row) {
			$parent = get_post((int) $row['parent_map_id']);
			if (! $parent || $parent->post_type !== 'clouansp_map') continue;
			$image_id      = (int) get_post_meta($parent->ID, '_clouansp_map_image_id', true);
			$parent_maps[] = [
				'map_id'    => $parent->ID,
				'title'     => $parent->post_title ?: __('(no title)', 'clouds-and-spaceships'),
				'thumbnail' => $image_id ? (wp_get_attachment_image_url($image_id, 'thumbnail') ?: '') : '',
				'url'       => clouansp_map_suite_editor_url($parent->ID),
			];
		}
	}

	return [
		'storiesOverviewUrl' => add_query_arg(['page' => CLOUANSP_STORY_PAGE_SETTINGS], admin_url('admin.php')),
		'mapId'              => $map_id,
		'isNew'              => $is_new,
		'status'             => $map ? $map->post_status : 'draft',
		'title'              => $map ? $map->post_title : '',
		'description'        => $map ? $map->post_content : '',
		'width'              => (int) $meta['width'],
		'aspectRatio'        => (float) $meta['aspect_ratio'],
		'time'               => (int) $meta['time'],
		'imageId'            => (int) $meta['image_id'],
		'imageUrl'           => $image_url ?: '',
		'imageX'             => (float) $meta['image_x'],
		'imageY'             => (float) $meta['image_y'],
		'imageWidth'         => (float) $meta['image_width'],
		'isMaster'           => $is_master,
		'bgType'             => $meta['bg_type'],
		'bgColor'            => $meta['bg_color'],
		'bgImageId'          => (int) $meta['bg_image_id'],
		'bgImageUrl'         => $bg_image_url ?: '',
		'thumbnailId'        => $thumbnail_id,
		'thumbnailUrl'       => $thumbnail_url,
		'overviewUrl'        => add_query_arg(['page' => CLOUANSP_MAP_PAGE_SETTINGS_MAPS], admin_url('admin.php')),
		'viewUrl'            => $view_url,
		'wpEditUrl'          => $wp_edit_url,
		'zoomMainColor'      => $meta['zoom_main'],
		'zoomAccentColor'    => $meta['zoom_accent'],
		// Global defaults from the Maps settings tab, shown when the map has no
		// override of its own so the editor previews what a visitor would see.
		'zoomMainDefault'    => (string) get_option('clouansp_map_suite_zoom_main_color', ''),
		'zoomAccentDefault'  => (string) get_option('clouansp_map_suite_zoom_accent_color', ''),
		// Frontend layer visibility; unset meta means "on" (see
		// clouansp_map_suite_layer_visible).
		'showAreas'          => clouansp_map_suite_layer_visible($map_id, '_clouansp_map_show_areas'),
		'showObjects'        => clouansp_map_suite_layer_visible($map_id, '_clouansp_map_show_objects'),
		'showLabels'         => clouansp_map_suite_layer_visible($map_id, '_clouansp_map_show_labels'),
		'parentMaps'         => $parent_maps,
	];
}

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
		wp_add_inline_script(
			'clouansp-map-admin',
			'window.clouanspMapEditor = ' . wp_json_encode(clouansp_map_suite_editor_data()) . ';',
			'before'
		);
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
