<?php

defined('ABSPATH') || exit;

$map_id    = isset($_GET['map_id']) ? (int) $_GET['map_id'] : 0;
$map       = $map_id ? get_post($map_id) : null;
$is_new    = (! $map || $map->post_type !== 'maps');
$is_master = $map_id ? (bool) get_post_meta($map_id, '_cns_map_is_master', true) : false;

$meta = $map_id ? [
    'featured'     => (bool) get_post_meta($map_id, '_cns_map_featured', true),
    'width'        => (int) (get_post_meta($map_id, '_cns_map_width', true) ?: 1000),
    'aspect_ratio' => (float) (get_post_meta($map_id, '_cns_map_aspect_ratio', true) ?: 1.0),
    'time'         => (int) get_post_meta($map_id, '_cns_map_time', true),
    'image_id'     => (int) get_post_meta($map_id, '_cns_map_image_id', true),
    'image_x'      => (float) get_post_meta($map_id, '_cns_map_image_x', true),
    'image_y'      => (float) get_post_meta($map_id, '_cns_map_image_y', true),
    'image_width'  => (float) (get_post_meta($map_id, '_cns_map_image_width', true) ?: 1.0),
    'bg_type'      => get_post_meta($map_id, '_cns_map_bg_type', true) ?: 'color',
    'bg_color'     => get_post_meta($map_id, '_cns_map_bg_color', true) ?: '#1a1a2e',
    'bg_image_id'  => (int) get_post_meta($map_id, '_cns_map_bg_image_id', true),
] : [
    'featured' => false, 'width' => 1000, 'aspect_ratio' => 1.0,
    'time' => 0, 'image_id' => 0, 'image_x' => 0.0, 'image_y' => 0.0, 'image_width' => 1.0,
    'bg_type' => 'color', 'bg_color' => '#1a1a2e', 'bg_image_id' => 0,
];

$image_url      = $meta['image_id']    ? wp_get_attachment_image_url($meta['image_id'], 'large') : '';
$bg_image_url   = $meta['bg_image_id'] ? wp_get_attachment_image_url($meta['bg_image_id'], 'large') : '';
$thumbnail_id   = $map_id ? (int) get_post_thumbnail_id($map_id) : 0;
$thumbnail_url  = $thumbnail_id ? (wp_get_attachment_image_url($thumbnail_id, 'medium') ?: '') : '';
$overview_url = add_query_arg(
    ['page' => CNS_MAP_PAGE_SETTINGS_MAPS],
    admin_url('admin.php')
);
$view_url = (! $is_new && $map && in_array($map->post_status, ['publish', 'private'], true))
    ? get_permalink($map->ID)
    : '';

// Parent maps — maps that include this map as a hierarchy child region.
$parent_maps = [];
if ($map_id && ! $is_new) {
    global $wpdb;
    $parent_rows = $wpdb->get_results(
        $wpdb->prepare(
            "SELECT parent_map_id FROM {$wpdb->prefix}cns_map_hierarchy WHERE child_map_id = %d",
            $map_id
        ),
        ARRAY_A
    );
    foreach ($parent_rows as $row) {
        $parent   = get_post((int) $row['parent_map_id']);
        if (!$parent || $parent->post_type !== 'maps') continue;
        $image_id = (int) get_post_meta($parent->ID, '_cns_map_image_id', true);
        $parent_maps[] = [
            'map_id'    => $parent->ID,
            'title'     => $parent->post_title ?: __('(no title)', 'clouds-and-spaceships'),
            'thumbnail' => $image_id ? (wp_get_attachment_image_url($image_id, 'thumbnail') ?: '') : '',
            'url'       => add_query_arg(['page' => CNS_MAP_PAGE_EDITOR, 'map_id' => $parent->ID], admin_url('admin.php')),
        ];
    }
}
?>
<script>
window.cnsMapEditor = {
    storiesOverviewUrl: <?php echo wp_json_encode(add_query_arg(['page' => CNS_STORY_PAGE_SETTINGS], admin_url('admin.php'))); ?>,
    mapId:       <?php echo (int) $map_id; ?>,
    isNew:       <?php echo $is_new ? 'true' : 'false'; ?>,
    status:      <?php echo wp_json_encode($map ? $map->post_status : 'draft'); ?>,
    title:       <?php echo wp_json_encode($map ? $map->post_title : ''); ?>,
    description: <?php echo wp_json_encode($map ? $map->post_content : ''); ?>,
    width:       <?php echo (int) $meta['width']; ?>,
    aspectRatio: <?php echo (float) $meta['aspect_ratio']; ?>,
    time:        <?php echo (int) $meta['time']; ?>,
    imageId:     <?php echo (int) $meta['image_id']; ?>,
    imageUrl:    <?php echo wp_json_encode($image_url ?: ''); ?>,
    imageX:      <?php echo (float) $meta['image_x']; ?>,
    imageY:      <?php echo (float) $meta['image_y']; ?>,
    imageWidth:  <?php echo (float) $meta['image_width']; ?>,
    isMaster:    <?php echo $is_master ? 'true' : 'false'; ?>,
    featured:    <?php echo $meta['featured'] ? 'true' : 'false'; ?>,
    bgType:      <?php echo wp_json_encode($meta['bg_type']); ?>,
    bgColor:     <?php echo wp_json_encode($meta['bg_color']); ?>,
    bgImageId:    <?php echo (int) $meta['bg_image_id']; ?>,
    bgImageUrl:   <?php echo wp_json_encode($bg_image_url ?: ''); ?>,
    thumbnailId:  <?php echo $thumbnail_id; ?>,
    thumbnailUrl: <?php echo wp_json_encode($thumbnail_url); ?>,
    overviewUrl:  <?php echo wp_json_encode($overview_url); ?>,
    viewUrl:     <?php echo wp_json_encode($view_url); ?>,
    parentMaps:  <?php echo wp_json_encode($parent_maps); ?>,
};
</script>

<div id="cns-admin-root"></div>
