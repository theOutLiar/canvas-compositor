"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _PrimitiveComponent2 = _interopRequireDefault(require("./PrimitiveComponent"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }

function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function set(target, property, value, receiver) { if (typeof Reflect !== "undefined" && Reflect.set) { set = Reflect.set; } else { set = function set(target, property, value, receiver) { var base = _superPropBase(target, property); var desc; if (base) { desc = Object.getOwnPropertyDescriptor(base, property); if (desc.set) { desc.set.call(receiver, value); return true; } else if (!desc.writable) { return false; } } desc = Object.getOwnPropertyDescriptor(receiver, property); if (desc) { if (!desc.writable) { return false; } desc.value = value; Object.defineProperty(receiver, property, desc); } else { _defineProperty(receiver, property, value); } return true; }; } return set(target, property, value, receiver); }

function _set(target, property, value, receiver, isStrict) { var s = set(target, property, value, receiver || target); if (!s && isStrict) { throw new Error('failed to set property'); } return value; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _createSuper(Derived) { var hasNativeReflectConstruct = _isNativeReflectConstruct(); return function _createSuperInternal() { var Super = _getPrototypeOf(Derived), result; if (hasNativeReflectConstruct) { var NewTarget = _getPrototypeOf(this).constructor; result = Reflect.construct(Super, arguments, NewTarget); } else { result = Super.apply(this, arguments); } return _possibleConstructorReturn(this, result); }; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

/**
 * The Composition class is an extension of the Primitive that is
 * composed of other extensions of the Primitive. The Composition
 * is used to establish the Scene graph as the parent of all other
 * objects on screen. This is the key abstraction of the [composite
 * pattern](https://en.wikipedia.org/wiki/Composite_pattern): an
 * action taken on the parent element acts upon all of the children,
 * and transatively, all of their children.
 */
var Composition = /*#__PURE__*/function (_PrimitiveComponent) {
  _inherits(Composition, _PrimitiveComponent);

  var _super = _createSuper(Composition);

  /**
   * @param {object} options object settings
   */
  function Composition(options) {
    var _this;

    _classCallCheck(this, Composition);

    _this = _super.call(this, options);
    options = options || {};
    /**
     * The children of this composition
     */

    _this._children = options.children || [];
    return _this;
  }
  /**
   * children of this composition
   * @type {Array} children the which compose this object
   */


  _createClass(Composition, [{
    key: "children",
    get: function get() {
      return this._children;
    }
    /**
     * the bounding box of the composition (i.e., the containing bounds of all the children of this composition)
     * @type {{top:number, left:number, right:number, bottom:number}} boundingBox
     */

  }, {
    key: "boundingBox",
    get: function get() {
      var top = Infinity,
          left = Infinity,
          bottom = -Infinity,
          right = -Infinity;

      var _iterator = _createForOfIteratorHelper(this.children),
          _step;

      try {
        for (_iterator.s(); !(_step = _iterator.n()).done;) {
          var c = _step.value;
          var boundingBox = c.boundingBox;
          top = Math.min(boundingBox.top, top);
          left = Math.min(boundingBox.left, left);
          bottom = Math.max(boundingBox.bottom, bottom);
          right = Math.max(boundingBox.right, right);
        }
      } catch (err) {
        _iterator.e(err);
      } finally {
        _iterator.f();
      }

      ;
      return {
        top: top,
        left: left,
        bottom: bottom,
        right: right
      };
    }
    /**
     * the an array of children that are found at (x, y)
     * @return {object} childrenAt all the children below the point
     * @param {number} x the x coordinate
     * @param {number} y the y coordinate
     */

  }, {
    key: "childrenAt",
    value: function childrenAt(x, y) {
      return this.children.filter(function (c) {
        return c.PointIsInObject(x, y);
      });
    }
    /**
     * get the top-most child at the (x, y)
     * @return {object} childAt the first child below the point
     * @param {number} x the x coordinate
     * @param {number} y the y coordinate
     */

  }, {
    key: "childAt",
    value: function childAt(x, y) {
      //loop over the children in reverse because drawing order
      for (var c = this.children.length - 1; c >= 0; c--) {
        if (this.children[c].pointIsInObject(x, y)) {
          return this.children[c];
        }
      }
    }
    /**
     * add a child to this composition
     * @param {object} child the child to be added
     */

  }, {
    key: "addChild",
    value: function addChild(child) {
      child.parent = this;
      this.children.push(child);

      _set(_getPrototypeOf(Composition.prototype), "needsRender", true, this, true);

      _set(_getPrototypeOf(Composition.prototype), "needsDraw", true, this, true); //TODO: make this hook more generic
      //by using a registry
      //if (this.onchildadded) {
      //  this.onchildadded();
      //}

    }
    /**
     * add multiple children to the composition
     * @param {object} children the list of children to be added
     */

  }, {
    key: "addChildren",
    value: function addChildren(children) {
      var _iterator2 = _createForOfIteratorHelper(children),
          _step2;

      try {
        for (_iterator2.s(); !(_step2 = _iterator2.n()).done;) {
          var c = _step2.value;
          this.addChild(c);
        }
      } catch (err) {
        _iterator2.e(err);
      } finally {
        _iterator2.f();
      }
    }
    /**
     * remove a child from this composition
     * @param {object} child the child to be removed
     * @return {object} the child removed
     */

  }, {
    key: "removeChild",
    value: function removeChild(child) {
      if (child) {
        var index = this.children.indexOf(child);

        if (index >= 0) {
          _set(_getPrototypeOf(Composition.prototype), "needsRender", true, this, true);

          _set(_getPrototypeOf(Composition.prototype), "needsDraw", true, this, true);

          return this.children.splice(index, 1);
        }
      }
    }
  }, {
    key: "render",
    value:
    /**
     * @override
     * override the render functiont to render the children onto this compositions prerendering canvas
     */
    function render() {
      // required to make sure that the drawing occurs within the bounds of this composition
      var boundingBox = this.boundingBox;
      var offset = {
        top: -boundingBox.top,
        left: -boundingBox.left,
        bottom: -boundingBox.bottom,
        right: -boundingBox.right
      };

      var _iterator3 = _createForOfIteratorHelper(this.children),
          _step3;

      try {
        for (_iterator3.s(); !(_step3 = _iterator3.n()).done;) {
          var c = _step3.value;
          c.draw(this._prerenderingContext, offset);
        }
      } catch (err) {
        _iterator3.e(err);
      } finally {
        _iterator3.f();
      }

      ; // `destination-out` will erase things
      //this._prerenderingContext.globalCompositeOperation = 'destination-out';
      //_.each(this.masks, function (m) {
      //m.draw(renderContext, contextOffset);
      //});
      //renderContext.globalCompositeOperation = 'normal';
    }
  }]);

  return Composition;
}(_PrimitiveComponent2["default"]);

exports["default"] = Composition;
//# sourceMappingURL=Composition.js.map