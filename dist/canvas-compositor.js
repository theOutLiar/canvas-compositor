(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.CanvasCompositor = f()}})(function(){var define,module,exports;return (function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var NDArray_1 = require("./NDArray");
var Vector_1 = require("./Vector");
var nblas;
try {
    nblas = require('nblas');
}
catch (err) { }
var magicHelper = function (n, x, y) {
    return (x + y * 2 + 1) % n;
};
var Matrix = (function (_super) {
    __extends(Matrix, _super);
    function Matrix(data, options) {
        var _this = this;
        if (typeof data === 'number' && typeof options === 'number') {
            _this = _super.call(this, new Float32Array(data * options), { shape: [data, options] }) || this;
        }
        else {
            _this = _super.call(this, data, options) || this;
        }
        return _this;
    }
    Matrix.add = function (a, b) {
        return a.copy()
            .add(b);
    };
    Matrix.augment = function (a, b) {
        return a.copy()
            .augment(b);
    };
    Matrix.binOp = function (a, b, op) {
        return a.copy()
            .binOp(b, op);
    };
    Matrix.equals = function (a, b) {
        return a.equals(b);
    };
    Matrix.fill = function (r, c, value, type) {
        if (value === void 0) { value = 0; }
        if (type === void 0) { type = Float32Array; }
        if (r <= 0 || c <= 0) {
            throw new Error('invalid size');
        }
        var size = r * c;
        var data = new type(size);
        return new Matrix(data, { shape: [r, c] }).fill(value);
    };
    Matrix.identity = function (size, type) {
        if (type === void 0) { type = Float32Array; }
        return Matrix.fill(size, size, function (i) { return (i % size) === Math.floor(i / size) ? 1 : 0; }, type);
    };
    Matrix.magic = function (size, type) {
        if (type === void 0) { type = Float32Array; }
        if (size < 0) {
            throw new Error('invalid size');
        }
        var data = new type(size * size);
        var i;
        var j;
        for (i = 0; i < size; i += 1) {
            for (j = 0; j < size; j += 1) {
                data[(size - i - 1) * size + (size - j - 1)] =
                    magicHelper(size, size - j - 1, i) * size + magicHelper(size, j, i) + 1;
            }
        }
        return new Matrix(data, { shape: [size, size] });
    };
    Matrix.multiply = function (a, b) {
        return a.multiply(b);
    };
    Matrix.ones = function (r, c, type) {
        if (type === void 0) { type = Float32Array; }
        return Matrix.fill(r, c, 1, type);
    };
    Matrix.plu = function (matrix) {
        return matrix.copy()
            .plu();
    };
    Matrix.product = function (a, b) {
        return a.copy()
            .product(b);
    };
    Matrix.random = function (r, c, min, max, type) {
        if (min === void 0) { min = 0; }
        if (max === void 0) { max = 1; }
        if (type === void 0) { type = Float32Array; }
        return Matrix.fill(r, c, min, type)
            .map(function (value) { return value + Math.random() * (max - min); });
    };
    Matrix.rank = function (matrix) {
        return matrix.copy()
            .rank();
    };
    Matrix.scale = function (a, scalar) {
        return a.copy()
            .scale(scalar);
    };
    Matrix.subtract = function (a, b) {
        return a.copy()
            .subtract(b);
    };
    Matrix.zeros = function (r, c, type) {
        if (type === void 0) { type = Float32Array; }
        return Matrix.fill(r, c, 0, type);
    };
    Matrix.prototype.augment = function (matrix) {
        var _a = this.shape, r1 = _a[0], c1 = _a[1];
        var _b = matrix.shape, r2 = _b[0], c2 = _b[1];
        if (r2 === 0 || c2 === 0) {
            return this;
        }
        if (r1 !== r2) {
            throw new Error('rows do not match');
        }
        var d1 = this.data;
        var d2 = matrix.data;
        var length = c1 + c2;
        var data = new this.type(length * r1);
        var i;
        var j;
        for (i = 0; i < r1; i += 1) {
            for (j = 0; j < c1; j += 1) {
                data[i * length + j] = d1[i * c1 + j];
            }
        }
        for (i = 0; i < r2; i += 1) {
            for (j = 0; j < c2; j += 1) {
                data[i * length + j + c1] = d2[i * c2 + j];
            }
        }
        this.shape = [r1, length];
        this.length = data.length;
        this.data = data;
        return this;
    };
    Matrix.prototype.binOp = function (matrix, op) {
        var _a = this.shape, r1 = _a[0], c1 = _a[1];
        var _b = matrix.shape, r2 = _b[0], c2 = _b[1];
        if (r1 !== r2 || c1 !== c2) {
            throw new Error('sizes do not match!');
        }
        var _c = this, d1 = _c.data, length = _c.length;
        var d2 = matrix.data;
        var i;
        for (i = 0; i < length; i += 1) {
            d1[i] = op(d1[i], d2[i], i);
        }
        return this;
    };
    Matrix.prototype.check = function (i, j) {
        var _a = this.shape, r = _a[0], c = _a[1];
        if (isNaN(i) || isNaN(j)) {
            throw new Error('one of the indices is not a number');
        }
        if (i < 0 || j < 0 || i > r - 1 || j > c - 1) {
            throw new Error('index out of bounds');
        }
    };
    Matrix.prototype.determinant = function () {
        var _a = this.shape, r = _a[0], c = _a[1];
        if (r !== c) {
            throw new Error('matrix is not square');
        }
        var _b = Matrix.plu(this), lu = _b[0], ipiv = _b[1];
        var product = 1;
        var sign = 1;
        var i;
        for (i = 0; i < r; i += 1) {
            if (i !== ipiv[i]) {
                sign *= -1;
            }
        }
        for (i = 0; i < r; i += 1) {
            product *= lu.data[i * c + i];
        }
        return sign * product;
    };
    Matrix.prototype.diag = function () {
        var data = this.data;
        var _a = this.shape, r = _a[0], c = _a[1];
        var diag = new this.type(Math.min(r, c));
        var i;
        for (i = 0; i < r && i < c; i += 1) {
            diag[i] = data[i * c + i];
        }
        return new Vector_1.Vector(diag);
    };
    Matrix.prototype.each = function (callback) {
        var c = this.shape[1];
        var _a = this, data = _a.data, length = _a.length;
        var i;
        for (i = 0; i < length; i += 1) {
            callback.call(this, data[i], c === 0 ? 0 : Math.floor(i / c), i % c);
        }
        return this;
    };
    Matrix.prototype.gauss = function () {
        var _a = this.shape, r = _a[0], c = _a[1];
        var copy = this.copy();
        var lead = 0;
        var pivot;
        var leadValue;
        var i;
        var j;
        var k;
        for (i = 0; i < r; i += 1) {
            if (c <= lead) {
                throw new Error('matrix is singular');
            }
            j = i;
            while (copy.data[j * c + lead] === 0) {
                j += 1;
                if (r === j) {
                    j = i;
                    lead += 1;
                    if (c === lead) {
                        throw new Error('matrix is singular');
                    }
                }
            }
            copy.swap(i, j);
            pivot = copy.data[i * c + lead];
            if (pivot !== 0) {
                for (k = 0; k < c; k += 1) {
                    copy.data[(i * c) + k] = copy.data[(i * c) + k] / pivot;
                }
            }
            for (j = 0; j < r; j += 1) {
                leadValue = copy.data[j * c + lead];
                if (j !== i) {
                    for (k = 0; k < c; k += 1) {
                        copy.data[j * c + k] = copy.data[j * c + k] - (copy.data[i * c + k] * leadValue);
                    }
                }
            }
            lead += 1;
        }
        for (i = 0; i < r; i += 1) {
            pivot = 0;
            for (j = 0; j < c; j += 1) {
                if (pivot === 0) {
                    pivot = copy.data[i * c + j];
                }
            }
            if (pivot === 0) {
                for (k = 0; k < c; k += 1) {
                    copy.data[(i * c) + k] = copy.data[(i * c) + k] / pivot;
                }
            }
        }
        return copy;
    };
    Matrix.prototype.get = function (i, j) {
        this.check(i, j);
        return this.data[i * this.shape[1] + j];
    };
    Matrix.prototype.inverse = function () {
        var _a = this.shape, r = _a[0], c = _a[1];
        if (r !== c) {
            throw new Error('invalid dimensions');
        }
        var identity = Matrix.identity(r);
        var augmented = Matrix.augment(this, identity);
        var gauss = augmented.gauss();
        var left = Matrix.zeros(r, c);
        var right = Matrix.zeros(r, c);
        var n = gauss.shape[1];
        var i;
        var j;
        for (i = 0; i < r; i += 1) {
            for (j = 0; j < n; j += 1) {
                if (j < c) {
                    left.set(i, j, gauss.get(i, j));
                }
                else {
                    right.set(i, j - r, gauss.get(i, j));
                }
            }
        }
        if (!left.equals(Matrix.identity(r))) {
            throw new Error('matrix is not invertible');
        }
        return right;
    };
    Matrix.prototype.lu = function () {
        var _a = this.shape, r = _a[0], c = _a[1];
        var _b = Matrix.plu(this), plu = _b[0], ipiv = _b[1];
        var lower = plu.copy();
        var upper = plu.copy();
        var i;
        var j;
        for (i = 0; i < r; i += 1) {
            for (j = i; j < c; j += 1) {
                lower.data[i * c + j] = i === j ? 1 : 0;
            }
        }
        for (i = 0; i < r; i += 1) {
            for (j = 0; j < i && j < c; j += 1) {
                upper.data[i * c + j] = 0;
            }
        }
        return [lower, upper, ipiv];
    };
    Matrix.prototype.lusolve = function (rhs, ipiv) {
        var data = this.data;
        var _a = rhs.shape, n = _a[0], nrhs = _a[1];
        var x = rhs.data;
        var i;
        var j;
        var k;
        for (i = 0; i < ipiv.length; i += 1) {
            if (i !== ipiv[i]) {
                rhs.swap(i, ipiv[i]);
            }
        }
        for (k = 0; k < nrhs; k += 1) {
            for (i = 0; i < n; i += 1) {
                for (j = 0; j < i; j += 1) {
                    x[i * nrhs + k] -= data[i * n + j] * x[j * nrhs + k];
                }
            }
            for (i = n - 1; i >= 0; i -= 1) {
                for (j = i + 1; j < n; j += 1) {
                    x[i * nrhs + k] -= data[i * n + j] * x[j * nrhs + k];
                }
                x[i * nrhs + k] /= data[i * n + i];
            }
        }
        return rhs;
    };
    Matrix.prototype.map = function (callback) {
        var c = this.shape[1];
        var length = this.length;
        var mapped = this.copy();
        var data = mapped.data;
        var i;
        for (i = 0; i < length; i += 1) {
            data[i] = callback.call(mapped, data[i], c === 0 ? 0 : Math.floor(i / c), i % c, data);
        }
        return mapped;
    };
    Matrix.prototype.multiply = function (matrix) {
        var _a = this.shape, r1 = _a[0], c1 = _a[1];
        var _b = matrix.shape, r2 = _b[0], c2 = _b[1];
        if (c1 !== r2) {
            throw new Error('sizes do not match');
        }
        var d1 = this.data;
        var d2 = matrix.data;
        var data = new this.type(r1 * c2);
        try {
            nblas.gemm(d1, d2, data, r1, c2, c1);
        }
        catch (err) {
            var i = void 0;
            var j = void 0;
            var k = void 0;
            var sum = void 0;
            for (i = 0; i < r1; i += 1) {
                for (j = 0; j < c2; j += 1) {
                    sum = 0;
                    for (k = 0; k < c1; k += 1) {
                        sum += d1[i * c1 + k] * d2[j + k * c2];
                    }
                    data[i * c2 + j] = sum;
                }
            }
        }
        return new Matrix(data, { shape: [r1, c2] });
    };
    Object.defineProperty(Matrix.prototype, "T", {
        get: function () {
            return this.transpose();
        },
        enumerable: true,
        configurable: true
    });
    Matrix.prototype.plu = function () {
        var data = this.data;
        var n = this.shape[0];
        var ipiv = new Int32Array(n);
        var max;
        var abs;
        var diag;
        var p;
        var i;
        var j;
        var k;
        for (k = 0; k < n; k += 1) {
            p = k;
            max = Math.abs(data[k * n + k]);
            for (j = k + 1; j < n; j += 1) {
                abs = Math.abs(data[j * n + k]);
                if (max < abs) {
                    max = abs;
                    p = j;
                }
            }
            ipiv[k] = p;
            if (p !== k) {
                this.swap(k, p);
            }
            diag = data[k * n + k];
            for (i = k + 1; i < n; i += 1) {
                data[i * n + k] /= diag;
            }
            for (i = k + 1; i < n; i += 1) {
                for (j = k + 1; j < n - 1; j += 1) {
                    data[i * n + j] -= data[i * n + k] * data[k * n + j];
                    j += 1;
                    data[i * n + j] -= data[i * n + k] * data[k * n + j];
                }
                if (j === n - 1) {
                    data[i * n + j] -= data[i * n + k] * data[k * n + j];
                }
            }
        }
        return [this, ipiv];
    };
    Matrix.prototype.rank = function () {
        var vectors = this.toArray()
            .map(function (row) { return new Vector_1.Vector(row); });
        var _a = this.shape, r = _a[0], c = _a[1];
        var counter = 0;
        var tmp;
        var pivot;
        var target;
        var scalar;
        var i;
        var j;
        for (i = 0; i < r - 1; i += 1) {
            pivot = undefined;
            for (j = i; j < r; j += 1) {
                if (vectors[i].get(i) !== 0) {
                    if (i !== j) {
                        tmp = vectors[i];
                        vectors[i] = vectors[j];
                        vectors[j] = tmp;
                    }
                    pivot = vectors[i];
                    break;
                }
            }
            if (pivot === undefined) {
                continue;
            }
            for (j = (i + 1); j < r; j += 1) {
                target = vectors[j];
                scalar = target.get(i) / pivot.get(i);
                vectors[j] = target.subtract(pivot.scale(scalar));
            }
        }
        for (i = 0; i < r; i += 1) {
            for (j = 0; j < c; j += 1) {
                if (vectors[i].get(j) !== 0) {
                    counter += 1;
                    break;
                }
            }
        }
        return counter;
    };
    Matrix.prototype.reduce = function (callback, initialValue) {
        var c = this.shape[1];
        var length = this.length;
        if (length === 0 && initialValue === undefined) {
            throw new Error('reduce of empty matrix with no initial value.');
        }
        var data = this.data;
        var i;
        var value;
        if (initialValue === undefined) {
            value = data[0];
            i = 1;
        }
        else {
            value = initialValue;
            i = 0;
        }
        for (; i < length; i += 1) {
            value = callback.call(this, value, data[i], c === 0 ? 0 : Math.floor(i / c), i % c);
        }
        return value;
    };
    Matrix.prototype.rowAdd = function (dest, source, scalar) {
        if (scalar === void 0) { scalar = 1; }
        this.check(dest, 0);
        this.check(source, 0);
        var c = this.shape[1];
        var i;
        for (i = 0; i < c; i += 1) {
            this.set(dest, i, (this.get(dest, i) + (this.get(source, i) * scalar)));
        }
        return this;
    };
    Matrix.prototype.set = function (i, j, value) {
        this.check(i, j);
        this.data[i * this.shape[1] + j] = value;
        return this;
    };
    Matrix.prototype.solve = function (rhs) {
        var _a = Matrix.plu(this), lu = _a[0], ipiv = _a[1];
        return lu.lusolve(rhs.copy(), ipiv);
    };
    Matrix.prototype.swap = function (i, j) {
        var _a = this.shape, r = _a[0], c = _a[1];
        if (i < 0 || j < 0 || i > r - 1 || j > r - 1) {
            throw new Error('index out of bounds');
        }
        var copy = this.data.slice(i * c, (i + 1) * c);
        this.data.copyWithin(i * c, j * c, (j + 1) * c);
        this.data.set(copy, j * c);
        return this;
    };
    Matrix.prototype.toArray = function () {
        var _a = this.shape, r = _a[0], c = _a[1];
        var result = [];
        var i;
        for (i = 0; i < r; i += 1) {
            result.push(Array.prototype.slice.call(this.data.subarray(i * c, (i + 1) * c)));
        }
        return result;
    };
    Matrix.prototype.toString = function () {
        var _a = this.shape, r = _a[0], c = _a[1];
        var result = [];
        var i;
        for (i = 0; i < r; i += 1) {
            result.push("[" + this.data.subarray(i * c, (i + 1) * c) + "]");
        }
        return "[" + result.join(', \n') + "]";
    };
    Matrix.prototype.trace = function () {
        var diag = this.diag();
        var length = diag.length;
        var result = 0;
        var i;
        for (i = 0; i < length; i += 1) {
            result += diag.get(i);
        }
        return result;
    };
    Matrix.prototype.transpose = function () {
        var _a = this.shape, r = _a[0], c = _a[1];
        var data = new this.type(c * r);
        var i;
        var j;
        for (i = 0; i < r; i += 1) {
            for (j = 0; j < c; j += 1) {
                data[j * r + i] = this.data[i * c + j];
            }
        }
        return new Matrix(data, { shape: [c, r] });
    };
    return Matrix;
}(NDArray_1.NDArray));
exports.Matrix = Matrix;
try {
    window.Matrix = Matrix;
}
catch (err) { }

},{"./NDArray":3,"./Vector":4,"nblas":1}],3:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var util_1 = require("./util");
var nblas;
try {
    nblas = require('nblas');
}
catch (err) { }
var abs = Math.abs, acos = Math.acos, acosh = Math.acosh, asin = Math.asin, asinh = Math.asinh, atan = Math.atan, atanh = Math.atanh, cbrt = Math.cbrt, ceil = Math.ceil, cos = Math.cos, cosh = Math.cosh, exp = Math.exp, expm1 = Math.expm1, floor = Math.floor, fround = Math.fround, log = Math.log, log1p = Math.log1p, log10 = Math.log10, log2 = Math.log2, pow = Math.pow, round = Math.round, sign = Math.sign, sin = Math.sin, sinh = Math.sinh, sqrt = Math.sqrt, tan = Math.tan, tanh = Math.tanh, trunc = Math.trunc;
var NDArray = (function () {
    function NDArray(data, options) {
        this.data = new Float32Array(0);
        this.length = 0;
        this.shape = [0];
        this.type = Float32Array;
        if (util_1.isTypedArray(data)) {
            this.data = data;
            this.shape = typeof options === 'object' ? options.shape : [this.data.length];
            this.length = this.data.length;
            this.type = util_1.type(data);
        }
        else if (data instanceof Array) {
            this.data = new Float32Array(util_1.flatten(data));
            this.shape = util_1.shape(data);
            this.length = this.data.length;
        }
        else if (data instanceof NDArray) {
            return data.copy();
        }
    }
    NDArray.prototype.abs = function () {
        var l1 = this.length;
        var i;
        for (i = 0; i < l1; i += 1) {
            this.data[i] = abs(this.data[i]);
        }
        return this;
    };
    NDArray.prototype.acos = function () {
        var l1 = this.length;
        var i;
        for (i = 0; i < l1; i += 1) {
            this.data[i] = acos(this.data[i]);
        }
        return this;
    };
    NDArray.prototype.acosh = function () {
        var l1 = this.length;
        var i;
        for (i = 0; i < l1; i += 1) {
            this.data[i] = acosh(this.data[i]);
        }
        return this;
    };
    NDArray.prototype.add = function (x, alpha) {
        if (alpha === void 0) { alpha = 1; }
        this.equilateral(x);
        this.equidimensional(x);
        try {
            nblas.axpy(x.data, this.data, alpha);
        }
        catch (err) {
            var _a = this, d1 = _a.data, l1 = _a.length;
            var d2 = x.data;
            var i = void 0;
            for (i = 0; i < l1; i += 1) {
                d1[i] += alpha * d2[i];
            }
        }
        return this;
    };
    NDArray.prototype.asin = function () {
        var l1 = this.length;
        var i;
        for (i = 0; i < l1; i += 1) {
            this.data[i] = asin(this.data[i]);
        }
        return this;
    };
    NDArray.prototype.asinh = function () {
        var l1 = this.length;
        var i;
        for (i = 0; i < l1; i += 1) {
            this.data[i] = asinh(this.data[i]);
        }
        return this;
    };
    NDArray.prototype.atan = function () {
        var l1 = this.length;
        var i;
        for (i = 0; i < l1; i += 1) {
            this.data[i] = atan(this.data[i]);
        }
        return this;
    };
    NDArray.prototype.atanh = function () {
        var l1 = this.length;
        var i;
        for (i = 0; i < l1; i += 1) {
            this.data[i] = atanh(this.data[i]);
        }
        return this;
    };
    NDArray.prototype.cbrt = function () {
        var l1 = this.length;
        var i;
        for (i = 0; i < l1; i += 1) {
            this.data[i] = cbrt(this.data[i]);
        }
        return this;
    };
    NDArray.prototype.ceil = function () {
        var l1 = this.length;
        var i;
        for (i = 0; i < l1; i += 1) {
            this.data[i] = ceil(this.data[i]);
        }
        return this;
    };
    NDArray.prototype.copy = function () {
        var copy = Object.assign(Object.create(Object.getPrototypeOf(this)), this);
        copy.data = new this.type(this.data);
        copy.shape = this.shape;
        copy.length = this.length;
        copy.type = this.type;
        return copy;
    };
    NDArray.prototype.cos = function () {
        var l1 = this.length;
        var i;
        for (i = 0; i < l1; i += 1) {
            this.data[i] = cos(this.data[i]);
        }
        return this;
    };
    NDArray.prototype.cosh = function () {
        var l1 = this.length;
        var i;
        for (i = 0; i < l1; i += 1) {
            this.data[i] = cosh(this.data[i]);
        }
        return this;
    };
    NDArray.prototype.dot = function (x) {
        this.equilateral(x);
        this.equidimensional(x);
        var _a = this, d1 = _a.data, l1 = _a.length;
        var d2 = x.data;
        try {
            return nblas.dot(d1, d2);
        }
        catch (err) {
            var result = 0;
            var i = void 0;
            for (i = 0; i < l1; i += 1) {
                result += d1[i] * d2[i];
            }
            return result;
        }
    };
    NDArray.prototype.equals = function (x) {
        this.equilateral(x);
        this.equidimensional(x);
        var _a = this, d1 = _a.data, l1 = _a.length;
        var d2 = x.data;
        var i;
        for (i = 0; i < l1; i += 1) {
            if (d1[i] !== d2[i]) {
                return false;
            }
        }
        return true;
    };
    NDArray.prototype.equidimensional = function (x) {
        var s1 = this.shape;
        var s2 = x.shape;
        if (!s1.every(function (dim, i) { return dim === s2[i]; })) {
            throw new Error("shapes " + s1 + " and " + s2 + " do not match");
        }
    };
    NDArray.prototype.equilateral = function (x) {
        var l1 = this.length;
        var l2 = x.length;
        if (l1 !== l2) {
            throw new Error("lengths " + l1 + " and " + l2 + " do not match");
        }
    };
    NDArray.prototype.exp = function () {
        var l1 = this.length;
        var i;
        for (i = 0; i < l1; i += 1) {
            this.data[i] = exp(this.data[i]);
        }
        return this;
    };
    NDArray.prototype.expm1 = function () {
        var l1 = this.length;
        var i;
        for (i = 0; i < l1; i += 1) {
            this.data[i] = expm1(this.data[i]);
        }
        return this;
    };
    NDArray.prototype.fill = function (value) {
        if (value === void 0) { value = 0; }
        var _a = this, data = _a.data, length = _a.length;
        var i;
        for (i = 0; i < length; i += 1) {
            data[i] = value instanceof Function ? value(i) : value;
        }
        return this;
    };
    NDArray.prototype.floor = function () {
        var l1 = this.length;
        var i;
        for (i = 0; i < l1; i += 1) {
            this.data[i] = floor(this.data[i]);
        }
        return this;
    };
    NDArray.prototype.fround = function () {
        var l1 = this.length;
        var i;
        for (i = 0; i < l1; i += 1) {
            this.data[i] = fround(this.data[i]);
        }
        return this;
    };
    NDArray.prototype.log = function () {
        var l1 = this.length;
        var i;
        for (i = 0; i < l1; i += 1) {
            this.data[i] = log(this.data[i]);
        }
        return this;
    };
    NDArray.prototype.log10 = function () {
        var l1 = this.length;
        var i;
        for (i = 0; i < l1; i += 1) {
            this.data[i] = log10(this.data[i]);
        }
        return this;
    };
    NDArray.prototype.log1p = function () {
        var l1 = this.length;
        var i;
        for (i = 0; i < l1; i += 1) {
            this.data[i] = log1p(this.data[i]);
        }
        return this;
    };
    NDArray.prototype.log2 = function () {
        var l1 = this.length;
        var i;
        for (i = 0; i < l1; i += 1) {
            this.data[i] = log2(this.data[i]);
        }
        return this;
    };
    NDArray.prototype.magnitude = function () {
        var length = this.length;
        if (length === 0) {
            return 0;
        }
        var data = this.data;
        try {
            return nblas.nrm2(data);
        }
        catch (err) {
            var result = 0;
            var i = void 0;
            for (i = 0; i < length; i += 1) {
                result += data[i] * data[i];
            }
            return Math.sqrt(result);
        }
    };
    NDArray.prototype.max = function () {
        var data = this.data;
        try {
            return data[nblas.iamax(data)];
        }
        catch (err) {
            var length_1 = this.length;
            var result = Number.NEGATIVE_INFINITY;
            var i = void 0;
            for (i = 0; i < length_1; i += 1) {
                result = result < data[i] ? data[i] : result;
            }
            return result;
        }
    };
    NDArray.prototype.min = function () {
        var _a = this, data = _a.data, length = _a.length;
        var result = Number.POSITIVE_INFINITY;
        var i;
        for (i = 0; i < length; i += 1) {
            result = result < data[i] ? result : data[i];
        }
        return result;
    };
    NDArray.prototype.pow = function (exponent) {
        var l1 = this.length;
        var i;
        for (i = 0; i < l1; i += 1) {
            this.data[i] = pow(this.data[i], exponent);
        }
        return this;
    };
    NDArray.prototype.product = function (x) {
        this.equilateral(x);
        this.equidimensional(x);
        var _a = this, d1 = _a.data, l1 = _a.length;
        var d2 = x.data;
        var i;
        for (i = 0; i < l1; i += 1) {
            d1[i] *= d2[i];
        }
        return this;
    };
    NDArray.prototype.reshape = function (s) {
        var length = this.length;
        if (s.reduce(function (sum, dim) { return sum * dim; }, 1) !== length) {
            throw new Error("shape " + util_1.shape + " does not match length " + length);
        }
        this.shape = s;
        return this;
    };
    NDArray.prototype.round = function () {
        var l1 = this.length;
        var i;
        for (i = 0; i < l1; i += 1) {
            this.data[i] = round(this.data[i]);
        }
        return this;
    };
    NDArray.prototype.scale = function (scalar) {
        var data = this.data;
        try {
            nblas.scal(data, scalar);
        }
        catch (err) {
            var length_2 = this.length;
            var i = void 0;
            for (i = 0; i < length_2; i += 1) {
                data[i] *= scalar;
            }
        }
        return this;
    };
    NDArray.prototype.sign = function () {
        var l1 = this.length;
        var i;
        for (i = 0; i < l1; i += 1) {
            this.data[i] = sign(this.data[i]);
        }
        return this;
    };
    NDArray.prototype.sin = function () {
        var l1 = this.length;
        var i;
        for (i = 0; i < l1; i += 1) {
            this.data[i] = sin(this.data[i]);
        }
        return this;
    };
    NDArray.prototype.sinh = function () {
        var l1 = this.length;
        var i;
        for (i = 0; i < l1; i += 1) {
            this.data[i] = sinh(this.data[i]);
        }
        return this;
    };
    NDArray.prototype.sqrt = function () {
        var l1 = this.length;
        var i;
        for (i = 0; i < l1; i += 1) {
            this.data[i] = sqrt(this.data[i]);
        }
        return this;
    };
    NDArray.prototype.subtract = function (x) {
        return this.add(x, -1);
    };
    NDArray.prototype.tan = function () {
        var l1 = this.length;
        var i;
        for (i = 0; i < l1; i += 1) {
            this.data[i] = tan(this.data[i]);
        }
        return this;
    };
    NDArray.prototype.tanh = function () {
        var l1 = this.length;
        var i;
        for (i = 0; i < l1; i += 1) {
            this.data[i] = tanh(this.data[i]);
        }
        return this;
    };
    NDArray.prototype.trunc = function () {
        var l1 = this.length;
        var i;
        for (i = 0; i < l1; i += 1) {
            this.data[i] = trunc(this.data[i]);
        }
        return this;
    };
    return NDArray;
}());
exports.NDArray = NDArray;
try {
    window.NDArray = NDArray;
}
catch (error) { }

},{"./util":6,"nblas":1}],4:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var NDArray_1 = require("./NDArray");
var Vector = (function (_super) {
    __extends(Vector, _super);
    function Vector(data) {
        return _super.call(this, typeof data === 'number' ? new Float32Array(data) : data) || this;
    }
    Vector.add = function (a, b) {
        return a.copy()
            .add(b);
    };
    Vector.angle = function (a, b) {
        return a.angle(b);
    };
    Vector.binOp = function (a, b, op) {
        return a.copy()
            .binOp(b, op);
    };
    Vector.combine = function (a, b) {
        return a.copy()
            .combine(b);
    };
    Vector.dot = function (a, b) {
        return a.dot(b);
    };
    Vector.equals = function (a, b) {
        return a.equals(b);
    };
    Vector.fill = function (count, value, type) {
        if (value === void 0) { value = 0; }
        if (type === void 0) { type = Float32Array; }
        if (count < 0) {
            throw new Error('invalid size');
        }
        var data = new type(count);
        return new Vector(data).fill(value);
    };
    Vector.normalize = function (vector) {
        return vector.copy()
            .normalize();
    };
    Vector.ones = function (count, type) {
        if (type === void 0) { type = Float32Array; }
        return Vector.fill(count, 1, type);
    };
    Vector.project = function (a, b) {
        return a.project(b.copy());
    };
    Vector.random = function (count, min, max, type) {
        if (min === void 0) { min = 0; }
        if (max === void 0) { max = 1; }
        if (type === void 0) { type = Float32Array; }
        return Vector.fill(count, min, type)
            .map(function (value) { return value + Math.random() * (max - min); });
    };
    Vector.range = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var type = Float32Array;
        var backwards = false;
        var start;
        var step;
        var end;
        if (typeof args[args.length - 1] === 'function') {
            type = args.pop();
        }
        switch (args.length) {
            case 2:
                end = args.pop();
                step = 1;
                start = args.pop();
                break;
            case 3:
                end = args.pop();
                step = args.pop();
                start = args.pop();
                break;
            default:
                throw new Error('invalid range');
        }
        if (end - start < 0) {
            var copy = end;
            end = start;
            start = copy;
            backwards = true;
        }
        if (step > end - start) {
            throw new Error('invalid range');
        }
        var data = new type(Math.ceil((end - start) / step));
        var i = start;
        var j = 0;
        if (backwards) {
            for (; i < end; i += step, j += 1) {
                data[j] = end - i + start;
            }
        }
        else {
            for (; i < end; i += step, j += 1) {
                data[j] = i;
            }
        }
        return new Vector(data);
    };
    Vector.scale = function (vector, scalar) {
        return vector.copy()
            .scale(scalar);
    };
    Vector.subtract = function (a, b) {
        return a.copy()
            .subtract(b);
    };
    Vector.zeros = function (count, type) {
        if (type === void 0) { type = Float32Array; }
        return Vector.fill(count, 0, type);
    };
    Vector.prototype.angle = function (vector) {
        return Math.acos(this.dot(vector) / this.magnitude() / vector.magnitude());
    };
    Vector.prototype.binOp = function (vector, op) {
        var l1 = this.length;
        var l2 = vector.length;
        if (l1 !== l2) {
            throw new Error('sizes do not match!');
        }
        var i;
        for (i = 0; i < l1; i += 1) {
            this.data[i] = op(this.data[i], vector.data[i], i);
        }
        return this;
    };
    Vector.prototype.check = function (index) {
        if (!isFinite(index) || index < 0 || index > this.length - 1) {
            throw new Error('index out of bounds');
        }
    };
    Vector.prototype.combine = function (vector) {
        var l1 = this.length;
        var l2 = vector.length;
        if (l2 === 0) {
            return this;
        }
        if (l1 === 0) {
            this.data = new vector.type(vector.data);
            this.length = l2;
            this.type = vector.type;
            return this;
        }
        var d1 = this.data;
        var d2 = vector.data;
        var data = new this.type(l1 + l2);
        data.set(d1);
        data.set(d2, l1);
        this.data = data;
        this.length = l1 + l2;
        this.shape = [l1 + l2];
        return this;
    };
    Vector.prototype.cross = function (vector) {
        if (this.length !== 3 || vector.length !== 3) {
            throw new Error('cross(...) : vectors must have three components.');
        }
        var c1 = this.y * vector.z - this.z * vector.y;
        var c2 = this.z * vector.x - this.x * vector.z;
        var c3 = this.x * vector.y - this.y * vector.x;
        return new Vector([c1, c2, c3]);
    };
    Vector.prototype.each = function (callback) {
        var i;
        for (i = 0; i < this.length; i += 1) {
            callback.call(this, this.data[i], i, this.data);
        }
        return this;
    };
    Vector.prototype.get = function (index) {
        this.check(index);
        return this.data[index];
    };
    Vector.prototype.map = function (callback) {
        var l = this.length;
        var mapped = this.copy();
        var data = mapped.data;
        var i;
        for (i = 0; i < l; i += 1) {
            data[i] = callback.call(mapped, data[i], i, data);
        }
        return mapped;
    };
    Vector.prototype.normalize = function () {
        return this.scale(1 / this.magnitude());
    };
    Vector.prototype.project = function (vector) {
        return vector.scale(this.dot(vector) / vector.dot(vector));
    };
    Vector.prototype.push = function (value) {
        return this.combine(new Vector([value]));
    };
    Vector.prototype.reduce = function (callback, initialValue) {
        var l = this.length;
        if (l === 0 && initialValue === undefined) {
            throw new Error('Reduce of empty matrix with no initial value.');
        }
        var i;
        var value;
        if (initialValue === undefined) {
            value = this.data[0];
            i = 1;
        }
        else {
            value = initialValue;
            i = 0;
        }
        for (; i < l; i += 1) {
            value = callback.call(this, value, this.data[i], i, this.data);
        }
        return value;
    };
    Vector.prototype.set = function (index, value) {
        this.check(index);
        this.data[index] = value;
        return this;
    };
    Object.defineProperty(Vector.prototype, "x", {
        get: function () {
            return this.get(0);
        },
        set: function (value) {
            this.set(0, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector.prototype, "y", {
        get: function () {
            return this.get(1);
        },
        set: function (value) {
            this.set(1, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector.prototype, "z", {
        get: function () {
            return this.get(2);
        },
        set: function (value) {
            this.set(2, value);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Vector.prototype, "w", {
        get: function () {
            return this.get(3);
        },
        set: function (value) {
            this.set(3, value);
        },
        enumerable: true,
        configurable: true
    });
    Vector.prototype.toArray = function () {
        return [].slice.call(this.data);
    };
    Vector.prototype.toString = function () {
        var l = this.length;
        var result = ['['];
        var i = 0;
        if (i < l) {
            result.push(String(this.data[i]));
            i += 1;
        }
        while (i < l) {
            result.push(", " + this.data[i]);
            i += 1;
        }
        result.push(']');
        return result.join('');
    };
    return Vector;
}(NDArray_1.NDArray));
exports.Vector = Vector;
try {
    window.Vector = Vector;
}
catch (error) { }

},{"./NDArray":3}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Vector_1 = require("./Vector");
exports.Vector = Vector_1.Vector;
var Matrix_1 = require("./Matrix");
exports.Matrix = Matrix_1.Matrix;
var NDArray_1 = require("./NDArray");
exports.NDArray = NDArray_1.NDArray;

},{"./Matrix":2,"./NDArray":3,"./Vector":4}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.flatten = function (input) {
    return input.reduce(function (acc, next) { return acc.concat(Array.isArray(next) ? exports.flatten(next) : next); }, []);
};
exports.shape = function (input) { return Array.isArray(input)
    ? [input.length].concat(exports.shape(input[0]))
    : []; };
exports.type = function (input) {
    switch (input.constructor.name) {
        case 'Int8Array': return Int8Array;
        case 'Uint8Array': return Uint8Array;
        case 'Int16Array': return Int16Array;
        case 'Uint16Array': return Uint16Array;
        case 'Int32Array': return Int32Array;
        case 'Uint32Array': return Uint32Array;
        case 'Uint8ClampedArray': return Uint8ClampedArray;
        case 'Float64Array': return Float64Array;
        default: return Float32Array;
    }
};
exports.isTypedArray = function (input) {
    return !!(input && input.buffer instanceof ArrayBuffer && input.BYTES_PER_ELEMENT);
};

},{}],7:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Bezier = void 0;

var _Renderer = require("./Renderer");

var _PrimitiveComponent2 = require("./PrimitiveComponent");

var _vectorious = require("vectorious");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function set(target, property, value, receiver) { if (typeof Reflect !== "undefined" && Reflect.set) { set = Reflect.set; } else { set = function set(target, property, value, receiver) { var base = _superPropBase(target, property); var desc; if (base) { desc = Object.getOwnPropertyDescriptor(base, property); if (desc.set) { desc.set.call(receiver, value); return true; } else if (!desc.writable) { return false; } } desc = Object.getOwnPropertyDescriptor(receiver, property); if (desc) { if (!desc.writable) { return false; } desc.value = value; Object.defineProperty(receiver, property, desc); } else { _defineProperty(receiver, property, value); } return true; }; } return set(target, property, value, receiver); }

function _set(target, property, value, receiver, isStrict) { var s = set(target, property, value, receiver || target); if (!s && isStrict) { throw new Error('failed to set property'); } return value; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

//uhh... i looked up *SO* much stuff on this, and even tried to work out the math myself,
//but this is ridiculous - where does this come from?
function _cubicBezier(start, c1, c2, end, t) {
  return start * (1 - t) * (1 - t) * (1 - t) + 3 * c1 * t * (1 - t) * (1 - t) + 3 * c2 * t * t * (1 - t) + end * t * t * t;
}

function _getExtremes(start, c1, c2, end) {
  var a = 3 * end - 9 * c2 + 9 * c1 - 3 * start;
  var b = 6 * c2 - 12 * c1 + 6 * start;
  var c = 3 * c1 - 3 * start;
  var solutions = [];
  var localExtrema = []; //"discriminant"

  var disc = b * b - 4 * a * c;

  if (disc >= 0) {
    if (!Math.abs(a) > 0 && Math.abs(b) > 0) {
      solutions.push(-c / b);
    } else if (Math.abs(a) > 0) {
      solutions.push((-b + Math.sqrt(disc)) / (2 * a));
      solutions.push((-b - Math.sqrt(disc)) / (2 * a));
    } else {
      throw new Error("no solutions!?!?!");
    }

    for (var _i = 0, _solutions = solutions; _i < _solutions.length; _i++) {
      var t = _solutions[_i];

      if (0 <= t && t <= 1) {
        localExtrema.push(_cubicBezier(start, c1, c2, end, t));
      }
    }
  }

  localExtrema.push(start, end);
  return localExtrema;
}

var Bezier =
/*#__PURE__*/
function (_PrimitiveComponent) {
  _inherits(Bezier, _PrimitiveComponent);

  function Bezier(options) {
    var _this;

    _classCallCheck(this, Bezier);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Bezier).call(this, options));
    var start = new _vectorious.Vector([options.start.x, options.start.y]);
    var end = new _vectorious.Vector([options.end.x, options.end.y]);
    var control1 = new _vectorious.Vector([options.control1.x, options.control1.y]);
    var control2 = new _vectorious.Vector([options.control2.x, options.control2.y]);
    _this._boundingBox = null;
    _this._boundingBoxNeedsUpdate = true;

    var xExtrema = _getExtremes(start.x, control1.x, control2, end.x);

    var yExtrema = _getExtremes(start.y, control1.y, control2.y, end.y);

    _set(_getPrototypeOf(Bezier.prototype), "d", new _vectorious.Vector([Math.min.apply(null, xExtrema), Math.min.apply(null, yExtrema)]), _assertThisInitialized(_this), true);

    _this._normalizationVector = _this.d;
    _this._start = _vectorious.Vector.subtract(start, _this._normalizationVector);
    _this._end = _vectorious.Vector.subtract(end, _this._normalizationVector);
    _this._control1 = _vectorious.Vector.subtract(control1, _this._normalizationVector);
    _this._control2 = _vectorious.Vector.subtract(control2, _this._normalizationVector);
    return _this;
  }

  _createClass(Bezier, [{
    key: "render",
    value: function render() {
      _Renderer.Renderer.drawBezier(this._start, this._end, this._control1, this._control2, this._prerenderingContext, this.style);
    }
  }, {
    key: "boundingBox",
    get: function get() {
      //if (this._boundingBox === null || this._boundingBoxNeedsUpdate) {
      var lineWidth = this.style.lineWidth;
      var offset = this.offset;

      var start = _vectorious.Vector.add(this._start, this.offset);

      var control1 = _vectorious.Vector.add(this._control1, this.offset);

      var control2 = _vectorious.Vector.add(this._control2, this.offset);

      var end = _vectorious.Vector.add(this._end, this.offset);

      var xExtrema = _getExtremes(start.x, control1.x, control2, end.x);

      var yExtrema = _getExtremes(start.y, control1.y, control2.y, end.y);

      this._boundingBox = {
        top: Math.min.apply(null, yExtrema) - lineWidth,
        right: Math.max.apply(null, xExtrema) + lineWidth,
        bottom: Math.max.apply(null, yExtrema) + lineWidth,
        left: Math.min.apply(null, xExtrema) - lineWidth
      };
      this._boundingBoxNeedsUpdate = false; //}

      return this._boundingBox;
    }
  }]);

  return Bezier;
}(_PrimitiveComponent2.PrimitiveComponent);

exports.Bezier = Bezier;

},{"./PrimitiveComponent":14,"./Renderer":16,"vectorious":5}],8:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.init = init;
Object.defineProperty(exports, "DEFAULTS", {
  enumerable: true,
  get: function get() {
    return _Renderer.DEFAULTS;
  }
});
Object.defineProperty(exports, "Renderer", {
  enumerable: true,
  get: function get() {
    return _Renderer.Renderer;
  }
});
Object.defineProperty(exports, "Composition", {
  enumerable: true,
  get: function get() {
    return _Composition.Composition;
  }
});
Object.defineProperty(exports, "PrimitiveComponent", {
  enumerable: true,
  get: function get() {
    return _PrimitiveComponent.PrimitiveComponent;
  }
});
Object.defineProperty(exports, "Circle", {
  enumerable: true,
  get: function get() {
    return _Circle.Circle;
  }
});
Object.defineProperty(exports, "Ellipse", {
  enumerable: true,
  get: function get() {
    return _Ellipse.Ellipse;
  }
});
Object.defineProperty(exports, "Rectangle", {
  enumerable: true,
  get: function get() {
    return _Rectangle.Rectangle;
  }
});
Object.defineProperty(exports, "Line", {
  enumerable: true,
  get: function get() {
    return _Line.Line;
  }
});
Object.defineProperty(exports, "VectorPath", {
  enumerable: true,
  get: function get() {
    return _VectorPath.VectorPath;
  }
});
Object.defineProperty(exports, "Bezier", {
  enumerable: true,
  get: function get() {
    return _Bezier.Bezier;
  }
});
Object.defineProperty(exports, "Image", {
  enumerable: true,
  get: function get() {
    return _Image.Image;
  }
});
Object.defineProperty(exports, "Text", {
  enumerable: true,
  get: function get() {
    return _Text.Text;
  }
});

var _Renderer = require("./Renderer");

var _Composition = require("./Composition");

var _PrimitiveComponent = require("./PrimitiveComponent");

var _Circle = require("./Circle");

var _Ellipse = require("./Ellipse");

var _Rectangle = require("./Rectangle");

var _Line = require("./Line");

var _VectorPath = require("./VectorPath");

var _Bezier = require("./Bezier");

var _Image = require("./Image");

var _Text = require("./Text");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

//const FPS_EPSILON = 10; // +/- 10ms for animation loop to determine if enough time has passed to render
var DEFAULT_TARGET_FPS = 1000 / 60; //amount of time that must pass before rendering

var EVENTS = {
  MOUSEUP: 'onmouseup',
  MOUSEDOWN: 'onmousedown',
  MOUSEMOVE: 'onmousemove',
  MOUSEOUT: 'onmouseout',
  CLICK: 'onclick'
};
/**
 * The CanvasCompositor class is the entry-point to usage of the `canvas-compositor`.
 * The application programmer is expected to hand over low-level control of the canvas
 * context to the high-level classes and methods exposed by CanvasCompositor.
 *
 * The CanvasCompositor class establishes an event dispatcher, animation loop, and scene graph for
 * compositions.
 */

var CanvasCompositor =
/*#__PURE__*/
function () {
  /**
   * The CanvasCompositor class establishes an event dispatcher, animation loop, and scene graph for
   * compositions
   *
   * @param {object} canvas This should be a canvas, either from the DOM or an equivalent API
   *
   * @example
   * let cc = new CanvasCompositor(document.getElementById('myCanvas'));
   */
  function CanvasCompositor(canvas) {
    _classCallCheck(this, CanvasCompositor);

    this._canvas = canvas;
    this._context = this._canvas.getContext('2d'); //acquire the padding on the canvas – this is necessary to properly
    //locate the mouse position
    //TODO: determine if border-box affects this, and adjust accordingly

    var style = window.getComputedStyle(this._canvas);
    var borderLeft = style.getPropertyValue('border-left') ? parseFloat(style.getPropertyValue('border-left')) : 0;
    var paddingLeft = style.getPropertyValue('padding-left') ? parseFloat(style.getPropertyValue('padding-left')) : 0;
    this._leftPadding = borderLeft + paddingLeft;
    var borderTop = style.getPropertyValue('border-top') ? parseFloat(style.getPropertyValue('border-top')) : 0;
    var paddingTop = style.getPropertyValue('padding-top') ? parseFloat(style.getPropertyValue('padding-top')) : 0;
    this._topPadding = borderTop + paddingTop;
    this._currentTime = 0;
    this._lastFrameTimestamp = 0;
    this._lastRenderTime = 0;
    this._targetObject = null;
    this._scene = new _Composition.Composition(this.canvas);

    this._bindEvents();

    this._eventRegistry = {
      onmouseup: [],
      onmousedown: [],
      onmousemove: [],
      onmouseout: [],
      onclick: []
    };

    this._animationLoop();

    this._framerate = 0;
  } //TODO: expose the framerate


  _createClass(CanvasCompositor, [{
    key: "_animationLoop",

    /**
     * The animation loop for this instance of CanvasCompositor.
     * Upon receipt of the animation frame from `requestAnimationFrame`, the loop will check
     * whether enough time has passed to redraw for the target framerate.
     * It will only draw if somewhere along the scene graph, an object needs updating.
     * There is no need to invoke this directly, the constructor will do it.
     */
    value: function _animationLoop() {
      window.requestAnimationFrame(this._animationLoop.bind(this));
      this._currentTime = +new Date(); //set maximum of 60 fps and only redraw if necessary

      if (
      /*this._currentTime - this._lastFrameTimestamp >= this._targetFPS &&*/
      this.scene.needsDraw) {
        this._lastRenderTime = +new Date();

        _Renderer.Renderer.clearRect(0, 0, this._canvas.width, this._canvas.height, this._context);

        this.scene.draw(this._context);
      }

      this.framerate = parseInt(1000 / (this._currentTime - this._lastFrameTimestamp));
      this._lastFrameTimestamp = +new Date();
    }
    /**
     * add an event to the event registry
     *
     * @param {string} eventType the name of the type of event
     * @param {function} callback the callback to be triggered when the event occurs
     */

  }, {
    key: "registerEvent",
    value: function registerEvent(eventType, callback) {
      if (this._eventRegistry[eventType]) {
        this._eventRegistry[eventType].push(callback);
      }
    }
    /**
     * remove an event to the event registry
     *
     * @param {string} eventType the name of the type of event
     * @param {function} callback the callback to be removed from the event
     * @return {function} the callback that was removed
     */

  }, {
    key: "removeEvent",
    value: function removeEvent(eventType, callback) {
      if (this._eventRegistry[eventType]) {
        var index = this._eventRegistry[eventType].indexOf(callback);

        if (index >= 0) {
          return this._eventRegistry[eventType].splice(index, 1);
        }
      }
    }
    /**
     * attach interaction events to the canvas. the canvas compositor dispatches
     * events to relevant objects through bridges to the scene graph
     */

  }, {
    key: "_bindEvents",
    value: function _bindEvents() {
      //TODO: reimplement touch events?
      //must bind to `this` to retain reference
      this._canvas.addEventListener('mousedown', this._handleMouseDown.bind(this));

      this._canvas.addEventListener('mouseup', this._handleMouseUp.bind(this));

      this._canvas.addEventListener('mousemove', this._handleMouseMove.bind(this));

      this._canvas.addEventListener('mouseout', this._handleMouseOut.bind(this));

      this._canvas.addEventListener('click', this._handleClick.bind(this));
    }
    /**
     * bridge the mouse down event on the canvas to the
     * the objects in the scene graph
     */

  }, {
    key: "_handleMouseDown",
    value: function _handleMouseDown(e) {
      e.preventDefault();
      var x = e.offsetX - this._leftPadding;
      var y = e.offsetY - this._topPadding; //pass through x and y to propagated events

      e.canvasX = x;
      e.canvasY = y;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this._eventRegistry[EVENTS.MOUSEDOWN][Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var callback = _step.value;
          callback(e);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      ;
      var clickedObject = this.scene.childAt(x, y);

      if (clickedObject && clickedObject.onmousedown) {
        clickedObject.onmousedown(e);
      }
    }
    /**
     * bridge the mouse up event on the canvas to the
     * the objects in the scene graph
     */

  }, {
    key: "_handleMouseUp",
    value: function _handleMouseUp(e) {
      e.preventDefault();
      var x = e.offsetX - this._leftPadding;
      var y = e.offsetY - this._topPadding; //pass through x and y to propagated events

      e.canvasX = x;
      e.canvasY = y;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.scene.children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var c = _step2.value;

          if (c.draggable && c.onmouseup) {
            c.onmouseup(e);
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = this._eventRegistry[EVENTS.MOUSEUP][Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var callback = _step3.value;
          callback(e);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3["return"] != null) {
            _iterator3["return"]();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      var clickedObject = this.scene.childAt(x, y);

      if (clickedObject && clickedObject.onmouseup) {
        clickedObject.onmouseup(e);
      }
    }
  }, {
    key: "_handleMouseMove",

    /**
     * bridge the mouse move event on the canvas to the
     * the objects in the scene graph
     */
    value: function _handleMouseMove(e) {
      e.preventDefault();
      var objects = this.scene.children.filter(function (c) {
        return !!c.onmousemove;
      });
      var _iteratorNormalCompletion4 = true;
      var _didIteratorError4 = false;
      var _iteratorError4 = undefined;

      try {
        for (var _iterator4 = this._eventRegistry[EVENTS.MOUSEMOVE][Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
          var callback = _step4.value;
          callback(e);
        }
      } catch (err) {
        _didIteratorError4 = true;
        _iteratorError4 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion4 && _iterator4["return"] != null) {
            _iterator4["return"]();
          }
        } finally {
          if (_didIteratorError4) {
            throw _iteratorError4;
          }
        }
      }

      var _iteratorNormalCompletion5 = true;
      var _didIteratorError5 = false;
      var _iteratorError5 = undefined;

      try {
        for (var _iterator5 = objects[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
          var o = _step5.value;
          o.onmousemove(e);
        }
      } catch (err) {
        _didIteratorError5 = true;
        _iteratorError5 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion5 && _iterator5["return"] != null) {
            _iterator5["return"]();
          }
        } finally {
          if (_didIteratorError5) {
            throw _iteratorError5;
          }
        }
      }
    }
  }, {
    key: "_handleClick",

    /**
     * bridge the click event on the canvas to the
     * the objects in the scene graph
     */
    value: function _handleClick(e) {
      e.preventDefault();
      var x = e.offsetX - this._leftPadding;
      var y = e.offsetY - this._topPadding; //pass through x and y to propagated events

      e.canvasX = x;
      e.canvasY = y; //TODO: FF doesn't get this

      var objects = this.scene.children.filter(function (c) {
        return !!c.onclick;
      });
      var _iteratorNormalCompletion6 = true;
      var _didIteratorError6 = false;
      var _iteratorError6 = undefined;

      try {
        for (var _iterator6 = this._eventRegistry[EVENTS.CLICK][Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
          var callback = _step6.value;
          callback(e);
        }
      } catch (err) {
        _didIteratorError6 = true;
        _iteratorError6 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion6 && _iterator6["return"] != null) {
            _iterator6["return"]();
          }
        } finally {
          if (_didIteratorError6) {
            throw _iteratorError6;
          }
        }
      }

      var _iteratorNormalCompletion7 = true;
      var _didIteratorError7 = false;
      var _iteratorError7 = undefined;

      try {
        for (var _iterator7 = objects[Symbol.iterator](), _step7; !(_iteratorNormalCompletion7 = (_step7 = _iterator7.next()).done); _iteratorNormalCompletion7 = true) {
          var o = _step7.value;
          o.onclick(e);
        }
      } catch (err) {
        _didIteratorError7 = true;
        _iteratorError7 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion7 && _iterator7["return"] != null) {
            _iterator7["return"]();
          }
        } finally {
          if (_didIteratorError7) {
            throw _iteratorError7;
          }
        }
      }
    }
  }, {
    key: "_handleMouseOut",

    /**
     * bridge the mouse out event on the canvas to the
     * the objects in the scene graph
     */
    value: function _handleMouseOut(e) {
      e.preventDefault();
      var objects = this.scene.children.filter(function (c) {
        return !!c.onmouseout;
      });
      var _iteratorNormalCompletion8 = true;
      var _didIteratorError8 = false;
      var _iteratorError8 = undefined;

      try {
        for (var _iterator8 = objects[Symbol.iterator](), _step8; !(_iteratorNormalCompletion8 = (_step8 = _iterator8.next()).done); _iteratorNormalCompletion8 = true) {
          var o = _step8.value;
          o.onmouseout(e);
        }
      } catch (err) {
        _didIteratorError8 = true;
        _iteratorError8 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion8 && _iterator8["return"] != null) {
            _iterator8["return"]();
          }
        } finally {
          if (_didIteratorError8) {
            throw _iteratorError8;
          }
        }
      }

      ;
      var _iteratorNormalCompletion9 = true;
      var _didIteratorError9 = false;
      var _iteratorError9 = undefined;

      try {
        for (var _iterator9 = this._eventRegistry[EVENTS.MOUSEOUT][Symbol.iterator](), _step9; !(_iteratorNormalCompletion9 = (_step9 = _iterator9.next()).done); _iteratorNormalCompletion9 = true) {
          var callback = _step9.value;
          callback(e);
        }
      } catch (err) {
        _didIteratorError9 = true;
        _iteratorError9 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion9 && _iterator9["return"] != null) {
            _iterator9["return"]();
          }
        } finally {
          if (_didIteratorError9) {
            throw _iteratorError9;
          }
        }
      }

      ;
    }
  }, {
    key: "drawBezier",
    value: function drawBezier(start, end, c1, c2, style) {
      _Renderer.Renderer.drawBezier(start, end, c1, c2, this._context, style);
    }
  }, {
    key: "framerate",
    set: function set(val) {
      this._framerate = val;
    },
    get: function get() {
      //var framerateUpdatedEvent = new Event();
      return this._framerate;
    } //TODO: multiple target objects? in reverse order of render? in order of composition?

    /**
     * the object currently selected for interaction
     * @type {object}
     */

  }, {
    key: "targetObject",
    get: function get() {
      return this._targetObject;
    }
    /**
     * the object currently selected for interaction
     * @param {object} val
     * @type {object}
     */
    ,
    set: function set(val) {
      this._targetObject = val;
    }
    /**
     * the root of the scene graph. add primitives to this to compose an image
     * @type {object}
     */

  }, {
    key: "scene",
    get: function get() {
      return this._scene;
    }
  }]);

  return CanvasCompositor;
}();

function init(canvas) {
  return new CanvasCompositor(canvas);
}

},{"./Bezier":7,"./Circle":9,"./Composition":10,"./Ellipse":11,"./Image":12,"./Line":13,"./PrimitiveComponent":14,"./Rectangle":15,"./Renderer":16,"./Text":17,"./VectorPath":18}],9:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Circle = void 0;

var _Renderer = require("./Renderer");

var _PrimitiveComponent2 = require("./PrimitiveComponent");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * A circle
 */
var Circle =
/*#__PURE__*/
function (_PrimitiveComponent) {
  _inherits(Circle, _PrimitiveComponent);

  //TODO: provide details about options for docs - link to a separate page

  /**
   * PrimitiveComponent constructor
   * @param {object} options object settings
   */
  function Circle(options) {
    var _this;

    _classCallCheck(this, Circle);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Circle).call(this, options));
    /**
     * the radius of the circle
     * @type {number} radius
     */

    _this.radius = options.radius || 0;
    return _this;
  }
  /**
   * get the bounding box of the circle;
   * @type {{top:number, left: number, bottom:number, right:number}}
   */


  _createClass(Circle, [{
    key: "render",

    /**
     * override the render function for drawing circles specifically
     * @override
     */
    value: function render() {
      //the below is to ensure the proper placement when scaling/line widths are accounted for
      var scale = this.compoundScale;
      var lineWidth = this.style.lineWidth;

      _Renderer.Renderer.drawCircle(this.radius * scale.scaleWidth + lineWidth, this.radius * scale.scaleHeight + lineWidth, this.radius * scale.scaleWidth, this._prerenderingContext, this.style);
    }
    /**
     * determine whether the point is in the object
     * basically just the pythagorean theorem
     * @param {number} x the x coordinate
     * @param {number} y the y coordinate
     * @return {boolean} whether or not the point is in the object
     */

  }, {
    key: "pointIsInObject",
    value: function pointIsInObject(x, y) {
      var offset = this.offset; //don't bother checking the bounding box because
      //pythagorean formula is closed-form

      var a = x - offset.x;
      var b = y - offset.y;
      var c = this.radius; //thanks pythagoras~!

      return a * a + b * b <= c * c; //use the below when scaling is reimplemented

      /*
      return (
      CanvasObject.prototype.PointIsInObject.call(this, x, y) &&
      Math.pow((x - this.offset.x), 2) / Math.pow((this.radius * this.GlobalScale.scaleWidth), 2) + Math.pow((y - this.offset.y), 2) / Math.pow((this.radius * this.GlobalScale.scaleHeight), 2) <= 1
      );*/
    }
  }, {
    key: "boundingBox",
    get: function get() {
      //TODO: possibly memory-inefficient - need to research:
      //strokes are (were?) centered over the mathematical perimeter -
      //so half the stroke laid within the perimeter, and the
      //other half laid outside. for some reason, this doesn't
      //work for (0 < lineWidth < 2.0).
      //
      //it's just a pixel, but when a thousand objects are on screen,
      //that'll make a difference
      var offset = this.offset;
      var scale = this.compoundScale;
      return {
        top: offset.y - (this.radius * scale.scaleHeight + this.style.lineWidth),
        left: offset.x - (this.radius * scale.scaleWidth + this.style.lineWidth),
        bottom: offset.y + this.radius * scale.scaleHeight + this.style.lineWidth,
        right: offset.x + this.radius * scale.scaleWidth + this.style.lineWidth
      };
    }
  }]);

  return Circle;
}(_PrimitiveComponent2.PrimitiveComponent);

exports.Circle = Circle;

},{"./PrimitiveComponent":14,"./Renderer":16}],10:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Composition = void 0;

var _PrimitiveComponent2 = require("./PrimitiveComponent");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function set(target, property, value, receiver) { if (typeof Reflect !== "undefined" && Reflect.set) { set = Reflect.set; } else { set = function set(target, property, value, receiver) { var base = _superPropBase(target, property); var desc; if (base) { desc = Object.getOwnPropertyDescriptor(base, property); if (desc.set) { desc.set.call(receiver, value); return true; } else if (!desc.writable) { return false; } } desc = Object.getOwnPropertyDescriptor(receiver, property); if (desc) { if (!desc.writable) { return false; } desc.value = value; Object.defineProperty(receiver, property, desc); } else { _defineProperty(receiver, property, value); } return true; }; } return set(target, property, value, receiver); }

function _set(target, property, value, receiver, isStrict) { var s = set(target, property, value, receiver || target); if (!s && isStrict) { throw new Error('failed to set property'); } return value; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * The Composition class is an extension of the Primitive that is
 * composed of other extensions of the Primitive. The Composition
 * is used to establish the Scene graph as the parent of all other
 * objects on screen. This is the key abstraction of the [composite
 * pattern](https://en.wikipedia.org/wiki/Composite_pattern): an
 * action taken on the parent element acts upon all of the children,
 * and transatively, all of their children.
 */
var Composition =
/*#__PURE__*/
function (_PrimitiveComponent) {
  _inherits(Composition, _PrimitiveComponent);

  /**
   * @param {object} options object settings
   */
  function Composition(options) {
    var _this;

    _classCallCheck(this, Composition);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Composition).call(this, options));
    options = options || {};
    _this._children = options.children || [];
    return _this;
  }
  /**
   * children of this composition
   * @type {Array} children the which compose this object
   */


  _createClass(Composition, [{
    key: "childrenAt",

    /**
     * the an array of children that are found at (x, y)
     * @return {object} childrenAt all the children below the point
     * @param {number} x the x coordinate
     * @param {number} y the y coordinate
     */
    value: function childrenAt(x, y) {
      return this.children.filter(function (c) {
        return c.PointIsInObject(x, y);
      });
    }
    /**
     * get the top-most child at the (x, y)
     * @return {object} childAt the first child below the point
     * @param {number} x the x coordinate
     * @param {number} y the y coordinate
     */

  }, {
    key: "childAt",
    value: function childAt(x, y) {
      //loop over the children in reverse because drawing order
      for (var c = this.children.length - 1; c >= 0; c--) {
        if (this.children[c].pointIsInObject(x, y)) {
          return this.children[c];
        }
      }
    }
    /**
     * add a child to this composition
     * @param {object} child the child to be added
     */

  }, {
    key: "addChild",
    value: function addChild(child) {
      child.parent = this;
      this.children.push(child);

      _set(_getPrototypeOf(Composition.prototype), "needsRender", true, this, true);

      _set(_getPrototypeOf(Composition.prototype), "needsDraw", true, this, true); //TODO: make this hook more generic
      //by using a registry
      //if (this.onchildadded) {
      //  this.onchildadded();
      //}

    }
    /**
     * remove a child from this composition
     * @param {object} child the child to be removed
     * @return {object} the child removed
     */

  }, {
    key: "removeChild",
    value: function removeChild(child) {
      if (child) {
        var index = this.children.indexOf(child);

        if (index >= 0) {
          _set(_getPrototypeOf(Composition.prototype), "needsRender", true, this, true);

          _set(_getPrototypeOf(Composition.prototype), "needsDraw", true, this, true);

          return this.children.splice(index, 1);
        }
      }
    }
  }, {
    key: "render",

    /**
     * @override
     * override the render functiont to render the children onto this compositions prerendering canvas
     */
    value: function render() {
      // required to make sure that the drawing occurs within the bounds of this composition
      var boundingBox = this.boundingBox;
      var offset = {
        top: -boundingBox.top,
        left: -boundingBox.left,
        bottom: -boundingBox.bottom,
        right: -boundingBox.right
      };
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var c = _step.value;
          c.draw(this._prerenderingContext, offset);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }

      ; // `destination-out` will erase things
      //this._prerenderingContext.globalCompositeOperation = 'destination-out';
      //_.each(this.masks, function (m) {
      //m.draw(renderContext, contextOffset);
      //});
      //renderContext.globalCompositeOperation = 'normal';
    }
  }, {
    key: "children",
    get: function get() {
      return this._children;
    }
    /**
     * the bounding box of the composition (i.e., the containing bounds of all the children of this composition)
     * @type {{top:number, left:number, right:number, bottom:number}} boundingBox
     */

  }, {
    key: "boundingBox",
    get: function get() {
      var top = Infinity,
          left = Infinity,
          bottom = -Infinity,
          right = -Infinity;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var c = _step2.value;
          var boundingBox = c.boundingBox;
          top = Math.min(boundingBox.top, top);
          left = Math.min(boundingBox.left, left);
          bottom = Math.max(boundingBox.bottom, bottom);
          right = Math.max(boundingBox.right, right);
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      ;
      return {
        top: top,
        left: left,
        bottom: bottom,
        right: right
      };
    }
  }]);

  return Composition;
}(_PrimitiveComponent2.PrimitiveComponent);

exports.Composition = Composition;

},{"./PrimitiveComponent":14}],11:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Ellipse = void 0;

var _Renderer = require("./Renderer");

var _PrimitiveComponent2 = require("./PrimitiveComponent");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * An ellipse
 */
var Ellipse =
/*#__PURE__*/
function (_PrimitiveComponent) {
  _inherits(Ellipse, _PrimitiveComponent);

  /**
   * @param {object} options options for the ellipse
   * @param {number} options.radius the major (horizontal) radius of the ellipse
   * @param {number} options.minorRadius the minor (vertical) radius of the ellipse
   */
  function Ellipse(options) {
    var _this;

    _classCallCheck(this, Ellipse);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Ellipse).call(this, options));
    /**
     * @type {number} radius the major radius (horizontal) of the ellipse
     */

    _this.radius = options.radius || 0;
    /**
     * @type {number} minorRadius the minor radius (vertical) of the ellipse
     */

    _this.minorRadius = options.minorRadius || _this.radius || 0;
    return _this;
  }
  /**
   * the bounding box for the ellipse
   * @type {{top: number, left: number, bottom: number, right: number}} boundingBox
   */


  _createClass(Ellipse, [{
    key: "render",

    /**
     * override the render function specifically for ellipses
     * @override
     */
    value: function render() {
      var scale = this.compoundScale;
      var lineWidth = this.style.lineWidth; //TODO: work out scaling of major/minor radius
      //this doesn't make sense

      _Renderer.Renderer.drawEllipse(this.radius * scale.scaleWidth + lineWidth, this.minorRadius * scale.scaleHeight + lineWidth, this.radius * scale.scaleWidth, this.minorRadius * scale.scaleHeight, this._prerenderingContext, this.style);
    }
    /**
     * determine whether the point is in the object
     * basically just the pythagorean theorem
     * @param {number} x the x coordinate
     * @param {number} y the y coordinate
     * @return {boolean} whether or not the point is in the object
     */

  }, {
    key: "pointIsInObject",
    value: function pointIsInObject(x, y) {
      var scale = this.compoundScale;
      var offset = this.offset;
      var a = x - offset.x;
      var b = y - offset.y;
      var c1 = this.radius * scale.scaleWidth;
      var c2 = this.minorRadius * scale.scaleHeight; //see: http://math.stackexchange.com/questions/76457/check-if-a-point-is-within-an-ellipse

      return a * a / (c1 * c1) + b * b / (c2 * c2) <= 1;
    }
  }, {
    key: "boundingBox",
    get: function get() {
      var offset = this.offset;
      var scale = this.compoundScale;
      var lineWidth = this.style.lineWidth;
      return {
        top: offset.y - (this.minorRadius * scale.scaleHeight + lineWidth),
        left: offset.x - (this.radius * scale.scaleWidth + lineWidth),
        bottom: offset.y + this.minorRadius * scale.scaleHeight + lineWidth,
        right: offset.x + this.radius * scale.scaleWidth + lineWidth
      };
    }
  }]);

  return Ellipse;
}(_PrimitiveComponent2.PrimitiveComponent);

exports.Ellipse = Ellipse;

},{"./PrimitiveComponent":14,"./Renderer":16}],12:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Image = void 0;

var _Renderer = require("./Renderer");

var _PrimitiveComponent2 = require("./PrimitiveComponent");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * an Image
 */
var Image =
/*#__PURE__*/
function (_PrimitiveComponent) {
  _inherits(Image, _PrimitiveComponent);

  /**
   * @param {Object} options
   */
  function Image(options) {
    var _this;

    _classCallCheck(this, Image);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Image).call(this, options));
    /**
     * @type {window.Image} unscaledImage the original image
     */

    _this.unscaledImage = options.image;
    return _this;
  }
  /**
   * get the bounding box
   * @type {{top: number, left: number, bottom: number, right:number}} boundingBox
   */


  _createClass(Image, [{
    key: "render",

    /**
     * override the render function for images specifically
     * @override
     */
    value: function render() {
      var scale = this.compoundScale;
      var image = new window.Image();
      image.src = this.unscaledImage.src;
      image.width = this.unscaledImage.width * scale.scaleWidth;
      image.height = this.unscaledImage.height * scale.scaleHeight;

      _Renderer.Renderer.drawImage(0, 0, image, this._prerenderingContext, this.style);
    }
  }, {
    key: "boundingBox",
    get: function get() {
      var compoundScale = this.compoundScale;
      var offset = this.offset;
      return {
        top: offset.y,
        left: offset.x,
        bottom: offset.y + compoundScale.scaleHeight * this.unscaledImage.height,
        right: offset.x + compoundScale.scaleWidth * this.unscaledImage.width
      };
    }
  }]);

  return Image;
}(_PrimitiveComponent2.PrimitiveComponent);

exports.Image = Image;

},{"./PrimitiveComponent":14,"./Renderer":16}],13:[function(require,module,exports){
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

},{"vectorious":5}],14:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.PrimitiveComponent = void 0;

var _vectorious = require("vectorious");

var _Renderer = require("./Renderer");

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * The base class of things that may be drawn on the canvas.
 * All drawable objects should inherit from this class.
 * Typically, it is unnecessary for application programmers to
 * call this directly, although they may wish to extend their own
 * classes with it.
 */
var PrimitiveComponent =
/*#__PURE__*/
function () {
  /**
   * @param {object} options
   */
  function PrimitiveComponent(options) {
    _classCallCheck(this, PrimitiveComponent);

    options = options || {};
    this._flags = {};
    this._flags.DEBUG = options.debug || false;
    /**
     * does the object need to be redrawn?
     * @type {boolean} _needsDraw
     */

    this._needsDraw = true;
    /**
     * does the object need to be rendered?
     * @type {boolean} _needsRender
     */

    this._needsRender = true;
    /**
     * the horizontal scale of the object. defaults to 1
     * @type {number} _scaleWidth
     */

    this._scaleWidth = 1;
    /**
     * the vertical scale of the object. defaults to 1
     * @type {number} _scaleHeight
     */

    this._scaleHeight = 1;
    /**
     * d is for "displacement": a 2D Vector object representing cartesian coordinate
     * position relative to its parent composition (or [0,0] if this is the scene composition)
     * @type {object} d
     */

    this._d = new _vectorious.Vector([options.x || 0, options.y || 0]);
    /**
     * style options for this particular object. these are standard context styles
     * @type {object} style
     */

    this.style = Object.assign({}, _Renderer.DEFAULTS, options.style);
    /**
     * objects with pressPassThrough set to true will allow mouse clicks to pass
     * through to objects behind them
     * @type {boolean} pressPassThrough
     */
    //this.pressPassThrough = options.pressPassThrough || false;

    /**
     * if true, the object can be dragged around the canvas
     * @type {boolean} draggable
     */

    this.draggable = options.draggable || false;
    /**
     * if true, the bounding box of the object will be draw
     * @type {boolean} drawBoundingBox
     */
    //this.drawBoundingBox = false;
    //this.boundingBoxColor = '#cccccc';

    /**
     * the prerendering canvas is used to avoid performing mutliple draw operations on the
     * visible, main canvas. this minimizes the time needed to render by prerendering on a
     * canvas only as large as necessary for the object
     * @type {object} _prerenderingCanvas
     */

    this._prerenderingCanvas = document.createElement('canvas');
    /**
     * the 2D context of the prerendering canvas.
     * @type {object} _prerenderingCanvas
     */

    this._prerenderingContext = this._prerenderingCanvas.getContext('2d');
    /**
     * the parent object of this object. with the exception of the scene composition itself,
     * the root of all objects ancestry should be the scene composition
     * @type {object} parent
     */

    this._parent = options.parent || null;
    /**
     * a callback for the mousedown event.
     * @type {function} onmousedown
     */

    this.onmousedown = null;
    /**
     * a callback for the mouseup event.
     * @type {function} onmouseup
     */

    this.onmouseup = null;
    /**
     * a callback for the mousemove event.
     * @type {function} onmousemove
     */

    this.onmousemove = null;
    /**
     * a callback for the mouseout event.
     * @type {function} onmouseout
     */

    this.onmouseout = null;
    /**
     * a callback for the click event.
     * @type {function} onclick
     */

    this.onclick = null;

    if (this.draggable) {
      this.enableDragging();
    }
  }
  /**
   * the global offset of the object on the canvas.
   * this is the sum of this object's displacement
   * and all of its ancestry.
   * @type {object} offset a 2D Vector representing displacement from [0, 0]
   */


  _createClass(PrimitiveComponent, [{
    key: "enableDragging",

    /**
     * enable dragging by setting the onmousedown event callback
     */
    value: function enableDragging() {
      //TODO: should probably be using an event registry so
      //multiple event callbacks can be registered
      this.onmousedown = this.dragStart;
    }
    /**
     * disable dragging by removing event callbacks
     */

  }, {
    key: "disableDragging",
    value: function disableDragging() {
      //TODO: should probably be using an event registry so
      //multiple event callbacks can be registered
      this.onmousedown = null;
      this.onmousemove = null;
      this.onmouseup = null;
      this.onmouseout = null;
      this.needsDraw = true;
    }
    /**
     * when dragging starts, update events
     * @param {object} e the event object
     */

  }, {
    key: "dragStart",
    value: function dragStart(e) {
      //TODO: should probably be using an event registry so
      //multiple event callbacks can be registered
      this._mouseOffset = new _vectorious.Vector([e.offsetX, e.offsetY]).subtract(this.offset);
      this.onmousedown = null;
      this.onmousemove = this.drag;
      this.onmouseup = this.dragEnd;
      this.onmouseout = this.dragEnd;
    }
    /**
     * update d as the object is moved around
     * @param {object} e the event object
     */

  }, {
    key: "drag",
    value: function drag(e) {
      this.d = new _vectorious.Vector([e.offsetX, e.offsetY]).subtract(this._mouseOffset);
      this.needsDraw = true;
    }
    /**
     * when dragging ends, update events
     * @param {object} e the event object
     */

  }, {
    key: "dragEnd",
    value: function dragEnd(e) {
      this.onmousedown = this.dragStart;
      this.onmousemove = null;
      this.onmouseup = null;
      this.onmouseout = null;
      this.needsDraw = true;
    }
    /**
     * draw the object to canvas, render it if necessary
     * @param {object} context the final canvas context where this will be drawn
     * @param {object} offset the offset on the canvas - optional, used for prerendering
     */

  }, {
    key: "draw",
    value: function draw(context, offset) {
      var boundingBox = this.boundingBox;
      this.needsDraw = false;

      if (this.needsRender && this.render) {
        //ditch any old rendering artifacts - they are no longer viable
        delete this._prerenderingCanvas;
        delete this._prerenderingContext; //create a new canvas and context for rendering

        this._prerenderingCanvas = document.createElement('canvas');
        this._prerenderingContext = this._prerenderingCanvas.getContext('2d'); //text needs prerendering context defined for boundingBox measurements
        //make sure the new canvas has the appropriate dimensions

        this._prerenderingCanvas.width = boundingBox.right - boundingBox.left;
        this._prerenderingCanvas.height = boundingBox.bottom - boundingBox.top;
        this.render();
        this.needsRender = false;
      } //TODO: handle debug options
      //draw bounding boxes


      if (this._flags.DEBUG) {
        this._prerenderingContext.beginPath();

        this._prerenderingContext.setLineDash([5, 15]);

        this._prerenderingContext.lineWidth = 2.0;
        this._prerenderingContext.strokeStyle = '#FF0000';
        this._prerenderingContext.strokeStyle = '#FF0000';

        this._prerenderingContext.strokeRect(0, 0, this._prerenderingCanvas.width, this._prerenderingCanvas.height);

        this._prerenderingContext.closePath();
      } //TODO: handle bounding box drawing

      /*if (this.drawBoundingBox){
      	this._prerenderingContext.beginPath();
      	this._prerenderingContext.lineWidth=2.0;
      	this._prerenderingContext.strokeStyle=this.boundingBoxColor;
      	this._prerenderingContext.strokeRect(0,0,this._prerenderingCanvas.width, this._prerenderingCanvas.height);
      	this._prerenderingContext.closePath();
      }*/
      //offsets are for prerendering contexts of compositions


      var x = boundingBox.left + (offset && offset.left ? offset.left : 0);
      var y = boundingBox.top + (offset && offset.top ? offset.top : 0);

      _Renderer.Renderer.drawImage(x, y, this._prerenderingCanvas, context, this.style);
    } //TODO: provide more doc details around this

    /**
     * this method must be overridden by a subclass.
     *
     * the render method should be implemented by subclasses
     * @abstract
     */

  }, {
    key: "render",
    value: function render() {}
    /**
     * check whether the point specified lies *inside* this objects bounding box
     *
     * @param {number} x the x coordinate
     * @param {number} y the y coordinate
     * @return {boolean} whether the point is within the bounding box
     */

  }, {
    key: "pointIsInBoundingBox",
    value: function pointIsInBoundingBox(x, y) {
      var boundingBox = this.boundingBox;
      return x > boundingBox.left && y > boundingBox.top && x < boundingBox.right && y < boundingBox.bottom;
    }
    /**
     * check whether the point is within the object.
     * this method should be overridden by subclassess
     *
     * @param {number} x the x coordinate
     * @param {number} y the y coordinate
     * @return {boolean} whether the point is in the object, as implemented by inheriting classes
     */

  }, {
    key: "pointIsInObject",
    value: function pointIsInObject(x, y) {
      return this.pointIsInBoundingBox(x, y);
    }
    /**
     * move the object on top of other objects (render last)
     */

  }, {
    key: "moveToFront",
    value: function moveToFront() {
      if (this.parent) {
        var index = this.parent.children.indexOf(this);

        if (index >= 0) {
          this.parent.children.splice(index, 1);
          this.parent.children.splice(this.parent.children.length, 0, this);
          this.needsDraw = true;
        }
      }
    }
    /**
     * move the object below the other objects (render first)
     */

  }, {
    key: "moveToBack",
    value: function moveToBack() {
      if (this.parent) {
        var index = this.parent.children.indexOf(this);

        if (index >= 0) {
          this.parent.children.splice(index, 1);
          this.parent.children.splice(0, 0, this);
          this.needsDraw = true;
        }
      }
    }
    /**
     * move the object forward in the stack (drawn later)
     */

  }, {
    key: "moveForward",
    value: function moveForward() {
      if (this.parent) {
        var index = this.parent.children.indexOf(this);

        if (index >= 0 && index < this.parent.children.length - 1) {
          this.parent.children.splice(index, 1);
          this.parent.children.splice(index + 1, 0, this); //if index + 1 > siblings.length, inserts it at end

          this.parent.UpdateChildrenLists();
          this.needsRender = true;
          this.needsDraw = true;
        }
      }
    }
    /**
     * move the object backward in the stack (drawn sooner)
     */

  }, {
    key: "moveBackward",
    value: function moveBackward() {
      if (this.parent) {
        var index = this.parent.children.indexOf(this);

        if (index > 0) {
          this.parent.children.splice(index, 1);
          this.parent.children.splice(index - 1, 0, this);
          this.parent.UpdateChildrenLists();
          this.needsRender = true;
          this.needsDraw = true;
        }
      }
    }
  }, {
    key: "offset",
    get: function get() {
      return this.parent ? _vectorious.Vector.add(this.d, this.parent.offset) : this.d;
    }
    /**
     * returns true whenever the object needs to be re-drawn to canvas.
     * when true, this will indicate to the parent tree of composing objects that
     * the object needs to be re-drawn on the next animation loop.
     *
     * objects need to be updated when their displacement changes, or when any thing
     * that requires a rerender occurs.
     *
     * @type {boolean} needsDraw
     */

  }, {
    key: "needsDraw",
    get: function get() {
      return this._needsDraw;
    }
    /**
     * set to true whenever the object needs to be re-drawn to canvas.
     * when true, this will indicate to the parent tree of composing objects that
     * the object needs to be re-drawn on the next animation loop.
     *
     * objects need to be updated when their displacement changes, or when any thing
     * that requires a rerender occurs.
     *
     * @type {boolean} needsDraw
     */
    ,
    set: function set(val) {
      if (this.parent && val) {
        this.parent.needsDraw = val;
        this.parent.needsRender = true; // if this needs to be redrawn, then the parent needs a full rerender
      }

      this._needsDraw = val;
    }
    /**
     * returns true whenever the object's properties have changed such that
     * it needs to be rendered differently
     *
     * 1. scale change
     * 1. physical property change (height, width, radius, etc.)
     * 1. color change
     *
     * @type {boolean} needsRender
     */

  }, {
    key: "needsRender",
    get: function get() {
      return this._needsRender;
    }
    /**
     * set to true whenever the object's properties have changed such that
     * it needs to be rendered differently
     *
     * 1. scale change
     * 1. physical property change (height, width, radius, etc.)
     * 1. color change
     *
     * @type {boolean} needsRender
     */
    ,
    set: function set(val) {
      if (this.parent && val) {
        this.parent.needsRender = val;
      }

      this._needsRender = val;
    }
    /**
     * return the horizontal scale of the object - defaults to 1
     * @type {number} scaleWidth
     */

  }, {
    key: "scaleWidth",
    get: function get() {
      return this._scaleWidth;
    }
    /**
     * set the horizontal scale of the object - defaults to 1
     * @type {number} scaleWidth
     */
    ,
    set: function set(val) {
      this._scaleWidth = val;
      this.needsRender = true;
      this.needsDraw = true;
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = this.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var c = _step.value;
          c.needsRender = true;
          c.needsDraw = true;
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator["return"] != null) {
            _iterator["return"]();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }
    /**
     * return the vertical scale of the object - defaults to 1
     * @type {number} scaleHeight
     */

  }, {
    key: "scaleHeight",
    get: function get() {
      return this._scaleHeight;
    }
    /**
     * set the vertical scale of the object - defaults to 1
     * @type {number} scaleHeight
     * @param {number} val the vertical scale
     */
    ,
    set: function set(val) {
      this._scaleHeight = val;
      this.needsRender = true;
      this.needsDraw = true;
      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = this.children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var c = _step2.value;
          c.needsRender = true;
          c.needsDraw = true;
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2["return"] != null) {
            _iterator2["return"]();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }
    }
    /**
     * return an object containing the vertical and horizontal scale
     * @type {object} scale
     */

  }, {
    key: "scale",
    get: function get() {
      return {
        scaleWidth: this.scaleWidth,
        scaleHeight: this.scaleHeight
      };
    }
    /**
     * set the scale width and height in one go
     * @type {number} scale
     */
    ,
    set: function set(val) {
      this.scaleHeight = val;
      this.scaleWidth = val;
    }
    /**
     * return the scale of the object, compounded with the parent object's scale
     * @type {{scaleWidth: number, scaleHeight: number}} compoundScale the scale multiplied by the compound scale of its parent or 1
     */

  }, {
    key: "compoundScale",
    get: function get() {
      return {
        scaleWidth: this.parent ? this.scaleWidth * this.parent.compoundScale.scaleWidth : this.scaleWidth,
        scaleHeight: this.parent ? this.scaleHeight * this.parent.compoundScale.scaleHeight : this.scaleHeight
      };
    }
    /**
     * d is for displacement - returns a vector
     * @type {object} d
     */

  }, {
    key: "d",
    get: function get() {
      return this._d;
    }
    /**
     * d is for displacement - accepts a vector
     * @type {object} d
     * @param {object} val a vector
     */
    ,
    set: function set(val) {
      this._d = val;
    }
    /**
     * get the parent of the object. all objects except the scene graph should have a parent
     * @type {object} parent
     */

  }, {
    key: "parent",
    get: function get() {
      return this._parent;
    } //TODO: provide links to things

    /**
     * set the parent of the object. all objects except the scene graph should have a parent
     * @type {object} parent
     * @param {object} val a composition
     */
    ,
    set: function set(val) {
      this._parent = val;
    }
  }]);

  return PrimitiveComponent;
}();

exports.PrimitiveComponent = PrimitiveComponent;

},{"./Renderer":16,"vectorious":5}],15:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Rectangle = void 0;

var _Renderer = require("./Renderer");

var _PrimitiveComponent2 = require("./PrimitiveComponent");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

/**
 * A rectangle
 */
var Rectangle =
/*#__PURE__*/
function (_PrimitiveComponent) {
  _inherits(Rectangle, _PrimitiveComponent);

  /**
   * @param {object} options the options for the object
   */
  function Rectangle(options) {
    var _this;

    _classCallCheck(this, Rectangle);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Rectangle).call(this, options));
    /**
     * the width of the rectangle
     * @type {number} width
     */

    _this.width = options.width || 0;
    /**
     * the height of the rectangle
     * @type {number} height
     */

    _this.height = options.height || 0;
    return _this;
  }
  /**
   * get the bounding box of the rectangle
   * @type {{top:number, left:number, bottom:number, right:number}} boundingBox
   */


  _createClass(Rectangle, [{
    key: "render",

    /**
     * render the rectangle
     * @override
     */
    value: function render() {
      var compoundScale = this.compoundScale;

      _Renderer.Renderer.drawRectangle(this.style.lineWidth, this.style.lineWidth, this.width * compoundScale.scaleWidth, this.height * compoundScale.scaleHeight, this._prerenderingContext, this.style);
    }
  }, {
    key: "boundingBox",
    get: function get() {
      var offset = this.offset;
      var compoundScale = this.compoundScale;
      return {
        top: offset.y - this.style.lineWidth,
        left: offset.x - this.style.lineWidth,
        bottom: offset.y + compoundScale.scaleHeight * this.height + this.style.lineWidth,
        right: offset.x + compoundScale.scaleWidth * this.width + this.style.lineWidth
      };
    }
  }]);

  return Rectangle;
}(_PrimitiveComponent2.PrimitiveComponent);

exports.Rectangle = Rectangle;

},{"./PrimitiveComponent":14,"./Renderer":16}],16:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Renderer = exports.DEFAULTS = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

/**
 * Default style values for the renderer
 */
var DEFAULTS = {
  //direction: 'inherit',
  fillStyle: 'black',
  //filter: 'none',
  strokeStyle: 'black',
  lineCap: 'round',
  lineWidth: 1.0,
  lineJoin: 'round',
  miterLimit: 10,
  font: '10px sans-serif',
  textAlign: 'start',
  textBaseline: 'alphabetic' //TODO: masking? it looks like this is done in the Composition, but that may be bugged out.

  /**
   * A collection of high level static methods for drawing directly to canvas
   *
   */

};
exports.DEFAULTS = DEFAULTS;

var Renderer =
/*#__PURE__*/
function () {
  function Renderer() {
    _classCallCheck(this, Renderer);
  }

  _createClass(Renderer, null, [{
    key: "clearRect",

    /**
     * Erase everything drawn on the supplied rectangle for the given context.
     * @param {number} x the x coordinate of the top left corner
     * @param {number} y the y coordinate of the top left corner
     * @param {number} width the x coordinate
     * @param {number} height the y coordinate
     * @param {object} context the 2D Context object for the canvas we're drawing onto
     */
    value: function clearRect(x, y, width, height, context) {
      context.clearRect(x, y, width, height);
    }
    /**
     * Draw a path, unclosed, with the given vertices
     * @param {object} vertices the path of vertices to be drawn
     * @param {object} context the 2D Context object for the canvas we're drawing onto
     * @param {object} style the style options to be used when drawing the path
     */

  }, {
    key: "drawPath",
    value: function drawPath(vertices, context, style) {
      Object.assign(context, style);
      context.beginPath();
      context.moveTo(vertices[0].x, vertices[0].y);

      for (var v = 1; v < vertices.length; v++) {
        context.lineTo(vertices[v].x, vertices[v].y);
      }

      context.stroke();
    }
    /**
     * Draw a closed polygon with the given vertices
     * @param {object} vertices the path of vertices to be drawn
     * @param {object} context the 2D Context object for the canvas we're drawing onto
     * @param {object} style the style options to be used when drawing the polygon
     */

  }, {
    key: "drawPolygon",
    value: function drawPolygon(vertices, context, style) {
      Object.assign(context, style);
      context.beginPath();
      context.moveTo(vertices[0].x, vertices[0].y);

      for (var v = 1; v < vertices.length; v++) {
        context.lineTo(vertices[v].x, vertices[v].y);
      }

      context.closePath();
      context.stroke();
    }
  }, {
    key: "drawBezier",
    value: function drawBezier(start, end, c1, c2, context, style) {
      Object.assign(context, style); //must `beginPath()` before `moveTo` to get correct starting position

      context.beginPath();
      context.moveTo(start.x, start.y);
      context.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, end.x, end.y);
      context.stroke();
      context.closePath();
    }
    /**
     * Draw a rectangle
     * @param {number} x the x coordinate of the top let corner
     * @param {number} y the y coordinate of the top left corner
     * @param {number} width the x coordinate
     * @param {number} height the y coordinate
     * @param {object} context the 2D Context object for the canvas we're drawing onto
     * @param {object} style the style options to be used when drawing the rectangle
     */

  }, {
    key: "drawRectangle",
    value: function drawRectangle(x, y, width, height, context, style) {
      Object.assign(context, style);
      context.rect(x, y, width, height);
      context.fill();
      context.stroke();
    } //TODO: provide support for rotation and startAngle parameters

    /**
     * Draw an ellipse
     * @param {number} x the x coordinate of the center of the ellipse
     * @param {number} y the y coordinate of the center of the ellipse
     * @param {number} radius the larger radius of the ellipse
     * @param {number} minorRadius the smaller radius of the ellipse
     * @param {object} context the 2D Context object for the canvas we're drawing onto
     * @param {object} style the style options to be used when drawing the ellipse
     */

  }, {
    key: "drawEllipse",
    value: function drawEllipse(x, y, radius, minorRadius, context, style) {
      Object.assign(context, style); //TODO: 2017-05-22 this is currently not supported by IE

      context.ellipse(x, y, radius, minorRadius, 0, 0, 2 * Math.PI);
      context.fill();
      context.stroke();
    }
    /**
     * Draw a circle
     * @param {number} x the x coordinate of the center of the circle
     * @param {number} y the y coordinate of the center of the circle
     * @param {number} radius of the circle
     * @param {object} context the 2D Context object for the canvas we're drawing onto
     * @param {object} style the style options to be used when drawing the circle
     */

  }, {
    key: "drawCircle",
    value: function drawCircle(x, y, radius, context, style) {
      Object.assign(context, style);
      context.arc(x, y, radius, 0, 2 * Math.PI); //TODO: 2015-03-12 this is currently only supported by chrome & opera
      //context.ellipse(x, y, radius, radius, 0, 0, 2 * Math.PI);

      context.fill();
      context.stroke();
    }
    /**
     * Draw text
     * @param {number} x the x coordinate of the top let corner
     * @param {number} y the y coordinate of the top left corner
     * @param {string} text the text to be drawn
     * @param {object} context the 2D Context object for the canvas we're drawing onto
     * @param {object} style the style options to be used when drawing the text
     */

  }, {
    key: "drawText",
    value: function drawText(x, y, text, context, style) {
      Object.assign(context, style);
      context.fillText(text, x, y); //TODO: implement stroke text if specified
    }
    /**
     * Draw an image
     * @param {number} x the x coordinate of the top let corner
     * @param {number} y the y coordinate of the top left corner
     * @param {object} image the image to be drawn to the canvas
     * @param {object} context the 2D Context object for the canvas we're drawing onto
     * @param {object} style the style options to be used when drawing the image
     */

  }, {
    key: "drawImage",
    value: function drawImage(x, y, image, context, style) {
      Object.assign(context, style); //no reason to draw 0-sized images

      if (image.width > 0 && image.height > 0) {
        context.drawImage(image, x, y, image.width, image.height);
      }
    } //TODO: this should probably be exposed elsewhere/differently

    /**
     * Measure the text
     * @param {string} text the text to be measured
     * @param {object} context the 2D Context object for a canvas - required for measurement to occur, but may be arbitrary
     * @param {object} style the style options to be used when measuring the text
     * @return {object} [TextMetrics](https://developer.mozilla.org/en-US/docs/Web/API/TextMetrics) object containing info like Width
     */

  }, {
    key: "measureText",
    value: function measureText(text, context, style) {
      Object.assign(context, style);
      return context.measureText(text);
    }
  }]);

  return Renderer;
}();

exports.Renderer = Renderer;

},{}],17:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.Text = void 0;

var _Renderer = require("./Renderer");

var _PrimitiveComponent2 = require("./PrimitiveComponent");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var ALL_CHARS = "1234567890QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm.,`~;:'\"!?@#$%^&*()_+={}[]|<>/";
var DEFAULTS = {
  fontSize: '16px',
  fontFamily: 'sans-serif',
  fontStyle: 'normal',
  fontVariant: 'normal',
  fontWeight: 'normal',
  lineHeight: 'normal',
  textAlign: 'start',
  textBaseline: 'alphabetic'
};

function _getTextHeight(font) {
  //this is a version of:
  //http://stackoverflow.com/questions/1134586/how-can-you-find-the-height-of-text-on-an-html-canvas
  //it's a pretty awful hack.
  //TODO: figure out how cross-browser this is
  //create an element with every character in it with this font
  var fontHolder = document.createElement('span');
  fontHolder.innerText = ALL_CHARS;
  fontHolder.style.font = font; //create an inline-block to place after the element

  var baselineRuler = document.createElement('div');
  baselineRuler.style.display = 'inline-block';
  baselineRuler.style.width = '1px';
  baselineRuler.style.height = '0';
  baselineRuler.style.verticalAlign = 'baseline'; //place them in a wrapper and add it to the body

  var wrapper = document.createElement('div');
  wrapper.appendChild(fontHolder);
  wrapper.appendChild(baselineRuler);
  wrapper.style.whiteSpace = 'nowrap';
  document.body.appendChild(wrapper); //get their bounding rectangles and...

  var fontRect = fontHolder.getBoundingClientRect();
  var baselineRect = baselineRuler.getBoundingClientRect(); //calculate their offset from top

  var fontTop = fontRect.top + document.body.scrollTop;
  var fontBottom = fontTop + fontRect.height;
  var baseline = baselineRect.top + document.body.scrollTop;
  document.body.removeChild(wrapper); //ascent equals the baseline location minus text top location

  var ascentFromBaseline = baseline - fontTop; //decent equals the text bottom location minuse the baseline location

  var descentFromBaseline = fontBottom - baseline;
  return {
    height: fontRect.height,
    ascent: ascentFromBaseline,
    descent: descentFromBaseline
  };
}
/**
 * A text object
 */


var Text =
/*#__PURE__*/
function (_PrimitiveComponent) {
  _inherits(Text, _PrimitiveComponent);

  /**
   * @param {object} options the options for the text object
   */
  function Text(options) {
    var _this;

    _classCallCheck(this, Text);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(Text).call(this, options));
    /**
     * @type {string} text the text to be rendered
     */

    _this.text = options.text;
    /**
     * @type {string} fontSize the font size at which to render the text
     */

    _this.fontSize = options.fontSize || DEFAULTS.fontSize;
    /**
     * @type {string} fontFamily the font family in which to render the text
     */

    _this.fontFamily = options.fontFamily || DEFAULTS.fontFamily;
    /**
     * @type {string} fontStyle the font style with which to render the text
     */

    _this.fontStyle = options.fontStyle || DEFAULTS.fontStyle;
    /**
     * @type {string} fontVariant the font variant in which to render the text
     */

    _this.fontVariant = options.fontVariant || DEFAULTS.fontVariant;
    /**
     * @type {string} fontWeight the font weight at which to render the text
     */

    _this.fontWeight = options.fontWeight || DEFAULTS.fontWeight;
    /**
     * @type {string} lineHeight the line height of the text
     */

    _this.lineHeight = options.lineHeight || DEFAULTS.lineHeight;
    /**
     * @type {string} textAlign the alignment with which to render the text
     */

    _this.textAlign = options.textAlign || DEFAULTS.textAlign;
    /**
     * @type {string} textBaseline the baseline for the text
     */

    _this.textBaseline = options.textBaseline || DEFAULTS.textBaseline;
    _this._textMetricsNeedUpdate = true;
    return _this;
  }
  /**
   * compute the height data and add it to the textMetrics object from the canvas context
   * @type {object} textMetrics
   */


  _createClass(Text, [{
    key: "_updateStyle",
    value: function _updateStyle(options) {
      Object.assign(this.style, options, {
        font: "".concat(this.fontStyle, " ").concat(this.fontVariant, " ").concat(this.fontWeight, " ").concat(this.fontSize, "/").concat(this.lineHeight, " ").concat(this.fontFamily),
        textAlign: this.textAlign,
        textBaseline: this.textBaseline
      });
    }
    /**
     * override the render function for text objects
     * @override
     */

  }, {
    key: "render",
    value: function render() {
      this._textMetricsNeedUpdate = true;

      this._updateStyle();

      _Renderer.Renderer.drawText(0, this.textMetrics.ascent, this.text, this._prerenderingContext, this.style);
      /*if (this.flags.DEBUG) {
          Renderer.drawPath(this._prerenderingContext, [{
              x: 0,
              y: this.textMetrics.ascent
          }, {
              x: this.textMetrics.width,
              y: this.textMetrics.ascent
          }], {
              strokeStyle: 'Blue'
          });
          Renderer.drawCircle(this._prerenderingContext, 0, this.textMetrics.ascent, 3, {
              strokeStyle: 'Blue',
              fillStyle: 'Blue'
          });
      }*/

    }
  }, {
    key: "textMetrics",
    get: function get() {
      if (this._textMetricsNeedUpdate || this._textMetrics === null) {
        this._updateStyle();

        this._textMetrics = _Renderer.Renderer.measureText(this.text, this._prerenderingContext, this.style);
        Object.assign(this._textMetrics, _getTextHeight(this.style.font));
        this._textMetricsNeedUpdate = false;
      }

      return this._textMetrics;
    }
    /**
     * get the bounding box of the text object
     * @type {top: number, left: number, bottom: number, right: number}
     */

  }, {
    key: "boundingBox",
    get: function get() {
      return {
        top: this.offset.y - this.textMetrics.ascent,
        left: this.offset.x,
        bottom: this.offset.y + this.textMetrics.descent,
        right: this.offset.x + this.textMetrics.width
      };
    }
  }]);

  return Text;
}(_PrimitiveComponent2.PrimitiveComponent);

exports.Text = Text;

},{"./PrimitiveComponent":14,"./Renderer":16}],18:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.VectorPath = void 0;

var _Renderer = require("./Renderer");

var _PrimitiveComponent2 = require("./PrimitiveComponent");

var _vectorious = require("vectorious");

var _Line = require("./Line");

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _get(target, property, receiver) { if (typeof Reflect !== "undefined" && Reflect.get) { _get = Reflect.get; } else { _get = function _get(target, property, receiver) { var base = _superPropBase(target, property); if (!base) return; var desc = Object.getOwnPropertyDescriptor(base, property); if (desc.get) { return desc.get.call(receiver); } return desc.value; }; } return _get(target, property, receiver || target); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function set(target, property, value, receiver) { if (typeof Reflect !== "undefined" && Reflect.set) { set = Reflect.set; } else { set = function set(target, property, value, receiver) { var base = _superPropBase(target, property); var desc; if (base) { desc = Object.getOwnPropertyDescriptor(base, property); if (desc.set) { desc.set.call(receiver, value); return true; } else if (!desc.writable) { return false; } } desc = Object.getOwnPropertyDescriptor(receiver, property); if (desc) { if (!desc.writable) { return false; } desc.value = value; Object.defineProperty(receiver, property, desc); } else { _defineProperty(receiver, property, value); } return true; }; } return set(target, property, value, receiver); }

function _set(target, property, value, receiver, isStrict) { var s = set(target, property, value, receiver || target); if (!s && isStrict) { throw new Error('failed to set property'); } return value; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _superPropBase(object, property) { while (!Object.prototype.hasOwnProperty.call(object, property)) { object = _getPrototypeOf(object); if (object === null) break; } return object; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

//would name the file 'path', but damn near everything
//relies on the filesystem 'path' module

/**
 * An ordered set of vectors defining a path
 */
var VectorPath =
/*#__PURE__*/
function (_PrimitiveComponent) {
  _inherits(VectorPath, _PrimitiveComponent);

  /**
   * see PrimitiveComponent for more options
   * @param {Object} options the options for the object
   * @param {Object[]} options.vertices the vertices
   * @param {number} options.vertices[].x the y coordinate for a vertex
   * @param {number} options.vertices[].y the y coordinate for a vertex
   */
  function VectorPath(options) {
    var _this;

    _classCallCheck(this, VectorPath);

    _this = _possibleConstructorReturn(this, _getPrototypeOf(VectorPath).call(this, options));
    options.vertices = options.vertices || []; //this.unscaledLineWidth = this.style.lineWidth;

    /**
     * the list of vertices as vectorious Vectors
     * @type {Vector[]} vertices
     */

    _this.vertices = options.vertices.map(function (v) {
      return new _vectorious.Vector([v.x, v.y]);
    });

    var yCoordinates = _this.vertices.map(function (v) {
      return v.y;
    });

    var xCoordinates = _this.vertices.map(function (v) {
      return v.x;
    }); //uses `apply` so we can supply the list as a list of arguments


    _this._left = Math.min.apply(null, xCoordinates);
    _this._top = Math.min.apply(null, yCoordinates);
    _this._right = Math.max.apply(null, xCoordinates);
    _this._bottom = Math.max.apply(null, yCoordinates);

    _set(_getPrototypeOf(VectorPath.prototype), "d", new _vectorious.Vector([_this._left, _this._top]), _assertThisInitialized(_this), true);

    var normalizationVector = _this.d;
    _this._normalizedVertices = _this.vertices.map(function (v) {
      return v.subtract(normalizationVector);
    });
    _this._normalizedBoundingBox = null;
    return _this;
  }
  /**
   * get the bounding box for the vertices
   * @type {{top:number, left: number, bottom:number, right:number}} boundingBox
   */


  _createClass(VectorPath, [{
    key: "pointIsInObject",

    /**
     * determine whether the point is in the object
     * even/odd line intersection test
     * @param {number} x the x coordinate
     * @param {number} y the y coordinate
     * @return {boolean} whether or not the point is in the object
     */
    value: function pointIsInObject(x, y) {
      var inside = false;

      if (_get(_getPrototypeOf(VectorPath.prototype), "pointIsInObject", this).call(this, x, y)) {
        //create a line that travels from this point in any direction
        //if it intersects the polygon an odd number of times, it is inside
        //a line can be described as a vertex and a direction
        var l = new _Line.Line(new _vectorious.Vector([x, y]), new _vectorious.Vector([1, 0]));
        var compoundScale = this.compoundScale;
        var offset = this.offset;

        for (var i = 0; i < this._normalizedVertices.length; i++) {
          var j = i + 1 >= this._normalizedVertices.length ? 0 : i + 1;
          var v = scaleVectorXY(this._normalizedVertices[i], compoundScale.scaleWidth, compoundScale.scaleHeight).add(offset);
          var w = scaleVectorXY(this._normalizedVertices[j], compoundScale.scaleWidth, compoundScale.scaleHeight).add(offset);

          var edgeDirection = _vectorious.Vector.subtract(w, v).normalize();

          var edge = new _Line.Line(v, edgeDirection);
          var intersection = edge.intersectionWith(l); //if the lines are parallel/colocated, no need to count;

          if (intersection === null) {
            continue;
          } //TODO: should replace 0s with epsilons, where epsilon is
          //the threshhold for considering two things as touching/intersecting


          var intersectToTheRight = intersection.x - x >= 0; //if the intersection is not to the right, no need to count

          if (!intersectToTheRight) {
            continue;
          }

          var negativeX = edgeDirection.x < 0;
          var negativeY = edgeDirection.y < 0; //technically speaking, bottom and top should be reversed,
          //since y=0 is the top left corner of the screen - it's
          //just easier to think about it mathematically this way

          var leftVertex = negativeX ? w : v;
          var rightVertex = negativeX ? v : w;
          var topVertex = negativeY ? w : v;
          var bottomVertex = negativeY ? v : w;
          var intersectWithinSegment = intersection.x - leftVertex.x >= 0 && rightVertex.x - intersection.x >= 0 && intersection.y - topVertex.y >= 0 && bottomVertex.y - intersection.y >= 0;

          if (intersectWithinSegment) {
            inside = !inside;
          }
        }
      }

      return inside;
    }
    /**
     * override the render function for drawing vector paths specifically
     * @override
     */

  }, {
    key: "render",
    value: function render() {
      var boundingBox = this.boundingBox;
      var offset = this.offset;
      var compoundScale = this.compoundScale; //normalize the vertices (left- and top-most x/y-values should be 0 and 0)

      var pathToDraw = this._normalizedVertices.map(function (vertex) {
        return scaleVectorXY(vertex, compoundScale.scaleWidth, compoundScale.scaleHeight).subtract(new _vectorious.Vector([boundingBox.left, boundingBox.top])).add(offset);
      });

      _Renderer.Renderer.drawPath(pathToDraw, this._prerenderingContext, this.style);
    }
  }, {
    key: "boundingBox",
    get: function get() {
      this._normalizedBoundingBox = {
        top: 0,
        left: 0,
        right: this._right - this._left,
        bottom: this._bottom - this._top
      };
      return {
        top: this._normalizedBoundingBox.top * this.compoundScale.scaleHeight + this.offset.y - this.style.lineWidth,
        left: this._normalizedBoundingBox.left * this.compoundScale.scaleWidth + this.offset.x - this.style.lineWidth,
        bottom: this._normalizedBoundingBox.bottom * this.compoundScale.scaleHeight + this.offset.y + this.style.lineWidth,
        right: this._normalizedBoundingBox.right * this.compoundScale.scaleWidth + this.offset.x + this.style.lineWidth
      };
    }
  }]);

  return VectorPath;
}(_PrimitiveComponent2.PrimitiveComponent);

exports.VectorPath = VectorPath;

function scaleVectorXY(vector, scaleX, scaleY) {
  return new _vectorious.Vector([vector.x * scaleX, vector.y * scaleY]);
}

},{"./Line":13,"./PrimitiveComponent":14,"./Renderer":16,"vectorious":5}]},{},[8])(8)
});

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3Nlci1yZXNvbHZlL2VtcHR5LmpzIiwibm9kZV9tb2R1bGVzL3ZlY3RvcmlvdXMvYnVpbHQvTWF0cml4LmpzIiwibm9kZV9tb2R1bGVzL3ZlY3RvcmlvdXMvYnVpbHQvTkRBcnJheS5qcyIsIm5vZGVfbW9kdWxlcy92ZWN0b3Jpb3VzL2J1aWx0L1ZlY3Rvci5qcyIsIm5vZGVfbW9kdWxlcy92ZWN0b3Jpb3VzL2J1aWx0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL3ZlY3RvcmlvdXMvYnVpbHQvdXRpbC5qcyIsInNyYy9CZXppZXIuanMiLCJzcmMvQ2FudmFzQ29tcG9zaXRvci5qcyIsInNyYy9DaXJjbGUuanMiLCJzcmMvQ29tcG9zaXRpb24uanMiLCJzcmMvRWxsaXBzZS5qcyIsInNyYy9JbWFnZS5qcyIsInNyYy9MaW5lLmpzIiwic3JjL1ByaW1pdGl2ZUNvbXBvbmVudC5qcyIsInNyYy9SZWN0YW5nbGUuanMiLCJzcmMvUmVuZGVyZXIuanMiLCJzcmMvVGV4dC5qcyIsInNyYy9WZWN0b3JQYXRoLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaGtCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqYUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL1NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7Ozs7O0FDeEJBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7QUFDQTtBQUNBLFNBQVMsWUFBVCxDQUFzQixLQUF0QixFQUE2QixFQUE3QixFQUFpQyxFQUFqQyxFQUFxQyxHQUFyQyxFQUEwQyxDQUExQyxFQUE2QztBQUN6QyxTQUFPLEtBQUssSUFBSSxJQUFJLENBQVIsQ0FBTCxJQUFtQixJQUFJLENBQXZCLEtBQTZCLElBQUksQ0FBakMsSUFBc0MsSUFBSSxFQUFKLEdBQVMsQ0FBVCxJQUFjLElBQUksQ0FBbEIsS0FBd0IsSUFBSSxDQUE1QixDQUF0QyxHQUF1RSxJQUFJLEVBQUosR0FBUyxDQUFULEdBQWEsQ0FBYixJQUFrQixJQUFJLENBQXRCLENBQXZFLEdBQWtHLEdBQUcsR0FBRyxDQUFOLEdBQVUsQ0FBVixHQUFjLENBQXZIO0FBQ0g7O0FBR0QsU0FBUyxZQUFULENBQXNCLEtBQXRCLEVBQTZCLEVBQTdCLEVBQWlDLEVBQWpDLEVBQXFDLEdBQXJDLEVBQTBDO0FBRXRDLE1BQUksQ0FBQyxHQUFHLElBQUksR0FBSixHQUFVLElBQUksRUFBZCxHQUFtQixJQUFJLEVBQXZCLEdBQTRCLElBQUksS0FBeEM7QUFDQSxNQUFJLENBQUMsR0FBRyxJQUFJLEVBQUosR0FBUyxLQUFLLEVBQWQsR0FBbUIsSUFBSSxLQUEvQjtBQUNBLE1BQUksQ0FBQyxHQUFHLElBQUksRUFBSixHQUFTLElBQUksS0FBckI7QUFFQSxNQUFJLFNBQVMsR0FBRyxFQUFoQjtBQUNBLE1BQUksWUFBWSxHQUFHLEVBQW5CLENBUHNDLENBU3RDOztBQUNBLE1BQUksSUFBSSxHQUFHLENBQUMsR0FBRyxDQUFKLEdBQVEsSUFBSSxDQUFKLEdBQVEsQ0FBM0I7O0FBRUEsTUFBSSxJQUFJLElBQUksQ0FBWixFQUFlO0FBQ1gsUUFBSSxDQUFDLElBQUksQ0FBQyxHQUFMLENBQVMsQ0FBVCxDQUFELEdBQWUsQ0FBZixJQUFvQixJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsSUFBYyxDQUF0QyxFQUF5QztBQUNyQyxNQUFBLFNBQVMsQ0FBQyxJQUFWLENBQWUsQ0FBQyxDQUFELEdBQUssQ0FBcEI7QUFDSCxLQUZELE1BRU8sSUFBSSxJQUFJLENBQUMsR0FBTCxDQUFTLENBQVQsSUFBYyxDQUFsQixFQUFxQjtBQUN4QixNQUFBLFNBQVMsQ0FBQyxJQUFWLENBQWUsQ0FBQyxDQUFDLENBQUQsR0FBSyxJQUFJLENBQUMsSUFBTCxDQUFVLElBQVYsQ0FBTixLQUEwQixJQUFJLENBQTlCLENBQWY7QUFDQSxNQUFBLFNBQVMsQ0FBQyxJQUFWLENBQWUsQ0FBQyxDQUFDLENBQUQsR0FBSyxJQUFJLENBQUMsSUFBTCxDQUFVLElBQVYsQ0FBTixLQUEwQixJQUFJLENBQTlCLENBQWY7QUFDSCxLQUhNLE1BR0E7QUFDSCxZQUFNLElBQUksS0FBSixDQUFVLG1CQUFWLENBQU47QUFDSDs7QUFFRCxrQ0FBYyxTQUFkLGdDQUF5QjtBQUFwQixVQUFJLENBQUMsaUJBQUw7O0FBQ0QsVUFBSSxLQUFLLENBQUwsSUFBVSxDQUFDLElBQUksQ0FBbkIsRUFBc0I7QUFDbEIsUUFBQSxZQUFZLENBQUMsSUFBYixDQUFrQixZQUFZLENBQUMsS0FBRCxFQUFRLEVBQVIsRUFBWSxFQUFaLEVBQWdCLEdBQWhCLEVBQXFCLENBQXJCLENBQTlCO0FBQ0g7QUFDSjtBQUNKOztBQUVELEVBQUEsWUFBWSxDQUFDLElBQWIsQ0FBa0IsS0FBbEIsRUFBeUIsR0FBekI7QUFFQSxTQUFPLFlBQVA7QUFDSDs7SUFFWSxNOzs7OztBQUNULGtCQUFZLE9BQVosRUFBcUI7QUFBQTs7QUFBQTs7QUFDakIsZ0ZBQU0sT0FBTjtBQUVBLFFBQUksS0FBSyxHQUFHLElBQUksa0JBQUosQ0FBVyxDQUFDLE9BQU8sQ0FBQyxLQUFSLENBQWMsQ0FBZixFQUFrQixPQUFPLENBQUMsS0FBUixDQUFjLENBQWhDLENBQVgsQ0FBWjtBQUNBLFFBQUksR0FBRyxHQUFHLElBQUksa0JBQUosQ0FBVyxDQUFDLE9BQU8sQ0FBQyxHQUFSLENBQVksQ0FBYixFQUFnQixPQUFPLENBQUMsR0FBUixDQUFZLENBQTVCLENBQVgsQ0FBVjtBQUNBLFFBQUksUUFBUSxHQUFHLElBQUksa0JBQUosQ0FBVyxDQUFDLE9BQU8sQ0FBQyxRQUFSLENBQWlCLENBQWxCLEVBQXFCLE9BQU8sQ0FBQyxRQUFSLENBQWlCLENBQXRDLENBQVgsQ0FBZjtBQUNBLFFBQUksUUFBUSxHQUFHLElBQUksa0JBQUosQ0FBVyxDQUFDLE9BQU8sQ0FBQyxRQUFSLENBQWlCLENBQWxCLEVBQXFCLE9BQU8sQ0FBQyxRQUFSLENBQWlCLENBQXRDLENBQVgsQ0FBZjtBQUVBLFVBQUssWUFBTCxHQUFvQixJQUFwQjtBQUNBLFVBQUssdUJBQUwsR0FBK0IsSUFBL0I7O0FBRUEsUUFBSSxRQUFRLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFQLEVBQVUsUUFBUSxDQUFDLENBQW5CLEVBQXNCLFFBQXRCLEVBQWdDLEdBQUcsQ0FBQyxDQUFwQyxDQUEzQjs7QUFDQSxRQUFJLFFBQVEsR0FBRyxZQUFZLENBQUMsS0FBSyxDQUFDLENBQVAsRUFBVSxRQUFRLENBQUMsQ0FBbkIsRUFBc0IsUUFBUSxDQUFDLENBQS9CLEVBQWtDLEdBQUcsQ0FBQyxDQUF0QyxDQUEzQjs7QUFDQSxpREFBVSxJQUFJLGtCQUFKLENBQVcsQ0FBQyxJQUFJLENBQUMsR0FBTCxDQUFTLEtBQVQsQ0FBZSxJQUFmLEVBQXFCLFFBQXJCLENBQUQsRUFBaUMsSUFBSSxDQUFDLEdBQUwsQ0FBUyxLQUFULENBQWUsSUFBZixFQUFxQixRQUFyQixDQUFqQyxDQUFYLENBQVY7O0FBRUEsVUFBSyxvQkFBTCxHQUE0QixNQUFLLENBQWpDO0FBRUEsVUFBSyxNQUFMLEdBQWMsbUJBQU8sUUFBUCxDQUFnQixLQUFoQixFQUF1QixNQUFLLG9CQUE1QixDQUFkO0FBQ0EsVUFBSyxJQUFMLEdBQVksbUJBQU8sUUFBUCxDQUFnQixHQUFoQixFQUFxQixNQUFLLG9CQUExQixDQUFaO0FBQ0EsVUFBSyxTQUFMLEdBQWlCLG1CQUFPLFFBQVAsQ0FBZ0IsUUFBaEIsRUFBMEIsTUFBSyxvQkFBL0IsQ0FBakI7QUFDQSxVQUFLLFNBQUwsR0FBaUIsbUJBQU8sUUFBUCxDQUFnQixRQUFoQixFQUEwQixNQUFLLG9CQUEvQixDQUFqQjtBQXBCaUI7QUFxQnBCOzs7OzZCQXlCUTtBQUNMLHlCQUFTLFVBQVQsQ0FDSSxLQUFLLE1BRFQsRUFFSSxLQUFLLElBRlQsRUFHSSxLQUFLLFNBSFQsRUFJSSxLQUFLLFNBSlQsRUFLSSxLQUFLLG9CQUxULEVBTUksS0FBSyxLQU5UO0FBUUg7Ozt3QkFoQ2lCO0FBQ2Q7QUFDQSxVQUFJLFNBQVMsR0FBRyxLQUFLLEtBQUwsQ0FBVyxTQUEzQjtBQUVBLFVBQUksTUFBTSxHQUFHLEtBQUssTUFBbEI7O0FBQ0EsVUFBSSxLQUFLLEdBQUcsbUJBQU8sR0FBUCxDQUFXLEtBQUssTUFBaEIsRUFBd0IsS0FBSyxNQUE3QixDQUFaOztBQUNBLFVBQUksUUFBUSxHQUFHLG1CQUFPLEdBQVAsQ0FBVyxLQUFLLFNBQWhCLEVBQTJCLEtBQUssTUFBaEMsQ0FBZjs7QUFDQSxVQUFJLFFBQVEsR0FBRyxtQkFBTyxHQUFQLENBQVcsS0FBSyxTQUFoQixFQUEyQixLQUFLLE1BQWhDLENBQWY7O0FBQ0EsVUFBSSxHQUFHLEdBQUcsbUJBQU8sR0FBUCxDQUFXLEtBQUssSUFBaEIsRUFBc0IsS0FBSyxNQUEzQixDQUFWOztBQUVBLFVBQUksUUFBUSxHQUFHLFlBQVksQ0FBQyxLQUFLLENBQUMsQ0FBUCxFQUFVLFFBQVEsQ0FBQyxDQUFuQixFQUFzQixRQUF0QixFQUFnQyxHQUFHLENBQUMsQ0FBcEMsQ0FBM0I7O0FBQ0EsVUFBSSxRQUFRLEdBQUcsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFQLEVBQVUsUUFBUSxDQUFDLENBQW5CLEVBQXNCLFFBQVEsQ0FBQyxDQUEvQixFQUFrQyxHQUFHLENBQUMsQ0FBdEMsQ0FBM0I7O0FBQ0EsV0FBSyxZQUFMLEdBQW9CO0FBQ2hCLFFBQUEsR0FBRyxFQUFFLElBQUksQ0FBQyxHQUFMLENBQVMsS0FBVCxDQUFlLElBQWYsRUFBcUIsUUFBckIsSUFBaUMsU0FEdEI7QUFFaEIsUUFBQSxLQUFLLEVBQUUsSUFBSSxDQUFDLEdBQUwsQ0FBUyxLQUFULENBQWUsSUFBZixFQUFxQixRQUFyQixJQUFpQyxTQUZ4QjtBQUdoQixRQUFBLE1BQU0sRUFBRSxJQUFJLENBQUMsR0FBTCxDQUFTLEtBQVQsQ0FBZSxJQUFmLEVBQXFCLFFBQXJCLElBQWlDLFNBSHpCO0FBSWhCLFFBQUEsSUFBSSxFQUFFLElBQUksQ0FBQyxHQUFMLENBQVMsS0FBVCxDQUFlLElBQWYsRUFBcUIsUUFBckIsSUFBaUM7QUFKdkIsT0FBcEI7QUFNQSxXQUFLLHVCQUFMLEdBQStCLEtBQS9CLENBbEJjLENBbUJkOztBQUNBLGFBQU8sS0FBSyxZQUFaO0FBQ0g7Ozs7RUE3Q3VCLHVDOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUM3QzVCOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7OztBQUVBO0FBQ0EsSUFBTSxrQkFBa0IsR0FBRyxPQUFPLEVBQWxDLEMsQ0FBc0M7O0FBRXRDLElBQU0sTUFBTSxHQUFHO0FBQ1gsRUFBQSxPQUFPLEVBQUUsV0FERTtBQUVYLEVBQUEsU0FBUyxFQUFFLGFBRkE7QUFHWCxFQUFBLFNBQVMsRUFBRSxhQUhBO0FBSVgsRUFBQSxRQUFRLEVBQUUsWUFKQztBQUtYLEVBQUEsS0FBSyxFQUFFO0FBTEksQ0FBZjtBQVFBOzs7Ozs7Ozs7SUFRTSxnQjs7O0FBQ0Y7Ozs7Ozs7OztBQVNBLDRCQUFZLE1BQVosRUFBb0I7QUFBQTs7QUFDaEIsU0FBSyxPQUFMLEdBQWUsTUFBZjtBQUNBLFNBQUssUUFBTCxHQUFnQixLQUFLLE9BQUwsQ0FBYSxVQUFiLENBQXdCLElBQXhCLENBQWhCLENBRmdCLENBSWhCO0FBQ0E7QUFDQTs7QUFDQSxRQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsZ0JBQVAsQ0FBd0IsS0FBSyxPQUE3QixDQUFaO0FBRUEsUUFBSSxVQUFVLEdBQUcsS0FBSyxDQUFDLGdCQUFOLENBQXVCLGFBQXZCLElBQXdDLFVBQVUsQ0FBQyxLQUFLLENBQUMsZ0JBQU4sQ0FBdUIsYUFBdkIsQ0FBRCxDQUFsRCxHQUE0RixDQUE3RztBQUNBLFFBQUksV0FBVyxHQUFHLEtBQUssQ0FBQyxnQkFBTixDQUF1QixjQUF2QixJQUF5QyxVQUFVLENBQUMsS0FBSyxDQUFDLGdCQUFOLENBQXVCLGNBQXZCLENBQUQsQ0FBbkQsR0FBOEYsQ0FBaEg7QUFFQSxTQUFLLFlBQUwsR0FBb0IsVUFBVSxHQUFHLFdBQWpDO0FBRUEsUUFBSSxTQUFTLEdBQUcsS0FBSyxDQUFDLGdCQUFOLENBQXVCLFlBQXZCLElBQXVDLFVBQVUsQ0FBQyxLQUFLLENBQUMsZ0JBQU4sQ0FBdUIsWUFBdkIsQ0FBRCxDQUFqRCxHQUEwRixDQUExRztBQUNBLFFBQUksVUFBVSxHQUFHLEtBQUssQ0FBQyxnQkFBTixDQUF1QixhQUF2QixJQUF3QyxVQUFVLENBQUMsS0FBSyxDQUFDLGdCQUFOLENBQXVCLGFBQXZCLENBQUQsQ0FBbEQsR0FBNEYsQ0FBN0c7QUFFQSxTQUFLLFdBQUwsR0FBbUIsU0FBUyxHQUFHLFVBQS9CO0FBRUEsU0FBSyxZQUFMLEdBQW9CLENBQXBCO0FBQ0EsU0FBSyxtQkFBTCxHQUEyQixDQUEzQjtBQUNBLFNBQUssZUFBTCxHQUF1QixDQUF2QjtBQUVBLFNBQUssYUFBTCxHQUFxQixJQUFyQjtBQUVBLFNBQUssTUFBTCxHQUFjLElBQUksd0JBQUosQ0FBZ0IsS0FBSyxNQUFyQixDQUFkOztBQUVBLFNBQUssV0FBTDs7QUFFQSxTQUFLLGNBQUwsR0FBc0I7QUFDbEIsTUFBQSxTQUFTLEVBQUUsRUFETztBQUVsQixNQUFBLFdBQVcsRUFBRSxFQUZLO0FBR2xCLE1BQUEsV0FBVyxFQUFFLEVBSEs7QUFJbEIsTUFBQSxVQUFVLEVBQUUsRUFKTTtBQUtsQixNQUFBLE9BQU8sRUFBRTtBQUxTLEtBQXRCOztBQVFBLFNBQUssY0FBTDs7QUFDQSxTQUFLLFVBQUwsR0FBa0IsQ0FBbEI7QUFDSCxHLENBRUQ7Ozs7OztBQW1DQTs7Ozs7OztxQ0FPaUI7QUFDYixNQUFBLE1BQU0sQ0FBQyxxQkFBUCxDQUE2QixLQUFLLGNBQUwsQ0FBb0IsSUFBcEIsQ0FBeUIsSUFBekIsQ0FBN0I7QUFDQSxXQUFLLFlBQUwsR0FBb0IsQ0FBQyxJQUFJLElBQUosRUFBckIsQ0FGYSxDQUdiOztBQUNBO0FBQUs7QUFBdUUsV0FBSyxLQUFMLENBQVcsU0FBdkYsRUFBa0c7QUFDOUYsYUFBSyxlQUFMLEdBQXVCLENBQUMsSUFBSSxJQUFKLEVBQXhCOztBQUNBLDJCQUFTLFNBQVQsQ0FBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsRUFBeUIsS0FBSyxPQUFMLENBQWEsS0FBdEMsRUFBNkMsS0FBSyxPQUFMLENBQWEsTUFBMUQsRUFBa0UsS0FBSyxRQUF2RTs7QUFDQSxhQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLEtBQUssUUFBckI7QUFDSDs7QUFDRCxXQUFLLFNBQUwsR0FBaUIsUUFBUSxDQUFDLFFBQVEsS0FBSyxZQUFMLEdBQW9CLEtBQUssbUJBQWpDLENBQUQsQ0FBekI7QUFDQSxXQUFLLG1CQUFMLEdBQTJCLENBQUMsSUFBSSxJQUFKLEVBQTVCO0FBRUg7QUFFRDs7Ozs7Ozs7O2tDQU1jLFMsRUFBVyxRLEVBQVU7QUFDL0IsVUFBSSxLQUFLLGNBQUwsQ0FBb0IsU0FBcEIsQ0FBSixFQUFvQztBQUNoQyxhQUFLLGNBQUwsQ0FBb0IsU0FBcEIsRUFBK0IsSUFBL0IsQ0FBb0MsUUFBcEM7QUFDSDtBQUNKO0FBRUQ7Ozs7Ozs7Ozs7Z0NBT1ksUyxFQUFXLFEsRUFBVTtBQUM3QixVQUFJLEtBQUssY0FBTCxDQUFvQixTQUFwQixDQUFKLEVBQW9DO0FBQ2hDLFlBQUksS0FBSyxHQUFHLEtBQUssY0FBTCxDQUFvQixTQUFwQixFQUErQixPQUEvQixDQUF1QyxRQUF2QyxDQUFaOztBQUNBLFlBQUksS0FBSyxJQUFJLENBQWIsRUFBZ0I7QUFDWixpQkFBTyxLQUFLLGNBQUwsQ0FBb0IsU0FBcEIsRUFBK0IsTUFBL0IsQ0FBc0MsS0FBdEMsRUFBNkMsQ0FBN0MsQ0FBUDtBQUNIO0FBQ0o7QUFDSjtBQUVEOzs7Ozs7O2tDQUljO0FBQ1Y7QUFDQTtBQUNBLFdBQUssT0FBTCxDQUFhLGdCQUFiLENBQThCLFdBQTlCLEVBQTJDLEtBQUssZ0JBQUwsQ0FBc0IsSUFBdEIsQ0FBMkIsSUFBM0IsQ0FBM0M7O0FBQ0EsV0FBSyxPQUFMLENBQWEsZ0JBQWIsQ0FBOEIsU0FBOUIsRUFBeUMsS0FBSyxjQUFMLENBQW9CLElBQXBCLENBQXlCLElBQXpCLENBQXpDOztBQUNBLFdBQUssT0FBTCxDQUFhLGdCQUFiLENBQThCLFdBQTlCLEVBQTJDLEtBQUssZ0JBQUwsQ0FBc0IsSUFBdEIsQ0FBMkIsSUFBM0IsQ0FBM0M7O0FBQ0EsV0FBSyxPQUFMLENBQWEsZ0JBQWIsQ0FBOEIsVUFBOUIsRUFBMEMsS0FBSyxlQUFMLENBQXFCLElBQXJCLENBQTBCLElBQTFCLENBQTFDOztBQUNBLFdBQUssT0FBTCxDQUFhLGdCQUFiLENBQThCLE9BQTlCLEVBQXVDLEtBQUssWUFBTCxDQUFrQixJQUFsQixDQUF1QixJQUF2QixDQUF2QztBQUNIO0FBRUQ7Ozs7Ozs7cUNBSWlCLEMsRUFBRztBQUNoQixNQUFBLENBQUMsQ0FBQyxjQUFGO0FBRUEsVUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQUYsR0FBWSxLQUFLLFlBQXpCO0FBQ0EsVUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQUYsR0FBWSxLQUFLLFdBQXpCLENBSmdCLENBTWhCOztBQUNBLE1BQUEsQ0FBQyxDQUFDLE9BQUYsR0FBWSxDQUFaO0FBQ0EsTUFBQSxDQUFDLENBQUMsT0FBRixHQUFZLENBQVo7QUFSZ0I7QUFBQTtBQUFBOztBQUFBO0FBVWhCLDZCQUFxQixLQUFLLGNBQUwsQ0FBb0IsTUFBTSxDQUFDLFNBQTNCLENBQXJCLDhIQUE0RDtBQUFBLGNBQW5ELFFBQW1EO0FBQ3hELFVBQUEsUUFBUSxDQUFDLENBQUQsQ0FBUjtBQUNIO0FBWmU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFZZjtBQUVELFVBQUksYUFBYSxHQUFHLEtBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsQ0FBcEI7O0FBRUEsVUFBSSxhQUFhLElBQUksYUFBYSxDQUFDLFdBQW5DLEVBQWdEO0FBQzVDLFFBQUEsYUFBYSxDQUFDLFdBQWQsQ0FBMEIsQ0FBMUI7QUFDSDtBQUNKO0FBRUQ7Ozs7Ozs7bUNBSWUsQyxFQUFHO0FBQ2QsTUFBQSxDQUFDLENBQUMsY0FBRjtBQUVBLFVBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFGLEdBQVksS0FBSyxZQUF6QjtBQUNBLFVBQUksQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFGLEdBQVksS0FBSyxXQUF6QixDQUpjLENBTWQ7O0FBQ0EsTUFBQSxDQUFDLENBQUMsT0FBRixHQUFZLENBQVo7QUFDQSxNQUFBLENBQUMsQ0FBQyxPQUFGLEdBQVksQ0FBWjtBQVJjO0FBQUE7QUFBQTs7QUFBQTtBQVVkLDhCQUFjLEtBQUssS0FBTCxDQUFXLFFBQXpCLG1JQUFtQztBQUFBLGNBQTFCLENBQTBCOztBQUMvQixjQUFJLENBQUMsQ0FBQyxTQUFGLElBQWUsQ0FBQyxDQUFDLFNBQXJCLEVBQWdDO0FBQzVCLFlBQUEsQ0FBQyxDQUFDLFNBQUYsQ0FBWSxDQUFaO0FBQ0g7QUFDSjtBQWRhO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFBQTtBQUFBOztBQUFBO0FBZ0JkLDhCQUFxQixLQUFLLGNBQUwsQ0FBb0IsTUFBTSxDQUFDLE9BQTNCLENBQXJCLG1JQUEwRDtBQUFBLGNBQWpELFFBQWlEO0FBQ3RELFVBQUEsUUFBUSxDQUFDLENBQUQsQ0FBUjtBQUNIO0FBbEJhO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7O0FBb0JkLFVBQUksYUFBYSxHQUFHLEtBQUssS0FBTCxDQUFXLE9BQVgsQ0FBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsQ0FBcEI7O0FBRUEsVUFBSSxhQUFhLElBQUksYUFBYSxDQUFDLFNBQW5DLEVBQThDO0FBQzFDLFFBQUEsYUFBYSxDQUFDLFNBQWQsQ0FBd0IsQ0FBeEI7QUFDSDtBQUNKOzs7O0FBRUQ7Ozs7cUNBSWlCLEMsRUFBRztBQUNoQixNQUFBLENBQUMsQ0FBQyxjQUFGO0FBQ0EsVUFBSSxPQUFPLEdBQUcsS0FBSyxLQUFMLENBQVcsUUFBWCxDQUFvQixNQUFwQixDQUEyQixVQUFDLENBQUQ7QUFBQSxlQUFPLENBQUMsQ0FBRSxDQUFDLENBQUMsV0FBWjtBQUFBLE9BQTNCLENBQWQ7QUFGZ0I7QUFBQTtBQUFBOztBQUFBO0FBSWhCLDhCQUFxQixLQUFLLGNBQUwsQ0FBb0IsTUFBTSxDQUFDLFNBQTNCLENBQXJCLG1JQUE0RDtBQUFBLGNBQW5ELFFBQW1EO0FBQ3hELFVBQUEsUUFBUSxDQUFDLENBQUQsQ0FBUjtBQUNIO0FBTmU7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFRaEIsOEJBQWMsT0FBZCxtSUFBdUI7QUFBQSxjQUFkLENBQWM7QUFDbkIsVUFBQSxDQUFDLENBQUMsV0FBRixDQUFjLENBQWQ7QUFDSDtBQVZlO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFXbkI7Ozs7QUFFRDs7OztpQ0FJYSxDLEVBQUc7QUFDWixNQUFBLENBQUMsQ0FBQyxjQUFGO0FBRUEsVUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQUYsR0FBWSxLQUFLLFlBQXpCO0FBQ0EsVUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQUYsR0FBWSxLQUFLLFdBQXpCLENBSlksQ0FNWjs7QUFDQSxNQUFBLENBQUMsQ0FBQyxPQUFGLEdBQVksQ0FBWjtBQUNBLE1BQUEsQ0FBQyxDQUFDLE9BQUYsR0FBWSxDQUFaLENBUlksQ0FVWjs7QUFDQSxVQUFJLE9BQU8sR0FBRyxLQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CLE1BQXBCLENBQTJCLFVBQUMsQ0FBRDtBQUFBLGVBQU8sQ0FBQyxDQUFFLENBQUMsQ0FBQyxPQUFaO0FBQUEsT0FBM0IsQ0FBZDtBQVhZO0FBQUE7QUFBQTs7QUFBQTtBQWFaLDhCQUFxQixLQUFLLGNBQUwsQ0FBb0IsTUFBTSxDQUFDLEtBQTNCLENBQXJCLG1JQUF3RDtBQUFBLGNBQS9DLFFBQStDO0FBQ3BELFVBQUEsUUFBUSxDQUFDLENBQUQsQ0FBUjtBQUNIO0FBZlc7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFBQTtBQUFBO0FBQUE7O0FBQUE7QUFpQlosOEJBQWMsT0FBZCxtSUFBdUI7QUFBQSxjQUFkLENBQWM7QUFDbkIsVUFBQSxDQUFDLENBQUMsT0FBRixDQUFVLENBQVY7QUFDSDtBQW5CVztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBb0JmOzs7O0FBRUQ7Ozs7b0NBSWdCLEMsRUFBRztBQUNmLE1BQUEsQ0FBQyxDQUFDLGNBQUY7QUFFQSxVQUFJLE9BQU8sR0FBRyxLQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CLE1BQXBCLENBQTJCLFVBQUMsQ0FBRDtBQUFBLGVBQU8sQ0FBQyxDQUFFLENBQUMsQ0FBQyxVQUFaO0FBQUEsT0FBM0IsQ0FBZDtBQUhlO0FBQUE7QUFBQTs7QUFBQTtBQUtmLDhCQUFjLE9BQWQsbUlBQXVCO0FBQUEsY0FBZCxDQUFjO0FBQ25CLFVBQUEsQ0FBQyxDQUFDLFVBQUYsQ0FBYSxDQUFiO0FBQ0g7QUFQYztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQU9kO0FBUGM7QUFBQTtBQUFBOztBQUFBO0FBU2YsOEJBQXFCLEtBQUssY0FBTCxDQUFvQixNQUFNLENBQUMsUUFBM0IsQ0FBckIsbUlBQTJEO0FBQUEsY0FBbEQsUUFBa0Q7QUFDdkQsVUFBQSxRQUFRLENBQUMsQ0FBRCxDQUFSO0FBQ0g7QUFYYztBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQVdkO0FBQ0o7OzsrQkFFVSxLLEVBQU8sRyxFQUFLLEUsRUFBSSxFLEVBQUksSyxFQUFPO0FBQ2xDLHlCQUFTLFVBQVQsQ0FBb0IsS0FBcEIsRUFBMkIsR0FBM0IsRUFBZ0MsRUFBaEMsRUFBb0MsRUFBcEMsRUFBd0MsS0FBSyxRQUE3QyxFQUF1RCxLQUF2RDtBQUNIOzs7c0JBeE5hLEcsRUFBSztBQUNmLFdBQUssVUFBTCxHQUFrQixHQUFsQjtBQUNILEs7d0JBRWU7QUFDWjtBQUNBLGFBQU8sS0FBSyxVQUFaO0FBQ0gsSyxDQUVEOztBQUNBOzs7Ozs7O3dCQUltQjtBQUNmLGFBQU8sS0FBSyxhQUFaO0FBQ0g7QUFDRDs7Ozs7O3NCQUtpQixHLEVBQUs7QUFDbEIsV0FBSyxhQUFMLEdBQXFCLEdBQXJCO0FBQ0g7QUFFRDs7Ozs7Ozt3QkFJWTtBQUNSLGFBQU8sS0FBSyxNQUFaO0FBQ0g7Ozs7OztBQTJMRSxTQUFTLElBQVQsQ0FBYyxNQUFkLEVBQXNCO0FBQ3pCLFNBQU8sSUFBSSxnQkFBSixDQUFxQixNQUFyQixDQUFQO0FBQ0g7Ozs7Ozs7Ozs7QUNoVEQ7O0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7OztJQUdhLE07Ozs7O0FBQ1Q7O0FBQ0E7Ozs7QUFJQSxrQkFBWSxPQUFaLEVBQXFCO0FBQUE7O0FBQUE7O0FBQ2pCLGdGQUFNLE9BQU47QUFDQTs7Ozs7QUFJQSxVQUFLLE1BQUwsR0FBYyxPQUFPLENBQUMsTUFBUixJQUFrQixDQUFoQztBQU5pQjtBQU9wQjtBQUVEOzs7Ozs7Ozs7QUErQkE7Ozs7NkJBSVM7QUFDTDtBQUNBLFVBQUksS0FBSyxHQUFHLEtBQUssYUFBakI7QUFDQSxVQUFJLFNBQVMsR0FBRyxLQUFLLEtBQUwsQ0FBVyxTQUEzQjs7QUFDQSx5QkFBUyxVQUFULENBQ0ssS0FBSyxNQUFMLEdBQWMsS0FBSyxDQUFDLFVBQXJCLEdBQW1DLFNBRHZDLEVBRUssS0FBSyxNQUFMLEdBQWMsS0FBSyxDQUFDLFdBQXJCLEdBQW9DLFNBRnhDLEVBR0ssS0FBSyxNQUFMLEdBQWMsS0FBSyxDQUFDLFVBSHpCLEVBSUksS0FBSyxvQkFKVCxFQUtJLEtBQUssS0FMVDtBQU9IO0FBRUQ7Ozs7Ozs7Ozs7b0NBT2dCLEMsRUFBRyxDLEVBQUc7QUFFbEIsVUFBSSxNQUFNLEdBQUcsS0FBSyxNQUFsQixDQUZrQixDQUlsQjtBQUNBOztBQUNJLFVBQUksQ0FBQyxHQUFHLENBQUMsR0FBRyxNQUFNLENBQUMsQ0FBbkI7QUFDQSxVQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQW5CO0FBQ0EsVUFBSSxDQUFDLEdBQUcsS0FBSyxNQUFiLENBUmMsQ0FVZDs7QUFDQSxhQUFRLENBQUMsR0FBRyxDQUFMLEdBQVcsQ0FBQyxHQUFHLENBQWYsSUFBc0IsQ0FBQyxHQUFHLENBQWpDLENBWGMsQ0FZbEI7O0FBQ0E7Ozs7O0FBS0g7Ozt3QkFyRWlCO0FBQ2Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFVBQUksTUFBTSxHQUFHLEtBQUssTUFBbEI7QUFDQSxVQUFJLEtBQUssR0FBRyxLQUFLLGFBQWpCO0FBQ0EsYUFBTztBQUNILFFBQUEsR0FBRyxFQUFFLE1BQU0sQ0FBQyxDQUFQLElBQ0MsS0FBSyxNQUFMLEdBQWMsS0FBSyxDQUFDLFdBQXJCLEdBQ0ksS0FBSyxLQUFMLENBQVcsU0FGZixDQURGO0FBSUgsUUFBQSxJQUFJLEVBQUUsTUFBTSxDQUFDLENBQVAsSUFDQSxLQUFLLE1BQUwsR0FBYyxLQUFLLENBQUMsVUFBckIsR0FDSSxLQUFLLEtBQUwsQ0FBVyxTQUZkLENBSkg7QUFPSCxRQUFBLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBUCxHQUNILEtBQUssTUFBTCxHQUFjLEtBQUssQ0FBQyxXQURqQixHQUVILEtBQUssS0FBTCxDQUFXLFNBVGI7QUFVSCxRQUFBLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBUCxHQUNGLEtBQUssTUFBTCxHQUFjLEtBQUssQ0FBQyxVQURsQixHQUVGLEtBQUssS0FBTCxDQUFXO0FBWmIsT0FBUDtBQWNIOzs7O0VBNUN1Qix1Qzs7Ozs7Ozs7Ozs7O0FDTjVCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBRUE7Ozs7Ozs7OztJQVNhLFc7Ozs7O0FBQ1Q7OztBQUdBLHVCQUFZLE9BQVosRUFBcUI7QUFBQTs7QUFBQTs7QUFDakIscUZBQU0sT0FBTjtBQUNBLElBQUEsT0FBTyxHQUFHLE9BQU8sSUFBSSxFQUFyQjtBQUNBLFVBQUssU0FBTCxHQUFpQixPQUFPLENBQUMsUUFBUixJQUFvQixFQUFyQztBQUhpQjtBQUlwQjtBQUVEOzs7Ozs7Ozs7QUFtQ0E7Ozs7OzsrQkFNVyxDLEVBQUcsQyxFQUFHO0FBQ2IsYUFBTyxLQUFLLFFBQUwsQ0FBYyxNQUFkLENBQXFCLFVBQUMsQ0FBRDtBQUFBLGVBQU8sQ0FBQyxDQUFDLGVBQUYsQ0FBa0IsQ0FBbEIsRUFBcUIsQ0FBckIsQ0FBUDtBQUFBLE9BQXJCLENBQVA7QUFDSDtBQUVEOzs7Ozs7Ozs7NEJBTVEsQyxFQUFHLEMsRUFBRztBQUNWO0FBQ0EsV0FBSyxJQUFJLENBQUMsR0FBRyxLQUFLLFFBQUwsQ0FBYyxNQUFkLEdBQXVCLENBQXBDLEVBQXVDLENBQUMsSUFBSSxDQUE1QyxFQUErQyxDQUFDLEVBQWhELEVBQW9EO0FBQ2hELFlBQUksS0FBSyxRQUFMLENBQWMsQ0FBZCxFQUFpQixlQUFqQixDQUFpQyxDQUFqQyxFQUFvQyxDQUFwQyxDQUFKLEVBQTRDO0FBQ3hDLGlCQUFPLEtBQUssUUFBTCxDQUFjLENBQWQsQ0FBUDtBQUNIO0FBQ0o7QUFDSjtBQUVEOzs7Ozs7OzZCQUlTLEssRUFBTztBQUNaLE1BQUEsS0FBSyxDQUFDLE1BQU4sR0FBZSxJQUFmO0FBQ0EsV0FBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixLQUFuQjs7QUFDQSxrRUFBb0IsSUFBcEI7O0FBQ0EsZ0VBQWtCLElBQWxCLGNBSlksQ0FLWjtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUNIO0FBRUQ7Ozs7Ozs7O2dDQUtZLEssRUFBTztBQUNmLFVBQUksS0FBSixFQUFXO0FBQ1AsWUFBSSxLQUFLLEdBQUcsS0FBSyxRQUFMLENBQWMsT0FBZCxDQUFzQixLQUF0QixDQUFaOztBQUNBLFlBQUksS0FBSyxJQUFJLENBQWIsRUFBZ0I7QUFDWixzRUFBb0IsSUFBcEI7O0FBQ0Esb0VBQWtCLElBQWxCOztBQUNBLGlCQUFPLEtBQUssUUFBTCxDQUFjLE1BQWQsQ0FBcUIsS0FBckIsRUFBNEIsQ0FBNUIsQ0FBUDtBQUNIO0FBQ0o7QUFDSjs7OztBQUVEOzs7OzZCQUlTO0FBQ0w7QUFDQSxVQUFJLFdBQVcsR0FBRyxLQUFLLFdBQXZCO0FBQ0EsVUFBSSxNQUFNLEdBQUc7QUFDVCxRQUFBLEdBQUcsRUFBRSxDQUFDLFdBQVcsQ0FBQyxHQURUO0FBRVQsUUFBQSxJQUFJLEVBQUUsQ0FBQyxXQUFXLENBQUMsSUFGVjtBQUdULFFBQUEsTUFBTSxFQUFFLENBQUMsV0FBVyxDQUFDLE1BSFo7QUFJVCxRQUFBLEtBQUssRUFBRSxDQUFDLFdBQVcsQ0FBQztBQUpYLE9BQWI7QUFISztBQUFBO0FBQUE7O0FBQUE7QUFVTCw2QkFBYyxLQUFLLFFBQW5CLDhIQUE2QjtBQUFBLGNBQXBCLENBQW9CO0FBQ3pCLFVBQUEsQ0FBQyxDQUFDLElBQUYsQ0FBTyxLQUFLLG9CQUFaLEVBQWtDLE1BQWxDO0FBQ0g7QUFaSTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBOztBQVlKLE9BWkksQ0FjTDtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDSDs7O3dCQWhIYztBQUNYLGFBQU8sS0FBSyxTQUFaO0FBQ0g7QUFFRDs7Ozs7Ozt3QkFJa0I7QUFDZCxVQUFJLEdBQUcsR0FBRyxRQUFWO0FBQUEsVUFDSSxJQUFJLEdBQUcsUUFEWDtBQUFBLFVBRUksTUFBTSxHQUFHLENBQUMsUUFGZDtBQUFBLFVBR0ksS0FBSyxHQUFHLENBQUMsUUFIYjtBQURjO0FBQUE7QUFBQTs7QUFBQTtBQU1kLDhCQUFjLEtBQUssUUFBbkIsbUlBQTZCO0FBQUEsY0FBcEIsQ0FBb0I7QUFDekIsY0FBSSxXQUFXLEdBQUcsQ0FBQyxDQUFDLFdBQXBCO0FBQ0EsVUFBQSxHQUFHLEdBQUcsSUFBSSxDQUFDLEdBQUwsQ0FBUyxXQUFXLENBQUMsR0FBckIsRUFBMEIsR0FBMUIsQ0FBTjtBQUNBLFVBQUEsSUFBSSxHQUFHLElBQUksQ0FBQyxHQUFMLENBQVMsV0FBVyxDQUFDLElBQXJCLEVBQTJCLElBQTNCLENBQVA7QUFDQSxVQUFBLE1BQU0sR0FBRyxJQUFJLENBQUMsR0FBTCxDQUFTLFdBQVcsQ0FBQyxNQUFyQixFQUE2QixNQUE3QixDQUFUO0FBQ0EsVUFBQSxLQUFLLEdBQUcsSUFBSSxDQUFDLEdBQUwsQ0FBUyxXQUFXLENBQUMsS0FBckIsRUFBNEIsS0FBNUIsQ0FBUjtBQUNIO0FBWmE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTs7QUFZYjtBQUVELGFBQU87QUFDSCxRQUFBLEdBQUcsRUFBRSxHQURGO0FBRUgsUUFBQSxJQUFJLEVBQUUsSUFGSDtBQUdILFFBQUEsTUFBTSxFQUFFLE1BSEw7QUFJSCxRQUFBLEtBQUssRUFBRTtBQUpKLE9BQVA7QUFNSDs7OztFQTFDNEIsdUM7Ozs7Ozs7Ozs7OztBQ1hqQzs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFJQTs7O0lBR2EsTzs7Ozs7QUFDVDs7Ozs7QUFLQSxtQkFBWSxPQUFaLEVBQXFCO0FBQUE7O0FBQUE7O0FBQ2pCLGlGQUFNLE9BQU47QUFDQTs7OztBQUdBLFVBQUssTUFBTCxHQUFjLE9BQU8sQ0FBQyxNQUFSLElBQWtCLENBQWhDO0FBQ0E7Ozs7QUFHQSxVQUFLLFdBQUwsR0FBbUIsT0FBTyxDQUFDLFdBQVIsSUFBdUIsTUFBSyxNQUE1QixJQUFzQyxDQUF6RDtBQVRpQjtBQVVwQjtBQUVEOzs7Ozs7Ozs7QUFvQkE7Ozs7NkJBSVM7QUFDTCxVQUFJLEtBQUssR0FBRyxLQUFLLGFBQWpCO0FBQ0EsVUFBSSxTQUFTLEdBQUcsS0FBSyxLQUFMLENBQVcsU0FBM0IsQ0FGSyxDQUdMO0FBQ0E7O0FBQ0EseUJBQVMsV0FBVCxDQUNLLEtBQUssTUFBTCxHQUFjLEtBQUssQ0FBQyxVQUFyQixHQUFtQyxTQUR2QyxFQUVLLEtBQUssV0FBTCxHQUFtQixLQUFLLENBQUMsV0FBMUIsR0FBeUMsU0FGN0MsRUFHSyxLQUFLLE1BQUwsR0FBYyxLQUFLLENBQUMsVUFIekIsRUFJSyxLQUFLLFdBQUwsR0FBbUIsS0FBSyxDQUFDLFdBSjlCLEVBS0ksS0FBSyxvQkFMVCxFQU1JLEtBQUssS0FOVDtBQVFIO0FBQ0Q7Ozs7Ozs7Ozs7b0NBT2dCLEMsRUFBRyxDLEVBQUc7QUFDbEIsVUFBSSxLQUFLLEdBQUcsS0FBSyxhQUFqQjtBQUNBLFVBQUksTUFBTSxHQUFHLEtBQUssTUFBbEI7QUFFQSxVQUFJLENBQUMsR0FBRyxDQUFDLEdBQUcsTUFBTSxDQUFDLENBQW5CO0FBQ0EsVUFBSSxDQUFDLEdBQUcsQ0FBQyxHQUFHLE1BQU0sQ0FBQyxDQUFuQjtBQUVBLFVBQUksRUFBRSxHQUFHLEtBQUssTUFBTCxHQUFjLEtBQUssQ0FBQyxVQUE3QjtBQUNBLFVBQUksRUFBRSxHQUFHLEtBQUssV0FBTCxHQUFtQixLQUFLLENBQUMsV0FBbEMsQ0FSa0IsQ0FVbEI7O0FBQ0EsYUFBUyxDQUFDLEdBQUMsQ0FBSCxJQUFTLEVBQUUsR0FBQyxFQUFaLENBQUQsR0FBc0IsQ0FBQyxHQUFDLENBQUgsSUFBUyxFQUFFLEdBQUMsRUFBWixDQUFyQixJQUF5QyxDQUFoRDtBQUNIOzs7d0JBckRpQjtBQUNkLFVBQUksTUFBTSxHQUFHLEtBQUssTUFBbEI7QUFDQSxVQUFJLEtBQUssR0FBRyxLQUFLLGFBQWpCO0FBQ0EsVUFBSSxTQUFTLEdBQUcsS0FBSyxLQUFMLENBQVcsU0FBM0I7QUFDQSxhQUFPO0FBQ0gsUUFBQSxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQVAsSUFDQyxLQUFLLFdBQUwsR0FBbUIsS0FBSyxDQUFDLFdBQTFCLEdBQXlDLFNBRHpDLENBREY7QUFHSCxRQUFBLElBQUksRUFBRSxNQUFNLENBQUMsQ0FBUCxJQUNBLEtBQUssTUFBTCxHQUFjLEtBQUssQ0FBQyxVQUFyQixHQUFtQyxTQURsQyxDQUhIO0FBS0gsUUFBQSxNQUFNLEVBQUUsTUFBTSxDQUFDLENBQVAsR0FDSCxLQUFLLFdBQUwsR0FBbUIsS0FBSyxDQUFDLFdBRHRCLEdBQ3FDLFNBTjFDO0FBT0gsUUFBQSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQVAsR0FDRixLQUFLLE1BQUwsR0FBYyxLQUFLLENBQUMsVUFEbEIsR0FDZ0M7QUFScEMsT0FBUDtBQVVIOzs7O0VBcEN3Qix1Qzs7Ozs7Ozs7Ozs7O0FDUjdCOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBOzs7SUFHYSxLOzs7OztBQUNUOzs7QUFHQSxpQkFBWSxPQUFaLEVBQXFCO0FBQUE7O0FBQUE7O0FBQ2pCLCtFQUFNLE9BQU47QUFDQTs7OztBQUdBLFVBQUssYUFBTCxHQUFxQixPQUFPLENBQUMsS0FBN0I7QUFMaUI7QUFNcEI7QUFFRDs7Ozs7Ozs7O0FBZUE7Ozs7NkJBSVM7QUFDTCxVQUFJLEtBQUssR0FBRyxLQUFLLGFBQWpCO0FBQ0EsVUFBSSxLQUFLLEdBQUcsSUFBSSxNQUFNLENBQUMsS0FBWCxFQUFaO0FBQ0EsTUFBQSxLQUFLLENBQUMsR0FBTixHQUFZLEtBQUssYUFBTCxDQUFtQixHQUEvQjtBQUNBLE1BQUEsS0FBSyxDQUFDLEtBQU4sR0FBYyxLQUFLLGFBQUwsQ0FBbUIsS0FBbkIsR0FBMkIsS0FBSyxDQUFDLFVBQS9DO0FBQ0EsTUFBQSxLQUFLLENBQUMsTUFBTixHQUFlLEtBQUssYUFBTCxDQUFtQixNQUFuQixHQUE0QixLQUFLLENBQUMsV0FBakQ7O0FBQ0EseUJBQVMsU0FBVCxDQUFtQixDQUFuQixFQUFzQixDQUF0QixFQUF5QixLQUF6QixFQUFnQyxLQUFLLG9CQUFyQyxFQUEyRCxLQUFLLEtBQWhFO0FBQ0g7Ozt3QkF0QmlCO0FBQ2QsVUFBSSxhQUFhLEdBQUcsS0FBSyxhQUF6QjtBQUNBLFVBQUksTUFBTSxHQUFHLEtBQUssTUFBbEI7QUFDQSxhQUFPO0FBQ0gsUUFBQSxHQUFHLEVBQUUsTUFBTSxDQUFDLENBRFQ7QUFFSCxRQUFBLElBQUksRUFBRSxNQUFNLENBQUMsQ0FGVjtBQUdILFFBQUEsTUFBTSxFQUFFLE1BQU0sQ0FBQyxDQUFQLEdBQVksYUFBYSxDQUFDLFdBQWQsR0FBNEIsS0FBSyxhQUFMLENBQW1CLE1BSGhFO0FBSUgsUUFBQSxLQUFLLEVBQUUsTUFBTSxDQUFDLENBQVAsR0FBWSxhQUFhLENBQUMsVUFBZCxHQUEyQixLQUFLLGFBQUwsQ0FBbUI7QUFKOUQsT0FBUDtBQU1IOzs7O0VBekJzQix1Qzs7Ozs7Ozs7Ozs7O0FDTjNCOzs7Ozs7OztBQUVBOzs7SUFHYSxJOzs7QUFDVDs7Ozs7Ozs7QUFRQSxnQkFBWSxNQUFaLEVBQW9CLFNBQXBCLEVBQStCO0FBQUE7O0FBQzNCOzs7QUFHQSxTQUFLLEVBQUwsR0FBVSxNQUFWO0FBRUE7Ozs7QUFHQSxTQUFLLFNBQUwsR0FBaUIsU0FBakI7QUFFQTs7OztBQUdBLFNBQUssRUFBTCxHQUFVLG1CQUFPLEdBQVAsQ0FBVyxLQUFLLEVBQWhCLEVBQW9CLEtBQUssU0FBekIsQ0FBVjtBQUNIO0FBRUQ7Ozs7Ozs7OztxQ0FLaUIsQyxFQUFHO0FBQ2hCLGFBQU8sSUFBSSxDQUFDLFlBQUwsQ0FBa0IsSUFBbEIsRUFBd0IsQ0FBeEIsQ0FBUDtBQUNIO0FBRUQ7Ozs7Ozs7OztpQ0FNb0IsRSxFQUFJLEUsRUFBSTtBQUN4QixVQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBSCxDQUFNLENBQWY7QUFBQSxVQUNJLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBSCxDQUFNLENBRGY7QUFBQSxVQUVJLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBSCxDQUFNLENBRmY7QUFBQSxVQUdJLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBSCxDQUFNLENBSGY7QUFJQSxVQUFJLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBSCxDQUFNLENBQWY7QUFBQSxVQUNJLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBSCxDQUFNLENBRGY7QUFBQSxVQUVJLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBSCxDQUFNLENBRmY7QUFBQSxVQUdJLEVBQUUsR0FBRyxFQUFFLENBQUMsRUFBSCxDQUFNLENBSGY7QUFJQSxVQUFJLFdBQVcsR0FBRyxDQUFDLEVBQUUsR0FBRyxFQUFOLEtBQWEsRUFBRSxHQUFHLEVBQWxCLElBQXdCLENBQUMsRUFBRSxHQUFHLEVBQU4sS0FBYSxFQUFFLEdBQUcsRUFBbEIsQ0FBMUM7O0FBQ0EsVUFBSSxXQUFXLEtBQUssQ0FBcEIsRUFBdUI7QUFDbkIsZUFBTyxJQUFQO0FBQ0g7O0FBRUQsVUFBSSxVQUFVLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBTCxHQUFVLEVBQUUsR0FBRyxFQUFoQixLQUF1QixFQUFFLEdBQUcsRUFBNUIsSUFBa0MsQ0FBQyxFQUFFLEdBQUcsRUFBTixLQUFhLEVBQUUsR0FBRyxFQUFMLEdBQVUsRUFBRSxHQUFHLEVBQTVCLENBQW5EO0FBQ0EsVUFBSSxVQUFVLEdBQUcsQ0FBQyxFQUFFLEdBQUcsRUFBTCxHQUFVLEVBQUUsR0FBRyxFQUFoQixLQUF1QixFQUFFLEdBQUcsRUFBNUIsSUFBa0MsQ0FBQyxFQUFFLEdBQUcsRUFBTixLQUFhLEVBQUUsR0FBRyxFQUFMLEdBQVUsRUFBRSxHQUFHLEVBQTVCLENBQW5EO0FBQ0EsYUFBTyxJQUFJLGtCQUFKLENBQVcsQ0FBQyxVQUFVLEdBQUcsV0FBZCxFQUEyQixVQUFVLEdBQUcsV0FBeEMsQ0FBWCxDQUFQO0FBQ0g7Ozs7Ozs7Ozs7Ozs7Ozs7QUMvREw7O0FBQ0E7Ozs7Ozs7O0FBRUE7Ozs7Ozs7SUFPYSxrQjs7O0FBQ1Q7OztBQUdBLDhCQUFZLE9BQVosRUFBcUI7QUFBQTs7QUFFakIsSUFBQSxPQUFPLEdBQUcsT0FBTyxJQUFJLEVBQXJCO0FBRUEsU0FBSyxNQUFMLEdBQWMsRUFBZDtBQUNBLFNBQUssTUFBTCxDQUFZLEtBQVosR0FBb0IsT0FBTyxDQUFDLEtBQVIsSUFBaUIsS0FBckM7QUFFQTs7Ozs7QUFJQSxTQUFLLFVBQUwsR0FBa0IsSUFBbEI7QUFFQTs7Ozs7QUFJQSxTQUFLLFlBQUwsR0FBb0IsSUFBcEI7QUFFQTs7Ozs7QUFJQSxTQUFLLFdBQUwsR0FBbUIsQ0FBbkI7QUFFQTs7Ozs7QUFJQSxTQUFLLFlBQUwsR0FBb0IsQ0FBcEI7QUFFQTs7Ozs7O0FBS0EsU0FBSyxFQUFMLEdBQVUsSUFBSSxrQkFBSixDQUFXLENBQUMsT0FBTyxDQUFDLENBQVIsSUFBYSxDQUFkLEVBQWlCLE9BQU8sQ0FBQyxDQUFSLElBQWEsQ0FBOUIsQ0FBWCxDQUFWO0FBRUE7Ozs7O0FBSUEsU0FBSyxLQUFMLEdBQWEsTUFBTSxDQUFDLE1BQVAsQ0FBYyxFQUFkLEVBQWtCLGtCQUFsQixFQUE0QixPQUFPLENBQUMsS0FBcEMsQ0FBYjtBQUVBOzs7OztBQUtBOztBQUVBOzs7OztBQUlBLFNBQUssU0FBTCxHQUFpQixPQUFPLENBQUMsU0FBUixJQUFxQixLQUF0QztBQUVBOzs7O0FBSUE7QUFDQTs7QUFFQTs7Ozs7OztBQU1BLFNBQUssbUJBQUwsR0FBMkIsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsUUFBdkIsQ0FBM0I7QUFFQTs7Ozs7QUFJQSxTQUFLLG9CQUFMLEdBQTRCLEtBQUssbUJBQUwsQ0FBeUIsVUFBekIsQ0FBb0MsSUFBcEMsQ0FBNUI7QUFFQTs7Ozs7O0FBS0EsU0FBSyxPQUFMLEdBQWUsT0FBTyxDQUFDLE1BQVIsSUFBa0IsSUFBakM7QUFFQTs7Ozs7QUFJQSxTQUFLLFdBQUwsR0FBbUIsSUFBbkI7QUFFQTs7Ozs7QUFJQSxTQUFLLFNBQUwsR0FBaUIsSUFBakI7QUFFQTs7Ozs7QUFJQSxTQUFLLFdBQUwsR0FBbUIsSUFBbkI7QUFFQTs7Ozs7QUFJQSxTQUFLLFVBQUwsR0FBa0IsSUFBbEI7QUFFQTs7Ozs7QUFJQSxTQUFLLE9BQUwsR0FBZSxJQUFmOztBQUdBLFFBQUksS0FBSyxTQUFULEVBQW9CO0FBQ2hCLFdBQUssY0FBTDtBQUNIO0FBQ0o7QUFFRDs7Ozs7Ozs7Ozs7QUFxTEE7OztxQ0FHaUI7QUFDYjtBQUNBO0FBQ0EsV0FBSyxXQUFMLEdBQW1CLEtBQUssU0FBeEI7QUFDSDtBQUVEOzs7Ozs7c0NBR2tCO0FBQ2Q7QUFDQTtBQUNBLFdBQUssV0FBTCxHQUFtQixJQUFuQjtBQUNBLFdBQUssV0FBTCxHQUFtQixJQUFuQjtBQUNBLFdBQUssU0FBTCxHQUFpQixJQUFqQjtBQUNBLFdBQUssVUFBTCxHQUFrQixJQUFsQjtBQUNBLFdBQUssU0FBTCxHQUFpQixJQUFqQjtBQUNIO0FBRUQ7Ozs7Ozs7OEJBSVUsQyxFQUFHO0FBQ1Q7QUFDQTtBQUNBLFdBQUssWUFBTCxHQUFvQixJQUFJLGtCQUFKLENBQVcsQ0FBQyxDQUFDLENBQUMsT0FBSCxFQUFZLENBQUMsQ0FBQyxPQUFkLENBQVgsRUFBbUMsUUFBbkMsQ0FBNEMsS0FBSyxNQUFqRCxDQUFwQjtBQUNBLFdBQUssV0FBTCxHQUFtQixJQUFuQjtBQUNBLFdBQUssV0FBTCxHQUFtQixLQUFLLElBQXhCO0FBQ0EsV0FBSyxTQUFMLEdBQWlCLEtBQUssT0FBdEI7QUFDQSxXQUFLLFVBQUwsR0FBa0IsS0FBSyxPQUF2QjtBQUNIO0FBRUQ7Ozs7Ozs7eUJBSUssQyxFQUFHO0FBQ0osV0FBSyxDQUFMLEdBQVMsSUFBSSxrQkFBSixDQUFXLENBQUMsQ0FBQyxDQUFDLE9BQUgsRUFBWSxDQUFDLENBQUMsT0FBZCxDQUFYLEVBQW1DLFFBQW5DLENBQTRDLEtBQUssWUFBakQsQ0FBVDtBQUNBLFdBQUssU0FBTCxHQUFpQixJQUFqQjtBQUNIO0FBRUQ7Ozs7Ozs7NEJBSVEsQyxFQUFHO0FBQ1AsV0FBSyxXQUFMLEdBQW1CLEtBQUssU0FBeEI7QUFDQSxXQUFLLFdBQUwsR0FBbUIsSUFBbkI7QUFDQSxXQUFLLFNBQUwsR0FBaUIsSUFBakI7QUFDQSxXQUFLLFVBQUwsR0FBa0IsSUFBbEI7QUFDQSxXQUFLLFNBQUwsR0FBaUIsSUFBakI7QUFDSDtBQUVEOzs7Ozs7Ozt5QkFLSyxPLEVBQVMsTSxFQUFRO0FBQ2xCLFVBQUksV0FBVyxHQUFHLEtBQUssV0FBdkI7QUFFQSxXQUFLLFNBQUwsR0FBaUIsS0FBakI7O0FBRUEsVUFBSSxLQUFLLFdBQUwsSUFBb0IsS0FBSyxNQUE3QixFQUFxQztBQUNqQztBQUNBLGVBQU8sS0FBSyxtQkFBWjtBQUNBLGVBQU8sS0FBSyxvQkFBWixDQUhpQyxDQUtqQzs7QUFDQSxhQUFLLG1CQUFMLEdBQTJCLFFBQVEsQ0FBQyxhQUFULENBQXVCLFFBQXZCLENBQTNCO0FBQ0EsYUFBSyxvQkFBTCxHQUE0QixLQUFLLG1CQUFMLENBQXlCLFVBQXpCLENBQW9DLElBQXBDLENBQTVCLENBUGlDLENBT3NDO0FBRXZFOztBQUNBLGFBQUssbUJBQUwsQ0FBeUIsS0FBekIsR0FBaUMsV0FBVyxDQUFDLEtBQVosR0FBb0IsV0FBVyxDQUFDLElBQWpFO0FBQ0EsYUFBSyxtQkFBTCxDQUF5QixNQUF6QixHQUFrQyxXQUFXLENBQUMsTUFBWixHQUFxQixXQUFXLENBQUMsR0FBbkU7QUFFQSxhQUFLLE1BQUw7QUFDQSxhQUFLLFdBQUwsR0FBbUIsS0FBbkI7QUFDSCxPQXBCaUIsQ0FzQmxCO0FBQ0E7OztBQUNBLFVBQUksS0FBSyxNQUFMLENBQVksS0FBaEIsRUFBdUI7QUFDdEIsYUFBSyxvQkFBTCxDQUEwQixTQUExQjs7QUFDRyxhQUFLLG9CQUFMLENBQTBCLFdBQTFCLENBQXNDLENBQUMsQ0FBRCxFQUFJLEVBQUosQ0FBdEM7O0FBQ0gsYUFBSyxvQkFBTCxDQUEwQixTQUExQixHQUFvQyxHQUFwQztBQUNHLGFBQUssb0JBQUwsQ0FBMEIsV0FBMUIsR0FBc0MsU0FBdEM7QUFDSCxhQUFLLG9CQUFMLENBQTBCLFdBQTFCLEdBQXNDLFNBQXRDOztBQUNBLGFBQUssb0JBQUwsQ0FBMEIsVUFBMUIsQ0FBcUMsQ0FBckMsRUFBdUMsQ0FBdkMsRUFBeUMsS0FBSyxtQkFBTCxDQUF5QixLQUFsRSxFQUF5RSxLQUFLLG1CQUFMLENBQXlCLE1BQWxHOztBQUNBLGFBQUssb0JBQUwsQ0FBMEIsU0FBMUI7QUFDQSxPQWhDaUIsQ0FrQ2xCOztBQUNBOzs7Ozs7O0FBUUE7OztBQUNBLFVBQUksQ0FBQyxHQUFHLFdBQVcsQ0FBQyxJQUFaLElBQW9CLE1BQU0sSUFBSSxNQUFNLENBQUMsSUFBakIsR0FBd0IsTUFBTSxDQUFDLElBQS9CLEdBQXNDLENBQTFELENBQVI7QUFDQSxVQUFJLENBQUMsR0FBRyxXQUFXLENBQUMsR0FBWixJQUFtQixNQUFNLElBQUksTUFBTSxDQUFDLEdBQWpCLEdBQXVCLE1BQU0sQ0FBQyxHQUE5QixHQUFvQyxDQUF2RCxDQUFSOztBQUNBLHlCQUFTLFNBQVQsQ0FBbUIsQ0FBbkIsRUFBc0IsQ0FBdEIsRUFBeUIsS0FBSyxtQkFBOUIsRUFBbUQsT0FBbkQsRUFBNEQsS0FBSyxLQUFqRTtBQUNILEssQ0FFRDs7QUFDQTs7Ozs7Ozs7OzZCQU1TLENBQUU7QUFFWDs7Ozs7Ozs7Ozt5Q0FPcUIsQyxFQUFHLEMsRUFBRztBQUN2QixVQUFJLFdBQVcsR0FBRyxLQUFLLFdBQXZCO0FBQ0EsYUFDSSxDQUFDLEdBQUcsV0FBVyxDQUFDLElBQWhCLElBQ0EsQ0FBQyxHQUFHLFdBQVcsQ0FBQyxHQURoQixJQUVBLENBQUMsR0FBRyxXQUFXLENBQUMsS0FGaEIsSUFHQSxDQUFDLEdBQUcsV0FBVyxDQUFDLE1BSnBCO0FBTUg7QUFFRDs7Ozs7Ozs7Ozs7b0NBUWdCLEMsRUFBRyxDLEVBQUc7QUFDbEIsYUFBTyxLQUFLLG9CQUFMLENBQTBCLENBQTFCLEVBQTZCLENBQTdCLENBQVA7QUFDSDtBQUVEOzs7Ozs7a0NBR2M7QUFDVixVQUFJLEtBQUssTUFBVCxFQUFpQjtBQUNiLFlBQUksS0FBSyxHQUFHLEtBQUssTUFBTCxDQUFZLFFBQVosQ0FBcUIsT0FBckIsQ0FBNkIsSUFBN0IsQ0FBWjs7QUFDQSxZQUFJLEtBQUssSUFBSSxDQUFiLEVBQWdCO0FBQ1osZUFBSyxNQUFMLENBQVksUUFBWixDQUFxQixNQUFyQixDQUE0QixLQUE1QixFQUFtQyxDQUFuQztBQUNBLGVBQUssTUFBTCxDQUFZLFFBQVosQ0FBcUIsTUFBckIsQ0FBNEIsS0FBSyxNQUFMLENBQVksUUFBWixDQUFxQixNQUFqRCxFQUF5RCxDQUF6RCxFQUE0RCxJQUE1RDtBQUNBLGVBQUssU0FBTCxHQUFpQixJQUFqQjtBQUNIO0FBQ0o7QUFDSjtBQUVEOzs7Ozs7aUNBR2E7QUFDVCxVQUFJLEtBQUssTUFBVCxFQUFpQjtBQUNiLFlBQUksS0FBSyxHQUFHLEtBQUssTUFBTCxDQUFZLFFBQVosQ0FBcUIsT0FBckIsQ0FBNkIsSUFBN0IsQ0FBWjs7QUFDQSxZQUFJLEtBQUssSUFBSSxDQUFiLEVBQWdCO0FBQ1osZUFBSyxNQUFMLENBQVksUUFBWixDQUFxQixNQUFyQixDQUE0QixLQUE1QixFQUFtQyxDQUFuQztBQUNBLGVBQUssTUFBTCxDQUFZLFFBQVosQ0FBcUIsTUFBckIsQ0FBNEIsQ0FBNUIsRUFBK0IsQ0FBL0IsRUFBa0MsSUFBbEM7QUFDQSxlQUFLLFNBQUwsR0FBaUIsSUFBakI7QUFDSDtBQUNKO0FBQ0o7QUFHRDs7Ozs7O2tDQUdjO0FBQ1YsVUFBSSxLQUFLLE1BQVQsRUFBaUI7QUFDYixZQUFJLEtBQUssR0FBRyxLQUFLLE1BQUwsQ0FBWSxRQUFaLENBQXFCLE9BQXJCLENBQTZCLElBQTdCLENBQVo7O0FBQ0EsWUFBSSxLQUFLLElBQUksQ0FBVCxJQUFjLEtBQUssR0FBRyxLQUFLLE1BQUwsQ0FBWSxRQUFaLENBQXFCLE1BQXJCLEdBQThCLENBQXhELEVBQTJEO0FBQ3ZELGVBQUssTUFBTCxDQUFZLFFBQVosQ0FBcUIsTUFBckIsQ0FBNEIsS0FBNUIsRUFBbUMsQ0FBbkM7QUFDQSxlQUFLLE1BQUwsQ0FBWSxRQUFaLENBQXFCLE1BQXJCLENBQTRCLEtBQUssR0FBRyxDQUFwQyxFQUF1QyxDQUF2QyxFQUEwQyxJQUExQyxFQUZ1RCxDQUVOOztBQUNqRCxlQUFLLE1BQUwsQ0FBWSxtQkFBWjtBQUNBLGVBQUssV0FBTCxHQUFtQixJQUFuQjtBQUNBLGVBQUssU0FBTCxHQUFpQixJQUFqQjtBQUNIO0FBQ0o7QUFDSjtBQUVEOzs7Ozs7bUNBR2U7QUFDWCxVQUFJLEtBQUssTUFBVCxFQUFpQjtBQUNiLFlBQUksS0FBSyxHQUFHLEtBQUssTUFBTCxDQUFZLFFBQVosQ0FBcUIsT0FBckIsQ0FBNkIsSUFBN0IsQ0FBWjs7QUFDQSxZQUFJLEtBQUssR0FBRyxDQUFaLEVBQWU7QUFDWCxlQUFLLE1BQUwsQ0FBWSxRQUFaLENBQXFCLE1BQXJCLENBQTRCLEtBQTVCLEVBQW1DLENBQW5DO0FBQ0EsZUFBSyxNQUFMLENBQVksUUFBWixDQUFxQixNQUFyQixDQUE0QixLQUFLLEdBQUcsQ0FBcEMsRUFBdUMsQ0FBdkMsRUFBMEMsSUFBMUM7QUFDQSxlQUFLLE1BQUwsQ0FBWSxtQkFBWjtBQUNBLGVBQUssV0FBTCxHQUFtQixJQUFuQjtBQUNBLGVBQUssU0FBTCxHQUFpQixJQUFqQjtBQUNIO0FBQ0o7QUFDSjs7O3dCQS9YWTtBQUNULGFBQVEsS0FBSyxNQUFMLEdBQWMsbUJBQU8sR0FBUCxDQUFXLEtBQUssQ0FBaEIsRUFBbUIsS0FBSyxNQUFMLENBQVksTUFBL0IsQ0FBZCxHQUF1RCxLQUFLLENBQXBFO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7Ozt3QkFVZ0I7QUFDWixhQUFPLEtBQUssVUFBWjtBQUNIO0FBRUQ7Ozs7Ozs7Ozs7O3NCQVVjLEcsRUFBSztBQUNmLFVBQUksS0FBSyxNQUFMLElBQWUsR0FBbkIsRUFBd0I7QUFDcEIsYUFBSyxNQUFMLENBQVksU0FBWixHQUF3QixHQUF4QjtBQUNBLGFBQUssTUFBTCxDQUFZLFdBQVosR0FBMEIsSUFBMUIsQ0FGb0IsQ0FFWTtBQUNuQzs7QUFDRCxXQUFLLFVBQUwsR0FBa0IsR0FBbEI7QUFDSDtBQUVEOzs7Ozs7Ozs7Ozs7O3dCQVVrQjtBQUNkLGFBQU8sS0FBSyxZQUFaO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7c0JBVWdCLEcsRUFBSztBQUNqQixVQUFJLEtBQUssTUFBTCxJQUFlLEdBQW5CLEVBQXdCO0FBQ3BCLGFBQUssTUFBTCxDQUFZLFdBQVosR0FBMEIsR0FBMUI7QUFDSDs7QUFDRCxXQUFLLFlBQUwsR0FBb0IsR0FBcEI7QUFDSDtBQUVEOzs7Ozs7O3dCQUlpQjtBQUNiLGFBQU8sS0FBSyxXQUFaO0FBQ0g7QUFDRDs7Ozs7c0JBSWUsRyxFQUFLO0FBQ2hCLFdBQUssV0FBTCxHQUFtQixHQUFuQjtBQUNBLFdBQUssV0FBTCxHQUFtQixJQUFuQjtBQUNBLFdBQUssU0FBTCxHQUFpQixJQUFqQjtBQUhnQjtBQUFBO0FBQUE7O0FBQUE7QUFJaEIsNkJBQWMsS0FBSyxRQUFuQiw4SEFBNkI7QUFBQSxjQUFwQixDQUFvQjtBQUN6QixVQUFBLENBQUMsQ0FBQyxXQUFGLEdBQWdCLElBQWhCO0FBQ0EsVUFBQSxDQUFDLENBQUMsU0FBRixHQUFjLElBQWQ7QUFDSDtBQVBlO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFRbkI7QUFFRDs7Ozs7Ozt3QkFJa0I7QUFDZCxhQUFPLEtBQUssWUFBWjtBQUNIO0FBQ0Q7Ozs7OztzQkFLZ0IsRyxFQUFLO0FBQ2pCLFdBQUssWUFBTCxHQUFvQixHQUFwQjtBQUNBLFdBQUssV0FBTCxHQUFtQixJQUFuQjtBQUNBLFdBQUssU0FBTCxHQUFpQixJQUFqQjtBQUhpQjtBQUFBO0FBQUE7O0FBQUE7QUFJakIsOEJBQWMsS0FBSyxRQUFuQixtSUFBNkI7QUFBQSxjQUFwQixDQUFvQjtBQUN6QixVQUFBLENBQUMsQ0FBQyxXQUFGLEdBQWdCLElBQWhCO0FBQ0EsVUFBQSxDQUFDLENBQUMsU0FBRixHQUFjLElBQWQ7QUFDSDtBQVBnQjtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBUXBCO0FBRUQ7Ozs7Ozs7d0JBSVk7QUFDUixhQUFPO0FBQ0gsUUFBQSxVQUFVLEVBQUUsS0FBSyxVQURkO0FBRUgsUUFBQSxXQUFXLEVBQUUsS0FBSztBQUZmLE9BQVA7QUFJSDtBQUVEOzs7OztzQkFJVSxHLEVBQUs7QUFDWCxXQUFLLFdBQUwsR0FBbUIsR0FBbkI7QUFDQSxXQUFLLFVBQUwsR0FBa0IsR0FBbEI7QUFDSDtBQUVEOzs7Ozs7O3dCQUlvQjtBQUNoQixhQUFPO0FBQ0gsUUFBQSxVQUFVLEVBQUUsS0FBSyxNQUFMLEdBQWMsS0FBSyxVQUFMLEdBQWtCLEtBQUssTUFBTCxDQUFZLGFBQVosQ0FBMEIsVUFBMUQsR0FBdUUsS0FBSyxVQURyRjtBQUVILFFBQUEsV0FBVyxFQUFFLEtBQUssTUFBTCxHQUFjLEtBQUssV0FBTCxHQUFtQixLQUFLLE1BQUwsQ0FBWSxhQUFaLENBQTBCLFdBQTNELEdBQXlFLEtBQUs7QUFGeEYsT0FBUDtBQUlIO0FBRUQ7Ozs7Ozs7d0JBSVE7QUFDSixhQUFPLEtBQUssRUFBWjtBQUNIO0FBRUQ7Ozs7OztzQkFLTSxHLEVBQUs7QUFDUCxXQUFLLEVBQUwsR0FBVSxHQUFWO0FBQ0g7QUFFRDs7Ozs7Ozt3QkFJYTtBQUNULGFBQU8sS0FBSyxPQUFaO0FBQ0gsSyxDQUNEOztBQUNBOzs7Ozs7c0JBS1csRyxFQUFLO0FBQ1osV0FBSyxPQUFMLEdBQWUsR0FBZjtBQUNIOzs7Ozs7Ozs7Ozs7Ozs7O0FDMVRMOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUVBOzs7SUFHYSxTOzs7OztBQUNUOzs7QUFHQSxxQkFBWSxPQUFaLEVBQXFCO0FBQUE7O0FBQUE7O0FBQ2pCLG1GQUFNLE9BQU47QUFDQTs7Ozs7QUFJQSxVQUFLLEtBQUwsR0FBYSxPQUFPLENBQUMsS0FBUixJQUFpQixDQUE5QjtBQUVBOzs7OztBQUlBLFVBQUssTUFBTCxHQUFjLE9BQU8sQ0FBQyxNQUFSLElBQWtCLENBQWhDO0FBWmlCO0FBYXBCO0FBRUQ7Ozs7Ozs7OztBQWVBOzs7OzZCQUlTO0FBQ0wsVUFBSSxhQUFhLEdBQUcsS0FBSyxhQUF6Qjs7QUFDQSx5QkFBUyxhQUFULENBQXdCLEtBQUssS0FBTCxDQUFXLFNBQW5DLEVBQ0ssS0FBSyxLQUFMLENBQVcsU0FEaEIsRUFFSSxLQUFLLEtBQUwsR0FBYSxhQUFhLENBQUMsVUFGL0IsRUFHSSxLQUFLLE1BQUwsR0FBYyxhQUFhLENBQUMsV0FIaEMsRUFJSSxLQUFLLG9CQUpULEVBS0ksS0FBSyxLQUxUO0FBTUg7Ozt3QkF2QmlCO0FBQ2QsVUFBSSxNQUFNLEdBQUcsS0FBSyxNQUFsQjtBQUNBLFVBQUksYUFBYSxHQUFHLEtBQUssYUFBekI7QUFDQSxhQUFPO0FBQ0gsUUFBQSxHQUFHLEVBQUUsTUFBTSxDQUFDLENBQVAsR0FBWSxLQUFLLEtBQUwsQ0FBVyxTQUR6QjtBQUVILFFBQUEsSUFBSSxFQUFFLE1BQU0sQ0FBQyxDQUFQLEdBQVksS0FBSyxLQUFMLENBQVcsU0FGMUI7QUFHSCxRQUFBLE1BQU0sRUFBRSxNQUFNLENBQUMsQ0FBUCxHQUFZLGFBQWEsQ0FBQyxXQUFkLEdBQTRCLEtBQUssTUFBN0MsR0FBd0QsS0FBSyxLQUFMLENBQVcsU0FIeEU7QUFJSCxRQUFBLEtBQUssRUFBRSxNQUFNLENBQUMsQ0FBUCxHQUFZLGFBQWEsQ0FBQyxVQUFkLEdBQTJCLEtBQUssS0FBNUMsR0FBc0QsS0FBSyxLQUFMLENBQVc7QUFKckUsT0FBUDtBQU1IOzs7O0VBaEMwQix1Qzs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDTi9COzs7QUFHTyxJQUFNLFFBQVEsR0FBRztBQUNwQjtBQUNBLEVBQUEsU0FBUyxFQUFFLE9BRlM7QUFHcEI7QUFDQSxFQUFBLFdBQVcsRUFBRSxPQUpPO0FBS3BCLEVBQUEsT0FBTyxFQUFFLE9BTFc7QUFNcEIsRUFBQSxTQUFTLEVBQUUsR0FOUztBQU9wQixFQUFBLFFBQVEsRUFBRSxPQVBVO0FBUXBCLEVBQUEsVUFBVSxFQUFFLEVBUlE7QUFTcEIsRUFBQSxJQUFJLEVBQUUsaUJBVGM7QUFVcEIsRUFBQSxTQUFTLEVBQUUsT0FWUztBQVdwQixFQUFBLFlBQVksRUFBRSxZQVhNLENBY3hCOztBQUVBOzs7OztBQWhCd0IsQ0FBakI7OztJQW9CTSxROzs7Ozs7Ozs7O0FBQ1Q7Ozs7Ozs7OzhCQVFpQixDLEVBQUcsQyxFQUFHLEssRUFBTyxNLEVBQVEsTyxFQUFTO0FBQzNDLE1BQUEsT0FBTyxDQUFDLFNBQVIsQ0FBa0IsQ0FBbEIsRUFBcUIsQ0FBckIsRUFBd0IsS0FBeEIsRUFBK0IsTUFBL0I7QUFDSDtBQUVEOzs7Ozs7Ozs7NkJBTWdCLFEsRUFBVSxPLEVBQVMsSyxFQUFPO0FBQ3RDLE1BQUEsTUFBTSxDQUFDLE1BQVAsQ0FBYyxPQUFkLEVBQXVCLEtBQXZCO0FBQ0EsTUFBQSxPQUFPLENBQUMsU0FBUjtBQUNBLE1BQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxRQUFRLENBQUMsQ0FBRCxDQUFSLENBQVksQ0FBM0IsRUFBOEIsUUFBUSxDQUFDLENBQUQsQ0FBUixDQUFZLENBQTFDOztBQUNBLFdBQUssSUFBSSxDQUFDLEdBQUcsQ0FBYixFQUFnQixDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQTdCLEVBQXFDLENBQUMsRUFBdEMsRUFBMEM7QUFDdEMsUUFBQSxPQUFPLENBQUMsTUFBUixDQUFlLFFBQVEsQ0FBQyxDQUFELENBQVIsQ0FBWSxDQUEzQixFQUE4QixRQUFRLENBQUMsQ0FBRCxDQUFSLENBQVksQ0FBMUM7QUFDSDs7QUFDRCxNQUFBLE9BQU8sQ0FBQyxNQUFSO0FBQ0g7QUFFRDs7Ozs7Ozs7O2dDQU1tQixRLEVBQVUsTyxFQUFTLEssRUFBTztBQUN6QyxNQUFBLE1BQU0sQ0FBQyxNQUFQLENBQWMsT0FBZCxFQUF1QixLQUF2QjtBQUNBLE1BQUEsT0FBTyxDQUFDLFNBQVI7QUFDQSxNQUFBLE9BQU8sQ0FBQyxNQUFSLENBQWUsUUFBUSxDQUFDLENBQUQsQ0FBUixDQUFZLENBQTNCLEVBQThCLFFBQVEsQ0FBQyxDQUFELENBQVIsQ0FBWSxDQUExQzs7QUFDQSxXQUFLLElBQUksQ0FBQyxHQUFHLENBQWIsRUFBZ0IsQ0FBQyxHQUFHLFFBQVEsQ0FBQyxNQUE3QixFQUFxQyxDQUFDLEVBQXRDLEVBQTBDO0FBQ3RDLFFBQUEsT0FBTyxDQUFDLE1BQVIsQ0FBZSxRQUFRLENBQUMsQ0FBRCxDQUFSLENBQVksQ0FBM0IsRUFBOEIsUUFBUSxDQUFDLENBQUQsQ0FBUixDQUFZLENBQTFDO0FBQ0g7O0FBQ0QsTUFBQSxPQUFPLENBQUMsU0FBUjtBQUNBLE1BQUEsT0FBTyxDQUFDLE1BQVI7QUFFSDs7OytCQUVpQixLLEVBQU8sRyxFQUFLLEUsRUFBSSxFLEVBQUksTyxFQUFTLEssRUFBTztBQUNsRCxNQUFBLE1BQU0sQ0FBQyxNQUFQLENBQWMsT0FBZCxFQUF1QixLQUF2QixFQURrRCxDQUVsRDs7QUFDQSxNQUFBLE9BQU8sQ0FBQyxTQUFSO0FBQ0EsTUFBQSxPQUFPLENBQUMsTUFBUixDQUFlLEtBQUssQ0FBQyxDQUFyQixFQUF3QixLQUFLLENBQUMsQ0FBOUI7QUFDQSxNQUFBLE9BQU8sQ0FBQyxhQUFSLENBQXNCLEVBQUUsQ0FBQyxDQUF6QixFQUE0QixFQUFFLENBQUMsQ0FBL0IsRUFBa0MsRUFBRSxDQUFDLENBQXJDLEVBQXdDLEVBQUUsQ0FBQyxDQUEzQyxFQUE4QyxHQUFHLENBQUMsQ0FBbEQsRUFBcUQsR0FBRyxDQUFDLENBQXpEO0FBQ0EsTUFBQSxPQUFPLENBQUMsTUFBUjtBQUNBLE1BQUEsT0FBTyxDQUFDLFNBQVI7QUFDSDtBQUVEOzs7Ozs7Ozs7Ozs7a0NBU3FCLEMsRUFBRyxDLEVBQUcsSyxFQUFPLE0sRUFBUSxPLEVBQVMsSyxFQUFPO0FBQ3RELE1BQUEsTUFBTSxDQUFDLE1BQVAsQ0FBYyxPQUFkLEVBQXVCLEtBQXZCO0FBQ0EsTUFBQSxPQUFPLENBQUMsSUFBUixDQUFhLENBQWIsRUFBZ0IsQ0FBaEIsRUFBbUIsS0FBbkIsRUFBMEIsTUFBMUI7QUFDQSxNQUFBLE9BQU8sQ0FBQyxJQUFSO0FBQ0EsTUFBQSxPQUFPLENBQUMsTUFBUjtBQUNILEssQ0FFRDs7QUFDQTs7Ozs7Ozs7Ozs7O2dDQVNtQixDLEVBQUcsQyxFQUFHLE0sRUFBUSxXLEVBQWEsTyxFQUFTLEssRUFBTztBQUMxRCxNQUFBLE1BQU0sQ0FBQyxNQUFQLENBQWMsT0FBZCxFQUF1QixLQUF2QixFQUQwRCxDQUUxRDs7QUFDQSxNQUFBLE9BQU8sQ0FBQyxPQUFSLENBQWdCLENBQWhCLEVBQW1CLENBQW5CLEVBQXNCLE1BQXRCLEVBQThCLFdBQTlCLEVBQTJDLENBQTNDLEVBQThDLENBQTlDLEVBQWlELElBQUksSUFBSSxDQUFDLEVBQTFEO0FBQ0EsTUFBQSxPQUFPLENBQUMsSUFBUjtBQUNBLE1BQUEsT0FBTyxDQUFDLE1BQVI7QUFDSDtBQUVEOzs7Ozs7Ozs7OzsrQkFRa0IsQyxFQUFHLEMsRUFBRyxNLEVBQVEsTyxFQUFTLEssRUFBTztBQUM1QyxNQUFBLE1BQU0sQ0FBQyxNQUFQLENBQWMsT0FBZCxFQUF1QixLQUF2QjtBQUNBLE1BQUEsT0FBTyxDQUFDLEdBQVIsQ0FBWSxDQUFaLEVBQWUsQ0FBZixFQUFrQixNQUFsQixFQUEwQixDQUExQixFQUE2QixJQUFJLElBQUksQ0FBQyxFQUF0QyxFQUY0QyxDQUc1QztBQUNBOztBQUNBLE1BQUEsT0FBTyxDQUFDLElBQVI7QUFDQSxNQUFBLE9BQU8sQ0FBQyxNQUFSO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7NkJBUWdCLEMsRUFBRyxDLEVBQUcsSSxFQUFNLE8sRUFBUyxLLEVBQU87QUFDeEMsTUFBQSxNQUFNLENBQUMsTUFBUCxDQUFjLE9BQWQsRUFBdUIsS0FBdkI7QUFDQSxNQUFBLE9BQU8sQ0FBQyxRQUFSLENBQWlCLElBQWpCLEVBQXVCLENBQXZCLEVBQTBCLENBQTFCLEVBRndDLENBR3hDO0FBQ0g7QUFFRDs7Ozs7Ozs7Ozs7OEJBUWlCLEMsRUFBRyxDLEVBQUcsSyxFQUFPLE8sRUFBUyxLLEVBQU87QUFDMUMsTUFBQSxNQUFNLENBQUMsTUFBUCxDQUFjLE9BQWQsRUFBdUIsS0FBdkIsRUFEMEMsQ0FFMUM7O0FBQ0EsVUFBSSxLQUFLLENBQUMsS0FBTixHQUFjLENBQWQsSUFBbUIsS0FBSyxDQUFDLE1BQU4sR0FBZSxDQUF0QyxFQUF5QztBQUNyQyxRQUFBLE9BQU8sQ0FBQyxTQUFSLENBQWtCLEtBQWxCLEVBQXlCLENBQXpCLEVBQTRCLENBQTVCLEVBQStCLEtBQUssQ0FBQyxLQUFyQyxFQUE0QyxLQUFLLENBQUMsTUFBbEQ7QUFDSDtBQUNKLEssQ0FFRDs7QUFDQTs7Ozs7Ozs7OztnQ0FPbUIsSSxFQUFNLE8sRUFBUyxLLEVBQU87QUFDckMsTUFBQSxNQUFNLENBQUMsTUFBUCxDQUFjLE9BQWQsRUFBdUIsS0FBdkI7QUFDQSxhQUFPLE9BQU8sQ0FBQyxXQUFSLENBQW9CLElBQXBCLENBQVA7QUFDSDs7Ozs7Ozs7Ozs7Ozs7OztBQzVLTDs7QUFDQTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQSxJQUFNLFNBQVMsa0dBQWY7QUFFQSxJQUFNLFFBQVEsR0FBRztBQUNiLEVBQUEsUUFBUSxFQUFFLE1BREc7QUFFYixFQUFBLFVBQVUsRUFBRSxZQUZDO0FBR2IsRUFBQSxTQUFTLEVBQUUsUUFIRTtBQUliLEVBQUEsV0FBVyxFQUFFLFFBSkE7QUFLYixFQUFBLFVBQVUsRUFBRSxRQUxDO0FBTWIsRUFBQSxVQUFVLEVBQUUsUUFOQztBQU9iLEVBQUEsU0FBUyxFQUFFLE9BUEU7QUFRYixFQUFBLFlBQVksRUFBRTtBQVJELENBQWpCOztBQVdBLFNBQVMsY0FBVCxDQUF3QixJQUF4QixFQUE4QjtBQUMxQjtBQUNBO0FBQ0E7QUFDQTtBQUVBO0FBQ0EsTUFBSSxVQUFVLEdBQUcsUUFBUSxDQUFDLGFBQVQsQ0FBdUIsTUFBdkIsQ0FBakI7QUFDQSxFQUFBLFVBQVUsQ0FBQyxTQUFYLEdBQXVCLFNBQXZCO0FBQ0EsRUFBQSxVQUFVLENBQUMsS0FBWCxDQUFpQixJQUFqQixHQUF3QixJQUF4QixDQVQwQixDQVcxQjs7QUFDQSxNQUFJLGFBQWEsR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUFwQjtBQUNBLEVBQUEsYUFBYSxDQUFDLEtBQWQsQ0FBb0IsT0FBcEIsR0FBOEIsY0FBOUI7QUFDQSxFQUFBLGFBQWEsQ0FBQyxLQUFkLENBQW9CLEtBQXBCLEdBQTRCLEtBQTVCO0FBQ0EsRUFBQSxhQUFhLENBQUMsS0FBZCxDQUFvQixNQUFwQixHQUE2QixHQUE3QjtBQUNBLEVBQUEsYUFBYSxDQUFDLEtBQWQsQ0FBb0IsYUFBcEIsR0FBb0MsVUFBcEMsQ0FoQjBCLENBa0IxQjs7QUFDQSxNQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsYUFBVCxDQUF1QixLQUF2QixDQUFkO0FBQ0EsRUFBQSxPQUFPLENBQUMsV0FBUixDQUFvQixVQUFwQjtBQUNBLEVBQUEsT0FBTyxDQUFDLFdBQVIsQ0FBb0IsYUFBcEI7QUFDQSxFQUFBLE9BQU8sQ0FBQyxLQUFSLENBQWMsVUFBZCxHQUEyQixRQUEzQjtBQUNBLEVBQUEsUUFBUSxDQUFDLElBQVQsQ0FBYyxXQUFkLENBQTBCLE9BQTFCLEVBdkIwQixDQXlCMUI7O0FBQ0EsTUFBSSxRQUFRLEdBQUcsVUFBVSxDQUFDLHFCQUFYLEVBQWY7QUFDQSxNQUFJLFlBQVksR0FBRyxhQUFhLENBQUMscUJBQWQsRUFBbkIsQ0EzQjBCLENBNkIxQjs7QUFDQSxNQUFJLE9BQU8sR0FBRyxRQUFRLENBQUMsR0FBVCxHQUFlLFFBQVEsQ0FBQyxJQUFULENBQWMsU0FBM0M7QUFDQSxNQUFJLFVBQVUsR0FBRyxPQUFPLEdBQUcsUUFBUSxDQUFDLE1BQXBDO0FBRUEsTUFBSSxRQUFRLEdBQUcsWUFBWSxDQUFDLEdBQWIsR0FBbUIsUUFBUSxDQUFDLElBQVQsQ0FBYyxTQUFoRDtBQUVBLEVBQUEsUUFBUSxDQUFDLElBQVQsQ0FBYyxXQUFkLENBQTBCLE9BQTFCLEVBbkMwQixDQXFDMUI7O0FBQ0EsTUFBSSxrQkFBa0IsR0FBRyxRQUFRLEdBQUcsT0FBcEMsQ0F0QzBCLENBd0MxQjs7QUFDQSxNQUFJLG1CQUFtQixHQUFHLFVBQVUsR0FBRyxRQUF2QztBQUVBLFNBQU87QUFDSCxJQUFBLE1BQU0sRUFBRSxRQUFRLENBQUMsTUFEZDtBQUVILElBQUEsTUFBTSxFQUFFLGtCQUZMO0FBR0gsSUFBQSxPQUFPLEVBQUU7QUFITixHQUFQO0FBS0g7QUFFRDs7Ozs7SUFHYSxJOzs7OztBQUNUOzs7QUFHQSxnQkFBWSxPQUFaLEVBQXFCO0FBQUE7O0FBQUE7O0FBQ2pCLDhFQUFNLE9BQU47QUFFQTs7OztBQUdBLFVBQUssSUFBTCxHQUFZLE9BQU8sQ0FBQyxJQUFwQjtBQUVBOzs7O0FBR0EsVUFBSyxRQUFMLEdBQWdCLE9BQU8sQ0FBQyxRQUFSLElBQW9CLFFBQVEsQ0FBQyxRQUE3QztBQUVBOzs7O0FBR0EsVUFBSyxVQUFMLEdBQWtCLE9BQU8sQ0FBQyxVQUFSLElBQXNCLFFBQVEsQ0FBQyxVQUFqRDtBQUVBOzs7O0FBR0EsVUFBSyxTQUFMLEdBQWlCLE9BQU8sQ0FBQyxTQUFSLElBQXFCLFFBQVEsQ0FBQyxTQUEvQztBQUVBOzs7O0FBR0EsVUFBSyxXQUFMLEdBQW1CLE9BQU8sQ0FBQyxXQUFSLElBQXVCLFFBQVEsQ0FBQyxXQUFuRDtBQUVBOzs7O0FBR0EsVUFBSyxVQUFMLEdBQWtCLE9BQU8sQ0FBQyxVQUFSLElBQXNCLFFBQVEsQ0FBQyxVQUFqRDtBQUVBOzs7O0FBR0EsVUFBSyxVQUFMLEdBQWtCLE9BQU8sQ0FBQyxVQUFSLElBQXNCLFFBQVEsQ0FBQyxVQUFqRDtBQUVBOzs7O0FBR0EsVUFBSyxTQUFMLEdBQWlCLE9BQU8sQ0FBQyxTQUFSLElBQXFCLFFBQVEsQ0FBQyxTQUEvQztBQUVBOzs7O0FBR0EsVUFBSyxZQUFMLEdBQW9CLE9BQU8sQ0FBQyxZQUFSLElBQXdCLFFBQVEsQ0FBQyxZQUFyRDtBQUVBLFVBQUssc0JBQUwsR0FBOEIsSUFBOUI7QUFoRGlCO0FBaURwQjtBQUVEOzs7Ozs7OztpQ0EyQmEsTyxFQUFTO0FBQ2xCLE1BQUEsTUFBTSxDQUFDLE1BQVAsQ0FBYyxLQUFLLEtBQW5CLEVBQTBCLE9BQTFCLEVBQW1DO0FBQy9CLFFBQUEsSUFBSSxZQUFLLEtBQUssU0FBVixjQUF1QixLQUFLLFdBQTVCLGNBQTJDLEtBQUssVUFBaEQsY0FBOEQsS0FBSyxRQUFuRSxjQUErRSxLQUFLLFVBQXBGLGNBQWtHLEtBQUssVUFBdkcsQ0FEMkI7QUFFL0IsUUFBQSxTQUFTLEVBQUUsS0FBSyxTQUZlO0FBRy9CLFFBQUEsWUFBWSxFQUFFLEtBQUs7QUFIWSxPQUFuQztBQUtIO0FBR0Q7Ozs7Ozs7NkJBSVM7QUFDTCxXQUFLLHNCQUFMLEdBQThCLElBQTlCOztBQUNBLFdBQUssWUFBTDs7QUFDQSx5QkFBUyxRQUFULENBQWtCLENBQWxCLEVBQXFCLEtBQUssV0FBTCxDQUFpQixNQUF0QyxFQUE4QyxLQUFLLElBQW5ELEVBQXlELEtBQUssb0JBQTlELEVBQW9GLEtBQUssS0FBekY7QUFFQTs7Ozs7Ozs7Ozs7Ozs7OztBQWVIOzs7d0JBeERpQjtBQUNkLFVBQUksS0FBSyxzQkFBTCxJQUErQixLQUFLLFlBQUwsS0FBc0IsSUFBekQsRUFBK0Q7QUFDM0QsYUFBSyxZQUFMOztBQUNBLGFBQUssWUFBTCxHQUFvQixtQkFBUyxXQUFULENBQXFCLEtBQUssSUFBMUIsRUFBZ0MsS0FBSyxvQkFBckMsRUFBMkQsS0FBSyxLQUFoRSxDQUFwQjtBQUNBLFFBQUEsTUFBTSxDQUFDLE1BQVAsQ0FBYyxLQUFLLFlBQW5CLEVBQWlDLGNBQWMsQ0FBQyxLQUFLLEtBQUwsQ0FBVyxJQUFaLENBQS9DO0FBQ0EsYUFBSyxzQkFBTCxHQUE4QixLQUE5QjtBQUNIOztBQUNELGFBQU8sS0FBSyxZQUFaO0FBQ0g7QUFFRDs7Ozs7Ozt3QkFJa0I7QUFDZCxhQUFPO0FBQ0gsUUFBQSxHQUFHLEVBQUUsS0FBSyxNQUFMLENBQVksQ0FBWixHQUFnQixLQUFLLFdBQUwsQ0FBaUIsTUFEbkM7QUFFSCxRQUFBLElBQUksRUFBRSxLQUFLLE1BQUwsQ0FBWSxDQUZmO0FBR0gsUUFBQSxNQUFNLEVBQUUsS0FBSyxNQUFMLENBQVksQ0FBWixHQUFnQixLQUFLLFdBQUwsQ0FBaUIsT0FIdEM7QUFJSCxRQUFBLEtBQUssRUFBRSxLQUFLLE1BQUwsQ0FBWSxDQUFaLEdBQWdCLEtBQUssV0FBTCxDQUFpQjtBQUpyQyxPQUFQO0FBTUg7Ozs7RUFoRnFCLHVDOzs7Ozs7Ozs7Ozs7QUNyRTFCOztBQUNBOztBQUNBOztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFFQTtBQUNBOztBQUVBOzs7SUFHYSxVOzs7OztBQUNUOzs7Ozs7O0FBT0Esc0JBQVksT0FBWixFQUFxQjtBQUFBOztBQUFBOztBQUNqQixvRkFBTSxPQUFOO0FBRUEsSUFBQSxPQUFPLENBQUMsUUFBUixHQUFtQixPQUFPLENBQUMsUUFBUixJQUFvQixFQUF2QyxDQUhpQixDQUtqQjs7QUFFQTs7Ozs7QUFJQSxVQUFLLFFBQUwsR0FBZ0IsT0FBTyxDQUFDLFFBQVIsQ0FBaUIsR0FBakIsQ0FBcUIsVUFBQSxDQUFDO0FBQUEsYUFBSSxJQUFJLGtCQUFKLENBQVcsQ0FBQyxDQUFDLENBQUMsQ0FBSCxFQUFNLENBQUMsQ0FBQyxDQUFSLENBQVgsQ0FBSjtBQUFBLEtBQXRCLENBQWhCOztBQUVBLFFBQUksWUFBWSxHQUFHLE1BQUssUUFBTCxDQUFjLEdBQWQsQ0FBa0IsVUFBQSxDQUFDO0FBQUEsYUFBSSxDQUFDLENBQUMsQ0FBTjtBQUFBLEtBQW5CLENBQW5COztBQUNBLFFBQUksWUFBWSxHQUFHLE1BQUssUUFBTCxDQUFjLEdBQWQsQ0FBa0IsVUFBQSxDQUFDO0FBQUEsYUFBSSxDQUFDLENBQUMsQ0FBTjtBQUFBLEtBQW5CLENBQW5CLENBZGlCLENBZ0JqQjs7O0FBQ0EsVUFBSyxLQUFMLEdBQWEsSUFBSSxDQUFDLEdBQUwsQ0FBUyxLQUFULENBQWUsSUFBZixFQUFxQixZQUFyQixDQUFiO0FBQ0EsVUFBSyxJQUFMLEdBQVksSUFBSSxDQUFDLEdBQUwsQ0FBUyxLQUFULENBQWUsSUFBZixFQUFxQixZQUFyQixDQUFaO0FBQ0EsVUFBSyxNQUFMLEdBQWMsSUFBSSxDQUFDLEdBQUwsQ0FBUyxLQUFULENBQWUsSUFBZixFQUFxQixZQUFyQixDQUFkO0FBQ0EsVUFBSyxPQUFMLEdBQWUsSUFBSSxDQUFDLEdBQUwsQ0FBUyxLQUFULENBQWUsSUFBZixFQUFxQixZQUFyQixDQUFmOztBQUVBLHFEQUFVLElBQUksa0JBQUosQ0FBVyxDQUFDLE1BQUssS0FBTixFQUFhLE1BQUssSUFBbEIsQ0FBWCxDQUFWOztBQUVBLFFBQUksbUJBQW1CLEdBQUcsTUFBSyxDQUEvQjtBQUVBLFVBQUssbUJBQUwsR0FBMkIsTUFBSyxRQUFMLENBQWMsR0FBZCxDQUFrQixVQUFBLENBQUM7QUFBQSxhQUFJLENBQUMsQ0FBQyxRQUFGLENBQVcsbUJBQVgsQ0FBSjtBQUFBLEtBQW5CLENBQTNCO0FBRUEsVUFBSyxzQkFBTCxHQUE4QixJQUE5QjtBQTVCaUI7QUE2QnBCO0FBRUQ7Ozs7Ozs7OztBQXFCQTs7Ozs7OztvQ0FPZ0IsQyxFQUFHLEMsRUFBRztBQUNsQixVQUFJLE1BQU0sR0FBRyxLQUFiOztBQUNBLDBGQUEwQixDQUExQixFQUE2QixDQUE3QixHQUFpQztBQUM3QjtBQUNBO0FBRUE7QUFDQSxZQUFJLENBQUMsR0FBRyxJQUFJLFVBQUosQ0FBUyxJQUFJLGtCQUFKLENBQVcsQ0FBQyxDQUFELEVBQUksQ0FBSixDQUFYLENBQVQsRUFBNkIsSUFBSSxrQkFBSixDQUFXLENBQUMsQ0FBRCxFQUFJLENBQUosQ0FBWCxDQUE3QixDQUFSO0FBRUEsWUFBSSxhQUFhLEdBQUcsS0FBSyxhQUF6QjtBQUNBLFlBQUksTUFBTSxHQUFHLEtBQUssTUFBbEI7O0FBRUEsYUFBSyxJQUFJLENBQUMsR0FBRyxDQUFiLEVBQWdCLENBQUMsR0FBRyxLQUFLLG1CQUFMLENBQXlCLE1BQTdDLEVBQXFELENBQUMsRUFBdEQsRUFBMEQ7QUFDdEQsY0FBSSxDQUFDLEdBQUksQ0FBQyxHQUFHLENBQUwsSUFBVyxLQUFLLG1CQUFMLENBQXlCLE1BQXBDLEdBQTZDLENBQTdDLEdBQWlELENBQUMsR0FBRyxDQUE3RDtBQUVBLGNBQUksQ0FBQyxHQUFHLGFBQWEsQ0FBQyxLQUFLLG1CQUFMLENBQXlCLENBQXpCLENBQUQsRUFBOEIsYUFBYSxDQUFDLFVBQTVDLEVBQXdELGFBQWEsQ0FBQyxXQUF0RSxDQUFiLENBQ0gsR0FERyxDQUNDLE1BREQsQ0FBUjtBQUdBLGNBQUksQ0FBQyxHQUFHLGFBQWEsQ0FBQyxLQUFLLG1CQUFMLENBQXlCLENBQXpCLENBQUQsRUFBOEIsYUFBYSxDQUFDLFVBQTVDLEVBQXdELGFBQWEsQ0FBQyxXQUF0RSxDQUFiLENBQ0gsR0FERyxDQUNDLE1BREQsQ0FBUjs7QUFHQSxjQUFJLGFBQWEsR0FBRyxtQkFBTyxRQUFQLENBQWdCLENBQWhCLEVBQW1CLENBQW5CLEVBQXNCLFNBQXRCLEVBQXBCOztBQUNBLGNBQUksSUFBSSxHQUFHLElBQUksVUFBSixDQUFTLENBQVQsRUFBWSxhQUFaLENBQVg7QUFDQSxjQUFJLFlBQVksR0FBRyxJQUFJLENBQUMsZ0JBQUwsQ0FBc0IsQ0FBdEIsQ0FBbkIsQ0FYc0QsQ0FhdEQ7O0FBQ0EsY0FBSSxZQUFZLEtBQUssSUFBckIsRUFBMkI7QUFDdkI7QUFDSCxXQWhCcUQsQ0FrQnREO0FBQ0E7OztBQUNBLGNBQUksbUJBQW1CLEdBQUcsWUFBWSxDQUFDLENBQWIsR0FBaUIsQ0FBakIsSUFBc0IsQ0FBaEQsQ0FwQnNELENBc0J0RDs7QUFDQSxjQUFJLENBQUMsbUJBQUwsRUFBMEI7QUFDdEI7QUFDSDs7QUFFRCxjQUFJLFNBQVMsR0FBSSxhQUFhLENBQUMsQ0FBZCxHQUFrQixDQUFuQztBQUNBLGNBQUksU0FBUyxHQUFJLGFBQWEsQ0FBQyxDQUFkLEdBQWtCLENBQW5DLENBNUJzRCxDQThCdEQ7QUFDQTtBQUNBOztBQUNBLGNBQUksVUFBVSxHQUFHLFNBQVMsR0FBRyxDQUFILEdBQU8sQ0FBakM7QUFDQSxjQUFJLFdBQVcsR0FBRyxTQUFTLEdBQUcsQ0FBSCxHQUFPLENBQWxDO0FBQ0EsY0FBSSxTQUFTLEdBQUcsU0FBUyxHQUFHLENBQUgsR0FBTyxDQUFoQztBQUNBLGNBQUksWUFBWSxHQUFHLFNBQVMsR0FBRyxDQUFILEdBQU8sQ0FBbkM7QUFFQSxjQUFJLHNCQUFzQixHQUNyQixZQUFZLENBQUMsQ0FBYixHQUFpQixVQUFVLENBQUMsQ0FBNUIsSUFBaUMsQ0FBbEMsSUFDQyxXQUFXLENBQUMsQ0FBWixHQUFnQixZQUFZLENBQUMsQ0FBN0IsSUFBa0MsQ0FEbkMsSUFFQyxZQUFZLENBQUMsQ0FBYixHQUFpQixTQUFTLENBQUMsQ0FBM0IsSUFBZ0MsQ0FGakMsSUFHQyxZQUFZLENBQUMsQ0FBYixHQUFpQixZQUFZLENBQUMsQ0FBOUIsSUFBbUMsQ0FKeEM7O0FBTUEsY0FBSSxzQkFBSixFQUE0QjtBQUN4QixZQUFBLE1BQU0sR0FBRyxDQUFDLE1BQVY7QUFDSDtBQUNKO0FBQ0o7O0FBQ0QsYUFBTyxNQUFQO0FBQ0g7QUFFRDs7Ozs7Ozs2QkFJUztBQUNMLFVBQUksV0FBVyxHQUFHLEtBQUssV0FBdkI7QUFDQSxVQUFJLE1BQU0sR0FBRyxLQUFLLE1BQWxCO0FBQ0EsVUFBSSxhQUFhLEdBQUcsS0FBSyxhQUF6QixDQUhLLENBSUw7O0FBQ0EsVUFBSSxVQUFVLEdBQUcsS0FBSyxtQkFBTCxDQUF5QixHQUF6QixDQUE2QixVQUFBLE1BQU07QUFBQSxlQUNoRCxhQUFhLENBQUMsTUFBRCxFQUFTLGFBQWEsQ0FBQyxVQUF2QixFQUFtQyxhQUFhLENBQUMsV0FBakQsQ0FBYixDQUNDLFFBREQsQ0FDVSxJQUFJLGtCQUFKLENBQVcsQ0FBQyxXQUFXLENBQUMsSUFBYixFQUFtQixXQUFXLENBQUMsR0FBL0IsQ0FBWCxDQURWLEVBRUMsR0FGRCxDQUVLLE1BRkwsQ0FEZ0Q7QUFBQSxPQUFuQyxDQUFqQjs7QUFJQSx5QkFBUyxRQUFULENBQWtCLFVBQWxCLEVBQThCLEtBQUssb0JBQW5DLEVBQXlELEtBQUssS0FBOUQ7QUFDSDs7O3dCQXRHaUI7QUFDZCxXQUFLLHNCQUFMLEdBQThCO0FBQzFCLFFBQUEsR0FBRyxFQUFFLENBRHFCO0FBRTFCLFFBQUEsSUFBSSxFQUFFLENBRm9CO0FBRzFCLFFBQUEsS0FBSyxFQUFFLEtBQUssTUFBTCxHQUFjLEtBQUssS0FIQTtBQUkxQixRQUFBLE1BQU0sRUFBRSxLQUFLLE9BQUwsR0FBZSxLQUFLO0FBSkYsT0FBOUI7QUFPQSxhQUFPO0FBQ0gsUUFBQSxHQUFHLEVBQUcsS0FBSyxzQkFBTCxDQUE0QixHQUE1QixHQUFrQyxLQUFLLGFBQUwsQ0FBbUIsV0FBdEQsR0FBcUUsS0FBSyxNQUFMLENBQVksQ0FBakYsR0FBcUYsS0FBSyxLQUFMLENBQVcsU0FEbEc7QUFFSCxRQUFBLElBQUksRUFBRyxLQUFLLHNCQUFMLENBQTRCLElBQTVCLEdBQW1DLEtBQUssYUFBTCxDQUFtQixVQUF2RCxHQUFxRSxLQUFLLE1BQUwsQ0FBWSxDQUFqRixHQUFxRixLQUFLLEtBQUwsQ0FBVyxTQUZuRztBQUdILFFBQUEsTUFBTSxFQUFHLEtBQUssc0JBQUwsQ0FBNEIsTUFBNUIsR0FBcUMsS0FBSyxhQUFMLENBQW1CLFdBQXpELEdBQXdFLEtBQUssTUFBTCxDQUFZLENBQXBGLEdBQXdGLEtBQUssS0FBTCxDQUFXLFNBSHhHO0FBSUgsUUFBQSxLQUFLLEVBQUcsS0FBSyxzQkFBTCxDQUE0QixLQUE1QixHQUFvQyxLQUFLLGFBQUwsQ0FBbUIsVUFBeEQsR0FBc0UsS0FBSyxNQUFMLENBQVksQ0FBbEYsR0FBc0YsS0FBSyxLQUFMLENBQVc7QUFKckcsT0FBUDtBQU1IOzs7O0VBekQyQix1Qzs7OztBQW9KaEMsU0FBUyxhQUFULENBQXVCLE1BQXZCLEVBQStCLE1BQS9CLEVBQXVDLE1BQXZDLEVBQStDO0FBQzNDLFNBQU8sSUFBSSxrQkFBSixDQUFXLENBQUMsTUFBTSxDQUFDLENBQVAsR0FBVyxNQUFaLEVBQW9CLE1BQU0sQ0FBQyxDQUFQLEdBQVcsTUFBL0IsQ0FBWCxDQUFQO0FBQ0giLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe2Z1bmN0aW9uIHIoZSxuLHQpe2Z1bmN0aW9uIG8oaSxmKXtpZighbltpXSl7aWYoIWVbaV0pe3ZhciBjPVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmU7aWYoIWYmJmMpcmV0dXJuIGMoaSwhMCk7aWYodSlyZXR1cm4gdShpLCEwKTt2YXIgYT1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK2krXCInXCIpO3Rocm93IGEuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixhfXZhciBwPW5baV09e2V4cG9ydHM6e319O2VbaV1bMF0uY2FsbChwLmV4cG9ydHMsZnVuY3Rpb24ocil7dmFyIG49ZVtpXVsxXVtyXTtyZXR1cm4gbyhufHxyKX0scCxwLmV4cG9ydHMscixlLG4sdCl9cmV0dXJuIG5baV0uZXhwb3J0c31mb3IodmFyIHU9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZSxpPTA7aTx0Lmxlbmd0aDtpKyspbyh0W2ldKTtyZXR1cm4gb31yZXR1cm4gcn0pKCkiLCIiLCJcInVzZSBzdHJpY3RcIjtcbnZhciBfX2V4dGVuZHMgPSAodGhpcyAmJiB0aGlzLl9fZXh0ZW5kcykgfHwgKGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgZXh0ZW5kU3RhdGljcyA9IGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MgPSBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHxcbiAgICAgICAgICAgICh7IF9fcHJvdG9fXzogW10gfSBpbnN0YW5jZW9mIEFycmF5ICYmIGZ1bmN0aW9uIChkLCBiKSB7IGQuX19wcm90b19fID0gYjsgfSkgfHxcbiAgICAgICAgICAgIGZ1bmN0aW9uIChkLCBiKSB7IGZvciAodmFyIHAgaW4gYikgaWYgKGIuaGFzT3duUHJvcGVydHkocCkpIGRbcF0gPSBiW3BdOyB9O1xuICAgICAgICByZXR1cm4gZXh0ZW5kU3RhdGljcyhkLCBiKTtcbiAgICB9O1xuICAgIHJldHVybiBmdW5jdGlvbiAoZCwgYikge1xuICAgICAgICBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgICAgICBmdW5jdGlvbiBfXygpIHsgdGhpcy5jb25zdHJ1Y3RvciA9IGQ7IH1cbiAgICAgICAgZC5wcm90b3R5cGUgPSBiID09PSBudWxsID8gT2JqZWN0LmNyZWF0ZShiKSA6IChfXy5wcm90b3R5cGUgPSBiLnByb3RvdHlwZSwgbmV3IF9fKCkpO1xuICAgIH07XG59KSgpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIE5EQXJyYXlfMSA9IHJlcXVpcmUoXCIuL05EQXJyYXlcIik7XG52YXIgVmVjdG9yXzEgPSByZXF1aXJlKFwiLi9WZWN0b3JcIik7XG52YXIgbmJsYXM7XG50cnkge1xuICAgIG5ibGFzID0gcmVxdWlyZSgnbmJsYXMnKTtcbn1cbmNhdGNoIChlcnIpIHsgfVxudmFyIG1hZ2ljSGVscGVyID0gZnVuY3Rpb24gKG4sIHgsIHkpIHtcbiAgICByZXR1cm4gKHggKyB5ICogMiArIDEpICUgbjtcbn07XG52YXIgTWF0cml4ID0gKGZ1bmN0aW9uIChfc3VwZXIpIHtcbiAgICBfX2V4dGVuZHMoTWF0cml4LCBfc3VwZXIpO1xuICAgIGZ1bmN0aW9uIE1hdHJpeChkYXRhLCBvcHRpb25zKSB7XG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgIGlmICh0eXBlb2YgZGF0YSA9PT0gJ251bWJlcicgJiYgdHlwZW9mIG9wdGlvbnMgPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBfdGhpcyA9IF9zdXBlci5jYWxsKHRoaXMsIG5ldyBGbG9hdDMyQXJyYXkoZGF0YSAqIG9wdGlvbnMpLCB7IHNoYXBlOiBbZGF0YSwgb3B0aW9uc10gfSkgfHwgdGhpcztcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIF90aGlzID0gX3N1cGVyLmNhbGwodGhpcywgZGF0YSwgb3B0aW9ucykgfHwgdGhpcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gX3RoaXM7XG4gICAgfVxuICAgIE1hdHJpeC5hZGQgPSBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICByZXR1cm4gYS5jb3B5KClcbiAgICAgICAgICAgIC5hZGQoYik7XG4gICAgfTtcbiAgICBNYXRyaXguYXVnbWVudCA9IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgIHJldHVybiBhLmNvcHkoKVxuICAgICAgICAgICAgLmF1Z21lbnQoYik7XG4gICAgfTtcbiAgICBNYXRyaXguYmluT3AgPSBmdW5jdGlvbiAoYSwgYiwgb3ApIHtcbiAgICAgICAgcmV0dXJuIGEuY29weSgpXG4gICAgICAgICAgICAuYmluT3AoYiwgb3ApO1xuICAgIH07XG4gICAgTWF0cml4LmVxdWFscyA9IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgIHJldHVybiBhLmVxdWFscyhiKTtcbiAgICB9O1xuICAgIE1hdHJpeC5maWxsID0gZnVuY3Rpb24gKHIsIGMsIHZhbHVlLCB0eXBlKSB7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdm9pZCAwKSB7IHZhbHVlID0gMDsgfVxuICAgICAgICBpZiAodHlwZSA9PT0gdm9pZCAwKSB7IHR5cGUgPSBGbG9hdDMyQXJyYXk7IH1cbiAgICAgICAgaWYgKHIgPD0gMCB8fCBjIDw9IDApIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCBzaXplJyk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIHNpemUgPSByICogYztcbiAgICAgICAgdmFyIGRhdGEgPSBuZXcgdHlwZShzaXplKTtcbiAgICAgICAgcmV0dXJuIG5ldyBNYXRyaXgoZGF0YSwgeyBzaGFwZTogW3IsIGNdIH0pLmZpbGwodmFsdWUpO1xuICAgIH07XG4gICAgTWF0cml4LmlkZW50aXR5ID0gZnVuY3Rpb24gKHNpemUsIHR5cGUpIHtcbiAgICAgICAgaWYgKHR5cGUgPT09IHZvaWQgMCkgeyB0eXBlID0gRmxvYXQzMkFycmF5OyB9XG4gICAgICAgIHJldHVybiBNYXRyaXguZmlsbChzaXplLCBzaXplLCBmdW5jdGlvbiAoaSkgeyByZXR1cm4gKGkgJSBzaXplKSA9PT0gTWF0aC5mbG9vcihpIC8gc2l6ZSkgPyAxIDogMDsgfSwgdHlwZSk7XG4gICAgfTtcbiAgICBNYXRyaXgubWFnaWMgPSBmdW5jdGlvbiAoc2l6ZSwgdHlwZSkge1xuICAgICAgICBpZiAodHlwZSA9PT0gdm9pZCAwKSB7IHR5cGUgPSBGbG9hdDMyQXJyYXk7IH1cbiAgICAgICAgaWYgKHNpemUgPCAwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgc2l6ZScpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBkYXRhID0gbmV3IHR5cGUoc2l6ZSAqIHNpemUpO1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgdmFyIGo7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBzaXplOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBzaXplOyBqICs9IDEpIHtcbiAgICAgICAgICAgICAgICBkYXRhWyhzaXplIC0gaSAtIDEpICogc2l6ZSArIChzaXplIC0gaiAtIDEpXSA9XG4gICAgICAgICAgICAgICAgICAgIG1hZ2ljSGVscGVyKHNpemUsIHNpemUgLSBqIC0gMSwgaSkgKiBzaXplICsgbWFnaWNIZWxwZXIoc2l6ZSwgaiwgaSkgKyAxO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgTWF0cml4KGRhdGEsIHsgc2hhcGU6IFtzaXplLCBzaXplXSB9KTtcbiAgICB9O1xuICAgIE1hdHJpeC5tdWx0aXBseSA9IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgIHJldHVybiBhLm11bHRpcGx5KGIpO1xuICAgIH07XG4gICAgTWF0cml4Lm9uZXMgPSBmdW5jdGlvbiAociwgYywgdHlwZSkge1xuICAgICAgICBpZiAodHlwZSA9PT0gdm9pZCAwKSB7IHR5cGUgPSBGbG9hdDMyQXJyYXk7IH1cbiAgICAgICAgcmV0dXJuIE1hdHJpeC5maWxsKHIsIGMsIDEsIHR5cGUpO1xuICAgIH07XG4gICAgTWF0cml4LnBsdSA9IGZ1bmN0aW9uIChtYXRyaXgpIHtcbiAgICAgICAgcmV0dXJuIG1hdHJpeC5jb3B5KClcbiAgICAgICAgICAgIC5wbHUoKTtcbiAgICB9O1xuICAgIE1hdHJpeC5wcm9kdWN0ID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGEuY29weSgpXG4gICAgICAgICAgICAucHJvZHVjdChiKTtcbiAgICB9O1xuICAgIE1hdHJpeC5yYW5kb20gPSBmdW5jdGlvbiAociwgYywgbWluLCBtYXgsIHR5cGUpIHtcbiAgICAgICAgaWYgKG1pbiA9PT0gdm9pZCAwKSB7IG1pbiA9IDA7IH1cbiAgICAgICAgaWYgKG1heCA9PT0gdm9pZCAwKSB7IG1heCA9IDE7IH1cbiAgICAgICAgaWYgKHR5cGUgPT09IHZvaWQgMCkgeyB0eXBlID0gRmxvYXQzMkFycmF5OyB9XG4gICAgICAgIHJldHVybiBNYXRyaXguZmlsbChyLCBjLCBtaW4sIHR5cGUpXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uICh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgKyBNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbik7IH0pO1xuICAgIH07XG4gICAgTWF0cml4LnJhbmsgPSBmdW5jdGlvbiAobWF0cml4KSB7XG4gICAgICAgIHJldHVybiBtYXRyaXguY29weSgpXG4gICAgICAgICAgICAucmFuaygpO1xuICAgIH07XG4gICAgTWF0cml4LnNjYWxlID0gZnVuY3Rpb24gKGEsIHNjYWxhcikge1xuICAgICAgICByZXR1cm4gYS5jb3B5KClcbiAgICAgICAgICAgIC5zY2FsZShzY2FsYXIpO1xuICAgIH07XG4gICAgTWF0cml4LnN1YnRyYWN0ID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGEuY29weSgpXG4gICAgICAgICAgICAuc3VidHJhY3QoYik7XG4gICAgfTtcbiAgICBNYXRyaXguemVyb3MgPSBmdW5jdGlvbiAociwgYywgdHlwZSkge1xuICAgICAgICBpZiAodHlwZSA9PT0gdm9pZCAwKSB7IHR5cGUgPSBGbG9hdDMyQXJyYXk7IH1cbiAgICAgICAgcmV0dXJuIE1hdHJpeC5maWxsKHIsIGMsIDAsIHR5cGUpO1xuICAgIH07XG4gICAgTWF0cml4LnByb3RvdHlwZS5hdWdtZW50ID0gZnVuY3Rpb24gKG1hdHJpeCkge1xuICAgICAgICB2YXIgX2EgPSB0aGlzLnNoYXBlLCByMSA9IF9hWzBdLCBjMSA9IF9hWzFdO1xuICAgICAgICB2YXIgX2IgPSBtYXRyaXguc2hhcGUsIHIyID0gX2JbMF0sIGMyID0gX2JbMV07XG4gICAgICAgIGlmIChyMiA9PT0gMCB8fCBjMiA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHIxICE9PSByMikge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdyb3dzIGRvIG5vdCBtYXRjaCcpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBkMSA9IHRoaXMuZGF0YTtcbiAgICAgICAgdmFyIGQyID0gbWF0cml4LmRhdGE7XG4gICAgICAgIHZhciBsZW5ndGggPSBjMSArIGMyO1xuICAgICAgICB2YXIgZGF0YSA9IG5ldyB0aGlzLnR5cGUobGVuZ3RoICogcjEpO1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgdmFyIGo7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCByMTsgaSArPSAxKSB7XG4gICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgYzE7IGogKz0gMSkge1xuICAgICAgICAgICAgICAgIGRhdGFbaSAqIGxlbmd0aCArIGpdID0gZDFbaSAqIGMxICsgal07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHIyOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBjMjsgaiArPSAxKSB7XG4gICAgICAgICAgICAgICAgZGF0YVtpICogbGVuZ3RoICsgaiArIGMxXSA9IGQyW2kgKiBjMiArIGpdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMuc2hhcGUgPSBbcjEsIGxlbmd0aF07XG4gICAgICAgIHRoaXMubGVuZ3RoID0gZGF0YS5sZW5ndGg7XG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgTWF0cml4LnByb3RvdHlwZS5iaW5PcCA9IGZ1bmN0aW9uIChtYXRyaXgsIG9wKSB7XG4gICAgICAgIHZhciBfYSA9IHRoaXMuc2hhcGUsIHIxID0gX2FbMF0sIGMxID0gX2FbMV07XG4gICAgICAgIHZhciBfYiA9IG1hdHJpeC5zaGFwZSwgcjIgPSBfYlswXSwgYzIgPSBfYlsxXTtcbiAgICAgICAgaWYgKHIxICE9PSByMiB8fCBjMSAhPT0gYzIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignc2l6ZXMgZG8gbm90IG1hdGNoIScpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBfYyA9IHRoaXMsIGQxID0gX2MuZGF0YSwgbGVuZ3RoID0gX2MubGVuZ3RoO1xuICAgICAgICB2YXIgZDIgPSBtYXRyaXguZGF0YTtcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgZDFbaV0gPSBvcChkMVtpXSwgZDJbaV0sIGkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgTWF0cml4LnByb3RvdHlwZS5jaGVjayA9IGZ1bmN0aW9uIChpLCBqKSB7XG4gICAgICAgIHZhciBfYSA9IHRoaXMuc2hhcGUsIHIgPSBfYVswXSwgYyA9IF9hWzFdO1xuICAgICAgICBpZiAoaXNOYU4oaSkgfHwgaXNOYU4oaikpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignb25lIG9mIHRoZSBpbmRpY2VzIGlzIG5vdCBhIG51bWJlcicpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChpIDwgMCB8fCBqIDwgMCB8fCBpID4gciAtIDEgfHwgaiA+IGMgLSAxKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2luZGV4IG91dCBvZiBib3VuZHMnKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgTWF0cml4LnByb3RvdHlwZS5kZXRlcm1pbmFudCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF9hID0gdGhpcy5zaGFwZSwgciA9IF9hWzBdLCBjID0gX2FbMV07XG4gICAgICAgIGlmIChyICE9PSBjKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ21hdHJpeCBpcyBub3Qgc3F1YXJlJyk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIF9iID0gTWF0cml4LnBsdSh0aGlzKSwgbHUgPSBfYlswXSwgaXBpdiA9IF9iWzFdO1xuICAgICAgICB2YXIgcHJvZHVjdCA9IDE7XG4gICAgICAgIHZhciBzaWduID0gMTtcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCByOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGlmIChpICE9PSBpcGl2W2ldKSB7XG4gICAgICAgICAgICAgICAgc2lnbiAqPSAtMTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcjsgaSArPSAxKSB7XG4gICAgICAgICAgICBwcm9kdWN0ICo9IGx1LmRhdGFbaSAqIGMgKyBpXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gc2lnbiAqIHByb2R1Y3Q7XG4gICAgfTtcbiAgICBNYXRyaXgucHJvdG90eXBlLmRpYWcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5kYXRhO1xuICAgICAgICB2YXIgX2EgPSB0aGlzLnNoYXBlLCByID0gX2FbMF0sIGMgPSBfYVsxXTtcbiAgICAgICAgdmFyIGRpYWcgPSBuZXcgdGhpcy50eXBlKE1hdGgubWluKHIsIGMpKTtcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCByICYmIGkgPCBjOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGRpYWdbaV0gPSBkYXRhW2kgKiBjICsgaV07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3JfMS5WZWN0b3IoZGlhZyk7XG4gICAgfTtcbiAgICBNYXRyaXgucHJvdG90eXBlLmVhY2ggPSBmdW5jdGlvbiAoY2FsbGJhY2spIHtcbiAgICAgICAgdmFyIGMgPSB0aGlzLnNoYXBlWzFdO1xuICAgICAgICB2YXIgX2EgPSB0aGlzLCBkYXRhID0gX2EuZGF0YSwgbGVuZ3RoID0gX2EubGVuZ3RoO1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBjYWxsYmFjay5jYWxsKHRoaXMsIGRhdGFbaV0sIGMgPT09IDAgPyAwIDogTWF0aC5mbG9vcihpIC8gYyksIGkgJSBjKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIE1hdHJpeC5wcm90b3R5cGUuZ2F1c3MgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfYSA9IHRoaXMuc2hhcGUsIHIgPSBfYVswXSwgYyA9IF9hWzFdO1xuICAgICAgICB2YXIgY29weSA9IHRoaXMuY29weSgpO1xuICAgICAgICB2YXIgbGVhZCA9IDA7XG4gICAgICAgIHZhciBwaXZvdDtcbiAgICAgICAgdmFyIGxlYWRWYWx1ZTtcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIHZhciBqO1xuICAgICAgICB2YXIgaztcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHI7IGkgKz0gMSkge1xuICAgICAgICAgICAgaWYgKGMgPD0gbGVhZCkge1xuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignbWF0cml4IGlzIHNpbmd1bGFyJyk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBqID0gaTtcbiAgICAgICAgICAgIHdoaWxlIChjb3B5LmRhdGFbaiAqIGMgKyBsZWFkXSA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGogKz0gMTtcbiAgICAgICAgICAgICAgICBpZiAociA9PT0gaikge1xuICAgICAgICAgICAgICAgICAgICBqID0gaTtcbiAgICAgICAgICAgICAgICAgICAgbGVhZCArPSAxO1xuICAgICAgICAgICAgICAgICAgICBpZiAoYyA9PT0gbGVhZCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdtYXRyaXggaXMgc2luZ3VsYXInKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGNvcHkuc3dhcChpLCBqKTtcbiAgICAgICAgICAgIHBpdm90ID0gY29weS5kYXRhW2kgKiBjICsgbGVhZF07XG4gICAgICAgICAgICBpZiAocGl2b3QgIT09IDApIHtcbiAgICAgICAgICAgICAgICBmb3IgKGsgPSAwOyBrIDwgYzsgayArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvcHkuZGF0YVsoaSAqIGMpICsga10gPSBjb3B5LmRhdGFbKGkgKiBjKSArIGtdIC8gcGl2b3Q7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IHI7IGogKz0gMSkge1xuICAgICAgICAgICAgICAgIGxlYWRWYWx1ZSA9IGNvcHkuZGF0YVtqICogYyArIGxlYWRdO1xuICAgICAgICAgICAgICAgIGlmIChqICE9PSBpKSB7XG4gICAgICAgICAgICAgICAgICAgIGZvciAoayA9IDA7IGsgPCBjOyBrICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvcHkuZGF0YVtqICogYyArIGtdID0gY29weS5kYXRhW2ogKiBjICsga10gLSAoY29weS5kYXRhW2kgKiBjICsga10gKiBsZWFkVmFsdWUpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgbGVhZCArPSAxO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCByOyBpICs9IDEpIHtcbiAgICAgICAgICAgIHBpdm90ID0gMDtcbiAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBjOyBqICs9IDEpIHtcbiAgICAgICAgICAgICAgICBpZiAocGl2b3QgPT09IDApIHtcbiAgICAgICAgICAgICAgICAgICAgcGl2b3QgPSBjb3B5LmRhdGFbaSAqIGMgKyBqXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpZiAocGl2b3QgPT09IDApIHtcbiAgICAgICAgICAgICAgICBmb3IgKGsgPSAwOyBrIDwgYzsgayArPSAxKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvcHkuZGF0YVsoaSAqIGMpICsga10gPSBjb3B5LmRhdGFbKGkgKiBjKSArIGtdIC8gcGl2b3Q7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb3B5O1xuICAgIH07XG4gICAgTWF0cml4LnByb3RvdHlwZS5nZXQgPSBmdW5jdGlvbiAoaSwgaikge1xuICAgICAgICB0aGlzLmNoZWNrKGksIGopO1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhW2kgKiB0aGlzLnNoYXBlWzFdICsgal07XG4gICAgfTtcbiAgICBNYXRyaXgucHJvdG90eXBlLmludmVyc2UgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfYSA9IHRoaXMuc2hhcGUsIHIgPSBfYVswXSwgYyA9IF9hWzFdO1xuICAgICAgICBpZiAociAhPT0gYykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhbGlkIGRpbWVuc2lvbnMnKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgaWRlbnRpdHkgPSBNYXRyaXguaWRlbnRpdHkocik7XG4gICAgICAgIHZhciBhdWdtZW50ZWQgPSBNYXRyaXguYXVnbWVudCh0aGlzLCBpZGVudGl0eSk7XG4gICAgICAgIHZhciBnYXVzcyA9IGF1Z21lbnRlZC5nYXVzcygpO1xuICAgICAgICB2YXIgbGVmdCA9IE1hdHJpeC56ZXJvcyhyLCBjKTtcbiAgICAgICAgdmFyIHJpZ2h0ID0gTWF0cml4Lnplcm9zKHIsIGMpO1xuICAgICAgICB2YXIgbiA9IGdhdXNzLnNoYXBlWzFdO1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgdmFyIGo7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCByOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBuOyBqICs9IDEpIHtcbiAgICAgICAgICAgICAgICBpZiAoaiA8IGMpIHtcbiAgICAgICAgICAgICAgICAgICAgbGVmdC5zZXQoaSwgaiwgZ2F1c3MuZ2V0KGksIGopKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHJpZ2h0LnNldChpLCBqIC0gciwgZ2F1c3MuZ2V0KGksIGopKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKCFsZWZ0LmVxdWFscyhNYXRyaXguaWRlbnRpdHkocikpKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ21hdHJpeCBpcyBub3QgaW52ZXJ0aWJsZScpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiByaWdodDtcbiAgICB9O1xuICAgIE1hdHJpeC5wcm90b3R5cGUubHUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfYSA9IHRoaXMuc2hhcGUsIHIgPSBfYVswXSwgYyA9IF9hWzFdO1xuICAgICAgICB2YXIgX2IgPSBNYXRyaXgucGx1KHRoaXMpLCBwbHUgPSBfYlswXSwgaXBpdiA9IF9iWzFdO1xuICAgICAgICB2YXIgbG93ZXIgPSBwbHUuY29weSgpO1xuICAgICAgICB2YXIgdXBwZXIgPSBwbHUuY29weSgpO1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgdmFyIGo7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCByOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGZvciAoaiA9IGk7IGogPCBjOyBqICs9IDEpIHtcbiAgICAgICAgICAgICAgICBsb3dlci5kYXRhW2kgKiBjICsgal0gPSBpID09PSBqID8gMSA6IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChpID0gMDsgaSA8IHI7IGkgKz0gMSkge1xuICAgICAgICAgICAgZm9yIChqID0gMDsgaiA8IGkgJiYgaiA8IGM7IGogKz0gMSkge1xuICAgICAgICAgICAgICAgIHVwcGVyLmRhdGFbaSAqIGMgKyBqXSA9IDA7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIFtsb3dlciwgdXBwZXIsIGlwaXZdO1xuICAgIH07XG4gICAgTWF0cml4LnByb3RvdHlwZS5sdXNvbHZlID0gZnVuY3Rpb24gKHJocywgaXBpdikge1xuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcbiAgICAgICAgdmFyIF9hID0gcmhzLnNoYXBlLCBuID0gX2FbMF0sIG5yaHMgPSBfYVsxXTtcbiAgICAgICAgdmFyIHggPSByaHMuZGF0YTtcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIHZhciBqO1xuICAgICAgICB2YXIgaztcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGlwaXYubGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGlmIChpICE9PSBpcGl2W2ldKSB7XG4gICAgICAgICAgICAgICAgcmhzLnN3YXAoaSwgaXBpdltpXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgZm9yIChrID0gMDsgayA8IG5yaHM7IGsgKz0gMSkge1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IG47IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgIGZvciAoaiA9IDA7IGogPCBpOyBqICs9IDEpIHtcbiAgICAgICAgICAgICAgICAgICAgeFtpICogbnJocyArIGtdIC09IGRhdGFbaSAqIG4gKyBqXSAqIHhbaiAqIG5yaHMgKyBrXTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGkgPSBuIC0gMTsgaSA+PSAwOyBpIC09IDEpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGogPSBpICsgMTsgaiA8IG47IGogKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICB4W2kgKiBucmhzICsga10gLT0gZGF0YVtpICogbiArIGpdICogeFtqICogbnJocyArIGtdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB4W2kgKiBucmhzICsga10gLz0gZGF0YVtpICogbiArIGldO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiByaHM7XG4gICAgfTtcbiAgICBNYXRyaXgucHJvdG90eXBlLm1hcCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICB2YXIgYyA9IHRoaXMuc2hhcGVbMV07XG4gICAgICAgIHZhciBsZW5ndGggPSB0aGlzLmxlbmd0aDtcbiAgICAgICAgdmFyIG1hcHBlZCA9IHRoaXMuY29weSgpO1xuICAgICAgICB2YXIgZGF0YSA9IG1hcHBlZC5kYXRhO1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBkYXRhW2ldID0gY2FsbGJhY2suY2FsbChtYXBwZWQsIGRhdGFbaV0sIGMgPT09IDAgPyAwIDogTWF0aC5mbG9vcihpIC8gYyksIGkgJSBjLCBkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbWFwcGVkO1xuICAgIH07XG4gICAgTWF0cml4LnByb3RvdHlwZS5tdWx0aXBseSA9IGZ1bmN0aW9uIChtYXRyaXgpIHtcbiAgICAgICAgdmFyIF9hID0gdGhpcy5zaGFwZSwgcjEgPSBfYVswXSwgYzEgPSBfYVsxXTtcbiAgICAgICAgdmFyIF9iID0gbWF0cml4LnNoYXBlLCByMiA9IF9iWzBdLCBjMiA9IF9iWzFdO1xuICAgICAgICBpZiAoYzEgIT09IHIyKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ3NpemVzIGRvIG5vdCBtYXRjaCcpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBkMSA9IHRoaXMuZGF0YTtcbiAgICAgICAgdmFyIGQyID0gbWF0cml4LmRhdGE7XG4gICAgICAgIHZhciBkYXRhID0gbmV3IHRoaXMudHlwZShyMSAqIGMyKTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIG5ibGFzLmdlbW0oZDEsIGQyLCBkYXRhLCByMSwgYzIsIGMxKTtcbiAgICAgICAgfVxuICAgICAgICBjYXRjaCAoZXJyKSB7XG4gICAgICAgICAgICB2YXIgaSA9IHZvaWQgMDtcbiAgICAgICAgICAgIHZhciBqID0gdm9pZCAwO1xuICAgICAgICAgICAgdmFyIGsgPSB2b2lkIDA7XG4gICAgICAgICAgICB2YXIgc3VtID0gdm9pZCAwO1xuICAgICAgICAgICAgZm9yIChpID0gMDsgaSA8IHIxOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgYzI7IGogKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICBzdW0gPSAwO1xuICAgICAgICAgICAgICAgICAgICBmb3IgKGsgPSAwOyBrIDwgYzE7IGsgKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgc3VtICs9IGQxW2kgKiBjMSArIGtdICogZDJbaiArIGsgKiBjMl07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZGF0YVtpICogYzIgKyBqXSA9IHN1bTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBNYXRyaXgoZGF0YSwgeyBzaGFwZTogW3IxLCBjMl0gfSk7XG4gICAgfTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoTWF0cml4LnByb3RvdHlwZSwgXCJUXCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy50cmFuc3Bvc2UoKTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgTWF0cml4LnByb3RvdHlwZS5wbHUgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5kYXRhO1xuICAgICAgICB2YXIgbiA9IHRoaXMuc2hhcGVbMF07XG4gICAgICAgIHZhciBpcGl2ID0gbmV3IEludDMyQXJyYXkobik7XG4gICAgICAgIHZhciBtYXg7XG4gICAgICAgIHZhciBhYnM7XG4gICAgICAgIHZhciBkaWFnO1xuICAgICAgICB2YXIgcDtcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIHZhciBqO1xuICAgICAgICB2YXIgaztcbiAgICAgICAgZm9yIChrID0gMDsgayA8IG47IGsgKz0gMSkge1xuICAgICAgICAgICAgcCA9IGs7XG4gICAgICAgICAgICBtYXggPSBNYXRoLmFicyhkYXRhW2sgKiBuICsga10pO1xuICAgICAgICAgICAgZm9yIChqID0gayArIDE7IGogPCBuOyBqICs9IDEpIHtcbiAgICAgICAgICAgICAgICBhYnMgPSBNYXRoLmFicyhkYXRhW2ogKiBuICsga10pO1xuICAgICAgICAgICAgICAgIGlmIChtYXggPCBhYnMpIHtcbiAgICAgICAgICAgICAgICAgICAgbWF4ID0gYWJzO1xuICAgICAgICAgICAgICAgICAgICBwID0gajtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBpcGl2W2tdID0gcDtcbiAgICAgICAgICAgIGlmIChwICE9PSBrKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zd2FwKGssIHApO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZGlhZyA9IGRhdGFbayAqIG4gKyBrXTtcbiAgICAgICAgICAgIGZvciAoaSA9IGsgKyAxOyBpIDwgbjsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgZGF0YVtpICogbiArIGtdIC89IGRpYWc7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBmb3IgKGkgPSBrICsgMTsgaSA8IG47IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgIGZvciAoaiA9IGsgKyAxOyBqIDwgbiAtIDE7IGogKz0gMSkge1xuICAgICAgICAgICAgICAgICAgICBkYXRhW2kgKiBuICsgal0gLT0gZGF0YVtpICogbiArIGtdICogZGF0YVtrICogbiArIGpdO1xuICAgICAgICAgICAgICAgICAgICBqICs9IDE7XG4gICAgICAgICAgICAgICAgICAgIGRhdGFbaSAqIG4gKyBqXSAtPSBkYXRhW2kgKiBuICsga10gKiBkYXRhW2sgKiBuICsgal07XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGlmIChqID09PSBuIC0gMSkge1xuICAgICAgICAgICAgICAgICAgICBkYXRhW2kgKiBuICsgal0gLT0gZGF0YVtpICogbiArIGtdICogZGF0YVtrICogbiArIGpdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gW3RoaXMsIGlwaXZdO1xuICAgIH07XG4gICAgTWF0cml4LnByb3RvdHlwZS5yYW5rID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdmVjdG9ycyA9IHRoaXMudG9BcnJheSgpXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uIChyb3cpIHsgcmV0dXJuIG5ldyBWZWN0b3JfMS5WZWN0b3Iocm93KTsgfSk7XG4gICAgICAgIHZhciBfYSA9IHRoaXMuc2hhcGUsIHIgPSBfYVswXSwgYyA9IF9hWzFdO1xuICAgICAgICB2YXIgY291bnRlciA9IDA7XG4gICAgICAgIHZhciB0bXA7XG4gICAgICAgIHZhciBwaXZvdDtcbiAgICAgICAgdmFyIHRhcmdldDtcbiAgICAgICAgdmFyIHNjYWxhcjtcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIHZhciBqO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgciAtIDE7IGkgKz0gMSkge1xuICAgICAgICAgICAgcGl2b3QgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgICBmb3IgKGogPSBpOyBqIDwgcjsgaiArPSAxKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZlY3RvcnNbaV0uZ2V0KGkpICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChpICE9PSBqKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0bXAgPSB2ZWN0b3JzW2ldO1xuICAgICAgICAgICAgICAgICAgICAgICAgdmVjdG9yc1tpXSA9IHZlY3RvcnNbal07XG4gICAgICAgICAgICAgICAgICAgICAgICB2ZWN0b3JzW2pdID0gdG1wO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHBpdm90ID0gdmVjdG9yc1tpXTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYgKHBpdm90ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgICBjb250aW51ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGZvciAoaiA9IChpICsgMSk7IGogPCByOyBqICs9IDEpIHtcbiAgICAgICAgICAgICAgICB0YXJnZXQgPSB2ZWN0b3JzW2pdO1xuICAgICAgICAgICAgICAgIHNjYWxhciA9IHRhcmdldC5nZXQoaSkgLyBwaXZvdC5nZXQoaSk7XG4gICAgICAgICAgICAgICAgdmVjdG9yc1tqXSA9IHRhcmdldC5zdWJ0cmFjdChwaXZvdC5zY2FsZShzY2FsYXIpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcjsgaSArPSAxKSB7XG4gICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgYzsgaiArPSAxKSB7XG4gICAgICAgICAgICAgICAgaWYgKHZlY3RvcnNbaV0uZ2V0KGopICE9PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvdW50ZXIgKz0gMTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBjb3VudGVyO1xuICAgIH07XG4gICAgTWF0cml4LnByb3RvdHlwZS5yZWR1Y2UgPSBmdW5jdGlvbiAoY2FsbGJhY2ssIGluaXRpYWxWYWx1ZSkge1xuICAgICAgICB2YXIgYyA9IHRoaXMuc2hhcGVbMV07XG4gICAgICAgIHZhciBsZW5ndGggPSB0aGlzLmxlbmd0aDtcbiAgICAgICAgaWYgKGxlbmd0aCA9PT0gMCAmJiBpbml0aWFsVmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdyZWR1Y2Ugb2YgZW1wdHkgbWF0cml4IHdpdGggbm8gaW5pdGlhbCB2YWx1ZS4nKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIHZhciB2YWx1ZTtcbiAgICAgICAgaWYgKGluaXRpYWxWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB2YWx1ZSA9IGRhdGFbMF07XG4gICAgICAgICAgICBpID0gMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhbHVlID0gaW5pdGlhbFZhbHVlO1xuICAgICAgICAgICAgaSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICg7IGkgPCBsZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgdmFsdWUgPSBjYWxsYmFjay5jYWxsKHRoaXMsIHZhbHVlLCBkYXRhW2ldLCBjID09PSAwID8gMCA6IE1hdGguZmxvb3IoaSAvIGMpLCBpICUgYyk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH07XG4gICAgTWF0cml4LnByb3RvdHlwZS5yb3dBZGQgPSBmdW5jdGlvbiAoZGVzdCwgc291cmNlLCBzY2FsYXIpIHtcbiAgICAgICAgaWYgKHNjYWxhciA9PT0gdm9pZCAwKSB7IHNjYWxhciA9IDE7IH1cbiAgICAgICAgdGhpcy5jaGVjayhkZXN0LCAwKTtcbiAgICAgICAgdGhpcy5jaGVjayhzb3VyY2UsIDApO1xuICAgICAgICB2YXIgYyA9IHRoaXMuc2hhcGVbMV07XG4gICAgICAgIHZhciBpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgYzsgaSArPSAxKSB7XG4gICAgICAgICAgICB0aGlzLnNldChkZXN0LCBpLCAodGhpcy5nZXQoZGVzdCwgaSkgKyAodGhpcy5nZXQoc291cmNlLCBpKSAqIHNjYWxhcikpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIE1hdHJpeC5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKGksIGosIHZhbHVlKSB7XG4gICAgICAgIHRoaXMuY2hlY2soaSwgaik7XG4gICAgICAgIHRoaXMuZGF0YVtpICogdGhpcy5zaGFwZVsxXSArIGpdID0gdmFsdWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgTWF0cml4LnByb3RvdHlwZS5zb2x2ZSA9IGZ1bmN0aW9uIChyaHMpIHtcbiAgICAgICAgdmFyIF9hID0gTWF0cml4LnBsdSh0aGlzKSwgbHUgPSBfYVswXSwgaXBpdiA9IF9hWzFdO1xuICAgICAgICByZXR1cm4gbHUubHVzb2x2ZShyaHMuY29weSgpLCBpcGl2KTtcbiAgICB9O1xuICAgIE1hdHJpeC5wcm90b3R5cGUuc3dhcCA9IGZ1bmN0aW9uIChpLCBqKSB7XG4gICAgICAgIHZhciBfYSA9IHRoaXMuc2hhcGUsIHIgPSBfYVswXSwgYyA9IF9hWzFdO1xuICAgICAgICBpZiAoaSA8IDAgfHwgaiA8IDAgfHwgaSA+IHIgLSAxIHx8IGogPiByIC0gMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbmRleCBvdXQgb2YgYm91bmRzJyk7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGNvcHkgPSB0aGlzLmRhdGEuc2xpY2UoaSAqIGMsIChpICsgMSkgKiBjKTtcbiAgICAgICAgdGhpcy5kYXRhLmNvcHlXaXRoaW4oaSAqIGMsIGogKiBjLCAoaiArIDEpICogYyk7XG4gICAgICAgIHRoaXMuZGF0YS5zZXQoY29weSwgaiAqIGMpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIE1hdHJpeC5wcm90b3R5cGUudG9BcnJheSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIF9hID0gdGhpcy5zaGFwZSwgciA9IF9hWzBdLCBjID0gX2FbMV07XG4gICAgICAgIHZhciByZXN1bHQgPSBbXTtcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCByOyBpICs9IDEpIHtcbiAgICAgICAgICAgIHJlc3VsdC5wdXNoKEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKHRoaXMuZGF0YS5zdWJhcnJheShpICogYywgKGkgKyAxKSAqIGMpKSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICAgIE1hdHJpeC5wcm90b3R5cGUudG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBfYSA9IHRoaXMuc2hhcGUsIHIgPSBfYVswXSwgYyA9IF9hWzFdO1xuICAgICAgICB2YXIgcmVzdWx0ID0gW107XG4gICAgICAgIHZhciBpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcjsgaSArPSAxKSB7XG4gICAgICAgICAgICByZXN1bHQucHVzaChcIltcIiArIHRoaXMuZGF0YS5zdWJhcnJheShpICogYywgKGkgKyAxKSAqIGMpICsgXCJdXCIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBcIltcIiArIHJlc3VsdC5qb2luKCcsIFxcbicpICsgXCJdXCI7XG4gICAgfTtcbiAgICBNYXRyaXgucHJvdG90eXBlLnRyYWNlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgZGlhZyA9IHRoaXMuZGlhZygpO1xuICAgICAgICB2YXIgbGVuZ3RoID0gZGlhZy5sZW5ndGg7XG4gICAgICAgIHZhciByZXN1bHQgPSAwO1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICByZXN1bHQgKz0gZGlhZy5nZXQoaSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICB9O1xuICAgIE1hdHJpeC5wcm90b3R5cGUudHJhbnNwb3NlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX2EgPSB0aGlzLnNoYXBlLCByID0gX2FbMF0sIGMgPSBfYVsxXTtcbiAgICAgICAgdmFyIGRhdGEgPSBuZXcgdGhpcy50eXBlKGMgKiByKTtcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIHZhciBqO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgcjsgaSArPSAxKSB7XG4gICAgICAgICAgICBmb3IgKGogPSAwOyBqIDwgYzsgaiArPSAxKSB7XG4gICAgICAgICAgICAgICAgZGF0YVtqICogciArIGldID0gdGhpcy5kYXRhW2kgKiBjICsgal07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIG5ldyBNYXRyaXgoZGF0YSwgeyBzaGFwZTogW2MsIHJdIH0pO1xuICAgIH07XG4gICAgcmV0dXJuIE1hdHJpeDtcbn0oTkRBcnJheV8xLk5EQXJyYXkpKTtcbmV4cG9ydHMuTWF0cml4ID0gTWF0cml4O1xudHJ5IHtcbiAgICB3aW5kb3cuTWF0cml4ID0gTWF0cml4O1xufVxuY2F0Y2ggKGVycikgeyB9XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbnZhciB1dGlsXzEgPSByZXF1aXJlKFwiLi91dGlsXCIpO1xudmFyIG5ibGFzO1xudHJ5IHtcbiAgICBuYmxhcyA9IHJlcXVpcmUoJ25ibGFzJyk7XG59XG5jYXRjaCAoZXJyKSB7IH1cbnZhciBhYnMgPSBNYXRoLmFicywgYWNvcyA9IE1hdGguYWNvcywgYWNvc2ggPSBNYXRoLmFjb3NoLCBhc2luID0gTWF0aC5hc2luLCBhc2luaCA9IE1hdGguYXNpbmgsIGF0YW4gPSBNYXRoLmF0YW4sIGF0YW5oID0gTWF0aC5hdGFuaCwgY2JydCA9IE1hdGguY2JydCwgY2VpbCA9IE1hdGguY2VpbCwgY29zID0gTWF0aC5jb3MsIGNvc2ggPSBNYXRoLmNvc2gsIGV4cCA9IE1hdGguZXhwLCBleHBtMSA9IE1hdGguZXhwbTEsIGZsb29yID0gTWF0aC5mbG9vciwgZnJvdW5kID0gTWF0aC5mcm91bmQsIGxvZyA9IE1hdGgubG9nLCBsb2cxcCA9IE1hdGgubG9nMXAsIGxvZzEwID0gTWF0aC5sb2cxMCwgbG9nMiA9IE1hdGgubG9nMiwgcG93ID0gTWF0aC5wb3csIHJvdW5kID0gTWF0aC5yb3VuZCwgc2lnbiA9IE1hdGguc2lnbiwgc2luID0gTWF0aC5zaW4sIHNpbmggPSBNYXRoLnNpbmgsIHNxcnQgPSBNYXRoLnNxcnQsIHRhbiA9IE1hdGgudGFuLCB0YW5oID0gTWF0aC50YW5oLCB0cnVuYyA9IE1hdGgudHJ1bmM7XG52YXIgTkRBcnJheSA9IChmdW5jdGlvbiAoKSB7XG4gICAgZnVuY3Rpb24gTkRBcnJheShkYXRhLCBvcHRpb25zKSB7XG4gICAgICAgIHRoaXMuZGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkoMCk7XG4gICAgICAgIHRoaXMubGVuZ3RoID0gMDtcbiAgICAgICAgdGhpcy5zaGFwZSA9IFswXTtcbiAgICAgICAgdGhpcy50eXBlID0gRmxvYXQzMkFycmF5O1xuICAgICAgICBpZiAodXRpbF8xLmlzVHlwZWRBcnJheShkYXRhKSkge1xuICAgICAgICAgICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICAgICAgICAgIHRoaXMuc2hhcGUgPSB0eXBlb2Ygb3B0aW9ucyA9PT0gJ29iamVjdCcgPyBvcHRpb25zLnNoYXBlIDogW3RoaXMuZGF0YS5sZW5ndGhdO1xuICAgICAgICAgICAgdGhpcy5sZW5ndGggPSB0aGlzLmRhdGEubGVuZ3RoO1xuICAgICAgICAgICAgdGhpcy50eXBlID0gdXRpbF8xLnR5cGUoZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZGF0YSBpbnN0YW5jZW9mIEFycmF5KSB7XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBuZXcgRmxvYXQzMkFycmF5KHV0aWxfMS5mbGF0dGVuKGRhdGEpKTtcbiAgICAgICAgICAgIHRoaXMuc2hhcGUgPSB1dGlsXzEuc2hhcGUoZGF0YSk7XG4gICAgICAgICAgICB0aGlzLmxlbmd0aCA9IHRoaXMuZGF0YS5sZW5ndGg7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSBpZiAoZGF0YSBpbnN0YW5jZW9mIE5EQXJyYXkpIHtcbiAgICAgICAgICAgIHJldHVybiBkYXRhLmNvcHkoKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBOREFycmF5LnByb3RvdHlwZS5hYnMgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBsMSA9IHRoaXMubGVuZ3RoO1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGwxOyBpICs9IDEpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YVtpXSA9IGFicyh0aGlzLmRhdGFbaV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgTkRBcnJheS5wcm90b3R5cGUuYWNvcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGwxID0gdGhpcy5sZW5ndGg7XG4gICAgICAgIHZhciBpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbDE7IGkgKz0gMSkge1xuICAgICAgICAgICAgdGhpcy5kYXRhW2ldID0gYWNvcyh0aGlzLmRhdGFbaV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgTkRBcnJheS5wcm90b3R5cGUuYWNvc2ggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBsMSA9IHRoaXMubGVuZ3RoO1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGwxOyBpICs9IDEpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YVtpXSA9IGFjb3NoKHRoaXMuZGF0YVtpXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBOREFycmF5LnByb3RvdHlwZS5hZGQgPSBmdW5jdGlvbiAoeCwgYWxwaGEpIHtcbiAgICAgICAgaWYgKGFscGhhID09PSB2b2lkIDApIHsgYWxwaGEgPSAxOyB9XG4gICAgICAgIHRoaXMuZXF1aWxhdGVyYWwoeCk7XG4gICAgICAgIHRoaXMuZXF1aWRpbWVuc2lvbmFsKHgpO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgbmJsYXMuYXhweSh4LmRhdGEsIHRoaXMuZGF0YSwgYWxwaGEpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHZhciBfYSA9IHRoaXMsIGQxID0gX2EuZGF0YSwgbDEgPSBfYS5sZW5ndGg7XG4gICAgICAgICAgICB2YXIgZDIgPSB4LmRhdGE7XG4gICAgICAgICAgICB2YXIgaSA9IHZvaWQgMDtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsMTsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgZDFbaV0gKz0gYWxwaGEgKiBkMltpXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIE5EQXJyYXkucHJvdG90eXBlLmFzaW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBsMSA9IHRoaXMubGVuZ3RoO1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGwxOyBpICs9IDEpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YVtpXSA9IGFzaW4odGhpcy5kYXRhW2ldKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIE5EQXJyYXkucHJvdG90eXBlLmFzaW5oID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbDEgPSB0aGlzLmxlbmd0aDtcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsMTsgaSArPSAxKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGFbaV0gPSBhc2luaCh0aGlzLmRhdGFbaV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgTkRBcnJheS5wcm90b3R5cGUuYXRhbiA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGwxID0gdGhpcy5sZW5ndGg7XG4gICAgICAgIHZhciBpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbDE7IGkgKz0gMSkge1xuICAgICAgICAgICAgdGhpcy5kYXRhW2ldID0gYXRhbih0aGlzLmRhdGFbaV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgTkRBcnJheS5wcm90b3R5cGUuYXRhbmggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBsMSA9IHRoaXMubGVuZ3RoO1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGwxOyBpICs9IDEpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YVtpXSA9IGF0YW5oKHRoaXMuZGF0YVtpXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBOREFycmF5LnByb3RvdHlwZS5jYnJ0ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbDEgPSB0aGlzLmxlbmd0aDtcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsMTsgaSArPSAxKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGFbaV0gPSBjYnJ0KHRoaXMuZGF0YVtpXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBOREFycmF5LnByb3RvdHlwZS5jZWlsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbDEgPSB0aGlzLmxlbmd0aDtcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsMTsgaSArPSAxKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGFbaV0gPSBjZWlsKHRoaXMuZGF0YVtpXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBOREFycmF5LnByb3RvdHlwZS5jb3B5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgY29weSA9IE9iamVjdC5hc3NpZ24oT2JqZWN0LmNyZWF0ZShPYmplY3QuZ2V0UHJvdG90eXBlT2YodGhpcykpLCB0aGlzKTtcbiAgICAgICAgY29weS5kYXRhID0gbmV3IHRoaXMudHlwZSh0aGlzLmRhdGEpO1xuICAgICAgICBjb3B5LnNoYXBlID0gdGhpcy5zaGFwZTtcbiAgICAgICAgY29weS5sZW5ndGggPSB0aGlzLmxlbmd0aDtcbiAgICAgICAgY29weS50eXBlID0gdGhpcy50eXBlO1xuICAgICAgICByZXR1cm4gY29weTtcbiAgICB9O1xuICAgIE5EQXJyYXkucHJvdG90eXBlLmNvcyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGwxID0gdGhpcy5sZW5ndGg7XG4gICAgICAgIHZhciBpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbDE7IGkgKz0gMSkge1xuICAgICAgICAgICAgdGhpcy5kYXRhW2ldID0gY29zKHRoaXMuZGF0YVtpXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBOREFycmF5LnByb3RvdHlwZS5jb3NoID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbDEgPSB0aGlzLmxlbmd0aDtcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsMTsgaSArPSAxKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGFbaV0gPSBjb3NoKHRoaXMuZGF0YVtpXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBOREFycmF5LnByb3RvdHlwZS5kb3QgPSBmdW5jdGlvbiAoeCkge1xuICAgICAgICB0aGlzLmVxdWlsYXRlcmFsKHgpO1xuICAgICAgICB0aGlzLmVxdWlkaW1lbnNpb25hbCh4KTtcbiAgICAgICAgdmFyIF9hID0gdGhpcywgZDEgPSBfYS5kYXRhLCBsMSA9IF9hLmxlbmd0aDtcbiAgICAgICAgdmFyIGQyID0geC5kYXRhO1xuICAgICAgICB0cnkge1xuICAgICAgICAgICAgcmV0dXJuIG5ibGFzLmRvdChkMSwgZDIpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSAwO1xuICAgICAgICAgICAgdmFyIGkgPSB2b2lkIDA7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbDE7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCArPSBkMVtpXSAqIGQyW2ldO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgTkRBcnJheS5wcm90b3R5cGUuZXF1YWxzID0gZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgdGhpcy5lcXVpbGF0ZXJhbCh4KTtcbiAgICAgICAgdGhpcy5lcXVpZGltZW5zaW9uYWwoeCk7XG4gICAgICAgIHZhciBfYSA9IHRoaXMsIGQxID0gX2EuZGF0YSwgbDEgPSBfYS5sZW5ndGg7XG4gICAgICAgIHZhciBkMiA9IHguZGF0YTtcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsMTsgaSArPSAxKSB7XG4gICAgICAgICAgICBpZiAoZDFbaV0gIT09IGQyW2ldKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH07XG4gICAgTkRBcnJheS5wcm90b3R5cGUuZXF1aWRpbWVuc2lvbmFsID0gZnVuY3Rpb24gKHgpIHtcbiAgICAgICAgdmFyIHMxID0gdGhpcy5zaGFwZTtcbiAgICAgICAgdmFyIHMyID0geC5zaGFwZTtcbiAgICAgICAgaWYgKCFzMS5ldmVyeShmdW5jdGlvbiAoZGltLCBpKSB7IHJldHVybiBkaW0gPT09IHMyW2ldOyB9KSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwic2hhcGVzIFwiICsgczEgKyBcIiBhbmQgXCIgKyBzMiArIFwiIGRvIG5vdCBtYXRjaFwiKTtcbiAgICAgICAgfVxuICAgIH07XG4gICAgTkRBcnJheS5wcm90b3R5cGUuZXF1aWxhdGVyYWwgPSBmdW5jdGlvbiAoeCkge1xuICAgICAgICB2YXIgbDEgPSB0aGlzLmxlbmd0aDtcbiAgICAgICAgdmFyIGwyID0geC5sZW5ndGg7XG4gICAgICAgIGlmIChsMSAhPT0gbDIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihcImxlbmd0aHMgXCIgKyBsMSArIFwiIGFuZCBcIiArIGwyICsgXCIgZG8gbm90IG1hdGNoXCIpO1xuICAgICAgICB9XG4gICAgfTtcbiAgICBOREFycmF5LnByb3RvdHlwZS5leHAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBsMSA9IHRoaXMubGVuZ3RoO1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGwxOyBpICs9IDEpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YVtpXSA9IGV4cCh0aGlzLmRhdGFbaV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgTkRBcnJheS5wcm90b3R5cGUuZXhwbTEgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBsMSA9IHRoaXMubGVuZ3RoO1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGwxOyBpICs9IDEpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YVtpXSA9IGV4cG0xKHRoaXMuZGF0YVtpXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBOREFycmF5LnByb3RvdHlwZS5maWxsID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gdm9pZCAwKSB7IHZhbHVlID0gMDsgfVxuICAgICAgICB2YXIgX2EgPSB0aGlzLCBkYXRhID0gX2EuZGF0YSwgbGVuZ3RoID0gX2EubGVuZ3RoO1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICBkYXRhW2ldID0gdmFsdWUgaW5zdGFuY2VvZiBGdW5jdGlvbiA/IHZhbHVlKGkpIDogdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBOREFycmF5LnByb3RvdHlwZS5mbG9vciA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGwxID0gdGhpcy5sZW5ndGg7XG4gICAgICAgIHZhciBpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbDE7IGkgKz0gMSkge1xuICAgICAgICAgICAgdGhpcy5kYXRhW2ldID0gZmxvb3IodGhpcy5kYXRhW2ldKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIE5EQXJyYXkucHJvdG90eXBlLmZyb3VuZCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGwxID0gdGhpcy5sZW5ndGg7XG4gICAgICAgIHZhciBpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbDE7IGkgKz0gMSkge1xuICAgICAgICAgICAgdGhpcy5kYXRhW2ldID0gZnJvdW5kKHRoaXMuZGF0YVtpXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBOREFycmF5LnByb3RvdHlwZS5sb2cgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBsMSA9IHRoaXMubGVuZ3RoO1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGwxOyBpICs9IDEpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YVtpXSA9IGxvZyh0aGlzLmRhdGFbaV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgTkRBcnJheS5wcm90b3R5cGUubG9nMTAgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBsMSA9IHRoaXMubGVuZ3RoO1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGwxOyBpICs9IDEpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YVtpXSA9IGxvZzEwKHRoaXMuZGF0YVtpXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBOREFycmF5LnByb3RvdHlwZS5sb2cxcCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGwxID0gdGhpcy5sZW5ndGg7XG4gICAgICAgIHZhciBpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbDE7IGkgKz0gMSkge1xuICAgICAgICAgICAgdGhpcy5kYXRhW2ldID0gbG9nMXAodGhpcy5kYXRhW2ldKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIE5EQXJyYXkucHJvdG90eXBlLmxvZzIgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBsMSA9IHRoaXMubGVuZ3RoO1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGwxOyBpICs9IDEpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YVtpXSA9IGxvZzIodGhpcy5kYXRhW2ldKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIE5EQXJyYXkucHJvdG90eXBlLm1hZ25pdHVkZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGxlbmd0aCA9IHRoaXMubGVuZ3RoO1xuICAgICAgICBpZiAobGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YTtcbiAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgIHJldHVybiBuYmxhcy5ucm0yKGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIGNhdGNoIChlcnIpIHtcbiAgICAgICAgICAgIHZhciByZXN1bHQgPSAwO1xuICAgICAgICAgICAgdmFyIGkgPSB2b2lkIDA7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoOyBpICs9IDEpIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgKz0gZGF0YVtpXSAqIGRhdGFbaV07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHJlc3VsdCk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIE5EQXJyYXkucHJvdG90eXBlLm1heCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICByZXR1cm4gZGF0YVtuYmxhcy5pYW1heChkYXRhKV07XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgdmFyIGxlbmd0aF8xID0gdGhpcy5sZW5ndGg7XG4gICAgICAgICAgICB2YXIgcmVzdWx0ID0gTnVtYmVyLk5FR0FUSVZFX0lORklOSVRZO1xuICAgICAgICAgICAgdmFyIGkgPSB2b2lkIDA7XG4gICAgICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbGVuZ3RoXzE7IGkgKz0gMSkge1xuICAgICAgICAgICAgICAgIHJlc3VsdCA9IHJlc3VsdCA8IGRhdGFbaV0gPyBkYXRhW2ldIDogcmVzdWx0O1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfVxuICAgIH07XG4gICAgTkRBcnJheS5wcm90b3R5cGUubWluID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgX2EgPSB0aGlzLCBkYXRhID0gX2EuZGF0YSwgbGVuZ3RoID0gX2EubGVuZ3RoO1xuICAgICAgICB2YXIgcmVzdWx0ID0gTnVtYmVyLlBPU0lUSVZFX0lORklOSVRZO1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGxlbmd0aDsgaSArPSAxKSB7XG4gICAgICAgICAgICByZXN1bHQgPSByZXN1bHQgPCBkYXRhW2ldID8gcmVzdWx0IDogZGF0YVtpXTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gcmVzdWx0O1xuICAgIH07XG4gICAgTkRBcnJheS5wcm90b3R5cGUucG93ID0gZnVuY3Rpb24gKGV4cG9uZW50KSB7XG4gICAgICAgIHZhciBsMSA9IHRoaXMubGVuZ3RoO1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGwxOyBpICs9IDEpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YVtpXSA9IHBvdyh0aGlzLmRhdGFbaV0sIGV4cG9uZW50KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIE5EQXJyYXkucHJvdG90eXBlLnByb2R1Y3QgPSBmdW5jdGlvbiAoeCkge1xuICAgICAgICB0aGlzLmVxdWlsYXRlcmFsKHgpO1xuICAgICAgICB0aGlzLmVxdWlkaW1lbnNpb25hbCh4KTtcbiAgICAgICAgdmFyIF9hID0gdGhpcywgZDEgPSBfYS5kYXRhLCBsMSA9IF9hLmxlbmd0aDtcbiAgICAgICAgdmFyIGQyID0geC5kYXRhO1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGwxOyBpICs9IDEpIHtcbiAgICAgICAgICAgIGQxW2ldICo9IGQyW2ldO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgTkRBcnJheS5wcm90b3R5cGUucmVzaGFwZSA9IGZ1bmN0aW9uIChzKSB7XG4gICAgICAgIHZhciBsZW5ndGggPSB0aGlzLmxlbmd0aDtcbiAgICAgICAgaWYgKHMucmVkdWNlKGZ1bmN0aW9uIChzdW0sIGRpbSkgeyByZXR1cm4gc3VtICogZGltOyB9LCAxKSAhPT0gbGVuZ3RoKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoXCJzaGFwZSBcIiArIHV0aWxfMS5zaGFwZSArIFwiIGRvZXMgbm90IG1hdGNoIGxlbmd0aCBcIiArIGxlbmd0aCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zaGFwZSA9IHM7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgTkRBcnJheS5wcm90b3R5cGUucm91bmQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBsMSA9IHRoaXMubGVuZ3RoO1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGwxOyBpICs9IDEpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YVtpXSA9IHJvdW5kKHRoaXMuZGF0YVtpXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBOREFycmF5LnByb3RvdHlwZS5zY2FsZSA9IGZ1bmN0aW9uIChzY2FsYXIpIHtcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGE7XG4gICAgICAgIHRyeSB7XG4gICAgICAgICAgICBuYmxhcy5zY2FsKGRhdGEsIHNjYWxhcik7XG4gICAgICAgIH1cbiAgICAgICAgY2F0Y2ggKGVycikge1xuICAgICAgICAgICAgdmFyIGxlbmd0aF8yID0gdGhpcy5sZW5ndGg7XG4gICAgICAgICAgICB2YXIgaSA9IHZvaWQgMDtcbiAgICAgICAgICAgIGZvciAoaSA9IDA7IGkgPCBsZW5ndGhfMjsgaSArPSAxKSB7XG4gICAgICAgICAgICAgICAgZGF0YVtpXSAqPSBzY2FsYXI7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBOREFycmF5LnByb3RvdHlwZS5zaWduID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbDEgPSB0aGlzLmxlbmd0aDtcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsMTsgaSArPSAxKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGFbaV0gPSBzaWduKHRoaXMuZGF0YVtpXSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBOREFycmF5LnByb3RvdHlwZS5zaW4gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBsMSA9IHRoaXMubGVuZ3RoO1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGwxOyBpICs9IDEpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YVtpXSA9IHNpbih0aGlzLmRhdGFbaV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgTkRBcnJheS5wcm90b3R5cGUuc2luaCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGwxID0gdGhpcy5sZW5ndGg7XG4gICAgICAgIHZhciBpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbDE7IGkgKz0gMSkge1xuICAgICAgICAgICAgdGhpcy5kYXRhW2ldID0gc2luaCh0aGlzLmRhdGFbaV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgTkRBcnJheS5wcm90b3R5cGUuc3FydCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGwxID0gdGhpcy5sZW5ndGg7XG4gICAgICAgIHZhciBpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbDE7IGkgKz0gMSkge1xuICAgICAgICAgICAgdGhpcy5kYXRhW2ldID0gc3FydCh0aGlzLmRhdGFbaV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgTkRBcnJheS5wcm90b3R5cGUuc3VidHJhY3QgPSBmdW5jdGlvbiAoeCkge1xuICAgICAgICByZXR1cm4gdGhpcy5hZGQoeCwgLTEpO1xuICAgIH07XG4gICAgTkRBcnJheS5wcm90b3R5cGUudGFuID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbDEgPSB0aGlzLmxlbmd0aDtcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsMTsgaSArPSAxKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGFbaV0gPSB0YW4odGhpcy5kYXRhW2ldKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIE5EQXJyYXkucHJvdG90eXBlLnRhbmggPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBsMSA9IHRoaXMubGVuZ3RoO1xuICAgICAgICB2YXIgaTtcbiAgICAgICAgZm9yIChpID0gMDsgaSA8IGwxOyBpICs9IDEpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0YVtpXSA9IHRhbmgodGhpcy5kYXRhW2ldKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIE5EQXJyYXkucHJvdG90eXBlLnRydW5jID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgbDEgPSB0aGlzLmxlbmd0aDtcbiAgICAgICAgdmFyIGk7XG4gICAgICAgIGZvciAoaSA9IDA7IGkgPCBsMTsgaSArPSAxKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGFbaV0gPSB0cnVuYyh0aGlzLmRhdGFbaV0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG4gICAgcmV0dXJuIE5EQXJyYXk7XG59KCkpO1xuZXhwb3J0cy5OREFycmF5ID0gTkRBcnJheTtcbnRyeSB7XG4gICAgd2luZG93Lk5EQXJyYXkgPSBOREFycmF5O1xufVxuY2F0Y2ggKGVycm9yKSB7IH1cbiIsIlwidXNlIHN0cmljdFwiO1xudmFyIF9fZXh0ZW5kcyA9ICh0aGlzICYmIHRoaXMuX19leHRlbmRzKSB8fCAoZnVuY3Rpb24gKCkge1xuICAgIHZhciBleHRlbmRTdGF0aWNzID0gZnVuY3Rpb24gKGQsIGIpIHtcbiAgICAgICAgZXh0ZW5kU3RhdGljcyA9IE9iamVjdC5zZXRQcm90b3R5cGVPZiB8fFxuICAgICAgICAgICAgKHsgX19wcm90b19fOiBbXSB9IGluc3RhbmNlb2YgQXJyYXkgJiYgZnVuY3Rpb24gKGQsIGIpIHsgZC5fX3Byb3RvX18gPSBiOyB9KSB8fFxuICAgICAgICAgICAgZnVuY3Rpb24gKGQsIGIpIHsgZm9yICh2YXIgcCBpbiBiKSBpZiAoYi5oYXNPd25Qcm9wZXJ0eShwKSkgZFtwXSA9IGJbcF07IH07XG4gICAgICAgIHJldHVybiBleHRlbmRTdGF0aWNzKGQsIGIpO1xuICAgIH07XG4gICAgcmV0dXJuIGZ1bmN0aW9uIChkLCBiKSB7XG4gICAgICAgIGV4dGVuZFN0YXRpY3MoZCwgYik7XG4gICAgICAgIGZ1bmN0aW9uIF9fKCkgeyB0aGlzLmNvbnN0cnVjdG9yID0gZDsgfVxuICAgICAgICBkLnByb3RvdHlwZSA9IGIgPT09IG51bGwgPyBPYmplY3QuY3JlYXRlKGIpIDogKF9fLnByb3RvdHlwZSA9IGIucHJvdG90eXBlLCBuZXcgX18oKSk7XG4gICAgfTtcbn0pKCk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgXCJfX2VzTW9kdWxlXCIsIHsgdmFsdWU6IHRydWUgfSk7XG52YXIgTkRBcnJheV8xID0gcmVxdWlyZShcIi4vTkRBcnJheVwiKTtcbnZhciBWZWN0b3IgPSAoZnVuY3Rpb24gKF9zdXBlcikge1xuICAgIF9fZXh0ZW5kcyhWZWN0b3IsIF9zdXBlcik7XG4gICAgZnVuY3Rpb24gVmVjdG9yKGRhdGEpIHtcbiAgICAgICAgcmV0dXJuIF9zdXBlci5jYWxsKHRoaXMsIHR5cGVvZiBkYXRhID09PSAnbnVtYmVyJyA/IG5ldyBGbG9hdDMyQXJyYXkoZGF0YSkgOiBkYXRhKSB8fCB0aGlzO1xuICAgIH1cbiAgICBWZWN0b3IuYWRkID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGEuY29weSgpXG4gICAgICAgICAgICAuYWRkKGIpO1xuICAgIH07XG4gICAgVmVjdG9yLmFuZ2xlID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGEuYW5nbGUoYik7XG4gICAgfTtcbiAgICBWZWN0b3IuYmluT3AgPSBmdW5jdGlvbiAoYSwgYiwgb3ApIHtcbiAgICAgICAgcmV0dXJuIGEuY29weSgpXG4gICAgICAgICAgICAuYmluT3AoYiwgb3ApO1xuICAgIH07XG4gICAgVmVjdG9yLmNvbWJpbmUgPSBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICByZXR1cm4gYS5jb3B5KClcbiAgICAgICAgICAgIC5jb21iaW5lKGIpO1xuICAgIH07XG4gICAgVmVjdG9yLmRvdCA9IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgIHJldHVybiBhLmRvdChiKTtcbiAgICB9O1xuICAgIFZlY3Rvci5lcXVhbHMgPSBmdW5jdGlvbiAoYSwgYikge1xuICAgICAgICByZXR1cm4gYS5lcXVhbHMoYik7XG4gICAgfTtcbiAgICBWZWN0b3IuZmlsbCA9IGZ1bmN0aW9uIChjb3VudCwgdmFsdWUsIHR5cGUpIHtcbiAgICAgICAgaWYgKHZhbHVlID09PSB2b2lkIDApIHsgdmFsdWUgPSAwOyB9XG4gICAgICAgIGlmICh0eXBlID09PSB2b2lkIDApIHsgdHlwZSA9IEZsb2F0MzJBcnJheTsgfVxuICAgICAgICBpZiAoY291bnQgPCAwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ2ludmFsaWQgc2l6ZScpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBkYXRhID0gbmV3IHR5cGUoY291bnQpO1xuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcihkYXRhKS5maWxsKHZhbHVlKTtcbiAgICB9O1xuICAgIFZlY3Rvci5ub3JtYWxpemUgPSBmdW5jdGlvbiAodmVjdG9yKSB7XG4gICAgICAgIHJldHVybiB2ZWN0b3IuY29weSgpXG4gICAgICAgICAgICAubm9ybWFsaXplKCk7XG4gICAgfTtcbiAgICBWZWN0b3Iub25lcyA9IGZ1bmN0aW9uIChjb3VudCwgdHlwZSkge1xuICAgICAgICBpZiAodHlwZSA9PT0gdm9pZCAwKSB7IHR5cGUgPSBGbG9hdDMyQXJyYXk7IH1cbiAgICAgICAgcmV0dXJuIFZlY3Rvci5maWxsKGNvdW50LCAxLCB0eXBlKTtcbiAgICB9O1xuICAgIFZlY3Rvci5wcm9qZWN0ID0gZnVuY3Rpb24gKGEsIGIpIHtcbiAgICAgICAgcmV0dXJuIGEucHJvamVjdChiLmNvcHkoKSk7XG4gICAgfTtcbiAgICBWZWN0b3IucmFuZG9tID0gZnVuY3Rpb24gKGNvdW50LCBtaW4sIG1heCwgdHlwZSkge1xuICAgICAgICBpZiAobWluID09PSB2b2lkIDApIHsgbWluID0gMDsgfVxuICAgICAgICBpZiAobWF4ID09PSB2b2lkIDApIHsgbWF4ID0gMTsgfVxuICAgICAgICBpZiAodHlwZSA9PT0gdm9pZCAwKSB7IHR5cGUgPSBGbG9hdDMyQXJyYXk7IH1cbiAgICAgICAgcmV0dXJuIFZlY3Rvci5maWxsKGNvdW50LCBtaW4sIHR5cGUpXG4gICAgICAgICAgICAubWFwKGZ1bmN0aW9uICh2YWx1ZSkgeyByZXR1cm4gdmFsdWUgKyBNYXRoLnJhbmRvbSgpICogKG1heCAtIG1pbik7IH0pO1xuICAgIH07XG4gICAgVmVjdG9yLnJhbmdlID0gZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgYXJncyA9IFtdO1xuICAgICAgICBmb3IgKHZhciBfaSA9IDA7IF9pIDwgYXJndW1lbnRzLmxlbmd0aDsgX2krKykge1xuICAgICAgICAgICAgYXJnc1tfaV0gPSBhcmd1bWVudHNbX2ldO1xuICAgICAgICB9XG4gICAgICAgIHZhciB0eXBlID0gRmxvYXQzMkFycmF5O1xuICAgICAgICB2YXIgYmFja3dhcmRzID0gZmFsc2U7XG4gICAgICAgIHZhciBzdGFydDtcbiAgICAgICAgdmFyIHN0ZXA7XG4gICAgICAgIHZhciBlbmQ7XG4gICAgICAgIGlmICh0eXBlb2YgYXJnc1thcmdzLmxlbmd0aCAtIDFdID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0eXBlID0gYXJncy5wb3AoKTtcbiAgICAgICAgfVxuICAgICAgICBzd2l0Y2ggKGFyZ3MubGVuZ3RoKSB7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgICAgZW5kID0gYXJncy5wb3AoKTtcbiAgICAgICAgICAgICAgICBzdGVwID0gMTtcbiAgICAgICAgICAgICAgICBzdGFydCA9IGFyZ3MucG9wKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgICAgZW5kID0gYXJncy5wb3AoKTtcbiAgICAgICAgICAgICAgICBzdGVwID0gYXJncy5wb3AoKTtcbiAgICAgICAgICAgICAgICBzdGFydCA9IGFyZ3MucG9wKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBkZWZhdWx0OlxuICAgICAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCByYW5nZScpO1xuICAgICAgICB9XG4gICAgICAgIGlmIChlbmQgLSBzdGFydCA8IDApIHtcbiAgICAgICAgICAgIHZhciBjb3B5ID0gZW5kO1xuICAgICAgICAgICAgZW5kID0gc3RhcnQ7XG4gICAgICAgICAgICBzdGFydCA9IGNvcHk7XG4gICAgICAgICAgICBiYWNrd2FyZHMgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIGlmIChzdGVwID4gZW5kIC0gc3RhcnQpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignaW52YWxpZCByYW5nZScpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBkYXRhID0gbmV3IHR5cGUoTWF0aC5jZWlsKChlbmQgLSBzdGFydCkgLyBzdGVwKSk7XG4gICAgICAgIHZhciBpID0gc3RhcnQ7XG4gICAgICAgIHZhciBqID0gMDtcbiAgICAgICAgaWYgKGJhY2t3YXJkcykge1xuICAgICAgICAgICAgZm9yICg7IGkgPCBlbmQ7IGkgKz0gc3RlcCwgaiArPSAxKSB7XG4gICAgICAgICAgICAgICAgZGF0YVtqXSA9IGVuZCAtIGkgKyBzdGFydDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGZvciAoOyBpIDwgZW5kOyBpICs9IHN0ZXAsIGogKz0gMSkge1xuICAgICAgICAgICAgICAgIGRhdGFbal0gPSBpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKGRhdGEpO1xuICAgIH07XG4gICAgVmVjdG9yLnNjYWxlID0gZnVuY3Rpb24gKHZlY3Rvciwgc2NhbGFyKSB7XG4gICAgICAgIHJldHVybiB2ZWN0b3IuY29weSgpXG4gICAgICAgICAgICAuc2NhbGUoc2NhbGFyKTtcbiAgICB9O1xuICAgIFZlY3Rvci5zdWJ0cmFjdCA9IGZ1bmN0aW9uIChhLCBiKSB7XG4gICAgICAgIHJldHVybiBhLmNvcHkoKVxuICAgICAgICAgICAgLnN1YnRyYWN0KGIpO1xuICAgIH07XG4gICAgVmVjdG9yLnplcm9zID0gZnVuY3Rpb24gKGNvdW50LCB0eXBlKSB7XG4gICAgICAgIGlmICh0eXBlID09PSB2b2lkIDApIHsgdHlwZSA9IEZsb2F0MzJBcnJheTsgfVxuICAgICAgICByZXR1cm4gVmVjdG9yLmZpbGwoY291bnQsIDAsIHR5cGUpO1xuICAgIH07XG4gICAgVmVjdG9yLnByb3RvdHlwZS5hbmdsZSA9IGZ1bmN0aW9uICh2ZWN0b3IpIHtcbiAgICAgICAgcmV0dXJuIE1hdGguYWNvcyh0aGlzLmRvdCh2ZWN0b3IpIC8gdGhpcy5tYWduaXR1ZGUoKSAvIHZlY3Rvci5tYWduaXR1ZGUoKSk7XG4gICAgfTtcbiAgICBWZWN0b3IucHJvdG90eXBlLmJpbk9wID0gZnVuY3Rpb24gKHZlY3Rvciwgb3ApIHtcbiAgICAgICAgdmFyIGwxID0gdGhpcy5sZW5ndGg7XG4gICAgICAgIHZhciBsMiA9IHZlY3Rvci5sZW5ndGg7XG4gICAgICAgIGlmIChsMSAhPT0gbDIpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignc2l6ZXMgZG8gbm90IG1hdGNoIScpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbDE7IGkgKz0gMSkge1xuICAgICAgICAgICAgdGhpcy5kYXRhW2ldID0gb3AodGhpcy5kYXRhW2ldLCB2ZWN0b3IuZGF0YVtpXSwgaSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBWZWN0b3IucHJvdG90eXBlLmNoZWNrID0gZnVuY3Rpb24gKGluZGV4KSB7XG4gICAgICAgIGlmICghaXNGaW5pdGUoaW5kZXgpIHx8IGluZGV4IDwgMCB8fCBpbmRleCA+IHRoaXMubGVuZ3RoIC0gMSkge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbmRleCBvdXQgb2YgYm91bmRzJyk7XG4gICAgICAgIH1cbiAgICB9O1xuICAgIFZlY3Rvci5wcm90b3R5cGUuY29tYmluZSA9IGZ1bmN0aW9uICh2ZWN0b3IpIHtcbiAgICAgICAgdmFyIGwxID0gdGhpcy5sZW5ndGg7XG4gICAgICAgIHZhciBsMiA9IHZlY3Rvci5sZW5ndGg7XG4gICAgICAgIGlmIChsMiA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGwxID09PSAwKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGEgPSBuZXcgdmVjdG9yLnR5cGUodmVjdG9yLmRhdGEpO1xuICAgICAgICAgICAgdGhpcy5sZW5ndGggPSBsMjtcbiAgICAgICAgICAgIHRoaXMudHlwZSA9IHZlY3Rvci50eXBlO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgdmFyIGQxID0gdGhpcy5kYXRhO1xuICAgICAgICB2YXIgZDIgPSB2ZWN0b3IuZGF0YTtcbiAgICAgICAgdmFyIGRhdGEgPSBuZXcgdGhpcy50eXBlKGwxICsgbDIpO1xuICAgICAgICBkYXRhLnNldChkMSk7XG4gICAgICAgIGRhdGEuc2V0KGQyLCBsMSk7XG4gICAgICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgICAgIHRoaXMubGVuZ3RoID0gbDEgKyBsMjtcbiAgICAgICAgdGhpcy5zaGFwZSA9IFtsMSArIGwyXTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBWZWN0b3IucHJvdG90eXBlLmNyb3NzID0gZnVuY3Rpb24gKHZlY3Rvcikge1xuICAgICAgICBpZiAodGhpcy5sZW5ndGggIT09IDMgfHwgdmVjdG9yLmxlbmd0aCAhPT0gMykge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdjcm9zcyguLi4pIDogdmVjdG9ycyBtdXN0IGhhdmUgdGhyZWUgY29tcG9uZW50cy4nKTtcbiAgICAgICAgfVxuICAgICAgICB2YXIgYzEgPSB0aGlzLnkgKiB2ZWN0b3IueiAtIHRoaXMueiAqIHZlY3Rvci55O1xuICAgICAgICB2YXIgYzIgPSB0aGlzLnogKiB2ZWN0b3IueCAtIHRoaXMueCAqIHZlY3Rvci56O1xuICAgICAgICB2YXIgYzMgPSB0aGlzLnggKiB2ZWN0b3IueSAtIHRoaXMueSAqIHZlY3Rvci54O1xuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcihbYzEsIGMyLCBjM10pO1xuICAgIH07XG4gICAgVmVjdG9yLnByb3RvdHlwZS5lYWNoID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gICAgICAgIHZhciBpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkgKz0gMSkge1xuICAgICAgICAgICAgY2FsbGJhY2suY2FsbCh0aGlzLCB0aGlzLmRhdGFbaV0sIGksIHRoaXMuZGF0YSk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBWZWN0b3IucHJvdG90eXBlLmdldCA9IGZ1bmN0aW9uIChpbmRleCkge1xuICAgICAgICB0aGlzLmNoZWNrKGluZGV4KTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVtpbmRleF07XG4gICAgfTtcbiAgICBWZWN0b3IucHJvdG90eXBlLm1hcCA9IGZ1bmN0aW9uIChjYWxsYmFjaykge1xuICAgICAgICB2YXIgbCA9IHRoaXMubGVuZ3RoO1xuICAgICAgICB2YXIgbWFwcGVkID0gdGhpcy5jb3B5KCk7XG4gICAgICAgIHZhciBkYXRhID0gbWFwcGVkLmRhdGE7XG4gICAgICAgIHZhciBpO1xuICAgICAgICBmb3IgKGkgPSAwOyBpIDwgbDsgaSArPSAxKSB7XG4gICAgICAgICAgICBkYXRhW2ldID0gY2FsbGJhY2suY2FsbChtYXBwZWQsIGRhdGFbaV0sIGksIGRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBtYXBwZWQ7XG4gICAgfTtcbiAgICBWZWN0b3IucHJvdG90eXBlLm5vcm1hbGl6ZSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NhbGUoMSAvIHRoaXMubWFnbml0dWRlKCkpO1xuICAgIH07XG4gICAgVmVjdG9yLnByb3RvdHlwZS5wcm9qZWN0ID0gZnVuY3Rpb24gKHZlY3Rvcikge1xuICAgICAgICByZXR1cm4gdmVjdG9yLnNjYWxlKHRoaXMuZG90KHZlY3RvcikgLyB2ZWN0b3IuZG90KHZlY3RvcikpO1xuICAgIH07XG4gICAgVmVjdG9yLnByb3RvdHlwZS5wdXNoID0gZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmNvbWJpbmUobmV3IFZlY3RvcihbdmFsdWVdKSk7XG4gICAgfTtcbiAgICBWZWN0b3IucHJvdG90eXBlLnJlZHVjZSA9IGZ1bmN0aW9uIChjYWxsYmFjaywgaW5pdGlhbFZhbHVlKSB7XG4gICAgICAgIHZhciBsID0gdGhpcy5sZW5ndGg7XG4gICAgICAgIGlmIChsID09PSAwICYmIGluaXRpYWxWYWx1ZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ1JlZHVjZSBvZiBlbXB0eSBtYXRyaXggd2l0aCBubyBpbml0aWFsIHZhbHVlLicpO1xuICAgICAgICB9XG4gICAgICAgIHZhciBpO1xuICAgICAgICB2YXIgdmFsdWU7XG4gICAgICAgIGlmIChpbml0aWFsVmFsdWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgdmFsdWUgPSB0aGlzLmRhdGFbMF07XG4gICAgICAgICAgICBpID0gMTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHZhbHVlID0gaW5pdGlhbFZhbHVlO1xuICAgICAgICAgICAgaSA9IDA7XG4gICAgICAgIH1cbiAgICAgICAgZm9yICg7IGkgPCBsOyBpICs9IDEpIHtcbiAgICAgICAgICAgIHZhbHVlID0gY2FsbGJhY2suY2FsbCh0aGlzLCB2YWx1ZSwgdGhpcy5kYXRhW2ldLCBpLCB0aGlzLmRhdGEpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9O1xuICAgIFZlY3Rvci5wcm90b3R5cGUuc2V0ID0gZnVuY3Rpb24gKGluZGV4LCB2YWx1ZSkge1xuICAgICAgICB0aGlzLmNoZWNrKGluZGV4KTtcbiAgICAgICAgdGhpcy5kYXRhW2luZGV4XSA9IHZhbHVlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShWZWN0b3IucHJvdG90eXBlLCBcInhcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldCgwKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0KDAsIHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KFZlY3Rvci5wcm90b3R5cGUsIFwieVwiLCB7XG4gICAgICAgIGdldDogZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMuZ2V0KDEpO1xuICAgICAgICB9LFxuICAgICAgICBzZXQ6IGZ1bmN0aW9uICh2YWx1ZSkge1xuICAgICAgICAgICAgdGhpcy5zZXQoMSwgdmFsdWUpO1xuICAgICAgICB9LFxuICAgICAgICBlbnVtZXJhYmxlOiB0cnVlLFxuICAgICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9KTtcbiAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoVmVjdG9yLnByb3RvdHlwZSwgXCJ6XCIsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXQoMik7XG4gICAgICAgIH0sXG4gICAgICAgIHNldDogZnVuY3Rpb24gKHZhbHVlKSB7XG4gICAgICAgICAgICB0aGlzLnNldCgyLCB2YWx1ZSk7XG4gICAgICAgIH0sXG4gICAgICAgIGVudW1lcmFibGU6IHRydWUsXG4gICAgICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICAgIH0pO1xuICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShWZWN0b3IucHJvdG90eXBlLCBcIndcIiwge1xuICAgICAgICBnZXQ6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldCgzKTtcbiAgICAgICAgfSxcbiAgICAgICAgc2V0OiBmdW5jdGlvbiAodmFsdWUpIHtcbiAgICAgICAgICAgIHRoaXMuc2V0KDMsIHZhbHVlKTtcbiAgICAgICAgfSxcbiAgICAgICAgZW51bWVyYWJsZTogdHJ1ZSxcbiAgICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfSk7XG4gICAgVmVjdG9yLnByb3RvdHlwZS50b0FycmF5ID0gZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gW10uc2xpY2UuY2FsbCh0aGlzLmRhdGEpO1xuICAgIH07XG4gICAgVmVjdG9yLnByb3RvdHlwZS50b1N0cmluZyA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGwgPSB0aGlzLmxlbmd0aDtcbiAgICAgICAgdmFyIHJlc3VsdCA9IFsnWyddO1xuICAgICAgICB2YXIgaSA9IDA7XG4gICAgICAgIGlmIChpIDwgbCkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goU3RyaW5nKHRoaXMuZGF0YVtpXSkpO1xuICAgICAgICAgICAgaSArPSAxO1xuICAgICAgICB9XG4gICAgICAgIHdoaWxlIChpIDwgbCkge1xuICAgICAgICAgICAgcmVzdWx0LnB1c2goXCIsIFwiICsgdGhpcy5kYXRhW2ldKTtcbiAgICAgICAgICAgIGkgKz0gMTtcbiAgICAgICAgfVxuICAgICAgICByZXN1bHQucHVzaCgnXScpO1xuICAgICAgICByZXR1cm4gcmVzdWx0LmpvaW4oJycpO1xuICAgIH07XG4gICAgcmV0dXJuIFZlY3Rvcjtcbn0oTkRBcnJheV8xLk5EQXJyYXkpKTtcbmV4cG9ydHMuVmVjdG9yID0gVmVjdG9yO1xudHJ5IHtcbiAgICB3aW5kb3cuVmVjdG9yID0gVmVjdG9yO1xufVxuY2F0Y2ggKGVycm9yKSB7IH1cbiIsIlwidXNlIHN0cmljdFwiO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFwiX19lc01vZHVsZVwiLCB7IHZhbHVlOiB0cnVlIH0pO1xudmFyIFZlY3Rvcl8xID0gcmVxdWlyZShcIi4vVmVjdG9yXCIpO1xuZXhwb3J0cy5WZWN0b3IgPSBWZWN0b3JfMS5WZWN0b3I7XG52YXIgTWF0cml4XzEgPSByZXF1aXJlKFwiLi9NYXRyaXhcIik7XG5leHBvcnRzLk1hdHJpeCA9IE1hdHJpeF8xLk1hdHJpeDtcbnZhciBOREFycmF5XzEgPSByZXF1aXJlKFwiLi9OREFycmF5XCIpO1xuZXhwb3J0cy5OREFycmF5ID0gTkRBcnJheV8xLk5EQXJyYXk7XG4iLCJcInVzZSBzdHJpY3RcIjtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShleHBvcnRzLCBcIl9fZXNNb2R1bGVcIiwgeyB2YWx1ZTogdHJ1ZSB9KTtcbmV4cG9ydHMuZmxhdHRlbiA9IGZ1bmN0aW9uIChpbnB1dCkge1xuICAgIHJldHVybiBpbnB1dC5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgbmV4dCkgeyByZXR1cm4gYWNjLmNvbmNhdChBcnJheS5pc0FycmF5KG5leHQpID8gZXhwb3J0cy5mbGF0dGVuKG5leHQpIDogbmV4dCk7IH0sIFtdKTtcbn07XG5leHBvcnRzLnNoYXBlID0gZnVuY3Rpb24gKGlucHV0KSB7IHJldHVybiBBcnJheS5pc0FycmF5KGlucHV0KVxuICAgID8gW2lucHV0Lmxlbmd0aF0uY29uY2F0KGV4cG9ydHMuc2hhcGUoaW5wdXRbMF0pKVxuICAgIDogW107IH07XG5leHBvcnRzLnR5cGUgPSBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICBzd2l0Y2ggKGlucHV0LmNvbnN0cnVjdG9yLm5hbWUpIHtcbiAgICAgICAgY2FzZSAnSW50OEFycmF5JzogcmV0dXJuIEludDhBcnJheTtcbiAgICAgICAgY2FzZSAnVWludDhBcnJheSc6IHJldHVybiBVaW50OEFycmF5O1xuICAgICAgICBjYXNlICdJbnQxNkFycmF5JzogcmV0dXJuIEludDE2QXJyYXk7XG4gICAgICAgIGNhc2UgJ1VpbnQxNkFycmF5JzogcmV0dXJuIFVpbnQxNkFycmF5O1xuICAgICAgICBjYXNlICdJbnQzMkFycmF5JzogcmV0dXJuIEludDMyQXJyYXk7XG4gICAgICAgIGNhc2UgJ1VpbnQzMkFycmF5JzogcmV0dXJuIFVpbnQzMkFycmF5O1xuICAgICAgICBjYXNlICdVaW50OENsYW1wZWRBcnJheSc6IHJldHVybiBVaW50OENsYW1wZWRBcnJheTtcbiAgICAgICAgY2FzZSAnRmxvYXQ2NEFycmF5JzogcmV0dXJuIEZsb2F0NjRBcnJheTtcbiAgICAgICAgZGVmYXVsdDogcmV0dXJuIEZsb2F0MzJBcnJheTtcbiAgICB9XG59O1xuZXhwb3J0cy5pc1R5cGVkQXJyYXkgPSBmdW5jdGlvbiAoaW5wdXQpIHtcbiAgICByZXR1cm4gISEoaW5wdXQgJiYgaW5wdXQuYnVmZmVyIGluc3RhbmNlb2YgQXJyYXlCdWZmZXIgJiYgaW5wdXQuQllURVNfUEVSX0VMRU1FTlQpO1xufTtcbiIsImltcG9ydCB7IFJlbmRlcmVyIH0gZnJvbSAnLi9SZW5kZXJlcic7XG5pbXBvcnQgeyBQcmltaXRpdmVDb21wb25lbnQgfSBmcm9tICcuL1ByaW1pdGl2ZUNvbXBvbmVudCc7XG5pbXBvcnQgeyBWZWN0b3IgfSBmcm9tICd2ZWN0b3Jpb3VzJztcblxuLy91aGguLi4gaSBsb29rZWQgdXAgKlNPKiBtdWNoIHN0dWZmIG9uIHRoaXMsIGFuZCBldmVuIHRyaWVkIHRvIHdvcmsgb3V0IHRoZSBtYXRoIG15c2VsZixcbi8vYnV0IHRoaXMgaXMgcmlkaWN1bG91cyAtIHdoZXJlIGRvZXMgdGhpcyBjb21lIGZyb20/XG5mdW5jdGlvbiBfY3ViaWNCZXppZXIoc3RhcnQsIGMxLCBjMiwgZW5kLCB0KSB7XG4gICAgcmV0dXJuIHN0YXJ0ICogKDEgLSB0KSAqICgxIC0gdCkgKiAoMSAtIHQpICsgMyAqIGMxICogdCAqICgxIC0gdCkgKiAoMSAtIHQpICsgMyAqIGMyICogdCAqIHQgKiAoMSAtIHQpICsgZW5kICogdCAqIHQgKiB0O1xufVxuXG5cbmZ1bmN0aW9uIF9nZXRFeHRyZW1lcyhzdGFydCwgYzEsIGMyLCBlbmQpIHtcblxuICAgIGxldCBhID0gMyAqIGVuZCAtIDkgKiBjMiArIDkgKiBjMSAtIDMgKiBzdGFydDtcbiAgICBsZXQgYiA9IDYgKiBjMiAtIDEyICogYzEgKyA2ICogc3RhcnQ7XG4gICAgbGV0IGMgPSAzICogYzEgLSAzICogc3RhcnQ7XG5cbiAgICBsZXQgc29sdXRpb25zID0gW107XG4gICAgbGV0IGxvY2FsRXh0cmVtYSA9IFtdO1xuXG4gICAgLy9cImRpc2NyaW1pbmFudFwiXG4gICAgbGV0IGRpc2MgPSBiICogYiAtIDQgKiBhICogYztcblxuICAgIGlmIChkaXNjID49IDApIHtcbiAgICAgICAgaWYgKCFNYXRoLmFicyhhKSA+IDAgJiYgTWF0aC5hYnMoYikgPiAwKSB7XG4gICAgICAgICAgICBzb2x1dGlvbnMucHVzaCgtYyAvIGIpO1xuICAgICAgICB9IGVsc2UgaWYgKE1hdGguYWJzKGEpID4gMCkge1xuICAgICAgICAgICAgc29sdXRpb25zLnB1c2goKC1iICsgTWF0aC5zcXJ0KGRpc2MpKSAvICgyICogYSkpO1xuICAgICAgICAgICAgc29sdXRpb25zLnB1c2goKC1iIC0gTWF0aC5zcXJ0KGRpc2MpKSAvICgyICogYSkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKFwibm8gc29sdXRpb25zIT8hPyFcIik7XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCB0IG9mIHNvbHV0aW9ucykge1xuICAgICAgICAgICAgaWYgKDAgPD0gdCAmJiB0IDw9IDEpIHtcbiAgICAgICAgICAgICAgICBsb2NhbEV4dHJlbWEucHVzaChfY3ViaWNCZXppZXIoc3RhcnQsIGMxLCBjMiwgZW5kLCB0KSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBsb2NhbEV4dHJlbWEucHVzaChzdGFydCwgZW5kKTtcblxuICAgIHJldHVybiBsb2NhbEV4dHJlbWE7XG59XG5cbmV4cG9ydCBjbGFzcyBCZXppZXIgZXh0ZW5kcyBQcmltaXRpdmVDb21wb25lbnQge1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG5cbiAgICAgICAgbGV0IHN0YXJ0ID0gbmV3IFZlY3Rvcihbb3B0aW9ucy5zdGFydC54LCBvcHRpb25zLnN0YXJ0LnldKTtcbiAgICAgICAgbGV0IGVuZCA9IG5ldyBWZWN0b3IoW29wdGlvbnMuZW5kLngsIG9wdGlvbnMuZW5kLnldKTtcbiAgICAgICAgbGV0IGNvbnRyb2wxID0gbmV3IFZlY3Rvcihbb3B0aW9ucy5jb250cm9sMS54LCBvcHRpb25zLmNvbnRyb2wxLnldKTtcbiAgICAgICAgbGV0IGNvbnRyb2wyID0gbmV3IFZlY3Rvcihbb3B0aW9ucy5jb250cm9sMi54LCBvcHRpb25zLmNvbnRyb2wyLnldKTtcblxuICAgICAgICB0aGlzLl9ib3VuZGluZ0JveCA9IG51bGw7XG4gICAgICAgIHRoaXMuX2JvdW5kaW5nQm94TmVlZHNVcGRhdGUgPSB0cnVlO1xuXG4gICAgICAgIGxldCB4RXh0cmVtYSA9IF9nZXRFeHRyZW1lcyhzdGFydC54LCBjb250cm9sMS54LCBjb250cm9sMiwgZW5kLngpO1xuICAgICAgICBsZXQgeUV4dHJlbWEgPSBfZ2V0RXh0cmVtZXMoc3RhcnQueSwgY29udHJvbDEueSwgY29udHJvbDIueSwgZW5kLnkpO1xuICAgICAgICBzdXBlci5kID0gbmV3IFZlY3RvcihbTWF0aC5taW4uYXBwbHkobnVsbCwgeEV4dHJlbWEpLCBNYXRoLm1pbi5hcHBseShudWxsLCB5RXh0cmVtYSldKVxuXG4gICAgICAgIHRoaXMuX25vcm1hbGl6YXRpb25WZWN0b3IgPSB0aGlzLmQ7XG5cbiAgICAgICAgdGhpcy5fc3RhcnQgPSBWZWN0b3Iuc3VidHJhY3Qoc3RhcnQsIHRoaXMuX25vcm1hbGl6YXRpb25WZWN0b3IpO1xuICAgICAgICB0aGlzLl9lbmQgPSBWZWN0b3Iuc3VidHJhY3QoZW5kLCB0aGlzLl9ub3JtYWxpemF0aW9uVmVjdG9yKTtcbiAgICAgICAgdGhpcy5fY29udHJvbDEgPSBWZWN0b3Iuc3VidHJhY3QoY29udHJvbDEsIHRoaXMuX25vcm1hbGl6YXRpb25WZWN0b3IpO1xuICAgICAgICB0aGlzLl9jb250cm9sMiA9IFZlY3Rvci5zdWJ0cmFjdChjb250cm9sMiwgdGhpcy5fbm9ybWFsaXphdGlvblZlY3Rvcik7XG4gICAgfVxuXG4gICAgZ2V0IGJvdW5kaW5nQm94KCkge1xuICAgICAgICAvL2lmICh0aGlzLl9ib3VuZGluZ0JveCA9PT0gbnVsbCB8fCB0aGlzLl9ib3VuZGluZ0JveE5lZWRzVXBkYXRlKSB7XG4gICAgICAgIGxldCBsaW5lV2lkdGggPSB0aGlzLnN0eWxlLmxpbmVXaWR0aDtcblxuICAgICAgICBsZXQgb2Zmc2V0ID0gdGhpcy5vZmZzZXQ7XG4gICAgICAgIGxldCBzdGFydCA9IFZlY3Rvci5hZGQodGhpcy5fc3RhcnQsIHRoaXMub2Zmc2V0KTtcbiAgICAgICAgbGV0IGNvbnRyb2wxID0gVmVjdG9yLmFkZCh0aGlzLl9jb250cm9sMSwgdGhpcy5vZmZzZXQpO1xuICAgICAgICBsZXQgY29udHJvbDIgPSBWZWN0b3IuYWRkKHRoaXMuX2NvbnRyb2wyLCB0aGlzLm9mZnNldCk7XG4gICAgICAgIGxldCBlbmQgPSBWZWN0b3IuYWRkKHRoaXMuX2VuZCwgdGhpcy5vZmZzZXQpO1xuXG4gICAgICAgIGxldCB4RXh0cmVtYSA9IF9nZXRFeHRyZW1lcyhzdGFydC54LCBjb250cm9sMS54LCBjb250cm9sMiwgZW5kLngpO1xuICAgICAgICBsZXQgeUV4dHJlbWEgPSBfZ2V0RXh0cmVtZXMoc3RhcnQueSwgY29udHJvbDEueSwgY29udHJvbDIueSwgZW5kLnkpO1xuICAgICAgICB0aGlzLl9ib3VuZGluZ0JveCA9IHtcbiAgICAgICAgICAgIHRvcDogTWF0aC5taW4uYXBwbHkobnVsbCwgeUV4dHJlbWEpIC0gbGluZVdpZHRoLFxuICAgICAgICAgICAgcmlnaHQ6IE1hdGgubWF4LmFwcGx5KG51bGwsIHhFeHRyZW1hKSArIGxpbmVXaWR0aCxcbiAgICAgICAgICAgIGJvdHRvbTogTWF0aC5tYXguYXBwbHkobnVsbCwgeUV4dHJlbWEpICsgbGluZVdpZHRoLFxuICAgICAgICAgICAgbGVmdDogTWF0aC5taW4uYXBwbHkobnVsbCwgeEV4dHJlbWEpIC0gbGluZVdpZHRoXG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5fYm91bmRpbmdCb3hOZWVkc1VwZGF0ZSA9IGZhbHNlO1xuICAgICAgICAvL31cbiAgICAgICAgcmV0dXJuIHRoaXMuX2JvdW5kaW5nQm94O1xuICAgIH1cblxuICAgIHJlbmRlcigpIHtcbiAgICAgICAgUmVuZGVyZXIuZHJhd0JlemllcihcbiAgICAgICAgICAgIHRoaXMuX3N0YXJ0LFxuICAgICAgICAgICAgdGhpcy5fZW5kLFxuICAgICAgICAgICAgdGhpcy5fY29udHJvbDEsXG4gICAgICAgICAgICB0aGlzLl9jb250cm9sMixcbiAgICAgICAgICAgIHRoaXMuX3ByZXJlbmRlcmluZ0NvbnRleHQsXG4gICAgICAgICAgICB0aGlzLnN0eWxlXG4gICAgICAgICk7XG4gICAgfVxufVxuIiwiaW1wb3J0IHsgREVGQVVMVFMsIFJlbmRlcmVyIH0gZnJvbSAnLi9SZW5kZXJlcic7XG5pbXBvcnQgeyBDb21wb3NpdGlvbn0gIGZyb20gJy4vQ29tcG9zaXRpb24nO1xuaW1wb3J0IHsgUHJpbWl0aXZlQ29tcG9uZW50IH0gZnJvbSAnLi9QcmltaXRpdmVDb21wb25lbnQnO1xuaW1wb3J0IHsgQ2lyY2xlIH0gZnJvbSAnLi9DaXJjbGUnO1xuaW1wb3J0IHsgRWxsaXBzZSB9IGZyb20gJy4vRWxsaXBzZSc7XG5pbXBvcnQgeyBSZWN0YW5nbGUgfSBmcm9tICcuL1JlY3RhbmdsZSc7XG5pbXBvcnQgeyBMaW5lIH0gZnJvbSAnLi9MaW5lJztcbmltcG9ydCB7IFZlY3RvclBhdGggfSBmcm9tICcuL1ZlY3RvclBhdGgnO1xuaW1wb3J0IHsgQmV6aWVyIH0gZnJvbSAnLi9CZXppZXInO1xuaW1wb3J0IHsgSW1hZ2UgfSBmcm9tICcuL0ltYWdlJztcbmltcG9ydCB7IFRleHQgfSBmcm9tICcuL1RleHQnO1xuXG4vL2NvbnN0IEZQU19FUFNJTE9OID0gMTA7IC8vICsvLSAxMG1zIGZvciBhbmltYXRpb24gbG9vcCB0byBkZXRlcm1pbmUgaWYgZW5vdWdoIHRpbWUgaGFzIHBhc3NlZCB0byByZW5kZXJcbmNvbnN0IERFRkFVTFRfVEFSR0VUX0ZQUyA9IDEwMDAgLyA2MDsgLy9hbW91bnQgb2YgdGltZSB0aGF0IG11c3QgcGFzcyBiZWZvcmUgcmVuZGVyaW5nXG5cbmNvbnN0IEVWRU5UUyA9IHtcbiAgICBNT1VTRVVQOiAnb25tb3VzZXVwJyxcbiAgICBNT1VTRURPV046ICdvbm1vdXNlZG93bicsXG4gICAgTU9VU0VNT1ZFOiAnb25tb3VzZW1vdmUnLFxuICAgIE1PVVNFT1VUOiAnb25tb3VzZW91dCcsXG4gICAgQ0xJQ0s6ICdvbmNsaWNrJ1xufTtcblxuLyoqXG4gKiBUaGUgQ2FudmFzQ29tcG9zaXRvciBjbGFzcyBpcyB0aGUgZW50cnktcG9pbnQgdG8gdXNhZ2Ugb2YgdGhlIGBjYW52YXMtY29tcG9zaXRvcmAuXG4gKiBUaGUgYXBwbGljYXRpb24gcHJvZ3JhbW1lciBpcyBleHBlY3RlZCB0byBoYW5kIG92ZXIgbG93LWxldmVsIGNvbnRyb2wgb2YgdGhlIGNhbnZhc1xuICogY29udGV4dCB0byB0aGUgaGlnaC1sZXZlbCBjbGFzc2VzIGFuZCBtZXRob2RzIGV4cG9zZWQgYnkgQ2FudmFzQ29tcG9zaXRvci5cbiAqXG4gKiBUaGUgQ2FudmFzQ29tcG9zaXRvciBjbGFzcyBlc3RhYmxpc2hlcyBhbiBldmVudCBkaXNwYXRjaGVyLCBhbmltYXRpb24gbG9vcCwgYW5kIHNjZW5lIGdyYXBoIGZvclxuICogY29tcG9zaXRpb25zLlxuICovXG5jbGFzcyBDYW52YXNDb21wb3NpdG9yIHtcbiAgICAvKipcbiAgICAgKiBUaGUgQ2FudmFzQ29tcG9zaXRvciBjbGFzcyBlc3RhYmxpc2hlcyBhbiBldmVudCBkaXNwYXRjaGVyLCBhbmltYXRpb24gbG9vcCwgYW5kIHNjZW5lIGdyYXBoIGZvclxuICAgICAqIGNvbXBvc2l0aW9uc1xuICAgICAqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGNhbnZhcyBUaGlzIHNob3VsZCBiZSBhIGNhbnZhcywgZWl0aGVyIGZyb20gdGhlIERPTSBvciBhbiBlcXVpdmFsZW50IEFQSVxuICAgICAqXG4gICAgICogQGV4YW1wbGVcbiAgICAgKiBsZXQgY2MgPSBuZXcgQ2FudmFzQ29tcG9zaXRvcihkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnbXlDYW52YXMnKSk7XG4gICAgICovXG4gICAgY29uc3RydWN0b3IoY2FudmFzKSB7XG4gICAgICAgIHRoaXMuX2NhbnZhcyA9IGNhbnZhcztcbiAgICAgICAgdGhpcy5fY29udGV4dCA9IHRoaXMuX2NhbnZhcy5nZXRDb250ZXh0KCcyZCcpO1xuXG4gICAgICAgIC8vYWNxdWlyZSB0aGUgcGFkZGluZyBvbiB0aGUgY2FudmFzIOKAkyB0aGlzIGlzIG5lY2Vzc2FyeSB0byBwcm9wZXJseVxuICAgICAgICAvL2xvY2F0ZSB0aGUgbW91c2UgcG9zaXRpb25cbiAgICAgICAgLy9UT0RPOiBkZXRlcm1pbmUgaWYgYm9yZGVyLWJveCBhZmZlY3RzIHRoaXMsIGFuZCBhZGp1c3QgYWNjb3JkaW5nbHlcbiAgICAgICAgbGV0IHN0eWxlID0gd2luZG93LmdldENvbXB1dGVkU3R5bGUodGhpcy5fY2FudmFzKTtcblxuICAgICAgICBsZXQgYm9yZGVyTGVmdCA9IHN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ2JvcmRlci1sZWZ0JykgPyBwYXJzZUZsb2F0KHN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ2JvcmRlci1sZWZ0JykpIDogMDtcbiAgICAgICAgbGV0IHBhZGRpbmdMZWZ0ID0gc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgncGFkZGluZy1sZWZ0JykgPyBwYXJzZUZsb2F0KHN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ3BhZGRpbmctbGVmdCcpKSA6IDA7XG5cbiAgICAgICAgdGhpcy5fbGVmdFBhZGRpbmcgPSBib3JkZXJMZWZ0ICsgcGFkZGluZ0xlZnQ7XG5cbiAgICAgICAgbGV0IGJvcmRlclRvcCA9IHN0eWxlLmdldFByb3BlcnR5VmFsdWUoJ2JvcmRlci10b3AnKSA/IHBhcnNlRmxvYXQoc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgnYm9yZGVyLXRvcCcpKSA6IDA7XG4gICAgICAgIGxldCBwYWRkaW5nVG9wID0gc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgncGFkZGluZy10b3AnKSA/IHBhcnNlRmxvYXQoc3R5bGUuZ2V0UHJvcGVydHlWYWx1ZSgncGFkZGluZy10b3AnKSkgOiAwO1xuXG4gICAgICAgIHRoaXMuX3RvcFBhZGRpbmcgPSBib3JkZXJUb3AgKyBwYWRkaW5nVG9wO1xuXG4gICAgICAgIHRoaXMuX2N1cnJlbnRUaW1lID0gMDtcbiAgICAgICAgdGhpcy5fbGFzdEZyYW1lVGltZXN0YW1wID0gMDtcbiAgICAgICAgdGhpcy5fbGFzdFJlbmRlclRpbWUgPSAwO1xuXG4gICAgICAgIHRoaXMuX3RhcmdldE9iamVjdCA9IG51bGw7XG5cbiAgICAgICAgdGhpcy5fc2NlbmUgPSBuZXcgQ29tcG9zaXRpb24odGhpcy5jYW52YXMpO1xuXG4gICAgICAgIHRoaXMuX2JpbmRFdmVudHMoKTtcblxuICAgICAgICB0aGlzLl9ldmVudFJlZ2lzdHJ5ID0ge1xuICAgICAgICAgICAgb25tb3VzZXVwOiBbXSxcbiAgICAgICAgICAgIG9ubW91c2Vkb3duOiBbXSxcbiAgICAgICAgICAgIG9ubW91c2Vtb3ZlOiBbXSxcbiAgICAgICAgICAgIG9ubW91c2VvdXQ6IFtdLFxuICAgICAgICAgICAgb25jbGljazogW11cbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLl9hbmltYXRpb25Mb29wKCk7XG4gICAgICAgIHRoaXMuX2ZyYW1lcmF0ZSA9IDA7XG4gICAgfVxuXG4gICAgLy9UT0RPOiBleHBvc2UgdGhlIGZyYW1lcmF0ZVxuICAgIHNldCBmcmFtZXJhdGUodmFsKSB7XG4gICAgICAgIHRoaXMuX2ZyYW1lcmF0ZSA9IHZhbDtcbiAgICB9XG5cbiAgICBnZXQgZnJhbWVyYXRlKCkge1xuICAgICAgICAvL3ZhciBmcmFtZXJhdGVVcGRhdGVkRXZlbnQgPSBuZXcgRXZlbnQoKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2ZyYW1lcmF0ZTtcbiAgICB9XG5cbiAgICAvL1RPRE86IG11bHRpcGxlIHRhcmdldCBvYmplY3RzPyBpbiByZXZlcnNlIG9yZGVyIG9mIHJlbmRlcj8gaW4gb3JkZXIgb2YgY29tcG9zaXRpb24/XG4gICAgLyoqXG4gICAgICogdGhlIG9iamVjdCBjdXJyZW50bHkgc2VsZWN0ZWQgZm9yIGludGVyYWN0aW9uXG4gICAgICogQHR5cGUge29iamVjdH1cbiAgICAgKi9cbiAgICBnZXQgdGFyZ2V0T2JqZWN0KCkge1xuICAgICAgICByZXR1cm4gdGhpcy5fdGFyZ2V0T2JqZWN0O1xuICAgIH1cbiAgICAvKipcbiAgICAgKiB0aGUgb2JqZWN0IGN1cnJlbnRseSBzZWxlY3RlZCBmb3IgaW50ZXJhY3Rpb25cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gdmFsXG4gICAgICogQHR5cGUge29iamVjdH1cbiAgICAgKi9cbiAgICBzZXQgdGFyZ2V0T2JqZWN0KHZhbCkge1xuICAgICAgICB0aGlzLl90YXJnZXRPYmplY3QgPSB2YWw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdGhlIHJvb3Qgb2YgdGhlIHNjZW5lIGdyYXBoLiBhZGQgcHJpbWl0aXZlcyB0byB0aGlzIHRvIGNvbXBvc2UgYW4gaW1hZ2VcbiAgICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgICAqL1xuICAgIGdldCBzY2VuZSgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NjZW5lO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRoZSBhbmltYXRpb24gbG9vcCBmb3IgdGhpcyBpbnN0YW5jZSBvZiBDYW52YXNDb21wb3NpdG9yLlxuICAgICAqIFVwb24gcmVjZWlwdCBvZiB0aGUgYW5pbWF0aW9uIGZyYW1lIGZyb20gYHJlcXVlc3RBbmltYXRpb25GcmFtZWAsIHRoZSBsb29wIHdpbGwgY2hlY2tcbiAgICAgKiB3aGV0aGVyIGVub3VnaCB0aW1lIGhhcyBwYXNzZWQgdG8gcmVkcmF3IGZvciB0aGUgdGFyZ2V0IGZyYW1lcmF0ZS5cbiAgICAgKiBJdCB3aWxsIG9ubHkgZHJhdyBpZiBzb21ld2hlcmUgYWxvbmcgdGhlIHNjZW5lIGdyYXBoLCBhbiBvYmplY3QgbmVlZHMgdXBkYXRpbmcuXG4gICAgICogVGhlcmUgaXMgbm8gbmVlZCB0byBpbnZva2UgdGhpcyBkaXJlY3RseSwgdGhlIGNvbnN0cnVjdG9yIHdpbGwgZG8gaXQuXG4gICAgICovXG4gICAgX2FuaW1hdGlvbkxvb3AoKSB7XG4gICAgICAgIHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUodGhpcy5fYW5pbWF0aW9uTG9vcC5iaW5kKHRoaXMpKTtcbiAgICAgICAgdGhpcy5fY3VycmVudFRpbWUgPSArbmV3IERhdGUoKTtcbiAgICAgICAgLy9zZXQgbWF4aW11bSBvZiA2MCBmcHMgYW5kIG9ubHkgcmVkcmF3IGlmIG5lY2Vzc2FyeVxuICAgICAgICBpZiAoIC8qdGhpcy5fY3VycmVudFRpbWUgLSB0aGlzLl9sYXN0RnJhbWVUaW1lc3RhbXAgPj0gdGhpcy5fdGFyZ2V0RlBTICYmKi8gdGhpcy5zY2VuZS5uZWVkc0RyYXcpIHtcbiAgICAgICAgICAgIHRoaXMuX2xhc3RSZW5kZXJUaW1lID0gK25ldyBEYXRlKCk7XG4gICAgICAgICAgICBSZW5kZXJlci5jbGVhclJlY3QoMCwgMCwgdGhpcy5fY2FudmFzLndpZHRoLCB0aGlzLl9jYW52YXMuaGVpZ2h0LCB0aGlzLl9jb250ZXh0KTtcbiAgICAgICAgICAgIHRoaXMuc2NlbmUuZHJhdyh0aGlzLl9jb250ZXh0KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmZyYW1lcmF0ZSA9IHBhcnNlSW50KDEwMDAgLyAodGhpcy5fY3VycmVudFRpbWUgLSB0aGlzLl9sYXN0RnJhbWVUaW1lc3RhbXApKTtcbiAgICAgICAgdGhpcy5fbGFzdEZyYW1lVGltZXN0YW1wID0gK25ldyBEYXRlKCk7XG5cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBhZGQgYW4gZXZlbnQgdG8gdGhlIGV2ZW50IHJlZ2lzdHJ5XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZXZlbnRUeXBlIHRoZSBuYW1lIG9mIHRoZSB0eXBlIG9mIGV2ZW50XG4gICAgICogQHBhcmFtIHtmdW5jdGlvbn0gY2FsbGJhY2sgdGhlIGNhbGxiYWNrIHRvIGJlIHRyaWdnZXJlZCB3aGVuIHRoZSBldmVudCBvY2N1cnNcbiAgICAgKi9cbiAgICByZWdpc3RlckV2ZW50KGV2ZW50VHlwZSwgY2FsbGJhY2spIHtcbiAgICAgICAgaWYgKHRoaXMuX2V2ZW50UmVnaXN0cnlbZXZlbnRUeXBlXSkge1xuICAgICAgICAgICAgdGhpcy5fZXZlbnRSZWdpc3RyeVtldmVudFR5cGVdLnB1c2goY2FsbGJhY2spO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmVtb3ZlIGFuIGV2ZW50IHRvIHRoZSBldmVudCByZWdpc3RyeVxuICAgICAqXG4gICAgICogQHBhcmFtIHtzdHJpbmd9IGV2ZW50VHlwZSB0aGUgbmFtZSBvZiB0aGUgdHlwZSBvZiBldmVudFxuICAgICAqIEBwYXJhbSB7ZnVuY3Rpb259IGNhbGxiYWNrIHRoZSBjYWxsYmFjayB0byBiZSByZW1vdmVkIGZyb20gdGhlIGV2ZW50XG4gICAgICogQHJldHVybiB7ZnVuY3Rpb259IHRoZSBjYWxsYmFjayB0aGF0IHdhcyByZW1vdmVkXG4gICAgICovXG4gICAgcmVtb3ZlRXZlbnQoZXZlbnRUeXBlLCBjYWxsYmFjaykge1xuICAgICAgICBpZiAodGhpcy5fZXZlbnRSZWdpc3RyeVtldmVudFR5cGVdKSB7XG4gICAgICAgICAgICBsZXQgaW5kZXggPSB0aGlzLl9ldmVudFJlZ2lzdHJ5W2V2ZW50VHlwZV0uaW5kZXhPZihjYWxsYmFjayk7XG4gICAgICAgICAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLl9ldmVudFJlZ2lzdHJ5W2V2ZW50VHlwZV0uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGF0dGFjaCBpbnRlcmFjdGlvbiBldmVudHMgdG8gdGhlIGNhbnZhcy4gdGhlIGNhbnZhcyBjb21wb3NpdG9yIGRpc3BhdGNoZXNcbiAgICAgKiBldmVudHMgdG8gcmVsZXZhbnQgb2JqZWN0cyB0aHJvdWdoIGJyaWRnZXMgdG8gdGhlIHNjZW5lIGdyYXBoXG4gICAgICovXG4gICAgX2JpbmRFdmVudHMoKSB7XG4gICAgICAgIC8vVE9ETzogcmVpbXBsZW1lbnQgdG91Y2ggZXZlbnRzP1xuICAgICAgICAvL211c3QgYmluZCB0byBgdGhpc2AgdG8gcmV0YWluIHJlZmVyZW5jZVxuICAgICAgICB0aGlzLl9jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vkb3duJywgdGhpcy5faGFuZGxlTW91c2VEb3duLmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLl9jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignbW91c2V1cCcsIHRoaXMuX2hhbmRsZU1vdXNlVXAuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuX2NhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW1vdmUnLCB0aGlzLl9oYW5kbGVNb3VzZU1vdmUuYmluZCh0aGlzKSk7XG4gICAgICAgIHRoaXMuX2NhbnZhcy5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsIHRoaXMuX2hhbmRsZU1vdXNlT3V0LmJpbmQodGhpcykpO1xuICAgICAgICB0aGlzLl9jYW52YXMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCB0aGlzLl9oYW5kbGVDbGljay5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBicmlkZ2UgdGhlIG1vdXNlIGRvd24gZXZlbnQgb24gdGhlIGNhbnZhcyB0byB0aGVcbiAgICAgKiB0aGUgb2JqZWN0cyBpbiB0aGUgc2NlbmUgZ3JhcGhcbiAgICAgKi9cbiAgICBfaGFuZGxlTW91c2VEb3duKGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGxldCB4ID0gZS5vZmZzZXRYIC0gdGhpcy5fbGVmdFBhZGRpbmc7XG4gICAgICAgIGxldCB5ID0gZS5vZmZzZXRZIC0gdGhpcy5fdG9wUGFkZGluZztcblxuICAgICAgICAvL3Bhc3MgdGhyb3VnaCB4IGFuZCB5IHRvIHByb3BhZ2F0ZWQgZXZlbnRzXG4gICAgICAgIGUuY2FudmFzWCA9IHg7XG4gICAgICAgIGUuY2FudmFzWSA9IHk7XG5cbiAgICAgICAgZm9yIChsZXQgY2FsbGJhY2sgb2YgdGhpcy5fZXZlbnRSZWdpc3RyeVtFVkVOVFMuTU9VU0VET1dOXSkge1xuICAgICAgICAgICAgY2FsbGJhY2soZSk7XG4gICAgICAgIH07XG5cbiAgICAgICAgbGV0IGNsaWNrZWRPYmplY3QgPSB0aGlzLnNjZW5lLmNoaWxkQXQoeCwgeSk7XG5cbiAgICAgICAgaWYgKGNsaWNrZWRPYmplY3QgJiYgY2xpY2tlZE9iamVjdC5vbm1vdXNlZG93bikge1xuICAgICAgICAgICAgY2xpY2tlZE9iamVjdC5vbm1vdXNlZG93bihlKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGJyaWRnZSB0aGUgbW91c2UgdXAgZXZlbnQgb24gdGhlIGNhbnZhcyB0byB0aGVcbiAgICAgKiB0aGUgb2JqZWN0cyBpbiB0aGUgc2NlbmUgZ3JhcGhcbiAgICAgKi9cbiAgICBfaGFuZGxlTW91c2VVcChlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBsZXQgeCA9IGUub2Zmc2V0WCAtIHRoaXMuX2xlZnRQYWRkaW5nO1xuICAgICAgICBsZXQgeSA9IGUub2Zmc2V0WSAtIHRoaXMuX3RvcFBhZGRpbmc7XG5cbiAgICAgICAgLy9wYXNzIHRocm91Z2ggeCBhbmQgeSB0byBwcm9wYWdhdGVkIGV2ZW50c1xuICAgICAgICBlLmNhbnZhc1ggPSB4O1xuICAgICAgICBlLmNhbnZhc1kgPSB5O1xuXG4gICAgICAgIGZvciAobGV0IGMgb2YgdGhpcy5zY2VuZS5jaGlsZHJlbikge1xuICAgICAgICAgICAgaWYgKGMuZHJhZ2dhYmxlICYmIGMub25tb3VzZXVwKSB7XG4gICAgICAgICAgICAgICAgYy5vbm1vdXNldXAoZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBmb3IgKGxldCBjYWxsYmFjayBvZiB0aGlzLl9ldmVudFJlZ2lzdHJ5W0VWRU5UUy5NT1VTRVVQXSkge1xuICAgICAgICAgICAgY2FsbGJhY2soZSk7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgY2xpY2tlZE9iamVjdCA9IHRoaXMuc2NlbmUuY2hpbGRBdCh4LCB5KTtcblxuICAgICAgICBpZiAoY2xpY2tlZE9iamVjdCAmJiBjbGlja2VkT2JqZWN0Lm9ubW91c2V1cCkge1xuICAgICAgICAgICAgY2xpY2tlZE9iamVjdC5vbm1vdXNldXAoZSk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogYnJpZGdlIHRoZSBtb3VzZSBtb3ZlIGV2ZW50IG9uIHRoZSBjYW52YXMgdG8gdGhlXG4gICAgICogdGhlIG9iamVjdHMgaW4gdGhlIHNjZW5lIGdyYXBoXG4gICAgICovXG4gICAgX2hhbmRsZU1vdXNlTW92ZShlKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgbGV0IG9iamVjdHMgPSB0aGlzLnNjZW5lLmNoaWxkcmVuLmZpbHRlcigoYykgPT4gISEoYy5vbm1vdXNlbW92ZSkpO1xuXG4gICAgICAgIGZvciAobGV0IGNhbGxiYWNrIG9mIHRoaXMuX2V2ZW50UmVnaXN0cnlbRVZFTlRTLk1PVVNFTU9WRV0pIHtcbiAgICAgICAgICAgIGNhbGxiYWNrKGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgZm9yIChsZXQgbyBvZiBvYmplY3RzKSB7XG4gICAgICAgICAgICBvLm9ubW91c2Vtb3ZlKGUpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIGJyaWRnZSB0aGUgY2xpY2sgZXZlbnQgb24gdGhlIGNhbnZhcyB0byB0aGVcbiAgICAgKiB0aGUgb2JqZWN0cyBpbiB0aGUgc2NlbmUgZ3JhcGhcbiAgICAgKi9cbiAgICBfaGFuZGxlQ2xpY2soZSkge1xuICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgbGV0IHggPSBlLm9mZnNldFggLSB0aGlzLl9sZWZ0UGFkZGluZztcbiAgICAgICAgbGV0IHkgPSBlLm9mZnNldFkgLSB0aGlzLl90b3BQYWRkaW5nO1xuXG4gICAgICAgIC8vcGFzcyB0aHJvdWdoIHggYW5kIHkgdG8gcHJvcGFnYXRlZCBldmVudHNcbiAgICAgICAgZS5jYW52YXNYID0geDtcbiAgICAgICAgZS5jYW52YXNZID0geTtcblxuICAgICAgICAvL1RPRE86IEZGIGRvZXNuJ3QgZ2V0IHRoaXNcbiAgICAgICAgbGV0IG9iamVjdHMgPSB0aGlzLnNjZW5lLmNoaWxkcmVuLmZpbHRlcigoYykgPT4gISEoYy5vbmNsaWNrKSk7XG5cbiAgICAgICAgZm9yIChsZXQgY2FsbGJhY2sgb2YgdGhpcy5fZXZlbnRSZWdpc3RyeVtFVkVOVFMuQ0xJQ0tdKSB7XG4gICAgICAgICAgICBjYWxsYmFjayhlKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGZvciAobGV0IG8gb2Ygb2JqZWN0cykge1xuICAgICAgICAgICAgby5vbmNsaWNrKGUpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIGJyaWRnZSB0aGUgbW91c2Ugb3V0IGV2ZW50IG9uIHRoZSBjYW52YXMgdG8gdGhlXG4gICAgICogdGhlIG9iamVjdHMgaW4gdGhlIHNjZW5lIGdyYXBoXG4gICAgICovXG4gICAgX2hhbmRsZU1vdXNlT3V0KGUpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGxldCBvYmplY3RzID0gdGhpcy5zY2VuZS5jaGlsZHJlbi5maWx0ZXIoKGMpID0+ICEhKGMub25tb3VzZW91dCkpO1xuXG4gICAgICAgIGZvciAobGV0IG8gb2Ygb2JqZWN0cykge1xuICAgICAgICAgICAgby5vbm1vdXNlb3V0KGUpO1xuICAgICAgICB9O1xuXG4gICAgICAgIGZvciAobGV0IGNhbGxiYWNrIG9mIHRoaXMuX2V2ZW50UmVnaXN0cnlbRVZFTlRTLk1PVVNFT1VUXSkge1xuICAgICAgICAgICAgY2FsbGJhY2soZSk7XG4gICAgICAgIH07XG4gICAgfTtcblxuICAgIGRyYXdCZXppZXIoc3RhcnQsIGVuZCwgYzEsIGMyLCBzdHlsZSkge1xuICAgICAgICBSZW5kZXJlci5kcmF3QmV6aWVyKHN0YXJ0LCBlbmQsIGMxLCBjMiwgdGhpcy5fY29udGV4dCwgc3R5bGUpO1xuICAgIH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluaXQoY2FudmFzKSB7XG4gICAgcmV0dXJuIG5ldyBDYW52YXNDb21wb3NpdG9yKGNhbnZhcyk7XG59XG5cbmV4cG9ydCB7XG4gICAgUmVuZGVyZXIsXG4gICAgUHJpbWl0aXZlQ29tcG9uZW50LFxuICAgIENvbXBvc2l0aW9uLFxuICAgIENpcmNsZSxcbiAgICBFbGxpcHNlLFxuICAgIFJlY3RhbmdsZSxcbiAgICBMaW5lLFxuICAgIFZlY3RvclBhdGgsXG4gICAgQmV6aWVyLFxuICAgIEltYWdlLFxuICAgIFRleHQsXG4gICAgREVGQVVMVFNcbn1cbiIsImltcG9ydCB7IFJlbmRlcmVyIH0gZnJvbSAnLi9SZW5kZXJlcic7XG5pbXBvcnQgeyBQcmltaXRpdmVDb21wb25lbnQgfSBmcm9tICcuL1ByaW1pdGl2ZUNvbXBvbmVudCc7XG5cbi8qKlxuICogQSBjaXJjbGVcbiAqL1xuZXhwb3J0IGNsYXNzIENpcmNsZSBleHRlbmRzIFByaW1pdGl2ZUNvbXBvbmVudCB7XG4gICAgLy9UT0RPOiBwcm92aWRlIGRldGFpbHMgYWJvdXQgb3B0aW9ucyBmb3IgZG9jcyAtIGxpbmsgdG8gYSBzZXBhcmF0ZSBwYWdlXG4gICAgLyoqXG4gICAgICogUHJpbWl0aXZlQ29tcG9uZW50IGNvbnN0cnVjdG9yXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgb2JqZWN0IHNldHRpbmdzXG4gICAgICovXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICBzdXBlcihvcHRpb25zKVxuICAgICAgICAvKipcbiAgICAgICAgICogdGhlIHJhZGl1cyBvZiB0aGUgY2lyY2xlXG4gICAgICAgICAqIEB0eXBlIHtudW1iZXJ9IHJhZGl1c1xuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5yYWRpdXMgPSBvcHRpb25zLnJhZGl1cyB8fCAwO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGdldCB0aGUgYm91bmRpbmcgYm94IG9mIHRoZSBjaXJjbGU7XG4gICAgICogQHR5cGUge3t0b3A6bnVtYmVyLCBsZWZ0OiBudW1iZXIsIGJvdHRvbTpudW1iZXIsIHJpZ2h0Om51bWJlcn19XG4gICAgICovXG4gICAgZ2V0IGJvdW5kaW5nQm94KCkge1xuICAgICAgICAvL1RPRE86IHBvc3NpYmx5IG1lbW9yeS1pbmVmZmljaWVudCAtIG5lZWQgdG8gcmVzZWFyY2g6XG4gICAgICAgIC8vc3Ryb2tlcyBhcmUgKHdlcmU/KSBjZW50ZXJlZCBvdmVyIHRoZSBtYXRoZW1hdGljYWwgcGVyaW1ldGVyIC1cbiAgICAgICAgLy9zbyBoYWxmIHRoZSBzdHJva2UgbGFpZCB3aXRoaW4gdGhlIHBlcmltZXRlciwgYW5kIHRoZVxuICAgICAgICAvL290aGVyIGhhbGYgbGFpZCBvdXRzaWRlLiBmb3Igc29tZSByZWFzb24sIHRoaXMgZG9lc24ndFxuICAgICAgICAvL3dvcmsgZm9yICgwIDwgbGluZVdpZHRoIDwgMi4wKS5cbiAgICAgICAgLy9cbiAgICAgICAgLy9pdCdzIGp1c3QgYSBwaXhlbCwgYnV0IHdoZW4gYSB0aG91c2FuZCBvYmplY3RzIGFyZSBvbiBzY3JlZW4sXG4gICAgICAgIC8vdGhhdCdsbCBtYWtlIGEgZGlmZmVyZW5jZVxuICAgICAgICBsZXQgb2Zmc2V0ID0gdGhpcy5vZmZzZXQ7XG4gICAgICAgIGxldCBzY2FsZSA9IHRoaXMuY29tcG91bmRTY2FsZTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRvcDogb2Zmc2V0LnkgLVxuICAgICAgICAgICAgICAgICgodGhpcy5yYWRpdXMgKiBzY2FsZS5zY2FsZUhlaWdodCkgK1xuICAgICAgICAgICAgICAgICAgICAodGhpcy5zdHlsZS5saW5lV2lkdGgpKSxcbiAgICAgICAgICAgIGxlZnQ6IG9mZnNldC54IC1cbiAgICAgICAgICAgICAgICAoKHRoaXMucmFkaXVzICogc2NhbGUuc2NhbGVXaWR0aCkgK1xuICAgICAgICAgICAgICAgICAgICAodGhpcy5zdHlsZS5saW5lV2lkdGgpKSxcbiAgICAgICAgICAgIGJvdHRvbTogb2Zmc2V0LnkgK1xuICAgICAgICAgICAgICAgICh0aGlzLnJhZGl1cyAqIHNjYWxlLnNjYWxlSGVpZ2h0KSArXG4gICAgICAgICAgICAgICAgKHRoaXMuc3R5bGUubGluZVdpZHRoKSxcbiAgICAgICAgICAgIHJpZ2h0OiBvZmZzZXQueCArXG4gICAgICAgICAgICAgICAgKHRoaXMucmFkaXVzICogc2NhbGUuc2NhbGVXaWR0aCkgK1xuICAgICAgICAgICAgICAgICh0aGlzLnN0eWxlLmxpbmVXaWR0aClcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBvdmVycmlkZSB0aGUgcmVuZGVyIGZ1bmN0aW9uIGZvciBkcmF3aW5nIGNpcmNsZXMgc3BlY2lmaWNhbGx5XG4gICAgICogQG92ZXJyaWRlXG4gICAgICovXG4gICAgcmVuZGVyKCkge1xuICAgICAgICAvL3RoZSBiZWxvdyBpcyB0byBlbnN1cmUgdGhlIHByb3BlciBwbGFjZW1lbnQgd2hlbiBzY2FsaW5nL2xpbmUgd2lkdGhzIGFyZSBhY2NvdW50ZWQgZm9yXG4gICAgICAgIGxldCBzY2FsZSA9IHRoaXMuY29tcG91bmRTY2FsZTtcbiAgICAgICAgbGV0IGxpbmVXaWR0aCA9IHRoaXMuc3R5bGUubGluZVdpZHRoO1xuICAgICAgICBSZW5kZXJlci5kcmF3Q2lyY2xlKFxuICAgICAgICAgICAgKHRoaXMucmFkaXVzICogc2NhbGUuc2NhbGVXaWR0aCkgKyBsaW5lV2lkdGgsXG4gICAgICAgICAgICAodGhpcy5yYWRpdXMgKiBzY2FsZS5zY2FsZUhlaWdodCkgKyBsaW5lV2lkdGgsXG4gICAgICAgICAgICAodGhpcy5yYWRpdXMgKiBzY2FsZS5zY2FsZVdpZHRoKSxcbiAgICAgICAgICAgIHRoaXMuX3ByZXJlbmRlcmluZ0NvbnRleHQsXG4gICAgICAgICAgICB0aGlzLnN0eWxlXG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZGV0ZXJtaW5lIHdoZXRoZXIgdGhlIHBvaW50IGlzIGluIHRoZSBvYmplY3RcbiAgICAgKiBiYXNpY2FsbHkganVzdCB0aGUgcHl0aGFnb3JlYW4gdGhlb3JlbVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IHRoZSB4IGNvb3JkaW5hdGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSB0aGUgeSBjb29yZGluYXRlXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gd2hldGhlciBvciBub3QgdGhlIHBvaW50IGlzIGluIHRoZSBvYmplY3RcbiAgICAgKi9cbiAgICBwb2ludElzSW5PYmplY3QoeCwgeSkge1xuXG4gICAgICAgIGxldCBvZmZzZXQgPSB0aGlzLm9mZnNldDtcblxuICAgICAgICAvL2Rvbid0IGJvdGhlciBjaGVja2luZyB0aGUgYm91bmRpbmcgYm94IGJlY2F1c2VcbiAgICAgICAgLy9weXRoYWdvcmVhbiBmb3JtdWxhIGlzIGNsb3NlZC1mb3JtXG4gICAgICAgICAgICBsZXQgYSA9IHggLSBvZmZzZXQueDtcbiAgICAgICAgICAgIGxldCBiID0geSAtIG9mZnNldC55O1xuICAgICAgICAgICAgbGV0IGMgPSB0aGlzLnJhZGl1cztcblxuICAgICAgICAgICAgLy90aGFua3MgcHl0aGFnb3Jhc34hXG4gICAgICAgICAgICByZXR1cm4gKGEgKiBhKSArIChiICogYikgPD0gKGMgKiBjKTtcbiAgICAgICAgLy91c2UgdGhlIGJlbG93IHdoZW4gc2NhbGluZyBpcyByZWltcGxlbWVudGVkXG4gICAgICAgIC8qXG5cdFx0cmV0dXJuIChcblx0XHRcdENhbnZhc09iamVjdC5wcm90b3R5cGUuUG9pbnRJc0luT2JqZWN0LmNhbGwodGhpcywgeCwgeSkgJiZcblx0XHRcdE1hdGgucG93KCh4IC0gdGhpcy5vZmZzZXQueCksIDIpIC8gTWF0aC5wb3coKHRoaXMucmFkaXVzICogdGhpcy5HbG9iYWxTY2FsZS5zY2FsZVdpZHRoKSwgMikgKyBNYXRoLnBvdygoeSAtIHRoaXMub2Zmc2V0LnkpLCAyKSAvIE1hdGgucG93KCh0aGlzLnJhZGl1cyAqIHRoaXMuR2xvYmFsU2NhbGUuc2NhbGVIZWlnaHQpLCAyKSA8PSAxXG5cdFx0KTsqL1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBQcmltaXRpdmVDb21wb25lbnQgfSBmcm9tICcuL1ByaW1pdGl2ZUNvbXBvbmVudCc7XG5cbi8qKlxuICogVGhlIENvbXBvc2l0aW9uIGNsYXNzIGlzIGFuIGV4dGVuc2lvbiBvZiB0aGUgUHJpbWl0aXZlIHRoYXQgaXNcbiAqIGNvbXBvc2VkIG9mIG90aGVyIGV4dGVuc2lvbnMgb2YgdGhlIFByaW1pdGl2ZS4gVGhlIENvbXBvc2l0aW9uXG4gKiBpcyB1c2VkIHRvIGVzdGFibGlzaCB0aGUgU2NlbmUgZ3JhcGggYXMgdGhlIHBhcmVudCBvZiBhbGwgb3RoZXJcbiAqIG9iamVjdHMgb24gc2NyZWVuLiBUaGlzIGlzIHRoZSBrZXkgYWJzdHJhY3Rpb24gb2YgdGhlIFtjb21wb3NpdGVcbiAqIHBhdHRlcm5dKGh0dHBzOi8vZW4ud2lraXBlZGlhLm9yZy93aWtpL0NvbXBvc2l0ZV9wYXR0ZXJuKTogYW5cbiAqIGFjdGlvbiB0YWtlbiBvbiB0aGUgcGFyZW50IGVsZW1lbnQgYWN0cyB1cG9uIGFsbCBvZiB0aGUgY2hpbGRyZW4sXG4gKiBhbmQgdHJhbnNhdGl2ZWx5LCBhbGwgb2YgdGhlaXIgY2hpbGRyZW4uXG4gKi9cbmV4cG9ydCBjbGFzcyBDb21wb3NpdGlvbiBleHRlbmRzIFByaW1pdGl2ZUNvbXBvbmVudCB7XG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtvYmplY3R9IG9wdGlvbnMgb2JqZWN0IHNldHRpbmdzXG4gICAgICovXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICAgICAgb3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG4gICAgICAgIHRoaXMuX2NoaWxkcmVuID0gb3B0aW9ucy5jaGlsZHJlbiB8fCBbXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBjaGlsZHJlbiBvZiB0aGlzIGNvbXBvc2l0aW9uXG4gICAgICogQHR5cGUge0FycmF5fSBjaGlsZHJlbiB0aGUgd2hpY2ggY29tcG9zZSB0aGlzIG9iamVjdFxuICAgICAqL1xuICAgIGdldCBjaGlsZHJlbigpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NoaWxkcmVuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHRoZSBib3VuZGluZyBib3ggb2YgdGhlIGNvbXBvc2l0aW9uIChpLmUuLCB0aGUgY29udGFpbmluZyBib3VuZHMgb2YgYWxsIHRoZSBjaGlsZHJlbiBvZiB0aGlzIGNvbXBvc2l0aW9uKVxuICAgICAqIEB0eXBlIHt7dG9wOm51bWJlciwgbGVmdDpudW1iZXIsIHJpZ2h0Om51bWJlciwgYm90dG9tOm51bWJlcn19IGJvdW5kaW5nQm94XG4gICAgICovXG4gICAgZ2V0IGJvdW5kaW5nQm94KCkge1xuICAgICAgICBsZXQgdG9wID0gSW5maW5pdHksXG4gICAgICAgICAgICBsZWZ0ID0gSW5maW5pdHksXG4gICAgICAgICAgICBib3R0b20gPSAtSW5maW5pdHksXG4gICAgICAgICAgICByaWdodCA9IC1JbmZpbml0eTtcblxuICAgICAgICBmb3IgKGxldCBjIG9mIHRoaXMuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIGxldCBib3VuZGluZ0JveCA9IGMuYm91bmRpbmdCb3g7XG4gICAgICAgICAgICB0b3AgPSBNYXRoLm1pbihib3VuZGluZ0JveC50b3AsIHRvcCk7XG4gICAgICAgICAgICBsZWZ0ID0gTWF0aC5taW4oYm91bmRpbmdCb3gubGVmdCwgbGVmdCk7XG4gICAgICAgICAgICBib3R0b20gPSBNYXRoLm1heChib3VuZGluZ0JveC5ib3R0b20sIGJvdHRvbSk7XG4gICAgICAgICAgICByaWdodCA9IE1hdGgubWF4KGJvdW5kaW5nQm94LnJpZ2h0LCByaWdodCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRvcDogdG9wLFxuICAgICAgICAgICAgbGVmdDogbGVmdCxcbiAgICAgICAgICAgIGJvdHRvbTogYm90dG9tLFxuICAgICAgICAgICAgcmlnaHQ6IHJpZ2h0XG4gICAgICAgIH07XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiB0aGUgYW4gYXJyYXkgb2YgY2hpbGRyZW4gdGhhdCBhcmUgZm91bmQgYXQgKHgsIHkpXG4gICAgICogQHJldHVybiB7b2JqZWN0fSBjaGlsZHJlbkF0IGFsbCB0aGUgY2hpbGRyZW4gYmVsb3cgdGhlIHBvaW50XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHggdGhlIHggY29vcmRpbmF0ZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5IHRoZSB5IGNvb3JkaW5hdGVcbiAgICAgKi9cbiAgICBjaGlsZHJlbkF0KHgsIHkpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4uZmlsdGVyKChjKSA9PiBjLlBvaW50SXNJbk9iamVjdCh4LCB5KSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZ2V0IHRoZSB0b3AtbW9zdCBjaGlsZCBhdCB0aGUgKHgsIHkpXG4gICAgICogQHJldHVybiB7b2JqZWN0fSBjaGlsZEF0IHRoZSBmaXJzdCBjaGlsZCBiZWxvdyB0aGUgcG9pbnRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCB0aGUgeCBjb29yZGluYXRlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgdGhlIHkgY29vcmRpbmF0ZVxuICAgICAqL1xuICAgIGNoaWxkQXQoeCwgeSkge1xuICAgICAgICAvL2xvb3Agb3ZlciB0aGUgY2hpbGRyZW4gaW4gcmV2ZXJzZSBiZWNhdXNlIGRyYXdpbmcgb3JkZXJcbiAgICAgICAgZm9yICh2YXIgYyA9IHRoaXMuY2hpbGRyZW4ubGVuZ3RoIC0gMTsgYyA+PSAwOyBjLS0pIHtcbiAgICAgICAgICAgIGlmICh0aGlzLmNoaWxkcmVuW2NdLnBvaW50SXNJbk9iamVjdCh4LCB5KSkge1xuICAgICAgICAgICAgICAgIHJldHVybiB0aGlzLmNoaWxkcmVuW2NdO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogYWRkIGEgY2hpbGQgdG8gdGhpcyBjb21wb3NpdGlvblxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBjaGlsZCB0aGUgY2hpbGQgdG8gYmUgYWRkZWRcbiAgICAgKi9cbiAgICBhZGRDaGlsZChjaGlsZCkge1xuICAgICAgICBjaGlsZC5wYXJlbnQgPSB0aGlzO1xuICAgICAgICB0aGlzLmNoaWxkcmVuLnB1c2goY2hpbGQpO1xuICAgICAgICBzdXBlci5uZWVkc1JlbmRlciA9IHRydWU7XG4gICAgICAgIHN1cGVyLm5lZWRzRHJhdyA9IHRydWU7XG4gICAgICAgIC8vVE9ETzogbWFrZSB0aGlzIGhvb2sgbW9yZSBnZW5lcmljXG4gICAgICAgIC8vYnkgdXNpbmcgYSByZWdpc3RyeVxuICAgICAgICAvL2lmICh0aGlzLm9uY2hpbGRhZGRlZCkge1xuICAgICAgICAvLyAgdGhpcy5vbmNoaWxkYWRkZWQoKTtcbiAgICAgICAgLy99XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmVtb3ZlIGEgY2hpbGQgZnJvbSB0aGlzIGNvbXBvc2l0aW9uXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGNoaWxkIHRoZSBjaGlsZCB0byBiZSByZW1vdmVkXG4gICAgICogQHJldHVybiB7b2JqZWN0fSB0aGUgY2hpbGQgcmVtb3ZlZFxuICAgICAqL1xuICAgIHJlbW92ZUNoaWxkKGNoaWxkKSB7XG4gICAgICAgIGlmIChjaGlsZCkge1xuICAgICAgICAgICAgdmFyIGluZGV4ID0gdGhpcy5jaGlsZHJlbi5pbmRleE9mKGNoaWxkKTtcbiAgICAgICAgICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgc3VwZXIubmVlZHNSZW5kZXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHN1cGVyLm5lZWRzRHJhdyA9IHRydWU7XG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMuY2hpbGRyZW4uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAb3ZlcnJpZGVcbiAgICAgKiBvdmVycmlkZSB0aGUgcmVuZGVyIGZ1bmN0aW9udCB0byByZW5kZXIgdGhlIGNoaWxkcmVuIG9udG8gdGhpcyBjb21wb3NpdGlvbnMgcHJlcmVuZGVyaW5nIGNhbnZhc1xuICAgICAqL1xuICAgIHJlbmRlcigpIHtcbiAgICAgICAgLy8gcmVxdWlyZWQgdG8gbWFrZSBzdXJlIHRoYXQgdGhlIGRyYXdpbmcgb2NjdXJzIHdpdGhpbiB0aGUgYm91bmRzIG9mIHRoaXMgY29tcG9zaXRpb25cbiAgICAgICAgbGV0IGJvdW5kaW5nQm94ID0gdGhpcy5ib3VuZGluZ0JveDtcbiAgICAgICAgdmFyIG9mZnNldCA9IHtcbiAgICAgICAgICAgIHRvcDogLWJvdW5kaW5nQm94LnRvcCxcbiAgICAgICAgICAgIGxlZnQ6IC1ib3VuZGluZ0JveC5sZWZ0LFxuICAgICAgICAgICAgYm90dG9tOiAtYm91bmRpbmdCb3guYm90dG9tLFxuICAgICAgICAgICAgcmlnaHQ6IC1ib3VuZGluZ0JveC5yaWdodFxuICAgICAgICB9O1xuXG4gICAgICAgIGZvciAobGV0IGMgb2YgdGhpcy5jaGlsZHJlbikge1xuICAgICAgICAgICAgYy5kcmF3KHRoaXMuX3ByZXJlbmRlcmluZ0NvbnRleHQsIG9mZnNldCk7XG4gICAgICAgIH07XG5cbiAgICAgICAgLy8gYGRlc3RpbmF0aW9uLW91dGAgd2lsbCBlcmFzZSB0aGluZ3NcbiAgICAgICAgLy90aGlzLl9wcmVyZW5kZXJpbmdDb250ZXh0Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdkZXN0aW5hdGlvbi1vdXQnO1xuICAgICAgICAvL18uZWFjaCh0aGlzLm1hc2tzLCBmdW5jdGlvbiAobSkge1xuICAgICAgICAvL20uZHJhdyhyZW5kZXJDb250ZXh0LCBjb250ZXh0T2Zmc2V0KTtcbiAgICAgICAgLy99KTtcbiAgICAgICAgLy9yZW5kZXJDb250ZXh0Lmdsb2JhbENvbXBvc2l0ZU9wZXJhdGlvbiA9ICdub3JtYWwnO1xuICAgIH07XG59XG4iLCJpbXBvcnQgeyBSZW5kZXJlciB9IGZyb20gJy4vUmVuZGVyZXInO1xuaW1wb3J0IHsgUHJpbWl0aXZlQ29tcG9uZW50IH0gZnJvbSAnLi9QcmltaXRpdmVDb21wb25lbnQnO1xuXG5cblxuLyoqXG4gKiBBbiBlbGxpcHNlXG4gKi9cbmV4cG9ydCBjbGFzcyBFbGxpcHNlIGV4dGVuZHMgUHJpbWl0aXZlQ29tcG9uZW50IHtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gb3B0aW9ucyBvcHRpb25zIGZvciB0aGUgZWxsaXBzZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBvcHRpb25zLnJhZGl1cyB0aGUgbWFqb3IgKGhvcml6b250YWwpIHJhZGl1cyBvZiB0aGUgZWxsaXBzZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBvcHRpb25zLm1pbm9yUmFkaXVzIHRoZSBtaW5vciAodmVydGljYWwpIHJhZGl1cyBvZiB0aGUgZWxsaXBzZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAdHlwZSB7bnVtYmVyfSByYWRpdXMgdGhlIG1ham9yIHJhZGl1cyAoaG9yaXpvbnRhbCkgb2YgdGhlIGVsbGlwc2VcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMucmFkaXVzID0gb3B0aW9ucy5yYWRpdXMgfHwgMDtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIEB0eXBlIHtudW1iZXJ9IG1pbm9yUmFkaXVzIHRoZSBtaW5vciByYWRpdXMgKHZlcnRpY2FsKSBvZiB0aGUgZWxsaXBzZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5taW5vclJhZGl1cyA9IG9wdGlvbnMubWlub3JSYWRpdXMgfHwgdGhpcy5yYWRpdXMgfHwgMDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB0aGUgYm91bmRpbmcgYm94IGZvciB0aGUgZWxsaXBzZVxuICAgICAqIEB0eXBlIHt7dG9wOiBudW1iZXIsIGxlZnQ6IG51bWJlciwgYm90dG9tOiBudW1iZXIsIHJpZ2h0OiBudW1iZXJ9fSBib3VuZGluZ0JveFxuICAgICAqL1xuICAgIGdldCBib3VuZGluZ0JveCgpIHtcbiAgICAgICAgbGV0IG9mZnNldCA9IHRoaXMub2Zmc2V0O1xuICAgICAgICBsZXQgc2NhbGUgPSB0aGlzLmNvbXBvdW5kU2NhbGU7XG4gICAgICAgIGxldCBsaW5lV2lkdGggPSB0aGlzLnN0eWxlLmxpbmVXaWR0aDtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRvcDogb2Zmc2V0LnkgLVxuICAgICAgICAgICAgICAgICgodGhpcy5taW5vclJhZGl1cyAqIHNjYWxlLnNjYWxlSGVpZ2h0KSArIGxpbmVXaWR0aCksXG4gICAgICAgICAgICBsZWZ0OiBvZmZzZXQueCAtXG4gICAgICAgICAgICAgICAgKCh0aGlzLnJhZGl1cyAqIHNjYWxlLnNjYWxlV2lkdGgpICsgbGluZVdpZHRoKSxcbiAgICAgICAgICAgIGJvdHRvbTogb2Zmc2V0LnkgK1xuICAgICAgICAgICAgICAgICh0aGlzLm1pbm9yUmFkaXVzICogc2NhbGUuc2NhbGVIZWlnaHQpICsgbGluZVdpZHRoLFxuICAgICAgICAgICAgcmlnaHQ6IG9mZnNldC54ICtcbiAgICAgICAgICAgICAgICAodGhpcy5yYWRpdXMgKiBzY2FsZS5zY2FsZVdpZHRoKSArIGxpbmVXaWR0aFxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIG92ZXJyaWRlIHRoZSByZW5kZXIgZnVuY3Rpb24gc3BlY2lmaWNhbGx5IGZvciBlbGxpcHNlc1xuICAgICAqIEBvdmVycmlkZVxuICAgICAqL1xuICAgIHJlbmRlcigpIHtcbiAgICAgICAgbGV0IHNjYWxlID0gdGhpcy5jb21wb3VuZFNjYWxlO1xuICAgICAgICBsZXQgbGluZVdpZHRoID0gdGhpcy5zdHlsZS5saW5lV2lkdGg7XG4gICAgICAgIC8vVE9ETzogd29yayBvdXQgc2NhbGluZyBvZiBtYWpvci9taW5vciByYWRpdXNcbiAgICAgICAgLy90aGlzIGRvZXNuJ3QgbWFrZSBzZW5zZVxuICAgICAgICBSZW5kZXJlci5kcmF3RWxsaXBzZShcbiAgICAgICAgICAgICh0aGlzLnJhZGl1cyAqIHNjYWxlLnNjYWxlV2lkdGgpICsgbGluZVdpZHRoLFxuICAgICAgICAgICAgKHRoaXMubWlub3JSYWRpdXMgKiBzY2FsZS5zY2FsZUhlaWdodCkgKyBsaW5lV2lkdGgsXG4gICAgICAgICAgICAodGhpcy5yYWRpdXMgKiBzY2FsZS5zY2FsZVdpZHRoKSxcbiAgICAgICAgICAgICh0aGlzLm1pbm9yUmFkaXVzICogc2NhbGUuc2NhbGVIZWlnaHQpLFxuICAgICAgICAgICAgdGhpcy5fcHJlcmVuZGVyaW5nQ29udGV4dCxcbiAgICAgICAgICAgIHRoaXMuc3R5bGVcbiAgICAgICAgKTtcbiAgICB9XG4gICAgLyoqXG4gICAgICogZGV0ZXJtaW5lIHdoZXRoZXIgdGhlIHBvaW50IGlzIGluIHRoZSBvYmplY3RcbiAgICAgKiBiYXNpY2FsbHkganVzdCB0aGUgcHl0aGFnb3JlYW4gdGhlb3JlbVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IHRoZSB4IGNvb3JkaW5hdGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSB0aGUgeSBjb29yZGluYXRlXG4gICAgICogQHJldHVybiB7Ym9vbGVhbn0gd2hldGhlciBvciBub3QgdGhlIHBvaW50IGlzIGluIHRoZSBvYmplY3RcbiAgICAgKi9cbiAgICBwb2ludElzSW5PYmplY3QoeCwgeSkge1xuICAgICAgICBsZXQgc2NhbGUgPSB0aGlzLmNvbXBvdW5kU2NhbGU7XG4gICAgICAgIGxldCBvZmZzZXQgPSB0aGlzLm9mZnNldDtcblxuICAgICAgICBsZXQgYSA9IHggLSBvZmZzZXQueDtcbiAgICAgICAgbGV0IGIgPSB5IC0gb2Zmc2V0Lnk7XG5cbiAgICAgICAgbGV0IGMxID0gdGhpcy5yYWRpdXMgKiBzY2FsZS5zY2FsZVdpZHRoO1xuICAgICAgICBsZXQgYzIgPSB0aGlzLm1pbm9yUmFkaXVzICogc2NhbGUuc2NhbGVIZWlnaHQ7XG5cbiAgICAgICAgLy9zZWU6IGh0dHA6Ly9tYXRoLnN0YWNrZXhjaGFuZ2UuY29tL3F1ZXN0aW9ucy83NjQ1Ny9jaGVjay1pZi1hLXBvaW50LWlzLXdpdGhpbi1hbi1lbGxpcHNlXG4gICAgICAgIHJldHVybiAoKGEqYSkgLyAoYzEqYzEpKSArICgoYipiKSAvIChjMipjMikpIDw9IDE7XG4gICAgfTtcbn1cbiIsImltcG9ydCB7IFJlbmRlcmVyIH0gZnJvbSAnLi9SZW5kZXJlcic7XG5pbXBvcnQgeyBQcmltaXRpdmVDb21wb25lbnQgfSBmcm9tICcuL1ByaW1pdGl2ZUNvbXBvbmVudCc7XG5cbi8qKlxuICogYW4gSW1hZ2VcbiAqL1xuZXhwb3J0IGNsYXNzIEltYWdlIGV4dGVuZHMgUHJpbWl0aXZlQ29tcG9uZW50IHtcbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge09iamVjdH0gb3B0aW9uc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKG9wdGlvbnMpIHtcbiAgICAgICAgc3VwZXIob3B0aW9ucyk7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAdHlwZSB7d2luZG93LkltYWdlfSB1bnNjYWxlZEltYWdlIHRoZSBvcmlnaW5hbCBpbWFnZVxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy51bnNjYWxlZEltYWdlID0gb3B0aW9ucy5pbWFnZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBnZXQgdGhlIGJvdW5kaW5nIGJveFxuICAgICAqIEB0eXBlIHt7dG9wOiBudW1iZXIsIGxlZnQ6IG51bWJlciwgYm90dG9tOiBudW1iZXIsIHJpZ2h0Om51bWJlcn19IGJvdW5kaW5nQm94XG4gICAgICovXG4gICAgZ2V0IGJvdW5kaW5nQm94KCkge1xuICAgICAgICBsZXQgY29tcG91bmRTY2FsZSA9IHRoaXMuY29tcG91bmRTY2FsZTtcbiAgICAgICAgbGV0IG9mZnNldCA9IHRoaXMub2Zmc2V0O1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdG9wOiBvZmZzZXQueSxcbiAgICAgICAgICAgIGxlZnQ6IG9mZnNldC54LFxuICAgICAgICAgICAgYm90dG9tOiBvZmZzZXQueSArIChjb21wb3VuZFNjYWxlLnNjYWxlSGVpZ2h0ICogdGhpcy51bnNjYWxlZEltYWdlLmhlaWdodCksXG4gICAgICAgICAgICByaWdodDogb2Zmc2V0LnggKyAoY29tcG91bmRTY2FsZS5zY2FsZVdpZHRoICogdGhpcy51bnNjYWxlZEltYWdlLndpZHRoKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIG92ZXJyaWRlIHRoZSByZW5kZXIgZnVuY3Rpb24gZm9yIGltYWdlcyBzcGVjaWZpY2FsbHlcbiAgICAgKiBAb3ZlcnJpZGVcbiAgICAgKi9cbiAgICByZW5kZXIoKSB7XG4gICAgICAgIGxldCBzY2FsZSA9IHRoaXMuY29tcG91bmRTY2FsZTtcbiAgICAgICAgbGV0IGltYWdlID0gbmV3IHdpbmRvdy5JbWFnZSgpO1xuICAgICAgICBpbWFnZS5zcmMgPSB0aGlzLnVuc2NhbGVkSW1hZ2Uuc3JjO1xuICAgICAgICBpbWFnZS53aWR0aCA9IHRoaXMudW5zY2FsZWRJbWFnZS53aWR0aCAqIHNjYWxlLnNjYWxlV2lkdGg7XG4gICAgICAgIGltYWdlLmhlaWdodCA9IHRoaXMudW5zY2FsZWRJbWFnZS5oZWlnaHQgKiBzY2FsZS5zY2FsZUhlaWdodDtcbiAgICAgICAgUmVuZGVyZXIuZHJhd0ltYWdlKDAsIDAsIGltYWdlLCB0aGlzLl9wcmVyZW5kZXJpbmdDb250ZXh0LCB0aGlzLnN0eWxlKTtcbiAgICB9O1xufVxuIiwiaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSAndmVjdG9yaW91cyc7XG5cbi8qKlxuICogQSBsaW5lXG4gKi9cbmV4cG9ydCBjbGFzcyBMaW5lIHtcbiAgICAvKipcbiAgICAgKiBBIExpbmUgY2FuIGJlIGRlZmluZWQgYnkgdHdvIHBvaW50cywgcDEgYW5kIHAyLCB0aHJvdWdoXG4gICAgICogd2hpY2ggaXQgcGFzc2VzLiBIZXJlLCBhbiBhbmNob3IgcG9pbnQgaXMgc3VwcGxpZWQgZm9yIHAxLFxuICAgICAqIGFuZCBhIHVuaXQgdmVjdG9yLCBkaXJlY3Rpb24sIGlzIGFkZGVkIHRvIGl0IHRvIHByb3ZpZGVkXG4gICAgICogdGhlIHNlY29uZC5cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gYW5jaG9yXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGRpcmVjdGlvblxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKGFuY2hvciwgZGlyZWN0aW9uKSB7XG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fSBwMSBhIHZlY3RvciBkZXNjcmliaW5nIGEgcG9pbnQgdGhyb3VnaCB3aGljaCB0aGUgbGluZSBwYXNzZXNcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMucDEgPSBhbmNob3I7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEB0eXBlIHtvYmplY3R9IGRpcmVjdGlvbiBhIHVuaXQgdmVjdG9yIGRlc2NyaWJpbmcgdGhlIGRpcmVjdGlvbiBmcm9tIHAxXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmRpcmVjdGlvbiA9IGRpcmVjdGlvbjtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHR5cGUge29iamVjdH0gYSB2ZWN0b3IgZGVzY3JpYmluZyBhIHNlY29uZCBwb2ludCB0aHJvdWdoIHdoaWNoIHRoZSBsaW5lIHBhc3Nlc1xuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5wMiA9IFZlY3Rvci5hZGQodGhpcy5wMSwgdGhpcy5kaXJlY3Rpb24pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGRldGVybWluZSB0aGUgbG9jYXRpb24gdGhhdCB0aGlzIGxpbmUgaW50ZXJzZWN0cyB3aXRoIGFub3RoZXIsIGlmIGF0IGFsbFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBsIHRoZSBMaW5lIHRvIHRlc3QgZm9yIGludGVyc2VjdGlvbiBhZ2FpbnN0IHRoaXMgTGluZVxuICAgICAqIEByZXR1cm4ge29iamVjdH0gdGhlIHZlY3RvciBvZiB0aGUgbG9jYXRpb24gb2YgaW50ZXJzZWN0aW9uLCBvciBudWxsIGlmIHRoZSBsaW5lcyBhcmUgcGFyYWxsZWxcbiAgICAgKi9cbiAgICBpbnRlcnNlY3Rpb25XaXRoKGwpIHtcbiAgICAgICAgcmV0dXJuIExpbmUuaW50ZXJzZWN0aW9uKHRoaXMsIGwpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGRldGVybWluZSB0aGUgbG9jYXRpb24gdGhhdCB0aGVzZSBsaW5lcyBpbnRlcnNlY3QsIGlmIGF0IGFsbFxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBsMSB0aGUgZmlyc3QgTGluZSB0byB0ZXN0IGZvciBpbnRlcnNlY3Rpb25cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gbDIgdGhlIHNlY29uZCBMaW5lIHRvIHRlc3QgZm9yIGludGVyc2VjdGlvblxuICAgICAqIEByZXR1cm4ge29iamVjdH0gdGhlIHZlY3RvciBvZiB0aGUgbG9jYXRpb24gb2YgaW50ZXJzZWN0aW9uLCBvciBudWxsIGlmIHRoZSBsaW5lcyBhcmUgcGFyYWxsZWxcbiAgICAgKi9cbiAgICBzdGF0aWMgaW50ZXJzZWN0aW9uKGwxLCBsMikge1xuICAgICAgICBsZXQgeDEgPSBsMS5wMS54LFxuICAgICAgICAgICAgeDIgPSBsMS5wMi54LFxuICAgICAgICAgICAgeDMgPSBsMi5wMS54LFxuICAgICAgICAgICAgeDQgPSBsMi5wMi54O1xuICAgICAgICBsZXQgeTEgPSBsMS5wMS55LFxuICAgICAgICAgICAgeTIgPSBsMS5wMi55LFxuICAgICAgICAgICAgeTMgPSBsMi5wMS55LFxuICAgICAgICAgICAgeTQgPSBsMi5wMi55O1xuICAgICAgICBsZXQgZGVub21pbmF0b3IgPSAoeDEgLSB4MikgKiAoeTMgLSB5NCkgLSAoeTEgLSB5MikgKiAoeDMgLSB4NCk7XG4gICAgICAgIGlmIChkZW5vbWluYXRvciA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgeE51bWVyYXRvciA9ICh4MSAqIHkyIC0geTEgKiB4MikgKiAoeDMgLSB4NCkgLSAoeDEgLSB4MikgKiAoeDMgKiB5NCAtIHkzICogeDQpO1xuICAgICAgICBsZXQgeU51bWVyYXRvciA9ICh4MSAqIHkyIC0geTEgKiB4MikgKiAoeTMgLSB5NCkgLSAoeTEgLSB5MikgKiAoeDMgKiB5NCAtIHkzICogeDQpO1xuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcihbeE51bWVyYXRvciAvIGRlbm9taW5hdG9yLCB5TnVtZXJhdG9yIC8gZGVub21pbmF0b3JdKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBWZWN0b3IgfSBmcm9tICd2ZWN0b3Jpb3VzJztcbmltcG9ydCB7IERFRkFVTFRTLCBSZW5kZXJlciB9IGZyb20gJy4vUmVuZGVyZXInO1xuXG4vKipcbiAqIFRoZSBiYXNlIGNsYXNzIG9mIHRoaW5ncyB0aGF0IG1heSBiZSBkcmF3biBvbiB0aGUgY2FudmFzLlxuICogQWxsIGRyYXdhYmxlIG9iamVjdHMgc2hvdWxkIGluaGVyaXQgZnJvbSB0aGlzIGNsYXNzLlxuICogVHlwaWNhbGx5LCBpdCBpcyB1bm5lY2Vzc2FyeSBmb3IgYXBwbGljYXRpb24gcHJvZ3JhbW1lcnMgdG9cbiAqIGNhbGwgdGhpcyBkaXJlY3RseSwgYWx0aG91Z2ggdGhleSBtYXkgd2lzaCB0byBleHRlbmQgdGhlaXIgb3duXG4gKiBjbGFzc2VzIHdpdGggaXQuXG4gKi9cbmV4cG9ydCBjbGFzcyBQcmltaXRpdmVDb21wb25lbnQge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zXG4gICAgICovXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuXG4gICAgICAgIG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXG4gICAgICAgIHRoaXMuX2ZsYWdzID0ge307XG4gICAgICAgIHRoaXMuX2ZsYWdzLkRFQlVHID0gb3B0aW9ucy5kZWJ1ZyB8fCBmYWxzZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogZG9lcyB0aGUgb2JqZWN0IG5lZWQgdG8gYmUgcmVkcmF3bj9cbiAgICAgICAgICogQHR5cGUge2Jvb2xlYW59IF9uZWVkc0RyYXdcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX25lZWRzRHJhdyA9IHRydWU7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGRvZXMgdGhlIG9iamVjdCBuZWVkIHRvIGJlIHJlbmRlcmVkP1xuICAgICAgICAgKiBAdHlwZSB7Ym9vbGVhbn0gX25lZWRzUmVuZGVyXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9uZWVkc1JlbmRlciA9IHRydWU7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIHRoZSBob3Jpem9udGFsIHNjYWxlIG9mIHRoZSBvYmplY3QuIGRlZmF1bHRzIHRvIDFcbiAgICAgICAgICogQHR5cGUge251bWJlcn0gX3NjYWxlV2lkdGhcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX3NjYWxlV2lkdGggPSAxO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiB0aGUgdmVydGljYWwgc2NhbGUgb2YgdGhlIG9iamVjdC4gZGVmYXVsdHMgdG8gMVxuICAgICAgICAgKiBAdHlwZSB7bnVtYmVyfSBfc2NhbGVIZWlnaHRcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX3NjYWxlSGVpZ2h0ID0gMTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogZCBpcyBmb3IgXCJkaXNwbGFjZW1lbnRcIjogYSAyRCBWZWN0b3Igb2JqZWN0IHJlcHJlc2VudGluZyBjYXJ0ZXNpYW4gY29vcmRpbmF0ZVxuICAgICAgICAgKiBwb3NpdGlvbiByZWxhdGl2ZSB0byBpdHMgcGFyZW50IGNvbXBvc2l0aW9uIChvciBbMCwwXSBpZiB0aGlzIGlzIHRoZSBzY2VuZSBjb21wb3NpdGlvbilcbiAgICAgICAgICogQHR5cGUge29iamVjdH0gZFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fZCA9IG5ldyBWZWN0b3IoW29wdGlvbnMueCB8fCAwLCBvcHRpb25zLnkgfHwgMF0pO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBzdHlsZSBvcHRpb25zIGZvciB0aGlzIHBhcnRpY3VsYXIgb2JqZWN0LiB0aGVzZSBhcmUgc3RhbmRhcmQgY29udGV4dCBzdHlsZXNcbiAgICAgICAgICogQHR5cGUge29iamVjdH0gc3R5bGVcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuc3R5bGUgPSBPYmplY3QuYXNzaWduKHt9LCBERUZBVUxUUywgb3B0aW9ucy5zdHlsZSk7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIG9iamVjdHMgd2l0aCBwcmVzc1Bhc3NUaHJvdWdoIHNldCB0byB0cnVlIHdpbGwgYWxsb3cgbW91c2UgY2xpY2tzIHRvIHBhc3NcbiAgICAgICAgICogdGhyb3VnaCB0byBvYmplY3RzIGJlaGluZCB0aGVtXG4gICAgICAgICAqIEB0eXBlIHtib29sZWFufSBwcmVzc1Bhc3NUaHJvdWdoXG4gICAgICAgICAqL1xuICAgICAgICAvL3RoaXMucHJlc3NQYXNzVGhyb3VnaCA9IG9wdGlvbnMucHJlc3NQYXNzVGhyb3VnaCB8fCBmYWxzZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogaWYgdHJ1ZSwgdGhlIG9iamVjdCBjYW4gYmUgZHJhZ2dlZCBhcm91bmQgdGhlIGNhbnZhc1xuICAgICAgICAgKiBAdHlwZSB7Ym9vbGVhbn0gZHJhZ2dhYmxlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmRyYWdnYWJsZSA9IG9wdGlvbnMuZHJhZ2dhYmxlIHx8IGZhbHNlO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBpZiB0cnVlLCB0aGUgYm91bmRpbmcgYm94IG9mIHRoZSBvYmplY3Qgd2lsbCBiZSBkcmF3XG4gICAgICAgICAqIEB0eXBlIHtib29sZWFufSBkcmF3Qm91bmRpbmdCb3hcbiAgICAgICAgICovXG4gICAgICAgIC8vdGhpcy5kcmF3Qm91bmRpbmdCb3ggPSBmYWxzZTtcbiAgICAgICAgLy90aGlzLmJvdW5kaW5nQm94Q29sb3IgPSAnI2NjY2NjYyc7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIHRoZSBwcmVyZW5kZXJpbmcgY2FudmFzIGlzIHVzZWQgdG8gYXZvaWQgcGVyZm9ybWluZyBtdXRsaXBsZSBkcmF3IG9wZXJhdGlvbnMgb24gdGhlXG4gICAgICAgICAqIHZpc2libGUsIG1haW4gY2FudmFzLiB0aGlzIG1pbmltaXplcyB0aGUgdGltZSBuZWVkZWQgdG8gcmVuZGVyIGJ5IHByZXJlbmRlcmluZyBvbiBhXG4gICAgICAgICAqIGNhbnZhcyBvbmx5IGFzIGxhcmdlIGFzIG5lY2Vzc2FyeSBmb3IgdGhlIG9iamVjdFxuICAgICAgICAgKiBAdHlwZSB7b2JqZWN0fSBfcHJlcmVuZGVyaW5nQ2FudmFzXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLl9wcmVyZW5kZXJpbmdDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogdGhlIDJEIGNvbnRleHQgb2YgdGhlIHByZXJlbmRlcmluZyBjYW52YXMuXG4gICAgICAgICAqIEB0eXBlIHtvYmplY3R9IF9wcmVyZW5kZXJpbmdDYW52YXNcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuX3ByZXJlbmRlcmluZ0NvbnRleHQgPSB0aGlzLl9wcmVyZW5kZXJpbmdDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogdGhlIHBhcmVudCBvYmplY3Qgb2YgdGhpcyBvYmplY3QuIHdpdGggdGhlIGV4Y2VwdGlvbiBvZiB0aGUgc2NlbmUgY29tcG9zaXRpb24gaXRzZWxmLFxuICAgICAgICAgKiB0aGUgcm9vdCBvZiBhbGwgb2JqZWN0cyBhbmNlc3RyeSBzaG91bGQgYmUgdGhlIHNjZW5lIGNvbXBvc2l0aW9uXG4gICAgICAgICAqIEB0eXBlIHtvYmplY3R9IHBhcmVudFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5fcGFyZW50ID0gb3B0aW9ucy5wYXJlbnQgfHwgbnVsbDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogYSBjYWxsYmFjayBmb3IgdGhlIG1vdXNlZG93biBldmVudC5cbiAgICAgICAgICogQHR5cGUge2Z1bmN0aW9ufSBvbm1vdXNlZG93blxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5vbm1vdXNlZG93biA9IG51bGw7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGEgY2FsbGJhY2sgZm9yIHRoZSBtb3VzZXVwIGV2ZW50LlxuICAgICAgICAgKiBAdHlwZSB7ZnVuY3Rpb259IG9ubW91c2V1cFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5vbm1vdXNldXAgPSBudWxsO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBhIGNhbGxiYWNrIGZvciB0aGUgbW91c2Vtb3ZlIGV2ZW50LlxuICAgICAgICAgKiBAdHlwZSB7ZnVuY3Rpb259IG9ubW91c2Vtb3ZlXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLm9ubW91c2Vtb3ZlID0gbnVsbDtcblxuICAgICAgICAvKipcbiAgICAgICAgICogYSBjYWxsYmFjayBmb3IgdGhlIG1vdXNlb3V0IGV2ZW50LlxuICAgICAgICAgKiBAdHlwZSB7ZnVuY3Rpb259IG9ubW91c2VvdXRcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMub25tb3VzZW91dCA9IG51bGw7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIGEgY2FsbGJhY2sgZm9yIHRoZSBjbGljayBldmVudC5cbiAgICAgICAgICogQHR5cGUge2Z1bmN0aW9ufSBvbmNsaWNrXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLm9uY2xpY2sgPSBudWxsO1xuXG5cbiAgICAgICAgaWYgKHRoaXMuZHJhZ2dhYmxlKSB7XG4gICAgICAgICAgICB0aGlzLmVuYWJsZURyYWdnaW5nKCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiB0aGUgZ2xvYmFsIG9mZnNldCBvZiB0aGUgb2JqZWN0IG9uIHRoZSBjYW52YXMuXG4gICAgICogdGhpcyBpcyB0aGUgc3VtIG9mIHRoaXMgb2JqZWN0J3MgZGlzcGxhY2VtZW50XG4gICAgICogYW5kIGFsbCBvZiBpdHMgYW5jZXN0cnkuXG4gICAgICogQHR5cGUge29iamVjdH0gb2Zmc2V0IGEgMkQgVmVjdG9yIHJlcHJlc2VudGluZyBkaXNwbGFjZW1lbnQgZnJvbSBbMCwgMF1cbiAgICAgKi9cbiAgICBnZXQgb2Zmc2V0KCkge1xuICAgICAgICByZXR1cm4gKHRoaXMucGFyZW50ID8gVmVjdG9yLmFkZCh0aGlzLmQsIHRoaXMucGFyZW50Lm9mZnNldCkgOiB0aGlzLmQpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJldHVybnMgdHJ1ZSB3aGVuZXZlciB0aGUgb2JqZWN0IG5lZWRzIHRvIGJlIHJlLWRyYXduIHRvIGNhbnZhcy5cbiAgICAgKiB3aGVuIHRydWUsIHRoaXMgd2lsbCBpbmRpY2F0ZSB0byB0aGUgcGFyZW50IHRyZWUgb2YgY29tcG9zaW5nIG9iamVjdHMgdGhhdFxuICAgICAqIHRoZSBvYmplY3QgbmVlZHMgdG8gYmUgcmUtZHJhd24gb24gdGhlIG5leHQgYW5pbWF0aW9uIGxvb3AuXG4gICAgICpcbiAgICAgKiBvYmplY3RzIG5lZWQgdG8gYmUgdXBkYXRlZCB3aGVuIHRoZWlyIGRpc3BsYWNlbWVudCBjaGFuZ2VzLCBvciB3aGVuIGFueSB0aGluZ1xuICAgICAqIHRoYXQgcmVxdWlyZXMgYSByZXJlbmRlciBvY2N1cnMuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn0gbmVlZHNEcmF3XG4gICAgICovXG4gICAgZ2V0IG5lZWRzRHJhdygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX25lZWRzRHJhdztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzZXQgdG8gdHJ1ZSB3aGVuZXZlciB0aGUgb2JqZWN0IG5lZWRzIHRvIGJlIHJlLWRyYXduIHRvIGNhbnZhcy5cbiAgICAgKiB3aGVuIHRydWUsIHRoaXMgd2lsbCBpbmRpY2F0ZSB0byB0aGUgcGFyZW50IHRyZWUgb2YgY29tcG9zaW5nIG9iamVjdHMgdGhhdFxuICAgICAqIHRoZSBvYmplY3QgbmVlZHMgdG8gYmUgcmUtZHJhd24gb24gdGhlIG5leHQgYW5pbWF0aW9uIGxvb3AuXG4gICAgICpcbiAgICAgKiBvYmplY3RzIG5lZWQgdG8gYmUgdXBkYXRlZCB3aGVuIHRoZWlyIGRpc3BsYWNlbWVudCBjaGFuZ2VzLCBvciB3aGVuIGFueSB0aGluZ1xuICAgICAqIHRoYXQgcmVxdWlyZXMgYSByZXJlbmRlciBvY2N1cnMuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn0gbmVlZHNEcmF3XG4gICAgICovXG4gICAgc2V0IG5lZWRzRHJhdyh2YWwpIHtcbiAgICAgICAgaWYgKHRoaXMucGFyZW50ICYmIHZhbCkge1xuICAgICAgICAgICAgdGhpcy5wYXJlbnQubmVlZHNEcmF3ID0gdmFsO1xuICAgICAgICAgICAgdGhpcy5wYXJlbnQubmVlZHNSZW5kZXIgPSB0cnVlOyAvLyBpZiB0aGlzIG5lZWRzIHRvIGJlIHJlZHJhd24sIHRoZW4gdGhlIHBhcmVudCBuZWVkcyBhIGZ1bGwgcmVyZW5kZXJcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9uZWVkc0RyYXcgPSB2YWw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJucyB0cnVlIHdoZW5ldmVyIHRoZSBvYmplY3QncyBwcm9wZXJ0aWVzIGhhdmUgY2hhbmdlZCBzdWNoIHRoYXRcbiAgICAgKiBpdCBuZWVkcyB0byBiZSByZW5kZXJlZCBkaWZmZXJlbnRseVxuICAgICAqXG4gICAgICogMS4gc2NhbGUgY2hhbmdlXG4gICAgICogMS4gcGh5c2ljYWwgcHJvcGVydHkgY2hhbmdlIChoZWlnaHQsIHdpZHRoLCByYWRpdXMsIGV0Yy4pXG4gICAgICogMS4gY29sb3IgY2hhbmdlXG4gICAgICpcbiAgICAgKiBAdHlwZSB7Ym9vbGVhbn0gbmVlZHNSZW5kZXJcbiAgICAgKi9cbiAgICBnZXQgbmVlZHNSZW5kZXIoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9uZWVkc1JlbmRlcjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzZXQgdG8gdHJ1ZSB3aGVuZXZlciB0aGUgb2JqZWN0J3MgcHJvcGVydGllcyBoYXZlIGNoYW5nZWQgc3VjaCB0aGF0XG4gICAgICogaXQgbmVlZHMgdG8gYmUgcmVuZGVyZWQgZGlmZmVyZW50bHlcbiAgICAgKlxuICAgICAqIDEuIHNjYWxlIGNoYW5nZVxuICAgICAqIDEuIHBoeXNpY2FsIHByb3BlcnR5IGNoYW5nZSAoaGVpZ2h0LCB3aWR0aCwgcmFkaXVzLCBldGMuKVxuICAgICAqIDEuIGNvbG9yIGNoYW5nZVxuICAgICAqXG4gICAgICogQHR5cGUge2Jvb2xlYW59IG5lZWRzUmVuZGVyXG4gICAgICovXG4gICAgc2V0IG5lZWRzUmVuZGVyKHZhbCkge1xuICAgICAgICBpZiAodGhpcy5wYXJlbnQgJiYgdmFsKSB7XG4gICAgICAgICAgICB0aGlzLnBhcmVudC5uZWVkc1JlbmRlciA9IHZhbDtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLl9uZWVkc1JlbmRlciA9IHZhbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm4gdGhlIGhvcml6b250YWwgc2NhbGUgb2YgdGhlIG9iamVjdCAtIGRlZmF1bHRzIHRvIDFcbiAgICAgKiBAdHlwZSB7bnVtYmVyfSBzY2FsZVdpZHRoXG4gICAgICovXG4gICAgZ2V0IHNjYWxlV2lkdGgoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zY2FsZVdpZHRoO1xuICAgIH1cbiAgICAvKipcbiAgICAgKiBzZXQgdGhlIGhvcml6b250YWwgc2NhbGUgb2YgdGhlIG9iamVjdCAtIGRlZmF1bHRzIHRvIDFcbiAgICAgKiBAdHlwZSB7bnVtYmVyfSBzY2FsZVdpZHRoXG4gICAgICovXG4gICAgc2V0IHNjYWxlV2lkdGgodmFsKSB7XG4gICAgICAgIHRoaXMuX3NjYWxlV2lkdGggPSB2YWw7XG4gICAgICAgIHRoaXMubmVlZHNSZW5kZXIgPSB0cnVlO1xuICAgICAgICB0aGlzLm5lZWRzRHJhdyA9IHRydWU7XG4gICAgICAgIGZvciAobGV0IGMgb2YgdGhpcy5jaGlsZHJlbikge1xuICAgICAgICAgICAgYy5uZWVkc1JlbmRlciA9IHRydWU7XG4gICAgICAgICAgICBjLm5lZWRzRHJhdyA9IHRydWU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm4gdGhlIHZlcnRpY2FsIHNjYWxlIG9mIHRoZSBvYmplY3QgLSBkZWZhdWx0cyB0byAxXG4gICAgICogQHR5cGUge251bWJlcn0gc2NhbGVIZWlnaHRcbiAgICAgKi9cbiAgICBnZXQgc2NhbGVIZWlnaHQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zY2FsZUhlaWdodDtcbiAgICB9XG4gICAgLyoqXG4gICAgICogc2V0IHRoZSB2ZXJ0aWNhbCBzY2FsZSBvZiB0aGUgb2JqZWN0IC0gZGVmYXVsdHMgdG8gMVxuICAgICAqIEB0eXBlIHtudW1iZXJ9IHNjYWxlSGVpZ2h0XG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHZhbCB0aGUgdmVydGljYWwgc2NhbGVcbiAgICAgKi9cbiAgICBzZXQgc2NhbGVIZWlnaHQodmFsKSB7XG4gICAgICAgIHRoaXMuX3NjYWxlSGVpZ2h0ID0gdmFsO1xuICAgICAgICB0aGlzLm5lZWRzUmVuZGVyID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5uZWVkc0RyYXcgPSB0cnVlO1xuICAgICAgICBmb3IgKGxldCBjIG9mIHRoaXMuY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIGMubmVlZHNSZW5kZXIgPSB0cnVlO1xuICAgICAgICAgICAgYy5uZWVkc0RyYXcgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogcmV0dXJuIGFuIG9iamVjdCBjb250YWluaW5nIHRoZSB2ZXJ0aWNhbCBhbmQgaG9yaXpvbnRhbCBzY2FsZVxuICAgICAqIEB0eXBlIHtvYmplY3R9IHNjYWxlXG4gICAgICovXG4gICAgZ2V0IHNjYWxlKCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc2NhbGVXaWR0aDogdGhpcy5zY2FsZVdpZHRoLFxuICAgICAgICAgICAgc2NhbGVIZWlnaHQ6IHRoaXMuc2NhbGVIZWlnaHRcbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBzZXQgdGhlIHNjYWxlIHdpZHRoIGFuZCBoZWlnaHQgaW4gb25lIGdvXG4gICAgICogQHR5cGUge251bWJlcn0gc2NhbGVcbiAgICAgKi9cbiAgICBzZXQgc2NhbGUodmFsKSB7XG4gICAgICAgIHRoaXMuc2NhbGVIZWlnaHQgPSB2YWw7XG4gICAgICAgIHRoaXMuc2NhbGVXaWR0aCA9IHZhbDtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiByZXR1cm4gdGhlIHNjYWxlIG9mIHRoZSBvYmplY3QsIGNvbXBvdW5kZWQgd2l0aCB0aGUgcGFyZW50IG9iamVjdCdzIHNjYWxlXG4gICAgICogQHR5cGUge3tzY2FsZVdpZHRoOiBudW1iZXIsIHNjYWxlSGVpZ2h0OiBudW1iZXJ9fSBjb21wb3VuZFNjYWxlIHRoZSBzY2FsZSBtdWx0aXBsaWVkIGJ5IHRoZSBjb21wb3VuZCBzY2FsZSBvZiBpdHMgcGFyZW50IG9yIDFcbiAgICAgKi9cbiAgICBnZXQgY29tcG91bmRTY2FsZSgpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHNjYWxlV2lkdGg6IHRoaXMucGFyZW50ID8gdGhpcy5zY2FsZVdpZHRoICogdGhpcy5wYXJlbnQuY29tcG91bmRTY2FsZS5zY2FsZVdpZHRoIDogdGhpcy5zY2FsZVdpZHRoLFxuICAgICAgICAgICAgc2NhbGVIZWlnaHQ6IHRoaXMucGFyZW50ID8gdGhpcy5zY2FsZUhlaWdodCAqIHRoaXMucGFyZW50LmNvbXBvdW5kU2NhbGUuc2NhbGVIZWlnaHQgOiB0aGlzLnNjYWxlSGVpZ2h0XG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZCBpcyBmb3IgZGlzcGxhY2VtZW50IC0gcmV0dXJucyBhIHZlY3RvclxuICAgICAqIEB0eXBlIHtvYmplY3R9IGRcbiAgICAgKi9cbiAgICBnZXQgZCgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2Q7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZCBpcyBmb3IgZGlzcGxhY2VtZW50IC0gYWNjZXB0cyBhIHZlY3RvclxuICAgICAqIEB0eXBlIHtvYmplY3R9IGRcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gdmFsIGEgdmVjdG9yXG4gICAgICovXG4gICAgc2V0IGQodmFsKSB7XG4gICAgICAgIHRoaXMuX2QgPSB2YWw7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZ2V0IHRoZSBwYXJlbnQgb2YgdGhlIG9iamVjdC4gYWxsIG9iamVjdHMgZXhjZXB0IHRoZSBzY2VuZSBncmFwaCBzaG91bGQgaGF2ZSBhIHBhcmVudFxuICAgICAqIEB0eXBlIHtvYmplY3R9IHBhcmVudFxuICAgICAqL1xuICAgIGdldCBwYXJlbnQoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9wYXJlbnQ7XG4gICAgfVxuICAgIC8vVE9ETzogcHJvdmlkZSBsaW5rcyB0byB0aGluZ3NcbiAgICAvKipcbiAgICAgKiBzZXQgdGhlIHBhcmVudCBvZiB0aGUgb2JqZWN0LiBhbGwgb2JqZWN0cyBleGNlcHQgdGhlIHNjZW5lIGdyYXBoIHNob3VsZCBoYXZlIGEgcGFyZW50XG4gICAgICogQHR5cGUge29iamVjdH0gcGFyZW50XG4gICAgICogQHBhcmFtIHtvYmplY3R9IHZhbCBhIGNvbXBvc2l0aW9uXG4gICAgICovXG4gICAgc2V0IHBhcmVudCh2YWwpIHtcbiAgICAgICAgdGhpcy5fcGFyZW50ID0gdmFsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGVuYWJsZSBkcmFnZ2luZyBieSBzZXR0aW5nIHRoZSBvbm1vdXNlZG93biBldmVudCBjYWxsYmFja1xuICAgICAqL1xuICAgIGVuYWJsZURyYWdnaW5nKCkge1xuICAgICAgICAvL1RPRE86IHNob3VsZCBwcm9iYWJseSBiZSB1c2luZyBhbiBldmVudCByZWdpc3RyeSBzb1xuICAgICAgICAvL211bHRpcGxlIGV2ZW50IGNhbGxiYWNrcyBjYW4gYmUgcmVnaXN0ZXJlZFxuICAgICAgICB0aGlzLm9ubW91c2Vkb3duID0gdGhpcy5kcmFnU3RhcnQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZGlzYWJsZSBkcmFnZ2luZyBieSByZW1vdmluZyBldmVudCBjYWxsYmFja3NcbiAgICAgKi9cbiAgICBkaXNhYmxlRHJhZ2dpbmcoKSB7XG4gICAgICAgIC8vVE9ETzogc2hvdWxkIHByb2JhYmx5IGJlIHVzaW5nIGFuIGV2ZW50IHJlZ2lzdHJ5IHNvXG4gICAgICAgIC8vbXVsdGlwbGUgZXZlbnQgY2FsbGJhY2tzIGNhbiBiZSByZWdpc3RlcmVkXG4gICAgICAgIHRoaXMub25tb3VzZWRvd24gPSBudWxsO1xuICAgICAgICB0aGlzLm9ubW91c2Vtb3ZlID0gbnVsbDtcbiAgICAgICAgdGhpcy5vbm1vdXNldXAgPSBudWxsO1xuICAgICAgICB0aGlzLm9ubW91c2VvdXQgPSBudWxsO1xuICAgICAgICB0aGlzLm5lZWRzRHJhdyA9IHRydWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogd2hlbiBkcmFnZ2luZyBzdGFydHMsIHVwZGF0ZSBldmVudHNcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZSB0aGUgZXZlbnQgb2JqZWN0XG4gICAgICovXG4gICAgZHJhZ1N0YXJ0KGUpIHtcbiAgICAgICAgLy9UT0RPOiBzaG91bGQgcHJvYmFibHkgYmUgdXNpbmcgYW4gZXZlbnQgcmVnaXN0cnkgc29cbiAgICAgICAgLy9tdWx0aXBsZSBldmVudCBjYWxsYmFja3MgY2FuIGJlIHJlZ2lzdGVyZWRcbiAgICAgICAgdGhpcy5fbW91c2VPZmZzZXQgPSBuZXcgVmVjdG9yKFtlLm9mZnNldFgsIGUub2Zmc2V0WV0pLnN1YnRyYWN0KHRoaXMub2Zmc2V0KTtcbiAgICAgICAgdGhpcy5vbm1vdXNlZG93biA9IG51bGw7XG4gICAgICAgIHRoaXMub25tb3VzZW1vdmUgPSB0aGlzLmRyYWc7XG4gICAgICAgIHRoaXMub25tb3VzZXVwID0gdGhpcy5kcmFnRW5kO1xuICAgICAgICB0aGlzLm9ubW91c2VvdXQgPSB0aGlzLmRyYWdFbmQ7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogdXBkYXRlIGQgYXMgdGhlIG9iamVjdCBpcyBtb3ZlZCBhcm91bmRcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gZSB0aGUgZXZlbnQgb2JqZWN0XG4gICAgICovXG4gICAgZHJhZyhlKSB7XG4gICAgICAgIHRoaXMuZCA9IG5ldyBWZWN0b3IoW2Uub2Zmc2V0WCwgZS5vZmZzZXRZXSkuc3VidHJhY3QodGhpcy5fbW91c2VPZmZzZXQpO1xuICAgICAgICB0aGlzLm5lZWRzRHJhdyA9IHRydWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogd2hlbiBkcmFnZ2luZyBlbmRzLCB1cGRhdGUgZXZlbnRzXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGUgdGhlIGV2ZW50IG9iamVjdFxuICAgICAqL1xuICAgIGRyYWdFbmQoZSkge1xuICAgICAgICB0aGlzLm9ubW91c2Vkb3duID0gdGhpcy5kcmFnU3RhcnQ7XG4gICAgICAgIHRoaXMub25tb3VzZW1vdmUgPSBudWxsO1xuICAgICAgICB0aGlzLm9ubW91c2V1cCA9IG51bGw7XG4gICAgICAgIHRoaXMub25tb3VzZW91dCA9IG51bGw7XG4gICAgICAgIHRoaXMubmVlZHNEcmF3ID0gdHJ1ZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBkcmF3IHRoZSBvYmplY3QgdG8gY2FudmFzLCByZW5kZXIgaXQgaWYgbmVjZXNzYXJ5XG4gICAgICogQHBhcmFtIHtvYmplY3R9IGNvbnRleHQgdGhlIGZpbmFsIGNhbnZhcyBjb250ZXh0IHdoZXJlIHRoaXMgd2lsbCBiZSBkcmF3blxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvZmZzZXQgdGhlIG9mZnNldCBvbiB0aGUgY2FudmFzIC0gb3B0aW9uYWwsIHVzZWQgZm9yIHByZXJlbmRlcmluZ1xuICAgICAqL1xuICAgIGRyYXcoY29udGV4dCwgb2Zmc2V0KSB7XG4gICAgICAgIGxldCBib3VuZGluZ0JveCA9IHRoaXMuYm91bmRpbmdCb3g7XG5cbiAgICAgICAgdGhpcy5uZWVkc0RyYXcgPSBmYWxzZTtcblxuICAgICAgICBpZiAodGhpcy5uZWVkc1JlbmRlciAmJiB0aGlzLnJlbmRlcikge1xuICAgICAgICAgICAgLy9kaXRjaCBhbnkgb2xkIHJlbmRlcmluZyBhcnRpZmFjdHMgLSB0aGV5IGFyZSBubyBsb25nZXIgdmlhYmxlXG4gICAgICAgICAgICBkZWxldGUgdGhpcy5fcHJlcmVuZGVyaW5nQ2FudmFzO1xuICAgICAgICAgICAgZGVsZXRlIHRoaXMuX3ByZXJlbmRlcmluZ0NvbnRleHQ7XG5cbiAgICAgICAgICAgIC8vY3JlYXRlIGEgbmV3IGNhbnZhcyBhbmQgY29udGV4dCBmb3IgcmVuZGVyaW5nXG4gICAgICAgICAgICB0aGlzLl9wcmVyZW5kZXJpbmdDYW52YXMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdjYW52YXMnKTtcbiAgICAgICAgICAgIHRoaXMuX3ByZXJlbmRlcmluZ0NvbnRleHQgPSB0aGlzLl9wcmVyZW5kZXJpbmdDYW52YXMuZ2V0Q29udGV4dCgnMmQnKTsgLy90ZXh0IG5lZWRzIHByZXJlbmRlcmluZyBjb250ZXh0IGRlZmluZWQgZm9yIGJvdW5kaW5nQm94IG1lYXN1cmVtZW50c1xuXG4gICAgICAgICAgICAvL21ha2Ugc3VyZSB0aGUgbmV3IGNhbnZhcyBoYXMgdGhlIGFwcHJvcHJpYXRlIGRpbWVuc2lvbnNcbiAgICAgICAgICAgIHRoaXMuX3ByZXJlbmRlcmluZ0NhbnZhcy53aWR0aCA9IGJvdW5kaW5nQm94LnJpZ2h0IC0gYm91bmRpbmdCb3gubGVmdDtcbiAgICAgICAgICAgIHRoaXMuX3ByZXJlbmRlcmluZ0NhbnZhcy5oZWlnaHQgPSBib3VuZGluZ0JveC5ib3R0b20gLSBib3VuZGluZ0JveC50b3A7XG5cbiAgICAgICAgICAgIHRoaXMucmVuZGVyKCk7XG4gICAgICAgICAgICB0aGlzLm5lZWRzUmVuZGVyID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICAvL1RPRE86IGhhbmRsZSBkZWJ1ZyBvcHRpb25zXG4gICAgICAgIC8vZHJhdyBib3VuZGluZyBib3hlc1xuICAgICAgICBpZiAodGhpcy5fZmxhZ3MuREVCVUcpIHtcbiAgICAgICAgXHR0aGlzLl9wcmVyZW5kZXJpbmdDb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICAgICAgdGhpcy5fcHJlcmVuZGVyaW5nQ29udGV4dC5zZXRMaW5lRGFzaChbNSwgMTVdKTtcbiAgICAgICAgXHR0aGlzLl9wcmVyZW5kZXJpbmdDb250ZXh0LmxpbmVXaWR0aD0yLjA7XG4gICAgICAgICAgICB0aGlzLl9wcmVyZW5kZXJpbmdDb250ZXh0LnN0cm9rZVN0eWxlPScjRkYwMDAwJztcbiAgICAgICAgXHR0aGlzLl9wcmVyZW5kZXJpbmdDb250ZXh0LnN0cm9rZVN0eWxlPScjRkYwMDAwJztcbiAgICAgICAgXHR0aGlzLl9wcmVyZW5kZXJpbmdDb250ZXh0LnN0cm9rZVJlY3QoMCwwLHRoaXMuX3ByZXJlbmRlcmluZ0NhbnZhcy53aWR0aCwgdGhpcy5fcHJlcmVuZGVyaW5nQ2FudmFzLmhlaWdodCk7XG4gICAgICAgIFx0dGhpcy5fcHJlcmVuZGVyaW5nQ29udGV4dC5jbG9zZVBhdGgoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vVE9ETzogaGFuZGxlIGJvdW5kaW5nIGJveCBkcmF3aW5nXG4gICAgICAgIC8qaWYgKHRoaXMuZHJhd0JvdW5kaW5nQm94KXtcbiAgICAgICAgXHR0aGlzLl9wcmVyZW5kZXJpbmdDb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICBcdHRoaXMuX3ByZXJlbmRlcmluZ0NvbnRleHQubGluZVdpZHRoPTIuMDtcbiAgICAgICAgXHR0aGlzLl9wcmVyZW5kZXJpbmdDb250ZXh0LnN0cm9rZVN0eWxlPXRoaXMuYm91bmRpbmdCb3hDb2xvcjtcbiAgICAgICAgXHR0aGlzLl9wcmVyZW5kZXJpbmdDb250ZXh0LnN0cm9rZVJlY3QoMCwwLHRoaXMuX3ByZXJlbmRlcmluZ0NhbnZhcy53aWR0aCwgdGhpcy5fcHJlcmVuZGVyaW5nQ2FudmFzLmhlaWdodCk7XG4gICAgICAgIFx0dGhpcy5fcHJlcmVuZGVyaW5nQ29udGV4dC5jbG9zZVBhdGgoKTtcbiAgICAgICAgfSovXG5cbiAgICAgICAgLy9vZmZzZXRzIGFyZSBmb3IgcHJlcmVuZGVyaW5nIGNvbnRleHRzIG9mIGNvbXBvc2l0aW9uc1xuICAgICAgICBsZXQgeCA9IGJvdW5kaW5nQm94LmxlZnQgKyAob2Zmc2V0ICYmIG9mZnNldC5sZWZ0ID8gb2Zmc2V0LmxlZnQgOiAwKTtcbiAgICAgICAgbGV0IHkgPSBib3VuZGluZ0JveC50b3AgKyAob2Zmc2V0ICYmIG9mZnNldC50b3AgPyBvZmZzZXQudG9wIDogMCk7XG4gICAgICAgIFJlbmRlcmVyLmRyYXdJbWFnZSh4LCB5LCB0aGlzLl9wcmVyZW5kZXJpbmdDYW52YXMsIGNvbnRleHQsIHRoaXMuc3R5bGUpO1xuICAgIH1cblxuICAgIC8vVE9ETzogcHJvdmlkZSBtb3JlIGRvYyBkZXRhaWxzIGFyb3VuZCB0aGlzXG4gICAgLyoqXG4gICAgICogdGhpcyBtZXRob2QgbXVzdCBiZSBvdmVycmlkZGVuIGJ5IGEgc3ViY2xhc3MuXG4gICAgICpcbiAgICAgKiB0aGUgcmVuZGVyIG1ldGhvZCBzaG91bGQgYmUgaW1wbGVtZW50ZWQgYnkgc3ViY2xhc3Nlc1xuICAgICAqIEBhYnN0cmFjdFxuICAgICAqL1xuICAgIHJlbmRlcigpIHt9XG5cbiAgICAvKipcbiAgICAgKiBjaGVjayB3aGV0aGVyIHRoZSBwb2ludCBzcGVjaWZpZWQgbGllcyAqaW5zaWRlKiB0aGlzIG9iamVjdHMgYm91bmRpbmcgYm94XG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCB0aGUgeCBjb29yZGluYXRlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgdGhlIHkgY29vcmRpbmF0ZVxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHdoZXRoZXIgdGhlIHBvaW50IGlzIHdpdGhpbiB0aGUgYm91bmRpbmcgYm94XG4gICAgICovXG4gICAgcG9pbnRJc0luQm91bmRpbmdCb3goeCwgeSkge1xuICAgICAgICBsZXQgYm91bmRpbmdCb3ggPSB0aGlzLmJvdW5kaW5nQm94O1xuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgeCA+IGJvdW5kaW5nQm94LmxlZnQgJiZcbiAgICAgICAgICAgIHkgPiBib3VuZGluZ0JveC50b3AgJiZcbiAgICAgICAgICAgIHggPCBib3VuZGluZ0JveC5yaWdodCAmJlxuICAgICAgICAgICAgeSA8IGJvdW5kaW5nQm94LmJvdHRvbVxuICAgICAgICApO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGNoZWNrIHdoZXRoZXIgdGhlIHBvaW50IGlzIHdpdGhpbiB0aGUgb2JqZWN0LlxuICAgICAqIHRoaXMgbWV0aG9kIHNob3VsZCBiZSBvdmVycmlkZGVuIGJ5IHN1YmNsYXNzZXNzXG4gICAgICpcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCB0aGUgeCBjb29yZGluYXRlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgdGhlIHkgY29vcmRpbmF0ZVxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHdoZXRoZXIgdGhlIHBvaW50IGlzIGluIHRoZSBvYmplY3QsIGFzIGltcGxlbWVudGVkIGJ5IGluaGVyaXRpbmcgY2xhc3Nlc1xuICAgICAqL1xuICAgIHBvaW50SXNJbk9iamVjdCh4LCB5KSB7XG4gICAgICAgIHJldHVybiB0aGlzLnBvaW50SXNJbkJvdW5kaW5nQm94KHgsIHkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIG1vdmUgdGhlIG9iamVjdCBvbiB0b3Agb2Ygb3RoZXIgb2JqZWN0cyAocmVuZGVyIGxhc3QpXG4gICAgICovXG4gICAgbW92ZVRvRnJvbnQoKSB7XG4gICAgICAgIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5wYXJlbnQuY2hpbGRyZW4uaW5kZXhPZih0aGlzKTtcbiAgICAgICAgICAgIGlmIChpbmRleCA+PSAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQuY2hpbGRyZW4uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICB0aGlzLnBhcmVudC5jaGlsZHJlbi5zcGxpY2UodGhpcy5wYXJlbnQuY2hpbGRyZW4ubGVuZ3RoLCAwLCB0aGlzKTtcbiAgICAgICAgICAgICAgICB0aGlzLm5lZWRzRHJhdyA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBtb3ZlIHRoZSBvYmplY3QgYmVsb3cgdGhlIG90aGVyIG9iamVjdHMgKHJlbmRlciBmaXJzdClcbiAgICAgKi9cbiAgICBtb3ZlVG9CYWNrKCkge1xuICAgICAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgICAgICAgIGxldCBpbmRleCA9IHRoaXMucGFyZW50LmNoaWxkcmVuLmluZGV4T2YodGhpcyk7XG4gICAgICAgICAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50LmNoaWxkcmVuLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQuY2hpbGRyZW4uc3BsaWNlKDAsIDAsIHRoaXMpO1xuICAgICAgICAgICAgICAgIHRoaXMubmVlZHNEcmF3ID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogbW92ZSB0aGUgb2JqZWN0IGZvcndhcmQgaW4gdGhlIHN0YWNrIChkcmF3biBsYXRlcilcbiAgICAgKi9cbiAgICBtb3ZlRm9yd2FyZCgpIHtcbiAgICAgICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICAgICAgICBsZXQgaW5kZXggPSB0aGlzLnBhcmVudC5jaGlsZHJlbi5pbmRleE9mKHRoaXMpO1xuICAgICAgICAgICAgaWYgKGluZGV4ID49IDAgJiYgaW5kZXggPCB0aGlzLnBhcmVudC5jaGlsZHJlbi5sZW5ndGggLSAxKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQuY2hpbGRyZW4uc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICAgICAgICB0aGlzLnBhcmVudC5jaGlsZHJlbi5zcGxpY2UoaW5kZXggKyAxLCAwLCB0aGlzKTsgLy9pZiBpbmRleCArIDEgPiBzaWJsaW5ncy5sZW5ndGgsIGluc2VydHMgaXQgYXQgZW5kXG4gICAgICAgICAgICAgICAgdGhpcy5wYXJlbnQuVXBkYXRlQ2hpbGRyZW5MaXN0cygpO1xuICAgICAgICAgICAgICAgIHRoaXMubmVlZHNSZW5kZXIgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMubmVlZHNEcmF3ID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIG1vdmUgdGhlIG9iamVjdCBiYWNrd2FyZCBpbiB0aGUgc3RhY2sgKGRyYXduIHNvb25lcilcbiAgICAgKi9cbiAgICBtb3ZlQmFja3dhcmQoKSB7XG4gICAgICAgIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgICAgICAgbGV0IGluZGV4ID0gdGhpcy5wYXJlbnQuY2hpbGRyZW4uaW5kZXhPZih0aGlzKTtcbiAgICAgICAgICAgIGlmIChpbmRleCA+IDApIHtcbiAgICAgICAgICAgICAgICB0aGlzLnBhcmVudC5jaGlsZHJlbi5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50LmNoaWxkcmVuLnNwbGljZShpbmRleCAtIDEsIDAsIHRoaXMpO1xuICAgICAgICAgICAgICAgIHRoaXMucGFyZW50LlVwZGF0ZUNoaWxkcmVuTGlzdHMoKTtcbiAgICAgICAgICAgICAgICB0aGlzLm5lZWRzUmVuZGVyID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLm5lZWRzRHJhdyA9IHRydWU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBSZW5kZXJlciB9IGZyb20gJy4vUmVuZGVyZXInO1xuaW1wb3J0IHsgUHJpbWl0aXZlQ29tcG9uZW50IH0gZnJvbSAnLi9QcmltaXRpdmVDb21wb25lbnQnO1xuXG4vKipcbiAqIEEgcmVjdGFuZ2xlXG4gKi9cbmV4cG9ydCBjbGFzcyBSZWN0YW5nbGUgZXh0ZW5kcyBQcmltaXRpdmVDb21wb25lbnQge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIHRoZSBvcHRpb25zIGZvciB0aGUgb2JqZWN0XG4gICAgICovXG4gICAgY29uc3RydWN0b3Iob3B0aW9ucykge1xuICAgICAgICBzdXBlcihvcHRpb25zKTtcbiAgICAgICAgLyoqXG4gICAgICAgICAqIHRoZSB3aWR0aCBvZiB0aGUgcmVjdGFuZ2xlXG4gICAgICAgICAqIEB0eXBlIHtudW1iZXJ9IHdpZHRoXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLndpZHRoID0gb3B0aW9ucy53aWR0aCB8fCAwO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiB0aGUgaGVpZ2h0IG9mIHRoZSByZWN0YW5nbGVcbiAgICAgICAgICogQHR5cGUge251bWJlcn0gaGVpZ2h0XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmhlaWdodCA9IG9wdGlvbnMuaGVpZ2h0IHx8IDA7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogZ2V0IHRoZSBib3VuZGluZyBib3ggb2YgdGhlIHJlY3RhbmdsZVxuICAgICAqIEB0eXBlIHt7dG9wOm51bWJlciwgbGVmdDpudW1iZXIsIGJvdHRvbTpudW1iZXIsIHJpZ2h0Om51bWJlcn19IGJvdW5kaW5nQm94XG4gICAgICovXG4gICAgZ2V0IGJvdW5kaW5nQm94KCkge1xuICAgICAgICBsZXQgb2Zmc2V0ID0gdGhpcy5vZmZzZXQ7XG4gICAgICAgIGxldCBjb21wb3VuZFNjYWxlID0gdGhpcy5jb21wb3VuZFNjYWxlO1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdG9wOiBvZmZzZXQueSAtICh0aGlzLnN0eWxlLmxpbmVXaWR0aCksXG4gICAgICAgICAgICBsZWZ0OiBvZmZzZXQueCAtICh0aGlzLnN0eWxlLmxpbmVXaWR0aCksXG4gICAgICAgICAgICBib3R0b206IG9mZnNldC55ICsgKGNvbXBvdW5kU2NhbGUuc2NhbGVIZWlnaHQgKiB0aGlzLmhlaWdodCkgKyAodGhpcy5zdHlsZS5saW5lV2lkdGgpLFxuICAgICAgICAgICAgcmlnaHQ6IG9mZnNldC54ICsgKGNvbXBvdW5kU2NhbGUuc2NhbGVXaWR0aCAqIHRoaXMud2lkdGgpICsgKHRoaXMuc3R5bGUubGluZVdpZHRoKVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIHJlbmRlciB0aGUgcmVjdGFuZ2xlXG4gICAgICogQG92ZXJyaWRlXG4gICAgICovXG4gICAgcmVuZGVyKCkge1xuICAgICAgICBsZXQgY29tcG91bmRTY2FsZSA9IHRoaXMuY29tcG91bmRTY2FsZTtcbiAgICAgICAgUmVuZGVyZXIuZHJhd1JlY3RhbmdsZSgodGhpcy5zdHlsZS5saW5lV2lkdGgpLFxuICAgICAgICAgICAgKHRoaXMuc3R5bGUubGluZVdpZHRoKSxcbiAgICAgICAgICAgIHRoaXMud2lkdGggKiBjb21wb3VuZFNjYWxlLnNjYWxlV2lkdGgsXG4gICAgICAgICAgICB0aGlzLmhlaWdodCAqIGNvbXBvdW5kU2NhbGUuc2NhbGVIZWlnaHQsXG4gICAgICAgICAgICB0aGlzLl9wcmVyZW5kZXJpbmdDb250ZXh0LFxuICAgICAgICAgICAgdGhpcy5zdHlsZSk7XG4gICAgfVxufVxuIiwiLyoqXG4gKiBEZWZhdWx0IHN0eWxlIHZhbHVlcyBmb3IgdGhlIHJlbmRlcmVyXG4gKi9cbmV4cG9ydCBjb25zdCBERUZBVUxUUyA9IHtcbiAgICAvL2RpcmVjdGlvbjogJ2luaGVyaXQnLFxuICAgIGZpbGxTdHlsZTogJ2JsYWNrJyxcbiAgICAvL2ZpbHRlcjogJ25vbmUnLFxuICAgIHN0cm9rZVN0eWxlOiAnYmxhY2snLFxuICAgIGxpbmVDYXA6ICdyb3VuZCcsXG4gICAgbGluZVdpZHRoOiAxLjAsXG4gICAgbGluZUpvaW46ICdyb3VuZCcsXG4gICAgbWl0ZXJMaW1pdDogMTAsXG4gICAgZm9udDogJzEwcHggc2Fucy1zZXJpZicsXG4gICAgdGV4dEFsaWduOiAnc3RhcnQnLFxuICAgIHRleHRCYXNlbGluZTogJ2FscGhhYmV0aWMnXG59XG5cbi8vVE9ETzogbWFza2luZz8gaXQgbG9va3MgbGlrZSB0aGlzIGlzIGRvbmUgaW4gdGhlIENvbXBvc2l0aW9uLCBidXQgdGhhdCBtYXkgYmUgYnVnZ2VkIG91dC5cblxuLyoqXG4gKiBBIGNvbGxlY3Rpb24gb2YgaGlnaCBsZXZlbCBzdGF0aWMgbWV0aG9kcyBmb3IgZHJhd2luZyBkaXJlY3RseSB0byBjYW52YXNcbiAqXG4gKi9cbmV4cG9ydCBjbGFzcyBSZW5kZXJlciB7XG4gICAgLyoqXG4gICAgICogRXJhc2UgZXZlcnl0aGluZyBkcmF3biBvbiB0aGUgc3VwcGxpZWQgcmVjdGFuZ2xlIGZvciB0aGUgZ2l2ZW4gY29udGV4dC5cbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCB0aGUgeCBjb29yZGluYXRlIG9mIHRoZSB0b3AgbGVmdCBjb3JuZXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSB0aGUgeSBjb29yZGluYXRlIG9mIHRoZSB0b3AgbGVmdCBjb3JuZXJcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gd2lkdGggdGhlIHggY29vcmRpbmF0ZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSBoZWlnaHQgdGhlIHkgY29vcmRpbmF0ZVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBjb250ZXh0IHRoZSAyRCBDb250ZXh0IG9iamVjdCBmb3IgdGhlIGNhbnZhcyB3ZSdyZSBkcmF3aW5nIG9udG9cbiAgICAgKi9cbiAgICBzdGF0aWMgY2xlYXJSZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQsIGNvbnRleHQpIHtcbiAgICAgICAgY29udGV4dC5jbGVhclJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRHJhdyBhIHBhdGgsIHVuY2xvc2VkLCB3aXRoIHRoZSBnaXZlbiB2ZXJ0aWNlc1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSB2ZXJ0aWNlcyB0aGUgcGF0aCBvZiB2ZXJ0aWNlcyB0byBiZSBkcmF3blxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBjb250ZXh0IHRoZSAyRCBDb250ZXh0IG9iamVjdCBmb3IgdGhlIGNhbnZhcyB3ZSdyZSBkcmF3aW5nIG9udG9cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gc3R5bGUgdGhlIHN0eWxlIG9wdGlvbnMgdG8gYmUgdXNlZCB3aGVuIGRyYXdpbmcgdGhlIHBhdGhcbiAgICAgKi9cbiAgICBzdGF0aWMgZHJhd1BhdGgodmVydGljZXMsIGNvbnRleHQsIHN0eWxlKSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oY29udGV4dCwgc3R5bGUpO1xuICAgICAgICBjb250ZXh0LmJlZ2luUGF0aCgpO1xuICAgICAgICBjb250ZXh0Lm1vdmVUbyh2ZXJ0aWNlc1swXS54LCB2ZXJ0aWNlc1swXS55KTtcbiAgICAgICAgZm9yIChsZXQgdiA9IDE7IHYgPCB2ZXJ0aWNlcy5sZW5ndGg7IHYrKykge1xuICAgICAgICAgICAgY29udGV4dC5saW5lVG8odmVydGljZXNbdl0ueCwgdmVydGljZXNbdl0ueSk7XG4gICAgICAgIH1cbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEcmF3IGEgY2xvc2VkIHBvbHlnb24gd2l0aCB0aGUgZ2l2ZW4gdmVydGljZXNcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gdmVydGljZXMgdGhlIHBhdGggb2YgdmVydGljZXMgdG8gYmUgZHJhd25cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gY29udGV4dCB0aGUgMkQgQ29udGV4dCBvYmplY3QgZm9yIHRoZSBjYW52YXMgd2UncmUgZHJhd2luZyBvbnRvXG4gICAgICogQHBhcmFtIHtvYmplY3R9IHN0eWxlIHRoZSBzdHlsZSBvcHRpb25zIHRvIGJlIHVzZWQgd2hlbiBkcmF3aW5nIHRoZSBwb2x5Z29uXG4gICAgICovXG4gICAgc3RhdGljIGRyYXdQb2x5Z29uKHZlcnRpY2VzLCBjb250ZXh0LCBzdHlsZSkge1xuICAgICAgICBPYmplY3QuYXNzaWduKGNvbnRleHQsIHN0eWxlKTtcbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgY29udGV4dC5tb3ZlVG8odmVydGljZXNbMF0ueCwgdmVydGljZXNbMF0ueSk7XG4gICAgICAgIGZvciAobGV0IHYgPSAxOyB2IDwgdmVydGljZXMubGVuZ3RoOyB2KyspIHtcbiAgICAgICAgICAgIGNvbnRleHQubGluZVRvKHZlcnRpY2VzW3ZdLngsIHZlcnRpY2VzW3ZdLnkpO1xuICAgICAgICB9XG4gICAgICAgIGNvbnRleHQuY2xvc2VQYXRoKCk7XG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG5cbiAgICB9XG5cbiAgICBzdGF0aWMgZHJhd0JlemllcihzdGFydCwgZW5kLCBjMSwgYzIsIGNvbnRleHQsIHN0eWxlKSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oY29udGV4dCwgc3R5bGUpO1xuICAgICAgICAvL211c3QgYGJlZ2luUGF0aCgpYCBiZWZvcmUgYG1vdmVUb2AgdG8gZ2V0IGNvcnJlY3Qgc3RhcnRpbmcgcG9zaXRpb25cbiAgICAgICAgY29udGV4dC5iZWdpblBhdGgoKTtcbiAgICAgICAgY29udGV4dC5tb3ZlVG8oc3RhcnQueCwgc3RhcnQueSk7XG4gICAgICAgIGNvbnRleHQuYmV6aWVyQ3VydmVUbyhjMS54LCBjMS55LCBjMi54LCBjMi55LCBlbmQueCwgZW5kLnkpO1xuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuICAgICAgICBjb250ZXh0LmNsb3NlUGF0aCgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERyYXcgYSByZWN0YW5nbGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCB0aGUgeCBjb29yZGluYXRlIG9mIHRoZSB0b3AgbGV0IGNvcm5lclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5IHRoZSB5IGNvb3JkaW5hdGUgb2YgdGhlIHRvcCBsZWZ0IGNvcm5lclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB3aWR0aCB0aGUgeCBjb29yZGluYXRlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGhlaWdodCB0aGUgeSBjb29yZGluYXRlXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGNvbnRleHQgdGhlIDJEIENvbnRleHQgb2JqZWN0IGZvciB0aGUgY2FudmFzIHdlJ3JlIGRyYXdpbmcgb250b1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBzdHlsZSB0aGUgc3R5bGUgb3B0aW9ucyB0byBiZSB1c2VkIHdoZW4gZHJhd2luZyB0aGUgcmVjdGFuZ2xlXG4gICAgICovXG4gICAgc3RhdGljIGRyYXdSZWN0YW5nbGUoeCwgeSwgd2lkdGgsIGhlaWdodCwgY29udGV4dCwgc3R5bGUpIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihjb250ZXh0LCBzdHlsZSk7XG4gICAgICAgIGNvbnRleHQucmVjdCh4LCB5LCB3aWR0aCwgaGVpZ2h0KTtcbiAgICAgICAgY29udGV4dC5maWxsKCk7XG4gICAgICAgIGNvbnRleHQuc3Ryb2tlKCk7XG4gICAgfVxuXG4gICAgLy9UT0RPOiBwcm92aWRlIHN1cHBvcnQgZm9yIHJvdGF0aW9uIGFuZCBzdGFydEFuZ2xlIHBhcmFtZXRlcnNcbiAgICAvKipcbiAgICAgKiBEcmF3IGFuIGVsbGlwc2VcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCB0aGUgeCBjb29yZGluYXRlIG9mIHRoZSBjZW50ZXIgb2YgdGhlIGVsbGlwc2VcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geSB0aGUgeSBjb29yZGluYXRlIG9mIHRoZSBjZW50ZXIgb2YgdGhlIGVsbGlwc2VcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmFkaXVzIHRoZSBsYXJnZXIgcmFkaXVzIG9mIHRoZSBlbGxpcHNlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IG1pbm9yUmFkaXVzIHRoZSBzbWFsbGVyIHJhZGl1cyBvZiB0aGUgZWxsaXBzZVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBjb250ZXh0IHRoZSAyRCBDb250ZXh0IG9iamVjdCBmb3IgdGhlIGNhbnZhcyB3ZSdyZSBkcmF3aW5nIG9udG9cbiAgICAgKiBAcGFyYW0ge29iamVjdH0gc3R5bGUgdGhlIHN0eWxlIG9wdGlvbnMgdG8gYmUgdXNlZCB3aGVuIGRyYXdpbmcgdGhlIGVsbGlwc2VcbiAgICAgKi9cbiAgICBzdGF0aWMgZHJhd0VsbGlwc2UoeCwgeSwgcmFkaXVzLCBtaW5vclJhZGl1cywgY29udGV4dCwgc3R5bGUpIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbihjb250ZXh0LCBzdHlsZSk7XG4gICAgICAgIC8vVE9ETzogMjAxNy0wNS0yMiB0aGlzIGlzIGN1cnJlbnRseSBub3Qgc3VwcG9ydGVkIGJ5IElFXG4gICAgICAgIGNvbnRleHQuZWxsaXBzZSh4LCB5LCByYWRpdXMsIG1pbm9yUmFkaXVzLCAwLCAwLCAyICogTWF0aC5QSSk7XG4gICAgICAgIGNvbnRleHQuZmlsbCgpO1xuICAgICAgICBjb250ZXh0LnN0cm9rZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIERyYXcgYSBjaXJjbGVcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCB0aGUgeCBjb29yZGluYXRlIG9mIHRoZSBjZW50ZXIgb2YgdGhlIGNpcmNsZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5IHRoZSB5IGNvb3JkaW5hdGUgb2YgdGhlIGNlbnRlciBvZiB0aGUgY2lyY2xlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHJhZGl1cyBvZiB0aGUgY2lyY2xlXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGNvbnRleHQgdGhlIDJEIENvbnRleHQgb2JqZWN0IGZvciB0aGUgY2FudmFzIHdlJ3JlIGRyYXdpbmcgb250b1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBzdHlsZSB0aGUgc3R5bGUgb3B0aW9ucyB0byBiZSB1c2VkIHdoZW4gZHJhd2luZyB0aGUgY2lyY2xlXG4gICAgICovXG4gICAgc3RhdGljIGRyYXdDaXJjbGUoeCwgeSwgcmFkaXVzLCBjb250ZXh0LCBzdHlsZSkge1xuICAgICAgICBPYmplY3QuYXNzaWduKGNvbnRleHQsIHN0eWxlKTtcbiAgICAgICAgY29udGV4dC5hcmMoeCwgeSwgcmFkaXVzLCAwLCAyICogTWF0aC5QSSk7XG4gICAgICAgIC8vVE9ETzogMjAxNS0wMy0xMiB0aGlzIGlzIGN1cnJlbnRseSBvbmx5IHN1cHBvcnRlZCBieSBjaHJvbWUgJiBvcGVyYVxuICAgICAgICAvL2NvbnRleHQuZWxsaXBzZSh4LCB5LCByYWRpdXMsIHJhZGl1cywgMCwgMCwgMiAqIE1hdGguUEkpO1xuICAgICAgICBjb250ZXh0LmZpbGwoKTtcbiAgICAgICAgY29udGV4dC5zdHJva2UoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEcmF3IHRleHRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCB0aGUgeCBjb29yZGluYXRlIG9mIHRoZSB0b3AgbGV0IGNvcm5lclxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB5IHRoZSB5IGNvb3JkaW5hdGUgb2YgdGhlIHRvcCBsZWZ0IGNvcm5lclxuICAgICAqIEBwYXJhbSB7c3RyaW5nfSB0ZXh0IHRoZSB0ZXh0IHRvIGJlIGRyYXduXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGNvbnRleHQgdGhlIDJEIENvbnRleHQgb2JqZWN0IGZvciB0aGUgY2FudmFzIHdlJ3JlIGRyYXdpbmcgb250b1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBzdHlsZSB0aGUgc3R5bGUgb3B0aW9ucyB0byBiZSB1c2VkIHdoZW4gZHJhd2luZyB0aGUgdGV4dFxuICAgICAqL1xuICAgIHN0YXRpYyBkcmF3VGV4dCh4LCB5LCB0ZXh0LCBjb250ZXh0LCBzdHlsZSkge1xuICAgICAgICBPYmplY3QuYXNzaWduKGNvbnRleHQsIHN0eWxlKTtcbiAgICAgICAgY29udGV4dC5maWxsVGV4dCh0ZXh0LCB4LCB5KTtcbiAgICAgICAgLy9UT0RPOiBpbXBsZW1lbnQgc3Ryb2tlIHRleHQgaWYgc3BlY2lmaWVkXG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRHJhdyBhbiBpbWFnZVxuICAgICAqIEBwYXJhbSB7bnVtYmVyfSB4IHRoZSB4IGNvb3JkaW5hdGUgb2YgdGhlIHRvcCBsZXQgY29ybmVyXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgdGhlIHkgY29vcmRpbmF0ZSBvZiB0aGUgdG9wIGxlZnQgY29ybmVyXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGltYWdlIHRoZSBpbWFnZSB0byBiZSBkcmF3biB0byB0aGUgY2FudmFzXG4gICAgICogQHBhcmFtIHtvYmplY3R9IGNvbnRleHQgdGhlIDJEIENvbnRleHQgb2JqZWN0IGZvciB0aGUgY2FudmFzIHdlJ3JlIGRyYXdpbmcgb250b1xuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBzdHlsZSB0aGUgc3R5bGUgb3B0aW9ucyB0byBiZSB1c2VkIHdoZW4gZHJhd2luZyB0aGUgaW1hZ2VcbiAgICAgKi9cbiAgICBzdGF0aWMgZHJhd0ltYWdlKHgsIHksIGltYWdlLCBjb250ZXh0LCBzdHlsZSkge1xuICAgICAgICBPYmplY3QuYXNzaWduKGNvbnRleHQsIHN0eWxlKTtcbiAgICAgICAgLy9ubyByZWFzb24gdG8gZHJhdyAwLXNpemVkIGltYWdlc1xuICAgICAgICBpZiAoaW1hZ2Uud2lkdGggPiAwICYmIGltYWdlLmhlaWdodCA+IDApIHtcbiAgICAgICAgICAgIGNvbnRleHQuZHJhd0ltYWdlKGltYWdlLCB4LCB5LCBpbWFnZS53aWR0aCwgaW1hZ2UuaGVpZ2h0KTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vVE9ETzogdGhpcyBzaG91bGQgcHJvYmFibHkgYmUgZXhwb3NlZCBlbHNld2hlcmUvZGlmZmVyZW50bHlcbiAgICAvKipcbiAgICAgKiBNZWFzdXJlIHRoZSB0ZXh0XG4gICAgICogQHBhcmFtIHtzdHJpbmd9IHRleHQgdGhlIHRleHQgdG8gYmUgbWVhc3VyZWRcbiAgICAgKiBAcGFyYW0ge29iamVjdH0gY29udGV4dCB0aGUgMkQgQ29udGV4dCBvYmplY3QgZm9yIGEgY2FudmFzIC0gcmVxdWlyZWQgZm9yIG1lYXN1cmVtZW50IHRvIG9jY3VyLCBidXQgbWF5IGJlIGFyYml0cmFyeVxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBzdHlsZSB0aGUgc3R5bGUgb3B0aW9ucyB0byBiZSB1c2VkIHdoZW4gbWVhc3VyaW5nIHRoZSB0ZXh0XG4gICAgICogQHJldHVybiB7b2JqZWN0fSBbVGV4dE1ldHJpY3NdKGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0FQSS9UZXh0TWV0cmljcykgb2JqZWN0IGNvbnRhaW5pbmcgaW5mbyBsaWtlIFdpZHRoXG4gICAgICovXG4gICAgc3RhdGljIG1lYXN1cmVUZXh0KHRleHQsIGNvbnRleHQsIHN0eWxlKSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oY29udGV4dCwgc3R5bGUpO1xuICAgICAgICByZXR1cm4gY29udGV4dC5tZWFzdXJlVGV4dCh0ZXh0KTtcbiAgICB9XG59XG4iLCJpbXBvcnQgeyBSZW5kZXJlciB9IGZyb20gJy4vUmVuZGVyZXInO1xuaW1wb3J0IHsgUHJpbWl0aXZlQ29tcG9uZW50IH0gZnJvbSAnLi9QcmltaXRpdmVDb21wb25lbnQnO1xuXG5jb25zdCBBTExfQ0hBUlMgPSBgMTIzNDU2Nzg5MFFXRVJUWVVJT1BBU0RGR0hKS0xaWENWQk5NcXdlcnR5dWlvcGFzZGZnaGprbHp4Y3Zibm0uLFxcYH47OidcIiE/QCMkJV4mKigpXys9e31bXXxcXDw+L2A7XG5cbmNvbnN0IERFRkFVTFRTID0ge1xuICAgIGZvbnRTaXplOiAnMTZweCcsXG4gICAgZm9udEZhbWlseTogJ3NhbnMtc2VyaWYnLFxuICAgIGZvbnRTdHlsZTogJ25vcm1hbCcsXG4gICAgZm9udFZhcmlhbnQ6ICdub3JtYWwnLFxuICAgIGZvbnRXZWlnaHQ6ICdub3JtYWwnLFxuICAgIGxpbmVIZWlnaHQ6ICdub3JtYWwnLFxuICAgIHRleHRBbGlnbjogJ3N0YXJ0JyxcbiAgICB0ZXh0QmFzZWxpbmU6ICdhbHBoYWJldGljJ1xufTtcblxuZnVuY3Rpb24gX2dldFRleHRIZWlnaHQoZm9udCkge1xuICAgIC8vdGhpcyBpcyBhIHZlcnNpb24gb2Y6XG4gICAgLy9odHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vcXVlc3Rpb25zLzExMzQ1ODYvaG93LWNhbi15b3UtZmluZC10aGUtaGVpZ2h0LW9mLXRleHQtb24tYW4taHRtbC1jYW52YXNcbiAgICAvL2l0J3MgYSBwcmV0dHkgYXdmdWwgaGFjay5cbiAgICAvL1RPRE86IGZpZ3VyZSBvdXQgaG93IGNyb3NzLWJyb3dzZXIgdGhpcyBpc1xuXG4gICAgLy9jcmVhdGUgYW4gZWxlbWVudCB3aXRoIGV2ZXJ5IGNoYXJhY3RlciBpbiBpdCB3aXRoIHRoaXMgZm9udFxuICAgIGxldCBmb250SG9sZGVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICAgIGZvbnRIb2xkZXIuaW5uZXJUZXh0ID0gQUxMX0NIQVJTO1xuICAgIGZvbnRIb2xkZXIuc3R5bGUuZm9udCA9IGZvbnQ7XG5cbiAgICAvL2NyZWF0ZSBhbiBpbmxpbmUtYmxvY2sgdG8gcGxhY2UgYWZ0ZXIgdGhlIGVsZW1lbnRcbiAgICBsZXQgYmFzZWxpbmVSdWxlciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGJhc2VsaW5lUnVsZXIuc3R5bGUuZGlzcGxheSA9ICdpbmxpbmUtYmxvY2snO1xuICAgIGJhc2VsaW5lUnVsZXIuc3R5bGUud2lkdGggPSAnMXB4JztcbiAgICBiYXNlbGluZVJ1bGVyLnN0eWxlLmhlaWdodCA9ICcwJztcbiAgICBiYXNlbGluZVJ1bGVyLnN0eWxlLnZlcnRpY2FsQWxpZ24gPSAnYmFzZWxpbmUnO1xuXG4gICAgLy9wbGFjZSB0aGVtIGluIGEgd3JhcHBlciBhbmQgYWRkIGl0IHRvIHRoZSBib2R5XG4gICAgbGV0IHdyYXBwZXIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB3cmFwcGVyLmFwcGVuZENoaWxkKGZvbnRIb2xkZXIpO1xuICAgIHdyYXBwZXIuYXBwZW5kQ2hpbGQoYmFzZWxpbmVSdWxlcik7XG4gICAgd3JhcHBlci5zdHlsZS53aGl0ZVNwYWNlID0gJ25vd3JhcCc7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh3cmFwcGVyKTtcblxuICAgIC8vZ2V0IHRoZWlyIGJvdW5kaW5nIHJlY3RhbmdsZXMgYW5kLi4uXG4gICAgbGV0IGZvbnRSZWN0ID0gZm9udEhvbGRlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICBsZXQgYmFzZWxpbmVSZWN0ID0gYmFzZWxpbmVSdWxlci5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcblxuICAgIC8vY2FsY3VsYXRlIHRoZWlyIG9mZnNldCBmcm9tIHRvcFxuICAgIGxldCBmb250VG9wID0gZm9udFJlY3QudG9wICsgZG9jdW1lbnQuYm9keS5zY3JvbGxUb3A7XG4gICAgbGV0IGZvbnRCb3R0b20gPSBmb250VG9wICsgZm9udFJlY3QuaGVpZ2h0O1xuXG4gICAgbGV0IGJhc2VsaW5lID0gYmFzZWxpbmVSZWN0LnRvcCArIGRvY3VtZW50LmJvZHkuc2Nyb2xsVG9wO1xuXG4gICAgZG9jdW1lbnQuYm9keS5yZW1vdmVDaGlsZCh3cmFwcGVyKTtcblxuICAgIC8vYXNjZW50IGVxdWFscyB0aGUgYmFzZWxpbmUgbG9jYXRpb24gbWludXMgdGV4dCB0b3AgbG9jYXRpb25cbiAgICBsZXQgYXNjZW50RnJvbUJhc2VsaW5lID0gYmFzZWxpbmUgLSBmb250VG9wO1xuXG4gICAgLy9kZWNlbnQgZXF1YWxzIHRoZSB0ZXh0IGJvdHRvbSBsb2NhdGlvbiBtaW51c2UgdGhlIGJhc2VsaW5lIGxvY2F0aW9uXG4gICAgbGV0IGRlc2NlbnRGcm9tQmFzZWxpbmUgPSBmb250Qm90dG9tIC0gYmFzZWxpbmU7XG5cbiAgICByZXR1cm4ge1xuICAgICAgICBoZWlnaHQ6IGZvbnRSZWN0LmhlaWdodCxcbiAgICAgICAgYXNjZW50OiBhc2NlbnRGcm9tQmFzZWxpbmUsXG4gICAgICAgIGRlc2NlbnQ6IGRlc2NlbnRGcm9tQmFzZWxpbmVcbiAgICB9O1xufVxuXG4vKipcbiAqIEEgdGV4dCBvYmplY3RcbiAqL1xuZXhwb3J0IGNsYXNzIFRleHQgZXh0ZW5kcyBQcmltaXRpdmVDb21wb25lbnQge1xuICAgIC8qKlxuICAgICAqIEBwYXJhbSB7b2JqZWN0fSBvcHRpb25zIHRoZSBvcHRpb25zIGZvciB0aGUgdGV4dCBvYmplY3RcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAdHlwZSB7c3RyaW5nfSB0ZXh0IHRoZSB0ZXh0IHRvIGJlIHJlbmRlcmVkXG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnRleHQgPSBvcHRpb25zLnRleHQ7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEB0eXBlIHtzdHJpbmd9IGZvbnRTaXplIHRoZSBmb250IHNpemUgYXQgd2hpY2ggdG8gcmVuZGVyIHRoZSB0ZXh0XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmZvbnRTaXplID0gb3B0aW9ucy5mb250U2l6ZSB8fCBERUZBVUxUUy5mb250U2l6ZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHR5cGUge3N0cmluZ30gZm9udEZhbWlseSB0aGUgZm9udCBmYW1pbHkgaW4gd2hpY2ggdG8gcmVuZGVyIHRoZSB0ZXh0XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmZvbnRGYW1pbHkgPSBvcHRpb25zLmZvbnRGYW1pbHkgfHwgREVGQVVMVFMuZm9udEZhbWlseTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHR5cGUge3N0cmluZ30gZm9udFN0eWxlIHRoZSBmb250IHN0eWxlIHdpdGggd2hpY2ggdG8gcmVuZGVyIHRoZSB0ZXh0XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLmZvbnRTdHlsZSA9IG9wdGlvbnMuZm9udFN0eWxlIHx8IERFRkFVTFRTLmZvbnRTdHlsZTtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHR5cGUge3N0cmluZ30gZm9udFZhcmlhbnQgdGhlIGZvbnQgdmFyaWFudCBpbiB3aGljaCB0byByZW5kZXIgdGhlIHRleHRcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuZm9udFZhcmlhbnQgPSBvcHRpb25zLmZvbnRWYXJpYW50IHx8IERFRkFVTFRTLmZvbnRWYXJpYW50O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAdHlwZSB7c3RyaW5nfSBmb250V2VpZ2h0IHRoZSBmb250IHdlaWdodCBhdCB3aGljaCB0byByZW5kZXIgdGhlIHRleHRcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMuZm9udFdlaWdodCA9IG9wdGlvbnMuZm9udFdlaWdodCB8fCBERUZBVUxUUy5mb250V2VpZ2h0O1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiBAdHlwZSB7c3RyaW5nfSBsaW5lSGVpZ2h0IHRoZSBsaW5lIGhlaWdodCBvZiB0aGUgdGV4dFxuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy5saW5lSGVpZ2h0ID0gb3B0aW9ucy5saW5lSGVpZ2h0IHx8IERFRkFVTFRTLmxpbmVIZWlnaHQ7XG5cbiAgICAgICAgLyoqXG4gICAgICAgICAqIEB0eXBlIHtzdHJpbmd9IHRleHRBbGlnbiB0aGUgYWxpZ25tZW50IHdpdGggd2hpY2ggdG8gcmVuZGVyIHRoZSB0ZXh0XG4gICAgICAgICAqL1xuICAgICAgICB0aGlzLnRleHRBbGlnbiA9IG9wdGlvbnMudGV4dEFsaWduIHx8IERFRkFVTFRTLnRleHRBbGlnbjtcblxuICAgICAgICAvKipcbiAgICAgICAgICogQHR5cGUge3N0cmluZ30gdGV4dEJhc2VsaW5lIHRoZSBiYXNlbGluZSBmb3IgdGhlIHRleHRcbiAgICAgICAgICovXG4gICAgICAgIHRoaXMudGV4dEJhc2VsaW5lID0gb3B0aW9ucy50ZXh0QmFzZWxpbmUgfHwgREVGQVVMVFMudGV4dEJhc2VsaW5lO1xuXG4gICAgICAgIHRoaXMuX3RleHRNZXRyaWNzTmVlZFVwZGF0ZSA9IHRydWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogY29tcHV0ZSB0aGUgaGVpZ2h0IGRhdGEgYW5kIGFkZCBpdCB0byB0aGUgdGV4dE1ldHJpY3Mgb2JqZWN0IGZyb20gdGhlIGNhbnZhcyBjb250ZXh0XG4gICAgICogQHR5cGUge29iamVjdH0gdGV4dE1ldHJpY3NcbiAgICAgKi9cbiAgICBnZXQgdGV4dE1ldHJpY3MoKSB7XG4gICAgICAgIGlmICh0aGlzLl90ZXh0TWV0cmljc05lZWRVcGRhdGUgfHwgdGhpcy5fdGV4dE1ldHJpY3MgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuX3VwZGF0ZVN0eWxlKCk7XG4gICAgICAgICAgICB0aGlzLl90ZXh0TWV0cmljcyA9IFJlbmRlcmVyLm1lYXN1cmVUZXh0KHRoaXMudGV4dCwgdGhpcy5fcHJlcmVuZGVyaW5nQ29udGV4dCwgdGhpcy5zdHlsZSk7XG4gICAgICAgICAgICBPYmplY3QuYXNzaWduKHRoaXMuX3RleHRNZXRyaWNzLCBfZ2V0VGV4dEhlaWdodCh0aGlzLnN0eWxlLmZvbnQpKTtcbiAgICAgICAgICAgIHRoaXMuX3RleHRNZXRyaWNzTmVlZFVwZGF0ZSA9IGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl90ZXh0TWV0cmljcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBnZXQgdGhlIGJvdW5kaW5nIGJveCBvZiB0aGUgdGV4dCBvYmplY3RcbiAgICAgKiBAdHlwZSB7dG9wOiBudW1iZXIsIGxlZnQ6IG51bWJlciwgYm90dG9tOiBudW1iZXIsIHJpZ2h0OiBudW1iZXJ9XG4gICAgICovXG4gICAgZ2V0IGJvdW5kaW5nQm94KCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdG9wOiB0aGlzLm9mZnNldC55IC0gdGhpcy50ZXh0TWV0cmljcy5hc2NlbnQsXG4gICAgICAgICAgICBsZWZ0OiB0aGlzLm9mZnNldC54LFxuICAgICAgICAgICAgYm90dG9tOiB0aGlzLm9mZnNldC55ICsgdGhpcy50ZXh0TWV0cmljcy5kZXNjZW50LFxuICAgICAgICAgICAgcmlnaHQ6IHRoaXMub2Zmc2V0LnggKyB0aGlzLnRleHRNZXRyaWNzLndpZHRoXG4gICAgICAgIH07XG4gICAgfVxuXG4gICAgX3VwZGF0ZVN0eWxlKG9wdGlvbnMpIHtcbiAgICAgICAgT2JqZWN0LmFzc2lnbih0aGlzLnN0eWxlLCBvcHRpb25zLCB7XG4gICAgICAgICAgICBmb250OiBgJHt0aGlzLmZvbnRTdHlsZX0gJHt0aGlzLmZvbnRWYXJpYW50fSAke3RoaXMuZm9udFdlaWdodH0gJHt0aGlzLmZvbnRTaXplfS8ke3RoaXMubGluZUhlaWdodH0gJHt0aGlzLmZvbnRGYW1pbHl9YCxcbiAgICAgICAgICAgIHRleHRBbGlnbjogdGhpcy50ZXh0QWxpZ24sXG4gICAgICAgICAgICB0ZXh0QmFzZWxpbmU6IHRoaXMudGV4dEJhc2VsaW5lXG4gICAgICAgIH0pO1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogb3ZlcnJpZGUgdGhlIHJlbmRlciBmdW5jdGlvbiBmb3IgdGV4dCBvYmplY3RzXG4gICAgICogQG92ZXJyaWRlXG4gICAgICovXG4gICAgcmVuZGVyKCkge1xuICAgICAgICB0aGlzLl90ZXh0TWV0cmljc05lZWRVcGRhdGUgPSB0cnVlO1xuICAgICAgICB0aGlzLl91cGRhdGVTdHlsZSgpO1xuICAgICAgICBSZW5kZXJlci5kcmF3VGV4dCgwLCB0aGlzLnRleHRNZXRyaWNzLmFzY2VudCwgdGhpcy50ZXh0LCB0aGlzLl9wcmVyZW5kZXJpbmdDb250ZXh0LCB0aGlzLnN0eWxlKTtcblxuICAgICAgICAvKmlmICh0aGlzLmZsYWdzLkRFQlVHKSB7XG4gICAgICAgICAgICBSZW5kZXJlci5kcmF3UGF0aCh0aGlzLl9wcmVyZW5kZXJpbmdDb250ZXh0LCBbe1xuICAgICAgICAgICAgICAgIHg6IDAsXG4gICAgICAgICAgICAgICAgeTogdGhpcy50ZXh0TWV0cmljcy5hc2NlbnRcbiAgICAgICAgICAgIH0sIHtcbiAgICAgICAgICAgICAgICB4OiB0aGlzLnRleHRNZXRyaWNzLndpZHRoLFxuICAgICAgICAgICAgICAgIHk6IHRoaXMudGV4dE1ldHJpY3MuYXNjZW50XG4gICAgICAgICAgICB9XSwge1xuICAgICAgICAgICAgICAgIHN0cm9rZVN0eWxlOiAnQmx1ZSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgUmVuZGVyZXIuZHJhd0NpcmNsZSh0aGlzLl9wcmVyZW5kZXJpbmdDb250ZXh0LCAwLCB0aGlzLnRleHRNZXRyaWNzLmFzY2VudCwgMywge1xuICAgICAgICAgICAgICAgIHN0cm9rZVN0eWxlOiAnQmx1ZScsXG4gICAgICAgICAgICAgICAgZmlsbFN0eWxlOiAnQmx1ZSdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9Ki9cbiAgICB9XG59XG4iLCJpbXBvcnQgeyBSZW5kZXJlciB9IGZyb20gJy4vUmVuZGVyZXInO1xuaW1wb3J0IHsgUHJpbWl0aXZlQ29tcG9uZW50IH0gZnJvbSAnLi9QcmltaXRpdmVDb21wb25lbnQnO1xuaW1wb3J0IHsgVmVjdG9yIH0gZnJvbSAndmVjdG9yaW91cyc7XG5pbXBvcnQgeyBMaW5lIH0gZnJvbSAnLi9MaW5lJztcblxuLy93b3VsZCBuYW1lIHRoZSBmaWxlICdwYXRoJywgYnV0IGRhbW4gbmVhciBldmVyeXRoaW5nXG4vL3JlbGllcyBvbiB0aGUgZmlsZXN5c3RlbSAncGF0aCcgbW9kdWxlXG5cbi8qKlxuICogQW4gb3JkZXJlZCBzZXQgb2YgdmVjdG9ycyBkZWZpbmluZyBhIHBhdGhcbiAqL1xuZXhwb3J0IGNsYXNzIFZlY3RvclBhdGggZXh0ZW5kcyBQcmltaXRpdmVDb21wb25lbnQge1xuICAgIC8qKlxuICAgICAqIHNlZSBQcmltaXRpdmVDb21wb25lbnQgZm9yIG1vcmUgb3B0aW9uc1xuICAgICAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIHRoZSBvcHRpb25zIGZvciB0aGUgb2JqZWN0XG4gICAgICogQHBhcmFtIHtPYmplY3RbXX0gb3B0aW9ucy52ZXJ0aWNlcyB0aGUgdmVydGljZXNcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gb3B0aW9ucy52ZXJ0aWNlc1tdLnggdGhlIHkgY29vcmRpbmF0ZSBmb3IgYSB2ZXJ0ZXhcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gb3B0aW9ucy52ZXJ0aWNlc1tdLnkgdGhlIHkgY29vcmRpbmF0ZSBmb3IgYSB2ZXJ0ZXhcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvcihvcHRpb25zKSB7XG4gICAgICAgIHN1cGVyKG9wdGlvbnMpO1xuXG4gICAgICAgIG9wdGlvbnMudmVydGljZXMgPSBvcHRpb25zLnZlcnRpY2VzIHx8IFtdO1xuXG4gICAgICAgIC8vdGhpcy51bnNjYWxlZExpbmVXaWR0aCA9IHRoaXMuc3R5bGUubGluZVdpZHRoO1xuXG4gICAgICAgIC8qKlxuICAgICAgICAgKiB0aGUgbGlzdCBvZiB2ZXJ0aWNlcyBhcyB2ZWN0b3Jpb3VzIFZlY3RvcnNcbiAgICAgICAgICogQHR5cGUge1ZlY3RvcltdfSB2ZXJ0aWNlc1xuICAgICAgICAgKi9cbiAgICAgICAgdGhpcy52ZXJ0aWNlcyA9IG9wdGlvbnMudmVydGljZXMubWFwKHYgPT4gbmV3IFZlY3Rvcihbdi54LCB2LnldKSk7XG5cbiAgICAgICAgbGV0IHlDb29yZGluYXRlcyA9IHRoaXMudmVydGljZXMubWFwKHYgPT4gdi55KTtcbiAgICAgICAgbGV0IHhDb29yZGluYXRlcyA9IHRoaXMudmVydGljZXMubWFwKHYgPT4gdi54KTtcblxuICAgICAgICAvL3VzZXMgYGFwcGx5YCBzbyB3ZSBjYW4gc3VwcGx5IHRoZSBsaXN0IGFzIGEgbGlzdCBvZiBhcmd1bWVudHNcbiAgICAgICAgdGhpcy5fbGVmdCA9IE1hdGgubWluLmFwcGx5KG51bGwsIHhDb29yZGluYXRlcyk7XG4gICAgICAgIHRoaXMuX3RvcCA9IE1hdGgubWluLmFwcGx5KG51bGwsIHlDb29yZGluYXRlcyk7XG4gICAgICAgIHRoaXMuX3JpZ2h0ID0gTWF0aC5tYXguYXBwbHkobnVsbCwgeENvb3JkaW5hdGVzKTtcbiAgICAgICAgdGhpcy5fYm90dG9tID0gTWF0aC5tYXguYXBwbHkobnVsbCwgeUNvb3JkaW5hdGVzKTtcblxuICAgICAgICBzdXBlci5kID0gbmV3IFZlY3RvcihbdGhpcy5fbGVmdCwgdGhpcy5fdG9wXSk7XG5cbiAgICAgICAgbGV0IG5vcm1hbGl6YXRpb25WZWN0b3IgPSB0aGlzLmQ7XG5cbiAgICAgICAgdGhpcy5fbm9ybWFsaXplZFZlcnRpY2VzID0gdGhpcy52ZXJ0aWNlcy5tYXAodiA9PiB2LnN1YnRyYWN0KG5vcm1hbGl6YXRpb25WZWN0b3IpKTtcblxuICAgICAgICB0aGlzLl9ub3JtYWxpemVkQm91bmRpbmdCb3ggPSBudWxsO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIGdldCB0aGUgYm91bmRpbmcgYm94IGZvciB0aGUgdmVydGljZXNcbiAgICAgKiBAdHlwZSB7e3RvcDpudW1iZXIsIGxlZnQ6IG51bWJlciwgYm90dG9tOm51bWJlciwgcmlnaHQ6bnVtYmVyfX0gYm91bmRpbmdCb3hcbiAgICAgKi9cbiAgICBnZXQgYm91bmRpbmdCb3goKSB7XG4gICAgICAgIHRoaXMuX25vcm1hbGl6ZWRCb3VuZGluZ0JveCA9IHtcbiAgICAgICAgICAgIHRvcDogMCxcbiAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICByaWdodDogdGhpcy5fcmlnaHQgLSB0aGlzLl9sZWZ0LFxuICAgICAgICAgICAgYm90dG9tOiB0aGlzLl9ib3R0b20gLSB0aGlzLl90b3BcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgdG9wOiAodGhpcy5fbm9ybWFsaXplZEJvdW5kaW5nQm94LnRvcCAqIHRoaXMuY29tcG91bmRTY2FsZS5zY2FsZUhlaWdodCkgKyB0aGlzLm9mZnNldC55IC0gdGhpcy5zdHlsZS5saW5lV2lkdGgsXG4gICAgICAgICAgICBsZWZ0OiAodGhpcy5fbm9ybWFsaXplZEJvdW5kaW5nQm94LmxlZnQgKiB0aGlzLmNvbXBvdW5kU2NhbGUuc2NhbGVXaWR0aCkgKyB0aGlzLm9mZnNldC54IC0gdGhpcy5zdHlsZS5saW5lV2lkdGgsXG4gICAgICAgICAgICBib3R0b206ICh0aGlzLl9ub3JtYWxpemVkQm91bmRpbmdCb3guYm90dG9tICogdGhpcy5jb21wb3VuZFNjYWxlLnNjYWxlSGVpZ2h0KSArIHRoaXMub2Zmc2V0LnkgKyB0aGlzLnN0eWxlLmxpbmVXaWR0aCxcbiAgICAgICAgICAgIHJpZ2h0OiAodGhpcy5fbm9ybWFsaXplZEJvdW5kaW5nQm94LnJpZ2h0ICogdGhpcy5jb21wb3VuZFNjYWxlLnNjYWxlV2lkdGgpICsgdGhpcy5vZmZzZXQueCArIHRoaXMuc3R5bGUubGluZVdpZHRoXG4gICAgICAgIH07XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBkZXRlcm1pbmUgd2hldGhlciB0aGUgcG9pbnQgaXMgaW4gdGhlIG9iamVjdFxuICAgICAqIGV2ZW4vb2RkIGxpbmUgaW50ZXJzZWN0aW9uIHRlc3RcbiAgICAgKiBAcGFyYW0ge251bWJlcn0geCB0aGUgeCBjb29yZGluYXRlXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IHkgdGhlIHkgY29vcmRpbmF0ZVxuICAgICAqIEByZXR1cm4ge2Jvb2xlYW59IHdoZXRoZXIgb3Igbm90IHRoZSBwb2ludCBpcyBpbiB0aGUgb2JqZWN0XG4gICAgICovXG4gICAgcG9pbnRJc0luT2JqZWN0KHgsIHkpIHtcbiAgICAgICAgbGV0IGluc2lkZSA9IGZhbHNlO1xuICAgICAgICBpZiAoc3VwZXIucG9pbnRJc0luT2JqZWN0KHgsIHkpKSB7XG4gICAgICAgICAgICAvL2NyZWF0ZSBhIGxpbmUgdGhhdCB0cmF2ZWxzIGZyb20gdGhpcyBwb2ludCBpbiBhbnkgZGlyZWN0aW9uXG4gICAgICAgICAgICAvL2lmIGl0IGludGVyc2VjdHMgdGhlIHBvbHlnb24gYW4gb2RkIG51bWJlciBvZiB0aW1lcywgaXQgaXMgaW5zaWRlXG5cbiAgICAgICAgICAgIC8vYSBsaW5lIGNhbiBiZSBkZXNjcmliZWQgYXMgYSB2ZXJ0ZXggYW5kIGEgZGlyZWN0aW9uXG4gICAgICAgICAgICBsZXQgbCA9IG5ldyBMaW5lKG5ldyBWZWN0b3IoW3gsIHldKSwgbmV3IFZlY3RvcihbMSwgMF0pKTtcblxuICAgICAgICAgICAgbGV0IGNvbXBvdW5kU2NhbGUgPSB0aGlzLmNvbXBvdW5kU2NhbGU7XG4gICAgICAgICAgICBsZXQgb2Zmc2V0ID0gdGhpcy5vZmZzZXQ7XG5cbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fbm9ybWFsaXplZFZlcnRpY2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgbGV0IGogPSAoaSArIDEpID49IHRoaXMuX25vcm1hbGl6ZWRWZXJ0aWNlcy5sZW5ndGggPyAwIDogaSArIDE7XG5cbiAgICAgICAgICAgICAgICBsZXQgdiA9IHNjYWxlVmVjdG9yWFkodGhpcy5fbm9ybWFsaXplZFZlcnRpY2VzW2ldLCBjb21wb3VuZFNjYWxlLnNjYWxlV2lkdGgsIGNvbXBvdW5kU2NhbGUuc2NhbGVIZWlnaHQpXG4gICAgICAgICAgICAgICAgICAgIC5hZGQob2Zmc2V0KTtcblxuICAgICAgICAgICAgICAgIGxldCB3ID0gc2NhbGVWZWN0b3JYWSh0aGlzLl9ub3JtYWxpemVkVmVydGljZXNbal0sIGNvbXBvdW5kU2NhbGUuc2NhbGVXaWR0aCwgY29tcG91bmRTY2FsZS5zY2FsZUhlaWdodClcbiAgICAgICAgICAgICAgICAgICAgLmFkZChvZmZzZXQpO1xuXG4gICAgICAgICAgICAgICAgbGV0IGVkZ2VEaXJlY3Rpb24gPSBWZWN0b3Iuc3VidHJhY3Qodywgdikubm9ybWFsaXplKCk7XG4gICAgICAgICAgICAgICAgbGV0IGVkZ2UgPSBuZXcgTGluZSh2LCBlZGdlRGlyZWN0aW9uKTtcbiAgICAgICAgICAgICAgICBsZXQgaW50ZXJzZWN0aW9uID0gZWRnZS5pbnRlcnNlY3Rpb25XaXRoKGwpO1xuXG4gICAgICAgICAgICAgICAgLy9pZiB0aGUgbGluZXMgYXJlIHBhcmFsbGVsL2NvbG9jYXRlZCwgbm8gbmVlZCB0byBjb3VudDtcbiAgICAgICAgICAgICAgICBpZiAoaW50ZXJzZWN0aW9uID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIC8vVE9ETzogc2hvdWxkIHJlcGxhY2UgMHMgd2l0aCBlcHNpbG9ucywgd2hlcmUgZXBzaWxvbiBpc1xuICAgICAgICAgICAgICAgIC8vdGhlIHRocmVzaGhvbGQgZm9yIGNvbnNpZGVyaW5nIHR3byB0aGluZ3MgYXMgdG91Y2hpbmcvaW50ZXJzZWN0aW5nXG4gICAgICAgICAgICAgICAgbGV0IGludGVyc2VjdFRvVGhlUmlnaHQgPSBpbnRlcnNlY3Rpb24ueCAtIHggPj0gMDtcblxuICAgICAgICAgICAgICAgIC8vaWYgdGhlIGludGVyc2VjdGlvbiBpcyBub3QgdG8gdGhlIHJpZ2h0LCBubyBuZWVkIHRvIGNvdW50XG4gICAgICAgICAgICAgICAgaWYgKCFpbnRlcnNlY3RUb1RoZVJpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnRpbnVlO1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCBuZWdhdGl2ZVggPSAoZWRnZURpcmVjdGlvbi54IDwgMCk7XG4gICAgICAgICAgICAgICAgbGV0IG5lZ2F0aXZlWSA9IChlZGdlRGlyZWN0aW9uLnkgPCAwKTtcblxuICAgICAgICAgICAgICAgIC8vdGVjaG5pY2FsbHkgc3BlYWtpbmcsIGJvdHRvbSBhbmQgdG9wIHNob3VsZCBiZSByZXZlcnNlZCxcbiAgICAgICAgICAgICAgICAvL3NpbmNlIHk9MCBpcyB0aGUgdG9wIGxlZnQgY29ybmVyIG9mIHRoZSBzY3JlZW4gLSBpdCdzXG4gICAgICAgICAgICAgICAgLy9qdXN0IGVhc2llciB0byB0aGluayBhYm91dCBpdCBtYXRoZW1hdGljYWxseSB0aGlzIHdheVxuICAgICAgICAgICAgICAgIGxldCBsZWZ0VmVydGV4ID0gbmVnYXRpdmVYID8gdyA6IHY7XG4gICAgICAgICAgICAgICAgbGV0IHJpZ2h0VmVydGV4ID0gbmVnYXRpdmVYID8gdiA6IHc7XG4gICAgICAgICAgICAgICAgbGV0IHRvcFZlcnRleCA9IG5lZ2F0aXZlWSA/IHcgOiB2O1xuICAgICAgICAgICAgICAgIGxldCBib3R0b21WZXJ0ZXggPSBuZWdhdGl2ZVkgPyB2IDogdztcblxuICAgICAgICAgICAgICAgIGxldCBpbnRlcnNlY3RXaXRoaW5TZWdtZW50ID1cbiAgICAgICAgICAgICAgICAgICAgKGludGVyc2VjdGlvbi54IC0gbGVmdFZlcnRleC54ID49IDApICYmXG4gICAgICAgICAgICAgICAgICAgIChyaWdodFZlcnRleC54IC0gaW50ZXJzZWN0aW9uLnggPj0gMCkgJiZcbiAgICAgICAgICAgICAgICAgICAgKGludGVyc2VjdGlvbi55IC0gdG9wVmVydGV4LnkgPj0gMCkgJiZcbiAgICAgICAgICAgICAgICAgICAgKGJvdHRvbVZlcnRleC55IC0gaW50ZXJzZWN0aW9uLnkgPj0gMCk7XG5cbiAgICAgICAgICAgICAgICBpZiAoaW50ZXJzZWN0V2l0aGluU2VnbWVudCkge1xuICAgICAgICAgICAgICAgICAgICBpbnNpZGUgPSAhaW5zaWRlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gaW5zaWRlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIG92ZXJyaWRlIHRoZSByZW5kZXIgZnVuY3Rpb24gZm9yIGRyYXdpbmcgdmVjdG9yIHBhdGhzIHNwZWNpZmljYWxseVxuICAgICAqIEBvdmVycmlkZVxuICAgICAqL1xuICAgIHJlbmRlcigpIHtcbiAgICAgICAgbGV0IGJvdW5kaW5nQm94ID0gdGhpcy5ib3VuZGluZ0JveDtcbiAgICAgICAgbGV0IG9mZnNldCA9IHRoaXMub2Zmc2V0O1xuICAgICAgICBsZXQgY29tcG91bmRTY2FsZSA9IHRoaXMuY29tcG91bmRTY2FsZTtcbiAgICAgICAgLy9ub3JtYWxpemUgdGhlIHZlcnRpY2VzIChsZWZ0LSBhbmQgdG9wLW1vc3QgeC95LXZhbHVlcyBzaG91bGQgYmUgMCBhbmQgMClcbiAgICAgICAgbGV0IHBhdGhUb0RyYXcgPSB0aGlzLl9ub3JtYWxpemVkVmVydGljZXMubWFwKHZlcnRleCA9PlxuICAgICAgICAgICAgc2NhbGVWZWN0b3JYWSh2ZXJ0ZXgsIGNvbXBvdW5kU2NhbGUuc2NhbGVXaWR0aCwgY29tcG91bmRTY2FsZS5zY2FsZUhlaWdodClcbiAgICAgICAgICAgIC5zdWJ0cmFjdChuZXcgVmVjdG9yKFtib3VuZGluZ0JveC5sZWZ0LCBib3VuZGluZ0JveC50b3BdKSlcbiAgICAgICAgICAgIC5hZGQob2Zmc2V0KSk7XG4gICAgICAgIFJlbmRlcmVyLmRyYXdQYXRoKHBhdGhUb0RyYXcsIHRoaXMuX3ByZXJlbmRlcmluZ0NvbnRleHQsIHRoaXMuc3R5bGUpO1xuICAgIH07XG59XG5cbmZ1bmN0aW9uIHNjYWxlVmVjdG9yWFkodmVjdG9yLCBzY2FsZVgsIHNjYWxlWSkge1xuICAgIHJldHVybiBuZXcgVmVjdG9yKFt2ZWN0b3IueCAqIHNjYWxlWCwgdmVjdG9yLnkgKiBzY2FsZVldKTtcbn1cbiJdfQ==
