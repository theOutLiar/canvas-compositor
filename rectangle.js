define(['lodash', 'style'], function(_, Style){
    'use strict';
    function Rectangle(x, y, width, height, context, style){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.context = context;
        this.style = style;
    }

    Rectangle.prototype.draw = function _drawSelf(){
        Rectangle.draw(this.x, this.y, this.width, this.height, this.context, this.style);
    };

    Rectangle.Draw = function _draw(x, y, width, height, context, style){
        _.assign(context, style || Style.CurrentStyle);
        context.fillRect(x, y, width, height);
        context.strokeRect(x, y, width, height);
    };
    return Rectangle;
});