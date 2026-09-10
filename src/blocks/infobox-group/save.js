import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

export default function save({ attributes }) {
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
      data-wp-interactive="cns-wiki-suite/infobox-group"
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
}
