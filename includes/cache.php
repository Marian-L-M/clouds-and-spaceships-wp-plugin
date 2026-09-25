<?php

defined('ABSPATH') || exit;

/**
 * Minimal render-data cache for the custom cns_map_* and cns_story_* tables.
 *
 * Only raw table rows are cached (via transients, so a persistent object cache
 * is picked up automatically when one is installed). Everything WordPress can
 * already cache — posts, meta, attachment URLs — and all capability-dependent
 * work stays live per request: cns_story_suite_serialize_node() applies
 * per-user visibility rules, so its output must never be shared between
 * visitors. Page/object caching remains the job of dedicated caching plugins.
 *
 * Invalidation is a single global version bump baked into the cache key: any
 * write through the suite's REST API, or the deletion of a map or story,
 * starts a fresh generation, and superseded entries simply expire via TTL.
 * This avoids per-key tracking and covers cross-map effects (hierarchy rows
 * are cached under both parent and child maps) for free.
 *
 * The map and story suites each shipped an identical copy of this before the
 * merge; the two differed only in the names below.
 */

const CNS_CACHE_TTL = 12 * HOUR_IN_SECONDS;

/**
 * Cached row groups, keyed by the name used in transient keys and options.
 *
 * post_type      the CPT whose deletion invalidates the group
 * rest_namespace writes under this REST route start a new generation
 */
const CNS_CACHE_GROUPS = [
	'map'   => ['post_type' => 'cns_map',      'rest_namespace' => '/cns-map-suite/v1/'],
	'story' => ['post_type' => 'cns_story', 'rest_namespace' => '/cns-story-suite/v1/'],
];

function cns_cache_key(string $group, int $post_id): string {
	$ver = (int) get_option("cns_{$group}_suite_cache_ver", 0);
	return "cns_{$group}_rows_{$post_id}_v{$ver}";
}

/** Returns the cached row sets for a post, keyed by kind ('objects', 'nodes', …). */
function cns_cache_get(string $group, int $post_id): array {
	$rows = get_transient(cns_cache_key($group, $post_id));
	return is_array($rows) ? $rows : [];
}

function cns_cache_set(string $group, int $post_id, array $rows): void {
	set_transient(cns_cache_key($group, $post_id), $rows, CNS_CACHE_TTL);
}

function cns_cache_flush(string $group): void {
	$option = "cns_{$group}_suite_cache_ver";
	update_option($option, (int) get_option($option, 0) + 1, true);
}

// Every table write goes through the suite's REST namespace, so one route
// check replaces a flush call in each mutation callback.
add_filter('rest_request_after_callbacks', function ($response, $handler, $request) {
	if (in_array($request->get_method(), ['GET', 'HEAD'], true) || is_wp_error($response)) {
		return $response;
	}
	foreach (CNS_CACHE_GROUPS as $group => $meta) {
		if (str_starts_with($request->get_route(), $meta['rest_namespace'])) {
			cns_cache_flush($group);
			break;
		}
	}
	return $response;
}, 10, 3);

// Deleting a map or a story removes table rows without going through the
// REST API (admin overview handlers, trash emptying, wp-cli).
add_action('deleted_post', function (int $post_id, WP_Post $post): void {
	foreach (CNS_CACHE_GROUPS as $group => $meta) {
		if ($post->post_type === $meta['post_type']) {
			cns_cache_flush($group);
			return;
		}
	}
}, 10, 2);
