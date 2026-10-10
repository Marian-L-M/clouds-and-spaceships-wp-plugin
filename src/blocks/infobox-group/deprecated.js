import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";
import metadata from "./block.json";

// Markup saved before 0.2.0, when the classes were unprefixed
// (.infobox-group__*, .toggle-btn, the raw display_mode value). Keeps those
// groups valid in the editor; they are re-saved with the current markup on the
// next post save. The save below is a verbatim copy and must not change.
const v1 = {
  attributes: metadata.attributes,
  supports: metadata.supports,
  save({ attributes }) {
    const { bg_color, text_color, contrast_color, group_title, display_mode } =
      attributes;

    const is_infobox_group_open = () => {
      switch (display_mode) {
        case "collapse-ibg__never":
          return true;
        default:
          return false;
      }
    };
    return (
      <div
        {...useBlockProps.save()}
        data-wp-interactive="clouansp-wiki-suite/infobox-group"
        data-wp-context={JSON.stringify({ isActive: is_infobox_group_open() })}
        style={{ backgroundColor: bg_color, color: text_color }}
      >
        <div
          className={`infobox-group__outer  ${display_mode}`}
          data-wp-bind--aria-expanded="context.isActive"
          data-wp-class--is-active-group="context.isActive"
        >
          {group_title && (
            <h3
              className="infobox-group__title"
              style={{ backgroundColor: contrast_color }}
            >
              {!(display_mode == "collapse-ibg__never") ? (
                <button
                  className="toggle-btn"
                  data-wp-on--click="actions.toggle"
                  data-wp-bind--aria-expanded="context.isActive"
                  data-wp-class--toggle-is-active-group="context.isActive"
                >
                  {group_title}
                </button>
              ) : (
                group_title
              )}
            </h3>
          )}
          <div className="infobox-group__inner">
            <InnerBlocks.Content />
          </div>
        </div>
      </div>
    );
  },
};

export default [v1];
