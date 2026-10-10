import { useBlockProps } from '@wordpress/block-editor';
import metadata from './block.json';

// Markup saved before 0.2.0, when the classes were unprefixed
// (.infobox-row__*). Keeps those rows valid in the editor; they are re-saved
// with the current markup on the next post save. The save below is a verbatim
// copy and must not change.
function renderLink( item ) {
	if ( ! item.linkUrl ) return null;
	return (
		<div>
			{ ' ' }
			<a
				href={ item.linkUrl }
				{ ...( item.linkNewTab
					? { target: '_blank', rel: 'noreferrer' }
					: {} ) }
			>
				{ item.linkText || item.linkUrl }
			</a>
		</div>
	);
}

const v1 = {
	attributes: metadata.attributes,
	supports: metadata.supports,
	save( { attributes } ) {
		const { mode, items } = attributes;

		const orderedItems = [ ...items ].sort(
			( a, b ) => ( a.order ?? 0 ) - ( b.order ?? 0 )
		);

		const renderDatalist = () => (
			<dl className="infobox-row__list">
				{ orderedItems.map( ( item ) => (
					<div key={ item.id } className="infobox-row__item">
						<dt>{ item.dt }</dt>
						<dd>
							{ item.ddText }
							{ renderLink( item ) }
						</dd>
					</div>
				) ) }
			</dl>
		);

		const renderTable = () => (
			<table className="infobox-row__table">
				<tbody>
					{ orderedItems.map( ( item ) => (
						<tr key={ item.id }>
							<th scope="row">{ item.dt }</th>
							<td>
								{ item.ddText }
								{ renderLink( item ) }
							</td>
						</tr>
					) ) }
				</tbody>
			</table>
		);

		return (
			<div { ...useBlockProps.save() }>
				{ mode === 'table' ? renderTable() : renderDatalist() }
			</div>
		);
	},
};

export default [ v1 ];
