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
define('CNS_BASENAME', plugin_basename(__FILE__));

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

// Story suite
require_once CNS_DIR . 'includes/story/post-types.php';
require_once CNS_DIR . 'includes/story/database.php';
require_once CNS_DIR . 'includes/story/serializers.php';
require_once CNS_DIR . 'includes/story/admin/menu.php';
require_once CNS_DIR . 'includes/story/admin/api.php';

// Multi language
function cns_load_textdomain(): void {
	load_plugin_textdomain(
		'clouds-and-spaceships',
		false,
		dirname(CNS_BASENAME) . '/languages'
	);
}
add_action('init', 'cns_load_textdomain');

// Blocks
function cns_register_blocks(): void {
	if (file_exists(CNS_DIR . 'build/blocks-manifest.php')) {
		wp_register_block_types_from_metadata_collection(
			CNS_DIR . 'build/blocks',
			CNS_DIR . 'build/blocks-manifest.php'
		);
	} elseif (defined('WP_DEBUG') && WP_DEBUG) {
		trigger_error('Clouds and Spaceships: block manifest not found — run `npm run build` in the plugin directory.', E_USER_NOTICE);
	}
}
add_action('init', 'cns_register_blocks');

// Admin settings
// Toast notifications
function cns_register_toast(): void {
	$asset_file = CNS_DIR . 'build/toast/index.asset.php';
	$asset      = file_exists($asset_file)
		? require $asset_file
		: ['dependencies' => [], 'version' => CNS_VERSION];

	wp_register_script('cns-toast', CNS_URL . 'build/toast/index.js', $asset['dependencies'], $asset['version'], true);
	wp_register_style('cns-toast', CNS_URL . 'build/toast/index.css', [], $asset['version']);
}
add_action('init', 'cns_register_toast');

function cns_enqueue_toast(): void {
	wp_enqueue_script('cns-toast');
	wp_enqueue_style('cns-toast');
}
add_action('admin_enqueue_scripts', 'cns_enqueue_toast');

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
	foreach (['wiki', 'glossary', 'maps', 'cns_story', 'cns_substory'] as $post_type) {
		unregister_post_type($post_type);
	}
	flush_rewrite_rules();
}
register_deactivation_hook(__FILE__, 'cns_deactivate');
