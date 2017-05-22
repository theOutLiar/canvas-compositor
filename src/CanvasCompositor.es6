import {
    DEFAULTS,
    Renderer
} from './Renderer';

import Composition from './Composition';
import PrimitiveComponent from './PrimitiveComponent';
import Circle from './Circle';
import Rectangle from './Rectangle';
import Line from './Line';
import VectorPath from './VectorPath';
import Image from './Image';

//const FPS_EPSILON = 10; // +/- 10ms for animation loop to determine if enough time has passed to render
const DEFAULT_TARGET_FPS = 1000 / 60; //amount of time that must pass before rendering

const EVENTS = {
    MOUSEUP: 'onmouseup',
    MOUSEDOWN: 'onmousedown',
    MOUSEMOVE: 'onmousemove',
    MOUSEOUT: 'onmouseout',
    CLICK: 'onclick'
};

/**
 * The CanvasCompositor class is the entry-point to usage of the `canvas-compositor`.
 * The application programmer is expected to hand over low-level control of the canvas
 * context to the high-level classes and methods exposed by CanvasCompositor.
 *
 * The CanvasCompositor class establishes an event dispatcher, animation loop, and scene graph for
 * compositions.
 */
export default class CanvasCompositor {
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
        this._canvas = canvas;
        this._context = this._canvas.getContext('2d');

        //acquire the padding on the canvas – this is necessary to properly
        //locate the mouse position
        //TODO: determine if border-box affects this, and adjust accordingly
        let style = window.getComputedStyle(this._canvas);

        let borderLeft = style.getPropertyValue('border-left') ? parseFloat(style.getPropertyValue('border-left')) : 0;
        let paddingLeft = style.getPropertyValue('padding-left') ? parseFloat(style.getPropertyValue('padding-left')) : 0;

        /**
         * @type {number} _leftPadding the padding on the left of the canvas, which
         * affects the offset of the mouse position
         */
        this._leftPadding = borderLeft + paddingLeft;


        let borderTop = style.getPropertyValue('border-top') ? parseFloat(style.getPropertyValue('border-top')) : 0;
        let paddingTop = style.getPropertyValue('padding-top') ? parseFloat(style.getPropertyValue('padding-top')) : 0;

        /**
         * @type {number} _topPadding the padding on the top of the canvas, which
         * affects the offset of the mouse position
         */
        this._topPadding = borderTop + paddingTop;

        //this._currentTime = 0;
        //this._lastRenderTime = 0;

        this._targetObject = null;

        this._scene = new Composition(this.canvas);

        this._bindEvents();

        this._eventRegistry = {
            onmouseup: [],
            onmousedown: [],
            onmousemove: [],
            onmouseout: [],
            onclick: []
        };

