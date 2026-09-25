<?php
defined('ABSPATH') || exit;

/**
 * Direct database access notice.
 *
 * One prepared read against a plugin-owned custom table, for display on this
 * admin screen only. No WordPress API covers these tables, and an admin screen
 * must show current rows rather than a cached copy.
 */
// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching

// This screen only reads $_GET to decide what to display — which page, which
// filters, which page of results. Nothing here changes state, so there is no
// action to protect and no nonce to verify; WordPress's own list tables read
// their filters the same way. Every write path in this plugin verifies a nonce
// or goes through the REST API's permission callbacks.
// phpcs:disable WordPress.Security.NonceVerification.Recommended

$per_page_options   = [10, 20, 50, 100];
$requested_per_page = (int) sanitize_text_field(wp_unslash($_GET['per_page'] ?? 20));
$per_page           = in_array($requested_per_page, $per_page_options, true) ? $requested_per_page : 20;
$paged              = max(1, absint($_GET['paged'] ?? 1));
$in_trash           = (sanitize_key($_GET['status'] ?? '') === 'trash');
$search             = isset($_GET['s']) ? sanitize_text_field(wp_unslash($_GET['s'])) : '';
$total_stories      = cns_story_suite_count_stories($in_trash, $search);
// The All/Trash counts describe each bucket as a whole, so they ignore the
// search — same as the core list tables.
$trash_count        = cns_story_suite_count_stories(true);
$total_pages        = (int) ceil($total_stories / $per_page);

// A stale paged value — a bookmark, or a search that shrank the list — would
// otherwise render an empty table while matches sit on earlier pages.
if ($total_pages > 0 && $paged > $total_pages) {
	$paged = $total_pages;
}

$stories            = cns_story_suite_get_all_stories($per_page, ($paged - 1) * $per_page, $in_trash, $search);

