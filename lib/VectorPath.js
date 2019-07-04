"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VectorPath = void 0;

var _Renderer = require("./Renderer");

var _PrimitiveComponent2 = require("./PrimitiveComponent");

var _vectorious = require("vectorious");

var _Line = require("./Line");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function set(target, property, value, receiver) { if (typeof Reflect !== "undefined" && Reflect.set) { set = Reflect.set; } else { set = function set(target, property, value, receiver) { var base = _superPropBase(target, property); var desc; if (base) { desc = Object.getOwnPropertyDescriptor(base, property); if (desc.set) { desc.set.call(receiver, value); return true; } else if (!desc.writable) { return false; } } desc = Object.getOwnPropertyDescriptor(receiver, property); if (desc) { if (!desc.writable) { return false; } desc.value = value; Object.defineProperty(receiver, property, desc); } else { _defineProperty(receiver, property, value); } return true; }; } return set(target, property, value, receiver); }

function _set(target, property, value, receiver, isStrict) { var s = set(target, property, value, receiver || target); if (!s && isStrict) { throw new Error('failed to set property'); } return value; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

//would name the file 'path', but damn near everything
//relies on the filesystem 'path' module

/**
 * An ordered set of vectors defining a path
 */
var VectorPath =
/*#__PURE__*/
function (_PrimitiveComponent) {
  _inherits(VectorPath, _PrimitiveComponent);

  /**
   * see PrimitiveComponent for more options
   * @param {Object} options the options for the object
   * @param {Object[]} options.vertices the vertices
   * @param {number} options.vertices[].x the y coordinate for a vertex
   * @param {number} options.vertices[].y the y coordinate for a vertex
   */
  function VectorPath(options) {
    var _this;

    _classCallCheck(this, VectorPath);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(VectorPath).call(this, options));
    options.vertices = options.vertices || []; //this.unscaledLineWidth = this.style.lineWidth;

    /**
     * the list of vertices as vectorious Vectors
     * @type {Vector[]} vertices
     */

    _this.vertices = options.vertices.map(function (v) {
      return new _vectorious.Vector([v.x, v.y]);
    });

    var yCoordinates = _this.vertices.map(function (v) {
      return v.y;
    });

    var xCoordinates = _this.vertices.map(function (v) {
      return v.x;
    }); //uses `apply` so we can supply the list as a list of arguments


    _this._left = Math.min.apply(null, xCoordinates);
    _this._top = Math.min.apply(null, yCoordinates);
    _this._right = Math.max.apply(null, xCoordinates);
    _this._bottom = Math.max.apply(null, yCoordinates);

    _set(_getPrototypeOf(VectorPath.prototype), "d", new _vectorious.Vector([_this._left, _this._top]), _assertThisInitialized(_this), true);

    var normalizationVector = _this.d;
    _this._normalizedVertices = _this.vertices.map(function (v) {
      return v.subtract(normalizationVector);
    });
    _this._normalizedBoundingBox = null;
    return _this;
  }
  /**
   * get the bounding box for the vertices
   * @type {{top:number, left: number, bottom:number, right:number}} boundingBox
   */


  _createClass(VectorPath, [{
    key: "pointIsInObject",

    /**
     * determine whether the point is in the object
     * even/odd line intersection test
     * @param {number} x the x coordinate
     * @param {number} y the y coordinate
     * @return {boolean} whether or not the point is in the object
     */
    value: function pointIsInObject(x, y) {
      var inside = false;

      if (_get(_getPrototypeOf(VectorPath.prototype), "pointIsInObject", this).call(this, x, y)) {
        //create a line that travels from this point in any direction
        //if it intersects the polygon an odd number of times, it is inside
        //a line can be described as a vertex and a direction
        var l = new _Line.Line(new _vectorious.Vector([x, y]), new _vectorious.Vector([1, 0]));
        var compoundScale = this.compoundScale;
        var offset = this.offset;

        for (var i = 0; i < this._normalizedVertices.length; i++) {
          var j = i + 1 >= this._normalizedVertices.length ? 0 : i + 1;
          var v = scaleVectorXY(this._normalizedVertices[i], compoundScale.scaleWidth, compoundScale.scaleHeight).add(offset);
          var w = scaleVectorXY(this._normalizedVertices[j], compoundScale.scaleWidth, compoundScale.scaleHeight).add(offset);

          var edgeDirection = _vectorious.Vector.subtract(w, v).normalize();

          var edge = new _Line.Line(v, edgeDirection);
          var intersection = edge.intersectionWith(l); //if the lines are parallel/colocated, no need to count;

          if (intersection === null) {
            continue;
          } //TODO: should replace 0s with epsilons, where epsilon is
          //the threshhold for considering two things as touching/intersecting


          var intersectToTheRight = intersection.x - x >= 0; //if the intersection is not to the right, no need to count

          if (!intersectToTheRight) {
            continue;
          }

          var negativeX = edgeDirection.x < 0;
          var negativeY = edgeDirection.y < 0; //technically speaking, bottom and top should be reversed,
          //since y=0 is the top left corner of the screen - it's
          //just easier to think about it mathematically this way

          var leftVertex = negativeX ? w : v;
          var rightVertex = negativeX ? v : w;
          var topVertex = negativeY ? w : v;
          var bottomVertex = negativeY ? v : w;
          var intersectWithinSegment = intersection.x - leftVertex.x >= 0 && rightVertex.x - intersection.x >= 0 && intersection.y - topVertex.y >= 0 && bottomVertex.y - intersection.y >= 0;

          if (intersectWithinSegment) {
            inside = !inside;
          }
        }
      }

      return inside;
    }
    /**
     * override the render function for drawing vector paths specifically
     * @override
     */

  }, {
    key: "render",
    value: function render() {
      var boundingBox = this.boundingBox;
      var offset = this.offset;
      var compoundScale = this.compoundScale; //normalize the vertices (left- and top-most x/y-values should be 0 and 0)

      var pathToDraw = this._normalizedVertices.map(function (vertex) {
        return scaleVectorXY(vertex, compoundScale.scaleWidth, compoundScale.scaleHeight).subtract(new _vectorious.Vector([boundingBox.left, boundingBox.top])).add(offset);
      });

      _Renderer.Renderer.drawPath(pathToDraw, this._prerenderingContext, this.style);
    }
  }, {
    key: "boundingBox",
    get: function get() {
      this._normalizedBoundingBox = {
        top: 0,
        left: 0,
        right: this._right - this._left,
        bottom: this._bottom - this._top
      };
      return {
        top: this._normalizedBoundingBox.top * this.compoundScale.scaleHeight + this.offset.y - this.style.lineWidth,
        left: this._normalizedBoundingBox.left * this.compoundScale.scaleWidth + this.offset.x - this.style.lineWidth,
        bottom: this._normalizedBoundingBox.bottom * this.compoundScale.scaleHeight + this.offset.y + this.style.lineWidth,
        right: this._normalizedBoundingBox.right * this.compoundScale.scaleWidth + this.offset.x + this.style.lineWidth
      };
    }
  }]);

  return VectorPath;
}(_PrimitiveComponent2.PrimitiveComponent);

exports.VectorPath = VectorPath;

function scaleVectorXY(vector, scaleX, scaleY) {
  return new _vectorious.Vector([vector.x * scaleX, vector.y * scaleY]);
}
//# sourceMappingURL=VectorPath.js.map