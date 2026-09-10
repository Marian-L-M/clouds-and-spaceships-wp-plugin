import { useRef, useEffect } from '@wordpress/element';
import { drawLabelsOnCanvas, findLabelPartAtPoint } from '../../labels';
import { usePickupDrag } from './usePickupDrag';
import CanvasZoomWrap from './CanvasZoomWrap';
import type { DrawState, MapLabel, CanvasPoint } from '../../../types';

/**
 * Pick-up/drop interaction comes from usePickupDrag; the drag payload names
 * the label and which part is carried:
 *
 *  - 'box'    — the text box. Centered labels move their anchor; indicator
 *               labels move only the box (offset), the dot stays put.
 *  - 'anchor' — the indicator dot; moves only the dot, the box stays put.
 *  - 'whole'  — anchor + box together (offset kept). Used by Enter-pick-up.
 */
type DragPart = 'box' | 'anchor' | 'whole';

interface LabelDrag {
	id: number;
	part: DragPart;
}

export interface LabelGeometry {
	x: number;
	y: number;
	offset_x: number;
	offset_y: number;
}

interface Props {
	drawState: DrawState;
	labels: MapLabel[];
	selectedLabelId: number | null;
	onSelect: ( id: number ) => void;
	onDeselect: () => void;
	onGeometryUpdate: ( id: number, geometry: Partial<LabelGeometry> ) => Promise<void>;
}

interface CanvasState {
	labels: MapLabel[];
	selectedLabelId: number | null;
}

function applyDragCursor( label: MapLabel, part: DragPart, cursor: CanvasPoint ): MapLabel {
	if ( label.placement !== 'indicator' || part === 'whole' ) {
		// Centered labels and whole-label moves: the anchor follows the
		// cursor; in indicator mode the box tags along via the offset.
		return { ...label, x: Math.round( cursor.x ), y: Math.round( cursor.y ) };
	}
	if ( part === 'box' ) {
		// Box follows the cursor, dot stays: cursor becomes anchor + offset.
		return {
			...label,
			offset_x: Math.round( cursor.x - label.x ),
			offset_y: Math.round( cursor.y - label.y ),
		};
	}
	// part === 'anchor': dot follows the cursor, box stays at its absolute
	// position, so the offset compensates.
	const boxX = label.x + label.offset_x;
	const boxY = label.y + label.offset_y;
	return {
		...label,
		x:        Math.round( cursor.x ),
		y:        Math.round( cursor.y ),
		offset_x: Math.round( boxX - cursor.x ),
		offset_y: Math.round( boxY - cursor.y ),
	};
}

export default function LabelsCanvas( {
	drawState, labels, selectedLabelId,
	onSelect, onDeselect, onGeometryUpdate,
}: Props ) {
	const stateRef   = useRef<CanvasState>( { labels: [], selectedLabelId: null } );
	stateRef.current = { labels, selectedLabelId };

	function liveLabel( id: number ): MapLabel | undefined {
		return stateRef.current.labels.find( ( l ) => l.id === id );
	}

	function redraw() {
		const canvas = canvasRef.current;
		if ( ! canvas ) return;
		const { labels: lbls, selectedLabelId: selId } = stateRef.current;
		const drag = dragRef.current;
		const list = drag && drag.cursor
			? lbls.map( ( l ) =>
				l.id === drag.payload.id ? applyDragCursor( l, drag.payload.part, drag.cursor! ) : l )
			: lbls;
		drawLabelsOnCanvas( canvas, drawState, list, selId );
	}

	const { canvasRef, dragRef } = usePickupDrag<LabelDrag>( {
		hitTest: ( ctx, x, y ) => {
			const hit = findLabelPartAtPoint( ctx, x, y, stateRef.current.labels );
			return hit ? { id: hit.label.id, part: hit.part } : null;
		},
		onPickup: ( drag ) => onSelect?.( drag.id ),
		onDrop: ( drag, cursor ) => {
			const label = liveLabel( drag.id );
			if ( ! label || ! cursor ) return; // never moved: nothing to commit
			const p = applyDragCursor( label, drag.part, cursor );
			void onGeometryUpdate?.( drag.id, {
				x: p.x, y: p.y, offset_x: p.offset_x, offset_y: p.offset_y,
			} );
		},
		dragFromSelection: () =>
			stateRef.current.selectedLabelId
				? { id: stateRef.current.selectedLabelId, part: 'whole' }
				: null,
		onEmptyClick: () => onDeselect?.(),
		onEscapeIdle: () => {
			if ( stateRef.current.selectedLabelId ) onDeselect?.();
		},
		redraw,
	} );

	useEffect( () => {
		redraw();
	} ); // run after every render

	return (
		<div className="cns-objects-canvas-wrap">
			<CanvasZoomWrap>
				<canvas ref={ canvasRef } />
			</CanvasZoomWrap>
		</div>
	);
}
