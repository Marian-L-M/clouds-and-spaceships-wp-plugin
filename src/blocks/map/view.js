// Geometry shared with the admin editor — one source of truth for shape
// paths, label boxes, and hit areas (see src/shared/map-geometry.ts).
import {
	buildAreaPathFromNodes,
	drawLabelShape,
	findAreaAtPoint,
	findLabelPartAtPoint,
	findObjectAtPoint,
	drawShapeLabel,
	regionLabelText,
	areaLabelText,
} from '../../shared/map-geometry';

(function () {
	'use strict';

	// ── Image / SVG cache ─────────────────────────────────────────────────────

	const imageCache = {};

	function loadImage(url) {
		if (!url) return Promise.resolve(null);
		if (imageCache[url]) return Promise.resolve(imageCache[url]);
		return new Promise(function (resolve) {
			const img = new Image();
			img.onload  = function () { imageCache[url] = img; resolve(img); };
			img.onerror = function () { resolve(null); };
			img.src = url;
		});
	}

	async function loadSvgWithColors(url, fill, stroke) {
		const key = url + '|' + (fill || '') + '|' + (stroke || '');
		if (imageCache[key]) return imageCache[key];
		try {
			const resp = await fetch(url, { credentials: 'same-origin' });
			const text = await resp.text();
			const doc  = new DOMParser().parseFromString(text, 'image/svg+xml');
			const svg  = doc.documentElement;
			if (fill)   svg.setAttribute('fill',   fill);
			if (stroke) svg.setAttribute('stroke', stroke);
			const blob    = new Blob([new XMLSerializer().serializeToString(doc)], { type: 'image/svg+xml' });
			const blobUrl = URL.createObjectURL(blob);
			return new Promise(function (resolve) {
				const img = new Image();
				img.onload  = function () { URL.revokeObjectURL(blobUrl); imageCache[key] = img; resolve(img); };
				img.onerror = function () { URL.revokeObjectURL(blobUrl); resolve(null); };
				img.src = blobUrl;
			});
		} catch { return null; }
	}

	// ── Draw pipeline ─────────────────────────────────────────────────────────

	async function drawBackground(canvas, data) {
		const ctx    = canvas.getContext('2d');
		const width  = canvas.width;
		const height = canvas.height;
		ctx.clearRect(0, 0, width, height);

		if (data.bgType === 'image' && data.bgImageUrl) {
			const bgImg = await loadImage(data.bgImageUrl);
			if (bgImg) {
				const scale = Math.max(width / bgImg.naturalWidth, height / bgImg.naturalHeight);
				const drawW = bgImg.naturalWidth  * scale;
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
		const nodes     = region.nodes || [];
		const shapeType = region.shape_type || 'POLYGON';
		if (nodes.length < (shapeType === 'CIRCLE' ? 2 : 3)) return;

		const styles      = region.canvas_styles || {};
		const fill        = styles.fill        || '#e8a02040';
		const stroke      = styles.stroke      || '#e8a020';
		const strokeWidth = styles.strokeWidth || 2;

		buildAreaPathFromNodes(ctx, nodes, shapeType, W, H);

		ctx.fillStyle = fill;
		ctx.fill();

		ctx.strokeStyle = stroke;
		ctx.lineWidth   = strokeWidth;
		ctx.stroke();

		drawShapeLabel(ctx, regionLabelText(region), styles, nodes, shapeType, W, H);
	}

	function findHierarchyRegionAtPoint(ctx, x, y, regions, W, H) {
		for (var i = regions.length - 1; i >= 0; i--) {
			var region    = regions[i];
			var nodes     = region.nodes || [];
			var shapeType = region.shape_type || 'POLYGON';
			if (nodes.length < (shapeType === 'CIRCLE' ? 2 : 3)) continue;
			buildAreaPathFromNodes(ctx, nodes, shapeType, W, H);
			if (ctx.isPointInPath(x, y)) return region;
		}
		return null;
	}

	function drawAreaShape(ctx, area, W, H) {
		const nodes = area.nodes || [];
		if (!nodes.length) return;

		const shapeType = area.shape_type || 'POLYGON';
		const minNodes  = shapeType === 'CIRCLE' ? 2 : 3;
		if (nodes.length < minNodes) return;

		const styles      = area.canvas_styles || {};
		const fill        = styles.fill        || '#2271b14d';
		const stroke      = styles.stroke      || '#2271b1';
		const strokeWidth = styles.strokeWidth || 2;

		buildAreaPathFromNodes(ctx, nodes, shapeType, W, H);

		ctx.fillStyle = fill;
		ctx.fill();

		ctx.strokeStyle = stroke;
		ctx.lineWidth   = strokeWidth;
		ctx.stroke();

		drawShapeLabel(ctx, areaLabelText(area), styles, nodes, shapeType, W, H);
	}

	// ── Labels ────────────────────────────────────────────────────────────────
	// Box math, drawing, and hit-testing come from the shared geometry module;
	// the frontend simply skips labels without text.

	function drawLabel(ctx, label) {
		if (!label.text) return;
		drawLabelShape(ctx, label);
	}

	function drawFallbackMarker(ctx, x, y, size, fill, stroke) {
		ctx.save();
		ctx.beginPath();
		ctx.arc(x, y, size / 2, 0, Math.PI * 2);
		ctx.fillStyle   = fill   || '#2271b1';
		ctx.strokeStyle = stroke || '#fff';
		ctx.lineWidth   = 2;
		ctx.fill();
		ctx.stroke();
		ctx.restore();
	}

	// Resolves the marker image for an object (or null → fallback dot).
	function loadObjectMarkerImage(obj) {
		const fill   = obj.canvas_styles?.fillStyle   || '#ffffff';
		const stroke = obj.canvas_styles?.strokeStyle || '#2271b1';
		if (!obj.icon_url) return Promise.resolve(null);
		return obj.icon_mime === 'image/svg+xml'
			? loadSvgWithColors(obj.icon_url, fill, stroke)
			: loadImage(obj.icon_url);
	}

	function drawObjectMarker(ctx, obj, img) {
		const size   = obj.canvas_styles?.size        || 32;
		const fill   = obj.canvas_styles?.fillStyle   || '#ffffff';
		const stroke = obj.canvas_styles?.strokeStyle || '#2271b1';

		if (img) {
			ctx.drawImage(img, obj.x - size / 2, obj.y - size / 2, size, size);
			return;
		}
		drawFallbackMarker(ctx, obj.x, obj.y, size, fill, stroke);
	}

	// ── Infobox drawer ────────────────────────────────────────────────────────
	// A single side drawer shared across all map instances on the page.
	// Lives on document.body; class toggle (not hidden attr) controls visibility
	// so author display:flex/block never fights the UA [hidden] rule.

	function escHtml(str) {
		return String(str)
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;');
	}

	function closeDrawer(drawer) {
		drawer.classList.remove('is-open');
		document.body.classList.remove('cns-map-drawer-open');
	}

	function getOrCreateDrawer() {
		let drawer = document.getElementById('cns-map-drawer');
		if (!drawer) {
			drawer = document.createElement('div');
			drawer.id        = 'cns-map-drawer';
			drawer.className = 'cns-map-drawer';
			drawer.setAttribute('role', 'dialog');
			drawer.setAttribute('aria-modal', 'true');
			drawer.innerHTML = `
				<div class="cns-map-drawer__backdrop"></div>
				<div class="cns-map-drawer__panel">
					<div class="cns-map-drawer__header">
						<button class="cns-map-drawer__close" aria-label="Close">&times;</button>
					</div>
					<div class="cns-map-drawer__body"></div>
				</div>`;
			document.body.appendChild(drawer);

			drawer.querySelector('.cns-map-drawer__backdrop').addEventListener('click', function () {
				closeDrawer(drawer);
			});
			drawer.querySelector('.cns-map-drawer__close').addEventListener('click', function () {
				closeDrawer(drawer);
			});
			drawer.querySelector('.cns-map-drawer__body').addEventListener('click', handleInfoboxToggle);
			document.addEventListener('keydown', function (e) {
				if (e.key === 'Escape' && drawer.classList.contains('is-open')) closeDrawer(drawer);
			});
		}
		return drawer;
	}

	function showInfobox(wrap, item) {
		const drawer    = getOrCreateDrawer();
		const body      = drawer.querySelector('.cns-map-drawer__body');
		const resolved  = item.infobox_resolved || {};
		const title     = resolved.title     || item.title || '';
		const excerpt   = resolved.excerpt   || '';
		const content   = resolved.content   || '';
		const imgUrl    = resolved.image_url || '';
		const postUrl   = resolved.post_url  || '';
		const infoboxes = resolved.infoboxes || [];

		let html = '';
		if (imgUrl)  html += `<img class="cns-map-drawer__image" src="${escHtml(encodeURI(imgUrl))}" alt="" />`;
		if (title)   html += `<h2 class="cns-map-drawer__title">${escHtml(title)}</h2>`;
		// Prefer the excerpt (plain text → escaped); fall back to the block
		// content only when there's no excerpt (e.g. manual infoboxes, whose
		// content is server-rendered block HTML sanitized before storage).
		if (excerpt) {
			html += `<p class="cns-map-drawer__excerpt">${escHtml(excerpt)}</p>`;
		} else if (content) {
			html += `<div class="cns-map-drawer__content">${content}</div>`;
		}
		// Wiki-suite infoboxes: server-rendered block markup (render_block of
		// trusted admin content), one wrapper per top-level infobox.
		infoboxes.forEach(function (ib) {
			html += `<div class="cns-map-drawer__infobox">${ib}</div>`;
		});
		if (postUrl) html += `<a class="cns-map-drawer__link" href="${escHtml(encodeURI(postUrl))}">Read more &rarr;</a>`;

		body.innerHTML = html;
		expandInfoboxes(body);
		drawer.classList.add('is-open');
		document.body.classList.add('cns-map-drawer-open');
		drawer.querySelector('.cns-map-drawer__close').focus();
	}

	// The wiki-suite infobox collapse is normally driven by the WP Interactivity
	// API at page load, which never hydrates markup injected into the drawer at
	// click time. So we own it: start every infobox/group expanded (the CSS keys
	// visibility off these classes), and a delegated handler on the drawer body
	// (wired once in getOrCreateDrawer) toggles them when a title button is hit.
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
		const drawer = document.getElementById('cns-map-drawer');
		if (drawer) closeDrawer(drawer);
	}

	// ── Hierarchy tooltip ─────────────────────────────────────────────────────
	// A small tooltip that follows the cursor (or appears near the region) on
	// hover, showing the child map's thumbnail, title and excerpt.
	// All thumbnail images are pre-loaded during initMap for a smooth experience.

	function getOrCreateHierarchyTooltip() {
		var tip = document.getElementById('cns-map-hierarchy-tip');
		if (!tip) {
			tip = document.createElement('div');
			tip.id        = 'cns-map-hierarchy-tip';
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
		if (styles.tipBgColor) tip.style.setProperty('--cns-tip-bg', styles.tipBgColor);
		else                   tip.style.removeProperty('--cns-tip-bg');
		if (styles.tipBorderColor) tip.style.setProperty('--cns-tip-border', styles.tipBorderColor);
		else                       tip.style.removeProperty('--cns-tip-border');
		if (styles.tipTextColor) tip.style.setProperty('--cns-tip-text', styles.tipTextColor);
		else                     tip.style.removeProperty('--cns-tip-text');

		if (region.child_map_thumbnail) {
			var thumb = document.createElement('img');
			thumb.className = 'cns-map-hierarchy-tip__thumb';
			thumb.src       = encodeURI(region.child_map_thumbnail);
			thumb.alt       = '';
			tip.appendChild(thumb);
		}
		// Infobox overrides win over the child map's own title/excerpt — the
		// same precedence the canvas label uses.
		var tipTitle   = regionLabelText(region);
		var tipExcerpt = region.description_override || region.child_map_excerpt || '';

		if (tipTitle) {
			var title = document.createElement('strong');
			title.className   = 'cns-map-hierarchy-tip__title';
			title.textContent = tipTitle;
			tip.appendChild(title);
		}
		if (tipExcerpt) {
			var excerpt = document.createElement('p');
			excerpt.className   = 'cns-map-hierarchy-tip__excerpt';
			excerpt.textContent = tipExcerpt;
			tip.appendChild(excerpt);
		}

		// Position near cursor, offset so it doesn't obscure the pointer.
		var clientX = canvasRect.left + canvasX * scaleX;
		var clientY = canvasRect.top  + canvasY * scaleY;
		tip.style.left = (clientX + 14 + window.scrollX) + 'px';
		tip.style.top  = (clientY - 10 + window.scrollY) + 'px';
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

		const MIN = 1, MAX = 4, STEP = 0.1;
		let zoom = 1;

		const controls = document.createElement('div');
		controls.className = 'cns-map-zoom';
		const fsBtn   = document.createElement('button');
		const zoomIn  = document.createElement('button');
		const zoomOut = document.createElement('button');
		const value   = document.createElement('span');
		fsBtn.type   = 'button';
		zoomIn.type  = 'button';
		zoomOut.type = 'button';
		fsBtn.className   = 'cns-map-zoom__btn cns-map-zoom__btn--fs';
		zoomIn.className  = 'cns-map-zoom__btn';
		zoomOut.className = 'cns-map-zoom__btn';
		zoomIn.textContent  = '+';
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
		}

		fsBtn.addEventListener('click', function () { setFullscreen(!fullscreen); });
		document.addEventListener('keydown', function (e) {
			if (e.key !== 'Escape' || !fullscreen) return;
			// Let Esc close an open infobox drawer first; the next Esc exits.
			const drawer = document.getElementById('cns-map-drawer');
			if (drawer && drawer.classList.contains('is-open')) return;
			setFullscreen(false);
		});
		renderFsBtn();

		function render() {
			value.textContent = Math.round(zoom * 100) + '%';
			zoomIn.disabled  = zoom >= MAX;
			zoomOut.disabled = zoom <= MIN;
		}

		function apply(next) {
			// Round to one decimal so repeated 0.1 steps don't accumulate
			// float drift (1.7000000000000002).
			next = Math.min(MAX, Math.max(MIN, Math.round(next * 10) / 10));
			if (next === zoom) return;
			// Keep the viewport centered on the same map point.
			const cx = (scroller.scrollLeft + scroller.clientWidth / 2) / zoom;
			const cy = (scroller.scrollTop + scroller.clientHeight / 2) / zoom;
			zoom = next;
			if (zoom > 1) {
				canvas.style.maxWidth = 'none';
				canvas.style.width    = (zoom * 100) + '%';
				scroller.classList.add('is-zoomed');
			} else {
				canvas.style.maxWidth = '';
				canvas.style.width    = '';
				scroller.classList.remove('is-zoomed');
			}
			render();
			scroller.scrollLeft = cx * zoom - scroller.clientWidth / 2;
			scroller.scrollTop  = cy * zoom - scroller.clientHeight / 2;
		}

		zoomIn.addEventListener('click', function () { apply(zoom + STEP); });
		zoomOut.addEventListener('click', function () { apply(zoom - STEP); });
		render();
	}

	// ── Map initialiser ───────────────────────────────────────────────────────

	async function initMap(wrapper) {
		const scriptEl = wrapper.querySelector('script[data-cns-map]');
		if (!scriptEl) return;

		let data;
		try { data = JSON.parse(scriptEl.textContent); } catch (err) { console.error('[cns-map-suite] Block data parse error:', err); return; }

		const canvas = wrapper.querySelector('.cns-map-canvas');
		if (!canvas) return;

		canvas.width  = data.width;
		canvas.height = data.height;

		setupZoomControls(wrapper, canvas);

		await drawBackground(canvas, data);

		const ctx = canvas.getContext('2d');
		const W   = canvas.width;
		const H   = canvas.height;

		for (const area of (data.areas || [])) {
			drawAreaShape(ctx, area, W, H);
		}
		for (const region of (data.hierarchyRegions || [])) {
			drawHierarchyRegion(ctx, region, W, H);
		}
		// Load all marker images in parallel, then draw in list order so
		// stacking is deterministic and first paint isn't serialized on
		// one request per icon.
		const objects    = data.objects || [];
		const markerImgs = await Promise.all(objects.map(loadObjectMarkerImage));
		objects.forEach(function (obj, i) {
			drawObjectMarker(ctx, obj, markerImgs[i]);
		});

		for (const label of (data.labels || [])) {
			drawLabel(ctx, label);
		}

		// Pre-load all hierarchy region thumbnails for smooth hover.
		for (const region of (data.hierarchyRegions || [])) {
			if (region.child_map_thumbnail) loadImage(region.child_map_thumbnail);
		}

		const hierarchyRegions = data.hierarchyRegions || [];
		const hasHierarchy     = hierarchyRegions.length > 0;

		// Infobox click check, per item: objects/areas/labels without infobox
		// content stay inert, so nothing ever opens an empty drawer (and
		// clicks pass through decorative items to whatever lies beneath).
		const hasIbContent = function (item) {
			const ib = item.infobox_resolved || {};
			return ib.title || ib.content || ib.image_url || ib.post_url;
		};
		const clickableObjects = (data.objects || []).filter(hasIbContent);
		const clickableAreas   = (data.areas   || []).filter(hasIbContent);
		const clickableLabels  = (data.labels  || []).filter(hasIbContent);
		const hasClickable =
			clickableObjects.length > 0 ||
			clickableAreas.length > 0 ||
			clickableLabels.length > 0;

		if (!hasClickable && !hasHierarchy) return;

		canvas.style.cursor = 'pointer';

		// ── Hover: hierarchy tooltip ──────────────────────────────────────────
		if (hasHierarchy) {
			canvas.addEventListener('mousemove', function (e) {
				const rect   = canvas.getBoundingClientRect();
				const scaleX = rect.width  / W;
				const scaleY = rect.height / H;
				const x = (e.clientX - rect.left) / scaleX;
				const y = (e.clientY - rect.top)  / scaleY;

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
			const rect   = canvas.getBoundingClientRect();
			const scaleX = rect.width  / W;
			const scaleY = rect.height / H;
			const x = (e.clientX - rect.left) / scaleX;
			const y = (e.clientY - rect.top)  / scaleY;

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
			const hitLabel = findLabelPartAtPoint(ctx, x, y, clickableLabels);
			if (hitLabel) { showInfobox(wrapper, hitLabel.label); return; }

			const hitObj = findObjectAtPoint(ctx, x, y, clickableObjects);
			if (hitObj) { showInfobox(wrapper, hitObj); return; }

			const hitArea = findAreaAtPoint(ctx, x, y, clickableAreas, W, H);
			if (hitArea) { showInfobox(wrapper, hitArea); return; }

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
}());
