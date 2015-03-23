define(['lodash', 'canvas-object', 'renderer'], function (_, CanvasObject, Renderer) {
	'use strict';

	function Circle(options) {
		CanvasObject.call(this, options);
		this.radius = options.radius || 0;
		Object.defineProperty(this, 'boundingBox', {
			configurable: true,
			enumerable: true,
			get: function () {
				return {
					top: this.offset.y -
						 ((this.radius * this.GlobalScale.scaleHeight) +
					 	 (this.unscaledLineWidth/2.0 * this.GlobalLineScale)),
					left: this.offset.x -
						  ((this.radius * this.GlobalScale.scaleWidth) +
						  (this.unscaledLineWidth/2.0 * this.GlobalLineScale)),
					bottom: this.offset.y +
						    (this.radius * this.GlobalScale.scaleHeight) +
						    (this.unscaledLineWidth/2.0 * this.GlobalLineScale),
					right: this.offset.x +
						   (this.radius * this.GlobalScale.scaleWidth) +
						   (this.unscaledLineWidth/2.0 * this.GlobalLineScale)
				};
			}
		});
	}

	_.assign(Circle.prototype, CanvasObject.prototype);

	Circle.prototype.render = function _render() {
		Renderer.drawCircle(
			this._prerenderingContext,
			(this.radius * this.GlobalScale.scaleWidth) + (this.unscaledLineWidth/2.0 * this.GlobalLineScale),
			(this.radius * this.GlobalScale.scaleHeight) + (this.unscaledLineWidth/2.0 * this.GlobalLineScale),
			(this.radius * this.GlobalScale.scaleWidth),
			this.style
		);
	};

	Circle.prototype.PointIsInObject = function (x, y) {
		//see: http://math.stackexchange.com/questions/76457/check-if-a-point-is-within-an-ellipse
		return (
			CanvasObject.prototype.PointIsInObject.call(this, x, y) &&
			Math.pow((x - this.offset.x), 2) / Math.pow((this.radius * this.GlobalScale.scaleWidth), 2) + Math.pow((y - this.offset.y), 2) / Math.pow((this.radius * this.GlobalScale.scaleHeight), 2) <= 1
		);
	};

	return Circle;
});