$return_page = sanitize_key($_GET['page'] ?? CNS_STORY_PAGE_SETTINGS);
$editor_url  = add_query_arg(['page' => CNS_STORY_PAGE_EDITOR], admin_url('admin.php'));
$delete_on_uninstall  = (bool) get_option('cns_story_suite_delete_on_uninstall', false);
$show_stories_menu    = (bool) get_option('cns_story_suite_show_stories_menu', false);
$show_substories_menu = (bool) get_option('cns_story_suite_show_substories_menu', false);
$archive_enabled      = cns_archive_enabled('cns_story');
$archive_slug         = cns_archive_slug('cns_story');
$archive_per_page     = cns_archive_per_page('cns_story');
$archive_order        = cns_archive_order('cns_story');
$archive_order_opts   = cns_archive_order_options();
$archive_url          = $archive_enabled ? get_post_type_archive_link('cns_story') : '';
?>
<div class="cns-settings-page">

	<?php if (isset($_GET['trashed']) && $_GET['trashed'] === '1') : ?>
		<div class="notice notice-success is-dismissible">
			<p><?php esc_html_e('Story moved to trash.', 'clouds-and-spaceships'); ?></p>
		</div>
	<?php endif; ?>

	<?php if (isset($_GET['restored']) && $_GET['restored'] === '1') : ?>
		<div class="notice notice-success is-dismissible">
			<p><?php esc_html_e('Story restored from trash. Restored stories are set to Draft.', 'clouds-and-spaceships'); ?></p>
		</div>
	<?php endif; ?>

	<?php if (isset($_GET['deleted']) && $_GET['deleted'] === '1') : ?>
		<div class="notice notice-success is-dismissible">
			<p><?php esc_html_e('Story permanently deleted.', 'clouds-and-spaceships'); ?></p>
		</div>
	<?php endif; ?>

	<?php if (isset($_GET['settings-saved']) && $_GET['settings-saved'] === '1') : ?>
		<div class="notice notice-success is-dismissible">
			<p><?php esc_html_e('Settings saved.', 'clouds-and-spaceships'); ?></p>
		</div>
	<?php endif; ?>

	<div class="cns-settings-page__header">
		<h1><?php esc_html_e('Stories', 'clouds-and-spaceships'); ?></h1>
		<div class="cns-settings-page__actions">
			<a href="<?php echo esc_url($editor_url); ?>" class="button button-primary">
				<?php esc_html_e('+ New Story', 'clouds-and-spaceships'); ?>
			</a>
		</div>
	</div>

	<?php if ($trash_count > 0 || $in_trash) : ?>
		<ul class="subsubsub" style="margin: 0 0 4px;">
			<?php $status_args = $search !== '' ? ['s' => $search] : []; ?>
			<li>
				<a href="<?php echo esc_url(add_query_arg(
					$status_args + ['page' => $return_page],
					admin_url('admin.php')
				)); ?>"
					<?php if (! $in_trash) : ?>class="current"<?php endif; ?>>
					<?php esc_html_e('All', 'clouds-and-spaceships'); ?>
					<span class="count">(<?php echo (int) cns_story_suite_count_stories(); ?>)</span>
				</a> |
			</li>
			<li>
				<a href="<?php echo esc_url(add_query_arg(
					$status_args + ['page' => $return_page, 'status' => 'trash'],
					admin_url('admin.php')
				)); ?>"
					<?php if ($in_trash) : ?>class="current"<?php endif; ?>>
					<?php esc_html_e('Trash', 'clouds-and-spaceships'); ?>
					<span class="count">(<?php echo (int) $trash_count; ?>)</span>
				</a>
			</li>
		</ul>
	<?php endif; ?>

	<!--
		One form for both controls so each keeps the other's value. It carries no
		paged field on purpose: any change to the filter returns to page one,
		which is the only page guaranteed to exist in the new result set.
	-->
	<div class="cns-settings-toolbar">
		<form method="get">
			<?php if ($in_trash) : ?>
				<input type="hidden" name="status" value="trash" />
			<?php endif; ?>
			<input type="hidden" name="page" value="<?php echo esc_attr($return_page); ?>" />

			<span class="cns-settings-toolbar__group">
				<label class="screen-reader-text" for="cns-story-search">
					<?php esc_html_e('Search stories by name', 'clouds-and-spaceships'); ?>
				</label>
				<input
					type="search"
					id="cns-story-search"
					name="s"
					value="<?php echo esc_attr($search); ?>"
					placeholder="<?php esc_attr_e('Search stories by name…', 'clouds-and-spaceships'); ?>"
				/>
				<button type="submit" class="button"><?php esc_html_e('Search', 'clouds-and-spaceships'); ?></button>
				<?php if ($search !== '') : ?>
					<a class="cns-settings-toolbar__clear" href="<?php echo esc_url(add_query_arg(
						($in_trash ? ['status' => 'trash'] : []) + ['page' => $return_page, 'per_page' => $per_page],
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
				/* translators: %1$s: number of stories, %2$s: search term */
				esc_html(_n(
					'%1$s story matching “%2$s”.',
					'%1$s stories matching “%2$s”.',
					$total_stories,
					'clouds-and-spaceships'
				)),
				esc_html(number_format_i18n($total_stories)),
				esc_html($search)
			); ?>
		</p>
	<?php endif; ?>

	<table class="wp-list-table widefat fixed striped cns-settings-table">
		<thead>
			<tr>
				<th class="col-thumb"></th>
				<th><?php esc_html_e('Title', 'clouds-and-spaceships'); ?></th>
				<th><?php esc_html_e('Map', 'clouds-and-spaceships'); ?></th>
				<th><?php esc_html_e('Nodes', 'clouds-and-spaceships'); ?></th>
				<th><?php esc_html_e('Status', 'clouds-and-spaceships'); ?></th>
				<th><?php esc_html_e('Date', 'clouds-and-spaceships'); ?></th>
				<th><?php esc_html_e('Actions', 'clouds-and-spaceships'); ?></th>
			</tr>
		</thead>
		<tbody>
			<?php if (! $stories) : ?>
				<tr>
					<td colspan="7" class="cns-settings-table__empty">
						<?php if ($search !== '') : ?>
							<?php esc_html_e('No stories match that name.', 'clouds-and-spaceships'); ?>
						<?php else : ?>
							<?php esc_html_e('No stories found.', 'clouds-and-spaceships'); ?>
						<?php endif; ?>
					</td>
				</tr>
			<?php endif; ?>
			<?php foreach ($stories as $story) :
				global $wpdb;
				$map_id    = (int) get_post_meta($story->ID, '_cns_story_map_id', true);
				$map_title = $map_id ? get_the_title($map_id) : '—';
				$node_count = (int) $wpdb->get_var(
					$wpdb->prepare(
						"SELECT COUNT(*) FROM {$wpdb->prefix}cns_story_nodes WHERE story_id = %d",
						$story->ID
					)
				);
				$thumb_id  = (int) get_post_thumbnail_id($story->ID);
				$thumb_url = $thumb_id ? wp_get_attachment_image_url($thumb_id, 'thumbnail') : '';

				$edit_url   = esc_url(add_query_arg(
					['page' => CNS_STORY_PAGE_EDITOR, 'story_id' => $story->ID],
					admin_url('admin.php')
				));
				$action_url = static function (string $action) use ($return_page, $story): string {
					return esc_url(wp_nonce_url(
						add_query_arg(
							['page' => $return_page, 'action' => $action, 'story_id' => $story->ID],
							admin_url('admin.php')
						),
						'cns_' . $action . '_story_' . $story->ID
					));
				};
			?>
				<tr>
					<td class="col-thumb">
						<a href="<?php echo esc_url($edit_url); ?>">
							<?php if ($thumb_url) : ?>
								<img src="<?php echo esc_url($thumb_url); ?>" alt="<?php echo esc_attr($story->post_title ?: ''); ?>" />
							<?php else : ?>
								<div class="cns-thumb-placeholder"></div>
							<?php endif; ?>
						</a>
					</td>
					<td>
						<strong>
							<a href="<?php echo esc_url($edit_url); ?>">
								<?php echo esc_html($story->post_title ?: __('(no title)', 'clouds-and-spaceships')); ?>
							</a>
						</strong>
					</td>
					<td><?php echo esc_html($map_title); ?></td>
					<td><?php echo (int) $node_count; ?></td>
					<td><?php
						$labels = ['publish' => __('Published', 'clouds-and-spaceships'), 'draft' => __('Draft', 'clouds-and-spaceships'), 'private' => __('Private', 'clouds-and-spaceships'), 'trash' => __('Trash', 'clouds-and-spaceships')];
						echo esc_html($labels[$story->post_status] ?? ucfirst($story->post_status));
					?></td>
					<td><?php echo esc_html(get_the_date('Y-m-d', $story)); ?></td>
					<td class="cns-row-actions">
						<?php if ($in_trash) : ?>
							<a href="<?php echo esc_url($action_url('restore')); ?>"><?php esc_html_e('Restore', 'clouds-and-spaceships'); ?></a>
							&nbsp;&middot;&nbsp;
							<a
								href="<?php echo esc_url($action_url('delete-forever')); ?>"
								class="cns-delete-link"
								data-confirm="<?php esc_attr_e('Permanently delete this story and all its nodes, paths and edges? This cannot be undone.', 'clouds-and-spaceships'); ?>"
							><?php esc_html_e('Delete Permanently', 'clouds-and-spaceships'); ?></a>
						<?php else : ?>
							<a href="<?php echo esc_url($edit_url); ?>"><?php esc_html_e('Edit', 'clouds-and-spaceships'); ?></a>
							<?php if (in_array($story->post_status, ['publish', 'private'], true)) : ?>
								&nbsp;&middot;&nbsp;
								<a href="<?php echo esc_url(get_permalink($story->ID)); ?>" target="_blank" rel="noopener">
									<?php esc_html_e('View', 'clouds-and-spaceships'); ?>
								</a>
							<?php endif; ?>
							&nbsp;&middot;&nbsp;
							<a
								href="<?php echo esc_url($action_url('delete')); ?>"
								class="cns-delete-link"
								data-confirm="<?php esc_attr_e('Move this story to trash?', 'clouds-and-spaceships'); ?>"
							><?php esc_html_e('Trash', 'clouds-and-spaceships'); ?></a>
						<?php endif; ?>
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

	<div class="cns-danger-zone">
		<h2><?php esc_html_e('Plugin Settings', 'clouds-and-spaceships'); ?></h2>
		<form method="post">
			<?php wp_nonce_field('cns_story_save_settings'); ?>
			<input type="hidden" name="cns_story_action" value="save_settings" />
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row">
						<?php esc_html_e('Story archive', 'clouds-and-spaceships'); ?>
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
							<?php esc_html_e('Enable the public story archive', 'clouds-and-spaceships'); ?>
						</label>
						<p class="description">
							<?php esc_html_e('Publishes a listing of all stories at the slug below. Off by default. Substories have no archive of their own.', 'clouds-and-spaceships'); ?>
						</p>
					</td>
				</tr>
				<tr>
					<th scope="row">
						<label for="cns_story_archive_slug"><?php esc_html_e('URL slug', 'clouds-and-spaceships'); ?></label>
					</th>
					<td>
						<input
							type="text"
							id="cns_story_archive_slug"
							name="archive_slug"
							value="<?php echo esc_attr($archive_slug); ?>"
							class="regular-text"
							pattern="[a-z0-9\-]+"
							placeholder="<?php echo esc_attr('stories'); ?>"
						/>
						<p class="description">
							<?php esc_html_e('Lowercase letters, numbers, and hyphens only. Changes the archive URL and every single story URL — existing links will break.', 'clouds-and-spaceships'); ?>
						</p>
					</td>
				</tr>
				<tr>
					<th scope="row">
						<label for="cns_story_archive_per_page"><?php esc_html_e('Stories per page', 'clouds-and-spaceships'); ?></label>
					</th>
					<td>
						<input
							type="number"
							id="cns_story_archive_per_page"
							name="archive_per_page"
							value="<?php echo esc_attr($archive_per_page); ?>"
							min="1" step="1"
							class="small-text"
						/>
						<p class="description">
							<?php esc_html_e('Overrides the global Reading Settings value for the story archive only.', 'clouds-and-spaceships'); ?>
						</p>
					</td>
				</tr>
				<tr>
					<th scope="row">
						<label for="cns_story_archive_order"><?php esc_html_e('Default sort order', 'clouds-and-spaceships'); ?></label>
					</th>
					<td>
						<select id="cns_story_archive_order" name="archive_order">
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
							<input type="checkbox" name="show_stories_menu" value="1" <?php checked($show_stories_menu); ?> />
							<?php esc_html_e('Show Stories in the WordPress admin sidebar', 'clouds-and-spaceships'); ?>
						</label>
						<br />
						<label>
							<input type="checkbox" name="show_substories_menu" value="1" <?php checked($show_substories_menu); ?> />
							<?php esc_html_e('Show Substories in the WordPress admin sidebar', 'clouds-and-spaceships'); ?>
						</label>
						<p class="description">
							<?php esc_html_e('Adds the standard WordPress list screens for stories and substories to the sidebar. The CNS editor pages here stay the primary management UI.', 'clouds-and-spaceships'); ?>
						</p>
					</td>
				</tr>
				<tr>
					<th scope="row"><?php esc_html_e('Uninstall behaviour', 'clouds-and-spaceships'); ?></th>
					<td>
						<label>
							<input type="checkbox" name="delete_on_uninstall" value="1" <?php checked($delete_on_uninstall); ?> />
							<?php esc_html_e('Delete all story and substory posts when this plugin is uninstalled', 'clouds-and-spaceships'); ?>
						</label>
						<p class="description">
							<?php esc_html_e('When unchecked (default), posts are kept after uninstall. Custom DB tables are always removed.', 'clouds-and-spaceships'); ?>
						</p>
					</td>
				</tr>
			</table>
			<?php submit_button(__('Save Settings', 'clouds-and-spaceships'), 'secondary'); ?>
		</form>
	</div>

</div>
