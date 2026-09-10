import { store, getContext } from "@wordpress/interactivity";
store("cns-wiki-suite/infobox", {
  actions: {
    toggle() {
      const context = getContext();
      context.isActive = !context.isActive;
    },
  },
});
