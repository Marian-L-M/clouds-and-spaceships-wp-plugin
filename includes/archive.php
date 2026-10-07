<?php
/**
 * Post type archives — settings and rewrite maintenance.
 *
 * The map, story and wiki suites each shipped their own copy of this: the same
 * archive settings and the same "flag now, flush on the next init" rewrite
 * dance. This is the single implementation.
 *
 * Only the on/off switch and the slug are owned here. The plugin registers no
 * archive template for any post type, so every listing is rendered by the
 * theme, and its paging and sort order follow the theme and the site's Reading
 * Settings rather than a plugin setting.
 *
 * The two use different storage, which this reads over:
 *
 *   clouansp_story   one option per field, prefixed clouansp_story_suite_
 *   clouansp_wiki    archive_slug inside the clouansp_wiki_settings option array
 *
 * The story archive ships disabled. Enabling it publishes a listing at /{slug}/
 * that did not exist before, so it is an explicit choice rather than a side
 * effect of updating the plugin. The wiki archive is always on.
 *
 * Substories are deliberately not given an archive: they are fragments shown
 * inside a story, not standalone entries worth listing on their own.
 */

defined('ABSPATH') || exit;

/**
 * Archives whose settings live in one option per field.
 *
 * Maps are deliberately absent: the plugin publishes no map archive. Single map
 * pages are public and render through the single-clouansp_map template, but a listing
 * of maps is the theme's or the Site Editor's job, so there is no setting to own.
 */
const CLOUANSP_OPTION_ARCHIVES = [
	'clouansp_story' => ['prefix' => 'clouansp_story_suite_', 'default_slug' => 'stories'],
];

/** Lowercase slug, falling back to the suite default when empty or invalid. */
function clouansp_archive_sanitize_slug(string $slug, string $default): string {
	return preg_replace('/[^a-z0-9\-]/', '', strtolower($slug)) ?: $default;
}

/**
 * Accessors for one archive, keyed by post type. Built once per request.
 *
 * @return array{enabled:callable,slug:callable}|null
 */
function clouansp_archive_config(string $post_type): ?array {
	static $config = null;

	if (null === $config) {
		$config = [];

		foreach (CLOUANSP_OPTION_ARCHIVES as $type => $meta) {
			$prefix  = $meta['prefix'];
			$default = $meta['default_slug'];

			$config[$type] = [
				'enabled'  => static fn(): bool   => (bool) get_option($prefix . 'archive_enabled', false),
				'slug'     => static fn(): string => clouansp_archive_sanitize_slug(
					(string) get_option($prefix . 'archive_slug', $default),
					$default
				),
			];
		}

		// The wiki archive has no on/off switch — the CPT has always shipped
		// with has_archive => true. Only the slug is owned here, because it is
		// the same slug the single permalinks use.
		$config['clouansp_wiki'] = [
			'enabled'  => static fn(): bool   => true,
			'slug'     => static fn(): string => clouansp_archive_sanitize_slug(
				(string) clouansp_get_wiki_setting('archive_slug', 'wiki'),
				'wiki'
			),
		];
	}

	return $config[$post_type] ?? null;
}

function clouansp_archive_enabled(string $post_type): bool {
	$config = clouansp_archive_config($post_type);
	return $config ? (bool) ($config['enabled'])() : false;
}

/** Slug used for both the archive and the single-post permalinks. */
function clouansp_archive_slug(string $post_type): string {
	$config = clouansp_archive_config($post_type);
	return $config ? (string) ($config['slug'])() : $post_type;
}

// ── Rewrite maintenance ───────────────────────────────────────────────────────
//
// flush_rewrite_rules() has to run AFTER the CPT re-registers with the new
// slug. On the request that saves the option, init has already fired with the
// old slug, so flushing there would bake the old value back into the rules.
// Instead a flag is set on save and the flush happens on the next init.

foreach (CLOUANSP_OPTION_ARCHIVES as $clouansp_archive_meta) {
	foreach (['archive_slug', 'archive_enabled'] as $clouansp_archive_key) {
		$clouansp_archive_option = $clouansp_archive_meta['prefix'] . $clouansp_archive_key;
		add_action("update_option_{$clouansp_archive_option}", 'clouansp_schedule_rewrite_flush');
		add_action("add_option_{$clouansp_archive_option}", 'clouansp_schedule_rewrite_flush');
	}
}
unset($clouansp_archive_meta, $clouansp_archive_key, $clouansp_archive_option);

function clouansp_schedule_rewrite_flush(): void {
	update_option('clouansp_needs_rewrite_flush', true);
}

// Priority 99 — after the CPTs have registered (priority 10) with the current
// slugs, so the flushed rules reflect the new permalinks.
add_action('init', 'clouansp_flush_rewrites_if_needed', 99);

function clouansp_flush_rewrites_if_needed(): void {
	if (get_option('clouansp_needs_rewrite_flush')) {
		delete_option('clouansp_needs_rewrite_flush');
		flush_rewrite_rules();
	}
}
