/******/ (() => { // webpackBootstrap
/******/ 	"use strict";
/******/ 	var __webpack_modules__ = ({

/***/ "./src/map/admin/app/ContextPanel.tsx"
/*!********************************************!*\
  !*** ./src/map/admin/app/ContextPanel.tsx ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ContextPanel)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_notices__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/notices */ "@wordpress/notices");
/* harmony import */ var _wordpress_notices__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_notices__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/close.mjs");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/copy.mjs");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _forms_ObjectForm__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./forms/ObjectForm */ "./src/map/admin/app/forms/ObjectForm.tsx");
/* harmony import */ var _forms_LabelForm__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./forms/LabelForm */ "./src/map/admin/app/forms/LabelForm.tsx");
/* harmony import */ var _forms_AreaForm__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./forms/AreaForm */ "./src/map/admin/app/forms/AreaForm.tsx");
/* harmony import */ var _forms_HierarchyRegionForm__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./forms/HierarchyRegionForm */ "./src/map/admin/app/forms/HierarchyRegionForm.tsx");
/* harmony import */ var _forms_NodeList__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./forms/NodeList */ "./src/map/admin/app/forms/NodeList.tsx");
/* harmony import */ var _forms_RegionNodeList__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./forms/RegionNodeList */ "./src/map/admin/app/forms/RegionNodeList.tsx");
/* harmony import */ var _icons__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../icons */ "./src/map/admin/icons.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__);














function ContextPanel({
  activeTab,
  selectedObject,
  selectedArea,
  selectedLabel,
  selectedRegion,
  onObjectSave,
  onObjectDelete,
  onObjectClose,
  onObjectDuplicate,
  onLabelSave,
  onLabelDelete,
  onLabelClose,
  onLabelDuplicate,
  onLabelLocalUpdate,
  onAreaSave,
  onAreaDelete,
  onAreaClose,
  onAreaDuplicate,
  onAreaNodesUpdate,
  onAreaShapeTypeChange,
  onRegionSave,
  onRegionDelete,
  onRegionClose,
  onRegionNodesUpdate,
  onRegionShapeTypeChange
}) {
  const [objFormData, setObjFormData] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [areaFormData, setAreaFormData] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [labelFormData, setLabelFormData] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [regionFormData, setRegionFormData] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [icons, setIcons] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(_icons__WEBPACK_IMPORTED_MODULE_13__.iconLibraryCache || []);
  const [saving, setSaving] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const {
    createSuccessNotice,
    createErrorNotice
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_2__.useDispatch)(_wordpress_notices__WEBPACK_IMPORTED_MODULE_3__.store);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (selectedObject) {
      setObjFormData((0,_forms_ObjectForm__WEBPACK_IMPORTED_MODULE_7__.defaultObjectFormData)(selectedObject, null, null));
      if (!_icons__WEBPACK_IMPORTED_MODULE_13__.iconLibraryCache) {
        (0,_icons__WEBPACK_IMPORTED_MODULE_13__.loadIconLibraryIntoCache)().then(() => setIcons(_icons__WEBPACK_IMPORTED_MODULE_13__.iconLibraryCache || []));
      }
    }
  }, [selectedObject?.id]);

  // Canvas drags and keyboard nudges move the object on the list; the form was
  // only filled when the selection changed, so its X/Y went stale and Save
  // posted the pre-drag coordinates back — reverting the move. Mirror the live
  // position into the form instead.
  //
  // Only the coordinates are copied, unlike the label effect below which
  // rebuilds the whole form: label edits round-trip through the list via
  // onLabelLocalUpdate, so a full reset is a no-op there. Object edits do not,
  // so rebuilding here would throw away any unsaved title or style the user
  // had typed before dragging.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!selectedObject) return;
    const {
      x,
      y
    } = selectedObject;
    setObjFormData(prev => prev && (prev.x !== x || prev.y !== y) ? {
      ...prev,
      x,
      y
    } : prev);
  }, [selectedObject?.x, selectedObject?.y]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (selectedArea) {
      setAreaFormData((0,_forms_AreaForm__WEBPACK_IMPORTED_MODULE_9__.defaultAreaFormData)(selectedArea));
    }
  }, [selectedArea?.id]);

  // Geometry deps: canvas drags update x/y/offsets on the list — the form
  // must pick those up. Form-driven live edits round-trip to the same
  // values, so the reset is a no-op for them.
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (selectedLabel) {
      setLabelFormData((0,_forms_LabelForm__WEBPACK_IMPORTED_MODULE_8__.defaultLabelFormData)(selectedLabel, null, null));
    }
  }, [selectedLabel?.id, selectedLabel?.x, selectedLabel?.y, selectedLabel?.offset_x, selectedLabel?.offset_y]);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (selectedRegion) {
      setRegionFormData((0,_forms_HierarchyRegionForm__WEBPACK_IMPORTED_MODULE_10__.defaultHierarchyFormData)(selectedRegion));
    }
  }, [selectedRegion?.id]);

  // Priority when several are somehow set: object > label > region > area.
  const maybeSelection = selectedObject ? {
    kind: 'object',
    item: selectedObject
  } : selectedLabel ? {
    kind: 'label',
    item: selectedLabel
  } : selectedRegion ? {
    kind: 'region',
    item: selectedRegion
  } : selectedArea ? {
    kind: 'area',
    item: selectedArea
  } : null;
  if (!maybeSelection) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("aside", {
      className: "cns-map-editor__context",
      "aria-label": "Context panel",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Flex, {
        direction: 'column',
        align: 'center',
        justify: 'center',
        className: "cns-map-editor__context-empty",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("p", {
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Select on canvas to edit in sidebar', 'clouds-and-spaceships')
        })
      })
    });
  }

  // Non-null past the guard; a plain rebind so nested handlers below
  // see the narrowed type (TS drops early-return narrowing in closures).
  const selection = maybeSelection;
  const title = selection.kind === 'object' ? selection.item.title || '(no title)' : selection.kind === 'label' ? selection.item.text || '(empty label)' : selection.kind === 'region' ? selection.item.child_map_title || 'New Region' : selection.item.title || '(no title)';

  // Region has no duplicate action; the others share one button.
  const onDuplicate = selection.kind === 'object' ? onObjectDuplicate : selection.kind === 'label' ? onLabelDuplicate : selection.kind === 'area' ? onAreaDuplicate : null;
  async function handleSave() {
    setSaving(true);
    try {
      switch (selection.kind) {
        case 'object':
          if (objFormData) {
            const data = await onObjectSave((0,_forms_ObjectForm__WEBPACK_IMPORTED_MODULE_7__.collectObjectPayload)(objFormData));
            if (data?.title) setObjFormData(prev => prev ? {
              ...prev,
              title: data.title
            } : prev);
          }
          break;
        case 'label':
          if (labelFormData) {
            const data = await onLabelSave((0,_forms_LabelForm__WEBPACK_IMPORTED_MODULE_8__.collectLabelPayload)(labelFormData));
            if (data) setLabelFormData((0,_forms_LabelForm__WEBPACK_IMPORTED_MODULE_8__.defaultLabelFormData)(data, null, null));
          }
          break;
        case 'region':
          if (regionFormData) {
            const data = await onRegionSave(regionFormData);
            if (data) setRegionFormData((0,_forms_HierarchyRegionForm__WEBPACK_IMPORTED_MODULE_10__.defaultHierarchyFormData)(data));
          }
          break;
        case 'area':
          if (areaFormData) await onAreaSave(areaFormData);
          break;
      }
      createSuccessNotice((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Saved.', 'clouds-and-spaceships'), {
        type: 'snackbar'
      });
    } catch (err) {
      createErrorNotice(err.message || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Save failed.', 'clouds-and-spaceships'), {
        type: 'snackbar'
      });
    } finally {
      setSaving(false);
    }
  }
  async function handleDelete() {
    switch (selection.kind) {
      case 'object':
        if (!confirm('Delete this object?')) return;
        await onObjectDelete();
        break;
      case 'label':
        if (!confirm('Delete this label?')) return;
        await onLabelDelete();
        break;
      case 'region':
        if (!confirm('Delete this hierarchy region?')) return;
        await onRegionDelete();
        break;
      case 'area':
        if (!confirm('Delete this area?')) return;
        await onAreaDelete();
        break;
    }
  }
  function handleClose() {
    switch (selection.kind) {
      case 'object':
        onObjectClose();
        break;
      case 'label':
        onLabelClose();
        break;
      case 'region':
        onRegionClose();
        break;
      case 'area':
        onAreaClose();
        break;
    }
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxs)("aside", {
    className: "cns-map-editor__context",
    "aria-label": "Context panel",
    id: "cns-context-form",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("div", {
      className: "cns-map-editor__context-header",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Flex, {
        align: "center",
        justify: "space-between",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.FlexBlock, {
          className: "cns-map-editor__context-title",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)("h3", {
            children: title
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.FlexItem, {
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Flex, {
            gap: 2,
            align: "center",
            className: "cns-map-editor__context-title-actions",
            children: [onDuplicate && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
              size: "small",
              icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_5__["default"],
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Duplicate', 'clouds-and-spaceships'),
              onClick: onDuplicate
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
              size: "small",
              icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_4__["default"],
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Close', 'clouds-and-spaceships'),
              onClick: handleClose
            })]
          })
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxs)("div", {
      className: "cns-map-editor__context-body",
      children: [selection.kind === 'object' && objFormData && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_forms_ObjectForm__WEBPACK_IMPORTED_MODULE_7__["default"], {
        formData: objFormData,
        onChange: setObjFormData,
        icons: icons
      }), selection.kind === 'label' && labelFormData && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_forms_LabelForm__WEBPACK_IMPORTED_MODULE_8__["default"], {
        formData: labelFormData,
        onChange: fd => {
          setLabelFormData(fd);
          // Live preview: mirror every form change onto
          // the in-memory label so the canvas updates
          // immediately (Save persists it).
          if (selectedLabel) {
            onLabelLocalUpdate(selectedLabel.id, {
              text: fd.text,
              placement: fd.placement,
              x: fd.x,
              y: fd.y,
              offset_x: fd.offset_x,
              offset_y: fd.offset_y,
              infobox_source: fd.infobox_source,
              linked_post_id: fd.linked_post_id,
              infobox_data: {
                title: fd.infobox_title,
                description: fd.infobox_description,
                image_id: fd.infobox_image_id
              },
              canvas_styles: {
                bgColor: fd.style_bg,
                borderColor: fd.style_border,
                textColor: fd.style_text_color,
                fontSize: fd.style_font_size
              }
            });
          }
        }
      }), selection.kind === 'area' && areaFormData && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.Fragment, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_forms_AreaForm__WEBPACK_IMPORTED_MODULE_9__["default"], {
          formData: areaFormData,
          onChange: setAreaFormData,
          onShapeTypeChange: st => {
            if (selectedArea) onAreaShapeTypeChange?.(selectedArea.id, st);
            setAreaFormData(prev => prev ? {
              ...prev,
              shape_type: st
            } : prev);
          }
        }), selectedArea && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_forms_NodeList__WEBPACK_IMPORTED_MODULE_11__["default"], {
          area: selectedArea,
          onNodesChange: nodes => onAreaNodesUpdate?.(selectedArea.id, nodes)
        })]
      }), selection.kind === 'region' && regionFormData && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.Fragment, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_forms_HierarchyRegionForm__WEBPACK_IMPORTED_MODULE_10__["default"], {
          formData: regionFormData,
          region: selectedRegion,
          onChange: setRegionFormData,
          onShapeTypeChange: st => {
            if (selectedRegion) onRegionShapeTypeChange?.(selectedRegion.id, st);
            setRegionFormData(prev => prev ? {
              ...prev,
              shape_type: st
            } : prev);
          }
        }), selectedRegion && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_forms_RegionNodeList__WEBPACK_IMPORTED_MODULE_12__["default"], {
          region: selectedRegion,
          onNodesChange: nodes => onRegionNodesUpdate(selectedRegion.id, nodes)
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Flex, {
      className: "cns-map-editor__context-footer",
      justify: "end",
      align: "center",
      gap: 2,
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
        variant: "primary",
        isBusy: saving,
        disabled: saving,
        onClick: handleSave,
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Save', 'clouds-and-spaceships')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_14__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
        variant: "secondary",
        isDestructive: true,
        onClick: handleDelete,
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Delete', 'clouds-and-spaceships')
      })]
    })]
  });
}

/***/ },

/***/ "./src/map/admin/app/IconLibraryApp.tsx"
/*!**********************************************!*\
  !*** ./src/map/admin/app/IconLibraryApp.tsx ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ IconLibraryApp)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/close-small.mjs");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/plus.mjs");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../utils */ "./src/map/admin/utils.ts");
/* harmony import */ var _icons__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../icons */ "./src/map/admin/icons.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__);







function IconLibraryApp() {
  const [icons, setIcons] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [error, setError] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('');
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    (0,_icons__WEBPACK_IMPORTED_MODULE_6__.loadIconLibraryIntoCache)().then(() => setIcons(_icons__WEBPACK_IMPORTED_MODULE_6__.iconLibraryCache || []));
  }, []);
  function handleAdd() {
    const frame = window.wp.media({
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Select or Upload SVG Icon', 'clouds-and-spaceships'),
      button: {
        text: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Add to library', 'clouds-and-spaceships')
      },
      multiple: false,
      library: {
        type: 'image/svg+xml'
      }
    });
    frame.on('select', async () => {
      const att = frame.state().get('selection').first().toJSON();
      setError('');
      try {
        const data = await (0,_utils__WEBPACK_IMPORTED_MODULE_5__.apiFetch)('POST', '/icons', {
          attachment_id: att.id
        });
        setIcons(prev => [...prev, data]);
      } catch (err) {
        setError(err.message || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Failed to add icon.', 'clouds-and-spaceships'));
      }
    });
    frame.open();
  }
  async function handleRemove(id) {
    if (!confirm((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Remove this icon from the library? (The attachment itself is kept.)', 'clouds-and-spaceships'))) return;
    setError('');
    try {
      await (0,_utils__WEBPACK_IMPORTED_MODULE_5__.apiFetch)('DELETE', `/icons/${id}`);
      setIcons(prev => prev.filter(i => i.id !== id));
    } catch (err) {
      setError(err.message || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Remove failed.', 'clouds-and-spaceships'));
    }
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
    children: [error && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Notice, {
      status: "error",
      onRemove: () => setError(''),
      children: error
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
      className: "cns-icon-library-toolbar",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
        variant: "primary",
        icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_3__["default"],
        onClick: handleAdd,
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Add Icon', 'clouds-and-spaceships')
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
      id: "cns-icon-library-grid",
      className: "cns-icon-library-grid",
      children: icons.length === 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
        className: "cns-icon-library-grid__empty",
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('No icons yet. Click “Add Icon” to upload an SVG.', 'clouds-and-spaceships')
      }) : icons.map(icon => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
        className: "cns-icon-library-item",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
          className: "cns-icon-library-item__preview",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("img", {
            src: icon.url,
            alt: icon.title
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("span", {
          className: "cns-icon-library-item__name",
          children: icon.title
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
          className: "cns-icon-library-item__remove",
          size: "small",
          icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__["default"],
          isDestructive: true,
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Remove from library', 'clouds-and-spaceships'),
          onClick: () => handleRemove(icon.id)
        })]
      }, icon.id))
    })]
  });
}

/***/ },

/***/ "./src/map/admin/app/MapEditorApp.tsx"
/*!********************************************!*\
  !*** ./src/map/admin/app/MapEditorApp.tsx ***!
  \********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MapEditorApp)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_notices__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/notices */ "@wordpress/notices");
/* harmony import */ var _wordpress_notices__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_notices__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _shared_admin_Notices__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../shared/admin/Notices */ "./src/shared/admin/Notices.tsx");
/* harmony import */ var _shared_admin_EditorHeader__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../shared/admin/EditorHeader */ "./src/shared/admin/EditorHeader.tsx");
/* harmony import */ var _TabBar__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./TabBar */ "./src/map/admin/app/TabBar.tsx");
/* harmony import */ var _ContextPanel__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./ContextPanel */ "./src/map/admin/app/ContextPanel.tsx");
/* harmony import */ var _panels_SettingsPanel__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./panels/SettingsPanel */ "./src/map/admin/app/panels/SettingsPanel.tsx");
/* harmony import */ var _panels_DescriptionPanel__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./panels/DescriptionPanel */ "./src/map/admin/app/panels/DescriptionPanel.tsx");
/* harmony import */ var _panels_ObjectsPanel__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./panels/ObjectsPanel */ "./src/map/admin/app/panels/ObjectsPanel.tsx");
/* harmony import */ var _panels_AreasPanel__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./panels/AreasPanel */ "./src/map/admin/app/panels/AreasPanel.tsx");
/* harmony import */ var _panels_LabelsPanel__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./panels/LabelsPanel */ "./src/map/admin/app/panels/LabelsPanel.tsx");
/* harmony import */ var _panels_HierarchyPanel__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./panels/HierarchyPanel */ "./src/map/admin/app/panels/HierarchyPanel.tsx");
/* harmony import */ var _panels_PreviewPanel__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./panels/PreviewPanel */ "./src/map/admin/app/panels/PreviewPanel.tsx");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ../utils */ "./src/map/admin/utils.ts");
/* harmony import */ var _areas__WEBPACK_IMPORTED_MODULE_16__ = __webpack_require__(/*! ../areas */ "./src/map/admin/areas.ts");
/* harmony import */ var _forms_LabelForm__WEBPACK_IMPORTED_MODULE_17__ = __webpack_require__(/*! ./forms/LabelForm */ "./src/map/admin/app/forms/LabelForm.tsx");
/* harmony import */ var _forms_ObjectForm__WEBPACK_IMPORTED_MODULE_18__ = __webpack_require__(/*! ./forms/ObjectForm */ "./src/map/admin/app/forms/ObjectForm.tsx");
/* harmony import */ var _forms_AreaForm__WEBPACK_IMPORTED_MODULE_19__ = __webpack_require__(/*! ./forms/AreaForm */ "./src/map/admin/app/forms/AreaForm.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__);





















function buildInitialSettings() {
  const d = window.cnsMapEditor || {};
  return {
    status: d.status ?? 'draft',
    title: d.title ?? '',
    description: d.description ?? '',
    width: d.width ?? 1000,
    aspectRatio: d.aspectRatio ?? 1.0,
    time: d.time ?? 0,
    imageId: d.imageId ?? 0,
    imageUrl: d.imageUrl ?? '',
    imageX: d.imageX ?? 0,
    imageY: d.imageY ?? 0,
    imageW: d.imageWidth ?? 1.0,
    isMaster: d.isMaster ?? false,
    bgType: d.bgType ?? 'color',
    bgColor: d.bgColor ?? '#1a1a2e',
    bgImageId: d.bgImageId ?? 0,
    bgImageUrl: d.bgImageUrl ?? '',
    thumbnailId: d.thumbnailId ? d.thumbnailId : null,
    thumbnailUrl: d.thumbnailUrl ?? ''
  };
}
function MapEditorApp() {
  const d = window.cnsMapEditor || {};
  const mapId = d.mapId || 0;
  const isNew = d.isNew || false;
  const overviewUrl = d.overviewUrl || '#';
  const wpEditUrl = d.wpEditUrl || '';
  const initialParentMaps = d.parentMaps || [];
  const [settings, setSettings] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(buildInitialSettings);
  const [viewUrl, setViewUrl] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(d.viewUrl || '');
  const [activeTab, setActiveTab] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)('settings');
  const [objectsList, setObjectsList] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [areasList, setAreasList] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [selectedObjectId, setSelectedObjectId] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [selectedAreaId, setSelectedAreaId] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [labelsList, setLabelsList] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [selectedLabelId, setSelectedLabelId] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [selectedRegionId, setSelectedRegionId] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [regionsList, setRegionsList] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const [isSaving, setIsSaving] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const {
    createSuccessNotice,
    createErrorNotice
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.useDispatch)(_wordpress_notices__WEBPACK_IMPORTED_MODULE_2__.store);
  const selectedObject = objectsList.find(o => o.id === selectedObjectId) || null;
  const selectedArea = areasList.find(a => a.id === selectedAreaId) || null;
  const selectedLabel = labelsList.find(l => l.id === selectedLabelId) || null;
  const selectedRegion = regionsList.find(r => r.id === selectedRegionId) || null;

  // Warn before leaving with unsaved map settings, or while a debounced
  // area-geometry save is still pending. Everything else persists through
  // its own endpoint as you edit.
  const savedSettingsRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(JSON.stringify(buildInitialSettings()));
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    function handleBeforeUnload(e) {
      if (JSON.stringify(settings) !== savedSettingsRef.current || areaGeomSave.current.timer !== null) {
        e.preventDefault();
        e.returnValue = '';
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [settings]);

  // ── Tab switching ─────────────────────────────────────────────────────────

  function handleTabChange(tab) {
    if (tab !== 'objects') setSelectedObjectId(null);
    if (tab !== 'labels') setSelectedLabelId(null);
    if (tab !== 'areas') setSelectedAreaId(null);
    if (tab !== 'hierarchy') setSelectedRegionId(null);
    setActiveTab(tab);
  }

  // ── Map settings save ─────────────────────────────────────────────────────

  /**
   * Persists the map settings. `override` lets a panel hand in state it holds
   * more recently than React does (the Description tab reads TinyMCE back on
   * click). Resolves true when the map is saved and the page is staying put —
   * false on failure, and after creating a map, where we are already
   * navigating to the new map's editor.
   */
  async function handleSave(override) {
    const next = override ?? settings;
    if (override) setSettings(override);
    setIsSaving(true);
    const payload = {
      map_id: mapId,
      title: next.title,
      description: next.description,
      status: next.status,
      width: next.width,
      aspect_ratio: next.aspectRatio,
      time: next.time,
      image_id: next.imageId,
      image_x: next.imageX,
      image_y: next.imageY,
      image_width: next.imageW,
      is_master: next.isMaster,
      bg_type: next.bgType,
      bg_color: next.bgColor,
      bg_image_id: next.bgImageId,
      thumbnail_id: next.thumbnailId ?? 0
    };
    try {
      const data = await (0,_utils__WEBPACK_IMPORTED_MODULE_15__.apiFetch)('POST', '/maps', payload);
      savedSettingsRef.current = JSON.stringify(next);
      if (data.created && data.edit_url) {
        window.location.href = data.edit_url;
        return false;
      }
      if (data.view_url !== undefined) {
        setViewUrl(data.view_url);
      }
      createSuccessNotice((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Map saved.', 'clouds-and-spaceships'), {
        type: 'snackbar'
      });
      return true;
    } catch (err) {
      createErrorNotice(err.message || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Save failed.', 'clouds-and-spaceships'), {
        type: 'snackbar'
      });
      return false;
    } finally {
      setIsSaving(false);
    }
  }

  /**
   * Description tab hand-off: save first so the WordPress editor opens on the
   * current content rather than silently discarding it, then leave. A failed
   * save keeps the user here with the error notice.
   */
  async function handleEditInWordPress(description) {
    if (!wpEditUrl) return;
    // handleSave marks the settings clean, so no unsaved-changes prompt fires.
    if (await handleSave({
      ...settings,
      description
    })) {
      window.location.href = wpEditUrl;
    }
  }

  // ── Object operations ─────────────────────────────────────────────────────

  async function handleObjectSave(formPayload) {
    if (!selectedObjectId) return;
    const data = await (0,_utils__WEBPACK_IMPORTED_MODULE_15__.apiFetch)('POST', `/objects/${selectedObjectId}`, formPayload);
    setObjectsList(prev => prev.map(o => o.id === selectedObjectId ? data : o));
    return data;
  }
  async function handleObjectPositionUpdate(id, x, y) {
    try {
      const data = await (0,_utils__WEBPACK_IMPORTED_MODULE_15__.apiFetch)('PATCH', `/objects/${id}/position`, {
        x,
        y
      });
      setObjectsList(prev => prev.map(o => o.id === id ? data : o));
    } catch {
      /* position patches fail silently, as before */
    }
  }

  // Live/local updates: keyboard nudges patch the in-memory object so the
  // canvas moves immediately; the position PATCH persists shortly after.
  function handleObjectLocalUpdate(id, patch) {
    setObjectsList(prev => prev.map(o => o.id === id ? {
      ...o,
      ...patch
    } : o));
  }
  async function handleObjectDuplicate(id) {
    const obj = objectsList.find(o => o.id === id);
    if (!obj) return;
    const payload = (0,_forms_ObjectForm__WEBPACK_IMPORTED_MODULE_18__.collectObjectPayload)((0,_forms_ObjectForm__WEBPACK_IMPORTED_MODULE_18__.defaultObjectFormData)(obj, null, null));
    payload.x += 24;
    payload.y += 24;
    const created = await handleObjectAdd(payload);
    setSelectedObjectId(created.id);
  }

  // ── Label operations ──────────────────────────────────────────────────────

  async function handleLabelAdd(payload) {
    const data = await (0,_utils__WEBPACK_IMPORTED_MODULE_15__.apiFetch)('POST', `/maps/${mapId}/labels`, payload);
    setLabelsList(prev => [...prev, data]);
    return data;
  }
  async function handleLabelSave(payload) {
    if (!selectedLabelId) return;
    const data = await (0,_utils__WEBPACK_IMPORTED_MODULE_15__.apiFetch)('POST', `/labels/${selectedLabelId}`, payload);
    setLabelsList(prev => prev.map(l => l.id === selectedLabelId ? data : l));
    return data;
  }
  async function handleLabelGeometryUpdate(id, geometry) {
    try {
      const data = await (0,_utils__WEBPACK_IMPORTED_MODULE_15__.apiFetch)('PATCH', `/labels/${id}/position`, geometry);
      setLabelsList(prev => prev.map(l => l.id === id ? data : l));
    } catch {
      /* position patches fail silently, as before */
    }
  }

  // Live preview: form edits update the in-memory label immediately so the
  // canvas reflects colors/text/placement before saving.
  function handleLabelLocalUpdate(id, patch) {
    setLabelsList(prev => prev.map(l => l.id === id ? {
      ...l,
      ...patch
    } : l));
  }
  async function handleLabelDuplicate(id) {
    const label = labelsList.find(l => l.id === id);
    if (!label) return;
    const payload = (0,_forms_LabelForm__WEBPACK_IMPORTED_MODULE_17__.collectLabelPayload)((0,_forms_LabelForm__WEBPACK_IMPORTED_MODULE_17__.defaultLabelFormData)(label, null, null));
    payload.x += 24;
    payload.y += 24;
    const created = await handleLabelAdd(payload);
    setSelectedLabelId(created.id);
  }
  async function handleLabelDeleteById(id) {
    await (0,_utils__WEBPACK_IMPORTED_MODULE_15__.apiFetch)('DELETE', `/labels/${id}`);
    setLabelsList(prev => prev.filter(l => l.id !== id));
    if (selectedLabelId === id) setSelectedLabelId(null);
  }

  // ── Area operations ───────────────────────────────────────────────────────

  // Canvas node edits, node-list edits, and shape-type switches update local
  // state for instant feedback and are persisted shortly after via the
  // geometry PATCH — matching how object/label moves save immediately. The
  // debounce absorbs per-keystroke node-list edits; reading the area from a
  // ref at flush time sends the latest geometry.
  const areasRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(areasList);
  areasRef.current = areasList;
  const areaGeomSave = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)({
    timer: null,
    areaId: null
  });
  async function commitAreaGeometry(areaId) {
    const area = areasRef.current.find(a => a.id === areaId);
    if (!area) return;
    try {
      await (0,_utils__WEBPACK_IMPORTED_MODULE_15__.apiFetch)('PATCH', `/areas/${areaId}/nodes`, {
        nodes: JSON.stringify(area.nodes || []),
        shape_type: area.shape_type || 'POLYGON'
      });
    } catch {
      /* geometry patches fail silently, as before */
    }
  }
  function scheduleAreaGeometrySave(areaId) {
    const pending = areaGeomSave.current;
    if (pending.timer) {
      window.clearTimeout(pending.timer);
      // Switching areas mid-debounce: flush the previous one first.
      if (pending.areaId !== null && pending.areaId !== areaId) {
        void commitAreaGeometry(pending.areaId);
      }
    }
    pending.areaId = areaId;
    pending.timer = window.setTimeout(() => {
      pending.timer = null;
      pending.areaId = null;
      void commitAreaGeometry(areaId);
    }, 600);
  }
  async function handleAreaSave(formData) {
    if (!selectedAreaId) return;
    const area = areasList.find(a => a.id === selectedAreaId);
    if (!area) return;
    const payload = {
      ...formData,
      nodes: JSON.stringify(area.nodes)
    };
    const data = await (0,_utils__WEBPACK_IMPORTED_MODULE_15__.apiFetch)('POST', `/areas/${selectedAreaId}`, payload);
    setAreasList(prev => prev.map(a => a.id === selectedAreaId ? data : a));
    return data;
  }
  function handleAreaNodesUpdate(areaId, nodes) {
    setAreasList(prev => prev.map(a => a.id === areaId ? {
      ...a,
      nodes
    } : a));
    scheduleAreaGeometrySave(areaId);
  }
  function handleAreaShapeTypeChange(areaId, shapeType) {
    setAreasList(prev => prev.map(a => {
      if (a.id !== areaId) return a;
      return {
        ...a,
        shape_type: shapeType,
        nodes: (0,_areas__WEBPACK_IMPORTED_MODULE_16__.normalizeNodesForShapeType)(a.nodes || [], shapeType)
      };
    }));
    scheduleAreaGeometrySave(areaId);
  }

  // ── Object add / delete ───────────────────────────────────────────────────

  async function handleObjectAdd(payload) {
    const data = await (0,_utils__WEBPACK_IMPORTED_MODULE_15__.apiFetch)('POST', `/maps/${mapId}/objects`, payload);
    setObjectsList(prev => [...prev, data]);
    return data;
  }
  async function handleObjectDeleteById(id) {
    await (0,_utils__WEBPACK_IMPORTED_MODULE_15__.apiFetch)('DELETE', `/objects/${id}`);
    setObjectsList(prev => prev.filter(o => o.id !== id));
    if (selectedObjectId === id) setSelectedObjectId(null);
  }
  async function handleAreaDuplicate(id) {
    const area = areasList.find(a => a.id === id);
    if (!area) return;
    const W = settings.width || 1000;
    const H = W / (settings.aspectRatio || 1);
    // Nodes are normalized 0–1; offset the copy by 24 px worth.
    const nodes = (area.nodes || []).map(n => ({
      ...n,
      x: n.x + 24 / W,
      y: n.y + 24 / H
    }));
    const payload = {
      ...(0,_forms_AreaForm__WEBPACK_IMPORTED_MODULE_19__.defaultAreaFormData)(area),
      nodes: JSON.stringify(nodes)
    };
    const data = await (0,_utils__WEBPACK_IMPORTED_MODULE_15__.apiFetch)('POST', `/maps/${mapId}/areas`, payload);
    setAreasList(prev => [...prev, data]);
    setSelectedAreaId(data.id);
  }
  async function handleAreaDeleteById(id) {
    await (0,_utils__WEBPACK_IMPORTED_MODULE_15__.apiFetch)('DELETE', `/areas/${id}`);
    setAreasList(prev => prev.filter(a => a.id !== id));
    if (selectedAreaId === id) setSelectedAreaId(null);
  }

  // ── Hierarchy region operations ───────────────────────────────────────────

  function handleRegionNodesUpdate(regionId, nodes) {
    setRegionsList(prev => prev.map(r => r.id === regionId ? {
      ...r,
      nodes
    } : r));
  }

  // Local-only, like node edits — persisted by the context panel's Save.
  function handleRegionShapeTypeChange(regionId, shapeType) {
    setRegionsList(prev => prev.map(r => {
      if (r.id !== regionId) return r;
      return {
        ...r,
        shape_type: shapeType,
        nodes: (0,_areas__WEBPACK_IMPORTED_MODULE_16__.normalizeNodesForShapeType)(r.nodes || [], shapeType)
      };
    }));
  }
  async function handleRegionSave(formData) {
    if (!selectedRegionId || !formData.child_map_id) {
      throw new Error('Select a child map before saving.');
    }
    const region = regionsList.find(r => r.id === selectedRegionId);
    if (!region) return;

    // Spread the form rather than listing fields: an omitted field falls back
    // to its REST default, so a hand-maintained list silently resets any
    // control added to the form but forgotten here. child_map_label is
    // editor-only (PostSearch's display text) and has no REST arg; shape
    // type comes from the region, which already applied the change.
    const {
      child_map_label: _label,
      ...styleFields
    } = formData;
    const payload = {
      ...styleFields,
      shape_type: region.shape_type || 'POLYGON',
      nodes: JSON.stringify(region.nodes)
    };
    const data = selectedRegionId === -1 ?
    // Unsaved draft — create.
    await (0,_utils__WEBPACK_IMPORTED_MODULE_15__.apiFetch)('POST', `/maps/${mapId}/hierarchy`, payload) : await (0,_utils__WEBPACK_IMPORTED_MODULE_15__.apiFetch)('POST', `/hierarchy/${selectedRegionId}`, payload);
    setRegionsList(prev => prev.map(r => r.id === selectedRegionId ? data : r));
    // After creating a draft, update the selected ID to the real one.
    if (selectedRegionId === -1) setSelectedRegionId(data.id);
    return data;
  }
  async function handleRegionDeleteById(id) {
    if (id === -1) {
      setRegionsList(prev => prev.filter(r => r.id !== -1));
      setSelectedRegionId(null);
      return;
    }
    await (0,_utils__WEBPACK_IMPORTED_MODULE_15__.apiFetch)('DELETE', `/hierarchy/${id}`);
    setRegionsList(prev => prev.filter(r => r.id !== id));
    if (selectedRegionId === id) setSelectedRegionId(null);
  }

  // ── Render ────────────────────────────────────────────────────────────────

  const pageTitle = isNew ? 'New Map' : `Edit: ${settings.title || '(no title)'}`;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsxs)("div", {
    className: "cns-map-editor",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)(_shared_admin_EditorHeader__WEBPACK_IMPORTED_MODULE_5__["default"], {
      pageTitle: pageTitle,
      overviewUrl: overviewUrl,
      viewUrl: !isNew && viewUrl ? viewUrl : '',
      status: settings.status,
      onStatusChange: s => setSettings(prev => ({
        ...prev,
        status: s
      })),
      isSaving: isSaving,
      onSave: handleSave,
      backLabel: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('All Maps', 'clouds-and-spaceships'),
      viewLabel: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('View Map', 'clouds-and-spaceships'),
      saveLabel: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Save Map', 'clouds-and-spaceships')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsxs)("div", {
      className: "cns-map-editor__main",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsxs)("div", {
        className: "cns-map-editor__body",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)(_TabBar__WEBPACK_IMPORTED_MODULE_6__["default"], {
          activeTab: activeTab,
          isMaster: settings.isMaster,
          onChange: handleTabChange
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsxs)("div", {
          className: "cns-map-editor__content",
          children: [activeTab === 'settings' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)(_panels_SettingsPanel__WEBPACK_IMPORTED_MODULE_8__["default"], {
            settings: settings,
            onChange: setSettings
          }), activeTab === 'description' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)(_panels_DescriptionPanel__WEBPACK_IMPORTED_MODULE_9__["default"], {
            value: settings.description,
            onChange: html => setSettings(prev => ({
              ...prev,
              description: html
            })),
            wpEditUrl: wpEditUrl,
            isSaving: isSaving,
            onEditInWordPress: handleEditInWordPress
          }), activeTab === 'objects' && !settings.isMaster && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)(_panels_ObjectsPanel__WEBPACK_IMPORTED_MODULE_10__["default"], {
            mapId: mapId,
            settings: settings,
            objects: objectsList,
            selectedObjectId: selectedObjectId,
            onObjectsLoaded: setObjectsList,
            onSelect: setSelectedObjectId,
            onDeselect: () => setSelectedObjectId(null),
            onAdd: handleObjectAdd,
            onPositionUpdate: handleObjectPositionUpdate,
            onLocalUpdate: handleObjectLocalUpdate,
            onDuplicate: handleObjectDuplicate,
            onDelete: handleObjectDeleteById
          }), activeTab === 'areas' && !settings.isMaster && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)(_panels_AreasPanel__WEBPACK_IMPORTED_MODULE_11__["default"], {
            mapId: mapId,
            settings: settings,
            areas: areasList,
            selectedAreaId: selectedAreaId,
            onAreasLoaded: setAreasList,
            onSelect: setSelectedAreaId,
            onDeselect: () => setSelectedAreaId(null),
            onNodesUpdate: handleAreaNodesUpdate,
            onDuplicate: handleAreaDuplicate,
            onDelete: handleAreaDeleteById
          }), activeTab === 'labels' && !settings.isMaster && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)(_panels_LabelsPanel__WEBPACK_IMPORTED_MODULE_12__["default"], {
            mapId: mapId,
            settings: settings,
            labels: labelsList,
            selectedLabelId: selectedLabelId,
            onLabelsLoaded: setLabelsList,
            onSelect: setSelectedLabelId,
            onDeselect: () => setSelectedLabelId(null),
            onAdd: handleLabelAdd,
            onGeometryUpdate: handleLabelGeometryUpdate,
            onLocalUpdate: handleLabelLocalUpdate,
            onDuplicate: handleLabelDuplicate,
            onDelete: handleLabelDeleteById
          }), activeTab === 'hierarchy' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)(_panels_HierarchyPanel__WEBPACK_IMPORTED_MODULE_13__["default"], {
            mapId: mapId,
            settings: settings,
            regions: regionsList,
            selectedRegionId: selectedRegionId,
            parentMaps: initialParentMaps,
            onRegionsLoaded: setRegionsList,
            onSelect: setSelectedRegionId,
            onDeselect: () => setSelectedRegionId(null),
            onNodesUpdate: handleRegionNodesUpdate,
            onDelete: handleRegionDeleteById
          }), activeTab === 'preview' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)(_panels_PreviewPanel__WEBPACK_IMPORTED_MODULE_14__["default"], {
            settings: settings,
            objects: objectsList,
            areas: areasList,
            labels: labelsList,
            viewUrl: !isNew && viewUrl ? viewUrl : ''
          }), activeTab === 'stories' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)("div", {
            id: "cns-map-stories-panel",
            "data-map-id": mapId,
            "data-overview-url": window.cnsMapEditor.storiesOverviewUrl || ''
          })]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)(_ContextPanel__WEBPACK_IMPORTED_MODULE_7__["default"], {
        activeTab: activeTab,
        selectedObject: selectedObject,
        selectedArea: selectedArea,
        selectedLabel: selectedLabel,
        selectedRegion: selectedRegion,
        onObjectSave: handleObjectSave,
        onObjectDelete: () => handleObjectDeleteById(selectedObjectId),
        onObjectClose: () => setSelectedObjectId(null),
        onObjectDuplicate: () => handleObjectDuplicate(selectedObjectId),
        onLabelSave: handleLabelSave,
        onLabelDelete: () => handleLabelDeleteById(selectedLabelId),
        onLabelClose: () => setSelectedLabelId(null),
        onLabelDuplicate: () => handleLabelDuplicate(selectedLabelId),
        onLabelLocalUpdate: handleLabelLocalUpdate,
        onAreaSave: handleAreaSave,
        onAreaDelete: () => handleAreaDeleteById(selectedAreaId),
        onAreaClose: () => setSelectedAreaId(null),
        onAreaDuplicate: () => handleAreaDuplicate(selectedAreaId),
        onAreaNodesUpdate: handleAreaNodesUpdate,
        onAreaShapeTypeChange: handleAreaShapeTypeChange,
        onRegionSave: handleRegionSave,
        onRegionShapeTypeChange: handleRegionShapeTypeChange,
        onRegionDelete: () => handleRegionDeleteById(selectedRegionId),
        onRegionClose: () => setSelectedRegionId(null),
        onRegionNodesUpdate: handleRegionNodesUpdate
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_20__.jsx)(_shared_admin_Notices__WEBPACK_IMPORTED_MODULE_4__["default"], {})]
  });
}

