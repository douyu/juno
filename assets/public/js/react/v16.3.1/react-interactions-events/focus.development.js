/** @license React vundefined
 * react-interactions-events/focus.development.js
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
  (global = global || self, global.ReactEventsFocus = factory(global.React));
}(this, (function (React) { 'use strict';

  var DiscreteEvent = 0;

  /**
   * Types
   */

  /**
   * Shared between Focus and FocusWithin
   */
  var isGlobalFocusVisible = true;
  var hasTrackedGlobalFocusVisible = false;
  var globalFocusVisiblePointerType = '';
  var isEmulatingMouseEvents = false;
  var isMac = typeof window !== 'undefined' && window.navigator != null ? /^Mac/.test(window.navigator.platform) : false;
  var passiveBrowserEventsSupported = false;
  var canUseDOM = !!(typeof window !== 'undefined' && typeof window.document !== 'undefined' && typeof window.document.createElement !== 'undefined'); // Check if browser support events with passive listeners
  // https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener#Safely_detecting_option_support

  if (canUseDOM) {
    try {
      var options = {}; // $FlowFixMe: Ignore Flow complaining about needing a value

      Object.defineProperty(options, 'passive', {
        get: function () {
          passiveBrowserEventsSupported = true;
        }
      });
      window.addEventListener('test', options, options);
      window.removeEventListener('test', options, options);
    } catch (e) {
      passiveBrowserEventsSupported = false;
    }
  }

  var hasPointerEvents = typeof window !== 'undefined' && window.PointerEvent != null;
  var focusVisibleEvents = hasPointerEvents ? ['keydown', 'keyup', 'pointermove', 'pointerdown', 'pointerup'] : ['keydown', 'keyup', 'mousedown', 'touchmove', 'touchstart', 'touchend'];
  var targetEventTypes = ['focus', 'blur', 'beforeblur'].concat(focusVisibleEvents); // Used only for the blur "detachedTarget" logic

  var rootEventTypes = ['blur'];

  function addWindowEventListener(types, callback, options) {
    types.forEach(function (type) {
      window.addEventListener(type, callback, options);
    });
  }

  function trackGlobalFocusVisible() {
    if (!hasTrackedGlobalFocusVisible) {
      hasTrackedGlobalFocusVisible = true;
      addWindowEventListener(focusVisibleEvents, handleGlobalFocusVisibleEvent, passiveBrowserEventsSupported ? {
        capture: true,
        passive: true
      } : true);
    }
  }

  function handleGlobalFocusVisibleEvent(nativeEvent) {
    var type = nativeEvent.type;

    switch (type) {
      case 'pointermove':
      case 'pointerdown':
      case 'pointerup':
        {
          isGlobalFocusVisible = false;
          globalFocusVisiblePointerType = nativeEvent.pointerType;
          break;
        }

      case 'keydown':
      case 'keyup':
        {
          var metaKey = nativeEvent.metaKey,
              altKey = nativeEvent.altKey,
              ctrlKey = nativeEvent.ctrlKey;
          var validKey = !(metaKey || !isMac && altKey || ctrlKey);

          if (validKey) {
            globalFocusVisiblePointerType = 'keyboard';
            isGlobalFocusVisible = true;
          }

          break;
        }
      // fallbacks for no PointerEvent support

      case 'touchmove':
      case 'touchstart':
      case 'touchend':
        {
          isEmulatingMouseEvents = true;
          isGlobalFocusVisible = false;
          globalFocusVisiblePointerType = 'touch';
          break;
        }

      case 'mousedown':
        {
          if (!isEmulatingMouseEvents) {
            isGlobalFocusVisible = false;
            globalFocusVisiblePointerType = 'mouse';
          } else {
            isEmulatingMouseEvents = false;
          }

          break;
        }
    }
  }

  function isFunction(obj) {
    return typeof obj === 'function';
  }

  function createFocusEvent(context, type, target, pointerType, isTargetAttached) {
    return {
      isTargetAttached: isTargetAttached,
      target: target,
      type: type,
      pointerType: pointerType,
      timeStamp: context.getTimeStamp(),
      // We don't use stopPropagation, as the default behavior
      // is to not propagate. Plus, there might be confusion
      // using stopPropagation as we don't actually stop
      // native propagation from working, but instead only
      // allow propagation to the others keyboard responders.
      continuePropagation: function () {
        context.continuePropagation();
      }
    };
  }

  function handleFocusVisibleTargetEvent(event, context, state, callback) {
    var type = event.type;
    isGlobalFocusVisible = false; // Focus should stop being visible if a pointer is used on the element
    // after it was focused using a keyboard.

    var focusTarget = state.focusTarget;

    if (focusTarget !== null && (type === 'mousedown' || type === 'touchstart' || type === 'pointerdown')) {
      callback(false);
    }
  }

  function handleFocusVisibleTargetEvents(event, context, state, callback) {
    var type = event.type;
    state.pointerType = globalFocusVisiblePointerType;

    switch (type) {
      case 'pointermove':
      case 'pointerdown':
      case 'pointerup':
        {
          handleFocusVisibleTargetEvent(event, context, state, callback);
          break;
        }

      case 'keydown':
      case 'keyup':
        {
          var nativeEvent = event.nativeEvent;
          var focusTarget = state.focusTarget;
          var _ref = nativeEvent,
              metaKey = _ref.metaKey,
              altKey = _ref.altKey,
              ctrlKey = _ref.ctrlKey;
          var validKey = !(metaKey || !isMac && altKey || ctrlKey);

          if (validKey) {
            if (focusTarget !== null) {
              callback(true);
            }
          }

          break;
        }
      // fallbacks for no PointerEvent support

      case 'touchmove':
      case 'touchstart':
      case 'touchend':
        {
          handleFocusVisibleTargetEvent(event, context, state, callback);
          break;
        }

      case 'mousedown':
        {
          if (!isEmulatingMouseEvents) {
            handleFocusVisibleTargetEvent(event, context, state, callback);
          }

          break;
        }
    }
  }
  /**
   * Focus Responder
   */


  function dispatchFocusEvents(context, props, state) {
    var pointerType = state.pointerType;
    var target = state.focusTarget;
    var onFocus = props.onFocus;

    if (isFunction(onFocus)) {
      var syntheticEvent = createFocusEvent(context, 'focus', target, pointerType, true);
      context.dispatchEvent(syntheticEvent, onFocus, DiscreteEvent);
    }

    dispatchFocusChange(context, props, true);

    if (state.isFocusVisible) {
      dispatchFocusVisibleChangeEvent(context, props, true);
    }
  }

  function dispatchBlurEvents(context, props, state) {
    var pointerType = state.pointerType;
    var target = state.focusTarget;
    var onBlur = props.onBlur;

    if (isFunction(onBlur)) {
      var syntheticEvent = createFocusEvent(context, 'blur', target, pointerType, true);
      context.dispatchEvent(syntheticEvent, onBlur, DiscreteEvent);
    }

    dispatchFocusChange(context, props, false);

    if (state.isFocusVisible) {
      dispatchFocusVisibleChangeEvent(context, props, false);
    }
  }

  function dispatchFocusWithinEvents(context, event, props, state) {
    var pointerType = state.pointerType;
    var target = state.focusTarget || event.target;
    var onFocusWithin = props.onFocusWithin;

    if (isFunction(onFocusWithin)) {
      var syntheticEvent = createFocusEvent(context, 'focuswithin', target, pointerType, true);
      context.dispatchEvent(syntheticEvent, onFocusWithin, DiscreteEvent);
    }
  }

  function dispatchBlurWithinEvents(context, event, props, state) {
    var pointerType = state.pointerType;
    var target = state.focusTarget || event.target;
    var onBlurWithin = props.onBlurWithin;
    var isTargetAttached = state.detachedTarget === null;

    if (isFunction(onBlurWithin)) {
      var syntheticEvent = createFocusEvent(context, 'blurwithin', target, pointerType, isTargetAttached);
      context.dispatchEvent(syntheticEvent, onBlurWithin, DiscreteEvent);
    }
  }

  function dispatchFocusChange(context, props, value) {
    var onFocusChange = props.onFocusChange;

    if (isFunction(onFocusChange)) {
      context.dispatchEvent(value, onFocusChange, DiscreteEvent);
    }
  }

  function dispatchFocusVisibleChangeEvent(context, props, value) {
    var onFocusVisibleChange = props.onFocusVisibleChange;

    if (isFunction(onFocusVisibleChange)) {
      context.dispatchEvent(value, onFocusVisibleChange, DiscreteEvent);
    }
  }

  function unmountFocusResponder(context, props, state) {
    if (state.isFocused) {
      dispatchBlurEvents(context, props, state);
    }
  }

  var focusResponderImpl = {
    targetEventTypes: targetEventTypes,
    targetPortalPropagation: true,
    getInitialState: function () {
      return {
        detachedTarget: null,
        focusTarget: null,
        isFocused: false,
        isFocusVisible: false,
        pointerType: '',
        addedRootEvents: false
      };
    },
    onMount: function () {
      trackGlobalFocusVisible();
    },
    onEvent: function (event, context, props, state) {
      var type = event.type,
          target = event.target;

      if (props.disabled) {
        if (state.isFocused) {
          dispatchBlurEvents(context, props, state);
          state.isFocused = false;
          state.focusTarget = null;
        }

        return;
      }

      switch (type) {
        case 'focus':
          {
            state.focusTarget = context.getResponderNode(); // Limit focus events to the direct child of the event component.
            // Browser focus is not expected to bubble.

            if (!state.isFocused && state.focusTarget === target) {
              state.isFocused = true;
              state.isFocusVisible = isGlobalFocusVisible;
              dispatchFocusEvents(context, props, state);
            }

            isEmulatingMouseEvents = false;
            break;
          }

        case 'blur':
          {
            if (state.isFocused) {
              dispatchBlurEvents(context, props, state);
              state.isFocusVisible = isGlobalFocusVisible;
              state.isFocused = false;
            } // This covers situations where focus is lost to another document in
            // the same window (e.g., iframes). Any action that restores focus to
            // the document (e.g., touch or click) first causes 'focus' to be
            // dispatched, which means the 'pointerType' we provide is stale
            // (it reflects the *previous* pointer). We cannot determine the
            // 'pointerType' in this case, so a blur with no
            // relatedTarget is used as a signal to reset the 'pointerType'.


            if (event.nativeEvent.relatedTarget == null) {
              state.pointerType = '';
            }

            isEmulatingMouseEvents = false;
            break;
          }

        default:
          handleFocusVisibleTargetEvents(event, context, state, function (isFocusVisible) {
            if (state.isFocused && state.isFocusVisible !== isFocusVisible) {
              state.isFocusVisible = isFocusVisible;
              dispatchFocusVisibleChangeEvent(context, props, isFocusVisible);
            }
          });
      }
    },
    onUnmount: function (context, props, state) {
      unmountFocusResponder(context, props, state);
    }
  };
  var FocusResponder = React.DEPRECATED_createResponder('Focus', focusResponderImpl);
  function useFocus(props) {
    return React.DEPRECATED_useResponder(FocusResponder, props);
  }
  /**
   * FocusWithin Responder
   */

  function dispatchFocusWithinChangeEvent(context, props, state, value) {
    var onFocusWithinChange = props.onFocusWithinChange;

    if (isFunction(onFocusWithinChange)) {
      context.dispatchEvent(value, onFocusWithinChange, DiscreteEvent);
    }

    if (state.isFocusVisible) {
      dispatchFocusWithinVisibleChangeEvent(context, props, state, value);
    }
  }

  function dispatchFocusWithinVisibleChangeEvent(context, props, state, value) {
    var onFocusWithinVisibleChange = props.onFocusWithinVisibleChange;

    if (isFunction(onFocusWithinVisibleChange)) {
      context.dispatchEvent(value, onFocusWithinVisibleChange, DiscreteEvent);
    }
  }

  function unmountFocusWithinResponder(context, props, state) {
    if (state.isFocused) {
      dispatchFocusWithinChangeEvent(context, props, state, false);
    }
  }

  var focusWithinResponderImpl = {
    targetEventTypes: targetEventTypes,
    targetPortalPropagation: true,
    getInitialState: function () {
      return {
        detachedTarget: null,
        focusTarget: null,
        isFocused: false,
        isFocusVisible: false,
        pointerType: ''
      };
    },
    onMount: function () {
      trackGlobalFocusVisible();
    },
    onEvent: function (event, context, props, state) {
      var nativeEvent = event.nativeEvent,
          type = event.type;
      var relatedTarget = nativeEvent.relatedTarget;

      if (props.disabled) {
        if (state.isFocused) {
          dispatchFocusWithinChangeEvent(context, props, state, false);
          state.isFocused = false;
          state.focusTarget = null;
        }

        return;
      }

      switch (type) {
        case 'focus':
          {
            state.focusTarget = context.getResponderNode(); // Limit focus events to the direct child of the event component.
            // Browser focus is not expected to bubble.

            if (!state.isFocused) {
              state.isFocused = true;
              state.isFocusVisible = isGlobalFocusVisible;
              dispatchFocusWithinChangeEvent(context, props, state, true);
            }

            if (!state.isFocusVisible && isGlobalFocusVisible) {
              state.isFocusVisible = isGlobalFocusVisible;
              dispatchFocusWithinVisibleChangeEvent(context, props, state, true);
            }

            dispatchFocusWithinEvents(context, event, props, state);
            break;
          }

        case 'blur':
          {
            if (state.isFocused && !context.isTargetWithinResponder(relatedTarget)) {
              dispatchFocusWithinChangeEvent(context, props, state, false);
              dispatchBlurWithinEvents(context, event, props, state);
              state.isFocused = false;
            }

            break;
          }

        case 'beforeblur':
          {
            var onBeforeBlurWithin = props.onBeforeBlurWithin;

            if (isFunction(onBeforeBlurWithin)) {
              var syntheticEvent = createFocusEvent(context, 'beforeblurwithin', event.target, state.pointerType, true);
              state.detachedTarget = event.target;
              context.dispatchEvent(syntheticEvent, onBeforeBlurWithin, DiscreteEvent);

              if (!state.addedRootEvents) {
                state.addedRootEvents = true;
                context.addRootEventTypes(rootEventTypes);
              }
            } else {
              // We want to propagate to next focusWithin responder
              // if this responder doesn't handle beforeblur
              context.continuePropagation();
            }

            break;
          }

        default:
          handleFocusVisibleTargetEvents(event, context, state, function (isFocusVisible) {
            if (state.isFocused && state.isFocusVisible !== isFocusVisible) {
              state.isFocusVisible = isFocusVisible;
              dispatchFocusWithinVisibleChangeEvent(context, props, state, isFocusVisible);
            }
          });
      }
    },
    onRootEvent: function (event, context, props, state) {
      if (event.type === 'blur') {
        var detachedTarget = state.detachedTarget;

        if (detachedTarget !== null && detachedTarget === event.target) {
          dispatchBlurWithinEvents(context, event, props, state);
          state.detachedTarget = null;

          if (state.addedRootEvents) {
            state.addedRootEvents = false;
            context.removeRootEventTypes(rootEventTypes);
          }
        }
      }
    },
    onUnmount: function (context, props, state) {
      unmountFocusWithinResponder(context, props, state);
    }
  };
  var FocusWithinResponder = React.DEPRECATED_createResponder('FocusWithin', focusWithinResponderImpl);
  function useFocusWithin(props) {
    return React.DEPRECATED_useResponder(FocusWithinResponder, props);
  }

  var Focus = /*#__PURE__*/Object.freeze({
    __proto__: null,
    FocusResponder: FocusResponder,
    useFocus: useFocus,
    FocusWithinResponder: FocusWithinResponder,
    useFocusWithin: useFocusWithin
  });

  var focus = Focus;

  return focus;

})));
