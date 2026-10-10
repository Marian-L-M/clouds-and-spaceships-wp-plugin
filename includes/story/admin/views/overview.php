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

$clouansp_per_page_options   = [10, 20, 50, 100];
$clouansp_requested_per_page = (int) sanitize_text_field(wp_unslash($_GET['per_page'] ?? 20));
$clouansp_per_page           = in_array($clouansp_requested_per_page, $clouansp_per_page_options, true) ? $clouansp_requested_per_page : 20;
$clouansp_paged              = max(1, absint($_GET['paged'] ?? 1));
$clouansp_in_trash           = (sanitize_key($_GET['status'] ?? '') === 'trash');
$clouansp_search             = isset($_GET['s']) ? sanitize_text_field(wp_unslash($_GET['s'])) : '';
$clouansp_total_stories      = clouansp_story_suite_count_stories($clouansp_in_trash, $clouansp_search);
// The All/Trash counts describe each bucket as a whole, so they ignore the
// search — same as the core list tables.
$clouansp_trash_count        = clouansp_story_suite_count_stories(true);
$clouansp_total_pages        = (int) ceil($clouansp_total_stories / $clouansp_per_page);

// A stale paged value — a bookmark, or a search that shrank the list — would
// otherwise render an empty table while matches sit on earlier pages.
if ($clouansp_total_pages > 0 && $clouansp_paged > $clouansp_total_pages) {
	$clouansp_paged = $clouansp_total_pages;
}

$clouansp_stories            = clouansp_story_suite_get_all_stories($clouansp_per_page, ($clouansp_paged - 1) * $clouansp_per_page, $clouansp_in_trash, $clouansp_search);

