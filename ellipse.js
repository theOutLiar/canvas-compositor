define(['lodash', 'canvas-object', 'renderer'], function (_, CanvasObject, Renderer) {
	'use strict';

	function Ellipse(options) {
		CanvasObject.call(this, options);
		this.radius = options.radius || 0;
		this.minorRadius = options.minorRadius || this.radius || 0;
		this.updateBoundingRectangle();
	}

	Ellipse.prototype.updateBoundingRectangle = function _updateBoundingRectangle(){
		this.boundingRectangle = {
			top: this.y + this.translation.y - this.minorRadius,
			left: this.x + this.translation.x - this.radius,
			bottom: this.y + this.translation.y + this.minorRadius,
			right: this.x + this.translation.x + this.radius
		};
	};

	_.assign(Ellipse.prototype, CanvasObject.prototype);

	Ellipse.prototype.render = function _render() {
		Renderer.drawEllipse(this._prerenderingContext, this.radius, this.minorRadius, this.radius, this.minorRadius, this.style);
	};

	Ellipse.prototype.PointIsInObject = function (x, y) {
		//see: http://math.stackexchange.com/questions/76457/check-if-a-point-is-within-an-ellipse
		return Math.pow((x - (this.x + this.translation.x)), 2) / Math.pow(this.radius, 2) + Math.pow((y - (this.y + this.translation.y)), 2) / Math.pow(this.minorRadius, 2) <= 1;
	};

	return Ellipse;
});