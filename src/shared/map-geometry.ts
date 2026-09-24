import type {
	MapArea,
	MapObject,
	MapLabel,
	LabelCanvasStyles,
	LabelPlacement,
	Node,
	ObjectCanvasStyles,
	ObjectDisplayMode,
	ShapeType,
	LabelStyleFields,
} from '../map/types';

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

export const LABEL_FONT_FAMILY = 'sans-serif';
export const LABEL_FONT_SIZE   = 12;
export const LABEL_COLOR       = '#ffffff';

/**
 * A hierarchy region's label text: the infobox title override wins over the
 * child map's own title, so relabelling a region on the parent map does not
 * require renaming the map it points at.
 */
export function regionLabelText( region: {
	title_override?: string | null;
	child_map_title?: string | null;
} ): string {
	return ( region.title_override || region.child_map_title || '' ).trim();
}

/**
 * An area's label text: the infobox title override wins over the area's own
 * title, mirroring how hierarchy regions resolve theirs.
 */
export function areaLabelText( area: {
	infobox_data?: { title?: string } | null;
	title?: string | null;
} ): string {
	return ( area.infobox_data?.title || area.title || '' ).trim();
}

/**
 * Draws a shape's label at its center. Circles label the center node; every
 * other shape uses the node centroid.
 *
 * The text is drawn flat, with no halo behind it — contrast against the map
 * artwork is the author's to choose via the label color.
 */
export function drawShapeLabel(
	ctx: CanvasRenderingContext2D,
	text: string,
	styles: LabelStyleFields | null | undefined,
	nodes: Node[],
	shapeType: ShapeType,
	W: number,
	H: number,
): void {
	if ( ! text || ! nodes.length ) return;
	const s = styles || {};
	if ( s.labelHidden ) return;

	const family = s.labelFontFamily || LABEL_FONT_FAMILY;
	const size   = s.labelFontSize   || LABEL_FONT_SIZE;
	const color  = s.labelColor      || LABEL_COLOR;

	const cx = shapeType === 'CIRCLE'
		? nodes[ 0 ].x * W
		: ( nodes.reduce( ( t, n ) => t + n.x, 0 ) / nodes.length ) * W;
	const cy = shapeType === 'CIRCLE'
		? nodes[ 0 ].y * H
		: ( nodes.reduce( ( t, n ) => t + n.y, 0 ) / nodes.length ) * H;

	ctx.save();
	ctx.font         = `bold ${ size }px ${ family }`;
	ctx.textAlign    = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillStyle    = color;
	ctx.fillText( text, cx, cy );
	ctx.restore();
}

// ── Area / region paths ───────────────────────────────────────────────────────

export function buildPolygonPath( ctx: CanvasRenderingContext2D, nodes: Node[], W: number, H: number ): void {
	ctx.moveTo( nodes[ 0 ].x * W, nodes[ 0 ].y * H );
	for ( let i = 1; i < nodes.length; i++ ) {
		ctx.lineTo( nodes[ i ].x * W, nodes[ i ].y * H );
	}
	ctx.closePath();
}

function buildBezierPath( ctx: CanvasRenderingContext2D, nodes: Node[], W: number, H: number ): void {
	const n      = nodes.length;
	const startX = ( nodes[ n - 1 ].x + nodes[ 0 ].x ) / 2 * W;
	const startY = ( nodes[ n - 1 ].y + nodes[ 0 ].y ) / 2 * H;
	ctx.moveTo( startX, startY );
	for ( let i = 0; i < n; i++ ) {
		const cp   = nodes[ i ];
		const next = nodes[ ( i + 1 ) % n ];
		ctx.quadraticCurveTo( cp.x * W, cp.y * H, ( cp.x + next.x ) / 2 * W, ( cp.y + next.y ) / 2 * H );
	}
	ctx.closePath();
}

function buildCirclePath( ctx: CanvasRenderingContext2D, nodes: Node[], W: number, H: number ): void {
	const cx = nodes[ 0 ].x * W;
	const cy = nodes[ 0 ].y * H;
	const rx = Math.max( Math.abs( nodes[ 1 ].x - nodes[ 0 ].x ) * W, 1 );
	const ry = Math.max( Math.abs( nodes[ 1 ].y - nodes[ 0 ].y ) * H, 1 );
	ctx.ellipse( cx, cy, rx, ry, 0, 0, Math.PI * 2 );
}

