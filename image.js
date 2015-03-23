define(['lodash', 'canvas-object', 'renderer'], function (_, CanvasObject, Renderer) {
	'use strict';

	function Image(options) {
		CanvasObject.call(this, options);
		this.image = options.image;

		Object.defineProperty(this, 'boundingBox', {
			configurable: true,
			enumerable: true,
			get: function () {
				return {
					top: this.offset.y,
					left: this.offset.x,
					bottom: this.offset.y + (this.GlobalScale.scaleHeight * this.image.height),
					right: this.offset.x + (this.GlobalScale.scaleWidth * this.image.width)
				};
			}
		});
	}

	_.assign(Image.prototype, CanvasObject.prototype);

	Image.prototype.render = function _drawSelf() {
		Renderer.drawImage(this._prerenderingContext, 0, 0, this.image, this.style);
	};

	return Image;
});