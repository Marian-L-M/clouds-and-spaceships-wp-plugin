# Clouds and Spaceships

A suite for Worldbuilders, Storytellers, and Mapmakers - Turn an image into an
interactive canvas to create informational maps and stories, which can be
linked with wiki articles and glossaries.

It grew out of three separate plugins — cns-wiki-suite, cns-map-suite and
cns-story-suite — merged into one. Nothing of that split survives in the code;
the tables below record what the merge collapsed, because it explains why the
shared directories look the way they do.

> This file is for developers. The user-facing text that wordpress.org parses
> lives in `readme.txt`; wp.org ignores this one entirely.

Repository: https://github.com/Marian-L-M/clouds-and-spaceships-wp-plugin

Every global identifier uses the `clouansp` prefix: `clouansp_` for functions,
options, meta keys, tables, post types, capabilities and nonces, `CLOUANSP_`
for constants, `clouansp-` for handles, slugs, block namespaces and CSS
classes, `--clouansp-` for CSS custom properties, and `clouansp` + CamelCase for
JS globals. The old three plugins used `cns`, which wp.org rejects as shorter
than four characters. The "CNS" menu label is display text, not a prefix.

CSS classes are BEM under the prefix (`clouansp-infobox__title`,
`clouansp-infobox-group__outer--collapse-mobile`). State classes toggled at
runtime keep core's unprefixed `is-*` convention (`is-active`, `is-open`,
`is-fullscreen`) and are only ever styled in combination with a prefixed class.

---

## Layout

```
clouds-and-spaceships.php      bootstrap: constants, requires, blocks, lifecycle
uninstall.php                  drops tables + options always, posts only on opt-in
includes/
  settings-page.php            the tabbed CNS settings screen (clouansp_admin_tabs filter)
  archive.php                  story + wiki archives: on/off, slug, rewrite flush
  cache.php                    render-row cache for the map and story tables
  capabilities.php             clouansp_manage_maps / clouansp_manage_stories
  map-template.php             single-clouansp_map + single-clouansp_story block templates
  info/                        the Info tab
  wiki/                        settings, wiki CPT, glossary, the Wiki + Glossary tabs
  map/                         map CPT, tables, public map-data API, admin + REST
  story/                       story CPTs, tables, serializers, admin + REST
assets/css/                    frontend stylesheets (wiki layout, glossary terms)
templates/                     block template layouts for map/story and wiki
src/
  blocks/                      all eight blocks (flat — required by --blocks-manifest)
  map/  story/                 the two admin React apps
  shared/                      code both editors use (see below)
  map-panel/                   the Stories tab inside the map editor
  admin-settings/              the CNS settings screen bundle (layout, data-confirm
                               prompts, data-autosubmit selects)
  formats/glossary/            glossary inline rich-text format
```

Settings tabs register through the `clouansp_admin_tabs` filter and currently are,
in order: Info, Wiki, Glossary, Maps, Icons, Stories, Substories. Info comes first,
so the top-level CNS menu entry opens it.

### `src/shared/`

| Path                                                              | Used by                                                    |
| ----------------------------------------------------------------- | ---------------------------------------------------------- |
| `admin/ColorField`, `Notices`, `EditorHeader`, `TabBar`, `api.ts` | both admin apps                                            |
| `map-geometry.ts`                                                 | map + story canvases, editor and frontend                  |
| `frontend/drawer.js`                                              | infobox drawer for the map and story blocks                |
| `frontend/layer-toggles.js`                                       | areas/objects/labels toggles for both blocks               |
| `scss/_drawer.scss`                                               | infobox drawer styling, for whichever block is on the page |
| `scss/` (rest)                                                    | tokens, shared admin rules, badges                         |

### What the merge deduplicated

| Was                                                                                                | Now                                              |
| -------------------------------------------------------------------------------------------------- | ------------------------------------------------ |
| 4 identical `cns-settings-page.php` copies behind `function_exists` guards                         | `includes/settings-page.php`, one unguarded copy |
| `archive.php` in map + story, plus the same logic inline in the wiki                               | `includes/archive.php`                           |
| `cache.php` in map + story                                                                         | `includes/cache.php`                             |
| `capabilities.php` in map + story                                                                  | `includes/capabilities.php`                      |
| 3 rewrite-flush flags and init handlers                                                            | one `clouansp_needs_rewrite_flush` flag          |
| 2 DB version options and upgrade routines                                                          | one `clouansp_db_version`                        |
| `ColorField` / `Notices` (byte-identical copies)                                                   | `src/shared/admin/`                              |
| `EditorHeader` / `TabBar` (near-identical)                                                         | `src/shared/admin/`, entity labels as props      |
| 2 `apiFetch` wrappers                                                                              | `src/shared/admin/api.ts`                        |
| ~120 lines of byte-identical admin CSS                                                             | `src/shared/scss/_admin.scss`                    |
| infobox drawer + layer toggles duplicated in the map and story `view.js`                           | `src/shared/frontend/`                           |
| drawer CSS that only shipped with the map block, leaving a story-only page with an unstyled drawer | `src/shared/scss/_drawer.scss`, used by both     |

Rules the two editors genuinely styled differently — panel padding, badge
variants, the settings grid — stayed in their own sheets, so neither editor
changed appearance.

**Still duplicated:** `setupZoomControls` in `src/blocks/map/view.js` and
`src/blocks/story/view.js` is ~86% identical. It differs in the scroll
container it uses, its class prefix, its fullscreen target and one extra Esc
guard — and in that the story copy sets `canvas.style.maxWidth = '100%'` where
the map copy clears it, which is why the story stylesheet needs `!important` to
win in fullscreen. Unifying it needs browser verification at both breakpoints.