export function buildAreaPathFromNodes(
	ctx: CanvasRenderingContext2D,
	nodes: Node[],
	shapeType: ShapeType,
	W: number,
	H: number,
): void {
	ctx.beginPath();
	if ( ! nodes.length ) return;
	switch ( shapeType ) {
		case 'BEZIER':
			if ( nodes.length >= 3 ) buildBezierPath( ctx, nodes, W, H );
			break;
		case 'CIRCLE':
			if ( nodes.length >= 2 ) buildCirclePath( ctx, nodes, W, H );
			break;
		case 'RECTANGLE':
		default:
			if ( nodes.length >= 3 ) buildPolygonPath( ctx, nodes, W, H );
			break;
	}
}

// ── Hit detection ─────────────────────────────────────────────────────────────

export function findObjectAtPoint(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	objects: MapObject[],
): MapObject | null {
	for ( let i = objects.length - 1; i >= 0; i-- ) {
		const obj = objects[ i ];
		const box = measureObjectMarker( ctx, {
			x: obj.x,
			y: obj.y,
			title: obj.title,
			styles: obj.canvas_styles,
		} );
		ctx.beginPath();
		ctx.rect( box.left, box.top, box.w, box.h );
		if ( ctx.isPointInPath( x, y ) ) return obj;
	}
	return null;
}

