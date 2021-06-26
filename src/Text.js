import PrimitiveComponent from './PrimitiveComponent';
import { drawText } from './Renderer';
import * as TextUtils from './TextUtilities';
import * as TextDefaults from './TextDefaults';

/**
 * A text object
 */
export default class Text extends PrimitiveComponent {
  /**
   * @param {object} options the options for the text object
   */
  constructor(options) {
    super(options);

    /**
     * the text to be rendered
     * @type {string}
     */
    this.text = options.text;

    /**
     * the font size at which to render the text
     * @type {string}
     */
    this.fontSize = options.fontSize || TextDefaults.FONT_SIZE;

    /**
     * the font family in which to render the text
     * @type {string}
     */
    this.fontFamily = options.fontFamily || TextDefaults.FONT_FAMILY;

    /**
     * the font style with which to render the text
     * @type {string}
     */
    this.fontStyle = options.fontStyle || TextDefaults.FONT_STYLE;

    /**
     * the font variant in which to render the text
     * @type {string}
     */
    this.fontVariant = options.fontVariant || TextDefaults.FONT_VARIANT;

    /**
     * the font weight at which to render the text
     * @type {string}
     */
    this.fontWeight = options.fontWeight || TextDefaults.FONT_WEIGHT;

    /**
     * the line height of the text
     * @type {string}
     */
    this.lineHeight = options.lineHeight || TextDefaults.LINE_HEIGHT;

    /**
     * the alignment with which to render the text
     * @type {string}
     */
    this.textAlign = options.textAlign || TextDefaults.TEXT_ALIGN;

    /**
     * the baseline for the text
     * @type {string}
     */
    this.textBaseline = options.textBaseline || TextDefaults.TEXT_BASELINE;

    /**
     * lets textMetrics getter know if it needs to update its data
     * @type {boolean}
     */
    this._textMetricsNeedUpdate = true;

    /**
     * a [TextMetrics](https://developer.mozilla.org/en-US/docs/Web/API/TextMetrics) object
     * with additional height information
     * @type {object}
     */
    this._textMetrics = null;

    //TODO: write out this function for optimization
    //this._updateTextMetrics(this.fontString);
  }

  /**
   * get the longform representation
   * @type {string}
   */
  get fontString() {
    return TextUtils.formatFontString(this.fontStyle, this.fontVariant, this.fontWeight, this.fontSize, this.lineHeight, this.fontFamily);
  }

  /**
   * compute the height data and add it to the textMetrics object from the canvas context
   * @type {object}
   */
  get textMetrics() {
    if (this._textMetricsNeedUpdate || this._textMetrics === null) {
      this._updateStyle();
      this._textMetrics = TextUtils.measureText(this.text, this._prerenderingContext, this.style);
      Object.assign(this._textMetrics, TextUtils.getTextHeight(this.style.font));
      this._textMetricsNeedUpdate = false;
    }
    return this._textMetrics;
  }

  /**
   * get the bounding box of the text object
   * @type {top: number, left: number, bottom: number, right: number}
   */
  get boundingBox() {
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
  _updateStyle(options) {
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
  render() {
    this._textMetricsNeedUpdate = true;
    this._updateStyle();
    drawText(0, this.textMetrics.ascent, this.text, this._prerenderingContext, this.style);

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
}
