define(['lodash', 'canvas-object', 'renderer'], function (_, CanvasObject, Renderer) {
	'use strict';

	function Ellipse(options) {
		CanvasObject.call(this, options);
		this.radius = options.radius || 0;
		this.minorRadius = options.minorRadius || this.radius || 0;
		Object.defineProperty(this, 'boundingBox', {
			configurable: true,
			enumerable: true,
			get: function () {
				return {
					top: this.offset.y - (this.minorRadius + this.style.lineWidth/2.0),
					left: this.offset.x - (this.radius + this.style.lineWidth/2.0),
					bottom: this.offset.y + this.minorRadius + this.style.lineWidth/2.0,
					right: this.offset.x + this.radius + this.style.lineWidth/2.0
				};
			}
		});
	}

	_.assign(Ellipse.prototype, CanvasObject.prototype);

	Ellipse.prototype.render = function _render() {
		Renderer.drawEllipse(this._prerenderingContext, this.radius + this.style.lineWidth/2.0, this.minorRadius + this.style.lineWidth/2.0, this.radius, this.minorRadius, this.style);
	};

	Ellipse.prototype.PointIsInObject = function (x, y) {
		//see: http://math.stackexchange.com/questions/76457/check-if-a-point-is-within-an-ellipse
		return Math.pow((x - this.offset.x), 2) / Math.pow(this.radius, 2) + Math.pow((y - this.offset.y), 2) / Math.pow(this.minorRadius, 2) <= 1;
	};

	return Ellipse;
});