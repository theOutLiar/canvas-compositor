require(['lodash', 'canvas-object', 'style'], function (_, CanvasObject, Style) {
    function Image(x, y, image, context, style) {
        CanvasObject.call(this, x, y, context, style);
        this.image = image;
    }
    _.assign(Image.prototype, CanvasObject.prototype);

    Image.prototype.draw = function _drawSelf() {};

    Image.Draw = function _draw(x, y, image, context, style) {
        _.assign(context, style || Style.CurrentStyle);
        context.drawImage(image, x, y);
    };

    return Image;
});