"use strict";

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
Object.defineProperty(exports, "Application", {
  enumerable: true,
  get: function get() {
    return _Application["default"];
  }
});
Object.defineProperty(exports, "PrimitiveComponent", {
  enumerable: true,
  get: function get() {
    return _Component["default"];
  }
});
Object.defineProperty(exports, "Composition", {
  enumerable: true,
  get: function get() {
    return _Composition["default"];
  }
});
Object.defineProperty(exports, "Circle", {
  enumerable: true,
  get: function get() {
    return _Circle["default"];
  }
});
Object.defineProperty(exports, "Ellipse", {
  enumerable: true,
  get: function get() {
    return _Ellipse["default"];
  }
});
Object.defineProperty(exports, "Rectangle", {
  enumerable: true,
  get: function get() {
    return _Rectangle["default"];
  }
});
Object.defineProperty(exports, "Line", {
  enumerable: true,
  get: function get() {
    return _Line["default"];
  }
});
Object.defineProperty(exports, "VectorPath", {
  enumerable: true,
  get: function get() {
    return _VectorPath["default"];
  }
});
Object.defineProperty(exports, "Bezier", {
  enumerable: true,
  get: function get() {
    return _Bezier["default"];
  }
});
Object.defineProperty(exports, "Image", {
  enumerable: true,
  get: function get() {
    return _Image["default"];
  }
});
Object.defineProperty(exports, "Text", {
  enumerable: true,
  get: function get() {
    return _Text["default"];
  }
});
exports.Renderer = exports.Events = void 0;

var _Application = _interopRequireDefault(require("./core/Application"));

var _Events = _interopRequireWildcard(require("./events/Events"));

exports.Events = _Events;

var _Renderer = _interopRequireWildcard(require("./graphics/Renderer"));

exports.Renderer = _Renderer;

var _Component = _interopRequireDefault(require("./core/Component"));

var _Composition = _interopRequireDefault(require("./core/Composition"));

var _Circle = _interopRequireDefault(require("./primitives/Circle"));

var _Ellipse = _interopRequireDefault(require("./primitives/Ellipse"));

var _Rectangle = _interopRequireDefault(require("./primitives/Rectangle"));

var _Line = _interopRequireDefault(require("./geometry/Line"));

var _VectorPath = _interopRequireDefault(require("./primitives/VectorPath"));

var _Bezier = _interopRequireDefault(require("./primitives/Bezier"));

var _Image = _interopRequireDefault(require("./primitives/Image"));

var _Text = _interopRequireDefault(require("./primitives/Text"));

function _getRequireWildcardCache(nodeInterop) { if (typeof WeakMap !== "function") return null; var cacheBabelInterop = new WeakMap(); var cacheNodeInterop = new WeakMap(); return (_getRequireWildcardCache = function _getRequireWildcardCache(nodeInterop) { return nodeInterop ? cacheNodeInterop : cacheBabelInterop; })(nodeInterop); }

function _interopRequireWildcard(obj, nodeInterop) { if (!nodeInterop && obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(nodeInterop); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (key !== "default" && Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }
//# sourceMappingURL=index.js.map