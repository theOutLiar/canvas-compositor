define(['lodash'], function(_){
    function Renderer(context, options){
        this._context = context;
        this.style = {};
        this.setStyle(_.assign({}, Renderer.DEFAULTS, options));
    }

    Renderer.DEFAULTS = {
        //direction: 'inherit',
        fillStyle: 'black',
        //filter: 'none',
        strokeStyle: 'black',
        lineCap: 'round',
        lineWidth: 1.0,
        lineJoin: 'round',
        miterLimit: 10,
        font: '10px sans-serif',
        textAlign: 'start',
        textBaseline: 'alphabetic'
    };

    Renderer.prototype.clearRect = function _clearRect(x, y, width, height){
        this._context.clearRect(x, y, width, height);
    };

    Renderer.prototype.drawPath = function _draw(vertices, style) {
        this.setStyle(style);
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
        this.setStyle(style);
        this._context.beginPath();
        this._context.rect(x, y, width, height);
        this._context.fill();
        this._context.stroke();
        this._context.closePath();
    };

    Renderer.prototype.drawEllipse = function _draw(x, y, radius, minorRadius, style){
        this.setStyle(style);
        this._context.beginPath();
        this._context.ellipse(x, y, radius, minorRadius, 0, 0, 2 * Math.PI);
        this._context.fill();
        this._context.stroke();
        this._context.closePath();
    };

    Renderer.prototype.drawText = function _draw(x, y, text, style){
        this.setStyle(style);
        this._context.beginPath();
        this._context.fillText(text, x, y);
        //TODO: does it make sense to `strokeText`
        //at all?! wtf are the implications of
        //lineWidth to the text measurements?
        //this._context.strokeText(text, x, y);
        this._context.closePath();
    };

    Renderer.prototype.measureText = function _measureText(text, style){
        this.setStyle(style);
        return this._context.measureText(text);
    };

    Renderer.prototype.drawImage = function _draw(x, y, image, style) {
        this.setStyle(style);
        this._context.drawImage(image, x, y);
    };

    Renderer.prototype.setStyle = function _setStyle(style){
        _.assign(this.style, style || {});
        _.assign(this._context, this.style);
    };

    Renderer.prototype.getStyle = function _getStyle(){
        return this.style;
    };

    return Renderer;
});