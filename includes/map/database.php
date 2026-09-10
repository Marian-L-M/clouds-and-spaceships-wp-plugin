<?php

defined('ABSPATH') || exit;

/**
 * DB query standard: all future SELECT / INSERT / UPDATE / DELETE against the
 * custom tables must use $wpdb->prepare() for any value derived from user input
 * or external data. The CREATE TABLE calls below are exempt — they contain no
 * user-supplied values and dbDelta() does not support placeholders.
 *
 * Correct pattern:
 *   $wpdb->get_results( $wpdb->prepare(
 *       "SELECT * FROM {$wpdb->prefix}cns_map_objects WHERE map_id = %d",
 *       $map_id
 *   ) );
 */
function cns_map_suite_create_tables(): void {
	global $wpdb;

	$charset_collate = $wpdb->get_charset_collate();

	require_once ABSPATH . 'wp-admin/includes/upgrade.php';

	// Clickable SVG icon markers on a map.
	dbDelta("CREATE TABLE {$wpdb->prefix}cns_map_objects (
		id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
		map_id BIGINT UNSIGNED NOT NULL,
		linked_post_id BIGINT UNSIGNED NULL DEFAULT NULL,
		type VARCHAR(20) NOT NULL DEFAULT 'LOCATION',
		svg_slug VARCHAR(100) NOT NULL DEFAULT '',
		icon_image_id BIGINT UNSIGNED NULL DEFAULT NULL,
		title VARCHAR(255) NOT NULL DEFAULT '',
		x INT NOT NULL DEFAULT 0,
		y INT NOT NULL DEFAULT 0,
		object_time INT NOT NULL DEFAULT 0,
		infobox_source VARCHAR(10) NOT NULL DEFAULT 'manual',
		infobox_data LONGTEXT NULL DEFAULT NULL,
		canvas_styles LONGTEXT NULL DEFAULT NULL,
		created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		PRIMARY KEY (id),
		KEY idx_map_id (map_id),
		KEY idx_linked_post (linked_post_id)
	) $charset_collate;");

	// Polygon / bezier / circle overlay areas on a map.
	dbDelta("CREATE TABLE {$wpdb->prefix}cns_map_areas (
		id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
		map_id BIGINT UNSIGNED NOT NULL,
		linked_post_id BIGINT UNSIGNED NULL DEFAULT NULL,
		type VARCHAR(20) NOT NULL DEFAULT 'POLITICAL',
		shape_type VARCHAR(20) NOT NULL DEFAULT 'POLYGON',
		title VARCHAR(255) NOT NULL DEFAULT '',
		object_time INT NOT NULL DEFAULT 0,
		nodes LONGTEXT NOT NULL,
		background_image_id BIGINT UNSIGNED NULL DEFAULT NULL,
		infobox_source VARCHAR(10) NOT NULL DEFAULT 'manual',
		infobox_data LONGTEXT NULL DEFAULT NULL,
		canvas_styles LONGTEXT NULL DEFAULT NULL,
		created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		PRIMARY KEY (id),
		KEY idx_map_id (map_id),
		KEY idx_linked_post (linked_post_id)
	) $charset_collate;");

	// Text labels drawn directly on a map.
	// placement: 'centered' = label box centered on (x, y);
	//            'indicator' = dot at (x, y) with a leader line to the label
	//            box, which sits at (x + offset_x, y + offset_y).
	dbDelta("CREATE TABLE {$wpdb->prefix}cns_map_labels (
		id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
		map_id BIGINT UNSIGNED NOT NULL,
		linked_post_id BIGINT UNSIGNED NULL DEFAULT NULL,
		text VARCHAR(255) NOT NULL DEFAULT '',
		x INT NOT NULL DEFAULT 0,
		y INT NOT NULL DEFAULT 0,
		placement VARCHAR(10) NOT NULL DEFAULT 'centered',
		offset_x INT NOT NULL DEFAULT 40,
		offset_y INT NOT NULL DEFAULT -40,
		object_time INT NOT NULL DEFAULT 0,
		infobox_source VARCHAR(10) NOT NULL DEFAULT 'manual',
		infobox_data LONGTEXT NULL DEFAULT NULL,
		canvas_styles LONGTEXT NULL DEFAULT NULL,
		created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		PRIMARY KEY (id),
		KEY idx_map_id (map_id),
		KEY idx_linked_post (linked_post_id)
	) $charset_collate;");

	// Parent → child map relationships for MasterMap mode.
	// One row per child; multiple rows with the same parent_map_id form the child list.
	dbDelta("CREATE TABLE {$wpdb->prefix}cns_map_hierarchy (
		id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
		parent_map_id BIGINT UNSIGNED NOT NULL,
		child_map_id BIGINT UNSIGNED NOT NULL,
		shape_type VARCHAR(20) NOT NULL DEFAULT 'POLYGON',
		nodes LONGTEXT NOT NULL,
		canvas_styles LONGTEXT NULL DEFAULT NULL,
		title_override VARCHAR(255) NULL DEFAULT NULL,
		description_override LONGTEXT NULL DEFAULT NULL,
		created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
		updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
		PRIMARY KEY (id),
		UNIQUE KEY uq_parent_child (parent_map_id, child_map_id),
		KEY idx_parent_map (parent_map_id),
		KEY idx_child_map (child_map_id)
	) $charset_collate;");
}

// ── Row cleanup on permanent post deletion ────────────────────────────────────
// Runs for every permanent deletion path (admin handler, wp-cli, REST), so a
// deleted map can never leave orphaned object/area/label/hierarchy rows.

function cns_map_suite_purge_map_rows(int $map_id): void {
	global $wpdb;
	$wpdb->delete($wpdb->prefix . 'cns_map_objects', ['map_id' => $map_id], ['%d']);
	$wpdb->delete($wpdb->prefix . 'cns_map_areas',   ['map_id' => $map_id], ['%d']);
	$wpdb->delete($wpdb->prefix . 'cns_map_labels',  ['map_id' => $map_id], ['%d']);
	// Hierarchy rows reference the map from either side.
	$wpdb->delete($wpdb->prefix . 'cns_map_hierarchy', ['parent_map_id' => $map_id], ['%d']);
	$wpdb->delete($wpdb->prefix . 'cns_map_hierarchy', ['child_map_id'  => $map_id], ['%d']);
}

add_action('before_delete_post', function (int $post_id, WP_Post $post): void {
	if ($post->post_type === 'maps') {
		cns_map_suite_purge_map_rows($post_id);
	}
}, 10, 2);
