import { useRef, useEffect } from '@wordpress/element';
import { drawMapCanvas } from '../../canvas';
import type { MapSettings } from '../../../types';

interface Props {
	settings: MapSettings;
}

export default function SettingsCanvas( { settings }: Props ) {
	const canvasRef = useRef<HTMLCanvasElement>( null );

	useEffect( () => {
		const canvas = canvasRef.current;
		if ( ! canvas ) return;
		drawMapCanvas( canvas, {
			width:       settings.width,
			aspectRatio: settings.aspectRatio,
			bgType:      settings.bgType,
			bgColor:     settings.bgColor,
			bgImageUrl:  settings.bgImageUrl,
			imgUrl:      settings.imageUrl,
			imageX:      settings.imageX,
			imageY:      settings.imageY,
			imageW:      settings.imageW,
		} );
	}, [
		settings.width, settings.aspectRatio,
		settings.bgType, settings.bgColor, settings.bgImageUrl,
		settings.imageUrl, settings.imageX, settings.imageY, settings.imageW,
	] );

	return (
		<div className="cns-settings-canvas">
			<canvas ref={ canvasRef } />
			<p className="description">Live preview — updates as you edit settings.</p>
		</div>
	);
}
