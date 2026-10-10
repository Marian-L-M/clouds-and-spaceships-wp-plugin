<?php
/**
 * Render callback for the wiki-card block.
 *
 * @var array    $attributes Block attributes.
 * @var string   $content    Inner block content (unused – dynamic block).
 * @var WP_Block $block      Block instance.
 */

defined( 'ABSPATH' ) || exit;

$clouansp_post_id    = intval( $attributes['postId'] ?? 0 );
$clouansp_bg_color   = $attributes['backgroundColor'] ?? '#f0f0f0';
$clouansp_text_color = $attributes['textColor'] ?? '';
$clouansp_show_thumb = (bool) ( $attributes['showThumbnail']  ?? true );
$clouansp_show_title = (bool) ( $attributes['showTitle']      ?? true );
$clouansp_show_cats  = (bool) ( $attributes['showCategories'] ?? false );
$clouansp_show_exc   = (bool) ( $attributes['showExcerpt']    ?? true );
$clouansp_show_tags  = (bool) ( $attributes['showTags']       ?? false );
$clouansp_show_link  = (bool) ( $attributes['showLink']       ?? true );

if ( ! $clouansp_post_id ) {
	return;
}

$clouansp_post = get_post( $clouansp_post_id );
if ( ! $clouansp_post || 'publish' !== $clouansp_post->post_status ) {
	return;
}

$clouansp_title   = get_the_title( $clouansp_post );
$clouansp_link    = get_permalink( $clouansp_post );
$clouansp_excerpt = get_the_excerpt( $clouansp_post );
$clouansp_thumb   = $clouansp_show_thumb ? get_the_post_thumbnail_url( $clouansp_post_id, 'medium' ) : '';

// Colors must be actual color values — a raw attribute could otherwise
// smuggle extra declarations into the style attribute.
$clouansp_sanitize_color = static function ( string $value ): string {
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

$clouansp_bg_color   = $clouansp_sanitize_color( (string) $clouansp_bg_color ) ?: '#f0f0f0';
$clouansp_text_color = $clouansp_sanitize_color( (string) $clouansp_text_color );

$clouansp_inline_style = 'background-color:' . esc_attr( $clouansp_bg_color ) . ';';
if ( $clouansp_text_color ) {
	$clouansp_inline_style .= 'color:' . esc_attr( $clouansp_text_color ) . ';';
}

$clouansp_wrapper = get_block_wrapper_attributes( [
	'class' => 'clouansp-wiki-card',
	'style' => $clouansp_inline_style,
] );
?>
<div <?php echo $clouansp_wrapper; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- get_block_wrapper_attributes() escapes its own output. ?>>

	<?php if ( $clouansp_show_thumb && $clouansp_thumb ) : ?>
		<div class="clouansp-wiki-card__thumbnail">
			<img
				src="<?php echo esc_url( $clouansp_thumb ); ?>"
				alt="<?php echo esc_attr( $clouansp_title ); ?>"
				loading="lazy"
			>
		</div>
	<?php endif; ?>

	<?php if ( $clouansp_show_title ) : ?>
		<h3 class="clouansp-wiki-card__title"><?php echo esc_html( $clouansp_title ); ?></h3>
	<?php endif; ?>

	<?php if ( $clouansp_show_cats ) :
		$clouansp_categories = get_the_terms( $clouansp_post_id, 'category' );
		if ( $clouansp_categories && ! is_wp_error( $clouansp_categories ) ) : ?>
			<div class="clouansp-wiki-card__categories">
				<?php foreach ( $clouansp_categories as $clouansp_cat ) : ?>
					<a class="clouansp-wiki-card__term clouansp-wiki-card__term--category"
					   href="<?php echo esc_url( get_term_link( $clouansp_cat ) ); ?>">
						<?php echo esc_html( $clouansp_cat->name ); ?>
					</a>
				<?php endforeach; ?>
			</div>
		<?php endif;
	endif; ?>

	<?php if ( $clouansp_show_exc && $clouansp_excerpt ) : ?>
		<div class="clouansp-wiki-card__excerpt"><?php echo wp_kses_post( $clouansp_excerpt ); ?></div>
	<?php endif; ?>

	<?php if ( $clouansp_show_tags ) :
		$clouansp_tags = get_the_terms( $clouansp_post_id, 'post_tag' );
		if ( $clouansp_tags && ! is_wp_error( $clouansp_tags ) ) : ?>
			<div class="clouansp-wiki-card__tags">
				<?php foreach ( $clouansp_tags as $clouansp_tag ) : ?>
					<a class="clouansp-wiki-card__term clouansp-wiki-card__term--tag"
					   href="<?php echo esc_url( get_term_link( $clouansp_tag ) ); ?>">
						<?php echo esc_html( $clouansp_tag->name ); ?>
					</a>
				<?php endforeach; ?>
			</div>
		<?php endif;
	endif; ?>

	<?php if ( $clouansp_show_link ) : ?>
		<a class="clouansp-wiki-card__link" href="<?php echo esc_url( $clouansp_link ); ?>">
			<?php esc_html_e( 'Read more', 'clouds-and-spaceships' ); ?>
		</a>
	<?php endif; ?>

</div>
