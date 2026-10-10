import { Button } from '@wordpress/components';
import { copy, pencil, trash } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import EntityTable from './EntityTable';
import type { EntityColumn } from './EntityTable';
import { objectUsesIcon } from '../../../../shared/map-geometry';
import type { MapObject } from '../../../types';

interface Props {
	objects: MapObject[];
	onEdit: ( obj: MapObject ) => void;
	onDuplicate: ( id: number ) => void;
	onDelete: ( id: number ) => void;
}

const COLUMNS: EntityColumn< MapObject >[] = [
	{
		header: '',
		width: 36,
		className: 'clouansp-objects-table__icon',
		render: ( obj ) =>
			obj.icon_url && objectUsesIcon( obj.canvas_styles ) ? (
				<img
					src={ obj.icon_url }
					width="28"
					height="28"
					alt=""
					style={ { display: 'block', objectFit: 'contain' } }
				/>
			) : (
				<span
					className="clouansp-obj-dot"
					style={ {
						background: obj.canvas_styles?.bgColor || '#2271b1',
					} }
				/>
			),
	},
	{
		header: __( 'Title', 'clouds-and-spaceships' ),
		render: ( obj ) =>
			obj.title || __( '(no title)', 'clouds-and-spaceships' ),
	},
	{
		header: __( 'Type', 'clouds-and-spaceships' ),
		render: ( obj ) => (
			<span className="clouansp-badge clouansp-badge--type">{ obj.type }</span>
		),
	},
	{
		header: __( 'Position', 'clouds-and-spaceships' ),
		render: ( obj ) => (
			<>
				{ obj.x }, { obj.y }
			</>
		),
	},
];

export default function ObjectsList( {
	objects,
	onEdit,
	onDuplicate,
	onDelete,
}: Props ) {
	return (
		<EntityTable
			items={ objects }
			columns={ COLUMNS }
			emptyText={ __(
				'No objects on map. Click on canvas or [Add Object] button to place your first map object.',
				'clouds-and-spaceships'
			) }
			renderActions={ ( obj ) => (
				<>
					<Button
						variant="secondary"
						icon={ pencil }
						label={ __( 'Edit', 'clouds-and-spaceships' ) }
						onClick={ () => onEdit( obj ) }
					/>
					<Button
						variant="secondary"
						icon={ copy }
						label={ __( 'Duplicate', 'clouds-and-spaceships' ) }
						onClick={ () => onDuplicate( obj.id ) }
					/>
					<Button
						variant="secondary"
						icon={ trash }
						isDestructive
						label={ __( 'Delete', 'clouds-and-spaceships' ) }
						onClick={ () => onDelete( obj.id ) }
					/>
				</>
			) }
		/>
	);
}
