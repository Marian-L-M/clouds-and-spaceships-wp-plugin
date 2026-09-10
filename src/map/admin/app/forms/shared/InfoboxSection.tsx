import {
	CheckboxControl,
	RadioControl,
	TextControl,
	TextareaControl,
} from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import MediaPicker from '../../shared/MediaPicker';
import PostSearch from '../../shared/PostSearch';
import type {
	InfoboxFormFields,
	InfoboxSource,
	InfoboxData,
} from '../../../../types';

/**
 * The Infobox form section shared by the object, area, and label forms.
 * One model everywhere: an optional connected post (adds a "Read more" link
 * to the frontend drawer regardless of source) and a radio that only picks
 * where the content comes from — written manually or pulled from that post.
 */
interface Props< T extends InfoboxFormFields > {
	formData: T;
	onChange: ( formData: T ) => void;
}

export default function InfoboxSection< T extends InfoboxFormFields >( {
	formData,
	onChange,
}: Props< T > ) {
	const isManualIb = formData.infobox_source !== 'post';

	function set< K extends keyof InfoboxFormFields >(
		key: K,
		val: InfoboxFormFields[ K ]
	) {
		onChange( { ...formData, [ key ]: val } );
	}

	return (
		<section className="cns-modal-section">
			<h3>{ __( 'Infobox', 'clouds-and-spaceships' ) }</h3>
			<div className="cns-grid cns-grid__12">
				<div className="cns-grid__group cns-grid__span-full">
					<PostSearch
						selectedId={ formData.linked_post_id }
						selectedLabel={ formData.linked_post_label }
						help={ __(
							'Optional — a connected post adds a “Read more” link to the infobox.',
							'clouds-and-spaceships'
						) }
						onChange={ ( item ) =>
							onChange( {
								...formData,
								linked_post_id: item ? item.id : 0,
								linked_post_label: item ? item.title : '',
							} )
						}
					/>
				</div>
				{ formData.linked_post_id ? (
					<div className="cns-grid__group cns-grid__span-full">
						<CheckboxControl
							__nextHasNoMarginBottom
							label={ __( 'Display infobox', 'clouds-and-spaceships' ) }
							help={ __(
								'Show the connected post’s infobox blocks in the drawer — works even when the description is written manually.',
								'clouds-and-spaceships'
							) }
							checked={ formData.display_infobox }
							onChange={ ( v ) => set( 'display_infobox', v ) }
						/>
					</div>
				) : null }
				<div className="cns-grid__group cns-grid__span-full">
					<RadioControl
						label={ __( 'Content source', 'clouds-and-spaceships' ) }
						selected={ isManualIb ? 'manual' : 'post' }
						options={ [
							{
								label: __(
									'Write content manually',
									'clouds-and-spaceships'
								),
								value: 'manual',
							},
							{
								label: __(
									'Use the connected post’s content',
									'clouds-and-spaceships'
								),
								value: 'post',
							},
						] }
						onChange={ ( value ) =>
							set( 'infobox_source', value as InfoboxSource )
						}
					/>
				</div>
				{ isManualIb ? (
					<>
						<div className="cns-grid__group cns-grid__span-full">
							<TextControl
								__next40pxDefaultSize
								__nextHasNoMarginBottom
								label={ __( 'Infobox Title', 'clouds-and-spaceships' ) }
								value={ formData.infobox_title }
								onChange={ ( v ) => set( 'infobox_title', v ) }
							/>
						</div>
						<div className="cns-grid__group cns-grid__span-full">
							<TextareaControl
								__nextHasNoMarginBottom
								label={ __( 'Description', 'clouds-and-spaceships' ) }
								rows={ 4 }
								value={ formData.infobox_description }
								onChange={ ( v ) =>
									set( 'infobox_description', v )
								}
							/>
						</div>
						<div className="cns-grid__group cns-grid__span-full">
							<MediaPicker
								imageId={ formData.infobox_image_id }
								imageUrl={ formData.infobox_image_url }
								label={ __( 'Infobox Image', 'clouds-and-spaceships' ) }
								title={ __(
									'Select Infobox Image',
									'clouds-and-spaceships'
								) }
								onChange={ ( att ) =>
									onChange( {
										...formData,
										infobox_image_id: att ? att.id : 0,
										infobox_image_url: att ? att.url : '',
									} )
								}
							/>
						</div>
					</>
				) : (
					<>
						<p className="description cns-grid__span-full">
							{ __(
								'Title, excerpt and thumbnail are pulled from the connected post. Untick to hide any of them.',
								'clouds-and-spaceships'
							) }
						</p>
						<div className="cns-grid__group cns-grid__span-full">
							<CheckboxControl
								__nextHasNoMarginBottom
								label={ __( 'Show title', 'clouds-and-spaceships' ) }
								checked={ formData.show_title }
								onChange={ ( v ) => set( 'show_title', v ) }
							/>
						</div>
						<div className="cns-grid__group cns-grid__span-full">
							<CheckboxControl
								__nextHasNoMarginBottom
								label={ __( 'Show excerpt', 'clouds-and-spaceships' ) }
								checked={ formData.show_excerpt }
								onChange={ ( v ) => set( 'show_excerpt', v ) }
							/>
						</div>
						<div className="cns-grid__group cns-grid__span-full">
							<CheckboxControl
								__nextHasNoMarginBottom
								label={ __( 'Show thumbnail', 'clouds-and-spaceships' ) }
								checked={ formData.show_thumbnail }
								onChange={ ( v ) => set( 'show_thumbnail', v ) }
							/>
						</div>
					</>
				) }
			</div>
		</section>
	);
}

/** Default infobox form values for an existing item (or null for a new one). */
export function infoboxFormDefaults( item: {
	infobox_source?: InfoboxSource;
	infobox_data?: InfoboxData | null;
	linked_post_id?: number | null;
} | null ): InfoboxFormFields {
	return {
		infobox_source:      item?.infobox_source || 'manual',
		infobox_title:       item?.infobox_data?.title       || '',
		infobox_description: item?.infobox_data?.description || '',
		infobox_image_id:    item?.infobox_data?.image_id    || 0,
		infobox_image_url:   '',
		linked_post_id:      item?.linked_post_id || 0,
		linked_post_label:   item?.linked_post_id ? `Post ID: ${ item.linked_post_id }` : '',
		// Display flags default on when absent (matches the server-side default).
		display_infobox:     item?.infobox_data?.display_infobox ?? true,
		show_title:          item?.infobox_data?.show_title    ?? true,
		show_excerpt:        item?.infobox_data?.show_excerpt  ?? true,
		show_thumbnail:      item?.infobox_data?.show_thumbnail ?? true,
	};
}
