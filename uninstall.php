<?php

/**
 * Runs when the plugin is deleted from the WordPress admin.
 *
 * Always removes:
 *  - Custom DB tables (clouansp_map_* and clouansp_story_*)
 *  - Plugin options and render-cache transients
 *  - The clouansp_manage_maps / clouansp_manage_stories capabilities from all roles
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

/**
 * Direct database access notice.
 *
 * Uninstall drops the plugin's own custom tables and deletes its rows. This
 * runs once, at uninstall, and there is nothing to cache or to read through a
 * WordPress API instead.
 */
// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.DirectDatabaseQuery.SchemaChange

global $wpdb;

// ── Custom tables, dropped in reverse dependency order ────────────────────────

$tables = [
	$wpdb->prefix . 'clouansp_map_hierarchy',
	$wpdb->prefix . 'clouansp_map_labels',
	$wpdb->prefix . 'clouansp_map_areas',
	$wpdb->prefix . 'clouansp_map_objects',
	$wpdb->prefix . 'clouansp_story_edges',
	$wpdb->prefix . 'clouansp_story_nodes',
	$wpdb->prefix . 'clouansp_story_paths',
];

foreach ($tables as $table) {
	// $table comes from the fixed list above, built from $wpdb->prefix; a table
	// name cannot be passed as a placeholder.
	// phpcs:ignore WordPress.DB.PreparedSQL.NotPrepared,WordPress.DB.PreparedSQL.InterpolatedNotPrepared
	$wpdb->query("DROP TABLE IF EXISTS {$table}");
}

// ── Content ───────────────────────────────────────────────────────────────────

// The wiki and glossary flags live inside the shared clouansp_wiki_settings array
// rather than in options of their own; read it before the options loop below
// deletes it.
$wiki_settings = (array) get_option('clouansp_wiki_settings', []);

// Maps and stories are always deleted. Their substance lives entirely in the
// clouansp_map_* / clouansp_story_* tables dropped above — a map is its objects, areas and
// labels; a story is its nodes, paths and edges — so the surviving post would be
// an entry nothing can render or edit. A map's description and a story's do go
// with it; that text is a caption for geometry that no longer exists.
//
// Everything else is authored writing that still reads without the plugin, so it
// stays opt-in: wiki articles and glossary entries are ordinary post content,
// and a substory is an article in its own right that happens to be shown at a
// story node.
$delete_post_types = ['clouansp_map', 'clouansp_story'];

if ((bool) get_option('clouansp_story_suite_delete_substories_on_uninstall')) {
	$delete_post_types[] = 'clouansp_substory';
}
if (! empty($wiki_settings['wiki_delete_on_uninstall'])) {
	$delete_post_types[] = 'clouansp_wiki';
}
if (! empty($wiki_settings['glossary_delete_on_uninstall'])) {
	$delete_post_types[] = 'clouansp_glossary';
}

foreach ($delete_post_types as $post_type) {
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
		// wp_delete_post() re-parents attachments rather than deleting them, so
		// a map's featured image and background stay in the media library.
		wp_delete_post((int) $id, true);
	}
}

// Icon library. These are ordinary media attachments the plugin only tagged, so
// deleting them is a separate opt-in from the map posts — and it must run before
// the _clouansp_map_icon meta is dropped below, which is what identifies them.
if (get_option('clouansp_map_suite_delete_icons_on_uninstall')) {
	// Runs once, during uninstall, and only when the user opted in. The meta
	// flag is the only thing identifying a library icon.
	$icon_ids = get_posts([
		'post_type'      => 'attachment',
		'post_status'    => 'inherit',
		'posts_per_page' => -1,
		'fields'         => 'ids',
		// phpcs:ignore WordPress.DB.SlowDBQuery.slow_db_query_meta_query
		'meta_query'     => [['key' => '_clouansp_map_icon', 'value' => '1']],
		'no_found_rows'          => true,
		'update_post_meta_cache' => false,
		'update_post_term_cache' => false,
	]);
	foreach ($icon_ids as $icon_id) {
		wp_delete_attachment((int) $icon_id, true);
	}
}

// ── Options ───────────────────────────────────────────────────────────────────

$options = [
	// Shared
	'clouansp_db_version',
	'clouansp_needs_rewrite_flush',
	// Maps
	'clouansp_map_suite_delete_icons_on_uninstall',
	'clouansp_map_suite_show_maps_menu',
	'clouansp_map_suite_zoom_main_color',
	'clouansp_map_suite_zoom_accent_color',
	'clouansp_map_suite_cache_ver',
	// Stories
	'clouansp_story_suite_delete_substories_on_uninstall',
	'clouansp_story_suite_show_stories_menu',
	'clouansp_story_suite_show_substories_menu',
	'clouansp_story_suite_archive_enabled',
	'clouansp_story_suite_archive_slug',
	'clouansp_story_suite_placeholder_thumb_id',
	'clouansp_story_suite_cache_ver',
	// Wiki
	'clouansp_wiki_settings',
	'clouansp_wiki_cpt_structure_version',
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
	 WHERE option_name LIKE '\_transient\_clouansp\_map\_rows\_%'
	    OR option_name LIKE '\_transient\_timeout\_clouansp\_map\_rows\_%'
	    OR option_name LIKE '\_transient\_clouansp\_story\_rows\_%'
	    OR option_name LIKE '\_transient\_timeout\_clouansp\_story\_rows\_%'"
);

// Any icon attachment still present is user media and stays, but the tag meta
// that marked it as a map icon is plugin data — remove it.
delete_post_meta_by_key('_clouansp_map_icon');

// ── Capabilities ──────────────────────────────────────────────────────────────
// WordPress loads only this file on uninstall, not the plugin bootstrap, so the
// helper has to be pulled in explicitly. Calling it keeps CLOUANSP_CAPABILITIES the
// single list of capabilities the plugin owns.

require_once __DIR__ . '/includes/capabilities.php';
clouansp_remove_capabilities();
