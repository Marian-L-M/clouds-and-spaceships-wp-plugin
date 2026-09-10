import { __ } from "@wordpress/i18n";
import {
  useBlockProps,
  InnerBlocks,
  InspectorControls,
  PanelColorSettings,
} from "@wordpress/block-editor";
import {
  SelectControl,
  PanelBody,
  PanelRow,
  TextControl,
} from "@wordpress/components";
import "./editor.scss";

export default function Edit({ attributes, setAttributes }) {
  const { bg_color, text_color, contrast_color } = attributes;

  function updateInfoboxTitle(value) {
	setAttributes({ infobox_title: value });
  }

  const TEMPLATE = [
	["core/image", {}],
	[
	  "cns-wiki-suite/infobox-group",
	  {
		group_title: "Infobox group title",
	  },
	],
	["core/paragraph", { placeholder: "Enter a short description..." }],
  ];

  return (
	<div
	  {...useBlockProps()}
	  style={{ backgroundColor: bg_color, color: text_color }}
	>
	  <InspectorControls>
		<PanelBody title="Display Settings" initialOpen={true}>
		  <PanelRow>
			<SelectControl
			  label={__("Mobile display", 'clouds-and-spaceships')}
			  value={attributes.display_mode}
			  options={[
				{
				  label: "Collapse Groups on Mobile",
				  value: "collapse__groups-mobile",
				},
				{ label: "Always Collapse Groups", value: "collapse__groups" },
				{
				  label: "Collapse Everything on Mobile",
				  value: "collapse__all-mobile",
				},
				{
				  label: "Always Collapse Everything",
				  value: "collapse__all",
				},
				{ label: "Always Expanded", value: "expanded__all" },
			  ]}
			  onChange={(value) => setAttributes({ display_mode: value })}
			  __next40pxDefaultSize
			/>
		  </PanelRow>
		</PanelBody>
		<PanelColorSettings
		  title={__("Color Settings", 'clouds-and-spaceships')}
		  initialOpen={false}
		  colorSettings={[
			{
			  value: bg_color,
			  onChange: (value) => setAttributes({ bg_color: value }),
			  label: __("Background color", 'clouds-and-spaceships'),
			},
			{
			  value: text_color,
			  onChange: (value) => setAttributes({ text_color: value }),
			  label: __("Text color", 'clouds-and-spaceships'),
			},
			{
			  value: contrast_color,
			  onChange: (value) => setAttributes({ contrast_color: value }),
			  label: __("Contrast color", 'clouds-and-spaceships'),
			},
		  ]}
		/>
	  </InspectorControls>
	  <div className="infobox">
		<h2
		  className="infobox__title"
		  style={{ backgroundColor: contrast_color }}
		>
		  <TextControl
			placeholder="Infobox title"
			value={attributes.infobox_title}
			onChange={updateInfoboxTitle}
			style={{ fontSize: "20px", color: text_color }}
		  />
		</h2>
		<div className="infobox__content">
		  <InnerBlocks template={TEMPLATE} />
		</div>
	  </div>
	</div>
  );
}
