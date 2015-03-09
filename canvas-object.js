define(['style'], function(Style){
    function CanvasObject(x, y, context, style){
        this.x = x;
        this.y = y;
        this.context = context;
        this.style = style;
    }

    CanvasObject.prototype.x = 0;
    CanvasObject.prototype.y = 0;
    CanvasObject.prototype.context = null;
    CanvasObject.prototype.style = Style.DEFAULTS;
    CanvasObject.prototype.scale = 1;
    CanvasObject.translation = {x: 0, y: 0}; //how much it's been translated
    CanvasObject.prototype.draw = function(){}; //should be overridden by implementors

    //CanvasObject.

    return CanvasObject;
});