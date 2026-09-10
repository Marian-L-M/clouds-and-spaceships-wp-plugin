import { useBlockProps, InnerBlocks } from "@wordpress/block-editor";

export default function save({ attributes }) {
  const { bg_color, text_color, contrast_color, infobox_title, display_mode } =
    attributes;

  const is_infobox_open = () => {
    switch (display_mode) {
      case "expanded__all":
        return true;
      default:
        return false;
    }
  };

  return (
    <div
      {...useBlockProps.save()}
      data-wp-interactive="cns-wiki-suite/infobox"
      data-wp-context={JSON.stringify({ isActive: is_infobox_open() })}
      style={{ backgroundColor: bg_color, color: text_color }}
    >
      <div
        className={`infobox ${display_mode}`}
        data-wp-bind--aria-expanded="context.isActive"
        data-wp-class--is-active="context.isActive"
      >
        {infobox_title && (
          <h2
            className="infobox__title"
            style={{ backgroundColor: contrast_color, color: text_color }}
          >
            {!(display_mode == "expanded__all") ? (
              <button
                className="toggle-btn"
                data-wp-on--click="actions.toggle"
                data-wp-bind--aria-expanded="context.isActive"
                data-wp-class--toggle-is-active="context.isActive"
              >
                {infobox_title}
              </button>
            ) : (
              infobox_title
            )}
          </h2>
        )}
        <div className="infobox__inner">
          <InnerBlocks.Content />
        </div>
      </div>
    </div>
  );
}
