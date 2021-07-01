"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _Component2 = _interopRequireDefault(require("../../core/Component"));

var _Renderer = require("../../graphics/Renderer");

var TextUtils = _interopRequireWildcard(require("./Utilities"));

var TextDefaults = _interopRequireWildcard(require("./Defaults"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

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

/**
 * A text object
 */
var Text = /*#__PURE__*/function (_Component) {
  _inherits(Text, _Component);

  var _super = _createSuper(Text);

  /**
   * @param {object} options the options for the text object
   */
  function Text(options) {
    var _this;

    _classCallCheck(this, Text);

    _this = _super.call(this, options);
    /**
     * the text to be rendered
     * @type {string}
     */

    _this.text = options.text;
    /**
     * the font size at which to render the text
     * @type {string}
     */

    _this.fontSize = options.fontSize || TextDefaults.FONT_SIZE;
    /**
     * the font family in which to render the text
     * @type {string}
     */

    _this.fontFamily = options.fontFamily || TextDefaults.FONT_FAMILY;
    /**
     * the font style with which to render the text
     * @type {string}
     */

    _this.fontStyle = options.fontStyle || TextDefaults.FONT_STYLE;
    /**
     * the font variant in which to render the text
     * @type {string}
     */

    _this.fontVariant = options.fontVariant || TextDefaults.FONT_VARIANT;
    /**
     * the font weight at which to render the text
     * @type {string}
     */

    _this.fontWeight = options.fontWeight || TextDefaults.FONT_WEIGHT;
    /**
     * the line height of the text
     * @type {string}
     */

    _this.lineHeight = options.lineHeight || TextDefaults.LINE_HEIGHT;
    /**
     * the alignment with which to render the text
     * @type {string}
     */

    _this.textAlign = options.textAlign || TextDefaults.TEXT_ALIGN;
    /**
     * the baseline for the text
     * @type {string}
     */

    _this.textBaseline = options.textBaseline || TextDefaults.TEXT_BASELINE;
    /**
     * lets textMetrics getter know if it needs to update its data
     * @type {boolean}
     */

    _this._textMetricsNeedUpdate = true;
    /**
     * a [TextMetrics](https://developer.mozilla.org/en-US/docs/Web/API/TextMetrics) object
     * with additional height information
     * @type {object}
     */

    _this._textMetrics = null; //TODO: write out this function for optimization
    //this._updateTextMetrics(this.fontString);

    return _this;
  }
  /**
   * get the longform representation
   * @type {string}
   */


  _createClass(Text, [{
    key: "fontString",
    get: function get() {
      return TextUtils.formatFontString(this.fontStyle, this.fontVariant, this.fontWeight, this.fontSize, this.lineHeight, this.fontFamily);
    }
    /**
     * compute the height data and add it to the textMetrics object from the canvas context
     * @type {object}
     */

  }, {
    key: "textMetrics",
    get: function get() {
      if (this._textMetricsNeedUpdate || this._textMetrics === null) {
        this._updateStyle();

        this._textMetrics = TextUtils.measureText(this.text, this.prerenderingContext, this.style);
        Object.assign(this._textMetrics, TextUtils.getTextHeight(this.style.font));
        this._textMetricsNeedUpdate = false;
      }

      return this._textMetrics;
    }
    /**
     * get the bounding box of the text object
     * @type {top: number, left: number, bottom: number, right: number}
     */

  }, {
    key: "boundingBox",
    get: function get() {
      return {
        top: this.offset.y - this.textMetrics.ascent,
        left: this.offset.x,
        bottom: this.offset.y + this.textMetrics.descent,
        right: this.offset.x + this.textMetrics.width
      };
    }
    /**
     * update the style options for the text
     * @param {object} options
     */

  }, {
    key: "_updateStyle",
    value: function _updateStyle(options) {
      Object.assign(this.style, options, {
        font: this.fontString,
        textAlign: this.textAlign,
        textBaseline: this.textBaseline
      });
    }
    /**
     * override the render function for text objects
     * @override
     */

  }, {
    key: "render",
    value: function render() {
      this._textMetricsNeedUpdate = true;

      this._updateStyle();

      (0, _Renderer.drawText)(0, this.textMetrics.ascent, this.text, this.prerenderingContext, this.style);
      /*if (this.flags.DEBUG) {
          Renderer.drawPath(this.prerenderingContext, [{
              x: 0,
              y: this.textMetrics.ascent
          }, {
              x: this.textMetrics.width,
              y: this.textMetrics.ascent
          }], {
              strokeStyle: 'Blue'
          });
          Renderer.drawCircle(this.prerenderingContext, 0, this.textMetrics.ascent, 3, {
              strokeStyle: 'Blue',
              fillStyle: 'Blue'
          });
      }*/
    }
  }]);

  return Text;
}(_Component2["default"]);

exports["default"] = Text;
//# sourceMappingURL=index.js.map