/***/ },

/***/ "./src/map/admin/app/TabBar.tsx"
/*!**************************************!*\
  !*** ./src/map/admin/app/TabBar.tsx ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TabBar)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _shared_admin_TabBar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../../shared/admin/TabBar */ "./src/shared/admin/TabBar.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



const TABS = [{
  id: 'settings',
  label: 'Settings',
  masterHide: false,
  masterShow: false
}, {
  id: 'description',
  label: 'Description',
  masterHide: false,
  masterShow: false
}, {
  id: 'objects',
  label: 'Objects',
  masterHide: true,
  masterShow: false
}, {
  id: 'areas',
  label: 'Areas',
  masterHide: true,
  masterShow: false
}, {
  id: 'labels',
  label: 'Labels',
  masterHide: true,
  masterShow: false
}, {
  id: 'hierarchy',
  label: 'Hierarchy',
  masterHide: false,
  masterShow: true
}, {
  id: 'preview',
  label: 'Preview',
  masterHide: true,
  masterShow: false
}, {
  id: 'stories',
  label: 'Stories',
  masterHide: true,
  masterShow: false
}];
function TabBar({
  activeTab,
  isMaster,
  onChange
}) {
  const visible = TABS.filter(t => {
    if (t.masterHide && isMaster) return false;
    if (t.masterShow && !isMaster) return false;
    return true;
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_shared_admin_TabBar__WEBPACK_IMPORTED_MODULE_1__["default"], {
    tabs: visible,
    activeTab: activeTab,
    onChange: onChange,
    ariaLabel: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Editor modes', 'clouds-and-spaceships')
  });
}

/***/ },

/***/ "./src/map/admin/app/canvases/AreasCanvas.tsx"
/*!****************************************************!*\
  !*** ./src/map/admin/app/canvases/AreasCanvas.tsx ***!
  \****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AreasCanvas)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _areas__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../areas */ "./src/map/admin/areas.ts");
/* harmony import */ var _canvas__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../canvas */ "./src/map/admin/canvas.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils */ "./src/map/admin/utils.ts");
/* harmony import */ var _CanvasZoomWrap__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./CanvasZoomWrap */ "./src/map/admin/app/canvases/CanvasZoomWrap.tsx");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);







function commitNodePosition(canvas, area, idx, x, y) {
  return (0,_areas__WEBPACK_IMPORTED_MODULE_1__.moveAreaNode)(area, idx, x / canvas.width, y / canvas.height);
}
function AreasCanvas({
  drawState,
  areas,
  selectedAreaId,
  focusedNodeIdx,
  onSelect,
  onDeselect,
  onNodesChange,
  onNodeFocusChange
}) {
  const canvasRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const [repoNodeIdx, setRepoNodeIdx] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [repoCursor, setRepoCursor] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);

  // Adding or removing a node invalidates a pickup already in flight: the
  // index would then address a different node, so deleting node 2 left the
  // old node 3 following the cursor (and a click committed it there).
  // Dropping the pickup whenever the node set changes keeps index and node
  // in agreement. Moving a node keeps the count, so commits are unaffected.
  const selectedNodeCount = (areas.find(a => a.id === selectedAreaId)?.nodes || []).length;
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    setRepoNodeIdx(null);
    setRepoCursor(null);
  }, [selectedNodeCount, selectedAreaId]);
  const stateRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)({
    areas: [],
    selectedAreaId: null,
    focusedNodeIdx: null,
    onNodesChange,
    onDeselect,
    onNodeFocusChange,
    repoNodeIdx: null,
    repoCursor: null
  });
  stateRef.current = {
    areas,
    selectedAreaId,
    focusedNodeIdx,
    onNodesChange,
    onDeselect,
    onNodeFocusChange,
    repoNodeIdx,
    repoCursor
  };

  // ── Draw ────────────────────────────────────────────────────────────────────

  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    (0,_areas__WEBPACK_IMPORTED_MODULE_1__.drawAreasOnCanvas)(canvas, drawState, areas, selectedAreaId, repoNodeIdx, repoCursor, focusedNodeIdx);
  });

  // ── JSX event handlers — always read current props/state, no stale closures ──

  function handleMouseMove(e) {
    if (repoNodeIdx === null) return;
    setRepoCursor((0,_canvas__WEBPACK_IMPORTED_MODULE_2__.getCanvasCoords)(canvasRef.current, e.nativeEvent));
  }
  function handleClick(e) {
    const canvas = canvasRef.current;
    const {
      x,
      y
    } = (0,_canvas__WEBPACK_IMPORTED_MODULE_2__.getCanvasCoords)(canvas, e.nativeEvent);
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    if (repoNodeIdx !== null) {
      const area = areas.find(a => a.id === selectedAreaId);
      if (area) {
        onNodesChange?.(selectedAreaId, commitNodePosition(canvas, area, repoNodeIdx, x, y));
      }
      setRepoNodeIdx(null);
      setRepoCursor(null);
      return;
    }
    const selArea = selectedAreaId ? areas.find(a => a.id === selectedAreaId) : null;
    if (selArea) {
      const nIdx = (0,_areas__WEBPACK_IMPORTED_MODULE_1__.findNodeAtPoint)(ctx, x, y, selArea.nodes || [], W, H);
      if (nIdx !== -1) {
        setRepoNodeIdx(nIdx);
        setRepoCursor({
          x,
          y
        });
        // Keep keyboard focus in sync so Tab continues from here.
        onNodeFocusChange?.(nIdx);
        return;
      }
    }
    const hitArea = (0,_areas__WEBPACK_IMPORTED_MODULE_1__.findAreaAtPoint)(ctx, x, y, areas, W, H);
    if (hitArea) {
      onSelect?.(hitArea.id);
      return;
    }
    if (selArea) {
      const st = selArea.shape_type || 'POLYGON';
      if (st !== 'RECTANGLE' && st !== 'CIRCLE') {
        onNodesChange?.(selectedAreaId, [...selArea.nodes, {
          x: x / W,
          y: y / H
        }]);
      }
      return;
    }
    onDeselect?.();
  }

  // ── document keydown — bind once; reads live values via stateRef ─────────────

  ;(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    function onKeyDown(e) {
      const {
        areas: areaList,
        selectedAreaId: selId,
        onNodesChange: onChange,
        onDeselect: deselect,
        repoNodeIdx: nodeIdx,
        repoCursor: cursor
      } = stateRef.current;
      if (e.key === 'Escape') {
        if (nodeIdx !== null) {
          setRepoNodeIdx(null);
          setRepoCursor(null);
        } else if (stateRef.current.focusedNodeIdx !== null) {
          stateRef.current.onNodeFocusChange?.(null);
        } else if (selId) {
          deselect?.();
        }
        return;
      }
      if (e.key !== 'Enter') return;
      // Enter already has a job in form fields and on focused
      // buttons/links — don't commit the node from there.
      if ((0,_utils__WEBPACK_IMPORTED_MODULE_3__.isTypingTarget)(e)) return;
      if (e.target?.closest?.('button, a')) return;
      if (nodeIdx !== null && cursor) {
        e.preventDefault();
        const area = areaList.find(a => a.id === selId);
        if (area && selId !== null) {
          onChange?.(selId, commitNodePosition(canvasRef.current, area, nodeIdx, cursor.x, cursor.y));
        }
      }
      setRepoNodeIdx(null);
      setRepoCursor(null);
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);
  const isRepositioning = repoNodeIdx !== null;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.Flex, {
    className: `cns-objects-canvas-wrap${isRepositioning ? ' cns-canvas--repositioning' : ''}`,
    gap: 4,
    direction: "column",
    align: "center",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_5__.FlexBlock, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_CanvasZoomWrap__WEBPACK_IMPORTED_MODULE_4__["default"], {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("canvas", {
          ref: canvasRef,
          onClick: handleClick,
          onMouseMove: handleMouseMove
        })
      })
    })
  });
}

/***/ },

/***/ "./src/map/admin/app/canvases/CanvasZoomWrap.tsx"
/*!*******************************************************!*\
  !*** ./src/map/admin/app/canvases/CanvasZoomWrap.tsx ***!
  \*******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ CanvasZoomWrap)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/close.mjs");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/fullscreen.mjs");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/plus.mjs");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/reset.mjs");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__);





/**
 * Zoom wrapper shared by all editor canvases. Zoom scales the canvas's
 * *display* size inside a scrollable viewport — the canvas backing store and
 * its pixel coordinate system are untouched, so every hit test and drag
 * keeps working: getCanvasCoords() already normalizes clicks by
 * boundingClientRect ÷ canvas.width.
 *
 * +/− buttons sit at the top right, outside the scroll area so they stay
 * put while panning. Zoom changes keep the viewport centered on the same
 * map point. The level is module-scoped so it survives tab switches.
 *
 * allowFullscreen adds a lightbox-style fullscreen toggle above the zoom
 * buttons (used by the Preview tab): the whole zoom wrap becomes a fixed
 * dark overlay, with zooming/panning still available. Esc exits.
 */
const MIN_ZOOM = 1;
const MAX_ZOOM = 4;
const ZOOM_STEP = 0.1;
let sharedZoom = 1;
function CanvasZoomWrap({
  children,
  allowFullscreen = false
}) {
  const [zoom, setZoom] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(sharedZoom);
  const [fullscreen, setFullscreen] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const scrollRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  function changeZoom(delta) {
    const next = Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, Math.round((zoom + delta) * 10) / 10));
    if (next === zoom) return;
    sharedZoom = next;
    const scroll = scrollRef.current;
    // Map point currently at the viewport center, in zoom-1 units.
    const cx = scroll ? (scroll.scrollLeft + scroll.clientWidth / 2) / zoom : 0;
    const cy = scroll ? (scroll.scrollTop + scroll.clientHeight / 2) / zoom : 0;
    setZoom(next);
    // After the re-render resized the canvas, restore that center point.
    requestAnimationFrame(() => {
      if (!scroll) return;
      scroll.scrollLeft = cx * next - scroll.clientWidth / 2;
      scroll.scrollTop = cy * next - scroll.clientHeight / 2;
    });
  }

  // Fullscreen: lock body scroll, Esc exits.
  ;(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (!fullscreen) return;
    function onKeyDown(e) {
      if (e.key === 'Escape') setFullscreen(false);
    }
    document.addEventListener('keydown', onKeyDown);
    document.body.classList.add('cns-canvas-fullscreen-open');
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.classList.remove('cns-canvas-fullscreen-open');
    };
  }, [fullscreen]);
  const rootClass = 'cns-canvas-zoom' + (zoom > 1 ? ' cns-canvas-zoom--zoomed' : '') + (fullscreen ? ' is-fullscreen' : '');
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
    className: rootClass,
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Flex, {
      className: "cns-canvas-zoom__controls",
      gap: 1,
      direction: "column",
      align: "start",
      justify: "start",
      style: {
        height: 'fit-content'
      },
      children: [allowFullscreen && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
        variant: "secondary",
        icon: fullscreen ? _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__["default"] : _wordpress_icons__WEBPACK_IMPORTED_MODULE_3__["default"],
        label: fullscreen ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Exit fullscreen', 'clouds-and-spaceships') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('View fullscreen', 'clouds-and-spaceships'),
        onClick: () => setFullscreen(f => !f)
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
        variant: "primary",
        icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_4__["default"],
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Zoom in', 'clouds-and-spaceships'),
        onClick: () => changeZoom(ZOOM_STEP),
        disabled: zoom >= MAX_ZOOM
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("span", {
        className: "cns-canvas-zoom__value",
        children: [Math.round(zoom * 100), "%"]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
        variant: "primary",
        icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_5__["default"],
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_6__.__)('Zoom out', 'clouds-and-spaceships'),
        onClick: () => changeZoom(-ZOOM_STEP),
        disabled: zoom <= MIN_ZOOM
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
      className: "cns-canvas-zoom__scroll",
      ref: scrollRef,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
        className: "cns-canvas-zoom__inner",
        style: zoom > 1 ? {
          width: `${zoom * 100}%`
        } : undefined,
        children: children
      })
    })]
  });
}

/***/ },

/***/ "./src/map/admin/app/canvases/HierarchyCanvas.tsx"
/*!********************************************************!*\
  !*** ./src/map/admin/app/canvases/HierarchyCanvas.tsx ***!
  \********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ HierarchyCanvas)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _areas__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../areas */ "./src/map/admin/areas.ts");
/* harmony import */ var _canvas__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../canvas */ "./src/map/admin/canvas.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../utils */ "./src/map/admin/utils.ts");
/* harmony import */ var _shared_map_geometry__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../shared/map-geometry */ "./src/shared/map-geometry.ts");
/* harmony import */ var _CanvasZoomWrap__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./CanvasZoomWrap */ "./src/map/admin/app/canvases/CanvasZoomWrap.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);







function minNodesFor(shapeType) {
  return shapeType === 'CIRCLE' ? 2 : 3;
}
function drawRegion(ctx, region, W, H, isSelected, repoNodeIdx, repoCursor) {
  const nodes = region.nodes || [];
  if (!nodes.length) return;
  const shapeType = region.shape_type || 'POLYGON';

  // Apply live cursor position for the node being dragged, honoring the
  // shape's constraints (rectangle corners, circle center+edge).
  const liveNodes = isSelected ? (0,_areas__WEBPACK_IMPORTED_MODULE_1__.getLiveNodes)(nodes, shapeType, repoNodeIdx, repoCursor, W, H) : nodes;
  if (liveNodes.length >= minNodesFor(shapeType)) {
    const styles = region.canvas_styles || {};
    const fill = styles.fill || '#e8a02040';
    const stroke = styles.stroke || '#e8a020';
    const strokeWidth = styles.strokeWidth || 2;
    (0,_shared_map_geometry__WEBPACK_IMPORTED_MODULE_4__.buildAreaPathFromNodes)(ctx, liveNodes, shapeType, W, H);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = isSelected ? Math.max(strokeWidth, 2) : strokeWidth;
    ctx.stroke();
    (0,_shared_map_geometry__WEBPACK_IMPORTED_MODULE_4__.drawShapeLabel)(ctx, (0,_shared_map_geometry__WEBPACK_IMPORTED_MODULE_4__.regionLabelText)(region), styles, liveNodes, shapeType, W, H);
  }
  if (!isSelected) return;

  // Node handles.
  liveNodes.forEach((node, idx) => {
    (0,_areas__WEBPACK_IMPORTED_MODULE_1__.drawNodeHandle)(ctx, node.x * W, node.y * H, repoNodeIdx === idx);
  });
}
async function drawHierarchyCanvas(canvas, drawState, regions, selectedRegionId, repoNodeIdx, repoCursor) {
  await (0,_canvas__WEBPACK_IMPORTED_MODULE_2__.drawMapCanvas)(canvas, drawState);
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  for (const region of regions) {
    const isSel = region.id === selectedRegionId;
    drawRegion(ctx, region, W, H, isSel, isSel ? repoNodeIdx : null, isSel ? repoCursor : null);
  }
}
function findRegionAtPoint(ctx, x, y, regions, W, H) {
  for (let i = regions.length - 1; i >= 0; i--) {
    const r = regions[i];
    const nodes = r.nodes || [];
    const shapeType = r.shape_type || 'POLYGON';
    if (nodes.length < minNodesFor(shapeType)) continue;
    (0,_shared_map_geometry__WEBPACK_IMPORTED_MODULE_4__.buildAreaPathFromNodes)(ctx, nodes, shapeType, W, H);
    if (ctx.isPointInPath(x, y)) return r;
  }
  return null;
}
function HierarchyCanvas({
  drawState,
  regions,
  selectedRegionId,
  onSelect,
  onDeselect,
  onNodesChange
}) {
  const canvasRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const [repoNodeIdx, setRepoNodeIdx] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);
  const [repoCursor, setRepoCursor] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(null);

  // Adding or removing a node invalidates a pickup already in flight: the
  // index would then address a different node, so deleting node 2 left the
  // old node 3 following the cursor (and a click committed it there).
  // Dropping the pickup whenever the node set changes keeps index and node
  // in agreement. Moving a node keeps the count, so commits are unaffected.
  const selectedNodeCount = (regions.find(r => r.id === selectedRegionId)?.nodes || []).length;
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    setRepoNodeIdx(null);
    setRepoCursor(null);
  }, [selectedNodeCount, selectedRegionId]);
  const stateRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)({
    regions: [],
    selectedRegionId: null,
    onNodesChange,
    repoNodeIdx: null,
    repoCursor: null
  });
  stateRef.current = {
    regions,
    selectedRegionId,
    onNodesChange,
    repoNodeIdx,
    repoCursor
  };
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    drawHierarchyCanvas(canvas, drawState, regions, selectedRegionId, repoNodeIdx, repoCursor);
  });
  function handleMouseMove(e) {
    if (repoNodeIdx === null) return;
    setRepoCursor((0,_canvas__WEBPACK_IMPORTED_MODULE_2__.getCanvasCoords)(canvasRef.current, e.nativeEvent));
  }
  function handleClick(e) {
    const canvas = canvasRef.current;
    const {
      x,
      y
    } = (0,_canvas__WEBPACK_IMPORTED_MODULE_2__.getCanvasCoords)(canvas, e.nativeEvent);
    const ctx = canvas.getContext('2d');
    const W = canvas.width;
    const H = canvas.height;
    if (repoNodeIdx !== null) {
      const region = regions.find(r => r.id === selectedRegionId);
      if (region && selectedRegionId !== null) {
        onNodesChange(selectedRegionId, (0,_areas__WEBPACK_IMPORTED_MODULE_1__.moveAreaNode)(region, repoNodeIdx, x / W, y / H));
      }
      setRepoNodeIdx(null);
      setRepoCursor(null);
      return;
    }
    const selRegion = selectedRegionId ? regions.find(r => r.id === selectedRegionId) : null;
    if (selRegion) {
      const nIdx = (0,_areas__WEBPACK_IMPORTED_MODULE_1__.findNodeAtPoint)(ctx, x, y, selRegion.nodes || [], W, H);
      if (nIdx !== -1) {
        setRepoNodeIdx(nIdx);
        setRepoCursor({
          x,
          y
        });
        return;
      }
    }
    const hitRegion = findRegionAtPoint(ctx, x, y, regions, W, H);
    if (hitRegion) {
      onSelect(hitRegion.id);
      return;
    }

    // Click empty space on selected region: add node (fixed-node shapes
    // can't grow — mirrors the areas canvas).
    if (selRegion) {
      const st = selRegion.shape_type || 'POLYGON';
      if (st !== 'RECTANGLE' && st !== 'CIRCLE') {
        onNodesChange(selectedRegionId, [...selRegion.nodes, {
          x: x / W,
          y: y / H
        }]);
      }
      return;
    }
    onDeselect();
  }
  ;(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    function onKeyDown(e) {
      const hierarchyActive = document.querySelector('[data-panel="hierarchy"].cns-tab-panel--active');
      if (!hierarchyActive) return;
      const {
        regions: regionList,
        selectedRegionId: selId,
        onNodesChange: onChange,
        repoNodeIdx: nodeIdx,
        repoCursor: cursor
      } = stateRef.current;
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (nodeIdx === null || selId === null || (0,_utils__WEBPACK_IMPORTED_MODULE_3__.isTypingTarget)(e)) return;
        const region = regionList.find(r => r.id === selId);
        if (region && (0,_areas__WEBPACK_IMPORTED_MODULE_1__.canRemoveAreaNode)(region)) {
          e.preventDefault();
          onChange(selId, (region.nodes || []).filter((_, i) => i !== nodeIdx));
        }
        setRepoNodeIdx(null);
        setRepoCursor(null);
        return;
      }
      if (e.key === 'Enter' && nodeIdx !== null && cursor) {
        const region = regionList.find(r => r.id === selId);
        if (region && selId !== null) {
          onChange(selId, (0,_areas__WEBPACK_IMPORTED_MODULE_1__.moveAreaNode)(region, nodeIdx, cursor.x / canvasRef.current.width, cursor.y / canvasRef.current.height));
        }
      }
      if (e.key === 'Escape' || e.key === 'Enter') {
        setRepoNodeIdx(null);
        setRepoCursor(null);
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);
  const isRepositioning = repoNodeIdx !== null;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
    className: `cns-objects-canvas-wrap${isRepositioning ? ' cns-canvas--repositioning' : ''}`,
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_CanvasZoomWrap__WEBPACK_IMPORTED_MODULE_5__["default"], {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("canvas", {
        ref: canvasRef,
        onClick: handleClick,
        onMouseMove: handleMouseMove
      })
    })
  });
}

