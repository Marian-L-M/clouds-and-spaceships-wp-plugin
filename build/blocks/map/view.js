/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/shared/frontend/drawer.js"
/*!***************************************!*\
  !*** ./src/shared/frontend/drawer.js ***!
  \***************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   closeDrawer: () => (/* binding */ closeDrawer),
/* harmony export */   escHtml: () => (/* binding */ escHtml),
/* harmony export */   isDrawerOpen: () => (/* binding */ isDrawerOpen),
/* harmony export */   showDrawer: () => (/* binding */ showDrawer)
/* harmony export */ });
/**
 * The infobox side drawer, shared by the map block and the story block.
 *
 * One element (`#cns-map-drawer`) serves every block on the page, whichever
 * block created it — both suites already relied on that, each with its own copy
 * of the builder. The shell lives here; each block still composes its own body
 * HTML, because a map item and a story's map item resolve different fields.
 *
 * Visibility is a class toggle rather than the `hidden` attribute, so an
 * author's `display: flex/block` never fights the UA's `[hidden]` rule.
 */

const DRAWER_ID = 'cns-map-drawer';
const BODY_OPEN_CLASS = 'cns-map-drawer-open';

/** Attaches the delegated body handler once, whoever supplies it first. */
function attachBodyClick(drawer, handler) {
  if (!handler || drawer.dataset.cnsBodyClick === '1') return;
  drawer.querySelector('.cns-map-drawer__body').addEventListener('click', handler);
  drawer.dataset.cnsBodyClick = '1';
}

/** Escapes text for interpolation into a drawer HTML string. */
function escHtml(str) {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
function closeDrawer() {
  const drawer = document.getElementById(DRAWER_ID);
  if (!drawer) return;
  drawer.classList.remove('is-open');
  document.body.classList.remove(BODY_OPEN_CLASS);
}

/** True while the drawer is on screen — used to decide what Escape closes. */
function isDrawerOpen() {
  const drawer = document.getElementById(DRAWER_ID);
  return !!drawer && drawer.classList.contains('is-open');
}

/**
 * Returns the shared drawer, building it on first use.
 *
 * A body-click handler is attached the first time one is supplied rather than
 * only when the element is built: a story block on the same page may create the
 * drawer first without one, and the map block still needs its collapsible
 * infoboxes to work.
 */
function getOrCreateDrawer(onBodyClick) {
  let drawer = document.getElementById(DRAWER_ID);
  if (drawer) {
    attachBodyClick(drawer, onBodyClick);
    return drawer;
  }
  drawer = document.createElement('div');
  drawer.id = DRAWER_ID;
  drawer.className = 'cns-map-drawer';
  drawer.setAttribute('role', 'dialog');
  drawer.setAttribute('aria-modal', 'true');
  drawer.innerHTML = '<div class="cns-map-drawer__backdrop"></div>' + '<div class="cns-map-drawer__panel">' + '<div class="cns-map-drawer__header">' + '<button class="cns-map-drawer__close" aria-label="Close">&times;</button>' + '</div>' + '<div class="cns-map-drawer__body"></div>' + '</div>';
  document.body.appendChild(drawer);
  drawer.querySelector('.cns-map-drawer__backdrop').addEventListener('click', closeDrawer);
  drawer.querySelector('.cns-map-drawer__close').addEventListener('click', closeDrawer);
  attachBodyClick(drawer, onBodyClick);
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closeDrawer();
  });
  return drawer;
}

/**
 * Fills the drawer with `html` and opens it, moving focus to the close button.
 */
function showDrawer(html, onBodyClick) {
  const drawer = getOrCreateDrawer(onBodyClick);
  drawer.querySelector('.cns-map-drawer__body').innerHTML = html;
  drawer.classList.add('is-open');
  document.body.classList.add(BODY_OPEN_CLASS);
  drawer.querySelector('.cns-map-drawer__close').focus();
}

/***/ },

/***/ "./src/shared/frontend/layer-toggles.js"
/*!**********************************************!*\
  !*** ./src/shared/frontend/layer-toggles.js ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   setupLayerToggles: () => (/* binding */ setupLayerToggles)
/* harmony export */ });
/**
 * Visitor-facing show/hide buttons for a map's areas, objects and labels.
 *
 * Used by the map block and by the story block for its base map. The author's
 * saved choice is the starting state; a visitor's change lasts for the page
 * view only and is never written back.
 *
 * `layers` is mutated in place, so the caller's draw function reads the current
 * state without any wiring beyond the `onChange` repaint.
 */

const LAYERS = [['areas', 'Areas'], ['objects', 'Objects'], ['labels', 'Labels']];

/**
 * @param {Object}   opts
 * @param {Element}  opts.container Element the button group is appended to.
 *                                  Must sit outside any scroll container, so
 *                                  the buttons stay put while a zoomed canvas
 *                                  pans.
 * @param {string}   opts.className Block class for the group, e.g.
 *                                  'cns-map-layers'. Buttons get `__btn`.
 * @param {Object}   opts.present   Which layers the map actually has content
 *                                  in; a layer that is empty gets no button.
 * @param {Object}   opts.layers    Live visibility state, mutated on click.
 * @param {Function} opts.onChange  Called after each toggle, to repaint.
 */
function setupLayerToggles({
  container,
  className,
  present,
  layers,
  onChange
}) {
  if (!container) return;
  if (!LAYERS.some(([key]) => present[key])) return;
  const box = document.createElement('div');
  box.className = className;
  box.setAttribute('role', 'group');
  box.setAttribute('aria-label', 'Map layers');
  LAYERS.forEach(function ([key, label]) {
    if (!present[key]) return;
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = className + '__btn';
    btn.textContent = label;
    const sync = function () {
      btn.classList.toggle('is-off', !layers[key]);
      btn.setAttribute('aria-pressed', layers[key] ? 'true' : 'false');
    };
    btn.addEventListener('click', function () {
      layers[key] = !layers[key];
      sync();
      onChange();
    });
    sync();
    box.appendChild(btn);
  });
  container.appendChild(box);
}

/***/ },

