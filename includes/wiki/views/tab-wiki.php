<?php
/**
 * Clouds and Spaceships — Wiki admin tab content.
 *
 * Shares the clouansp_wiki_settings option with the Glossary tab; the hidden
 * _section field below tells clouansp_sanitize_wiki_settings() which keys this form
 * owns, so saving one tab never drops the other's values.
 */
defined( 'ABSPATH' ) || exit;

// ── Settings values ───────────────────────────────────────────────────────────
$clouansp_wiki_enabled      = (bool) clouansp_get_wiki_setting( 'wiki_enabled', true );
$clouansp_wiki_show_menu    = (bool) clouansp_get_wiki_setting( 'wiki_show_menu', true );
$clouansp_wiki_delete_on_uninstall = (bool) clouansp_get_wiki_setting( 'wiki_delete_on_uninstall', false );
$clouansp_infobox_width     = clouansp_get_wiki_setting( 'infobox_width', '' );
$content_width     = clouansp_get_wiki_setting( 'content_width', '' );

$clouansp_archive_slug  = clouansp_get_wiki_setting( 'archive_slug',  'wiki' );
$clouansp_archive_url   = $clouansp_wiki_enabled ? get_post_type_archive_link( 'clouansp_wiki' ) : false;

$clouansp_grid_desktop  = (int) clouansp_get_wiki_setting( 'grid_columns_desktop', 3 );
$clouansp_grid_tablet   = (int) clouansp_get_wiki_setting( 'grid_columns_tablet',  2 );
$clouansp_grid_mobile   = (int) clouansp_get_wiki_setting( 'grid_columns_mobile',  1 );
$clouansp_grid_col_gap  = (int) clouansp_get_wiki_setting( 'grid_column_gap', 16 );
$clouansp_grid_row_gap  = (int) clouansp_get_wiki_setting( 'grid_row_gap',    16 );

$clouansp_infobox_bg       = clouansp_get_wiki_setting( 'infobox_bg_color',       '' );
$clouansp_infobox_contrast = clouansp_get_wiki_setting( 'infobox_contrast_color', '' );
$clouansp_infobox_accent   = clouansp_get_wiki_setting( 'infobox_accent_color',   '' );
$clouansp_infobox_text     = clouansp_get_wiki_setting( 'infobox_text_color',     '' );
$clouansp_infobox_title    = clouansp_get_wiki_setting( 'infobox_title_color',    '' );

$clouansp_placeholder_id  = absint( clouansp_get_wiki_setting( 'placeholder_thumb_id', 0 ) );
$clouansp_placeholder_url = $clouansp_placeholder_id ? wp_get_attachment_image_url( $clouansp_placeholder_id, 'medium' ) : '';

// ── Stats ─────────────────────────────────────────────────────────────────────
// Only meaningful while the post type is registered.
$clouansp_published = 0;
$clouansp_draft     = 0;
// Categories and tags in use by published wikis, keyed by taxonomy.
$clouansp_term_counts = [ 'category' => 0, 'post_tag' => 0 ];

