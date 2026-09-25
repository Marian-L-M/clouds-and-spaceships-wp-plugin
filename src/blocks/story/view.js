/**
 * Frontend view script for the cns-story-suite/story block.
 */

// The base map is drawn with the map suite's own geometry and marker code, so
// a map looks and behaves the same under a story as it does on its own page.
import {
	buildAreaPathFromNodes,
	drawLabelShape,
	drawObjectMarker,
	drawShapeLabel,
	findLabelPartAtPoint,
	measureObjectMarker,
	objectUsesIcon,
} from '../../shared/map-geometry';
import { escHtml, showDrawer, closeDrawer, isDrawerOpen } from '../../shared/frontend/drawer';
import { setupLayerToggles } from '../../shared/frontend/layer-toggles';

// ── Image loading ─────────────────────────────────────────────────────────────

const imgCache = new Map();

/**
 * Returns a (cached) Image for the URL. If the image hasn't finished loading
 * yet and a callback is given, it fires once on load so the caller can redraw.
 * Passing the same callback repeatedly is safe — addEventListener dedupes it.
 */
function loadImg( url, onLoad ) {
	let img = imgCache.get( url );
	if ( ! img ) {
		img = new Image();
		img.src = url;
		imgCache.set( url, img );
	}
	if ( onLoad && ! img.complete ) {
		img.addEventListener( 'load', onLoad, { once: true } );
	}
	return img;
}

// ── Infobox drawer ────────────────────────────────────────────────────────────
// The shell is shared with the map block (src/shared/frontend/drawer.js) — one
// element serves every CNS block on the page. Only the body HTML differs.

function showInfobox( item ) {
	const resolved = item.infoboxResolved || {};
	const title    = resolved.title    || item.title || '';
	const content  = resolved.content  || '';
	const imgUrl   = resolved.imageUrl || '';
	const postUrl  = resolved.postUrl  || '';
	let html = '';
	if ( imgUrl  ) html += '<img class="cns-map-drawer__image" src="' + encodeURI( imgUrl ) + '" alt="" />';
	if ( title   ) html += '<h2 class="cns-map-drawer__title">' + escHtml( title ) + '</h2>';
	if ( content ) html += '<div class="cns-map-drawer__content">' + content + '</div>';
	if ( postUrl ) html += '<a class="cns-map-drawer__link" href="' + encodeURI( postUrl ) + '">View full post &rarr;</a>';
	showDrawer( html );
}

// ── Story node dialog ─────────────────────────────────────────────────────────
// Centered modal (visually modelled on shadcn/ui's Dialog — rebuilt in plain
// JS/CSS since the frontend has no React) showing the clicked node's story
// info, with prev/next controls that walk the story's connections.

function closeStoryDialog() {
	const dialog = document.getElementById( 'cns-story-dialog' );
	if ( ! dialog ) return;
	dialog.classList.remove( 'is-open' );
	document.body.classList.remove( 'cns-story-dialog-open' );
}

function getOrCreateStoryDialog() {
	let dialog = document.getElementById( 'cns-story-dialog' );
	if ( ! dialog ) {
		dialog = document.createElement( 'div' );
		dialog.id        = 'cns-story-dialog';
		dialog.className = 'cns-story-dialog';
		dialog.setAttribute( 'role', 'dialog' );
		dialog.setAttribute( 'aria-modal', 'true' );
		dialog.innerHTML =
			'<div class="cns-story-dialog__backdrop"></div>' +
			'<div class="cns-story-dialog__panel">' +
				'<button class="cns-story-dialog__close" type="button" aria-label="Close">&times;</button>' +
				'<div class="cns-story-dialog__body"></div>' +
				'<div class="cns-story-dialog__nav"></div>' +
			'</div>';
		document.body.appendChild( dialog );

		dialog.querySelector( '.cns-story-dialog__backdrop' ).addEventListener( 'click', closeStoryDialog );
		dialog.querySelector( '.cns-story-dialog__close' ).addEventListener( 'click', closeStoryDialog );
		document.addEventListener( 'keydown', ( e ) => {
			if ( ! dialog.classList.contains( 'is-open' ) ) return;
			const nav = dialog._cnsNav;
			if ( e.key === 'Escape' ) {
				closeStoryDialog();
			} else if ( e.key === 'ArrowLeft' && nav && nav.prevId !== null ) {
				nav.open( nav.prevId );
			} else if ( e.key === 'ArrowRight' && nav && nav.nextIds.length ) {
				nav.open( nav.nextIds[ 0 ] );
			}
		} );
	}
	return dialog;
}