/***/ },

/***/ "./src/map/admin/app/canvases/LabelsCanvas.tsx"
/*!*****************************************************!*\
  !*** ./src/map/admin/app/canvases/LabelsCanvas.tsx ***!
  \*****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LabelsCanvas)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _labels__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../labels */ "./src/map/admin/labels.ts");
/* harmony import */ var _usePickupDrag__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./usePickupDrag */ "./src/map/admin/app/canvases/usePickupDrag.ts");
/* harmony import */ var _CanvasZoomWrap__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./CanvasZoomWrap */ "./src/map/admin/app/canvases/CanvasZoomWrap.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);





/**
 * Pick-up/drop interaction comes from usePickupDrag; the drag payload names
 * the label and which part is carried:
 *
 *  - 'box'    — the text box. Centered labels move their anchor; indicator
 *               labels move only the box (offset), the dot stays put.
 *  - 'anchor' — the indicator dot; moves only the dot, the box stays put.
 *  - 'whole'  — anchor + box together (offset kept). Used by Enter-pick-up.
 */

function applyDragCursor(label, part, cursor) {
  if (label.placement !== 'indicator' || part === 'whole') {
    // Centered labels and whole-label moves: the anchor follows the
    // cursor; in indicator mode the box tags along via the offset.
    return {
      ...label,
      x: Math.round(cursor.x),
      y: Math.round(cursor.y)
    };
  }
  if (part === 'box') {
    // Box follows the cursor, dot stays: cursor becomes anchor + offset.
    return {
      ...label,
      offset_x: Math.round(cursor.x - label.x),
      offset_y: Math.round(cursor.y - label.y)
    };
  }
  // part === 'anchor': dot follows the cursor, box stays at its absolute
  // position, so the offset compensates.
  const boxX = label.x + label.offset_x;
  const boxY = label.y + label.offset_y;
  return {
    ...label,
    x: Math.round(cursor.x),
    y: Math.round(cursor.y),
    offset_x: Math.round(boxX - cursor.x),
    offset_y: Math.round(boxY - cursor.y)
  };
}
function LabelsCanvas({
  drawState,
  labels,
  selectedLabelId,
  onSelect,
  onDeselect,
  onGeometryUpdate
}) {
  const stateRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)({
    labels: [],
    selectedLabelId: null
  });
  stateRef.current = {
    labels,
    selectedLabelId
  };
  function liveLabel(id) {
    return stateRef.current.labels.find(l => l.id === id);
  }
  function redraw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const {
      labels: lbls,
      selectedLabelId: selId
    } = stateRef.current;
    const drag = dragRef.current;
    const list = drag && drag.cursor ? lbls.map(l => l.id === drag.payload.id ? applyDragCursor(l, drag.payload.part, drag.cursor) : l) : lbls;
    (0,_labels__WEBPACK_IMPORTED_MODULE_1__.drawLabelsOnCanvas)(canvas, drawState, list, selId);
  }
  const {
    canvasRef,
    dragRef
  } = (0,_usePickupDrag__WEBPACK_IMPORTED_MODULE_2__.usePickupDrag)({
    hitTest: (ctx, x, y) => {
      const hit = (0,_labels__WEBPACK_IMPORTED_MODULE_1__.findLabelPartAtPoint)(ctx, x, y, stateRef.current.labels);
      return hit ? {
        id: hit.label.id,
        part: hit.part
      } : null;
    },
    onPickup: drag => onSelect?.(drag.id),
    onDrop: (drag, cursor) => {
      const label = liveLabel(drag.id);
      if (!label || !cursor) return; // never moved: nothing to commit
      const p = applyDragCursor(label, drag.part, cursor);
      void onGeometryUpdate?.(drag.id, {
        x: p.x,
        y: p.y,
        offset_x: p.offset_x,
        offset_y: p.offset_y
      });
    },
    dragFromSelection: () => stateRef.current.selectedLabelId ? {
      id: stateRef.current.selectedLabelId,
      part: 'whole'
    } : null,
    onEmptyClick: () => onDeselect?.(),
    onEscapeIdle: () => {
      if (stateRef.current.selectedLabelId) onDeselect?.();
    },
    redraw
  });
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    redraw();
  }); // run after every render

  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
    className: "cns-objects-canvas-wrap",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_CanvasZoomWrap__WEBPACK_IMPORTED_MODULE_3__["default"], {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("canvas", {
        ref: canvasRef
      })
    })
  });
}

/***/ },

/***/ "./src/map/admin/app/canvases/ObjectsCanvas.tsx"
/*!******************************************************!*\
  !*** ./src/map/admin/app/canvases/ObjectsCanvas.tsx ***!
  \******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ObjectsCanvas)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _CanvasZoomWrap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CanvasZoomWrap */ "./src/map/admin/app/canvases/CanvasZoomWrap.tsx");
/* harmony import */ var _usePickupDrag__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./usePickupDrag */ "./src/map/admin/app/canvases/usePickupDrag.ts");
/* harmony import */ var _objects__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../objects */ "./src/map/admin/objects.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);






function ObjectsCanvas({
  drawState,
  objects,
  selectedObjectId,
  onSelect,
  onDeselect,
  onPositionUpdate,
  onPlace
}) {
  const stateRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useRef)({
    objects: [],
    selectedObjectId: null
  });
  stateRef.current = {
    objects,
    selectedObjectId
  };
  function redraw() {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const {
      objects: objs,
      selectedObjectId: selId
    } = stateRef.current;
    const drag = dragRef.current;
    (0,_objects__WEBPACK_IMPORTED_MODULE_4__.drawObjectsOnCanvas)(canvas, drawState, objs, selId, drag?.payload.id ?? null, drag?.cursor ?? null);
  }
  const {
    canvasRef,
    dragRef
  } = (0,_usePickupDrag__WEBPACK_IMPORTED_MODULE_3__.usePickupDrag)({
    hitTest: (ctx, x, y) => {
      const hit = (0,_objects__WEBPACK_IMPORTED_MODULE_4__.findObjectAtPoint)(ctx, x, y, stateRef.current.objects);
      return hit ? {
        id: hit.id
      } : null;
    },
    onPickup: drag => onSelect?.(drag.id),
    onDrop: (drag, cursor) => {
      if (cursor) {
        void onPositionUpdate?.(drag.id, Math.round(cursor.x), Math.round(cursor.y));
      }
    },
    dragFromSelection: () => stateRef.current.selectedObjectId ? {
      id: stateRef.current.selectedObjectId
    } : null,
    onEmptyClick: coords => {
      if (stateRef.current.selectedObjectId) {
        onDeselect?.();
      } else {
        onPlace?.(Math.round(coords.x), Math.round(coords.y));
      }
    },
    onEscapeIdle: () => {
      if (stateRef.current.selectedObjectId) onDeselect?.();
    },
    redraw
  });
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => {
    redraw();
  }); // run after every render

  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Flex, {
    className: 'cns-objects-canvas-wrap',
    gap: 4,
    direction: "column",
    align: "center",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.FlexBlock, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_CanvasZoomWrap__WEBPACK_IMPORTED_MODULE_2__["default"], {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("canvas", {
          ref: canvasRef
        })
      })
    })
  });
}

/***/ },

/***/ "./src/map/admin/app/canvases/PreviewCanvas.tsx"
/*!******************************************************!*\
  !*** ./src/map/admin/app/canvases/PreviewCanvas.tsx ***!
  \******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PreviewCanvas)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _canvas__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../canvas */ "./src/map/admin/canvas.ts");
/* harmony import */ var _CanvasZoomWrap__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./CanvasZoomWrap */ "./src/map/admin/app/canvases/CanvasZoomWrap.tsx");
/* harmony import */ var _objects__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../objects */ "./src/map/admin/objects.ts");
/* harmony import */ var _areas__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../areas */ "./src/map/admin/areas.ts");
/* harmony import */ var _labels__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../labels */ "./src/map/admin/labels.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);







function PreviewCanvas({
  drawState,
  objects,
  areas,
  labels
}) {
  const canvasRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    (0,_canvas__WEBPACK_IMPORTED_MODULE_1__.drawFullCanvas)(canvas, objects, areas, drawState, _areas__WEBPACK_IMPORTED_MODULE_4__.drawAreaShape, _objects__WEBPACK_IMPORTED_MODULE_3__.drawObjectMarker).then(() => {
      const ctx = canvas.getContext('2d');
      // Match the frontend: labels without text are skipped.
      for (const label of labels) {
        if (label.text) (0,_labels__WEBPACK_IMPORTED_MODULE_5__.drawLabelShape)(ctx, label);
      }
    });
  });
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
    className: "cns-canvas-wrap",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_CanvasZoomWrap__WEBPACK_IMPORTED_MODULE_2__["default"], {
      allowFullscreen: true,
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("canvas", {
        ref: canvasRef
      })
    })
  });
}

/***/ },

/***/ "./src/map/admin/app/canvases/SettingsCanvas.tsx"
/*!*******************************************************!*\
  !*** ./src/map/admin/app/canvases/SettingsCanvas.tsx ***!
  \*******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SettingsCanvas)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _canvas__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../canvas */ "./src/map/admin/canvas.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



function SettingsCanvas({
  settings
}) {
  const canvasRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    (0,_canvas__WEBPACK_IMPORTED_MODULE_1__.drawMapCanvas)(canvas, {
      width: settings.width,
      aspectRatio: settings.aspectRatio,
      bgType: settings.bgType,
      bgColor: settings.bgColor,
      bgImageUrl: settings.bgImageUrl,
      imgUrl: settings.imageUrl,
      imageX: settings.imageX,
      imageY: settings.imageY,
      imageW: settings.imageW
    });
  }, [settings.width, settings.aspectRatio, settings.bgType, settings.bgColor, settings.bgImageUrl, settings.imageUrl, settings.imageX, settings.imageY, settings.imageW]);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("div", {
    className: "cns-settings-canvas",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("canvas", {
      ref: canvasRef
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("p", {
      className: "description",
      children: "Live preview \u2014 updates as you edit settings."
    })]
  });
}

/***/ },

/***/ "./src/map/admin/app/canvases/usePickupDrag.ts"
/*!*****************************************************!*\
  !*** ./src/map/admin/app/canvases/usePickupDrag.ts ***!
  \*****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   usePickupDrag: () => (/* binding */ usePickupDrag)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _canvas__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../canvas */ "./src/map/admin/canvas.ts");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../utils */ "./src/map/admin/utils.ts");




/**
 * The shared pick-up / follow-cursor / drop interaction used by the Objects
 * and Labels canvases:
 *
 *   click a draggable thing → select it and pick it up (payload from hitTest)
 *   mousemove               → the preview follows the cursor (via redraw)
 *   click or Enter          → drop (onDrop with the final cursor position)
 *   Escape                  → cancel the drag, or fall through to onEscapeIdle
 *   Enter while idle        → pick up the current selection (dragFromSelection)
 *   hover                   → grab / grabbing cursors
 *
 * The payload D is opaque to the hook — canvases decide what a drag means
 * (an object id, a label part, …) and how the preview is rendered: redraw()
 * reads the returned dragRef. Enter is ignored in form fields and on focused
 * buttons/links, where it already has a job. Listeners bind once; config is
 * read through a ref so handlers always see the current render's props.
 */

function usePickupDrag(config) {
  const canvasRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const dragRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  const cfgRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(config);
  cfgRef.current = config;
  function startDrag(payload) {
    dragRef.current = {
      payload,
      cursor: null
    };
    if (canvasRef.current) canvasRef.current.style.cursor = 'grabbing';
    cfgRef.current.redraw();
  }
  ;(0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    function endDrag() {
      dragRef.current = null;
      canvas.style.cursor = '';
    }
    function onMouseMove(e) {
      const c = (0,_canvas__WEBPACK_IMPORTED_MODULE_1__.getCanvasCoords)(canvas, e);
      const drag = dragRef.current;
      if (!drag) {
        const ctx = canvas.getContext('2d');
        canvas.style.cursor = cfgRef.current.hitTest(ctx, c.x, c.y) ? 'grab' : '';
        return;
      }
      drag.cursor = c;
      cfgRef.current.redraw();
    }
    function onClick(e) {
      const coords = (0,_canvas__WEBPACK_IMPORTED_MODULE_1__.getCanvasCoords)(canvas, e);
      const ctx = canvas.getContext('2d');
      const drag = dragRef.current;
      if (drag) {
        const payload = drag.payload;
        endDrag();
        cfgRef.current.redraw();
        cfgRef.current.onDrop(payload, coords);
        return;
      }
      const hit = cfgRef.current.hitTest(ctx, coords.x, coords.y);
      if (hit !== null) {
        cfgRef.current.onPickup(hit);
        dragRef.current = {
          payload: hit,
          cursor: coords
        };
        canvas.style.cursor = 'grabbing';
        cfgRef.current.redraw();
        return;
      }
      cfgRef.current.onEmptyClick(coords);
    }
    function onKeyDown(e) {
      if (e.key === 'Escape') {
        if (dragRef.current) {
          endDrag();
          cfgRef.current.redraw();
        } else {
          cfgRef.current.onEscapeIdle();
        }
        return;
      }
      if (e.key !== 'Enter' || (0,_utils__WEBPACK_IMPORTED_MODULE_2__.isTypingTarget)(e)) return;
      if (e.target?.closest?.('button, a')) return;
      const drag = dragRef.current;
      if (drag) {
        e.preventDefault();
        const {
          payload,
          cursor
        } = drag;
        endDrag();
        cfgRef.current.redraw();
        cfgRef.current.onDrop(payload, cursor);
      } else {
        const payload = cfgRef.current.dragFromSelection();
        if (payload !== null) {
          e.preventDefault();
          startDrag(payload);
        }
      }
    }
    canvas.addEventListener('mousemove', onMouseMove);
    canvas.addEventListener('click', onClick);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      canvas.removeEventListener('mousemove', onMouseMove);
      canvas.removeEventListener('click', onClick);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, []); // bind once; cfgRef keeps values current

  return {
    canvasRef,
    dragRef,
    startDrag
  };
}

/***/ },

/***/ "./src/map/admin/app/forms/AreaForm.tsx"
/*!**********************************************!*\
  !*** ./src/map/admin/app/forms/AreaForm.tsx ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AreaForm),
/* harmony export */   defaultAreaFormData: () => (/* binding */ defaultAreaFormData)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _shared_admin_ColorField__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../shared/admin/ColorField */ "./src/shared/admin/ColorField.tsx");
/* harmony import */ var _shared_labelFonts__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../shared/labelFonts */ "./src/map/admin/app/shared/labelFonts.ts");
/* harmony import */ var _shared_InfoboxSection__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./shared/InfoboxSection */ "./src/map/admin/app/forms/shared/InfoboxSection.tsx");
/* harmony import */ var _choices__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../choices */ "./src/map/choices.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);







function AreaForm({
  formData,
  onChange,
  onShapeTypeChange
}) {
  function set(key, val) {
    onChange({
      ...formData,
      [key]: val
    });
  }
  function handleShapeChange(value) {
    const st = value;
    set('shape_type', st);
    onShapeTypeChange?.(st);
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("section", {
      className: "cns-modal-section",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("h3", {
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Details', 'clouds-and-spaceships')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "cns-grid cns-grid__12",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
          className: "cns-grid__group cns-grid__span-full",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.TextControl, {
            __next40pxDefaultSize: true,
            __nextHasNoMarginBottom: true,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Title', 'clouds-and-spaceships'),
            value: formData.title,
            onChange: v => set('title', v)
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
          className: "cns-grid__group",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.SelectControl, {
            __next40pxDefaultSize: true,
            __nextHasNoMarginBottom: true,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Type', 'clouds-and-spaceships'),
            value: formData.type,
            options: _choices__WEBPACK_IMPORTED_MODULE_5__.AREA_TYPES,
            onChange: v => set('type', v)
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
          className: "cns-grid__group",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.SelectControl, {
            __next40pxDefaultSize: true,
            __nextHasNoMarginBottom: true,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Shape', 'clouds-and-spaceships'),
            value: formData.shape_type,
            options: _choices__WEBPACK_IMPORTED_MODULE_5__.SHAPE_TYPES,
            onChange: handleShapeChange
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
          className: "cns-grid__group",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalNumberControl, {
            __next40pxDefaultSize: true,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Object Time', 'clouds-and-spaceships'),
            value: formData.object_time,
            step: 1,
            onChange: v => set('object_time', parseInt(v ?? '', 10) || 0)
          })
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_shared_InfoboxSection__WEBPACK_IMPORTED_MODULE_4__["default"], {
      formData: formData,
      onChange: onChange
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("section", {
      className: "cns-modal-section",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("h3", {
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Design', 'clouds-and-spaceships')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "cns-grid cns-grid__12",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
          className: "cns-grid__group",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_shared_admin_ColorField__WEBPACK_IMPORTED_MODULE_2__["default"], {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Fill Color', 'clouds-and-spaceships'),
            value: formData.style_fill,
            onChange: v => set('style_fill', v)
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
          className: "cns-grid__group",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_shared_admin_ColorField__WEBPACK_IMPORTED_MODULE_2__["default"], {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Stroke Color', 'clouds-and-spaceships'),
            value: formData.style_stroke,
            onChange: v => set('style_stroke', v)
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
          className: "cns-grid__group",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalNumberControl, {
            __next40pxDefaultSize: true,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Stroke Width (px)', 'clouds-and-spaceships'),
            min: 1,
            max: 10,
            step: 1,
            value: formData.style_stroke_width,
            onChange: v => set('style_stroke_width', parseInt(v ?? '', 10) || 2)
          })
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("h4", {
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Label', 'clouds-and-spaceships')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
        className: "description",
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('The canvas label uses the Infobox title, falling back to the area’s own title.', 'clouds-and-spaceships')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "cns-grid cns-grid__12",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
          className: "cns-grid__group cns-grid__span-full",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.ToggleControl, {
            __nextHasNoMarginBottom: true,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Hide label on canvas', 'clouds-and-spaceships'),
            checked: formData.style_label_hidden,
            onChange: v => set('style_label_hidden', v)
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
          className: "cns-grid__group",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.SelectControl, {
            __next40pxDefaultSize: true,
            __nextHasNoMarginBottom: true,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Font Family', 'clouds-and-spaceships'),
            value: formData.style_label_font_family,
            options: _shared_labelFonts__WEBPACK_IMPORTED_MODULE_3__.LABEL_FONTS,
            onChange: v => set('style_label_font_family', v)
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
          className: "cns-grid__group",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalNumberControl, {
            __next40pxDefaultSize: true,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Font Size (px)', 'clouds-and-spaceships'),
            min: 6,
            max: 96,
            step: 1,
            value: formData.style_label_font_size,
            onChange: v => set('style_label_font_size', parseInt(v ?? '', 10) || 12)
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
          className: "cns-grid__group",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_shared_admin_ColorField__WEBPACK_IMPORTED_MODULE_2__["default"], {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Font Color', 'clouds-and-spaceships'),
            value: formData.style_label_color,
            onChange: v => set('style_label_color', v)
          })
        })]
      })]
    })]
  });
}
function defaultAreaFormData(area) {
  const styles = area?.canvas_styles || {};
  return {
    title: area?.title || '',
    type: area?.type || _choices__WEBPACK_IMPORTED_MODULE_5__.AREA_TYPE_DEFAULT,
    shape_type: area?.shape_type || _choices__WEBPACK_IMPORTED_MODULE_5__.SHAPE_TYPE_DEFAULT,
    object_time: area?.object_time ?? 0,
    ...(0,_shared_InfoboxSection__WEBPACK_IMPORTED_MODULE_4__.infoboxFormDefaults)(area ?? null),
    style_fill: styles.fill || '#2271b14d',
    style_stroke: styles.stroke || '#2271b1',
    style_stroke_width: styles.strokeWidth || 2,
    style_label_hidden: styles.labelHidden ?? false,
    style_label_font_family: styles.labelFontFamily || 'sans-serif',
    style_label_font_size: styles.labelFontSize || 12,
    style_label_color: styles.labelColor || '#ffffff'
  };
}

/***/ },

/***/ "./src/map/admin/app/forms/HierarchyRegionForm.tsx"
/*!*********************************************************!*\
  !*** ./src/map/admin/app/forms/HierarchyRegionForm.tsx ***!
  \*********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ HierarchyRegionForm),
/* harmony export */   defaultHierarchyFormData: () => (/* binding */ defaultHierarchyFormData)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _shared_admin_ColorField__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../shared/admin/ColorField */ "./src/shared/admin/ColorField.tsx");
/* harmony import */ var _shared_PostSearch__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../shared/PostSearch */ "./src/map/admin/app/shared/PostSearch.tsx");
/* harmony import */ var _shared_labelFonts__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../shared/labelFonts */ "./src/map/admin/app/shared/labelFonts.ts");
/* harmony import */ var _choices__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../../choices */ "./src/map/choices.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);







/**
 * Shown at true size (240px, the width the published card uses), because the
 * point is to judge the real thing — colors, crop and clamped excerpt — not a
 * scaled impression of it. Mirrors .cns-map-hierarchy-tip in
 * src/blocks/map/style.scss; keep the two in step.
 */
function HoverCardPreview({
  formData,
  region
}) {
  // Same precedence the published card and the canvas label use.
  const title = formData.title_override || formData.child_map_label;
  const excerpt = formData.description_override || region?.child_map_excerpt || '';
  const thumb = region?.child_map_thumbnail || '';
  if (!title && !excerpt && !thumb) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
      className: "description",
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Choose a child map to preview its hover card.', 'clouds-and-spaceships')
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
    className: "cns-hovercard-preview",
    style: {
      '--cns-tip-bg': formData.style_tip_bg,
      '--cns-tip-border': formData.style_tip_border,
      '--cns-tip-text': formData.style_tip_text
    },
    children: [thumb && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("img", {
      className: "cns-hovercard-preview__thumb",
      src: thumb,
      alt: ""
    }), title && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("strong", {
      className: "cns-hovercard-preview__title",
      children: title
    }), excerpt && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
      className: "cns-hovercard-preview__excerpt",
      children: excerpt
    })]
  });
}
function HierarchyRegionForm({
  formData,
  onChange,
  onShapeTypeChange,
  region
}) {
  function set(key, val) {
    onChange({
      ...formData,
      [key]: val
    });
  }
  function handleShapeChange(value) {
    const st = value;
    set('shape_type', st);
    onShapeTypeChange?.(st);
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("section", {
      className: "cns-modal-section",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("h3", {
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Child Map', 'clouds-and-spaceships')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_shared_PostSearch__WEBPACK_IMPORTED_MODULE_3__["default"], {
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Child Map', 'clouds-and-spaceships'),
        subtype: "maps",
        selectedId: formData.child_map_id,
        selectedLabel: formData.child_map_label,
        onChange: item => onChange({
          ...formData,
          child_map_id: item ? item.id : 0,
          child_map_label: item ? item.title : ''
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.SelectControl, {
        __next40pxDefaultSize: true,
        __nextHasNoMarginBottom: true,
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Shape', 'clouds-and-spaceships'),
        value: formData.shape_type,
        options: _choices__WEBPACK_IMPORTED_MODULE_5__.SHAPE_TYPES,
        onChange: handleShapeChange
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("section", {
      className: "cns-modal-section",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("h3", {
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Infobox Override', 'clouds-and-spaceships')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
        className: "description",
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)("Leave blank to use the child map's title and excerpt.", 'clouds-and-spaceships')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "cns-grid cns-grid__12",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
          className: "cns-grid__group cns-grid__span-full",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.TextControl, {
            __next40pxDefaultSize: true,
            __nextHasNoMarginBottom: true,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Title', 'clouds-and-spaceships'),
            value: formData.title_override,
            placeholder: formData.child_map_label || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Child map title', 'clouds-and-spaceships'),
            onChange: v => set('title_override', v)
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
          className: "cns-grid__group cns-grid__span-full",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.TextareaControl, {
            __nextHasNoMarginBottom: true,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Description', 'clouds-and-spaceships'),
            rows: 3,
            value: formData.description_override,
            placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Child map excerpt', 'clouds-and-spaceships'),
            onChange: v => set('description_override', v)
          })
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("section", {
      className: "cns-modal-section",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("h3", {
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Region Style', 'clouds-and-spaceships')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "cns-grid cns-grid__12",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
          className: "cns-grid__group",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_shared_admin_ColorField__WEBPACK_IMPORTED_MODULE_2__["default"], {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Fill Color', 'clouds-and-spaceships'),
            value: formData.style_fill,
            onChange: v => set('style_fill', v)
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
          className: "cns-grid__group",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_shared_admin_ColorField__WEBPACK_IMPORTED_MODULE_2__["default"], {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Stroke Color', 'clouds-and-spaceships'),
            value: formData.style_stroke,
            onChange: v => set('style_stroke', v)
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
          className: "cns-grid__group",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalNumberControl, {
            __next40pxDefaultSize: true,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Stroke Width (px)', 'clouds-and-spaceships'),
            min: 1,
            max: 10,
            step: 1,
            value: formData.style_stroke_width,
            onChange: v => set('style_stroke_width', parseInt(v ?? '', 10) || 2)
          })
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("h4", {
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Label', 'clouds-and-spaceships')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
        className: "description",
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('The region label uses the Infobox Override title, falling back to the child map’s own title.', 'clouds-and-spaceships')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "cns-grid cns-grid__12",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
          className: "cns-grid__group cns-grid__span-full",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.ToggleControl, {
            __nextHasNoMarginBottom: true,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Hide label on canvas', 'clouds-and-spaceships'),
            checked: formData.style_label_hidden,
            onChange: v => set('style_label_hidden', v)
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
          className: "cns-grid__group",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.SelectControl, {
            __next40pxDefaultSize: true,
            __nextHasNoMarginBottom: true,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Font Family', 'clouds-and-spaceships'),
            value: formData.style_label_font_family,
            options: _shared_labelFonts__WEBPACK_IMPORTED_MODULE_4__.LABEL_FONTS,
            onChange: v => set('style_label_font_family', v)
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
          className: "cns-grid__group",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalNumberControl, {
            __next40pxDefaultSize: true,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Font Size (px)', 'clouds-and-spaceships'),
            min: 6,
            max: 96,
            step: 1,
            value: formData.style_label_font_size,
            onChange: v => set('style_label_font_size', parseInt(v ?? '', 10) || 12)
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
          className: "cns-grid__group",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_shared_admin_ColorField__WEBPACK_IMPORTED_MODULE_2__["default"], {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Font Color', 'clouds-and-spaceships'),
            value: formData.style_label_color,
            onChange: v => set('style_label_color', v)
          })
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("h4", {
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Hover Card', 'clouds-and-spaceships')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("p", {
        className: "description",
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Shown on the published map when a visitor hovers this region.', 'clouds-and-spaceships')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)("div", {
        className: "cns-grid cns-grid__12",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
          className: "cns-grid__group",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_shared_admin_ColorField__WEBPACK_IMPORTED_MODULE_2__["default"], {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Background Color', 'clouds-and-spaceships'),
            value: formData.style_tip_bg,
            onChange: v => set('style_tip_bg', v)
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
          className: "cns-grid__group",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_shared_admin_ColorField__WEBPACK_IMPORTED_MODULE_2__["default"], {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Border Color', 'clouds-and-spaceships'),
            value: formData.style_tip_border,
            onChange: v => set('style_tip_border', v)
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("div", {
          className: "cns-grid__group",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_shared_admin_ColorField__WEBPACK_IMPORTED_MODULE_2__["default"], {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Text Color', 'clouds-and-spaceships'),
            value: formData.style_tip_text,
            onChange: v => set('style_tip_text', v)
          })
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(HoverCardPreview, {
        formData: formData,
        region: region
      })]
    })]
  });
}
function defaultHierarchyFormData(region) {
  const styles = region?.canvas_styles || {};
  return {
    child_map_id: region?.child_map_id || 0,
    child_map_label: region?.child_map_title || '',
    shape_type: region?.shape_type || _choices__WEBPACK_IMPORTED_MODULE_5__.SHAPE_TYPE_DEFAULT,
    title_override: region?.title_override || '',
    description_override: region?.description_override || '',
    style_fill: styles.fill || '#e8a02040',
    style_stroke: styles.stroke || '#e8a020',
    style_stroke_width: styles.strokeWidth || 2,
    style_label_hidden: styles.labelHidden ?? false,
    style_label_font_family: styles.labelFontFamily || 'sans-serif',
    style_label_font_size: styles.labelFontSize || 12,
    style_label_color: styles.labelColor || '#ffffff',
    style_tip_bg: styles.tipBgColor || '#000000d1',
    style_tip_border: styles.tipBorderColor || '#ffffff26',
    style_tip_text: styles.tipTextColor || '#ffffff'
  };
}

/***/ },

/***/ "./src/map/admin/app/forms/LabelForm.tsx"
/*!***********************************************!*\
  !*** ./src/map/admin/app/forms/LabelForm.tsx ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   collectLabelPayload: () => (/* binding */ collectLabelPayload),
/* harmony export */   "default": () => (/* binding */ LabelForm),
/* harmony export */   defaultLabelFormData: () => (/* binding */ defaultLabelFormData)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _shared_admin_ColorField__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../../../shared/admin/ColorField */ "./src/shared/admin/ColorField.tsx");
/* harmony import */ var _shared_InfoboxSection__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./shared/InfoboxSection */ "./src/map/admin/app/forms/shared/InfoboxSection.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);





function LabelForm({
  formData,
  onChange
}) {
  function set(key, val) {
    onChange({
      ...formData,
      [key]: val
    });
  }
  const isIndicator = formData.placement === 'indicator';
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("section", {
      className: "cns-modal-section",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h3", {
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Label', 'clouds-and-spaceships')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "cns-grid cns-grid__12",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          className: "cns-grid__group cns-grid__span-full",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.TextControl, {
            __next40pxDefaultSize: true,
            __nextHasNoMarginBottom: true,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Text', 'clouds-and-spaceships'),
            value: formData.text,
            onChange: v => set('text', v)
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          className: "cns-grid__group",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalNumberControl, {
            __next40pxDefaultSize: true,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Label Time', 'clouds-and-spaceships'),
            value: formData.object_time,
            step: 1,
            onChange: v => set('object_time', parseInt(v ?? '', 10) || 0)
          })
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("section", {
      className: "cns-modal-section",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h3", {
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Placement', 'clouds-and-spaceships')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "cns-grid cns-grid__12",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          className: "cns-grid__group cns-grid__span-full",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.RadioControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Placement mode', 'clouds-and-spaceships'),
            hideLabelFromVision: true,
            selected: isIndicator ? 'indicator' : 'centered',
            options: [{
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Centered on point', 'clouds-and-spaceships'),
              value: 'centered'
            }, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Indicator (line & dot)', 'clouds-and-spaceships'),
              value: 'indicator'
            }],
            onChange: v => set('placement', v)
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          className: "cns-grid__group",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalNumberControl, {
            __next40pxDefaultSize: true,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('X (px)', 'clouds-and-spaceships'),
            value: formData.x,
            step: 1,
            onChange: v => set('x', parseInt(v ?? '', 10) || 0)
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          className: "cns-grid__group",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalNumberControl, {
            __next40pxDefaultSize: true,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Y (px)', 'clouds-and-spaceships'),
            value: formData.y,
            step: 1,
            onChange: v => set('y', parseInt(v ?? '', 10) || 0)
          })
        }), isIndicator && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
            className: "cns-grid__group",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalNumberControl, {
              __next40pxDefaultSize: true,
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Label Offset X (px)', 'clouds-and-spaceships'),
              value: formData.offset_x,
              step: 1,
              onChange: v => set('offset_x', parseInt(v ?? '', 10) || 0)
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
            className: "cns-grid__group",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalNumberControl, {
              __next40pxDefaultSize: true,
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Label Offset Y (px)', 'clouds-and-spaceships'),
              value: formData.offset_y,
              step: 1,
              onChange: v => set('offset_y', parseInt(v ?? '', 10) || 0)
            })
          })]
        })]
      }), isIndicator && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
        className: "description",
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('The dot marks the X/Y point; the label box sits at the offset, connected by a line.', 'clouds-and-spaceships')
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_shared_InfoboxSection__WEBPACK_IMPORTED_MODULE_3__["default"], {
      formData: formData,
      onChange: onChange
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
      className: "description",
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Labels with infobox content open the infobox drawer when clicked on the map; labels without stay purely decorative.', 'clouds-and-spaceships')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("section", {
      className: "cns-modal-section",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h3", {
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Design', 'clouds-and-spaceships')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
        className: "cns-grid cns-grid__12",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          className: "cns-grid__group cns-grid__span-full",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.RangeControl, {
            __next40pxDefaultSize: true,
            __nextHasNoMarginBottom: true,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Font Size (px)', 'clouds-and-spaceships'),
            min: 8,
            max: 64,
            step: 1,
            value: formData.style_font_size,
            onChange: v => set('style_font_size', v ?? 14)
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          className: "cns-grid__group",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_shared_admin_ColorField__WEBPACK_IMPORTED_MODULE_2__["default"], {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Background Color', 'clouds-and-spaceships'),
            value: formData.style_bg,
            onChange: v => set('style_bg', v)
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          className: "cns-grid__group",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_shared_admin_ColorField__WEBPACK_IMPORTED_MODULE_2__["default"], {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Border Color', 'clouds-and-spaceships'),
            value: formData.style_border,
            onChange: v => set('style_border', v)
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          className: "cns-grid__group",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_shared_admin_ColorField__WEBPACK_IMPORTED_MODULE_2__["default"], {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Text Color', 'clouds-and-spaceships'),
            value: formData.style_text_color,
            onChange: v => set('style_text_color', v)
          })
        })]
      })]
    })]
  });
}
function defaultLabelFormData(label, x, y) {
  return {
    text: label?.text || '',
    placement: label?.placement || 'centered',
    x: label ? label.x : x ?? 0,
    y: label ? label.y : y ?? 0,
    offset_x: label?.offset_x ?? 40,
    offset_y: label?.offset_y ?? -40,
    object_time: label?.object_time ?? 0,
    ...(0,_shared_InfoboxSection__WEBPACK_IMPORTED_MODULE_3__.infoboxFormDefaults)(label),
    style_bg: label?.canvas_styles?.bgColor || '#ffffff',
    style_border: label?.canvas_styles?.borderColor || '#1e1e1e',
    style_text_color: label?.canvas_styles?.textColor || '#1e1e1e',
    style_font_size: label?.canvas_styles?.fontSize || 14
  };
}
function collectLabelPayload(formData) {
  const {
    infobox_image_url,
    linked_post_label,
    ...payload
  } = formData;
  return payload;
}

