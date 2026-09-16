<?php
/**
 * CNS settings page — the tabbed "Clouds And Spaceships" admin screen.
 *
 * Imported from the Clouds And Spaceships theme, where it used to ship as four
 * identical function_exists-guarded copies (theme + wiki/map/story suites).
 * The suites are one plugin now, so this is the single definition and the
 * guard is gone.
 *
 * Providers add their tabs via the `cns_admin_tabs` filter:
 *
 *   add_filter( 'cns_admin_tabs', function ( array $tabs ): array {
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
 * Each tab becomes an admin page with the slug cns-settings-{slug}. The bare
 * parent slug cns-settings also resolves to the lowest-priority tab, so old
 * bookmarks keep working.
 *
 * The theme still ships its own guarded copy and registers a "Theme" tab
 * through the same filter. Plugins load before themes, so this definition
 * wins and the theme's copy is a no-op.
 */

defined( 'ABSPATH' ) || exit;

/**
 * Returns the ordered tab definitions from every active provider.
 * Result is cached so apply_filters only runs once per request.
 */
function cns_admin_get_tabs(): array {
    static $tabs = null;
    if ( null !== $tabs ) {
        return $tabs;
    }

    $tabs = (array) apply_filters( 'cns_admin_tabs', [] );

    uasort( $tabs, static function ( array $a, array $b ): int {
        return ( (int) ( $a['priority'] ?? 50 ) ) <=> ( (int) ( $b['priority'] ?? 50 ) );
    } );

    return $tabs;
}

/**
 * Returns the WP admin page slug for a given tab slug.
 */
function cns_admin_page_slug( string $tab_slug ): string {
    return 'cns-settings-' . $tab_slug;
}

/**
 * Resolves the tab slug of the settings page being requested, or null when the
 * current request is not a CNS settings page. The bare parent slug
 * (cns-settings) maps to the default (lowest-priority) tab.
 */
function cns_admin_active_tab(): ?string {
    $tabs = cns_admin_get_tabs();
    $page = sanitize_key( wp_unslash( $_GET['page'] ?? '' ) );

    if ( 'cns-settings' === $page ) {
        return array_key_first( $tabs );
    }
    foreach ( $tabs as $slug => $tab ) {
        if ( $page === cns_admin_page_slug( $slug ) ) {
            return $slug;
        }
    }
    return null;
}

// ── Menu registration ─────────────────────────────────────────────────────────

add_action( 'admin_menu', 'cns_admin_register_menus', 99 );

function cns_admin_register_menus(): void {
    $tabs = cns_admin_get_tabs();
    if ( ! $tabs ) {
        return;
    }

    $default = $tabs[ array_key_first( $tabs ) ];

    // Top-level entry — dashicons-cloud, position 99 = bottom of sidebar.
    add_menu_page(
        __( 'Clouds And Spaceships', 'clouds-and-spaceships' ),
        __( 'CNS', 'clouds-and-spaceships' ),
        $default['capability'] ?? 'manage_options',
        'cns-settings',
        'cns_admin_render_page',
        'dashicons-cloud',
        99
    );

    // One named submenu per tab.
    foreach ( $tabs as $slug => $tab ) {
        add_submenu_page(
            'cns-settings',
            __( 'Clouds And Spaceships', 'clouds-and-spaceships' ),
            esc_html( $tab['menu_title'] ),
            $tab['capability'] ?? 'manage_options',
            cns_admin_page_slug( $slug ),
            'cns_admin_render_page'
        );
    }

    // Remove the auto-generated duplicate of the parent entry; the top-level
    // link then points at the first tab's submenu page.
    remove_submenu_page( 'cns-settings', 'cns-settings' );
}

// ── Page renderer ─────────────────────────────────────────────────────────────

