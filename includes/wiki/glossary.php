<?php

/**
 * Sets up the glossary post type, taxonomy, and frontend term rendering.
 *
 * The glossary is opt-in: nothing here registers unless the
 * `glossary_enabled` setting is on (CNS → Wiki tab).
 *
 * @package Clouds and Spaceships
 */

defined('ABSPATH') || exit;

function clouansp_wiki_glossary_enabled(): bool
{
    return (bool) clouansp_get_wiki_setting('glossary_enabled', false);
}

// ── Post type & taxonomy ──────────────────────────────────────────────────────

function clouansp_wiki_register_glossary_post_type(): void
{
    if (! clouansp_wiki_glossary_enabled()) {
        return;
    }

    register_taxonomy('clouansp_glossary_category', ['clouansp_glossary'], [
        'labels' => [
            'name'          => _x('Glossary Categories', 'taxonomy general name', 'clouds-and-spaceships'),
            'singular_name' => _x('Glossary Category', 'taxonomy singular name', 'clouds-and-spaceships'),
            'search_items'  => __('Search glossary categories', 'clouds-and-spaceships'),
            'all_items'     => __('All glossary categories', 'clouds-and-spaceships'),
            'edit_item'     => __('Edit glossary category', 'clouds-and-spaceships'),
            'update_item'   => __('Update glossary category', 'clouds-and-spaceships'),
            'add_new_item'  => __('Add new glossary category', 'clouds-and-spaceships'),
            'new_item_name' => __('New glossary category name', 'clouds-and-spaceships'),
            'menu_name'     => __('Categories', 'clouds-and-spaceships'),
        ],
        'hierarchical'      => true,
        'public'            => true,
        'show_ui'           => true,
        'show_admin_column' => true,
        'show_in_rest'      => true,
        'rewrite'           => ['slug' => clouansp_get_wiki_setting('glossary_slug', 'glossary') . '-category'],
    ]);

    $labels = [
        'name'                  => _x('Glossary', 'Post type general name', 'clouds-and-spaceships'),
        'singular_name'         => _x('Glossary Entry', 'Post type singular name', 'clouds-and-spaceships'),
        'menu_name'             => _x('Glossary', 'Admin Menu text', 'clouds-and-spaceships'),
        'name_admin_bar'        => _x('Glossary Entry', 'Add New on Toolbar', 'clouds-and-spaceships'),
        'add_new'               => __('Add New', 'clouds-and-spaceships'),
        'add_new_item'          => __('Add new glossary entry', 'clouds-and-spaceships'),
        'new_item'              => __('New glossary entry', 'clouds-and-spaceships'),
        'edit_item'             => __('Edit glossary entry', 'clouds-and-spaceships'),
        'view_item'             => __('View glossary entry', 'clouds-and-spaceships'),
        'all_items'             => __('All entries', 'clouds-and-spaceships'),
        'search_items'          => __('Search glossary entries', 'clouds-and-spaceships'),
        'not_found'             => __('No glossary entries found.', 'clouds-and-spaceships'),
        'not_found_in_trash'    => __('No glossary entries found in Trash.', 'clouds-and-spaceships'),
        'archives'              => _x('Glossary', 'The post type archive label used in nav menus.', 'clouds-and-spaceships'),
    ];

    register_post_type('clouansp_glossary', [
        'labels'             => $labels,
        'description'        => __('Glossary entry custom post type.', 'clouds-and-spaceships'),
        'public'             => true,
        'publicly_queryable' => true,
        'show_ui'            => true,
        'query_var'          => true,
        // Sidebar entry is opt-out on the Glossary tab.
        'show_in_menu'       => (bool) clouansp_get_wiki_setting('glossary_show_menu', true),
        'rewrite'            => ['slug' => clouansp_get_wiki_setting('glossary_slug', 'glossary'), 'with_front' => false],
        'capability_type'    => 'post',
        'has_archive'        => true,
        'hierarchical'       => false,
        'menu_position'      => 21,
        'menu_icon'          => 'dashicons-book-alt',
        'supports'           => ['title', 'editor', 'author', 'thumbnail', 'excerpt'],
        'taxonomies'         => ['clouansp_glossary_category'],
        'show_in_rest'       => true,
        'template_lock'      => false,
    ]);
}
add_action('init', 'clouansp_wiki_register_glossary_post_type');

