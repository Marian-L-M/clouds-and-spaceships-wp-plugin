import { useRef, useEffect, useState } from '@wordpress/element';
import { canRemoveAreaNode, drawNodeHandle, findNodeAtPoint, getLiveNodes, moveAreaNode } from '../../areas';
import { drawMapCanvas, getCanvasCoords } from '../../canvas';
import { isTypingTarget } from '../../utils';
import { buildAreaPathFromNodes, drawShapeLabel, regionLabelText } from '../../../../shared/map-geometry';
import type { DrawState, HierarchyRegion, Node, CanvasPoint, HierarchyCanvasStyles, ShapeType } from '../../../types';
import CanvasZoomWrap from './CanvasZoomWrap';

interface Props {
	drawState: DrawState;
	regions: HierarchyRegion[];
	selectedRegionId: number | null;
	onSelect: ( id: number ) => void;
	onDeselect: () => void;
	onNodesChange: ( regionId: number, nodes: Node[] ) => void;
}

interface CanvasState {
	regions: HierarchyRegion[];
	selectedRegionId: number | null;
	onNodesChange: ( regionId: number, nodes: Node[] ) => void;
	repoNodeIdx: number | null;
	repoCursor: CanvasPoint | null;
}


function minNodesFor( shapeType: ShapeType ): number {
	return shapeType === 'CIRCLE' ? 2 : 3;
}

function drawRegion(
	ctx: CanvasRenderingContext2D,
	region: HierarchyRegion,
	W: number,
	H: number,
	isSelected: boolean,
	repoNodeIdx: number | null,
	repoCursor: CanvasPoint | null,
): void {
	const nodes     = region.nodes || [];
	if ( ! nodes.length ) return;
	const shapeType = region.shape_type || 'POLYGON';

	// Apply live cursor position for the node being dragged, honoring the
	// shape's constraints (rectangle corners, circle center+edge).
	const liveNodes = isSelected
		? getLiveNodes( nodes, shapeType, repoNodeIdx, repoCursor, W, H )
		: nodes;

	if ( liveNodes.length >= minNodesFor( shapeType ) ) {
		const styles: HierarchyCanvasStyles = region.canvas_styles || {};
		const fill        = styles.fill        || '#e8a02040';
		const stroke      = styles.stroke      || '#e8a020';
		const strokeWidth = styles.strokeWidth || 2;

		buildAreaPathFromNodes( ctx, liveNodes, shapeType, W, H );

		ctx.fillStyle = fill;
		ctx.fill();

		ctx.strokeStyle = stroke;
		ctx.lineWidth   = isSelected ? Math.max( strokeWidth, 2 ) : strokeWidth;
		ctx.stroke();

		drawShapeLabel( ctx, regionLabelText( region ), styles, liveNodes, shapeType, W, H );
	}

	if ( ! isSelected ) return;

	// Node handles.
	liveNodes.forEach( ( node, idx ) => {
		drawNodeHandle( ctx, node.x * W, node.y * H, repoNodeIdx === idx );
	} );
}

async function drawHierarchyCanvas(
	canvas: HTMLCanvasElement,
	drawState: DrawState,
	regions: HierarchyRegion[],
	selectedRegionId: number | null,
	repoNodeIdx: number | null,
	repoCursor: CanvasPoint | null,
): Promise<void> {
	await drawMapCanvas( canvas, drawState );
	const ctx = canvas.getContext( '2d' )!;
	const W   = canvas.width;
	const H   = canvas.height;
	for ( const region of regions ) {
		const isSel = region.id === selectedRegionId;
		drawRegion( ctx, region, W, H, isSel,
			isSel ? repoNodeIdx : null,
			isSel ? repoCursor  : null,
		);
	}
}

function findRegionAtPoint(
	ctx: CanvasRenderingContext2D,
	x: number,
	y: number,
	regions: HierarchyRegion[],
	W: number,
	H: number,
): HierarchyRegion | null {
	for ( let i = regions.length - 1; i >= 0; i-- ) {
		const r         = regions[ i ];
		const nodes     = r.nodes || [];
		const shapeType = r.shape_type || 'POLYGON';
		if ( nodes.length < minNodesFor( shapeType ) ) continue;
		buildAreaPathFromNodes( ctx, nodes, shapeType, W, H );
		if ( ctx.isPointInPath( x, y ) ) return r;
	}
	return null;
}

