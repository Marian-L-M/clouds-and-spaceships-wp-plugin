<?php
/**
 * Info — the CNS → Info tab.
 *
 * The first tab on the settings screen, and therefore the one the bare
 * cns-settings slug and the top-level CNS menu entry resolve to. It owns no
 * settings: it summarises what the plugin has registered and lists news from
 * the project site.
 */

defined('ABSPATH') || exit;

/** Where the news items come from. */
const CNS_INFO_NEWS_URL   = 'https://cloudsandspaceships.com/';
const CNS_INFO_NEWS_COUNT = 10;

/**
 * Category ID to limit the feed to, or 0 for posts from every category.
 * Slugs are no use here: /wp/v2/posts only filters by term ID.
 */
const CNS_INFO_NEWS_CATEGORY = 0;

/** How long a fetched list is kept, and how long a failure is remembered. */
const CNS_INFO_NEWS_TTL       = 6 * HOUR_IN_SECONDS;
const CNS_INFO_NEWS_ERROR_TTL = 15 * MINUTE_IN_SECONDS;
const CNS_INFO_NEWS_TRANSIENT = 'cns_info_news';

/** Seconds to wait on cloudsandspaceships.com before giving up. */
const CNS_INFO_NEWS_TIMEOUT = 8;

/**
 * News items shown on the Info tab.
 *
 * The newest CNS_INFO_NEWS_COUNT posts from CNS_INFO_NEWS_URL, read through its
 * REST API. Both outcomes are cached in a transient — a success for
 * CNS_INFO_NEWS_TTL, a failure for the much shorter CNS_INFO_NEWS_ERROR_TTL —
 * so the settings screen waits on the network at most once per window, and an
 * unreachable site does not slow every page load until it recovers.
 *
 * @return array{
 *     items: array<int,array{title:string,date:string,url:string,excerpt:string}>,
 *     error: string
 * }
 */
function cns_info_get_news(): array {
    $cached = get_transient(CNS_INFO_NEWS_TRANSIENT);
    if (is_array($cached) && isset($cached['items'], $cached['error'])) {
        return $cached;
    }

    $result = cns_info_fetch_news();

    if (is_wp_error($result)) {
        $news = ['items' => [], 'error' => $result->get_error_message()];
        set_transient(CNS_INFO_NEWS_TRANSIENT, $news, CNS_INFO_NEWS_ERROR_TTL);
        return $news;
    }

    $news = ['items' => $result, 'error' => ''];
    set_transient(CNS_INFO_NEWS_TRANSIENT, $news, CNS_INFO_NEWS_TTL);
    return $news;
}

/**
 * Reads the newest posts from the project site's REST API.
 *
 * Only the four fields the tab renders are requested; _embed and the full
 * rendered content would multiply the payload for nothing.
 *
 * @return array<int,array{title:string,date:string,url:string,excerpt:string}>|WP_Error
 */
function cns_info_fetch_news() {
    $query = [
        'per_page' => CNS_INFO_NEWS_COUNT,
        'orderby'  => 'date',
        'order'    => 'desc',
        '_fields'  => 'title,excerpt,link,date_gmt',
    ];

    if (CNS_INFO_NEWS_CATEGORY > 0) {
        $query['categories'] = CNS_INFO_NEWS_CATEGORY;
    }

    $url = add_query_arg($query, CNS_INFO_NEWS_URL . 'wp-json/wp/v2/posts');

    $response = wp_remote_get($url, [
        'timeout' => CNS_INFO_NEWS_TIMEOUT,
        'headers' => ['Accept' => 'application/json'],
    ]);

    if (is_wp_error($response)) {
        return $response;
    }

    $status = (int) wp_remote_retrieve_response_code($response);
    if ($status !== 200) {
        return new WP_Error(
            'cns_info_news_http',
            sprintf(
                /* translators: %d: HTTP status code returned by the project site. */
                __('cloudsandspaceships.com answered with HTTP %d.', 'clouds-and-spaceships'),
                $status
            )
        );
    }

    $posts = json_decode(wp_remote_retrieve_body($response), true);
    if (!is_array($posts)) {
        return new WP_Error(
            'cns_info_news_json',
            __('The response from cloudsandspaceships.com was not readable.', 'clouds-and-spaceships')
        );
    }

    $items = [];
    foreach ($posts as $post) {
        if (!is_array($post) || empty($post['link'])) {
            continue;
        }

        $items[] = [
            'title'   => cns_info_news_text($post['title']['rendered'] ?? ''),
            'date'    => (string) ($post['date_gmt'] ?? ''),
            'url'     => (string) $post['link'],
            'excerpt' => cns_info_news_text($post['excerpt']['rendered'] ?? ''),
        ];
    }

    return $items;
}

/**
 * Turns a rendered REST field into the plain text the tab prints.
 *
 * Entities are decoded because the view escapes again on output; without this
 * an ampersand in a title would reach the page as &amp;amp;. Collapsing
 * whitespace also folds the non-breaking spaces that decoding leaves behind.
 */
function cns_info_news_text(string $html): string {
    $text = html_entity_decode(wp_strip_all_tags($html), ENT_QUOTES, 'UTF-8');

    // preg_replace returns null on malformed UTF-8; keep the raw text then.
    return trim(preg_replace('/\s+/u', ' ', $text) ?? $text);
}

// ── Admin tab registration ────────────────────────────────────────────────────

add_filter('cns_admin_tabs', function (array $tabs): array {
    $tabs['info'] = [
        'menu_title' => __('Info', 'clouds-and-spaceships'),
        'title'      => __('Info', 'clouds-and-spaceships'),
        'capability' => 'manage_options',
        'callback'   => 'cns_info_render_tab',
        'priority'   => 10,
    ];
    return $tabs;
});

function cns_info_render_tab(): void {
    include CNS_DIR . 'includes/info/views/tab-info.php';
}
