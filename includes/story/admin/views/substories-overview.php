<?php
defined('ABSPATH') || exit;

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
$clouansp_search             = isset($_GET['s']) ? sanitize_text_field(wp_unslash($_GET['s'])) : '';

// One query for both the rows and the total: wp_count_posts() cannot see the
// search. Matching the title only keeps the list honest — it shows no body
// text, so a content hit would look like a result with no visible reason.
$clouansp_query_args = [
	'post_type'      => 'clouansp_substory',
	'posts_per_page' => $clouansp_per_page,
	'offset'         => ($clouansp_paged - 1) * $clouansp_per_page,
	'post_status'    => ['publish', 'draft', 'private'],
	'orderby'        => 'date',
	'order'          => 'DESC',
];

if ($clouansp_search !== '') {
	$clouansp_query_args['s']              = $clouansp_search;
	$clouansp_query_args['search_columns'] = ['post_title'];
}

$clouansp_query       = new WP_Query($clouansp_query_args);
$clouansp_substories  = $clouansp_query->posts;
$clouansp_total       = (int) $clouansp_query->found_posts;
$clouansp_total_pages = (int) ceil($clouansp_total / $clouansp_per_page);

// A stale paged value — a bookmark, or a search that shrank the list — would
// otherwise render an empty table while matches sit on earlier pages. Only the
// out-of-range case pays for the second query.
if (! $clouansp_substories && $clouansp_total > 0 && $clouansp_paged > 1) {
	$clouansp_paged                = min($clouansp_paged, $clouansp_total_pages);
	$clouansp_query_args['offset'] = ($clouansp_paged - 1) * $clouansp_per_page;
	$clouansp_query                = new WP_Query($clouansp_query_args);
	$clouansp_substories           = $clouansp_query->posts;
}