function cns_admin_render_page(): void {
    $tabs       = cns_admin_get_tabs();
    $active_tab = cns_admin_active_tab() ?? array_key_first( $tabs );
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
            $url          = admin_url( 'admin.php?page=' . cns_admin_page_slug( $slug ) );
            $active_class = $slug === $active_tab ? ' nav-tab-active' : '';
        ?>
          <a href="<?php echo esc_url( $url ); ?>" class="nav-tab<?php echo esc_attr( $active_class ); ?>">
            <?php echo esc_html( $tab['title'] ); ?>
          </a>
        <?php endforeach; ?>
      </nav>

      <div class="cns-admin-tab-content">
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
// The media picker is used by tabs from several providers (theme login images,
// wiki placeholder thumbnail), so it lives in the framework and loads on every
// CNS settings page. So does the admin-settings bundle, which carries the
// layout language every tab is built from and the confirm prompt for
// destructive links.
//
// That bundle is deliberately separate from the map and story editor bundles.
// The list tabs used to pull a whole editor's stylesheet (~16 KB of canvas and
// panel rules) to draw a table, and the two editors each kept their own drifted
// copy of the shared pieces. Tabs that need an editor's React app — Icons — add
// that bundle on top; nothing else does.

add_action( 'admin_enqueue_scripts', 'cns_admin_enqueue_shared_assets' );

function cns_admin_enqueue_shared_assets( string $hook ): void {
    if ( ! str_contains( $hook, 'cns-settings' ) ) {
        return;
    }

    $asset_file = CNS_DIR . 'build/admin-settings/index.asset.php';
    $asset      = file_exists( $asset_file )
        ? require $asset_file
        : [ 'dependencies' => [], 'version' => CNS_VERSION ];

    wp_enqueue_style(
        'cns-admin-settings',
        CNS_URL . 'build/admin-settings/index.css',
        [],
        $asset['version']
    );
    wp_enqueue_script(
        'cns-admin-settings',
        CNS_URL . 'build/admin-settings/index.js',
        $asset['dependencies'],
        $asset['version'],
        true
    );

    wp_enqueue_media();
    wp_add_inline_script( 'jquery', cns_admin_media_picker_js() );
    wp_add_inline_script( 'jquery', cns_admin_color_clear_js() );
}

/**
 * "Clear (use theme default)" checkboxes next to a colour input.
 *
 * Colour inputs cannot hold an empty value, so clearing one means disabling it
 * so the browser leaves it out of the submitted form — the sanitizer then
 * stores an empty string and the theme default applies. Markup:
 *
 *   <input type="checkbox" class="cns-color-clear" data-color="the-input-id">
 */
function cns_admin_color_clear_js(): string {
    return <<<'JS'
(function ($) {
    $(function () {
        $('.cns-color-clear').on('change', function () {
            var input = $('#' + $(this).data('color'));
            if (! input.length) return;
            input.prop('disabled', this.checked);
            if (this.checked) input.val('');
        });
    });
})(jQuery);
JS;
}

function cns_admin_media_picker_js(): string {
    return <<<'JS'
(function ($) {
    $(function () {
        $('.cns-media-btn').on('click', function (e) {
            e.preventDefault();
            var btn      = $(this);
            var inputId  = btn.data('input');
            var imgId    = btn.data('preview');
            var removeId = btn.data('remove');
            var frame    = wp.media({
                title:    btn.data('title') || 'Select Image',
                button:   { text: 'Use this image' },
                multiple: false,
                library:  { type: 'image' },
            });
            frame.on('select', function () {
                var att = frame.state().get('selection').first().toJSON();
                $('#' + inputId).val(att.id);
                $('#' + imgId).attr('src', att.url).show();
                $('#' + removeId).show();
                btn.text(btn.data('change-label') || 'Change image');
            });
            frame.open();
        });

        $('.cns-media-remove-btn').on('click', function (e) {
            e.preventDefault();
            var btn      = $(this);
            var inputId  = btn.data('input');
            var imgId    = btn.data('preview');
            var pickerId = btn.data('picker');
            $('#' + inputId).val('');
            $('#' + imgId).attr('src', '').hide();
            btn.hide();
            $('#' + pickerId).text($('#' + pickerId).data('select-label') || 'Select image');
        });
    });
})(jQuery);
JS;
}
