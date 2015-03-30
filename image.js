define(['lodash', 'canvas-object', 'renderer'], function (_, CanvasObject, Renderer) {
	'use strict';

	function Image(options) {
		CanvasObject.call(this, options);
		this.unscaledImage = options.image;

		Object.defineProperty(this, 'boundingBox', {
			configurable: true,
			enumerable: true,
			get: function () {
				return {
					top: this.offset.y,
					left: this.offset.x,
					bottom: this.offset.y + (this.GlobalScale.scaleHeight * this.unscaledImage.height),
					right: this.offset.x + (this.GlobalScale.scaleWidth * this.unscaledImage.width)
				};
			}
		});
	}

	_.assign(Image.prototype, CanvasObject.prototype);

	Image.prototype.render = function _drawSelf() {
		var image = new window.Image();
		image.src = this.unscaledImage.src;
		image.width = this.unscaledImage.width * this.GlobalScale.scaleWidth;
		image.height = this.unscaledImage.height * this.GlobalScale.scaleHeight;
		Renderer.drawImage(this._prerenderingContext, 0, 0, image, this.style);
	};

	return Image;
});