export default function HierarchyCanvas( {
	drawState, regions, selectedRegionId,
	onSelect, onDeselect, onNodesChange,
}: Props ) {
	const canvasRef = useRef<HTMLCanvasElement>( null );

	const [ repoNodeIdx, setRepoNodeIdx ] = useState<number | null>( null );
	const [ repoCursor,  setRepoCursor  ] = useState<CanvasPoint | null>( null );

	// Adding or removing a node invalidates a pickup already in flight: the
	// index would then address a different node, so deleting node 2 left the
	// old node 3 following the cursor (and a click committed it there).
	// Dropping the pickup whenever the node set changes keeps index and node
	// in agreement. Moving a node keeps the count, so commits are unaffected.
	const selectedNodeCount = ( regions.find( ( r ) => r.id === selectedRegionId )?.nodes || [] ).length;
	useEffect( () => {
		setRepoNodeIdx( null );
		setRepoCursor( null );
	}, [ selectedNodeCount, selectedRegionId ] );

	const stateRef = useRef<CanvasState>( {
		regions: [], selectedRegionId: null, onNodesChange,
		repoNodeIdx: null, repoCursor: null,
	} );
	stateRef.current = { regions, selectedRegionId, onNodesChange, repoNodeIdx, repoCursor };

	useEffect( () => {
		const canvas = canvasRef.current;
		if ( ! canvas ) return;
		drawHierarchyCanvas( canvas, drawState, regions, selectedRegionId, repoNodeIdx, repoCursor );
	} );

	function handleMouseMove( e: React.MouseEvent<HTMLCanvasElement> ) {
		if ( repoNodeIdx === null ) return;
		setRepoCursor( getCanvasCoords( canvasRef.current!, e.nativeEvent ) );
	}

	function handleClick( e: React.MouseEvent<HTMLCanvasElement> ) {
		const canvas = canvasRef.current!;
		const { x, y } = getCanvasCoords( canvas, e.nativeEvent );
		const ctx = canvas.getContext( '2d' )!;
		const W   = canvas.width;
		const H   = canvas.height;

		if ( repoNodeIdx !== null ) {
			const region = regions.find( ( r ) => r.id === selectedRegionId );
			if ( region && selectedRegionId !== null ) {
				onNodesChange( selectedRegionId, moveAreaNode( region, repoNodeIdx, x / W, y / H ) );
			}
			setRepoNodeIdx( null );
			setRepoCursor( null );
			return;
		}

		const selRegion = selectedRegionId ? regions.find( ( r ) => r.id === selectedRegionId ) : null;
		if ( selRegion ) {
			const nIdx = findNodeAtPoint( ctx, x, y, selRegion.nodes || [], W, H );
			if ( nIdx !== -1 ) {
				setRepoNodeIdx( nIdx );
				setRepoCursor( { x, y } );
				return;
			}
		}

		const hitRegion = findRegionAtPoint( ctx, x, y, regions, W, H );
		if ( hitRegion ) { onSelect( hitRegion.id ); return; }

		// Click empty space on selected region: add node (fixed-node shapes
		// can't grow — mirrors the areas canvas).
		if ( selRegion ) {
			const st = selRegion.shape_type || 'POLYGON';
			if ( st !== 'RECTANGLE' && st !== 'CIRCLE' ) {
				onNodesChange( selectedRegionId!, [ ...selRegion.nodes, { x: x / W, y: y / H } ] );
			}
			return;
		}

		onDeselect();
	}

	useEffect( () => {
		function onKeyDown( e: KeyboardEvent ) {
			const hierarchyActive = document.querySelector( '[data-panel="hierarchy"].cns-tab-panel--active' );
			if ( ! hierarchyActive ) return;
			const { regions: regionList, selectedRegionId: selId, onNodesChange: onChange,
				repoNodeIdx: nodeIdx, repoCursor: cursor } = stateRef.current;

			if ( e.key === 'Delete' || e.key === 'Backspace' ) {
				if ( nodeIdx === null || selId === null || isTypingTarget( e ) ) return;
				const region = regionList.find( ( r ) => r.id === selId );
				if ( region && canRemoveAreaNode( region ) ) {
					e.preventDefault();
					onChange(
						selId,
						( region.nodes || [] ).filter( ( _, i ) => i !== nodeIdx ),
					);
				}
				setRepoNodeIdx( null );
				setRepoCursor( null );
				return;
			}

			if ( e.key === 'Enter' && nodeIdx !== null && cursor ) {
				const region = regionList.find( ( r ) => r.id === selId );
				if ( region && selId !== null ) {
					onChange( selId, moveAreaNode(
						region, nodeIdx,
						cursor.x / canvasRef.current!.width,
						cursor.y / canvasRef.current!.height,
					) );
				}
			}
			if ( e.key === 'Escape' || e.key === 'Enter' ) {
				setRepoNodeIdx( null );
				setRepoCursor( null );
			}
		}

		document.addEventListener( 'keydown', onKeyDown );
		return () => document.removeEventListener( 'keydown', onKeyDown );
	}, [] );

	const isRepositioning = repoNodeIdx !== null;
	return (
		<div className={ `cns-objects-canvas-wrap${ isRepositioning ? ' cns-canvas--repositioning' : '' }` }>
			<CanvasZoomWrap>
				<canvas
					ref={ canvasRef }
					onClick={ handleClick }
					onMouseMove={ handleMouseMove }
				/>
			</CanvasZoomWrap>
		</div>
	);
}
