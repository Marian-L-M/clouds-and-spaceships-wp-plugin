import { __ } from '@wordpress/i18n';
import {
	RadioControl,
	RangeControl,
	TextControl,
	ToggleControl,
	__experimentalNumberControl as NumberControl,
	Card,
	CardBody,
	CardDivider,
	Tooltip,
	Flex,
} from '@wordpress/components';
import {
	Icon,
	chevronRightSmall,
	chevronLeftSmall,
	info,
} from '@wordpress/icons';

// Custom elements
import ColorField from '../../../../shared/admin/ColorField';
import MediaPicker from '../shared/MediaPicker';
import SettingsCanvas from '../canvases/SettingsCanvas';
import type { MapSettings } from '../../../types';

interface Props {
	settings: MapSettings;
	onChange: ( updater: ( prev: MapSettings ) => MapSettings ) => void;
}

export default function SettingsPanel( { settings, onChange }: Props ) {
	function set< K extends keyof MapSettings >(
		key: K,
		val: MapSettings[ K ]
	) {
		onChange( ( prev ) => ( { ...prev, [ key ]: val } ) );
	}

	// Either color being set makes this map an override; clearing the toggle
	// empties both, which is what "follow the global default" is stored as.
	const overridesZoomColors =
		settings.zoomMainColor !== '' || settings.zoomAccentColor !== '';

	return (
		<div
			className="cns-tab-panel cns-tab-panel--active"
			data-panel="settings"
			role="tabpanel"
		>
			<div className="cns-settings-layout">
				<div className="cns-settings-form">
					<div className="cns-grid cns-grid__24">
						{ /* Title Input */ }
						<div className="cns-grid__group cns-grid__span-3">
							<TextControl
								label={ __(
									'Map Title',
									'clouds-and-spaceships'
								) }
								value={ settings.title }
								placeholder={ __(
									'Enter map title…',
									'clouds-and-spaceships'
								) }
								onChange={ ( title ) => set( 'title', title ) }
							/>
						</div>
						{ /*  Map Time Value */ }
						{ /*  Sneaky sneaky. Map time is a placeholder for a future functionality */ }
						{ /* <div className="cns-grid__group cns-grid__span-1">
							<NumberControl
								label={ __(
									'Timeline value',
									'clouds-and-spaceships'
								) }
								value={ settings.time }
								step={ 1 }
								spinControls="native"
								isDragEnabled
								isShiftStepEnabled
								shiftStep={ 10 }
								onChange={ ( value ) =>
									set(
										'time',
										parseInt( value ?? '', 10 ) || 0
									)
								}
							/>
						</div> */ }

						{ /* Flags */ }
						<div className="cns-grid__group cns-grid__span-4">
							<Flex gap={ 1 } align="center" justify="start">
								<ToggleControl
									label={ __(
										'MasterMap',
										'clouds-and-spaceships'
									) }
									checked={ settings.isMaster }
									onChange={ ( v ) => set( 'isMaster', v ) }
								/>
								<Tooltip
									text="Relational map that links to other child maps."
									placement="top-end"
								>
									<div>
										<Icon icon={ info } size={ 16 } />
									</div>
								</Tooltip>
							</Flex>
						</div>

						{ /* Aspect Ratio */ }
						<div className="cns-grid__group cns-grid__span-3">
							<RangeControl
								label={ __(
									'Aspect Ratio',
									'clouds-and-spaceships'
								) }
								help={ __(
									'Width ÷ Height (1.77 = 16:9, 1.0 = square, 0.75 = portrait)',
									'clouds-and-spaceships'
								) }
								beforeIcon={ chevronLeftSmall }
								afterIcon={ chevronRightSmall }
								withInputField
								isShiftStepEnabled
								marks={ [
									{ value: 0, label: '0' },
									{ value: 1, label: '1' },
									{ value: 2, label: '2' },
									{ value: 3, label: '3' },
									{ value: 4, label: '4' },
								] }
								value={ settings.aspectRatio }
								onChange={ ( v ) =>
									set( 'aspectRatio', v ?? 1 )
								}
								allowReset
								resetFallbackValue={ 1.0 }
								min={ 0.25 }
								max={ 4 }
								step={ 0.01 }
							/>
						</div>

						{ /*  Canvas max width input */ }
						<div className="cns-grid__group cns-grid__span-1">
							<NumberControl
								label={ __(
									'Max Width (px)',
									'clouds-and-spaceships'
								) }
								min={ 100 }
								step={ 10 }
								value={ settings.width }
								onChange={ ( value ) =>
									set(
										'width',
										parseInt( value ?? '', 10 ) || 1000
									)
								}
							/>
						</div>

						{ /* Base map image */ }
						<div className="cns-grid__group cns-grid__span-2">
							<MediaPicker
								imageId={ settings.imageId }
								imageUrl={ settings.imageUrl }
								label={ __(
									'Base Map Image',
									'clouds-and-spaceships'
								) }
								title={ __(
									'Select Base Map Image',
									'clouds-and-spaceships'
								) }
								onChange={ ( att ) =>
									onChange( ( prev ) => ( {
										...prev,
										imageId: att ? att.id : 0,
										imageUrl: att ? att.url : '',
									} ) )
								}
							/>
						</div>

						{ /* Image placement */ }
						<div className="cns-grid__group cns-grid__span-2">
							<Card className="image-scale-positioning">
								<CardBody>
									<RangeControl
										label={ __(
											'Image Width',
											'clouds-and-spaceships'
										) }
										help={ __(
											'1.0 = full canvas width. Height follows the image ratio.',
											'clouds-and-spaceships'
										) }
										min={ 0.1 }
										max={ 2 }
										step={ 0.01 }
										withInputField
										value={ settings.imageW }
										onChange={ ( v ) =>
											set( 'imageW', v ?? 1 )
										}
									/>
								</CardBody>
								<CardDivider />
								<CardBody>
									<RangeControl
										label={ __(
											'Image Y offset',
											'clouds-and-spaceships'
										) }
										min={ 0 }
										max={ 1 }
										step={ 0.01 }
										withInputField
										value={ settings.imageY }
										onChange={ ( v ) =>
											set( 'imageY', v ?? 0 )
										}
									/>
								</CardBody>
								<CardDivider />
								<CardBody>
									<RangeControl
										label={ __(
											'Image X offset',
											'clouds-and-spaceships'
										) }
										min={ 0 }
										max={ 1 }
										step={ 0.01 }
										withInputField
										value={ settings.imageX }
										onChange={ ( v ) =>
											set( 'imageX', v ?? 0 )
										}
									/>
								</CardBody>
							</Card>
						</div>

						{ /* Thumbnail */ }
						<div className="cns-grid__group cns-grid__span-2">
							<MediaPicker
								imageId={ settings.thumbnailId ?? 0 }
								imageUrl={ settings.thumbnailUrl }
								label={ __(
									'Thumbnail',
									'clouds-and-spaceships'
								) }
								title={ __(
									'Select Map Thumbnail',
									'clouds-and-spaceships'
								) }
								onChange={ ( att ) =>
									onChange( ( prev ) => ( {
										...prev,
										thumbnailId: att ? att.id : null,
										thumbnailUrl: att ? att.url : '',
									} ) )
								}
							/>
						</div>
						{ /* Map Background */ }
						<div className="cns-grid__group cns-grid__span-2">
							<RadioControl
								label={ __(
									'Map Background',
									'clouds-and-spaceships'
								) }
								selected={ settings.bgType }
								options={ [
									{
										label: __(
											'Color',
											'clouds-and-spaceships'
										),
										value: 'color',
									},
									{
										label: __(
											'Image',
											'clouds-and-spaceships'
										),
										value: 'image',
									},
								] }
								onChange={ ( v ) =>
									set(
										'bgType',
										v as MapSettings[ 'bgType' ]
									)
								}
							/>
							{ settings.bgType === 'color' && (
								<ColorField
									label={ __(
										'Background Color',
										'clouds-and-spaceships'
									) }
									value={ settings.bgColor }
									onChange={ ( v ) => set( 'bgColor', v ) }
								/>
							) }
							{ settings.bgType === 'image' && (
								<MediaPicker
									imageId={ settings.bgImageId }
									imageUrl={ settings.bgImageUrl }
									title={ __(
										'Select Background Image',
										'clouds-and-spaceships'
									) }
									onChange={ ( att ) =>
										onChange( ( prev ) => ( {
											...prev,
											bgImageId: att ? att.id : 0,
											bgImageUrl: att ? att.url : '',
										} ) )
									}
								/>
							) }
						</div>

						{ /* Zoom controls */ }
						<div
							className="cns-grid__group cns-grid__span-full"
							style={ { marginBottom: '8px' } }
						>
							<ToggleControl
								label={ __(
									'Set custom controls color',
									'clouds-and-spaceships'
								) }
								help={ __(
									'Uses theme or plugin colors by default.',
									'clouds-and-spaceships'
								) }
								checked={ overridesZoomColors }
								onChange={ ( on ) =>
									onChange( ( prev ) => ( {
										...prev,
										zoomMainColor: on
											? prev.zoomMainColor || '#2271b1'
											: '',
										zoomAccentColor: on
											? prev.zoomAccentColor || '#ffffff'
											: '',
									} ) )
								}
							/>
							{ overridesZoomColors && (
								<Flex gap={ 2 } justify="start" wrap>
									<ColorField
										label={ __(
											'Control Main Color',
											'clouds-and-spaceships'
										) }
										value={ settings.zoomMainColor }
										onChange={ ( v ) =>
											set( 'zoomMainColor', v )
										}
									/>
									<ColorField
										label={ __(
											'Control Accent Color',
											'clouds-and-spaceships'
										) }
										value={ settings.zoomAccentColor }
										onChange={ ( v ) =>
											set( 'zoomAccentColor', v )
										}
									/>
								</Flex>
							) }
						</div>
					</div>
				</div>

				<SettingsCanvas settings={ settings } />
			</div>
		</div>
	);
}