if ( $clouansp_wiki_enabled ) {
    $clouansp_counts    = wp_count_posts( 'clouansp_wiki' );
    $clouansp_published = (int) ( $clouansp_counts->publish ?? 0 );
    $clouansp_draft     = (int) ( $clouansp_counts->draft   ?? 0 );
    $clouansp_wiki_ids  = $clouansp_published > 0
        ? get_posts( [ 'post_type' => 'clouansp_wiki', 'posts_per_page' => -1, 'fields' => 'ids', 'post_status' => 'publish' ] )
        : [];

    foreach ( array_keys( $clouansp_term_counts ) as $clouansp_taxonomy ) {
        if ( empty( $clouansp_wiki_ids ) ) {
            continue;
        }
        $clouansp_terms  = get_terms( [
            'taxonomy'   => $clouansp_taxonomy,
            'object_ids' => $clouansp_wiki_ids,
            'hide_empty' => true,
            'fields'     => 'ids',
        ] );
        $clouansp_term_counts[ $clouansp_taxonomy ] = is_wp_error( $clouansp_terms ) ? 0 : count( $clouansp_terms );
    }
}
?>
<div class="clouansp-settings-page">

	<div class="clouansp-settings-page__header">
		<h1><?php esc_html_e( 'Wiki', 'clouds-and-spaceships' ); ?></h1>
		<?php if ( $clouansp_wiki_enabled ) : ?>
			<div class="clouansp-settings-page__actions">
				<?php if ( $clouansp_archive_url ) : ?>
					<a href="<?php echo esc_url( $clouansp_archive_url ); ?>" target="_blank" rel="noopener" class="button">
						<?php esc_html_e( 'View archive ↗', 'clouds-and-spaceships' ); ?>
					</a>
				<?php endif; ?>
				<a href="<?php echo esc_url( admin_url( 'edit.php?post_type=clouansp_wiki' ) ); ?>" class="button">
					<?php esc_html_e( 'All wikis', 'clouds-and-spaceships' ); ?>
				</a>
				<a href="<?php echo esc_url( admin_url( 'post-new.php?post_type=clouansp_wiki' ) ); ?>" class="button button-primary">
					<?php esc_html_e( '+ New Wiki', 'clouds-and-spaceships' ); ?>
				</a>
			</div>
		<?php endif; ?>
	</div>

	<p class="clouansp-settings-page__intro">
		<?php esc_html_e( 'A hierarchical custom post type to create wiki like post with default info boxes.', 'clouds-and-spaceships' ); ?>
	</p>

	<?php if ( $clouansp_wiki_enabled ) : ?>
	<ul class="clouansp-settings-stats">
		<li>
			<span class="clouansp-settings-stats__value"><?php echo esc_html( $clouansp_published ); ?></span>
			<span class="clouansp-settings-stats__label"><?php esc_html_e( 'Published wikis', 'clouds-and-spaceships' ); ?></span>
		</li>
		<li>
			<span class="clouansp-settings-stats__value"><?php echo esc_html( $clouansp_draft ); ?></span>
			<span class="clouansp-settings-stats__label"><?php esc_html_e( 'Drafts', 'clouds-and-spaceships' ); ?></span>
		</li>
		<li>
			<span class="clouansp-settings-stats__value"><?php echo esc_html( $clouansp_term_counts['category'] ); ?></span>
			<span class="clouansp-settings-stats__label"><?php esc_html_e( 'Categories in use', 'clouds-and-spaceships' ); ?></span>
		</li>
		<li>
			<span class="clouansp-settings-stats__value"><?php echo esc_html( $clouansp_term_counts['post_tag'] ); ?></span>
			<span class="clouansp-settings-stats__label"><?php esc_html_e( 'Tags in use', 'clouds-and-spaceships' ); ?></span>
		</li>
	</ul>
	<?php endif; ?>

	<form method="post" action="options.php">
		<?php settings_fields( 'clouansp_wiki_settings_group' ); ?>
		<input type="hidden" name="clouansp_wiki_settings[_section]" value="wiki" />

		<!-- ── Post type ────────────────────────────────────────────── -->
		<div class="clouansp-settings-card">
			<h2><?php esc_html_e( 'Wiki', 'clouds-and-spaceships' ); ?></h2>
			<p class="description">
				<?php esc_html_e( 'Registers the wiki post type, its archive, and the wiki page templates. On by default.', 'clouds-and-spaceships' ); ?>
			</p>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row"><?php esc_html_e( 'Wiki', 'clouds-and-spaceships' ); ?></th>
					<td>
						<label>
							<input
								type="checkbox"
								id="clouansp_wiki_enabled"
								name="clouansp_wiki_settings[wiki_enabled]"
								value="1"
								<?php checked( $clouansp_wiki_enabled ); ?>
							/>
							<?php esc_html_e( 'Enable wiki post type, archive, and page templates', 'clouds-and-spaceships' ); ?>
						</label>
						<p class="description">
							<?php esc_html_e( 'On by default. Deactivate to not use the wiki post type entirely and use your own template. Disabling will not change existing wiki posts in database.', 'clouds-and-spaceships' ); ?>
						</p>
					</td>
				</tr>
				<tr>
					<th scope="row"><?php esc_html_e( 'Admin menu visibility', 'clouds-and-spaceships' ); ?></th>
					<td>
						<label>
							<input
								type="checkbox"
								name="clouansp_wiki_settings[wiki_show_menu]"
								value="1"
								<?php checked( $clouansp_wiki_show_menu ); ?>
							/>
							<?php esc_html_e( 'Show Wiki admin sidebar', 'clouds-and-spaceships' ); ?>
						</label>
						<p class="description">
							<?php esc_html_e( 'Adds Wiki to the Wordpress Admin Sidebar.', 'clouds-and-spaceships' ); ?>
						</p>
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
						<label for="clouansp_wiki_slug"><?php esc_html_e( 'URL slug', 'clouds-and-spaceships' ); ?></label>
						<?php if ( $clouansp_archive_url ) : ?>
							<a href="<?php echo esc_url( $clouansp_archive_url ); ?>" target="_blank" rel="noopener" class="clouansp-settings-link">
								<?php esc_html_e( 'View archive ↗', 'clouds-and-spaceships' ); ?>
							</a>
						<?php endif; ?>
					</th>
					<td>
						<input
							type="text"
							id="clouansp_wiki_slug"
							name="clouansp_wiki_settings[archive_slug]"
							value="<?php echo esc_attr( $clouansp_archive_slug ); ?>"
							class="regular-text"
							pattern="[a-z0-9\-]+"
							placeholder="wiki"
						/>
						<p class="description">
							<?php esc_html_e( 'Lowercase letters, numbers, and hyphens only. Changes wiki archive URL and all single wiki URLs.', 'clouds-and-spaceships' ); ?>
						</p>
						<p class="clouansp-text-danger">
							<?php esc_html_e( 'CAUTION! On change existing links will break.', 'clouds-and-spaceships' ); ?>
						</p>
					</td>
				</tr>
				<tr>
					<th scope="row">
						<label><?php esc_html_e( 'Placeholder thumbnail', 'clouds-and-spaceships' ); ?></label>
					</th>
					<td>
						<input
							type="hidden"
							id="clouansp_wiki_placeholder_id"
							name="clouansp_wiki_settings[placeholder_thumb_id]"
							value="<?php echo esc_attr( $clouansp_placeholder_id ?: '' ); ?>"
						/>
						<img
							id="clouansp_wiki_placeholder_preview"
							src="<?php echo $clouansp_placeholder_url ? esc_url( $clouansp_placeholder_url ) : ''; ?>"
							style="max-height:80px;display:<?php echo $clouansp_placeholder_url ? 'block' : 'none'; ?>;margin-bottom:8px;"
							alt=""
						/>
						<button
							type="button"
							id="clouansp_wiki_placeholder_btn"
							class="button clouansp-media-btn"
							data-input="clouansp_wiki_placeholder_id"
							data-preview="clouansp_wiki_placeholder_preview"
							data-remove="clouansp_wiki_placeholder_remove"
							data-title="<?php esc_attr_e( 'Select placeholder thumbnail', 'clouds-and-spaceships' ); ?>"
							data-select-label="<?php esc_attr_e( 'Select image', 'clouds-and-spaceships' ); ?>"
							data-change-label="<?php esc_attr_e( 'Change image', 'clouds-and-spaceships' ); ?>"
						><?php echo $clouansp_placeholder_id ? esc_html__( 'Change image', 'clouds-and-spaceships' ) : esc_html__( 'Select image', 'clouds-and-spaceships' ); ?></button>
						<button
							type="button"
							id="clouansp_wiki_placeholder_remove"
							class="button clouansp-media-remove-btn"
							data-input="clouansp_wiki_placeholder_id"
							data-preview="clouansp_wiki_placeholder_preview"
							data-picker="clouansp_wiki_placeholder_btn"
							style="display:<?php echo $clouansp_placeholder_id ? 'inline-block' : 'none'; ?>;"
						><?php esc_html_e( 'Remove', 'clouds-and-spaceships' ); ?></button>
						<p class="description">
							<?php esc_html_e( 'Placeholder for wiki card images. Leave empty to show no image as placeholder.', 'clouds-and-spaceships' ); ?>
						</p>
					</td>
				</tr>
			</table>
		</div>
		<!-- ── Template ─────────────────────────────────────────────── -->
		<div class="clouansp-settings-card">
			<h2><?php esc_html_e( 'Wiki Post Layout', 'clouds-and-spaceships' ); ?></h2>
			<p class="description">
				<?php esc_html_e( 'Default widths for the wiki layout.', 'clouds-and-spaceships' ); ?>
			</p>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row">
						<label for="clouansp_wiki_infobox_width"><?php esc_html_e( 'Infobox default width', 'clouds-and-spaceships' ); ?></label>
					</th>
					<td>
						<input
							type="number"
							id="clouansp_wiki_infobox_width"
							name="clouansp_wiki_settings[infobox_width]"
							value="<?php echo esc_attr( $clouansp_infobox_width ); ?>"
							min="200" max="1280" step="1"
							class="small-text"
							placeholder="360"
						/>
						<span><?php esc_html_e( 'px', 'clouds-and-spaceships' ); ?></span>
						<p class="description">
							<?php esc_html_e( 'Global default maximum width of the infobox. Min. 200 px. Defaults to 360 px. The post content takes the remaining width. Each Infobox block can override this width individually.', 'clouds-and-spaceships' ); ?>
						</p>
					</td>
				</tr>
				<tr>
					<th scope="row">
						<label for="clouansp_wiki_content_width"><?php esc_html_e( 'Content width', 'clouds-and-spaceships' ); ?></label>
					</th>
					<td>
						<input
							type="number"
							id="clouansp_wiki_content_width"
							name="clouansp_wiki_settings[content_width]"
							value="<?php echo esc_attr( $content_width ); ?>"
							min="640" max="3200" step="1"
							class="small-text"
							placeholder="<?php esc_attr_e( 'full', 'clouds-and-spaceships' ); ?>"
							<?php disabled( '', $content_width ); ?>
						/>
						<span><?php esc_html_e( 'px', 'clouds-and-spaceships' ); ?></span>
						<label style="margin-left:8px;">
							<input type="checkbox" class="clouansp-field-clear" data-field="clouansp_wiki_content_width"
								<?php checked( '', $content_width ); ?> />
							<?php esc_html_e( 'Use full width', 'clouds-and-spaceships' ); ?>
						</label>
						<p class="description">
							<?php esc_html_e( 'Maximum width of the wiki post layout, infobox included. Min. 640 px. Check "Use full width" to take up all available space.', 'clouds-and-spaceships' ); ?>
						</p>
					</td>
				</tr>
			</table>
		</div>

		<!-- ── Wiki Contents Grid block defaults ─────────────────────────────────────────── -->
		<div class="clouansp-settings-card">
			<h2><?php esc_html_e( 'Wiki Content Grid defaults', 'clouds-and-spaceships' ); ?></h2>
			<p class="description">
				<?php esc_html_e( 'Default settings for wiki contents block.', 'clouds-and-spaceships' ); ?>
			</p>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row"><?php esc_html_e( 'Grid Columns', 'clouds-and-spaceships' ); ?></th>
					<td>
						<fieldset>
							<label style="display:inline-flex;align-items:center;gap:6px;margin-right:16px;">
								<span><?php esc_html_e( 'Desktop', 'clouds-and-spaceships' ); ?></span>
								<input type="number" name="clouansp_wiki_settings[grid_columns_desktop]"
									value="<?php echo esc_attr( $clouansp_grid_desktop ); ?>" min="1" max="6" step="1" class="small-text" />
							</label>
							<label style="display:inline-flex;align-items:center;gap:6px;margin-right:16px;">
								<span><?php esc_html_e( 'Tablet', 'clouds-and-spaceships' ); ?></span>
								<input type="number" name="clouansp_wiki_settings[grid_columns_tablet]"
									value="<?php echo esc_attr( $clouansp_grid_tablet ); ?>" min="1" max="4" step="1" class="small-text" />
							</label>
							<label style="display:inline-flex;align-items:center;gap:6px;">
								<span><?php esc_html_e( 'Mobile', 'clouds-and-spaceships' ); ?></span>
								<input type="number" name="clouansp_wiki_settings[grid_columns_mobile]"
									value="<?php echo esc_attr( $clouansp_grid_mobile ); ?>" min="1" max="2" step="1" class="small-text" />
							</label>
						</fieldset>
					</td>
				</tr>
				<tr>
					<th scope="row"><?php esc_html_e( 'Gap (px)', 'clouds-and-spaceships' ); ?></th>
					<td>
						<fieldset>
							<label style="display:inline-flex;align-items:center;gap:6px;margin-right:16px;">
								<span><?php esc_html_e( 'Column', 'clouds-and-spaceships' ); ?></span>
								<input type="number" name="clouansp_wiki_settings[grid_column_gap]"
									value="<?php echo esc_attr( $clouansp_grid_col_gap ); ?>" min="0" max="64" step="1" class="small-text" />
							</label>
							<label style="display:inline-flex;align-items:center;gap:6px;">
								<span><?php esc_html_e( 'Row', 'clouds-and-spaceships' ); ?></span>
								<input type="number" name="clouansp_wiki_settings[grid_row_gap]"
									value="<?php echo esc_attr( $clouansp_grid_row_gap ); ?>" min="0" max="64" step="1" class="small-text" />
							</label>
						</fieldset>
					</td>
				</tr>
			</table>
		</div>

		<!-- ── Infobox colours ─────────────────────────────────────── -->
		<div class="clouansp-settings-card">
			<h2><?php esc_html_e( 'Infobox colours', 'clouds-and-spaceships' ); ?></h2>
			<p class="description">
				<?php esc_html_e( 'Default colour settings for infobox blocks. All colors can be overwritten on individual infobox level.', 'clouds-and-spaceships' ); ?>
			</p>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row">
						<label for="clouansp_infobox_bg"><?php esc_html_e( 'Infobox Background', 'clouds-and-spaceships' ); ?></label>
					</th>
					<td>
						<input type="color" id="clouansp_infobox_bg"
							name="clouansp_wiki_settings[infobox_bg_color]"
							value="<?php echo esc_attr( $clouansp_infobox_bg ?: '#ffffff' ); ?>"
							<?php disabled( '', $clouansp_infobox_bg ); ?> />
						<label style="margin-left:8px;">
							<input type="checkbox" class="clouansp-field-clear" data-field="clouansp_infobox_bg"
								<?php checked( '', $clouansp_infobox_bg ); ?> />
							<?php esc_html_e( 'Use theme default', 'clouds-and-spaceships' ); ?>
						</label>
						<p class="description"><?php esc_html_e( 'Background color for the infobox wrapper. Defaults to #ffffff.', 'clouds-and-spaceships' ); ?></p>
					</td>
				</tr>
				<tr>
					<th scope="row">
						<label for="clouansp_infobox_text"><?php esc_html_e( 'Infobox Text', 'clouds-and-spaceships' ); ?></label>
					</th>
					<td>
						<input type="color" id="clouansp_infobox_text"
							name="clouansp_wiki_settings[infobox_text_color]"
							value="<?php echo esc_attr( $clouansp_infobox_text ?: '#000000' ); ?>"
							<?php disabled( '', $clouansp_infobox_text ); ?> />
						<label style="margin-left:8px;">
							<input type="checkbox" class="clouansp-field-clear" data-field="clouansp_infobox_text"
								<?php checked( '', $clouansp_infobox_text ); ?> />
							<?php esc_html_e( 'Use theme default', 'clouds-and-spaceships' ); ?>
						</label>
						<p class="description"><?php esc_html_e( 'Text color for infoboxes, groups and their title bars. Defaults to the theme text color.', 'clouds-and-spaceships' ); ?></p>
					</td>
				</tr>
				<tr>
					<th scope="row">
						<label for="clouansp_infobox_title"><?php esc_html_e( 'Title text', 'clouds-and-spaceships' ); ?></label>
					</th>
					<td>
						<input type="color" id="clouansp_infobox_title"
							name="clouansp_wiki_settings[infobox_title_color]"
							value="<?php echo esc_attr( $clouansp_infobox_title ?: '#000000' ); ?>"
							<?php disabled( '', $clouansp_infobox_title ); ?> />
						<label style="margin-left:8px;">
							<input type="checkbox" class="clouansp-field-clear" data-field="clouansp_infobox_title"
								<?php checked( '', $clouansp_infobox_title ); ?> />
							<?php esc_html_e( 'Use theme default', 'clouds-and-spaceships' ); ?>
						</label>
						<p class="description"><?php esc_html_e( 'Text color for the infobox and group title bars. Defaults to the infobox text color.', 'clouds-and-spaceships' ); ?></p>
					</td>
				</tr>
				<tr>
					<th scope="row">
						<label for="clouansp_infobox_contrast"><?php esc_html_e( 'Title background', 'clouds-and-spaceships' ); ?></label>
					</th>
					<td>
						<input type="color" id="clouansp_infobox_contrast"
							name="clouansp_wiki_settings[infobox_contrast_color]"
							value="<?php echo esc_attr( $clouansp_infobox_contrast ?: '#e0e0e0' ); ?>"
							<?php disabled( '', $clouansp_infobox_contrast ); ?> />
						<label style="margin-left:8px;">
							<input type="checkbox" class="clouansp-field-clear" data-field="clouansp_infobox_contrast"
								<?php checked( '', $clouansp_infobox_contrast ); ?> />
							<?php esc_html_e( 'Use theme default', 'clouds-and-spaceships' ); ?>
						</label>
						<p class="description"><?php esc_html_e( 'Background color for the infobox title bars. Defaults to #e0e0e0.', 'clouds-and-spaceships' ); ?></p>
					</td>
				</tr>

				<tr>
					<th scope="row">
						<label for="clouansp_infobox_accent"><?php esc_html_e( 'Background Accent', 'clouds-and-spaceships' ); ?></label>
					</th>
					<td>
						<input type="color" id="clouansp_infobox_accent"
							name="clouansp_wiki_settings[infobox_accent_color]"
							value="<?php echo esc_attr( $clouansp_infobox_accent ?: '#f2f2f2' ); ?>"
							<?php disabled( '', $clouansp_infobox_accent ); ?> />
						<label style="margin-left:8px;">
							<input type="checkbox" class="clouansp-field-clear" data-field="clouansp_infobox_accent"
								<?php checked( '', $clouansp_infobox_accent ); ?> />
							<?php esc_html_e( 'Use theme default', 'clouds-and-spaceships' ); ?>
						</label>
						<p class="description"><?php esc_html_e( 'Infobox inner group background color. Defaults to #f2f2f2.', 'clouds-and-spaceships' ); ?></p>
					</td>
				</tr>
		
			</table>
			<h4><?php esc_html_e( '*Uncheck to set custom global default', 'clouds-and-spaceships' ); ?></h4>
		</div>

		<!-- ── Danger Zone ──────────────────────────────────────────── -->
		<div class="clouansp-danger-zone">
			<h2><?php esc_html_e( 'Danger Zone', 'clouds-and-spaceships' ); ?></h2>
			<table class="form-table" role="presentation">
				<tr>
					<th scope="row"><?php esc_html_e( 'Uninstall behavior', 'clouds-and-spaceships' ); ?></th>
					<td>
						<label class="clouansp-text-danger">
							<input
								type="checkbox"
								name="clouansp_wiki_settings[wiki_delete_on_uninstall]"
								value="1"
								<?php checked( $clouansp_wiki_delete_on_uninstall ); ?>
							/>
							<?php esc_html_e( 'Delete all wiki posts when the plugin is uninstalled', 'clouds-and-spaceships' ); ?>
						</label>
						<p class="description">
							<?php esc_html_e( 'When unchecked (default), wiki articles are kept after uninstall. Deactivating the plugin does not delete. Only applies when the plugin is deleted.', 'clouds-and-spaceships' ); ?>
						</p>
					</td>
				</tr>
			</table>
		</div>

		<?php submit_button( __( 'Save Settings', 'clouds-and-spaceships' ), 'secondary' ); ?>
	</form>

</div>
