import { loadImage } from './utils';
import type { DrawState, MapSettings, MapObject, MapArea, CanvasPoint, DrawAreaFn, DrawObjectFn } from '../types';

export async function drawMapCanvas(
	canvasEl: HTMLCanvasElement,
	state: DrawState,
): Promise<void> {
	const ctx    = canvasEl.getContext( '2d' )!;
	const width  = state.width;
	const height = Math.round( width / state.aspectRatio );

	canvasEl.width  = width;
	canvasEl.height = height;
	ctx.clearRect( 0, 0, width, height );

	if ( state.bgType === 'image' ) {
		const bgImg = await loadImage( state.bgImageUrl );
		if ( bgImg ) {
			const scale = Math.max( width / bgImg.naturalWidth, height / bgImg.naturalHeight );
			const drawW = bgImg.naturalWidth  * scale;
			const drawH = bgImg.naturalHeight * scale;
			ctx.drawImage( bgImg, ( width - drawW ) / 2, ( height - drawH ) / 2, drawW, drawH );
		} else {
			ctx.fillStyle = '#888';
			ctx.fillRect( 0, 0, width, height );
		}
	} else {
		ctx.fillStyle = state.bgColor;
		ctx.fillRect( 0, 0, width, height );
	}

	const mapImg = await loadImage( state.imgUrl );
	if ( mapImg ) {
		const drawW = width  * state.imageW;
		const drawH = drawW * ( mapImg.naturalHeight / mapImg.naturalWidth );
		ctx.drawImage( mapImg, width * state.imageX, height * state.imageY, drawW, drawH );
	}
}

export function getCanvasCoords(
	canvas: HTMLCanvasElement,
	event: MouseEvent,
): CanvasPoint {
	const rect = canvas.getBoundingClientRect();
	return {
		x: Math.round( ( event.clientX - rect.left ) * ( canvas.width  / rect.width ) ),
		y: Math.round( ( event.clientY - rect.top )  * ( canvas.height / rect.height ) ),
	};
}

export function settingsToDrawState( s: MapSettings ): DrawState {
	return {
		width:       s.width,
		aspectRatio: s.aspectRatio,
		bgType:      s.bgType,
		bgColor:     s.bgColor,
		bgImageUrl:  s.bgImageUrl,
		imgUrl:      s.imageUrl,
		imageX:      s.imageX,
		imageY:      s.imageY,
		imageW:      s.imageW,
	};
}

// drawAreaFn / drawObjectFn are passed in to avoid circular imports.
export async function drawFullCanvas(
	canvas: HTMLCanvasElement,
	objects: MapObject[],
	areas: MapArea[],
	state: DrawState,
	drawAreaFn: DrawAreaFn,
	drawObjectFn: DrawObjectFn,
): Promise<void> {
	await drawMapCanvas( canvas, state );
	const ctx = canvas.getContext( '2d' )!;
	for ( const area of areas ) drawAreaFn( ctx, area, canvas.width, canvas.height, false, null, null );
	for ( const obj  of objects ) await drawObjectFn( ctx, obj, false );
}
