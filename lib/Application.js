"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _EventEmitter2 = _interopRequireDefault(require("./EventEmitter"));

var Events = _interopRequireWildcard(require("./Events"));

var _Composition = _interopRequireDefault(require("./Composition"));

var _Renderer = require("./Renderer");

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

//const FPS_EPSILON = 10; // +/- 10ms for animation loop to determine if enough time has passed to render
//const DEFAULT_TARGET_FPS = 1000 / 60; //amount of time that must pass before rendering

/**
 * The Compositor class is the entry-point to usage of the `canvas-compositor`.
 * The application programmer is expected to hand over low-level control of the canvas
 * context to the high-level classes and methods exposed by CanvasCompositor.
 *
 * The Compositor class establishes an event dispatcher, animation loop, and scene graph for
 * compositions.
 */
var Application = /*#__PURE__*/function (_EventEmitter) {
  _inherits(Application, _EventEmitter);

  var _super = _createSuper(Application);

  /**
   * The Compositor class establishes an event dispatcher, animation loop, and scene graph for
   * compositions
   *
   * @param {object} canvas This should be a canvas, either from the DOM or an equivalent API
   *
   * @example
   * let cc = new Compositor(document.getElementById('myCanvas'));
   */
  function Application(canvas) {
    var _this;

    _classCallCheck(this, Application);

    _this = _super.call(this);
    /**
     * The canvas used by the compositor
     */

    _this._canvas = canvas;
    /**
     * The context used by the compositor
     */

    _this._context = _this._canvas.getContext('2d'); //acquire the padding on the canvas – this is necessary to properly
    //locate the mouse position
    //TODO: determine if border-box affects this, and adjust accordingly

    var style = window.getComputedStyle(_this._canvas);
    /**
     * The x coordinate of the mouse position within the canvas
     * @type {number}
     */

    _this._mouseX = null;
    /**
     * The y coordinate of the mouse position within the canvas
     * @type {number}
     */

    _this._mouseY = null;
    var borderLeft = style.getPropertyValue('border-left') ? parseFloat(style.getPropertyValue('border-left')) : 0;
    var paddingLeft = style.getPropertyValue('padding-left') ? parseFloat(style.getPropertyValue('padding-left')) : 0;
    /**
     * Any left padding and border added to the canvas must be known to calculate mouse position
     * @todo determine if this is affected by borderbox
     * @type {number}
     */

    _this._leftPadding = borderLeft + paddingLeft;
    var borderTop = style.getPropertyValue('border-top') ? parseFloat(style.getPropertyValue('border-top')) : 0;
    var paddingTop = style.getPropertyValue('padding-top') ? parseFloat(style.getPropertyValue('padding-top')) : 0;
    /**
     * Any top padding and border added to the canvas must be known to calculate mouse position
     * @type {number}
     */

    _this._topPadding = borderTop + paddingTop;
    /**
     * The timestamp of the current loop of animation
     * @type {number}
     */

    _this._currentTime = 0;
    /**
     * The timestamp of the last frame drawn by the animation loop
     * @type {number}
     */

    _this._lastFrameTimestamp = 0;
    /**
     * The timestamp of the last render performed by the animation loop
     * @type {number}
     */
    //this._lastRenderTime = 0;

    /**
     * The object last granted "focus"
     * @type {object}
     */

    _this._targetObject = null;
    /**
     * The scene composition. This is the root object to be rendered, everything else rendered must be a child of the scene
     * @type {object}
     */

    _this._scene = new _Composition["default"](_this.canvas);

    _this._bindEvents();

    _this._animationLoop();
    /**
     * The framerate of the animation loop
     * @type {number}
     */


    _this._framerate = 0;
    return _this;
  }
  /**
   * retrieve the current framerate
   * @type {number}
   */


  _createClass(Application, [{
    key: "framerate",
    get: function get() {
      //var framerateUpdatedEvent = new Event();
      return this._framerate;
    } //TODO: multiple target objects? in reverse order of render? in order of composition?

    /**
     * the object currently selected for interaction
     * @type {object}
     */

  }, {
    key: "targetObject",
    get: function get() {
      return this._targetObject;
    }
    /**
     * the object currently selected for interaction
     * @param {object} val
     * @type {object}
     */
    ,
    set: function set(val) {
      this._targetObject = val;
    }
    /**
     * the root of the scene graph. add primitives to this to compose an image
     * @type {object}
     */

  }, {
    key: "scene",
    get: function get() {
      return this._scene;
    }
    /**
     * get the X position of the mouse on the canvas
     * @type {number}
     */

  }, {
    key: "mouseX",
    get: function get() {
      return this._mouseX;
    }
    /**
     * get the Y position of the mouse on the canvas
     * @type {number}
     */

  }, {
    key: "mouseY",
    get: function get() {
      return this._mouseY;
    }
    /**
     * The animation loop for this instance of Compositor.
     * Upon receipt of the animation frame from `requestAnimationFrame`, the loop will check
     * whether enough time has passed to redraw for the target framerate.
     * It will only draw if somewhere along the scene graph, an object needs updating.
     * There is no need to invoke this directly, the constructor will do it.
     */

  }, {
    key: "_animationLoop",
    value: function _animationLoop() {
      window.requestAnimationFrame(this._animationLoop.bind(this));
      this._currentTime = +new Date(); //set maximum of 60 fps and only redraw if necessary

      if (
      /*this._currentTime - this._lastFrameTimestamp >= this._targetFPS &&*/
      this.scene.needsDraw) {
        //this._lastRenderTime = +new Date();
        (0, _Renderer.clearRect)(0, 0, this._canvas.width, this._canvas.height, this._context);
        this.scene.draw(this._context);
      }

      this._framerate = parseInt(1000 / (this._currentTime - this._lastFrameTimestamp));
      this._lastFrameTimestamp = +new Date();
    }
    /**
     * attach interaction events to the canvas. the canvas compositor dispatches
     * events to relevant objects through bridges to the scene graph
     */

  }, {
    key: "_bindEvents",
    value: function _bindEvents() {
      //must bind to `this` to retain reference
      var _cc = this;

      this._canvas.addEventListener(Events.MOUSEDOWN, function (e) {
        _cc.dispatchEvent(e);
      });

      this._canvas.addEventListener(Events.MOUSEMOVE, function (e) {
        _cc.dispatchEvent(e);
      });

      this._canvas.addEventListener(Events.MOUSEUP, function (e) {
        _cc.dispatchEvent(e);
      });

      this._canvas.addEventListener(Events.MOUSEOUT, function (e) {
        _cc.dispatchEvent(e);
      });

      this._canvas.addEventListener(Events.CLICK, function (e) {
        _cc.dispatchEvent(e);
      });

      this.addEventListener(Events.MOUSEDOWN, this._handleMouseDown);
      this.addEventListener(Events.MOUSEMOVE, this._handleMouseMove);
      this.addEventListener(Events.MOUSEUP, this._handleMouseUp);
      this.addEventListener(Events.MOUSEOUT, this._handleMouseOut);
      this.addEventListener(Events.CLICK, this._handleClick);
    }
    /**
     * bridge the mouse down event on the canvas to the
     * the objects in the scene graph
     */

  }, {
    key: "_handleMouseDown",
    value: function _handleMouseDown(e) {
      e.preventDefault();
      var x = e.offsetX - this._leftPadding;
      var y = e.offsetY - this._topPadding; //pass through x and y to propagated events

      e.canvasX = x;
      e.canvasY = y;
      var clickedObject = this.scene.childAt(x, y);

      if (clickedObject) {
        clickedObject.dispatchEvent(e);
      }
    }
    /**
     * bridge the mouse up event on the canvas to the
     * the objects in the scene graph
     */

  }, {
    key: "_handleMouseUp",
    value: function _handleMouseUp(e) {
      e.preventDefault();
      var x = e.offsetX - this._leftPadding;
      var y = e.offsetY - this._topPadding; //pass through x and y to propagated events

      e.canvasX = x;
      e.canvasY = y;

      var _iterator = _createForOfIteratorHelper(this.scene.children),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var c = _step.value;
          c.dispatchEvent(e);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      var clickedObject = this.scene.childAt(x, y);

      if (clickedObject) {
        clickedObject.dispatchEvent(e);
      }
    }
  }, {
    key: "_handleMouseMove",
    value:
    /**
     * bridge the mouse move event on the canvas to the
     * the objects in the scene graph
     */
    function _handleMouseMove(e) {
      e.preventDefault();
      this._mouseX = e.offsetX - this._leftPadding;
      this._mouseY = e.offsetY - this._topPadding;

      var _iterator2 = _createForOfIteratorHelper(this.scene.children),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var c = _step2.value;
          c.dispatchEvent(e);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
  }, {
    key: "_handleClick",
    value:
    /**
     * bridge the click event on the canvas to the
     * the objects in the scene graph
     */
    function _handleClick(e) {
      e.preventDefault();
      var x = e.offsetX - this._leftPadding;
      var y = e.offsetY - this._topPadding; //pass through x and y to propagated events

      e.canvasX = x;
      e.canvasY = y;
      var clickedObject = this.scene.childAt(x, y);

      if (clickedObject) {
        clickedObject.dispatchEvent(e);
      }
    }
  }, {
    key: "_handleMouseOut",
    value:
    /**
     * bridge the mouse out event on the canvas to the
     * the objects in the scene graph
     */
    function _handleMouseOut(e) {
      e.preventDefault();

      var _iterator3 = _createForOfIteratorHelper(this.scene.children),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var c = _step3.value;
          c.dispatchEvent(e);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      ;
    }
  }]);

  return Application;
}(_EventEmitter2["default"]);

exports["default"] = Application;
//# sourceMappingURL=Application.js.map