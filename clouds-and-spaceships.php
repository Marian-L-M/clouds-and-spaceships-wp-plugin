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
define('CNS_DB_VERSION', '1.0.0');
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
		update_option('cns_db_version', CNS_DB_VERSION, false);
	}
}
add_action('plugins_loaded', 'cns_maybe_upgrade_db');


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
