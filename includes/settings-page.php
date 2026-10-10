<?php
/**
 * CNS settings page — the tabbed "Clouds And Spaceships" admin screen.
 *
 * Providers add their tabs via the `clouansp_admin_tabs` filter:
 *
 *   add_filter( 'clouansp_admin_tabs', function ( array $tabs ): array {
 *       $tabs['my-slug'] = [
 *           'menu_title' => 'My Suite',       // sidebar label
 *           'title'      => 'My Suite Title', // horizontal tab label
 *           'capability' => 'manage_options',
 *           'callback'   => 'my_suite_render_tab', // callable
 *           'priority'   => 40,               // lower = further left/up
 *       ];
 *       return $tabs;
 *   } );
 *
 * Each tab becomes an admin page with the slug clouansp-settings-{slug}. The bare
 * parent slug clouansp-settings also resolves to the lowest-priority tab, so old
 * bookmarks keep working.
 */

defined( 'ABSPATH' ) || exit;

/**
 * Returns the ordered tab definitions from every active provider.
 * Result is cached so apply_filters only runs once per request.
 */
function clouansp_admin_get_tabs(): array {
    static $tabs = null;
    if ( null !== $tabs ) {
        return $tabs;
    }

    $tabs = (array) apply_filters( 'clouansp_admin_tabs', [] );

    uasort( $tabs, static function ( array $a, array $b ): int {
        return ( (int) ( $a['priority'] ?? 50 ) ) <=> ( (int) ( $b['priority'] ?? 50 ) );
    } );

    return $tabs;
}

/**
 * Returns the WP admin page slug for a given tab slug.
 */
function clouansp_admin_page_slug( string $tab_slug ): string {
    return 'clouansp-settings-' . $tab_slug;
}

/**
 * Resolves the tab slug of the settings page being requested, or null when the
 * current request is not a CNS settings page. The bare parent slug
 * (clouansp-settings) maps to the default (lowest-priority) tab.
 */
function clouansp_admin_active_tab(): ?string {
    $tabs = clouansp_admin_get_tabs();
    // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- routing only; reads which admin page is being rendered.
    $page = sanitize_key( wp_unslash( $_GET['page'] ?? '' ) );

    if ( 'clouansp-settings' === $page ) {
        return array_key_first( $tabs );
    }
    foreach ( $tabs as $slug => $tab ) {
        if ( $page === clouansp_admin_page_slug( $slug ) ) {
            return $slug;
        }
    }
    return null;
}

// ── Menu registration ─────────────────────────────────────────────────────────

add_action( 'admin_menu', 'clouansp_admin_register_menus', 99 );

function clouansp_admin_register_menus(): void {
    $tabs = clouansp_admin_get_tabs();
    if ( ! $tabs ) {
        return;
    }

    $default = $tabs[ array_key_first( $tabs ) ];

    // Top-level entry — dashicons-cloud, position 99 = bottom of sidebar.
    add_menu_page(
        __( 'Clouds And Spaceships', 'clouds-and-spaceships' ),
        __( 'CNS', 'clouds-and-spaceships' ),
        $default['capability'] ?? 'manage_options',
        'clouansp-settings',
        'clouansp_admin_render_page',
        'dashicons-cloud',
        99
    );

    // One named submenu per tab.
    foreach ( $tabs as $slug => $tab ) {
        add_submenu_page(
            'clouansp-settings',
            __( 'Clouds And Spaceships', 'clouds-and-spaceships' ),
            esc_html( $tab['menu_title'] ),
            $tab['capability'] ?? 'manage_options',
            clouansp_admin_page_slug( $slug ),
            'clouansp_admin_render_page'
        );
    }

    // Remove the auto-generated duplicate of the parent entry; the top-level
    // link then points at the first tab's submenu page.
    remove_submenu_page( 'clouansp-settings', 'clouansp-settings' );
}

// ── Page renderer ─────────────────────────────────────────────────────────────

function clouansp_admin_render_page(): void {
    $tabs       = clouansp_admin_get_tabs();
    $active_tab = clouansp_admin_active_tab() ?? array_key_first( $tabs );
    $active     = $tabs[ $active_tab ] ?? null;

    if ( ! $active || ! current_user_can( $active['capability'] ?? 'manage_options' ) ) {
        wp_die( esc_html__( 'You do not have permission to access this page.', 'clouds-and-spaceships' ) );
    }
    ?>
    <div class="wrap">

      <h1><?php esc_html_e( 'Clouds And Spaceships', 'clouds-and-spaceships' ); ?></h1>

      <nav class="nav-tab-wrapper" aria-label="<?php esc_attr_e( 'CNS settings sections', 'clouds-and-spaceships' ); ?>">
        <?php foreach ( $tabs as $slug => $tab ) :
            if ( ! current_user_can( $tab['capability'] ?? 'manage_options' ) ) continue;
            $url          = admin_url( 'admin.php?page=' . clouansp_admin_page_slug( $slug ) );
            $active_class = $slug === $active_tab ? ' nav-tab-active' : '';
        ?>
          <a href="<?php echo esc_url( $url ); ?>" class="nav-tab<?php echo esc_attr( $active_class ); ?>">
            <?php echo esc_html( $tab['title'] ); ?>
          </a>
        <?php endforeach; ?>
      </nav>

      <div class="clouansp-admin-tab-content">
        <?php
        if ( is_callable( $active['callback'] ?? null ) ) {
            call_user_func( $active['callback'] );
        } else {
            echo '<p>' . esc_html__( 'No content available for this tab.', 'clouds-and-spaceships' ) . '</p>';
        }
        ?>
      </div>

    </div>
    <?php
}

