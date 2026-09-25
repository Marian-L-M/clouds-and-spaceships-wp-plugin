<?php
defined('ABSPATH') || exit;

// This screen only reads $_GET to decide what to display — which page, which
// filters, which page of results. Nothing here changes state, so there is no
// action to protect and no nonce to verify; WordPress's own list tables read
// their filters the same way. Every write path in this plugin verifies a nonce
// or goes through the REST API's permission callbacks.
// phpcs:disable WordPress.Security.NonceVerification.Recommended

$per_page_options = [10, 20, 50, 100];
$requested_per_page = (int) sanitize_text_field(wp_unslash($_GET['per_page'] ?? 20));
$per_page           = in_array($requested_per_page, $per_page_options, true) ? $requested_per_page : 20;
$paged            = max(1, absint(wp_unslash($_GET['paged'] ?? 1)));
$search           = isset($_GET['s']) ? sanitize_text_field(wp_unslash($_GET['s'])) : '';
$total_maps  = cns_map_suite_count_maps($search);
$total_pages = (int) ceil($total_maps / $per_page);

if ($total_pages > 0 && $paged > $total_pages) {
	$paged = $total_pages;
}

$maps        = cns_map_suite_get_all_maps($per_page, ($paged - 1) * $per_page, $search);

$return_page         = sanitize_key($_GET['page'] ?? CNS_MAP_PAGE_SETTINGS_MAPS);
$editor_url          = cns_map_suite_editor_url();
$delete_on_uninstall = (bool) get_option('cns_map_suite_delete_on_uninstall', false);
$show_maps_menu      = (bool) get_option('cns_map_suite_show_maps_menu', false);
$zoom_main_color     = (string) get_option('cns_map_suite_zoom_main_color', '');
$zoom_accent_color   = (string) get_option('cns_map_suite_zoom_accent_color', '');
?>
<div class="cns-settings-page">
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
	<div class="cns-settings-page__header">
		<h1><?php esc_html_e('Maps', 'clouds-and-spaceships'); ?></h1>
		<div class="cns-settings-page__actions">
			<a href="<?php echo esc_url($editor_url); ?>" class="button button-primary">
				<?php esc_html_e('+ New Map', 'clouds-and-spaceships'); ?>
			</a>
		</div>
	</div>
	<!-- Search and Pagination -->
	<div class="cns-settings-toolbar">
		<form method="get">
			<input type="hidden" name="page" value="<?php echo esc_attr($return_page); ?>" />
			<span class="cns-settings-toolbar__group">
				<label class="screen-reader-text" for="cns-map-search">
					<?php esc_html_e('Search maps', 'clouds-and-spaceships'); ?>
				</label>
				<input
					type="search"
					id="cns-map-search"
					name="s"
					value="<?php echo esc_attr($search); ?>"
					placeholder="<?php esc_attr_e('Search maps…', 'clouds-and-spaceships'); ?>"
				/>
				<button type="submit" class="button"><?php esc_html_e('Search', 'clouds-and-spaceships'); ?></button>
				<?php if ($search !== '') : ?>
					<a class="cns-settings-toolbar__clear" href="<?php echo esc_url(add_query_arg(
						['page' => $return_page, 'per_page' => $per_page],
						admin_url('admin.php')
					)); ?>"><?php esc_html_e('Clear', 'clouds-and-spaceships'); ?></a>
				<?php endif; ?>
			</span>

			<span class="cns-settings-toolbar__group">
				<label for="cns-per-page"><?php esc_html_e('Items per page:', 'clouds-and-spaceships'); ?></label>
				<select name="per_page" id="cns-per-page" onchange="this.form.submit()">
					<?php foreach ($per_page_options as $option) : ?>
						<option value="<?php echo esc_attr($option); ?>" <?php selected($per_page, $option); ?>>
							<?php echo esc_html($option); ?>
						</option>
					<?php endforeach; ?>
				</select>
			</span>
		</form>
	</div>

	<?php if ($search !== '') : ?>
		<p class="cns-settings-toolbar__count">
			<?php printf(
				/* translators: %1$s: number of maps, %2$s: search term */
				esc_html(_n(
					'%1$s map found for “%2$s”.',
					'%1$s maps found for “%2$s”.',
					$total_maps,
					'clouds-and-spaceships'
				)),
				esc_html(number_format_i18n($total_maps)),
				esc_html($search)
			); ?>
		</p>
	<?php endif; ?>

	<!-- Map list -->
	<table class="wp-list-table widefat fixed striped cns-settings-table">
		<thead>
			<tr>
				<th class="col-thumb"></th>
				<th><?php esc_html_e('Title', 'clouds-and-spaceships'); ?></th>
				<th><?php esc_html_e('Mode', 'clouds-and-spaceships'); ?></th>
				<th><?php esc_html_e('Status', 'clouds-and-spaceships'); ?></th>
				<th><?php esc_html_e('Date', 'clouds-and-spaceships'); ?></th>
				<th><?php esc_html_e('Actions', 'clouds-and-spaceships'); ?></th>
			</tr>
		</thead>
		<tbody>
			<?php if (! $maps) : ?>
				<tr>
					<td colspan="6" class="cns-settings-table__empty">
						<?php if ($search !== '') : ?>
							<?php esc_html_e('No maps match that name.', 'clouds-and-spaceships'); ?>
						<?php else : ?>
							<?php esc_html_e('No maps yet.', 'clouds-and-spaceships'); ?>
							<a href="<?php echo esc_url($editor_url); ?>">
								<?php esc_html_e('Create your first map', 'clouds-and-spaceships'); ?>
							</a>
						<?php endif; ?>
					</td>
				</tr>
			<?php endif; ?>
			<?php foreach ($maps as $map) :
				$is_master   = (bool) get_post_meta($map->ID, '_cns_map_is_master', true);
				$thumb_id    = (int) get_post_meta($map->ID, '_cns_map_image_id', true);
				$thumb_url   = $thumb_id ? wp_get_attachment_image_url($thumb_id, 'thumbnail') : '';

				$edit_url   = esc_url(cns_map_suite_editor_url($map->ID));
				$delete_url = esc_url(wp_nonce_url(
					add_query_arg(
						['page' => $return_page, 'action' => 'delete', 'map_id' => $map->ID],
						admin_url('admin.php')
					),
					'cns_delete_map_' . $map->ID
				));
			?>
				<tr>
					<td class="col-thumb">
						<a href="<?php echo esc_url($edit_url); ?>">
						<?php if ($thumb_url) : ?>
							<img src="<?php echo esc_url($thumb_url); ?>" alt="<?php echo esc_html($map->post_title ?: __('(no title)', 'clouds-and-spaceships')); ?>" />
						<?php else : ?>
							<div class="cns-thumb-placeholder"></div>
						<?php endif; ?>
						</a>
					</td>
					<td>
						<strong>
							<a href="<?php echo esc_url($edit_url); ?>">
								<?php echo esc_html($map->post_title ?: __('(no title)', 'clouds-and-spaceships')); ?>
							</a>
						</strong>
					</td>
					<td>
						<span class="cns-badge <?php echo $is_master ? 'cns-badge--master' : 'cns-badge--map'; ?>">
							<?php echo $is_master ? esc_html__('MasterMap', 'clouds-and-spaceships') : esc_html__('Map', 'clouds-and-spaceships'); ?>
						</span>
					</td>
					<td><?php
						$status_labels = ['publish' => __('Published', 'clouds-and-spaceships'), 'draft' => __('Draft', 'clouds-and-spaceships'), 'private' => __('Private', 'clouds-and-spaceships')];
						echo esc_html($status_labels[$map->post_status] ?? ucfirst($map->post_status));
					?></td>
					<td><?php echo esc_html(get_the_date('Y-m-d', $map)); ?></td>
					<td class="cns-row-actions">
						<a href="<?php echo esc_url($edit_url); ?>"><?php esc_html_e('Edit', 'clouds-and-spaceships'); ?></a>
						<?php if (in_array($map->post_status, ['publish', 'private'], true)) : ?>
							&nbsp;&middot;&nbsp;
							<a href="<?php echo esc_url(get_permalink($map->ID)); ?>" target="_blank" rel="noopener"><?php esc_html_e('View', 'clouds-and-spaceships'); ?></a>
						<?php endif; ?>
						&nbsp;&middot;&nbsp;
						<a
							href="<?php echo esc_url($delete_url); ?>"
							class="cns-delete-link"
							data-confirm="<?php esc_attr_e('Permanently delete this map?', 'clouds-and-spaceships'); ?>"
						><?php esc_html_e('Delete', 'clouds-and-spaceships'); ?></a>
					</td>
				</tr>
			<?php endforeach; ?>
		</tbody>
	</table>

	<?php if ($total_pages > 1) : ?>
		<div class="tablenav bottom">
			<div class="tablenav-pages">
				<?php echo wp_kses_post(paginate_links([
					'base'      => add_query_arg('paged', '%#%'),
					'format'    => '',
					'current'   => $paged,
					'total'     => $total_pages,
					'prev_text' => '&laquo;',
					'next_text' => '&raquo;',
				])); ?>
			</div>
		</div>
	<?php endif; ?>

	<!-- ── Plugin settings ──────────────────────────────────────────────────── -->
	<form method="post">
		<?php wp_nonce_field('cns_map_save_settings'); ?>
		<input type="hidden" name="cns_map_action" value="save_settings" />

		<!-- ── Maps ─────────────────────────────────────────────────── -->
		<div class="cns-settings-card">
			<h2><?php esc_html_e('Maps', 'clouds-and-spaceships'); ?></h2>
			<p class="description">
				<?php esc_html_e('Interactive canvas maps, managed from the CNS editor pages.', 'clouds-and-spaceships'); ?>
			</p>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row"><?php esc_html_e('Admin menu visibility', 'clouds-and-spaceships'); ?></th>
					<td>
						<label>
							<input type="checkbox" name="show_maps_menu" value="1" <?php checked($show_maps_menu); ?> />
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
		<div class="cns-settings-card">
			<h2><?php esc_html_e('Map controls', 'clouds-and-spaceships'); ?></h2>
			<p class="description">
				<?php esc_html_e('Set the colors of map control buttons. Uses theme colors by default. Can by overwritten on individual map level.', 'clouds-and-spaceships'); ?>
			</p>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row">
						<label for="cns_map_zoom_main"><?php esc_html_e('Main color', 'clouds-and-spaceships'); ?></label>
					</th>
					<td>
						<input
							type="color"
							id="cns_map_zoom_main"
							name="zoom_main_color"
							value="<?php echo esc_attr($zoom_main_color ?: '#2271b1'); ?>"
							<?php disabled('', $zoom_main_color); ?>
						/>
						<label style="margin-left:8px;">
							<input type="checkbox" class="cns-color-clear" data-color="cns_map_zoom_main"
								<?php checked('', $zoom_main_color); ?> />
							<?php esc_html_e('Use default', 'clouds-and-spaceships'); ?>
						</label>
						<p class="description">
							<?php esc_html_e('Button fill color.', 'clouds-and-spaceships'); ?>
						</p>
					</td>
				</tr>
				<tr>
					<th scope="row">
						<label for="cns_map_zoom_accent"><?php esc_html_e('Accent color', 'clouds-and-spaceships'); ?></label>
					</th>
					<td>
						<input
							type="color"
							id="cns_map_zoom_accent"
							name="zoom_accent_color"
							value="<?php echo esc_attr($zoom_accent_color ?: '#ffffff'); ?>"
							<?php disabled('', $zoom_accent_color); ?>
						/>
						<label style="margin-left:8px;">
							<input type="checkbox" class="cns-color-clear" data-color="cns_map_zoom_accent"
								<?php checked('', $zoom_accent_color); ?> />
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
		<div class="cns-danger-zone">
			<h2><?php esc_html_e('Danger Zone', 'clouds-and-spaceships'); ?></h2>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row"><?php esc_html_e('Uninstall behavior', 'clouds-and-spaceships'); ?></th>
					<td>
						<label class="text-danger">
							<input
								type="checkbox"
								name="delete_on_uninstall"
								value="1"
								<?php checked($delete_on_uninstall); ?>
							/>
							<?php esc_html_e('Delete all map posts and their data when the plugin is uninstalled', 'clouds-and-spaceships'); ?>
						</label>
						<p class="description">
							<?php esc_html_e('When unchecked (default), maps are kept after uninstall. Deactivating the plugin does not delete. Custom DB tables are always removed.', 'clouds-and-spaceships'); ?>
						</p>
					</td>
				</tr>
			</table>
		</div>

		<?php submit_button(__('Save Settings', 'clouds-and-spaceships'), 'secondary'); ?>
	</form>

</div>
