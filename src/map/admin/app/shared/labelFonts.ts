/**
 * Canvas label font choices, shared by the area and hierarchy region forms.
 *
 * Keep in sync with cns_map_suite_label_font_families() in
 * includes/admin/api.php — the REST layer rejects any family not on that list,
 * because canvas silently ignores an entire `ctx.font` assignment it cannot
 * parse, which would drop the size along with the family.
 */
export const LABEL_FONTS: { value: string; label: string }[] = [
	{ value: 'sans-serif', label: 'Sans-serif' },
	{ value: 'serif', label: 'Serif' },
	{ value: 'monospace', label: 'Monospace' },
	{ value: 'Georgia, serif', label: 'Georgia' },
	{ value: '"Times New Roman", serif', label: 'Times New Roman' },
	{ value: 'Arial, sans-serif', label: 'Arial' },
	{ value: 'Verdana, sans-serif', label: 'Verdana' },
	{ value: '"Trebuchet MS", sans-serif', label: 'Trebuchet MS' },
	{ value: '"Courier New", monospace', label: 'Courier New' },
];