export function findAreaAtPoint(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	areas: MapArea[],
	W: number,
	H: number,
): MapArea | null {
	for ( let i = areas.length - 1; i >= 0; i-- ) {
		const area      = areas[ i ];
		const nodes     = area.nodes || [];
		const shapeType = area.shape_type || 'POLYGON';
		const minNodes  = shapeType === 'CIRCLE' ? 2 : 3;
		if ( nodes.length < minNodes ) continue;
		buildAreaPathFromNodes( ctx, nodes, shapeType, W, H );
		if ( ctx.isPointInPath( x, y ) ) return area;
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
export interface LabelMarker {
	text: string;
	placement: LabelPlacement;
	x: number;
	y: number;
	offset_x?: number;
	offset_y?: number;
	canvas_styles?: LabelCanvasStyles | null;
}

export interface LabelBox {
	left: number;
	top: number;
	w: number;
	h: number;
	cx: number;
	cy: number;
	fontSize: number;
}

const PAD_X = 8;
const PAD_Y = 5;

/** Computes the label box in canvas pixels (sets ctx.font as a side effect). */
export function measureLabelBox( ctx: CanvasRenderingContext2D, label: LabelMarker ): LabelBox {
	const fontSize = label.canvas_styles?.fontSize || 14;
	ctx.font = `bold ${ fontSize }px sans-serif`;
	const textW = ctx.measureText( label.text || '' ).width;
	const w = textW + PAD_X * 2;
	const h = fontSize + PAD_Y * 2;

	const cx = label.placement === 'indicator' ? label.x + ( label.offset_x ?? 40 ) : label.x;
	const cy = label.placement === 'indicator' ? label.y + ( label.offset_y ?? -40 ) : label.y;

	return { left: cx - w / 2, top: cy - h / 2, w, h, cx, cy, fontSize };
}

export function traceRoundedRect(
	ctx: CanvasRenderingContext2D,
	x: number, y: number, w: number, h: number, r: number,
): void {
	if ( typeof ctx.roundRect === 'function' ) {
		ctx.roundRect( x, y, w, h, r );
	} else {
		ctx.rect( x, y, w, h );
	}
}

export interface DrawLabelOptions {
	/** Draw the editor's dashed selection ring. */
	selected?: boolean;
	/** Render "(empty label)" for text-less labels (editor); frontend skips them. */
	showEmptyPlaceholder?: boolean;
}

export function drawLabelShape(
	ctx: CanvasRenderingContext2D,
	label: LabelMarker,
	opts: DrawLabelOptions = {},
): void {
	const styles    = label.canvas_styles;
	const bg        = styles?.bgColor     || '#ffffff';
	const border    = styles?.borderColor || '#1e1e1e';
	const textColor = styles?.textColor   || '#1e1e1e';
	const box       = measureLabelBox( ctx, label );

	ctx.save();

	// Leader line + anchor dot first, so the box covers the inner segment.
	if ( label.placement === 'indicator' ) {
		ctx.beginPath();
		ctx.moveTo( label.x, label.y );
		ctx.lineTo( box.cx, box.cy );
		ctx.strokeStyle = border;
		ctx.lineWidth   = 1.5;
		ctx.stroke();

		ctx.beginPath();
		ctx.arc( label.x, label.y, 4, 0, Math.PI * 2 );
		ctx.fillStyle = border;
		ctx.fill();
	}

	ctx.beginPath();
	traceRoundedRect( ctx, box.left, box.top, box.w, box.h, 4 );
	ctx.fillStyle = bg;
	ctx.fill();
	ctx.strokeStyle = border;
	ctx.lineWidth   = 1.5;
	ctx.stroke();

	ctx.font         = `bold ${ box.fontSize }px sans-serif`;
	ctx.textAlign    = 'center';
	ctx.textBaseline = 'middle';
	ctx.fillStyle    = textColor;
	ctx.fillText( label.text || ( opts.showEmptyPlaceholder ? '(empty label)' : '' ), box.cx, box.cy );

	if ( opts.selected ) {
		ctx.beginPath();
		traceRoundedRect( ctx, box.left - 4, box.top - 4, box.w + 8, box.h + 8, 6 );
		ctx.strokeStyle = '#2271b1';
		ctx.lineWidth   = 2;
		ctx.setLineDash( [ 4, 3 ] );
		ctx.stroke();
	}

	ctx.restore();
}

/** Which part of a label was hit: the anchor dot or the text box. */
export type LabelPart = 'anchor' | 'box';

export interface LabelHit< T extends LabelMarker = MapLabel > {
	label: T;
	part: LabelPart;
}

/**
 * Hit test that distinguishes the anchor dot (indicator mode) from the text
 * box. The dot is checked first with a generous radius so it stays grabbable
 * next to the box. Reverse order so the top-most drawn label wins.
 */
export function findLabelPartAtPoint< T extends LabelMarker >(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	labels: T[],
): LabelHit< T > | null {
	for ( let i = labels.length - 1; i >= 0; i-- ) {
		const label = labels[ i ];
		if ( label.placement === 'indicator' ) {
			ctx.beginPath();
			ctx.arc( label.x, label.y, 8, 0, Math.PI * 2 );
			if ( ctx.isPointInPath( x, y ) ) return { label, part: 'anchor' };
		}
		const box = measureLabelBox( ctx, label );
		ctx.beginPath();
		ctx.rect( box.left, box.top, box.w, box.h );
		if ( ctx.isPointInPath( x, y ) ) return { label, part: 'box' };
	}
	return null;
}

// ── Object markers ────────────────────────────────────────────────────────────
// An object draws itself in one of five display modes. The drawing lives here
// so the map editor, the map block, and the two story canvases that render a
// map as their backdrop all agree on footprint and appearance.

export const OBJECT_SIZE             = 32;
export const OBJECT_FILL             = '#ffffff';
export const OBJECT_STROKE           = '#2271b1';
export const OBJECT_BG_COLOR         = '#2271b1';
export const OBJECT_BORDER_COLOR     = '#1e1e1e';
export const OBJECT_TEXT_COLOR       = '#ffffff';
export const OBJECT_TEXT_FONT_FAMILY = 'sans-serif';
export const OBJECT_TEXT_FONT_SIZE   = 14;

/**
 * Icon-mode backdrop diameter, as a multiple of the icon size. A square icon's
 * corners sit at size × √2 / 2 ≈ 0.71 × size from the center, so the circle
 * behind it has to be at least that wide to contain the artwork.
 */
const ICON_BACKDROP = 1.44;

/** Horizontal padding around text, as a fraction of the element size. */
const TEXT_PAD_RATIO = 0.25;
const TEXT_PAD_MIN   = 6;

/** The fields the marker drawing needs, in either row shape. */
export interface ObjectMarker {
	x: number;
	y: number;
	title?: string | null;
	styles?: ObjectCanvasStyles | null;
}

/** Rows saved before display modes existed carry none, and those were icons. */
export function objectDisplayMode(
	styles: ObjectCanvasStyles | null | undefined,
): ObjectDisplayMode {
	return styles?.displayMode || 'icon';
}

/** Icon artwork is drawn in icon mode only, so the other modes skip the load. */
export function objectUsesIcon(
	styles: ObjectCanvasStyles | null | undefined,
): boolean {
	return objectDisplayMode( styles ) === 'icon';
}

export interface ObjectMarkerBox {
	left: number;
	top: number;
	w: number;
	h: number;
	/** Element size: the icon artwork in icon mode, the shape otherwise. */
	size: number;
	fontSize: number;
}

/**
 * The marker's footprint in canvas pixels, which is also its hit area. Sets
 * ctx.font as a side effect when it measures text.
 *
 * `scale` multiplies the stored sizes, for canvases that draw the map at a
 * size other than its own.
 */
export function measureObjectMarker(
	ctx: CanvasRenderingContext2D,
	marker: ObjectMarker,
	scale = 1,
): ObjectMarkerBox {
	const styles   = marker.styles;
	const mode     = objectDisplayMode( styles );
	const size     = ( styles?.size ?? OBJECT_SIZE ) * scale;
	const fontSize = ( styles?.textFontSize ?? OBJECT_TEXT_FONT_SIZE ) * scale;

	if ( mode === 'text' ) {
		const family = styles?.textFontFamily || OBJECT_TEXT_FONT_FAMILY;
		ctx.font = `bold ${ fontSize }px ${ family }`;
		const padX = Math.max( TEXT_PAD_MIN * scale, size * TEXT_PAD_RATIO );
		const w = ctx.measureText( marker.title || '' ).width + padX * 2;
		const h = Math.max( size, fontSize + 10 * scale );
		return { left: marker.x - w / 2, top: marker.y - h / 2, w, h, size, fontSize };
	}

	// The icon's round backdrop is wider than the artwork it contains.
	const side = mode === 'icon' ? size * ICON_BACKDROP : size;
	return {
		left: marker.x - side / 2,
		top:  marker.y - side / 2,
		w:    side,
		h:    side,
		size,
		fontSize,
	};
}

export interface DrawObjectMarkerOptions {
	/** Resolved icon artwork — each bundle keeps its own image cache. */
	image?: HTMLImageElement | null;
	/** Multiplies stored sizes; see measureObjectMarker. */
	scale?: number;
	/** Draw the editor's dashed selection ring. */
	selected?: boolean;
}

/** Traces the mode's outline over the given box, without filling or stroking. */
function traceObjectShape(
	ctx: CanvasRenderingContext2D,
	mode: ObjectDisplayMode,
	marker: ObjectMarker,
	box: Pick< ObjectMarkerBox, 'left' | 'top' | 'w' | 'h' >,
): void {
	const r = box.w / 2;
	ctx.beginPath();
	switch ( mode ) {
		case 'text':
			traceRoundedRect( ctx, box.left, box.top, box.w, box.h, 4 );
			break;
		case 'square':
			ctx.rect( box.left, box.top, box.w, box.h );
			break;
		case 'diamond':
			ctx.moveTo( marker.x,     marker.y - r );
			ctx.lineTo( marker.x + r, marker.y     );
			ctx.lineTo( marker.x,     marker.y + r );
			ctx.lineTo( marker.x - r, marker.y     );
			ctx.closePath();
			break;
		case 'icon':
		case 'round':
		default:
			ctx.arc( marker.x, marker.y, r, 0, Math.PI * 2 );
			break;
	}
}

/**
 * Draws one object marker. The caller resolves the icon artwork first (see
 * objectUsesIcon), because the canvases that draw objects each cache images
 * their own way.
 */
export function drawObjectMarker(
	ctx: CanvasRenderingContext2D,
	marker: ObjectMarker,
	opts: DrawObjectMarkerOptions = {},
): void {
	const styles      = marker.styles;
	const mode        = objectDisplayMode( styles );
	const scale       = opts.scale ?? 1;
	const box         = measureObjectMarker( ctx, marker, scale );
	const borderWidth = ( styles?.borderWidth ?? 0 ) * scale;

	ctx.save();

	// The body: the shape itself, the round backdrop behind an icon, or the
	// rectangular backdrop behind text.
	traceObjectShape( ctx, mode, marker, box );
	ctx.fillStyle = styles?.bgColor ?? OBJECT_BG_COLOR;
	ctx.fill();
	if ( borderWidth > 0 ) {
		ctx.strokeStyle = styles?.borderColor ?? OBJECT_BORDER_COLOR;
		ctx.lineWidth   = borderWidth;
		ctx.setLineDash( [] );
		ctx.stroke();
	}

	if ( mode === 'icon' && opts.image ) {
		const half = box.size / 2;
		ctx.drawImage( opts.image, marker.x - half, marker.y - half, box.size, box.size );
	} else if ( mode === 'text' && marker.title ) {
		const family = styles?.textFontFamily || OBJECT_TEXT_FONT_FAMILY;
		ctx.font         = `bold ${ box.fontSize }px ${ family }`;
		ctx.textAlign    = 'center';
		ctx.textBaseline = 'middle';
		ctx.fillStyle    = styles?.textColor ?? OBJECT_TEXT_COLOR;
		ctx.fillText( marker.title, marker.x, marker.y );
	}

	if ( opts.selected ) {
		traceObjectShape( ctx, mode, marker, {
			left: box.left - 4,
			top:  box.top - 4,
			w:    box.w + 8,
			h:    box.h + 8,
		} );
		ctx.strokeStyle = '#2271b1';
		ctx.lineWidth   = 2;
		ctx.setLineDash( [ 4, 3 ] );
		ctx.stroke();
	}

	ctx.restore();
}
