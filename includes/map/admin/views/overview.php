<?php
defined('ABSPATH') || exit;

// This screen only reads $_GET to decide what to display — which page, which
// filters, which page of results. Nothing here changes state, so there is no
// action to protect and no nonce to verify; WordPress's own list tables read
// their filters the same way. Every write path in this plugin verifies a nonce
// or goes through the REST API's permission callbacks.
// phpcs:disable WordPress.Security.NonceVerification.Recommended

$clouansp_per_page_options = [10, 20, 50, 100];
$clouansp_requested_per_page = (int) sanitize_text_field(wp_unslash($_GET['per_page'] ?? 20));
$clouansp_per_page           = in_array($clouansp_requested_per_page, $clouansp_per_page_options, true) ? $clouansp_requested_per_page : 20;
$clouansp_paged            = max(1, absint(wp_unslash($_GET['paged'] ?? 1)));
$clouansp_search           = isset($_GET['s']) ? sanitize_text_field(wp_unslash($_GET['s'])) : '';
$clouansp_total_maps  = clouansp_map_suite_count_maps($clouansp_search);
$clouansp_total_pages = (int) ceil($clouansp_total_maps / $clouansp_per_page);

if ($clouansp_total_pages > 0 && $clouansp_paged > $clouansp_total_pages) {
	$clouansp_paged = $clouansp_total_pages;
}

$clouansp_maps        = clouansp_map_suite_get_all_maps($clouansp_per_page, ($clouansp_paged - 1) * $clouansp_per_page, $clouansp_search);