/***/ },

/***/ "./src/map/admin/app/forms/NodeList.tsx"
/*!**********************************************!*\
  !*** ./src/map/admin/app/forms/NodeList.tsx ***!
  \**********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ NodeList)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/close-small.mjs");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/plus.mjs");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _areas__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../areas */ "./src/map/admin/areas.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);





const NODE_LABELS = {
  RECTANGLE: ['TL', 'TR', 'BR', 'BL'],
  CIRCLE: ['Center', 'Edge']
};
function NodeList({
  area,
  onNodesChange
}) {
  const nodes = area.nodes || [];
  const shapeType = area.shape_type || 'POLYGON';
  const isFixed = shapeType === 'RECTANGLE' || shapeType === 'CIRCLE';
  const labels = NODE_LABELS[shapeType] || null;
  function updateNode(idx, axis, rawVal) {
    const val = Math.max(0, Math.min(100, parseFloat(rawVal) || 0)) / 100;
    let updated = nodes.map(n => ({
      ...n
    }));
    if (shapeType === 'RECTANGLE') {
      const newX = axis === 'x' ? val : updated[idx].x;
      const newY = axis === 'y' ? val : updated[idx].y;
      updated = (0,_areas__WEBPACK_IMPORTED_MODULE_4__.applyRectangleConstraint)(updated, idx, newX, newY) || updated;
    } else if (shapeType === 'CIRCLE' && idx === 0) {
      const dx = (axis === 'x' ? val : updated[0].x) - updated[0].x;
      const dy = (axis === 'y' ? val : updated[0].y) - updated[0].y;
      updated[0] = {
        x: updated[0].x + dx,
        y: updated[0].y + dy
      };
      if (updated[1]) updated[1] = {
        x: updated[1].x + dx,
        y: updated[1].y + dy
      };
    } else {
      updated[idx] = {
        ...updated[idx],
        [axis]: val
      };
    }
    onNodesChange(updated);
  }
  function addNode() {
    onNodesChange([...nodes, {
      x: 0.5,
      y: 0.5
    }]);
  }
  function deleteNode(idx) {
    onNodesChange(nodes.filter((_, i) => i !== idx));
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("section", {
    className: "cns-modal-section cns-nodes-section",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("h3", {
      children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Nodes', 'clouds-and-spaceships'), !isFixed && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
        variant: "secondary",
        size: "small",
        icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__["default"],
        onClick: addNode,
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Add Node', 'clouds-and-spaceships')
      })]
    }), nodes.length === 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
      className: "description",
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('No nodes yet. Click the canvas to add nodes.', 'clouds-and-spaceships')
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("table", {
      className: "cns-nodes-table",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("thead", {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("tr", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("th", {
            children: "#"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("th", {
            children: "X\xA0%"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("th", {
            children: "Y\xA0%"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("th", {})]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("tbody", {
        children: nodes.map((node, idx) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("tr", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("td", {
            className: "cns-node-num",
            children: labels ? labels[idx] ?? idx + 1 : idx + 1
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("td", {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalNumberControl, {
              size: "small",
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('X %', 'clouds-and-spaceships'),
              hideLabelFromVision: true,
              value: (node.x * 100).toFixed(1),
              min: 0,
              max: 100,
              step: 0.1,
              onChange: v => updateNode(idx, 'x', v ?? '')
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("td", {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalNumberControl, {
              size: "small",
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Y %', 'clouds-and-spaceships'),
              hideLabelFromVision: true,
              value: (node.y * 100).toFixed(1),
              min: 0,
              max: 100,
              step: 0.1,
              onChange: v => updateNode(idx, 'y', v ?? '')
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("td", {
            children: !isFixed && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
              size: "small",
              icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__["default"],
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Remove node', 'clouds-and-spaceships'),
              onClick: () => deleteNode(idx)
            })
          })]
        }, idx))
      })]
    })]
  });
}

/***/ },

/***/ "./src/map/admin/app/forms/ObjectForm.tsx"
/*!************************************************!*\
  !*** ./src/map/admin/app/forms/ObjectForm.tsx ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   collectObjectPayload: () => (/* binding */ collectObjectPayload),
/* harmony export */   "default": () => (/* binding */ ObjectForm),
/* harmony export */   defaultObjectFormData: () => (/* binding */ defaultObjectFormData)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _shared_MediaPicker__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../shared/MediaPicker */ "./src/map/admin/app/shared/MediaPicker.tsx");
/* harmony import */ var _shared_IconPicker__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../shared/IconPicker */ "./src/map/admin/app/shared/IconPicker.tsx");
/* harmony import */ var _shared_admin_ColorField__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../../../shared/admin/ColorField */ "./src/shared/admin/ColorField.tsx");
/* harmony import */ var _shared_InfoboxSection__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./shared/InfoboxSection */ "./src/map/admin/app/forms/shared/InfoboxSection.tsx");
/* harmony import */ var _choices__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../choices */ "./src/map/choices.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__);








const ICON_OPTIONS = [{
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('From library', 'clouds-and-spaceships'),
  value: 'svg'
}, {
  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Custom image', 'clouds-and-spaceships'),
  value: 'image'
}];
function ObjectForm({
  formData,
  onChange,
  icons
}) {
  function set(key, val) {
    onChange({
      ...formData,
      [key]: val
    });
  }
  const isSvgSource = formData.icon_source !== 'image';
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.Fragment, {
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("section", {
      className: "cns-modal-section",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("h3", {
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Icon', 'clouds-and-spaceships')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
        className: "cns-grid",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
          className: "cns-grid__row",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.RadioControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Icon source', 'clouds-and-spaceships'),
            hideLabelFromVision: true,
            selected: isSvgSource ? 'svg' : 'image',
            options: ICON_OPTIONS,
            onChange: v => set('icon_source', v)
          })
        }), isSvgSource && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
          className: "cns-grid__row cns__fx-col",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_shared_IconPicker__WEBPACK_IMPORTED_MODULE_3__["default"], {
            icons: icons,
            selectedIconId: formData.icon_image_id_svg,
            onSelect: id => set('icon_image_id_svg', id)
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
            className: "description",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.ExternalLink, {
              href: window.cnsMapSuite.iconsUrl,
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Manage icon library', 'clouds-and-spaceships')
            })
          })]
        }), !isSvgSource && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
          className: "cns-grid__row",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_shared_MediaPicker__WEBPACK_IMPORTED_MODULE_2__["default"], {
            imageId: formData.icon_image_id_custom,
            imageUrl: formData.icon_image_url,
            title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Select Icon Image', 'clouds-and-spaceships'),
            onChange: att => onChange({
              ...formData,
              icon_image_id_custom: att ? att.id : 0,
              icon_image_url: att ? att.url : ''
            })
          })
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("section", {
      className: "cns-modal-section",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("h3", {
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Details', 'clouds-and-spaceships')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
        className: "cns-grid cns-grid__12",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
          className: "cns-grid__row",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.TextControl, {
            __next40pxDefaultSize: true,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Title', 'clouds-and-spaceships'),
            value: formData.title,
            onChange: v => set('title', v)
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
          className: "cns-grid__group",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.SelectControl, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Type', 'clouds-and-spaceships'),
            value: formData.type,
            options: _choices__WEBPACK_IMPORTED_MODULE_6__.OBJECT_TYPES,
            onChange: v => set('type', v)
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
          className: "cns-grid__group",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalNumberControl, {
            __next40pxDefaultSize: true,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Object Time', 'clouds-and-spaceships'),
            value: formData.object_time,
            step: 1,
            onChange: v => set('object_time', parseInt(v ?? '', 10) || 0)
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
          className: "cns-grid__group",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalNumberControl, {
            __next40pxDefaultSize: true,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('X (px)', 'clouds-and-spaceships'),
            value: formData.x,
            step: 1,
            onChange: v => set('x', parseInt(v ?? '', 10) || 0)
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
          className: "cns-grid__group",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalNumberControl, {
            __next40pxDefaultSize: true,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Y (px)', 'clouds-and-spaceships'),
            value: formData.y,
            step: 1,
            onChange: v => set('y', parseInt(v ?? '', 10) || 0)
          })
        })]
      })]
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_shared_InfoboxSection__WEBPACK_IMPORTED_MODULE_5__["default"], {
      formData: formData,
      onChange: onChange
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("section", {
      className: "cns-modal-section",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("h3", {
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Design', 'clouds-and-spaceships')
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsxs)("div", {
        className: "cns-grid cns-grid__12",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
          className: "cns-grid__group cns-grid__span-full",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.RangeControl, {
            __next40pxDefaultSize: true,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Icon Size (px)', 'clouds-and-spaceships'),
            min: 8,
            max: 128,
            step: 1,
            value: formData.style_size,
            onChange: v => set('style_size', v ?? 32)
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
          className: "cns-grid__group",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_shared_admin_ColorField__WEBPACK_IMPORTED_MODULE_4__["default"], {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Fill Color', 'clouds-and-spaceships'),
            value: formData.style_fill,
            onChange: v => set('style_fill', v)
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("div", {
          className: "cns-grid__group",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)(_shared_admin_ColorField__WEBPACK_IMPORTED_MODULE_4__["default"], {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Stroke Color', 'clouds-and-spaceships'),
            value: formData.style_stroke,
            onChange: v => set('style_stroke', v)
          })
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_7__.jsx)("p", {
        className: "description",
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Fill and stroke are applied to SVG icons only.', 'clouds-and-spaceships')
      })]
    })]
  });
}
function defaultObjectFormData(obj, x, y) {
  const isSvg = !obj || !obj.icon_image_id || obj.icon_mime === 'image/svg+xml';
  return {
    icon_source: isSvg ? 'svg' : 'image',
    icon_image_id_svg: isSvg && obj?.icon_image_id ? obj.icon_image_id : null,
    icon_image_id_custom: !isSvg && obj?.icon_image_id ? obj.icon_image_id : 0,
    icon_image_url: obj?.icon_url && !isSvg ? obj.icon_url : '',
    title: obj?.title || '',
    type: obj?.type || _choices__WEBPACK_IMPORTED_MODULE_6__.OBJECT_TYPE_DEFAULT,
    object_time: obj?.object_time ?? 0,
    x: obj ? obj.x : x ?? 0,
    y: obj ? obj.y : y ?? 0,
    ...(0,_shared_InfoboxSection__WEBPACK_IMPORTED_MODULE_5__.infoboxFormDefaults)(obj),
    style_size: obj?.canvas_styles?.size || 32,
    style_fill: obj?.canvas_styles?.fillStyle || '#ffffff',
    style_stroke: obj?.canvas_styles?.strokeStyle || '#2271b1'
  };
}
function collectObjectPayload(formData) {
  const iconImageId = formData.icon_source === 'svg' ? formData.icon_image_id_svg || 0 : formData.icon_image_id_custom || 0;
  return {
    icon_image_id: iconImageId,
    title: formData.title || '',
    type: formData.type || _choices__WEBPACK_IMPORTED_MODULE_6__.OBJECT_TYPE_DEFAULT,
    x: formData.x || 0,
    y: formData.y || 0,
    object_time: formData.object_time || 0,
    infobox_source: formData.infobox_source || 'manual',
    linked_post_id: formData.linked_post_id || 0,
    infobox_title: formData.infobox_title || '',
    infobox_description: formData.infobox_description || '',
    infobox_image_id: formData.infobox_image_id || 0,
    display_infobox: formData.display_infobox,
    show_title: formData.show_title,
    show_excerpt: formData.show_excerpt,
    show_thumbnail: formData.show_thumbnail,
    style_size: formData.style_size || 32,
    style_fill: formData.style_fill || '#ffffff',
    style_stroke: formData.style_stroke || '#2271b1'
  };
}

/***/ },

/***/ "./src/map/admin/app/forms/RegionNodeList.tsx"
/*!****************************************************!*\
  !*** ./src/map/admin/app/forms/RegionNodeList.tsx ***!
  \****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ RegionNodeList)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/close-small.mjs");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/plus.mjs");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _areas__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../areas */ "./src/map/admin/areas.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);





const NODE_LABELS = {
  RECTANGLE: ['TL', 'TR', 'BR', 'BL'],
  CIRCLE: ['Center', 'Edge']
};
function RegionNodeList({
  region,
  onNodesChange
}) {
  const nodes = region.nodes || [];
  const shapeType = region.shape_type || 'POLYGON';
  const isFixed = shapeType === 'RECTANGLE' || shapeType === 'CIRCLE';
  const labels = NODE_LABELS[shapeType] || null;
  function updateNode(idx, axis, rawVal) {
    const val = Math.max(0, Math.min(100, parseFloat(rawVal) || 0)) / 100;
    const newX = axis === 'x' ? val : nodes[idx].x;
    const newY = axis === 'y' ? val : nodes[idx].y;
    onNodesChange((0,_areas__WEBPACK_IMPORTED_MODULE_4__.moveAreaNode)(region, idx, newX, newY));
  }
  function addNode() {
    onNodesChange([...nodes, {
      x: 0.5,
      y: 0.5
    }]);
  }
  function deleteNode(idx) {
    onNodesChange(nodes.filter((_, i) => i !== idx));
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("section", {
    className: "cns-modal-section cns-nodes-section",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("h3", {
      children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Nodes', 'clouds-and-spaceships'), !isFixed && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
        variant: "secondary",
        size: "small",
        icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__["default"],
        onClick: addNode,
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Add Node', 'clouds-and-spaceships')
      })]
    }), nodes.length === 0 ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("p", {
      className: "description",
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('No nodes yet. Click the canvas to add nodes.', 'clouds-and-spaceships')
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("table", {
      className: "cns-nodes-table",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("thead", {
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("tr", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("th", {
            children: "#"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("th", {
            children: "X\xA0%"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("th", {
            children: "Y\xA0%"
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("th", {})]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("tbody", {
        children: nodes.map((node, idx) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("tr", {
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("td", {
            className: "cns-node-num",
            children: labels ? labels[idx] ?? idx + 1 : idx + 1
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("td", {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalNumberControl, {
              size: "small",
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('X %', 'clouds-and-spaceships'),
              hideLabelFromVision: true,
              value: (node.x * 100).toFixed(1),
              min: 0,
              max: 100,
              step: 0.1,
              onChange: v => updateNode(idx, 'x', v ?? '')
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("td", {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.__experimentalNumberControl, {
              size: "small",
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Y %', 'clouds-and-spaceships'),
              hideLabelFromVision: true,
              value: (node.y * 100).toFixed(1),
              min: 0,
              max: 100,
              step: 0.1,
              onChange: v => updateNode(idx, 'y', v ?? '')
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("td", {
            children: !isFixed && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
              size: "small",
              icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__["default"],
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Remove node', 'clouds-and-spaceships'),
              onClick: () => deleteNode(idx)
            })
          })]
        }, idx))
      })]
    })]
  });
}

/***/ },

/***/ "./src/map/admin/app/forms/shared/InfoboxSection.tsx"
/*!***********************************************************!*\
  !*** ./src/map/admin/app/forms/shared/InfoboxSection.tsx ***!
  \***********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ InfoboxSection),
/* harmony export */   infoboxFormDefaults: () => (/* binding */ infoboxFormDefaults)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _shared_MediaPicker__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/MediaPicker */ "./src/map/admin/app/shared/MediaPicker.tsx");
/* harmony import */ var _shared_PostSearch__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../shared/PostSearch */ "./src/map/admin/app/shared/PostSearch.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);





/**
 * The Infobox form section shared by the object, area, and label forms.
 * One model everywhere: an optional connected post (adds a "Read more" link
 * to the frontend drawer regardless of source) and a radio that only picks
 * where the content comes from — written manually or pulled from that post.
 */

function InfoboxSection({
  formData,
  onChange
}) {
  const isManualIb = formData.infobox_source !== 'post';
  function set(key, val) {
    onChange({
      ...formData,
      [key]: val
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("section", {
    className: "cns-modal-section",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h3", {
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Infobox', 'clouds-and-spaceships')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      className: "cns-grid cns-grid__12",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        className: "cns-grid__group cns-grid__span-full",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_shared_PostSearch__WEBPACK_IMPORTED_MODULE_3__["default"], {
          selectedId: formData.linked_post_id,
          selectedLabel: formData.linked_post_label,
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Optional — a connected post adds a “Read more” link to the infobox.', 'clouds-and-spaceships'),
          onChange: item => onChange({
            ...formData,
            linked_post_id: item ? item.id : 0,
            linked_post_label: item ? item.title : ''
          })
        })
      }), formData.linked_post_id ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        className: "cns-grid__group cns-grid__span-full",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.CheckboxControl, {
          __nextHasNoMarginBottom: true,
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Display infobox', 'clouds-and-spaceships'),
          help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show the connected post’s infobox blocks in the drawer — works even when the description is written manually.', 'clouds-and-spaceships'),
          checked: formData.display_infobox,
          onChange: v => set('display_infobox', v)
        })
      }) : null, /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
        className: "cns-grid__group cns-grid__span-full",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.RadioControl, {
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Content source', 'clouds-and-spaceships'),
          selected: isManualIb ? 'manual' : 'post',
          options: [{
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Write content manually', 'clouds-and-spaceships'),
            value: 'manual'
          }, {
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Use the connected post’s content', 'clouds-and-spaceships'),
            value: 'post'
          }],
          onChange: value => set('infobox_source', value)
        })
      }), isManualIb ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          className: "cns-grid__group cns-grid__span-full",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.TextControl, {
            __next40pxDefaultSize: true,
            __nextHasNoMarginBottom: true,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Infobox Title', 'clouds-and-spaceships'),
            value: formData.infobox_title,
            onChange: v => set('infobox_title', v)
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          className: "cns-grid__group cns-grid__span-full",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.TextareaControl, {
            __nextHasNoMarginBottom: true,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Description', 'clouds-and-spaceships'),
            rows: 4,
            value: formData.infobox_description,
            onChange: v => set('infobox_description', v)
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          className: "cns-grid__group cns-grid__span-full",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_shared_MediaPicker__WEBPACK_IMPORTED_MODULE_2__["default"], {
            imageId: formData.infobox_image_id,
            imageUrl: formData.infobox_image_url,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Infobox Image', 'clouds-and-spaceships'),
            title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Select Infobox Image', 'clouds-and-spaceships'),
            onChange: att => onChange({
              ...formData,
              infobox_image_id: att ? att.id : 0,
              infobox_image_url: att ? att.url : ''
            })
          })
        })]
      }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.Fragment, {
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
          className: "description cns-grid__span-full",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Title, excerpt and thumbnail are pulled from the connected post. Untick to hide any of them.', 'clouds-and-spaceships')
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          className: "cns-grid__group cns-grid__span-full",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.CheckboxControl, {
            __nextHasNoMarginBottom: true,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show title', 'clouds-and-spaceships'),
            checked: formData.show_title,
            onChange: v => set('show_title', v)
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          className: "cns-grid__group cns-grid__span-full",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.CheckboxControl, {
            __nextHasNoMarginBottom: true,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show excerpt', 'clouds-and-spaceships'),
            checked: formData.show_excerpt,
            onChange: v => set('show_excerpt', v)
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("div", {
          className: "cns-grid__group cns-grid__span-full",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.CheckboxControl, {
            __nextHasNoMarginBottom: true,
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Show thumbnail', 'clouds-and-spaceships'),
            checked: formData.show_thumbnail,
            onChange: v => set('show_thumbnail', v)
          })
        })]
      })]
    })]
  });
}

/** Default infobox form values for an existing item (or null for a new one). */
function infoboxFormDefaults(item) {
  return {
    infobox_source: item?.infobox_source || 'manual',
    infobox_title: item?.infobox_data?.title || '',
    infobox_description: item?.infobox_data?.description || '',
    infobox_image_id: item?.infobox_data?.image_id || 0,
    infobox_image_url: '',
    linked_post_id: item?.linked_post_id || 0,
    linked_post_label: item?.linked_post_id ? `Post ID: ${item.linked_post_id}` : '',
    // Display flags default on when absent (matches the server-side default).
    display_infobox: item?.infobox_data?.display_infobox ?? true,
    show_title: item?.infobox_data?.show_title ?? true,
    show_excerpt: item?.infobox_data?.show_excerpt ?? true,
    show_thumbnail: item?.infobox_data?.show_thumbnail ?? true
  };
}

/***/ },

/***/ "./src/map/admin/app/lists/AreasList.tsx"
/*!***********************************************!*\
  !*** ./src/map/admin/app/lists/AreasList.tsx ***!
  \***********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AreasList)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/copy.mjs");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/pencil.mjs");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/trash.mjs");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _EntityTable__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./EntityTable */ "./src/map/admin/app/lists/EntityTable.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);





