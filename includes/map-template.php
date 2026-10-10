<?php

defined('ABSPATH') || exit;

/**
 * The single template shared by maps and stories.
 *
 * Both post types show the same page: title, the interactive canvas, who wrote
 * it, when it last changed, and the description. One layout file,
 * templates/single-map.html, is registered once per post type so each gets the
 * slug WordPress's template hierarchy actually looks for (single-clouansp_map,
 * single-clouansp_story). A theme can still override either by shipping a template
 * of the same name — plugin templates sit below theme templates.
 *
 * Rendering the canvas from a template lets the block drop its own description
 * and date, since the template supplies them next to the author.
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
function clouansp_register_updated_date_binding(): void {
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
add_action('init', 'clouansp_register_updated_date_binding');

function clouansp_single_map_template_variants(): array {
	return [
		'clouansp_map' => [
			'slug'        => 'single-clouansp_map',
			'title'       => __('Single Map', 'clouds-and-spaceships'),
			'description' => __('Template for single map pages.', 'clouds-and-spaceships'),
			'canvas'      => '<!-- wp:clouansp-map-suite/map /-->',
			'body'        => '<!-- wp:post-content /-->',
		],
		'clouansp_story' => [
			'slug'        => 'single-clouansp_story',
			'title'       => __('Single Story', 'clouds-and-spaceships'),
			'description' => __('Template for single story pages.', 'clouds-and-spaceships'),
			'canvas'      => '<!-- wp:clouansp-story-suite/story /-->',
			// Both blocks ship; clouansp_story_pick_description_block() below drops
			// whichever one does not apply to the post being viewed.
			//
			// excerptLength is capped at 55 words by default and always applied,
			// so it is raised here: the story description is a written field, not
			// an auto-generated summary, and must not be silently truncated.
			'body'        => '<!-- wp:post-content /-->'
				. '<!-- wp:post-excerpt {"excerptLength":1000} /-->',
		],
	];
}

/**
 * Shows a story's written description, whichever field holds it.
 *
 * A story is edited on the CNS canvas page, where the Description field writes
 * to post_excerpt — so the template rendered the excerpt. But clouansp_story also
 * supports 'editor', so anything typed into the post's own content box went to
 * post_content and never appeared on the page.
 *
 * The template now carries both blocks and this keeps exactly one: post_content
 * when the author put something there, the excerpt otherwise.
 *
 * Scoped to the story being viewed — a query loop listing stories elsewhere
 * keeps rendering whichever block it asked for.
 */
function clouansp_story_pick_description_block(string $block_content, array $block, WP_Block $instance): string {
	$name = $block['blockName'] ?? '';
	if ('core/post-content' !== $name && 'core/post-excerpt' !== $name) {
		return $block_content;
	}

	$post_id = (int) ($instance->context['postId'] ?? 0);
	if (! $post_id || 'clouansp_story' !== get_post_type($post_id) || ! is_singular('clouansp_story')) {
		return $block_content;
	}

	// The raw field, not the rendered output: post-content renders before
	// post-excerpt, so there is nothing to inspect by the time this runs for
	// the excerpt. An author who leaves an empty block behind counts as having
	// content, which matches what they see in the editor.
	$has_content = '' !== trim((string) get_post_field('post_content', $post_id));

	if ('core/post-content' === $name) {
		return $has_content ? $block_content : '';
	}
	return $has_content ? '' : $block_content;
}
add_filter('render_block', 'clouansp_story_pick_description_block', 10, 3);

function clouansp_register_single_map_template(): void {
	$layout_file = CLOUANSP_DIR . 'templates/single-map.html';

	if (! file_exists($layout_file)) {
		return;
	}

	$layout = file_get_contents($layout_file);

	foreach (clouansp_single_map_template_variants() as $post_type => $variant) {
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
add_action('init', 'clouansp_register_single_map_template', 20);
