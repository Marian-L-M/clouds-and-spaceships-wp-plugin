import { drawMapCanvas } from './canvas';
import { areaLabelText, buildAreaPathFromNodes, drawShapeLabel } from '../../shared/map-geometry';
import type { MapArea, Node, ShapeType, DrawState, CanvasPoint } from '../types';

// Path building and area hit-testing live in src/shared/map-geometry.ts so
// the editor and the frontend map block trace identical shapes.
export { findAreaAtPoint } from '../../shared/map-geometry';

// Node handles: half-width in canvas px, and a fixed palette that ignores the
// shape's own colors so a handle stays legible over any fill or stroke.
export const NODE_HALF = 7.5;

const NODE_FILL          = 'rgba(255,255,255,0.75)';
const NODE_STROKE        = '#000000';
const NODE_ACTIVE_FILL   = '#e75252';
const NODE_ACTIVE_STROKE = '#ffffff';

/** Draws one draggable node handle centered on canvas pixel ( x, y ). */
export function drawNodeHandle(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	isActive: boolean,
): void {
	ctx.beginPath();
	ctx.rect( x - NODE_HALF, y - NODE_HALF, NODE_HALF * 2, NODE_HALF * 2 );
	ctx.fillStyle   = isActive ? NODE_ACTIVE_FILL   : NODE_FILL;
	ctx.fill();
	ctx.strokeStyle = isActive ? NODE_ACTIVE_STROKE : NODE_STROKE;
	ctx.lineWidth   = 2;
	ctx.stroke();
}

// ── Shape helpers ─────────────────────────────────────────────────────────────

// Nodes are TL(0) TR(1) BR(2) BL(3); adjacent pairs share one axis.
export function applyRectangleConstraint(
	nodes: Node[],
	movedIdx: number,
	newX: number,
	newY: number,
): Node[] | null {
	if ( nodes.length !== 4 ) return null;
	const n = nodes.map( ( nd ) => ( { ...nd } ) );
	n[ movedIdx ] = { x: newX, y: newY };
	switch ( movedIdx ) {
		case 0: n[ 1 ].y = newY; n[ 3 ].x = newX; break;
		case 1: n[ 0 ].y = newY; n[ 2 ].x = newX; break;
		case 2: n[ 3 ].y = newY; n[ 1 ].x = newX; break;
		case 3: n[ 2 ].y = newY; n[ 0 ].x = newX; break;
	}
	return n;
}

export function getDefaultNodes( shapeType: ShapeType ): Node[] {
	if ( shapeType === 'CIRCLE' ) {
		return [ { x: 0.5, y: 0.5 }, { x: 0.7, y: 0.65 } ];
	}
	return [
		{ x: 0.25, y: 0.25 }, { x: 0.75, y: 0.25 },
		{ x: 0.75, y: 0.75 }, { x: 0.25, y: 0.75 },
	];
}

// Anything with a shape and nodes — areas and hierarchy regions both qualify,
// so the constraint helpers below serve both editors.
interface ShapedNodes {
	shape_type?: ShapeType;
	nodes?: Node[];
}

/**
 * Moves one node of a shape to new normalized (0–1) coordinates, honoring
 * the shape's constraints: rectangles keep their corners axis-aligned, and
 * moving a circle's center drags the radius node along. Returns a new array.
 */
export function moveAreaNode( area: ShapedNodes, idx: number, newX: number, newY: number ): Node[] {
	const st      = area.shape_type || 'POLYGON';
	let   updated = ( area.nodes || [] ).map( ( n ) => ( { ...n } ) );

	if ( st === 'RECTANGLE' ) {
		updated = applyRectangleConstraint( updated, idx, newX, newY ) || updated;
	} else if ( st === 'CIRCLE' && idx === 0 ) {
		const dx = newX - updated[ 0 ].x;
		const dy = newY - updated[ 0 ].y;
		updated[ 0 ] = { x: newX, y: newY };
		if ( updated[ 1 ] ) updated[ 1 ] = { x: updated[ 1 ].x + dx, y: updated[ 1 ].y + dy };
	} else {
		updated[ idx ] = { x: newX, y: newY };
	}
	return updated;
}

/** Whether a node can be removed from the shape (fixed-node shapes can't shrink). */
export function canRemoveAreaNode( area: ShapedNodes ): boolean {
	const st = area.shape_type || 'POLYGON';
	return ( st === 'POLYGON' || st === 'BEZIER' ) && ( area.nodes || [] ).length > 3;
}

export function normalizeNodesForShapeType( nodes: Node[], shapeType: ShapeType ): Node[] {
	if ( shapeType === 'RECTANGLE' ) {
		return nodes.length === 4 ? nodes : getDefaultNodes( 'RECTANGLE' );
	}
	if ( shapeType === 'CIRCLE' ) {
		if ( nodes.length >= 2 ) return nodes.slice( 0, 2 );
		if ( nodes.length === 1 ) return [ nodes[ 0 ], { x: nodes[ 0 ].x + 0.2, y: nodes[ 0 ].y + 0.15 } ];
		return getDefaultNodes( 'CIRCLE' );
	}
	return nodes;
}

