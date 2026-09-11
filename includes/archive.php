<?php
/**
 * Post type archives — settings, query overrides, and rewrite maintenance.
 *
 * The map, story and wiki suites each shipped their own copy of this: the same
 * three settings (slug, per page, sort order), the same pre_get_posts switch,
 * and the same "flag now, flush on the next init" rewrite dance. This is the
 * single implementation.
 *
 * Storage still differs per suite and is deliberately left alone, so no
 * existing setting has to be migrated:
 *
 *   maps / cns_story   one option per field, prefixed cns_{suite}_suite_
 *   wiki               archive_slug inside the cns_wiki_settings option array
 *
 * The map and story archives ship disabled. Enabling one publishes a listing
 * at /{slug}/ that did not exist before, so it is an explicit choice rather
 * than a side effect of updating the plugin. The wiki archive is always on.
 *
 * Substories are deliberately not given an archive: they are fragments shown
 * inside a story, not standalone entries worth listing on their own.
 */

defined('ABSPATH') || exit;

const CNS_ARCHIVE_DEFAULT_PER_PAGE = 12;
const CNS_ARCHIVE_DEFAULT_ORDER    = 'date_desc';

/** Archives whose settings live in one option per field. */
const CNS_OPTION_ARCHIVES = [
	'maps'      => ['prefix' => 'cns_map_suite_',   'default_slug' => 'maps'],
	'cns_story' => ['prefix' => 'cns_story_suite_', 'default_slug' => 'stories'],
];

/** Sort-order choices, shared by the settings UIs and the query override. */
function cns_archive_order_options(): array {
	return [
		'date_desc' => __('Newest first', 'clouds-and-spaceships'),
		'date_asc'  => __('Oldest first', 'clouds-and-spaceships'),
		'title_asc' => __('Title (A–Z)', 'clouds-and-spaceships'),
	];
}

/** Lowercase slug, falling back to the suite default when empty or invalid. */
function cns_archive_sanitize_slug(string $slug, string $default): string {
	return preg_replace('/[^a-z0-9\-]/', '', strtolower($slug)) ?: $default;
}

function cns_archive_sanitize_order(string $order): string {
	$order = sanitize_key($order);
	return array_key_exists($order, cns_archive_order_options())
		? $order
		: CNS_ARCHIVE_DEFAULT_ORDER;
}

/**
 * Accessors for one archive, keyed by post type. Built once per request.
 *
 * `per_page` and `order` are optional — an archive the plugin does not render
 * itself omits them and its query is left alone.
 *
 * @return array{enabled:callable,slug:callable,per_page?:callable,order?:callable}|null
 */
function cns_archive_config(string $post_type): ?array {
	static $config = null;

	if (null === $config) {
		$config = [];

		foreach (CNS_OPTION_ARCHIVES as $type => $meta) {
			$prefix  = $meta['prefix'];
			$default = $meta['default_slug'];

			$config[$type] = [
				'enabled'  => static fn(): bool   => (bool) get_option($prefix . 'archive_enabled', false),
				'slug'     => static fn(): string => cns_archive_sanitize_slug(
					(string) get_option($prefix . 'archive_slug', $default),
					$default
				),
				'per_page' => static fn(): int    => max(1, (int) get_option($prefix . 'archive_per_page', CNS_ARCHIVE_DEFAULT_PER_PAGE)),
				'order'    => static fn(): string => cns_archive_sanitize_order(
					(string) get_option($prefix . 'archive_order', CNS_ARCHIVE_DEFAULT_ORDER)
				),
			];
		}

		// The wiki archive has no on/off switch — the CPT has always shipped
		// with has_archive => true.
		//
		// It also has no per-page or sort-order setting: the plugin registers no
		// wiki archive template, so the listing is the theme's, and its query is
		// left to WordPress (Reading Settings) and the theme. Only the slug is
		// owned here, because it is the same slug the single permalinks use.
		$config['wiki'] = [
			'enabled'  => static fn(): bool   => true,
			'slug'     => static fn(): string => cns_archive_sanitize_slug(
				(string) cns_get_wiki_setting('archive_slug', 'wiki'),
				'wiki'
			),
		];
	}

	return $config[$post_type] ?? null;
}

/** Post types with a configured archive. */
function cns_archive_post_types(): array {
	return array_merge(array_keys(CNS_OPTION_ARCHIVES), ['wiki']);
}

function cns_archive_enabled(string $post_type): bool {
	$config = cns_archive_config($post_type);
	return $config ? (bool) ($config['enabled'])() : false;
}

/** Slug used for both the archive and the single-post permalinks. */
function cns_archive_slug(string $post_type): string {
	$config = cns_archive_config($post_type);
	return $config ? (string) ($config['slug'])() : $post_type;
}

function cns_archive_per_page(string $post_type): int {
	$config = cns_archive_config($post_type);
	return isset($config['per_page']) ? (int) ($config['per_page'])() : CNS_ARCHIVE_DEFAULT_PER_PAGE;
}

function cns_archive_order(string $post_type): string {
	$config = cns_archive_config($post_type);
	return isset($config['order']) ? (string) ($config['order'])() : CNS_ARCHIVE_DEFAULT_ORDER;
}

// ── Archive query ─────────────────────────────────────────────────────────────

add_action('pre_get_posts', 'cns_archive_query');

function cns_archive_query(WP_Query $query): void {
	if (is_admin() || ! $query->is_main_query()) {
		return;
	}

	foreach (cns_archive_post_types() as $post_type) {
		if (! $query->is_post_type_archive($post_type)) {
			continue;
		}

		$config = cns_archive_config($post_type);

		// No per-page / order settings means the plugin does not render this
		// archive; leave the main query exactly as WordPress built it.
		if (! isset($config['per_page'], $config['order'])) {
			return;
		}

		$query->set('posts_per_page', cns_archive_per_page($post_type));

		switch (cns_archive_order($post_type)) {
			case 'date_asc':
				$query->set('orderby', 'date');
				$query->set('order', 'ASC');
				break;
			case 'title_asc':
				$query->set('orderby', 'title');
				$query->set('order', 'ASC');
				break;
			default:
				$query->set('orderby', 'date');
				$query->set('order', 'DESC');
		}
		return;
	}
}

// ── Rewrite maintenance ───────────────────────────────────────────────────────
//
// flush_rewrite_rules() has to run AFTER the CPT re-registers with the new
// slug. On the request that saves the option, init has already fired with the
// old slug, so flushing there would bake the old value back into the rules.
// Instead a flag is set on save and the flush happens on the next init.

foreach (CNS_OPTION_ARCHIVES as $cns_archive_meta) {
	foreach (['archive_slug', 'archive_enabled'] as $cns_archive_key) {
		$cns_archive_option = $cns_archive_meta['prefix'] . $cns_archive_key;
		add_action("update_option_{$cns_archive_option}", 'cns_schedule_rewrite_flush');
		add_action("add_option_{$cns_archive_option}", 'cns_schedule_rewrite_flush');
	}
}
unset($cns_archive_meta, $cns_archive_key, $cns_archive_option);

function cns_schedule_rewrite_flush(): void {
	update_option('cns_needs_rewrite_flush', true);
}

// Priority 99 — after the CPTs have registered (priority 10) with the current
// slugs, so the flushed rules reflect the new permalinks.
add_action('init', 'cns_flush_rewrites_if_needed', 99);

function cns_flush_rewrites_if_needed(): void {
	if (get_option('cns_needs_rewrite_flush')) {
		delete_option('cns_needs_rewrite_flush');
		flush_rewrite_rules();
	}
}
