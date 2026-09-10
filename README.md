# Clouds and Spaceships

One plugin for the Clouds and Spaceships platform: wiki articles and a glossary,
interactive canvas maps, and branching stories.

It replaces three separate plugins — **cns-wiki-suite**, **cns-map-suite** and
**cns-story-suite** (which was a child of cns-map-suite) — and takes over the
CNS settings page framework that used to ship with the Clouds And Spaceships
theme.

---

## Installing over the old plugins

The merged plugin defines the same functions, post types and blocks as the three
it replaces, so **they cannot be active at the same time** — activating this one
alongside them is a fatal error.

1. Deactivate `CNS Wiki Suite`, `CNS Map Suite` and `CNS Story Suite`.
2. Activate `Clouds and Spaceships`.
3. Visit **Settings → Permalinks** once if any archive slug looks stale.

No data migration is involved. Block names, REST namespaces, option keys,
capabilities, post types and database tables are unchanged, so existing wikis,
maps and stories keep working exactly as before:

| Kind | Value |
|---|---|
| Blocks | `cns-wiki-suite/infobox`, `cns-map-suite/map`, `cns-story-suite/story`, … |
| REST | `/cns-map-suite/v1`, `/cns-story-suite/v1` |
| Options | `cns_wiki_settings`, `cns_map_suite_*`, `cns_story_suite_*` |
| Tables | `{prefix}cns_map_*`, `{prefix}cns_story_*` |
| Capabilities | `manage_maps`, `manage_stories` |
| Post types | `wiki`, `glossary`, `maps`, `cns_story`, `cns_substory` |

Deleting the three old plugins afterwards is safe: their `uninstall.php` only
removes options, and this plugin re-creates the ones it needs. Do **not** delete
them with a Danger Zone "delete content on uninstall" setting still enabled.

---

## Layout

```
clouds-and-spaceships.php      bootstrap: constants, requires, blocks, lifecycle
includes/
  settings-page.php            the tabbed CNS settings screen (from the theme)
  archive.php                  archive settings + query + rewrite flush, all suites
  cache.php                    render-row cache for the map and story tables
  capabilities.php             manage_maps / manage_stories
  wiki/                        settings, wiki CPT, glossary, the Wiki tab
  map/                         maps CPT, tables, public map-data API, admin + REST
  story/                       story CPTs, tables, serializers, admin + REST
assets/css/                    frontend stylesheets (wiki layout, glossary terms)
templates/                     block templates for wiki + glossary
src/
  blocks/                      all eight blocks (flat — required by --blocks-manifest)
  map/  story/                 the two admin React apps
  shared/                      code both editors use (see below)
  map-panel/                   the Stories tab inside the map editor
  formats/glossary/            glossary inline rich-text format
  toast/                       toast notifications (`cns-toast` handle)
```

### What the merge deduplicated

| Was | Now |
|---|---|
| 4 identical `cns-settings-page.php` copies behind `function_exists` guards | `includes/settings-page.php`, one unguarded copy |
| `archive.php` in map + story, plus the same logic inline in the wiki | `includes/archive.php` |
| `cache.php` in map + story | `includes/cache.php` |
| `capabilities.php` in map + story | `includes/capabilities.php` |
| 3 rewrite-flush flags and init handlers | one `cns_needs_rewrite_flush` flag |
| 2 DB version options and upgrade routines | one `cns_db_version` |
| `ColorField` / `Notices` (byte-identical copies) | `src/shared/admin/` |
| `EditorHeader` / `TabBar` (near-identical) | `src/shared/admin/`, entity labels as props |
| 2 `apiFetch` wrappers | `src/shared/admin/api.ts` |
| ~120 lines of byte-identical admin CSS | `src/shared/scss/_admin.scss` |

Rules the two editors genuinely styled differently — panel padding, badge
variants, the settings grid — stayed in their own sheets, so neither editor
changed appearance.

### Existence checks removed

The three plugins guarded against each other's absence. In one plugin those
branches are unreachable, so they are gone:

- `cns-story-suite` bailing out unless `CNS_MAP_SUITE_VERSION` was defined, and
  refusing to activate unless cns-map-suite was active.
- `function_exists( 'cns_map_suite_get_map_data' )` before the story code read
  map data.
- `WP_Block_Type_Registry::is_registered( 'cns-wiki-suite/infobox' )` before the
  map extracted infoboxes from a linked post.
- `wp_style_is( …, 'registered' )` before the map block enqueued infobox styles.
- The `cns_map_editor_extensions` filter and its `hasStorySuite` flag, which let
  the story plugin add the map editor's Stories tab. The tab is always there now.
- `post_type_exists()` guards around `register_post_type()`.

---

## Relationship to the theme

The Clouds And Spaceships theme is no longer required.

- The settings page framework now lives here. The theme still ships its own
  `function_exists`-guarded copy and registers a **Theme** tab through the
  `cns_admin_tabs` filter. Plugins load before themes, so this copy wins and the
  theme's is a no-op — the Theme tab keeps working, unchanged.
- The `cns-toast` script and style, previously registered by the theme, ship
  here as `src/toast/`. The admin editors declare `cns-toast` as a dependency,
  so on any other theme they used to fail to enqueue at all.
- `assets/css/wiki-layout.css` gives the wiki's `cns-col*` columns sensible
  proportions on themes that do not style them.

The theme's own blocks (`cns-theme/cns-section`, `cns-tab`, …) are **not** part
of this plugin. `cns_wiki_post_content_template()` still checks for the theme and
falls back to a plain columns skeleton when it is not the active theme.

---

## Development

```sh
npm install --legacy-peer-deps   # @wordpress/icons needs the flag
npm run build                    # blocks + admin bundles + manifest
npm start                        # watch mode
npm run lint:ts                  # tsc --noEmit
```

`npm run build` is required after checkout — `build/` is gitignored and the
plugin registers no blocks without `build/blocks-manifest.php`.
