<?php
/**
 * Render callback for the wiki-contents block.
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Rendered inner blocks (manual mode).
 * @var WP_Block $block      Block instance.
 */

defined( 'ABSPATH' ) || exit;

$mode            = $attributes['mode']           ?? 'manual';
$columns_mobile  = intval( $attributes['columnsMobile']  ?? cns_get_wiki_setting( 'grid_columns_mobile',  1 ) );
$columns_tablet  = intval( $attributes['columnsTablet']  ?? cns_get_wiki_setting( 'grid_columns_tablet',  2 ) );
$columns_desktop = intval( $attributes['columnsDesktop'] ?? cns_get_wiki_setting( 'grid_columns_desktop', 3 ) );
$number_of_posts = intval( $attributes['numberOfPosts']  ?? $columns_desktop );
$column_gap      = intval( $attributes['columnGap'] ?? cns_get_wiki_setting( 'grid_column_gap', 16 ) );
$row_gap         = intval( $attributes['rowGap']    ?? cns_get_wiki_setting( 'grid_row_gap',    16 ) );

// CSS custom properties drive the responsive grid via style.scss media queries.
$grid_vars = sprintf(
	'--wiki-columns-mobile:%d;--wiki-columns-tablet:%d;--wiki-columns-desktop:%d;--wiki-column-gap:%dpx;--wiki-row-gap:%dpx;',
	$columns_mobile,
	$columns_tablet,
	$columns_desktop,
	$column_gap,
	$row_gap
);

$wrapper_attrs = get_block_wrapper_attributes( [
	'class' => 'wiki-contents',
	'style' => $grid_vars,
] );

if ( 'newest' === $mode ) {
	$total = $number_of_posts;

	$query = new WP_Query( [
		'post_type'      => 'wiki',
		'posts_per_page' => $total,
		'post_status'    => 'publish',
		'orderby'        => 'date',
		'order'          => 'DESC',
		'no_found_rows'  => true,
	] );

	// Render actual wiki-card blocks so the card markup has a single source.
	$inner = '';
	foreach ( $query->posts as $wiki_post ) {
		$inner .= render_block( [
			'blockName' => 'cns-wiki-suite/wiki-card',
			'attrs'     => [ 'postId' => $wiki_post->ID ],
		] );
	}
} else {
	$inner = $content;
}
?>
<div <?php echo $wrapper_attrs; ?>>
	<div class="wiki-contents__grid">
		<?php echo $inner; ?>
	</div>
</div>
