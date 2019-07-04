"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Text = void 0;

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

var ALL_CHARS = "1234567890QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm.,`~;:'\"!?@#$%^&*()_+={}[]|<>/";
var DEFAULTS = {
  fontSize: '16px',
  fontFamily: 'sans-serif',
  fontStyle: 'normal',
  fontVariant: 'normal',
  fontWeight: 'normal',
  lineHeight: 'normal',
  textAlign: 'start',
  textBaseline: 'alphabetic'
};

function _getTextHeight(font) {
  //this is a version of:
  //http://stackoverflow.com/questions/1134586/how-can-you-find-the-height-of-text-on-an-html-canvas
  //it's a pretty awful hack.
  //TODO: figure out how cross-browser this is
  //create an element with every character in it with this font
  var fontHolder = document.createElement('span');
  fontHolder.innerText = ALL_CHARS;
  fontHolder.style.font = font; //create an inline-block to place after the element

  var baselineRuler = document.createElement('div');
  baselineRuler.style.display = 'inline-block';
  baselineRuler.style.width = '1px';
  baselineRuler.style.height = '0';
  baselineRuler.style.verticalAlign = 'baseline'; //place them in a wrapper and add it to the body

  var wrapper = document.createElement('div');
  wrapper.appendChild(fontHolder);
  wrapper.appendChild(baselineRuler);
  wrapper.style.whiteSpace = 'nowrap';
  document.body.appendChild(wrapper); //get their bounding rectangles and...

  var fontRect = fontHolder.getBoundingClientRect();
  var baselineRect = baselineRuler.getBoundingClientRect(); //calculate their offset from top

  var fontTop = fontRect.top + document.body.scrollTop;
  var fontBottom = fontTop + fontRect.height;
  var baseline = baselineRect.top + document.body.scrollTop;
  document.body.removeChild(wrapper); //ascent equals the baseline location minus text top location

  var ascentFromBaseline = baseline - fontTop; //decent equals the text bottom location minuse the baseline location

  var descentFromBaseline = fontBottom - baseline;
  return {
    height: fontRect.height,
    ascent: ascentFromBaseline,
    descent: descentFromBaseline
  };
}
/**
 * A text object
 */


var Text =
/*#__PURE__*/
function (_PrimitiveComponent) {
  _inherits(Text, _PrimitiveComponent);

  /**
   * @param {object} options the options for the text object
   */
  function Text(options) {
    var _this;

    _classCallCheck(this, Text);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Text).call(this, options));
    /**
     * @type {string} text the text to be rendered
     */

    _this.text = options.text;
    /**
     * @type {string} fontSize the font size at which to render the text
     */

    _this.fontSize = options.fontSize || DEFAULTS.fontSize;
    /**
     * @type {string} fontFamily the font family in which to render the text
     */

    _this.fontFamily = options.fontFamily || DEFAULTS.fontFamily;
    /**
     * @type {string} fontStyle the font style with which to render the text
     */

    _this.fontStyle = options.fontStyle || DEFAULTS.fontStyle;
    /**
     * @type {string} fontVariant the font variant in which to render the text
     */

    _this.fontVariant = options.fontVariant || DEFAULTS.fontVariant;
    /**
     * @type {string} fontWeight the font weight at which to render the text
     */

    _this.fontWeight = options.fontWeight || DEFAULTS.fontWeight;
    /**
     * @type {string} lineHeight the line height of the text
     */

    _this.lineHeight = options.lineHeight || DEFAULTS.lineHeight;
    /**
     * @type {string} textAlign the alignment with which to render the text
     */

    _this.textAlign = options.textAlign || DEFAULTS.textAlign;
    /**
     * @type {string} textBaseline the baseline for the text
     */

    _this.textBaseline = options.textBaseline || DEFAULTS.textBaseline;
    _this._textMetricsNeedUpdate = true;
    return _this;
  }
  /**
   * compute the height data and add it to the textMetrics object from the canvas context
   * @type {object} textMetrics
   */


  _createClass(Text, [{
    key: "_updateStyle",
    value: function _updateStyle(options) {
      Object.assign(this.style, options, {
        font: "".concat(this.fontStyle, " ").concat(this.fontVariant, " ").concat(this.fontWeight, " ").concat(this.fontSize, "/").concat(this.lineHeight, " ").concat(this.fontFamily),
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

      _Renderer.Renderer.drawText(0, this.textMetrics.ascent, this.text, this._prerenderingContext, this.style);
      /*if (this.flags.DEBUG) {
          Renderer.drawPath(this._prerenderingContext, [{
              x: 0,
              y: this.textMetrics.ascent
          }, {
              x: this.textMetrics.width,
              y: this.textMetrics.ascent
          }], {
              strokeStyle: 'Blue'
          });
          Renderer.drawCircle(this._prerenderingContext, 0, this.textMetrics.ascent, 3, {
              strokeStyle: 'Blue',
              fillStyle: 'Blue'
          });
      }*/

    }
  }, {
    key: "textMetrics",
    get: function get() {
      if (this._textMetricsNeedUpdate || this._textMetrics === null) {
        this._updateStyle();

        this._textMetrics = _Renderer.Renderer.measureText(this.text, this._prerenderingContext, this.style);
        Object.assign(this._textMetrics, _getTextHeight(this.style.font));
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
  }]);

  return Text;
}(_PrimitiveComponent2.PrimitiveComponent);

exports.Text = Text;
//# sourceMappingURL=Text.js.map