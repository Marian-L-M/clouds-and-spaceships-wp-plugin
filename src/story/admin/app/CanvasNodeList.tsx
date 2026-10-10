import { Button, Flex } from '@wordpress/components';
import {
	arrowDown,
	arrowUp,
	brush,
	color,
	linkOff,
	pencil,
	plus,
	plusCircle,
	starFilled,
	trash,
} from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import type { StoryNode, StoryEdge } from '../../types';

interface TreeItem {
	node: StoryNode;
	incomingEdge: StoryEdge | null;
	siblings: StoryEdge[];
	depth: number;
	stepNumber: number[] | null; // e.g. [1,2,1] → "1.2.1"; null = orphan / root
}

interface Props {
	nodes: StoryNode[];
	edges: StoryEdge[];
	startNodeId: number | null;
	selectedNodeId: number | null;
	onSelect: ( nodeId: number ) => void;
	onEdit: ( nodeId: number ) => void;
	onDelete: ( nodeId: number ) => void;
	onSetStartNode: ( nodeId: number ) => void;
	onEdgeReorder: ( edgeId: number, sortOrder: number ) => void;
	onEdgeDelete: ( edgeId: number ) => void;
	onStartEdgeFrom: ( fromNodeId: number ) => void;
	onEditEdge: ( edgeId: number ) => void;
	onSequenceSwap: ( edge: StoryEdge ) => void;
}

// Matches the server's ORDER BY sort_order ASC, id ASC — fresh edges all
// default to sort_order 0, so the id tiebreak keeps the order deterministic.
function byOrder( a: StoryEdge, b: StoryEdge ): number {
	return a.sortOrder - b.sortOrder || a.id - b.id;
}

function formatStep( num: number[] | null ): string {
	return num === null ? '—' : num.join( '.' );
}

/**
 * Numbering rules
 * ───────────────
 * • Each component root (startNodeId, then other in-degree-0 nodes in creation order) is unnumbered.
 * • Roots are assigned consecutive top-level sections: root 1 uses section 1, root 2 uses section 2, …
 *   (a root with N branches uses N sections; a root with 0 or 1 child uses exactly 1 section)
 * • Direct children of a root → [section, 1], [section+1, 1] … for multiple branches.
 * • Linear continuation: [s,1] → [s,2] → [s,3]; after a branch: append 1 → [s,2,1]
 * • Branching (≥2 outgoing): each child i → [...parent, i+1], fromBranch=true
 */
function buildTree(
	nodes: StoryNode[],
	edges: StoryEdge[],
	startNodeId: number | null
): TreeItem[] {
	const result = [] as TreeItem[];
	const visited = new Set< number >();
	const stepNums = new Map< number, number[] >();
	const fromBranchOf = new Map< number, boolean >();

	const startId = startNodeId ?? nodes[ 0 ]?.id ?? null;

	// Reachable set from a given node (DFS).
	function computeReachable( fromId: number ): Set< number > {
		const r = new Set< number >();
		function dfs( id: number ) {
			if ( r.has( id ) ) return;
			r.add( id );
			for ( const e of edges ) {
				if ( e.fromNodeId === id ) dfs( e.toNodeId );
			}
		}
		dfs( fromId );
		return r;
	}

	// In-degree map (for finding component roots).
	const inDegree = new Map< number, number >();
	for ( const n of nodes ) inDegree.set( n.id, 0 );
	for ( const e of edges )
		inDegree.set( e.toNodeId, ( inDegree.get( e.toNodeId ) ?? 0 ) + 1 );

	// Component roots: startId first, then any other in-degree-0 nodes (in node order = creation ASC).
	const roots: number[] = [];
	if ( startId !== null ) roots.push( startId );
	for ( const n of nodes ) {
		if ( n.id !== startId && inDegree.get( n.id ) === 0 )
			roots.push( n.id );
	}

	// Global top-level section counter; increments as component roots are processed.
	let nextSection = 1;

	for ( const rootId of roots ) {
		const reachable = computeReachable( rootId );

		function assignChildNumbers(
			nodeId: number,
			parentNum: number[] | null,
			fromBranch: boolean,
			isRoot: boolean
		) {
			const out = edges
				.filter(
					( e ) =>
						e.fromNodeId === nodeId && reachable.has( e.toNodeId )
				)
				.sort( byOrder );

			if ( isRoot ) {
				const used = Math.max( 1, out.length );
				out.forEach( ( edge, i ) => {
					if ( ! stepNums.has( edge.toNodeId ) ) {
						stepNums.set( edge.toNodeId, [ nextSection + i, 1 ] );
						fromBranchOf.set( edge.toNodeId, false );
					}
				} );
				nextSection += used;
			} else if ( parentNum !== null ) {
				if ( out.length === 1 ) {
					const childId = out[ 0 ].toNodeId;
					if ( ! stepNums.has( childId ) ) {
						const childNum = fromBranch
							? [ ...parentNum, 1 ]
							: [
									...parentNum.slice( 0, -1 ),
									parentNum[ parentNum.length - 1 ] + 1,
							  ];
						stepNums.set( childId, childNum );
						fromBranchOf.set( childId, false );
					}
				} else if ( out.length > 1 ) {
					out.forEach( ( edge, i ) => {
						if ( ! stepNums.has( edge.toNodeId ) ) {
							stepNums.set( edge.toNodeId, [
								...parentNum,
								i + 1,
							] );
							fromBranchOf.set( edge.toNodeId, true );
						}
					} );
				}
			}
		}

		function visit(
			nodeId: number,
			incomingEdge: StoryEdge | null,
			siblings: StoryEdge[],
			depth: number,
			isRoot: boolean
		) {
			if ( visited.has( nodeId ) ) return;
			visited.add( nodeId );

			const node = nodes.find( ( n ) => n.id === nodeId );
			if ( ! node ) return;

			const stepNumber = isRoot ? null : stepNums.get( nodeId ) ?? null;
			result.push( { node, incomingEdge, siblings, depth, stepNumber } );

			const outEdges = edges
				.filter(
					( e ) =>
						e.fromNodeId === nodeId && reachable.has( e.toNodeId )
				)
				.sort( byOrder );

			assignChildNumbers(
				nodeId,
				stepNumber,
				fromBranchOf.get( nodeId ) ?? false,
				isRoot
			);

			for ( const edge of outEdges ) {
				visit( edge.toNodeId, edge, outEdges, depth + 1, false );
			}
		}

		visit( rootId, null, [], 0, true );
	}

	// Nodes not reached from any root (cycles / unreachable) — show without numbers.
	for ( const node of nodes ) {
		if ( ! visited.has( node.id ) ) {
			result.push( {
				node,
				incomingEdge: null,
				siblings: [],
				depth: 0,
				stepNumber: null,
			} );
			visited.add( node.id );
		}
	}

	return result;
}

