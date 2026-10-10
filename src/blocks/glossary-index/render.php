<?php

/**
 * Server render for the Glossary Index block.
 *
 * Groups all published glossary entries either alphabetically (one section
 * per letter, shared "#" section for numbers/symbols) or by glossary
 * category (entries without a category land in an "Other" section).
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Block default content (unused).
 * @var WP_Block $block      Block instance.
 *
 * @package Clouds and Spaceships
 */

defined('ABSPATH') || exit;

if (! clouansp_wiki_glossary_enabled()) {
    return;
}

$clouansp_group_by = ($attributes['groupBy'] ?? 'alphabetical') === 'category' ? 'category' : 'alphabetical';

/**
 * Appearance, all optional. Each one is emitted as a custom property only when
 * the author set it, so an unset control leaves the stylesheet (and through it
 * the theme) in charge rather than hard-coding a value into the markup.
 */
$clouansp_style_vars = '';

$clouansp_title_size = isset($attributes['titleFontSize']) ? (float) $attributes['titleFontSize'] : 0;
if ($clouansp_title_size > 0) {
    $clouansp_style_vars .= sprintf('--clouansp-glossary-title-size:%spx;', $clouansp_title_size);
}
$clouansp_title_color = sanitize_hex_color((string) ($attributes['titleColor'] ?? '')) ?: '';
if ('' !== $clouansp_title_color) {
    $clouansp_style_vars .= sprintf('--clouansp-glossary-title-color:%s;', $clouansp_title_color);
}

$clouansp_item_size = isset($attributes['itemFontSize']) ? (float) $attributes['itemFontSize'] : 0;
if ($clouansp_item_size > 0) {
    $clouansp_style_vars .= sprintf('--clouansp-glossary-item-size:%spx;', $clouansp_item_size);
}
$clouansp_item_color = sanitize_hex_color((string) ($attributes['itemColor'] ?? '')) ?: '';
if ('' !== $clouansp_item_color) {
    $clouansp_style_vars .= sprintf('--clouansp-glossary-item-color:%s;', $clouansp_item_color);
}

// The property holds the whole grid-template-columns value, so leaving it unset
// falls back to the auto-fitting default in style.scss. One column on narrow
// screens, since a fixed count set for desktop cramps a phone.
$clouansp_columns = isset($attributes['columns']) ? (int) $attributes['columns'] : 0;
if ($clouansp_columns > 0) {
    $clouansp_columns = min(12, $clouansp_columns);
    $clouansp_style_vars .= sprintf(
        '--clouansp-glossary-columns:repeat(%d,minmax(0,1fr));--clouansp-glossary-columns-mobile:1fr;',
        $clouansp_columns
    );
}

$clouansp_entries = get_posts([
    'post_type'              => 'clouansp_glossary',
    'post_status'            => 'publish',
    'posts_per_page'         => -1,
    'orderby'                => 'title',
    'order'                  => 'ASC',
    // Only titles and permalinks are read below, so skip the postmeta priming
    // query. The term cache stays on: the category grouping needs it.
    'no_found_rows'          => true,
    'update_post_meta_cache' => false,
]);

if (empty($clouansp_entries)) {
    if (! empty($attributes['showEmptyNotice'])) {
        $clouansp_wrapper = get_block_wrapper_attributes([
            'class' => 'clouansp-glossary-index',
            'style' => $clouansp_style_vars,
        ]);
        $clouansp_notice  = esc_html__('No glossary entries yet.', 'clouds-and-spaceships');

        // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() escapes its own output; $clouansp_notice is escaped above.
        echo '<div ' . $clouansp_wrapper . '><p>' . $clouansp_notice . '</p></div>';
    }
    return;
}

/**
 * Builds [ section label => WP_Post[] ] in output order.
 */
$clouansp_sections = [];

