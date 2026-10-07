This is a review of the file clouds-and-spaceships.zip submitted 18 hours ago. Test it on Playground.

👋 namatamagodev - Let’s improve your plugin!

Thank you for submitting your plugin, "Clouds and Spaceships".

Our volunteer reviewers, tools, and/or AI aids identified issues in your plugin that require your attention.

We’ve pended your submission to give you a chance to review and fix these common issues.

🤖 Please note that this message was generated using a combination of humans, algorithms, and AI in varying proportions. It may not have been reviewed by a human. All AI outputs are marked with the ✨ emoji. Pay attention to it, it's quite accurate.

Who are we?

The WordPress.org Plugins Directory is a service that the WordPress community offers to the world: free hosting, distribution and updates for more than 65,000 plugins, available to every WordPress site at no cost. This is made possible by the WordPress Foundation, the donated infrastructure that supports WordPress.org, and the volunteers who keep it running.

Being listed in the directory is not a commercial service and should not be taken for granted; it is an invitation to be part of this community, and it comes with the shared responsibility of keeping the directory safe and reliable for the millions of users who trust it.

We, the Plugins Team, are a group of volunteers who help you identify common issues so that you can make your plugin more secure, compatible, reliable and compliant with the guidelines. For consistency and better communication, your review is assigned to a single volunteer who will assist you throughout the entire process.

The review process

An email envelope.	1. Read this email carefully from start to finish. Review every issue, including the linked documentation and the provided examples. Then search your codebase for other occurrences of the same issues, even if they are not explicitly mentioned in this review. Take the time to understand each issue so you can apply what you learn to your plugin going forward.
A plugin author fixing the issues.	2. Address all identified issues, test your plugin thoroughly and upload a corrected version. If you have doubts about a specific issue, fix everything else and ask your questions alongside the update.

Note: The Plugins Team volunteers are not your developers or QA team. They are here to help you identify and understand issues so that you can improve and maintain your plugin in the future. Finding and fixing these issues remains your responsibility.
A volunteer reviewing the plugin.	3. Reply to this email thread (do not create a new email or reply to the submission confirmation). Your plugin will then be added to your reviewer's queue, and they will send you any remaining issues that are identified.
A new review of the plugin.	4. Once no further issues remain, your plugin will be approved 🎉

Fewer review cycles mean quicker approval, while multiple rounds can extend the process to weeks or months.

Before you reply

A warning.	Throughout the entire process, and before you reply, please ensure that:
You have addressed all reported issues and thoroughly tested your plugin. Make sure your updated version does not introduce new issues, such as fatal errors during activation.
You are replying to this email thread.
Your reply is brief and to the point. Include only information that is relevant for the next review; there is no need to describe every change you made, and please avoid unnecessary verbosity or AI-generated filler.
If you wish to alter your permalink (aka the plugin slug) "clouds-and-spaceships", you have explicitly stated your desired permalink in your reply. Changing the display name alone is not sufficient, and permalinks cannot be altered after approval.
You are making meaningful progress between review rounds. Updates that resolve only a small portion of the reported issues delay the review process, and the plugin may be rejected out of respect for the volunteers' time and other plugin authors waiting in the queue. Plugins rejected under these circumstances will not be reviewed again.
You treat the review as a learning opportunity and improve your knowledge of development practices and the directory guidelines accordingly.
Each volunteer may review hundreds of plugins every week. Following these indications and submitting a well-tested update makes the review process smoother for everyone.

Response times

Reviews are handled by volunteers alongside their own personal and job commitments, so response times depend entirely on their availability. You may receive a reply within a few days, after a week or two, or occasionally after a longer period. We appreciate your patience and understanding.

Please avoid requesting status updates unless you have been waiting an unusually long time (a month or more). Status requests do not accelerate the review; they slow it down by taking time away from the volunteers working through the queue. If you have replied to this email thread, you are in the queue. If you believe a reply went missing, check your spam folder and other inboxes first; if you have lost this email, write to us from the same address we sent it to and request that it be resent.

Guidelines

In addition to code quality, security and functionality, all plugins must adhere to the guidelines you accepted when submitting this plugin. Please keep them in mind when making changes: https://developer.wordpress.org/plugins/wordpress-org/detailed-plugin-guidelines/.

Please note that failure to follow the Plugins Directory guidelines is taken seriously and may result in the loss of your WordPress.org plugin hosting privileges.


Have you read the guidelines and this plugin complies with them?

Upon submitting your plugin, you agreed and confirmed that it complies with the WordPress.org Plugin Directory Guidelines, which apply to all plugins in the directory.

Our automated tools have detected patterns that may require a closer look regarding compliance with certain guidelines. We will verify this during our manual review, but it’s best to address any potential issues beforehand. In particular, please pay attention to the following:
Developers must provide public, maintained access to their source code and any build tools in one of the following ways: (1) Include the source code in the deployed plugin, (2) A link in the readme to the development location. (Guidelines 1, 4)

