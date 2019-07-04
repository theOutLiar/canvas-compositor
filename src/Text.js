import { Renderer } from './Renderer';
import { PrimitiveComponent } from './PrimitiveComponent';

const ALL_CHARS = `1234567890QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm.,\`~;:'"!?@#$%^&*()_+={}[]|\<>/`;

const DEFAULTS = {
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
    let fontHolder = document.createElement('span');
    fontHolder.innerText = ALL_CHARS;
    fontHolder.style.font = font;

    //create an inline-block to place after the element
    let baselineRuler = document.createElement('div');
    baselineRuler.style.display = 'inline-block';
    baselineRuler.style.width = '1px';
    baselineRuler.style.height = '0';
    baselineRuler.style.verticalAlign = 'baseline';

    //place them in a wrapper and add it to the body
    let wrapper = document.createElement('div');
    wrapper.appendChild(fontHolder);
    wrapper.appendChild(baselineRuler);
    wrapper.style.whiteSpace = 'nowrap';
    document.body.appendChild(wrapper);

    //get their bounding rectangles and...
    let fontRect = fontHolder.getBoundingClientRect();
    let baselineRect = baselineRuler.getBoundingClientRect();

    //calculate their offset from top
    let fontTop = fontRect.top + document.body.scrollTop;
    let fontBottom = fontTop + fontRect.height;

    let baseline = baselineRect.top + document.body.scrollTop;

    document.body.removeChild(wrapper);

    //ascent equals the baseline location minus text top location
    let ascentFromBaseline = baseline - fontTop;

    //decent equals the text bottom location minuse the baseline location
    let descentFromBaseline = fontBottom - baseline;

    return {
        height: fontRect.height,
        ascent: ascentFromBaseline,
        descent: descentFromBaseline
    };
}

/**
 * A text object
 */
export class Text extends PrimitiveComponent {
    /**
     * @param {object} options the options for the text object
     */
    constructor(options) {
        super(options);

        /**
         * @type {string} text the text to be rendered
         */
        this.text = options.text;

        /**
         * @type {string} fontSize the font size at which to render the text
         */
        this.fontSize = options.fontSize || DEFAULTS.fontSize;

        /**
         * @type {string} fontFamily the font family in which to render the text
         */
        this.fontFamily = options.fontFamily || DEFAULTS.fontFamily;

        /**
         * @type {string} fontStyle the font style with which to render the text
         */
        this.fontStyle = options.fontStyle || DEFAULTS.fontStyle;

        /**
         * @type {string} fontVariant the font variant in which to render the text
         */
        this.fontVariant = options.fontVariant || DEFAULTS.fontVariant;

        /**
         * @type {string} fontWeight the font weight at which to render the text
         */
        this.fontWeight = options.fontWeight || DEFAULTS.fontWeight;

        /**
         * @type {string} lineHeight the line height of the text
         */
        this.lineHeight = options.lineHeight || DEFAULTS.lineHeight;

        /**
         * @type {string} textAlign the alignment with which to render the text
         */
        this.textAlign = options.textAlign || DEFAULTS.textAlign;

        /**
         * @type {string} textBaseline the baseline for the text
         */
        this.textBaseline = options.textBaseline || DEFAULTS.textBaseline;

        this._textMetricsNeedUpdate = true;
    }

    /**
     * compute the height data and add it to the textMetrics object from the canvas context
     * @type {object} textMetrics
     */
    get textMetrics() {
        if (this._textMetricsNeedUpdate || this._textMetrics === null) {
            this._updateStyle();
            this._textMetrics = Renderer.measureText(this.text, this._prerenderingContext, this.style);
            Object.assign(this._textMetrics, _getTextHeight(this.style.font));
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

    _updateStyle(options) {
        Object.assign(this.style, options, {
            font: `${this.fontStyle} ${this.fontVariant} ${this.fontWeight} ${this.fontSize}/${this.lineHeight} ${this.fontFamily}`,
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
        Renderer.drawText(0, this.textMetrics.ascent, this.text, this._prerenderingContext, this.style);

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
