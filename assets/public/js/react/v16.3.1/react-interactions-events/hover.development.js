/** @license React vundefined
 * react-interactions-events/hover.development.js
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
  (global = global || self, global.ReactEventsHover = factory(global.React));
}(this, (function (React) { 'use strict';

  var UserBlockingEvent = 1;

  var hasPointerEvents = typeof window !== 'undefined' && window.PointerEvent != null;

  function isFunction(obj) {
    return typeof obj === 'function';
  }

  function createHoverEvent(event, context, type, target) {
    var clientX = null;
    var clientY = null;
    var pageX = null;
    var pageY = null;
    var screenX = null;
    var screenY = null;
    var pointerType = '';

    if (event) {
      var nativeEvent = event.nativeEvent;
      pointerType = event.pointerType;
      clientX = nativeEvent.clientX;
      clientY = nativeEvent.clientY;
      pageX = nativeEvent.pageX;
      pageY = nativeEvent.pageY;
      screenX = nativeEvent.screenX;
      screenY = nativeEvent.screenY;
    }

    return {
      pointerType: pointerType,
      target: target,
      type: type,
      timeStamp: context.getTimeStamp(),
      clientX: clientX,
      clientY: clientY,
      pageX: pageX,
      pageY: pageY,
      screenX: screenX,
      screenY: screenY,
      x: clientX,
      y: clientY
    };
  }

  function dispatchHoverChangeEvent(event, context, props, state) {
    var onHoverChange = props.onHoverChange;

    if (isFunction(onHoverChange)) {
      var bool = state.isActiveHovered;
      context.dispatchEvent(bool, onHoverChange, UserBlockingEvent);
    }
  }

  function dispatchHoverStartEvents(event, context, props, state) {
    var target = state.hoverTarget;

    if (event !== null) {
      var nativeEvent = event.nativeEvent;

      if (context.isTargetWithinResponderScope(nativeEvent.relatedTarget)) {
        return false;
      }
    }

    state.isHovered = true;

    if (!state.isActiveHovered) {
      state.isActiveHovered = true;
      var onHoverStart = props.onHoverStart;

      if (isFunction(onHoverStart)) {
        var syntheticEvent = createHoverEvent(event, context, 'hoverstart', target);
        context.dispatchEvent(syntheticEvent, onHoverStart, UserBlockingEvent);
      }

      dispatchHoverChangeEvent(event, context, props, state);
    }

    return true;
  }

  function dispatchHoverMoveEvent(event, context, props, state) {
    var target = state.hoverTarget;
    var onHoverMove = props.onHoverMove;

    if (isFunction(onHoverMove)) {
      var syntheticEvent = createHoverEvent(event, context, 'hovermove', target);
      context.dispatchEvent(syntheticEvent, onHoverMove, UserBlockingEvent);
    }
  }

  function dispatchHoverEndEvents(event, context, props, state) {
    var target = state.hoverTarget;

    if (event !== null) {
      var nativeEvent = event.nativeEvent;

      if (context.isTargetWithinResponderScope(nativeEvent.relatedTarget)) {
        return false;
      }
    }

    state.isHovered = false;

    if (state.isActiveHovered) {
      state.isActiveHovered = false;
      var onHoverEnd = props.onHoverEnd;

      if (isFunction(onHoverEnd)) {
        var syntheticEvent = createHoverEvent(event, context, 'hoverend', target);
        context.dispatchEvent(syntheticEvent, onHoverEnd, UserBlockingEvent);
      }

      dispatchHoverChangeEvent(event, context, props, state);
      state.hoverTarget = null;
      state.isTouched = false;
    }

    return true;
  }

  function unmountResponder(context, props, state) {
    if (state.isHovered) {
      dispatchHoverEndEvents(null, context, props, state);
    }
  }

  var rootPointerEventTypes = ['pointerout', 'pointermove', 'pointercancel'];
  var hoverResponderImpl = {
    targetEventTypes: ['pointerover'],
    getInitialState: function () {
      return {
        isActiveHovered: false,
        isHovered: false
      };
    },
    allowMultipleHostChildren: false,
    allowEventHooks: true,
    onRootEvent: function (event, context, props, state) {
      var type = event.type;

      switch (type) {
        // MOVE
        case 'pointermove':
          {
            if (state.isHovered && state.hoverTarget !== null) {
              dispatchHoverMoveEvent(event, context, props, state);
            }

            break;
          }
        // END

        case 'pointercancel':
        case 'pointerout':
          {
            if (state.isHovered) {
              if (dispatchHoverEndEvents(event, context, props, state) || type === 'pointercancel') {
                context.removeRootEventTypes(rootPointerEventTypes);
              }
            }

            break;
          }
      }
    },
    onEvent: function (event, context, props, state) {
      var pointerType = event.pointerType,
          type = event.type;

      if (props.disabled) {
        if (state.isHovered) {
          context.removeRootEventTypes(rootPointerEventTypes);
          dispatchHoverEndEvents(event, context, props, state);
        }

        return;
      }

      switch (type) {
        // START
        case 'pointerover':
          {
            if (!state.isHovered && pointerType !== 'touch') {
              state.hoverTarget = context.getResponderNode();

              if (dispatchHoverStartEvents(event, context, props, state)) {
                context.addRootEventTypes(rootPointerEventTypes);
              }
            }

            break;
          }
      }
    },
    onUnmount: unmountResponder
  };
  var rootMouseEventTypes = ['mousemove', 'mouseout'];
  var hoverResponderFallbackImpl = {
    targetEventTypes: ['mouseover', 'mousemove', 'touchstart'],
    getInitialState: function () {
      return {
        isActiveHovered: false,
        isHovered: false,
        isTouched: false,
        ignoreEmulatedMouseEvents: false
      };
    },
    allowMultipleHostChildren: false,
    allowEventHooks: true,
    onRootEvent: function (event, context, props, state) {
      var type = event.type;

      switch (type) {
        // MOVE
        case 'mousemove':
          {
            if (state.isHovered && state.hoverTarget !== null && !state.ignoreEmulatedMouseEvents) {
              dispatchHoverMoveEvent(event, context, props, state);
            }

            break;
          }
        // END

        case 'mouseout':
          {
            if (state.isHovered) {
              if (dispatchHoverEndEvents(event, context, props, state)) {
                context.removeRootEventTypes(rootMouseEventTypes);
              }
            }

            break;
          }
      }
    },
    onEvent: function (event, context, props, state) {
      var type = event.type;

      if (props.disabled) {
        if (state.isHovered) {
          context.removeRootEventTypes(rootMouseEventTypes);
          dispatchHoverEndEvents(event, context, props, state);
          state.ignoreEmulatedMouseEvents = false;
        }

        state.isTouched = false;
        return;
      }

      switch (type) {
        // START
        case 'mouseover':
          {
            if (!state.isHovered && !state.ignoreEmulatedMouseEvents) {
              state.hoverTarget = context.getResponderNode();

              if (dispatchHoverStartEvents(event, context, props, state)) {
                context.addRootEventTypes(rootMouseEventTypes);
              }
            }

            break;
          }
        // MOVE

        case 'mousemove':
          {
            if (!state.isHovered && type === 'mousemove') {
              state.ignoreEmulatedMouseEvents = false;
              state.isTouched = false;
            }

            break;
          }

        case 'touchstart':
          {
            if (!state.isHovered) {
              state.isTouched = true;
              state.ignoreEmulatedMouseEvents = true;
            }

            break;
          }
      }
    },
    onUnmount: unmountResponder
  };
  var HoverResponder = React.DEPRECATED_createResponder('Hover', hasPointerEvents ? hoverResponderImpl : hoverResponderFallbackImpl);
  function useHover(props) {
    return React.DEPRECATED_useResponder(HoverResponder, props);
  }

  var Hover = /*#__PURE__*/Object.freeze({
    __proto__: null,
    HoverResponder: HoverResponder,
    useHover: useHover
  });

  var hover = Hover;

  return hover;

})));