// ── Shared assets ─────────────────────────────────────────────────────────────
//
// The media picker is used by more than one tab (the wiki and story placeholder
// thumbnails), so it lives here and loads on every CNS settings page. So does the admin-settings bundle, which carries the
// layout language every tab is built from and the confirm prompt for
// destructive links.
//
// That bundle is deliberately separate from the map and story editor bundles.
// Tabs that need an editor's React app — Icons — add that bundle on top;
// nothing else does.

add_action( 'admin_enqueue_scripts', 'clouansp_admin_enqueue_shared_assets' );

function clouansp_admin_enqueue_shared_assets( string $hook ): void {
    if ( ! str_contains( $hook, 'clouansp-settings' ) ) {
        return;
    }

    $asset = clouansp_asset( 'admin-settings/index' );

    wp_enqueue_style(
        'clouansp-admin-settings',
        CLOUANSP_URL . 'build/admin-settings/index.css',
        [],
        $asset['version']
    );
    wp_enqueue_script(
        'clouansp-admin-settings',
        CLOUANSP_URL . 'build/admin-settings/index.js',
        // jQuery for the inline helpers below, which ride on this handle.
        array_merge( [ 'jquery' ], $asset['dependencies'] ),
        $asset['version'],
        true
    );

    wp_enqueue_media();
    wp_add_inline_script( 'clouansp-admin-settings', clouansp_admin_media_picker_js() );
    wp_add_inline_script( 'clouansp-admin-settings', clouansp_admin_color_clear_js() );
}

/**
 * "Clear (use theme default)" checkboxes next to a colour input.
 *
 * Colour inputs cannot hold an empty value, so clearing one means disabling it
 * so the browser leaves it out of the submitted form — the sanitizer then
 * stores an empty string and the theme default applies. Markup:
 *
 *   <input type="checkbox" class="clouansp-color-clear" data-color="the-input-id">
 */
function clouansp_admin_color_clear_js(): string {
    return <<<'JS'
(function ($) {
    $(function () {
        $('.clouansp-color-clear').on('change', function () {
            var input = $('#' + $(this).data('color'));
            if (! input.length) return;
            input.prop('disabled', this.checked);
            if (this.checked) input.val('');
        });
    });
})(jQuery);
JS;
}

/**
 * Media picker buttons. Each button passes its own translated labels as data
 * attributes; the strings handed in as l10n are the fallbacks.
 */
function clouansp_admin_media_picker_js(): string {
    $l10n = [
        'title'  => __( 'Select image', 'clouds-and-spaceships' ),
        'button' => __( 'Use this image', 'clouds-and-spaceships' ),
        'change' => __( 'Change image', 'clouds-and-spaceships' ),
        'select' => __( 'Select image', 'clouds-and-spaceships' ),
    ];

    return sprintf( <<<'JS'
(function ($, l10n) {
    $(function () {
        $('.clouansp-media-btn').on('click', function (e) {
            e.preventDefault();
            var btn      = $(this);
            var inputId  = btn.data('input');
            var imgId    = btn.data('preview');
            var removeId = btn.data('remove');
            var frame    = wp.media({
                title:    btn.data('title') || l10n.title,
                button:   { text: l10n.button },
                multiple: false,
                library:  { type: 'image' },
            });
            frame.on('select', function () {
                var att = frame.state().get('selection').first().toJSON();
                $('#' + inputId).val(att.id);
                $('#' + imgId).attr('src', att.url).show();
                $('#' + removeId).show();
                btn.text(btn.data('change-label') || l10n.change);
            });
            frame.open();
        });

        $('.clouansp-media-remove-btn').on('click', function (e) {
            e.preventDefault();
            var btn      = $(this);
            var inputId  = btn.data('input');
            var imgId    = btn.data('preview');
            var pickerId = btn.data('picker');
            $('#' + inputId).val('');
            $('#' + imgId).attr('src', '').hide();
            btn.hide();
            $('#' + pickerId).text($('#' + pickerId).data('select-label') || l10n.select);
        });
    });
})(jQuery, %s);
JS,
        wp_json_encode( $l10n )
    );
}
