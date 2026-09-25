<?php
/**
 * Clouds and Spaceships — Info admin tab content.
 */
defined('ABSPATH') || exit;

$glossary_enabled = function_exists('cns_wiki_glossary_enabled') && cns_wiki_glossary_enabled();

$counts = [
    [
        'label' => __('Wikis', 'clouds-and-spaceships'),
        'value' => (int) (wp_count_posts('cns_wiki')->publish ?? 0),
    ],
    [
        'label' => __('Maps', 'clouds-and-spaceships'),
        'value' => (int) (wp_count_posts('cns_map')->publish ?? 0),
    ],
    [
        'label' => __('Stories', 'clouds-and-spaceships'),
        'value' => (int) (wp_count_posts('cns_story')->publish ?? 0),
    ],
];

if ($glossary_enabled) {
    $counts[] = [
        'label' => __('Glossary entries', 'clouds-and-spaceships'),
        'value' => (int) (wp_count_posts('cns_glossary')->publish ?? 0),
    ];
}

$news = cns_info_get_news();
?>
<div class="cns-settings-page">

	<div class="cns-settings-page__header">
		<h1><?php esc_html_e('Clouds and Spaceships', 'clouds-and-spaceships'); ?></h1>
		<div class="cns-settings-page__actions">
			<a href="<?php echo esc_url(CNS_INFO_NEWS_URL); ?>" target="_blank" rel="noopener" class="button">
				<?php esc_html_e('Visit cloudsandspaceships.com ↗', 'clouds-and-spaceships'); ?>
			</a>
		</div>
	</div>

	<p class="cns-settings-page__intro">
		<?php esc_html_e('Clouds and Spaceships (CNS) is a suite for Worldbuilders and Mapmakers: Connect your map to your post using interactive canvas maps, wiki articles, glossaries, and story paths.', 'clouds-and-spaceships'); ?>
	</p>

	<ul class="cns-settings-stats">
		<?php foreach ($counts as $count) : ?>
			<li>
				<span class="cns-settings-stats__value"><?php echo esc_html($count['value']); ?></span>
				<span class="cns-settings-stats__label"><?php echo esc_html($count['label']); ?></span>
			</li>
		<?php endforeach; ?>
	</ul>

	<div class="cns-settings-card">
		<h2><?php esc_html_e('Information', 'clouds-and-spaceships'); ?></h2>
		<p class="description">
			<?php esc_html_e('Version, requirements and licence for this installation.', 'clouds-and-spaceships'); ?>
		</p>
		<table class="form-table" role="presentation">
			<tr>
				<th scope="row"><?php esc_html_e('Version', 'clouds-and-spaceships'); ?></th>
				<td><?php echo esc_html(CNS_VERSION); ?></td>
			</tr>
			<tr>
				<th scope="row"><?php esc_html_e('Database schema', 'clouds-and-spaceships'); ?></th>
				<td><?php echo esc_html(CNS_DB_VERSION); ?></td>
			</tr>
			<tr>
				<th scope="row"><?php esc_html_e('Glossary', 'clouds-and-spaceships'); ?></th>
				<td>
					<?php echo $glossary_enabled
						? esc_html__('Enabled', 'clouds-and-spaceships')
						: esc_html__('Disabled', 'clouds-and-spaceships'); ?>
					<p class="description">
						<?php esc_html_e('Turn the glossary on and off on the Glossary tab.', 'clouds-and-spaceships'); ?>
					</p>
				</td>
			</tr>
			<tr>
				<th scope="row"><?php esc_html_e('Licence', 'clouds-and-spaceships'); ?></th>
				<td>GPL-2.0-or-later</td>
			</tr>
		</table>
	</div>

	<div class="cns-settings-card">
		<h2><?php esc_html_e('News from Clouds and Spaceships', 'clouds-and-spaceships') ?></h2>

		<form method="post" class="cns-news-list__form">
			<?php wp_nonce_field('cns_info_save_news_settings'); ?>
			<input type="hidden" name="cns_info_action" value="save_news_settings" />
			<label>
				<input
					type="checkbox"
					name="news_enabled"
					value="1"
					<?php checked(cns_info_news_enabled()); ?>
				/>
				<?php esc_html_e('Show the latest news post', 'clouds-and-spaceships'); ?>
			</label>
			<p class="description">
				<?php esc_html_e('When enabled, this box loads the newest post from cloudsandspaceships.com over the internet. No information about your site is sent, though your server\'s IP address is visible to any site it contacts. Turn it off to stop the request entirely.', 'clouds-and-spaceships'); ?>
			</p>
			<?php submit_button(__('Save', 'clouds-and-spaceships'), 'secondary', 'submit', false); ?>
		</form>

		<?php if (! cns_info_news_enabled()) : ?>
			<p class="cns-news-list__notice">
				<?php esc_html_e('News is turned off, so no request is made to cloudsandspaceships.com.', 'clouds-and-spaceships'); ?>
			</p>
		<?php elseif ($news['error'] !== '') : ?>
			<p class="cns-news-list__notice">
				<?php
				printf(
					/* translators: %s: reason the request failed. */
					esc_html__('Error loading posts %s', 'clouds-and-spaceships'),
					esc_html($news['error'])
				);
				?>
			</p>
		<?php elseif (empty($news['items'])) : ?>
			<p class="cns-news-list__notice">
				<?php esc_html_e('Currently no news.', 'clouds-and-spaceships'); ?>
			</p>
		<?php else : ?>
			<ul class="cns-news-list">
				<?php foreach ($news['items'] as $item) : ?>
					<li>
						<a class="cns-news-list__title" href="<?php echo esc_url($item['url']); ?>" target="_blank" rel="noopener">
							<?php echo esc_html($item['title']); ?>
						</a>
						<?php if ($item['date'] !== '') : ?>
							<span class="cns-news-list__meta">
								<?php echo esc_html(date_i18n(get_option('date_format'), strtotime($item['date']))); ?>
							</span>
						<?php endif; ?>
						<?php if ($item['excerpt'] !== '') : ?>
							<p class="cns-news-list__excerpt"><?php echo esc_html($item['excerpt']); ?></p>
						<?php endif; ?>
					</li>
				<?php endforeach; ?>
			</ul>
		<?php endif; ?>
	</div>

</div>
