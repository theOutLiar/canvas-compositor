define(['lodash', 'canvas-object', 'style'], function(_, CanvasObject, Style){
    'use strict';
    function Rectangle(x, y, width, height, context, style){
        CanvasObject.call(this x, y, context, style);
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.context = context;
        this.style = style;
    }

    _.assign(Rectangle.prototype, CanvasObject.prototype);

    Rectangle.prototype.draw = function _drawSelf(){
        Rectangle.draw(this.x, this.y, this.width, this.height, this.context, this.style);
    };

    Rectangle.Draw = function _draw(x, y, width, height, context, style){
        _.assign(context, style || Style.CurrentStyle);
        context.rect(x, y, width, height);
        context.fill();
        context.stroke();
    };

    return Rectangle;
});