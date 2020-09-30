/** @license React vundefined
 * react-interactions-events/keyboard.development.js
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
  (global = global || self, global.ReactEventsKeyboard = factory(global.React));
}(this, (function (React) { 'use strict';

  var DiscreteEvent = 0;

  var isMac = typeof window !== 'undefined' && window.navigator != null ? /^Mac/.test(window.navigator.platform) : false;
  // click event. This is a method of inferring such clicks. Every browser except
  // IE 11 only sets a zero value of "detail" for click events that are "virtual".
  // However, IE 11 uses a zero value for all click events. For IE 11 we rely on
  // the quirk that it produces click events that are of type PointerEvent, and
  // where only the "virtual" click lacks a pointerType field.

  function isVirtualClick(event) {
    var nativeEvent = event.nativeEvent; // JAWS/NVDA with Firefox.

    if (nativeEvent.mozInputSource === 0 && nativeEvent.isTrusted) {
      return true;
    }

    return nativeEvent.detail === 0 && !nativeEvent.pointerType;
  }

  var targetEventTypes = ['click_active', 'keydown_active', 'keyup'];
  /**
   * Normalization of deprecated HTML5 `key` values
   * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent#Key_names
   */

  var normalizeKey = {
    Esc: 'Escape',
    Spacebar: ' ',
    Left: 'ArrowLeft',
    Up: 'ArrowUp',
    Right: 'ArrowRight',
    Down: 'ArrowDown',
    Del: 'Delete',
    Win: 'OS',
    Menu: 'ContextMenu',
    Apps: 'ContextMenu',
    Scroll: 'ScrollLock',
    MozPrintableKey: 'Unidentified'
  };
  /**
   * Translation from legacy `keyCode` to HTML5 `key`
   * Only special keys supported, all others depend on keyboard layout or browser
   * @see https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent#Key_names
   */

  var translateToKey = {
    '8': 'Backspace',
    '9': 'Tab',
    '12': 'Clear',
    '13': 'Enter',
    '16': 'Shift',
    '17': 'Control',
    '18': 'Alt',
    '19': 'Pause',
    '20': 'CapsLock',
    '27': 'Escape',
    '32': ' ',
    '33': 'PageUp',
    '34': 'PageDown',
    '35': 'End',
    '36': 'Home',
    '37': 'ArrowLeft',
    '38': 'ArrowUp',
    '39': 'ArrowRight',
    '40': 'ArrowDown',
    '45': 'Insert',
    '46': 'Delete',
    '112': 'F1',
    '113': 'F2',
    '114': 'F3',
    '115': 'F4',
    '116': 'F5',
    '117': 'F6',
    '118': 'F7',
    '119': 'F8',
    '120': 'F9',
    '121': 'F10',
    '122': 'F11',
    '123': 'F12',
    '144': 'NumLock',
    '145': 'ScrollLock',
    '224': 'Meta'
  };

  function getEventKey(nativeEvent) {
    var nativeKey = nativeEvent.key;

    if (nativeKey) {
      // Normalize inconsistent values reported by browsers due to
      // implementations of a working draft specification.
      // FireFox implements `key` but returns `MozPrintableKey` for all
      // printable characters (normalized to `Unidentified`), ignore it.
      var key = normalizeKey[nativeKey] || nativeKey;

      if (key !== 'Unidentified') {
        return key;
      }
    }

    return translateToKey[nativeEvent.keyCode] || 'Unidentified';
  }

  function createKeyboardEvent(event, context, type) {
    var nativeEvent = event.nativeEvent;
    var altKey = nativeEvent.altKey,
        ctrlKey = nativeEvent.ctrlKey,
        metaKey = nativeEvent.metaKey,
        shiftKey = nativeEvent.shiftKey;
    var keyboardEvent = {
      altKey: altKey,
      ctrlKey: ctrlKey,
      defaultPrevented: nativeEvent.defaultPrevented === true,
      metaKey: metaKey,
      pointerType: 'keyboard',
      shiftKey: shiftKey,
      target: event.target,
      timeStamp: context.getTimeStamp(),
      type: type,
      // We don't use stopPropagation, as the default behavior
      // is to not propagate. Plus, there might be confusion
      // using stopPropagation as we don't actually stop
      // native propagation from working, but instead only
      // allow propagation to the others keyboard responders.
      continuePropagation: function () {
        context.continuePropagation();
      },
      preventDefault: function () {
        keyboardEvent.defaultPrevented = true;
        nativeEvent.preventDefault();
      }
    };

    if (type !== 'keyboard:click') {
      var key = getEventKey(nativeEvent);
      var isComposing = nativeEvent.isComposing;
      keyboardEvent = context.objectAssign({
        isComposing: isComposing,
        key: key
      }, keyboardEvent);
    }

    return keyboardEvent;
  }

  function dispatchKeyboardEvent(event, listener, context, type) {
    var syntheticEvent = createKeyboardEvent(event, context, type);
    context.dispatchEvent(syntheticEvent, listener, DiscreteEvent);
  }

  var keyboardResponderImpl = {
    targetEventTypes: targetEventTypes,
    targetPortalPropagation: true,
    getInitialState: function () {
      return {
        isActive: false
      };
    },
    onEvent: function (event, context, props, state) {
      var type = event.type;

      if (props.disabled) {
        return;
      }

      if (type === 'keydown') {
        state.isActive = true;
        var onKeyDown = props.onKeyDown;

        if (onKeyDown != null) {
          dispatchKeyboardEvent(event, onKeyDown, context, 'keyboard:keydown');
        }
      } else if (type === 'click' && isVirtualClick(event)) {
        var onClick = props.onClick;

        if (onClick != null) {
          dispatchKeyboardEvent(event, onClick, context, 'keyboard:click');
        }
      } else if (type === 'keyup') {
        state.isActive = false;
        var onKeyUp = props.onKeyUp;

        if (onKeyUp != null) {
          dispatchKeyboardEvent(event, onKeyUp, context, 'keyboard:keyup');
        }
      }
    }
  };
  var KeyboardResponder = React.DEPRECATED_createResponder('Keyboard', keyboardResponderImpl);
  function useKeyboard(props) {
    return React.DEPRECATED_useResponder(KeyboardResponder, props);
  }

  var Keyboard = /*#__PURE__*/Object.freeze({
    __proto__: null,
    KeyboardResponder: KeyboardResponder,
    useKeyboard: useKeyboard
  });

  var keyboard = Keyboard;

  return keyboard;

})));
