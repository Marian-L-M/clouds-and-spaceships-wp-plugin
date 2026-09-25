=== Clouds and Spaceships ===
Contributors: namatamgodev
Tags: worldbuilding, mapmaking, interactive map, wiki, storytelling
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
