<?php

defined('ABSPATH') || exit;

// Handle individual map delete.
// Nonces are CSRF protection, not authorization — check the capability and
// the post type explicitly so this can never delete an arbitrary post.
if (
	isset($_GET['action'], $_GET['map_id']) &&
	$_GET['action'] === 'delete' &&
	current_user_can('manage_maps') &&
	check_admin_referer('cns_delete_map_' . (int) $_GET['map_id'])
) {
	$map_id = (int) $_GET['map_id'];
	if (get_post_type($map_id) === 'maps') {
		wp_delete_post($map_id, true);
	}
	wp_safe_redirect(add_query_arg(
		['page' => sanitize_key($_GET['page'] ?? CNS_MAP_PAGE_SETTINGS_MAPS), 'deleted' => '1'],
		admin_url('admin.php')
	));
	exit;
}

// Handle the Icons tab's settings save.
if (
	isset($_POST['cns_map_action']) &&
	$_POST['cns_map_action'] === 'save_icon_settings' &&
	current_user_can('manage_maps') &&
	check_admin_referer('cns_map_save_icon_settings')
) {
	update_option('cns_map_suite_delete_icons_on_uninstall', isset($_POST['delete_icons_on_uninstall']) ? 1 : 0, false);

	wp_safe_redirect(add_query_arg(
		['page' => CNS_MAP_PAGE_SETTINGS_ICONS, 'settings-saved' => '1'],
		admin_url('admin.php')
	));
	exit;
}

// Handle plugin settings save (admin visibility, uninstall).
if (
	isset($_POST['cns_map_action']) &&
	$_POST['cns_map_action'] === 'save_settings' &&
	current_user_can('manage_maps') &&
	check_admin_referer('cns_map_save_settings')
) {
	update_option('cns_map_suite_delete_on_uninstall', isset($_POST['delete_on_uninstall']) ? 1 : 0, false);
	update_option('cns_map_suite_show_maps_menu',      isset($_POST['show_maps_menu']) ? 1 : 0);

	// Zoom control colors. A cleared field posts nothing (the input is disabled
	// by the "Use default" checkbox), which stores an empty string and returns
	// the controls to the stylesheet fallback.
	update_option('cns_map_suite_zoom_main_color',   cns_map_suite_sanitize_optional_color((string) ($_POST['zoom_main_color']   ?? '')));
	update_option('cns_map_suite_zoom_accent_color', cns_map_suite_sanitize_optional_color((string) ($_POST['zoom_accent_color'] ?? '')));

	// Nothing archive-related is saved: the plugin publishes no map archive.
	wp_safe_redirect(add_query_arg(
		['page' => sanitize_key($_GET['page'] ?? CNS_MAP_PAGE_SETTINGS_MAPS), 'settings-saved' => '1'],
		admin_url('admin.php')
	));
	exit;
}
