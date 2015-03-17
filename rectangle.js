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
					top: this.offset.y - this.style.lineWidth/2.0,
					left: this.offset.x - this.style.lineWidth/2.0,
					bottom: this.offset.y + this.height + this.style.lineWidth/2.0,
					right: this.offset.x + this.width + this.style.lineWidth/2.0
				};
			}
		});
	}

	_.assign(Rectangle.prototype, CanvasObject.prototype);

	Rectangle.prototype.render = function _render() {
		Renderer.drawRectangle(this._prerenderingContext, this.style.lineWidth/2.0, this.style.lineWidth/2.0, this.width, this.height, this.style);
	};

	Rectangle.prototype.PointIsInObject = function (x, y) {
		var lowerBoundX = this.offset.x - this.style.lineWidth/2.0,
			lowerBoundY = this.offset.y - this.style.lineWidth/2.0,
			upperBoundX = this.offset.x + this.width + this.style.lineWidth/2.0,
			upperBoundY = this.offset.y + this.height + this.style.lineWidth/2.0;

		return (
			x > lowerBoundX &&
			y > lowerBoundY &&
			x < upperBoundX &&
			y < upperBoundY
		);
	};

	return Rectangle;
});