Please check it, and if you think everything is fine, do not worry. Our tools are very thorough and may highlight different things as potential issues.

Have you checked for common technical issues?

Please ensure that your plugin adheres to the guidelines and best practices, including the following:

🔴 Use wp_enqueue commands

ℹ️ Why it matters: Because of performance and compatibility, please make use of the built in functions for including static and dynamic JS and/or CSS.

🔍 Identify JS and CSS outputs: Look for any <script> or <style> HTML tags in your plugin. In the majority of cases you could enqueue them.

🛠 Fix it: Make use of the specific function for enqueue them:
Type of code	Functions
Static JS	wp_register_script(), wp_enqueue_script(), admin_enqueue_scripts()
Inline JS	wp_add_inline_script()
Static CSS	wp_register_style(), wp_enqueue_style()
Inline CSS	wp_add_inline_style()

👉 In the public pages you can enqueue them using the hook wp_enqueue_scripts().
👉 In the admin pages you can enqueue them using the hook admin_enqueue_scripts(). You can also use admin_print_scripts() and admin_print_styles().
👉 As of WordPress 6.3, you can easily pass attributes like defer or async, as of WordPress 5.7, you can pass other attributes by using functions and filters.

Example:
function clouansp_enqueue_script() {
    wp_enqueue_script( 'clouansp_js', plugins_url( 'inc/main.js', __FILE__ ), array(), CLOUANSP_VERSION, true );
}
add_action( 'wp_enqueue_scripts', 'clouansp_enqueue_script' );
Your JS/CSS is now enqueued!

Possible cases from your plugin include:
includes/map/admin/views/editor.php:88 <script>
includes/story/admin/views/editor.php:26 <script>


🔴 Use Prefixes for declarations, globals and stored data

ℹ️ Why it matters: Prefixing avoid naming collisions with other themes, plugins, or WordPress core functions.
A prefix is a string placed in front of a name to avoid collisions. It must be at least 4 characters long, feel distinct and unique to the plugin (do not use common words), and be separated by an underscore or dash.
Please check the official WordPress docs on avoiding name collisions.

🔍 Identify not prefixed names: Look for any name that is used in a place where it can create a collision.
Type of element	Affected elements
Declarations	Functions, classes, etc (if not under a namespace)
Globals	Global variables, namespaces, define().
Data storage	update_option(), set_transient(), update_post_meta(), etc.
WordPress declarations	add_shortcode(), register_post_type(), add_menu_page(), wp_register_script(), wp_localize_script(), add_action( 'wp_ajax_...' ), etc.

If the defined name for that is not prefixed, that’s a potential issue! 🕵️

🛠 Fix it: Always prefix those names, for example if your plugin is called "Clouds and Spaceships" then you could use names like these:
function clouansp_save_post(){ ... }
class CLOUANSP_Admin { ... }
update_option( 'clouansp_options', $options );
register_setting( 'clouansp_settings', 'clouansp_user_id', ... );
define( 'CLOUANSP_PLUGIN_DIR', plugin_dir_path( __FILE__ ) );
global $clouansp_options;
add_action('wp_ajax_clouansp_save_data', ... );
namespace namatamagodev\cloudsandspaceships;



👉 Your next steps

This is your checklist:
Have you read the guidelines and this plugin complies with them?
Have you checked for common technical issues?

If there is something that needs to be fixed, please:
Take your time and fix it. Make sure that everything was addressed and the plugin works.
Update your plugin files at the "Add your plugin" page, while being logged in with your account "namatamagodev".
Reply to this email.
Please keep your reply short, direct and clear. Avoid overly verbose and long AI responses. Do not list the changes made, we don't need that, we will review the entire plugin again, we won't compare the changes. However, please share any important context or clarifications that may help us during the review.

If after checking the list and do the changes you feel that everything is right or need further clarification, please reply to this email and a volunteer will help you.

If you believe there is a requirement you cannot accomplish and choose not to make changes, your plugin submission will be rejected after three months.

Thanks!

By taking these steps, you're helping the Plugin Review Team work more efficiently — meaning your plugin (along with the thousands of others in the queue) can be reviewed faster. 🚀 We really appreciate your contribution!

Disclaimers

If, at any time during the review process, you wish to change your permalink (aka the plugin slug) "clouds-and-spaceships", you must explicitly and clearly tell us what you would like it to be. Just changing it in your code and in the display name is not sufficient. Remember, permalinks cannot be altered after approval.
This email was partially auto-generated, so please be aware that some information might not be entirely accurate. No personal data was shared with the AI during this process. If you notice any obvious errors or something seems off, feel free to reply — we’ll be happy to take a closer look and readjust this automation.

Review ID: AUTOPREREVIEW clouds-and-spaceships/namatamagodev/6Oct26/T2 6Oct26/4.3 (P0TDX381275HGN)