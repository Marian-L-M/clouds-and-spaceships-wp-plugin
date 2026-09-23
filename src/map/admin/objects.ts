import { loadImage, loadSvgWithColors } from './utils';
import { drawMapCanvas } from './canvas';
import {
	drawObjectMarker as drawMarker,
	objectUsesIcon,
	OBJECT_FILL,
	OBJECT_STROKE,
} from '../../shared/map-geometry';
import type { MapObject, DrawState, CanvasPoint } from '../types';

// Marker hit-testing and the marker drawing itself live in
// src/shared/map-geometry.ts so the editor and the frontend map block agree on
// the clickable region and on how each display mode looks.
export { findObjectAtPoint } from '../../shared/map-geometry';

// ── Canvas rendering ──────────────────────────────────────────────────────────

/** Resolves an object's icon artwork, recolored when it is an SVG. */
async function loadObjectIcon(
	obj: MapObject
): Promise< HTMLImageElement | null > {
	if ( ! obj.icon_url || ! objectUsesIcon( obj.canvas_styles ) ) return null;
	const fill = obj.canvas_styles?.fillStyle ?? OBJECT_FILL;
	const stroke = obj.canvas_styles?.strokeStyle ?? OBJECT_STROKE;
	return obj.icon_mime === 'image/svg+xml'
		? loadSvgWithColors( obj.icon_url, fill, stroke )
		: loadImage( obj.icon_url );
}

export async function drawObjectMarker(
	ctx: CanvasRenderingContext2D,
	obj: MapObject,
	isSelected: boolean
): Promise< void > {
	drawMarker(
		ctx,
		{ x: obj.x, y: obj.y, title: obj.title, styles: obj.canvas_styles },
		{ image: await loadObjectIcon( obj ), selected: isSelected }
	);
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
			await drawObjectMarker(
				ctx,
				obj,
				selectedObjectId === obj.id
			);
		}
	}
}
