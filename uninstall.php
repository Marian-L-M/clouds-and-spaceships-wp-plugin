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
 *  - All wiki articles
 *  - All glossary entries
 *  - The icon library's SVG attachments
 *
 * Every one of those defaults to off, so an uninstall with untouched settings
 * still leaves all of the user's content in place.
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

// The wiki and glossary flags live inside the shared cns_wiki_settings array
// rather than in options of their own; read it before the options loop below
// deletes it.
$wiki_settings = (array) get_option('cns_wiki_settings', []);

$opt_in = [
	['enabled' => (bool) get_option('cns_map_suite_delete_on_uninstall'),   'post_types' => ['maps']],
	['enabled' => (bool) get_option('cns_story_suite_delete_on_uninstall'), 'post_types' => ['cns_story', 'cns_substory']],
	['enabled' => ! empty($wiki_settings['wiki_delete_on_uninstall']),      'post_types' => ['wiki']],
	['enabled' => ! empty($wiki_settings['glossary_delete_on_uninstall']),  'post_types' => ['glossary']],
];

foreach ($opt_in as $group) {
	if (! $group['enabled']) {
		continue;
	}
	foreach ($group['post_types'] as $post_type) {
		// The plugin is not loaded here, so these post types are unregistered.
		// WP_Query builds the post_type/post_status clauses straight from the
		// arguments and guards its post-type-object lookups, so the query is
		// unaffected by that.
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

// Icon library. These are ordinary media attachments the plugin only tagged, so
// deleting them is a separate opt-in from the map posts — and it must run before
// the _cns_map_icon meta is dropped below, which is what identifies them.
if (get_option('cns_map_suite_delete_icons_on_uninstall')) {
	$icon_ids = get_posts([
		'post_type'      => 'attachment',
		'post_status'    => 'inherit',
		'posts_per_page' => -1,
		'fields'         => 'ids',
		'meta_query'     => [['key' => '_cns_map_icon', 'value' => '1']],
	]);
	foreach ($icon_ids as $icon_id) {
		wp_delete_attachment((int) $icon_id, true);
	}
}

// ── Options ───────────────────────────────────────────────────────────────────

$options = [
	// Shared
	'cns_db_version',
	'cns_needs_rewrite_flush',
	// Maps
	'cns_map_suite_delete_on_uninstall',
	'cns_map_suite_delete_icons_on_uninstall',
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

// Any icon attachment still present is user media and stays, but the tag meta
// that marked it as a map icon is plugin data — remove it.
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
