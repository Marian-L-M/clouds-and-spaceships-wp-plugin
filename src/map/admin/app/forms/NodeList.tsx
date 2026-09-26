import { Button, __experimentalNumberControl as NumberControl } from '@wordpress/components';
import { plus, closeSmall } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import { applyRectangleConstraint, insertAreaNode } from '../../areas';
import type { MapArea, Node, ShapeType } from '../../../types';

const NODE_LABELS: Partial<Record<ShapeType, string[]>> = {
	RECTANGLE: [ 'TL', 'TR', 'BR', 'BL' ],
	CIRCLE:    [ 'Center', 'Edge' ],
};

interface Props {
	area: MapArea;
	onNodesChange: ( nodes: Node[] ) => void;
	focusedNodeIdx: number | null;
	onNodeFocusChange: ( idx: number | null ) => void;
}

export default function NodeList( {
	area,
	onNodesChange,
	focusedNodeIdx,
	onNodeFocusChange,
}: Props ) {
	const nodes     = area.nodes || [];
	const shapeType = area.shape_type || 'POLYGON';
	const isFixed   = shapeType === 'RECTANGLE' || shapeType === 'CIRCLE';
	const labels    = NODE_LABELS[ shapeType ] || null;

	function updateNode( idx: number, axis: 'x' | 'y', rawVal: string ) {
		const val = Math.max( 0, Math.min( 100, parseFloat( rawVal ) || 0 ) ) / 100;
		let updated = nodes.map( ( n ) => ( { ...n } ) );

		if ( shapeType === 'RECTANGLE' ) {
			const newX = axis === 'x' ? val : updated[ idx ].x;
			const newY = axis === 'y' ? val : updated[ idx ].y;
			updated = applyRectangleConstraint( updated, idx, newX, newY ) || updated;
		} else if ( shapeType === 'CIRCLE' && idx === 0 ) {
			const dx = ( axis === 'x' ? val : updated[ 0 ].x ) - updated[ 0 ].x;
			const dy = ( axis === 'y' ? val : updated[ 0 ].y ) - updated[ 0 ].y;
			updated[ 0 ] = { x: updated[ 0 ].x + dx, y: updated[ 0 ].y + dy };
			if ( updated[ 1 ] ) updated[ 1 ] = { x: updated[ 1 ].x + dx, y: updated[ 1 ].y + dy };
		} else {
			updated[ idx ] = { ...updated[ idx ], [ axis ]: val };
		}

		onNodesChange( updated );
	}

	function addNode() {
		const { nodes: next, index } = insertAreaNode( nodes, focusedNodeIdx, {
			x: 0.5,
			y: 0.5,
		} );
		onNodesChange( next );
		// Follow the new node so a run of adds walks forward along the shape.
		onNodeFocusChange( index );
	}

	function deleteNode( idx: number ) {
		onNodesChange( nodes.filter( ( _, i ) => i !== idx ) );
	}

	return (
		<section className="cns-modal-section cns-nodes-section">
			<h3>
				{ __( 'Nodes', 'clouds-and-spaceships' ) }
				{ ! isFixed && (
					<Button
						variant="secondary"
						size="small"
						icon={ plus }
						onClick={ addNode }
					>
						{ __( 'Add Node', 'clouds-and-spaceships' ) }
					</Button>
				) }
			</h3>
			{ nodes.length === 0 ? (
				<p className="description">
					{ __( 'No nodes yet. Click the canvas to add nodes.', 'clouds-and-spaceships' ) }
				</p>
			) : (
				<table className="cns-nodes-table">
					<thead><tr><th>#</th><th>X&nbsp;%</th><th>Y&nbsp;%</th><th></th></tr></thead>
					<tbody>
						{ nodes.map( ( node, idx ) => (
							<tr key={ idx }>
								<td className="cns-node-num">{ labels ? ( labels[ idx ] ?? idx + 1 ) : idx + 1 }</td>
								<td>
									<NumberControl
										size="small"
										label={ __( 'X %', 'clouds-and-spaceships' ) }
										hideLabelFromVision
										value={ ( node.x * 100 ).toFixed( 1 ) }
										min={ 0 } max={ 100 } step={ 0.1 }
										onChange={ ( v ) => updateNode( idx, 'x', v ?? '' ) }
									/>
								</td>
								<td>
									<NumberControl
										size="small"
										label={ __( 'Y %', 'clouds-and-spaceships' ) }
										hideLabelFromVision
										value={ ( node.y * 100 ).toFixed( 1 ) }
										min={ 0 } max={ 100 } step={ 0.1 }
										onChange={ ( v ) => updateNode( idx, 'y', v ?? '' ) }
									/>
								</td>
								<td>
									{ ! isFixed && (
										<Button
											size="small"
											icon={ closeSmall }
											label={ __( 'Remove node', 'clouds-and-spaceships' ) }
											onClick={ () => deleteNode( idx ) }
										/>
									) }
								</td>
							</tr>
						) ) }
					</tbody>
				</table>
			) }
		</section>
	);
}
