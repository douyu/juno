/** @license React vundefined
 * react-interactions-events/press-legacy.development.js
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
  (global = global || self, global.ReactEventsPressLegacy = factory(global.React));
}(this, (function (React) { 'use strict';

  var ReactSharedInternals = React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED; // Prevent newer renderers from RTE when used with older react package versions.
  // Current owner and dispatcher used to share the same ref,
  // but PR #14548 split them out to better support the react-debug-tools package.

  if (!ReactSharedInternals.hasOwnProperty('ReactCurrentDispatcher')) {
    ReactSharedInternals.ReactCurrentDispatcher = {
      current: null
    };
  }

  if (!ReactSharedInternals.hasOwnProperty('ReactCurrentBatchConfig')) {
    ReactSharedInternals.ReactCurrentBatchConfig = {
      suspense: null
    };
  }

  function error(format) {
    {
      for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        args[_key2 - 1] = arguments[_key2];
      }

      printWarning('error', format, args);
    }
  }

  function printWarning(level, format, args) {
    // When changing this logic, you might want to also
    // update consoleWithStackDev.www.js as well.
    {
      var hasExistingStack = args.length > 0 && typeof args[args.length - 1] === 'string' && args[args.length - 1].indexOf('\n    in') === 0;

      if (!hasExistingStack) {
        var ReactDebugCurrentFrame = ReactSharedInternals.ReactDebugCurrentFrame;
        var stack = ReactDebugCurrentFrame.getStackAddendum();

        if (stack !== '') {
          format += '%s';
          args = args.concat([stack]);
        }
      }

      var argsWithFormat = args.map(function (item) {
        return '' + item;
      }); // Careful: RN currently depends on this prefix

      argsWithFormat.unshift('Warning: ' + format); // We intentionally don't use spread (or .apply) directly because it
      // breaks IE9: https://github.com/facebook/react/issues/13610
      // eslint-disable-next-line react-internal/no-production-logging

      Function.prototype.apply.call(console[level], console, argsWithFormat);

      try {
        // --- Welcome to debugging React ---
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        var argIndex = 0;
        var message = 'Warning: ' + format.replace(/%s/g, function () {
          return args[argIndex++];
        });
        throw new Error(message);
      } catch (x) {}
    }
  }

  var DiscreteEvent = 0;
  var UserBlockingEvent = 1;

  var hasPointerEvents = typeof window !== 'undefined' && window.PointerEvent !== undefined;
  var isMac = typeof window !== 'undefined' && window.navigator != null ? /^Mac/.test(window.navigator.platform) : false;
  var DEFAULT_PRESS_RETENTION_OFFSET = {
    bottom: 20,
    top: 20,
    left: 20,
    right: 20
  };
  var targetEventTypes = hasPointerEvents ? ['keydown_active', 'pointerdown_active', 'click_active'] : ['keydown_active', 'touchstart', 'mousedown_active', 'click_active'];
  var rootEventTypes = hasPointerEvents ? ['pointerup_active', 'pointermove', 'pointercancel', 'click', 'keyup', 'scroll', 'blur'] : ['click', 'keyup', 'scroll', 'mousemove', 'touchmove', 'touchcancel', // Used as a 'cancel' signal for mouse interactions
  'dragstart', 'mouseup_active', 'touchend', 'blur'];

  function isFunction(obj) {
    return typeof obj === 'function';
  }

  function createPressEvent(context, type, target, pointerType, event, touchEvent, defaultPrevented, state) {
    var timeStamp = context.getTimeStamp();
    var clientX = null;
    var clientY = null;
    var pageX = null;
    var pageY = null;
    var screenX = null;
    var screenY = null;
    var altKey = false;
    var ctrlKey = false;
    var metaKey = false;
    var shiftKey = false;
    var nativeEvent;

    if (event) {
      nativeEvent = event.nativeEvent;
      var _nativeEvent = nativeEvent;
      altKey = _nativeEvent.altKey;
      ctrlKey = _nativeEvent.ctrlKey;
      metaKey = _nativeEvent.metaKey;
      shiftKey = _nativeEvent.shiftKey;
      // Only check for one property, checking for all of them is costly. We can assume
      // if clientX exists, so do the rest.
      var eventObject;
      eventObject = touchEvent || nativeEvent;

      if (eventObject) {
        var _eventObject = eventObject;
        clientX = _eventObject.clientX;
        clientY = _eventObject.clientY;
        pageX = _eventObject.pageX;
        pageY = _eventObject.pageY;
        screenX = _eventObject.screenX;
        screenY = _eventObject.screenY;
      }
    }

    var pressEvent = {
      altKey: altKey,
      buttons: state.buttons,
      clientX: clientX,
      clientY: clientY,
      ctrlKey: ctrlKey,
      defaultPrevented: defaultPrevented,
      metaKey: metaKey,
      pageX: pageX,
      pageY: pageY,
      pointerType: pointerType,
      screenX: screenX,
      screenY: screenY,
      shiftKey: shiftKey,
      target: target,
      timeStamp: timeStamp,
      type: type,
      x: clientX,
      y: clientY,
      preventDefault: function () {
        state.shouldPreventClick = true;

        if (nativeEvent) {
          pressEvent.defaultPrevented = true;
          nativeEvent.preventDefault();
        }
      },
      stopPropagation: function () {
        // NO-OP, we should remove this in the future
        {
          error('stopPropagation is not available on event objects created from event responder modules (React Flare). ' + 'Try wrapping in a conditional, i.e. `if (event.type !== "press") { event.stopPropagation() }`');
        }
      }
    };
    return pressEvent;
  }

  function dispatchEvent(event, listener, context, state, name, eventPriority) {
    var target = state.pressTarget;
    var pointerType = state.pointerType;
    var defaultPrevented = event != null && event.nativeEvent.defaultPrevented === true || name === 'press' && state.shouldPreventClick;
    var touchEvent = state.touchEvent;
    var syntheticEvent = createPressEvent(context, name, target, pointerType, event, touchEvent, defaultPrevented, state);
    context.dispatchEvent(syntheticEvent, listener, eventPriority);
  }

  function dispatchPressChangeEvent(context, props, state) {
    var onPressChange = props.onPressChange;

    if (isFunction(onPressChange)) {
      var bool = state.isActivePressed;
      context.dispatchEvent(bool, onPressChange, DiscreteEvent);
    }
  }

  function dispatchPressStartEvents(event, context, props, state) {
    state.isPressed = true;

    if (!state.isActivePressStart) {
      state.isActivePressStart = true;
      var nativeEvent = event.nativeEvent;

      var _ref = state.touchEvent || nativeEvent,
          x = _ref.clientX,
          y = _ref.clientY;

      var wasActivePressed = state.isActivePressed;
      state.isActivePressed = true;

      if (x !== undefined && y !== undefined) {
        state.activationPosition = {
          x: x,
          y: y
        };
      }

      var onPressStart = props.onPressStart;

      if (isFunction(onPressStart)) {
        dispatchEvent(event, onPressStart, context, state, 'pressstart', DiscreteEvent);
      }

      if (!wasActivePressed) {
        dispatchPressChangeEvent(context, props, state);
      }
    }
  }

  function dispatchPressEndEvents(event, context, props, state) {
    state.isActivePressStart = false;
    state.isPressed = false;

    if (state.isActivePressed) {
      state.isActivePressed = false;
      var onPressEnd = props.onPressEnd;

      if (isFunction(onPressEnd)) {
        dispatchEvent(event, onPressEnd, context, state, 'pressend', DiscreteEvent);
      }

      dispatchPressChangeEvent(context, props, state);
    }

    state.responderRegionOnDeactivation = null;
  }

  function dispatchCancel(event, context, props, state) {
    state.touchEvent = null;

    if (state.isPressed) {
      state.ignoreEmulatedMouseEvents = false;
      dispatchPressEndEvents(event, context, props, state);
    }

    removeRootEventTypes(context, state);
  }

  function isValidKeyboardEvent(nativeEvent) {
    var key = nativeEvent.key,
        target = nativeEvent.target;
    var tagName = target.tagName,
        isContentEditable = target.isContentEditable; // Accessibility for keyboards. Space and Enter only.
    // "Spacebar" is for IE 11

    return (key === 'Enter' || key === ' ' || key === 'Spacebar') && tagName !== 'INPUT' && tagName !== 'TEXTAREA' && isContentEditable !== true;
  } // TODO: account for touch hit slop


  function calculateResponderRegion(context, target, props) {
    var pressRetentionOffset = context.objectAssign({}, DEFAULT_PRESS_RETENTION_OFFSET, props.pressRetentionOffset);

    var _target$getBoundingCl = target.getBoundingClientRect(),
        left = _target$getBoundingCl.left,
        right = _target$getBoundingCl.right,
        bottom = _target$getBoundingCl.bottom,
        top = _target$getBoundingCl.top;

    if (pressRetentionOffset) {
      if (pressRetentionOffset.bottom != null) {
        bottom += pressRetentionOffset.bottom;
      }

      if (pressRetentionOffset.left != null) {
        left -= pressRetentionOffset.left;
      }

      if (pressRetentionOffset.right != null) {
        right += pressRetentionOffset.right;
      }

      if (pressRetentionOffset.top != null) {
        top -= pressRetentionOffset.top;
      }
    }

    return {
      bottom: bottom,
      top: top,
      left: left,
      right: right
    };
  }

  function getTouchFromPressEvent(nativeEvent) {
    var targetTouches = nativeEvent.targetTouches;

    if (targetTouches.length > 0) {
      return targetTouches[0];
    }

    return null;
  }

  function unmountResponder(context, props, state) {
    if (state.isPressed) {
      removeRootEventTypes(context, state);
      dispatchPressEndEvents(null, context, props, state);
    }
  }

  function addRootEventTypes(context, state) {
    if (!state.addedRootEvents) {
      state.addedRootEvents = true;
      context.addRootEventTypes(rootEventTypes);
    }
  }

  function removeRootEventTypes(context, state) {
    if (state.addedRootEvents) {
      state.addedRootEvents = false;
      context.removeRootEventTypes(rootEventTypes);
    }
  }

  function getTouchById(nativeEvent, pointerId) {
    var changedTouches = nativeEvent.changedTouches;

    for (var i = 0; i < changedTouches.length; i++) {
      var touch = changedTouches[i];

      if (touch.identifier === pointerId) {
        return touch;
      }
    }

    return null;
  }

  function getTouchTarget(context, touchEvent) {
    var doc = context.getActiveDocument();
    return doc.elementFromPoint(touchEvent.clientX, touchEvent.clientY);
  }

  function updateIsPressWithinResponderRegion(nativeEventOrTouchEvent, context, props, state) {
    // Calculate the responder region we use for deactivation if not
    // already done during move event.
    if (state.responderRegionOnDeactivation == null) {
      state.responderRegionOnDeactivation = calculateResponderRegion(context, state.pressTarget, props);
    }

    var responderRegionOnActivation = state.responderRegionOnActivation,
        responderRegionOnDeactivation = state.responderRegionOnDeactivation;
    var left, top, right, bottom;

    if (responderRegionOnActivation != null) {
      left = responderRegionOnActivation.left;
      top = responderRegionOnActivation.top;
      right = responderRegionOnActivation.right;
      bottom = responderRegionOnActivation.bottom;

      if (responderRegionOnDeactivation != null) {
        left = Math.min(left, responderRegionOnDeactivation.left);
        top = Math.min(top, responderRegionOnDeactivation.top);
        right = Math.max(right, responderRegionOnDeactivation.right);
        bottom = Math.max(bottom, responderRegionOnDeactivation.bottom);
      }
    }

    var _ref2 = nativeEventOrTouchEvent,
        x = _ref2.clientX,
        y = _ref2.clientY;
    state.isPressWithinResponderRegion = left != null && right != null && top != null && bottom != null && x !== null && y !== null && x >= left && x <= right && y >= top && y <= bottom;
  } // After some investigation work, screen reader virtual
  // clicks (NVDA, Jaws, VoiceOver) do not have co-ords associated with the click
  // event and "detail" is always 0 (where normal clicks are > 0)


  function isScreenReaderVirtualClick(nativeEvent) {
    // JAWS/NVDA with Firefox.
    if (nativeEvent.mozInputSource === 0 && nativeEvent.isTrusted) {
      return true;
    } // Chrome


    return nativeEvent.detail === 0 && nativeEvent.screenX === 0 && nativeEvent.screenY === 0 && nativeEvent.clientX === 0 && nativeEvent.clientY === 0;
  }

  function targetIsDocument(target) {
    // When target is null, it is the root
    return target === null || target.nodeType === 9;
  }

  var pressResponderImpl = {
    targetEventTypes: targetEventTypes,
    getInitialState: function () {
      return {
        activationPosition: null,
        addedRootEvents: false,
        buttons: 0,
        isActivePressed: false,
        isActivePressStart: false,
        isPressed: false,
        isPressWithinResponderRegion: true,
        pointerType: '',
        pressTarget: null,
        responderRegionOnActivation: null,
        responderRegionOnDeactivation: null,
        ignoreEmulatedMouseEvents: false,
        activePointerId: null,
        shouldPreventClick: false,
        touchEvent: null
      };
    },
    onEvent: function (event, context, props, state) {
      var pointerType = event.pointerType,
          type = event.type;

      if (props.disabled) {
        removeRootEventTypes(context, state);
        dispatchPressEndEvents(event, context, props, state);
        state.ignoreEmulatedMouseEvents = false;
        return;
      }

      var nativeEvent = event.nativeEvent;
      var isPressed = state.isPressed;

      switch (type) {
        // START
        case 'pointerdown':
        case 'keydown':
        case 'mousedown':
        case 'touchstart':
          {
            if (!isPressed) {
              var isTouchEvent = type === 'touchstart';
              var isPointerEvent = type === 'pointerdown';
              var isKeyboardEvent = pointerType === 'keyboard';
              var isMouseEvent = pointerType === 'mouse'; // Ignore emulated mouse events

              if (type === 'mousedown' && state.ignoreEmulatedMouseEvents) {
                return;
              }

              state.shouldPreventClick = false;

              if (isTouchEvent) {
                state.ignoreEmulatedMouseEvents = true;
              } else if (isKeyboardEvent) {
                // Ignore unrelated key events
                if (isValidKeyboardEvent(nativeEvent)) {
                  var _ref3 = nativeEvent,
                      altKey = _ref3.altKey,
                      ctrlKey = _ref3.ctrlKey,
                      metaKey = _ref3.metaKey,
                      shiftKey = _ref3.shiftKey;

                  if (props.preventDefault !== false && !shiftKey && !metaKey && !ctrlKey && !altKey) {
                    nativeEvent.preventDefault();
                    state.shouldPreventClick = true;
                  }
                } else {
                  return;
                }
              } // We set these here, before the button check so we have this
              // data around for handling of the context menu


              state.pointerType = pointerType;
              var pressTarget = state.pressTarget = context.getResponderNode();

              if (isPointerEvent) {
                state.activePointerId = nativeEvent.pointerId;
              } else if (isTouchEvent) {
                var touchEvent = getTouchFromPressEvent(nativeEvent);

                if (touchEvent === null) {
                  return;
                }

                state.touchEvent = touchEvent;
                state.activePointerId = touchEvent.identifier;
              } // Ignore any device buttons except primary/middle and touch/pen contact.
              // Additionally we ignore primary-button + ctrl-key with Macs as that
              // acts like right-click and opens the contextmenu.


              if (nativeEvent.buttons === 2 || nativeEvent.buttons > 4 || isMac && isMouseEvent && nativeEvent.ctrlKey) {
                return;
              } // Exclude document targets


              if (!targetIsDocument(pressTarget)) {
                state.responderRegionOnActivation = calculateResponderRegion(context, pressTarget, props);
              }

              state.responderRegionOnDeactivation = null;
              state.isPressWithinResponderRegion = true;
              state.buttons = nativeEvent.buttons;

              if (nativeEvent.button === 1) {
                state.buttons = 4;
              }

              dispatchPressStartEvents(event, context, props, state);
              addRootEventTypes(context, state);
            } else {
              // Prevent spacebar press from scrolling the window
              if (isValidKeyboardEvent(nativeEvent) && nativeEvent.key === ' ') {
                nativeEvent.preventDefault();
              }
            }

            break;
          }

        case 'click':
          {
            if (state.shouldPreventClick) {
              nativeEvent.preventDefault();
            }

            var onPress = props.onPress;

            if (isFunction(onPress) && isScreenReaderVirtualClick(nativeEvent)) {
              state.pointerType = 'keyboard';
              state.pressTarget = context.getResponderNode();
              var preventDefault = props.preventDefault;

              if (preventDefault !== false) {
                nativeEvent.preventDefault();
              }

              dispatchEvent(event, onPress, context, state, 'press', DiscreteEvent);
            }

            break;
          }
      }
    },
    onRootEvent: function (event, context, props, state) {
      var pointerType = event.pointerType,
          target = event.target,
          type = event.type;
      var nativeEvent = event.nativeEvent;
      var isPressed = state.isPressed;
      var activePointerId = state.activePointerId;
      var previousPointerType = state.pointerType;

      switch (type) {
        // MOVE
        case 'pointermove':
        case 'mousemove':
        case 'touchmove':
          {
            var touchEvent; // Ignore emulated events (pointermove will dispatch touch and mouse events)
            // Ignore pointermove events during a keyboard press.

            if (previousPointerType !== pointerType) {
              return;
            }

            if (type === 'pointermove' && activePointerId !== nativeEvent.pointerId) {
              return;
            } else if (type === 'touchmove') {
              touchEvent = getTouchById(nativeEvent, activePointerId);

              if (touchEvent === null) {
                return;
              }

              state.touchEvent = touchEvent;
            }

            var pressTarget = state.pressTarget;

            if (pressTarget !== null && !targetIsDocument(pressTarget)) {
              if (pointerType === 'mouse' && context.isTargetWithinNode(target, pressTarget)) {
                state.isPressWithinResponderRegion = true;
              } else {
                // Calculate the responder region we use for deactivation, as the
                // element dimensions may have changed since activation.
                updateIsPressWithinResponderRegion(touchEvent || nativeEvent, context, props, state);
              }
            }

            if (state.isPressWithinResponderRegion) {
              if (isPressed) {
                var onPressMove = props.onPressMove;

                if (isFunction(onPressMove)) {
                  dispatchEvent(event, onPressMove, context, state, 'pressmove', UserBlockingEvent);
                }
              } else {
                dispatchPressStartEvents(event, context, props, state);
              }
            } else {
              dispatchPressEndEvents(event, context, props, state);
            }

            break;
          }
        // END

        case 'pointerup':
        case 'keyup':
        case 'mouseup':
        case 'touchend':
          {
            if (isPressed) {
              var buttons = state.buttons;
              var isKeyboardEvent = false;

              var _touchEvent;

              if (type === 'pointerup' && activePointerId !== nativeEvent.pointerId) {
                return;
              } else if (type === 'touchend') {
                _touchEvent = getTouchById(nativeEvent, activePointerId);

                if (_touchEvent === null) {
                  return;
                }

                state.touchEvent = _touchEvent;
                target = getTouchTarget(context, _touchEvent);
              } else if (type === 'keyup') {
                // Ignore unrelated keyboard events
                if (!isValidKeyboardEvent(nativeEvent)) {
                  return;
                }

                isKeyboardEvent = true;
                removeRootEventTypes(context, state);
              } else if (buttons === 4) {
                // Remove the root events here as no 'click' event is dispatched when this 'button' is pressed.
                removeRootEventTypes(context, state);
              } // Determine whether to call preventDefault on subsequent native events.


              if (target !== null && context.isTargetWithinResponder(target) && context.isTargetWithinHostComponent(target, 'a')) {
                var _ref4 = nativeEvent,
                    altKey = _ref4.altKey,
                    ctrlKey = _ref4.ctrlKey,
                    metaKey = _ref4.metaKey,
                    shiftKey = _ref4.shiftKey; // Check "open in new window/tab" and "open context menu" key modifiers

                var preventDefault = props.preventDefault;

                if (preventDefault !== false && !shiftKey && !metaKey && !ctrlKey && !altKey) {
                  state.shouldPreventClick = true;
                }
              }

              var _pressTarget = state.pressTarget;
              dispatchPressEndEvents(event, context, props, state);
              var onPress = props.onPress;

              if (_pressTarget !== null && isFunction(onPress)) {
                if (!isKeyboardEvent && _pressTarget !== null && target !== null && !targetIsDocument(_pressTarget)) {
                  if (pointerType === 'mouse' && context.isTargetWithinNode(target, _pressTarget)) {
                    state.isPressWithinResponderRegion = true;
                  } else {
                    // If the event target isn't within the press target, check if we're still
                    // within the responder region. The region may have changed if the
                    // element's layout was modified after activation.
                    updateIsPressWithinResponderRegion(_touchEvent || nativeEvent, context, props, state);
                  }
                }

                if (state.isPressWithinResponderRegion && buttons !== 4) {
                  dispatchEvent(event, onPress, context, state, 'press', DiscreteEvent);
                }
              }

              state.touchEvent = null;
            } else if (type === 'mouseup') {
              state.ignoreEmulatedMouseEvents = false;
            }

            break;
          }

        case 'click':
          {
            // "keyup" occurs after "click"
            if (previousPointerType !== 'keyboard') {
              removeRootEventTypes(context, state);
            }

            break;
          }
        // CANCEL

        case 'scroll':
          {
            // We ignore incoming scroll events when using mouse events
            if (previousPointerType === 'mouse') {
              return;
            }

            var _pressTarget2 = state.pressTarget;
            var scrollTarget = nativeEvent.target;
            var doc = context.getActiveDocument(); // If the scroll target is the document or if the press target
            // is inside the scroll target, then this a scroll that should
            // trigger a cancel.

            if (_pressTarget2 !== null && (scrollTarget === doc || context.isTargetWithinNode(_pressTarget2, scrollTarget))) {
              dispatchCancel(event, context, props, state);
            }

            break;
          }

        case 'pointercancel':
        case 'touchcancel':
        case 'dragstart':
          {
            dispatchCancel(event, context, props, state);
            break;
          }

        case 'blur':
          {
            // If we encounter a blur event that moves focus to
            // the window, then the relatedTarget will be null.
            // In this case, we should cancel the active press.
            // Alternatively, if the blur target matches the
            // current pressed target, we should also cancel
            // the active press.
            if (isPressed && (nativeEvent.relatedTarget === null || target === state.pressTarget)) {
              dispatchCancel(event, context, props, state);
            }
          }
      }
    },
    onUnmount: function (context, props, state) {
      unmountResponder(context, props, state);
    }
  };
  var PressResponder = React.DEPRECATED_createResponder('Press', pressResponderImpl);
  function usePress(props) {
    return React.DEPRECATED_useResponder(PressResponder, props);
  }

  var PressLegacy = /*#__PURE__*/Object.freeze({
    __proto__: null,
    PressResponder: PressResponder,
    usePress: usePress
  });

  var pressLegacy = PressLegacy;

  return pressLegacy;

})));
