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
								__next40pxDefaultSize
								label={ __( 'Map Title', 'clouds-and-spaceships' ) }
								value={ settings.title }
								placeholder={ __(
									'Enter map title…',
									'clouds-and-spaceships'
								) }
								onChange={ ( title ) => set( 'title', title ) }
							/>
						</div>
						{ /*  Map Time Value */ }
						<div className="cns-grid__group cns-grid__span-1">
							<NumberControl
								__next40pxDefaultSize
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
						</div>

						{ /* Flags */ }
						<div className="cns-grid__group cns-grid__span-4">
							<Flex gap={ 1 } align="center" justify="start">
								<ToggleControl
									label={ __( 'MasterMap', 'clouds-and-spaceships' ) }
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
							<Flex gap={ 1 } align="center" justify="start">
								<ToggleControl
									label={ __( 'Featured', 'clouds-and-spaceships' ) }
									checked={ settings.featured }
									onChange={ ( v ) => set( 'featured', v ) }
								/>
								<Tooltip
									text="Display in featured section"
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
								__next40pxDefaultSize
								label={ __( 'Aspect Ratio', 'clouds-and-spaceships' ) }
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
								__next40pxDefaultSize
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
										__next40pxDefaultSize
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
										__next40pxDefaultSize
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
										__next40pxDefaultSize
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
								label={ __( 'Thumbnail', 'clouds-and-spaceships' ) }
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
										label: __( 'Color', 'clouds-and-spaceships' ),
										value: 'color',
									},
									{
										label: __( 'Image', 'clouds-and-spaceships' ),
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
					</div>
				</div>

				<SettingsCanvas settings={ settings } />
			</div>
		</div>
	);
}