function renderStoryDialog( data, nodeId, openFn ) {
	const node = data.nodes.find( ( n ) => n.id === nodeId );
	if ( ! node ) return;

	const dialog = getOrCreateStoryDialog();
	const body   = dialog.querySelector( '.cns-story-dialog__body' );
	const nav    = dialog.querySelector( '.cns-story-dialog__nav' );

	const title   = node.titleOverride || node.substoryTitle || '';
	const excerpt = node.excerptOverride || node.substoryExcerpt || '';
	const imgUrl  = node.substoryThumbnailUrl || '';

	// Step label: same numbering as the sidebar list; the start node is unnumbered.
	let stepLabel = '';
	if ( node.id === data.story.startNodeId ) {
		stepLabel = 'Start';
	} else {
		const items = buildOrderedNodes( data.nodes, data.edges, data.story.startNodeId );
		const item  = items.find( ( i ) => i.node.id === nodeId );
		if ( item && item.stepNumber ) stepLabel = item.stepNumber.join( '.' );
	}

	let html = '';
	if ( imgUrl )    html += '<img class="cns-story-dialog__image" src="' + encodeURI( imgUrl ) + '" alt="" />';
	if ( stepLabel ) html += '<span class="cns-story-dialog__step">' + esc( stepLabel ) + '</span>';
	if ( title )     html += '<h2 class="cns-story-dialog__title">' + esc( title ) + '</h2>';
	if ( excerpt )   html += '<p class="cns-story-dialog__excerpt">' + esc( excerpt ) + '</p>';
	if ( node.substoryUrl ) {
		html += '<a class="cns-story-dialog__read-more" href="' + esc( node.substoryUrl ) + '">Read more &rarr;</a>';
	}
	body.innerHTML = html || '<p class="cns-story-dialog__excerpt">' + esc( 'No details for this node.' ) + '</p>';

	// Prev = first incoming connection, next = outgoing connections in branch order.
	const byOrder   = ( a, b ) => a.sortOrder - b.sortOrder || a.id - b.id;
	const prevEdge  = data.edges.filter( ( e ) => e.toNodeId === nodeId ).sort( byOrder )[ 0 ] || null;
	const nextEdges = data.edges.filter( ( e ) => e.fromNodeId === nodeId ).sort( byOrder );
	const nodeTitle = ( id ) => {
		const n = data.nodes.find( ( x ) => x.id === id );
		return n ? ( n.titleOverride || n.substoryTitle || 'Untitled' ) : '';
	};

	let navHtml = '<div class="cns-story-dialog__nav-side">';
	if ( prevEdge ) {
		navHtml += '<button type="button" class="cns-story-dialog__navbtn" data-node="' + prevEdge.fromNodeId + '">' +
			'<span aria-hidden="true">&larr;</span><span class="cns-story-dialog__navbtn-label">' + esc( nodeTitle( prevEdge.fromNodeId ) ) + '</span></button>';
	}
	navHtml += '</div><div class="cns-story-dialog__nav-side cns-story-dialog__nav-side--next">';
	for ( const e of nextEdges ) {
		navHtml += '<button type="button" class="cns-story-dialog__navbtn" data-node="' + e.toNodeId + '">' +
			'<span class="cns-story-dialog__navbtn-label">' + esc( nodeTitle( e.toNodeId ) ) + '</span><span aria-hidden="true">&rarr;</span></button>';
	}
	navHtml += '</div>';
	nav.innerHTML = navHtml;
	nav.hidden = ! prevEdge && ! nextEdges.length;

	nav.querySelectorAll( '.cns-story-dialog__navbtn' ).forEach( ( btn ) => {
		btn.addEventListener( 'click', () => openFn( parseInt( btn.dataset.node, 10 ) ) );
	} );

	dialog._cnsNav = {
		prevId:  prevEdge ? prevEdge.fromNodeId : null,
		nextIds: nextEdges.map( ( e ) => e.toNodeId ),
		open:    openFn,
	};

	const wasOpen = dialog.classList.contains( 'is-open' );
	dialog.classList.add( 'is-open' );
	document.body.classList.add( 'cns-story-dialog-open' );
	if ( ! wasOpen ) dialog.querySelector( '.cns-story-dialog__close' ).focus();
}

// ── Path numbering (mirrors CanvasNodeList algorithm) ─────────────────────────

/**
 * Returns an ordered list of { node, depth, stepNumber } for display.
 * stepNumber is number[]|null — e.g. [1,2,1] → "1.2.1", null = root.
 *
 * Numbering:
 *   • Each component root (startNodeId first, then other in-degree-0 nodes) is unnumbered.
 *   • Top-level section numbers are allocated globally across all components.
 *   • A root with N branches uses sections [nextSection … nextSection+N-1]; a leafless root uses 1 section.
 *   • Children of a root → [section, 1]; linear → increment last; branch → append child index.
 */
function buildOrderedNodes( nodes, edges, startNodeId ) {
	const stepNums     = new Map();
	const fromBranchOf = new Map();

	const startId = startNodeId ?? nodes[ 0 ]?.id ?? null;

	function computeReachable( fromId ) {
		const r = new Set();
		function dfs( id ) {
			if ( r.has( id ) ) return;
			r.add( id );
			for ( const e of edges ) { if ( e.fromNodeId === id ) dfs( e.toNodeId ); }
		}
		dfs( fromId );
		return r;
	}

	const inDegree = new Map();
	for ( const n of nodes ) inDegree.set( n.id, 0 );
	for ( const e of edges ) inDegree.set( e.toNodeId, ( inDegree.get( e.toNodeId ) ?? 0 ) + 1 );

	const roots = [];
	if ( startId !== null ) roots.push( startId );
	for ( const n of nodes ) {
		if ( n.id !== startId && inDegree.get( n.id ) === 0 ) roots.push( n.id );
	}

	const result  = [];
	const visited = new Set();
	let nextSection = 1;

	for ( const rootId of roots ) {
		const reachable = computeReachable( rootId );

		function assignChildren( nodeId, parentNum, fromBranch, isRoot ) {
			const out = edges
				.filter( ( e ) => e.fromNodeId === nodeId && reachable.has( e.toNodeId ) )
				.sort( ( a, b ) => a.sortOrder - b.sortOrder );

			if ( isRoot ) {
				const used = Math.max( 1, out.length );
				out.forEach( ( e, i ) => {
					if ( ! stepNums.has( e.toNodeId ) ) {
						stepNums.set( e.toNodeId, [ nextSection + i, 1 ] );
						fromBranchOf.set( e.toNodeId, false );
					}
				} );
				nextSection += used;
			} else if ( parentNum ) {
				if ( out.length === 1 ) {
					const cid = out[ 0 ].toNodeId;
					if ( ! stepNums.has( cid ) ) {
						const cn = fromBranch
							? [ ...parentNum, 1 ]
							: [ ...parentNum.slice( 0, -1 ), parentNum[ parentNum.length - 1 ] + 1 ];
						stepNums.set( cid, cn );
						fromBranchOf.set( cid, false );
					}
				} else if ( out.length > 1 ) {
					out.forEach( ( e, i ) => {
						if ( ! stepNums.has( e.toNodeId ) ) {
							stepNums.set( e.toNodeId, [ ...parentNum, i + 1 ] );
							fromBranchOf.set( e.toNodeId, true );
						}
					} );
				}
			}
		}

		function visit( nodeId, depth, isRoot ) {
			if ( visited.has( nodeId ) ) return;
			visited.add( nodeId );

			const node = nodes.find( ( n ) => n.id === nodeId );
			if ( ! node ) return;

			// Roots (start node & other entry points) are listed too, unnumbered.
			const stepNumber = isRoot ? null : ( stepNums.get( nodeId ) ?? null );
			result.push( { node, depth, stepNumber } );

			const outEdges = edges
				.filter( ( e ) => e.fromNodeId === nodeId && reachable.has( e.toNodeId ) )
				.sort( ( a, b ) => a.sortOrder - b.sortOrder );

			assignChildren( nodeId, stepNumber, fromBranchOf.get( nodeId ) ?? false, isRoot );

			for ( const e of outEdges ) visit( e.toNodeId, depth + 1, false );
		}

		visit( rootId, 0, true );
	}

	for ( const n of nodes ) { if ( ! visited.has( n.id ) ) { result.push( { node: n, depth: 0, stepNumber: null } ); visited.add( n.id ); } }

	return result;
}