### Existence checks removed

The three plugins guarded against each other's absence. In one plugin those
branches are unreachable, so they are gone:

-   `cns-story-suite` bailing out unless `CNS_MAP_SUITE_VERSION` was defined, and
    refusing to activate unless cns-map-suite was active.
-   `function_exists( 'cns_map_suite_get_map_data' )` before the story code read
    map data.
-   `WP_Block_Type_Registry::is_registered( 'cns-wiki-suite/infobox' )` before the
    map extracted infoboxes from a linked post.
-   `wp_style_is( …, 'registered' )` before the map block enqueued infobox styles.
-   The `cns_map_editor_extensions` filter and its `hasStorySuite` flag, which let
    the story plugin add the map editor's Stories tab. The tab is always there now.
-   `post_type_exists()` guards around `register_post_type()`.

---

### Block deprecations

Infobox, Infobox Group and Infobox Row are static blocks: their markup, class
names included, is saved into post content. 0.2.0 prefixed those classes, so
each block carries a `deprecated.js` with a verbatim copy of its pre-0.2.0
`save()`. The editor upgrades old blocks silently and they are saved with the
new markup on the next post save; until then the front end still serves the
old, now unstyled, classes. Never edit a deprecated `save()` — add a new
deprecation instead. `display_mode` values are stored attributes and keep
their old spellings; `save.js` maps each one to a modifier class.

---

## Theme independence

The plugin is self-contained and makes no assumptions about the active theme.

-   `assets/css/wiki-layout.css` gives the wiki's `clouansp-col*` columns sensible
    proportions on any theme, since the classes carry no widths of their own.
-   Block templates (`single-clouansp_map`, `single-clouansp_wiki`, `single-clouansp_story`) are
    registered by the plugin and sit below theme templates, so a theme can
    override any of them by shipping a template of the same name.

## Uninstall

`uninstall.php` always drops the seven `clouansp_map_*` / `clouansp_story_*` tables and
deletes every option. On top of that:

| Post type           | Deleted                                                  |
| ------------------- | -------------------------------------------------------- |
| `clouansp_map`      | always                                                   |
| `clouansp_story`    | always                                                   |
| `clouansp_substory` | `clouansp_story_suite_delete_substories_on_uninstall`    |
| `clouansp_wiki`     | `clouansp_wiki_settings['wiki_delete_on_uninstall']`     |
| `clouansp_glossary` | `clouansp_wiki_settings['glossary_delete_on_uninstall']` |
| icon attachments    | `clouansp_map_suite_delete_icons_on_uninstall`           |

Maps and stories are unconditional because their entire substance lives in the
dropped tables — a map is its objects, areas and labels, a story is its nodes,
paths and edges — so the surviving post is an entry nothing can render or edit.
Their descriptions go with them, which is a real if minor loss: that text is a
caption for geometry that no longer exists.

The rest is authored writing that reads fine without the plugin, so it stays
opt-in, defaulting to keep. A kept post is not visible in wp-admin once the
plugin is gone (its post type is unregistered), but the rows survive and
reappear on reinstall.

`wp_delete_post()` re-parents attachments rather than deleting them, so featured
images and map backgrounds survive in the media library either way.

## No outbound requests

The plugin makes no HTTP requests: no `wp_remote_*`, no cURL, no external
scripts, fonts or stylesheets. Keep it that way — it is what keeps the wp.org
listing free of an external-services disclosure.

---

## Development

Needs Node.js 20.19 or later (`sass` and `chokidar` require it).

```sh
npm ci                           # exact dependency tree from package-lock.json
npm run build                    # production: minified, no source maps
npm start                        # watch mode: unminified + source maps
npm run lint:ts                  # tsc --noEmit
npm run lint:js                  # eslint
npm run lint:css                 # stylelint
npm run format                   # prettier
npm run plugin-zip               # distributable zip, per files[] in package.json
```

`build/` is committed, so a checkout runs as-is; the plugin registers no
blocks without `build/blocks-manifest.php`. Rebuild and commit `build/`
whenever `src/` changes.

**Always `npm run build` before `npm run plugin-zip` or committing,** and stop
the watcher first — both write to `build/`. `npm start` leaves an unminified
bundle plus ~1.4 MB of source maps there, and a production build does not
delete them: remove leftover `build/**/*.map` files by hand, or `plugin-zip`
and git will happily ship them.

`npm ci` needs no flags. Adding or upgrading a dependency with `npm install`
does: without the lockfile pinning versions, `@wordpress/icons`' React peer
range conflicts, so use `npm install --legacy-peer-deps <package>`.

The codebase is not prettier-clean; `npm run format` would rewrite large
amounts of unrelated code. Match the surrounding style instead, and check that
lint errors you care about fall on lines you actually touched.

### wp.org compliance

Both official Plugin Check rulesets pass with zero findings. To re-run them
without a database (the `wp plugin check` command needs one):

```sh
php ../plugin-check/vendor/bin/phpcs \
  --standard=../plugin-check/phpcs-rulesets/plugin-review.xml \
  --extensions=php --ignore="*/node_modules/*,*/vendor/*" -p -s .
```

Repeat with `plugin-check.ruleset.xml`. Note that `phpcs:ignore` applies only to
the single following line, and a continuation comment after it cancels it.
