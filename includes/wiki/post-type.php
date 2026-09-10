<?php

/**
 * Sets up the wiki post type and its block templates.
 *
 * @package CNS Wiki Suite
 */

defined('ABSPATH') || exit;

/**
 * Default content template for new wiki posts.
 *
 * This is the *editable* portion of a wiki article only: the center content
 * column (section/tabs) and the per-post infobox column. The surrounding page
 * chrome — the left navigation sidebar and the outer layout wrapper — lives in
 * the single-wiki.html block template, so it renders on the front end without
 * appearing in the post editor (matching how normal posts behave).
 *
 * On the Clouds and Spaceships theme this uses the theme's section/tab blocks.
 * On any other theme it degrades to a plain columns skeleton so new posts are
 * never born with unknown blocks.
 */
function cns_wiki_post_content_template(): array
{
    $is_cns_theme = get_template() === 'clouds-and-spaceships';

    $center_column = $is_cns_theme
        ? [
            [
                'cns-theme/cns-section',
                [
                    'title'         => '',
                    'titleLevel'    => 'h1',
                    'showUnderline' => true,
                ],
                [
                    ['cns-theme/cns-tab', ['label' => 'Option 1'], [
                        ['core/paragraph', ['placeholder' => 'Option 1 content goes here...']],
                    ]],
                    ['cns-theme/cns-tab', ['label' => 'Option 2'], [
                        ['core/paragraph', ['placeholder' => 'Option 2 content goes here...']],
                    ]],
                    ['cns-theme/cns-tab', ['label' => 'Option 3'], [
                        ['core/paragraph', ['placeholder' => 'Option 3 content goes here...']],
                    ]],
                ],
            ],
        ]
        : [['core/paragraph', ['placeholder' => __('Write your wiki article…', 'clouds-and-spaceships')]]];

    return [
        [
            'core/columns',
            [
                'className'    => 'cns-col__inner-wrapper',
                'isStackedOnMobile' => true,
                'lock'         => ['move' => true, 'remove' => true],
                'templateLock' => 'all',
            ],
            [
                // Center column — content
                [
                    'core/column',
                    [
                        'className'    => 'cns-col cns-col__center',
                        'lock'         => ['move' => true, 'remove' => true],
                        'templateLock' => false,
                    ],
                    $center_column,
                ],
                // Right column — per-post infobox
                [
                    'core/column',
                    [
                        'className'    => 'cns-col cns-col__side cns-col__right cns-col__wiki',
                        'lock'         => ['move' => true, 'remove' => true],
                        'templateLock' => false,
                    ],
                    [
                        ['cns-wiki-suite/infobox', []],
                    ],
                ],
            ],
        ],
    ];
}

