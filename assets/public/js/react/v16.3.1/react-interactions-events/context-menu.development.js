/** @license React vundefined
 * react-interactions-events/context-menu.development.js
 *
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

'use strict';

(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory(require('react')) :
  typeof define === 'function' && define.amd ? define(['react'], factory) :
  (global = global || self, global.ReactEventsContextMenu = factory(global.React));
}(this, (function (React) { 'use strict';

  var DiscreteEvent = 0;

  var hasPointerEvents = typeof window !== 'undefined' && window.PointerEvent != null;

  function dispatchContextMenuEvent(event, context, props, state) {
    var nativeEvent = event.nativeEvent;
    var target = event.target;
    var timeStamp = context.getTimeStamp();
    var pointerType = state.pointerType;
    var gestureState = {
      altKey: nativeEvent.altKey,
      buttons: nativeEvent.buttons != null ? nativeEvent.buttons : 0,
      ctrlKey: nativeEvent.ctrlKey,
      metaKey: nativeEvent.metaKey,
      pageX: nativeEvent.pageX,
      pageY: nativeEvent.pageY,
      pointerType: pointerType,
      shiftKey: nativeEvent.shiftKey,
      target: target,
      timeStamp: timeStamp,
      type: 'contextmenu',
      x: nativeEvent.clientX,
      y: nativeEvent.clientY
    };
    context.dispatchEvent(gestureState, props.onContextMenu, DiscreteEvent);
  }

  var contextMenuImpl = {
    targetEventTypes: hasPointerEvents ? ['contextmenu_active', 'pointerdown'] : ['contextmenu_active', 'touchstart', 'mousedown'],
    getInitialState: function () {
      return {
        pointerType: ''
      };
    },
    onEvent: function (event, context, props, state) {
      var nativeEvent = event.nativeEvent;
      var pointerType = event.pointerType;
      var type = event.type;

      if (props.disabled) {
        return;
      }

      if (type === 'contextmenu') {
        var onContextMenu = props.onContextMenu;
        var preventDefault = props.preventDefault;

        if (preventDefault !== false && !nativeEvent.defaultPrevented) {
          nativeEvent.preventDefault();
        }

        if (typeof onContextMenu === 'function') {
          dispatchContextMenuEvent(event, context, props, state);
        }

        state.pointerType = '';
      } else {
        state.pointerType = pointerType;
      }
    }
  };
  var ContextMenuResponder = React.DEPRECATED_createResponder('ContextMenu', contextMenuImpl);
  function useContextMenu(props) {
    return React.DEPRECATED_useResponder(ContextMenuResponder, props);
  }

  var ContextMenu = /*#__PURE__*/Object.freeze({
    __proto__: null,
    ContextMenuResponder: ContextMenuResponder,
    useContextMenu: useContextMenu
  });

  var contextMenu = ContextMenu;

  return contextMenu;

})));
