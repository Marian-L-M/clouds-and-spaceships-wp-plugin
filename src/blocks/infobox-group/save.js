import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

// display_mode is a stored attribute, so its values stay as they are; each one
// maps to a modifier class on the outer element. Anything unknown falls back
// to the block default.
const MODE_CLASSES = {
  inherit: "clouansp-infobox-group__outer--inherit",
  "collapse-ibg__default": "clouansp-infobox-group__outer--collapse-default",
  "collapse-ibg__mobile": "clouansp-infobox-group__outer--collapse-mobile",
  "collapse-ibg__never": "clouansp-infobox-group__outer--collapse-never",
};

export default function save({ attributes }) {
  const { bg_color, text_color, contrast_color, group_title, display_mode } =
    attributes;

  const neverCollapse = display_mode === "collapse-ibg__never";
  const modeClass = MODE_CLASSES[display_mode] ?? MODE_CLASSES.inherit;

  return (
    <div
      {...useBlockProps.save()}
      data-wp-interactive="clouansp-wiki-suite/infobox-group"
      data-wp-context={JSON.stringify({ isActive: neverCollapse })}
      style={{ backgroundColor: bg_color, color: text_color }}
    >
      <div
        className={`clouansp-infobox-group__outer ${modeClass}`}
        data-wp-bind--aria-expanded="context.isActive"
        data-wp-class--is-active-group="context.isActive"
      >
        {group_title && (
          <h3
            className="clouansp-infobox-group__title"
            style={{ backgroundColor: contrast_color }}
          >
            {neverCollapse ? (
              group_title
            ) : (
              <button
                className="clouansp-infobox-group__toggle"
                data-wp-on--click="actions.toggle"
                data-wp-bind--aria-expanded="context.isActive"
              >
                {group_title}
              </button>
            )}
          </h3>
        )}
        <div className="clouansp-infobox-group__inner">
          <InnerBlocks.Content />
        </div>
      </div>
    </div>
  );
}
