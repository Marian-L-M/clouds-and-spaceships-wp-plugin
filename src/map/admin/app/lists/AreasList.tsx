import { Button } from '@wordpress/components';
import { copy, pencil, trash } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
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
	{ header: 'Title', render: ( area ) => area.title || '(no title)' },
	{
		header: 'Type',
		render: ( area ) => (
			<span className="cns-badge cns-badge--type">{ area.type }</span>
		),
	},
	{
		header: 'Nodes',
		render: ( area ) => `${ ( area.nodes || [] ).length } nodes`,
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
