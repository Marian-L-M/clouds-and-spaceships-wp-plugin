<?php
defined('ABSPATH') || exit;

$per_page_options = [10, 20, 50, 100];
$requested_per_page = (int) ($_GET['per_page'] ?? 20);
$per_page           = in_array($requested_per_page, $per_page_options, true) ? $requested_per_page : 20;
$paged            = max(1, absint($_GET['paged'] ?? 1));
$total_maps  = cns_map_suite_count_maps();
$total_pages = (int) ceil($total_maps / $per_page);
$maps        = cns_map_suite_get_all_maps($per_page, ($paged - 1) * $per_page);

$return_page         = sanitize_key($_GET['page'] ?? CNS_MAP_PAGE_SETTINGS_MAPS);
$editor_url          = add_query_arg(['page' => CNS_MAP_PAGE_EDITOR], admin_url('admin.php'));
$delete_on_uninstall = (bool) get_option('cns_map_suite_delete_on_uninstall', false);
$show_maps_menu      = (bool) get_option('cns_map_suite_show_maps_menu', false);
$archive_enabled     = cns_archive_enabled('maps');
$archive_slug        = cns_archive_slug('maps');
$archive_per_page    = cns_archive_per_page('maps');
$archive_order       = cns_archive_order('maps');
$archive_order_opts  = cns_archive_order_options();
$archive_url         = $archive_enabled ? get_post_type_archive_link('maps') : '';
?>
<div class="cns-maps-overview">
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
	<div class="cns-maps-overview__header">
		<h1><?php esc_html_e('Maps', 'clouds-and-spaceships'); ?></h1>
		<a href="<?php echo esc_url($editor_url); ?>" class="button button-primary">
			<?php esc_html_e('+ New Map', 'clouds-and-spaceships'); ?>
		</a>
	</div>

	<div class="cns-maps-overview__page-count">
		<form method="get">
			<input type="hidden" name="page" value="<?php echo esc_attr($return_page); ?>" />
			<label for="cns-per-page"><?php esc_html_e('Items per page:', 'clouds-and-spaceships'); ?></label>
			<select name="per_page" id="cns-per-page" onchange="this.form.submit()">
				<?php foreach ($per_page_options as $option) : ?>
					<option value="<?php echo $option; ?>" <?php selected($per_page, $option); ?>>
						<?php echo $option; ?>
					</option>
				<?php endforeach; ?>
			</select>
		</form>
	</div>

	<!-- Map list -->
	<table class="wp-list-table widefat fixed striped cns-maps-table">
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
			<?php foreach ($maps as $map) :
				$is_master   = (bool) get_post_meta($map->ID, '_cns_map_is_master', true);
				$is_featured = (bool) get_post_meta($map->ID, '_cns_map_featured', true);
				$thumb_id    = (int) get_post_meta($map->ID, '_cns_map_image_id', true);
				$thumb_url   = $thumb_id ? wp_get_attachment_image_url($thumb_id, 'thumbnail') : '';

				$edit_url   = esc_url(add_query_arg(
					['page' => CNS_MAP_PAGE_EDITOR, 'map_id' => $map->ID],
					admin_url('admin.php')
				));
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
						<a href="<?php echo $edit_url; ?>">
						<?php if ($thumb_url) : ?>
							<img src="<?php echo esc_url($thumb_url); ?>" alt="<?php echo esc_html($map->post_title ?: __('(no title)', 'clouds-and-spaceships')); ?>" />
						<?php else : ?>
							<div class="cns-thumb-placeholder"></div>
						<?php endif; ?>
						</a>
					</td>
					<td>
						<strong>
							<a href="<?php echo $edit_url; ?>">
								<?php echo esc_html($map->post_title ?: __('(no title)', 'clouds-and-spaceships')); ?>
							</a>
						</strong>
						<?php if ($is_featured) : ?>
							<span class="cns-badge cns-badge--featured"><?php esc_html_e('Featured', 'clouds-and-spaceships'); ?></span>
						<?php endif; ?>
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
					<td class="cns-maps-actions">
						<a href="<?php echo $edit_url; ?>"><?php esc_html_e('Edit', 'clouds-and-spaceships'); ?></a>
						<?php if (in_array($map->post_status, ['publish', 'private'], true)) : ?>
							&nbsp;&middot;&nbsp;
							<a href="<?php echo esc_url(get_permalink($map->ID)); ?>" target="_blank" rel="noopener"><?php esc_html_e('View', 'clouds-and-spaceships'); ?></a>
						<?php endif; ?>
						&nbsp;&middot;&nbsp;
						<a
							href="<?php echo $delete_url; ?>"
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
				<?php echo paginate_links([
					'base'      => add_query_arg('paged', '%#%'),
					'format'    => '',
					'current'   => $paged,
					'total'     => $total_pages,
					'prev_text' => '&laquo;',
					'next_text' => '&raquo;',
				]); ?>
			</div>
		</div>
	<?php endif; ?>

	<!-- ── Danger Zone ──────────────────────────────────────────────────────── -->
	<div class="cns-danger-zone">
		<h2><?php esc_html_e('Plugin Settings', 'clouds-and-spaceships'); ?></h2>
		<form method="post">
			<?php wp_nonce_field('cns_map_save_settings'); ?>
			<input type="hidden" name="cns_map_action" value="save_settings" />

			<table class="form-table" role="presentation">
				<tr>
					<th scope="row">
						<?php esc_html_e('Map archive', 'clouds-and-spaceships'); ?>
						<?php if ($archive_url) : ?>
							<a href="<?php echo esc_url($archive_url); ?>" target="_blank"
							   style="display:block;font-size:12px;font-weight:normal;">
								<?php esc_html_e('View archive ↗', 'clouds-and-spaceships'); ?>
							</a>
						<?php endif; ?>
					</th>
					<td>
						<label>
							<input type="checkbox" name="archive_enabled" value="1" <?php checked($archive_enabled); ?> />
							<?php esc_html_e('Enable the public map archive', 'clouds-and-spaceships'); ?>
						</label>
						<p class="description">
							<?php esc_html_e('Publishes a listing of all maps at the slug below, and lets maps appear in search and nav menus. Off by default.', 'clouds-and-spaceships'); ?>
						</p>
					</td>
				</tr>
				<tr>
					<th scope="row">
						<label for="cns_map_archive_slug"><?php esc_html_e('URL slug', 'clouds-and-spaceships'); ?></label>
					</th>
					<td>
						<input
							type="text"
							id="cns_map_archive_slug"
							name="archive_slug"
							value="<?php echo esc_attr($archive_slug); ?>"
							class="regular-text"
							pattern="[a-z0-9\-]+"
							placeholder="<?php echo esc_attr('maps'); ?>"
						/>
						<p class="description">
							<?php esc_html_e('Lowercase letters, numbers, and hyphens only. Changes the archive URL and every single map URL — existing links will break.', 'clouds-and-spaceships'); ?>
						</p>
					</td>
				</tr>
				<tr>
					<th scope="row">
						<label for="cns_map_archive_per_page"><?php esc_html_e('Maps per page', 'clouds-and-spaceships'); ?></label>
					</th>
					<td>
						<input
							type="number"
							id="cns_map_archive_per_page"
							name="archive_per_page"
							value="<?php echo esc_attr($archive_per_page); ?>"
							min="1" step="1"
							class="small-text"
						/>
						<p class="description">
							<?php esc_html_e('Overrides the global Reading Settings value for the map archive only.', 'clouds-and-spaceships'); ?>
						</p>
					</td>
				</tr>
				<tr>
					<th scope="row">
						<label for="cns_map_archive_order"><?php esc_html_e('Default sort order', 'clouds-and-spaceships'); ?></label>
					</th>
					<td>
						<select id="cns_map_archive_order" name="archive_order">
							<?php foreach ($archive_order_opts as $value => $label) : ?>
								<option value="<?php echo esc_attr($value); ?>" <?php selected($archive_order, $value); ?>>
									<?php echo esc_html($label); ?>
								</option>
							<?php endforeach; ?>
						</select>
					</td>
				</tr>
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
				<tr>
					<th scope="row"><?php esc_html_e('Uninstall behaviour', 'clouds-and-spaceships'); ?></th>
					<td>
						<label>
							<input
								type="checkbox"
								name="delete_on_uninstall"
								value="1"
								<?php checked($delete_on_uninstall); ?>
							/>
							<?php esc_html_e('Delete all map posts and their data when this plugin is uninstalled', 'clouds-and-spaceships'); ?>
						</label>
						<p class="description">
							<?php esc_html_e('When unchecked (default), maps are kept after uninstall. Custom DB tables are always removed.', 'clouds-and-spaceships'); ?>
						</p>
					</td>
				</tr>
			</table>

			<?php submit_button(__('Save Settings', 'clouds-and-spaceships'), 'secondary'); ?>
		</form>
	</div>

</div>
