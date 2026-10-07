<?php

defined('ABSPATH') || exit;

// This screen only reads $_GET to decide what to display — which page, which
// filters, which page of results. Nothing here changes state, so there is no
// action to protect and no nonce to verify; WordPress's own list tables read
// their filters the same way. Every write path in this plugin verifies a nonce
// or goes through the REST API's permission callbacks.
// phpcs:disable WordPress.Security.NonceVerification.Recommended

$delete_icons_on_uninstall = (bool) get_option('clouansp_map_suite_delete_icons_on_uninstall', false);
?>
<div class="clouansp-settings-page clouansp-icon-library">

	<div class="clouansp-settings-page__header">
		<h1><?php esc_html_e('Icon Library', 'clouds-and-spaceships'); ?></h1>
	</div>

	<p class="clouansp-settings-page__intro">
		<?php esc_html_e('SVG icons only (sanitized on upload). Icons uploaded here will be tracked for maps and stories, but will also appear in the global Media Library.', 'clouds-and-spaceships'); ?>
	</p>

	<div id="clouansp-icons-root"></div>

	<?php if (isset($_GET['settings-saved'])) : ?>
		<div class="notice notice-success is-dismissible">
			<p><?php esc_html_e('Settings saved.', 'clouds-and-spaceships'); ?></p>
		</div>
	<?php endif; ?>

	<!-- ── Danger Zone ──────────────────────────────────────────────────────── -->
	<div class="clouansp-danger-zone">
		<h2><?php esc_html_e('Danger Zone', 'clouds-and-spaceships'); ?></h2>
		<form method="post">
			<?php wp_nonce_field('clouansp_map_save_icon_settings'); ?>
			<input type="hidden" name="clouansp_map_action" value="save_icon_settings" />

			<table class="form-table" role="presentation">
				<tr>
					<th scope="row"><?php esc_html_e('Uninstall behaviour', 'clouds-and-spaceships'); ?></th>
					<td>
						<label class="text-danger">
							<input
								type="checkbox"
								name="delete_icons_on_uninstall"
								value="1"
								<?php checked($delete_icons_on_uninstall); ?>
							/>
							<?php esc_html_e('Delete all icons from the Media Library when this plugin is uninstalled', 'clouds-and-spaceships'); ?>
						</label>
						<p class="description">
							<?php esc_html_e('Will remove icons even if they are still used elsewhere on the site.', 'clouds-and-spaceships'); ?>
						</p>
					</td>
				</tr>
			</table>

			<?php submit_button(__('Save Settings', 'clouds-and-spaceships'), 'secondary'); ?>
		</form>
	</div>

</div>
