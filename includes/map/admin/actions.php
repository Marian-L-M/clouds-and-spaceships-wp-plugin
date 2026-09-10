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

// Handle plugin settings save (archive, admin visibility, uninstall).
if (
	isset($_POST['cns_map_action']) &&
	$_POST['cns_map_action'] === 'save_settings' &&
	current_user_can('manage_maps') &&
	check_admin_referer('cns_map_save_settings')
) {
	update_option('cns_map_suite_delete_on_uninstall', isset($_POST['delete_on_uninstall']) ? 1 : 0, false);
	update_option('cns_map_suite_show_maps_menu',      isset($_POST['show_maps_menu']) ? 1 : 0);

	// Archive. The slug and enabled flag are watched in includes/archive.php,
	// which schedules a rewrite flush for the next init.
	update_option('cns_map_suite_archive_enabled', isset($_POST['archive_enabled']) ? 1 : 0);

	$slug = preg_replace('/[^a-z0-9\-]/', '', strtolower((string) ($_POST['archive_slug'] ?? '')));
	update_option('cns_map_suite_archive_slug', $slug ?: 'maps');

	update_option('cns_map_suite_archive_per_page', max(1, (int) ($_POST['archive_per_page'] ?? CNS_ARCHIVE_DEFAULT_PER_PAGE)));

	$order = sanitize_key((string) ($_POST['archive_order'] ?? ''));
	update_option(
		'cns_map_suite_archive_order',
		array_key_exists($order, cns_archive_order_options()) ? $order : CNS_ARCHIVE_DEFAULT_ORDER
	);
	wp_safe_redirect(add_query_arg(
		['page' => sanitize_key($_GET['page'] ?? CNS_MAP_PAGE_SETTINGS_MAPS), 'settings-saved' => '1'],
		admin_url('admin.php')
	));
	exit;
}
