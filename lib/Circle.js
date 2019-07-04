"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Circle = void 0;

var _Renderer = require("./Renderer");

var _PrimitiveComponent2 = require("./PrimitiveComponent");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * A circle
 */
var Circle =
/*#__PURE__*/
function (_PrimitiveComponent) {
  _inherits(Circle, _PrimitiveComponent);

  //TODO: provide details about options for docs - link to a separate page

  /**
   * PrimitiveComponent constructor
   * @param {object} options object settings
   */
  function Circle(options) {
    var _this;

    _classCallCheck(this, Circle);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Circle).call(this, options));
    /**
     * the radius of the circle
     * @type {number} radius
     */

    _this.radius = options.radius || 0;
    return _this;
  }
  /**
   * get the bounding box of the circle;
   * @type {{top:number, left: number, bottom:number, right:number}}
   */


  _createClass(Circle, [{
    key: "render",

    /**
     * override the render function for drawing circles specifically
     * @override
     */
    value: function render() {
      //the below is to ensure the proper placement when scaling/line widths are accounted for
      var scale = this.compoundScale;
      var lineWidth = this.style.lineWidth;

      _Renderer.Renderer.drawCircle(this.radius * scale.scaleWidth + lineWidth, this.radius * scale.scaleHeight + lineWidth, this.radius * scale.scaleWidth, this._prerenderingContext, this.style);
    }
    /**
     * determine whether the point is in the object
     * basically just the pythagorean theorem
     * @param {number} x the x coordinate
     * @param {number} y the y coordinate
     * @return {boolean} whether or not the point is in the object
     */

  }, {
    key: "pointIsInObject",
    value: function pointIsInObject(x, y) {
      var offset = this.offset; //don't bother checking the bounding box because
      //pythagorean formula is closed-form

      var a = x - offset.x;
      var b = y - offset.y;
      var c = this.radius; //thanks pythagoras~!

      return a * a + b * b <= c * c; //use the below when scaling is reimplemented

      /*
      return (
      CanvasObject.prototype.PointIsInObject.call(this, x, y) &&
      Math.pow((x - this.offset.x), 2) / Math.pow((this.radius * this.GlobalScale.scaleWidth), 2) + Math.pow((y - this.offset.y), 2) / Math.pow((this.radius * this.GlobalScale.scaleHeight), 2) <= 1
      );*/
    }
  }, {
    key: "boundingBox",
    get: function get() {
      //TODO: possibly memory-inefficient - need to research:
      //strokes are (were?) centered over the mathematical perimeter -
      //so half the stroke laid within the perimeter, and the
      //other half laid outside. for some reason, this doesn't
      //work for (0 < lineWidth < 2.0).
      //
      //it's just a pixel, but when a thousand objects are on screen,
      //that'll make a difference
      var offset = this.offset;
      var scale = this.compoundScale;
      return {
        top: offset.y - (this.radius * scale.scaleHeight + this.style.lineWidth),
        left: offset.x - (this.radius * scale.scaleWidth + this.style.lineWidth),
        bottom: offset.y + this.radius * scale.scaleHeight + this.style.lineWidth,
        right: offset.x + this.radius * scale.scaleWidth + this.style.lineWidth
      };
    }
  }]);

  return Circle;
}(_PrimitiveComponent2.PrimitiveComponent);

exports.Circle = Circle;
//# sourceMappingURL=Circle.js.map