export function getLiveNodes(
	nodes: Node[],
	shapeType: ShapeType,
	movingIdx: number | null,
	cursor: CanvasPoint | null,
	W: number,
	H: number,
): Node[] {
	if ( movingIdx === null || ! cursor ) return nodes;
	const newX = cursor.x / W;
	const newY = cursor.y / H;
	if ( shapeType === 'RECTANGLE' ) {
		return applyRectangleConstraint( nodes, movingIdx, newX, newY ) || nodes;
	}
	const live = nodes.map( ( n ) => ( { ...n } ) );
	if ( shapeType === 'CIRCLE' && movingIdx === 0 ) {
		const dx = newX - nodes[ 0 ].x;
		const dy = newY - nodes[ 0 ].y;
		live[ 0 ] = { x: newX, y: newY };
		if ( live[ 1 ] ) live[ 1 ] = { x: nodes[ 1 ].x + dx, y: nodes[ 1 ].y + dy };
	} else {
		live[ movingIdx ] = { x: newX, y: newY };
	}
	return live;
}

// ── Canvas rendering ──────────────────────────────────────────────────────────

// repoNodeIdx / repoCursor / focusedNodeIdx are only meaningful when
// isSelected === true. focusedNodeIdx marks the keyboard-focused node
// (Tab cycling); a node being repositioned takes visual precedence.
export function drawAreaShape(
	ctx: CanvasRenderingContext2D,
	area: MapArea,
	W: number,
	H: number,
	isSelected: boolean,
	repoNodeIdx: number | null,
	repoCursor: CanvasPoint | null,
	focusedNodeIdx: number | null = null,
): void {
	const rawNodes  = area.nodes || [];
	if ( ! rawNodes.length ) return;
	const shapeType = area.shape_type || 'POLYGON';
	const liveNodes = isSelected
		? getLiveNodes( rawNodes, shapeType, repoNodeIdx, repoCursor, W, H )
		: rawNodes;

	const minNodes = shapeType === 'CIRCLE' ? 2 : 3;

	if ( liveNodes.length >= minNodes ) {
		const styles      = area.canvas_styles || {};
		const fill        = styles.fill        || '#2271b14d';
		const stroke      = styles.stroke      || '#2271b1';
		const strokeWidth = styles.strokeWidth || 2;

		buildAreaPathFromNodes( ctx, liveNodes, shapeType, W, H );

		ctx.fillStyle = fill;
		ctx.fill();

		ctx.strokeStyle = stroke;
		ctx.lineWidth   = isSelected ? Math.max( strokeWidth, 2 ) : strokeWidth;
		ctx.stroke();

		drawShapeLabel( ctx, areaLabelText( area ), styles, liveNodes, shapeType, W, H );
	}

	if ( ! isSelected ) return;

	liveNodes.forEach( ( node, idx ) => {
		// "Active" is the node being moved, or the keyboard-focused one when
		// nothing is being moved — the node Delete and the arrow keys act on.
		const isActive =
			repoNodeIdx === idx ||
			( repoNodeIdx === null && focusedNodeIdx === idx );
		drawNodeHandle( ctx, node.x * W, node.y * H, isActive );
	} );
}

export async function drawAreasOnCanvas(
	canvas: HTMLCanvasElement,
	drawState: DrawState,
	areas: MapArea[],
	selectedAreaId: number | null,
	repoNodeIdx: number | null,
	repoCursor: CanvasPoint | null,
	focusedNodeIdx: number | null = null,
): Promise<void> {
	await drawMapCanvas( canvas, drawState );
	const ctx = canvas.getContext( '2d' )!;
	const W   = canvas.width;
	const H   = canvas.height;
	for ( const area of areas ) {
		const isSel = area.id === selectedAreaId;
		drawAreaShape(
			ctx, area, W, H, isSel,
			isSel ? repoNodeIdx : null,
			isSel ? repoCursor  : null,
			isSel ? focusedNodeIdx : null,
		);
	}
}

// ── Hit detection (editor-only: node handles) ─────────────────────────────────

export function findNodeAtPoint(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	nodes: Node[],
	W: number,
	H: number,
): number {
	for ( let i = nodes.length - 1; i >= 0; i-- ) {
		ctx.beginPath();
		ctx.rect( nodes[ i ].x * W - NODE_HALF, nodes[ i ].y * H - NODE_HALF, NODE_HALF * 2, NODE_HALF * 2 );
		if ( ctx.isPointInPath( x, y ) ) return i;
	}
	return -1;
}
