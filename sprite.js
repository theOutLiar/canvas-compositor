require(['lodash', 'canvas-object', 'style'], function (_, CanvasObject, Style) {
    function Sprite(x, y, image, context, style) {
        CanvasObject.call(this, x, y, context, style);
        this.image = image;
    }
    _.assign(Sprite.prototype, CanvasObject.prototype);

    Sprite.prototype.draw = function _drawSelf() {};

    Sprite.Draw = function _draw(x, y, image, context, style) {
        _.assign(context, style || Style.CurrentStyle);
        context.drawImage(image, x, y);
    };

    return Sprite;
});