"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;
Object.defineProperty(exports, "DEFAULTS", {
  enumerable: true,
  get: function get() {
    return _Renderer.DEFAULTS;
  }
});
Object.defineProperty(exports, "Renderer", {
  enumerable: true,
  get: function get() {
    return _Renderer.Renderer;
  }
});
Object.defineProperty(exports, "Composition", {
  enumerable: true,
  get: function get() {
    return _Composition.Composition;
  }
});
Object.defineProperty(exports, "PrimitiveComponent", {
  enumerable: true,
  get: function get() {
    return _PrimitiveComponent.PrimitiveComponent;
  }
});
Object.defineProperty(exports, "Circle", {
  enumerable: true,
  get: function get() {
    return _Circle.Circle;
  }
});
Object.defineProperty(exports, "Ellipse", {
  enumerable: true,
  get: function get() {
    return _Ellipse.Ellipse;
  }
});
Object.defineProperty(exports, "Rectangle", {
  enumerable: true,
  get: function get() {
    return _Rectangle.Rectangle;
  }
});
Object.defineProperty(exports, "Line", {
  enumerable: true,
  get: function get() {
    return _Line.Line;
  }
});
Object.defineProperty(exports, "VectorPath", {
  enumerable: true,
  get: function get() {
    return _VectorPath.VectorPath;
  }
});
Object.defineProperty(exports, "Bezier", {
  enumerable: true,
  get: function get() {
    return _Bezier.Bezier;
  }
});
Object.defineProperty(exports, "Image", {
  enumerable: true,
  get: function get() {
    return _Image.Image;
  }
});
Object.defineProperty(exports, "Text", {
  enumerable: true,
  get: function get() {
    return _Text.Text;
  }
});
exports.EVENTS = exports.EPSILON = void 0;

var _Renderer = require("./Renderer");

var _Composition = require("./Composition");

var _PrimitiveComponent = require("./PrimitiveComponent");

var _Circle = require("./Circle");

var _Ellipse = require("./Ellipse");

var _Rectangle = require("./Rectangle");

var _Line = require("./Line");

var _VectorPath = require("./VectorPath");

var _Bezier = require("./Bezier");

var _Image = require("./Image");

var _Text = require("./Text");

var _microMvc = require("micro-mvc");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

//const FPS_EPSILON = 10; // +/- 10ms for animation loop to determine if enough time has passed to render
var DEFAULT_TARGET_FPS = 1000 / 60; //amount of time that must pass before rendering

var EPSILON = Number.EPSILON;
exports.EPSILON = EPSILON;
var EVENTS = {
  MOUSEUP: 'mouseup',
  MOUSEDOWN: 'mousedown',
  MOUSEMOVE: 'mousemove',
  MOUSEOUT: 'mouseout',
  CLICK: 'click',
  KEYDOWN: 'keydown',
  KEYUP: 'keyup',
  KEYPRESS: 'keypress'
};
/**
 * The CanvasCompositor class is the entry-point to usage of the `canvas-compositor`.
 * The application programmer is expected to hand over low-level control of the canvas
 * context to the high-level classes and methods exposed by CanvasCompositor.
 *
 * The CanvasCompositor class establishes an event dispatcher, animation loop, and scene graph for
 * compositions.
 */

exports.EVENTS = EVENTS;

