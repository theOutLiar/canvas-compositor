//would name the file 'path', but damn near everything
//relies on the filesystem 'path' module
define(['lodash', 'style'], function (_, Style) {
    'use strict';

    function Path(vertices, context, style) {
        this.vertices = vertices || [];
        this.context = context;
        this.style = style;
    }

    Path.prototype.draw = function _drawSelf() {
        Path.Draw(this.context, this.vertices, this.style);
    };

    Path.Draw = function _draw(vertices, context, style) {
        _.assign(context, style || Style.CurrentStyle);
        var started = false;
        var x = 0;
        var y = 0;
        for (var v in vertices) {
            x = vertices[v].x;
            y = vertices[v].y;
            if (!started) {
                context.beginPath();
                context.moveTo(x, y);
                started = true;
            } else {
                context.lineTo(x, y);
            }
        }

        context.stroke();
    };

    return Path;
});