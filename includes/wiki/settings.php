<?php
/**
 * Wiki settings — the CNS → Wiki tab, its option, and the styles it drives.
 *
 * Registers the Wiki tab on the shared CNS settings page (includes/settings-page.php).
 * Archive slug / per page / sort order are read back through the shared archive
 * helpers in includes/archive.php, which also own the rewrite-flush flag.
 */

defined( 'ABSPATH' ) || exit;

// ── Settings helper ───────────────────────────────────────────────────────────

function cns_get_wiki_setting( string $key, $default = null ) {
    static $settings = null;
    if ( null === $settings ) {
        $settings = (array) get_option( 'cns_wiki_settings', [] );
    }
    return array_key_exists( $key, $settings ) ? $settings[ $key ] : $default;
}

// ── Settings API registration ─────────────────────────────────────────────────

add_action( 'admin_init', 'cns_wiki_register_settings' );

function cns_wiki_register_settings(): void {
    register_setting(
        'cns_wiki_settings_group',
        'cns_wiki_settings',
        [ 'sanitize_callback' => 'cns_sanitize_wiki_settings' ]
    );
}

function cns_sanitize_wiki_settings( $input ): array {
    $input  = is_array( $input ) ? $input : [];
    $output = [];

    // Templates
    $output['use_wiki_template'] = ! empty( $input['use_wiki_template'] );

    // Layout — infobox column width in rem. Empty means "inherit from the
    // theme", so the CSS falls through to --wp--custom--layout--col-wiki.
    $width = trim( (string) ( $input['infobox_width'] ?? '' ) );
    $output['infobox_width'] = is_numeric( $width )
        ? (string) min( 80, max( 12, round( (float) $width, 1 ) ) )
        : '';

    // Archive
    $raw_slug             = preg_replace( '/[^a-z0-9\-]/', '', strtolower( $input['archive_slug'] ?? 'wiki' ) );
    $output['archive_slug']     = $raw_slug ?: 'wiki';
    $output['archive_per_page'] = max( 1, (int) ( $input['archive_per_page'] ?? 12 ) );

    $valid_orders            = [ 'date_desc', 'date_asc', 'title_asc' ];
    $order                   = sanitize_key( $input['archive_order'] ?? 'date_desc' );
    $output['archive_order'] = in_array( $order, $valid_orders, true ) ? $order : 'date_desc';

    // Placeholder thumbnail (attachment ID, 0 = none)
    $placeholder_id = absint( $input['placeholder_thumb_id'] ?? 0 );
    $output['placeholder_thumb_id'] = $placeholder_id && wp_attachment_is_image( $placeholder_id ) ? $placeholder_id : 0;

    // Grid defaults
    $output['grid_columns_desktop'] = min( 6, max( 1, (int) ( $input['grid_columns_desktop'] ?? 3 ) ) );
    $output['grid_columns_tablet']  = min( 4, max( 1, (int) ( $input['grid_columns_tablet']  ?? 2 ) ) );
    $output['grid_columns_mobile']  = min( 2, max( 1, (int) ( $input['grid_columns_mobile']  ?? 1 ) ) );
    $output['grid_column_gap']      = min( 64, max( 0, (int) ( $input['grid_column_gap'] ?? 16 ) ) );
    $output['grid_row_gap']         = min( 64, max( 0, (int) ( $input['grid_row_gap']    ?? 16 ) ) );

    // Infobox colours
    $output['infobox_bg_color']       = sanitize_hex_color( $input['infobox_bg_color']       ?? '' ) ?? '';
    $output['infobox_contrast_color'] = sanitize_hex_color( $input['infobox_contrast_color'] ?? '' ) ?? '';
    $output['infobox_border_color']   = sanitize_hex_color( $input['infobox_border_color']   ?? '' ) ?? '';

    // Glossary
    $output['glossary_enabled'] = ! empty( $input['glossary_enabled'] );

    $raw_glossary_slug        = preg_replace( '/[^a-z0-9\-]/', '', strtolower( $input['glossary_slug'] ?? 'glossary' ) );
    $output['glossary_slug']  = $raw_glossary_slug ?: 'glossary';

    $output['glossary_text_color'] = sanitize_hex_color( $input['glossary_text_color'] ?? '' ) ?? '';

    return $output;
}

// ── Flush rewrites when a slug changes ───────────────────────────────────────
//
// The flag itself and the init-priority-99 flush live in includes/archive.php,
// shared with the map and story archives. Only the "did a watched key change?"
// test is wiki-specific, because these settings sit inside one option array.

add_action( 'update_option_cns_wiki_settings', 'cns_wiki_maybe_schedule_rewrite_flush', 10, 2 );

function cns_wiki_maybe_schedule_rewrite_flush( $old_value, $new_value ): void {
    $watched = [
        [ 'archive_slug',     'wiki' ],
        [ 'glossary_slug',    'glossary' ],
        [ 'glossary_enabled', false ],
    ];
    foreach ( $watched as [ $key, $default ] ) {
        if ( ( $old_value[ $key ] ?? $default ) !== ( $new_value[ $key ] ?? $default ) ) {
            cns_schedule_rewrite_flush();
            return;
        }
    }
}

