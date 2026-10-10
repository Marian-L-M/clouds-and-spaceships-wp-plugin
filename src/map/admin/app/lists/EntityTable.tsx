import type { ReactNode } from 'react';
import { __ } from '@wordpress/i18n';

/**
 * Generic list table for the entity tabs (objects / areas / labels): the
 * per-entity lists only declare their columns and action buttons, so layout,
 * empty states, and the action-cell pattern stay identical across tabs.
 */
export interface EntityColumn<T> {
	header: ReactNode;
	render: ( item: T ) => ReactNode;
	width?: number;
	className?: string;
}

interface Props<T extends { id: number }> {
	items: T[];
	columns: EntityColumn<T>[];
	emptyText: string;
	renderActions: ( item: T ) => ReactNode;
}

export default function EntityTable<T extends { id: number }>( {
	items, columns, emptyText, renderActions,
}: Props<T> ) {
	if ( ! items.length ) {
		return <p className="clouansp-objects-empty">{ emptyText }</p>;
	}

	return (
		<table className="widefat clouansp-objects-table">
			<thead>
				<tr>
					{ columns.map( ( col, i ) => (
						<th key={ i } style={ col.width ? { width: col.width } : undefined }>{ col.header }</th>
					) ) }
					<th>{ __( 'Actions', 'clouds-and-spaceships' ) }</th>
				</tr>
			</thead>
			<tbody>
				{ items.map( ( item ) => (
					<tr key={ item.id }>
						{ columns.map( ( col, i ) => (
							<td key={ i } className={ col.className }>{ col.render( item ) }</td>
						) ) }
						<td className="clouansp-row-actions">
							<div className="clouansp-actions-row">{ renderActions( item ) }</div>
						</td>
					</tr>
				) ) }
			</tbody>
		</table>
	);
}
