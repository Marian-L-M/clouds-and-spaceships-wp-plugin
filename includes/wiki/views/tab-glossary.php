<?php
/**
 * Clouds and Spaceships — Glossary admin tab content.
 *
 * Shares the clouansp_wiki_settings option with the Wiki tab; the hidden _section
 * field below tells clouansp_sanitize_wiki_settings() which keys this form owns.
 */
defined('ABSPATH') || exit;

$glossary_enabled   = (bool) clouansp_get_wiki_setting( 'glossary_enabled', false );
$glossary_slug      = clouansp_get_wiki_setting( 'glossary_slug', 'glossary' );
$glossary_color     = clouansp_get_wiki_setting( 'glossary_text_color', '' );
$glossary_show_menu = (bool) clouansp_get_wiki_setting( 'glossary_show_menu', true );
$glossary_delete_on_uninstall = (bool) clouansp_get_wiki_setting( 'glossary_delete_on_uninstall', false );
$glossary_url       = $glossary_enabled ? get_post_type_archive_link( 'clouansp_glossary' ) : false;

// Counts are only meaningful once the post type is registered.
$published = 0;
$draft     = 0;
$cat_count = 0;

if ( $glossary_enabled ) {
    $counts    = wp_count_posts( 'clouansp_glossary' );
    $published = (int) ( $counts->publish ?? 0 );
    $draft     = (int) ( $counts->draft   ?? 0 );
    $terms     = get_terms( [
        'taxonomy'   => 'clouansp_glossary_category',
        'hide_empty' => true,
        'fields'     => 'ids',
    ] );
    $cat_count = is_wp_error( $terms ) ? 0 : count( $terms );
}
?>
<div class="clouansp-settings-page">

	<div class="clouansp-settings-page__header">
		<h1><?php esc_html_e( 'Glossary', 'clouds-and-spaceships' ); ?></h1>
		<?php if ( $glossary_enabled ) : ?>
			<div class="clouansp-settings-page__actions">
				<?php if ( $glossary_url ) : ?>
					<a href="<?php echo esc_url( $glossary_url ); ?>" target="_blank" rel="noopener" class="button">
						<?php esc_html_e( 'View archive ↗', 'clouds-and-spaceships' ); ?>
					</a>
				<?php endif; ?>
				<a href="<?php echo esc_url( admin_url( 'edit.php?post_type=clouansp_glossary' ) ); ?>" class="button">
					<?php esc_html_e( 'All terms', 'clouds-and-spaceships' ); ?>
				</a>
				<a href="<?php echo esc_url( admin_url( 'post-new.php?post_type=clouansp_glossary' ) ); ?>" class="button button-primary">
					<?php esc_html_e( '+ New Term', 'clouds-and-spaceships' ); ?>
				</a>
			</div>
		<?php endif; ?>
	</div>

	<p class="clouansp-settings-page__intro">
		<?php esc_html_e( 'A glossary of terms. Text in a post can be marked as a glossary term, which shows the term\'s definition in a tooltip on hover.', 'clouds-and-spaceships' ); ?>
	</p>

	<?php if ( $glossary_enabled ) : ?>
		<ul class="clouansp-settings-stats">
			<li>
				<span class="clouansp-settings-stats__value"><?php echo esc_html( $published ); ?></span>
				<span class="clouansp-settings-stats__label"><?php esc_html_e( 'Published terms', 'clouds-and-spaceships' ); ?></span>
			</li>
			<li>
				<span class="clouansp-settings-stats__value"><?php echo esc_html( $draft ); ?></span>
				<span class="clouansp-settings-stats__label"><?php esc_html_e( 'Drafts', 'clouds-and-spaceships' ); ?></span>
			</li>
			<li>
				<span class="clouansp-settings-stats__value"><?php echo esc_html( $cat_count ); ?></span>
				<span class="clouansp-settings-stats__label"><?php esc_html_e( 'Categories in use', 'clouds-and-spaceships' ); ?></span>
			</li>
		</ul>
	<?php endif; ?>

	<form method="post" action="options.php">
		<?php settings_fields( 'clouansp_wiki_settings_group' ); ?>
		<input type="hidden" name="clouansp_wiki_settings[_section]" value="glossary" />

		<div class="clouansp-settings-card">
			<h2><?php esc_html_e( 'Glossary Terms', 'clouds-and-spaceships' ); ?></h2>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row"><?php esc_html_e( 'Glossary', 'clouds-and-spaceships' ); ?></th>
					<td>
						<label>
							<input
								type="checkbox"
								id="clouansp_glossary_enabled"
								name="clouansp_wiki_settings[glossary_enabled]"
								value="1"
								<?php checked( $glossary_enabled ); ?>
							/>
							<?php esc_html_e( 'Enable glossary post type and functionality', 'clouds-and-spaceships' ); ?>
						</label>
						<p class="description">
							<?php esc_html_e( 'Disabling glossary terms will not delete existing terms in database.', 'clouds-and-spaceships' ); ?>
						</p>
					</td>
				</tr>
				<tr>
					<th scope="row"><?php esc_html_e( 'Admin menu visibility', 'clouds-and-spaceships' ); ?></th>
					<td>
						<label>
							<input
								type="checkbox"
								name="clouansp_wiki_settings[glossary_show_menu]"
								value="1"
								<?php checked( $glossary_show_menu ); ?>
							/>
							<?php esc_html_e( 'Show Glossary in the WordPress admin sidebar', 'clouds-and-spaceships' ); ?>
						</label>
						<p class="description">
							<?php esc_html_e( 'Adds Glossary to the Wordpress Admin Sidebar.', 'clouds-and-spaceships' ); ?>
						</p>
					</td>
				</tr>
				<tr>
				<th scope="row">
					<label for="clouansp_glossary_color"><?php esc_html_e( 'Glossary term text color', 'clouds-and-spaceships' ); ?></label>
				</th>
				<td>
					<input
						type="color"
						id="clouansp_glossary_color"
						name="clouansp_wiki_settings[glossary_text_color]"
						value="<?php echo esc_attr( $glossary_color ?: '#ffffff' ); ?>"
						<?php disabled( '', $glossary_color ); ?>
					/>
					<label style="margin-left:8px;">
						<input type="checkbox" class="clouansp-color-clear" data-color="clouansp_glossary_color"
							<?php checked( '', $glossary_color ); ?> />
						<?php esc_html_e( 'inherit', 'clouds-and-spaceships' ); ?>
					</label>
					<p class="description">
						<?php esc_html_e( 'Color of inline glossary terms in content. Check to inherit the current text color.', 'clouds-and-spaceships' ); ?>
					</p>
					<h4><?php esc_html_e( '*Uncheck to set custom global default', 'clouds-and-spaceships' ); ?></h4>
				</td>
			</tr>
		</table>
	</div>
	<!-- ── Archive ──────────────────────────────────────────────── -->
	<div class="clouansp-settings-card">
		<h2><?php esc_html_e( 'Archive', 'clouds-and-spaceships' ); ?></h2>
		<table class="form-table" role="presentation">
			<tr>
				<th scope="row">
					<label for="clouansp_glossary_slug"><?php esc_html_e( 'URL slug', 'clouds-and-spaceships' ); ?></label>
					<?php if ( $glossary_url ) : ?>
						<a href="<?php echo esc_url( $glossary_url ); ?>" target="_blank" rel="noopener" class="clouansp-settings-link">
							<?php esc_html_e( 'View archive ↗', 'clouds-and-spaceships' ); ?>
						</a>
					<?php endif; ?>
				</th>
				<td>
					<input
						type="text"
						id="clouansp_glossary_slug"
						name="clouansp_wiki_settings[glossary_slug]"
						value="<?php echo esc_attr( $glossary_slug ); ?>"
						class="regular-text"
						pattern="[a-z0-9\-]+"
						placeholder="glossary"
					/>
					<p class="description">
						<?php esc_html_e( 'Lowercase letters, numbers, and hyphens only. Changes glossary archive URL and all single glossary term URLs.', 'clouds-and-spaceships' ); ?>
					</p>
					<p class="clouansp-text-danger">
						<?php esc_html_e( 'CAUTION! On change existing links will break.', 'clouds-and-spaceships' ); ?>
					</p>
				</td>
			</tr>
			
		</table>
	</div>

		<?php /* ── Danger Zone ──────────────────────────────────────────── */ ?>
		<div class="clouansp-danger-zone">
			<h2><?php esc_html_e( 'Danger Zone', 'clouds-and-spaceships' ); ?></h2>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row"><?php esc_html_e( 'Uninstall behavior', 'clouds-and-spaceships' ); ?></th>
					<td>
						<label class="clouansp-text-danger">
							<input
								type="checkbox"
								name="clouansp_wiki_settings[glossary_delete_on_uninstall]"
								value="1"
								<?php checked( $glossary_delete_on_uninstall ); ?>
							/>
							<?php esc_html_e( 'Delete all glossary posts when the plugin is uninstalled', 'clouds-and-spaceships' ); ?>
						</label>
						<p class="description">
							<?php esc_html_e( 'When unchecked (default), glossary entries are kept after uninstall. Deactivating the plugin does not delete. Only applies when the plugin is deleted.', 'clouds-and-spaceships' ); ?>
						</p>
					</td>
				</tr>
			</table>
		</div>

		<?php submit_button( __( 'Save Settings', 'clouds-and-spaceships' ), 'secondary' ); ?>
	</form>

</div>
