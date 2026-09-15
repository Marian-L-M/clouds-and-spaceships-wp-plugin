<?php
/**
 * Clouds and Spaceships — Glossary admin tab content.
 *
 * Shares the cns_wiki_settings option with the Wiki tab; the hidden _section
 * field below tells cns_sanitize_wiki_settings() which keys this form owns.
 */
defined('ABSPATH') || exit;

$glossary_enabled   = (bool) cns_get_wiki_setting( 'glossary_enabled', false );
$glossary_slug      = cns_get_wiki_setting( 'glossary_slug', 'glossary' );
$glossary_color     = cns_get_wiki_setting( 'glossary_text_color', '' );
$glossary_show_menu = (bool) cns_get_wiki_setting( 'glossary_show_menu', true );
$glossary_url       = $glossary_enabled ? get_post_type_archive_link( 'glossary' ) : false;

// Counts are only meaningful once the post type is registered.
$published = 0;
$draft     = 0;
$cat_count = 0;

if ( $glossary_enabled ) {
    $counts    = wp_count_posts( 'glossary' );
    $published = (int) ( $counts->publish ?? 0 );
    $draft     = (int) ( $counts->draft   ?? 0 );
    $terms     = get_terms( [
        'taxonomy'   => 'glossary_category',
        'hide_empty' => true,
        'fields'     => 'ids',
    ] );
    $cat_count = is_wp_error( $terms ) ? 0 : count( $terms );
}
?>
<div class="cns-settings-page">

	<div class="cns-settings-page__header">
		<h1><?php esc_html_e( 'Glossary', 'clouds-and-spaceships' ); ?></h1>
		<?php if ( $glossary_enabled ) : ?>
			<div class="cns-settings-page__actions">
				<?php if ( $glossary_url ) : ?>
					<a href="<?php echo esc_url( $glossary_url ); ?>" target="_blank" rel="noopener" class="button">
						<?php esc_html_e( 'View archive ↗', 'clouds-and-spaceships' ); ?>
					</a>
				<?php endif; ?>
				<a href="<?php echo esc_url( admin_url( 'edit.php?post_type=glossary' ) ); ?>" class="button">
					<?php esc_html_e( 'All entries', 'clouds-and-spaceships' ); ?>
				</a>
				<a href="<?php echo esc_url( admin_url( 'post-new.php?post_type=glossary' ) ); ?>" class="button button-primary">
					<?php esc_html_e( '+ New Entry', 'clouds-and-spaceships' ); ?>
				</a>
			</div>
		<?php endif; ?>
	</div>

	<p class="cns-settings-page__intro">
		<?php esc_html_e( 'A glossary of terms with its own archive page. Once enabled, mark text as a glossary term from the editor toolbar to get a tooltip definition and a link to the entry.', 'clouds-and-spaceships' ); ?>
	</p>

	<?php if ( $glossary_enabled ) : ?>
		<ul class="cns-settings-stats">
			<li>
				<span class="cns-settings-stats__value"><?php echo esc_html( $published ); ?></span>
				<span class="cns-settings-stats__label"><?php esc_html_e( 'Published entries', 'clouds-and-spaceships' ); ?></span>
			</li>
			<li>
				<span class="cns-settings-stats__value"><?php echo esc_html( $draft ); ?></span>
				<span class="cns-settings-stats__label"><?php esc_html_e( 'Drafts', 'clouds-and-spaceships' ); ?></span>
			</li>
			<li>
				<span class="cns-settings-stats__value"><?php echo esc_html( $cat_count ); ?></span>
				<span class="cns-settings-stats__label"><?php esc_html_e( 'Categories in use', 'clouds-and-spaceships' ); ?></span>
			</li>
		</ul>
	<?php endif; ?>

	<form method="post" action="options.php">
		<?php settings_fields( 'cns_wiki_settings_group' ); ?>
		<input type="hidden" name="cns_wiki_settings[_section]" value="glossary" />

		<div class="cns-settings-card">
			<h2><?php esc_html_e( 'Glossary', 'clouds-and-spaceships' ); ?></h2>
			<p class="description">
				<?php esc_html_e( 'Registers the glossary post type, its archive, and the editor toolbar button. Off by default.', 'clouds-and-spaceships' ); ?>
			</p>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row"><?php esc_html_e( 'Glossary', 'clouds-and-spaceships' ); ?></th>
					<td>
						<label>
							<input
								type="checkbox"
								id="cns_glossary_enabled"
								name="cns_wiki_settings[glossary_enabled]"
								value="1"
								<?php checked( $glossary_enabled ); ?>
							/>
							<?php esc_html_e( 'Enable the glossary post type, archive, and editor toolbar button', 'clouds-and-spaceships' ); ?>
						</label>
						<p class="description">
							<?php esc_html_e( 'Disabling it leaves existing entries in the database untouched; they simply stop being registered.', 'clouds-and-spaceships' ); ?>
						</p>
					</td>
				</tr>
				<tr>
					<th scope="row">
						<label for="cns_glossary_slug"><?php esc_html_e( 'URL slug', 'clouds-and-spaceships' ); ?></label>
					</th>
					<td>
						<input
							type="text"
							id="cns_glossary_slug"
							name="cns_wiki_settings[glossary_slug]"
							value="<?php echo esc_attr( $glossary_slug ); ?>"
							class="regular-text"
							pattern="[a-z0-9\-]+"
							placeholder="glossary"
						/>
						<p class="description">
							<?php esc_html_e( 'Lowercase letters, numbers, and hyphens only. Changes the archive URL and every single entry URL — existing links will break.', 'clouds-and-spaceships' ); ?>
						</p>
					</td>
				</tr>
				<tr>
					<th scope="row">
						<label for="cns_glossary_color"><?php esc_html_e( 'Entry text colour', 'clouds-and-spaceships' ); ?></label>
					</th>
					<td>
						<input
							type="color"
							id="cns_glossary_color"
							name="cns_wiki_settings[glossary_text_color]"
							value="<?php echo esc_attr( $glossary_color ?: '#ffffff' ); ?>"
							<?php disabled( '', $glossary_color ); ?>
						/>
						<label style="margin-left:8px;">
							<input type="checkbox" class="cns-color-clear" data-color="cns_glossary_color"
								<?php checked( '', $glossary_color ); ?> />
							<?php esc_html_e( 'Clear (use theme default)', 'clouds-and-spaceships' ); ?>
						</label>
						<p class="description">
							<?php esc_html_e( 'Colour of inline glossary terms in content. Leave empty to inherit the surrounding text colour.', 'clouds-and-spaceships' ); ?>
						</p>
					</td>
				</tr>
				<tr>
					<th scope="row"><?php esc_html_e( 'Admin menu visibility', 'clouds-and-spaceships' ); ?></th>
					<td>
						<label>
							<input
								type="checkbox"
								name="cns_wiki_settings[glossary_show_menu]"
								value="1"
								<?php checked( $glossary_show_menu ); ?>
							/>
							<?php esc_html_e( 'Show Glossary in the WordPress admin sidebar', 'clouds-and-spaceships' ); ?>
						</label>
						<p class="description">
							<?php esc_html_e( 'Adds the standard WordPress list screen for glossary entries to the sidebar. This tab stays the primary place to configure the glossary.', 'clouds-and-spaceships' ); ?>
						</p>
					</td>
				</tr>
			</table>
		</div>

		<?php submit_button( __( 'Save Settings', 'clouds-and-spaceships' ), 'secondary' ); ?>
	</form>

</div>
