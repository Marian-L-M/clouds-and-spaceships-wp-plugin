<?php

defined('ABSPATH') || exit;

/**
 * Primitive capabilities the suite adds, and the roles that get them on
 * activation. Other roles can be granted them with a role management plugin
 * (e.g. Members).
 *
 * Was one file per suite before the merge; the two lists differed only in the
 * capability name.
 */
const CNS_CAPABILITIES = ['manage_maps', 'manage_stories'];

function cns_add_capabilities(): void {
	$role = get_role('administrator');
	if (! $role) {
		return;
	}
	foreach (CNS_CAPABILITIES as $cap) {
		$role->add_cap($cap);
	}
}

/**
 * Removes the suite's capabilities from all roles.
 * Called only from uninstall.php — not on deactivation, because deactivation
 * is reversible and stripping capabilities would break re-activation.
 */
function cns_remove_capabilities(): void {
	foreach (array_keys(wp_roles()->roles) as $role_name) {
		$role = get_role($role_name);
		if (! $role) {
			continue;
		}
		foreach (CNS_CAPABILITIES as $cap) {
			if ($role->has_cap($cap)) {
				$role->remove_cap($cap);
			}
		}
	}
}
