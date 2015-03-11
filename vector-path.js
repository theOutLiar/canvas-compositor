//would name the file 'path', but damn near everything
//relies on the filesystem 'path' module
define(['lodash', 'canvas-object'], function (_, CanvasObject) {
    'use strict';

    function Path(options) {
        options.x = options.x || options.vertices[0].x;
        options.y = options.y || options.vertices[0].y;
        CanvasObject.call(this, options);
        this.vertices = options.vertices || [];
    }

    _.assign(Path.prototype, CanvasObject.prototype);

    Path.prototype.render = function _render() {
        var mappedVertices = this.vertices;
        if (this.translation.x !== 0 && this.transation.y !== 0) {
            mappedVertices = _.map(this.vertices, function (vertex) {
                return {
                    x: vertex.x + this.translation.x,
                    y: vertex.y + this.translation.y
                };
            });
        }
        CanvasObject.Renderer.drawPath(mappedVertices, this.style);
    };

    return Path;
});