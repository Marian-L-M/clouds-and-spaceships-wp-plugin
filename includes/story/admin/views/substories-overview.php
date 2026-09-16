<?php
defined('ABSPATH') || exit;

$per_page_options   = [10, 20, 50, 100];
$requested_per_page = (int) ($_GET['per_page'] ?? 20);
$per_page           = in_array($requested_per_page, $per_page_options, true) ? $requested_per_page : 20;
$paged              = max(1, absint($_GET['paged'] ?? 1));
$search             = isset($_GET['s']) ? sanitize_text_field(wp_unslash($_GET['s'])) : '';

// One query for both the rows and the total: wp_count_posts() cannot see the
// search. Matching the title only keeps the list honest — it shows no body
// text, so a content hit would look like a result with no visible reason.
$query_args = [
	'post_type'      => 'cns_substory',
	'posts_per_page' => $per_page,
	'offset'         => ($paged - 1) * $per_page,
	'post_status'    => ['publish', 'draft', 'private'],
	'orderby'        => 'date',
	'order'          => 'DESC',
];

if ($search !== '') {
	$query_args['s']              = $search;
	$query_args['search_columns'] = ['post_title'];
}

$query       = new WP_Query($query_args);
$substories  = $query->posts;
$total       = (int) $query->found_posts;
$total_pages = (int) ceil($total / $per_page);

// A stale paged value — a bookmark, or a search that shrank the list — would
// otherwise render an empty table while matches sit on earlier pages. Only the
// out-of-range case pays for the second query.
if (! $substories && $total > 0 && $paged > 1) {
	$paged                = min($paged, $total_pages);
	$query_args['offset'] = ($paged - 1) * $per_page;
	$query                = new WP_Query($query_args);
	$substories           = $query->posts;
}

