import {
	Flex,
	Button,
	Notice,
	Popover,
	FlexItem,
	FlexBlock,
} from '@wordpress/components';
import { arrowDown, arrowUp, pencil, starEmpty, trash } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import type { StoryNode, StoryEdge, StoryPath } from '../../../types';
import { useState, useEffect } from '@wordpress/element';

interface Props {
	nodes: StoryNode[];
	edges: StoryEdge[];
	paths: StoryPath[];
	startNodeId: number | null;
	onEditNode: ( nodeId: number ) => void;
	onDeleteNode: ( nodeId: number ) => void;
	onSetStartNode: ( nodeId: number ) => void;
	onEdgeReorder: ( edgeId: number, sortOrder: number ) => void;
	onEdgeDelete: ( edgeId: number ) => void;
	onEditEdge: ( edgeId: number ) => void;
}

function getDisplayTitle( node: StoryNode ): string {
	return node.titleOverride || node.substoryTitle || `Node #${ node.id }`;
}

export default function NodesPanel( {
	nodes,
	edges,
	paths,
	startNodeId,
	onEditNode,
	onDeleteNode,
	onSetStartNode,
	onEdgeReorder,
	onEdgeDelete,
	onEditEdge,
}: Props ) {
	const pathMap = new Map( paths.map( ( p ) => [ p.id, p ] ) );
	if ( ! nodes.length ) {
		return (
			<div className="cns-panel">
				<p>No nodes yet.</p>
			</div>
		);
	}

	// Help information
	const [ isVisibleHelpInformation, setIsVisibleHelpInformation ] =
		useState( false );
	const toggleVisibleHelpInformation = () => {
		setIsVisibleHelpInformation( ( state: boolean ) => ! state );
	};

	// Moves an outgoing edge one slot up/down among its siblings and rewrites every sibling's sort order
	function moveEdge( outEdges: StoryEdge[], index: number, dir: -1 | 1 ) {
		const target = index + dir;
		if ( target < 0 || target >= outEdges.length ) return;
		const reordered = [ ...outEdges ];
		[ reordered[ index ], reordered[ target ] ] = [
			reordered[ target ],
			reordered[ index ],
		];
		reordered.forEach( ( edge, i ) => {
			if ( edge.sortOrder !== i ) onEdgeReorder( edge.id, i );
		} );
	}

	return (
		<Flex
			gap={ 2 }
			direction="column"
			align="center"
			className="cns-panel cns-nodes-panel"
		>
			<FlexBlock style={ { width: '100%' } }>
				<Flex gap={ 4 } align="center" justify="start">
					<FlexItem>
						<h2>Story Nodes</h2>
					</FlexItem>
					<FlexItem>
						<Button
							variant="secondary"
							onClick={ toggleVisibleHelpInformation }
						>
							Help Information
							{ isVisibleHelpInformation && (
								<Popover
									headerTitle="Help Information"
									expandOnMobile
								>
									<ol
										style={ {
											width: 320,
											maxWidth: '100%',
										} }
									>
										<li>
											Set Start - marks the initial node
											and path for the story element.
										</li>
										<li>
											Style Path - style setting for path
											between this node and the next in
											path.
										</li>
										<li>
											Branch Order - If a story path
											splits into multiple nodes, set the
											branch order to determine the
											primary path and the menu order.
										</li>
									</ol>
								</Popover>
							) }
						</Button>
					</FlexItem>
				</Flex>
			</FlexBlock>
			<FlexItem>
				<table className="wp-list-table widefat fixed striped">
					<thead>
						<tr>
							<th style={ { width: 32 } }></th>
							<th>Node</th>
							<th>Substory</th>
							<th>Outgoing Paths</th>
							<th>Actions</th>
						</tr>
					</thead>
					<tbody>
						{ nodes.map( ( node ) => {
							const outEdges = edges
								.filter( ( e ) => e.fromNodeId === node.id )
								.sort(
									( a, b ) =>
										a.sortOrder - b.sortOrder || a.id - b.id
								);

							return (
								<tr key={ node.id }>
									{ /* Icon */ }
									<td>
										<span
											className="cns-node-swatch"
											style={ {
												background:
													node.iconType ===
														'thumbnail' ||
													node.iconType === 'icon'
														? 'transparent'
														: node.iconColor,
												width: 18,
												height: 18,
												display: 'inline-block',
												borderRadius:
													node.iconType ===
														'square' ||
													node.iconType === 'diamond'
														? 2
														: '50%',
												transform:
													node.iconType === 'diamond'
														? 'rotate(45deg)'
														: undefined,
												border: '1px solid rgba(0,0,0,0.3)',
											} }
										/>
									</td>
									{ /* Node */ }
									<td>
										<strong>
											{ getDisplayTitle( node ) }
										</strong>
										{ node.id === startNodeId && (
											<span
												className="cns-badge cns-badge--featured"
												style={ { marginLeft: 6 } }
											>
												Start
											</span>
										) }
										{ node.pathId &&
											pathMap.has( node.pathId ) && (
												<span
													className="cns-badge"
													style={ {
														marginLeft: 6,
														background: pathMap.get(
															node.pathId
														)!.markerColor,
														color: '#fff',
														fontSize: 10,
														padding: '1px 5px',
														borderRadius: 10,
													} }
												>
													{ pathMap.get(
														node.pathId
													)!.label ||
														`Path #${ node.pathId }` }
												</span>
											) }
									</td>
									{ /* Substory */ }
									<td>
										{ node.substoryId ? (
											node.substoryEditUrl ? (
												<a
													href={
														node.substoryEditUrl
													}
													target="_blank"
													rel="noopener"
												>
													{ node.substoryTitle ||
														`Substory #${ node.substoryId }` }{ ' ' }
													↗
												</a>
											) : (
												<span>
													{ node.substoryTitle ||
														`Substory #${ node.substoryId }` }
												</span>
											)
										) : (
											<span className="description">
												—
											</span>
										) }
									</td>
									{ /* Paths */ }
									<td>
										{ outEdges.length === 0 && (
											<span className="description">
												None
											</span>
										) }
										{ outEdges.map( ( edge, index ) => {
											const toNode = nodes.find(
												( n ) => n.id === edge.toNodeId
											);
											return (
												<Flex
													direction="row"
													align="center"
													justify="space-between"
													gap={ 2 }
													key={ edge.id }
													className="cns-edge-row"
												>
													<FlexItem>
														→{ ' ' }
														{ toNode
															? getDisplayTitle(
																	toNode
															  )
															: `#${ edge.toNodeId }` }
													</FlexItem>
													<FlexBlock>
														<Flex
															direction="row"
															align="center"
															justify="end"
															gap={ 1 }
														>
															{ outEdges.length >
																1 && (
																<FlexItem>
																	<Flex
																		direction="row"
																		align="center"
																		justify="start"
																		gap={
																			0
																		}
																	>
																		<Button
																			size="compact"
																			variant="secondary"
																			icon={
																				arrowUp
																			}
																			label={ __(
																				'Move branch up',
																				'clouds-and-spaceships'
																			) }
																			disabled={
																				index ===
																				0
																			}
																			onClick={ () =>
																				moveEdge(
																					outEdges,
																					index,
																					-1
																				)
																			}
																		/>
																		<Button
																			size="compact"
																			variant="secondary"
																			icon={
																				arrowDown
																			}
																			label={ __(
																				'Move branch down',
																				'clouds-and-spaceships'
																			) }
																			disabled={
																				index ===
																				outEdges.length -
																					1
																			}
																			onClick={ () =>
																				moveEdge(
																					outEdges,
																					index,
																					1
																				)
																			}
																		/>
																	</Flex>
																</FlexItem>
															) }
															<FlexItem>
																<Flex
																	direction="row"
																	align="center"
																	justify="start"
																	gap={ 0 }
																>
																	<Button
																		size="compact"
																		variant="secondary"
																		icon={
																			pencil
																		}
																		style={ {
																			color: 'grey',
																			borderColor:
																				'grey',
																		} }
																		label={ __(
																			'Style path',
																			'clouds-and-spaceships'
																		) }
																		onClick={ () =>
																			onEditEdge(
																				edge.id
																			)
																		}
																	/>
																	<Button
																		size="compact"
																		variant="secondary"
																		icon={
																			trash
																		}
																		isDestructive
																		label={ __(
																			'Delete connection',
																			'clouds-and-spaceships'
																		) }
																		onClick={ () => {
																			if (
																				window.confirm(
																					'Are you sure you want to delete this connection?'
																				)
																			)
																				onEdgeDelete(
																					edge.id
																				);
																		} }
																	/>
																</Flex>
															</FlexItem>
														</Flex>
													</FlexBlock>
												</Flex>
											);
										} ) }
									</td>
									{ /* Actions */ }
									<td className="cns-row-actions">
										<Flex
											direction="row"
											align="center"
											justify="end"
											gap={ 0 }
											className="cns-actions-row"
										>
											{ node.id !== startNodeId && (
												<Button
													size="compact"
													variant="secondary"
													icon={ starEmpty }
													label={ __(
														'Set as story start node',
														'clouds-and-spaceships'
													) }
													onClick={ () =>
														onSetStartNode(
															node.id
														)
													}
												>
													{ __(
														'Set Start',
														'clouds-and-spaceships'
													) }
												</Button>
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
													'Edit',
													'clouds-and-spaceships'
												) }
												onClick={ () =>
													onEditNode( node.id )
												}
											/>
											<Button
												size="compact"
												variant="secondary"
												icon={ trash }
												isDestructive
												label={ __(
													'Delete',
													'clouds-and-spaceships'
												) }
												onClick={ () => {
													if (
														window.confirm(
															'Delete this node and all of its connections?'
														)
													) {
														onDeleteNode( node.id );
													}
												} }
											/>
										</Flex>
									</td>
								</tr>
							);
						} ) }
					</tbody>
				</table>
			</FlexItem>
		</Flex>
	);
}
