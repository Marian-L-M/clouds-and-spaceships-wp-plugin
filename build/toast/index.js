/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/toast/toast.scss"
/*!******************************!*\
  !*** ./src/toast/toast.scss ***!
  \******************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ }

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	const __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		const cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		const module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		if (!(moduleId in __webpack_modules__)) {
/******/ 			delete __webpack_module_cache__[moduleId];
/******/ 			const e = new Error("Cannot find module '" + moduleId + "'");
/******/ 			e.code = 'MODULE_NOT_FOUND';
/******/ 			throw e;
/******/ 		}
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/make namespace object */
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = (exports) => {
/******/ 		Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/ 	
/************************************************************************/
let __webpack_exports__ = {};
// This entry needs to be wrapped in an IIFE because it needs to be isolated against other modules in the chunk.
(() => {
/*!****************************!*\
  !*** ./src/toast/index.ts ***!
  \****************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _toast_scss__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./toast.scss */ "./src/toast/toast.scss");

const CONTAINER_ID = "cns-toast-container";
const DEFAULT_DURATION = 4000;
function getContainer() {
  let el = document.getElementById(CONTAINER_ID);
  if (!el) {
    el = document.createElement("div");
    el.id = CONTAINER_ID;
    el.className = "cns-toast-container";
    el.setAttribute("aria-live", "polite");
    el.setAttribute("aria-atomic", "false");
    document.body.appendChild(el);
  }
  return el;
}

/**
 * Show a toast notification.
 *
 * @param message  The message to display.
 * @param type     Visual type.
 * @param duration Auto-dismiss delay in ms. 0 = no auto-dismiss.
 */
function show(message, type = "info", duration = DEFAULT_DURATION) {
  const container = getContainer();
  const toast = document.createElement("div");
  toast.className = `cns-toast cns-toast--${type}`;
  toast.setAttribute("role", "status");
  const text = document.createElement("span");
  text.className = "cns-toast__message";
  text.textContent = message;
  const closeBtn = document.createElement("button");
  closeBtn.type = "button";
  closeBtn.className = "cns-toast__close";
  closeBtn.setAttribute("aria-label", "Dismiss");
  closeBtn.textContent = "×";
  closeBtn.addEventListener("click", () => dismiss(toast));
  toast.appendChild(text);
  toast.appendChild(closeBtn);
  container.appendChild(toast);

  // Trigger enter animation on next frame.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => toast.classList.add("is-visible"));
  });
  if (duration > 0) {
    setTimeout(() => dismiss(toast), duration);
  }
  return toast;
}
function dismiss(toast) {
  toast.classList.remove("is-visible");
  toast.addEventListener("transitionend", () => toast.remove(), {
    once: true
  });
  // Fallback in case transitionend never fires.
  setTimeout(() => toast.remove(), 500);
}
window.cnsToast = {
  show
};
})();

/******/ })()
;
//# sourceMappingURL=index.js.map