const COLUMNS = [{
  header: 'Title',
  render: area => area.title || '(no title)'
}, {
  header: 'Type',
  render: area => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
    className: "cns-badge cns-badge--type",
    children: area.type
  })
}, {
  header: 'Nodes',
  render: area => `${(area.nodes || []).length} nodes`
}];
function AreasList({
  areas,
  onSelect,
  onDuplicate,
  onDelete
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_EntityTable__WEBPACK_IMPORTED_MODULE_5__["default"], {
    items: areas,
    columns: COLUMNS,
    emptyText: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('No areas yet. Click “Add Area” to create one.', 'clouds-and-spaceships'),
    renderActions: area => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
        variant: "secondary",
        icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__["default"],
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Edit', 'clouds-and-spaceships'),
        onClick: () => onSelect(area.id)
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
        variant: "secondary",
        icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__["default"],
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Duplicate', 'clouds-and-spaceships'),
        onClick: () => onDuplicate(area.id)
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
        variant: "secondary",
        icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_3__["default"],
        isDestructive: true,
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Delete', 'clouds-and-spaceships'),
        onClick: () => onDelete(area.id)
      })]
    })
  });
}

/***/ },

/***/ "./src/map/admin/app/lists/EntityTable.tsx"
/*!*************************************************!*\
  !*** ./src/map/admin/app/lists/EntityTable.tsx ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EntityTable)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

/**
 * Generic list table for the entity tabs (objects / areas / labels): the
 * per-entity lists only declare their columns and action buttons, so layout,
 * empty states, and the action-cell pattern stay identical across tabs.
 */

function EntityTable({
  items,
  columns,
  emptyText,
  renderActions
}) {
  if (!items.length) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("p", {
      className: "cns-objects-empty",
      children: emptyText
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("table", {
    className: "widefat cns-objects-table",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("thead", {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("tr", {
        children: [columns.map((col, i) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("th", {
          style: col.width ? {
            width: col.width
          } : undefined,
          children: col.header
        }, i)), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("th", {
          children: "Actions"
        })]
      })
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("tbody", {
      children: items.map(item => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsxs)("tr", {
        children: [columns.map((col, i) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("td", {
          className: col.className,
          children: col.render(item)
        }, i)), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("td", {
          className: "cns-row-actions",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("div", {
            className: "cns-actions-row",
            children: renderActions(item)
          })
        })]
      }, item.id))
    })]
  });
}

/***/ },

/***/ "./src/map/admin/app/lists/HierarchyRegionList.tsx"
/*!*********************************************************!*\
  !*** ./src/map/admin/app/lists/HierarchyRegionList.tsx ***!
  \*********************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ HierarchyRegionList)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/pencil.mjs");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/trash.mjs");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);




function HierarchyRegionList({
  regions,
  onSelect,
  onDelete
}) {
  if (!regions.length) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("p", {
      className: "description",
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('No child-map regions yet. Click "Add Region" to draw one.', 'clouds-and-spaceships')
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("ul", {
    className: "cns-items-list",
    children: regions.map(r => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("li", {
      className: "cns-items-list__item",
      children: [r.child_map_thumbnail && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("img", {
        src: r.child_map_thumbnail,
        alt: "",
        className: "cns-items-list__thumb"
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("span", {
        className: "cns-items-list__label",
        children: [r.child_map_title || `Map #${r.child_map_id}`, r.child_map_status && r.child_map_status !== 'publish' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("em", {
          className: "cns-items-list__status",
          children: [" \u2014 ", r.child_map_status]
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("span", {
        className: "cns-items-list__actions",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
          size: "small",
          icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__["default"],
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Edit', 'clouds-and-spaceships'),
          onClick: () => onSelect(r.id)
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
          size: "small",
          icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__["default"],
          isDestructive: true,
          label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Delete', 'clouds-and-spaceships'),
          onClick: () => onDelete(r.id)
        })]
      })]
    }, r.id))
  });
}

/***/ },

/***/ "./src/map/admin/app/lists/LabelsList.tsx"
/*!************************************************!*\
  !*** ./src/map/admin/app/lists/LabelsList.tsx ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LabelsList)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/copy.mjs");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/pencil.mjs");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/trash.mjs");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _EntityTable__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./EntityTable */ "./src/map/admin/app/lists/EntityTable.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);





const COLUMNS = [{
  header: '',
  width: 36,
  className: 'col-icon',
  render: label => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
    className: "cns-obj-dot",
    style: {
      background: label.canvas_styles?.bgColor || '#ffffff',
      border: `2px solid ${label.canvas_styles?.borderColor || '#1e1e1e'}`,
      borderRadius: 3
    }
  })
}, {
  header: 'Text',
  render: label => label.text || '(empty label)'
}, {
  header: 'Placement',
  render: label => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
    className: "cns-badge cns-badge--type",
    children: label.placement === 'indicator' ? 'Indicator' : 'Centered'
  })
}, {
  header: 'Position',
  render: label => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
    children: [label.x, ", ", label.y]
  })
}];
function LabelsList({
  labels,
  onEdit,
  onDuplicate,
  onDelete
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_EntityTable__WEBPACK_IMPORTED_MODULE_5__["default"], {
    items: labels,
    columns: COLUMNS,
    emptyText: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('No labels yet. Click on the canvas to place one.', 'clouds-and-spaceships'),
    renderActions: label => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
        variant: "secondary",
        icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__["default"],
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Edit', 'clouds-and-spaceships'),
        onClick: () => onEdit(label)
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
        variant: "secondary",
        icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__["default"],
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Duplicate', 'clouds-and-spaceships'),
        onClick: () => onDuplicate(label.id)
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
        variant: "secondary",
        icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_3__["default"],
        isDestructive: true,
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Delete', 'clouds-and-spaceships'),
        onClick: () => onDelete(label.id)
      })]
    })
  });
}

/***/ },

/***/ "./src/map/admin/app/lists/ObjectsList.tsx"
/*!*************************************************!*\
  !*** ./src/map/admin/app/lists/ObjectsList.tsx ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ObjectsList)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/copy.mjs");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/pencil.mjs");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/trash.mjs");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _EntityTable__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./EntityTable */ "./src/map/admin/app/lists/EntityTable.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);





const COLUMNS = [{
  header: '',
  width: 36,
  className: 'col-icon',
  render: obj => obj.icon_url ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("img", {
    src: obj.icon_url,
    width: "28",
    height: "28",
    alt: "",
    style: {
      display: 'block',
      objectFit: 'contain'
    }
  }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
    className: "cns-obj-dot",
    style: {
      background: obj.canvas_styles?.fillStyle || '#2271b1'
    }
  })
}, {
  header: 'Title',
  render: obj => obj.title || '(no title)'
}, {
  header: 'Type',
  render: obj => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("span", {
    className: "cns-badge cns-badge--type",
    children: obj.type
  })
}, {
  header: 'Position',
  render: obj => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
    children: [obj.x, ", ", obj.y]
  })
}];
function ObjectsList({
  objects,
  onEdit,
  onDuplicate,
  onDelete
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_EntityTable__WEBPACK_IMPORTED_MODULE_5__["default"], {
    items: objects,
    columns: COLUMNS,
    emptyText: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('No objects on map. Click on canvas or [Add Object] button to place your first map object.', 'clouds-and-spaceships'),
    renderActions: obj => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.Fragment, {
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
        variant: "secondary",
        icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__["default"],
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Edit', 'clouds-and-spaceships'),
        onClick: () => onEdit(obj)
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
        variant: "secondary",
        icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__["default"],
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Duplicate', 'clouds-and-spaceships'),
        onClick: () => onDuplicate(obj.id)
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
        variant: "secondary",
        icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_3__["default"],
        isDestructive: true,
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Delete', 'clouds-and-spaceships'),
        onClick: () => onDelete(obj.id)
      })]
    })
  });
}

/***/ },

/***/ "./src/map/admin/app/panels/AreasPanel.tsx"
/*!*************************************************!*\
  !*** ./src/map/admin/app/panels/AreasPanel.tsx ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ AreasPanel)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/plus.mjs");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var _wordpress_notices__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/notices */ "@wordpress/notices");
/* harmony import */ var _wordpress_notices__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_notices__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _canvases_AreasCanvas__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../canvases/AreasCanvas */ "./src/map/admin/app/canvases/AreasCanvas.tsx");
/* harmony import */ var _lists_AreasList__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../lists/AreasList */ "./src/map/admin/app/lists/AreasList.tsx");
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../utils */ "./src/map/admin/utils.ts");
/* harmony import */ var _canvas__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../../canvas */ "./src/map/admin/canvas.ts");
/* harmony import */ var _areas__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../../areas */ "./src/map/admin/areas.ts");
/* harmony import */ var _forms_AreaForm__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ../forms/AreaForm */ "./src/map/admin/app/forms/AreaForm.tsx");
/* harmony import */ var _useCanvasKeyboard__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ../useCanvasKeyboard */ "./src/map/admin/app/useCanvasKeyboard.ts");
/* harmony import */ var _useMapResource__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ../useMapResource */ "./src/map/admin/app/useMapResource.ts");
/* harmony import */ var _choices__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../../choices */ "./src/map/choices.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__);
















// Internal clipboard for ⌘/Ctrl+C/V. Module scope so it survives tab
// switches within the editor page (not across page loads / other maps).
let areaClipboard = null;
function AreasPanel({
  mapId,
  settings,
  areas,
  selectedAreaId,
  onAreasLoaded,
  onSelect,
  onDeselect,
  onNodesUpdate,
  onDuplicate,
  onDelete
}) {
  (0,_useMapResource__WEBPACK_IMPORTED_MODULE_13__.useMapResource)(mapId, 'areas', onAreasLoaded);
  const {
    createErrorNotice
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.useDispatch)(_wordpress_notices__WEBPACK_IMPORTED_MODULE_5__.store);

  // ── Keyboard shortcuts (active while the Areas tab is mounted) ─────────────

  const selectedArea = areas.find(a => a.id === selectedAreaId) || null;
  const canvasW = settings.width || 1000;
  const canvasH = canvasW / (settings.aspectRatio || 1);

  // Keyboard-focused node of the selected area (Tab cycles it): arrows then
  // nudge that node instead of the whole area, Delete removes it, Esc clears
  // the focus (handled in the canvas, before deselecting).
  const [focusedNodeIdx, setFocusedNodeIdx] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(null);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    setFocusedNodeIdx(null);
  }, [selectedAreaId]);

  // Node-list edits can shrink the node set — keep the focus index valid.
  const nodeCount = selectedArea ? (selectedArea.nodes || []).length : 0;
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useEffect)(() => {
    if (focusedNodeIdx !== null && focusedNodeIdx >= nodeCount) {
      setFocusedNodeIdx(nodeCount ? nodeCount - 1 : null);
    }
  }, [nodeCount]);
  async function pasteArea() {
    if (!areaClipboard) return;
    // Cascade repeated pastes instead of stacking copies exactly on top
    // of each other (nodes are normalized 0–1, so shift by 24 px worth).
    const nodes = areaClipboard.nodes.map(n => ({
      ...n,
      x: n.x + 24 / canvasW,
      y: n.y + 24 / canvasH
    }));
    areaClipboard = {
      ...areaClipboard,
      nodes
    };
    try {
      const data = await (0,_utils__WEBPACK_IMPORTED_MODULE_8__.apiFetch)('POST', `/maps/${mapId}/areas`, {
        ...areaClipboard.form,
        nodes: JSON.stringify(nodes)
      });
      onAreasLoaded([...areas, data]);
      onSelect(data.id);
    } catch {
      /* paste failures are silent, as before */
    }
  }
  ;(0,_useCanvasKeyboard__WEBPACK_IMPORTED_MODULE_12__.useCanvasKeyboard)({
    copy: () => {
      if (!selectedArea) return false;
      areaClipboard = {
        form: (0,_forms_AreaForm__WEBPACK_IMPORTED_MODULE_11__.defaultAreaFormData)(selectedArea),
        nodes: (selectedArea.nodes || []).map(n => ({
          ...n
        }))
      };
      return true;
    },
    paste: () => {
      if (!areaClipboard) return false;
      void pasteArea();
      return true;
    },
    duplicate: () => {
      if (!selectedArea) return false;
      void onDuplicate(selectedArea.id);
      return true;
    },
    // With a node focused, Delete removes that node (where the shape
    // allows); otherwise it deletes the whole area after a confirm.
    remove: () => {
      if (!selectedArea) return false;
      if (focusedNodeIdx !== null) {
        if ((0,_areas__WEBPACK_IMPORTED_MODULE_10__.canRemoveAreaNode)(selectedArea)) {
          const nodes = (selectedArea.nodes || []).filter((_, i) => i !== focusedNodeIdx);
          onNodesUpdate(selectedArea.id, nodes);
          // The clamp effect keeps the index valid; move focus to
          // the previous node so repeated Deletes walk backwards.
          setFocusedNodeIdx(focusedNodeIdx > 0 ? focusedNodeIdx - 1 : 0);
        }
        return true; // claim the key even when the shape can't shrink
      }
      if (confirm((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Delete this area?', 'clouds-and-spaceships'))) void onDelete(selectedArea.id);
      return true;
    },
    // Arrow keys nudge the focused node, or move the whole area when no
    // node is focused. Local update + persistence ride on the debounced
    // geometry save in MapEditorApp.
    nudge: (dx, dy) => {
      if (!selectedArea) return false;
      if (focusedNodeIdx !== null && (selectedArea.nodes || [])[focusedNodeIdx]) {
        const node = selectedArea.nodes[focusedNodeIdx];
        const newX = Math.min(1, Math.max(0, node.x + dx / canvasW));
        const newY = Math.min(1, Math.max(0, node.y + dy / canvasH));
        onNodesUpdate(selectedArea.id, (0,_areas__WEBPACK_IMPORTED_MODULE_10__.moveAreaNode)(selectedArea, focusedNodeIdx, newX, newY));
        return true;
      }
      const nodes = (selectedArea.nodes || []).map(n => ({
        ...n,
        x: n.x + dx / canvasW,
        y: n.y + dy / canvasH
      }));
      onNodesUpdate(selectedArea.id, nodes);
      return true;
    },
    // Tab / Shift+Tab cycle through the selected area's nodes.
    tab: backwards => {
      if (!selectedArea || !nodeCount) return false;
      setFocusedNodeIdx(prev => {
        if (prev === null) return backwards ? nodeCount - 1 : 0;
        return (prev + (backwards ? -1 : 1) + nodeCount) % nodeCount;
      });
      return true;
    }
  });
  async function handleAddArea() {
    if (!mapId) return;
    const defaultNodes = (0,_areas__WEBPACK_IMPORTED_MODULE_10__.getDefaultNodes)(_choices__WEBPACK_IMPORTED_MODULE_14__.SHAPE_TYPE_DEFAULT);
    try {
      const data = await (0,_utils__WEBPACK_IMPORTED_MODULE_8__.apiFetch)('POST', `/maps/${mapId}/areas`, {
        title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('New Area', 'clouds-and-spaceships'),
        nodes: JSON.stringify(defaultNodes),
        style_fill: '#2271b1',
        style_stroke: '#2271b1',
        style_stroke_width: 2
      });
      onAreasLoaded([...areas, data]);
      onSelect(data.id);
    } catch (err) {
      createErrorNotice(err.message || (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Failed to create area.', 'clouds-and-spaceships'), {
        type: 'snackbar'
      });
    }
  }
  async function handleDelete(id) {
    if (!confirm('Delete this area?')) return;
    await onDelete(id);
  }
  const drawState = (0,_canvas__WEBPACK_IMPORTED_MODULE_9__.settingsToDrawState)(settings);

  // Help information
  const [isVisibleHelpInformation, setIsVisibleHelpInformation] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_2__.useState)(false);
  const toggleVisibleHelpInformation = () => {
    setIsVisibleHelpInformation(state => !state);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("div", {
    className: "cns-tab-panel cns-tab-panel--active",
    "data-panel": "areas",
    role: "tabpanel",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Flex, {
      gap: 2,
      direction: "column",
      align: "center",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.FlexBlock, {
        style: {
          width: '100%'
        },
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Flex, {
          gap: 4,
          align: "start",
          justify: "space-between",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.FlexItem, {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
              variant: "tertiary",
              onClick: toggleVisibleHelpInformation,
              children: ["Help Information", isVisibleHelpInformation && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Popover, {
                headerTitle: "Help Information",
                expandOnMobile: true,
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("p", {
                  style: {
                    padding: '0 1em',
                    width: 320,
                    maxWidth: '100%'
                  },
                  children: "Areas are clickable sections on the canvas that are linked to an infobox. Adjust the area size by adding and moving nodes."
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsxs)("ol", {
                  style: {
                    width: 320,
                    maxWidth: '100%'
                  },
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("li", {
                    children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Click a node to pick it up — it follows the cursor.', 'clouds-and-spaceships')
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("li", {
                    children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Click or press Enter to place node.', 'clouds-and-spaceships')
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("li", {
                    children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Press Esc to cancel current placement.', 'clouds-and-spaceships')
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("li", {
                    children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Click empty space on a selected area to add a node. ', 'clouds-and-spaceships')
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("li", {
                    children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('With an area selected: arrow keys move the whole area (Shift = 10 px).', 'clouds-and-spaceships')
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("li", {
                    children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)(' Tab/Shift+Tab cycles nodes; Arrows nudge node; Delete removes node.', 'clouds-and-spaceships')
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)("li", {
                    children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Ctrl/⌘+C & V copy & paste, Ctrl/⌘+D duplicates, Delete removes the area.', 'clouds-and-spaceships')
                  })]
                })]
              })]
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
            variant: "primary",
            icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_3__["default"],
            onClick: handleAddArea,
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_4__.__)('Add Area', 'clouds-and-spaceships')
          })]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_canvases_AreasCanvas__WEBPACK_IMPORTED_MODULE_6__["default"], {
        drawState: drawState,
        areas: areas,
        selectedAreaId: selectedAreaId,
        focusedNodeIdx: focusedNodeIdx,
        onSelect: onSelect,
        onDeselect: onDeselect,
        onNodesChange: onNodesUpdate,
        onNodeFocusChange: setFocusedNodeIdx
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_15__.jsx)(_lists_AreasList__WEBPACK_IMPORTED_MODULE_7__["default"], {
        areas: areas,
        onSelect: onSelect,
        onDuplicate: id => void onDuplicate(id),
        onDelete: handleDelete
      })]
    })
  });
}

/***/ },

/***/ "./src/map/admin/app/panels/DescriptionPanel.tsx"
/*!*******************************************************!*\
  !*** ./src/map/admin/app/panels/DescriptionPanel.tsx ***!
  \*******************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ DescriptionPanel)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




const EDITOR_ID = 'cns-map-description';
function DescriptionPanel({
  value,
  onChange,
  wpEditUrl,
  isSaving,
  onEditInWordPress
}) {
  const onChangeRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(onChange);
  onChangeRef.current = onChange;
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    const ed = window.wp?.oldEditor || window.wp?.editor;
    const textarea = document.getElementById(EDITOR_ID);

    // Text-mode (Quicktags) edits land directly in the textarea.
    const onInput = () => onChangeRef.current(textarea?.value ?? '');
    textarea?.addEventListener('input', onInput);
    if (ed?.initialize) {
      ed.initialize(EDITOR_ID, {
        tinymce: {
          wpautop: true,
          height: 320,
          toolbar1: 'formatselect,bold,italic,bullist,numlist,blockquote,hr,alignleft,aligncenter,alignright,link,unlink,undo,redo',
          setup(editor) {
            editor.on('change keyup input Undo Redo', () => {
              onChangeRef.current(editor.getContent());
            });
          }
        },
        quicktags: true,
        mediaButtons: true
      });
    }
    return () => {
      textarea?.removeEventListener('input', onInput);
      ed?.remove?.(EDITOR_ID);
    };
  }, []);

  /** Current editor content, from whichever mode is active. */
  function readDescription() {
    const editor = window.tinymce?.get(EDITOR_ID);
    if (editor && !editor.isHidden()) {
      return editor.getContent();
    }
    const textarea = document.getElementById(EDITOR_ID);
    return textarea?.value ?? value;
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("div", {
    className: "cns-tab-panel cns-tab-panel--active",
    "data-panel": "description",
    role: "tabpanel",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
      className: "cns-desc-editor",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsxs)("div", {
        className: "cns-desc-editor__header",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("p", {
          className: "description",
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Description of the current map.\n Displayed underneath map element.', 'clouds-and-spaceships')
        }), wpEditUrl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Button, {
          variant: "secondary",
          isBusy: isSaving,
          disabled: isSaving,
          onClick: () => onEditInWordPress(readDescription()),
          children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Edit in WordPress editor', 'clouds-and-spaceships')
        })]
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)("textarea", {
        id: EDITOR_ID,
        rows: 14,
        defaultValue: value
      })]
    })
  });
}

/***/ },

/***/ "./src/map/admin/app/panels/HierarchyPanel.tsx"
/*!*****************************************************!*\
  !*** ./src/map/admin/app/panels/HierarchyPanel.tsx ***!
  \*****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ HierarchyPanel)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/plus.mjs");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _canvases_HierarchyCanvas__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../canvases/HierarchyCanvas */ "./src/map/admin/app/canvases/HierarchyCanvas.tsx");
/* harmony import */ var _lists_HierarchyRegionList__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../lists/HierarchyRegionList */ "./src/map/admin/app/lists/HierarchyRegionList.tsx");
/* harmony import */ var _canvas__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../../canvas */ "./src/map/admin/canvas.ts");
/* harmony import */ var _areas__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../areas */ "./src/map/admin/areas.ts");
/* harmony import */ var _useMapResource__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../useMapResource */ "./src/map/admin/app/useMapResource.ts");
/* harmony import */ var _choices__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../../../choices */ "./src/map/choices.ts");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__);











function HierarchyPanel({
  mapId,
  settings,
  regions,
  selectedRegionId,
  parentMaps,
  onRegionsLoaded,
  onSelect,
  onDeselect,
  onNodesUpdate,
  onDelete
}) {
  (0,_useMapResource__WEBPACK_IMPORTED_MODULE_7__.useMapResource)(mapId, 'hierarchy', onRegionsLoaded);
  async function handleAddRegion() {
    if (!mapId) return;
    // Create a placeholder region with no child yet; user assigns it in the context panel.
    // We use child_map_id=0 as a sentinel and immediately select it.
    // The REST API requires a valid child_map_id, so we create with the map's own ID as
    // a placeholder — but the API rejects self-links. Instead, just insert an empty polygon
    // that the user fills in via the context form.
    //
    // Strategy: optimistically add a local-only "draft" region, select it for editing.
    // It won't be persisted until the user saves from the context panel (which requires
    // a valid child_map_id). We mark it with id=-1 as an unsaved sentinel.
    const draft = {
      id: -1,
      parent_map_id: mapId,
      child_map_id: 0,
      shape_type: _choices__WEBPACK_IMPORTED_MODULE_8__.SHAPE_TYPE_DEFAULT,
      nodes: (0,_areas__WEBPACK_IMPORTED_MODULE_6__.getDefaultNodes)(_choices__WEBPACK_IMPORTED_MODULE_8__.SHAPE_TYPE_DEFAULT),
      canvas_styles: {
        fill: '#e8a020',
        stroke: '#e8a020',
        strokeWidth: 2
      },
      title_override: null,
      description_override: null,
      child_map_title: '',
      child_map_excerpt: '',
      child_map_status: '',
      child_map_thumbnail: '',
      child_map_url: '',
      created_at: '',
      updated_at: ''
    };
    onRegionsLoaded([...regions, draft]);
    onSelect(-1);
  }
  async function handleDelete(id) {
    if (id === -1) {
      // Unsaved draft — just remove locally.
      onRegionsLoaded(regions.filter(r => r.id !== -1));
      onDeselect();
      return;
    }
    if (!confirm((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Delete this hierarchy region?', 'clouds-and-spaceships'))) return;
    await onDelete(id);
  }
  const drawState = (0,_canvas__WEBPACK_IMPORTED_MODULE_5__.settingsToDrawState)(settings);

  // Help information
  const [isVisibleHelpInformation, setIsVisibleHelpInformation] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_9__.useState)(false);
  const toggleVisibleHelpInformation = () => {
    setIsVisibleHelpInformation(state => !state);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", {
    className: "cns-tab-panel cns-tab-panel--active",
    "data-panel": "hierarchy",
    role: "tabpanel",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Flex, {
      gap: 2,
      direction: "column",
      align: "center",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div", {
        className: "cns-objects-layout",
        children: [parentMaps.length > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("div", {
          className: "cns-hierarchy-parents",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("span", {
            className: "cns-hierarchy-parents__label",
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Parent maps:', 'clouds-and-spaceships')
          }), parentMaps.map(p => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("a", {
            href: p.url,
            className: "cns-hierarchy-parents__link",
            children: [p.thumbnail && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("img", {
              src: p.thumbnail,
              alt: ""
            }), p.title]
          }, p.map_id))]
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.FlexBlock, {
          style: {
            width: '100%'
          },
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Flex, {
            gap: 4,
            align: "start",
            justify: "space-between",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.FlexItem, {
              children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
                variant: "tertiary",
                onClick: toggleVisibleHelpInformation,
                children: ["Help Information", isVisibleHelpInformation && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Popover, {
                  headerTitle: "Help Information",
                  expandOnMobile: true,
                  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("ol", {
                    style: {
                      width: 320,
                      maxWidth: '100%'
                    },
                    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("li", {
                      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Draw a polygon region that links to a child map.', 'clouds-and-spaceships')
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("li", {
                      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Click a node to reposition it.', 'clouds-and-spaceships')
                    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("li", {
                      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Click empty canvas on a selected region to add a node.', 'clouds-and-spaceships')
                    })]
                  })
                })]
              })
            }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
              variant: "primary",
              icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__["default"],
              onClick: handleAddRegion,
              children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('Add Region', 'clouds-and-spaceships')
            })]
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_canvases_HierarchyCanvas__WEBPACK_IMPORTED_MODULE_3__["default"], {
          drawState: drawState,
          regions: regions,
          selectedRegionId: selectedRegionId,
          onSelect: onSelect,
          onDeselect: onDeselect,
          onNodesChange: onNodesUpdate
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_lists_HierarchyRegionList__WEBPACK_IMPORTED_MODULE_4__["default"], {
          regions: regions.filter(r => r.id !== -1),
          onSelect: onSelect,
          onDelete: handleDelete
        })]
      })
    })
  });
}

/***/ },

/***/ "./src/map/admin/app/panels/LabelsPanel.tsx"
/*!**************************************************!*\
  !*** ./src/map/admin/app/panels/LabelsPanel.tsx ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ LabelsPanel)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/plus.mjs");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _canvases_LabelsCanvas__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../canvases/LabelsCanvas */ "./src/map/admin/app/canvases/LabelsCanvas.tsx");
/* harmony import */ var _lists_LabelsList__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../lists/LabelsList */ "./src/map/admin/app/lists/LabelsList.tsx");
/* harmony import */ var _canvas__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../canvas */ "./src/map/admin/canvas.ts");
/* harmony import */ var _forms_LabelForm__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../forms/LabelForm */ "./src/map/admin/app/forms/LabelForm.tsx");
/* harmony import */ var _useCanvasKeyboard__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../useCanvasKeyboard */ "./src/map/admin/app/useCanvasKeyboard.ts");
/* harmony import */ var _useMapResource__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../useMapResource */ "./src/map/admin/app/useMapResource.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__);











