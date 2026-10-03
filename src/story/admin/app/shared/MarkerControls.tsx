import {
	BaseControl,
	Button,
	RadioControl,
	RangeControl,
	__experimentalNumberControl as NumberControl,
} from '@wordpress/components';
import { image as imageIcon, trash } from '@wordpress/icons';
import { __ } from '@wordpress/i18n';
import ColorField from '../../../../shared/admin/ColorField';
import MediaSelectButton from './MediaSelectButton';
import type { MarkerType, NodeMarkerType } from '../../../types';

interface MarkerValues< T extends MarkerType | NodeMarkerType = MarkerType > {
	markerType: T;
	markerColor: string;
	markerSize: number;
	markerIconId: number | null;
	markerIconUrl: string;
	markerIconOffsetX: number;
	markerIconOffsetY: number;
}

interface Props< T extends MarkerType | NodeMarkerType >
	extends MarkerValues< T > {
	/** Adds an "inherit" choice — used by paths, which defer to the story. */
	allowInherit?: boolean;
	onChange: ( updates: Partial< MarkerValues< T > > ) => void;
}

const PRESETS = [
	{ label: 'Top', x: 0, y: -30 },
	{ label: 'Bottom', x: 0, y: 30 },
	{ label: 'Left', x: -30, y: 0 },
	{ label: 'Right', x: 30, y: 0 },
	{ label: 'Center', x: 0, y: 0 },
] as const;

export default function MarkerControls<
	T extends MarkerType | NodeMarkerType = MarkerType,
>( {
	markerType,
	markerColor,
	markerSize,
	markerIconId,
	markerIconUrl,
	markerIconOffsetX,
	markerIconOffsetY,
	allowInherit = false,
	onChange,
}: Props< T > ) {
	return (
		<div className="cns-marker-controls cns-grid cns-grid__12">
			<div className="cns-grid__group cns-grid__span-full">
				<RadioControl
					label={ __( 'Type', 'clouds-and-spaceships' ) }
					selected={ markerType }
					options={ [
						...( allowInherit
							? [
									{
										label: __(
											'Inherit from story',
											'clouds-and-spaceships'
										),
										value: 'inherit',
									},
							  ]
							: [] ),
						{
							label: __(
								'Ring outline',
								'clouds-and-spaceships'
							),
							value: 'ring',
						},
						{
							label: __( 'Icon image', 'clouds-and-spaceships' ),
							value: 'icon',
						},
					] }
					onChange={ ( v ) => onChange( { markerType: v as T } ) }
				/>
			</div>

			<div className="cns-grid__group">
				<ColorField
					label={ __( 'Color', 'clouds-and-spaceships' ) }
					value={ markerColor }
					onChange={ ( v ) => onChange( { markerColor: v } ) }
				/>
			</div>
			<div className="cns-grid__group">
				<RangeControl
					label={
						markerType === 'ring'
							? __( 'Ring size (px)', 'clouds-and-spaceships' )
							: __( 'Icon size (px)', 'clouds-and-spaceships' )
					}
					min={ 1 }
					max={ 30 }
					step={ 1 }
					withInputField
					value={ markerSize }
					onChange={ ( v ) => onChange( { markerSize: v ?? 5 } ) }
				/>
			</div>

			{ markerType === 'icon' && (
				<>
					<div className="cns-grid__group cns-grid__span-full">
						<BaseControl
							id="cns-marker-icon"
							label={ __(
								'Icon image',
								'clouds-and-spaceships'
							) }
						>
							<div className="cns-actions-row">
								{ markerIconUrl && (
									<img
										src={ markerIconUrl }
										alt=""
										style={ {
											width: 32,
											height: 32,
											objectFit: 'contain',
											border: '1px solid #ddd',
											borderRadius: 4,
										} }
									/>
								) }
								<MediaSelectButton
									title={ __(
										'Select Marker Icon',
										'clouds-and-spaceships'
									) }
									value={ markerIconId }
									allowedTypes={ [ 'image' ] }
									icon={ imageIcon }
									onSelect={ ( att ) =>
										onChange( {
											markerIconId: att.id,
											markerIconUrl: att.url,
										} )
									}
								>
									{ markerIconId
										? __(
												'Change icon',
												'clouds-and-spaceships'
										  )
										: __(
												'Select icon',
												'clouds-and-spaceships'
										  ) }
								</MediaSelectButton>
								{ markerIconId && (
									<Button
										variant="tertiary"
										isDestructive
										icon={ trash }
										label={ __(
											'Remove icon',
											'clouds-and-spaceships'
										) }
										onClick={ () =>
											onChange( {
												markerIconId: null,
												markerIconUrl: '',
											} )
										}
									/>
								) }
							</div>
						</BaseControl>
					</div>

					<div className="cns-grid__group cns-grid__span-full">
						<BaseControl
							id="cns-marker-presets"
							label={ __(
								'Position preset',
								'clouds-and-spaceships'
							) }
						>
							<div className="cns-actions-row">
								{ PRESETS.map( ( preset ) => (
									<Button
										key={ preset.label }
										variant="secondary"
										size="small"
										isPressed={
											markerIconOffsetX === preset.x &&
											markerIconOffsetY === preset.y
										}
										onClick={ () =>
											onChange( {
												markerIconOffsetX: preset.x,
												markerIconOffsetY: preset.y,
											} )
										}
									>
										{ preset.label }
									</Button>
								) ) }
							</div>
						</BaseControl>
					</div>

					<div className="cns-grid__group">
						<NumberControl
							label={ __(
								'Offset X (px)',
								'clouds-and-spaceships'
							) }
							min={ -100 }
							max={ 100 }
							step={ 1 }
							value={ markerIconOffsetX }
							onChange={ ( v ) =>
								onChange( {
									markerIconOffsetX:
										parseFloat( v ?? '' ) || 0,
								} )
							}
						/>
					</div>
					<div className="cns-grid__group">
						<NumberControl
							label={ __(
								'Offset Y (px)',
								'clouds-and-spaceships'
							) }
							min={ -100 }
							max={ 100 }
							step={ 1 }
							value={ markerIconOffsetY }
							onChange={ ( v ) =>
								onChange( {
									markerIconOffsetY:
										parseFloat( v ?? '' ) || 0,
								} )
							}
						/>
					</div>
				</>
			) }
		</div>
	);
}
