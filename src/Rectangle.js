import Renderer from './Renderer';
import PrimitiveComponent from './PrimitiveComponent';

/**
 * A rectangle
 */
export default class Rectangle extends PrimitiveComponent {
    /**
     * @param {object} options the options for the object
     */
    constructor(options) {
        super(options);
        /**
         * the width of the rectangle
         * @type {number} width
         */
        this.width = options.width || 0;

        /**
         * the height of the rectangle
         * @type {number} height
         */
        this.height = options.height || 0;
    }

    /**
     * get the bounding box of the rectangle
     * @type {{top:number, left:number, bottom:number, right:number}} boundingBox
     */
    get boundingBox() {
        let offset = this.offset;
        let compoundScale = this.compoundScale;
        return {
            top: offset.y - (this.style.lineWidth),
            left: offset.x - (this.style.lineWidth),
            bottom: offset.y + (compoundScale.scaleHeight * this.height) + (this.style.lineWidth),
            right: offset.x + (compoundScale.scaleWidth * this.width) + (this.style.lineWidth)
        };
    }

    /**
     * render the rectangle
     * @override
     */
    render() {
        let compoundScale = this.compoundScale;
        Renderer.drawRectangle((this.style.lineWidth),
            (this.style.lineWidth),
            this.width * compoundScale.scaleWidth,
            this.height * compoundScale.scaleHeight,
            this._prerenderingContext,
            this.style);
    }
}
