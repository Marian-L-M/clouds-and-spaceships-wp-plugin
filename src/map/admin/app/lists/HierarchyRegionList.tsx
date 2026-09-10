import { Button } from '@wordpress/components';
import { pencil, trash } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import type { HierarchyRegion } from '../../../types';

interface Props {
	regions: HierarchyRegion[];
	onSelect: ( id: number ) => void;
	onDelete: ( id: number ) => void;
}

export default function HierarchyRegionList( { regions, onSelect, onDelete }: Props ) {
	if ( ! regions.length ) {
		return (
			<p className="description">
				{ __( 'No child-map regions yet. Click "Add Region" to draw one.', 'clouds-and-spaceships' ) }
			</p>
		);
	}

	return (
		<ul className="cns-items-list">
			{ regions.map( ( r ) => (
				<li key={ r.id } className="cns-items-list__item">
					{ r.child_map_thumbnail && (
						<img src={ r.child_map_thumbnail } alt="" className="cns-items-list__thumb" />
					) }
					<span className="cns-items-list__label">
						{ r.child_map_title || `Map #${ r.child_map_id }` }
						{ r.child_map_status && r.child_map_status !== 'publish' && (
							<em className="cns-items-list__status"> — { r.child_map_status }</em>
						) }
					</span>
					<span className="cns-items-list__actions">
						<Button
							size="small"
							icon={ pencil }
							label={ __( 'Edit', 'clouds-and-spaceships' ) }
							onClick={ () => onSelect( r.id ) }
						/>
						<Button
							size="small"
							icon={ trash }
							isDestructive
							label={ __( 'Delete', 'clouds-and-spaceships' ) }
							onClick={ () => onDelete( r.id ) }
						/>
					</span>
				</li>
			) ) }
		</ul>
	);
}
