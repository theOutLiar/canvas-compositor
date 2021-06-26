
import { Vector } from 'vectorious';
import PrimitiveComponent from './PrimitiveComponent';
import { drawBezier } from './Renderer';

// TODO: There are multiple optimizations that can be done here, specifically with regard to calculating
// things only once. the extrema don't necessarily need recomputing just to get the bounding box. the
// bounding box itself could be stored within the PrimitiveComponent for all types

/**
 * A helper function for finding local extrema given possible solutions
 * @param {object} start a component of the starting coordinate
 * @param {object} c1 a component of the first control point
 * @param {object} c2 a component of the second control point
 * @param {object} end a component of the ending coordinate
 * @param {object} t a possible solution
 */
function _cubicBezier(start, c1, c2, end, t) {
  //uhh... i looked up *SO* much stuff on this, and even tried to work out the math myself,
  //but this is ridiculous - where does this come from?
  return start * (1 - t) * (1 - t) * (1 - t) + 3 * c1 * t * (1 - t) * (1 - t) + 3 * c2 * t * t * (1 - t) + end * t * t * t;
}

/**
 * return the local extremes of the curve
 * @param {object} start a component of the starting vector
 * @param {object} c1 a component of the first control point
 * @param {object} c2 a component of the second control point
 * @param {object} end a component of the ending vector
 */
function _getExtremes(start, c1, c2, end) {
  let a = 3 * end - 9 * c2 + 9 * c1 - 3 * start;
  let b = 6 * c2 - 12 * c1 + 6 * start;
  let c = 3 * c1 - 3 * start;

  let solutions = [];
  let localExtrema = [];

  //"discriminant"
  let disc = b * b - 4 * a * c;

  if (disc >= 0) {
    if (!Math.abs(a) > 0 && Math.abs(b) > 0) {
      solutions.push(-c / b);
    } else if (Math.abs(a) > 0) {
      solutions.push((-b + Math.sqrt(disc)) / (2 * a));
      solutions.push((-b - Math.sqrt(disc)) / (2 * a));
    } else {
      throw new Error("no solutions!?!?!");
    }

    for (let t of solutions) {
      if (0 <= t && t <= 1) {
        localExtrema.push(_cubicBezier(start, c1, c2, end, t));
      }
    }
  }

  localExtrema.push(start, end);

  return localExtrema;
}

/**
 * A Bezier curve
 */
export default class Bezier extends PrimitiveComponent {

  /**
   * @param {object} options the options for the bezier curve
   */
  constructor(options) {
    super(options);

    let start = new Vector([options.start.x, options.start.y]);
    let end = new Vector([options.end.x, options.end.y]);
    let control1 = new Vector([options.control1.x, options.control1.y]);
    let control2 = new Vector([options.control2.x, options.control2.y]);

    /**
     * The bounding box of the curve
     */
    this._boundingBox = null;

    /**
     * Helper to update the bounding box
     */
    this._boundingBoxNeedsUpdate = true;

    let xExtrema = _getExtremes(start.x, control1.x, control2, end.x);
    let yExtrema = _getExtremes(start.y, control1.y, control2.y, end.y);
    super.d = new Vector([Math.min.apply(null, xExtrema), Math.min.apply(null, yExtrema)])

    /**
     * The starting point of the curve
     */
    this._start = Vector.subtract(start, this.d);

    /**
     * The ending point of the curve
     */
    this._end = Vector.subtract(end, this.d);

    /**
     * The first control point
     */
    this._control1 = Vector.subtract(control1, this.d);

    /**
     * The second control point
     */
    this._control2 = Vector.subtract(control2, this.d);
  }

  /**
   * get the bounding box of the bezier
   * @type {{top:number, left:number, bottom:number, right:number}} boundingBox
   */
  get boundingBox() {
    //if (this._boundingBox === null || this._boundingBoxNeedsUpdate) {
    let lineWidth = this.style.lineWidth;

    let offset = this.offset;
    let start = Vector.add(this._start, this.offset);
    let control1 = Vector.add(this._control1, this.offset);
    let control2 = Vector.add(this._control2, this.offset);
    let end = Vector.add(this._end, this.offset);

    let xExtrema = _getExtremes(start.x, control1.x, control2, end.x);
    let yExtrema = _getExtremes(start.y, control1.y, control2.y, end.y);
    this._boundingBox = {
      top: Math.min.apply(null, yExtrema) - lineWidth,
      right: Math.max.apply(null, xExtrema) + lineWidth,
      bottom: Math.max.apply(null, yExtrema) + lineWidth,
      left: Math.min.apply(null, xExtrema) - lineWidth
    }
    this._boundingBoxNeedsUpdate = false;
    //}
    return this._boundingBox;
  }

  /**
   * render the bezier curve
   */
  render() {
    drawBezier(
      this._start,
      this._end,
      this._control1,
      this._control2,
      this._prerenderingContext,
      this.style
    );
  }
}
