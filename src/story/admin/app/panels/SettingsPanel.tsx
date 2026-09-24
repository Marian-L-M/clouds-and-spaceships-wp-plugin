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
	settings:     StorySettings;
	onChange:     ( s: StorySettings ) => void;
	onMapChange:  ( mapId: number | null, mapTitle: string ) => void;
}

export default function SettingsPanel( { settings, onChange, onMapChange }: Props ) {
	function set< K extends keyof StorySettings >( key: K, value: StorySettings[ K ] ) {
		onChange( { ...settings, [ key ]: value } );
	}

	return (
		<div className="cns-panel cns-settings-panel">
			<h2>{ __( 'Story Settings', 'clouds-and-spaceships' ) }</h2>

			<div className="cns-grid cns-grid__24">
				<Flex className={"cns-grid__span-2"} direction={"column"} gap={4}>
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
							label={ __( 'Description', 'clouds-and-spaceships' ) }
							help={ __( 'Short summary shown in story listings.', 'clouds-and-spaceships' ) }
							rows={ 3 }
							value={ settings.description }
							onChange={ ( v ) => set( 'description', v ) }
							/>
					</FlexItem>
					<FlexItem>
						<BaseControl
							id="cns-story-map"
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
								id="cns-story-layers"
								label={ __( 'Map layers', 'clouds-and-spaceships' ) }
								help={ __(
									'Which layers of the linked map this story shows. Readers can toggle them again on the frontend; this sets where they start.',
									'clouds-and-spaceships'
								) }
							>
								<CheckboxControl
									__nextHasNoMarginBottom
									label={ __( 'Show areas', 'clouds-and-spaceships' ) }
									checked={ settings.showAreas }
									onChange={ ( v ) => set( 'showAreas', v ) }
								/>
								<CheckboxControl
									__nextHasNoMarginBottom
									label={ __( 'Show objects', 'clouds-and-spaceships' ) }
									checked={ settings.showObjects }
									onChange={ ( v ) => set( 'showObjects', v ) }
								/>
								<CheckboxControl
									__nextHasNoMarginBottom
									label={ __( 'Show labels', 'clouds-and-spaceships' ) }
									checked={ settings.showLabels }
									onChange={ ( v ) => set( 'showLabels', v ) }
								/>
							</BaseControl>
						</FlexItem>
					) }
				</Flex>
		

				<div className="cns-grid__group cns-grid__span-1">
					<BaseControl
						id="cns-story-thumbnail"
						label={ __( 'Thumbnail', 'clouds-and-spaceships' ) }
						help={ __( 'Used as the story’s featured image.', 'clouds-and-spaceships' ) }
					>
						{ settings.thumbnailUrl && (
							<div style={ { marginBottom: 8 } }>
								<img
									src={ settings.thumbnailUrl }
									alt=""
									style={ { maxWidth: 240, maxHeight: 160, display: 'block', borderRadius: 4, border: '1px solid #ddd' } }
								/>
							</div>
						) }
						<div className="cns-actions-row">
							<MediaSelectButton
								title={ __( 'Select Story Thumbnail', 'clouds-and-spaceships' ) }
								value={ settings.thumbnailId }
								allowedTypes={ [ 'image' ] }
								icon={ imageIcon }
								onSelect={ ( att ) =>
									onChange( { ...settings, thumbnailId: att.id, thumbnailUrl: att.url } )
								}
							>
								{ settings.thumbnailId
									? __( 'Change thumbnail', 'clouds-and-spaceships' )
									: __( 'Set thumbnail', 'clouds-and-spaceships' ) }
							</MediaSelectButton>
							{ settings.thumbnailId && (
								<Button
									variant="tertiary"
									isDestructive
									icon={ trash }
									label={ __( 'Remove thumbnail', 'clouds-and-spaceships' ) }
									onClick={ () => onChange( { ...settings, thumbnailId: null, thumbnailUrl: '' } ) }
								/>
							) }
						</div>
					</BaseControl>
				</div>
				<div className="cns-grid__group cns-grid__span-2">
					<BaseControl
						id="cns-story-marker"
						label={ __( 'Active node marker', 'clouds-and-spaceships' ) }
						help={ __( 'Global default. Overridden per-path and per-node.', 'clouds-and-spaceships' ) }
					>
						<MarkerControls
							markerType={ settings.markerType }
							markerColor={ settings.markerColor }
							markerSize={ settings.markerSize }
							markerIconId={ settings.markerIconId }
							markerIconUrl={ settings.markerIconUrl }
							markerIconOffsetX={ settings.markerIconOffsetX }
							markerIconOffsetY={ settings.markerIconOffsetY }
							onChange={ ( updates ) => onChange( { ...settings, ...updates } ) }
						/>
					</BaseControl>
				</div>
			</div>
		</div>
	);
}
