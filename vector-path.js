//would name the file 'path', but damn near everything
//relies on the filesystem 'path' module
define(['lodash', 'canvas-object', 'renderer', 'vector', 'line'], function (_, CanvasObject, Renderer, Vector, Line) {
	'use strict';

	function Path(options) {
		CanvasObject.call(this, options);
		this.unscaledLineWidth = this.style.lineWidth;
		this.vertices = _.map(options.vertices || [], function (v) {
			return new Vector([v.x, v.y]);
		});
		var yCoordinates = _.map(this.vertices, function(v) { return v.y; });
		var xCoordinates = _.map(this.vertices, function(v) { return v.x; });

		this._left = Math.min.apply(null, xCoordinates);
		this._top = Math.min.apply(null, yCoordinates);
		this._right = Math.max.apply(null, xCoordinates);
		this._bottom = Math.max.apply(null, yCoordinates);

		this.d = new Vector([this._left,this._top]);
		var normalizationVector = this.d;
		this._normalizedVertices = _.map(this.vertices, function(v){
			return v.subtract(normalizationVector);
		});

		this._normalizedBoundingBox = null;

		Object.defineProperty(this, 'boundingBox', {
			configurable: true,
			enumerable: true,
			get: function () {
				var top = 0,
				left = 0,
				bottom = this._bottom - this._top,
				right = this._right - this._left;

				this._normalizedBoundingBox = {
					top: top,
					left: left,
					right: right,
					bottom: bottom
					};

				return {
					top: (this._normalizedBoundingBox.top * this.GlobalScale.scaleHeight) + this.offset.y - (this.GlobalLineScale * this.unscaledLineWidth),
					left: (this._normalizedBoundingBox.left * this.GlobalScale.scaleWidth) + this.offset.x - (this.GlobalLineScale * this.unscaledLineWidth),
					bottom: (this._normalizedBoundingBox.bottom * this.GlobalScale.scaleHeight) + this.offset.y + (this.GlobalLineScale * this.unscaledLineWidth),
					right: (this._normalizedBoundingBox.right * this.GlobalScale.scaleWidth) + this.offset.x + (this.GlobalLineScale * this.unscaledLineWidth)
				};
			}
		});
	}

	_.assign(Path.prototype, CanvasObject.prototype);


	Path.prototype.render = function _render() {
		var boundingBox = this.boundingBox;
		var offset = this.offset;
		var scale = this.GlobalScale;
		//normalize the vertices (left- and top-most x/y-values should be 0 and 0)
		var pathToDraw = _.map(this._normalizedVertices, function (vertex) {
			return vertex
					.multiply(new Vector([scale.scaleWidth, scale.scaleHeight]))
					.subtract(new Vector([boundingBox.left, boundingBox.top]))
					.add(offset);
		});
		Renderer.drawPath(this._prerenderingContext, pathToDraw, this.style);
	};

	Path.prototype.PointIsInObject = function (x, y) {
		var inside = false;
		//cut out all this processing if it isn't even in the bounding box
		if (CanvasObject.prototype.PointIsInObject.call(this, x, y)){
			//create a line that travels from this point in any direction
			//if it intersects the polygon an odd number of times, it is inside

			//a line can be described as a vertex and a direction
			var l = new Line(new Vector([x, y]), new Vector([1, 0]));

			for (var i = 0; i < this._normalizedVertices.length; i++) {
				var j = (i + 1) >= this._normalizedVertices.length ? 0 : i + 1;

				var v = this._normalizedVertices[i]
							.multiply(new Vector([this.GlobalScale.scaleWidth, this.GlobalScale.scaleHeight]))
							.add(this.offset);

				var w = this._normalizedVertices[j]
							.multiply(new Vector([this.GlobalScale.scaleWidth, this.GlobalScale.scaleHeight]))
							.add(this.offset);

				var edgeDirection = w.subtract(v).unitVector;
				var edge = new Line(v, edgeDirection);
				var intersection = edge.intersectionWith(l);

				if (intersection === null) {
					continue;
				}

				//should replace 0s with epsilons, where epsilon is
				//the threshhold for considering two things as touching/intersecting
				var intersectToTheRight = intersection.x - x >= 0;
				if (!intersectToTheRight) {
					continue;
				}

				var negativeX = (edgeDirection.x < 0);
				var negativeY = (edgeDirection.y < 0);

				//technically speaking, bottom and top should be reversed,
				//since y=0 is the top left corner of the screen - it's
				//just easier to think about it mathematically this way
				var leftVertex = negativeX ? w : v;
				var rightVertex = negativeX ? v : w;
				var topVertex = negativeY ? w : v;
				var bottomVertex = negativeY ? v : w;

				var intersectWithinSegment =
					(intersection.x - leftVertex.x >= 0) &&
					(rightVertex.x - intersection.x >= 0) &&
					(intersection.y - topVertex.y >= 0) &&
					(bottomVertex.y - intersection.y >= 0);

				if (intersectWithinSegment) {
					inside = !inside;
				}
			}
		}
		return inside;
	};

	return Path;
});