/***/ "./src/shared/map-geometry.ts"
/*!************************************!*\
  !*** ./src/shared/map-geometry.ts ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LABEL_COLOR: () => (/* binding */ LABEL_COLOR),
/* harmony export */   LABEL_FONT_FAMILY: () => (/* binding */ LABEL_FONT_FAMILY),
/* harmony export */   LABEL_FONT_SIZE: () => (/* binding */ LABEL_FONT_SIZE),
/* harmony export */   OBJECT_BG_COLOR: () => (/* binding */ OBJECT_BG_COLOR),
/* harmony export */   OBJECT_BORDER_COLOR: () => (/* binding */ OBJECT_BORDER_COLOR),
/* harmony export */   OBJECT_FILL: () => (/* binding */ OBJECT_FILL),
/* harmony export */   OBJECT_SIZE: () => (/* binding */ OBJECT_SIZE),
/* harmony export */   OBJECT_STROKE: () => (/* binding */ OBJECT_STROKE),
/* harmony export */   OBJECT_TEXT_COLOR: () => (/* binding */ OBJECT_TEXT_COLOR),
/* harmony export */   OBJECT_TEXT_FONT_FAMILY: () => (/* binding */ OBJECT_TEXT_FONT_FAMILY),
/* harmony export */   OBJECT_TEXT_FONT_SIZE: () => (/* binding */ OBJECT_TEXT_FONT_SIZE),
/* harmony export */   areaLabelText: () => (/* binding */ areaLabelText),
/* harmony export */   buildAreaPathFromNodes: () => (/* binding */ buildAreaPathFromNodes),
/* harmony export */   buildPolygonPath: () => (/* binding */ buildPolygonPath),
/* harmony export */   drawLabelShape: () => (/* binding */ drawLabelShape),
/* harmony export */   drawObjectMarker: () => (/* binding */ drawObjectMarker),
/* harmony export */   drawShapeLabel: () => (/* binding */ drawShapeLabel),
/* harmony export */   findAreaAtPoint: () => (/* binding */ findAreaAtPoint),
/* harmony export */   findLabelPartAtPoint: () => (/* binding */ findLabelPartAtPoint),
/* harmony export */   findObjectAtPoint: () => (/* binding */ findObjectAtPoint),
/* harmony export */   measureLabelBox: () => (/* binding */ measureLabelBox),
/* harmony export */   measureObjectMarker: () => (/* binding */ measureObjectMarker),
/* harmony export */   objectDisplayMode: () => (/* binding */ objectDisplayMode),
/* harmony export */   objectUsesIcon: () => (/* binding */ objectUsesIcon),
/* harmony export */   regionLabelText: () => (/* binding */ regionLabelText),
/* harmony export */   traceRoundedRect: () => (/* binding */ traceRoundedRect)
/* harmony export */ });
/**
 * Canvas geometry shared between the admin editor (src/admin) and the
 * frontend map block (src/blocks/map/view.js). Both bundles come out of the
 * same webpack build, so keeping the math here makes editor and frontend
 * pixel-identical by construction — any change to hit areas, label boxes, or
 * shape paths lands in both automatically.
 */

// ── Shape labels ──────────────────────────────────────────────────────────────
// Map areas and hierarchy regions both label themselves at the shape's center,
// with the same styling controls, so the drawing lives here once.

const LABEL_FONT_FAMILY = 'sans-serif';
const LABEL_FONT_SIZE = 12;
const LABEL_COLOR = '#ffffff';

/**
 * A hierarchy region's label text: the infobox title override wins over the
 * child map's own title, so relabelling a region on the parent map does not
 * require renaming the map it points at.
 */
function regionLabelText(region) {
  return (region.title_override || region.child_map_title || '').trim();
}

/**
 * An area's label text: the infobox title override wins over the area's own
 * title, mirroring how hierarchy regions resolve theirs.
 */
function areaLabelText(area) {
  return (area.infobox_data?.title || area.title || '').trim();
}

/**
 * Draws a shape's label at its center. Circles label the center node; every
 * other shape uses the node centroid.
 *
 * The text is drawn flat, with no halo behind it — contrast against the map
 * artwork is the author's to choose via the label color.
 */
