import { useState, useRef, useEffect } from '@wordpress/element';
import { Button, Flex, FlexItem, FlexBlock } from '@wordpress/components';
import {
	fullscreen as fullscreenIcon,
	close,
	plus,
	reset,
} from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import type { ReactNode } from 'react';

/**
 * Zoom wrapper shared by all editor canvases. Zoom scales the canvas's
 * *display* size inside a scrollable viewport — the canvas backing store and
 * its pixel coordinate system are untouched, so every hit test and drag
 * keeps working: getCanvasCoords() already normalizes clicks by
 * boundingClientRect ÷ canvas.width.
 *
 * +/− buttons sit at the top right, outside the scroll area so they stay
 * put while panning. Zoom changes keep the viewport centered on the same
 * map point. The level is module-scoped so it survives tab switches.
 *
 * allowFullscreen adds a lightbox-style fullscreen toggle above the zoom
 * buttons (used by the Preview tab): the whole zoom wrap becomes a fixed
 * dark overlay, with zooming/panning still available. Esc exits.
 */
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.1;

let sharedZoom = 1;

interface Props {
	children: ReactNode;
	allowFullscreen?: boolean;
}

export default function CanvasZoomWrap( {
	children,
	allowFullscreen = false,
}: Props ) {
	const [ zoom, setZoom ] = useState( sharedZoom );
	const [ fullscreen, setFullscreen ] = useState( false );
	const scrollRef = useRef< HTMLDivElement >( null );

	function changeZoom( delta: number ) {
		const next = Math.min(
			MAX_ZOOM,
			Math.max( MIN_ZOOM, Math.round( ( zoom + delta ) * 10 ) / 10 )
		);
		if ( next === zoom ) return;
		sharedZoom = next;
		const scroll = scrollRef.current;
		// Map point currently at the viewport center, in zoom-1 units.
		const cx = scroll
			? ( scroll.scrollLeft + scroll.clientWidth / 2 ) / zoom
			: 0;
		const cy = scroll
			? ( scroll.scrollTop + scroll.clientHeight / 2 ) / zoom
			: 0;
		setZoom( next );
		// After the re-render resized the canvas, restore that center point.
		requestAnimationFrame( () => {
			if ( ! scroll ) return;
			scroll.scrollLeft = cx * next - scroll.clientWidth / 2;
			scroll.scrollTop = cy * next - scroll.clientHeight / 2;
		} );
	}

	// Fullscreen: lock body scroll, Esc exits.
	useEffect( () => {
		if ( ! fullscreen ) return;
		function onKeyDown( e: KeyboardEvent ) {
			if ( e.key === 'Escape' ) setFullscreen( false );
		}
		document.addEventListener( 'keydown', onKeyDown );
		document.body.classList.add( 'cns-canvas-fullscreen-open' );
		return () => {
			document.removeEventListener( 'keydown', onKeyDown );
			document.body.classList.remove( 'cns-canvas-fullscreen-open' );
		};
	}, [ fullscreen ] );

	const rootClass =
		'cns-canvas-zoom' +
		( zoom > 1 ? ' cns-canvas-zoom--zoomed' : '' ) +
		( fullscreen ? ' is-fullscreen' : '' );

	return (
		<div className={ rootClass }>
			<Flex
				className="cns-canvas-zoom__controls"
				gap={ 1 }
				direction="column"
				align="start"
				justify="start"
				style={ { height: 'fit-content' } }
			>
				{ allowFullscreen && (
					<Button
						variant="secondary"
						icon={ fullscreen ? close : fullscreenIcon }
						label={
							fullscreen
								? __( 'Exit fullscreen', 'clouds-and-spaceships' )
								: __( 'View fullscreen', 'clouds-and-spaceships' )
						}
						onClick={ () => setFullscreen( ( f ) => ! f ) }
					/>
				) }
				<Button
					variant="primary"
					icon={ plus }
					label={ __( 'Zoom in', 'clouds-and-spaceships' ) }
					onClick={ () => changeZoom( ZOOM_STEP ) }
					disabled={ zoom >= MAX_ZOOM }
				/>
				<span className="cns-canvas-zoom__value">
					{ Math.round( zoom * 100 ) }%
				</span>
				<Button
					variant="primary"
					icon={ reset }
					label={ __( 'Zoom out', 'clouds-and-spaceships' ) }
					onClick={ () => changeZoom( -ZOOM_STEP ) }
					disabled={ zoom <= MIN_ZOOM }
				/>
			</Flex>
			<div className="cns-canvas-zoom__scroll" ref={ scrollRef }>
				<div
					className="cns-canvas-zoom__inner"
					style={
						zoom > 1 ? { width: `${ zoom * 100 }%` } : undefined
					}
				>
					{ children }
				</div>
			</div>
		</div>
	);
}
