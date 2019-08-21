import {
    DEFAULTS,
    Renderer
} from './Renderer';
import {
    Composition
} from './Composition';
import {
    PrimitiveComponent
} from './PrimitiveComponent';
import {
    Circle
} from './Circle';
import {
    Ellipse
} from './Ellipse';
import {
    Rectangle
} from './Rectangle';
import {
    Line
} from './Line';
import {
    VectorPath
} from './VectorPath';
import {
    Bezier
} from './Bezier';
import {
    Image
} from './Image';
import {
    Text
} from './Text';

import {
    EventEmitter
} from 'micro-mvc';

import * as Events from './Events';

//const FPS_EPSILON = 10; // +/- 10ms for animation loop to determine if enough time has passed to render
const DEFAULT_TARGET_FPS = 1000 / 60; //amount of time that must pass before rendering

/**
 * EPSILON is the smallest floating number able to be represented by the runtime, and can be used as a threshold to determine if something is "touching" another thing.
 */
export const EPSILON = Number.EPSILON;

/**
 * The CanvasCompositor class is the entry-point to usage of the `canvas-compositor`.
 * The application programmer is expected to hand over low-level control of the canvas
 * context to the high-level classes and methods exposed by CanvasCompositor.
 *
 * The CanvasCompositor class establishes an event dispatcher, animation loop, and scene graph for
 * compositions.
 */
class CanvasCompositor extends EventEmitter {
    /**
     * The CanvasCompositor class establishes an event dispatcher, animation loop, and scene graph for
     * compositions
     *
     * @param {object} canvas This should be a canvas, either from the DOM or an equivalent API
     *
     * @example
     * let cc = new CanvasCompositor(document.getElementById('myCanvas'));
     */
    constructor(canvas) {
        super();
        this._canvas = canvas;
        this._context = this._canvas.getContext('2d');

        //acquire the padding on the canvas – this is necessary to properly
        //locate the mouse position
        //TODO: determine if border-box affects this, and adjust accordingly
        let style = window.getComputedStyle(this._canvas);

        this._mouseX = null;
        this._mouseY = null;

        let borderLeft = style.getPropertyValue('border-left') ? parseFloat(style.getPropertyValue('border-left')) : 0;
        let paddingLeft = style.getPropertyValue('padding-left') ? parseFloat(style.getPropertyValue('padding-left')) : 0;

        this._leftPadding = borderLeft + paddingLeft;

        let borderTop = style.getPropertyValue('border-top') ? parseFloat(style.getPropertyValue('border-top')) : 0;
        let paddingTop = style.getPropertyValue('padding-top') ? parseFloat(style.getPropertyValue('padding-top')) : 0;

        this._topPadding = borderTop + paddingTop;

        this._currentTime = 0;
        this._lastFrameTimestamp = 0;
        this._lastRenderTime = 0;

        this._targetObject = null;

        this._scene = new Composition(this.canvas);

        this._bindEvents();

        this._animationLoop();
        this._framerate = 0;
    }

    get framerate() {
        //var framerateUpdatedEvent = new Event();
        return this._framerate;
    }

    //TODO: multiple target objects? in reverse order of render? in order of composition?
    /**
     * the object currently selected for interaction
     * @type {object}
     */
    get targetObject() {
        return this._targetObject;
    }
    /**
     * the object currently selected for interaction
     * @param {object} val
     * @type {object}
     */
    set targetObject(val) {
        this._targetObject = val;
    }

    /**
     * the root of the scene graph. add primitives to this to compose an image
     * @type {object}
     */
    get scene() {
        return this._scene;
    }

    /**
     * get the X position of the mouse on the canvas
     * @type {number}
     */
    get mouseX() {
        return this._mouseX;
    }

    /**
     * get the Y position of the mouse on the canvas
     * @type {number}
     */
    get mouseY() {
        return this._mouseY;
    }

