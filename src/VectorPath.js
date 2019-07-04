import { Renderer } from './Renderer';
import { PrimitiveComponent } from './PrimitiveComponent';
import { Vector } from 'vectorious';
import { Line } from './Line';

//would name the file 'path', but damn near everything
//relies on the filesystem 'path' module

/**
 * An ordered set of vectors defining a path
 */
export class VectorPath extends PrimitiveComponent {
    /**
     * see PrimitiveComponent for more options
     * @param {Object} options the options for the object
     * @param {Object[]} options.vertices the vertices
     * @param {number} options.vertices[].x the y coordinate for a vertex
     * @param {number} options.vertices[].y the y coordinate for a vertex
     */
    constructor(options) {
        super(options);

        options.vertices = options.vertices || [];

        //this.unscaledLineWidth = this.style.lineWidth;

        /**
         * the list of vertices as vectorious Vectors
         * @type {Vector[]} vertices
         */
        this.vertices = options.vertices.map(v => new Vector([v.x, v.y]));

        let yCoordinates = this.vertices.map(v => v.y);
        let xCoordinates = this.vertices.map(v => v.x);

        //uses `apply` so we can supply the list as a list of arguments
        this._left = Math.min.apply(null, xCoordinates);
        this._top = Math.min.apply(null, yCoordinates);
        this._right = Math.max.apply(null, xCoordinates);
        this._bottom = Math.max.apply(null, yCoordinates);

        super.d = new Vector([this._left, this._top]);

        let normalizationVector = this.d;

        this._normalizedVertices = this.vertices.map(v => v.subtract(normalizationVector));

        this._normalizedBoundingBox = null;
    }

    /**
     * get the bounding box for the vertices
     * @type {{top:number, left: number, bottom:number, right:number}} boundingBox
     */
    get boundingBox() {
        this._normalizedBoundingBox = {
            top: 0,
            left: 0,
            right: this._right - this._left,
            bottom: this._bottom - this._top
        };

        return {
            top: (this._normalizedBoundingBox.top * this.compoundScale.scaleHeight) + this.offset.y - this.style.lineWidth,
            left: (this._normalizedBoundingBox.left * this.compoundScale.scaleWidth) + this.offset.x - this.style.lineWidth,
            bottom: (this._normalizedBoundingBox.bottom * this.compoundScale.scaleHeight) + this.offset.y + this.style.lineWidth,
            right: (this._normalizedBoundingBox.right * this.compoundScale.scaleWidth) + this.offset.x + this.style.lineWidth
        };
    }


    /**
     * determine whether the point is in the object
     * even/odd line intersection test
     * @param {number} x the x coordinate
     * @param {number} y the y coordinate
     * @return {boolean} whether or not the point is in the object
     */
    pointIsInObject(x, y) {
        let inside = false;
        if (super.pointIsInObject(x, y)) {
            //create a line that travels from this point in any direction
            //if it intersects the polygon an odd number of times, it is inside

            //a line can be described as a vertex and a direction
            let l = new Line(new Vector([x, y]), new Vector([1, 0]));

            let compoundScale = this.compoundScale;
            let offset = this.offset;

            for (let i = 0; i < this._normalizedVertices.length; i++) {
                let j = (i + 1) >= this._normalizedVertices.length ? 0 : i + 1;

                let v = scaleVectorXY(this._normalizedVertices[i], compoundScale.scaleWidth, compoundScale.scaleHeight)
                    .add(offset);

                let w = scaleVectorXY(this._normalizedVertices[j], compoundScale.scaleWidth, compoundScale.scaleHeight)
                    .add(offset);

                let edgeDirection = Vector.subtract(w, v).normalize();
                let edge = new Line(v, edgeDirection);
                let intersection = edge.intersectionWith(l);

                //if the lines are parallel/colocated, no need to count;
                if (intersection === null) {
                    continue;
                }

                //TODO: should replace 0s with epsilons, where epsilon is
                //the threshhold for considering two things as touching/intersecting
                let intersectToTheRight = intersection.x - x >= 0;

                //if the intersection is not to the right, no need to count
                if (!intersectToTheRight) {
                    continue;
                }

                let negativeX = (edgeDirection.x < 0);
                let negativeY = (edgeDirection.y < 0);

                //technically speaking, bottom and top should be reversed,
                //since y=0 is the top left corner of the screen - it's
                //just easier to think about it mathematically this way
                let leftVertex = negativeX ? w : v;
                let rightVertex = negativeX ? v : w;
                let topVertex = negativeY ? w : v;
                let bottomVertex = negativeY ? v : w;

                let intersectWithinSegment =
                    (intersection.x - leftVertex.x >= 0) &&
                    (rightVertex.x - intersection.x >= 0) &&
                    (intersection.y - topVertex.y >= 0) &&
                    (bottomVertex.y - intersection.y >= 0);

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
    render() {
        let boundingBox = this.boundingBox;
        let offset = this.offset;
        let compoundScale = this.compoundScale;
        //normalize the vertices (left- and top-most x/y-values should be 0 and 0)
        let pathToDraw = this._normalizedVertices.map(vertex =>
            scaleVectorXY(vertex, compoundScale.scaleWidth, compoundScale.scaleHeight)
            .subtract(new Vector([boundingBox.left, boundingBox.top]))
            .add(offset));
        Renderer.drawPath(pathToDraw, this._prerenderingContext, this.style);
    };
}

function scaleVectorXY(vector, scaleX, scaleY) {
    return new Vector([vector.x * scaleX, vector.y * scaleY]);
}
