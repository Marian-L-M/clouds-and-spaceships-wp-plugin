import { Flex, FlexBlock } from '@wordpress/components';
import { useRef, useEffect } from '@wordpress/element';

import CanvasZoomWrap from './CanvasZoomWrap';
import { usePickupDrag } from './usePickupDrag';
import { drawObjectsOnCanvas, findObjectAtPoint } from '../../objects';
import type { DrawState, MapObject } from '../../../types';

interface ObjectDrag {
	id: number;
}

interface Props {
	drawState: DrawState;
	objects: MapObject[];
	selectedObjectId: number | null;
	onSelect: ( id: number ) => void;
	onDeselect: () => void;
	onPositionUpdate: ( id: number, x: number, y: number ) => Promise< void >;
	onPlace: ( x: number, y: number ) => void;
}

interface CanvasState {
	objects: MapObject[];
	selectedObjectId: number | null;
}

export default function ObjectsCanvas( {
	drawState,
	objects,
	selectedObjectId,
	onSelect,
	onDeselect,
	onPositionUpdate,
	onPlace,
}: Props ) {
	const stateRef = useRef< CanvasState >( {
		objects: [],
		selectedObjectId: null,
	} );
	stateRef.current = { objects, selectedObjectId };

	function redraw() {
		const canvas = canvasRef.current;
		if ( ! canvas ) return;
		const { objects: objs, selectedObjectId: selId } = stateRef.current;
		const drag = dragRef.current;
		drawObjectsOnCanvas(
			canvas,
			drawState,
			objs,
			selId,
			drag?.payload.id ?? null,
			drag?.cursor ?? null
		);
	}

	const { canvasRef, dragRef } = usePickupDrag< ObjectDrag >( {
		hitTest: ( ctx, x, y ) => {
			const hit = findObjectAtPoint(
				ctx,
				x,
				y,
				stateRef.current.objects
			);
			return hit ? { id: hit.id } : null;
		},
		onPickup: ( drag ) => onSelect?.( drag.id ),
		onDrop: ( drag, cursor ) => {
			if ( cursor ) {
				void onPositionUpdate?.(
					drag.id,
					Math.round( cursor.x ),
					Math.round( cursor.y )
				);
			}
		},
		dragFromSelection: () =>
			stateRef.current.selectedObjectId
				? { id: stateRef.current.selectedObjectId }
				: null,
		onEmptyClick: ( coords ) => {
			if ( stateRef.current.selectedObjectId ) {
				onDeselect?.();
			} else {
				onPlace?.( Math.round( coords.x ), Math.round( coords.y ) );
			}
		},
		onEscapeIdle: () => {
			if ( stateRef.current.selectedObjectId ) onDeselect?.();
		},
		redraw,
	} );

	useEffect( () => {
		redraw();
	} ); // run after every render

	return (
		<Flex
			className={ 'cns-objects-canvas-wrap' }
			gap={ 4 }
			direction="column"
			align="center"
		>
			<FlexBlock>
				<CanvasZoomWrap>
					<canvas ref={ canvasRef } />
				</CanvasZoomWrap>
			</FlexBlock>
		</Flex>
	);
}