// Internal clipboard for ⌘/Ctrl+C/V. Module scope so it survives tab
// switches within the editor page (not across page loads / other maps).
let labelClipboard = null;
function LabelsPanel({
  mapId,
  settings,
  labels,
  selectedLabelId,
  onLabelsLoaded,
  onSelect,
  onDeselect,
  onAdd,
  onGeometryUpdate,
  onLocalUpdate,
  onDuplicate,
  onDelete
}) {
  (0,_useMapResource__WEBPACK_IMPORTED_MODULE_9__.useMapResource)(mapId, 'labels', onLabelsLoaded);

  // The nudge factory is created once; these refs feed it live values.
  const stateRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useRef)({
    labels,
    selectedLabelId
  });
  stateRef.current = {
    labels,
    selectedLabelId
  };
  const propsRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useRef)({
    onGeometryUpdate,
    onLocalUpdate
  });
  propsRef.current = {
    onGeometryUpdate,
    onLocalUpdate
  };

  // ── Keyboard shortcuts (active while the Labels tab is mounted) ────────────

  const selectedLabel = labels.find(l => l.id === selectedLabelId) || null;
  const nudger = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useRef)((0,_useCanvasKeyboard__WEBPACK_IMPORTED_MODULE_8__.createDebouncedNudge)(() => {
    const s = stateRef.current;
    return s.labels.find(l => l.id === s.selectedLabelId) || null;
  }, (id, x, y) => propsRef.current.onLocalUpdate(id, {
    x,
    y
  }), (id, x, y) => void propsRef.current.onGeometryUpdate(id, {
    x,
    y
  })));
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => () => nudger.current.flush(), []); // persist pending nudge on tab leave

  async function pasteLabel() {
    if (!labelClipboard) return;
    // Cascade repeated pastes instead of stacking copies exactly on top
    // of each other.
    const payload = {
      ...labelClipboard,
      x: labelClipboard.x + 24,
      y: labelClipboard.y + 24
    };
    labelClipboard = payload;
    const created = await onAdd(payload);
    onSelect(created.id);
  }
  ;(0,_useCanvasKeyboard__WEBPACK_IMPORTED_MODULE_8__.useCanvasKeyboard)({
    copy: () => {
      if (!selectedLabel) return false;
      labelClipboard = (0,_forms_LabelForm__WEBPACK_IMPORTED_MODULE_7__.collectLabelPayload)((0,_forms_LabelForm__WEBPACK_IMPORTED_MODULE_7__.defaultLabelFormData)(selectedLabel, null, null));
      return true;
    },
    paste: () => {
      if (!labelClipboard) return false;
      void pasteLabel();
      return true;
    },
    duplicate: () => {
      if (!selectedLabel) return false;
      void onDuplicate(selectedLabel.id);
      return true;
    },
    remove: () => {
      if (!selectedLabel) return false;
      if (confirm((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Delete this label?', 'clouds-and-spaceships'))) void onDelete(selectedLabel.id);
      return true;
    },
    nudge: (dx, dy) => nudger.current.nudge(dx, dy)
  });
  async function handleAdd() {
    const cx = Math.round(settings.width / 2);
    const cy = Math.round(settings.width / settings.aspectRatio / 2);
    const payload = (0,_forms_LabelForm__WEBPACK_IMPORTED_MODULE_7__.collectLabelPayload)({
      ...(0,_forms_LabelForm__WEBPACK_IMPORTED_MODULE_7__.defaultLabelFormData)(null, cx, cy),
      text: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('New Label', 'clouds-and-spaceships')
    });
    const created = await onAdd(payload);
    onSelect(created.id);
  }
  async function handleDelete(id) {
    if (!confirm((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Delete this label?', 'clouds-and-spaceships'))) return;
    await onDelete(id);
  }
  const drawState = (0,_canvas__WEBPACK_IMPORTED_MODULE_6__.settingsToDrawState)(settings);

  // Help information
  const [isVisibleHelpInformation, setIsVisibleHelpInformation] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const toggleVisibleHelpInformation = () => {
    setIsVisibleHelpInformation(state => !state);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", {
    className: "cns-tab-panel cns-tab-panel--active",
    "data-panel": "labels",
    role: "tabpanel",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Flex, {
      gap: 2,
      direction: "column",
      align: "center",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.FlexBlock, {
        style: {
          width: '100%'
        },
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Flex, {
          gap: 4,
          align: "start",
          justify: "space-between",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.FlexItem, {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
              variant: "tertiary",
              onClick: toggleVisibleHelpInformation,
              children: ["Help Information", isVisibleHelpInformation && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Popover, {
                headerTitle: "Help Information",
                expandOnMobile: true,
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("p", {
                  style: {
                    padding: '0 1em',
                    width: 320,
                    maxWidth: '100%'
                  },
                  children: "Create a clickable label linked to an infobox. The label can be extended with an indicator line."
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("ol", {
                  style: {
                    width: 320,
                    maxWidth: '100%'
                  },
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("li", {
                    children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Click a label to pick it up — it follows the cursor;', 'clouds-and-spaceships')
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("li", {
                    children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Esc cancels placement.', 'clouds-and-spaceships')
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("li", {
                    children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('In indicator mode the dot and the text box move independently.', 'clouds-and-spaceships')
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("li", {
                    children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('With a label selected: Enter picks it up, arrow keys nudge (Shift = 10 px), Ctrl/⌘+C & V copy & paste, Ctrl/⌘+D duplicates, Delete removes.', 'clouds-and-spaceships')
                  })]
                })]
              })]
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
            variant: "primary",
            icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__["default"],
            onClick: handleAdd,
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Add Label', 'clouds-and-spaceships')
          })]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_canvases_LabelsCanvas__WEBPACK_IMPORTED_MODULE_4__["default"], {
        drawState: drawState,
        labels: labels,
        selectedLabelId: selectedLabelId,
        onSelect: onSelect,
        onDeselect: onDeselect,
        onGeometryUpdate: onGeometryUpdate
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_lists_LabelsList__WEBPACK_IMPORTED_MODULE_5__["default"], {
        labels: labels,
        onEdit: label => onSelect(label.id),
        onDuplicate: id => void onDuplicate(id),
        onDelete: handleDelete
      })]
    })
  });
}

/***/ },

/***/ "./src/map/admin/app/panels/ObjectsPanel.tsx"
/*!***************************************************!*\
  !*** ./src/map/admin/app/panels/ObjectsPanel.tsx ***!
  \***************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ObjectsPanel)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/plus.mjs");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _canvases_ObjectsCanvas__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../canvases/ObjectsCanvas */ "./src/map/admin/app/canvases/ObjectsCanvas.tsx");
/* harmony import */ var _lists_ObjectsList__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../lists/ObjectsList */ "./src/map/admin/app/lists/ObjectsList.tsx");
/* harmony import */ var _canvas__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../canvas */ "./src/map/admin/canvas.ts");
/* harmony import */ var _forms_ObjectForm__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../forms/ObjectForm */ "./src/map/admin/app/forms/ObjectForm.tsx");
/* harmony import */ var _useCanvasKeyboard__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../useCanvasKeyboard */ "./src/map/admin/app/useCanvasKeyboard.ts");
/* harmony import */ var _useMapResource__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ../useMapResource */ "./src/map/admin/app/useMapResource.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__);











// Internal clipboard for ⌘/Ctrl+C/V. Module scope so it survives tab
// switches within the editor page (not across page loads / other maps).
let objectClipboard = null;
function ObjectsPanel({
  mapId,
  settings,
  objects,
  selectedObjectId,
  onObjectsLoaded,
  onSelect,
  onDeselect,
  onAdd,
  onPositionUpdate,
  onLocalUpdate,
  onDuplicate,
  onDelete
}) {
  (0,_useMapResource__WEBPACK_IMPORTED_MODULE_9__.useMapResource)(mapId, 'objects', onObjectsLoaded);

  // The nudge factory is created once; these refs feed it live values.
  const stateRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useRef)({
    objects,
    selectedObjectId
  });
  stateRef.current = {
    objects,
    selectedObjectId
  };
  const propsRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useRef)({
    onPositionUpdate,
    onLocalUpdate
  });
  propsRef.current = {
    onPositionUpdate,
    onLocalUpdate
  };

  // ── Keyboard shortcuts (active while the Objects tab is mounted) ───────────

  const selectedObject = objects.find(o => o.id === selectedObjectId) || null;
  const nudger = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useRef)((0,_useCanvasKeyboard__WEBPACK_IMPORTED_MODULE_8__.createDebouncedNudge)(() => {
    const s = stateRef.current;
    return s.objects.find(o => o.id === s.selectedObjectId) || null;
  }, (id, x, y) => propsRef.current.onLocalUpdate(id, {
    x,
    y
  }), (id, x, y) => void propsRef.current.onPositionUpdate(id, x, y)));
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useEffect)(() => () => nudger.current.flush(), []); // persist pending nudge on tab leave

  async function pasteObject() {
    if (!objectClipboard) return;
    // Cascade repeated pastes instead of stacking copies exactly on top
    // of each other.
    const payload = {
      ...objectClipboard,
      x: objectClipboard.x + 24,
      y: objectClipboard.y + 24
    };
    objectClipboard = payload;
    const created = await onAdd(payload);
    onSelect(created.id);
  }
  ;(0,_useCanvasKeyboard__WEBPACK_IMPORTED_MODULE_8__.useCanvasKeyboard)({
    copy: () => {
      if (!selectedObject) return false;
      objectClipboard = (0,_forms_ObjectForm__WEBPACK_IMPORTED_MODULE_7__.collectObjectPayload)((0,_forms_ObjectForm__WEBPACK_IMPORTED_MODULE_7__.defaultObjectFormData)(selectedObject, null, null));
      return true;
    },
    paste: () => {
      if (!objectClipboard) return false;
      void pasteObject();
      return true;
    },
    duplicate: () => {
      if (!selectedObject) return false;
      void onDuplicate(selectedObject.id);
      return true;
    },
    remove: () => {
      if (!selectedObject) return false;
      if (confirm((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Delete this object?', 'clouds-and-spaceships'))) void onDelete(selectedObject.id);
      return true;
    },
    nudge: (dx, dy) => nudger.current.nudge(dx, dy)
  });

  // New objects are created immediately and edited in the context panel —
  // same flow as areas and labels (the modal is gone).
  async function handleCreateAt(x, y) {
    const payload = (0,_forms_ObjectForm__WEBPACK_IMPORTED_MODULE_7__.collectObjectPayload)({
      ...(0,_forms_ObjectForm__WEBPACK_IMPORTED_MODULE_7__.defaultObjectFormData)(null, x, y),
      title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('New Object', 'clouds-and-spaceships')
    });
    const created = await onAdd(payload);
    onSelect(created.id);
  }
  function handleAdd() {
    const cx = Math.round(settings.width / 2);
    const cy = Math.round(settings.width / settings.aspectRatio / 2);
    void handleCreateAt(cx, cy);
  }
  async function handleDelete(id) {
    if (!confirm((0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Delete this object?', 'clouds-and-spaceships'))) return;
    await onDelete(id);
  }
  const drawState = (0,_canvas__WEBPACK_IMPORTED_MODULE_6__.settingsToDrawState)(settings);

  // Help information
  const [isVisibleHelpInformation, setIsVisibleHelpInformation] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useState)(false);
  const toggleVisibleHelpInformation = () => {
    setIsVisibleHelpInformation(state => !state);
  };
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("div", {
    className: "cns-tab-panel cns-tab-panel--active",
    "data-panel": "objects",
    role: "tabpanel",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Flex, {
      gap: 2,
      direction: "column",
      align: "center",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.FlexBlock, {
        style: {
          width: '100%'
        },
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Flex, {
          gap: 4,
          align: "start",
          justify: "space-between",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.FlexItem, {
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
              variant: "tertiary",
              onClick: toggleVisibleHelpInformation,
              children: ["Help Information", isVisibleHelpInformation && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Popover, {
                headerTitle: "Help Information",
                expandOnMobile: true,
                children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("p", {
                  style: {
                    padding: '0 1em',
                    width: 320,
                    maxWidth: '100%'
                  },
                  children: "Objects are clickable icons on the map that are linked to an infobox."
                }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsxs)("ol", {
                  style: {
                    width: 320,
                    maxWidth: '100%'
                  },
                  children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("li", {
                    children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Click an object to pick it up — it follows the cursor.', 'clouds-and-spaceships')
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("li", {
                    children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Click again or press Enter to place object', 'clouds-and-spaceships')
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("li", {
                    children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Press Esc to cancel current placement.', 'clouds-and-spaceships')
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("li", {
                    children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Click empty canvas to place a new object at position.', 'clouds-and-spaceships')
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("li", {
                    children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)(' Edit object contents it in the side panel. ', 'clouds-and-spaceships')
                  }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)("li", {
                    children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('While object seleted, Enter picks it up, arrow keys nudge, Ctrl/⌘+C & V copy & paste, Ctrl/⌘+D duplicates, Delete removes.', 'clouds-and-spaceships')
                  })]
                })]
              })]
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
            variant: "primary",
            icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__["default"],
            onClick: handleAdd,
            children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Add Object', 'clouds-and-spaceships')
          })]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_canvases_ObjectsCanvas__WEBPACK_IMPORTED_MODULE_4__["default"], {
        drawState: drawState,
        objects: objects,
        selectedObjectId: selectedObjectId,
        onSelect: onSelect,
        onDeselect: onDeselect,
        onPositionUpdate: onPositionUpdate,
        onPlace: (x, y) => void handleCreateAt(x, y)
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_10__.jsx)(_lists_ObjectsList__WEBPACK_IMPORTED_MODULE_5__["default"], {
        objects: objects,
        onEdit: obj => onSelect(obj.id),
        onDuplicate: id => void onDuplicate(id),
        onDelete: handleDelete
      })]
    })
  });
}

/***/ },

/***/ "./src/map/admin/app/panels/PreviewPanel.tsx"
/*!***************************************************!*\
  !*** ./src/map/admin/app/panels/PreviewPanel.tsx ***!
  \***************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PreviewPanel)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/external.mjs");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _canvases_PreviewCanvas__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../canvases/PreviewCanvas */ "./src/map/admin/app/canvases/PreviewCanvas.tsx");
/* harmony import */ var _canvas__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../../canvas */ "./src/map/admin/canvas.ts");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__);






function PreviewPanel({
  settings,
  objects,
  areas,
  labels,
  viewUrl
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsxs)("div", {
    className: "cns-tab-panel cns-tab-panel--active",
    "data-panel": "preview",
    role: "tabpanel",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_canvases_PreviewCanvas__WEBPACK_IMPORTED_MODULE_3__["default"], {
      drawState: (0,_canvas__WEBPACK_IMPORTED_MODULE_4__.settingsToDrawState)(settings),
      objects: objects,
      areas: areas,
      labels: labels
    }), settings.description.trim() !== '' &&
    /*#__PURE__*/
    // Mirrors the frontend: description renders beneath the map.
    // Own admin input; the server sanitizes it (wp_kses_post) on save.
    (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
      className: "cns-map-description cns-map-description--preview",
      dangerouslySetInnerHTML: {
        __html: settings.description
      }
    }), viewUrl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)("div", {
      className: "cns-preview-actions",
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_5__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
        href: viewUrl,
        variant: "secondary",
        icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__["default"],
        target: "_blank",
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_2__.__)('View map page', 'clouds-and-spaceships')
      })
    })]
  });
}

/***/ },

/***/ "./src/map/admin/app/panels/SettingsPanel.tsx"
/*!****************************************************!*\
  !*** ./src/map/admin/app/panels/SettingsPanel.tsx ***!
  \****************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ SettingsPanel)
/* harmony export */ });
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/icon/index.mjs");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/chevron-left-small.mjs");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/chevron-right-small.mjs");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/info.mjs");
/* harmony import */ var _shared_admin_ColorField__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ../../../../shared/admin/ColorField */ "./src/shared/admin/ColorField.tsx");
/* harmony import */ var _shared_MediaPicker__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ../shared/MediaPicker */ "./src/map/admin/app/shared/MediaPicker.tsx");
/* harmony import */ var _canvases_SettingsCanvas__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ../canvases/SettingsCanvas */ "./src/map/admin/app/canvases/SettingsCanvas.tsx");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__);




// Custom elements




function SettingsPanel({
  settings,
  onChange
}) {
  function set(key, val) {
    onChange(prev => ({
      ...prev,
      [key]: val
    }));
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
    className: "cns-tab-panel cns-tab-panel--active",
    "data-panel": "settings",
    role: "tabpanel",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
      className: "cns-settings-layout",
      children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
        className: "cns-settings-form",
        children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
          className: "cns-grid cns-grid__24",
          children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
            className: "cns-grid__group cns-grid__span-3",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.TextControl, {
              __next40pxDefaultSize: true,
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Map Title', 'clouds-and-spaceships'),
              value: settings.title,
              placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Enter map title…', 'clouds-and-spaceships'),
              onChange: title => set('title', title)
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
            className: "cns-grid__group cns-grid__span-1",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalNumberControl, {
              __next40pxDefaultSize: true,
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Timeline value', 'clouds-and-spaceships'),
              value: settings.time,
              step: 1,
              spinControls: "native",
              isDragEnabled: true,
              isShiftStepEnabled: true,
              shiftStep: 10,
              onChange: value => set('time', parseInt(value ?? '', 10) || 0)
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
            className: "cns-grid__group cns-grid__span-4",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Flex, {
              gap: 1,
              align: "center",
              justify: "start",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ToggleControl, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('MasterMap', 'clouds-and-spaceships'),
                checked: settings.isMaster,
                onChange: v => set('isMaster', v)
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Tooltip, {
                text: "Relational map that links to other child maps.",
                placement: "top-end",
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
                  children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_icons__WEBPACK_IMPORTED_MODULE_2__["default"], {
                    icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_5__["default"],
                    size: 16
                  })
                })
              })]
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
            className: "cns-grid__group cns-grid__span-3",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.RangeControl, {
              __next40pxDefaultSize: true,
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Aspect Ratio', 'clouds-and-spaceships'),
              help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Width ÷ Height (1.77 = 16:9, 1.0 = square, 0.75 = portrait)', 'clouds-and-spaceships'),
              beforeIcon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_3__["default"],
              afterIcon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_4__["default"],
              withInputField: true,
              isShiftStepEnabled: true,
              marks: [{
                value: 0,
                label: '0'
              }, {
                value: 1,
                label: '1'
              }, {
                value: 2,
                label: '2'
              }, {
                value: 3,
                label: '3'
              }, {
                value: 4,
                label: '4'
              }],
              value: settings.aspectRatio,
              onChange: v => set('aspectRatio', v ?? 1),
              allowReset: true,
              resetFallbackValue: 1.0,
              min: 0.25,
              max: 4,
              step: 0.01
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
            className: "cns-grid__group cns-grid__span-1",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.__experimentalNumberControl, {
              __next40pxDefaultSize: true,
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Max Width (px)', 'clouds-and-spaceships'),
              min: 100,
              step: 10,
              value: settings.width,
              onChange: value => set('width', parseInt(value ?? '', 10) || 1000)
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
            className: "cns-grid__group cns-grid__span-2",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_shared_MediaPicker__WEBPACK_IMPORTED_MODULE_7__["default"], {
              imageId: settings.imageId,
              imageUrl: settings.imageUrl,
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Base Map Image', 'clouds-and-spaceships'),
              title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select Base Map Image', 'clouds-and-spaceships'),
              onChange: att => onChange(prev => ({
                ...prev,
                imageId: att ? att.id : 0,
                imageUrl: att ? att.url : ''
              }))
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
            className: "cns-grid__group cns-grid__span-2",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.Card, {
              className: "image-scale-positioning",
              children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.CardBody, {
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.RangeControl, {
                  __next40pxDefaultSize: true,
                  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Image Width', 'clouds-and-spaceships'),
                  help: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('1.0 = full canvas width. Height follows the image ratio.', 'clouds-and-spaceships'),
                  min: 0.1,
                  max: 2,
                  step: 0.01,
                  withInputField: true,
                  value: settings.imageW,
                  onChange: v => set('imageW', v ?? 1)
                })
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.CardDivider, {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.CardBody, {
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.RangeControl, {
                  __next40pxDefaultSize: true,
                  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Image Y offset', 'clouds-and-spaceships'),
                  min: 0,
                  max: 1,
                  step: 0.01,
                  withInputField: true,
                  value: settings.imageY,
                  onChange: v => set('imageY', v ?? 0)
                })
              }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.CardDivider, {}), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.CardBody, {
                children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.RangeControl, {
                  __next40pxDefaultSize: true,
                  label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Image X offset', 'clouds-and-spaceships'),
                  min: 0,
                  max: 1,
                  step: 0.01,
                  withInputField: true,
                  value: settings.imageX,
                  onChange: v => set('imageX', v ?? 0)
                })
              })]
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)("div", {
            className: "cns-grid__group cns-grid__span-2",
            children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_shared_MediaPicker__WEBPACK_IMPORTED_MODULE_7__["default"], {
              imageId: settings.thumbnailId ?? 0,
              imageUrl: settings.thumbnailUrl,
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Thumbnail', 'clouds-and-spaceships'),
              title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select Map Thumbnail', 'clouds-and-spaceships'),
              onChange: att => onChange(prev => ({
                ...prev,
                thumbnailId: att ? att.id : null,
                thumbnailUrl: att ? att.url : ''
              }))
            })
          }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsxs)("div", {
            className: "cns-grid__group cns-grid__span-2",
            children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.RadioControl, {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Map Background', 'clouds-and-spaceships'),
              selected: settings.bgType,
              options: [{
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Color', 'clouds-and-spaceships'),
                value: 'color'
              }, {
                label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Image', 'clouds-and-spaceships'),
                value: 'image'
              }],
              onChange: v => set('bgType', v)
            }), settings.bgType === 'color' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_shared_admin_ColorField__WEBPACK_IMPORTED_MODULE_6__["default"], {
              label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Background Color', 'clouds-and-spaceships'),
              value: settings.bgColor,
              onChange: v => set('bgColor', v)
            }), settings.bgType === 'image' && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_shared_MediaPicker__WEBPACK_IMPORTED_MODULE_7__["default"], {
              imageId: settings.bgImageId,
              imageUrl: settings.bgImageUrl,
              title: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_0__.__)('Select Background Image', 'clouds-and-spaceships'),
              onChange: att => onChange(prev => ({
                ...prev,
                bgImageId: att ? att.id : 0,
                bgImageUrl: att ? att.url : ''
              }))
            })]
          })]
        })
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_9__.jsx)(_canvases_SettingsCanvas__WEBPACK_IMPORTED_MODULE_8__["default"], {
        settings: settings
      })]
    })
  });
}

/***/ },

/***/ "./src/map/admin/app/shared/IconPicker.tsx"
/*!*************************************************!*\
  !*** ./src/map/admin/app/shared/IconPicker.tsx ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ IconPicker)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



function IconPicker({
  icons,
  selectedIconId,
  onSelect
}) {
  if (!icons || !icons.length) {
    return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("p", {
      className: "description",
      children: [(0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('No icons yet.', 'clouds-and-spaceships'), ' ', /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.ExternalLink, {
        href: window.cnsMapSuite.iconsUrl,
        children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Add icons', 'clouds-and-spaceships')
      })]
    });
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("div", {
    className: "cns-icon-picker-grid",
    "aria-label": (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_1__.__)('Icon library', 'clouds-and-spaceships'),
    children: icons.map(icon => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
      className: `cns-icon-item${icon.id === selectedIconId ? ' cns-icon-item--active' : ''}`,
      label: icon.title,
      "aria-pressed": icon.id === selectedIconId,
      onClick: () => onSelect(icon.id),
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("img", {
        src: icon.url,
        alt: icon.title
      })
    }, icon.id))
  });
}

/***/ },

/***/ "./src/map/admin/app/shared/MediaPicker.tsx"
/*!**************************************************!*\
  !*** ./src/map/admin/app/shared/MediaPicker.tsx ***!
  \**************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ MediaPicker)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_media_utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/media-utils */ "@wordpress/media-utils");
/* harmony import */ var _wordpress_media_utils__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_media_utils__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/image.mjs");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/pencil.mjs");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/trash.mjs");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__);





// The published types for MediaUpload declare its props as an untyped class
// component, so we re-type the render-prop surface we actually use.

const Media = _wordpress_media_utils__WEBPACK_IMPORTED_MODULE_1__.MediaUpload;
function MediaPicker({
  imageId,
  imageUrl,
  title,
  label,
  onChange
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Card, {
    className: "cns-image-picker",
    children: [label && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.CardHeader, {
      children: [" ", label]
    }), imageUrl ? /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.CardMedia, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)("img", {
        src: imageUrl,
        alt: ""
      })
    }) : /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.CardBody, {
      children: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('No image selected', 'clouds-and-spaceships')
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.CardFooter, {
      children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Flex, {
        gap: 2,
        align: "center",
        justify: "start",
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.FlexBlock, {
          style: {
            width: 'fit-content',
            flex: 'unset'
          },
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(Media, {
            title: title,
            allowedTypes: ['image'],
            multiple: false,
            value: imageId,
            onSelect: att => onChange({
              id: att.id,
              url: att.url
            }),
            render: ({
              open
            }) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
              variant: "secondary",
              icon: imageId > 0 ? _wordpress_icons__WEBPACK_IMPORTED_MODULE_3__["default"] : _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__["default"],
              label: imageId > 0 ? (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Replace image', 'clouds-and-spaceships') : (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Select image', 'clouds-and-spaceships'),
              onClick: open
            })
          })
        }), imageId > 0 && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.FlexBlock, {
          style: {
            width: 'fit-content',
            flex: 'unset'
          },
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_6__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
            variant: "tertiary",
            isDestructive: true,
            icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_4__["default"],
            label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_5__.__)('Remove image', 'clouds-and-spaceships'),
            onClick: () => onChange(null)
          })
        })]
      })
    })]
  });
}

/***/ },

/***/ "./src/map/admin/app/shared/PostSearch.tsx"
/*!*************************************************!*\
  !*** ./src/map/admin/app/shared/PostSearch.tsx ***!
  \*************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ PostSearch)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);





/**
 * Async post picker on top of ComboboxControl: typing queries the wp/v2
 * search endpoint (debounced) and fills the options list; clearing the
 * control resets the selection.
 */
function PostSearch({
  label = (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Connected post', 'clouds-and-spaceships'),
  help,
  subtype = 'any',
  selectedId,
  selectedLabel,
  onChange
}) {
  const [results, setResults] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)([]);
  const timer = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(null);
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => () => {
    if (timer.current) window.clearTimeout(timer.current);
  }, []);

  // The current selection must be present in `options` for the control to
  // render its label, so it is prepended to the fetched results.
  const options = [...(selectedId > 0 ? [{
    value: String(selectedId),
    label: selectedLabel || `#${selectedId}`
  }] : []), ...results.filter(r => r.id !== selectedId).map(r => ({
    value: String(r.id),
    label: subtype === 'any' && r.subtype ? `${r.title} (${r.subtype})` : r.title
  }))];
  function handleFilterValueChange(input) {
    if (timer.current) window.clearTimeout(timer.current);
    if (input.length < 2) return;
    timer.current = window.setTimeout(async () => {
      try {
        const data = await _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_2___default()({
          path: '/wp/v2/search?search=' + encodeURIComponent(input) + `&type=post&subtype=${subtype}&per_page=10`
        });
        if (Array.isArray(data)) setResults(data);
      } catch {
        /* silent */
      }
    }, 350);
  }
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_1__.ComboboxControl, {
    __next40pxDefaultSize: true,
    __nextHasNoMarginBottom: true,
    label: label,
    help: help,
    placeholder: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Type to search…', 'clouds-and-spaceships'),
    value: selectedId > 0 ? String(selectedId) : null,
    options: options,
    onFilterValueChange: handleFilterValueChange,
    onChange: value => {
      if (!value) {
        onChange(null);
        return;
      }
      const opt = options.find(o => o.value === value);
      onChange({
        id: parseInt(value, 10),
        title: opt?.label || ''
      });
    },
    allowReset: true
  });
}

/***/ },

/***/ "./src/map/admin/app/shared/labelFonts.ts"
/*!************************************************!*\
  !*** ./src/map/admin/app/shared/labelFonts.ts ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LABEL_FONTS: () => (/* binding */ LABEL_FONTS)
/* harmony export */ });
/**
 * Canvas label font choices, shared by the area and hierarchy region forms.
 *
 * Keep in sync with cns_map_suite_label_font_families() in
 * includes/admin/api.php — the REST layer rejects any family not on that list,
 * because canvas silently ignores an entire `ctx.font` assignment it cannot
 * parse, which would drop the size along with the family.
 */
const LABEL_FONTS = [{
  value: 'sans-serif',
  label: 'Sans-serif'
}, {
  value: 'serif',
  label: 'Serif'
}, {
  value: 'monospace',
  label: 'Monospace'
}, {
  value: 'Georgia, serif',
  label: 'Georgia'
}, {
  value: '"Times New Roman", serif',
  label: 'Times New Roman'
}, {
  value: 'Arial, sans-serif',
  label: 'Arial'
}, {
  value: 'Verdana, sans-serif',
  label: 'Verdana'
}, {
  value: '"Trebuchet MS", sans-serif',
  label: 'Trebuchet MS'
}, {
  value: '"Courier New", monospace',
  label: 'Courier New'
}];

/***/ },

/***/ "./src/map/admin/app/useCanvasKeyboard.ts"
/*!************************************************!*\
  !*** ./src/map/admin/app/useCanvasKeyboard.ts ***!
  \************************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createDebouncedNudge: () => (/* binding */ createDebouncedNudge),
/* harmony export */   useCanvasKeyboard: () => (/* binding */ useCanvasKeyboard)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./src/map/admin/utils.ts");



/**
 * Shared keyboard layer for the entity canvas tabs (objects / areas /
 * labels), modeled on the Labels tab behavior:
 *
 *   Ctrl/⌘+C / V      copy & paste (each panel keeps its own clipboard)
 *   Ctrl/⌘+D          duplicate the selected item
 *   Delete/Backspace  delete the selected item (panels confirm first)
 *   Arrow keys        nudge (Shift = 10 px)
 *   Tab / Shift+Tab   cycle sub-parts of the selection (e.g. area nodes);
 *                     falls through to normal focus traversal when unhandled
 *
 * Enter/Escape stay in the canvas components, where the drag state lives.
 *
 * The listener binds once per mount (panels unmount with their tab, which
 * scopes the shortcuts); handlers are read through a ref so they always see
 * the current render's props. Each handler returns true when it acted —
 * only then is the browser default suppressed, so e.g. arrow keys still
 * scroll the page while nothing is selected. Shortcuts never fire while
 * typing in a form field.
 */

