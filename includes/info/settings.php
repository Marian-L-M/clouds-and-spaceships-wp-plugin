<?php
/**
 * Info — the CNS → Info tab.
 *
 * The first tab on the settings screen, and therefore the one the bare
 * cns-settings slug and the top-level CNS menu entry resolve to. It owns no
 * settings: it summarises what the plugin has registered.
 */

defined('ABSPATH') || exit;

/** Project website, linked from the Info tab. Nothing is fetched from it. */
const CNS_PROJECT_URL = 'https://cloudsandspaceships.com/';

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
