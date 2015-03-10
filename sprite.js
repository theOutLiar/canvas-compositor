require(['lodash', 'canvas-object', 'style'], function (_, CanvasObject, Style) {
    function Sprite(options) {
        CanvasObject.call(this, options);
        this.image = options.image;
    }
    _.assign(Sprite.prototype, CanvasObject.prototype);

    Sprite.prototype.render = function _render() {
        CanvasObject.Renderer.drawSprite(this.image, this.x, this.y, this.style);
    };

    return Sprite;
});