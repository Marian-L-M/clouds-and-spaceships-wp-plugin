import {
	BaseControl,
	Button,
	CheckboxControl,
	Flex,
	FlexBlock,
	FlexItem,
	TextControl,
	TextareaControl,
} from '@wordpress/components';
import { image as imageIcon, trash } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';

import MapPicker from '../shared/MapPicker';
import MarkerControls from '../shared/MarkerControls';
import MediaSelectButton from '../shared/MediaSelectButton';

import type { StorySettings } from '../../../types';

interface Props {
	settings: StorySettings;
	onChange: ( s: StorySettings ) => void;
	onMapChange: ( mapId: number | null, mapTitle: string ) => void;
}

export default function SettingsPanel( {
	settings,
	onChange,
	onMapChange,
}: Props ) {
	function set< K extends keyof StorySettings >(
		key: K,
		value: StorySettings[ K ]
	) {
		onChange( { ...settings, [ key ]: value } );
	}

	return (
		<div className="clouansp-panel clouansp-settings-panel">
			<h2>{ __( 'Story Settings', 'clouds-and-spaceships' ) }</h2>

			<div className="clouansp-grid clouansp-grid__24">
				<Flex
					className={ 'clouansp-grid__span-2' }
					direction={ 'column' }
					gap={ 4 }
				>
					<FlexItem>
						<TextControl
							label={ __( 'Title', 'clouds-and-spaceships' ) }
							value={ settings.title }
							onChange={ ( v ) => set( 'title', v ) }
							__next40pxDefaultSize
						/>
					</FlexItem>
					<FlexItem>
						<TextareaControl
							label={ __(
								'Description',
								'clouds-and-spaceships'
							) }
							help={ __(
								'Short summary shown in story listings.',
								'clouds-and-spaceships'
							) }
							rows={ 3 }
							value={ settings.description }
							onChange={ ( v ) => set( 'description', v ) }
						/>
					</FlexItem>
					<FlexItem>
						<BaseControl
							id="clouansp-story-map"
							label={ __( 'Map', 'clouds-and-spaceships' ) }
							help={ __(
								'The story canvas overlays this map. Its objects, areas and labels stay read-only here, and keep their infoboxes on the frontend.',
								'clouds-and-spaceships'
							) }
						>
							<MapPicker
								mapId={ settings.mapId }
								mapTitle={ settings.mapTitle }
								onChange={ onMapChange }
							/>
						</BaseControl>
					</FlexItem>
					{ settings.mapId && (
						<FlexItem>
							<BaseControl
								id="clouansp-story-layers"
								label={ __(
									'Map layers',
									'clouds-and-spaceships'
								) }
								help={ __(
									'Default display toggle settings for map elements on story for the reader.',
									'clouds-and-spaceships'
								) }
							>
								<Flex direction={ 'column' } gap={ 2 }>
									<CheckboxControl
										label={ __(
											'Show areas',
											'clouds-and-spaceships'
										) }
										checked={ settings.showAreas }
										onChange={ ( v ) =>
											set( 'showAreas', v )
										}
									/>
									<CheckboxControl
										label={ __(
											'Show objects',
											'clouds-and-spaceships'
										) }
										checked={ settings.showObjects }
										onChange={ ( v ) =>
											set( 'showObjects', v )
										}
									/>
									<CheckboxControl
										label={ __(
											'Show labels',
											'clouds-and-spaceships'
										) }
										checked={ settings.showLabels }
										onChange={ ( v ) =>
											set( 'showLabels', v )
										}
									/>
								</Flex>
							</BaseControl>
						</FlexItem>
					) }

					<FlexItem>
						<BaseControl
							id="clouansp-story-frontend"
							label={ __(
								'Reader Settings',
								'clouds-and-spaceships'
							) }
							help={ __(
								'Story settings for public reader. Off by default.',
								'clouds-and-spaceships'
							) }
						>
							<Flex>
								<CheckboxControl
									label={ __(
										'Disable Area/Object/Label click',
										'clouds-and-spaceships'
									) }
									help={ __(
										'Disable linked map elements opening the infobox on click. Clicking story nodes will still open the story modal.',
										'clouds-and-spaceships'
									) }
									checked={ settings.disableMapClick }
									onChange={ ( v ) =>
										set( 'disableMapClick', v )
									}
								/>
								<CheckboxControl
									label={ __(
										'Hide the sub-story sidewindow',
										'clouds-and-spaceships'
									) }
									help={ __(
										'Removes the list of substories to the side of the map.Clicking story nodes will still open the story modal.',
										'clouds-and-spaceships'
									) }
									checked={ settings.hideWindow }
									onChange={ ( v ) => set( 'hideWindow', v ) }
								/>
							</Flex>
						</BaseControl>
					</FlexItem>
				</Flex>

				<div className="clouansp-grid__group clouansp-grid__span-1">
					<BaseControl
						id="clouansp-story-thumbnail"
						label={ __( 'Thumbnail', 'clouds-and-spaceships' ) }
						help={ __(
							'Used as the story’s featured image.',
							'clouds-and-spaceships'
						) }
					>
						{ settings.thumbnailUrl && (
							<div style={ { marginBottom: 8 } }>
								<img
									src={ settings.thumbnailUrl }
									alt=""
									style={ {
										maxWidth: 240,
										maxHeight: 160,
										display: 'block',
										borderRadius: 4,
										border: '1px solid #ddd',
									} }
								/>
							</div>
						) }
						<Flex gap={ 1 } align="center" justify="start">
							<MediaSelectButton
								title={ __(
									'Select Story Thumbnail',
									'clouds-and-spaceships'
								) }
								value={ settings.thumbnailId }
								allowedTypes={ [ 'image' ] }
								icon={ imageIcon }
								onSelect={ ( att ) =>
									onChange( {
										...settings,
										thumbnailId: att.id,
										thumbnailUrl: att.url,
									} )
								}
							>
								{ settings.thumbnailId
									? __(
											'Change thumbnail',
											'clouds-and-spaceships'
									  )
									: __(
											'Set thumbnail',
											'clouds-and-spaceships'
									  ) }
							</MediaSelectButton>
							{ settings.thumbnailId && (
								<Button
									variant="secondary"
									isDestructive
									icon={ trash }
									label={ __(
										'Remove thumbnail',
										'clouds-and-spaceships'
									) }
									onClick={ () =>
										onChange( {
											...settings,
											thumbnailId: null,
											thumbnailUrl: '',
										} )
									}
								/>
							) }
						</Flex>
					</BaseControl>
				</div>
				<div className="clouansp-grid__group clouansp-grid__span-2">
					<BaseControl
						id="clouansp-story-marker"
						label={ __(
							'Active node marker',
							'clouds-and-spaceships'
						) }
						help={ __(
							'Global defaults. Can be overridden on per-path and per-node level.',
							'clouds-and-spaceships'
						) }
					>
						<MarkerControls
							markerType={ settings.markerType }
							markerColor={ settings.markerColor }
							markerSize={ settings.markerSize }
							markerIconId={ settings.markerIconId }
							markerIconUrl={ settings.markerIconUrl }
							markerIconOffsetX={ settings.markerIconOffsetX }
							markerIconOffsetY={ settings.markerIconOffsetY }
							onChange={ ( updates ) =>
								onChange( { ...settings, ...updates } )
							}
						/>
					</BaseControl>
				</div>
			</div>
		</div>
	);
}
