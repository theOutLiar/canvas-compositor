define(['lodash', 'canvas-object'], function (_, CanvasObject) {
    'use strict';

    function Ellipse(options) {
        CanvasObject.call(this, options);
        this.radius = options.radius || 0;
        this.minorRadius = options.minorRadius || this.radius || 0;
    }

    _.assign(Ellipse.prototype, CanvasObject.prototype);

    Ellipse.prototype.render = function _render() {
        var x = this.x + this.translation.x;
        var y = this.y + this.translation.y;
        CanvasObject.Renderer.drawEllipse(x, y, this.radius, this.minorRadius, this.style);
    };

    Ellipse.prototype.PointIsInObject = function (x, y) {
        //see: http://math.stackexchange.com/questions/76457/check-if-a-point-is-within-an-ellipse
        return Math.pow((x - (this.x + this.translation.x)), 2) / Math.pow(this.radius, 2) + Math.pow((y - (this.y + this.translation.y)), 2) / Math.pow(this.minorRadius, 2) <= 1;
    };

    return Ellipse;
});