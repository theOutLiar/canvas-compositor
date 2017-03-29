import Renderer from './Renderer';
import Primitive from './Primitive';

export default class Circle extends Primitive {
    constructor(options) {
        super(options)
        this._radius = options.radius || 0;
    }

    /**
     * get the radius of the circle
     * @type {number} radius
     */
    get radius() {
        return this._radius;
    }
    /**
     * set the radius of the circle
     * @type {number} radius
     * @param {number} val the new value of the radius
     */
    set radius(val) {
        this._radius = val;
    }

    /**
     * get the bounding box of the circle;
     */
    get boundingBox() {
        return {
            top: this.offset.y - this.radius,
            left: this.offset.x - this.radius,
            bottom: this.offset.y + this.radius,
            right: this.offset.x + this.radius
        };

        //the below is for keeping the bounding box around the entirety of the object, including the drawing of the border path
        /*return {
            top: this.offset.y -
                ((this.radius * this.GlobalScale.scaleHeight) +
                    (this.unscaledLineWidth / 2.0 * this.GlobalLineScale)),
            left: this.offset.x -
                ((this.radius * this.GlobalScale.scaleWidth) +
                    (this.unscaledLineWidth / 2.0 * this.GlobalLineScale)),
            bottom: this.offset.y +
                (this.radius * this.GlobalScale.scaleHeight) +
                (this.unscaledLineWidth / 2.0 * this.GlobalLineScale),
            right: this.offset.x +
                (this.radius * this.GlobalScale.scaleWidth) +
                (this.unscaledLineWidth / 2.0 * this.GlobalLineScale)
        };*/
    }

    /**
     * override the render function for drawing cirtcles specifically
     * @override
     */
    render() {
        Renderer.drawCircle(
            //because prerendering happens on a canvas with dimensions equal to the diameter,
            //the radius can serve as both x and y coordinates on that canvas
            this.radius,
            this.radius,
            this.radius,
            this._prerenderingContext,
            this.style
        );

        //the below is to ensure the proper placement when scaling/line widths are accounted for
        /*
            Renderer.drawCircle(

                (this.radius * this.GlobalScale.scaleWidth) + (this.unscaledLineWidth/2.0 * this.GlobalLineScale),
                (this.radius * this.GlobalScale.scaleHeight) + (this.unscaledLineWidth/2.0 * this.GlobalLineScale),
                (this.radius * this.GlobalScale.scaleWidth),
                this._prerenderingContext,
                this.style
            );
        */
    }

    pointIsInObject(x, y) {

        //if it's not in the bounding box, don't bother with the math
        if (super.pointIsInObject(x, y)) {
            let a = x - this.offset.x;
            let b = y - this.offset.y;
            let c = this.radius;

            //thanks pythagoras~!
            return (a * a) + (b * b) <= (c * c);
        }
        return false;
        //use the below when scaling is reimplemented
        /*
		return (
			CanvasObject.prototype.PointIsInObject.call(this, x, y) &&
			Math.pow((x - this.offset.x), 2) / Math.pow((this.radius * this.GlobalScale.scaleWidth), 2) + Math.pow((y - this.offset.y), 2) / Math.pow((this.radius * this.GlobalScale.scaleHeight), 2) <= 1
		);*/
    };
}

/*define(['lodash', 'canvas-object', 'renderer'], function (_, CanvasObject, Renderer) {
	'use strict';

	function Circle(options) {
		CanvasObject.call(this, options);
		this.radius = options.radius || 0;
	}

	_.assign(Circle.prototype, CanvasObject.prototype);

	Circle.prototype.render = function _render() {

	};

	Circle.prototype.PointIsInObject = function (x, y) {
		return (
			CanvasObject.prototype.PointIsInObject.call(this, x, y) &&
			Math.pow((x - this.offset.x), 2) / Math.pow((this.radius * this.GlobalScale.scaleWidth), 2) + Math.pow((y - this.offset.y), 2) / Math.pow((this.radius * this.GlobalScale.scaleHeight), 2) <= 1
		);
	};

	return Circle;
});*/
