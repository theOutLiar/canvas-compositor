define(['lodash', 'canvas-object', 'renderer'], function (_, CanvasObject, Renderer) {
	'use strict';

	function Rectangle(options) {
		CanvasObject.call(this, options);
		this.width = options.width || 0;
		this.height = options.height || 0;
		this.updateBoundingRectangle();
	}

	_.assign(Rectangle.prototype, CanvasObject.prototype);

	Rectangle.prototype.updateBoundingRectangle = function _updateBoundingRectangle(){
		this.boundingRectangle = {
			top: this.y + this.translation.y - this.style.lineWidth/2.0,
			left: this.x + this.translation.x - this.style.lineWidth/2.0,
			bottom: this.y + this.translation.y + this.height + this.style.lineWidth,
			right: this.x + this.translation.x + this.width + this.style.lineWidth
		};
	};

	Rectangle.prototype.render = function _render() {
		Renderer.drawRectangle(this._prerenderingContext, this.style.lineWidth/2.0, this.style.lineWidth/2.0, this.width, this.height, this.style);
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