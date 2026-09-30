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

Clouds and Spaceships bundles three toolsets for worldbuilders behind one **CNS** settings screen: Wiki, Maps and Stories. The wiki can be switched off if you do not need it, and the glossary is off until you turn it on.

**Maps**

A canvas map editor with its own admin screen. Place objects, draw areas, add labels, and publish the result through a block.

* Objects can render as a circle, square, diamond, icon or their own title as text, each with its own size, colours and border.
* Areas are drawn as polygons, rectangles, ellipses or bezier curves, with per-area fill, stroke and label styling.
* Any object or area can open an infobox drawer on click, either written inline or pulled from a linked post.
* MasterMaps nest maps inside each other: draw a region on a parent map and it links through to the child map.
* On the front end the map supports zoom, a fullscreen view, and visitor toggles that show or hide areas, objects and labels independently.

**Wiki**

Wiki articles nest inside one another, so a child article's URL carries its parent's path.

* **Infobox**, **Infobox Group** and **Infobox Row** blocks build a structured sidebar box. Its display mode either collapses groups on mobile or keeps everything expanded, and each group can override that.
* **Wiki Card** and **Wiki Contents** render a responsive card grid, filled by hand or automatically from your newest articles.
* An optional glossary (off by default) adds inline terms with hover definitions, plus a **Glossary Index** block that lists every entry grouped alphabetically or by category. Definitions and links are resolved when the page renders, so they never go stale.

**Stories**

A canvas editor for branching stories laid over one of your maps.

* Nodes, paths and directed edges, with substories holding the content shown at each node.
* The linked map renders underneath in full — its areas, objects, labels and infoboxes all stay interactive — while story elements draw on top and take click priority.
* The same zoom, fullscreen and layer toggles as the map block, inheriting the linked map's control colours.

**Your world stays on your site**

Clouds and Spaceships never sends anything anywhere. There is no account to create and no service to connect, no tracking and no analytics, and nothing is loaded from another server. It uses no external services at all: everything you write and draw stays in your own WordPress site.

== Installation ==

1. Upload the plugin folder to `/wp-content/plugins/`, or install it from the Plugins screen.
2. Activate it through the Plugins screen.
3. Configure everything under the **CNS** menu: Wiki, Glossary, Maps, Icons, Stories, Substories and Info.

If you ever ran the earlier CNS Wiki Suite, CNS Map Suite or CNS Story Suite plugins, deactivate all three before activating this one.

== Frequently Asked Questions ==

= Do I have to use all three toolsets? =

You can ignore any of them — nothing appears on your site until you create a map, a story or a wiki article. The wiki also has an on/off switch on its settings tab: turning it off hides wiki articles and their listing from your site, while the articles themselves stay put and reappear when you switch it back on. The glossary is a separate switch, and it starts off.

= Does a story need a map? =

Not strictly — a story without a linked map still renders, just with nothing behind its nodes and paths. Linking a map is the point of the feature, though: the map supplies the backdrop the story is laid over, and the story block then draws that map's areas, objects and labels underneath its own elements.

= Can my theme override the templates? =

Yes. The single templates for maps, wiki articles and stories are registered by the plugin and sit below theme templates, so a theme shipping a template of the same name wins.

= Does the plugin send any data anywhere? =

No. Nothing you create is sent off your site, and the plugin contacts no outside service of any kind.

= What happens to my content if I uninstall? =

Deleting the plugin runs its uninstaller; deactivating it does not.

**Maps and stories are always deleted.** A map is the objects, areas and labels stored in the plugin's own database tables, and a story is its nodes, paths and edges. Those tables are always dropped on uninstall, so a map or story post left behind would be an empty entry nothing could render or edit. Images you used stay in your media library.

**Substories, wiki articles and glossary entries are kept unless you opt in.** These are articles in their own right, so each has a Danger Zone setting, off by default, that deletes them. Left alone, their text stays in your database and comes back if you reinstall the plugin.

The plugin's settings are always removed. If you intend to come back, back up first — or just deactivate instead of deleting, which touches nothing.

== Screenshots ==

1. The map editor: place objects, draw polygon and bezier areas, and add labels on the canvas.
2. The story editor: branching story nodes and paths laid over a linked map.
3. A map rendered on the front end, with an object's infobox drawer open.
4. A wiki article with an infobox block and inline glossary terms.
5. The CNS settings screen.

== Upgrade Notice ==

= 0.1.0 =
First release. If you use CNS Wiki Suite, CNS Map Suite or CNS Story Suite, deactivate all three before activating this plugin.

== Changelog ==

= 0.1.0 =
* Initial release.
