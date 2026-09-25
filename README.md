# Clouds and Spaceships

One plugin for worldbuilders and mapmakers: wiki articles and a glossary,
interactive canvas maps, and branching stories laid over those maps.

It replaces three separate plugins — **cns-wiki-suite**, **cns-map-suite** and
**cns-story-suite** (which was a child of cns-map-suite) — and owns the CNS
settings page framework they shared.

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
  settings-page.php            the tabbed CNS settings screen
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

## Theme independence

The plugin is self-contained and makes no assumptions about the active theme.

- `assets/css/wiki-layout.css` gives the wiki's `cns-col*` columns sensible
  proportions on any theme, since the classes carry no widths of their own.
- Block templates (`single-cns_map`, `single-cns_wiki`, `single-cns_story`) are
  registered by the plugin and sit below theme templates, so a theme can
  override any of them by shipping a template of the same name.

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