// ── Base-map layer helpers ────────────────────────────────────────────────────

/**
 * An area's label text, matching the map block: the infobox title override
 * wins over the area's own title.
 */
function areaLabelText( area ) {
	return ( area.infoboxResolved?.title || area.title || '' ).trim();
}

/**
 * Map labels in the shape drawLabelShape/findLabelPartAtPoint read, with the
 * story canvas scale folded into the coordinates and the font size so a label
 * keeps its proportions when the story draws the map at another size.
 */
function toMapLabel( label, scale ) {
	const styles = label.canvasStyles || {};
	return {
		text:       label.text,
		placement:  label.placement,
		x:          label.x * scale,
		y:          label.y * scale,
		offset_x:   ( label.offsetX ?? 40 ) * scale,
		offset_y:   ( label.offsetY ?? -40 ) * scale,
		canvas_styles: {
			...styles,
			fontSize: ( styles.fontSize || 14 ) * scale,
		},
	};
}

/** The story canvas scale relative to the map's own pixel size. */
function mapScale( m, W ) {
	return m?.width ? W / m.width : 1;
}

// ── Canvas drawing ────────────────────────────────────────────────────────────

function drawStory( canvas, data, activeNodeId, onImgLoad, layers ) {
	const ctx = canvas.getContext( '2d' );
	if ( ! ctx ) return;

	const W = canvas.width;
	const H = canvas.height;

	ctx.clearRect( 0, 0, W, H );

	const m = data.mapData;

	if ( m?.bgType === 'image' && m.bgImageUrl ) {
		const bg = loadImg( m.bgImageUrl, onImgLoad );
		if ( bg.complete && bg.naturalWidth ) {
			// Cover-fit, centered — matches cns-map-suite's background rendering.
			const scale = Math.max( W / bg.naturalWidth, H / bg.naturalHeight );
			const drawW = bg.naturalWidth  * scale;
			const drawH = bg.naturalHeight * scale;
			ctx.drawImage( bg, ( W - drawW ) / 2, ( H - drawH ) / 2, drawW, drawH );
		} else { ctx.fillStyle = m?.bgColor ?? '#1a1a2e'; ctx.fillRect( 0, 0, W, H ); }
	} else {
		ctx.fillStyle = m?.bgColor ?? '#1a1a2e';
		ctx.fillRect( 0, 0, W, H );
	}

	if ( m?.imageUrl ) {
		const img = loadImg( m.imageUrl, onImgLoad );
		if ( img.complete && img.naturalWidth ) {
			const iw = m.imageW * W;
			ctx.drawImage( img, m.imageX * W, m.imageY * H, iw, ( iw / img.naturalWidth ) * img.naturalHeight );
		}
	}

	// MasterMap child regions — same rendering as the cns-map-suite frontend so
	// a master map used as a story base looks like it does on its own page.
	for ( const region of ( m?.hierarchyRegions ?? [] ) ) {
		const pts = region.nodes || [];

		const s         = region.canvasStyles;
		const shapeType = region.shapeType || 'POLYGON';
		if ( pts.length < ( shapeType === 'CIRCLE' ? 2 : 3 ) ) continue;
		buildAreaPathFromNodes( ctx, pts, shapeType, W, H );

		ctx.save();
		ctx.fillStyle   = s?.fill ?? '#e8a02040';
		ctx.fill();
		ctx.restore();

		ctx.save();
		ctx.strokeStyle = s?.stroke ?? '#e8a020';
		ctx.lineWidth   = s?.strokeWidth ?? 2;
		ctx.setLineDash( [] );
		ctx.stroke();
		ctx.restore();

		if ( region.title ) {
			// Circle labels sit on the center node; other shapes use the centroid.
			const rcx = ( region.shapeType === 'CIRCLE'
				? pts[ 0 ].x
				: pts.reduce( ( sum, p ) => sum + p.x, 0 ) / pts.length ) * W;
			const rcy = ( region.shapeType === 'CIRCLE'
				? pts[ 0 ].y
				: pts.reduce( ( sum, p ) => sum + p.y, 0 ) / pts.length ) * H;
			ctx.save();
			ctx.font         = 'bold 12px sans-serif';
			ctx.textAlign    = 'center';
			ctx.textBaseline = 'middle';
			ctx.fillStyle    = '#fff';
			ctx.strokeStyle  = 'rgba(0,0,0,0.6)';
			ctx.lineWidth    = 3;
			ctx.strokeText( region.title, rcx, rcy );
			ctx.fillText( region.title, rcx, rcy );
			ctx.restore();
		}
	}

	// Areas, objects and labels render exactly as on the map's own page — same
	// geometry, same defaults, same labels. Story edges and nodes are drawn
	// after all of them, so the story always sits on top.
	if ( m?.areas && layers.areas ) {
		ctx.save();
		for ( const area of m.areas ) {
			const nodes     = area.nodes || [];
			const shapeType = area.shapeType || 'POLYGON';
			if ( nodes.length < ( shapeType === 'CIRCLE' ? 2 : 3 ) ) continue;
			const s = area.canvasStyles || {};

			buildAreaPathFromNodes( ctx, nodes, shapeType, W, H );
			ctx.fillStyle = s.fill || '#2271b14d';
			ctx.fill();
			ctx.strokeStyle = s.stroke || '#2271b1';
			ctx.lineWidth   = s.strokeWidth || 2;
			ctx.setLineDash( [] );
			ctx.stroke();

			drawShapeLabel( ctx, areaLabelText( area ), s, nodes, shapeType, W, H );
		}
		ctx.restore();
	}

	if ( m?.objects && layers.objects ) {
		const mapW = m.width;
		const mapH = mapW * m.aspectRatio;
		ctx.save();
		// The map is drawn at the story canvas size, so stored sizes are scaled.
		const scale = W / mapW;
		for ( const obj of m.objects ) {
			let image = null;
			if ( obj.iconUrl && objectUsesIcon( obj.canvasStyles ) ) {
				const img = loadImg( obj.iconUrl, onImgLoad );
				if ( img.complete && img.naturalWidth ) image = img;
			}
			drawObjectMarker(
				ctx,
				{
					x:      ( obj.x / mapW ) * W,
					y:      ( obj.y / mapH ) * H,
					title:  obj.title,
					styles: obj.canvasStyles,
				},
				{ image, scale }
			);
		}
		ctx.restore();
	}

	// Labels last of the map layers, as on the map page, so they read over
	// areas and objects.
	if ( m?.labels && layers.labels ) {
		const scale = mapScale( m, W );
		ctx.save();
		for ( const label of m.labels ) {
			if ( ! label.text ) continue;
			drawLabelShape( ctx, toMapLabel( label, scale ) );
		}
		ctx.restore();
	}

	const story   = data.story;
	const nodeMap = new Map( data.nodes.map( ( n ) => [ n.id, n ] ) );

	for ( const edge of data.edges ) {
		const color   = edge.lineColor   ?? story.lineColor;
		const width   = edge.lineWidth   ?? story.lineWidth;
		const lstyle  = edge.lineStyle   ?? story.lineStyle;

		const from = nodeMap.get( edge.fromNodeId );
		const to   = nodeMap.get( edge.toNodeId );
		if ( ! from || ! to ) continue;
		const fx = from.x * W, fy = from.y * H, tx = to.x * W, ty = to.y * H;

		ctx.save();
		ctx.strokeStyle = color;
		ctx.lineWidth   = width;
		if      ( lstyle === 'dashed' ) ctx.setLineDash( [ 10, 5 ] );
		else if ( lstyle === 'dotted' ) ctx.setLineDash( [ 2, 5 ] );
		else                            ctx.setLineDash( [] );
		ctx.beginPath(); ctx.moveTo( fx, fy ); ctx.lineTo( tx, ty ); ctx.stroke();
		ctx.restore();

		const angle = Math.atan2( ty - fy, tx - fx );
		const sz    = Math.max( 10, width * 3 );
		const nr    = 16;
		const ex    = tx - Math.cos( angle ) * nr;
		const ey    = ty - Math.sin( angle ) * nr;
		ctx.save();
		ctx.setLineDash( [] );
		ctx.fillStyle = color;
		ctx.beginPath();
		ctx.moveTo( ex, ey );
		ctx.lineTo( ex - sz * Math.cos( angle - Math.PI / 6 ), ey - sz * Math.sin( angle - Math.PI / 6 ) );
		ctx.lineTo( ex - sz * Math.cos( angle + Math.PI / 6 ), ey - sz * Math.sin( angle + Math.PI / 6 ) );
		ctx.closePath(); ctx.fill(); ctx.restore();
	}

	const BASE_R = 14;
	for ( const node of data.nodes ) {
		const cx          = node.x * W;
		const cy          = node.y * H;
		const r           = BASE_R * node.iconSize;
		const isActive    = node.id === activeNodeId;
		const borderColor = node.iconBorderColor || '#000000';
		const borderWidth = node.iconBorderWidth ?? 2;

		if ( isActive ) {
			// Cascade: node > path > global
			const story   = data.story;
			const pathMap = data._pathMap;
			const path    = node.pathId ? pathMap.get( node.pathId ) : null;

			const mColor = node.markerColor     ?? path?.markerColor     ?? story.markerColor ?? '#00aaff';
			const mSize  = node.markerSize      ?? path?.markerSize      ?? story.markerSize  ?? 5;
			const mOffX  = node.markerIconOffsetX ?? path?.markerIconOffsetX ?? story.markerIconOffsetX ?? 0;
			const mOffY  = node.markerIconOffsetY ?? path?.markerIconOffsetY ?? story.markerIconOffsetY ?? -30;
			const mType  = node.markerType !== 'inherit'
				? node.markerType
				: ( path?.markerType ?? story.markerType ?? 'ring' );
			const mIconUrl = node.markerType === 'icon'
				? ( node.markerIconUrl || path?.markerIconUrl || story.markerIconUrl )
				: node.markerType === 'inherit'
					? ( path?.markerType === 'icon' ? ( path.markerIconUrl || story.markerIconUrl )
						: ( story.markerType === 'icon' ? story.markerIconUrl : '' ) )
					: '';

			if ( mType === 'icon' && mIconUrl ) {
				const mImg = loadImg( mIconUrl, onImgLoad );
				if ( mImg.complete && mImg.naturalWidth ) {
					const mR = r * 0.8;
					ctx.save();
					ctx.globalAlpha = 1;
					ctx.drawImage( mImg, cx + mOffX - mR, cy + mOffY - mR, mR * 2, mR * 2 );
					ctx.restore();
				}
			} else {
				ctx.save(); ctx.beginPath(); ctx.arc( cx, cy, r + mSize, 0, Math.PI * 2 );
				ctx.strokeStyle = mColor; ctx.lineWidth = 3; ctx.setLineDash( [] ); ctx.globalAlpha = 1; ctx.stroke(); ctx.restore();
			}
		}

		// ── Thumbnail ──────────────────────────────────────────────────────
		if ( node.iconType === 'thumbnail' && node.substoryThumbnailUrl ) {
			const img = loadImg( node.substoryThumbnailUrl, onImgLoad );
			if ( img.complete && img.naturalWidth ) {
				const useSquare = node.iconBgShape === 'square';
				ctx.save();
				if ( useSquare ) {
					if ( node.iconBgColor ) { ctx.fillStyle = node.iconBgColor; ctx.fillRect( cx - r, cy - r, r * 2, r * 2 ); }
					ctx.beginPath(); ctx.rect( cx - r, cy - r, r * 2, r * 2 ); ctx.clip();
					ctx.drawImage( img, cx - r, cy - r, r * 2, r * 2 );
				} else {
					if ( node.iconBgColor ) {
						ctx.beginPath(); ctx.arc( cx, cy, r, 0, Math.PI * 2 );
						ctx.fillStyle = node.iconBgColor; ctx.fill();
					}
					ctx.beginPath(); ctx.arc( cx, cy, r, 0, Math.PI * 2 ); ctx.clip();
					ctx.drawImage( img, cx - r, cy - r, r * 2, r * 2 );
				}
				ctx.restore();
				if ( borderWidth > 0 ) {
					ctx.save();
					ctx.beginPath();
					if ( useSquare ) ctx.rect( cx - r, cy - r, r * 2, r * 2 );
					else             ctx.arc( cx, cy, r, 0, Math.PI * 2 );
					ctx.strokeStyle = borderColor; ctx.lineWidth = borderWidth; ctx.setLineDash( [] ); ctx.stroke();
					ctx.restore();
				}
				continue;
			}
		}

		// ── Icon ───────────────────────────────────────────────────────────
		if ( node.iconType === 'icon' && node.iconUrl ) {
			const img = loadImg( node.iconUrl, onImgLoad );
			if ( img.complete && img.naturalWidth ) {
				if ( node.iconBgShape !== 'none' ) {
					ctx.save();
					if ( node.iconBgShape === 'square' ) {
						ctx.fillStyle = node.iconBgColor || '#ffffff';
						ctx.fillRect( cx - r, cy - r, r * 2, r * 2 );
						if ( borderWidth > 0 ) {
							ctx.strokeStyle = borderColor; ctx.lineWidth = borderWidth; ctx.setLineDash( [] );
							ctx.strokeRect( cx - r, cy - r, r * 2, r * 2 );
						}
					} else {
						ctx.beginPath(); ctx.arc( cx, cy, r, 0, Math.PI * 2 );
						ctx.fillStyle = node.iconBgColor || '#ffffff'; ctx.fill();
						if ( borderWidth > 0 ) {
							ctx.strokeStyle = borderColor; ctx.lineWidth = borderWidth; ctx.setLineDash( [] ); ctx.stroke();
						}
					}
					ctx.restore();
				}
				ctx.drawImage( img, cx - r, cy - r, r * 2, r * 2 );
				continue;
			}
		}

		// ── Diamond ────────────────────────────────────────────────────────
		if ( node.iconType === 'diamond' ) {
			ctx.save();
			ctx.beginPath();
			ctx.moveTo( cx, cy - r ); ctx.lineTo( cx + r, cy );
			ctx.lineTo( cx, cy + r ); ctx.lineTo( cx - r, cy );
			ctx.closePath();
			ctx.fillStyle = node.iconColor; ctx.fill();
			if ( borderWidth > 0 ) {
				ctx.strokeStyle = borderColor; ctx.lineWidth = borderWidth; ctx.setLineDash( [] ); ctx.stroke();
			}
			ctx.restore();
			continue;
		}

		// ── Square ─────────────────────────────────────────────────────────
		if ( node.iconType === 'square' ) {
			ctx.save();
			ctx.fillStyle = node.iconColor;
			ctx.fillRect( cx - r, cy - r, r * 2, r * 2 );
			if ( borderWidth > 0 ) {
				ctx.strokeStyle = borderColor; ctx.lineWidth = borderWidth; ctx.setLineDash( [] );
				ctx.strokeRect( cx - r, cy - r, r * 2, r * 2 );
			}
			ctx.restore();
			continue;
		}

		// ── Round (default) ────────────────────────────────────────────────
		ctx.save();
		ctx.beginPath(); ctx.arc( cx, cy, r, 0, Math.PI * 2 );
		ctx.fillStyle = node.iconColor; ctx.fill();
		if ( borderWidth > 0 ) {
			ctx.strokeStyle = borderColor; ctx.lineWidth = borderWidth; ctx.setLineDash( [] ); ctx.stroke();
		}
		ctx.restore();
	}
}

