require(['lodash', 'canvas-object'], function (_, CanvasObject) {
	function Image(options) {
		CanvasObject.call(this, options);
		this.image = options.image;
	}

	_.assign(Image.prototype, CanvasObject.prototype);

	Image.prototype.draw = function _drawSelf() {
		var x = this.x + this.translation.x;
		var y = this.y + this.translation.y;
		CanvasObject.Renderer.drawImage(this.image, x, y, this.style);
	};

	return Image;
});