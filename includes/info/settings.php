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

/** Where the news items are meant to come from. */
const CNS_INFO_NEWS_URL   = 'https://cloudsandspaceships.com/';
const CNS_INFO_NEWS_COUNT = 10;

/**
 * News items shown on the Info tab.
 *
 * Placeholder data. The real implementation is meant to pull the newest
 * CNS_INFO_NEWS_COUNT posts of one category from CNS_INFO_NEWS_URL through its
 * REST API (/wp-json/wp/v2/posts?categories=…&per_page=…), cached in a
 * transient so the settings screen never waits on a remote request. Nothing
 * here talks to the network yet.
 *
 * @return array<int,array{title:string,date:string,url:string,excerpt:string}>
 */
function cns_info_get_news(): array {
    $items = [
        [
            'title'   => __('Map hierarchies: linking a MasterMap to its regions', 'clouds-and-spaceships'),
            'excerpt' => __('How parent and child maps fit together, and when a MasterMap is the right shape for a world.', 'clouds-and-spaceships'),
        ],
        [
            'title'   => __('Branching stories laid over a map', 'clouds-and-spaceships'),
            'excerpt' => __('Nodes, paths and directed edges — building a route your readers can walk through.', 'clouds-and-spaceships'),
        ],
        [
            'title'   => __('Writing a wiki that stays navigable', 'clouds-and-spaceships'),
            'excerpt' => __('Infoboxes, contents blocks and card grids, and how they read on small screens.', 'clouds-and-spaceships'),
        ],
        [
            'title'   => __('Glossary terms without breaking your prose', 'clouds-and-spaceships'),
            'excerpt' => __('Inline definitions that stay current when an entry is renamed or unpublished.', 'clouds-and-spaceships'),
        ],
        [
            'title'   => __('Bezier areas are here', 'clouds-and-spaceships'),
            'excerpt' => __('Curved region borders for coastlines and anything else a polygon made look wrong.', 'clouds-and-spaceships'),
        ],
        [
            'title'   => __('Icon libraries, shared across every map', 'clouds-and-spaceships'),
            'excerpt' => __('Uploading SVGs once and reusing them as object icons anywhere in the suite.', 'clouds-and-spaceships'),
        ],
        [
            'title'   => __('Substories: the content behind a node', 'clouds-and-spaceships'),
            'excerpt' => __('Keeping story structure and story text apart, and why that makes rewrites cheap.', 'clouds-and-spaceships'),
        ],
        [
            'title'   => __('Archive settings, suite by suite', 'clouds-and-spaceships'),
            'excerpt' => __('Slugs, sort order and per-page counts for wikis, maps and stories.', 'clouds-and-spaceships'),
        ],
        [
            'title'   => __('Three plugins became one', 'clouds-and-spaceships'),
            'excerpt' => __('What changed when the wiki, map and story suites merged, and what deliberately did not.', 'clouds-and-spaceships'),
        ],
        [
            'title'   => __('Worldbuilding notes: starting from the map', 'clouds-and-spaceships'),
            'excerpt' => __('A workflow that begins with geography and lets the articles follow.', 'clouds-and-spaceships'),
        ],
    ];

    // Placeholder dates: today, then one week apart going back.
    foreach ($items as $index => $item) {
        $items[$index]['date'] = gmdate('Y-m-d', strtotime('-' . ($index * 7) . ' days'));
        $items[$index]['url']  = CNS_INFO_NEWS_URL;
    }

    return array_slice($items, 0, CNS_INFO_NEWS_COUNT);
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
