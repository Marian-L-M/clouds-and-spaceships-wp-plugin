import { Button } from '@wordpress/components';
import { copy, pencil, trash } from '@wordpress/icons';
import { __, _n, sprintf } from '@wordpress/i18n';
import EntityTable from './EntityTable';
import type { EntityColumn } from './EntityTable';
import type { MapArea } from '../../../types';

interface Props {
	areas: MapArea[];
	onSelect: ( id: number ) => void;
	onDuplicate: ( id: number ) => void;
	onDelete: ( id: number ) => void;
}

const COLUMNS: EntityColumn< MapArea >[] = [
	{
		header: __( 'Title', 'clouds-and-spaceships' ),
		render: ( area ) =>
			area.title || __( '(no title)', 'clouds-and-spaceships' ),
	},
	{
		header: __( 'Type', 'clouds-and-spaceships' ),
		render: ( area ) => (
			<span className="clouansp-badge clouansp-badge--type">{ area.type }</span>
		),
	},
	{
		header: __( 'Nodes', 'clouds-and-spaceships' ),
		render: ( area ) => {
			const count = ( area.nodes || [] ).length;
			return sprintf(
				/* translators: %d: number of nodes. */
				_n( '%d node', '%d nodes', count, 'clouds-and-spaceships' ),
				count
			);
		},
	},
];

export default function AreasList( {
	areas,
	onSelect,
	onDuplicate,
	onDelete,
}: Props ) {
	return (
		<EntityTable
			items={ areas }
			columns={ COLUMNS }
			emptyText={ __(
				'No areas yet. Click “Add Area” to create one.',
				'clouds-and-spaceships'
			) }
			renderActions={ ( area ) => (
				<>
					<Button
						variant="secondary"
						icon={ pencil }
						label={ __( 'Edit', 'clouds-and-spaceships' ) }
						onClick={ () => onSelect( area.id ) }
					/>
					<Button
						variant="secondary"
						icon={ copy }
						label={ __( 'Duplicate', 'clouds-and-spaceships' ) }
						onClick={ () => onDuplicate( area.id ) }
					/>
					<Button
						variant="secondary"
						icon={ trash }
						isDestructive
						label={ __( 'Delete', 'clouds-and-spaceships' ) }
						onClick={ () => onDelete( area.id ) }
					/>
				</>
			) }
		/>
	);
}