function drawShapeLabel(ctx, text, styles, nodes, shapeType, W, H) {
  if (!text || !nodes.length) return;
  const s = styles || {};
  if (s.labelHidden) return;
  const family = s.labelFontFamily || LABEL_FONT_FAMILY;
  const size = s.labelFontSize || LABEL_FONT_SIZE;
  const color = s.labelColor || LABEL_COLOR;
  const cx = shapeType === 'CIRCLE' ? nodes[0].x * W : nodes.reduce((t, n) => t + n.x, 0) / nodes.length * W;
  const cy = shapeType === 'CIRCLE' ? nodes[0].y * H : nodes.reduce((t, n) => t + n.y, 0) / nodes.length * H;
  ctx.save();
  ctx.font = `bold ${size}px ${family}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.fillText(text, cx, cy);
  ctx.restore();
}

// ── Area / region paths ───────────────────────────────────────────────────────

function buildPolygonPath(ctx, nodes, W, H) {
  ctx.moveTo(nodes[0].x * W, nodes[0].y * H);
  for (let i = 1; i < nodes.length; i++) {
    ctx.lineTo(nodes[i].x * W, nodes[i].y * H);
  }
  ctx.closePath();
}
function buildBezierPath(ctx, nodes, W, H) {
  const n = nodes.length;
  const startX = (nodes[n - 1].x + nodes[0].x) / 2 * W;
  const startY = (nodes[n - 1].y + nodes[0].y) / 2 * H;
  ctx.moveTo(startX, startY);
  for (let i = 0; i < n; i++) {
    const cp = nodes[i];
    const next = nodes[(i + 1) % n];
    ctx.quadraticCurveTo(cp.x * W, cp.y * H, (cp.x + next.x) / 2 * W, (cp.y + next.y) / 2 * H);
  }
  ctx.closePath();
}
function buildCirclePath(ctx, nodes, W, H) {
  const cx = nodes[0].x * W;
  const cy = nodes[0].y * H;
  const rx = Math.max(Math.abs(nodes[1].x - nodes[0].x) * W, 1);
  const ry = Math.max(Math.abs(nodes[1].y - nodes[0].y) * H, 1);
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
}
function buildAreaPathFromNodes(ctx, nodes, shapeType, W, H) {
  ctx.beginPath();
  if (!nodes.length) return;
  switch (shapeType) {
    case 'BEZIER':
      if (nodes.length >= 3) buildBezierPath(ctx, nodes, W, H);
      break;
    case 'CIRCLE':
      if (nodes.length >= 2) buildCirclePath(ctx, nodes, W, H);
      break;
    case 'RECTANGLE':
    default:
      if (nodes.length >= 3) buildPolygonPath(ctx, nodes, W, H);
      break;
  }
}

// ── Hit detection ─────────────────────────────────────────────────────────────

function findObjectAtPoint(ctx, x, y, objects) {
  for (let i = objects.length - 1; i >= 0; i--) {
    const obj = objects[i];
    const box = measureObjectMarker(ctx, {
      x: obj.x,
      y: obj.y,
      title: obj.title,
      styles: obj.canvas_styles
    });
    ctx.beginPath();
    ctx.rect(box.left, box.top, box.w, box.h);
    if (ctx.isPointInPath(x, y)) return obj;
  }
  return null;
}
function findAreaAtPoint(ctx, x, y, areas, W, H) {
  for (let i = areas.length - 1; i >= 0; i--) {
    const area = areas[i];
    const nodes = area.nodes || [];
    const shapeType = area.shape_type || 'POLYGON';
    const minNodes = shapeType === 'CIRCLE' ? 2 : 3;
    if (nodes.length < minNodes) continue;
    buildAreaPathFromNodes(ctx, nodes, shapeType, W, H);
    if (ctx.isPointInPath(x, y)) return area;
  }
  return null;
}

// ── Labels ────────────────────────────────────────────────────────────────────
// 'centered'  — label box centered on (x, y).
// 'indicator' — dot at (x, y) with a leader line to the label box at
//               (x + offset_x, y + offset_y); the line is drawn first so the
//               box covers the segment that would cross it.

/**
 * The fields the label drawing needs. A stored MapLabel satisfies it, and so
 * does a label a story canvas has rescaled to its own coordinate system.
 */

const PAD_X = 8;
const PAD_Y = 5;

/** Computes the label box in canvas pixels (sets ctx.font as a side effect). */
function measureLabelBox(ctx, label) {
  const fontSize = label.canvas_styles?.fontSize || 14;
  ctx.font = `bold ${fontSize}px sans-serif`;
  const textW = ctx.measureText(label.text || '').width;
  const w = textW + PAD_X * 2;
  const h = fontSize + PAD_Y * 2;
  const cx = label.placement === 'indicator' ? label.x + (label.offset_x ?? 40) : label.x;
  const cy = label.placement === 'indicator' ? label.y + (label.offset_y ?? -40) : label.y;
  return {
    left: cx - w / 2,
    top: cy - h / 2,
    w,
    h,
    cx,
    cy,
    fontSize
  };
}
function traceRoundedRect(ctx, x, y, w, h, r) {
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.rect(x, y, w, h);
  }
}
function drawLabelShape(ctx, label, opts = {}) {
  const styles = label.canvas_styles;
  const bg = styles?.bgColor || '#ffffff';
  const border = styles?.borderColor || '#1e1e1e';
  const textColor = styles?.textColor || '#1e1e1e';
  const box = measureLabelBox(ctx, label);
  ctx.save();

  // Leader line + anchor dot first, so the box covers the inner segment.
  if (label.placement === 'indicator') {
    ctx.beginPath();
    ctx.moveTo(label.x, label.y);
    ctx.lineTo(box.cx, box.cy);
    ctx.strokeStyle = border;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(label.x, label.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = border;
    ctx.fill();
  }
  ctx.beginPath();
  traceRoundedRect(ctx, box.left, box.top, box.w, box.h, 4);
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.strokeStyle = border;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.font = `bold ${box.fontSize}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = textColor;
  ctx.fillText(label.text || (opts.showEmptyPlaceholder ? '(empty label)' : ''), box.cx, box.cy);
  if (opts.selected) {
    ctx.beginPath();
    traceRoundedRect(ctx, box.left - 4, box.top - 4, box.w + 8, box.h + 8, 6);
    ctx.strokeStyle = '#2271b1';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    ctx.stroke();
  }
  ctx.restore();
}

/** Which part of a label was hit: the anchor dot or the text box. */

/**
 * Hit test that distinguishes the anchor dot (indicator mode) from the text
 * box. The dot is checked first with a generous radius so it stays grabbable
 * next to the box. Reverse order so the top-most drawn label wins.
 */
function findLabelPartAtPoint(ctx, x, y, labels) {
  for (let i = labels.length - 1; i >= 0; i--) {
    const label = labels[i];
    if (label.placement === 'indicator') {
      ctx.beginPath();
      ctx.arc(label.x, label.y, 8, 0, Math.PI * 2);
      if (ctx.isPointInPath(x, y)) return {
        label,
        part: 'anchor'
      };
    }
    const box = measureLabelBox(ctx, label);
    ctx.beginPath();
    ctx.rect(box.left, box.top, box.w, box.h);
    if (ctx.isPointInPath(x, y)) return {
      label,
      part: 'box'
    };
  }
  return null;
}

// ── Object markers ────────────────────────────────────────────────────────────
// An object draws itself in one of five display modes. The drawing lives here
// so the map editor, the map block, and the two story canvases that render a
// map as their backdrop all agree on footprint and appearance.

const OBJECT_SIZE = 32;
const OBJECT_FILL = '#ffffff';
const OBJECT_STROKE = '#2271b1';
const OBJECT_BG_COLOR = '#2271b1';
const OBJECT_BORDER_COLOR = '#1e1e1e';
const OBJECT_TEXT_COLOR = '#ffffff';
const OBJECT_TEXT_FONT_FAMILY = 'sans-serif';
const OBJECT_TEXT_FONT_SIZE = 14;

