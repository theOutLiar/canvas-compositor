define(['lodash', 'style'], function(_, Style){
    'use strict';
    function Ellipse(x, y, width, height, context, style){
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.context = context;
        this.style = style;
    }

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