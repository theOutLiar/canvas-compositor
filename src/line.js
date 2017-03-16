define(['vector'], function (Vector) {

	function Line(p1, direction) {
		this.p1 = p1;
		this.direction = direction;
		this.p2 = new Vector([this.p1.x, this.p1.y]).add(this.direction);
	}

	Line.prototype.p1 = null;
	Line.prototype.p2 = null;
	Line.prototype.direction = null;

	Line.prototype.intersectionWith = function _intersectionWith(l) {
		return Line.intersection(this, l);
	};

	Line.intersection = function _intersection(l1, l2) {
		var x1 = l1.p1.x,
			x2 = l1.p2.x,
			x3 = l2.p1.x,
			x4 = l2.p2.x;
		var y1 = l1.p1.y,
			y2 = l1.p2.y,
			y3 = l2.p1.y,
			y4 = l2.p2.y;
		var denominator = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
		if (denominator === 0) {
			return null;
		}

		var xNumerator = (x1 * y2 - y1 * x2) * (x3 - x4) - (x1 - x2) * (x3 * y4 - y3 * x4);
		var yNumerator = (x1 * y2 - y1 * x2) * (y3 - y4) - (y1 - y2) * (x3 * y4 - y3 * x4);
		return new Vector([xNumerator / denominator, yNumerator / denominator]);
	};

	return Line;
});