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
 * @package CNS Wiki Suite
 */

defined('ABSPATH') || exit;

if (! function_exists('cns_wiki_glossary_enabled') || ! cns_wiki_glossary_enabled()) {
    return;
}

$group_by = ($attributes['groupBy'] ?? 'alphabetical') === 'category' ? 'category' : 'alphabetical';

$entries = get_posts([
    'post_type'              => 'cns_glossary',
    'post_status'            => 'publish',
    'posts_per_page'         => -1,
    'orderby'                => 'title',
    'order'                  => 'ASC',
    // Only titles and permalinks are read below, so skip the postmeta priming
    // query. The term cache stays on: the category grouping needs it.
    'no_found_rows'          => true,
    'update_post_meta_cache' => false,
]);

if (empty($entries)) {
    if (! empty($attributes['showEmptyNotice'])) {
        // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- wrapper attributes are escaped by core; the notice below is escaped inline.
        echo '<div ' . get_block_wrapper_attributes(['class' => 'cns-glossary-index']) . '><p>'
            . esc_html__('No glossary entries yet.', 'clouds-and-spaceships')
            . '</p></div>';
    }
    return;
}

/**
 * Builds [ section label => WP_Post[] ] in output order.
 */
$sections = [];

if ('category' === $group_by) {
    $terms = get_terms([
        'taxonomy'   => 'cns_glossary_category',
        'hide_empty' => true,
        'orderby'    => 'name',
        'order'      => 'ASC',
    ]);
    $terms = is_wp_error($terms) ? [] : $terms;

    // [ entry ID => [ term ID => true ] ], built once. has_term() in the loop
    // below would re-resolve the entry's terms on every term/entry pair.
    $entry_terms = [];
    $object_terms = wp_get_object_terms(
        wp_list_pluck($entries, 'ID'),
        'cns_glossary_category',
        ['fields' => 'all_with_object_id']
    );
    if (! is_wp_error($object_terms)) {
        foreach ($object_terms as $object_term) {
            $entry_terms[$object_term->object_id][$object_term->term_id] = true;
        }
    }

    $assigned = [];
    foreach ($terms as $term) {
        foreach ($entries as $entry) {
            if (isset($entry_terms[$entry->ID][$term->term_id])) {
                $sections[$term->name][] = $entry;
                $assigned[$entry->ID]    = true;
            }
        }
    }

    $uncategorized = array_filter($entries, static fn($entry) => ! isset($assigned[$entry->ID]));
    if ($uncategorized) {
        $sections[__('Other', 'clouds-and-spaceships')] = array_values($uncategorized);
    }
} else {
    foreach ($entries as $entry) {
        $first  = mb_substr(remove_accents(trim($entry->post_title)), 0, 1);
        $letter = strtoupper($first);
        if (! preg_match('/[A-Z]/', $letter)) {
            $letter = '#';
        }
        $sections[$letter][] = $entry;
    }
    ksort($sections, SORT_STRING);

    // Numbers/symbols share one section, placed after Z.
    if (isset($sections['#'])) {
        $symbols = $sections['#'];
        unset($sections['#']);
        $sections['#'] = $symbols;
    }
}

$html = '';
foreach ($sections as $label => $section_entries) {
    $section_id = 'glossary-' . sanitize_title('#' === $label ? 'symbols' : $label);

    $items = '';
    foreach ($section_entries as $entry) {
        $items .= sprintf(
            '<li class="cns-glossary-index__item"><a href="%s">%s</a></li>',
            esc_url(get_permalink($entry)),
            esc_html(get_the_title($entry))
        );
    }

    $html .= sprintf(
        '<section class="cns-glossary-index__section" id="%s"><h2 class="cns-glossary-index__title">%s</h2><ul class="cns-glossary-index__list">%s</ul></section>',
        esc_attr($section_id),
        esc_html('#' === $label ? __('0–9 & symbols', 'clouds-and-spaceships') : $label),
        $items
    );
}

// phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- wrapper attributes are escaped by core; every value in $html is escaped where it is built above.
echo '<div ' . get_block_wrapper_attributes(['class' => 'cns-glossary-index cns-glossary-index--' . $group_by]) . '>' . $html . '</div>';