var CanvasCompositor =
/*#__PURE__*/
function (_EventEmitter) {
  _inherits(CanvasCompositor, _EventEmitter);

  /**
   * The CanvasCompositor class establishes an event dispatcher, animation loop, and scene graph for
   * compositions
   *
   * @param {object} canvas This should be a canvas, either from the DOM or an equivalent API
   *
   * @example
   * let cc = new CanvasCompositor(document.getElementById('myCanvas'));
   */
  function CanvasCompositor(canvas) {
    var _this;

    _classCallCheck(this, CanvasCompositor);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(CanvasCompositor).call(this));
    _this._canvas = canvas;
    _this._context = _this._canvas.getContext('2d'); //acquire the padding on the canvas – this is necessary to properly
    //locate the mouse position
    //TODO: determine if border-box affects this, and adjust accordingly

    var style = window.getComputedStyle(_this._canvas);
    _this._mouseX = null;
    _this._mouseY = null;
    var borderLeft = style.getPropertyValue('border-left') ? parseFloat(style.getPropertyValue('border-left')) : 0;
    var paddingLeft = style.getPropertyValue('padding-left') ? parseFloat(style.getPropertyValue('padding-left')) : 0;
    _this._leftPadding = borderLeft + paddingLeft;
    var borderTop = style.getPropertyValue('border-top') ? parseFloat(style.getPropertyValue('border-top')) : 0;
    var paddingTop = style.getPropertyValue('padding-top') ? parseFloat(style.getPropertyValue('padding-top')) : 0;
    _this._topPadding = borderTop + paddingTop;
    _this._currentTime = 0;
    _this._lastFrameTimestamp = 0;
    _this._lastRenderTime = 0;
    _this._targetObject = null;
    _this._scene = new _Composition.Composition(_this.canvas);

    _this._bindEvents();

    _this._animationLoop();

    _this._framerate = 0;
    return _this;
  }

  _createClass(CanvasCompositor, [{
    key: "_animationLoop",

    /**
     * The animation loop for this instance of CanvasCompositor.
     * Upon receipt of the animation frame from `requestAnimationFrame`, the loop will check
     * whether enough time has passed to redraw for the target framerate.
     * It will only draw if somewhere along the scene graph, an object needs updating.
     * There is no need to invoke this directly, the constructor will do it.
     */
    value: function _animationLoop() {
      window.requestAnimationFrame(this._animationLoop.bind(this));
      this._currentTime = +new Date(); //set maximum of 60 fps and only redraw if necessary

      if (
      /*this._currentTime - this._lastFrameTimestamp >= this._targetFPS &&*/
      this.scene.needsDraw) {
        this._lastRenderTime = +new Date();

        _Renderer.Renderer.clearRect(0, 0, this._canvas.width, this._canvas.height, this._context);

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

      this._canvas.addEventListener('mousedown', function (e) {
        _cc.dispatchEvent(e);
      });

      this._canvas.addEventListener('mousemove', function (e) {
        _cc.dispatchEvent(e);
      });

      this._canvas.addEventListener('mouseup', function (e) {
        _cc.dispatchEvent(e);
      });

      this._canvas.addEventListener('mouseout', function (e) {
        _cc.dispatchEvent(e);
      });

      this._canvas.addEventListener('click', function (e) {
        _cc.dispatchEvent(e);
      });

      this.addEventListener('mousedown', this._handleMouseDown);
      this.addEventListener('mousemove', this._handleMouseMove);
      this.addEventListener('mouseup', this._handleMouseUp);
      this.addEventListener('mouseout', this._handleMouseOut);
      this.addEventListener('click', this._handleClick);
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
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.scene.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var c = _step.value;
          c.dispatchEvent(e);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      var clickedObject = this.scene.childAt(x, y);

      if (clickedObject) {
        clickedObject.dispatchEvent(e);
      }
    }
  }, {
    key: "_handleMouseMove",

    /**
     * bridge the mouse move event on the canvas to the
     * the objects in the scene graph
     */
    value: function _handleMouseMove(e) {
      e.preventDefault();
      this._mouseX = e.offsetX - this._leftPadding;
      this._mouseY = e.offsetY - this._topPadding;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.scene.children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var c = _step2.value;
          c.dispatchEvent(e);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
  }, {
    key: "_handleClick",

    /**
     * bridge the click event on the canvas to the
     * the objects in the scene graph
     */
    value: function _handleClick(e) {
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

    /**
     * bridge the mouse out event on the canvas to the
     * the objects in the scene graph
     */
    value: function _handleMouseOut(e) {
      e.preventDefault();
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this.scene.children[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var c = _step3.value;
          c.dispatchEvent(e);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      ;
    }
  }, {
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
  }]);

  return CanvasCompositor;
}(_microMvc.EventEmitter);
/**
 * The initialization function
 */


function init(canvas) {
  return new CanvasCompositor(canvas);
}
//# sourceMappingURL=CanvasCompositor.js.map