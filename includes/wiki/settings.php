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

/**
 * Both the Wiki and the Glossary tab post to this one option, so a save must
 * never drop the keys the other tab owns. Each form declares which section it
 * is with a hidden _section field; only that section's keys are rebuilt and
 * merged over what is already stored.
 */
function cns_sanitize_wiki_settings( $input ): array {
    $input   = is_array( $input ) ? $input : [];
    $section = sanitize_key( $input['_section'] ?? 'wiki' );
    $stored  = (array) get_option( 'cns_wiki_settings', [] );

    $output = 'glossary' === $section
        ? cns_sanitize_wiki_glossary_section( $input )
        : cns_sanitize_wiki_section( $input );

    return array_merge( $stored, $output );
}

/** Keys owned by the Wiki tab. */
function cns_sanitize_wiki_section( array $input ): array {
    $output = [];

    // Post type. Defaults to on, so an install that has never saved this form
    // keeps its wikis; only an explicit unticked save turns it off.
    $output['wiki_enabled']   = ! empty( $input['wiki_enabled'] );
    $output['wiki_show_menu'] = ! empty( $input['wiki_show_menu'] );

    // Opt-in, read by uninstall.php. Defaults to off: wiki articles are the
    // user's own writing, so deleting them is never the silent default.
    $output['wiki_delete_on_uninstall'] = ! empty( $input['wiki_delete_on_uninstall'] );

    // Layout — infobox column width in px. Empty means no
    // --cns-wiki-infobox-width is emitted, so the infobox block's stylesheet
    // falls back to its built-in 360px.
    // 200-1280px is the old 12-80rem range; stored as whole pixels.
    $width = trim( (string) ( $input['infobox_width'] ?? '' ) );
    $output['infobox_width'] = is_numeric( $width )
        ? (string) (int) min( 1280, max( 200, round( (float) $width ) ) )
        : '';

    // Layout — outer content width in px. Empty means the wiki templates stay
    // full width, which is how they rendered before this setting existed.
    $content_width = trim( (string) ( $input['content_width'] ?? '' ) );
    $output['content_width'] = is_numeric( $content_width )
        ? (string) (int) min( 3200, max( 640, round( (float) $content_width ) ) )
        : '';

    // Archive
    $raw_slug             = preg_replace( '/[^a-z0-9\-]/', '', strtolower( $input['archive_slug'] ?? 'wiki' ) );
    $output['archive_slug'] = $raw_slug ?: 'wiki';

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
    $output['infobox_accent_color']   = sanitize_hex_color( $input['infobox_accent_color']   ?? '' ) ?? '';
    $output['infobox_text_color']     = sanitize_hex_color( $input['infobox_text_color']     ?? '' ) ?? '';
    $output['infobox_title_color']    = sanitize_hex_color( $input['infobox_title_color']    ?? '' ) ?? '';

    return $output;
}

/** Keys owned by the Glossary tab. */
function cns_sanitize_wiki_glossary_section( array $input ): array {
    $output = [];

    $output['glossary_enabled'] = ! empty( $input['glossary_enabled'] );

    $raw_glossary_slug        = preg_replace( '/[^a-z0-9\-]/', '', strtolower( $input['glossary_slug'] ?? 'glossary' ) );
    $output['glossary_slug']  = $raw_glossary_slug ?: 'glossary';

    $output['glossary_text_color'] = sanitize_hex_color( $input['glossary_text_color'] ?? '' ) ?? '';

    $output['glossary_show_menu'] = ! empty( $input['glossary_show_menu'] );

    // Opt-in, read by uninstall.php. Defaults to off, like the wiki one.
    $output['glossary_delete_on_uninstall'] = ! empty( $input['glossary_delete_on_uninstall'] );

    return $output;
}

// ── Layout units migration ───────────────────────────────────────────────────
//
// The two layout widths were stored as unitless rem and are now unitless px, so
// a value saved before the change would be read as 34px rather than 34rem.
// Converts once at 16px to the rem, the browser default the old values assumed.

const CNS_WIKI_LAYOUT_UNITS_VERSION = 1;

add_action( 'admin_init', 'cns_wiki_migrate_layout_units' );

function cns_wiki_migrate_layout_units(): void {
    if ( (int) get_option( 'cns_wiki_layout_units_version' ) === CNS_WIKI_LAYOUT_UNITS_VERSION ) {
        return;
    }

    $settings = (array) get_option( 'cns_wiki_settings', [] );
    $changed  = false;

    foreach ( [ 'infobox_width', 'content_width' ] as $key ) {
        $value = $settings[ $key ] ?? '';
        if ( '' !== trim( (string) $value ) && is_numeric( $value ) ) {
            $settings[ $key ] = (string) (int) round( (float) $value * 16 );
            $changed          = true;
        }
    }

    if ( $changed ) {
        // Write past the Settings API. update_option() runs the registered
        // sanitize_option_cns_wiki_settings callback, which rebuilds a whole
        // section from its input — and every checkbox absent from that array
        // would be read as unticked, silently switching the wiki off on any
        // install whose stored option predates those keys.
        remove_filter( 'sanitize_option_cns_wiki_settings', 'cns_sanitize_wiki_settings' );
        update_option( 'cns_wiki_settings', $settings );
        add_filter( 'sanitize_option_cns_wiki_settings', 'cns_sanitize_wiki_settings' );
    }

    update_option( 'cns_wiki_layout_units_version', CNS_WIKI_LAYOUT_UNITS_VERSION, false );
}

