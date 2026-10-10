import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

// display_mode is a stored attribute, so its values stay as they are; each one
// maps to a modifier class. Anything unknown falls back to the block default.
const MODE_CLASSES = {
  "collapse__groups-mobile": "clouansp-infobox--collapse-groups-mobile",
  expanded__all: "clouansp-infobox--expanded",
};

export default function save({ attributes }) {
  const {
    bg_color,
    text_color,
    contrast_color,
    infobox_title,
    display_mode,
    maxWidth,
  } = attributes;

  const isExpanded = display_mode === "expanded__all";
  const modeClass =
    MODE_CLASSES[display_mode] ?? MODE_CLASSES["collapse__groups-mobile"];

  return (
    <div
      {...useBlockProps.save({
        style: { backgroundColor: bg_color, color: text_color, maxWidth },
      })}
      data-wp-interactive="clouansp-wiki-suite/infobox"
      data-wp-context={JSON.stringify({ isActive: isExpanded })}
    >
      <div
        className={`clouansp-infobox ${modeClass}`}
        data-wp-bind--aria-expanded="context.isActive"
        data-wp-class--is-active="context.isActive"
      >
        {infobox_title && (
          <h2
            className="clouansp-infobox__title"
            style={{ backgroundColor: contrast_color, color: text_color }}
          >
            {isExpanded ? (
              infobox_title
            ) : (
              <button
                className="clouansp-infobox__toggle"
                data-wp-on--click="actions.toggle"
                data-wp-bind--aria-expanded="context.isActive"
              >
                {infobox_title}
              </button>
            )}
          </h2>
        )}
        <div className="clouansp-infobox__inner">
          <InnerBlocks.Content />
        </div>
      </div>
    </div>
  );
}
