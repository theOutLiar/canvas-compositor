define(['lodash', 'canvas-object', 'renderer'], function (_, CanvasObject, Renderer) {
	'use strict';

	function Rectangle(options) {
		CanvasObject.call(this, options);
		this.width = options.width || 0;
		this.height = options.height || 0;

		Object.defineProperty(this, 'boundingBox', {
			configurable: true,
			enumerable: true,
			get: function () {
				return {
					top: this.offset.y - (this.GlobalLineScale * this.unscaledLineWidth/2.0),
					left: this.offset.x - (this.GlobalLineScale * this.unscaledLineWidth/2.0),
					bottom: this.offset.y + (this.GlobalScale.scaleHeight * this.height) + (this.GlobalLineScale * this.unscaledLineWidth/2.0),
					right: this.offset.x + (this.GlobalScale.scaleWidth * this.width) + (this.GlobalLineScale * this.unscaledLineWidth/2.0)
				};
			}
		});
	}

	_.assign(Rectangle.prototype, CanvasObject.prototype);

	Rectangle.prototype.render = function _render() {
		Renderer.drawRectangle(this._prerenderingContext,
							   (this.GlobalLineScale * this.unscaledLineWidth/2.0),
							   (this.GlobalLineScale * this.unscaledLineWidth/2.0),
							   this.width * this.GlobalScale.scaleWidth,
							   this.height * this.GlobalScale.scaleHeight,
							   this.style);
	};

	return Rectangle;
});