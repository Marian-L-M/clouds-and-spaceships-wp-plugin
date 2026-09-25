import { useState } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { useBlockProps, InspectorControls } from "@wordpress/block-editor";
import { PanelBody, ComboboxControl, Placeholder } from "@wordpress/components";
import { decodeEntities } from "@wordpress/html-entities";
import { __ } from "@wordpress/i18n";
import { store as coreStore } from "@wordpress/core-data";

const STATUS_LABELS = {
	draft: __("Draft", 'clouds-and-spaceships'),
	private: __("Private", 'clouds-and-spaceships'),
};

function mapLabel(record) {
	const title =
		decodeEntities(record.title?.rendered || "") ||
		__("(no title)", 'clouds-and-spaceships');
	const status = STATUS_LABELS[record.status];
	return status ? `${title} — ${status}` : title;
}

export default function Edit({ attributes, setAttributes }) {
	const { mapId } = attributes;
	const blockProps = useBlockProps({ className: "cns-map-block-editor" });
	const [search, setSearch] = useState("");

	const { map, searchResults, isSearching } = useSelect(
		(select) => {
			const { getEntityRecord, getEntityRecords, isResolving } =
				select(coreStore);
			const query = {
				per_page: 20,
				status: ["publish", "draft", "private"],
				_fields: "id,title,status",
				...(search ? { search } : {}),
			};
			return {
				map: mapId ? getEntityRecord("postType", "cns_map", mapId) : null,
				searchResults: getEntityRecords("postType", "cns_map", query),
				isSearching: isResolving("getEntityRecords", [
					"postType",
					"cns_map",
					query,
				]),
			};
		},
		[mapId, search]
	);

	const options = [
		// Keep the current selection visible even when it doesn't match the search.
		...(mapId && map ? [{ value: String(mapId), label: mapLabel(map) }] : []),
		...(searchResults ?? [])
			.filter((r) => r.id !== mapId)
			.map((r) => ({ value: String(r.id), label: mapLabel(r) })),
	];

	return (
		<>
			<InspectorControls>
				<PanelBody title={__("Map Settings", 'clouds-and-spaceships')}>
					<ComboboxControl
						__next40pxDefaultSize
						__nextHasNoMarginBottom
						label={__("Map", 'clouds-and-spaceships')}
						placeholder={__("Search maps…", 'clouds-and-spaceships')}
						value={mapId ? String(mapId) : null}
						options={options}
						onFilterValueChange={setSearch}
						onChange={(value) =>
							setAttributes({ mapId: parseInt(value ?? "", 10) || 0 })
						}
						allowReset
						help={
							isSearching
								? __("Searching…", 'clouds-and-spaceships')
								: __("Type to search maps by title.", 'clouds-and-spaceships')
						}
					/>
				</PanelBody>
			</InspectorControls>

			<div {...blockProps}>
				{!mapId ? (
					<Placeholder
						icon="location-alt"
						label={__("CNS Map", 'clouds-and-spaceships')}
						instructions={__(
							"Pick a map in the block settings panel.",
							'clouds-and-spaceships'
						)}
					/>
				) : (
					<div className="cns-map-block-editor__preview">
						<span className="dashicons dashicons-location-alt" />
						<p>
							{map
								? decodeEntities(map.title?.rendered || "") ||
								  __("(no title)", 'clouds-and-spaceships')
								: __("Map #", 'clouds-and-spaceships') + mapId}
						</p>
						<small>{__("Rendered on the frontend.", 'clouds-and-spaceships')}</small>
					</div>
				)}
			</div>
		</>
	);
}
