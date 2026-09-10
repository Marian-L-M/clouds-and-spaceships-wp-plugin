import { useRef, useEffect } from '@wordpress/element';
import { drawFullCanvas } from '../../canvas';
import CanvasZoomWrap from './CanvasZoomWrap';
import { drawObjectMarker } from '../../objects';
import { drawAreaShape } from '../../areas';
import { drawLabelShape } from '../../labels';
import type { DrawState, MapObject, MapArea, MapLabel } from '../../../types';

interface Props {
	drawState: DrawState;
	objects: MapObject[];
	areas: MapArea[];
	labels: MapLabel[];
}

export default function PreviewCanvas( { drawState, objects, areas, labels }: Props ) {
	const canvasRef = useRef<HTMLCanvasElement>( null );

	useEffect( () => {
		const canvas = canvasRef.current;
		if ( ! canvas ) return;
		drawFullCanvas( canvas, objects, areas, drawState, drawAreaShape, drawObjectMarker ).then( () => {
			const ctx = canvas.getContext( '2d' )!;
			// Match the frontend: labels without text are skipped.
			for ( const label of labels ) {
				if ( label.text ) drawLabelShape( ctx, label );
			}
		} );
	} );

	return (
		<div className="cns-canvas-wrap">
			<CanvasZoomWrap allowFullscreen>
				<canvas ref={ canvasRef } />
			</CanvasZoomWrap>
		</div>
	);
}
