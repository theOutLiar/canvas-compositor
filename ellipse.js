define(['lodash', 'canvas-object'], function(_, CanvasObject){
    'use strict';
    function Ellipse(options){
        CanvasObject.call(this, options);
        this.width = options.width || 0;
        this.height = options.height || 0;
    }

    _.assign(Ellipse.prototype, CanvasObject.prototype);

    Ellipse.prototype.render = function _render(){
        var x = this.x + this.translation.x;
        var y = this.y + this.translation.y;
        CanvasObject.Renderer.drawEllipse(x, y, this.width, this.height, this.style);
    };

    return Ellipse;
});