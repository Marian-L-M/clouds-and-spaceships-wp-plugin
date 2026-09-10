<?php

defined('ABSPATH') || exit;

/**
 * SVG Upload Support
 * ------------------
 * WordPress blocks SVG uploads by default because SVGs can embed executable
 * JavaScript. We enable them only for users with manage_maps and run every
 * upload through a DOMDocument-based sanitizer that strips <script>,
 * <foreignObject>, event handler attributes (on*), and javascript: href values.
 *
 * Icons are stored as regular WP attachments tagged with _cns_map_icon meta.
 */

// Allow SVG mime type — manage_maps users only.
add_filter('upload_mimes', 'cns_map_suite_allow_svg');

function cns_map_suite_allow_svg(array $mimes): array {
	if (current_user_can('manage_maps')) {
		$mimes['svg'] = 'image/svg+xml';
	}
	return $mimes;
}

// WP 4.7.1+ validates file content against the declared extension.
// SVGs are XML, not a binary image type, so the check fails without this.
add_filter('wp_check_filetype_and_ext', 'cns_map_suite_svg_filetype_fix', 10, 3);

function cns_map_suite_svg_filetype_fix(array $checked, string $file, string $filename): array {
	if (!current_user_can('manage_maps')) {
		return $checked;
	}
	if (strtolower(pathinfo($filename, PATHINFO_EXTENSION)) === 'svg') {
		$checked['ext']  = 'svg';
		$checked['type'] = 'image/svg+xml';
	}
	return $checked;
}

// Sanitize SVG content before the file is written to disk.
add_filter('wp_handle_upload_prefilter', 'cns_map_suite_sanitize_svg_on_upload');

function cns_map_suite_sanitize_svg_on_upload(array $file): array {
	if (($file['type'] ?? '') !== 'image/svg+xml') {
		return $file;
	}

	$content = file_get_contents($file['tmp_name']);
	if ($content === false) {
		$file['error'] = __('Could not read SVG file.', 'clouds-and-spaceships');
		return $file;
	}

	$clean = cns_map_suite_sanitize_svg($content);
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
 * Removed: <script>, <foreignObject>, <iframe>, <object>, <embed>,
 * event handler attributes (on*), javascript: href values.
 *
 * Preserved: fill, stroke, style attributes and presentation attributes
 * needed for valid icon rendering.
 */
function cns_map_suite_sanitize_svg(string $content): string|false {
	$doc = new DOMDocument();
	libxml_use_internal_errors(true);
	$ok = $doc->loadXML($content, LIBXML_NONET | LIBXML_NOERROR);
	libxml_clear_errors();

	if (!$ok) {
		return false;
	}

	foreach (['script', 'foreignObject', 'iframe', 'object', 'embed'] as $tag) {
		foreach (iterator_to_array($doc->getElementsByTagName($tag)) as $node) {
			$node->parentNode?->removeChild($node);
		}
	}

	$xpath = new DOMXPath($doc);

	foreach (iterator_to_array($xpath->query('//@*[starts-with(name(), "on")]') ?: []) as $attr) {
		/** @var DOMAttr $attr */
		$attr->ownerElement?->removeAttributeNode($attr);
	}

	foreach (iterator_to_array($xpath->query('//@href[starts-with(normalize-space(.), "javascript:")]') ?: []) as $attr) {
		/** @var DOMAttr $attr */
		$attr->ownerElement?->removeAttributeNode($attr);
	}

	return $doc->saveXML() ?: false;
}
