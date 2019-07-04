import { Renderer } from './Renderer';
import { PrimitiveComponent } from './PrimitiveComponent';

/**
 * A circle
 */
export class Circle extends PrimitiveComponent {
    //TODO: provide details about options for docs - link to a separate page
    /**
     * PrimitiveComponent constructor
     * @param {object} options object settings
     */
    constructor(options) {
        super(options)
        /**
         * the radius of the circle
         * @type {number} radius
         */
        this.radius = options.radius || 0;
    }

    /**
     * get the bounding box of the circle;
     * @type {{top:number, left: number, bottom:number, right:number}}
     */
    get boundingBox() {
        //TODO: possibly memory-inefficient - need to research:
        //strokes are (were?) centered over the mathematical perimeter -
        //so half the stroke laid within the perimeter, and the
        //other half laid outside. for some reason, this doesn't
        //work for (0 < lineWidth < 2.0).
        //
        //it's just a pixel, but when a thousand objects are on screen,
        //that'll make a difference
        let offset = this.offset;
        let scale = this.compoundScale;
        return {
            top: offset.y -
                ((this.radius * scale.scaleHeight) +
                    (this.style.lineWidth)),
            left: offset.x -
                ((this.radius * scale.scaleWidth) +
                    (this.style.lineWidth)),
            bottom: offset.y +
                (this.radius * scale.scaleHeight) +
                (this.style.lineWidth),
            right: offset.x +
                (this.radius * scale.scaleWidth) +
                (this.style.lineWidth)
        };
    }

    /**
     * override the render function for drawing circles specifically
     * @override
     */
    render() {
        //the below is to ensure the proper placement when scaling/line widths are accounted for
        let scale = this.compoundScale;
        let lineWidth = this.style.lineWidth;
        Renderer.drawCircle(
            (this.radius * scale.scaleWidth) + lineWidth,
            (this.radius * scale.scaleHeight) + lineWidth,
            (this.radius * scale.scaleWidth),
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

        let offset = this.offset;

        //don't bother checking the bounding box because
        //pythagorean formula is closed-form
            let a = x - offset.x;
            let b = y - offset.y;
            let c = this.radius;

            //thanks pythagoras~!
            return (a * a) + (b * b) <= (c * c);
        //use the below when scaling is reimplemented
        /*
		return (
			CanvasObject.prototype.PointIsInObject.call(this, x, y) &&
			Math.pow((x - this.offset.x), 2) / Math.pow((this.radius * this.GlobalScale.scaleWidth), 2) + Math.pow((y - this.offset.y), 2) / Math.pow((this.radius * this.GlobalScale.scaleHeight), 2) <= 1
		);*/
    };
}