$clouansp_return_page         = sanitize_key($_GET['page'] ?? CLOUANSP_MAP_PAGE_SETTINGS_MAPS);
$clouansp_editor_url          = clouansp_map_suite_editor_url();
$clouansp_show_maps_menu      = (bool) get_option('clouansp_map_suite_show_maps_menu', false);
$clouansp_zoom_main_color     = (string) get_option('clouansp_map_suite_zoom_main_color', '');
$clouansp_zoom_accent_color   = (string) get_option('clouansp_map_suite_zoom_accent_color', '');
?>
<div class="clouansp-settings-page">
	<!-- System notices start -->
	<?php if (isset($_GET['deleted'])) : ?>
		<div class="notice notice-success is-dismissible">
			<p><?php esc_html_e('Map deleted.', 'clouds-and-spaceships'); ?></p>
		</div>
	<?php endif; ?>

	<?php if (isset($_GET['settings-saved'])) : ?>
		<div class="notice notice-success is-dismissible">
			<p><?php esc_html_e('Settings saved.', 'clouds-and-spaceships'); ?></p>
		</div>
	<?php endif; ?>
	<!-- System notices end -->

	<!-- Header -->
	<div class="clouansp-settings-page__header">
		<h1><?php esc_html_e('Maps', 'clouds-and-spaceships'); ?></h1>
		<div class="clouansp-settings-page__actions">
			<a href="<?php echo esc_url($clouansp_editor_url); ?>" class="button button-primary">
				<?php esc_html_e('+ New Map', 'clouds-and-spaceships'); ?>
			</a>
		</div>
	</div>
	<!-- Search and Pagination -->
	<div class="clouansp-settings-toolbar">
		<form method="get">
			<input type="hidden" name="page" value="<?php echo esc_attr($clouansp_return_page); ?>" />
			<span class="clouansp-settings-toolbar__group">
				<label class="screen-reader-text" for="clouansp-map-search">
					<?php esc_html_e('Search maps', 'clouds-and-spaceships'); ?>
				</label>
				<input
					type="search"
					id="clouansp-map-search"
					name="s"
					value="<?php echo esc_attr($clouansp_search); ?>"
					placeholder="<?php esc_attr_e('Search maps…', 'clouds-and-spaceships'); ?>"
				/>
				<button type="submit" class="button"><?php esc_html_e('Search', 'clouds-and-spaceships'); ?></button>
				<?php if ($clouansp_search !== '') : ?>
					<a class="clouansp-settings-toolbar__clear" href="<?php echo esc_url(add_query_arg(
						['page' => $clouansp_return_page, 'per_page' => $clouansp_per_page],
						admin_url('admin.php')
					)); ?>"><?php esc_html_e('Clear', 'clouds-and-spaceships'); ?></a>
				<?php endif; ?>
			</span>

			<span class="clouansp-settings-toolbar__group">
				<label for="clouansp-per-page"><?php esc_html_e('Items per page:', 'clouds-and-spaceships'); ?></label>
				<select name="per_page" id="clouansp-per-page" data-autosubmit>
					<?php foreach ($clouansp_per_page_options as $clouansp_option) : ?>
						<option value="<?php echo esc_attr($clouansp_option); ?>" <?php selected($clouansp_per_page, $clouansp_option); ?>>
							<?php echo esc_html($clouansp_option); ?>
						</option>
					<?php endforeach; ?>
				</select>
			</span>
		</form>
	</div>

	<?php if ($clouansp_search !== '') : ?>
		<p class="clouansp-settings-toolbar__count">
			<?php printf(
				/* translators: %1$s: number of maps, %2$s: search term */
				esc_html(_n(
					'%1$s map found for “%2$s”.',
					'%1$s maps found for “%2$s”.',
					$clouansp_total_maps,
					'clouds-and-spaceships'
				)),
				esc_html(number_format_i18n($clouansp_total_maps)),
				esc_html($clouansp_search)
			); ?>
		</p>
	<?php endif; ?>

	<!-- Map list -->
	<table class="wp-list-table widefat fixed striped clouansp-settings-table">
		<thead>
			<tr>
				<th class="clouansp-settings-table__thumb"></th>
				<th><?php esc_html_e('Title', 'clouds-and-spaceships'); ?></th>
				<th><?php esc_html_e('Mode', 'clouds-and-spaceships'); ?></th>
				<th><?php esc_html_e('Status', 'clouds-and-spaceships'); ?></th>
				<th><?php esc_html_e('Date', 'clouds-and-spaceships'); ?></th>
				<th><?php esc_html_e('Actions', 'clouds-and-spaceships'); ?></th>
			</tr>
		</thead>
		<tbody>
			<?php if (! $clouansp_maps) : ?>
				<tr>
					<td colspan="6" class="clouansp-settings-table__empty">
						<?php if ($clouansp_search !== '') : ?>
							<?php esc_html_e('No maps match that name.', 'clouds-and-spaceships'); ?>
						<?php else : ?>
							<?php esc_html_e('No maps yet.', 'clouds-and-spaceships'); ?>
							<a href="<?php echo esc_url($clouansp_editor_url); ?>">
								<?php esc_html_e('Create your first map', 'clouds-and-spaceships'); ?>
							</a>
						<?php endif; ?>
					</td>
				</tr>
			<?php endif; ?>
			<?php foreach ($clouansp_maps as $clouansp_map) :
				$clouansp_is_master   = (bool) get_post_meta($clouansp_map->ID, '_clouansp_map_is_master', true);
				$clouansp_thumb_id    = (int) get_post_meta($clouansp_map->ID, '_clouansp_map_image_id', true);
				$clouansp_thumb_url   = $clouansp_thumb_id ? wp_get_attachment_image_url($clouansp_thumb_id, 'thumbnail') : '';

				$clouansp_edit_url   = esc_url(clouansp_map_suite_editor_url($clouansp_map->ID));
				$clouansp_delete_url = esc_url(wp_nonce_url(
					add_query_arg(
						['page' => $clouansp_return_page, 'action' => 'delete', 'map_id' => $clouansp_map->ID],
						admin_url('admin.php')
					),
					'clouansp_delete_map_' . $clouansp_map->ID
				));
			?>
				<tr>
					<td class="clouansp-settings-table__thumb">
						<a href="<?php echo esc_url($clouansp_edit_url); ?>">
						<?php if ($clouansp_thumb_url) : ?>
							<img src="<?php echo esc_url($clouansp_thumb_url); ?>" alt="<?php echo esc_html($clouansp_map->post_title ?: __('(no title)', 'clouds-and-spaceships')); ?>" />
						<?php else : ?>
							<div class="clouansp-thumb-placeholder"></div>
						<?php endif; ?>
						</a>
					</td>
					<td>
						<strong>
							<a href="<?php echo esc_url($clouansp_edit_url); ?>">
								<?php echo esc_html($clouansp_map->post_title ?: __('(no title)', 'clouds-and-spaceships')); ?>
							</a>
						</strong>
					</td>
					<td>
						<span class="clouansp-badge <?php echo $clouansp_is_master ? 'clouansp-badge--master' : 'clouansp-badge--map'; ?>">
							<?php echo $clouansp_is_master ? esc_html__('MasterMap', 'clouds-and-spaceships') : esc_html__('Map', 'clouds-and-spaceships'); ?>
						</span>
					</td>
					<td><?php
						$clouansp_status_labels = ['publish' => __('Published', 'clouds-and-spaceships'), 'draft' => __('Draft', 'clouds-and-spaceships'), 'private' => __('Private', 'clouds-and-spaceships')];
						echo esc_html($clouansp_status_labels[$clouansp_map->post_status] ?? ucfirst($clouansp_map->post_status));
					?></td>
					<td><?php echo esc_html(get_the_date('Y-m-d', $clouansp_map)); ?></td>
					<td class="clouansp-row-actions">
						<a href="<?php echo esc_url($clouansp_edit_url); ?>"><?php esc_html_e('Edit', 'clouds-and-spaceships'); ?></a>
						<?php if (in_array($clouansp_map->post_status, ['publish', 'private'], true)) : ?>
							&nbsp;&middot;&nbsp;
							<a href="<?php echo esc_url(get_permalink($clouansp_map->ID)); ?>" target="_blank" rel="noopener"><?php esc_html_e('View', 'clouds-and-spaceships'); ?></a>
						<?php endif; ?>
						&nbsp;&middot;&nbsp;
						<a
							href="<?php echo esc_url($clouansp_delete_url); ?>"
							class="clouansp-delete-link"
							data-confirm="<?php esc_attr_e('Permanently delete this map?', 'clouds-and-spaceships'); ?>"
						><?php esc_html_e('Delete', 'clouds-and-spaceships'); ?></a>
					</td>
				</tr>
			<?php endforeach; ?>
		</tbody>
	</table>

	<?php if ($clouansp_total_pages > 1) : ?>
		<div class="tablenav bottom">
			<div class="tablenav-pages">
				<?php echo wp_kses_post(paginate_links([
					'base'      => add_query_arg('paged', '%#%'),
					'format'    => '',
					'current'   => $clouansp_paged,
					'total'     => $clouansp_total_pages,
					'prev_text' => '&laquo;',
					'next_text' => '&raquo;',
				])); ?>
			</div>
		</div>
	<?php endif; ?>

	<!-- ── Plugin settings ──────────────────────────────────────────────────── -->
	<form method="post">
		<?php wp_nonce_field('clouansp_map_save_settings'); ?>
		<input type="hidden" name="clouansp_map_action" value="save_settings" />

		<!-- ── Maps ─────────────────────────────────────────────────── -->
		<div class="clouansp-settings-card">
			<h2><?php esc_html_e('Maps', 'clouds-and-spaceships'); ?></h2>
			<p class="description">
				<?php esc_html_e('Interactive canvas maps, managed from the CNS editor pages.', 'clouds-and-spaceships'); ?>
			</p>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row"><?php esc_html_e('Admin menu visibility', 'clouds-and-spaceships'); ?></th>
					<td>
						<label>
							<input type="checkbox" name="show_maps_menu" value="1" <?php checked($clouansp_show_maps_menu); ?> />
							<?php esc_html_e('Show Maps in the WordPress admin sidebar', 'clouds-and-spaceships'); ?>
						</label>
						<p class="description">
							<?php esc_html_e('Adds the standard WordPress list screen for maps to the sidebar. The CNS editor pages here stay the primary management UI.', 'clouds-and-spaceships'); ?>
						</p>
					</td>
				</tr>
			</table>
		</div>

		<!-- ── Map controls ─────────────────────────────────────────── -->
		<div class="clouansp-settings-card">
			<h2><?php esc_html_e('Map controls', 'clouds-and-spaceships'); ?></h2>
			<p class="description">
				<?php esc_html_e('Set the colors of map control buttons. Uses theme colors by default. Can by overwritten on individual map level.', 'clouds-and-spaceships'); ?>
			</p>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row">
						<label for="clouansp_map_zoom_main"><?php esc_html_e('Main color', 'clouds-and-spaceships'); ?></label>
					</th>
					<td>
						<input
							type="color"
							id="clouansp_map_zoom_main"
							name="zoom_main_color"
							value="<?php echo esc_attr($clouansp_zoom_main_color ?: '#2271b1'); ?>"
							<?php disabled('', $clouansp_zoom_main_color); ?>
						/>
						<label style="margin-left:8px;">
							<input type="checkbox" class="clouansp-field-clear" data-field="clouansp_map_zoom_main"
								<?php checked('', $clouansp_zoom_main_color); ?> />
							<?php esc_html_e('Use default', 'clouds-and-spaceships'); ?>
						</label>
						<p class="description">
							<?php esc_html_e('Button fill color.', 'clouds-and-spaceships'); ?>
						</p>
					</td>
				</tr>
				<tr>
					<th scope="row">
						<label for="clouansp_map_zoom_accent"><?php esc_html_e('Accent color', 'clouds-and-spaceships'); ?></label>
					</th>
					<td>
						<input
							type="color"
							id="clouansp_map_zoom_accent"
							name="zoom_accent_color"
							value="<?php echo esc_attr($clouansp_zoom_accent_color ?: '#ffffff'); ?>"
							<?php disabled('', $clouansp_zoom_accent_color); ?>
						/>
						<label style="margin-left:8px;">
							<input type="checkbox" class="clouansp-field-clear" data-field="clouansp_map_zoom_accent"
								<?php checked('', $clouansp_zoom_accent_color); ?> />
							<?php esc_html_e('Use default', 'clouds-and-spaceships'); ?>
						</label>
						<p class="description">
							<?php esc_html_e('Color of the button glyphs.', 'clouds-and-spaceships'); ?>
						</p>
					</td>
				</tr>
			</table>
		</div>

		<!-- ── Danger Zone ──────────────────────────────────────────── -->
		<div class="clouansp-danger-zone">
			<h2><?php esc_html_e('Danger Zone', 'clouds-and-spaceships'); ?></h2>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row"><?php esc_html_e('Caution', 'clouds-and-spaceships'); ?></th>
					<td>
						<p class="clouansp-text-danger">
							<?php esc_html_e('Deleting this plugin will delete every map permanently.', 'clouds-and-spaceships'); ?>
						</p>
						<p class="description">
							<?php esc_html_e('This plugin uses custom database tables, which are always removed on uninstall. Therefore maps cannot be preserved. Simple plugin deactivating will however not delete maps.', 'clouds-and-spaceships'); ?>
						</p>
					</td>
				</tr>
			</table>
		</div>

		<?php submit_button(__('Save Settings', 'clouds-and-spaceships'), 'secondary'); ?>
	</form>

</div>
