import { Button, ExternalLink } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import type { LibraryIcon } from '../../../types';

interface Props {
	icons: LibraryIcon[];
	selectedIconId: number | null;
	onSelect: ( id: number ) => void;
}

export default function IconPicker( { icons, selectedIconId, onSelect }: Props ) {
	if ( ! icons || ! icons.length ) {
		return (
			<p className="description">
				{ __( 'No icons yet.', 'clouds-and-spaceships' ) }{ ' ' }
				<ExternalLink href={ window.cnsMapSuite.iconsUrl }>
					{ __( 'Add icons', 'clouds-and-spaceships' ) }
				</ExternalLink>
			</p>
		);
	}

	return (
		<div
			className="cns-icon-picker-grid"
			aria-label={ __( 'Icon library', 'clouds-and-spaceships' ) }
		>
			{ icons.map( ( icon ) => (
				<Button
					key={ icon.id }
					className={ `cns-icon-item${
						icon.id === selectedIconId
							? ' cns-icon-item--active'
							: ''
					}` }
					label={ icon.title }
					aria-pressed={ icon.id === selectedIconId }
					onClick={ () => onSelect( icon.id ) }
				>
					<img src={ icon.url } alt={ icon.title } />
				</Button>
			) ) }
		</div>
	);
}