// ── Story window (accordion list) ─────────────────────────────────────────────

function renderWindow( windowEl, data, activeNodeId, expandedIds ) {
	// Auto-expand the active node.
	if ( activeNodeId !== null ) expandedIds.add( activeNodeId );

	const items = buildOrderedNodes( data.nodes, data.edges, data.story.startNodeId );

	const rows = items.map( ( { node, depth, stepNumber } ) => {
		const title    = node.titleOverride || node.substoryTitle || '';
		const excerpt  = node.excerptOverride || node.substoryExcerpt || '';
		const isStart  = node.id === data.story.startNodeId;
		const numStr   = isStart ? '★' : ( stepNumber ? stepNumber.join( '.' ) : '—' );
		const path     = node.pathId && data._pathMap ? data._pathMap.get( node.pathId ) : null;
		const isActive = node.id === activeNodeId;
		const isOpen   = expandedIds.has( node.id );
		// const indent   = 8 + Math.min( depth, 4 ) * 14;
		const dotR        = node.iconType === 'square' ? '2px' : '0';
		const dotTransform = node.iconType === 'diamond' ? 'rotate(45deg)' : '';
		const dotBorderR   = node.iconType === 'round' || node.iconType === 'thumbnail' || node.iconType === 'icon' ? '50%' : dotR;
		const hasDetail = excerpt || node.substoryUrl;

		// return `<div class="cns-sw-item${ isActive ? ' is-active' : '' }${ isOpen ? ' is-open' : '' }" data-node="${ node.id }" style="padding-left:${ indent }px">
		return `<div class="cns-sw-item${ isActive ? ' is-active' : '' }${ isOpen ? ' is-open' : '' }" data-node="${ node.id }">
			<button class="cns-sw-item__head" type="button">
				<span class="cns-sw-item__num">${ esc( numStr ) }</span>
				<span class="cns-sw-item__dot" style="background:${ esc( node.iconColor ) };border-radius:${ dotBorderR };transform:${ dotTransform }"></span>
				<span class="cns-sw-item__title">${ esc( title ) }</span>
				${ path && path.label ? `<span class="cns-sw-item__path" style="background:${ esc( path.markerColor ) }">${ esc( path.label ) }</span>` : '' }
			</button>
			${ hasDetail ? `<div class="cns-sw-item__detail">
				${ excerpt ? `<p class="cns-sw-item__excerpt">${ esc( excerpt ) }</p>` : '' }
				${ node.substoryUrl ? `<a href="${ esc( node.substoryUrl ) }" class="cns-sw-item__read-more">Read more →</a>` : '' }
			</div>` : '' }
		</div>`;
	} );

	windowEl.innerHTML = `<div class="cns-sw-list">${ rows.join( '' ) }</div>`;

	// Scroll active item into view.
	const activeEl = windowEl.querySelector( '.cns-sw-item.is-active' );
	if ( activeEl ) activeEl.scrollIntoView( { block: 'nearest', behavior: 'smooth' } );

	// Toggle expand + navigate.
	windowEl.querySelectorAll( '.cns-sw-item__head' ).forEach( ( btn ) => {
		btn.addEventListener( 'click', () => {
			const item   = btn.closest( '.cns-sw-item' );
			const nodeId = parseInt( item.dataset.node, 10 );

			if ( expandedIds.has( nodeId ) ) {
				expandedIds.delete( nodeId );
			} else {
				expandedIds.add( nodeId );
			}

			item.dispatchEvent( new CustomEvent( 'cns-navigate', { bubbles: true, detail: { nodeId } } ) );
		} );
	} );
}

