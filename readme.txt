=== Clouds and Spaceships ===
Contributors: namatamgodev
Tags: worldbuilding, interactive map, wiki, glossary, storytelling
Requires at least: 6.8
Tested up to: 7.1
Requires PHP: 8.0
Stable tag: 0.1.0
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Interactive canvas maps, wiki articles with a glossary, and branching stories laid over your maps. A worldbuilding suite for WordPress.

== Description ==

Clouds and Spaceships bundles three toolsets that share one settings screen:

* **Wiki** — a hierarchical wiki post type with infobox blocks, a card/contents grid, and an optional glossary with inline terms and hover definitions.
* **Maps** — a canvas map editor for icon objects, polygon/bezier areas, labels, and parent/child MasterMap hierarchies, with a frontend block that renders the interactive canvas.
* **Stories** — a canvas editor for branching stories laid over a map, with nodes, paths and directed edges, plus substories for the content shown at each node.

This plugin replaces CNS Wiki Suite, CNS Map Suite and CNS Story Suite. Deactivate all three before activating it — they define the same functions and post types.

== External services ==

This plugin connects to cloudsandspaceships.com, the plugin's own project
website, to show the latest news post on the **CNS → Info** admin screen.

What is sent: the request is an unauthenticated HTTP GET to the site's public
WordPress REST API (`https://cloudsandspaceships.com/wp-json/wp/v2/posts`),
asking for the newest post's title, date, excerpt and link. It carries no site
URL, no WordPress version, no user data, no licence key and no usage
statistics — the plugin replaces WordPress's default user-agent header, which
would otherwise identify your site, with a neutral one. As with any request
over the internet, your server's IP address is visible to the receiving server
and may appear in its standard access logs.

When it happens: only while a logged-in administrator has the CNS → Info screen
open, and at most once every 6 hours — the result is cached in a transient, so
ordinary page loads never make the request. A failed request is cached for 15
minutes so an unreachable site does not slow the screen down repeatedly.

How to switch it off: untick **Show the latest news post** on the CNS → Info
screen. No request is made at all while that box is unticked.

Service provided by Marian Maschke (cloudsandspaceships.com).
Terms of use: https://cloudsandspaceships.com/terms/
Privacy policy: https://cloudsandspaceships.com/privacy/

== Installation ==

1. Deactivate CNS Wiki Suite, CNS Map Suite and CNS Story Suite if they are installed.
2. Upload the plugin folder to `/wp-content/plugins/`.
3. Activate it through the Plugins screen.
4. Configure everything under the **CNS** menu.

Existing wiki, map and story content carries over untouched: block names, REST routes, options and database tables are unchanged.

== Screenshots ==

1. The map editor: place icon objects, draw polygon and bezier areas, and add labels on the canvas.
2. The story editor: branching story nodes and paths laid over a linked map.
3. A map rendered on the frontend, with an object's infobox drawer open.
4. A wiki article with an infobox block and inline glossary terms.
5. The CNS settings screen.

== Upgrade Notice ==

= 0.1.0 =
First release. If you use CNS Wiki Suite, CNS Map Suite or CNS Story Suite, deactivate all three before activating this plugin.

== Changelog ==

= 0.1.0 =
* Initial release, merging CNS Wiki Suite, CNS Map Suite and CNS Story Suite into one plugin.