    /**
     * The animation loop for this instance of CanvasCompositor.
     * Upon receipt of the animation frame from `requestAnimationFrame`, the loop will check
     * whether enough time has passed to redraw for the target framerate.
     * It will only draw if somewhere along the scene graph, an object needs updating.
     * There is no need to invoke this directly, the constructor will do it.
     */
    _animationLoop() {
        window.requestAnimationFrame(this._animationLoop.bind(this));
        this._currentTime = +new Date();
        //set maximum of 60 fps and only redraw if necessary
        if ( /*this._currentTime - this._lastFrameTimestamp >= this._targetFPS &&*/ this.scene.needsDraw) {
            this._lastRenderTime = +new Date();
            Renderer.clearRect(0, 0, this._canvas.width, this._canvas.height, this._context);
            this.scene.draw(this._context);
        }
        this._framerate = parseInt(1000 / (this._currentTime - this._lastFrameTimestamp));
        this._lastFrameTimestamp = +new Date();

    }

    /**
     * attach interaction events to the canvas. the canvas compositor dispatches
     * events to relevant objects through bridges to the scene graph
     */
    _bindEvents() {
        //must bind to `this` to retain reference

        let _cc = this;
        this._canvas.addEventListener(Events.MOUSEDOWN, (e) => {
            _cc.dispatchEvent(e);
        });

        this._canvas.addEventListener(Events.MOUSEMOVE, (e) => {
            _cc.dispatchEvent(e);
        });
        this._canvas.addEventListener(Events.MOUSEUP, (e) => {
            _cc.dispatchEvent(e);
        });
        this._canvas.addEventListener(Events.MOUSEOUT, (e) => {
            _cc.dispatchEvent(e);
        });
        this._canvas.addEventListener(Events.CLICK, (e) => {
            _cc.dispatchEvent(e);
        });

        this.addEventListener(Events.MOUSEDOWN, this._handleMouseDown);
        this.addEventListener(Events.MOUSEMOVE, this._handleMouseMove);
        this.addEventListener(Events.MOUSEUP, this._handleMouseUp);
        this.addEventListener(Events.MOUSEOUT, this._handleMouseOut);
        this.addEventListener(Events.CLICK, this._handleClick);
    }

    /**
     * bridge the mouse down event on the canvas to the
     * the objects in the scene graph
     */
    _handleMouseDown(e) {
        e.preventDefault();

        let x = e.offsetX - this._leftPadding;
        let y = e.offsetY - this._topPadding;

        //pass through x and y to propagated events
        e.canvasX = x;
        e.canvasY = y;

        let clickedObject = this.scene.childAt(x, y);

        if (clickedObject) {
            clickedObject.dispatchEvent(e);
        }
    }

    /**
     * bridge the mouse up event on the canvas to the
     * the objects in the scene graph
     */
    _handleMouseUp(e) {
        e.preventDefault();

        let x = e.offsetX - this._leftPadding;
        let y = e.offsetY - this._topPadding;

        //pass through x and y to propagated events
        e.canvasX = x;
        e.canvasY = y;

        for (let c of this.scene.children) {
            c.dispatchEvent(e);
        }

        let clickedObject = this.scene.childAt(x, y);

        if (clickedObject) {
            clickedObject.dispatchEvent(e);
        }
    };

    /**
     * bridge the mouse move event on the canvas to the
     * the objects in the scene graph
     */
    _handleMouseMove(e) {
        e.preventDefault();
        this._mouseX = e.offsetX - this._leftPadding;
        this._mouseY = e.offsetY - this._topPadding;

        for (let c of this.scene.children) {
            c.dispatchEvent(e)
        }
    };

    /**
     * bridge the click event on the canvas to the
     * the objects in the scene graph
     */
    _handleClick(e) {
        e.preventDefault();

        let x = e.offsetX - this._leftPadding;
        let y = e.offsetY - this._topPadding;

        //pass through x and y to propagated events
        e.canvasX = x;
        e.canvasY = y;

        let clickedObject = this.scene.childAt(x, y);
        if (clickedObject) {
            clickedObject.dispatchEvent(e);
        }
    };

    /**
     * bridge the mouse out event on the canvas to the
     * the objects in the scene graph
     */
    _handleMouseOut(e) {
        e.preventDefault();

        for (let c of this.scene.children) {
            c.dispatchEvent(e);
        };
    };
}

/**
 * The initialization function
 * @param {object} canvas This should be a canvas, either from the DOM or an equivalent API
 */
export function init(canvas) {
    return new CanvasCompositor(canvas);
}

export {
    Renderer,
    PrimitiveComponent,
    Composition,
    Circle,
    Ellipse,
    Rectangle,
    Line,
    VectorPath,
    Bezier,
    Image,
    Text,
    DEFAULTS,
    Events
}
