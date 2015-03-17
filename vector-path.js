//would name the file 'path', but damn near everything
//relies on the filesystem 'path' module
define(['lodash', 'canvas-object', 'renderer', 'vector', 'line'], function (_, CanvasObject, Renderer, Vector, Line) {
	'use strict';

	function Path(options) {
		CanvasObject.call(this, options);
		this.vertices = _.map(options.vertices || [], function (v) {
			return new Vector([v.x, v.y]);
		});
		Object.defineProperty(this, 'boundingBox', {
			configurable: true,
			enumerable: true,
			get: function () {
				var top = null,
				left = null,
				bottom = null,
				right = null;

				for(var v in this.vertices){
					top = top !== null && top < this.vertices[v].y? top : this.vertices[v].y;
					left = left !== null && left < this.vertices[v].x ? left : this.vertices[v].x;
					bottom = bottom !== null && bottom > this.vertices[v].y ? bottom : this.vertices[v].y;
					right = right !== null && right > this.vertices[v].x ? right : this.vertices[v].x;
				}

				return {
					top: top + this.offset.y - this.style.lineWidth/2.0,
					left: left + this.offset.x - this.style.lineWidth/2.0,
					bottom: bottom + this.offset.y + this.style.lineWidth/2.0,
					right: right + this.offset.x + this.style.lineWidth/2.0
				};
			}
		});
	}

	_.assign(Path.prototype, CanvasObject.prototype);


	Path.prototype.render = function _render() {
		var boundingBox = this.boundingBox;
		var offset = this.offset;
		//normalize the vertices (left- and top-most x/y-values should be 0 and 0)
		var normalizedVertices = _.map(this.vertices, function (vertex) {
			return vertex.subtract(new Vector([boundingBox.left, boundingBox.top])).add(offset);
		});
		Renderer.drawPath(this._prerenderingContext, normalizedVertices, this.style);
	};

	Path.prototype.PointIsInObject = function (x, y) {
		//create a line that travels from this point in any direction
		//if it intersects the polygon an odd number of times, it is inside

		var inside = false;
		//a line can be described as a vertex and a direction
		var l = new Line(new Vector([x, y]), new Vector([1, 0]));

		for (var i = 0; i < this.vertices.length; i++) {
			var j = (i + 1) >= this.vertices.length ? 0 : i + 1;

			var v = this.vertices[i].add(this.offset);
			var w = this.vertices[j].add(this.offset);

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
		return inside;
	};

	return Path;
});