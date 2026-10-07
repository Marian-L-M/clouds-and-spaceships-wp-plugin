<?php

/**
 * Plugin Name:       Clouds and Spaceships
 * Plugin URI:        https://cloudsandspaceships.com/
 * Description:       A suite for Worldbuilders, Storytellers, and Mapmakers - Turn an image into an interactive canvas to create informational maps and stories, which can be linked with wiki articles and glossaries.
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

define('CLOUANSP_VERSION', '0.1.0');
define('CLOUANSP_DB_VERSION', '1.0.0');
define('CLOUANSP_DIR', plugin_dir_path(__FILE__));
define('CLOUANSP_URL', plugin_dir_url(__FILE__));

// Admin page slugs
define('CLOUANSP_MAP_PAGE_EDITOR', 'clouansp-map-editor');
define('CLOUANSP_MAP_PAGE_SETTINGS_MAPS', 'clouansp-settings-maps');
define('CLOUANSP_MAP_PAGE_SETTINGS_ICONS', 'clouansp-settings-icons');
define('CLOUANSP_STORY_PAGE_EDITOR', 'clouansp-story-editor');
define('CLOUANSP_STORY_PAGE_SETTINGS', 'clouansp-settings-stories');
define('CLOUANSP_STORY_PAGE_SETTINGS_SUBSTORIES', 'clouansp-settings-substories');

// Shared foundations
require_once CLOUANSP_DIR . 'includes/settings-page.php';
require_once CLOUANSP_DIR . 'includes/capabilities.php';
require_once CLOUANSP_DIR . 'includes/archive.php';
require_once CLOUANSP_DIR . 'includes/cache.php';
require_once CLOUANSP_DIR . 'includes/map-template.php';

// Info tab
require_once CLOUANSP_DIR . 'includes/info/settings.php';

// Wiki suite

require_once CLOUANSP_DIR . 'includes/wiki/settings.php';
require_once CLOUANSP_DIR . 'includes/wiki/post-type.php';
require_once CLOUANSP_DIR . 'includes/wiki/glossary.php';

// Map suite
require_once CLOUANSP_DIR . 'includes/map/post-type.php';
require_once CLOUANSP_DIR . 'includes/map/database.php';
require_once CLOUANSP_DIR . 'includes/map/map-data.php';
require_once CLOUANSP_DIR . 'includes/map/admin/menu.php';
require_once CLOUANSP_DIR . 'includes/map/admin/api.php';
require_once CLOUANSP_DIR . 'includes/map/admin/icons.php';
require_once CLOUANSP_DIR . 'includes/map/admin/post-screen.php';

// Story suite
require_once CLOUANSP_DIR . 'includes/story/post-types.php';
require_once CLOUANSP_DIR . 'includes/story/database.php';
require_once CLOUANSP_DIR . 'includes/story/serializers.php';
require_once CLOUANSP_DIR . 'includes/story/admin/menu.php';
require_once CLOUANSP_DIR . 'includes/story/admin/api.php';

// Blocks
function clouansp_register_blocks(): void {
	if (file_exists(CLOUANSP_DIR . 'build/blocks-manifest.php')) {
		wp_register_block_types_from_metadata_collection(
			CLOUANSP_DIR . 'build/blocks',
			CLOUANSP_DIR . 'build/blocks-manifest.php'
		);
	}
}
add_action('init', 'clouansp_register_blocks');

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
function clouansp_asset(string $handle_path): array {
	$file = CLOUANSP_DIR . 'build/' . $handle_path . '.asset.php';

	return file_exists($file)
		? require $file
		: ['dependencies' => [], 'version' => CLOUANSP_VERSION];
}

// Database schema
// Runs dbDelta() on every plugin update so schema changes are applied
// automatically without requiring a manual deactivate/reactivate cycle.

function clouansp_maybe_upgrade_db(): void {
	if (get_option('clouansp_db_version') !== CLOUANSP_DB_VERSION) {
		clouansp_map_suite_create_tables();
		clouansp_story_suite_create_tables();
		update_option('clouansp_db_version', CLOUANSP_DB_VERSION, false);
	}
}
add_action('plugins_loaded', 'clouansp_maybe_upgrade_db');


// Lifecycle hools
function clouansp_activate(): void {
	clouansp_add_capabilities();
	clouansp_wiki_register_post_type();
	clouansp_wiki_register_glossary_post_type();
	clouansp_map_suite_register_post_type();
	clouansp_story_suite_register_post_types();
	clouansp_map_suite_create_tables();
	clouansp_story_suite_create_tables();
	update_option('clouansp_db_version', CLOUANSP_DB_VERSION, false);
	flush_rewrite_rules();
}
register_activation_hook(__FILE__, 'clouansp_activate');

// Unregister CPTs
function clouansp_deactivate(): void {
	foreach (['clouansp_wiki', 'clouansp_glossary', 'clouansp_map', 'clouansp_story', 'clouansp_substory'] as $post_type) {
		unregister_post_type($post_type);
	}
	flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, 'clouansp_deactivate');