$clouansp_return_page = sanitize_key($_GET['page'] ?? CLOUANSP_STORY_PAGE_SETTINGS);
$clouansp_editor_url  = add_query_arg(['page' => CLOUANSP_STORY_PAGE_EDITOR], admin_url('admin.php'));
$clouansp_delete_substories    = (bool) get_option('clouansp_story_suite_delete_substories_on_uninstall', false);
$clouansp_show_stories_menu    = (bool) get_option('clouansp_story_suite_show_stories_menu', false);
$clouansp_show_substories_menu = (bool) get_option('clouansp_story_suite_show_substories_menu', false);
$clouansp_archive_enabled      = clouansp_archive_enabled('clouansp_story');
$clouansp_archive_slug         = clouansp_archive_slug('clouansp_story');
$clouansp_archive_url          = $clouansp_archive_enabled ? get_post_type_archive_link('clouansp_story') : '';
$clouansp_placeholder_id       = absint(get_option('clouansp_story_suite_placeholder_thumb_id', 0));
$clouansp_placeholder_url      = $clouansp_placeholder_id ? wp_get_attachment_image_url($clouansp_placeholder_id, 'medium') : '';
?>
<div class="clouansp-settings-page">

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

	<div class="clouansp-settings-page__header">
		<h1><?php esc_html_e('Stories', 'clouds-and-spaceships'); ?></h1>
		<div class="clouansp-settings-page__actions">
			<a href="<?php echo esc_url($clouansp_editor_url); ?>" class="button button-primary">
				<?php esc_html_e('+ New Story', 'clouds-and-spaceships'); ?>
			</a>
		</div>
	</div>

	<?php if ($clouansp_trash_count > 0 || $clouansp_in_trash) : ?>
		<ul class="subsubsub" style="margin: 0 0 4px;">
			<?php $clouansp_status_args = $clouansp_search !== '' ? ['s' => $clouansp_search] : []; ?>
			<li>
				<a href="<?php echo esc_url(add_query_arg(
					$clouansp_status_args + ['page' => $clouansp_return_page],
					admin_url('admin.php')
				)); ?>"
					<?php if (! $clouansp_in_trash) : ?>class="current"<?php endif; ?>>
					<?php esc_html_e('All', 'clouds-and-spaceships'); ?>
					<span class="count">(<?php echo (int) clouansp_story_suite_count_stories(); ?>)</span>
				</a> |
			</li>
			<li>
				<a href="<?php echo esc_url(add_query_arg(
					$clouansp_status_args + ['page' => $clouansp_return_page, 'status' => 'trash'],
					admin_url('admin.php')
				)); ?>"
					<?php if ($clouansp_in_trash) : ?>class="current"<?php endif; ?>>
					<?php esc_html_e('Trash', 'clouds-and-spaceships'); ?>
					<span class="count">(<?php echo (int) $clouansp_trash_count; ?>)</span>
				</a>
			</li>
		</ul>
	<?php endif; ?>

	<!--
		One form for both controls so each keeps the other's value. It carries no
		paged field on purpose: any change to the filter returns to page one,
		which is the only page guaranteed to exist in the new result set.
	-->
	<div class="clouansp-settings-toolbar">
		<form method="get">
			<?php if ($clouansp_in_trash) : ?>
				<input type="hidden" name="status" value="trash" />
			<?php endif; ?>
			<input type="hidden" name="page" value="<?php echo esc_attr($clouansp_return_page); ?>" />

			<span class="clouansp-settings-toolbar__group">
				<label class="screen-reader-text" for="clouansp-story-search">
					<?php esc_html_e('Search stories', 'clouds-and-spaceships'); ?>
				</label>
				<input
					type="search"
					id="clouansp-story-search"
					name="s"
					value="<?php echo esc_attr($clouansp_search); ?>"
					placeholder="<?php esc_attr_e('Search stories', 'clouds-and-spaceships'); ?>"
				/>
				<button type="submit" class="button"><?php esc_html_e('Search', 'clouds-and-spaceships'); ?></button>
				<?php if ($clouansp_search !== '') : ?>
					<a class="clouansp-settings-toolbar__clear" href="<?php echo esc_url(add_query_arg(
						($clouansp_in_trash ? ['status' => 'trash'] : []) + ['page' => $clouansp_return_page, 'per_page' => $clouansp_per_page],
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
				/* translators: %1$s: number of stories, %2$s: search term */
				esc_html(_n(
					'%1$s story matching “%2$s”.',
					'%1$s stories matching “%2$s”.',
					$clouansp_total_stories,
					'clouds-and-spaceships'
				)),
				esc_html(number_format_i18n($clouansp_total_stories)),
				esc_html($clouansp_search)
			); ?>
		</p>
	<?php endif; ?>

	<table class="wp-list-table widefat fixed striped clouansp-settings-table">
		<thead>
			<tr>
				<th class="clouansp-settings-table__thumb"></th>
				<th><?php esc_html_e('Title', 'clouds-and-spaceships'); ?></th>
				<th><?php esc_html_e('Map', 'clouds-and-spaceships'); ?></th>
				<th><?php esc_html_e('Nodes', 'clouds-and-spaceships'); ?></th>
				<th><?php esc_html_e('Status', 'clouds-and-spaceships'); ?></th>
				<th><?php esc_html_e('Date', 'clouds-and-spaceships'); ?></th>
				<th><?php esc_html_e('Actions', 'clouds-and-spaceships'); ?></th>
			</tr>
		</thead>
		<tbody>
			<?php if (! $clouansp_stories) : ?>
				<tr>
					<td colspan="7" class="clouansp-settings-table__empty">
						<?php if ($clouansp_search !== '') : ?>
							<?php esc_html_e('No stories match that name.', 'clouds-and-spaceships'); ?>
						<?php else : ?>
							<?php esc_html_e('No stories found.', 'clouds-and-spaceships'); ?>
						<?php endif; ?>
					</td>
				</tr>
			<?php endif; ?>
			<?php foreach ($clouansp_stories as $clouansp_story) :
				global $wpdb;
				$clouansp_map_id    = (int) get_post_meta($clouansp_story->ID, '_clouansp_story_map_id', true);
				$clouansp_map_title = $clouansp_map_id ? get_the_title($clouansp_map_id) : '—';
				$clouansp_node_count = (int) $wpdb->get_var(
					$wpdb->prepare(
						"SELECT COUNT(*) FROM {$wpdb->prefix}clouansp_story_nodes WHERE story_id = %d",
						$clouansp_story->ID
					)
				);
				$clouansp_thumb_id  = (int) get_post_thumbnail_id($clouansp_story->ID);
				$clouansp_thumb_url = $clouansp_thumb_id ? wp_get_attachment_image_url($clouansp_thumb_id, 'thumbnail') : '';

				$clouansp_edit_url   = esc_url(add_query_arg(
					['page' => CLOUANSP_STORY_PAGE_EDITOR, 'story_id' => $clouansp_story->ID],
					admin_url('admin.php')
				));
				$clouansp_action_url = static function (string $action) use ($clouansp_return_page, $clouansp_story): string {
					return esc_url(wp_nonce_url(
						add_query_arg(
							['page' => $clouansp_return_page, 'action' => $action, 'story_id' => $clouansp_story->ID],
							admin_url('admin.php')
						),
						'clouansp_' . $action . '_story_' . $clouansp_story->ID
					));
				};
			?>
				<tr>
					<td class="clouansp-settings-table__thumb">
						<a href="<?php echo esc_url($clouansp_edit_url); ?>">
							<?php if ($clouansp_thumb_url) : ?>
								<img src="<?php echo esc_url($clouansp_thumb_url); ?>" alt="<?php echo esc_attr($clouansp_story->post_title ?: ''); ?>" />
							<?php else : ?>
								<div class="clouansp-thumb-placeholder"></div>
							<?php endif; ?>
						</a>
					</td>
					<td>
						<strong>
							<a href="<?php echo esc_url($clouansp_edit_url); ?>">
								<?php echo esc_html($clouansp_story->post_title ?: __('(no title)', 'clouds-and-spaceships')); ?>
							</a>
						</strong>
					</td>
					<td><?php echo esc_html($clouansp_map_title); ?></td>
					<td><?php echo (int) $clouansp_node_count; ?></td>
					<td><?php
						$clouansp_labels = ['publish' => __('Published', 'clouds-and-spaceships'), 'draft' => __('Draft', 'clouds-and-spaceships'), 'private' => __('Private', 'clouds-and-spaceships'), 'trash' => __('Trash', 'clouds-and-spaceships')];
						echo esc_html($clouansp_labels[$clouansp_story->post_status] ?? ucfirst($clouansp_story->post_status));
					?></td>
					<td><?php echo esc_html(get_the_date('Y-m-d', $clouansp_story)); ?></td>
					<td class="clouansp-row-actions">
						<?php if ($clouansp_in_trash) : ?>
							<a href="<?php echo esc_url($clouansp_action_url('restore')); ?>"><?php esc_html_e('Restore', 'clouds-and-spaceships'); ?></a>
							&nbsp;&middot;&nbsp;
							<a
								href="<?php echo esc_url($clouansp_action_url('delete-forever')); ?>"
								class="clouansp-delete-link"
								data-confirm="<?php esc_attr_e('Permanently delete this story and all its nodes, paths and edges? This cannot be undone.', 'clouds-and-spaceships'); ?>"
							><?php esc_html_e('Delete Permanently', 'clouds-and-spaceships'); ?></a>
						<?php else : ?>
							<a href="<?php echo esc_url($clouansp_edit_url); ?>"><?php esc_html_e('Edit', 'clouds-and-spaceships'); ?></a>
							<?php if (in_array($clouansp_story->post_status, ['publish', 'private'], true)) : ?>
								&nbsp;&middot;&nbsp;
								<a href="<?php echo esc_url(get_permalink($clouansp_story->ID)); ?>" target="_blank" rel="noopener">
									<?php esc_html_e('View', 'clouds-and-spaceships'); ?>
								</a>
							<?php endif; ?>
							&nbsp;&middot;&nbsp;
							<a
								href="<?php echo esc_url($clouansp_action_url('delete')); ?>"
								class="clouansp-delete-link"
								data-confirm="<?php esc_attr_e('Move this story to trash?', 'clouds-and-spaceships'); ?>"
							><?php esc_html_e('Trash', 'clouds-and-spaceships'); ?></a>
						<?php endif; ?>
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
		<?php wp_nonce_field('clouansp_story_save_settings'); ?>
		<input type="hidden" name="clouansp_story_action" value="save_settings" />

		<!-- ── Story ────────────────────────────────────────────────── -->
		<div class="clouansp-settings-card">
			<h2><?php esc_html_e('Story', 'clouds-and-spaceships'); ?></h2>
			<p class="description">
				<?php esc_html_e('Stories are collections of story paths laid over a map, edited in the CNS story editor. Each node in a story path can show a substory, which is an independent post/article.', 'clouds-and-spaceships'); ?>
			</p>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row"><?php esc_html_e('Admin menu visibility', 'clouds-and-spaceships'); ?></th>
					<td>
						<label>
							<input type="checkbox" name="show_stories_menu" value="1" <?php checked($clouansp_show_stories_menu); ?> />
							<?php esc_html_e('Show Stories in the WordPress admin sidebar', 'clouds-and-spaceships'); ?>
						</label>
						<br />
						<label>
							<input type="checkbox" name="show_substories_menu" value="1" <?php checked($clouansp_show_substories_menu); ?> />
							<?php esc_html_e('Show Substories in the WordPress admin sidebar', 'clouds-and-spaceships'); ?>
						</label>
						<p class="description">
							<?php esc_html_e('Adds the standard WordPress list screens for stories and substories to the sidebar. The CNS story editor tab here stay the primary management interface.', 'clouds-and-spaceships'); ?>
						</p>
					</td>
				</tr>
			</table>
		</div>

		<!-- ── Archive ──────────────────────────────────────────────── -->
		<div class="clouansp-settings-card">
			<h2><?php esc_html_e('Archive', 'clouds-and-spaceships'); ?></h2>
			<p class="description">
				<?php esc_html_e('Public list for all stories.', 'clouds-and-spaceships'); ?>
			</p>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row">
						<label for="clouansp_story_archive_slug"><?php esc_html_e('URL slug', 'clouds-and-spaceships'); ?></label>
						<?php if ($clouansp_archive_url) : ?>
							<a href="<?php echo esc_url($clouansp_archive_url); ?>" target="_blank" rel="noopener" class="clouansp-settings-link">
								<?php esc_html_e('View archive ↗', 'clouds-and-spaceships'); ?>
							</a>
						<?php endif; ?>
					</th>
					<td>
						<input
							type="text"
							id="clouansp_story_archive_slug"
							name="archive_slug"
							value="<?php echo esc_attr($clouansp_archive_slug); ?>"
							class="regular-text"
							pattern="[a-z0-9\-]+"
							placeholder="stories"
						/>
						<p class="description">
							<?php esc_html_e('Lowercase letters, numbers, and hyphens only. Changes the archive URL and every single story URL.', 'clouds-and-spaceships'); ?>
						</p>
						<p class="clouansp-text-danger">
							<?php esc_html_e('CAUTION! On change existing links will break.', 'clouds-and-spaceships'); ?>
						</p>
					</td>
				</tr>
				<tr>
					<th scope="row"><?php esc_html_e('Enable archive', 'clouds-and-spaceships'); ?></th>
					<td>
						<label>
							<input type="checkbox" name="archive_enabled" value="1" <?php checked($clouansp_archive_enabled); ?> />
							<?php esc_html_e('Publish a public listing of all stories', 'clouds-and-spaceships'); ?>
						</label>
						<p class="description">
							<?php esc_html_e('Off by default. Will enable a post type archive for stories.', 'clouds-and-spaceships'); ?>
						</p>
					</td>
				</tr>
				<tr>
					<th scope="row">
						<label><?php esc_html_e('Default thumbnail', 'clouds-and-spaceships'); ?></label>
					</th>
					<td>
						<input
							type="hidden"
							id="clouansp_story_placeholder_id"
							name="placeholder_thumb_id"
							value="<?php echo esc_attr($clouansp_placeholder_id ?: ''); ?>"
						/>
						<img
							id="clouansp_story_placeholder_preview"
							src="<?php echo $clouansp_placeholder_url ? esc_url($clouansp_placeholder_url) : ''; ?>"
							style="max-height:80px;display:<?php echo $clouansp_placeholder_url ? 'block' : 'none'; ?>;margin-bottom:8px;"
							alt=""
						/>
						<button
							type="button"
							id="clouansp_story_placeholder_btn"
							class="button clouansp-media-btn"
							data-input="clouansp_story_placeholder_id"
							data-preview="clouansp_story_placeholder_preview"
							data-remove="clouansp_story_placeholder_remove"
							data-title="<?php esc_attr_e('Select default story thumbnail', 'clouds-and-spaceships'); ?>"
							data-select-label="<?php esc_attr_e('Select image', 'clouds-and-spaceships'); ?>"
							data-change-label="<?php esc_attr_e('Change image', 'clouds-and-spaceships'); ?>"
						><?php echo $clouansp_placeholder_id ? esc_html__('Change image', 'clouds-and-spaceships') : esc_html__('Select image', 'clouds-and-spaceships'); ?></button>
						<button
							type="button"
							id="clouansp_story_placeholder_remove"
							class="button clouansp-media-remove-btn"
							data-input="clouansp_story_placeholder_id"
							data-preview="clouansp_story_placeholder_preview"
							data-picker="clouansp_story_placeholder_btn"
							style="display:<?php echo $clouansp_placeholder_id ? 'inline-block' : 'none'; ?>;"
						><?php esc_html_e('Remove', 'clouds-and-spaceships'); ?></button>
						<p class="description">
							<?php esc_html_e('Stands in for stories that have no featured image of their own. Leave empty to show no image.', 'clouds-and-spaceships'); ?>
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
					<th scope="row"><?php esc_html_e('Uninstall behaviour', 'clouds-and-spaceships'); ?></th>
					<td>
						<p class="clouansp-text-danger">
							<?php esc_html_e('Deleting this plugin deletes every story, permanently.', 'clouds-and-spaceships'); ?>
						</p>
						<p class="description">
							<?php esc_html_e('This plugin uses custom database tables to store story nodes, which are always removed on uninstall. Therefore stories cannot be preserved on uninstall. Simple plugin deactivation will however not delete stories.', 'clouds-and-spaceships'); ?>
						</p>
						<label class="clouansp-text-danger">
							<input type="checkbox" name="delete_substories_on_uninstall" value="1" <?php checked($clouansp_delete_substories); ?> />
							<?php esc_html_e('Delete substory articles as well', 'clouds-and-spaceships'); ?>
						</label>
						<p class="description">
							<?php esc_html_e('Substories are articles/posts in their own right, and are kept when the plugin is deleted unless you check this box. They have no archive page of their own, so to list them elsewhere you will need to migrate them or set up an archive yourself. Check to delete all substories when the plugin is uninstalled.', 'clouds-and-spaceships'); ?>
						</p>
					</td>
				</tr>
			</table>
		</div>

		<?php submit_button(__('Save Settings', 'clouds-and-spaceships'), 'secondary'); ?>
	</form>

</div>