$clouansp_return_page = sanitize_key($_GET['page'] ?? CLOUANSP_STORY_PAGE_SETTINGS_SUBSTORIES);
$clouansp_new_url     = admin_url('post-new.php?post_type=clouansp_substory');
?>
<div class="clouansp-settings-page">

	<?php if (isset($_GET['trashed'])) : ?>
		<div class="notice notice-success is-dismissible">
			<p><?php esc_html_e('Substory moved to trash.', 'clouds-and-spaceships'); ?></p>
		</div>
	<?php endif; ?>

	<div class="clouansp-settings-page__header">
		<h1><?php esc_html_e('Substories', 'clouds-and-spaceships'); ?></h1>
		<div class="clouansp-settings-page__actions">
			<a href="<?php echo esc_url($clouansp_new_url); ?>" class="button button-primary">
				<?php esc_html_e('+ New Substory', 'clouds-and-spaceships'); ?>
			</a>
			<a href="<?php echo esc_url(admin_url('edit.php?post_type=clouansp_substory')); ?>" class="button">
				<?php esc_html_e('Full overview', 'clouds-and-spaceships'); ?>
			</a>
		</div>
	</div>

	<!--
		One form for both controls so each keeps the other's value. It carries no
		paged field on purpose: any change to the filter returns to page one,
		which is the only page guaranteed to exist in the new result set.
	-->
	<div class="clouansp-settings-toolbar">
		<form method="get">
			<input type="hidden" name="page" value="<?php echo esc_attr($clouansp_return_page); ?>" />

			<span class="clouansp-settings-toolbar__group">
				<label class="screen-reader-text" for="clouansp-sub-search">
					<?php esc_html_e('Search substories by name', 'clouds-and-spaceships'); ?>
				</label>
				<input
					type="search"
					id="clouansp-sub-search"
					name="s"
					value="<?php echo esc_attr($clouansp_search); ?>"
					placeholder="<?php esc_attr_e('Search substories by name…', 'clouds-and-spaceships'); ?>"
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
				<label for="clouansp-sub-per-page"><?php esc_html_e('Items per page:', 'clouds-and-spaceships'); ?></label>
				<select name="per_page" id="clouansp-sub-per-page" data-autosubmit>
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
				/* translators: %1$s: number of substories, %2$s: search term */
				esc_html(_n(
					'%1$s substory matching “%2$s”.',
					'%1$s substories matching “%2$s”.',
					$clouansp_total,
					'clouds-and-spaceships'
				)),
				esc_html(number_format_i18n($clouansp_total)),
				esc_html($clouansp_search)
			); ?>
		</p>
	<?php endif; ?>

	<table class="wp-list-table widefat fixed striped clouansp-settings-table">
		<thead>
			<tr>
				<th class="clouansp-settings-table__thumb"></th>
				<th><?php esc_html_e('Title', 'clouds-and-spaceships'); ?></th>
				<th><?php esc_html_e('Status', 'clouds-and-spaceships'); ?></th>
				<th><?php esc_html_e('Date', 'clouds-and-spaceships'); ?></th>
				<th><?php esc_html_e('Actions', 'clouds-and-spaceships'); ?></th>
			</tr>
		</thead>
		<tbody>
			<?php if (! $clouansp_substories) : ?>
				<tr>
					<td colspan="5" class="clouansp-settings-table__empty">
						<?php if ($clouansp_search !== '') : ?>
							<?php esc_html_e('No substories match that name.', 'clouds-and-spaceships'); ?>
						<?php else : ?>
							<?php esc_html_e('No substories yet.', 'clouds-and-spaceships'); ?>
							<a href="<?php echo esc_url($clouansp_new_url); ?>">
								<?php esc_html_e('Create your first substory', 'clouds-and-spaceships'); ?>
							</a>
						<?php endif; ?>
					</td>
				</tr>
			<?php endif; ?>
			<?php foreach ($clouansp_substories as $clouansp_sub) :
				$clouansp_thumb_id  = (int) get_post_thumbnail_id($clouansp_sub->ID);
				$clouansp_thumb_url = $clouansp_thumb_id ? wp_get_attachment_image_url($clouansp_thumb_id, 'thumbnail') : '';
				$clouansp_edit_url  = get_edit_post_link($clouansp_sub->ID);
				$clouansp_view_url  = get_permalink($clouansp_sub->ID);
				$clouansp_status_labels = [
					'publish' => __('Published', 'clouds-and-spaceships'),
					'draft'   => __('Draft', 'clouds-and-spaceships'),
					'private' => __('Private', 'clouds-and-spaceships'),
				];
			?>
				<tr>
					<td class="clouansp-settings-table__thumb">
						<a href="<?php echo esc_url($clouansp_edit_url); ?>">
							<?php if ($clouansp_thumb_url) : ?>
								<img src="<?php echo esc_url($clouansp_thumb_url); ?>" alt="<?php echo esc_attr($clouansp_sub->post_title ?: ''); ?>" />
							<?php else : ?>
								<div class="clouansp-thumb-placeholder"></div>
							<?php endif; ?>
						</a>
					</td>
					<td>
						<strong>
							<a href="<?php echo esc_url($clouansp_edit_url); ?>">
								<?php echo esc_html($clouansp_sub->post_title ?: __('(no title)', 'clouds-and-spaceships')); ?>
							</a>
						</strong>
					</td>
					<td>
						<span class="clouansp-badge clouansp-badge--<?php echo esc_attr($clouansp_sub->post_status); ?>">
							<?php echo esc_html($clouansp_status_labels[$clouansp_sub->post_status] ?? ucfirst($clouansp_sub->post_status)); ?>
						</span>
					</td>
					<td><?php echo esc_html(get_the_date('Y-m-d', $clouansp_sub)); ?></td>
					<td class="clouansp-row-actions">
						<a href="<?php echo esc_url($clouansp_edit_url); ?>">
							<?php esc_html_e('Edit', 'clouds-and-spaceships'); ?>
						</a>
						<?php if (in_array($clouansp_sub->post_status, ['publish', 'private'], true)) : ?>
							&nbsp;&middot;&nbsp;
							<a href="<?php echo esc_url($clouansp_view_url); ?>" target="_blank" rel="noopener">
								<?php esc_html_e('View', 'clouds-and-spaceships'); ?>
							</a>
						<?php endif; ?>
						&nbsp;&middot;&nbsp;
						<a
							href="<?php echo esc_url(get_delete_post_link($clouansp_sub->ID)); ?>"
							class="clouansp-delete-link"
							data-confirm="<?php esc_attr_e('Move this substory to trash?', 'clouds-and-spaceships'); ?>"
						><?php esc_html_e('Trash', 'clouds-and-spaceships'); ?></a>
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

</div>
