define(['lodash', 'canvas-object', 'renderer'], function (_, CanvasObject, Renderer) {
	'use strict';

	function Rectangle(options) {
		CanvasObject.call(this, options);
		this.width = options.width || 0;
		this.height = options.height || 0;
		this.boundingRectangle = {
			top: this.y + this.translation.y,
			left: this.x + this.translation.x,
			bottom: this.y + this.translation.y + this.height,
			right: this.x  + this.translation.x + this.width
		};
	}

	_.assign(Rectangle.prototype, CanvasObject.prototype);

	Rectangle.prototype.render = function _render() {
		Renderer.drawRectangle(this._prerenderingContext, 0, 0, this.width, this.height, this.style);
	};

	Rectangle.prototype.PointIsInObject = function (x, y) {
		var lowerBoundX = this.x + this.translation.x,
			lowerBoundY = this.y + this.translation.y,
			upperBoundX = this.x + this.translation.x + this.width,
			upperBoundY = this.y + this.translation.y + this.height;

		return (
			x > lowerBoundX &&
			y > lowerBoundY &&
			x < upperBoundX &&
			y < upperBoundY
		);
	};

	return Rectangle;
});