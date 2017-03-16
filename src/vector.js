define(['lodash'], function (_) {
	function _zipMapReduce(arrays, reduceFunction) {
		var merged = _.zip.apply(null, arrays);
		return _.map(merged, function (o) {
			return _.reduce(o, reduceFunction);
		});
	}

	function _normalize(coordinates) {
		//unitRatio is the ratio by which you must multiply
		//coordinates to get a unit vector
		//
		//using apply as a little hack to get Math.max to work on arrays
		//see: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/max
		var unitRatio = 1.0 / Math.max.apply(null, _.map(coordinates, function (c) {
			return Math.abs(c);
		}));
		return _.map(coordinates, function (c) {
			return c * unitRatio;
		});
	}

	function Vector(v) {
		this.coordinates = v;
	}

	Object.defineProperty(Vector.prototype, 'unitVector', {
		configurable: true,
		enumerable: true,
		get: function () {
			return new Vector(_normalize(this.coordinates));
		}
	});

	Object.defineProperty(Vector.prototype, 'x', {
		configurable: true,
		enumerable: true,
		get: function () {
			return this.coordinates[0];
		},
		set: function (val) {
			this.coordinates[0] = val;
		}
	});

	Object.defineProperty(Vector.prototype, 'y', {
		configurable: true,
		enumerable: true,
		get: function () {
			return this.coordinates[1];
		},
		set: function (val) {
			this.coordinates[1] = val;
		}
	});

	Object.defineProperty(Vector.prototype, 'z', {
		configurable: true,
		enumerable: true,
		get: function () {
			return this.coordinates[2];
		},
		set: function (val) {
			this.coordinates[2] = val;
		}
	});

	Vector.prototype.add = function _addSelf(v) {
		return Vector.add(this, v);
	};

	Vector.prototype.subtract = function _addSelf(v) {
		return Vector.subtract(this, v);
	};

	Vector.prototype.multiply = function _addSelf(v) {
		return Vector.multiply(this, v);
	};

	Vector.add = function _add(v, w) {
		return new Vector(_zipMapReduce([v.coordinates, w.coordinates], function (a, b) {
			return a + b;
		}));
	};

	Vector.subtract = function _add(v, w) {
		return new Vector(_zipMapReduce([v.coordinates, w.coordinates], function (a, b) {
			return a - b;
		}));
	};

	Vector.multiply = function _add(v, w) {
		if (isNaN(w)) {
			return new Vector(_zipMapReduce([v.coordinates, w.coordinates], function (a, b) {
				return a * b;
			}));
		} else {
			return new Vector(_.map(v.coordinates, function (c) {
				return c * w;
			}));
		}
		return null;
	};

	Vector.prototype.coordinates = [];
	return Vector;
});