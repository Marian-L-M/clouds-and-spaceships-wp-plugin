<?php

defined('ABSPATH') || exit;

/**
 * Minimal render-data cache for the custom clouansp_map_* and clouansp_story_* tables.
 *
 * Only raw table rows are cached (via transients, so a persistent object cache
 * is picked up automatically when one is installed). Everything WordPress can
 * already cache — posts, meta, attachment URLs — and all capability-dependent
 * work stays live per request: clouansp_story_suite_serialize_node() applies
 * per-user visibility rules, so its output must never be shared between
 * visitors. Page/object caching remains the job of dedicated caching plugins.
 *
 * Invalidation is a single global version bump baked into the cache key: any
 * write through the suite's REST API, or the deletion of a map or story,
 * starts a fresh generation, and superseded entries simply expire via TTL.
 * This avoids per-key tracking and covers cross-map effects (hierarchy rows
 * are cached under both parent and child maps) for free.
 */

const CLOUANSP_CACHE_TTL = 12 * HOUR_IN_SECONDS;

/**
 * Cached row groups, keyed by the name used in transient keys and options.
 *
 * post_type      the CPT whose deletion invalidates the group
 * rest_namespace writes under this REST route start a new generation
 */
const CLOUANSP_CACHE_GROUPS = [
	'map'   => ['post_type' => 'clouansp_map',      'rest_namespace' => '/clouansp-map-suite/v1/'],
	'story' => ['post_type' => 'clouansp_story', 'rest_namespace' => '/clouansp-story-suite/v1/'],
];

function clouansp_cache_key(string $group, int $post_id): string {
	$ver = (int) get_option("clouansp_{$group}_suite_cache_ver", 0);
	return "clouansp_{$group}_rows_{$post_id}_v{$ver}";
}

/** Returns the cached row sets for a post, keyed by kind ('objects', 'nodes', …). */
function clouansp_cache_get(string $group, int $post_id): array {
	$rows = get_transient(clouansp_cache_key($group, $post_id));
	return is_array($rows) ? $rows : [];
}

function clouansp_cache_set(string $group, int $post_id, array $rows): void {
	set_transient(clouansp_cache_key($group, $post_id), $rows, CLOUANSP_CACHE_TTL);
}

function clouansp_cache_flush(string $group): void {
	$option = "clouansp_{$group}_suite_cache_ver";
	update_option($option, (int) get_option($option, 0) + 1, true);
}

// Every table write goes through the suite's REST namespace, so one route
// check replaces a flush call in each mutation callback.
add_filter('rest_request_after_callbacks', function ($response, $handler, $request) {
	if (in_array($request->get_method(), ['GET', 'HEAD'], true) || is_wp_error($response)) {
		return $response;
	}
	foreach (CLOUANSP_CACHE_GROUPS as $group => $meta) {
		if (str_starts_with($request->get_route(), $meta['rest_namespace'])) {
			clouansp_cache_flush($group);
			break;
		}
	}
	return $response;
}, 10, 3);

// Deleting a map or a story removes table rows without going through the
// REST API (admin overview handlers, trash emptying, wp-cli).
add_action('deleted_post', function (int $post_id, WP_Post $post): void {
	foreach (CLOUANSP_CACHE_GROUPS as $group => $meta) {
		if ($post->post_type === $meta['post_type']) {
			clouansp_cache_flush($group);
			return;
		}
	}
}, 10, 2);
