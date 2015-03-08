define(['lodash', 'canvas-model', 'style', 'vector-path', 'rectangle'], function (_, CanvasModel, Style, Path, Rectangle) {
    'use strict';

    var _modelDefaults = {
        CanvasObjects: [],
        CurrentObject: null,
        NeedsUpdate: false
    };

    function CanvasCompositor(canvas, options) {
        this._canvas = canvas;
        this._context = this._canvas.getContext('2d');
        this._canvasModel = new CanvasModel();
        this._style = new Style(options);

        //hrm, should maybe find method to filter
        //out options that should be private
        _.assign(this, _modelDefaults);
        _.assign(this._context, Style.CurrentStyle);

        this._updateThreshhold = 1000 / 60; //amount of time that must pass before rendering
        this._lastRenderTime = 0; //set to 0 to make sure first render happens right away
        this._currentTime = 0;

        this._animationLoop();
    }

    CanvasCompositor.prototype._animationLoop = function _animationLoop() {
        window.requestAnimationFrame(this._animationLoop);
        this._currentTime = +new Date();
        //set maximum of 60 fps and only redraw if necessary
        if (this._currentTime - this._lastRenderTime >= this._updateThreshhold && this._canvasModel.NeedsUpdate) {

            //TODO: clear canvas

            _.each(this.CanvasObjects, function(cObj){
                cObj.draw(this._canvas);
            });

            if (this._canvasModel.CurrentObject) {
                this._canvasModel.CurrentObject.Draw(this._canvas);
            }
            this._lastRenderTime = +new Date();
        }
    };

    CanvasCompositor.prototype.drawPath = function _drawPath(vertices, style){
        Path.Draw(vertices, this._context, style);
    };

    //TODO: drawEllipse

    CanvasCompositor.prototype.drawRectangle = function _drawRectangle(x, y, width, height, style){
        Rectangle.draw(x, y, width, height, this._context, style);
    };

    CanvasCompositor.prototype.draw = function _draw(canvasObject){
        if(canvasObject){
            canvasObject.draw();
            return;
        }
    };

    return CanvasCompositor;
});
