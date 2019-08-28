import {
    drawPath
} from './Renderer';
import {
    PrimitiveComponent
} from './PrimitiveComponent';
import {
    Vector
} from 'vectorious';
import {
    Line
} from './Line';

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

        /**
         * The sequence of vertices in the path
         */
        this._vertices = [];
        this.vertices = options.vertices || [];

        //this.unscaledLineWidth = this.style.lineWidth;

        /**
         * A zeroed bounding box where (left, top) is (0, 0)
         */
        this._zeroedBoundingBox = null;
    }

    /**
     * get the bounding box for the vertices in the path
     * @type {{top:number, left: number, bottom:number, right:number}} boundingBox
     * @property {number} top the coordinate of the top edge of the bounding box
     * @property {number} left the coordinate of the left edge of the bounding box
     * @property {number} right the coordinate of the right edge of the bounding box
     * @property {number} bottom the coordinate of the bottom edge of the bounding box
     */
    get boundingBox() {
        /**
         * The bounding box zeroed
         * @property {number} top always 0
         * @property {number} left always 0
         * @property {number} right the distance from the leftmost vector to the rightmost
         * @property {number} bottom the distance from the topmost vector to the bottommost
         */
        this._zeroedBoundingBox = {
            top: 0,
            left: 0,
            right: this._right - this._left,
            bottom: this._bottom - this._top
        };

        //TODO: reimplement scaling
        return {
            top: this._zeroedBoundingBox.top + this.offset.y - this.style.lineWidth,
            left: this._zeroedBoundingBox.left + this.offset.x - this.style.lineWidth,
            bottom: this._zeroedBoundingBox.bottom + this.offset.y + this.style.lineWidth,
            right: this._zeroedBoundingBox.right + this.offset.x + this.style.lineWidth
        };
    }

    /**
     * retrieve the list of vertices
     * @type {Array<{x: number, y: number }>} the sequence of vertices in the path
     */
    get vertices() {
        return this._vertices;
    }

    /**
     * set the list of vertices
     * @param {Array<{x: number, y: number }>} verts The list of vertices to be used
     */
    set vertices(verts) {
        /**
         * the list of vertices as vectorious Vectors
         * @type {object[]} vertices
         */
        this._vertices = verts.map(v => new Vector([v.x, v.y]));

        let yCoordinates = this.vertices.map(v => v.y);
        let xCoordinates = this.vertices.map(v => v.x);

        //uses `apply` so we can supply the list as a list of arguments
        /**
         * @type {number} the leftmost x-coordinate
         */
        this._left = Math.min.apply(null, xCoordinates);

        /**
         * @type {number} the topmost y-coordinate
         */
        this._top = Math.min.apply(null, yCoordinates);

        /**
         * @type {number} the rightmost x-coordinate
         */
        this._right = Math.max.apply(null, xCoordinates);

        /**
         * @type {number} the bottommost y-coordinate
         */
        this._bottom = Math.max.apply(null, yCoordinates);

        super.d = new Vector([this._left, this._top]);

        /**
         * Vertices zeroed against the displacement vector
         */
        this._zeroedVertices = this.vertices.map(v => v.subtract(this.d));

        super.needsDraw = true;
        super.needsRender = true;
    }

    /**
     * determine whether the point is in the object
     * even/odd line intersection test against the outer edge of the line-width
     * @param {number} x the x coordinate
     * @param {number} y the y coordinate
     * @return {boolean} whether or not the point is in the object
     */
    pointIsInObject(x, y) {
        let inside = false;

        //only bother with this check if we already know we're within the bounding box
        if (super.pointIsInObject(x, y)) {
            //create a line that travels from this point in any direction
            //if it intersects the polygon an odd number of times, it is inside

            //a line can be described by a vertex and a direction
            let l = new Line(new Vector([x, y]), new Vector([1, 0]));

            let compoundScale = this.compoundScale;
            let offset = this.offset;

            for (let i = 0; i < this._zeroedVertices.length; i++) {
                let j = (i + 1) >= this._zeroedVertices.length ? 0 : i + 1;

                //TODO: reimplement scaling
                let v = _scaleVectorXY(this._zeroedVertices[i], compoundScale.scaleWidth, compoundScale.scaleHeight)
                    .add(offset);

                let w = _scaleVectorXY(this._zeroedVertices[j], compoundScale.scaleWidth, compoundScale.scaleHeight)
                    .add(offset);

                //for some reason, the below doesn't work
                //let v = this._zeroedVertices[i].add(offset);

                //let w = this._zeroedVertices[j].add(offset);


                //TODO: determine how to account for lineWidths.
                //it becomes complicated to determine which side of
                //the line forms the outside edge unless you already
                //know you're "inside" the polygon path
                let edgeDirection = Vector.subtract(w, v).normalize();
                let edge = new Line(v, edgeDirection);
                let intersection = edge.intersectionWith(l);

                //if the lines are parallel/colocated, no need to count;
                if (intersection === null) {
                    continue;
                }

                //TODO: should replace 0s with epsilons, where epsilon is
                //the threshhold for considering two things as touching/intersecting
                let intersectToTheRight = intersection.x - x >= Number.EPSILON;

                //if the intersection is not to the right, no need to count
                if (!intersectToTheRight) {
                    continue;
                }

                let negativeX = (edgeDirection.x < -Number.EPSILON);
                let negativeY = (edgeDirection.y < -Number.EPSILON);

                //technically speaking, bottom and top should be reversed,
                //since y=0 is the top left corner of the screen - it's
                //just easier to think about it mathematically this way
                let leftVertex = negativeX ? w : v;
                let rightVertex = negativeX ? v : w;
                let topVertex = negativeY ? w : v;
                let bottomVertex = negativeY ? v : w;

                let intersectWithinSegment =
                    (intersection.x - leftVertex.x >= Number.EPSILON) &&
                    (rightVertex.x - intersection.x >= Number.EPSILON) &&
                    (intersection.y - topVertex.y >= Number.EPSILON) &&
                    (bottomVertex.y - intersection.y >= Number.EPSILON);

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
        //zero the vertices (left- and top-most x/y-values should be 0 and 0)
        //TODO: reimplement scaling
        let pathToDraw = this._zeroedVertices.map(vertex =>
            vertex.subtract(new Vector([boundingBox.left, boundingBox.top])).add(offset));
        drawPath(pathToDraw, this._prerenderingContext, this.style);
    };
}


//for scaling a vector
//TODO: reimplement scaling
/**
 * scale the vectors
 * @param {object} vector the vector to scale
 * @param {number} scaleX the amount to scale the x component of the vector
 * @param {number} scaleY the amount to scale the y component of the vector
 */
function _scaleVectorXY(vector, scaleX, scaleY) {
    return new Vector([vector.x * scaleX, vector.y * scaleY]);
}
