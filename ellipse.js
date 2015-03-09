define(['lodash', 'canvas-object', 'style'], function(_, CanvasObject, Style){
    'use strict';
    function Ellipse(x, y, width, height, context, style){
        CanvasObject.call(this, x, y, context, style);
        this.width = width;
        this.height = height;
    }

    _.assign(Ellipse.prototype, CanvasObject.prototype);

    Ellipse.prototype.draw = function _drawSelf(){
        Ellipse.draw(this.x, this.y, this.width, this.height, this.context, this.style);
    };

    Ellipse.Draw = function _draw(x, y, width, height, context, style){
        _.assign(context, style || Style.CurrentStyle);
        context.ellipse(x, y, width, height);
        context.fill();
        context.stroke();
    };
    return Ellipse;
});