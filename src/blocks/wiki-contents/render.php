<?php
/**
 * Render callback for the wiki-contents block.
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Rendered inner blocks (manual mode).
 * @var WP_Block $block      Block instance.
 */

defined( 'ABSPATH' ) || exit;

$clouansp_mode            = $attributes['mode']           ?? 'manual';
$clouansp_columns_mobile  = intval( $attributes['columnsMobile']  ?? clouansp_get_wiki_setting( 'grid_columns_mobile',  1 ) );
$clouansp_columns_tablet  = intval( $attributes['columnsTablet']  ?? clouansp_get_wiki_setting( 'grid_columns_tablet',  2 ) );
$clouansp_columns_desktop = intval( $attributes['columnsDesktop'] ?? clouansp_get_wiki_setting( 'grid_columns_desktop', 3 ) );
$clouansp_number_of_posts = intval( $attributes['numberOfPosts']  ?? $clouansp_columns_desktop );
$clouansp_column_gap      = intval( $attributes['columnGap'] ?? clouansp_get_wiki_setting( 'grid_column_gap', 16 ) );
$clouansp_row_gap         = intval( $attributes['rowGap']    ?? clouansp_get_wiki_setting( 'grid_row_gap',    16 ) );

// CSS custom properties drive the responsive grid via style.scss media queries.
$clouansp_grid_vars = sprintf(
	'--clouansp-wiki-columns-mobile:%d;--clouansp-wiki-columns-tablet:%d;--clouansp-wiki-columns-desktop:%d;--clouansp-wiki-column-gap:%dpx;--clouansp-wiki-row-gap:%dpx;',
	$clouansp_columns_mobile,
	$clouansp_columns_tablet,
	$clouansp_columns_desktop,
	$clouansp_column_gap,
	$clouansp_row_gap
);

$clouansp_wrapper_attrs = get_block_wrapper_attributes( [
	'class' => 'clouansp-wiki-contents',
	'style' => $clouansp_grid_vars,
] );

if ( 'newest' === $clouansp_mode ) {
	$clouansp_total = $clouansp_number_of_posts;

	$clouansp_query = new WP_Query( [
		'post_type'      => 'clouansp_wiki',
		'posts_per_page' => $clouansp_total,
		'post_status'    => 'publish',
		'orderby'        => 'date',
		'order'          => 'DESC',
		'no_found_rows'  => true,
	] );

	// Render actual wiki-card blocks so the card markup has a single source.
	$clouansp_inner = '';
	foreach ( $clouansp_query->posts as $clouansp_wiki_post ) {
		$clouansp_inner .= render_block( [
			'blockName' => 'clouansp-wiki-suite/wiki-card',
			'attrs'     => [ 'postId' => $clouansp_wiki_post->ID ],
		] );
	}
} else {
	$clouansp_inner = $content;
}
?>
<div <?php echo $clouansp_wrapper_attrs; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() escapes its own output. ?>>
	<div class="clouansp-wiki-contents__grid">
		<?php echo $clouansp_inner; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- render_block() output, or block inner content. ?>
	</div>
</div>
