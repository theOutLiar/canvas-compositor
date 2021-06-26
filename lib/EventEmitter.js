"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * The EventEmitter class is modified from a snippet by MDN Contributers at
 * https://developer.mozilla.org/en-US/docs/Web/API/EventTarget#_Simple_implementation_of_EventTarget
 * Any copyright is dedicated to the Public Domain. http://creativecommons.org/publicdomain/zero/1.0/
 *
 * This enables custom classes to dispatch events, and is used by micro-mvc to establish observers
 * and fulfill the Model-View-Controller design pattern
 */
var EventEmitter = /*#__PURE__*/function () {
  /**
   * This class is intended to be extended or composed into other classes.
   */
  function EventEmitter() {
    _classCallCheck(this, EventEmitter);

    /**
     * Listeners for each event type
     * @type {object}
     */
    this._listeners = {};
  }
  /**
   * Add an event listener
   * @param {string} type The name of the event
   * @param {function} callback The function to execute upon occurence of the event
   */


  _createClass(EventEmitter, [{
    key: "addEventListener",
    value: function addEventListener(type, callback) {
      if (!(type in this._listeners)) {
        this._listeners[type] = [];
      }

      this._listeners[type].push(callback);
    }
    /**
     * Remove an even listner
     * @param {string} type The name of the event
     * @param {function} callback The function to stop executing upon occurence of the event
     */

  }, {
    key: "removeEventListener",
    value: function removeEventListener(type, callback) {
      if (!(type in this._listeners)) {
        return;
      }

      var stack = this._listeners[type];

      for (var i = 0, l = stack.length; i < l; i++) {
        if (stack[i] === callback) {
          stack.splice(i, 1);
          return;
        }
      }
    }
    /**
     * Dispatch an event. Upon dispatching an event, all listeners are called
     * @param {object} event The `Event` that needs to be dispatched.
     * @return {boolean} returns the inverse of `event.defaultPrevented`
     */

  }, {
    key: "dispatchEvent",
    value: function dispatchEvent(event) {
      if (!(event.type in this._listeners)) {
        return true;
      }

      var stack = this._listeners[event.type].slice();

      for (var i = 0, l = stack.length; i < l; i++) {
        stack[i].call(this, event);
      }

      return !event.defaultPrevented;
    }
    /**
     * Check whether the instance has listeners for the provided event type
     * @return {boolean} true if there is a listener for this event type, otherwise false
     * @param {string} type The type of event to check for
     */

  }, {
    key: "listensFor",
    value: function listensFor(type) {
      return !!this._listeners[type];
    }
    /**
     * Check whether the instance has a specific listener for the provided event type
     * @return {boolean} true if the callback exists for this event type, otherwise false
     * @param {string} type The type of event to check for
     * @param {function} callback The specific callback to check for
     */

  }, {
    key: "hasListener",
    value: function hasListener(type, callback) {
      return !!this._listeners[type] ? this._listeners[type].indexOf(callback) >= 0 : false;
    }
  }, {
    key: "once",
    value: function once(type, callback) {
      var _this = this;

      return this.addEventListener(type, function () {
        callback.apply(void 0, arguments);

        _this.removeEventListener.apply(_this, arguments);
      });
    }
  }]);

  return EventEmitter;
}();

exports["default"] = EventEmitter;
EventEmitter.prototype.on = EventEmitter.prototype.addEventListener;
EventEmitter.prototype.off = EventEmitter.prototype.removeEventListener;
//# sourceMappingURL=EventEmitter.js.map