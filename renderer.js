define(['lodash', 'style'], function(_, Style){
    function Renderer(context){
        this._context = context;
    }

    Renderer.prototype.clearRect = function _clearRect(x, y, width, height){
        this._context.clearRect(x, y, width, height);
    };

    Renderer.prototype.drawPath = function _draw(vertices, style) {
        _.assign(this._context, style || Style.CurrentStyle);
        this._context.beginPath();
        var started = false;
        var x = 0;
        var y = 0;
        for (var v in vertices) {
            x = vertices[v].x;
            y = vertices[v].y;
            if (!started) {
                this._context.moveTo(x, y);
                started = true;
            } else {
                this._context.lineTo(x, y);
            }
        }
        this._context.stroke();
        this._context.closePath();
    };

    Renderer.prototype.drawRectangle = function _draw(x, y, width, height, style){
        _.assign(this._context, style || Style.CurrentStyle);
        this._context.beginPath();
        this._context.rect(x, y, width, height);
        this._context.fill();
        this._context.stroke();
        this._context.closePath();
    };

    Renderer.prototype.drawEllipse = function _draw(x, y, radius, minorRadius, style){
        _.assign(this._context, style || Style.CurrentStyle);
        this._context.beginPath();
        this._context.ellipse(x, y, radius, minorRadius, 0, 0, 2 * Math.PI);
        this._context.fill();
        this._context.stroke();
        this._context.closePath();
    };

    Renderer.prototype.drawText = function _draw(x, y, text, style){
        _.assign(this._context, style || Style.CurrentStyle);
        this._context.beginPath();
        this._context.fillText(text, x, y);
        this._context.strokeText(text, x, y);
        this._context.closePath();
    };

    Renderer.prototype.measureText = function _measureText(text, style){
        _.assign(this._context, style || Style.CurrentStyle);
        return this._context.measureText(text);
    };

    Renderer.prototype.drawImage = function _draw(x, y, image, style) {
        _.assign(this.context, style || Style.CurrentStyle);
        this._context.drawImage(image, x, y);
    };

    return Renderer;
});