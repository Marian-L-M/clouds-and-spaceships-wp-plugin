import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";
import metadata from "./block.json";

/**
 * v1 (pre 2026-07): two bugs in the original save output — the interactive
 * namespace was "cns-theme/infobox-group" (never matched the registered
 * "cns-wiki-suite/infobox-group" store), and the context passed a function
 * *reference* into JSON.stringify, so the serialized context was always "{}".
 * Reproduced verbatim here so existing posts keep validating; the migration to
 * the fixed markup happens automatically on next save.
 */
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
        data-wp-interactive="cns-theme/infobox-group"
        data-wp-context={JSON.stringify({ isActive: is_infobox_group_open })}
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
