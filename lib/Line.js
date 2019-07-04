"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Line = void 0;

var _vectorious = require("vectorious");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * A line
 */
var Line =
/*#__PURE__*/
function () {
  /**
   * A Line can be defined by two points, p1 and p2, through
   * which it passes. Here, an anchor point is supplied for p1,
   * and a unit vector, direction, is added to it to provided
   * the second.
   * @param {object} anchor
   * @param {object} direction
   */
  function Line(anchor, direction) {
    _classCallCheck(this, Line);

    /**
     * @type {object} p1 a vector describing a point through which the line passes
     */
    this.p1 = anchor;
    /**
     * @type {object} direction a unit vector describing the direction from p1
     */

    this.direction = direction;
    /**
     * @type {object} a vector describing a second point through which the line passes
     */

    this.p2 = _vectorious.Vector.add(this.p1, this.direction);
  }
  /**
   * determine the location that this line intersects with another, if at all
   * @param {object} l the Line to test for intersection against this Line
   * @return {object} the vector of the location of intersection, or null if the lines are parallel
   */


  _createClass(Line, [{
    key: "intersectionWith",
    value: function intersectionWith(l) {
      return Line.intersection(this, l);
    }
    /**
     * determine the location that these lines intersect, if at all
     * @param {object} l1 the first Line to test for intersection
     * @param {object} l2 the second Line to test for intersection
     * @return {object} the vector of the location of intersection, or null if the lines are parallel
     */

  }], [{
    key: "intersection",
    value: function intersection(l1, l2) {
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
      return new _vectorious.Vector([xNumerator / denominator, yNumerator / denominator]);
    }
  }]);

  return Line;
}();

exports.Line = Line;
//# sourceMappingURL=Line.js.map