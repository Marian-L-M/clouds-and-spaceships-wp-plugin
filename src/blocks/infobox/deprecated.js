import { useBlockProps, InnerBlocks } from '@wordpress/block-editor';
import metadata from './block.json';

/**
 * v1 (pre 2026-07): the save function passed a function *reference* into
 * JSON.stringify, so the serialized context was always "{}". Reproduced
 * verbatim here so existing posts keep validating; the migration to the
 * fixed markup happens automatically on next save.
 */
const v1 = {
	attributes: metadata.attributes,
	supports: metadata.supports,

	save( { attributes } ) {
		const {
			bg_color,
			text_color,
			contrast_color,
			infobox_title,
			display_mode,
		} = attributes;

		// Intentionally a function reference — JSON.stringify drops it,
		// producing the historical `data-wp-context="{}"` output.
		const is_infobox_open = () => {
			switch ( display_mode ) {
				case 'expanded__all':
					return true;
				default:
					return false;
			}
		};

		return (
			<div
				{ ...useBlockProps.save() }
				data-wp-interactive="cns-wiki-suite/infobox"
				data-wp-context={ JSON.stringify( {
					isActive: is_infobox_open,
				} ) }
				style={ { backgroundColor: bg_color, color: text_color } }
			>
				<div
					className={ `infobox ${ display_mode }` }
					data-wp-bind--aria-expanded="context.isActive"
					data-wp-class--is-active="context.isActive"
				>
					{ infobox_title && (
						<h2
							className="infobox__title"
							style={ {
								backgroundColor: contrast_color,
								color: text_color,
							} }
						>
							{ ! ( display_mode == 'expanded__all' ) ? (
								<button
									className="toggle-btn"
									data-wp-on--click="actions.toggle"
									data-wp-bind--aria-expanded="context.isActive"
									data-wp-class--toggle-is-active="context.isActive"
								>
									{ infobox_title }
								</button>
							) : (
								infobox_title
							) }
						</h2>
					) }
					<div className="infobox__inner">
						<InnerBlocks.Content />
					</div>
				</div>
			</div>
		);
	},
};

export default [ v1 ];