function esc( str ) {
	return String( str )
		.replace( /&/g, '&amp;' ).replace( /</g, '&lt;' )
		.replace( />/g, '&gt;' ).replace( /"/g, '&quot;' );
}

// ── Block init ────────────────────────────────────────────────────────────────

// ── Zoom controls ─────────────────────────────────────────────────────────────
// Same pattern as the cns-map-suite map block: zoom scales the canvas's
// *display* width inside a scroll container; the canvas pixel coordinate
// system is untouched, so the click hit-testing above (normalized by
// getBoundingClientRect) keeps working. The canvas is moved into a dedicated
// scroll div so the +/− buttons, absolutely positioned on the canvas wrap,
// stay put while the zoomed canvas pans.

function setupZoomControls( canvas ) {
	const wrap = canvas.parentElement; // .cns-story-block__canvas-wrap
	if ( ! wrap ) return;

	const scroller = document.createElement( 'div' );
	scroller.className = 'cns-story-canvas-scroll';
	wrap.insertBefore( scroller, canvas );
	scroller.appendChild( canvas );

	const MIN = 1, MAX = 4, STEP = 0.1;
	let zoom = 1;

	const controls = document.createElement( 'div' );
	controls.className = 'cns-story-zoom';
	const fsBtn   = document.createElement( 'button' );
	const zoomIn  = document.createElement( 'button' );
	const zoomOut = document.createElement( 'button' );
	const value   = document.createElement( 'span' );
	fsBtn.type   = 'button';
	zoomIn.type  = 'button';
	zoomOut.type = 'button';
	fsBtn.className   = 'cns-story-zoom__btn cns-story-zoom__btn--fs';
	zoomIn.className  = 'cns-story-zoom__btn';
	zoomOut.className = 'cns-story-zoom__btn';
	zoomIn.textContent  = '+';
	zoomOut.textContent = '−';
	zoomIn.setAttribute( 'aria-label', 'Zoom map in' );
	zoomOut.setAttribute( 'aria-label', 'Zoom map out' );
	value.className = 'cns-story-zoom__value';
	controls.appendChild( fsBtn );
	controls.appendChild( zoomIn );
	controls.appendChild( value );
	controls.appendChild( zoomOut );
	wrap.appendChild( controls );

	// ── Lightbox-style fullscreen (same pattern as the cns-map-suite block) ──
	const blockEl = canvas.closest( '.cns-story-block' );
	let fullscreen = false;

	function renderFsBtn() {
		fsBtn.textContent = fullscreen ? '✕' : '⛶';
		fsBtn.setAttribute( 'aria-label', fullscreen ? 'Exit fullscreen' : 'View story fullscreen' );
	}

	function setFullscreen( on ) {
		fullscreen = on;
		if ( blockEl ) blockEl.classList.toggle( 'is-fullscreen', on );
		document.body.classList.toggle( 'cns-story-fullscreen-open', on );
		renderFsBtn();
		// Fullscreen fits the canvas to the viewport, normal mode fits it to the
		// wrap, so the zoom-1 size differs and the base has to be taken again.
		remeasureFit();
	}

	fsBtn.addEventListener( 'click', () => setFullscreen( ! fullscreen ) );
	document.addEventListener( 'keydown', ( e ) => {
		if ( e.key !== 'Escape' || ! fullscreen ) return;
		// Let Esc close an open dialog/drawer first; the next Esc exits.
		const dialog = document.getElementById( 'cns-story-dialog' );
		if ( dialog && dialog.classList.contains( 'is-open' ) ) return;
		if ( isDrawerOpen() ) return;
		setFullscreen( false );
	} );
	renderFsBtn();

	function render() {
		value.textContent = Math.round( zoom * 100 ) + '%';
		zoomIn.disabled  = zoom >= MAX;
		zoomOut.disabled = zoom <= MIN;
	}

	// The canvas's displayed width at zoom 1, in whichever mode is active.
	// Zooming multiplies this rather than setting a percentage of the scroll
	// container: in fullscreen the container is a flex box, and a percentage
	// width there is a flex base size that gets shrunk straight back to the
	// container — so zooming appeared to stop after one step.
	let fitWidth = 0;

	function applyZoom( z ) {
		if ( z > 1 ) {
			scroller.classList.add( 'is-zoomed' );
			canvas.style.maxWidth = 'none';
			canvas.style.width    = ( fitWidth * z ) + 'px';
		} else {
			scroller.classList.remove( 'is-zoomed' );
			canvas.style.maxWidth = '100%';
			canvas.style.width    = '';
		}
	}

	/** Re-reads the zoom-1 width, keeping the current zoom level. */
	function remeasureFit() {
		const current = zoom;
		applyZoom( 1 );
		fitWidth = canvas.getBoundingClientRect().width;
		applyZoom( current );
	}

	function apply( next ) {
		// Round to one decimal so repeated 0.1 steps don't accumulate
		// float drift (1.7000000000000002).
		next = Math.min( MAX, Math.max( MIN, Math.round( next * 10 ) / 10 ) );
		if ( next === zoom ) return;
		// Keep the viewport centered on the same map point.
		const cx = ( scroller.scrollLeft + scroller.clientWidth / 2 ) / zoom;
		const cy = ( scroller.scrollTop + scroller.clientHeight / 2 ) / zoom;
		// Stepping away from 1: the canvas is at its fit size now, so this is
		// the moment to measure it.
		if ( zoom === 1 ) fitWidth = canvas.getBoundingClientRect().width;
		zoom = next;
		applyZoom( zoom );
		render();
		scroller.scrollLeft = cx * zoom - scroller.clientWidth / 2;
		scroller.scrollTop  = cy * zoom - scroller.clientHeight / 2;
	}

	zoomIn.addEventListener( 'click', () => apply( zoom + STEP ) );
	zoomOut.addEventListener( 'click', () => apply( zoom - STEP ) );
	render();
}

function initBlock( blockEl ) {
	const rawData = blockEl.dataset.storyData;
	if ( ! rawData ) return;

	let data;
	try { data = JSON.parse( rawData ); } catch { return; }

	const canvas   = blockEl.querySelector( '.cns-story-canvas' );
	const windowEl = blockEl.querySelector( '.cns-story-window' );
	if ( ! canvas || ! windowEl ) return;

	const m    = data.mapData;
	const canW = m?.width ?? 900;
	const canH = m ? Math.round( m.width * m.aspectRatio ) : 600;

	canvas.width  = canW;
	canvas.height = canH;
	canvas.style.cssText = 'max-width:100%;height:auto;display:block;';

	setupZoomControls( canvas );

	// Build a Map of pathId → path for O(1) lookup during drawing.
	data._pathMap = new Map( ( data.paths ?? [] ).map( ( p ) => [ p.id, p ] ) );

	let activeNodeId = data.story.startNodeId ?? ( data.nodes[ 0 ]?.id ?? null );
	const expandedIds = new Set();

	// Author's saved layer choice, which the toggles below mutate in place.
	// A missing flag means "on", matching the PHP reader.
	const layers = {
		areas:   data.story.showAreas   !== false,
		objects: data.story.showObjects !== false,
		labels:  data.story.showLabels  !== false,
	};

	// On the canvas wrap, which the zoom controls also sit on — outside the
	// scroller the canvas is moved into, so the buttons stay put when panning.
	setupLayerToggles( {
		container: canvas.closest( '.cns-story-block__canvas-wrap' ),
		className: 'cns-story-layers',
		present: {
			areas:   ( m?.areas   ?? [] ).length > 0,
			objects: ( m?.objects ?? [] ).length > 0,
			labels:  ( m?.labels  ?? [] ).length > 0,
		},
		layers,
		onChange: () => scheduleRedraw(),
	} );

	// Coalesce redraw requests into one paint per frame. Used as the image
	// onload callback, so the canvas repaints exactly when assets arrive —
	// no free-running animation loop.
	let redrawQueued = false;
	function scheduleRedraw() {
		if ( redrawQueued ) return;
		redrawQueued = true;
		requestAnimationFrame( () => {
			redrawQueued = false;
			redraw();
		} );
	}

	function redraw()   { drawStory( canvas, data, activeNodeId, scheduleRedraw, layers ); }
	function rerender() { renderWindow( windowEl, data, activeNodeId, expandedIds ); redraw(); }

	// Opens (or re-targets) the node dialog and keeps canvas + list in sync.
	function openNodeDialog( nodeId ) {
		activeNodeId = nodeId;
		rerender();
		renderStoryDialog( data, nodeId, openNodeDialog );
	}

	// Preload images then start loop.
	const urls = [];
	if ( m?.bgImageUrl ) urls.push( m.bgImageUrl );
	if ( m?.imageUrl   ) urls.push( m.imageUrl   );
	( m?.objects ?? [] ).forEach( ( o ) => { if ( o.iconUrl ) urls.push( o.iconUrl ); } );
	if ( data.story.markerIconUrl ) urls.push( data.story.markerIconUrl );
	( data.paths ?? [] ).forEach( ( p ) => { if ( p.markerIconUrl ) urls.push( p.markerIconUrl ); } );
	data.nodes.forEach( ( n ) => {
		if ( n.iconUrl ) urls.push( n.iconUrl );
		if ( n.substoryThumbnailUrl ) urls.push( n.substoryThumbnailUrl );
		if ( n.markerIconUrl ) urls.push( n.markerIconUrl );
	} );

	urls.forEach( ( url ) => { loadImg( url, scheduleRedraw ); } );

	// Canvas click. Story nodes are tested first so they keep click priority
	// over the base map they are drawn on top of; the map layers then follow
	// in reverse paint order (labels over objects over areas), each one only
	// while its layer is visible.
	canvas.addEventListener( 'click', ( e ) => {
		const rect   = canvas.getBoundingClientRect();
		const scaleX = canvas.width  / rect.width;
		const scaleY = canvas.height / rect.height;
		const mx = ( e.clientX - rect.left ) * scaleX;
		const my = ( e.clientY - rect.top  ) * scaleY;

		const BASE_R = 14;
		for ( let i = data.nodes.length - 1; i >= 0; i-- ) {
			const n = data.nodes[ i ];
			const r = ( BASE_R * n.iconSize ) + 5;
			if ( ( mx - n.x * canvas.width ) ** 2 + ( my - n.y * canvas.height ) ** 2 <= r ** 2 ) {
				openNodeDialog( n.id );
				return;
			}
		}

		const ctx2  = canvas.getContext( '2d' );
		const scale = mapScale( m, canvas.width );

		if ( m?.labels && layers.labels ) {
			const clickable = m.labels.filter( ( l ) => l.infoboxResolved );
			// findLabelPartAtPoint hands back the very element it was given,
			// so its position maps straight back to the source label.
			const adapted = clickable.map( ( l ) => toMapLabel( l, scale ) );
			const hit = findLabelPartAtPoint( ctx2, mx, my, adapted );
			if ( hit ) {
				showInfobox( clickable[ adapted.indexOf( hit.label ) ] );
				return;
			}
		}

		if ( m?.objects && layers.objects ) {
			const mapW = m.width;
			const mapH = mapW * m.aspectRatio;
			for ( let i = m.objects.length - 1; i >= 0; i-- ) {
				const obj = m.objects[ i ];
				if ( ! obj.infoboxResolved ) continue;
				const box = measureObjectMarker(
					ctx2,
					{
						x:      ( obj.x / mapW ) * canvas.width,
						y:      ( obj.y / mapH ) * canvas.height,
						title:  obj.title,
						styles: obj.canvasStyles,
					},
					scale
				);
				if (
					mx >= box.left && mx <= box.left + box.w &&
					my >= box.top  && my <= box.top  + box.h
				) {
					showInfobox( obj );
					return;
				}
			}
		}

		if ( m?.areas && layers.areas ) {
			for ( let i = m.areas.length - 1; i >= 0; i-- ) {
				const area = m.areas[ i ];
				if ( ! area.infoboxResolved ) continue;
				const nodes     = area.nodes || [];
				const shapeType = area.shapeType || 'POLYGON';
				if ( nodes.length < ( shapeType === 'CIRCLE' ? 2 : 3 ) ) continue;
				buildAreaPathFromNodes( ctx2, nodes, shapeType, canvas.width, canvas.height );
				if ( ctx2.isPointInPath( mx, my ) ) {
					showInfobox( area );
					return;
				}
			}
		}
	} );

	// List navigation.
	blockEl.addEventListener( 'cns-navigate', ( e ) => {
		activeNodeId = e.detail.nodeId;
		rerender();
	} );

	rerender();
}

document.querySelectorAll( '.cns-story-block' ).forEach( initBlock );
