define(['lodash', 'renderer', 'canvas-object', 'vector-path', 'rectangle', 'ellipse', 'text', 'image', 'container'], function (_, Renderer, CanvasObject, Path, Rectangle, Ellipse, Text, Image, Container) {
    'use strict';

    var _events = {
        PRESS_UP: 'onpressup',
        PRESS_DOWN: 'onpressdown',
        PRESS_MOVE: 'onpressmove',
        PRESS_CANCEL: 'onpresscancel'
    };

	var _lastKnownTouchLocation;

    function CanvasCompositor(canvas, options) {
        this._canvas = canvas;
        this._context = this._canvas.getContext('2d');

        this._updateThreshhold = 1000 / 60; //amount of time that must pass before rendering
        this._lastRenderTime = 0; //set to 0 to make sure first render happens right away
        this._currentTime = 0;

        //TODO:
        //this is **intended** to be a kind of scoping trick,
        //and only apply within this instance - needs testing
        //although may not even be relevant after this point
        //in processing...
        CanvasObject.Renderer = new Renderer(this._context, options);

        this.Scene = new Container({ x: 0, y: 0 });

        this._bindEvents();
        this._animationLoop();
        this._eventRegistry = {
            onpressup: [],
            onpressdown: [],
            onpressmove: [],
            onpresscancel: []
        };
    }

    CanvasCompositor.prototype.registerEvent = function _registerEvent(eventType, callback){
        if(this._eventRegistry[eventType]){
            this._eventRegistry[eventType].push(callback);
        }
    };

    CanvasCompositor.prototype.removeEvent = function _removeEvent(eventType, callback){
        if(this._eventRegistry[eventType]){
            var index = this._eventRegistry[eventType].indexOf(callback);
            if(index >= 0){
                return this._eventRegistry[eventType].splice(index, 1);
            }
        }
    };

    CanvasCompositor.prototype._bindEvents = function(){
        this._canvas.addEventListener('mousedown', _.bind(this._handlePressDown, this));
        this._canvas.addEventListener('mouseup', _.bind(this._handlePressUp, this));
        this._canvas.addEventListener('mousemove', _.bind(this._handlePressMove, this));
        this._canvas.addEventListener('mouseout', _.bind(this._handlePressCancel, this));

        this._canvas.addEventListener('touchstart', function(e){
            e.preventDefault();
            e.stopPropagation();
            _translateTouchEvent('mousedown', e);
        });
        this._canvas.addEventListener('touchend', function(e){
            e.preventDefault();
            e.stopPropagation();
            _translateTouchEvent('mouseup', e);
        });
        this._canvas.addEventListener('touchmove', function(e){
            e.preventDefault();
            e.stopPropagation();
            _translateTouchEvent('mousemove', e);
        });
        this._canvas.addEventListener('touchcancel', function(e){
            e.preventDefault();
            e.stopPropagation();
            _translateTouchEvent('mouseout', e);
        });
    };

    function _translateTouchEvent(type, e){
		var mouseEventInit;
		if(e.touches.length){
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

    CanvasCompositor.prototype._handlePressDown = function(e){
        e.preventDefault();

        var style = window.getComputedStyle(this._canvas);
        var leftPadding = parseFloat(style.getPropertyValue('border-left')) +
            parseFloat(style.getPropertyValue('padding-left'));
        var topPadding = parseFloat(style.getPropertyValue('border-top')) +
            parseFloat(style.getPropertyValue('padding-top'));

        var x = e.offsetX - leftPadding;
        var y = e.offsetY - topPadding;

        var clickedObject = this.Scene.ChildAt(x, y);

        if(clickedObject && clickedObject.onpressdown) {
            clickedObject.onpressdown(e);
        }

        _.each(this._eventRegistry[_events.PRESS_DOWN], function(callback){
            callback(e);
        });
    };

    CanvasCompositor.prototype._handlePressUp = function(e){
        e.preventDefault();

        var style = window.getComputedStyle(this._canvas);
        var leftPadding = parseFloat(style.getPropertyValue('border-left')) +
            parseFloat(style.getPropertyValue('padding-left'));
        var topPadding = parseFloat(style.getPropertyValue('border-top')) +
            parseFloat(style.getPropertyValue('padding-top'));

        _.each(this.Scene.children, function(c){
            if(c.draggable && c.onpressup){
                c.onpressup(e);
            }
        });
        var x = e.offsetX - leftPadding;
        var y = e.offsetY - topPadding;

        var clickedObject = this.Scene.ChildAt(x, y);

        if(clickedObject && clickedObject.onpressup) {
            clickedObject.onpressup(e);
        }

        _.each(this._eventRegistry[_events.PRESS_UP], function(callback){
            callback(e);
        });
    };

    CanvasCompositor.prototype._handlePressMove = function(e){
        e.preventDefault();

        var objects = _.filter(this.Scene.children, function(c){
            // `!!` is a quick hack to convert to a bool
            return !!(c.onpressmove);
        });

        _.each(objects, function(o){
            o.onpressmove(e);
        });

        _.each(this._eventRegistry[_events.PRESS_MOVE], function(callback){
            callback(e);
        });
    };

    CanvasCompositor.prototype._handlePressCancel = function(e){
        e.preventDefault();

        var objects = _.filter(this.Scene.children, function(c){
            // `!!` is a quick hack to convert to a bool
            return !!(c.onpresscancel);
        });

        _.each(objects, function(o){
            o.onpresscancel(e);
        });

        _.each(this._eventRegistry[_events.PRESS_CANCEL], function(callback){
            callback(e);
        });
    };

    CanvasCompositor.prototype._animationLoop = function _animationLoop() {
        window.requestAnimationFrame(_.bind(this._animationLoop, this));
        this._currentTime = +new Date();
        //set maximum of 60 fps and only redraw if necessary
        if (this._currentTime - this._lastRenderTime >= this._updateThreshhold && this.Scene.NeedsUpdate()) {
            this._lastRenderTime = +new Date();
            CanvasObject.Renderer.clearRect(0, 0, this._canvas.width, this._canvas.height);
            this.Scene.draw();
        }
    };

    //expose primitive canvas functions at high level
    CanvasCompositor.prototype.drawPath = function _drawPath(vertices){
        CanvasObject.Renderer.drawPath(vertices);
    };

    //expose primitive canvas functions at high level
    CanvasCompositor.prototype.drawRectangle = function _drawRectangle(x, y, width, height){
        CanvasObject.Renderer.drawRectangle(x, y, width, height || width);
    };

    //expose primitive canvas functions at high level
    CanvasCompositor.prototype.drawEllipse = function _drawEllipse(x, y, radius, minorRadius){
        CanvasObject.Renderer.drawEllipse(x, y, radius, (minorRadius || radius));
    };

    //expose primitive canvas functions at high level
    CanvasCompositor.prototype.drawText = function _drawText(x, y, text){
        CanvasObject.Renderer.drawText(x, y, text);
    };

    //expose primitive canvas functions at high level
    CanvasCompositor.prototype.measureText = function _measureText(text){
        CanvasObject.Renderer.measureText(text);
    };

    //expose primitive canvas functions at high level
    CanvasCompositor.prototype.drawImage = function _drawImage(x, y, image){
        CanvasObject.Renderer.drawImage(x, y, image);
    };

    CanvasCompositor.prototype.draw = function _draw(canvasObject){
        if(canvasObject){
            canvasObject.draw();
            return;
        }
    };

    CanvasCompositor.prototype.setStyle = function _setStyle(style){
        CanvasObject.Renderer.setStyle(style);
    };

    CanvasCompositor.prototype.getStyle = function _getStyle(){
        return CanvasObject.Renderer.getStyle();
    };

    //get the context for direct drawing to the canvas
    CanvasCompositor.prototype.getContext = function _getContext(){
        return this._context;
    };

    CanvasCompositor.Path = Path;
    CanvasCompositor.Rectangle = Rectangle;
    CanvasCompositor.Ellipse = Ellipse;
    CanvasCompositor.Text = Text;
    CanvasCompositor.Image = Image;
    CanvasCompositor.Container = Container;

    CanvasCompositor.Events = _events;

    CanvasCompositor.prototype.Scene = null;

    return CanvasCompositor;
});

window.CanvasCompositor = require('canvas-compositor');