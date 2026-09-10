import { drawMapCanvas } from './canvas';
import { drawLabelShape } from '../../shared/map-geometry';
import type { MapLabel, DrawState } from '../types';

// Geometry, drawing, and hit-testing live in src/shared/map-geometry.ts so
// the editor and the frontend map block render labels identically. This
// module only adds the editor-specific composition (map background + all
// labels + selection ring / empty placeholder).
export {
	measureLabelBox,
	traceRoundedRect,
	drawLabelShape,
	findLabelPartAtPoint,
} from '../../shared/map-geometry';
export type { LabelPart, LabelHit } from '../../shared/map-geometry';

export async function drawLabelsOnCanvas(
	canvas: HTMLCanvasElement,
	drawState: DrawState,
	labels: MapLabel[],
	selectedLabelId: number | null,
): Promise<void> {
	await drawMapCanvas( canvas, drawState );
	const ctx = canvas.getContext( '2d' )!;
	for ( const label of labels ) {
		drawLabelShape( ctx, label, {
			selected: selectedLabelId === label.id,
			showEmptyPlaceholder: true,
		} );
	}
}
