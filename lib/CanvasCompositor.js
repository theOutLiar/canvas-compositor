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

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

//const FPS_EPSILON = 10; // +/- 10ms for animation loop to determine if enough time has passed to render
var DEFAULT_TARGET_FPS = 1000 / 60; //amount of time that must pass before rendering

var EVENTS = {
  MOUSEUP: 'onmouseup',
  MOUSEDOWN: 'onmousedown',
  MOUSEMOVE: 'onmousemove',
  MOUSEOUT: 'onmouseout',
  CLICK: 'onclick'
};
/**
 * The CanvasCompositor class is the entry-point to usage of the `canvas-compositor`.
 * The application programmer is expected to hand over low-level control of the canvas
 * context to the high-level classes and methods exposed by CanvasCompositor.
 *
 * The CanvasCompositor class establishes an event dispatcher, animation loop, and scene graph for
 * compositions.
 */

var CanvasCompositor =
/*#__PURE__*/
function () {
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
    _classCallCheck(this, CanvasCompositor);

    this._canvas = canvas;
    this._context = this._canvas.getContext('2d'); //acquire the padding on the canvas – this is necessary to properly
    //locate the mouse position
    //TODO: determine if border-box affects this, and adjust accordingly

    var style = window.getComputedStyle(this._canvas);
    this._rect = canvas.getBoundingClientRect();
    this._mouseX = null;
    this._mouseY = null;
    var borderLeft = style.getPropertyValue('border-left') ? parseFloat(style.getPropertyValue('border-left')) : 0;
    var paddingLeft = style.getPropertyValue('padding-left') ? parseFloat(style.getPropertyValue('padding-left')) : 0;
    this._leftPadding = borderLeft + paddingLeft;
    var borderTop = style.getPropertyValue('border-top') ? parseFloat(style.getPropertyValue('border-top')) : 0;
    var paddingTop = style.getPropertyValue('padding-top') ? parseFloat(style.getPropertyValue('padding-top')) : 0;
    this._topPadding = borderTop + paddingTop;
    this._currentTime = 0;
    this._lastFrameTimestamp = 0;
    this._lastRenderTime = 0;
    this._targetObject = null;
    this._scene = new _Composition.Composition(this.canvas);

    this._bindEvents();

    this._eventRegistry = {
      onmouseup: [],
      onmousedown: [],
      onmousemove: [],
      onmouseout: [],
      onclick: []
    };

    this._animationLoop();

    this._framerate = 0;
  } //TODO: expose the framerate


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

      this.framerate = parseInt(1000 / (this._currentTime - this._lastFrameTimestamp));
      this._lastFrameTimestamp = +new Date();
    }
    /**
     * add an event to the event registry
     *
     * @param {string} eventType the name of the type of event
     * @param {function} callback the callback to be triggered when the event occurs
     */

  }, {
    key: "registerEvent",
    value: function registerEvent(eventType, callback) {
      if (this._eventRegistry[eventType]) {
        this._eventRegistry[eventType].push(callback);
      }
    }
    /**
     * remove an event to the event registry
     *
     * @param {string} eventType the name of the type of event
     * @param {function} callback the callback to be removed from the event
     * @return {function} the callback that was removed
     */

  }, {
    key: "removeEvent",
    value: function removeEvent(eventType, callback) {
      if (this._eventRegistry[eventType]) {
        var index = this._eventRegistry[eventType].indexOf(callback);

        if (index >= 0) {
          return this._eventRegistry[eventType].splice(index, 1);
        }
      }
    }
    /**
     * attach interaction events to the canvas. the canvas compositor dispatches
     * events to relevant objects through bridges to the scene graph
     */

  }, {
    key: "_bindEvents",
    value: function _bindEvents() {
      //TODO: reimplement touch events?
      //must bind to `this` to retain reference
      this._canvas.addEventListener('mousedown', this._handleMouseDown.bind(this));

      this._canvas.addEventListener('mouseup', this._handleMouseUp.bind(this));

      this._canvas.addEventListener('mousemove', this._handleMouseMove.bind(this));

      this._canvas.addEventListener('mouseout', this._handleMouseOut.bind(this));

      this._canvas.addEventListener('click', this._handleClick.bind(this));
    }
    /**
     * bridge the mouse down event on the canvas to the
     * the objects in the scene graph
     */

  }, {
    key: "_handleMouseDown",
    value: function _handleMouseDown(e) {
      e.preventDefault();
      var x = e.clientX - this._rect.left - this._leftPadding;
      var y = e.clientY - this._rect.top - this._topPadding; //pass through x and y to propagated events

      e.canvasX = x;
      e.canvasY = y;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this._eventRegistry[EVENTS.MOUSEDOWN][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var callback = _step.value;
          callback(e);
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

      ;
      var clickedObject = this.scene.childAt(x, y);

      if (clickedObject && clickedObject.onmousedown) {
        clickedObject.onmousedown(e);
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
      var x = e.clientX - this._rect.left - this._leftPadding;
      var y = e.clientY - this._rect.top - this._topPadding; //pass through x and y to propagated events

      e.canvasX = x;
      e.canvasY = y;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.scene.children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var c = _step2.value;

          if (c.draggable && c.onmouseup) {
            c.onmouseup(e);
          }
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

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this._eventRegistry[EVENTS.MOUSEUP][Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var callback = _step3.value;
          callback(e);
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

      var clickedObject = this.scene.childAt(x, y);

      if (clickedObject && clickedObject.onmouseup) {
        clickedObject.onmouseup(e);
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
      this._mouseX = e.clientX - this._rect.left - this._leftPadding;
      this._mouseY = e.clientY - this._rect.top - this._topPadding;
      var objects = this.scene.children.filter(function (c) {
        return !!c.onmousemove;
      });
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = this._eventRegistry[EVENTS.MOUSEMOVE][Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var callback = _step4.value;
          callback(e);
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
            _iterator4["return"]();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = objects[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var o = _step5.value;
          o.onmousemove(e);
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
            _iterator5["return"]();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
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
      var x = e.clientX - this._rect.left - this._leftPadding;
      var y = e.clientY - this._rect.top - this._topPadding; //pass through x and y to propagated events

      e.canvasX = x;
      e.canvasY = y; //TODO: FF doesn't get this

      var objects = this.scene.children.filter(function (c) {
        return !!c.onclick;
      });
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = this._eventRegistry[EVENTS.CLICK][Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var callback = _step6.value;
          callback(e);
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
            _iterator6["return"]();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }

      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = objects[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var o = _step7.value;
          o.onclick(e);
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7["return"] != null) {
            _iterator7["return"]();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
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
      var objects = this.scene.children.filter(function (c) {
        return !!c.onmouseout;
      });
      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        for (var _iterator8 = objects[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          var o = _step8.value;
          o.onmouseout(e);
        }
      } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion8 && _iterator8["return"] != null) {
            _iterator8["return"]();
          }
        } finally {
          if (_didIteratorError8) {
            throw _iteratorError8;
          }
        }
      }

      ;
      var _iteratorNormalCompletion9 = true;
      var _didIteratorError9 = false;
      var _iteratorError9 = undefined;

      try {
        for (var _iterator9 = this._eventRegistry[EVENTS.MOUSEOUT][Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
          var callback = _step9.value;
          callback(e);
        }
      } catch (err) {
        _didIteratorError9 = true;
        _iteratorError9 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion9 && _iterator9["return"] != null) {
            _iterator9["return"]();
          }
        } finally {
          if (_didIteratorError9) {
            throw _iteratorError9;
          }
        }
      }

      ;
    }
  }, {
    key: "drawBezier",
    value: function drawBezier(start, end, c1, c2, style) {
      _Renderer.Renderer.drawBezier(start, end, c1, c2, this._context, style);
    }
  }, {
    key: "framerate",
    set: function set(val) {
      this._framerate = val;
    },
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
}();
/**
 * The initialization function
 */


function init(canvas) {
  return new CanvasCompositor(canvas);
}
//# sourceMappingURL=CanvasCompositor.js.map