/**
 * Icon-mode backdrop diameter, as a multiple of the icon size. A square icon's
 * corners sit at size × √2 / 2 ≈ 0.71 × size from the center, so the circle
 * behind it has to be at least that wide to contain the artwork.
 */
const ICON_BACKDROP = 1.44;

/** Horizontal padding around text, as a fraction of the element size. */
const TEXT_PAD_RATIO = 0.25;
const TEXT_PAD_MIN = 6;

/** The fields the marker drawing needs, in either row shape. */

/** Rows saved before display modes existed carry none, and those were icons. */
function objectDisplayMode(styles) {
  return styles?.displayMode || 'icon';
}

/** Icon artwork is drawn in icon mode only, so the other modes skip the load. */
function objectUsesIcon(styles) {
  return objectDisplayMode(styles) === 'icon';
}
/**
 * The marker's footprint in canvas pixels, which is also its hit area. Sets
 * ctx.font as a side effect when it measures text.
 *
 * `scale` multiplies the stored sizes, for canvases that draw the map at a
 * size other than its own.
 */
function measureObjectMarker(ctx, marker, scale = 1) {
  const styles = marker.styles;
  const mode = objectDisplayMode(styles);
  const size = (styles?.size ?? OBJECT_SIZE) * scale;
  const fontSize = (styles?.textFontSize ?? OBJECT_TEXT_FONT_SIZE) * scale;
  if (mode === 'text') {
    const family = styles?.textFontFamily || OBJECT_TEXT_FONT_FAMILY;
    ctx.font = `bold ${fontSize}px ${family}`;
    const padX = Math.max(TEXT_PAD_MIN * scale, size * TEXT_PAD_RATIO);
    const w = ctx.measureText(marker.title || '').width + padX * 2;
    const h = Math.max(size, fontSize + 10 * scale);
    return {
      left: marker.x - w / 2,
      top: marker.y - h / 2,
      w,
      h,
      size,
      fontSize
    };
  }

  // The icon's round backdrop is wider than the artwork it contains.
  const side = mode === 'icon' ? size * ICON_BACKDROP : size;
  return {
    left: marker.x - side / 2,
    top: marker.y - side / 2,
    w: side,
    h: side,
    size,
    fontSize
  };
}
/** Traces the mode's outline over the given box, without filling or stroking. */
function traceObjectShape(ctx, mode, marker, box) {
  const r = box.w / 2;
  ctx.beginPath();
  switch (mode) {
    case 'text':
      traceRoundedRect(ctx, box.left, box.top, box.w, box.h, 4);
      break;
    case 'square':
      ctx.rect(box.left, box.top, box.w, box.h);
      break;
    case 'diamond':
      ctx.moveTo(marker.x, marker.y - r);
      ctx.lineTo(marker.x + r, marker.y);
      ctx.lineTo(marker.x, marker.y + r);
      ctx.lineTo(marker.x - r, marker.y);
      ctx.closePath();
      break;
    case 'icon':
    case 'round':
    default:
      ctx.arc(marker.x, marker.y, r, 0, Math.PI * 2);
      break;
  }
}

/**
 * Draws one object marker. The caller resolves the icon artwork first (see
 * objectUsesIcon), because the canvases that draw objects each cache images
 * their own way.
 */
function drawObjectMarker(ctx, marker, opts = {}) {
  const styles = marker.styles;
  const mode = objectDisplayMode(styles);
  const scale = opts.scale ?? 1;
  const box = measureObjectMarker(ctx, marker, scale);
  const borderWidth = (styles?.borderWidth ?? 0) * scale;
  ctx.save();

  // The body: the shape itself, the round backdrop behind an icon, or the
  // rectangular backdrop behind text.
  traceObjectShape(ctx, mode, marker, box);
  ctx.fillStyle = styles?.bgColor ?? OBJECT_BG_COLOR;
  ctx.fill();
  if (borderWidth > 0) {
    ctx.strokeStyle = styles?.borderColor ?? OBJECT_BORDER_COLOR;
    ctx.lineWidth = borderWidth;
    ctx.setLineDash([]);
    ctx.stroke();
  }
  if (mode === 'icon' && opts.image) {
    const half = box.size / 2;
    ctx.drawImage(opts.image, marker.x - half, marker.y - half, box.size, box.size);
  } else if (mode === 'text' && marker.title) {
    const family = styles?.textFontFamily || OBJECT_TEXT_FONT_FAMILY;
    ctx.font = `bold ${box.fontSize}px ${family}`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = styles?.textColor ?? OBJECT_TEXT_COLOR;
    ctx.fillText(marker.title, marker.x, marker.y);
  }
  if (opts.selected) {
    traceObjectShape(ctx, mode, marker, {
      left: box.left - 4,
      top: box.top - 4,
      w: box.w + 8,
      h: box.h + 8
    });
    ctx.strokeStyle = '#2271b1';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    ctx.stroke();
  }
  ctx.restore();
}

/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	const __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		const cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		const module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			const e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/define property getters */
/******/ 	// define getter/value functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	__webpack_require__.o = (obj, prop) => (Object.hasOwn(obj, prop));
/******/ 	
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ 	
/************************************************************************/
let __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!********************************!*\
  !*** ./src/blocks/map/view.js ***!
  \********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _shared_map_geometry__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared/map-geometry */ "./src/shared/map-geometry.ts");
/* harmony import */ var _shared_frontend_drawer__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../shared/frontend/drawer */ "./src/shared/frontend/drawer.js");
/* harmony import */ var _shared_frontend_layer_toggles__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/frontend/layer-toggles */ "./src/shared/frontend/layer-toggles.js");
// Geometry shared with the admin editor — one source of truth for shape
// paths, label boxes, and hit areas (see src/shared/map-geometry.ts).



