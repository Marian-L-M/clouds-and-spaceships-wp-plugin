import { loadImage, loadSvgWithColors } from './utils';
import { drawMapCanvas } from './canvas';
import type { MapObject, DrawState, CanvasPoint } from '../types';

// Marker hit-testing lives in src/shared/map-geometry.ts so the editor and
// the frontend map block agree on the clickable region.
export { findObjectAtPoint } from '../../shared/map-geometry';

// ── Canvas rendering ──────────────────────────────────────────────────────────

function drawFallbackMarker(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	size: number,
	fill: string,
	stroke: string
): void {
	ctx.save();
	ctx.beginPath();
	ctx.arc( x, y, size / 2, 0, Math.PI * 2 );
	ctx.fillStyle = fill || '#2271b1';
	ctx.strokeStyle = stroke || '#fff';
	ctx.lineWidth = 2;
	ctx.fill();
	ctx.stroke();
	ctx.restore();
}

export async function drawObjectMarker(
	ctx: CanvasRenderingContext2D,
	obj: MapObject,
	isSelected: boolean
): Promise< void > {
	const size = obj.canvas_styles?.size ?? 32;
	const fill = obj.canvas_styles?.fillStyle ?? '#ffffff';
	const stroke = obj.canvas_styles?.strokeStyle ?? '#2271b1';

	if ( obj.icon_url ) {
		const img =
			obj.icon_mime === 'image/svg+xml'
				? await loadSvgWithColors( obj.icon_url, fill, stroke )
				: await loadImage( obj.icon_url );
		if ( img ) {
			ctx.drawImage(
				img,
				obj.x - size / 2,
				obj.y - size / 2,
				size,
				size
			);
		} else {
			drawFallbackMarker( ctx, obj.x, obj.y, size, fill, stroke );
		}
	} else {
		drawFallbackMarker( ctx, obj.x, obj.y, size, fill, stroke );
	}

	if ( isSelected ) {
		ctx.save();
		ctx.beginPath();
		ctx.arc( obj.x, obj.y, size / 2 + 4, 0, Math.PI * 2 );
		ctx.strokeStyle = '#2271b1';
		ctx.lineWidth = 2;
		ctx.setLineDash( [ 4, 3 ] );
		ctx.stroke();
		ctx.restore();
	}
}

export async function drawObjectsOnCanvas(
	canvas: HTMLCanvasElement,
	drawState: DrawState,
	objects: MapObject[],
	selectedObjectId: number | null,
	repositioningId: number | null,
	repositionCursor: CanvasPoint | null
): Promise< void > {
	await drawMapCanvas( canvas, drawState );
	const ctx = canvas.getContext( '2d' )!;
	for ( const obj of objects ) {
		if ( repositioningId === obj.id && repositionCursor ) {
			await drawObjectMarker(
				ctx,
				{ ...obj, ...repositionCursor },
				true
			);
		} else {
			await drawObjectMarker( ctx, obj, selectedObjectId === obj.id );
		}
	}
}
