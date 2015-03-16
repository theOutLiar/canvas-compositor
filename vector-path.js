//would name the file 'path', but damn near everything
//relies on the filesystem 'path' module
define(['lodash', 'canvas-object', 'vector', 'line'], function (_, CanvasObject, Vector, Line) {
	'use strict';

	function Path(options) {
		options.x = options.x || options.vertices[0].x;
		options.y = options.y || options.vertices[0].y;
		CanvasObject.call(this, options);
		this.vertices = _.map(options.vertices || [], function (v) {
			return new Vector([v.x, v.y]);
		});
	}

	_.assign(Path.prototype, CanvasObject.prototype);

	Path.prototype.render = function _render() {
		var translatedVertices = this.vertices;
		if (this.translation.x !== 0 && this.translation.y !== 0) {
			var translatedX = this.translation.x;
			var translatedY = this.translation.y;
			translatedVertices = _.map(this.vertices, function (vertex) {
				return new Vector([vertex.x, vertex.y]).add(new Vector([translatedX, translatedY]));
			});
		}
		return CanvasObject.Renderer.drawPath(translatedVertices, this.style);
	};

	Path.prototype.PointIsInObject = function (x, y) {
		//create a line that travels from this point in any direction
		//if it intersects the polygon an odd number of times, it is inside

		var inside = false;
		//a line can be described as a vertex and a direction
		var l = new Line(new Vector([x, y]), new Vector([1, 0]));

		for (var i = 0; i < this.vertices.length; i++) {
			var j = (i + 1) >= this.vertices.length ? 0 : i + 1;

			var v = this.vertices[i].add(this.translation);
			var w = this.vertices[j].add(this.translation);

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