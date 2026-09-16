<?php

defined('ABSPATH') || exit;

$delete_icons_on_uninstall = (bool) get_option('cns_map_suite_delete_icons_on_uninstall', false);
?>
<div class="cns-settings-page cns-icon-library">

	<div class="cns-settings-page__header">
		<h1><?php esc_html_e('Icon Library', 'clouds-and-spaceships'); ?></h1>
	</div>

	<p class="cns-settings-page__intro">
		<?php esc_html_e('SVG icons added here are available as object icons across all maps. Only SVG files are accepted and are sanitized on upload to remove executable content.', 'clouds-and-spaceships'); ?>
	</p>

	<div id="cns-icons-root"></div>

	<?php if (isset($_GET['settings-saved'])) : ?>
		<div class="notice notice-success is-dismissible">
			<p><?php esc_html_e('Settings saved.', 'clouds-and-spaceships'); ?></p>
		</div>
	<?php endif; ?>

	<!-- ── Danger Zone ──────────────────────────────────────────────────────── -->
	<div class="cns-danger-zone">
		<h2><?php esc_html_e('Uninstall behaviour', 'clouds-and-spaceships'); ?></h2>
		<form method="post">
			<?php wp_nonce_field('cns_map_save_icon_settings'); ?>
			<input type="hidden" name="cns_map_action" value="save_icon_settings" />

			<table class="form-table" role="presentation">
				<tr>
					<th scope="row"><?php esc_html_e('Icon files', 'clouds-and-spaceships'); ?></th>
					<td>
						<label>
							<input
								type="checkbox"
								name="delete_icons_on_uninstall"
								value="1"
								<?php checked($delete_icons_on_uninstall); ?>
							/>
							<?php esc_html_e('Delete icon library SVGs from the Media Library when this plugin is uninstalled', 'clouds-and-spaceships'); ?>
						</label>
						<p class="description">
							<?php esc_html_e('Icons are ordinary media attachments that this plugin only tags — removing one from the library here leaves the file in place. Ticking this deletes those files outright on uninstall, including any still used elsewhere on the site, such as inside posts. When unchecked (default), the files are kept and only the tag marking them as map icons is removed.', 'clouds-and-spaceships'); ?>
						</p>
					</td>
				</tr>
			</table>

			<?php submit_button(__('Save Settings', 'clouds-and-spaceships'), 'secondary'); ?>
		</form>
	</div>

</div>
