import { Button } from '@wordpress/components';
import { external } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import PreviewCanvas from '../canvases/PreviewCanvas';
import { settingsToDrawState } from '../../canvas';
import type { MapSettings, MapObject, MapArea, MapLabel } from '../../../types';

interface Props {
	settings: MapSettings;
	objects: MapObject[];
	areas: MapArea[];
	labels: MapLabel[];
	viewUrl: string;
}

export default function PreviewPanel( { settings, objects, areas, labels, viewUrl }: Props ) {
	return (
		<div className="cns-tab-panel cns-tab-panel--active" data-panel="preview" role="tabpanel">
			<PreviewCanvas
				drawState={ settingsToDrawState( settings ) }
				objects={ objects }
				areas={ areas }
				labels={ labels }
			/>
			{ settings.description.trim() !== '' && (
				// Mirrors the frontend: description renders beneath the map.
				// Own admin input; the server sanitizes it (wp_kses_post) on save.
				<div
					className="cns-map-description cns-map-description--preview"
					dangerouslySetInnerHTML={ { __html: settings.description } }
				/>
			) }
			{ viewUrl && (
				<div className="cns-preview-actions">
					<Button
						href={ viewUrl }
						variant="secondary"
						icon={ external }
						target="_blank"
					>
						{ __( 'View map page', 'clouds-and-spaceships' ) }
					</Button>
				</div>
			) }
		</div>
	);
}