(function () {
  'use strict';

  // ── Image / SVG cache ─────────────────────────────────────────────────────
  const imageCache = {};
  function loadImage(url) {
    if (!url) return Promise.resolve(null);
    if (imageCache[url]) return Promise.resolve(imageCache[url]);
    return new Promise(function (resolve) {
      const img = new Image();
      img.onload = function () {
        imageCache[url] = img;
        resolve(img);
      };
      img.onerror = function () {
        resolve(null);
      };
      img.src = url;
    });
  }
  async function loadSvgWithColors(url, fill, stroke) {
    const key = url + '|' + (fill || '') + '|' + (stroke || '');
    if (imageCache[key]) return imageCache[key];
    try {
      const resp = await fetch(url, {
        credentials: 'same-origin'
      });
      const text = await resp.text();
      const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
      const svg = doc.documentElement;
      if (fill) svg.setAttribute('fill', fill);
      if (stroke) svg.setAttribute('stroke', stroke);
      const blob = new Blob([new XMLSerializer().serializeToString(doc)], {
        type: 'image/svg+xml'
      });
      const blobUrl = URL.createObjectURL(blob);
      return new Promise(function (resolve) {
        const img = new Image();
        img.onload = function () {
          URL.revokeObjectURL(blobUrl);
          imageCache[key] = img;
          resolve(img);
        };
        img.onerror = function () {
          URL.revokeObjectURL(blobUrl);
          resolve(null);
        };
        img.src = blobUrl;
      });
    } catch {
      return null;
    }
  }

  // ── Draw pipeline ─────────────────────────────────────────────────────────

  async function drawBackground(canvas, data) {
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    ctx.clearRect(0, 0, width, height);
    if (data.bgType === 'image' && data.bgImageUrl) {
      const bgImg = await loadImage(data.bgImageUrl);
      if (bgImg) {
        const scale = Math.max(width / bgImg.naturalWidth, height / bgImg.naturalHeight);
        const drawW = bgImg.naturalWidth * scale;
        const drawH = bgImg.naturalHeight * scale;
        ctx.drawImage(bgImg, (width - drawW) / 2, (height - drawH) / 2, drawW, drawH);
      } else {
        ctx.fillStyle = '#888';
        ctx.fillRect(0, 0, width, height);
      }
    } else {
      ctx.fillStyle = data.bgColor || '#1a1a2e';
      ctx.fillRect(0, 0, width, height);
    }
    if (data.imgUrl) {
      const mapImg = await loadImage(data.imgUrl);
      if (mapImg) {
        const drawW = width * (data.imageW || 1);
        const drawH = drawW * (mapImg.naturalHeight / mapImg.naturalWidth);
        ctx.drawImage(mapImg, width * (data.imageX || 0), height * (data.imageY || 0), drawW, drawH);
      }
    }
  }
  function drawHierarchyRegion(ctx, region, W, H) {
    const nodes = region.nodes || [];
    const shapeType = region.shape_type || 'POLYGON';
    if (nodes.length < (shapeType === 'CIRCLE' ? 2 : 3)) return;
    const styles = region.canvas_styles || {};
    const fill = styles.fill || '#e8a02040';
    const stroke = styles.stroke || '#e8a020';
    const strokeWidth = styles.strokeWidth || 2;
    (0,_shared_map_geometry__WEBPACK_IMPORTED_MODULE_0__.buildAreaPathFromNodes)(ctx, nodes, shapeType, W, H);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
    (0,_shared_map_geometry__WEBPACK_IMPORTED_MODULE_0__.drawShapeLabel)(ctx, (0,_shared_map_geometry__WEBPACK_IMPORTED_MODULE_0__.regionLabelText)(region), styles, nodes, shapeType, W, H);
  }
  function findHierarchyRegionAtPoint(ctx, x, y, regions, W, H) {
    for (var i = regions.length - 1; i >= 0; i--) {
      var region = regions[i];
      var nodes = region.nodes || [];
      var shapeType = region.shape_type || 'POLYGON';
      if (nodes.length < (shapeType === 'CIRCLE' ? 2 : 3)) continue;
      (0,_shared_map_geometry__WEBPACK_IMPORTED_MODULE_0__.buildAreaPathFromNodes)(ctx, nodes, shapeType, W, H);
      if (ctx.isPointInPath(x, y)) return region;
    }
    return null;
  }
  function drawAreaShape(ctx, area, W, H) {
    const nodes = area.nodes || [];
    if (!nodes.length) return;
    const shapeType = area.shape_type || 'POLYGON';
    const minNodes = shapeType === 'CIRCLE' ? 2 : 3;
    if (nodes.length < minNodes) return;
    const styles = area.canvas_styles || {};
    const fill = styles.fill || '#2271b14d';
    const stroke = styles.stroke || '#2271b1';
    const strokeWidth = styles.strokeWidth || 2;
    (0,_shared_map_geometry__WEBPACK_IMPORTED_MODULE_0__.buildAreaPathFromNodes)(ctx, nodes, shapeType, W, H);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
    (0,_shared_map_geometry__WEBPACK_IMPORTED_MODULE_0__.drawShapeLabel)(ctx, (0,_shared_map_geometry__WEBPACK_IMPORTED_MODULE_0__.areaLabelText)(area), styles, nodes, shapeType, W, H);
  }

  // ── Labels ────────────────────────────────────────────────────────────────
  // Box math, drawing, and hit-testing come from the shared geometry module;
  // the frontend simply skips labels without text.

  function drawLabel(ctx, label) {
    if (!label.text) return;
    (0,_shared_map_geometry__WEBPACK_IMPORTED_MODULE_0__.drawLabelShape)(ctx, label);
  }

  // Resolves an object's icon artwork; only icon mode draws one.
  function loadObjectMarkerImage(obj) {
    if (!obj.icon_url || !(0,_shared_map_geometry__WEBPACK_IMPORTED_MODULE_0__.objectUsesIcon)(obj.canvas_styles)) return Promise.resolve(null);
    const fill = obj.canvas_styles?.fillStyle || '#ffffff';
    const stroke = obj.canvas_styles?.strokeStyle || '#2271b1';
    return obj.icon_mime === 'image/svg+xml' ? loadSvgWithColors(obj.icon_url, fill, stroke) : loadImage(obj.icon_url);
  }

  // ── Infobox drawer ────────────────────────────────────────────────────────
  // The shell (one element shared by every CNS block on the page) lives in
  // src/shared/frontend/drawer.js. Only the body HTML is map-specific.

  function showInfobox(wrap, item) {
    const resolved = item.infobox_resolved || {};
    const title = resolved.title || item.title || '';
    const excerpt = resolved.excerpt || '';
    const content = resolved.content || '';
    const imgUrl = resolved.image_url || '';
    const postUrl = resolved.post_url || '';
    const infoboxes = resolved.infoboxes || [];
    let html = '';
    if (imgUrl) html += `<img class="cns-map-drawer__image" src="${(0,_shared_frontend_drawer__WEBPACK_IMPORTED_MODULE_1__.escHtml)(encodeURI(imgUrl))}" alt="" />`;
    if (title) html += `<h2 class="cns-map-drawer__title">${(0,_shared_frontend_drawer__WEBPACK_IMPORTED_MODULE_1__.escHtml)(title)}</h2>`;
    // Prefer the excerpt (plain text → escaped); fall back to the block
    // content only when there's no excerpt (e.g. manual infoboxes, whose
    // content is server-rendered block HTML sanitized before storage).
    if (excerpt) {
      html += `<p class="cns-map-drawer__excerpt">${(0,_shared_frontend_drawer__WEBPACK_IMPORTED_MODULE_1__.escHtml)(excerpt)}</p>`;
    } else if (content) {
      html += `<div class="cns-map-drawer__content">${content}</div>`;
    }
    // Wiki-suite infoboxes: server-rendered block markup (render_block of
    // trusted admin content), one wrapper per top-level infobox.
    infoboxes.forEach(function (ib) {
      html += `<div class="cns-map-drawer__infobox">${ib}</div>`;
    });
    if (postUrl) html += `<a class="cns-map-drawer__link" href="${(0,_shared_frontend_drawer__WEBPACK_IMPORTED_MODULE_1__.escHtml)(encodeURI(postUrl))}">Read more &rarr;</a>`;
    (0,_shared_frontend_drawer__WEBPACK_IMPORTED_MODULE_1__.showDrawer)(html, handleInfoboxToggle);
    expandInfoboxes(document.querySelector('.cns-map-drawer__body'));
  }

  // The wiki-suite infobox collapse is normally driven by the WP Interactivity
  // API at page load, which never hydrates markup injected into the drawer at
  // click time. So we own it: start every infobox/group expanded (the CSS keys
  // visibility off these classes), and a delegated handler on the drawer body
  // (wired once by the shared drawer) toggles them when a title button is hit.
  function expandInfoboxes(container) {
    container.querySelectorAll('.infobox').forEach(function (el) {
      el.classList.add('is-active');
    });
    container.querySelectorAll('.infobox-group__outer').forEach(function (el) {
      el.classList.add('is-active-group');
    });
  }
  function handleInfoboxToggle(e) {
    const btn = e.target.closest('.toggle-btn');
    if (!btn) return;
    const groupTitle = btn.closest('.infobox-group__title');
    if (groupTitle && groupTitle.parentElement) {
      groupTitle.parentElement.classList.toggle('is-active-group');
      return;
    }
    const boxTitle = btn.closest('.infobox__title');
    if (boxTitle && boxTitle.parentElement) {
      boxTitle.parentElement.classList.toggle('is-active');
    }
  }
  function hideInfobox() {
    ;(0,_shared_frontend_drawer__WEBPACK_IMPORTED_MODULE_1__.closeDrawer)();
  }

  // ── Hierarchy tooltip ─────────────────────────────────────────────────────
  // A small tooltip that follows the cursor (or appears near the region) on
  // hover, showing the child map's thumbnail, title and excerpt.
  // All thumbnail images are pre-loaded during initMap for a smooth experience.

  function getOrCreateHierarchyTooltip() {
    var tip = document.getElementById('cns-map-hierarchy-tip');
    if (!tip) {
      tip = document.createElement('div');
      tip.id = 'cns-map-hierarchy-tip';
      tip.className = 'cns-map-hierarchy-tip';
      tip.setAttribute('aria-hidden', 'true');
      document.body.appendChild(tip);
    }
    return tip;
  }
  function showHierarchyTooltip(region, canvasRect, canvasX, canvasY, scaleX, scaleY) {
    var tip = getOrCreateHierarchyTooltip();
    tip.replaceChildren();

    // One tooltip element is reused for every region, so per-region colors
    // must be cleared as well as set — otherwise the previously hovered
    // region's palette sticks. Removing the property falls back to the
    // stylesheet's default rather than to an empty value.
    var styles = region.canvas_styles || {};
    if (styles.tipBgColor) tip.style.setProperty('--cns-tip-bg', styles.tipBgColor);else tip.style.removeProperty('--cns-tip-bg');
    if (styles.tipBorderColor) tip.style.setProperty('--cns-tip-border', styles.tipBorderColor);else tip.style.removeProperty('--cns-tip-border');
    if (styles.tipTextColor) tip.style.setProperty('--cns-tip-text', styles.tipTextColor);else tip.style.removeProperty('--cns-tip-text');
    if (region.child_map_thumbnail) {
      var thumb = document.createElement('img');
      thumb.className = 'cns-map-hierarchy-tip__thumb';
      thumb.src = encodeURI(region.child_map_thumbnail);
      thumb.alt = '';
      tip.appendChild(thumb);
    }
    // Infobox overrides win over the child map's own title/excerpt — the
    // same precedence the canvas label uses.
    var tipTitle = (0,_shared_map_geometry__WEBPACK_IMPORTED_MODULE_0__.regionLabelText)(region);
    var tipExcerpt = region.description_override || region.child_map_excerpt || '';
    if (tipTitle) {
      var title = document.createElement('strong');
      title.className = 'cns-map-hierarchy-tip__title';
      title.textContent = tipTitle;
      tip.appendChild(title);
    }
    if (tipExcerpt) {
      var excerpt = document.createElement('p');
      excerpt.className = 'cns-map-hierarchy-tip__excerpt';
      excerpt.textContent = tipExcerpt;
      tip.appendChild(excerpt);
    }

    // Position near cursor, offset so it doesn't obscure the pointer.
    var clientX = canvasRect.left + canvasX * scaleX;
    var clientY = canvasRect.top + canvasY * scaleY;
    tip.style.left = clientX + 14 + window.scrollX + 'px';
    tip.style.top = clientY - 10 + window.scrollY + 'px';
    tip.classList.add('is-visible');
  }
  function hideHierarchyTooltip() {
    var tip = document.getElementById('cns-map-hierarchy-tip');
    if (tip) tip.classList.remove('is-visible');
  }

  // ── Zoom controls ─────────────────────────────────────────────────────────
  // Zoom scales the canvas's *display* width inside the (then scrollable)
  // .cns-map-canvas-wrap. The canvas pixel coordinate system is untouched,
  // so all hit tests keep working — click/hover handlers already normalize
  // by getBoundingClientRect. Buttons sit on the block wrapper (top right),
  // outside the scroll area, so they stay put while panning.

  function setupZoomControls(wrapper, canvas) {
    const scroller = canvas.parentElement; // .cns-map-canvas-wrap
    if (!scroller) return;
    const MIN = 1,
      MAX = 4,
      STEP = 0.1;
    let zoom = 1;
    const controls = document.createElement('div');
    controls.className = 'cns-map-zoom';
    const fsBtn = document.createElement('button');
    const zoomIn = document.createElement('button');
    const zoomOut = document.createElement('button');
    const value = document.createElement('span');
    fsBtn.type = 'button';
    zoomIn.type = 'button';
    zoomOut.type = 'button';
    fsBtn.className = 'cns-map-zoom__btn cns-map-zoom__btn--fs';
    zoomIn.className = 'cns-map-zoom__btn';
    zoomOut.className = 'cns-map-zoom__btn';
    zoomIn.textContent = '+';
    zoomOut.textContent = '−';
    zoomIn.setAttribute('aria-label', 'Zoom map in');
    zoomOut.setAttribute('aria-label', 'Zoom map out');
    value.className = 'cns-map-zoom__value';
    controls.appendChild(fsBtn);
    controls.appendChild(zoomIn);
    controls.appendChild(value);
    controls.appendChild(zoomOut);
    wrapper.appendChild(controls);

    // ── Lightbox-style fullscreen (zooming stays available inside) ────────
    let fullscreen = false;
    function renderFsBtn() {
      fsBtn.textContent = fullscreen ? '✕' : '⛶';
      fsBtn.setAttribute('aria-label', fullscreen ? 'Exit fullscreen' : 'View map fullscreen');
    }
    function setFullscreen(on) {
      fullscreen = on;
      wrapper.classList.toggle('is-fullscreen', on);
      document.body.classList.toggle('cns-map-fullscreen-open', on);
      renderFsBtn();
      // Fullscreen fits the canvas to the viewport, normal mode fits it to
      // the wrap, so the zoom-1 size differs between them and the base has
      // to be taken again.
      remeasureFit();
    }
    fsBtn.addEventListener('click', function () {
      setFullscreen(!fullscreen);
    });
    document.addEventListener('keydown', function (e) {
      if (e.key !== 'Escape' || !fullscreen) return;
      // Let Esc close an open infobox drawer first; the next Esc exits.
      if ((0,_shared_frontend_drawer__WEBPACK_IMPORTED_MODULE_1__.isDrawerOpen)()) return;
      setFullscreen(false);
    });
    renderFsBtn();
    function render() {
      value.textContent = Math.round(zoom * 100) + '%';
      zoomIn.disabled = zoom >= MAX;
      zoomOut.disabled = zoom <= MIN;
    }

    // The canvas's displayed width at zoom 1, in whichever mode is active.
    // Zooming multiplies this rather than setting a percentage of the scroll
    // container: in fullscreen the container is a flex box, and a percentage
    // width there is a flex base size that gets shrunk straight back to the
    // container — so zooming appeared to stop after one step.
    let fitWidth = 0;
    function applyZoom(z) {
      if (z > 1) {
        scroller.classList.add('is-zoomed');
        canvas.style.maxWidth = 'none';
        canvas.style.width = fitWidth * z + 'px';
      } else {
        scroller.classList.remove('is-zoomed');
        canvas.style.maxWidth = '';
        canvas.style.width = '';
      }
    }

    /** Re-reads the zoom-1 width, keeping the current zoom level. */
    function remeasureFit() {
      const current = zoom;
      applyZoom(1);
      fitWidth = canvas.getBoundingClientRect().width;
      applyZoom(current);
    }
    function apply(next) {
      // Round to one decimal so repeated 0.1 steps don't accumulate
      // float drift (1.7000000000000002).
      next = Math.min(MAX, Math.max(MIN, Math.round(next * 10) / 10));
      if (next === zoom) return;
      // Keep the viewport centered on the same map point.
      const cx = (scroller.scrollLeft + scroller.clientWidth / 2) / zoom;
      const cy = (scroller.scrollTop + scroller.clientHeight / 2) / zoom;
      // Stepping away from 1: the canvas is at its fit size right now, so
      // this is the moment to measure it.
      if (zoom === 1) fitWidth = canvas.getBoundingClientRect().width;
      zoom = next;
      applyZoom(zoom);
      render();
      scroller.scrollLeft = cx * zoom - scroller.clientWidth / 2;
      scroller.scrollTop = cy * zoom - scroller.clientHeight / 2;
    }
    zoomIn.addEventListener('click', function () {
      apply(zoom + STEP);
    });
    zoomOut.addEventListener('click', function () {
      apply(zoom - STEP);
    });
    render();
  }

  // ── Map initialiser ───────────────────────────────────────────────────────

  async function initMap(wrapper) {
    const scriptEl = wrapper.querySelector('script[data-cns-map]');
    if (!scriptEl) return;
    let data;
    try {
      data = JSON.parse(scriptEl.textContent);
    } catch (err) {
      console.error('[cns-map-suite] Block data parse error:', err);
      return;
    }
    const canvas = wrapper.querySelector('.cns-map-canvas');
    if (!canvas) return;
    canvas.width = data.width;
    canvas.height = data.height;
    setupZoomControls(wrapper, canvas);
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;

    // Author's saved layer choice, which the toggles mutate in place.
    // A missing flag means "on", matching the PHP reader.
    const layers = {
      areas: data.showAreas !== false,
      objects: data.showObjects !== false,
      labels: data.showLabels !== false
    };

    // Load all marker images in parallel once, so toggling a layer
    // repaints without re-fetching, and first paint isn't serialized on
    // one request per icon.
    const objects = data.objects || [];
    const markerImgs = await Promise.all(objects.map(loadObjectMarkerImage));

    // One paint of every layer, in the order that gives labels the top of
    // the stack. Re-run whenever a layer is toggled.
    async function paint() {
      await drawBackground(canvas, data);
      if (layers.areas) {
        for (const area of data.areas || []) {
          drawAreaShape(ctx, area, W, H);
        }
      }
      for (const region of data.hierarchyRegions || []) {
        drawHierarchyRegion(ctx, region, W, H);
      }
      if (layers.objects) {
        objects.forEach(function (obj, i) {
          (0,_shared_map_geometry__WEBPACK_IMPORTED_MODULE_0__.drawObjectMarker)(ctx, {
            x: obj.x,
            y: obj.y,
            title: obj.title,
            styles: obj.canvas_styles
          }, {
            image: markerImgs[i]
          });
        });
      }
      if (layers.labels) {
        for (const label of data.labels || []) {
          drawLabel(ctx, label);
        }
      }
    }
    await paint();
    // On the block wrapper, outside .cns-map-canvas-wrap, so the buttons stay
    // put while a zoomed canvas pans — same as the zoom controls.
    (0,_shared_frontend_layer_toggles__WEBPACK_IMPORTED_MODULE_2__.setupLayerToggles)({
      container: wrapper,
      className: 'cns-map-layers',
      present: {
        areas: (data.areas || []).length > 0,
        objects: (data.objects || []).length > 0,
        labels: (data.labels || []).length > 0
      },
      layers,
      onChange: function () {
        void paint();
      }
    });

    // Pre-load all hierarchy region thumbnails for smooth hover.
    for (const region of data.hierarchyRegions || []) {
      if (region.child_map_thumbnail) loadImage(region.child_map_thumbnail);
    }
    const hierarchyRegions = data.hierarchyRegions || [];
    const hasHierarchy = hierarchyRegions.length > 0;

    // Infobox click check, per item: objects/areas/labels without infobox
    // content stay inert, so nothing ever opens an empty drawer (and
    // clicks pass through decorative items to whatever lies beneath).
    const hasIbContent = function (item) {
      const ib = item.infobox_resolved || {};
      return ib.title || ib.content || ib.image_url || ib.post_url;
    };
    const clickableObjects = (data.objects || []).filter(hasIbContent);
    const clickableAreas = (data.areas || []).filter(hasIbContent);
    const clickableLabels = (data.labels || []).filter(hasIbContent);
    const hasClickable = clickableObjects.length > 0 || clickableAreas.length > 0 || clickableLabels.length > 0;
    if (!hasClickable && !hasHierarchy) return;
    canvas.style.cursor = 'pointer';

    // ── Hover: hierarchy tooltip ──────────────────────────────────────────
    if (hasHierarchy) {
      canvas.addEventListener('mousemove', function (e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = rect.width / W;
        const scaleY = rect.height / H;
        const x = (e.clientX - rect.left) / scaleX;
        const y = (e.clientY - rect.top) / scaleY;
        const hitRegion = findHierarchyRegionAtPoint(ctx, x, y, hierarchyRegions, W, H);
        if (hitRegion) {
          canvas.style.cursor = 'pointer';
          showHierarchyTooltip(hitRegion, rect, x, y, scaleX, scaleY);
        } else {
          hideHierarchyTooltip();
        }
      });
      canvas.addEventListener('mouseleave', function () {
        hideHierarchyTooltip();
      });
    }

    // ── Click: hierarchy navigation or infobox ────────────────────────────
    canvas.addEventListener('click', function (e) {
      const rect = canvas.getBoundingClientRect();
      const scaleX = rect.width / W;
      const scaleY = rect.height / H;
      const x = (e.clientX - rect.left) / scaleX;
      const y = (e.clientY - rect.top) / scaleY;

      // Hierarchy regions take top priority — click navigates to child map.
      if (hasHierarchy) {
        const hitRegion = findHierarchyRegionAtPoint(ctx, x, y, hierarchyRegions, W, H);
        if (hitRegion && hitRegion.child_map_url) {
          hideHierarchyTooltip();
          window.location.href = hitRegion.child_map_url;
          return;
        }
      }
      if (!hasClickable) return;

      // Labels are drawn on top of objects, so they win the hit test.
      // A hidden layer is not clickable either.
      if (layers.labels) {
        const hitLabel = (0,_shared_map_geometry__WEBPACK_IMPORTED_MODULE_0__.findLabelPartAtPoint)(ctx, x, y, clickableLabels);
        if (hitLabel) {
          showInfobox(wrapper, hitLabel.label);
          return;
        }
      }
      if (layers.objects) {
        const hitObj = (0,_shared_map_geometry__WEBPACK_IMPORTED_MODULE_0__.findObjectAtPoint)(ctx, x, y, clickableObjects);
        if (hitObj) {
          showInfobox(wrapper, hitObj);
          return;
        }
      }
      if (layers.areas) {
        const hitArea = (0,_shared_map_geometry__WEBPACK_IMPORTED_MODULE_0__.findAreaAtPoint)(ctx, x, y, clickableAreas, W, H);
        if (hitArea) {
          showInfobox(wrapper, hitArea);
          return;
        }
      }
      hideInfobox();
    });
  }

  // ── Boot ──────────────────────────────────────────────────────────────────

  function init() {
    document.querySelectorAll('.wp-block-cns-map-suite-map').forEach(initMap);
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
})();

/******/ })()
;
//# sourceMappingURL=view.js.map