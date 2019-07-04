"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Image = void 0;

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
 * an Image
 */
var Image =
/*#__PURE__*/
function (_PrimitiveComponent) {
  _inherits(Image, _PrimitiveComponent);

  /**
   * @param {Object} options
   */
  function Image(options) {
    var _this;

    _classCallCheck(this, Image);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Image).call(this, options));
    /**
     * @type {window.Image} unscaledImage the original image
     */

    _this.unscaledImage = options.image;
    return _this;
  }
  /**
   * get the bounding box
   * @type {{top: number, left: number, bottom: number, right:number}} boundingBox
   */


  _createClass(Image, [{
    key: "render",

    /**
     * override the render function for images specifically
     * @override
     */
    value: function render() {
      var scale = this.compoundScale;
      var image = new window.Image();
      image.src = this.unscaledImage.src;
      image.width = this.unscaledImage.width * scale.scaleWidth;
      image.height = this.unscaledImage.height * scale.scaleHeight;

      _Renderer.Renderer.drawImage(0, 0, image, this._prerenderingContext, this.style);
    }
  }, {
    key: "boundingBox",
    get: function get() {
      var compoundScale = this.compoundScale;
      var offset = this.offset;
      return {
        top: offset.y,
        left: offset.x,
        bottom: offset.y + compoundScale.scaleHeight * this.unscaledImage.height,
        right: offset.x + compoundScale.scaleWidth * this.unscaledImage.width
      };
    }
  }]);

  return Image;
}(_PrimitiveComponent2.PrimitiveComponent);

exports.Image = Image;
//# sourceMappingURL=Image.js.map