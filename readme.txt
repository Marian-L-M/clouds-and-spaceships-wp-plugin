=== Clouds and Spaceships ===
Contributors: marianmaschke
Requires at least: 6.8
Tested up to: 6.8
Requires PHP: 8.0
Stable tag: 0.1.0
License: GPL-2.0-or-later
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Wiki articles and glossary, interactive canvas maps, and branching stories for the Clouds and Spaceships platform.

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

== Changelog ==

= 0.1.0 =
* Initial release, merging CNS Wiki Suite, CNS Map Suite and CNS Story Suite into one plugin.