const ARROWS = {
  ArrowUp: [0, -1],
  ArrowDown: [0, 1],
  ArrowLeft: [-1, 0],
  ArrowRight: [1, 0]
};
function useCanvasKeyboard(handlers) {
  const ref = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(handlers);
  ref.current = handlers;
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    function onKeyDown(e) {
      if ((0,_utils__WEBPACK_IMPORTED_MODULE_1__.isTypingTarget)(e)) return;
      const h = ref.current;
      const mod = e.metaKey || e.ctrlKey;
      const key = e.key.toLowerCase();
      if (mod && key === 'c') {
        // Leave real text-selection copies alone.
        if (!window.getSelection()?.toString()) h.copy?.();
        return;
      }
      if (mod && key === 'v') {
        h.paste?.();
        return;
      }
      if (mod && key === 'd') {
        if (h.duplicate?.()) e.preventDefault(); // browser "bookmark page"
        return;
      }
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (h.remove?.()) e.preventDefault();
        return;
      }
      if (e.key === 'Tab' && !mod && !e.altKey) {
        if (h.tab?.(e.shiftKey)) e.preventDefault();
        return;
      }
      if (ARROWS[e.key] && h.nudge) {
        const step = e.shiftKey ? 10 : 1;
        if (h.nudge(ARROWS[e.key][0] * step, ARROWS[e.key][1] * step)) {
          e.preventDefault(); // page scroll
        }
      }
    }
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, []);
}

/**
 * Debounced arrow-key nudging for point-positioned entities (objects,
 * labels): the canvas updates immediately via applyLocal, and persist fires
 * once the keys go quiet so holding an arrow doesn't PATCH per pixel.
 * Create once per mount (closures must read live state, e.g. via refs) and
 * call flush() on unmount so a pending nudge isn't lost.
 */

function createDebouncedNudge(getSelected, applyLocal, persist, delay = 500) {
  let timer = null;
  let pending = null;
  function flush() {
    if (timer) {
      window.clearTimeout(timer);
      timer = null;
    }
    const p = pending;
    pending = null;
    if (p) persist(p.id, p.x, p.y);
  }
  function nudge(dx, dy) {
    const item = getSelected();
    if (!item) return false;
    // Switching selection mid-debounce: persist the previous item first.
    if (pending && pending.id !== item.id) flush();
    const base = pending ?? {
      id: item.id,
      x: item.x,
      y: item.y
    };
    const x = Math.max(0, base.x + dx);
    const y = Math.max(0, base.y + dy);
    pending = {
      id: item.id,
      x,
      y
    };
    applyLocal(item.id, x, y);
    if (timer) window.clearTimeout(timer);
    timer = window.setTimeout(flush, delay);
    return true;
  }
  return {
    nudge,
    flush
  };
}

/***/ },

/***/ "./src/map/admin/app/useMapResource.ts"
/*!*********************************************!*\
  !*** ./src/map/admin/app/useMapResource.ts ***!
  \*********************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useMapResource: () => (/* binding */ useMapResource)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../utils */ "./src/map/admin/utils.ts");



/**
 * Loads a map-scoped REST collection (objects / areas / labels / hierarchy)
 * once per panel mount and hands the rows to the parent-owned list state.
 * Errors are swallowed — the panel simply starts empty, matching the
 * previous inline behavior in every panel.
 */
function useMapResource(mapId, resource, onLoaded) {
  const [initialized, setInitialized] = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useState)(false);
  const onLoadedRef = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useRef)(onLoaded);
  onLoadedRef.current = onLoaded;
  (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.useEffect)(() => {
    if (initialized || !mapId) return;
    (0,_utils__WEBPACK_IMPORTED_MODULE_1__.apiFetch)('GET', `/maps/${mapId}/${resource}`).then(data => {
      if (Array.isArray(data)) onLoadedRef.current(data);
    }).catch(() => {}).finally(() => setInitialized(true));
  }, [mapId]);
}

/***/ },

/***/ "./src/map/admin/areas.ts"
/*!********************************!*\
  !*** ./src/map/admin/areas.ts ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   NODE_HALF: () => (/* binding */ NODE_HALF),
/* harmony export */   applyRectangleConstraint: () => (/* binding */ applyRectangleConstraint),
/* harmony export */   canRemoveAreaNode: () => (/* binding */ canRemoveAreaNode),
/* harmony export */   drawAreaShape: () => (/* binding */ drawAreaShape),
/* harmony export */   drawAreasOnCanvas: () => (/* binding */ drawAreasOnCanvas),
/* harmony export */   drawNodeHandle: () => (/* binding */ drawNodeHandle),
/* harmony export */   findAreaAtPoint: () => (/* reexport safe */ _shared_map_geometry__WEBPACK_IMPORTED_MODULE_1__.findAreaAtPoint),
/* harmony export */   findNodeAtPoint: () => (/* binding */ findNodeAtPoint),
/* harmony export */   getDefaultNodes: () => (/* binding */ getDefaultNodes),
/* harmony export */   getLiveNodes: () => (/* binding */ getLiveNodes),
/* harmony export */   moveAreaNode: () => (/* binding */ moveAreaNode),
/* harmony export */   normalizeNodesForShapeType: () => (/* binding */ normalizeNodesForShapeType)
/* harmony export */ });
/* harmony import */ var _canvas__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./canvas */ "./src/map/admin/canvas.ts");
/* harmony import */ var _shared_map_geometry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../shared/map-geometry */ "./src/shared/map-geometry.ts");


// Path building and area hit-testing live in src/shared/map-geometry.ts so
// the editor and the frontend map block trace identical shapes.


// Node handles: half-width in canvas px, and a fixed palette that ignores the
// shape's own colors so a handle stays legible over any fill or stroke.
const NODE_HALF = 7.5;
const NODE_FILL = 'rgba(255,255,255,0.75)';
const NODE_STROKE = '#000000';
const NODE_ACTIVE_FILL = '#e75252';
const NODE_ACTIVE_STROKE = '#ffffff';

/** Draws one draggable node handle centered on canvas pixel ( x, y ). */
function drawNodeHandle(ctx, x, y, isActive) {
  ctx.beginPath();
  ctx.rect(x - NODE_HALF, y - NODE_HALF, NODE_HALF * 2, NODE_HALF * 2);
  ctx.fillStyle = isActive ? NODE_ACTIVE_FILL : NODE_FILL;
  ctx.fill();
  ctx.strokeStyle = isActive ? NODE_ACTIVE_STROKE : NODE_STROKE;
  ctx.lineWidth = 2;
  ctx.stroke();
}

// ── Shape helpers ─────────────────────────────────────────────────────────────

// Nodes are TL(0) TR(1) BR(2) BL(3); adjacent pairs share one axis.
function applyRectangleConstraint(nodes, movedIdx, newX, newY) {
  if (nodes.length !== 4) return null;
  const n = nodes.map(nd => ({
    ...nd
  }));
  n[movedIdx] = {
    x: newX,
    y: newY
  };
  switch (movedIdx) {
    case 0:
      n[1].y = newY;
      n[3].x = newX;
      break;
    case 1:
      n[0].y = newY;
      n[2].x = newX;
      break;
    case 2:
      n[3].y = newY;
      n[1].x = newX;
      break;
    case 3:
      n[2].y = newY;
      n[0].x = newX;
      break;
  }
  return n;
}
function getDefaultNodes(shapeType) {
  if (shapeType === 'CIRCLE') {
    return [{
      x: 0.5,
      y: 0.5
    }, {
      x: 0.7,
      y: 0.65
    }];
  }
  return [{
    x: 0.25,
    y: 0.25
  }, {
    x: 0.75,
    y: 0.25
  }, {
    x: 0.75,
    y: 0.75
  }, {
    x: 0.25,
    y: 0.75
  }];
}

// Anything with a shape and nodes — areas and hierarchy regions both qualify,
// so the constraint helpers below serve both editors.

/**
 * Moves one node of a shape to new normalized (0–1) coordinates, honoring
 * the shape's constraints: rectangles keep their corners axis-aligned, and
 * moving a circle's center drags the radius node along. Returns a new array.
 */
function moveAreaNode(area, idx, newX, newY) {
  const st = area.shape_type || 'POLYGON';
  let updated = (area.nodes || []).map(n => ({
    ...n
  }));
  if (st === 'RECTANGLE') {
    updated = applyRectangleConstraint(updated, idx, newX, newY) || updated;
  } else if (st === 'CIRCLE' && idx === 0) {
    const dx = newX - updated[0].x;
    const dy = newY - updated[0].y;
    updated[0] = {
      x: newX,
      y: newY
    };
    if (updated[1]) updated[1] = {
      x: updated[1].x + dx,
      y: updated[1].y + dy
    };
  } else {
    updated[idx] = {
      x: newX,
      y: newY
    };
  }
  return updated;
}

/** Whether a node can be removed from the shape (fixed-node shapes can't shrink). */
function canRemoveAreaNode(area) {
  const st = area.shape_type || 'POLYGON';
  return (st === 'POLYGON' || st === 'BEZIER') && (area.nodes || []).length > 3;
}
function normalizeNodesForShapeType(nodes, shapeType) {
  if (shapeType === 'RECTANGLE') {
    return nodes.length === 4 ? nodes : getDefaultNodes('RECTANGLE');
  }
  if (shapeType === 'CIRCLE') {
    if (nodes.length >= 2) return nodes.slice(0, 2);
    if (nodes.length === 1) return [nodes[0], {
      x: nodes[0].x + 0.2,
      y: nodes[0].y + 0.15
    }];
    return getDefaultNodes('CIRCLE');
  }
  return nodes;
}
function getLiveNodes(nodes, shapeType, movingIdx, cursor, W, H) {
  if (movingIdx === null || !cursor) return nodes;
  const newX = cursor.x / W;
  const newY = cursor.y / H;
  if (shapeType === 'RECTANGLE') {
    return applyRectangleConstraint(nodes, movingIdx, newX, newY) || nodes;
  }
  const live = nodes.map(n => ({
    ...n
  }));
  if (shapeType === 'CIRCLE' && movingIdx === 0) {
    const dx = newX - nodes[0].x;
    const dy = newY - nodes[0].y;
    live[0] = {
      x: newX,
      y: newY
    };
    if (live[1]) live[1] = {
      x: nodes[1].x + dx,
      y: nodes[1].y + dy
    };
  } else {
    live[movingIdx] = {
      x: newX,
      y: newY
    };
  }
  return live;
}

// ── Canvas rendering ──────────────────────────────────────────────────────────

// repoNodeIdx / repoCursor / focusedNodeIdx are only meaningful when
// isSelected === true. focusedNodeIdx marks the keyboard-focused node
// (Tab cycling); a node being repositioned takes visual precedence.
function drawAreaShape(ctx, area, W, H, isSelected, repoNodeIdx, repoCursor, focusedNodeIdx = null) {
  const rawNodes = area.nodes || [];
  if (!rawNodes.length) return;
  const shapeType = area.shape_type || 'POLYGON';
  const liveNodes = isSelected ? getLiveNodes(rawNodes, shapeType, repoNodeIdx, repoCursor, W, H) : rawNodes;
  const minNodes = shapeType === 'CIRCLE' ? 2 : 3;
  if (liveNodes.length >= minNodes) {
    const styles = area.canvas_styles || {};
    const fill = styles.fill || '#2271b14d';
    const stroke = styles.stroke || '#2271b1';
    const strokeWidth = styles.strokeWidth || 2;
    (0,_shared_map_geometry__WEBPACK_IMPORTED_MODULE_1__.buildAreaPathFromNodes)(ctx, liveNodes, shapeType, W, H);
    ctx.fillStyle = fill;
    ctx.fill();
    ctx.strokeStyle = stroke;
    ctx.lineWidth = isSelected ? Math.max(strokeWidth, 2) : strokeWidth;
    ctx.stroke();
    (0,_shared_map_geometry__WEBPACK_IMPORTED_MODULE_1__.drawShapeLabel)(ctx, (0,_shared_map_geometry__WEBPACK_IMPORTED_MODULE_1__.areaLabelText)(area), styles, liveNodes, shapeType, W, H);
  }
  if (!isSelected) return;
  liveNodes.forEach((node, idx) => {
    // "Active" is the node being moved, or the keyboard-focused one when
    // nothing is being moved — the node Delete and the arrow keys act on.
    const isActive = repoNodeIdx === idx || repoNodeIdx === null && focusedNodeIdx === idx;
    drawNodeHandle(ctx, node.x * W, node.y * H, isActive);
  });
}
async function drawAreasOnCanvas(canvas, drawState, areas, selectedAreaId, repoNodeIdx, repoCursor, focusedNodeIdx = null) {
  await (0,_canvas__WEBPACK_IMPORTED_MODULE_0__.drawMapCanvas)(canvas, drawState);
  const ctx = canvas.getContext('2d');
  const W = canvas.width;
  const H = canvas.height;
  for (const area of areas) {
    const isSel = area.id === selectedAreaId;
    drawAreaShape(ctx, area, W, H, isSel, isSel ? repoNodeIdx : null, isSel ? repoCursor : null, isSel ? focusedNodeIdx : null);
  }
}

// ── Hit detection (editor-only: node handles) ─────────────────────────────────

function findNodeAtPoint(ctx, x, y, nodes, W, H) {
  for (let i = nodes.length - 1; i >= 0; i--) {
    ctx.beginPath();
    ctx.rect(nodes[i].x * W - NODE_HALF, nodes[i].y * H - NODE_HALF, NODE_HALF * 2, NODE_HALF * 2);
    if (ctx.isPointInPath(x, y)) return i;
  }
  return -1;
}

/***/ },

/***/ "./src/map/admin/canvas.ts"
/*!*********************************!*\
  !*** ./src/map/admin/canvas.ts ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   drawFullCanvas: () => (/* binding */ drawFullCanvas),
/* harmony export */   drawMapCanvas: () => (/* binding */ drawMapCanvas),
/* harmony export */   getCanvasCoords: () => (/* binding */ getCanvasCoords),
/* harmony export */   settingsToDrawState: () => (/* binding */ settingsToDrawState)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/map/admin/utils.ts");

async function drawMapCanvas(canvasEl, state) {
  const ctx = canvasEl.getContext('2d');
  const width = state.width;
  const height = Math.round(width / state.aspectRatio);
  canvasEl.width = width;
  canvasEl.height = height;
  ctx.clearRect(0, 0, width, height);
  if (state.bgType === 'image') {
    const bgImg = await (0,_utils__WEBPACK_IMPORTED_MODULE_0__.loadImage)(state.bgImageUrl);
    if (bgImg) {
      const scale = Math.max(width / bgImg.naturalWidth, height / bgImg.naturalHeight);
      const drawW = bgImg.naturalWidth * scale;
      const drawH = bgImg.naturalHeight * scale;
      ctx.drawImage(bgImg, (width - drawW) / 2, (height - drawH) / 2, drawW, drawH);
    } else {
      ctx.fillStyle = '#888';
      ctx.fillRect(0, 0, width, height);
    }
  } else {
    ctx.fillStyle = state.bgColor;
    ctx.fillRect(0, 0, width, height);
  }
  const mapImg = await (0,_utils__WEBPACK_IMPORTED_MODULE_0__.loadImage)(state.imgUrl);
  if (mapImg) {
    const drawW = width * state.imageW;
    const drawH = drawW * (mapImg.naturalHeight / mapImg.naturalWidth);
    ctx.drawImage(mapImg, width * state.imageX, height * state.imageY, drawW, drawH);
  }
}
function getCanvasCoords(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: Math.round((event.clientX - rect.left) * (canvas.width / rect.width)),
    y: Math.round((event.clientY - rect.top) * (canvas.height / rect.height))
  };
}
function settingsToDrawState(s) {
  return {
    width: s.width,
    aspectRatio: s.aspectRatio,
    bgType: s.bgType,
    bgColor: s.bgColor,
    bgImageUrl: s.bgImageUrl,
    imgUrl: s.imageUrl,
    imageX: s.imageX,
    imageY: s.imageY,
    imageW: s.imageW
  };
}

// drawAreaFn / drawObjectFn are passed in to avoid circular imports.
async function drawFullCanvas(canvas, objects, areas, state, drawAreaFn, drawObjectFn) {
  await drawMapCanvas(canvas, state);
  const ctx = canvas.getContext('2d');
  for (const area of areas) drawAreaFn(ctx, area, canvas.width, canvas.height, false, null, null);
  for (const obj of objects) await drawObjectFn(ctx, obj, false);
}

/***/ },

/***/ "./src/map/admin/icons.ts"
/*!********************************!*\
  !*** ./src/map/admin/icons.ts ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   iconLibraryCache: () => (/* binding */ iconLibraryCache),
/* harmony export */   loadIconLibraryIntoCache: () => (/* binding */ loadIconLibraryIntoCache)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/map/admin/utils.ts");

let iconLibraryCache = null;
async function loadIconLibraryIntoCache() {
  try {
    iconLibraryCache = await (0,_utils__WEBPACK_IMPORTED_MODULE_0__.apiFetch)('GET', '/icons');
  } catch {
    iconLibraryCache = [];
  }
}

/***/ },

/***/ "./src/map/admin/labels.ts"
/*!*********************************!*\
  !*** ./src/map/admin/labels.ts ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   drawLabelShape: () => (/* reexport safe */ _shared_map_geometry__WEBPACK_IMPORTED_MODULE_1__.drawLabelShape),
/* harmony export */   drawLabelsOnCanvas: () => (/* binding */ drawLabelsOnCanvas),
/* harmony export */   findLabelPartAtPoint: () => (/* reexport safe */ _shared_map_geometry__WEBPACK_IMPORTED_MODULE_1__.findLabelPartAtPoint),
/* harmony export */   measureLabelBox: () => (/* reexport safe */ _shared_map_geometry__WEBPACK_IMPORTED_MODULE_1__.measureLabelBox),
/* harmony export */   traceRoundedRect: () => (/* reexport safe */ _shared_map_geometry__WEBPACK_IMPORTED_MODULE_1__.traceRoundedRect)
/* harmony export */ });
/* harmony import */ var _canvas__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./canvas */ "./src/map/admin/canvas.ts");
/* harmony import */ var _shared_map_geometry__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../../shared/map-geometry */ "./src/shared/map-geometry.ts");


// Geometry, drawing, and hit-testing live in src/shared/map-geometry.ts so
// the editor and the frontend map block render labels identically. This
// module only adds the editor-specific composition (map background + all
// labels + selection ring / empty placeholder).

async function drawLabelsOnCanvas(canvas, drawState, labels, selectedLabelId) {
  await (0,_canvas__WEBPACK_IMPORTED_MODULE_0__.drawMapCanvas)(canvas, drawState);
  const ctx = canvas.getContext('2d');
  for (const label of labels) {
    (0,_shared_map_geometry__WEBPACK_IMPORTED_MODULE_1__.drawLabelShape)(ctx, label, {
      selected: selectedLabelId === label.id,
      showEmptyPlaceholder: true
    });
  }
}

/***/ },

/***/ "./src/map/admin/objects.ts"
/*!**********************************!*\
  !*** ./src/map/admin/objects.ts ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   drawObjectMarker: () => (/* binding */ drawObjectMarker),
/* harmony export */   drawObjectsOnCanvas: () => (/* binding */ drawObjectsOnCanvas),
/* harmony export */   findObjectAtPoint: () => (/* reexport safe */ _shared_map_geometry__WEBPACK_IMPORTED_MODULE_2__.findObjectAtPoint)
/* harmony export */ });
/* harmony import */ var _utils__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./utils */ "./src/map/admin/utils.ts");
/* harmony import */ var _canvas__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./canvas */ "./src/map/admin/canvas.ts");
/* harmony import */ var _shared_map_geometry__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../../shared/map-geometry */ "./src/shared/map-geometry.ts");


// Marker hit-testing lives in src/shared/map-geometry.ts so the editor and
// the frontend map block agree on the clickable region.


// ── Canvas rendering ──────────────────────────────────────────────────────────

function drawFallbackMarker(ctx, x, y, size, fill, stroke) {
  ctx.save();
  ctx.beginPath();
  ctx.arc(x, y, size / 2, 0, Math.PI * 2);
  ctx.fillStyle = fill || '#2271b1';
  ctx.strokeStyle = stroke || '#fff';
  ctx.lineWidth = 2;
  ctx.fill();
  ctx.stroke();
  ctx.restore();
}
async function drawObjectMarker(ctx, obj, isSelected) {
  const size = obj.canvas_styles?.size ?? 32;
  const fill = obj.canvas_styles?.fillStyle ?? '#ffffff';
  const stroke = obj.canvas_styles?.strokeStyle ?? '#2271b1';
  if (obj.icon_url) {
    const img = obj.icon_mime === 'image/svg+xml' ? await (0,_utils__WEBPACK_IMPORTED_MODULE_0__.loadSvgWithColors)(obj.icon_url, fill, stroke) : await (0,_utils__WEBPACK_IMPORTED_MODULE_0__.loadImage)(obj.icon_url);
    if (img) {
      ctx.drawImage(img, obj.x - size / 2, obj.y - size / 2, size, size);
    } else {
      drawFallbackMarker(ctx, obj.x, obj.y, size, fill, stroke);
    }
  } else {
    drawFallbackMarker(ctx, obj.x, obj.y, size, fill, stroke);
  }
  if (isSelected) {
    ctx.save();
    ctx.beginPath();
    ctx.arc(obj.x, obj.y, size / 2 + 4, 0, Math.PI * 2);
    ctx.strokeStyle = '#2271b1';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    ctx.stroke();
    ctx.restore();
  }
}
async function drawObjectsOnCanvas(canvas, drawState, objects, selectedObjectId, repositioningId, repositionCursor) {
  await (0,_canvas__WEBPACK_IMPORTED_MODULE_1__.drawMapCanvas)(canvas, drawState);
  const ctx = canvas.getContext('2d');
  for (const obj of objects) {
    if (repositioningId === obj.id && repositionCursor) {
      await drawObjectMarker(ctx, {
        ...obj,
        ...repositionCursor
      }, true);
    } else {
      await drawObjectMarker(ctx, obj, selectedObjectId === obj.id);
    }
  }
}

/***/ },

/***/ "./src/map/admin/utils.ts"
/*!********************************!*\
  !*** ./src/map/admin/utils.ts ***!
  \********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   apiFetch: () => (/* binding */ apiFetch),
/* harmony export */   isTypingTarget: () => (/* binding */ isTypingTarget),
/* harmony export */   loadImage: () => (/* binding */ loadImage),
/* harmony export */   loadSvgWithColors: () => (/* binding */ loadSvgWithColors)
/* harmony export */ });
/* harmony import */ var _shared_admin_api__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../shared/admin/api */ "./src/shared/admin/api.ts");


/** Map-suite REST namespace. */
const apiFetch = (0,_shared_admin_api__WEBPACK_IMPORTED_MODULE_0__.createApiFetch)('/cns-map-suite/v1');

// ── Keyboard ──────────────────────────────────────────────────────────────────

/**
 * True when the event originates from a form field, so canvas keyboard
 * shortcuts don't hijack typing (Enter in a text input, Backspace while
 * editing, arrow keys in number fields, …).
 */
function isTypingTarget(e) {
  const t = e.target;
  return !!t && typeof t.closest === 'function' && !!t.closest('input, textarea, select, [contenteditable="true"]');
}

// ── Image cache ───────────────────────────────────────────────────────────────

const imageCache = {};
function loadImage(url) {
  if (!url) return Promise.resolve(null);
  if (imageCache[url]) return Promise.resolve(imageCache[url]);
  return new Promise(resolve => {
    const img = new Image();
    img.onload = () => {
      imageCache[url] = img;
      resolve(img);
    };
    img.onerror = () => {
      resolve(null);
    };
    img.src = url;
  });
}
async function loadSvgWithColors(url, fill, stroke) {
  const key = `${url}|${fill ?? ''}|${stroke ?? ''}`;
  if (imageCache[key]) return imageCache[key];
  try {
    const resp = await fetch(url, {
      credentials: 'same-origin'
    });
    const text = await resp.text();
    const doc = new DOMParser().parseFromString(text, 'image/svg+xml');
    const svg = doc.documentElement;
    if (fill) svg.setAttribute('fill', fill);
    if (stroke) svg.setAttribute('stroke', stroke);
    const blob = new Blob([new XMLSerializer().serializeToString(doc)], {
      type: 'image/svg+xml'
    });
    const blobUrl = URL.createObjectURL(blob);
    return new Promise(resolve => {
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(blobUrl);
        imageCache[key] = img;
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(blobUrl);
        resolve(null);
      };
      img.src = blobUrl;
    });
  } catch {
    return null;
  }
}

/***/ },

/***/ "./src/map/choices.ts"
/*!****************************!*\
  !*** ./src/map/choices.ts ***!
  \****************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   AREA_TYPES: () => (/* binding */ AREA_TYPES),
/* harmony export */   AREA_TYPE_DEFAULT: () => (/* binding */ AREA_TYPE_DEFAULT),
/* harmony export */   OBJECT_TYPES: () => (/* binding */ OBJECT_TYPES),
/* harmony export */   OBJECT_TYPE_DEFAULT: () => (/* binding */ OBJECT_TYPE_DEFAULT),
/* harmony export */   SHAPE_TYPES: () => (/* binding */ SHAPE_TYPES),
/* harmony export */   SHAPE_TYPE_DEFAULT: () => (/* binding */ SHAPE_TYPE_DEFAULT)
/* harmony export */ });
/**
 * Enumerated choices that back both a TypeScript union and a form dropdown.
 *
 * Each choice list is the single source of truth: the union type is derived
 * from it, so adding or removing an entry updates the type, the dropdown, and
 * every exhaustiveness check at once. The exported default goes with the list
 * so the form and the REST layer cannot disagree about it.
 *
 * Keep in sync with the matching helpers under "Enumerated choices" in
 * includes/admin/api.php — the REST layer rejects any value not on its list.
 */

// ── Area types ────────────────────────────────────────────────────────────────
// Keep in sync with cns_map_suite_area_types() in includes/admin/api.php.

const AREA_TYPE_CHOICES = [{
  value: 'POLITICAL',
  label: 'Political'
}, {
  value: 'GEOGRAPHY',
  label: 'Geography'
}, {
  value: 'HISTORY',
  label: 'History'
}, {
  value: 'NATURAL',
  label: 'Natural'
}, {
  value: 'EVENT',
  label: 'Event'
}, {
  value: 'OTHER',
  label: 'Other'
}];
/** Mutable copy for `SelectControl`, which does not accept readonly options. */
const AREA_TYPES = [...AREA_TYPE_CHOICES];
const AREA_TYPE_DEFAULT = 'POLITICAL';

// ── Object types ──────────────────────────────────────────────────────────────
// Keep in sync with cns_map_suite_object_types() in includes/admin/api.php.

const OBJECT_TYPE_CHOICES = [{
  value: 'LOCATION',
  label: 'Location'
}, {
  value: 'HISTORY',
  label: 'History'
}, {
  value: 'NATURAL',
  label: 'Natural'
}, {
  value: 'EVENT',
  label: 'Event'
}, {
  value: 'OTHER',
  label: 'Other'
}];
const OBJECT_TYPES = [...OBJECT_TYPE_CHOICES];
const OBJECT_TYPE_DEFAULT = 'LOCATION';

// ── Shape types ───────────────────────────────────────────────────────────────
// Shared by areas and hierarchy regions. Keep in sync with
// cns_map_suite_shape_types() in includes/admin/api.php.

const SHAPE_TYPE_CHOICES = [{
  value: 'POLYGON',
  label: 'Polygon (Nodes)'
}, {
  value: 'RECTANGLE',
  label: 'Rectangle'
}, {
  value: 'BEZIER',
  label: 'Bezier Curve'
}, {
  value: 'CIRCLE',
  label: 'Circle / Oval'
}];
const SHAPE_TYPES = [...SHAPE_TYPE_CHOICES];
const SHAPE_TYPE_DEFAULT = 'POLYGON';

/***/ },

/***/ "./src/shared/admin/ColorField.tsx"
/*!*****************************************!*\
  !*** ./src/shared/admin/ColorField.tsx ***!
  \*****************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ ColorField)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__);



/**
 * Compact color control: a swatch button that opens the wp ColorPicker in a
 * popover — the same pattern the block editor uses for inline color fields.
 *
 * `ColorPicker` emits exactly the `#rrggbb`/`#rrggbbaa` this stores, and
 * canvas accepts it verbatim as a fill or stroke style, so no conversion
 * happens anywhere between the picker and the pixels.
 */
