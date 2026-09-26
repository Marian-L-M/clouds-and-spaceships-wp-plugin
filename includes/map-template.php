<?php

defined('ABSPATH') || exit;

/**
 * The single template shared by maps and stories.
 *
 * Both post types show the same page: title, the interactive canvas, who wrote
 * it, when it last changed, and the description. One layout file,
 * templates/single-map.html, is registered once per post type so each gets the
 * slug WordPress's template hierarchy actually looks for (single-cns_map,
 * single-cns_story). A theme can still override either by shipping a template
 * of the same name — plugin templates sit below theme templates.
 *
 * This replaces the `the_content` injection both suites used to do. That filter
 * swapped the post content for a rendered block, which meant the page layout
 * lived in the block's markup and could not be edited or overridden. Rendering
 * the canvas from a template also lets the block drop its own description and
 * date, since the template supplies them next to the author.
 *
 * Two slots differ per post type:
 *
 *   {{canvas}}       the map block for maps, the story block for stories. Both
 *                    read their ID from the post context when none is set.
 *   {{description}}  maps keep the description in post_content (the CNS editor's
 *                    Description tab); stories keep it in post_excerpt (the
 *                    story editor's Description field), so they need different
 *                    blocks to show the same thing.
 */
/**
 * Block-bindings source for the "last updated" date.
 *
 * core/post-date's own `displayType: modified` resolves through core's
 * post-data binding, which returns an empty string unless the modified date is
 * later than the publish date — so a map that has never been re-saved shows no
 * date at all. The suite's canvas blocks printed the modified date
 * unconditionally, and the template keeps that: a map page always says when its
 * data was last touched. Bound to `datetime`, which core allows for
 * core/post-date, so the block keeps its own formatting and styling controls.
 */
function cns_register_updated_date_binding(): void {
	register_block_bindings_source('clouds-and-spaceships/updated-date', [
		'label'              => __('Last updated', 'clouds-and-spaceships'),
		'uses_context'       => ['postId'],
		'get_value_callback' => static function (array $source_args, $block_instance): string {
			$post_id = (int) ($block_instance->context['postId'] ?? 0);
			if (! $post_id) {
				return '';
			}
			// ISO 8601 — core/post-date reformats it with its own `format`.
			return (string) (get_the_modified_date('c', $post_id) ?: '');
		},
	]);
}
add_action('init', 'cns_register_updated_date_binding');

function cns_single_map_template_variants(): array {
	return [
		'cns_map' => [
			'slug'        => 'single-cns_map',
			'title'       => __('Single Map', 'clouds-and-spaceships'),
			'description' => __('Template for single map pages.', 'clouds-and-spaceships'),
			'canvas'      => '<!-- wp:cns-map-suite/map /-->',
			'body'        => '<!-- wp:post-content /-->',
		],
		'cns_story' => [
			'slug'        => 'single-cns_story',
			'title'       => __('Single Story', 'clouds-and-spaceships'),
			'description' => __('Template for single story pages.', 'clouds-and-spaceships'),
			'canvas'      => '<!-- wp:cns-story-suite/story /-->',
			// excerptLength is capped at 55 words by default and always applied,
			// so it is raised here: the story description is a written field, not
			// an auto-generated summary, and must not be silently truncated.
			'body'        => '<!-- wp:post-excerpt {"excerptLength":1000} /-->',
		],
	];
}

function cns_register_single_map_template(): void {
	$layout_file = CNS_DIR . 'templates/single-map.html';

	if (! file_exists($layout_file)) {
		return;
	}

	$layout = file_get_contents($layout_file);

	foreach (cns_single_map_template_variants() as $post_type => $variant) {
		// The map and story post types can each be switched off; registering a
		// template for a post type that does not exist would orphan it.
		if (! post_type_exists($post_type)) {
			continue;
		}

		register_block_template('clouds-and-spaceships//' . $variant['slug'], [
			'title'       => $variant['title'],
			'description' => $variant['description'],
			'post_types'  => [$post_type],
			'content'     => strtr($layout, [
				'{{canvas}}'      => $variant['canvas'],
				'{{description}}' => $variant['body'],
			]),
		]);
	}
}
// Priority 20: the map and story post types register at the default priority.
add_action('init', 'cns_register_single_map_template', 20);
