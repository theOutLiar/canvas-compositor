import { Vector } from 'vectorious';
import EventEmitter from '../events/EventEmitter';
import * as Defaults from './Defaults';
import { drawImage, clearRect } from '../graphics/Renderer';


//assign default values to an object so that the Object.assign function can be used
/**
 * The default values to be passed to the renderer and overridden by any given object
 */
let defaults = {
  //direction: 'inherit',
  fillStyle: Defaults.FILL_STYLE,
  //filter: 'none',
  strokeStyle: Defaults.STROKE_STYLE,
  lineCap: Defaults.LINE_CAP,
  lineWidth: Defaults.LINE_WIDTH,
  lineJoin: Defaults.LINE_JOIN,
  miterLimit: Defaults.MITER_LIMIT,
  font: Defaults.FONT,
  textAlign: Defaults.TEXT_ALIGN,
  textBaseline: Defaults.TEXT_BASELINE,
  lineDash: []
};

/**
 * The base class of things that may be drawn on the canvas.
 * All drawable objects should inherit from this class.
 * Typically, it is unnecessary for application programmers to
 * call this directly, although they may wish to extend their own
 * classes with it.
 */
export default class Component extends EventEmitter {
  //TODO: provide details about options for docs - link to a separate page
  /**
   * construct a primitive component
   * @param {object} options
   */
  constructor(options = {}) {
    super();

    //TODO: reimplement any flags for debug data
    //this._flags = {};
    //this._flags.DEBUG = options.debug || false;

    this.needsDraw = true;
    this.needsRender = true;
    this.d = new Vector([options.x || 0, options.y || 0]);

    /**
     * the horizontal scale of the object. defaults to 1
     * @type {number} _scaleWidth
     */
    this._scaleWidth = 1;

    /**
     * the vertical scale of the object. defaults to 1
     * @type {number} _scaleHeight
     */
    this._scaleHeight = 1;


    /**
     * style options for this particular object. these are standard context styles
     * @type {object} style
     */
    this.style = Object.assign({}, defaults, options.style);

    /**
     * the parent object of this object. with the exception of the scene composition itself,
     * the root of all objects ancestry should be the scene composition
     * @type {object} parent
     */
    this._parent = options.parent || null;
  }

  /**
   * the prerendering canvas is used to avoid performing mutliple draw operations on the
   * visible, main canvas. this minimizes the time needed to render by prerendering on a
   * canvas only as large as necessary for the object
   * @type {object} _prerenderingCanvas
   */
  get prerenderingCanvas() {
    return this._prerenderingCanvas || (this._prerenderingCanvas = document.createElement('canvas'));
  }

  //TODO: enable alternative rendering contexts for WebGL and 3d
  /**
   * the 2D context of the prerendering canvas.
   * @type {object} _prerenderingCanvas
   */
  get prerenderingContext() {
    return this._prerenderingContext || (this._prerenderingContext = this.prerenderingCanvas.getContext('2d'));
  }

  /**
   * the global offset of the object on the canvas.
   * this is the sum of this object's displacement
   * and all of its ancestry.
   * @type {object} offset a 2D Vector representing displacement from [0, 0]
   */
  get offset() {
    return (this.parent ? Vector.add(this.d, this.parent.offset) : this.d);
  }

  /**
   * returns true whenever the object needs to be re-drawn to canvas.
   * when true, this will indicate to the parent tree of composing objects that
   * the object needs to be re-drawn on the next animation loop.
   *
   * objects need to be updated when their displacement changes, or when any thing
   * that requires a rerender occurs.
   *
   * @type {boolean} needsDraw
   */
  get needsDraw() {
    return this._needsDraw;
  }

  /**
   * set to true whenever the object needs to be re-drawn to canvas.
   * when true, this will indicate to the parent tree of composing objects that
   * the object needs to be re-drawn on the next animation loop.
   *
   * objects need to be updated when their displacement changes, or when any thing
   * that requires a rerender occurs.
   *
   * @type {boolean} needsDraw
   */
  set needsDraw(val) {
    //TODO: this could probably be handled better,
    //possibly by using events to direct animation to
    //draw specific components
    if (this.parent && val) {
      this.parent.needsDraw = val;
      this.parent.needsRender = true; // if this needs to be redrawn, then the parent needs a full rerender
    }
    this._needsDraw = val;
  }