function ColorField({
  label,
  value,
  onChange,
  enableAlpha = true
}) {
  const id = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_1__.useRef)(`cns-color-${Math.random().toString(36).slice(2)}`);

  // Show `#2271b1 · 30%` rather than the raw `#2271b14d` — the alpha byte is
  // unreadable, and the percentage is the part worth showing.
  const isHex8 = /^#[0-9a-f]{8}$/i.test(value);
  const alphaByte = isHex8 ? parseInt(value.slice(7), 16) : 255;
  const alphaPct = alphaByte < 255 ? Math.round(alphaByte / 255 * 100) : null;
  const rgbText = isHex8 ? value.slice(0, 7) : value;
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.BaseControl, {
    __nextHasNoMarginBottom: true,
    id: id.current,
    label: label,
    className: "cns-color-field",
    children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Dropdown, {
      popoverProps: {
        placement: 'bottom-start'
      },
      renderToggle: ({
        isOpen,
        onToggle
      }) => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
        id: id.current,
        className: "cns-color-field__toggle",
        onClick: onToggle,
        "aria-expanded": isOpen,
        children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
          className: "cns-color-field__swatch",
          children: /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.ColorIndicator, {
            colorValue: value
          })
        }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsxs)("span", {
          className: "cns-color-field__value",
          children: [rgbText, alphaPct !== null && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)("span", {
            className: "cns-color-field__alpha",
            children: ` · ${alphaPct}%`
          })]
        })]
      }),
      renderContent: () => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_2__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.ColorPicker, {
        color: value,
        onChange: onChange,
        enableAlpha: enableAlpha
      })
    })
  });
}

/***/ },

/***/ "./src/shared/admin/EditorHeader.tsx"
/*!*******************************************!*\
  !*** ./src/shared/admin/EditorHeader.tsx ***!
  \*******************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ EditorHeader)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/arrow-left.mjs");
/* harmony import */ var _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/icons */ "./node_modules/@wordpress/icons/build-module/library/external.mjs");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! @wordpress/i18n */ "@wordpress/i18n");
/* harmony import */ var _wordpress_i18n__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);




const STATUS_OPTIONS = [{
  value: 'draft',
  label: 'Draft'
}, {
  value: 'publish',
  label: 'Published'
}, {
  value: 'private',
  label: 'Private'
}];
/**
 * Editor chrome shared by the map and story editors: back link, title, post
 * status, view link, and the save button. The three action labels are passed
 * in because they name the entity being edited; everything else is identical.
 */
function EditorHeader({
  pageTitle,
  overviewUrl,
  viewUrl,
  status,
  onStatusChange,
  isSaving,
  onSave,
  backLabel,
  viewLabel,
  saveLabel
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
    className: "cns-map-editor__header",
    children: [/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
      href: overviewUrl,
      variant: "tertiary",
      icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_1__["default"],
      children: backLabel
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)("h1", {
      children: pageTitle
    }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsxs)("div", {
      className: "cns-map-editor__header-actions",
      children: [viewUrl && /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
        href: viewUrl,
        variant: "secondary",
        icon: _wordpress_icons__WEBPACK_IMPORTED_MODULE_2__["default"],
        target: "_blank",
        children: viewLabel
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.SelectControl, {
        __next40pxDefaultSize: true,
        __nextHasNoMarginBottom: true,
        label: (0,_wordpress_i18n__WEBPACK_IMPORTED_MODULE_3__.__)('Post status', 'clouds-and-spaceships'),
        hideLabelFromVision: true,
        value: status,
        options: STATUS_OPTIONS,
        onChange: v => onStatusChange(v)
      }), /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.Button, {
        variant: "primary",
        isBusy: isSaving,
        disabled: isSaving,
        onClick: () => onSave(),
        children: saveLabel
      })]
    })]
  });
}

/***/ },

/***/ "./src/shared/admin/Notices.tsx"
/*!**************************************!*\
  !*** ./src/shared/admin/Notices.tsx ***!
  \**************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ Notices)
/* harmony export */ });
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/components */ "@wordpress/components");
/* harmony import */ var _wordpress_components__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! @wordpress/data */ "@wordpress/data");
/* harmony import */ var _wordpress_data__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(_wordpress_data__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _wordpress_notices__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! @wordpress/notices */ "@wordpress/notices");
/* harmony import */ var _wordpress_notices__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(_wordpress_notices__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__);




/**
 * Renders snackbar notices from the wp/notices store — the same pattern the
 * block editor uses. Dispatch with createSuccessNotice/createErrorNotice and
 * `{ type: 'snackbar' }`.
 */

function Notices() {
  const notices = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.useSelect)(select => select(_wordpress_notices__WEBPACK_IMPORTED_MODULE_2__.store).getNotices(), []);
  const {
    removeNotice
  } = (0,_wordpress_data__WEBPACK_IMPORTED_MODULE_1__.useDispatch)(_wordpress_notices__WEBPACK_IMPORTED_MODULE_2__.store);
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_3__.jsx)(_wordpress_components__WEBPACK_IMPORTED_MODULE_0__.SnackbarList, {
    className: "cns-snackbar-list",
    notices: notices.filter(n => n.type === 'snackbar'),
    onRemove: removeNotice
  });
}

/***/ },

/***/ "./src/shared/admin/TabBar.tsx"
/*!*************************************!*\
  !*** ./src/shared/admin/TabBar.tsx ***!
  \*************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ TabBar)
/* harmony export */ });
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__);

/**
 * Tab strip shared by the map and story editors. Which tabs exist — and, for
 * the map editor, which ones are visible for the current map — is decided by
 * the caller; this only renders the list it is given.
 */
function TabBar({
  tabs,
  activeTab,
  onChange,
  ariaLabel
}) {
  return /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("nav", {
    className: "cns-map-editor__tabs",
    role: "tablist",
    "aria-label": ariaLabel,
    children: tabs.map(t => /*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_0__.jsx)("button", {
      className: `cns-tab${activeTab === t.id ? ' cns-tab--active' : ''}`,
      role: "tab",
      "aria-selected": activeTab === t.id,
      onClick: () => onChange(t.id),
      children: t.label
    }, t.id))
  });
}

/***/ },

/***/ "./src/shared/admin/api.ts"
/*!*********************************!*\
  !*** ./src/shared/admin/api.ts ***!
  \*********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   createApiFetch: () => (/* binding */ createApiFetch)
/* harmony export */ });
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/api-fetch */ "@wordpress/api-fetch");
/* harmony import */ var _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0__);

/**
 * Builds a thin wrapper over @wordpress/api-fetch pinned to one REST
 * namespace. Nonce and REST root come from core's api-fetch middleware. The
 * returned function resolves with the parsed JSON body and rejects with the
 * REST error object ({ code, message, data }) on any non-2xx response —
 * callers read `.message` off the rejection.
 */
function createApiFetch(namespace) {
  return function apiFetch(method, path, data) {
    return _wordpress_api_fetch__WEBPACK_IMPORTED_MODULE_0___default()({
      path: namespace + path,
      method,
      data
    });
  };
}

/***/ },

/***/ "./src/shared/map-geometry.ts"
/*!************************************!*\
  !*** ./src/shared/map-geometry.ts ***!
  \************************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   LABEL_COLOR: () => (/* binding */ LABEL_COLOR),
/* harmony export */   LABEL_FONT_FAMILY: () => (/* binding */ LABEL_FONT_FAMILY),
/* harmony export */   LABEL_FONT_SIZE: () => (/* binding */ LABEL_FONT_SIZE),
/* harmony export */   areaLabelText: () => (/* binding */ areaLabelText),
/* harmony export */   buildAreaPathFromNodes: () => (/* binding */ buildAreaPathFromNodes),
/* harmony export */   buildPolygonPath: () => (/* binding */ buildPolygonPath),
/* harmony export */   drawLabelShape: () => (/* binding */ drawLabelShape),
/* harmony export */   drawShapeLabel: () => (/* binding */ drawShapeLabel),
/* harmony export */   findAreaAtPoint: () => (/* binding */ findAreaAtPoint),
/* harmony export */   findLabelPartAtPoint: () => (/* binding */ findLabelPartAtPoint),
/* harmony export */   findObjectAtPoint: () => (/* binding */ findObjectAtPoint),
/* harmony export */   measureLabelBox: () => (/* binding */ measureLabelBox),
/* harmony export */   regionLabelText: () => (/* binding */ regionLabelText),
/* harmony export */   traceRoundedRect: () => (/* binding */ traceRoundedRect)
/* harmony export */ });
/**
 * Canvas geometry shared between the admin editor (src/admin) and the
 * frontend map block (src/blocks/map/view.js). Both bundles come out of the
 * same webpack build, so keeping the math here makes editor and frontend
 * pixel-identical by construction — any change to hit areas, label boxes, or
 * shape paths lands in both automatically.
 */

// ── Shape labels ──────────────────────────────────────────────────────────────
// Map areas and hierarchy regions both label themselves at the shape's center,
// with the same styling controls, so the drawing lives here once.

const LABEL_FONT_FAMILY = 'sans-serif';
const LABEL_FONT_SIZE = 12;
const LABEL_COLOR = '#ffffff';

/**
 * A hierarchy region's label text: the infobox title override wins over the
 * child map's own title, so relabelling a region on the parent map does not
 * require renaming the map it points at.
 */
function regionLabelText(region) {
  return (region.title_override || region.child_map_title || '').trim();
}

/**
 * An area's label text: the infobox title override wins over the area's own
 * title, mirroring how hierarchy regions resolve theirs.
 */
function areaLabelText(area) {
  return (area.infobox_data?.title || area.title || '').trim();
}

/**
 * Draws a shape's label at its center. Circles label the center node; every
 * other shape uses the node centroid.
 *
 * The text is drawn flat, with no halo behind it — contrast against the map
 * artwork is the author's to choose via the label color.
 */
function drawShapeLabel(ctx, text, styles, nodes, shapeType, W, H) {
  if (!text || !nodes.length) return;
  const s = styles || {};
  if (s.labelHidden) return;
  const family = s.labelFontFamily || LABEL_FONT_FAMILY;
  const size = s.labelFontSize || LABEL_FONT_SIZE;
  const color = s.labelColor || LABEL_COLOR;
  const cx = shapeType === 'CIRCLE' ? nodes[0].x * W : nodes.reduce((t, n) => t + n.x, 0) / nodes.length * W;
  const cy = shapeType === 'CIRCLE' ? nodes[0].y * H : nodes.reduce((t, n) => t + n.y, 0) / nodes.length * H;
  ctx.save();
  ctx.font = `bold ${size}px ${family}`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = color;
  ctx.fillText(text, cx, cy);
  ctx.restore();
}

// ── Area / region paths ───────────────────────────────────────────────────────

function buildPolygonPath(ctx, nodes, W, H) {
  ctx.moveTo(nodes[0].x * W, nodes[0].y * H);
  for (let i = 1; i < nodes.length; i++) {
    ctx.lineTo(nodes[i].x * W, nodes[i].y * H);
  }
  ctx.closePath();
}
function buildBezierPath(ctx, nodes, W, H) {
  const n = nodes.length;
  const startX = (nodes[n - 1].x + nodes[0].x) / 2 * W;
  const startY = (nodes[n - 1].y + nodes[0].y) / 2 * H;
  ctx.moveTo(startX, startY);
  for (let i = 0; i < n; i++) {
    const cp = nodes[i];
    const next = nodes[(i + 1) % n];
    ctx.quadraticCurveTo(cp.x * W, cp.y * H, (cp.x + next.x) / 2 * W, (cp.y + next.y) / 2 * H);
  }
  ctx.closePath();
}
function buildCirclePath(ctx, nodes, W, H) {
  const cx = nodes[0].x * W;
  const cy = nodes[0].y * H;
  const rx = Math.max(Math.abs(nodes[1].x - nodes[0].x) * W, 1);
  const ry = Math.max(Math.abs(nodes[1].y - nodes[0].y) * H, 1);
  ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
}
function buildAreaPathFromNodes(ctx, nodes, shapeType, W, H) {
  ctx.beginPath();
  if (!nodes.length) return;
  switch (shapeType) {
    case 'BEZIER':
      if (nodes.length >= 3) buildBezierPath(ctx, nodes, W, H);
      break;
    case 'CIRCLE':
      if (nodes.length >= 2) buildCirclePath(ctx, nodes, W, H);
      break;
    case 'RECTANGLE':
    default:
      if (nodes.length >= 3) buildPolygonPath(ctx, nodes, W, H);
      break;
  }
}

// ── Hit detection ─────────────────────────────────────────────────────────────

function findObjectAtPoint(ctx, x, y, objects) {
  for (let i = objects.length - 1; i >= 0; i--) {
    const obj = objects[i];
    const size = obj.canvas_styles?.size ?? 32;
    const half = size / 2;
    ctx.beginPath();
    ctx.rect(obj.x - half, obj.y - half, size, size);
    if (ctx.isPointInPath(x, y)) return obj;
  }
  return null;
}
function findAreaAtPoint(ctx, x, y, areas, W, H) {
  for (let i = areas.length - 1; i >= 0; i--) {
    const area = areas[i];
    const nodes = area.nodes || [];
    const shapeType = area.shape_type || 'POLYGON';
    const minNodes = shapeType === 'CIRCLE' ? 2 : 3;
    if (nodes.length < minNodes) continue;
    buildAreaPathFromNodes(ctx, nodes, shapeType, W, H);
    if (ctx.isPointInPath(x, y)) return area;
  }
  return null;
}

// ── Labels ────────────────────────────────────────────────────────────────────
// 'centered'  — label box centered on (x, y).
// 'indicator' — dot at (x, y) with a leader line to the label box at
//               (x + offset_x, y + offset_y); the line is drawn first so the
//               box covers the segment that would cross it.

const PAD_X = 8;
const PAD_Y = 5;

/** Computes the label box in canvas pixels (sets ctx.font as a side effect). */
function measureLabelBox(ctx, label) {
  const fontSize = label.canvas_styles?.fontSize || 14;
  ctx.font = `bold ${fontSize}px sans-serif`;
  const textW = ctx.measureText(label.text || '').width;
  const w = textW + PAD_X * 2;
  const h = fontSize + PAD_Y * 2;
  const cx = label.placement === 'indicator' ? label.x + (label.offset_x ?? 40) : label.x;
  const cy = label.placement === 'indicator' ? label.y + (label.offset_y ?? -40) : label.y;
  return {
    left: cx - w / 2,
    top: cy - h / 2,
    w,
    h,
    cx,
    cy,
    fontSize
  };
}
function traceRoundedRect(ctx, x, y, w, h, r) {
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(x, y, w, h, r);
  } else {
    ctx.rect(x, y, w, h);
  }
}
function drawLabelShape(ctx, label, opts = {}) {
  const styles = label.canvas_styles;
  const bg = styles?.bgColor || '#ffffff';
  const border = styles?.borderColor || '#1e1e1e';
  const textColor = styles?.textColor || '#1e1e1e';
  const box = measureLabelBox(ctx, label);
  ctx.save();

  // Leader line + anchor dot first, so the box covers the inner segment.
  if (label.placement === 'indicator') {
    ctx.beginPath();
    ctx.moveTo(label.x, label.y);
    ctx.lineTo(box.cx, box.cy);
    ctx.strokeStyle = border;
    ctx.lineWidth = 1.5;
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(label.x, label.y, 4, 0, Math.PI * 2);
    ctx.fillStyle = border;
    ctx.fill();
  }
  ctx.beginPath();
  traceRoundedRect(ctx, box.left, box.top, box.w, box.h, 4);
  ctx.fillStyle = bg;
  ctx.fill();
  ctx.strokeStyle = border;
  ctx.lineWidth = 1.5;
  ctx.stroke();
  ctx.font = `bold ${box.fontSize}px sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = textColor;
  ctx.fillText(label.text || (opts.showEmptyPlaceholder ? '(empty label)' : ''), box.cx, box.cy);
  if (opts.selected) {
    ctx.beginPath();
    traceRoundedRect(ctx, box.left - 4, box.top - 4, box.w + 8, box.h + 8, 6);
    ctx.strokeStyle = '#2271b1';
    ctx.lineWidth = 2;
    ctx.setLineDash([4, 3]);
    ctx.stroke();
  }
  ctx.restore();
}

/** Which part of a label was hit: the anchor dot or the text box. */

/**
 * Hit test that distinguishes the anchor dot (indicator mode) from the text
 * box. The dot is checked first with a generous radius so it stays grabbable
 * next to the box. Reverse order so the top-most drawn label wins.
 */
function findLabelPartAtPoint(ctx, x, y, labels) {
  for (let i = labels.length - 1; i >= 0; i--) {
    const label = labels[i];
    if (label.placement === 'indicator') {
      ctx.beginPath();
      ctx.arc(label.x, label.y, 8, 0, Math.PI * 2);
      if (ctx.isPointInPath(x, y)) return {
        label,
        part: 'anchor'
      };
    }
    const box = measureLabelBox(ctx, label);
    ctx.beginPath();
    ctx.rect(box.left, box.top, box.w, box.h);
    if (ctx.isPointInPath(x, y)) return {
      label,
      part: 'box'
    };
  }
  return null;
}

/***/ },

/***/ "./src/map/admin/admin.scss"
/*!**********************************!*\
  !*** ./src/map/admin/admin.scss ***!
  \**********************************/
(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ },

/***/ "react/jsx-runtime"
/*!**********************************!*\
  !*** external "ReactJSXRuntime" ***!
  \**********************************/
(module) {

module.exports = window["ReactJSXRuntime"];

/***/ },

/***/ "@wordpress/api-fetch"
/*!**********************************!*\
  !*** external ["wp","apiFetch"] ***!
  \**********************************/
(module) {

module.exports = window["wp"]["apiFetch"];

/***/ },

/***/ "@wordpress/components"
/*!************************************!*\
  !*** external ["wp","components"] ***!
  \************************************/
(module) {

module.exports = window["wp"]["components"];

/***/ },

/***/ "@wordpress/data"
/*!******************************!*\
  !*** external ["wp","data"] ***!
  \******************************/
(module) {

module.exports = window["wp"]["data"];

/***/ },

/***/ "@wordpress/element"
/*!*********************************!*\
  !*** external ["wp","element"] ***!
  \*********************************/
(module) {

module.exports = window["wp"]["element"];

/***/ },

/***/ "@wordpress/i18n"
/*!******************************!*\
  !*** external ["wp","i18n"] ***!
  \******************************/
(module) {

module.exports = window["wp"]["i18n"];

/***/ },

/***/ "@wordpress/media-utils"
/*!************************************!*\
  !*** external ["wp","mediaUtils"] ***!
  \************************************/
(module) {

module.exports = window["wp"]["mediaUtils"];

/***/ },

/***/ "@wordpress/notices"
/*!*********************************!*\
  !*** external ["wp","notices"] ***!
  \*********************************/
(module) {

module.exports = window["wp"]["notices"];

/***/ },

/***/ "@wordpress/primitives"
/*!************************************!*\
  !*** external ["wp","primitives"] ***!
  \************************************/
(module) {

module.exports = window["wp"]["primitives"];

/***/ },

/***/ "./node_modules/@wordpress/icons/build-module/icon/index.mjs"
/*!*******************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/icon/index.mjs ***!
  \*******************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ icon_default)
/* harmony export */ });
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
// packages/icons/src/icon/index.ts

var icon_default = (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.forwardRef)(
  ({ icon, size = 24, ...props }, ref) => {
    return (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.cloneElement)(icon, {
      width: size,
      height: size,
      ...props,
      ref
    });
  }
);

//# sourceMappingURL=index.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/icons/build-module/library/arrow-left.mjs"
/*!***************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/arrow-left.mjs ***!
  \***************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ arrow_left_default)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/icons/src/library/arrow-left.tsx


var arrow_left_default = /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, { d: "M20 11.2H6.8l3.7-3.7-1-1L3.9 12l5.6 5.5 1-1-3.7-3.7H20z" }) });

//# sourceMappingURL=arrow-left.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/icons/build-module/library/chevron-left-small.mjs"
/*!***********************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/chevron-left-small.mjs ***!
  \***********************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ chevron_left_small_default)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/icons/src/library/chevron-left-small.tsx


var chevron_left_small_default = /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, { d: "m13.1 16-3.4-4 3.4-4 1.1 1-2.6 3 2.6 3-1.1 1z" }) });

//# sourceMappingURL=chevron-left-small.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/icons/build-module/library/chevron-right-small.mjs"
/*!************************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/chevron-right-small.mjs ***!
  \************************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ chevron_right_small_default)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/icons/src/library/chevron-right-small.tsx


var chevron_right_small_default = /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, { d: "M10.8622 8.04053L14.2805 12.0286L10.8622 16.0167L9.72327 15.0405L12.3049 12.0286L9.72327 9.01672L10.8622 8.04053Z" }) });

//# sourceMappingURL=chevron-right-small.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/icons/build-module/library/close-small.mjs"
/*!****************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/close-small.mjs ***!
  \****************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ close_small_default)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/icons/src/library/close-small.tsx


var close_small_default = /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, { d: "M12 13.06l3.712 3.713 1.061-1.06L13.061 12l3.712-3.712-1.06-1.06L12 10.938 8.288 7.227l-1.061 1.06L10.939 12l-3.712 3.712 1.06 1.061L12 13.061z" }) });

//# sourceMappingURL=close-small.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/icons/build-module/library/close.mjs"
/*!**********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/close.mjs ***!
  \**********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ close_default)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/icons/src/library/close.tsx


var close_default = /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, { d: "m13.06 12 6.47-6.47-1.06-1.06L12 10.94 5.53 4.47 4.47 5.53 10.94 12l-6.47 6.47 1.06 1.06L12 13.06l6.47 6.47 1.06-1.06L13.06 12Z" }) });

//# sourceMappingURL=close.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/icons/build-module/library/copy.mjs"
/*!*********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/copy.mjs ***!
  \*********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ copy_default)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/icons/src/library/copy.tsx


var copy_default = /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, { fillRule: "evenodd", clipRule: "evenodd", d: "M5 4.5h11a.5.5 0 0 1 .5.5v11a.5.5 0 0 1-.5.5H5a.5.5 0 0 1-.5-.5V5a.5.5 0 0 1 .5-.5ZM3 5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5Zm17 3v10.75c0 .69-.56 1.25-1.25 1.25H6v1.5h12.75a2.75 2.75 0 0 0 2.75-2.75V8H20Z" }) });

//# sourceMappingURL=copy.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/icons/build-module/library/external.mjs"
/*!*************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/external.mjs ***!
  \*************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ external_default)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/icons/src/library/external.tsx


var external_default = /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, { d: "M19.5 4.5h-7V6h4.44l-5.97 5.97 1.06 1.06L18 7.06v4.44h1.5v-7Zm-13 1a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-3H17v3a.5.5 0 0 1-.5.5h-10a.5.5 0 0 1-.5-.5v-10a.5.5 0 0 1 .5-.5h3V5.5h-3Z" }) });

//# sourceMappingURL=external.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/icons/build-module/library/fullscreen.mjs"
/*!***************************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/fullscreen.mjs ***!
  \***************************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ fullscreen_default)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/icons/src/library/fullscreen.tsx


var fullscreen_default = /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, { d: "M6 4a2 2 0 0 0-2 2v3h1.5V6a.5.5 0 0 1 .5-.5h3V4H6Zm3 14.5H6a.5.5 0 0 1-.5-.5v-3H4v3a2 2 0 0 0 2 2h3v-1.5Zm6 1.5v-1.5h3a.5.5 0 0 0 .5-.5v-3H20v3a2 2 0 0 1-2 2h-3Zm3-16a2 2 0 0 1 2 2v3h-1.5V6a.5.5 0 0 0-.5-.5h-3V4h3Z" }) });

//# sourceMappingURL=fullscreen.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/icons/build-module/library/image.mjs"
/*!**********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/image.mjs ***!
  \**********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ image_default)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/icons/src/library/image.tsx


var image_default = /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, { d: "M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM5 4.5h14c.3 0 .5.2.5.5v8.4l-3-2.9c-.3-.3-.8-.3-1 0L11.9 14 9 12c-.3-.2-.6-.2-.8 0l-3.6 2.6V5c-.1-.3.1-.5.4-.5zm14 15H5c-.3 0-.5-.2-.5-.5v-2.4l4.1-3 3 1.9c.3.2.7.2.9-.1L16 12l3.5 3.4V19c0 .3-.2.5-.5.5z" }) });

//# sourceMappingURL=image.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/icons/build-module/library/info.mjs"
/*!*********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/info.mjs ***!
  \*********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ info_default)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/icons/src/library/info.tsx


var info_default = /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, { fillRule: "evenodd", clipRule: "evenodd", d: "M5.5 12a6.5 6.5 0 1 0 13 0 6.5 6.5 0 0 0-13 0ZM12 4a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm.75 4v1.5h-1.5V8h1.5Zm0 8v-5h-1.5v5h1.5Z" }) });

//# sourceMappingURL=info.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/icons/build-module/library/pencil.mjs"
/*!***********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/pencil.mjs ***!
  \***********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ pencil_default)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/icons/src/library/pencil.tsx


var pencil_default = /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, { d: "m19 7-3-3-8.5 8.5-1 4 4-1L19 7Zm-7 11.5H5V20h7v-1.5Z" }) });

//# sourceMappingURL=pencil.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/icons/build-module/library/plus.mjs"
/*!*********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/plus.mjs ***!
  \*********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ plus_default)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/icons/src/library/plus.tsx


var plus_default = /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, { d: "M11 12.5V17.5H12.5V12.5H17.5V11H12.5V6H11V11H6V12.5H11Z" }) });

//# sourceMappingURL=plus.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/icons/build-module/library/reset.mjs"
/*!**********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/reset.mjs ***!
  \**********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ reset_default)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/icons/src/library/reset.tsx


var reset_default = /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, { d: "M7 11.5h10V13H7z" }) });

//# sourceMappingURL=reset.mjs.map


/***/ },

/***/ "./node_modules/@wordpress/icons/build-module/library/trash.mjs"
/*!**********************************************************************!*\
  !*** ./node_modules/@wordpress/icons/build-module/library/trash.mjs ***!
  \**********************************************************************/
(__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   "default": () => (/* binding */ trash_default)
/* harmony export */ });
/* harmony import */ var _wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/primitives */ "@wordpress/primitives");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
// packages/icons/src/library/trash.tsx


var trash_default = /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.SVG, { xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", children: /* @__PURE__ */ (0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_1__.jsx)(_wordpress_primitives__WEBPACK_IMPORTED_MODULE_0__.Path, { fillRule: "evenodd", clipRule: "evenodd", d: "M12 5.5A2.25 2.25 0 0 0 9.878 7h4.244A2.251 2.251 0 0 0 12 5.5ZM12 4a3.751 3.751 0 0 0-3.675 3H5v1.5h1.27l.818 8.997a2.75 2.75 0 0 0 2.739 2.501h4.347a2.75 2.75 0 0 0 2.738-2.5L17.73 8.5H19V7h-3.325A3.751 3.751 0 0 0 12 4Zm4.224 4.5H7.776l.806 8.861a1.25 1.25 0 0 0 1.245 1.137h4.347a1.25 1.25 0 0 0 1.245-1.137l.805-8.861Z" }) });

//# sourceMappingURL=trash.mjs.map


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
/******/ 	/* webpack/runtime/compat get default export */
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = (module) => {
/******/ 		const getter = module && module.__esModule ?
/******/ 			() => (module['default']) :
/******/ 			() => (module);
/******/ 		__webpack_require__.d(getter, { a: getter });
/******/ 		return getter;
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/define property getters */
/******/ 	// define getter/value functions for harmony exports
/******/ 	__webpack_require__.d = (exports, definition) => {
/******/ 		for(var key in definition) {
/******/ 			if(__webpack_require__.o(definition, key) && !__webpack_require__.o(exports, key)) {
/******/ 				Object.defineProperty(exports, key, { enumerable: true, get: definition[key] });
/******/ 			}
/******/ 		}
/******/ 	};
/******/ 	
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	__webpack_require__.o = (obj, prop) => (Object.hasOwn(obj, prop));
/******/ 	
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
/*!*********************************!*\
  !*** ./src/map/admin/index.tsx ***!
  \*********************************/
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @wordpress/element */ "@wordpress/element");
/* harmony import */ var _wordpress_element__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_wordpress_element__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _app_MapEditorApp__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./app/MapEditorApp */ "./src/map/admin/app/MapEditorApp.tsx");
/* harmony import */ var _app_IconLibraryApp__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./app/IconLibraryApp */ "./src/map/admin/app/IconLibraryApp.tsx");
/* harmony import */ var _admin_scss__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./admin.scss */ "./src/map/admin/admin.scss");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! react/jsx-runtime */ "react/jsx-runtime");
/* harmony import */ var react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__);





document.addEventListener('DOMContentLoaded', () => {
  const editorEl = document.getElementById('cns-admin-root');
  if (editorEl) (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createRoot)(editorEl).render(/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_app_MapEditorApp__WEBPACK_IMPORTED_MODULE_1__["default"], {}));
  const iconsEl = document.getElementById('cns-icons-root');
  if (iconsEl) (0,_wordpress_element__WEBPACK_IMPORTED_MODULE_0__.createRoot)(iconsEl).render(/*#__PURE__*/(0,react_jsx_runtime__WEBPACK_IMPORTED_MODULE_4__.jsx)(_app_IconLibraryApp__WEBPACK_IMPORTED_MODULE_2__["default"], {}));
  document.body.addEventListener('click', e => {
    const link = e.target.closest('a[data-confirm]');
    if (link && !window.confirm(link.dataset.confirm)) {
      e.preventDefault();
    }
  });
});
})();

/******/ })()
;
//# sourceMappingURL=index.js.map