$return_page = sanitize_key($_GET['page'] ?? CNS_STORY_PAGE_SETTINGS_SUBSTORIES);
$new_url     = admin_url('post-new.php?post_type=cns_substory');
?>
<div class="cns-settings-page">

	<?php if (isset($_GET['trashed'])) : ?>
		<div class="notice notice-success is-dismissible">
			<p><?php esc_html_e('Substory moved to trash.', 'clouds-and-spaceships'); ?></p>
		</div>
	<?php endif; ?>

	<div class="cns-settings-page__header">
		<h1><?php esc_html_e('Substories', 'clouds-and-spaceships'); ?></h1>
		<div class="cns-settings-page__actions">
			<a href="<?php echo esc_url($new_url); ?>" class="button button-primary">
				<?php esc_html_e('+ New Substory', 'clouds-and-spaceships'); ?>
			</a>
			<a href="<?php echo esc_url(admin_url('edit.php?post_type=cns_substory')); ?>" class="button">
				<?php esc_html_e('Full overview', 'clouds-and-spaceships'); ?>
			</a>
		</div>
	</div>

	<!--
		One form for both controls so each keeps the other's value. It carries no
		paged field on purpose: any change to the filter returns to page one,
		which is the only page guaranteed to exist in the new result set.
	-->
	<div class="cns-settings-toolbar">
		<form method="get">
			<input type="hidden" name="page" value="<?php echo esc_attr($return_page); ?>" />

			<span class="cns-settings-toolbar__group">
				<label class="screen-reader-text" for="cns-sub-search">
					<?php esc_html_e('Search substories by name', 'clouds-and-spaceships'); ?>
				</label>
				<input
					type="search"
					id="cns-sub-search"
					name="s"
					value="<?php echo esc_attr($search); ?>"
					placeholder="<?php esc_attr_e('Search substories by name…', 'clouds-and-spaceships'); ?>"
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
				<label for="cns-sub-per-page"><?php esc_html_e('Items per page:', 'clouds-and-spaceships'); ?></label>
				<select name="per_page" id="cns-sub-per-page" onchange="this.form.submit()">
					<?php foreach ($per_page_options as $option) : ?>
						<option value="<?php echo $option; ?>" <?php selected($per_page, $option); ?>>
							<?php echo $option; ?>
						</option>
					<?php endforeach; ?>
				</select>
			</span>
		</form>
	</div>

	<?php if ($search !== '') : ?>
		<p class="cns-settings-toolbar__count">
			<?php printf(
				esc_html(_n(
					'%1$s substory matching “%2$s”.',
					'%1$s substories matching “%2$s”.',
					$total,
					'clouds-and-spaceships'
				)),
				esc_html(number_format_i18n($total)),
				esc_html($search)
			); ?>
		</p>
	<?php endif; ?>

	<table class="wp-list-table widefat fixed striped cns-settings-table">
		<thead>
			<tr>
				<th class="col-thumb"></th>
				<th><?php esc_html_e('Title', 'clouds-and-spaceships'); ?></th>
				<th><?php esc_html_e('Status', 'clouds-and-spaceships'); ?></th>
				<th><?php esc_html_e('Date', 'clouds-and-spaceships'); ?></th>
				<th><?php esc_html_e('Actions', 'clouds-and-spaceships'); ?></th>
			</tr>
		</thead>
		<tbody>
			<?php if (! $substories) : ?>
				<tr>
					<td colspan="5" class="cns-settings-table__empty">
						<?php if ($search !== '') : ?>
							<?php esc_html_e('No substories match that name.', 'clouds-and-spaceships'); ?>
						<?php else : ?>
							<?php esc_html_e('No substories yet.', 'clouds-and-spaceships'); ?>
							<a href="<?php echo esc_url($new_url); ?>">
								<?php esc_html_e('Create your first substory', 'clouds-and-spaceships'); ?>
							</a>
						<?php endif; ?>
					</td>
				</tr>
			<?php endif; ?>
			<?php foreach ($substories as $sub) :
				$thumb_id  = (int) get_post_thumbnail_id($sub->ID);
				$thumb_url = $thumb_id ? wp_get_attachment_image_url($thumb_id, 'thumbnail') : '';
				$edit_url  = get_edit_post_link($sub->ID);
				$view_url  = get_permalink($sub->ID);
				$status_labels = [
					'publish' => __('Published', 'clouds-and-spaceships'),
					'draft'   => __('Draft', 'clouds-and-spaceships'),
					'private' => __('Private', 'clouds-and-spaceships'),
				];
			?>
				<tr>
					<td class="col-thumb">
						<a href="<?php echo esc_url($edit_url); ?>">
							<?php if ($thumb_url) : ?>
								<img src="<?php echo esc_url($thumb_url); ?>" alt="<?php echo esc_attr($sub->post_title ?: ''); ?>" />
							<?php else : ?>
								<div class="cns-thumb-placeholder"></div>
							<?php endif; ?>
						</a>
					</td>
					<td>
						<strong>
							<a href="<?php echo esc_url($edit_url); ?>">
								<?php echo esc_html($sub->post_title ?: __('(no title)', 'clouds-and-spaceships')); ?>
							</a>
						</strong>
					</td>
					<td>
						<span class="cns-badge cns-badge--<?php echo esc_attr($sub->post_status); ?>">
							<?php echo esc_html($status_labels[$sub->post_status] ?? ucfirst($sub->post_status)); ?>
						</span>
					</td>
					<td><?php echo esc_html(get_the_date('Y-m-d', $sub)); ?></td>
					<td class="cns-row-actions">
						<a href="<?php echo esc_url($edit_url); ?>">
							<?php esc_html_e('Edit', 'clouds-and-spaceships'); ?>
						</a>
						<?php if (in_array($sub->post_status, ['publish', 'private'], true)) : ?>
							&nbsp;&middot;&nbsp;
							<a href="<?php echo esc_url($view_url); ?>" target="_blank" rel="noopener">
								<?php esc_html_e('View', 'clouds-and-spaceships'); ?>
							</a>
						<?php endif; ?>
						&nbsp;&middot;&nbsp;
						<a
							href="<?php echo esc_url(get_delete_post_link($sub->ID)); ?>"
							class="cns-delete-link"
							onclick="return confirm('<?php esc_attr_e('Move this substory to trash?', 'clouds-and-spaceships'); ?>')"
						><?php esc_html_e('Trash', 'clouds-and-spaceships'); ?></a>
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

</div>