  /**
   * returns true whenever the object's properties have changed such that
   * it needs to be rendered differently
   *
   * 1. scale change
   * 1. physical property change (height, width, radius, etc.)
   * 1. color change
   *
   * @type {boolean} needsRender
   */
  get needsRender() {
    return this._needsRender;
  }

  /**
   * set to true whenever the object's properties have changed such that
   * it needs to be rendered differently
   *
   * 1. scale change
   * 1. physical property change (height, width, radius, etc.)
   * 1. color change
   *
   * @type {boolean} needsRender
   */
  set needsRender(val) {
    if (this.parent && val) {
      this.parent.needsRender = val;
    }
    this._needsRender = val;
  }

  /**
   * return the horizontal scale of the object - defaults to 1
   * @type {number} scaleWidth
   */
  get scaleWidth() {
    return this._scaleWidth;
  }

  /**
   * set the horizontal scale of the object - defaults to 1
   * @type {number} scaleWidth
   */
  set scaleWidth(val) {
    this._scaleWidth = val;
    this.needsRender = true;
    this.needsDraw = true;
    for (let c of this.children) {
      c.needsRender = true;
      c.needsDraw = true;
    }
  }

  /**
   * return the vertical scale of the object - defaults to 1
   * @type {number} scaleHeight
   */
  get scaleHeight() {
    return this._scaleHeight;
  }

  /**
   * set the vertical scale of the object - defaults to 1
   * @type {number} scaleHeight
   * @param {number} val the vertical scale
   */
  set scaleHeight(val) {
    this._scaleHeight = val;
    this.needsRender = true;
    this.needsDraw = true;
    for (let c of this.children) {
      c.needsRender = true;
      c.needsDraw = true;
    }
  }

  /**
   * return an object containing the vertical and horizontal scale
   * @type {object} scale
   */
  get scale() {
    return {
      scaleWidth: this.scaleWidth,
      scaleHeight: this.scaleHeight
    };
  }

  /**
   * set the scale width and height in one go
   * @type {number} scale
   */
  set scale(val) {
    this.scaleHeight = val;
    this.scaleWidth = val;
  }

  /**
   * return the scale of the object, compounded with the parent object's scale
   * @type {{scaleWidth: number, scaleHeight: number}} compoundScale the scale multiplied by the compound scale of its parent or 1
   */
  get compoundScale() {
    return {
      scaleWidth: this.parent ? this.scaleWidth * this.parent.compoundScale.scaleWidth : this.scaleWidth,
      scaleHeight: this.parent ? this.scaleHeight * this.parent.compoundScale.scaleHeight : this.scaleHeight
    };
  }

  /**
   * d is for displacement - returns a vector
   * @type {object} d
   */
  get d() {
    return this._d;
  }

  /**
   * d is for displacement - accepts a vector
   * @type {object} d
   * @param {object} val a vector
   */
  set d(val) {
    this._d = val;
  }

  /**
   * get the parent of the object. all objects except the scene graph should have a parent
   * @type {object} parent
   */
  get parent() {
    return this._parent;
  }

  /**
   * set the parent of the object. all objects except the scene graph should have a parent
   * see https://en.wikipedia.org/wiki/Composite_pattern
   * @type {object} parent
   * @param {object} val a composition
   */
  set parent(val) {
    this._parent = val;
  }

  set boundingBox(val) {
    this._boundingBox = val;
  }

