import { useRef, useEffect, useState } from '@wordpress/element';
import {
	drawAreasOnCanvas,
	findAreaAtPoint,
	findNodeAtPoint,
	moveAreaNode,
} from '../../areas';
import { getCanvasCoords } from '../../canvas';
import { isTypingTarget } from '../../utils';
import type { DrawState, MapArea, Node, CanvasPoint } from '../../../types';
import CanvasZoomWrap from './CanvasZoomWrap';
import { Flex, FlexBlock } from '@wordpress/components';

interface Props {
	drawState: DrawState;
	areas: MapArea[];
	selectedAreaId: number | null;
	focusedNodeIdx: number | null;
	onSelect: ( id: number ) => void;
	onDeselect: () => void;
	onNodesChange: ( areaId: number, nodes: Node[] ) => void;
	onNodeFocusChange: ( idx: number | null ) => void;
}

interface AreasCanvasState {
	areas: MapArea[];
	selectedAreaId: number | null;
	focusedNodeIdx: number | null;
	onNodesChange: ( areaId: number, nodes: Node[] ) => void;
	onDeselect: () => void;
	onNodeFocusChange: ( idx: number | null ) => void;
	repoNodeIdx: number | null;
	repoCursor: CanvasPoint | null;
}

function commitNodePosition(
	canvas: HTMLCanvasElement,
	area: MapArea,
	idx: number,
	x: number,
	y: number
): Node[] {
	return moveAreaNode( area, idx, x / canvas.width, y / canvas.height );
}

export default function AreasCanvas( {
	drawState,
	areas,
	selectedAreaId,
	focusedNodeIdx,
	onSelect,
	onDeselect,
	onNodesChange,
	onNodeFocusChange,
}: Props ) {
	const canvasRef = useRef< HTMLCanvasElement >( null );

	const [ repoNodeIdx, setRepoNodeIdx ] = useState< number | null >( null );
	const [ repoCursor, setRepoCursor ] = useState< CanvasPoint | null >(
		null
	);

	// Adding or removing a node invalidates a pickup already in flight: the
	// index would then address a different node, so deleting node 2 left the
	// old node 3 following the cursor (and a click committed it there).
	// Dropping the pickup whenever the node set changes keeps index and node
	// in agreement. Moving a node keeps the count, so commits are unaffected.
	const selectedNodeCount = ( areas.find( ( a ) => a.id === selectedAreaId )?.nodes || [] ).length;
	useEffect( () => {
		setRepoNodeIdx( null );
		setRepoCursor( null );
	}, [ selectedNodeCount, selectedAreaId ] );

	const stateRef = useRef< AreasCanvasState >( {
		areas: [],
		selectedAreaId: null,
		focusedNodeIdx: null,
		onNodesChange,
		onDeselect,
		onNodeFocusChange,
		repoNodeIdx: null,
		repoCursor: null,
	} );
	stateRef.current = {
		areas,
		selectedAreaId,
		focusedNodeIdx,
		onNodesChange,
		onDeselect,
		onNodeFocusChange,
		repoNodeIdx,
		repoCursor,
	};

	// ── Draw ────────────────────────────────────────────────────────────────────

	useEffect( () => {
		const canvas = canvasRef.current;
		if ( ! canvas ) return;
		drawAreasOnCanvas(
			canvas,
			drawState,
			areas,
			selectedAreaId,
			repoNodeIdx,
			repoCursor,
			focusedNodeIdx
		);
	} );

	// ── JSX event handlers — always read current props/state, no stale closures ──

	function handleMouseMove( e: React.MouseEvent< HTMLCanvasElement > ) {
		if ( repoNodeIdx === null ) return;
		setRepoCursor( getCanvasCoords( canvasRef.current!, e.nativeEvent ) );
	}

	function handleClick( e: React.MouseEvent< HTMLCanvasElement > ) {
		const canvas = canvasRef.current!;
		const { x, y } = getCanvasCoords( canvas, e.nativeEvent );
		const ctx = canvas.getContext( '2d' )!;
		const W = canvas.width;
		const H = canvas.height;

		if ( repoNodeIdx !== null ) {
			const area = areas.find( ( a ) => a.id === selectedAreaId );
			if ( area ) {
				onNodesChange?.(
					selectedAreaId!,
					commitNodePosition( canvas, area, repoNodeIdx, x, y )
				);
			}
			setRepoNodeIdx( null );
			setRepoCursor( null );
			return;
		}

		const selArea = selectedAreaId
			? areas.find( ( a ) => a.id === selectedAreaId )
			: null;
		if ( selArea ) {
			const nIdx = findNodeAtPoint(
				ctx,
				x,
				y,
				selArea.nodes || [],
				W,
				H
			);
			if ( nIdx !== -1 ) {
				setRepoNodeIdx( nIdx );
				setRepoCursor( { x, y } );
				// Keep keyboard focus in sync so Tab continues from here.
				onNodeFocusChange?.( nIdx );
				return;
			}
		}

		const hitArea = findAreaAtPoint( ctx, x, y, areas, W, H );
		if ( hitArea ) {
			onSelect?.( hitArea.id );
			return;
		}

		if ( selArea ) {
			const st = selArea.shape_type || 'POLYGON';
			if ( st !== 'RECTANGLE' && st !== 'CIRCLE' ) {
				onNodesChange?.( selectedAreaId!, [
					...selArea.nodes,
					{ x: x / W, y: y / H },
				] );
			}
			return;
		}

		onDeselect?.();
	}

	// ── document keydown — bind once; reads live values via stateRef ─────────────

	useEffect( () => {
		function onKeyDown( e: KeyboardEvent ) {
			const {
				areas: areaList,
				selectedAreaId: selId,
				onNodesChange: onChange,
				onDeselect: deselect,
				repoNodeIdx: nodeIdx,
				repoCursor: cursor,
			} = stateRef.current;

			if ( e.key === 'Escape' ) {
				if ( nodeIdx !== null ) {
					setRepoNodeIdx( null );
					setRepoCursor( null );
				} else if ( stateRef.current.focusedNodeIdx !== null ) {
					stateRef.current.onNodeFocusChange?.( null );
				} else if ( selId ) {
					deselect?.();
				}
				return;
			}

			if ( e.key !== 'Enter' ) return;
			// Enter already has a job in form fields and on focused
			// buttons/links — don't commit the node from there.
			if ( isTypingTarget( e ) ) return;
			if ( ( e.target as HTMLElement | null )?.closest?.( 'button, a' ) )
				return;
			if ( nodeIdx !== null && cursor ) {
				e.preventDefault();
				const area = areaList.find( ( a ) => a.id === selId );
				if ( area && selId !== null ) {
					onChange?.(
						selId,
						commitNodePosition(
							canvasRef.current!,
							area,
							nodeIdx,
							cursor.x,
							cursor.y
						)
					);
				}
			}
			setRepoNodeIdx( null );
			setRepoCursor( null );
		}

		document.addEventListener( 'keydown', onKeyDown );
		return () => document.removeEventListener( 'keydown', onKeyDown );
	}, [] );

	const isRepositioning = repoNodeIdx !== null;
	return (
		<Flex
			className={ `cns-objects-canvas-wrap${
				isRepositioning ? ' cns-canvas--repositioning' : ''
			}` }
			gap={ 4 }
			direction="column"
			align="center"
		>
			<FlexBlock>
				<CanvasZoomWrap>
					<canvas
						ref={ canvasRef }
						onClick={ handleClick }
						onMouseMove={ handleMouseMove }
					/>
				</CanvasZoomWrap>
			</FlexBlock>
		</Flex>
	);
}