function cns_wiki_register_post_type()
{
    $labels = [
        'name'                  => _x('Wikis', 'Post type general name', 'clouds-and-spaceships'),
        'singular_name'         => _x('Wiki', 'Post type singular name', 'clouds-and-spaceships'),
        'menu_name'             => _x('Wikis', 'Admin Menu text', 'clouds-and-spaceships'),
        'name_admin_bar'        => _x('Wiki', 'Add New on Toolbar', 'clouds-and-spaceships'),
        'add_new'               => __('Add New', 'clouds-and-spaceships'),
        'add_new_item'          => __('Add New wiki', 'clouds-and-spaceships'),
        'new_item'              => __('New wiki', 'clouds-and-spaceships'),
        'edit_item'             => __('Edit wiki', 'clouds-and-spaceships'),
        'view_item'             => __('View wiki', 'clouds-and-spaceships'),
        'all_items'             => __('All wikis', 'clouds-and-spaceships'),
        'search_items'          => __('Search wikis', 'clouds-and-spaceships'),
        'parent_item_colon'     => __('Parent wikis:', 'clouds-and-spaceships'),
        'not_found'             => __('No wikis found.', 'clouds-and-spaceships'),
        'not_found_in_trash'    => __('No wikis found in Trash.', 'clouds-and-spaceships'),
        'featured_image'        => _x('Wiki Cover Image', 'Overrides the "Featured Image" phrase for this post type.', 'clouds-and-spaceships'),
        'set_featured_image'    => _x('Set cover image', 'Overrides the "Set featured image" phrase for this post type.', 'clouds-and-spaceships'),
        'remove_featured_image' => _x('Remove cover image', 'Overrides the "Remove featured image" phrase for this post type.', 'clouds-and-spaceships'),
        'use_featured_image'    => _x('Use as cover image', 'Overrides the "Use as featured image" phrase for this post type.', 'clouds-and-spaceships'),
        'archives'              => _x('Wiki archives', 'The post type archive label used in nav menus.', 'clouds-and-spaceships'),
        'insert_into_item'      => _x('Insert into wiki', 'Overrides the "Insert into post" phrase (media).', 'clouds-and-spaceships'),
        'uploaded_to_this_item' => _x('Uploaded to this wiki', 'Overrides the "Uploaded to this post" phrase (media).', 'clouds-and-spaceships'),
        'filter_items_list'     => _x('Filter wikis list', 'Screen reader text for the filter links.', 'clouds-and-spaceships'),
        'items_list_navigation' => _x('Wikis list navigation', 'Screen reader text for the pagination.', 'clouds-and-spaceships'),
        'items_list'            => _x('Wikis list', 'Screen reader text for the items list.', 'clouds-and-spaceships'),
    ];
    $args = [
        'labels'             => $labels,
        'description'        => 'Wiki custom post type.',
        'public'             => true,
        'publicly_queryable' => true,
        'show_ui'            => true,
        'show_in_menu'       => true,
        'query_var'          => true,
        // 'hierarchical' => true so a child wiki's permalink carries its ancestor
        // path (/wiki/parent/child/) rather than sitting flat under the archive.
        'rewrite'            => [
            'slug'         => cns_get_wiki_setting( 'archive_slug', 'wiki' ),
            'hierarchical' => true,
        ],
        'capability_type'    => 'post',
        'has_archive'        => true,
        'hierarchical'       => true,
        'menu_position'      => 20,
        'supports'           => ['title', 'editor', 'author', 'thumbnail', 'excerpt', 'comments', 'page-attributes'],
        'taxonomies'         => ['category', 'post_tag'],
        'show_in_rest'       => true,
        'template'           => cns_wiki_post_content_template(),
        'template_lock'      => 'insert',
    ];

    register_post_type('wiki', $args);
}
add_action('init', 'cns_wiki_register_post_type');

// One-time rewrite flush when the CPT's structure changes (e.g. it became
// hierarchical, so permalinks now need the nested-path rules). Reuses the
// shared rewrite-flush flag, which is consumed on init at priority 99.
const CNS_WIKI_CPT_STRUCTURE_VERSION = 2;

add_action('init', 'cns_wiki_maybe_flag_structure_flush', 11);

function cns_wiki_maybe_flag_structure_flush(): void
{
    if ((int) get_option('cns_wiki_cpt_structure_version') === CNS_WIKI_CPT_STRUCTURE_VERSION) {
        return;
    }
    update_option('cns_wiki_cpt_structure_version', CNS_WIKI_CPT_STRUCTURE_VERSION);
    cns_schedule_rewrite_flush();
}


/**
 * Substitutes the placeholder thumbnail (CNS → Wiki tab) for wiki posts that
 * have no cover image. Hooking post_thumbnail_id covers every consumer at
 * once — wiki cards, the archive's post-featured-image block, and theme
 * templates. Frontend only, so the admin list and editor still show which
 * wikis genuinely lack a cover image.
 */