/**
 * Glossary definitions use the classic (TinyMCE) editor — plain rich text,
 * no blocks. show_in_rest stays true so the inline-format picker can search
 * entries via the REST API.
 */
add_filter('use_block_editor_for_post_type', function ($use_block_editor, $post_type) {
    return 'clouansp_glossary' === $post_type ? false : $use_block_editor;
}, 10, 2);


// ── Tooltip / link rendering ──────────────────────────────────────────────────

/**
 * Returns the short definition used as tooltip text for a glossary entry:
 * the manual excerpt if set, otherwise a trimmed plain-text definition.
 */
function clouansp_wiki_glossary_tooltip_text(WP_Post $entry): string
{
    if (has_excerpt($entry)) {
        return wp_strip_all_tags($entry->post_excerpt);
    }
    return wp_trim_words(wp_strip_all_tags($entry->post_content), 30);
}

/**
 * Rewrites inline glossary terms at render time.
 *
 * The editor format stores only `data-glossary-id` (plus a snapshot href).
 * Here we refresh the href against the entry's current permalink and inject
 * the current definition as `data-clouansp-tooltip`, so tooltips never go stale.
 * Terms pointing at missing/unpublished entries are downgraded to plain text
 * styling (no dead link).
 */
function clouansp_wiki_glossary_render_terms(string $content): string
{
    if (! clouansp_wiki_glossary_enabled() || false === strpos($content, 'data-glossary-id')) {
        return $content;
    }

    $processor = new WP_HTML_Tag_Processor($content);

    while ($processor->next_tag(['tag_name' => 'a', 'class_name' => 'clouansp-glossary-term'])) {
        $entry_id = (int) $processor->get_attribute('data-glossary-id');
        $entry    = $entry_id ? get_post($entry_id) : null;

        if (! $entry || 'clouansp_glossary' !== $entry->post_type || 'publish' !== $entry->post_status) {
            $processor->remove_attribute('href');
            $processor->add_class('clouansp-glossary-term--missing');
            continue;
        }

        $processor->set_attribute('href', get_permalink($entry));
        $processor->set_attribute('data-clouansp-tooltip', clouansp_wiki_glossary_tooltip_text($entry));
    }

    return $processor->get_updated_html();
}
add_filter('the_content', 'clouansp_wiki_glossary_render_terms', 20);

// ── Assets ────────────────────────────────────────────────────────────────────

/**
 * Glossary term styling (dotted underline + CSS tooltip) for frontend and
 * editor canvas, plus the optional text-colour override from settings.
 */
function clouansp_wiki_glossary_enqueue_styles(): void
{
    if (! clouansp_wiki_glossary_enabled()) {
        return;
    }

    wp_enqueue_style(
        'clouansp-wiki-glossary-term',
        CLOUANSP_URL . 'assets/css/glossary-term.css',
        [],
        CLOUANSP_VERSION
    );

    $color = sanitize_hex_color((string) clouansp_get_wiki_setting('glossary_text_color', ''));
    if ($color) {
        wp_add_inline_style(
            'clouansp-wiki-glossary-term',
            ':root{--clouansp-glossary-color:' . $color . ';}'
        );
    }
}
add_action('enqueue_block_assets', 'clouansp_wiki_glossary_enqueue_styles');

/**
 * Editor-only script registering the glossary inline format (toolbar button).
 */
function clouansp_wiki_glossary_enqueue_format(): void
{
    if (! clouansp_wiki_glossary_enabled()) {
        return;
    }

    $asset_file = CLOUANSP_DIR . 'build/formats/glossary.asset.php';
    if (! file_exists($asset_file)) {
        return;
    }

    $asset = include $asset_file;
    wp_enqueue_script(
        'clouansp-wiki-glossary-format',
        CLOUANSP_URL . 'build/formats/glossary.js',
        $asset['dependencies'],
        $asset['version'],
        true
    );
    wp_set_script_translations('clouansp-wiki-glossary-format', 'clouds-and-spaceships');
}
add_action('enqueue_block_editor_assets', 'clouansp_wiki_glossary_enqueue_format');
