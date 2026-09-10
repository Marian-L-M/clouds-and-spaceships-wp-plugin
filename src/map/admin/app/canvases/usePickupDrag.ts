import { useRef, useEffect } from '@wordpress/element';
import type { RefObject } from 'react';
import { getCanvasCoords } from '../../canvas';
import { isTypingTarget } from '../../utils';
import type { CanvasPoint } from '../../../types';

/**
 * The shared pick-up / follow-cursor / drop interaction used by the Objects
 * and Labels canvases:
 *
 *   click a draggable thing → select it and pick it up (payload from hitTest)
 *   mousemove               → the preview follows the cursor (via redraw)
 *   click or Enter          → drop (onDrop with the final cursor position)
 *   Escape                  → cancel the drag, or fall through to onEscapeIdle
 *   Enter while idle        → pick up the current selection (dragFromSelection)
 *   hover                   → grab / grabbing cursors
 *
 * The payload D is opaque to the hook — canvases decide what a drag means
 * (an object id, a label part, …) and how the preview is rendered: redraw()
 * reads the returned dragRef. Enter is ignored in form fields and on focused
 * buttons/links, where it already has a job. Listeners bind once; config is
 * read through a ref so handlers always see the current render's props.
 */
export interface PickupDragState<D> {
	payload: D;
	cursor: CanvasPoint | null; // null until the mouse moves
}

export interface PickupDragConfig<D> {
	hitTest: ( ctx: CanvasRenderingContext2D, x: number, y: number ) => D | null;
	/** A drag just started from a canvas click — select the entity. */
	onPickup: ( payload: D ) => void;
	/** Commit the drop. cursor null = picked up but never moved: nothing to commit. */
	onDrop: ( payload: D, cursor: CanvasPoint | null ) => void;
	/** Payload for Enter-pick-up of the current selection (null = no selection). */
	dragFromSelection: () => D | null;
	/** Click on empty canvas while not dragging. */
	onEmptyClick: ( coords: CanvasPoint ) => void;
	/** Escape while not dragging (typically: deselect). */
	onEscapeIdle: () => void;
	redraw: () => void;
}

export function usePickupDrag<D>( config: PickupDragConfig<D> ): {
	canvasRef: RefObject<HTMLCanvasElement | null>;
	dragRef: RefObject<PickupDragState<D> | null>;
	startDrag: ( payload: D ) => void;
} {
	const canvasRef = useRef<HTMLCanvasElement>( null );
	const dragRef   = useRef<PickupDragState<D> | null>( null );
	const cfgRef    = useRef( config );
	cfgRef.current  = config;

	function startDrag( payload: D ) {
		dragRef.current = { payload, cursor: null };
		if ( canvasRef.current ) canvasRef.current.style.cursor = 'grabbing';
		cfgRef.current.redraw();
	}

	useEffect( () => {
		const canvas = canvasRef.current;
		if ( ! canvas ) return;

		function endDrag() {
			dragRef.current = null;
			canvas!.style.cursor = '';
		}

		function onMouseMove( e: MouseEvent ) {
			const c    = getCanvasCoords( canvas!, e );
			const drag = dragRef.current;
			if ( ! drag ) {
				const ctx = canvas!.getContext( '2d' )!;
				canvas!.style.cursor = cfgRef.current.hitTest( ctx, c.x, c.y ) ? 'grab' : '';
				return;
			}
			drag.cursor = c;
			cfgRef.current.redraw();
		}

		function onClick( e: MouseEvent ) {
			const coords = getCanvasCoords( canvas!, e );
			const ctx    = canvas!.getContext( '2d' )!;
			const drag   = dragRef.current;

			if ( drag ) {
				const payload = drag.payload;
				endDrag();
				cfgRef.current.redraw();
				cfgRef.current.onDrop( payload, coords );
				return;
			}

			const hit = cfgRef.current.hitTest( ctx, coords.x, coords.y );
			if ( hit !== null ) {
				cfgRef.current.onPickup( hit );
				dragRef.current = { payload: hit, cursor: coords };
				canvas!.style.cursor = 'grabbing';
				cfgRef.current.redraw();
				return;
			}

			cfgRef.current.onEmptyClick( coords );
		}

		function onKeyDown( e: KeyboardEvent ) {
			if ( e.key === 'Escape' ) {
				if ( dragRef.current ) {
					endDrag();
					cfgRef.current.redraw();
				} else {
					cfgRef.current.onEscapeIdle();
				}
				return;
			}

			if ( e.key !== 'Enter' || isTypingTarget( e ) ) return;
			if ( ( e.target as HTMLElement | null )?.closest?.( 'button, a' ) ) return;

			const drag = dragRef.current;
			if ( drag ) {
				e.preventDefault();
				const { payload, cursor } = drag;
				endDrag();
				cfgRef.current.redraw();
				cfgRef.current.onDrop( payload, cursor );
			} else {
				const payload = cfgRef.current.dragFromSelection();
				if ( payload !== null ) {
					e.preventDefault();
					startDrag( payload );
				}
			}
		}

		canvas.addEventListener( 'mousemove', onMouseMove );
		canvas.addEventListener( 'click', onClick );
		document.addEventListener( 'keydown', onKeyDown );
		return () => {
			canvas.removeEventListener( 'mousemove', onMouseMove );
			canvas.removeEventListener( 'click', onClick );
			document.removeEventListener( 'keydown', onKeyDown );
		};
	}, [] ); // bind once; cfgRef keeps values current

	return { canvasRef, dragRef, startDrag };
}