if ('category' === $clouansp_group_by) {
    $clouansp_terms = get_terms([
        'taxonomy'   => 'clouansp_glossary_category',
        'hide_empty' => true,
        'orderby'    => 'name',
        'order'      => 'ASC',
    ]);
    $clouansp_terms = is_wp_error($clouansp_terms) ? [] : $clouansp_terms;

    // [ entry ID => [ term ID => true ] ], built once. has_term() in the loop
    // below would re-resolve the entry's terms on every term/entry pair.
    $clouansp_entry_terms = [];
    $clouansp_object_terms = wp_get_object_terms(
        wp_list_pluck($clouansp_entries, 'ID'),
        'clouansp_glossary_category',
        ['fields' => 'all_with_object_id']
    );
    if (! is_wp_error($clouansp_object_terms)) {
        foreach ($clouansp_object_terms as $clouansp_object_term) {
            $clouansp_entry_terms[$clouansp_object_term->object_id][$clouansp_object_term->term_id] = true;
        }
    }

    $clouansp_assigned = [];
    foreach ($clouansp_terms as $clouansp_term) {
        foreach ($clouansp_entries as $clouansp_entry) {
            if (isset($clouansp_entry_terms[$clouansp_entry->ID][$clouansp_term->term_id])) {
                $clouansp_sections[$clouansp_term->name][] = $clouansp_entry;
                $clouansp_assigned[$clouansp_entry->ID]    = true;
            }
        }
    }

    $clouansp_uncategorized = array_filter($clouansp_entries, static fn($clouansp_entry) => ! isset($clouansp_assigned[$clouansp_entry->ID]));
    if ($clouansp_uncategorized) {
        $clouansp_sections[__('Other', 'clouds-and-spaceships')] = array_values($clouansp_uncategorized);
    }
} else {
    foreach ($clouansp_entries as $clouansp_entry) {
        $clouansp_first  = mb_substr(remove_accents(trim($clouansp_entry->post_title)), 0, 1);
        $clouansp_letter = strtoupper($clouansp_first);
        if (! preg_match('/[A-Z]/', $clouansp_letter)) {
            $clouansp_letter = '#';
        }
        $clouansp_sections[$clouansp_letter][] = $clouansp_entry;
    }
    ksort($clouansp_sections, SORT_STRING);

    // Numbers/symbols share one section, placed after Z.
    if (isset($clouansp_sections['#'])) {
        $clouansp_symbols = $clouansp_sections['#'];
        unset($clouansp_sections['#']);
        $clouansp_sections['#'] = $clouansp_symbols;
    }
}

$clouansp_html = '';
foreach ($clouansp_sections as $clouansp_label => $clouansp_section_entries) {
    $clouansp_section_id = 'glossary-' . sanitize_title('#' === $clouansp_label ? 'symbols' : $clouansp_label);

    $clouansp_items = '';
    foreach ($clouansp_section_entries as $clouansp_entry) {
        $clouansp_items .= sprintf(
            '<li class="clouansp-glossary-index__item"><a href="%s">%s</a></li>',
            esc_url(get_permalink($clouansp_entry)),
            esc_html(get_the_title($clouansp_entry))
        );
    }

    $clouansp_html .= sprintf(
        '<section class="clouansp-glossary-index__section" id="%s"><h2 class="clouansp-glossary-index__title">%s</h2><ul class="clouansp-glossary-index__list">%s</ul></section>',
        esc_attr($clouansp_section_id),
        esc_html('#' === $clouansp_label ? __('0–9 & symbols', 'clouds-and-spaceships') : $clouansp_label),
        $clouansp_items
    );
}

$clouansp_wrapper = get_block_wrapper_attributes([
    'class' => 'clouansp-glossary-index clouansp-glossary-index--' . $clouansp_group_by,
    'style' => $clouansp_style_vars,
]);

// The ignore covers only the line that follows it, so the whole statement has
// to sit on one line — splitting the echo is what let $clouansp_html escape its scope.
// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() escapes its own output; every value in $clouansp_html is escaped where it is built above.
echo '<div ' . $clouansp_wrapper . '>' . $clouansp_html . '</div>';
