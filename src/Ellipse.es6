import Renderer from './Renderer';
import PrimitiveComponent from './PrimitiveComponent';



/**
 * An ellipse
 */
export default class Ellipse extends PrimitiveComponent {
    /**
     * @param {object} options options for the ellipse
     * @param {number} options.radius the major (horizontal) radius of the ellipse
     * @param {number} options.minorRadius the minor (vertical) radius of the ellipse
     */
    constructor(options) {
        super(options);
        /**
         * @type {number} radius the major radius (horizontal) of the ellipse
         */
        this.radius = options.radius || 0;
        /**
         * @type {number} minorRadius the minor radius (vertical) of the ellipse
         */
        this.minorRadius = options.minorRadius || this.radius || 0;
    }

    /**
     * the bounding box for the ellipse
     * @type {{top: number, left: number, bottom: number, right: number}} boundingBox
     */
    get boundingBox() {
        let offset = this.offset;
        let scale = this.compoundScale;
        let lineWidth = this.style.lineWidth;
        return {
            top: offset.y -
                ((this.minorRadius * scale.scaleHeight) + lineWidth),
            left: offset.x -
                ((this.radius * scale.scaleWidth) + lineWidth),
            bottom: offset.y +
                (this.minorRadius * scale.scaleHeight) + lineWidth,
            right: offset.x +
                (this.radius * scale.scaleWidth) + lineWidth
        };
    }

    /**
     * override the render function specifically for ellipses
     * @override
     */
    render() {
        let scale = this.compoundScale;
        let lineWidth = this.style.lineWidth;
        //TODO: work out scaling of major/minor radius
        //this doesn't make sense
        Renderer.drawEllipse(
            (this.radius * scale.scaleWidth) + lineWidth,
            (this.minorRadius * scale.scaleHeight) + lineWidth,
            (this.radius * scale.scaleWidth),
            (this.minorRadius * scale.scaleHeight),
            this._prerenderingContext,
            this.style
        );
    }
    /**
     * determine whether the point is in the object
     * basically just the pythagorean theorem
     * @param {number} x the x coordinate
     * @param {number} y the y coordinate
     * @return {boolean} whether or not the point is in the object
     */
    pointIsInObject(x, y) {
        let scale = this.compoundScale;
        let offset = this.offset;

        let a = x - offset.x;
        let b = y - offset.y;

        let c1 = this.radius * scale.scaleWidth;
        let c2 = this.minorRadius * scale.scaleHeight;

        //see: http://math.stackexchange.com/questions/76457/check-if-a-point-is-within-an-ellipse
        return ((a*a) / (c1*c1)) + ((b*b) / (c2*c2)) <= 1;
    };
}