function getDisplayTitle( node: StoryNode ): string {
	return node.titleOverride || node.substoryTitle || `Node #${ node.id }`;
}

export default function CanvasNodeList( {
	nodes,
	edges,
	startNodeId,
	selectedNodeId,
	onSelect,
	onEdit,
	onDelete,
	onSetStartNode,
	onEdgeReorder,
	onEdgeDelete,
	onStartEdgeFrom,
	onEditEdge,
	onSequenceSwap,
}: Props ) {
	if ( ! nodes.length ) {
		return (
			<div className="clouansp-canvas-node-list clouansp-canvas-node-list--empty">
				<p className="description">
					{ __( 'Click on the canvas to add your first node.', 'clouds-and-spaceships' ) }
				</p>
			</div>
		);
	}

	const tree = buildTree( nodes, edges, startNodeId );

	// Swaps two adjacent siblings, then rewrites every sibling's sort order to
	// its list index — fresh edges all default to 0, so swapping the stored
	// values alone would be a no-op.
	function reorderSiblings( sorted: StoryEdge[], idx: number, dir: -1 | 1 ) {
		const target = idx + dir;
		if ( target < 0 || target >= sorted.length ) return;
		const reordered = [ ...sorted ];
		[ reordered[ idx ], reordered[ target ] ] = [
			reordered[ target ],
			reordered[ idx ],
		];
		reordered.forEach( ( edge, i ) => {
			if ( edge.sortOrder !== i ) onEdgeReorder( edge.id, i );
		} );
	}

	// Branch nodes (≥2 siblings) reorder among their siblings; linear nodes
	// swap places with their neighbour in the chain, rewiring connections.
	function handleMoveUp( item: TreeItem ) {
		const { incomingEdge, siblings } = item;
		if ( ! incomingEdge ) return;
		const sorted = [ ...siblings ].sort( byOrder );
		if ( sorted.length > 1 ) {
			reorderSiblings(
				sorted,
				sorted.findIndex( ( e ) => e.id === incomingEdge.id ),
				-1
			);
		} else {
			onSequenceSwap( incomingEdge ); // swap with the parent node
		}
	}

	function handleMoveDown( item: TreeItem ) {
		const { incomingEdge, siblings } = item;
		if ( ! incomingEdge ) return;
		const sorted = [ ...siblings ].sort( byOrder );
		if ( sorted.length > 1 ) {
			reorderSiblings(
				sorted,
				sorted.findIndex( ( e ) => e.id === incomingEdge.id ),
				1
			);
		} else {
			const out = edges
				.filter( ( e ) => e.fromNodeId === item.node.id )
				.sort( byOrder );
			if ( out.length !== 1 ) return;
			onSequenceSwap( out[ 0 ] ); // swap with the single successor node
		}
	}

	return (
		<div className="clouansp-canvas-node-list">
			<div className="clouansp-canvas-node-list__header">{ __( 'Nodes', 'clouds-and-spaceships' ) }</div>
			{ tree.map( ( item ) => {
				const { node, incomingEdge, siblings, depth, stepNumber } =
					item;
				const isStart = node.id === startNodeId;
				const isSelected = node.id === selectedNodeId;
				const isOrphan = stepNumber === null && ! isStart;

				const sorted = [ ...siblings ].sort( byOrder );
				const idx = sorted.findIndex(
					( e ) => e.id === incomingEdge?.id
				);
				const isBranch = sorted.length > 1;
				const outCount = incomingEdge
					? edges.filter( ( e ) => e.fromNodeId === node.id ).length
					: 0;
				// Branch: reorder among siblings. Linear: swap with the parent
				// (up) or the single successor (down).
				const canUp =
					incomingEdge !== null && ( ! isBranch || idx > 0 );
				const canDown =
					incomingEdge !== null &&
					( isBranch ? idx < sorted.length - 1 : outCount === 1 );

				return (
					<div
						key={ node.id }
						className={ [
							'clouansp-canvas-node-list__item',
							isSelected ? 'is-selected' : '',
							isOrphan ? 'is-orphan' : '',
						]
							.filter( Boolean )
							.join( ' ' ) }
						style={ { paddingLeft: 8 + Math.min( depth, 4 ) * 14 } }
					>
						{ incomingEdge && (
							<span className="clouansp-canvas-node-list__connector">
								└
							</span>
						) }
						<span className="clouansp-canvas-node-list__step">
							{ isStart ? '★' : formatStep( stepNumber ) }
						</span>
						{ node.iconType === 'thumbnail' &&
						node.substoryThumbnailUrl ? (
							<img
								src={ node.substoryThumbnailUrl }
								alt=""
								className="clouansp-node-swatch"
								style={ {
									borderRadius: '50%',
									objectFit: 'cover',
								} }
							/>
						) : (
							<span
								className="clouansp-node-swatch"
								style={ {
									background: node.iconColor,
									borderRadius:
										node.iconType === 'square'
											? 2
											: node.iconType === 'diamond'
											? 0
											: '50%',
									transform:
										node.iconType === 'diamond'
											? 'rotate(45deg)'
											: undefined,
								} }
							/>
						) }
						<button
							className="clouansp-canvas-node-list__title"
							onClick={ () => onSelect( node.id ) }
							title={ __( 'Select on canvas', 'clouds-and-spaceships' ) }
						>
							{ getDisplayTitle( node ) }
						</button>

						<div className="clouansp-canvas-node-list__actions">
							{ incomingEdge && (
								<Flex
									direction="row"
									align="center"
									justify="end"
									gap={ 0 }
								>
									<Button
										size="compact"
										variant="secondary"
										icon={ arrowUp }
										label={ __(
											'Move up in sequence',
											'clouds-and-spaceships'
										) }
										disabled={ ! canUp }
										onClick={ () => handleMoveUp( item ) }
									/>
									<Button
										size="compact"
										variant="secondary"
										icon={ arrowDown }
										label={ __(
											'Move down in sequence',
											'clouds-and-spaceships'
										) }
										disabled={ ! canDown }
										onClick={ () => handleMoveDown( item ) }
									/>
									<Button
										size="compact"
										variant="secondary"
										icon={ color }
										label={ __(
											'Style this connection',
											'clouds-and-spaceships'
										) }
										onClick={ () =>
											onEditEdge( incomingEdge.id )
										}
									/>
									<Button
										size="compact"
										variant="secondary"
										icon={ linkOff }
										label={ __(
											'Remove this branch',
											'clouds-and-spaceships'
										) }
										onClick={ () => {
											if (
												window.confirm(
													__( 'Remove the connection to this node?', 'clouds-and-spaceships' )
												)
											) {
												onEdgeDelete( incomingEdge.id );
											}
										} }
									/>
									<Button
										size="compact"
										variant="secondary"
										icon={ plus }
										label={ __(
											'Split route: add a parallel branch from the same parent',
											'clouds-and-spaceships'
										) }
										onClick={ () =>
											onStartEdgeFrom(
												incomingEdge.fromNodeId
											)
										}
									/>
								</Flex>
							) }
							{ ! incomingEdge && ! isStart && (
								<Button
									size="compact"
									variant="secondary"
									icon={ starFilled }
									label={ __(
										'Set as story start node',
										'clouds-and-spaceships'
									) }
									onClick={ () => onSetStartNode( node.id ) }
								/>
							) }
							<Button
								size="compact"
								variant="secondary"
								icon={ pencil }
								style={ {
									color: 'grey',
									borderColor: 'grey',
								} }
								label={ __(
									'Edit node',
									'clouds-and-spaceships'
								) }
								onClick={ () => onEdit( node.id ) }
							/>
							<Button
								size="compact"
								variant="secondary"
								icon={ trash }
								isDestructive
								label={ __(
									'Delete node',
									'clouds-and-spaceships'
								) }
								onClick={ () => {
									if (
										window.confirm(
											__( 'Delete this node and all its connections?', 'clouds-and-spaceships' )
										)
									) {
										onDelete( node.id );
									}
								} }
							/>
						</div>
					</div>
				);
			} ) }
		</div>
	);
}
