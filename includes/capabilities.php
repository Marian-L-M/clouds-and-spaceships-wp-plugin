<?php

defined('ABSPATH') || exit;

/**
 * Primitive capabilities the plugin adds, and the roles that get them on
 * activation. Other roles can be granted them with a role management plugin
 * (e.g. Members).
 */
const CLOUANSP_CAPABILITIES = ['clouansp_manage_maps', 'clouansp_manage_stories'];

function clouansp_add_capabilities(): void {
	$role = get_role('administrator');
	if (! $role) {
		return;
	}
	foreach (CLOUANSP_CAPABILITIES as $cap) {
		$role->add_cap($cap);
	}
}

/**
 * Removes the suite's capabilities from every role.
 *
 * Called from uninstall.php only. Deactivation deliberately leaves them in
 * place, because it is reversible and stripping capabilities would lock an
 * administrator out of the plugin's screens on re-activation.
 */
function clouansp_remove_capabilities(): void {
	foreach (array_keys(wp_roles()->roles) as $role_name) {
		$role = get_role($role_name);
		if (! $role) {
			continue;
		}
		foreach (CLOUANSP_CAPABILITIES as $cap) {
			if ($role->has_cap($cap)) {
				$role->remove_cap($cap);
			}
		}
	}
}
