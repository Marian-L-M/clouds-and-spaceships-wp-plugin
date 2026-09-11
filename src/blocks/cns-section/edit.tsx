import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import { useState } from "@wordpress/element";
import {
  useBlockProps,
  useInnerBlocksProps,
  store as blockEditorStore,
} from "@wordpress/block-editor";
import type { Block, BlockEditProps } from "@wordpress/blocks";

export type SectionAttributes = {
  /** Provided by the `anchor` block support. */
  anchor?: string;
};

type InnerBlockTemplate = [
  string,
  Record<string, unknown>?,
  InnerBlockTemplate[]?,
];

/** A fresh section starts as a three-tab layout. */
const TEMPLATE: InnerBlockTemplate[] = [
  ["cns-theme/cns-tab", { label: __("Tab 1", "cns-theme") }],
  ["cns-theme/cns-tab", { label: __("Tab 2", "cns-theme") }],
  ["cns-theme/cns-tab", { label: __("Tab 3", "cns-theme") }],
];

export default function Edit({ clientId }: BlockEditProps<SectionAttributes>) {
  const [activeTab, setActiveTab] = useState(0);

  // The block-editor store is untyped, so narrow just the selector we use.
  const innerBlocks: Block[] = useSelect(
    (select) =>
      (
        select(blockEditorStore) as unknown as {
          getBlocks: (rootClientId: string) => Block[];
        }
      ).getBlocks(clientId),
    [clientId],
  );

  const tabs = innerBlocks.filter((b) => b.name === "cns-theme/cns-tab");
  const hasTabs = tabs.length > 0;

  const blockProps = useBlockProps({ className: "cns-section" });
  const innerBlocksProps = useInnerBlocksProps(
    { className: "cns-section__content" },
    { template: TEMPLATE, templateLock: false },
  );

  return (
    <div {...blockProps}>
      {hasTabs && (
        <div className="cns-section__tabs" role="tablist">
          {tabs.map((tab, i) => (
            <button
              key={tab.clientId}
              type="button"
              role="tab"
              aria-selected={i === activeTab}
              className={`cns-section__tab-btn${
                i === activeTab ? " is-active" : ""
              }`}
              onClick={() => setActiveTab(i)}
            >
              {(tab.attributes as { label?: string }).label ||
                __("Tab", "cns-theme")}
            </button>
          ))}
        </div>
      )}

      <div {...innerBlocksProps} />
    </div>
  );
}
