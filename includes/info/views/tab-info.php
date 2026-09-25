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

?>
<div class="cns-settings-page">

	<div class="cns-settings-page__header">
		<h1><?php esc_html_e('Clouds and Spaceships', 'clouds-and-spaceships'); ?></h1>
		<div class="cns-settings-page__actions">
			<a href="<?php echo esc_url(CNS_PROJECT_URL); ?>" target="_blank" rel="noopener" class="button">
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

</div>