        this._animationLoop();
        //this._framerate = 0;
    }

    //TODO: expose the framerate
    /*set framerate(val) {
        this._framerate = val;
    }

    get framerate() {
        var framerateUpdatedEvent = new Event();
        return this._framerate;
    }*/

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
     * The animation loop for this instance of CanvasCompositor.
     * Upon receipt of the animation frame from `requestAnimationFrame`, the loop will check
     * whether enough time has passed to redraw for the target framerate.
     * It will only draw if somewhere along the scene graph, an object needs updating.
     * There is no need to invoke this directly, the constructor will do it.
     */
    _animationLoop() {
        //console.log(this);
        //console.log();
        window.requestAnimationFrame(this._animationLoop.bind(this));
        //this._currentTime = +new Date();
        //set maximum of 60 fps and only redraw if necessary
        if ( /*this._currentTime - this._lastRenderTime >= this._targetFPS &&*/ this.scene.needsDraw) {
            //this.framerate = 1 / (this._currentTime - this._lastRenderTime / 1000)
            //this._lastRenderTime = +new Date();
            Renderer.clearRect(0, 0, this._canvas.width, this._canvas.height, this._context);
            this.scene.draw(this._context);
        }

    }

    /**
     * add an event to the event registry
     *
     * @param {string} eventType the name of the type of event
     * @param {function} callback the callback to be triggered when the event occurs
     */
    registerEvent(eventType, callback) {
        if (this._eventRegistry[eventType]) {
            this._eventRegistry[eventType].push(callback);
        }
    };

    /**
     * remove an event to the event registry
     *
     * @param {string} eventType the name of the type of event
     * @param {function} callback the callback to be removed from the event
     * @return {function} the callback that was removed
     */
    removeEvent(eventType, callback) {
        if (this._eventRegistry[eventType]) {
            let index = this._eventRegistry[eventType].indexOf(callback);
            if (index >= 0) {
                return this._eventRegistry[eventType].splice(index, 1);
            }
        }
    };

    /**
     * attach interaction events to the canvas. the canvas compositor dispatches
     * events to relevant objects through bridges to the scene graph
     */
    _bindEvents() {
        //TODO: reimplement touch events?
        //must bind to `this` to retain reference
        this._canvas.addEventListener('mousedown', this._handleMouseDown.bind(this));
        this._canvas.addEventListener('mouseup', this._handleMouseUp.bind(this));
        this._canvas.addEventListener('mousemove', this._handleMouseMove.bind(this));
        this._canvas.addEventListener('mouseout', this._handleMouseOut.bind(this));
        this._canvas.addEventListener('click', this._handleClick.bind(this));
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

        for (let callback of this._eventRegistry[EVENTS.MOUSEDOWN]) {
            callback(e);
        };

        let clickedObject = this.scene.childAt(x, y);

        if (clickedObject && clickedObject.onmousedown) {
            clickedObject.onmousedown(e);
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
            if (c.draggable && c.onmouseup) {
                c.onmouseup(e);
            }
        };

        for (let callback of this._eventRegistry[EVENTS.MOUSEUP]) {
            callback(e);
        };

        let clickedObject = this.scene.childAt(x, y);

        if (clickedObject && clickedObject.onmouseup) {
            clickedObject.onmouseup(e);
        }
    };

    /**
     * bridge the mouse move event on the canvas to the
     * the objects in the scene graph
     */
    _handleMouseMove(e) {
        e.preventDefault();
        let objects = this.scene.children.filter((c) => !!(c.onmousemove));

        for (let callback of this._eventRegistry[EVENTS.MOUSEMOVE]) {
            callback(e);
        };

        for (let o of objects) {
            o.onmousemove(e);
        };
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

        //TODO: FF doesn't get this
        let objects = this.scene.children.filter((c) => !!(c.onclick));

        for (let callback of this._eventRegistry[EVENTS.CLICK]) {
            callback(e);
        };

        for (let o of objects) {
            o.onclick(e);
        };
    };

    /**
     * bridge the mouse out event on the canvas to the
     * the objects in the scene graph
     */
    _handleMouseOut(e) {
        e.preventDefault();

        let objects = this.scene.children.filter((c) => !!(c.onmouseout));

        for (let o of objects) {
            o.onmouseout(e);
        };

        for (let callback of this._eventRegistry[EVENTS.MOUSEOUT]) {
            callback(e);
        };
    };
}

/*


	CanvasCompositor.prototype._bindEvents = function () {

        //TODO: typically, usage of stopPropagation() is a sign that things were done wrong.
		this._canvas.addEventListener('touchstart', function (e) {
			e.preventDefault();
			e.stopPropagation();
			_translateTouchEvent('mousedown', e);
		});
		this._canvas.addEventListener('touchend', function (e) {
			e.preventDefault();
			e.stopPropagation();
			_translateTouchEvent('mouseup', e);
		});
		this._canvas.addEventListener('touchmove', function (e) {
			e.preventDefault();
			e.stopPropagation();
			_translateTouchEvent('mousemove', e);
		});
		this._canvas.addEventListener('touchcancel', function (e) {
			e.preventDefault();
			e.stopPropagation();
			_translateTouchEvent('mouseout', e);
		});

		//there is no 'touch' event
		//should the press event be disabled?
		//should it be simulated?
		//can all functionality be covered by up+down/start+end events?
	};

	function _translateTouchEvent(type, e) {
		var mouseEventInit;
		if (e.touches.length) {
			mouseEventInit = {
				screenX: e.touches[0].screenX,
				screenY: e.touches[0].screenY,
				clientX: e.touches[0].clientX,
				clientY: e.touches[0].clientY,
				button: 0
			};
		} else {
			mouseEventInit = _lastKnownTouchLocation;
		}
		_lastKnownTouchLocation = mouseEventInit;
		var evt = new window.MouseEvent(type, mouseEventInit);
		e.target.dispatchEvent(evt);
	}
*/

export {
    CanvasCompositor,
    Renderer,
    PrimitiveComponent,
    Composition,
    Circle,
    Rectangle,
    Line,
    VectorPath,
    Image,
    DEFAULTS
};
