define(['lodash', 'canvas-object'], function (_, CanvasObject) {
	'use strict';

	function Rectangle(options) {
		CanvasObject.call(this, options);
		this.width = options.width || 0;
		this.height = options.height || 0;
	}

	_.assign(Rectangle.prototype, CanvasObject.prototype);

	Rectangle.prototype.render = function _render() {
		var x = this.x + this.translation.x;
		var y = this.y + this.translation.y;
		CanvasObject.Renderer.drawRectangle(x, y, this.width, this.height, this.style);
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