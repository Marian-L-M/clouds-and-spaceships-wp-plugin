<?php

/**
 * Runs when the plugin is deleted from the WordPress admin.
 *
 * Always removes:
 *  - Custom DB tables (cns_map_* and cns_story_*)
 *  - Plugin options and render-cache transients
 *  - The manage_maps / manage_stories capabilities from all roles
 *
 * Conditionally removes (each requires opt-in via its Danger Zone setting):
 *  - All maps
 *  - All stories and substories
 *
 * Wiki and glossary posts are always kept — they are the user's articles;
 * delete them manually if desired.
 */

defined('WP_UNINSTALL_PLUGIN') || exit;

global $wpdb;

// ── Custom tables, dropped in reverse dependency order ────────────────────────

$tables = [
	$wpdb->prefix . 'cns_map_hierarchy',
	$wpdb->prefix . 'cns_map_labels',
	$wpdb->prefix . 'cns_map_areas',
	$wpdb->prefix . 'cns_map_objects',
	$wpdb->prefix . 'cns_story_links',
	$wpdb->prefix . 'cns_story_edges',
	$wpdb->prefix . 'cns_story_nodes',
	$wpdb->prefix . 'cns_story_paths',
];

foreach ($tables as $table) {
	// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
	$wpdb->query("DROP TABLE IF EXISTS {$table}");
}

// ── Content, only where the user opted in ─────────────────────────────────────

$opt_in = [
	'cns_map_suite_delete_on_uninstall'   => ['maps'],
	'cns_story_suite_delete_on_uninstall' => ['cns_story', 'cns_substory'],
];

foreach ($opt_in as $option => $post_types) {
	if (! get_option($option)) {
		continue;
	}
	foreach ($post_types as $post_type) {
		$ids = get_posts([
			'post_type'      => $post_type,
			'posts_per_page' => -1,
			'post_status'    => 'any',
			'fields'         => 'ids',
		]);
		foreach ($ids as $id) {
			wp_delete_post((int) $id, true);
		}
	}
}

// ── Options ───────────────────────────────────────────────────────────────────

$options = [
	// Shared
	'cns_db_version',
	'cns_needs_rewrite_flush',
	// Maps
	'cns_map_suite_delete_on_uninstall',
	'cns_map_suite_show_maps_menu',
	'cns_map_suite_archive_enabled',
	'cns_map_suite_archive_slug',
	'cns_map_suite_archive_per_page',
	'cns_map_suite_archive_order',
	'cns_map_suite_cache_ver',
	// Stories
	'cns_story_suite_delete_on_uninstall',
	'cns_story_suite_show_stories_menu',
	'cns_story_suite_show_substories_menu',
	'cns_story_suite_archive_enabled',
	'cns_story_suite_archive_slug',
	'cns_story_suite_archive_per_page',
	'cns_story_suite_archive_order',
	'cns_story_suite_cache_ver',
	// Wiki
	'cns_wiki_settings',
	'cns_wiki_cpt_structure_version',
	// Left behind by the three plugins this one replaces.
	'cns_map_suite_db_version',
	'cns_map_suite_needs_flush',
	'cns_story_suite_db_version',
	'cns_story_suite_needs_flush',
	'cns_wiki_needs_flush',
];

foreach ($options as $option) {
	delete_option($option);
}

// ── Render-cache transients (includes/cache.php) ──────────────────────────────
//
// Keys carry a version suffix, so match by prefix. With an external object
// cache the rows aren't in wp_options, but entries there expire via TTL.

// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared
$wpdb->query(
	"DELETE FROM {$wpdb->options}
	 WHERE option_name LIKE '\_transient\_cns\_map\_rows\_%'
	    OR option_name LIKE '\_transient\_timeout\_cns\_map\_rows\_%'
	    OR option_name LIKE '\_transient\_cns\_story\_rows\_%'
	    OR option_name LIKE '\_transient\_timeout\_cns\_story\_rows\_%'"
);

// Icon-library attachments are user media and stay, but the tag meta that
// marked them as map icons is plugin data — remove it.
delete_post_meta_by_key('_cns_map_icon');

// ── Capabilities ──────────────────────────────────────────────────────────────

foreach (['manage_maps', 'manage_stories'] as $cap) {
	foreach (array_keys(wp_roles()->roles) as $role_name) {
		$role = get_role($role_name);
		if ($role && $role->has_cap($cap)) {
			$role->remove_cap($cap);
		}
	}
}