function cns_wiki_placeholder_thumbnail_id( $thumbnail_id, $post )
{
    if ( $thumbnail_id || is_admin() ) {
        return $thumbnail_id;
    }

    $post = get_post( $post );
    if ( ! $post || 'wiki' !== $post->post_type ) {
        return $thumbnail_id;
    }

    $placeholder = absint( cns_get_wiki_setting( 'placeholder_thumb_id', 0 ) );

    return $placeholder && wp_attachment_is_image( $placeholder ) ? $placeholder : $thumbnail_id;
}
add_filter( 'post_thumbnail_id', 'cns_wiki_placeholder_thumbnail_id', 10, 2 );


/**
 * Whether the plugin's wiki page templates are in use (CNS → Wiki tab).
 * When off, wiki posts and the wiki archive fall back to whatever the active
 * theme would use for any other post type.
 */
function cns_wiki_use_wiki_template(): bool
{
    return (bool) cns_get_wiki_setting( 'use_wiki_template', true );
}

function cns_wiki_register_block_templates()
{
    if ( ! cns_wiki_use_wiki_template() ) {
        return;
    }

    $templates_dir = CNS_DIR . 'templates/';

    $single  = $templates_dir . 'single-wiki.html';
    $archive = $templates_dir . 'archive-wiki.html';

    if ( file_exists( $single ) ) {
        register_block_template('clouds-and-spaceships//single-wiki', [
            'title'       => __('Single Wiki', 'clouds-and-spaceships'),
            'description' => __('Template for single wiki posts', 'clouds-and-spaceships'),
            'post_types'  => ['wiki'],
            'content'     => file_get_contents( $single ),
        ]);
    }

    if ( file_exists( $archive ) ) {
        register_block_template('clouds-and-spaceships//archive-wiki', [
            'title'       => __('Wiki Archive', 'clouds-and-spaceships'),
            'post_types'  => ['wiki'],
            'content'     => file_get_contents( $archive ),
        ]);
    }
}
add_action('init', 'cns_wiki_register_block_templates');


/**
 * With the wiki template disabled, drop the wiki-specific slugs from the
 * template hierarchy so WordPress resolves the theme's default single/archive
 * templates instead. This also bypasses user-customised copies of the plugin
 * templates saved through the Site Editor (wp_template posts), which would
 * otherwise still match the single-wiki / archive-wiki slugs.
 */
function cns_wiki_filter_template_hierarchy( array $templates ): array
{
    if ( cns_wiki_use_wiki_template() ) {
        return $templates;
    }
    return array_values( array_diff( $templates, [ 'single-wiki.php', 'archive-wiki.php' ] ) );
}
add_filter( 'single_template_hierarchy',  'cns_wiki_filter_template_hierarchy' );
add_filter( 'archive_template_hierarchy', 'cns_wiki_filter_template_hierarchy' );


/**
 * Layout fallbacks for the wiki columns.
 *
 * The `cns-col*` classes used by the wiki template and the wiki post-content
 * template are only styled by the Clouds and Spaceships theme; everywhere else
 * core's columns rule splits the row into equal shares. This stylesheet gives
 * the infobox column a max-width (and the article column the remainder) on any
 * theme, deferring to `--wp--custom--layout--col-wiki` when the theme sets it.
 *
 * enqueue_block_assets fires on both the frontend and in the editor, so the
 * post editor previews the same proportions the visitor gets.
 */
function cns_wiki_enqueue_layout_styles(): void
{
    $rel  = 'assets/css/wiki-layout.css';
    $path = CNS_DIR . $rel;

    if ( ! file_exists( $path ) ) {
        return;
    }

    wp_enqueue_style(
        'cns-wiki-layout',
        CNS_URL . $rel,
        [],
        (string) filemtime( $path )
    );

    // Admin override (CNS → Wiki → Layout). Emitted only when set, so an unset
    // value falls through to the theme's own custom property.
    $width = cns_get_wiki_setting( 'infobox_width', '' );
    if ( is_numeric( $width ) ) {
        wp_add_inline_style(
            'cns-wiki-layout',
            ':root{--cns-wiki-infobox-width:' . (float) $width . 'rem;}'
        );
    }
}
add_action( 'enqueue_block_assets', 'cns_wiki_enqueue_layout_styles' );
