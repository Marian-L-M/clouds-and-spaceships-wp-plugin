import type { MapArea, MapObject, MapLabel, Node, ShapeType, LabelStyleFields } from '../map/types';

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
		const obj  = objects[ i ];
		const size = obj.canvas_styles?.size ?? 32;
		const half = size / 2;
		ctx.beginPath();
		ctx.rect( obj.x - half, obj.y - half, size, size );
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
export function measureLabelBox( ctx: CanvasRenderingContext2D, label: MapLabel ): LabelBox {
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
	label: MapLabel,
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

export interface LabelHit {
	label: MapLabel;
	part: LabelPart;
}

/**
 * Hit test that distinguishes the anchor dot (indicator mode) from the text
 * box. The dot is checked first with a generous radius so it stays grabbable
 * next to the box. Reverse order so the top-most drawn label wins.
 */
export function findLabelPartAtPoint(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	labels: MapLabel[],
): LabelHit | null {
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