// ── Flush rewrites when a slug changes ───────────────────────────────────────
//
// The flag itself and the init-priority-99 flush live in includes/archive.php,
// shared with the map and story archives. Only the "did a watched key change?"
// test is wiki-specific, because these settings sit inside one option array.

add_action( 'update_option_cns_wiki_settings', 'cns_wiki_maybe_schedule_rewrite_flush', 10, 2 );

function cns_wiki_maybe_schedule_rewrite_flush( $old_value, $new_value ): void {
    $watched = [
        [ 'wiki_enabled',     true ],
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
//
// These are deliberately plugin-private custom properties rather than the
// theme's `--wp--preset--color--*` presets. The rule is scoped to the infobox
// wrapper either way, so it never escapes the block — but redefining a shared
// palette slug would still repaint any *nested* block that picked that same
// colour from the editor's palette, since core resolves `.has-<slug>-color`
// through the very same property. A private name can only be read by the
// infobox blocks' own attribute defaults, which is the whole point.
//
// Those defaults each fall back to the preset they used to name, so an unset
// setting still follows the theme exactly as before.

// enqueue_block_assets fires on both the frontend and in the editor.
add_action( 'enqueue_block_assets', 'cns_wiki_enqueue_infobox_styles' );

function cns_wiki_enqueue_infobox_styles(): void {
    $bg       = (string) cns_get_wiki_setting( 'infobox_bg_color',       '' );
    $contrast = (string) cns_get_wiki_setting( 'infobox_contrast_color', '' );
    $accent   = (string) cns_get_wiki_setting( 'infobox_accent_color',   '' );
    $text     = (string) cns_get_wiki_setting( 'infobox_text_color',     '' );
    $title    = (string) cns_get_wiki_setting( 'infobox_title_color',    '' );

    if ( ! $bg && ! $contrast && ! $accent && ! $text && ! $title ) {
        return;
    }

    $rules = '';
    if ( $bg )       $rules .= '--cns-wiki-infobox-bg:' . sanitize_hex_color( $bg ) . ';';
    if ( $contrast ) $rules .= '--cns-wiki-infobox-title-bg:' . sanitize_hex_color( $contrast ) . ';';
    if ( $accent )   $rules .= '--cns-wiki-infobox-accent:' . sanitize_hex_color( $accent ) . ';';
    if ( $text )     $rules .= '--cns-wiki-infobox-text:' . sanitize_hex_color( $text ) . ';';
    if ( $title )    $rules .= '--cns-wiki-infobox-title-text:' . sanitize_hex_color( $title ) . ';';

    $css = '.wp-block-cns-wiki-suite-infobox{' . $rules . '}';

    wp_register_style( 'cns-wiki-infobox-overrides', false, [], CNS_VERSION );
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
    if ( ! is_post_type_archive( 'cns_wiki' ) ) {
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

    wp_register_style( 'cns-wiki-archive-grid', false, [], CNS_VERSION );
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

// ── Editor defaults: infobox width ────────────────────────────────────────────
//
// The block's Max width control leaves its value empty until someone sets one,
// and the effective default then comes from CSS — the Layout setting's
// --cns-wiki-infobox-width, or 360px. The editor cannot read that off a
// stylesheet, so hand it the resolved number to show as the field's
// placeholder; otherwise the control advertises 360px on a site set to
// something else.

const CNS_WIKI_INFOBOX_WIDTH_DEFAULT = 360;

/** The effective default infobox max width in px, setting or built-in. */
function cns_wiki_infobox_default_width(): int {
    $width = cns_get_wiki_setting( 'infobox_width', '' );
    return is_numeric( $width ) ? (int) $width : CNS_WIKI_INFOBOX_WIDTH_DEFAULT;
}

add_action( 'enqueue_block_editor_assets', 'cns_wiki_expose_infobox_defaults' );

function cns_wiki_expose_infobox_defaults(): void {
    wp_add_inline_script(
        'cns-wiki-suite-infobox-editor-script',
        'window.cnsWikiInfoboxDefaults = ' . wp_json_encode(
            [ 'maxWidth' => cns_wiki_infobox_default_width() ]
        ) . ';',
        'before'
    );
}

// ── Admin tab registration ────────────────────────────────────────────────────

add_filter( 'cns_admin_tabs', function ( array $tabs ): array {
    $tabs['wiki'] = [
        'menu_title' => __( 'Wiki', 'clouds-and-spaceships' ),
        'title'      => __( 'Wiki', 'clouds-and-spaceships' ),
        'capability' => 'manage_options',
        'callback'   => 'cns_wiki_admin_render_tab',
        'priority'   => 20,
    ];
    $tabs['glossary'] = [
        'menu_title' => __( 'Glossary', 'clouds-and-spaceships' ),
        'title'      => __( 'Glossary', 'clouds-and-spaceships' ),
        'capability' => 'manage_options',
        'callback'   => 'cns_wiki_admin_render_glossary_tab',
        'priority'   => 21,
    ];
    return $tabs;
} );

function cns_wiki_admin_render_tab(): void {
    include CNS_DIR . 'includes/wiki/views/tab-wiki.php';
}

function cns_wiki_admin_render_glossary_tab(): void {
    include CNS_DIR . 'includes/wiki/views/tab-glossary.php';
}
