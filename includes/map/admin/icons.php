<?php

defined('ABSPATH') || exit;

/**
 * SVG Upload Support
 * ------------------
 * WordPress blocks SVG uploads by default because SVGs can embed executable
 * JavaScript. We enable them only for users with clouansp_manage_maps and run every
 * upload through a DOMDocument-based sanitizer that strips <script>,
 * <foreignObject>, event handler attributes (on*), and javascript: href values.
 *
 * Icons are stored as regular WP attachments tagged with _clouansp_map_icon meta.
 */

// Allow SVG mime type — clouansp_manage_maps users only.
add_filter('upload_mimes', 'clouansp_map_suite_allow_svg');

function clouansp_map_suite_allow_svg(array $mimes): array {
	if (current_user_can('clouansp_manage_maps')) {
		$mimes['svg'] = 'image/svg+xml';
	}
	return $mimes;
}

// WP 4.7.1+ validates file content against the declared extension.
// SVGs are XML, not a binary image type, so the check fails without this.
add_filter('wp_check_filetype_and_ext', 'clouansp_map_suite_svg_filetype_fix', 10, 3);

function clouansp_map_suite_svg_filetype_fix(array $checked, string $file, string $filename): array {
	if (!current_user_can('clouansp_manage_maps')) {
		return $checked;
	}
	if (strtolower(pathinfo($filename, PATHINFO_EXTENSION)) === 'svg') {
		$checked['ext']  = 'svg';
		$checked['type'] = 'image/svg+xml';
	}
	return $checked;
}

// Sanitize SVG content before the file is written to disk. Form and multipart
// REST uploads run the upload prefilter; raw-body REST uploads and sideloads run
// the sideload one.
add_filter('wp_handle_upload_prefilter', 'clouansp_map_suite_sanitize_svg_on_upload');
add_filter('wp_handle_sideload_prefilter', 'clouansp_map_suite_sanitize_svg_on_upload');

function clouansp_map_suite_sanitize_svg_on_upload(array $file): array {
	// Decided by extension, not $file['type']: the type is whatever the client
	// sent, while the extension is what clouansp_map_suite_svg_filetype_fix()
	// turns into image/svg+xml further on.
	if (! empty($file['error']) || strtolower(pathinfo($file['name'] ?? '', PATHINFO_EXTENSION)) !== 'svg') {
		return $file;
	}

	$content = file_get_contents($file['tmp_name']);
	if ($content === false) {
		$file['error'] = __('Could not read SVG file.', 'clouds-and-spaceships');
		return $file;
	}

	$clean = clouansp_map_suite_sanitize_svg($content);
	if ($clean === false) {
		$file['error'] = __('SVG sanitization failed — ensure the file is valid XML.', 'clouds-and-spaceships');
		return $file;
	}

	file_put_contents($file['tmp_name'], $clean);
	return $file;
}

/**
 * Strips executable content from an SVG string using DOMDocument.
 *
 * Rejected outright: documents that declare entities (the browser would
 * expand them again after sanitizing) and documents whose root is not <svg>.
 *
 * Removed: <script>, <foreignObject>, <iframe>, <object>, <embed>, processing
 * instructions, event handler attributes (on*), <animate>/<set> elements that
 * rewrite an href, and href/xlink:href values that are javascript: URLs or
 * data: URLs other than raster images. Element and attribute names are matched
 * case-insensitively and regardless of namespace prefix.
 *
 * Preserved: fill, stroke, style attributes and presentation attributes
 * needed for valid icon rendering.
 */
function clouansp_map_suite_sanitize_svg(string $content): string|false {
	if (stripos($content, '<!ENTITY') !== false) {
		return false;
	}

	$doc = new DOMDocument();
	libxml_use_internal_errors(true);
	$ok = $doc->loadXML($content, LIBXML_NONET | LIBXML_NOERROR);
	libxml_clear_errors();

	if (!$ok || strtolower($doc->documentElement?->localName ?? '') !== 'svg') {
		return false;
	}

	$xpath = new DOMXPath($doc);

	foreach (iterator_to_array($xpath->query('//processing-instruction()') ?: []) as $node) {
		$node->parentNode?->removeChild($node);
	}

	$blocked = ['script', 'foreignobject', 'iframe', 'object', 'embed'];

	// Snapshot the list first: it is live, and removing nodes while walking it
	// would skip elements.
	foreach (iterator_to_array($doc->getElementsByTagName('*'), false) as $el) {
		/** @var DOMElement $el */
		$name = strtolower($el->localName);

		$rewrites_href = in_array($name, ['animate', 'set'], true)
			&& in_array(strtolower(trim($el->getAttribute('attributeName'))), ['href', 'xlink:href'], true);

		if (in_array($name, $blocked, true) || $rewrites_href) {
			$el->parentNode?->removeChild($el);
			continue;
		}

		// Not preserving keys: href and xlink:href would collide on them.
		foreach (iterator_to_array($el->attributes, false) as $attr) {
			/** @var DOMAttr $attr */
			$attr_name = strtolower($attr->localName);
			if (str_starts_with($attr_name, 'on')
				|| ($attr_name === 'href' && clouansp_map_suite_svg_url_is_unsafe($attr->value))) {
				$el->removeAttributeNode($attr);
			}
		}
	}

	return $doc->saveXML() ?: false;
}

/**
 * Whether an SVG link target could run script. Browsers ignore whitespace and
 * control characters inside a URL scheme, and the parser has already decoded
 * entities, so both are normalised away before the scheme is compared.
 */
function clouansp_map_suite_svg_url_is_unsafe(string $url): bool {
	$url = strtolower((string) preg_replace('/[\x00-\x20]+/', '', $url));

	if (str_starts_with($url, 'javascript:')) {
		return true;
	}

	return str_starts_with($url, 'data:') && ! preg_match('#^data:image/(png|jpe?g|gif|webp)[;,]#', $url);
}
