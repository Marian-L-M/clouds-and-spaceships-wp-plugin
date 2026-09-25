<?php
defined('ABSPATH') || exit;

// This screen only reads $_GET to decide what to display — which page, which
// filters, which page of results. Nothing here changes state, so there is no
// action to protect and no nonce to verify; WordPress's own list tables read
// their filters the same way. Every write path in this plugin verifies a nonce
// or goes through the REST API's permission callbacks.
// phpcs:disable WordPress.Security.NonceVerification.Recommended

$story_id = isset($_GET['story_id']) ? (int) $_GET['story_id'] : 0;
$story    = $story_id ? get_post($story_id) : null;
$is_new   = (! $story || $story->post_type !== 'cns_story');

$overview_url = add_query_arg(
	['page' => CNS_STORY_PAGE_SETTINGS],
	admin_url('admin.php')
);

$view_url = (! $is_new && $story && in_array($story->post_status, ['publish', 'private'], true))
	? get_permalink($story->ID)
	: '';

$substory_base_url = add_query_arg(['post_type' => 'cns_substory'], admin_url('edit.php'));
?>
<script>
window.cnsStoryEditor = {
	storyId:          <?php echo (int) $story_id; ?>,
	isNew:            <?php echo $is_new ? 'true' : 'false'; ?>,
	status:           <?php echo wp_json_encode($story ? $story->post_status : 'draft'); ?>,
	title:            <?php echo wp_json_encode($story ? $story->post_title : ''); ?>,
	overviewUrl:      <?php echo wp_json_encode($overview_url); ?>,
	viewUrl:          <?php echo wp_json_encode($view_url ?: ''); ?>,
	substoryBaseUrl:  <?php echo wp_json_encode($substory_base_url); ?>,
};
</script>

<div id="cns-admin-root"></div>