// Flag on first-ever save too.
add_action( 'add_option_cns_wiki_settings', 'cns_schedule_rewrite_flush' );

// ── Infobox colour overrides ──────────────────────────────────────────────────

// enqueue_block_assets fires on both the frontend and in the editor.
add_action( 'enqueue_block_assets', 'cns_wiki_enqueue_infobox_styles' );

function cns_wiki_enqueue_infobox_styles(): void {
    $bg       = (string) cns_get_wiki_setting( 'infobox_bg_color',       '' );
    $contrast = (string) cns_get_wiki_setting( 'infobox_contrast_color', '' );
    $border   = (string) cns_get_wiki_setting( 'infobox_border_color',   '' );

    if ( ! $bg && ! $contrast && ! $border ) {
        return;
    }

    $rules = '';
    if ( $bg )       $rules .= '--wp--preset--color--element-bg:' . sanitize_hex_color( $bg ) . ';';
    if ( $contrast ) $rules .= '--wp--preset--color--element-contrast:' . sanitize_hex_color( $contrast ) . ';';
    if ( $border )   $rules .= 'border-color:' . sanitize_hex_color( $border ) . ';';

    $css = '.wp-block-cns-wiki-suite-infobox{' . $rules . '}';

    wp_register_style( 'cns-wiki-infobox-overrides', false );
    wp_enqueue_style( 'cns-wiki-infobox-overrides' );
    wp_add_inline_style( 'cns-wiki-infobox-overrides', $css );
}

// ── Archive grid styles ───────────────────────────────────────────────────────
//
// The archive template renders wikis through a core query loop, not the
// wiki-contents block, so the grid defaults are applied here as generated CSS.
// Breakpoints mirror the wiki-contents block's style.scss (1024px / 768px).

add_action( 'wp_enqueue_scripts', 'cns_wiki_enqueue_archive_grid_styles' );

function cns_wiki_enqueue_archive_grid_styles(): void {
    if ( ! is_post_type_archive( 'wiki' ) ) {
        return;
    }

    $desktop = (int) cns_get_wiki_setting( 'grid_columns_desktop', 3 );
    $tablet  = (int) cns_get_wiki_setting( 'grid_columns_tablet',  2 );
    $mobile  = (int) cns_get_wiki_setting( 'grid_columns_mobile',  1 );
    $col_gap = (int) cns_get_wiki_setting( 'grid_column_gap', 16 );
    $row_gap = (int) cns_get_wiki_setting( 'grid_row_gap',    16 );

    $css = sprintf(
        '.wp-block-post-template.wiki-archive__grid{display:grid;grid-template-columns:repeat(%1$d,minmax(0,1fr));column-gap:%4$dpx;row-gap:%5$dpx;}' .
        '.wp-block-post-template.wiki-archive__grid > li{margin:0;width:auto;}' .
        '@media (max-width:1024px){.wp-block-post-template.wiki-archive__grid{grid-template-columns:repeat(%2$d,minmax(0,1fr));}}' .
        '@media (max-width:768px){.wp-block-post-template.wiki-archive__grid{grid-template-columns:repeat(%3$d,minmax(0,1fr));}}',
        $desktop,
        $tablet,
        $mobile,
        $col_gap,
        $row_gap
    );

    wp_register_style( 'cns-wiki-archive-grid', false );
    wp_enqueue_style( 'cns-wiki-archive-grid' );
    wp_add_inline_style( 'cns-wiki-archive-grid', $css );
}

// ── Editor grid defaults ──────────────────────────────────────────────────────
//
// The wiki-contents block leaves its grid attributes unset until the user
// touches them, so the render callback can fall back to these settings. The
// same values are handed to the editor script so its preview matches.

add_action( 'enqueue_block_editor_assets', 'cns_wiki_expose_grid_defaults' );

function cns_wiki_expose_grid_defaults(): void {
    $defaults = [
        'columnsDesktop' => (int) cns_get_wiki_setting( 'grid_columns_desktop', 3 ),
        'columnsTablet'  => (int) cns_get_wiki_setting( 'grid_columns_tablet',  2 ),
        'columnsMobile'  => (int) cns_get_wiki_setting( 'grid_columns_mobile',  1 ),
        'columnGap'      => (int) cns_get_wiki_setting( 'grid_column_gap', 16 ),
        'rowGap'         => (int) cns_get_wiki_setting( 'grid_row_gap',    16 ),
    ];

    wp_add_inline_script(
        'cns-wiki-suite-wiki-contents-editor-script',
        'window.cnsWikiGridDefaults = ' . wp_json_encode( $defaults ) . ';',
        'before'
    );
}

// ── Admin tab registration ────────────────────────────────────────────────────

add_filter( 'cns_admin_tabs', function ( array $tabs ): array {
    $tabs['wiki'] = [
        'menu_title' => __( 'Wiki', 'clouds-and-spaceships' ),
        'title'      => __( 'CNS Wiki Suite', 'clouds-and-spaceships' ),
        'capability' => 'manage_options',
        'callback'   => 'cns_wiki_admin_render_tab',
        'priority'   => 20,
    ];
    return $tabs;
} );

function cns_wiki_admin_render_tab(): void {
    include CNS_DIR . 'includes/wiki/views/tab-wiki.php';
}
