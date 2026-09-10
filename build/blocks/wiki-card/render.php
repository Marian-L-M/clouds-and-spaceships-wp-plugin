<?php
/**
 * Render callback for the wiki-card block.
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Inner block content (unused – dynamic block).
 * @var WP_Block $block      Block instance.
 */

defined( 'ABSPATH' ) || exit;

$post_id    = intval( $attributes['postId'] ?? 0 );
$bg_color   = $attributes['backgroundColor'] ?? '#f0f0f0';
$text_color = $attributes['textColor'] ?? '';
$show_thumb = (bool) ( $attributes['showThumbnail']  ?? true );
$show_title = (bool) ( $attributes['showTitle']      ?? true );
$show_cats  = (bool) ( $attributes['showCategories'] ?? false );
$show_exc   = (bool) ( $attributes['showExcerpt']    ?? true );
$show_tags  = (bool) ( $attributes['showTags']       ?? false );
$show_link  = (bool) ( $attributes['showLink']       ?? true );

if ( ! $post_id ) {
	return;
}

$post = get_post( $post_id );
if ( ! $post || 'publish' !== $post->post_status ) {
	return;
}

$title   = get_the_title( $post );
$link    = get_permalink( $post );
$excerpt = get_the_excerpt( $post );
$thumb   = $show_thumb ? get_the_post_thumbnail_url( $post_id, 'medium' ) : '';

// Colors must be actual color values — a raw attribute could otherwise
// smuggle extra declarations into the style attribute.
$sanitize_color = static function ( string $value ): string {
	if ( sanitize_hex_color( $value ) ) {
		return $value;
	}
	if ( preg_match( '/^(rgb|rgba|hsl|hsla)\([\d\s.,%\/]+\)$/', $value ) ) {
		return $value;
	}
	if ( preg_match( '/^var\(--[a-zA-Z0-9-]+\)$/', $value ) ) {
		return $value;
	}
	return '';
};

$bg_color   = $sanitize_color( (string) $bg_color ) ?: '#f0f0f0';
$text_color = $sanitize_color( (string) $text_color );

$inline_style = 'background-color:' . esc_attr( $bg_color ) . ';';
if ( $text_color ) {
	$inline_style .= 'color:' . esc_attr( $text_color ) . ';';
}

$wrapper = get_block_wrapper_attributes( [
	'class' => 'wiki-card',
	'style' => $inline_style,
] );
?>
<div <?php echo $wrapper; ?>>

	<?php if ( $show_thumb && $thumb ) : ?>
		<div class="wiki-card__thumbnail">
			<img
				src="<?php echo esc_url( $thumb ); ?>"
				alt="<?php echo esc_attr( $title ); ?>"
				loading="lazy"
			>
		</div>
	<?php endif; ?>

	<?php if ( $show_title ) : ?>
		<h3 class="wiki-card__title"><?php echo esc_html( $title ); ?></h3>
	<?php endif; ?>

	<?php if ( $show_cats ) :
		$categories = get_the_terms( $post_id, 'category' );
		if ( $categories && ! is_wp_error( $categories ) ) : ?>
			<div class="wiki-card__categories">
				<?php foreach ( $categories as $cat ) : ?>
					<a class="wiki-card__term wiki-card__term--category"
					   href="<?php echo esc_url( get_term_link( $cat ) ); ?>">
						<?php echo esc_html( $cat->name ); ?>
					</a>
				<?php endforeach; ?>
			</div>
		<?php endif;
	endif; ?>

	<?php if ( $show_exc && $excerpt ) : ?>
		<div class="wiki-card__excerpt"><?php echo wp_kses_post( $excerpt ); ?></div>
	<?php endif; ?>

	<?php if ( $show_tags ) :
		$tags = get_the_terms( $post_id, 'post_tag' );
		if ( $tags && ! is_wp_error( $tags ) ) : ?>
			<div class="wiki-card__tags">
				<?php foreach ( $tags as $tag ) : ?>
					<a class="wiki-card__term wiki-card__term--tag"
					   href="<?php echo esc_url( get_term_link( $tag ) ); ?>">
						<?php echo esc_html( $tag->name ); ?>
					</a>
				<?php endforeach; ?>
			</div>
		<?php endif;
	endif; ?>

	<?php if ( $show_link ) : ?>
		<a class="wiki-card__link" href="<?php echo esc_url( $link ); ?>">
			<?php esc_html_e( 'Read more', 'clouds-and-spaceships' ); ?>
		</a>
	<?php endif; ?>

</div>
