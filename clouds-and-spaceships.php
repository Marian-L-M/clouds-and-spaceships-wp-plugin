<?php

/**
 * Plugin Name:       Clouds and Spaceships
 * Description:       Clouds and Spaceships is a suite for Worldbuilders and Mapmakers: Connect your map to your post using interactive canvas maps, wiki articles, glossaries, and story paths.
 * Version:           0.1.0
 * Requires at least: 6.8
 * Requires PHP:      8.0
 * Author:            Marian Maschke
 * Author URI:        https://namatamago.dev/
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       clouds-and-spaceships
 *
 * @package Clouds and Spaceships
 *
 */

if (! defined('ABSPATH')) {
	exit;
}

define('CNS_VERSION', '0.1.0');
define('CNS_DB_VERSION', '1.1.0');
define('CNS_DIR', plugin_dir_path(__FILE__));
define('CNS_URL', plugin_dir_url(__FILE__));

// Admin page slugs
define('CNS_MAP_PAGE_EDITOR', 'cns-map-editor');
define('CNS_MAP_PAGE_SETTINGS_MAPS', 'cns-settings-maps');
define('CNS_MAP_PAGE_SETTINGS_ICONS', 'cns-settings-icons');
define('CNS_STORY_PAGE_EDITOR', 'cns-story-editor');
define('CNS_STORY_PAGE_SETTINGS', 'cns-settings-stories');
define('CNS_STORY_PAGE_SETTINGS_SUBSTORIES', 'cns-settings-substories');

// Shared foundations
require_once CNS_DIR . 'includes/settings-page.php';
require_once CNS_DIR . 'includes/capabilities.php';
require_once CNS_DIR . 'includes/archive.php';
require_once CNS_DIR . 'includes/cache.php';
require_once CNS_DIR . 'includes/map-template.php';

// Info tab
require_once CNS_DIR . 'includes/info/settings.php';

// Wiki suite

require_once CNS_DIR . 'includes/wiki/settings.php';
require_once CNS_DIR . 'includes/wiki/post-type.php';
require_once CNS_DIR . 'includes/wiki/glossary.php';

// Map suite
require_once CNS_DIR . 'includes/map/post-type.php';
require_once CNS_DIR . 'includes/map/database.php';
require_once CNS_DIR . 'includes/map/map-data.php';
require_once CNS_DIR . 'includes/map/admin/menu.php';
require_once CNS_DIR . 'includes/map/admin/api.php';
require_once CNS_DIR . 'includes/map/admin/icons.php';
require_once CNS_DIR . 'includes/map/admin/post-screen.php';

// Story suite
require_once CNS_DIR . 'includes/story/post-types.php';
require_once CNS_DIR . 'includes/story/database.php';
require_once CNS_DIR . 'includes/story/serializers.php';
require_once CNS_DIR . 'includes/story/admin/menu.php';
require_once CNS_DIR . 'includes/story/admin/api.php';

// Translations are loaded by WordPress itself: the text domain matches the
// plugin slug, so wp.org's language packs are picked up with no call of our
// own (core has done this since 4.6, and just-in-time since 6.7).

// Blocks
function cns_register_blocks(): void {
	if (file_exists(CNS_DIR . 'build/blocks-manifest.php')) {
		wp_register_block_types_from_metadata_collection(
			CNS_DIR . 'build/blocks',
			CNS_DIR . 'build/blocks-manifest.php'
		);
	}
}
add_action('init', 'cns_register_blocks');

// Admin settings
/**
 * Dependencies and version for a built bundle, from its wp-scripts manifest.
 *
 * Falls back to the plugin version with no dependencies when the manifest is
 * missing, so an unbuilt checkout degrades instead of fataling.
 *
 * @param string $handle_path Path under build/, e.g. 'map-admin/index'.
 * @return array{dependencies: string[], version: string}
 */
function cns_asset(string $handle_path): array {
	$file = CNS_DIR . 'build/' . $handle_path . '.asset.php';

	return file_exists($file)
		? require $file
		: ['dependencies' => [], 'version' => CNS_VERSION];
}

// Database schema
// Runs dbDelta() on every plugin update so schema changes are applied
// automatically without requiring a manual deactivate/reactivate cycle.

function cns_maybe_upgrade_db(): void {
	if (get_option('cns_db_version') !== CNS_DB_VERSION) {
		cns_map_suite_create_tables();
		cns_story_suite_create_tables();
		cns_migrate_post_type_prefixes();
		update_option('cns_db_version', CNS_DB_VERSION, false);
	}
}
add_action('plugins_loaded', 'cns_maybe_upgrade_db');

/**
 * Moves content onto the prefixed post type and taxonomy names.
 *
 * The three oldest types were registered as 'maps', 'wiki' and 'glossary' —
 * names generic enough that another plugin could claim them and silently take
 * over this plugin's content. They are now cns_map / cns_wiki / cns_glossary,
 * and the rows have to follow or the existing content becomes invisible.
 *
 * Permalinks are unaffected: each type already declares an explicit
 * rewrite slug ('maps', the wiki archive slug, the glossary slug), and
 * has_archive derives its own slug from that, so public URLs are unchanged.
 *
 * Runs once, guarded by cns_db_version, and is written to be safe to re-run:
 * every statement is a no-op once there are no old rows left.
 */
function cns_migrate_post_type_prefixes(): void {
	global $wpdb;

	// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
	$post_types = [
		'maps'     => 'cns_map',
		'wiki'     => 'cns_wiki',
		'glossary' => 'cns_glossary',
	];

	$moved = 0;
	foreach ($post_types as $old => $new) {
		// Collect first: after the update these rows no longer match $old, and
		// each one's cached WP_Post still carries the stale post_type.
		$ids = $wpdb->get_col($wpdb->prepare(
			"SELECT ID FROM {$wpdb->posts} WHERE post_type = %s",
			$old
		));
		if (! $ids) {
			continue;
		}

		$wpdb->update(
			$wpdb->posts,
			['post_type' => $new],
			['post_type' => $old],
			['%s'],
			['%s']
		);
		$moved += count($ids);

		foreach ($ids as $id) {
			clean_post_cache((int) $id);
		}
	}

	$terms = $wpdb->get_col($wpdb->prepare(
		"SELECT term_id FROM {$wpdb->term_taxonomy} WHERE taxonomy = %s",
		'glossary_category'
	));
	if ($terms) {
		$wpdb->update(
			$wpdb->term_taxonomy,
			['taxonomy' => 'cns_glossary_category'],
			['taxonomy' => 'glossary_category'],
			['%s'],
			['%s']
		);
		$moved += count($terms);
		clean_taxonomy_cache('cns_glossary_category');
		foreach ($terms as $term_id) {
			clean_term_cache((int) $term_id, 'cns_glossary_category');
		}
	}
	// phpcs:enable WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching

	if ($moved > 0) {
		// Rewrite rules were built for the old type names.
		cns_schedule_rewrite_flush();
	}
}

// Lifecycle hools
function cns_activate(): void {
	cns_add_capabilities();
	cns_wiki_register_post_type();
	cns_wiki_register_glossary_post_type();
	cns_map_suite_register_post_type();
	cns_story_suite_register_post_types();
	cns_map_suite_create_tables();
	cns_story_suite_create_tables();
	update_option('cns_db_version', CNS_DB_VERSION, false);
	flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'cns_activate');

// Unregister CPTs
function cns_deactivate(): void {
	foreach (['cns_wiki', 'cns_glossary', 'cns_map', 'cns_story', 'cns_substory'] as $post_type) {
		unregister_post_type($post_type);
	}
	flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, 'cns_deactivate');