  /**
   * draw the object to canvas, render it if necessary
   * @param {object} context the final canvas context where this will be drawn
   * @param {object} offset the offset on the canvas - optional, used for prerendering
   */
  draw(context, offset) {
    let boundingBox = this.boundingBox;

    this.needsDraw = false;

    if (this.needsRender) {
      /*
          TODO: AB-test this,
          it may be faster than clearRect
      */
      //delete this._prerenderingCanvas;
      //delete this._prerenderingContext;

      //make sure the new canvas has the appropriate dimensions
      this.prerenderingCanvas.width = boundingBox.right - boundingBox.left;
      this.prerenderingCanvas.height = boundingBox.bottom - boundingBox.top;
      //clear any old rendering artifacts - they are no longer viable
      clearRect(0, 0, this.prerenderingCanvas.width, this.prerenderingCanvas.height, this.prerenderingContext);

      this.render();
      this.needsRender = false;
    }

    //TODO: handle debug options
    //draw bounding boxes
    /*if (this._flags.DEBUG) {
        this.prerenderingContext.beginPath();
        this.prerenderingContext.setLineDash([5, 15]);
        this.prerenderingContext.lineWidth = 2.0;
        this.prerenderingContext.strokeStyle = '#FF0000';
        this.prerenderingContext.strokeStyle = '#FF0000';
        this.prerenderingContext.strokeRect(0, 0, this.prerenderingCanvas.width, this.prerenderingCanvas.height);
        this.prerenderingContext.closePath();
    }*/

    //offsets are for prerendering contexts of compositions
    let x = boundingBox.left + (offset && offset.left ? offset.left : 0);
    let y = boundingBox.top + (offset && offset.top ? offset.top : 0);
    drawImage(x, y, this.prerenderingCanvas, context, this.style);
  }

  /**
   * this method must be overridden by a subclass.
   *
   * the render method should be implemented by subclasses
   * @abstract
   */
  render() { }

  /**
   * check whether the point specified lies *inside* this objects bounding box
   *
   * @param {number} x the x coordinate
   * @param {number} y the y coordinate
   * @return {boolean} whether the point is within the bounding box
   */
  pointIsInBoundingBox(x, y) {
    let boundingBox = this.boundingBox;
    return (
      x > boundingBox.left &&
      y > boundingBox.top &&
      x < boundingBox.right &&
      y < boundingBox.bottom
    );
  }

  /**
   * check whether the point is within the object.
   * this method should be overridden by subclassess
   *
   * @param {number} x the x coordinate
   * @param {number} y the y coordinate
   * @return {boolean} whether the point is in the object, as implemented by inheriting classes
   */
  pointIsInObject(x, y) {
    return this.pointIsInBoundingBox(x, y);
  }

  /**
   * move the object on top of other objects (render last)
   */
  moveToFront() {
    if (this.parent) {
      let index = this.parent.children.indexOf(this);
      if (index >= 0) {
        this.parent.children.splice(index, 1);
        this.parent.children.splice(this.parent.children.length, 0, this);
        this.needsDraw = true;
      }
    }
  }

  /**
   * move the object below the other objects (render first)
   */
  moveToBack() {
    if (this.parent) {
      let index = this.parent.children.indexOf(this);
      if (index >= 0) {
        this.parent.children.splice(index, 1);
        this.parent.children.splice(0, 0, this);
        this.needsDraw = true;
      }
    }
  }


  /**
   * move the object forward in the stack (drawn later)
   */
  moveForward() {
    if (this.parent) {
      let index = this.parent.children.indexOf(this);
      if (index >= 0 && index < this.parent.children.length - 1) {
        this.parent.children.splice(index, 1);
        this.parent.children.splice(index + 1, 0, this); //if index + 1 > siblings.length, inserts it at end
        this.parent.UpdateChildrenLists();
        this.needsRender = true;
        this.needsDraw = true;
      }
    }
  }

  /**
   * move the object backward in the stack (drawn sooner)
   */
  moveBackward() {
    if (this.parent) {
      let index = this.parent.children.indexOf(this);
      if (index > 0) {
        this.parent.children.splice(index, 1);
        this.parent.children.splice(index - 1, 0, this);
        this.parent.UpdateChildrenLists();
        this.needsRender = true;
        this.needsDraw = true;
      }
    }
  }
}
