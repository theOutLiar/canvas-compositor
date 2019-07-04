import { Vector } from 'vectorious';
import { DEFAULTS, Renderer } from './Renderer';

/**
 * The base class of things that may be drawn on the canvas.
 * All drawable objects should inherit from this class.
 * Typically, it is unnecessary for application programmers to
 * call this directly, although they may wish to extend their own
 * classes with it.
 */
export class PrimitiveComponent {
    /**
     * @param {object} options
     */
    constructor(options) {

        options = options || {};

        this._flags = {};
        this._flags.DEBUG = options.debug || false;

        /**
         * does the object need to be redrawn?
         * @type {boolean} _needsDraw
         */
        this._needsDraw = true;

        /**
         * does the object need to be rendered?
         * @type {boolean} _needsRender
         */
        this._needsRender = true;

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
         * d is for "displacement": a 2D Vector object representing cartesian coordinate
         * position relative to its parent composition (or [0,0] if this is the scene composition)
         * @type {object} d
         */
        this._d = new Vector([options.x || 0, options.y || 0]);

        /**
         * style options for this particular object. these are standard context styles
         * @type {object} style
         */
        this.style = Object.assign({}, DEFAULTS, options.style);

        /**
         * objects with pressPassThrough set to true will allow mouse clicks to pass
         * through to objects behind them
         * @type {boolean} pressPassThrough
         */
        //this.pressPassThrough = options.pressPassThrough || false;

        /**
         * if true, the object can be dragged around the canvas
         * @type {boolean} draggable
         */
        this.draggable = options.draggable || false;

        /**
         * if true, the bounding box of the object will be draw
         * @type {boolean} drawBoundingBox
         */
        //this.drawBoundingBox = false;
        //this.boundingBoxColor = '#cccccc';

        /**
         * the prerendering canvas is used to avoid performing mutliple draw operations on the
         * visible, main canvas. this minimizes the time needed to render by prerendering on a
         * canvas only as large as necessary for the object
         * @type {object} _prerenderingCanvas
         */
        this._prerenderingCanvas = document.createElement('canvas');

        /**
         * the 2D context of the prerendering canvas.
         * @type {object} _prerenderingCanvas
         */
        this._prerenderingContext = this._prerenderingCanvas.getContext('2d');

        /**
         * the parent object of this object. with the exception of the scene composition itself,
         * the root of all objects ancestry should be the scene composition
         * @type {object} parent
         */
        this._parent = options.parent || null;

        /**
         * a callback for the mousedown event.
         * @type {function} onmousedown
         */
        this.onmousedown = null;

        /**
         * a callback for the mouseup event.
         * @type {function} onmouseup
         */
        this.onmouseup = null;

        /**
         * a callback for the mousemove event.
         * @type {function} onmousemove
         */
        this.onmousemove = null;

        /**
         * a callback for the mouseout event.
         * @type {function} onmouseout
         */
        this.onmouseout = null;

        /**
         * a callback for the click event.
         * @type {function} onclick
         */
        this.onclick = null;


        if (this.draggable) {
            this.enableDragging();
        }
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
    //TODO: provide links to things
    /**
     * set the parent of the object. all objects except the scene graph should have a parent
     * @type {object} parent
     * @param {object} val a composition
     */
    set parent(val) {
        this._parent = val;
    }

    /**
     * enable dragging by setting the onmousedown event callback
     */
    enableDragging() {
        //TODO: should probably be using an event registry so
        //multiple event callbacks can be registered
        this.onmousedown = this.dragStart;
    }

    /**
     * disable dragging by removing event callbacks
     */
    disableDragging() {
        //TODO: should probably be using an event registry so
        //multiple event callbacks can be registered
        this.onmousedown = null;
        this.onmousemove = null;
        this.onmouseup = null;
        this.onmouseout = null;
        this.needsDraw = true;
    }

    /**
     * when dragging starts, update events
     * @param {object} e the event object
     */
    dragStart(e) {
        //TODO: should probably be using an event registry so
        //multiple event callbacks can be registered
        this._mouseOffset = new Vector([e.offsetX, e.offsetY]).subtract(this.offset);
        this.onmousedown = null;
        this.onmousemove = this.drag;
        this.onmouseup = this.dragEnd;
        this.onmouseout = this.dragEnd;
    }

    /**
     * update d as the object is moved around
     * @param {object} e the event object
     */
    drag(e) {
        this.d = new Vector([e.offsetX, e.offsetY]).subtract(this._mouseOffset);
        this.needsDraw = true;
    }

    /**
     * when dragging ends, update events
     * @param {object} e the event object
     */
    dragEnd(e) {
        this.onmousedown = this.dragStart;
        this.onmousemove = null;
        this.onmouseup = null;
        this.onmouseout = null;
        this.needsDraw = true;
    }

    /**
     * draw the object to canvas, render it if necessary
     * @param {object} context the final canvas context where this will be drawn
     * @param {object} offset the offset on the canvas - optional, used for prerendering
     */
    draw(context, offset) {
        let boundingBox = this.boundingBox;

        this.needsDraw = false;

        if (this.needsRender && this.render) {
            //ditch any old rendering artifacts - they are no longer viable
            delete this._prerenderingCanvas;
            delete this._prerenderingContext;

            //create a new canvas and context for rendering
            this._prerenderingCanvas = document.createElement('canvas');
            this._prerenderingContext = this._prerenderingCanvas.getContext('2d'); //text needs prerendering context defined for boundingBox measurements

            //make sure the new canvas has the appropriate dimensions
            this._prerenderingCanvas.width = boundingBox.right - boundingBox.left;
            this._prerenderingCanvas.height = boundingBox.bottom - boundingBox.top;

            this.render();
            this.needsRender = false;
        }

        //TODO: handle debug options
        //draw bounding boxes
        if (this._flags.DEBUG) {
        	this._prerenderingContext.beginPath();
            this._prerenderingContext.setLineDash([5, 15]);
        	this._prerenderingContext.lineWidth=2.0;
            this._prerenderingContext.strokeStyle='#FF0000';
        	this._prerenderingContext.strokeStyle='#FF0000';
        	this._prerenderingContext.strokeRect(0,0,this._prerenderingCanvas.width, this._prerenderingCanvas.height);
        	this._prerenderingContext.closePath();
        }

        //TODO: handle bounding box drawing
        /*if (this.drawBoundingBox){
        	this._prerenderingContext.beginPath();
        	this._prerenderingContext.lineWidth=2.0;
        	this._prerenderingContext.strokeStyle=this.boundingBoxColor;
        	this._prerenderingContext.strokeRect(0,0,this._prerenderingCanvas.width, this._prerenderingCanvas.height);
        	this._prerenderingContext.closePath();
        }*/

        //offsets are for prerendering contexts of compositions
        let x = boundingBox.left + (offset && offset.left ? offset.left : 0);
        let y = boundingBox.top + (offset && offset.top ? offset.top : 0);
        Renderer.drawImage(x, y, this._prerenderingCanvas, context, this.style);
    }

    //TODO: provide more doc details around this
    /**
     * this method must be overridden by a subclass.
     *
     * the render method should be implemented by subclasses
     * @abstract
     */
    render() {}

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
