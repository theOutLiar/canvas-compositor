require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function () {
  'use strict';

  var Vector = require('./vector');

  /**
   * @method constructor
   * @desc Creates a `Matrix` from the supplied arguments.
   **/
  function Matrix (data, options) {
    this.type = Float64Array;
    this.shape = [];

    if (data && data.buffer && data.buffer instanceof ArrayBuffer) {
      return Matrix.fromTypedArray(data, options && options.shape);
    } else if (data instanceof Array) {
      return Matrix.fromArray(data);
    } else if (data instanceof Vector) {
      return Matrix.fromVector(data, options && options.shape);
    } else if (data instanceof Matrix) {
      return Matrix.fromMatrix(data);
    } else if (typeof data === "number" && typeof options === "number") {
      // Handle new Matrix(r, c)
      return Matrix.fromShape([data, options]);
    } else if (data && !data.buffer && data.shape) {
      // Handle new Matrix({ shape: [r, c] })
      return Matrix.fromShape(data.shape);
    }
  }
  
  Matrix.fromTypedArray = function (data, shape) {
    if (data.length !== shape[0] * shape[1])
      throw new Error("Shape does not match typed array dimensions.");

    var self = Object.create(Matrix.prototype);
    self.shape = shape;
    self.data = data;
    self.type = data.constructor;

    return self;
  };

  Matrix.fromArray = function (array) {
    var r = array.length, // number of rows
        c = array[0].length,  // number of columns
        data = new Float64Array(r * c);

    var i, j;
    for (i = 0; i < r; ++i)
      for (j = 0; j < c; ++j)
        data[i * c + j] = array[i][j];

    return Matrix.fromTypedArray(data, [r, c]);
  };
  
  Matrix.fromMatrix = function (matrix) {
    var self = Object.create(Matrix.prototype);
    self.shape = [matrix.shape[0], matrix.shape[1]];
    self.data = new matrix.type(matrix.data);
    self.type = matrix.type;
    
    return self;
  }
  
  Matrix.fromVector = function (vector, shape) {
    if (shape && vector.length !== shape[0] * shape[1])
      throw new Error("Shape does not match vector dimensions.");

    var self = Object.create(Matrix.prototype);
    self.shape = shape ? shape : [vector.length, 1];
    self.data = new vector.type(vector.data);
    self.type = vector.type;

    return self;
  }

  Matrix.fromShape = function (shape) {
    var r = shape[0], // number of rows
        c = shape[1]; // number of columns

    return Matrix.fromTypedArray(new Float64Array(r * c), shape);
  }

  /**
   * Static method. Perform binary operation on two matrices `a` and `b` together.
   * @param {Matrix} a
   * @param {Matrix} b
   * @param {function } op
   * @returns {Matrix} a new matrix containing the results of binary operation of `a` and `b`
   **/
  Matrix.binOp = function(a, b, op) {
    return new Matrix(a).binOp(b, op);
  };

  /**
   * Perform binary operation on `matrix` to the current matrix.
   * @param {Matrix} matrix
   * @param {function } op
   * @returns {Matrix} this
   **/
  Matrix.prototype.binOp = function(matrix, op) {
    var r = this.shape[0],          // rows in this matrix
        c = this.shape[1],          // columns in this matrix
        size = r * c,
        d1 = this.data,
        d2 = matrix.data;

    if (r !== matrix.shape[0] || c !== matrix.shape[1])
      throw new Error('sizes do not match!');

    var i;
    for (i = 0; i < size; i++)
      d1[i] = op(d1[i], d2[i], i);

    return this;
  };

  /**
   * Static method. Adds two matrices `a` and `b` together.
   * @param {Matrix} a
   * @param {Matrix} b
   * @returns {Matrix} a new matrix containing the sum of `a` and `b`
   **/
  Matrix.add = function (a, b) {
    return new Matrix(a).add(b);
  };

  /**
   * Adds `matrix` to current matrix.
   * @param {Matrix} a
   * @param {Matrix} b
   * @returns {Matrix} `this`
   **/
  Matrix.prototype.add = function (matrix) {
    return this.binOp(matrix, function(a, b) { return a + b });
  };

  /**
   * Static method. Subtracts the matrix `b` from matrix `a`.
   * @param {Matrix} a
   * @param {Matrix} b
   * @returns {Matrix} a new matrix containing the difference between `a` and `b`
   **/
  Matrix.subtract = function (a, b) {
    return new Matrix(a).subtract(b);
  };

  /**
   * Subtracts `matrix` from current matrix.
   * @param {Matrix} a
   * @param {Matrix} b
   * @returns {Matrix} `this`
   **/
  Matrix.prototype.subtract = function (matrix) {
    return this.binOp(matrix, function(a, b) { return a - b });
  };

  /**
   * Static method. Hadamard product of matrices
   * @param {Matrix} a
   * @param {Matrix} b
   * @returns {Matrix} a new matrix containing the hadamard product
   **/
  Matrix.product = function (a, b) {
    return new Matrix(a).product(b);
  };

  /**
   * Hadamard product of matrices
   * @param {Matrix} a
   * @param {Matrix} b
   * @returns {Matrix} `this`
   **/
  Matrix.prototype.product = function (matrix) {
    return this.binOp(matrix, function(a, b) { return a * b });
  };

  /**
   * Static method. Multiplies all elements of a matrix `a` with a specified `scalar`.
   * @param {Matrix} a
   * @param {Number} scalar
   * @returns {Matrix} a new scaled matrix
   **/
  Matrix.scale = function (a, scalar) {
    return new Matrix(a).scale(scalar);
  };

  /**
   * Multiplies all elements of current matrix with a specified `scalar`.
   * @param {Number} scalar
   * @returns {Matrix} `this`
   **/
  Matrix.prototype.scale = function (scalar) {
    var r = this.shape[0],          // rows in this matrix
        c = this.shape[1],          // columns in this matrix
        size = r * c,
        d1 = this.data,
        i;

    for (i = 0; i < size; i++)
      d1[i] *= scalar;

    return this;
  };

  /**
   * Static method. Creates a `r x c` matrix containing optional 'value' (default 0), takes
   * an optional `type` argument which should be an instance of `TypedArray`.
   * @param {Number} r
   * @param {Number} c
   * @param {Number || function} value
   * @param {TypedArray} type
   * @returns {Vector} a new matrix of the specified size and `type`
   **/
  Matrix.fill = function (r, c, value, type) {
    if (r <= 0 || c <= 0)
      throw new Error('invalid size');

    value = value || +0.0;
    type = type || Float64Array;

    var size = r * c,
        data = new type(size),
        isValueFn = typeof value === 'function',
        i, j, k = 0;
    
    for (i = 0; i < r; i++)
      for (j = 0; j < c; j++, k++)
        data[k] = isValueFn ? value(i, j) : value;

    return Matrix.fromTypedArray(data, [r, c]);
  };

  /**
   * Static method. Creates an `r x c` matrix containing zeros (`0`), takes an
   * optional `type` argument which should be an instance of `TypedArray`.
   * @param {Number} r
   * @param {Number} c
   * @param {TypedArray} type
   * @returns {Matrix} a matrix of the specified dimensions and `type`
   **/
  Matrix.zeros = function (r, c, type) {
    return Matrix.fill(r, c, +0.0, type);
  };

  /**
   * Static method. Creates an `r x c` matrix containing ones (`1`), takes an
   * optional `type` argument which should be an instance of `TypedArray`.
   * @param {Number} r
   * @param {Number} c
   * @param {TypedArray} type
   * @returns {Matrix} a matrix of the specified dimensions and `type`
   **/
  Matrix.ones = function (r, c, type) {
    return Matrix.fill(r, c, +1.0, type);
  };

  /**
   * Static method. Creates an `r x c` matrix containing random values
   * according to a normal distribution, takes an optional `type` argument
   * which should be an instance of `TypedArray`.
   * @param {Number} r
   * @param {Number} c
   * @param {Number} mean (default 0)
   * @param {Number} standard deviation (default 1)
   * @param {TypedArray} type
   * @returns {Matrix} a matrix of the specified dimensions and `type`
   **/
  Matrix.random = function (r, c, deviation, mean, type) {
    deviation = deviation || 1;
    mean = mean || 0;
    return Matrix.fill(r, c, function() {
      return deviation * Math.random() + mean;
    }, type);
  };

  /**
   * Static method. Multiplies two matrices `a` and `b` of matching dimensions.
   * @param {Matrix} a
   * @param {Matrix} b
   * @returns {Matrix} a new resultant matrix containing the matrix product of `a` and `b`
   **/
  Matrix.multiply = function (a, b) {
    return a.multiply(b);
  };

  /**
   * Multiplies two matrices `a` and `b` of matching dimensions.
   * @param {Matrix} a
   * @param {Matrix} b
   * @returns {Matrix} a new resultant matrix containing the matrix product of `a` and `b`
   **/
  Matrix.prototype.multiply = function (matrix) {
    var r1 = this.shape[0],   // rows in this matrix
        c1 = this.shape[1],   // columns in this matrix
        r2 = matrix.shape[0], // rows in multiplicand
        c2 = matrix.shape[1], // columns in multiplicand
        d1 = this.data,
        d2 = matrix.data;

    if (c1 !== r2)
      throw new Error('sizes do not match');

    var data = new this.type(r1 * c2),
        i, j, k,
        sum;
    for (i = 0; i < r1; i++) {
      for (j = 0; j < c2; j++) {
        sum = +0;
        for (k = 0; k < c1; k++)
          sum += d1[i * c1 + k] * d2[j + k * c2];

        data[i * c2 + j] = sum;
      }
    }

    return Matrix.fromTypedArray(data, [r1, c2]);
  };

  /**
   * Transposes a matrix (mirror across the diagonal).
   * @returns {Matrix} `this`
   **/

  Object.defineProperty(Matrix.prototype, 'T', {
    get: function() { return this.transpose(); }
  });

  Matrix.prototype.transpose = function () {
    var r = this.shape[0],
        c = this.shape[1],
        i, j;

    var data = new this.type(c * r);
    for (i = 0; i < r; i++)
      for (j = 0; j < c; j++)
        data[j * r + i] = this.data[i * c + j];

    return Matrix.fromTypedArray(data, [c, r]);
  };

  /**
   * Determines the inverse of any invertible square matrix using
   * Gaussian elimination.
   * @returns {Matrix} the inverse of the matrix
   **/
  Matrix.prototype.inverse = function () {
    var l = this.shape[0],
        m = this.shape[1];

    if (l !== m)
      throw new Error('invalid dimensions');

    var identity = Matrix.identity(l);
    var augmented = Matrix.augment(this, identity);
    var gauss = augmented.gauss();

    var left = Matrix.zeros(l, m),
        right = Matrix.zeros(l, m),
        n = gauss.shape[1],
        i, j;
    for (i = 0; i < l; i++) {
      for (j = 0; j < n; j++) {
        if (j < m)
          left.set(i, j, gauss.get(i, j));
        else
          right.set(i, j - l, gauss.get(i, j));
      }
    }

    if (!left.equals(Matrix.identity(l)))
      throw new Error('matrix is not invertible');

    return right;
  };

  /**
   * Performs Gaussian elimination on a matrix.
   * @returns {Matrix} the matrix in reduced row echelon form
   **/
  Matrix.prototype.gauss = function () {
    var l = this.shape[0],
        m = this.shape[1];

    var copy = new Matrix(this),
        lead = 0,
        pivot,
        i, j, k,
        leadValue;

    for (i = 0; i < l; i++) {
      if (m <= lead)
        return new Error('matrix is singular');

      j = i;
      while (copy.data[j * m + lead] === 0) {
        j++;
        if (l === j) {
          j = i;
          lead++;

          if (m === lead)
            return new Error('matrix is singular');
        }
      }

      copy.swap(i, j);

      pivot = copy.data[i * m + lead];
      if (pivot !== 0) {
        // scale down the row by value of pivot
        for (k = 0; k < m; k++)
          copy.data[(i * m) + k] = copy.data[(i * m) + k] / pivot;
      }


      for (j = 0; j < l; j++) {
        leadValue = copy.data[j * m + lead];
        if (j !== i)
          for (k = 0; k < m; k++)
            copy.data[j * m + k] = copy.data[j * m + k] - (copy.data[i * m + k] * leadValue);
      }

      lead++;
    }

    for (i = 0; i < l; i++) {
      pivot = 0;
      for (j = 0; j < m; j++)
        if (!pivot)
          pivot = copy.data[i * m + j];

      if (pivot)
        // scale down the row by value of pivot
        for (k = 0; k < m; k++)
          copy.data[(i * m) + k] = copy.data[(i * m) + k] / pivot;
    }

    return copy;
  };

  /**
   * Performs full LU decomposition on a matrix.
   * @returns {Array} a triple (3-tuple) of the lower triangular resultant matrix `L`, the upper
   * triangular resultant matrix `U` and the pivot array `ipiv`
   **/
  Matrix.prototype.lu = function () {
    var r = this.shape[0],
        c = this.shape[1],
        plu = Matrix.plu(this),
        ipiv = plu[1],
        pivot = Matrix.identity(r),
        lower = new Matrix(plu[0]),
        upper = new Matrix(plu[0]),
        i, j;

    for (i = 0; i < r; i++)
      for (j = i; j < c; j++)
        lower.data[i * c + j] = i === j ? 1 : 0;

    for (i = 0; i < r; i++)
      for (j = 0; j < i && j < c; j++)
        upper.data[i * c + j] = 0;

    return [lower, upper, ipiv];
  };

  /**
   * Static method. Performs LU factorization on current matrix.
   * @returns {Array} an array with a new instance of the current matrix LU-
   * factorized and the corresponding pivot Int32Array
   **/
  Matrix.plu = function(matrix) {
    return new Matrix(matrix).plu();
  };

  /**
   * Performs LU factorization on current matrix.
   * @returns {Array} an array with the current matrix LU-factorized and the
   * corresponding pivot Int32Array
   **/
  Matrix.prototype.plu = function () {
    var data = this.data,
        n = this.shape[0],
        ipiv = new Int32Array(n),
        max, abs, diag, p,
        i, j, k;

    for (k = 0; k < n; ++k) {
      p = k;
      max = Math.abs(data[k * n + k]);
      for (j = k + 1; j < n; ++j) {
        abs = Math.abs(data[j * n + k]);
        if (max < abs) {
          max = abs;
          p = j;
        }
      }

      ipiv[k] = p;

      if (p !== k)
        this.swap(k, p);

      diag = data[k * n + k];
      for (i = k + 1; i < n; ++i)
        data[i * n + k] /= diag;

      for (i = k + 1; i < n; ++i) {
        for (j = k + 1; j < n - 1; ++j) {
          data[i * n + j] -= data[i * n + k] * data[k * n + j];
          ++j;
          data[i * n + j] -= data[i * n + k] * data[k * n + j];
        }

        if(j === n - 1)
          data[i * n + j] -= data[i * n + k] * data[k * n + j];
      }
    }

    return [this, ipiv];
  };

  /**
   * Solves an LU factorized matrix with the supplied right hand side(s)
   * @param {Matrix} rhs, right hand side(s) to solve for
   * @param {Int32Array} array of pivoted row indices
   * @returns {Matrix} rhs replaced by the solution
   **/
  Matrix.prototype.lusolve = function (rhs, ipiv) {
    var lu = this.data,
        n = rhs.shape[0],
        nrhs = rhs.shape[1],
        x = rhs.data,
        i, j, k;

    // pivot right hand side
    for (i = 0; i < ipiv.length; i++)
      if (i !== ipiv[i])
        rhs.swap(i, ipiv[i]);

    for (k = 0; k < nrhs; k++) {
      // forward solve
      for (i = 0; i < n; i++)
        for (j = 0; j < i; j++)
          x[i * nrhs + k] -= lu[i * n + j] * x[j * nrhs + k];

      // backward solve
      for (i = n - 1; i >= 0; i--) {
        for (j = i + 1; j < n; j++)
          x[i * nrhs + k] -= lu[i * n + j] * x[j * nrhs + k];
        x[i * nrhs + k] /= lu[i * n + i];
      }
    }

    return rhs;
  };

  /**
   * Solves AX = B using LU factorization, where A is the current matrix and
   * B is a Vector/Matrix containing the right hand side(s) of the equation.
   * @param {Matrix/Vector} rhs, right hand side(s) to solve for
   * @param {Int32Array} array of pivoted row indices
   * @returns {Matrix} a new matrix containing the solutions of the system
   **/
  Matrix.prototype.solve = function (rhs) {
    var plu = Matrix.plu(this),
        lu = plu[0],
        ipiv = plu[1];

    return lu.lusolve(new Matrix(rhs), ipiv);
  };

  /**
   * Static method. Augments two matrices `a` and `b` of matching dimensions
   * (appends `b` to `a`).
   * @param {Matrix} a
   * @param {Matrix} b
   * @returns {Matrix} the resultant matrix of `b` augmented to `a`
   **/
  Matrix.augment = function (a, b) {
    return new Matrix(a).augment(b);
  };

  /**
   * Augments `matrix` with current matrix.
   * @param {Matrix} matrix
   * @returns {Matrix} `this`
   **/
  Matrix.prototype.augment = function (matrix) {
    if (matrix.shape.length === 0)
     return this;

    var r1 = this.shape[0],
        c1 = this.shape[1],
        r2 = matrix.shape[0],
        c2 = matrix.shape[1],
        d1 = this.data,
        d2 = matrix.data,
        i, j;

    if (r1 !== r2)
      throw new Error("Rows do not match.");

    var length = c1 + c2,
        data = new this.type(length * r1);

    for (i = 0; i < r1; i++)
      for (j = 0; j < c1; j++)
        data[i * length + j] = d1[i * c1 + j];

    for (i = 0; i < r2; i++)
      for (j = 0; j < c2; j++)
        data[i * length + j + c1] = d2[i * c2 + j];

    this.shape = [r1, length];
    this.data = data;

    return this;
  };

  /**
   * Static method. Creates an identity matrix of `size`, takes an optional `type` argument
   * which should be an instance of `TypedArray`.
   * @param {Number} size
   * @param {TypedArray} type
   * @returns {Matrix} an identity matrix of the specified `size` and `type`
   **/
  Matrix.identity = function (size, type) {
    return Matrix.fill(size, size, function (i, j) {
      return i === j ? +1.0 : +0.0;
    })
  };

  /**
   * Static method. Creates a magic square matrix of `size`, takes an optional `type` argument
   * which should be an instance of `TypedArray`.
   * @param {Number} size
   * @param {Number} type
   * @returns {Matrix} a magic square matrix of the specified `size` and `type`
   **/
  Matrix.magic = function (size, type) {
    if (size < 0)
      throw new Error('invalid size');

    function f(n, x, y) {
      return (x + y * 2 + 1) % n;
    }

    type = type || Float64Array;
    var data = new type(size * size),
        i, j;
    for (i = 0; i < size; i++)
      for (j = 0; j < size; j++)
        data[(size - i - 1) * size + (size - j - 1)] =
          f(size, size - j - 1, i) * size + f(size, j, i) + 1;

    return Matrix.fromTypedArray(data, [size, size]);
  };

  /**
   * Gets the diagonal of a matrix.
   * @returns {Vector} the diagonal of the matrix as a vector
   **/
  Matrix.prototype.diag = function () {
    var r = this.shape[0],
        c = this.shape[1],
        data = new this.type(Math.min(r, c)),
        i;

    for (i = 0; i < r && i < c; i++)
      data[i] = this.data[i * c + i];

    return new Vector(data);
  };

  /**
   * Gets the determinant of any square matrix using LU factorization.
   * @returns {Number} the determinant of the matrix
   **/
  Matrix.prototype.determinant = function () {
    if (this.shape[0] !== this.shape[1])
      throw new Error('matrix is not square');

    var plu = Matrix.plu(this),
        ipiv = plu.pop(),
        lu = plu.pop(),
        r = this.shape[0],
        c = this.shape[1],
        product = 1,
        sign = 1,
        i;

    // get sign from ipiv
    for (i = 0; i < r; i++)
      if (i !== ipiv[i])
        sign *= -1;

    for (i = 0; i < r; i++)
      product *= lu.data[i * c + i];

    return sign * product;
  };

  /**
   * Gets the trace of the matrix (the sum of all diagonal elements).
   * @returns {Number} the trace of the matrix
   **/
  Matrix.prototype.trace = function () {
    var diagonal = this.diag(),
        result = 0,
        i, l;

    for (i = 0, l = diagonal.length; i < l; i++)
      result += diagonal.get(i);

    return result;
  };

  /**
   * Static method. Checks the equality of two matrices `a` and `b`.
   * @param {Matrix} a
   * @param {Matrix} b
   * @returns {Boolean} `true` if equal, `false` otherwise
   **/
  Matrix.equals = function (a, b) {
    return a.equals(b);
  };

  /**
   * Checks the equality of `matrix` and current matrix.
   * @param {Matrix} matrix
   * @returns {Boolean} `true` if equal, `false` otherwise
   **/
  Matrix.prototype.equals = function (matrix) {
    var r = this.shape[0],
        c = this.shape[1],
        size = r * c,
        d1 = this.data,
        d2 = matrix.data;

    if (r !== matrix.shape[0] || c !== matrix.shape[1] || this.type !== matrix.type)
      return false;

    var i;
    for (i = 0; i < size; i++)
      if (d1[i] !== d2[i])
        return false;

    return true;
  };

  /**
   * Gets the value of the element in row `i`, column `j` of current matrix
   * @param {Number} i
   * @param {Number} j
   * @returns {Number} the element at row `i`, column `j` of current matrix
   **/
  Matrix.prototype.get = function (i, j) {
    if (i < 0 || j < 0 || i > this.shape[0] - 1 || j > this.shape[1] - 1)
      throw new Error('index out of bounds');

    return this.data[i * this.shape[1] + j];
  };

  /**
   * Sets the element at row `i`, column `j` to value
   * @param {Number} i
   * @param {Number} j
   * @param {Number} value
   * @returns {Matrix} `this`
   **/
  Matrix.prototype.set = function (i, j, value) {
    if (i < 0 || j < 0 || i > this.shape[0] - 1 || j > this.shape[1] - 1)
      throw new Error('index out of bounds');

    this.data[i * this.shape[1] + j] = value;
    return this;
  };

  /**
   * Swaps two rows `i` and `j` in a matrix
   * @param {Number} i
   * @param {Number} j
   * @returns {Matrix} `this`
   **/
  Matrix.prototype.swap = function (i, j) {
    if (i < 0 || j < 0 || i > this.shape[0] - 1 || j > this.shape[0] - 1)
      throw new Error('index out of bounds');

    var c = this.shape[1];

    // copy first row
    var copy = this.data.slice(i * c, (i + 1) * c);
    // move second row into first row spot
    this.data.copyWithin(i * c, j * c, (j + 1) * c);
    // copy first row back into second row spot
    this.data.set(copy, j * c);

    return this;
  };

  /**
   * Maps a function `callback` to all elements of a copy of current matrix.
   * @param {Function} callback
   * @returns {Matrix} the resultant mapped matrix
   **/
  Matrix.prototype.map = function (callback) {
    var r = this.shape[0],
        c = this.shape[1],
        size = r * c,
        mapped = new Matrix(this),
        data = mapped.data,
        i;

    for (i = 0; i < size; i++)
      data[i] = callback.call(mapped, data[i], i / c | 0, i % c, data);

    return mapped;
  };

  /**
   * Functional version of for-looping the elements in a matrix, is
   * equivalent to `Array.prototype.forEach`.
   * @param {Function} callback
   * @returns {Matrix} `this`
   **/
  Matrix.prototype.each = function (callback) {
    var r = this.shape[0],
        c = this.shape[1],
        size = r * c,
        i;

    for (i = 0; i < size; i++)
      callback.call(this, this.data[i], i / c | 0, i % c);

    return this;
  };

  /**
   * Equivalent to `TypedArray.prototype.reduce`.
   * @param {Function} callback
   * @param {Number} initialValue
   * @returns {Number} result of reduction
   **/
  Matrix.prototype.reduce = function (callback, initialValue) {
    var r = this.shape[0],
        c = this.shape[1],
        size = r * c;

    if (size === 0 && !initialValue)
      throw new Error('Reduce of empty matrix with no initial value.');

    var i = 0,
        value = initialValue || this.data[i++];

    for (; i < size; i++)
      value = callback.call(this, value, this.data[i], i / c | 0, i % c);
    return value;
  };

  /**
   * Finds the rank of the matrix using row echelon form
   * @returns {Number} rank
   **/
  Matrix.prototype.rank = function () {
    var vectors = this
      .toArray()
      .map(function(r) {
        return new Vector(r);
      });

    var r = this.shape[0],
        c = this.shape[1],
        counter = 0,
        i, j, tmp,
        pivot, target, scalar;

    for (i = 0; i < r - 1; i++) {
      // go through each row until the row before the last
      pivot = null;
      for (j = i; j < r; j++) {
        // find the pivot (first row where column of same index is non-zero)
        if (vectors[i].get(i)) {
          if (i !== j) {
            // if not the current row, swap the rows, bring pivot the current row index
            tmp = vectors[i];
            vectors[i] = vectors[j];
            vectors[j] = tmp;
          }
          pivot = vectors[i];
          break;
        }
      }
      // if pivot not found, continue
      if (!pivot)
        continue;

      // otherwise, for all rows underneath pivot, cancel all column index to zero
      for (j = (i + 1); j < r; j++) {
        target = vectors[j];
        scalar = target.get(i) / pivot.get(i);
        vectors[j] = target.subtract(pivot.scale(scalar));
      }
    }

    // now vectors should be in row echelon form!
    // use optimized loops to count number of vectors that have non-zero values
    for (i = 0; i < r; i++) {
      for (j = 0; j < c; j++) {
        if (vectors[i].get(j)) {
          counter++;
          break;
        }
      }
    }

    // should be rank
    return counter;
  };

  Matrix.rank = function (matrix) {
    return new Matrix(matrix).rank();
  };

  /**
   * Converts current matrix into a readable formatted string
   * @returns {String} a string of the matrix' contents
   **/
  Matrix.prototype.toString = function () {
    var result = [],
        r = this.shape[0],
        c = this.shape[1],
        i;

    for (i = 0; i < r; i++)
      // get string version of current row and store it
      result.push('[' + this.data.subarray(i * c, (i + 1) * c ).toString() + ']');

    return '[' + result.join(', \n') + ']';
  };

  /**
   * Converts current matrix into a two-dimensional array
   * @returns {Array} an array of the matrix' contents
   **/
  Matrix.prototype.toArray = function () {
    var result = [],
        r = this.shape[0],
        c = this.shape[1],
        i;

    for (i = 0; i < r; i++)
      // copy current row into a native array and store it
      result.push(Array.prototype.slice.call(this.data.subarray(i * c, (i + 1) * c)));

    return result;
  };

  module.exports = Matrix;
  try {
    window.Matrix = Matrix;
  } catch (e) {}
}());

},{"./vector":2}],2:[function(require,module,exports){
(function () {
  'use strict';

  /**
   * @method constructor
   * @desc Creates a two-dimensional `Vector` from the supplied arguments.
   **/
  function Vector (data) {
    this.type = Float64Array;
    this.length = 0;

    if (data instanceof Vector) {
      this.combine(data);
    } else if (data && data.shape) {
      this.data = new data.type(data.data);
      this.length = data.shape[0] * data.shape[1];
      this.type = data.type;
    } else if (data instanceof Array) {
      this.data = new this.type(data);
      this.length = data.length;
    } else if (data && data.buffer && data.buffer instanceof ArrayBuffer) {
      this.data = data;
      this.length = data.length;
      this.type = data.constructor;
    }
  }

  /**
   * Static method. Perform binary operation on two vectors `a` and `b` together.
   * @param {Vector} a
   * @param {Vector} b
   * @param {function } op
   * @returns {Vector} a vector containing the results of binaery operation of `a` and `b`
   **/
  Vector.binOp = function(a, b, op) {
    return new Vector(a).binOp(b, op);
  };

  /**
   * Perform binary operation on `vector` to the current vector.
   * @param {Vector} vector
   * @param {function } op
   * @returns {Vector} this
   **/
  Vector.prototype.binOp = function(vector, op) {
    var l1 = this.length,
        l2 = vector.length;
    if (l1 !== l2)
      throw new Error('sizes do not match!');
    if (!l1 && !l2)
      return this;

    var i;
    for (i = 0; i < l1; i++)
      this.data[i] = op(this.data[i], vector.data[i], i);

    return this;
  };

  /**
   * Static method. Adds two vectors `a` and `b` together.
   * @param {Vector} a
   * @param {Vector} b
   * @returns {Vector} a vector containing the sum of `a` and `b`
   **/
  Vector.add = function (a, b) {
    return new Vector(a).add(b);
  };

  /**
   * Adds `vector` to the current vector.
   * @param {Vector} vector
   * @returns {Vector} this
   **/
  Vector.prototype.add = function (vector) {
    return this.binOp(vector, function(a, b) { return a + b });
  };

  /**
   * Static method. Subtracts the vector `b` from vector `a`.
   * @param {Vector} a
   * @param {Vector} b
   * @returns {Vector} a vector containing the difference between `a` and `b`
   **/
  Vector.subtract = function (a, b) {
    return new Vector(a).subtract(b);
  };

  /**
   * Subtracts `vector` from the current vector.
   * @param {Vector} vector
   * @returns {Vector} this
   **/
  Vector.prototype.subtract = function (vector) {
    return this.binOp(vector, function(a, b) { return a - b });
  };

  /**
   * Static method. Multiplies all elements of `vector` with a specified `scalar`.
   * @param {Vector} vector
   * @param {Number} scalar
   * @returns {Vector} a resultant scaled vector
   **/
  Vector.scale = function (vector, scalar) {
    return new Vector(vector).scale(scalar);
  };

  /**
   * Multiplies all elements of current vector with a specified `scalar`.
   * @param {Number} scalar
   * @returns {Vector} this
   **/
  Vector.prototype.scale = function (scalar) {
    return this.each(function(value, i, data){
      data[i] *= scalar;
    });
  };

  /**
   * Static method. Normalizes `vector`, i.e. divides all elements with the magnitude.
   * @param {Vector} vector
   * @returns {Vector} a resultant normalized vector
   **/
  Vector.normalize = function (vector) {
    return new Vector(vector).normalize();
  };

  /**
   * Normalizes current vector.
   * @returns {Vector} a resultant normalized vector
   **/
  Vector.prototype.normalize = function () {
    return this.scale(1 / this.magnitude());
  };

  /**
   * Static method. Projects the vector `a` onto the vector `b` using
   * the projection formula `(b * (a * b / b * b))`.
   * @param {Vector} a
   * @param {Vector} b
   * @returns {Vector} a new resultant projected vector
   **/
  Vector.project = function (a, b) {
    return a.project(new Vector(b));
  };

  /**
   * Projects the current vector onto `vector` using
   * the projection formula `(b * (a * b / b * b))`.
   * @param {Vector} vector
   * @returns {Vector} `vector`
   **/
  Vector.prototype.project = function (vector) {
    return vector.scale(this.dot(vector) / vector.dot(vector));
  };

   /**
   * Static method. Creates a vector containing optional 'value' (default 0) of `count` size, takes
   * an optional `type` argument which should be an instance of `TypedArray`.
   * @param {Number} count
   * @param {Number || function } value
   * @param {TypedArray} type
   * @returns {Vector} a new vector of the specified size and `type`
   **/
  Vector.fill = function (count, value, type) {
    if (count < 0)
      throw new Error('invalid size');
    else if (count === 0)
      return new Vector();
   
    value = value || +0.0;
    type = type || Float64Array;
    var data = new type(count),
        isValueFn = typeof value === 'function',
        i;

    for (i = 0; i < count; i++)
      data[i] = isValueFn ? value(i) : value;

    return new Vector(data);
  };
  
  /**
   * Static method. Creates a vector containing zeros (`0`) of `count` size, takes
   * an optional `type` argument which should be an instance of `TypedArray`.
   * @param {Number} count
   * @param {TypedArray} type
   * @returns {Vector} a new vector of the specified size and `type`
   **/
  Vector.zeros = function (count, type) {
    return Vector.fill(count, +0.0, type);
  };

  /**
   * Static method. Creates a vector containing ones (`1`) of `count` size, takes
   * an optional `type` argument which should be an instance of `TypedArray`.
   * @param {Number} count
   * @param {TypedArray} type
   * @returns {Vector} a new vector of the specified size and `type`
   **/
  Vector.ones = function (count, type) {
    return Vector.fill(count, 1, type);
  };

  /**
   * Static method. Creates a vector of `count` elements containing random
   * values according to a normal distribution, takes an optional `type`
   * argument which should be an instance of `TypedArray`.
   * @param {Number} count
   * @param {Number} deviation (default 1)
   * @param {Number} mean (default 0)
   * @param {TypedArray} type
   * @returns {Vector} a new vector of the specified size and `type`
   **/
  Vector.random = function (count, deviation, mean, type) {
    deviation = deviation || 1;
    mean = mean || 0;
    return Vector.fill(count, function() {
      return deviation * Math.random() + mean;
    }, type);
  };

  /**
   * Static method. Creates a vector containing a range (can be either ascending or descending)
   * of numbers specified by the arguments provided (e.g. `Vector.range(0, .5, 2)`
   * gives a vector containing all numbers in the interval `[0, 2)` separated by
   * steps of `0.5`), takes an optional `type` argument which should be an instance of
   * `TypedArray`.
   * @param {Number} start
   * @param {Number} step - optional
   * @param {Number} end
   * @returns {Vector} a new vector containing the specified range of the specified `type`
   **/
  Vector.range = function () {
    var args = [].slice.call(arguments, 0),
        backwards = false,
        start, step, end;

    var type = Float64Array;
    if (typeof args[args.length - 1] === 'function')
      type = args.pop();

    switch(args.length) {
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

    if (step > end - start)
      throw new Error('invalid range');

    var data = new type(Math.ceil((end - start) / step)),
        i, j;
    for (i = start, j = 0; i < end; i += step, j++)
      data[j] = backwards ? end - i + start : i;

    return new Vector(data);
  };

  /**
   * Static method. Performs dot multiplication with two vectors `a` and `b`.
   * @param {Vector} a
   * @param {Vector} b
   * @returns {Number} the dot product of the two vectors
   **/
  Vector.dot = function (a, b) {
    return a.dot(b);
  };

  /**
   * Performs dot multiplication with current vector and `vector`
   * @param {Vector} vector
   * @returns {Number} the dot product of the two vectors
   **/
  Vector.prototype.dot = function (vector) {
    if (this.length !== vector.length)
      throw new Error('sizes do not match');

    var a = this.data,
        b = vector.data,
        result = 0,
        i, l;

    for (i = 0, l = this.length; i < l; i++)
      result += a[i] * b[i];

    return result;
  };

  /**
   * Calculates the magnitude of a vector (also called L2 norm or Euclidean length).
   * @returns {Number} the magnitude (L2 norm) of the vector
   **/
  Vector.prototype.magnitude = function () {
    if (!this.length)
      return 0;

    var result = 0,
        data = this.data,
        i, l;
    for (i = 0, l = this.length; i < l; i++)
      result += data[i] * data[i];

    return Math.sqrt(result);
  };

  /**
   * Static method. Determines the angle between two vectors `a` and `b`.
   * @param {Vector} a
   * @param {Vector} b
   * @returns {Number} the angle between the two vectors in radians
   **/
  Vector.angle = function (a, b) {
    return a.angle(b);
  };

  /**
   * Determines the angle between the current vector and `vector`.
   * @param {Vector} vector
   * @returns {Number} the angle between the two vectors in radians
   **/
  Vector.prototype.angle = function (vector) {
    return Math.acos(this.dot(vector) / this.magnitude() / vector.magnitude());
  };

  /**
   * Static method. Checks the equality of two vectors `a` and `b`.
   * @param {Vector} a
   * @param {Vector} b
   * @returns {Boolean} `true` if the two vectors are equal, `false` otherwise
   **/
  Vector.equals = function (a, b) {
    return a.equals(b);
  };

  /**
   * Checks the equality of the current vector and `vector`.
   * @param {Vector} vector
   * @returns {Boolean} `true` if the two vectors are equal, `false` otherwise
   **/
  Vector.prototype.equals = function (vector) {
    if (this.length !== vector.length)
      return false;

    var a = this.data,
        b = vector.data,
        length = this.length,
        i = 0;

    while (i < length && a[i] === b[i])
      i++;
    return i === length;
  };

  /**
   * Gets the minimum value (smallest) element of current vector.
   * @returns {Number} the smallest element of the current vector
   **/
  Vector.prototype.min = function () {
    return this.reduce(function(acc, item) {
      return Math.min(acc, item);
    }, Number.POSITIVE_INFINITY);
  };

  /**
   * Gets the maximum value (largest) element of current vector.
   * @returns {Number} the largest element of current vector
   **/
  Vector.prototype.max = function () {
    return this.reduce(function(acc, item) {
      return Math.max(acc, item);
    }, Number.NEGATIVE_INFINITY);
  };

  /**
   * Check if `index` is within the bound for current vector.
   * @param {Number} index
   **/
  Vector.prototype.check = function (index) {  
    if (index < 0 || index > this.length - 1)
      throw new Error('index out of bounds');
  }

  /**
   * Gets the element at `index` from current vector.
   * @param {Number} index
   * @returns {Number} the element at `index`
   **/
  Vector.prototype.get = function (index) {
    this.check(index);
    return this.data[index];
  };

  /**
   * Sets the element at `index` to `value`.
   * @param {Number} index
   * @param {Number} value
   * @returns {Vector} this
   **/
  Vector.prototype.set = function (index, value) {
    this.check(index);
    this.data[index] = value;
    return this;
  };

  /**
   * Convenience property for vector[0]
   * @property {Number}
   * @name Vector#x
   */

  /**
   * Convenience property for vector[1]
   * @property {Number}
   * @name Vector#y
   */

  /**
   * Convenience property for vector[2]
   * @property {Number}
   * @name Vector#z
   */

  /**
   * Convenience property for vector[3]
   * @property {Number}
   * @name Vector#w
   */

  function indexProperty(index) {
    return {
      get: function() { return this.get(index); },
      set: function(value) { return this.set(index, value) }
    };
  }

  Object.defineProperties(Vector.prototype, {
    x: indexProperty(0),
    y: indexProperty(1),
    z: indexProperty(2),
    w: indexProperty(3)
  });

  /**
   * Static method. Combines two vectors `a` and `b` (appends `b` to `a`).
   * @param {Vector} a
   * @param {Vector} b
   * @returns {Vector} `b` appended to vector `a`
   **/
  Vector.combine = function (a, b) {
    return new Vector(a).combine(b);
  };

  /**
   * Combines the current vector with `vector`
   * @param {Vector} vector
   * @returns {Vector} `vector` combined with current vector
   **/
  Vector.prototype.combine = function (vector) {
    if (!vector.length)
      return this;
    if (!this.length) {
      this.data = new vector.type(vector.data);
      this.length = vector.length;
      this.type = vector.type;
      return this;
    }

    var l1 = this.length,
        l2 = vector.length,
        d1 = this.data,
        d2 = vector.data;

    var data = new this.type(l1 + l2);
    data.set(d1);
    data.set(d2, l1);

    this.data = data;
    this.length = l1 + l2;

    return this;
  };

  /**
   * Pushes a new `value` into current vector.
   * @param {Number} value
   * @returns {Vector} `this`
   **/
  Vector.prototype.push = function (value) {
    return this.combine(new Vector([value]));
  };

  /**
   * Maps a function `callback` to all elements of current vector.
   * @param {Function} callback
   * @returns {Vector} `this`
   **/
  Vector.prototype.map = function (callback) {
    var mapped = new Vector(this),
        data = mapped.data,
        i;
    for (i = 0; i < this.length; i++)
      data[i] = callback.call(mapped, data[i], i, data);

    return mapped;
  };

  /**
   * Functional version of for-looping the vector, is equivalent
   * to `Array.prototype.forEach`.
   * @param {Function} callback
   * @returns {Vector} `this`
   **/
  Vector.prototype.each = function (callback) {
    var i;
    for (i = 0; i < this.length; i++)
      callback.call(this, this.data[i], i, this.data);

    return this;
  };

  /**
   * Equivalent to `TypedArray.prototype.reduce`.
   * @param {Function} callback
   * @param {Number} initialValue
   * @returns {Number} result of reduction
   **/
  Vector.prototype.reduce = function (callback, initialValue) {
    var l = this.length;
    if (l === 0 && !initialValue)
      throw new Error('Reduce of empty matrix with no initial value.');

    var i = 0,
        value = initialValue || this.data[i++];

    for (; i < l; i++)
      value = callback.call(this, value, this.data[i], i, this.data);
    return value;
  };

  /**
   * Converts current vector into a readable formatted string.
   * @returns {String} a string of the vector's contents
   **/
  Vector.prototype.toString = function () {
    var result = ['['],
        i;
    for (i = 0; i < this.length; i++)
      result.push(i > 0 ? ', ' + this.data[i] : this.data[i]);
    
    result.push(']');

    return result.join('');
  };

  /**
   * Converts current vector into a JavaScript array.
   * @returns {Array} an array containing all elements of current vector
   **/
  Vector.prototype.toArray = function () {
    if (!this.data)
      return [];

    return Array.prototype.slice.call(this.data);
  };

  module.exports = Vector;
  try {
    window.Vector = Vector;
  } catch (e) {}
}());

},{}],3:[function(require,module,exports){
(function () {
  'use strict';

  var Vector = module.exports.Vector = require('./vector'),
      Matrix = module.exports.Matrix = require('./matrix');
}());

},{"./matrix":1,"./vector":2}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Renderer = require('./Renderer');

var _Renderer2 = _interopRequireDefault(_Renderer);

var _PrimitiveComponent2 = require('./PrimitiveComponent');

var _PrimitiveComponent3 = _interopRequireDefault(_PrimitiveComponent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * A circle
 */
var Circle = function (_PrimitiveComponent) {
    _inherits(Circle, _PrimitiveComponent);

    //TODO: provide details about options for docs - link to a separate page
    /**
     * PrimitiveComponent constructor
     * @param {object} options object settings
     */
    function Circle(options) {
        _classCallCheck(this, Circle);

        /**
         * the radius of the circle
         * @type {number} radius
         */
        var _this = _possibleConstructorReturn(this, (Circle.__proto__ || Object.getPrototypeOf(Circle)).call(this, options));

        _this.radius = options.radius || 0;
        return _this;
    }

    /**
     * get the bounding box of the circle;
     * @type {{top:number, left: number, bottom:number, right:number}}
     */


    _createClass(Circle, [{
        key: 'render',


        /**
         * override the render function for drawing circles specifically
         * @override
         */
        value: function render() {
            //the below is to ensure the proper placement when scaling/line widths are accounted for
            var scale = this.compoundScale;
            var lineWidth = this.style.lineWidth;
            _Renderer2.default.drawCircle(this.radius * scale.scaleWidth + lineWidth, this.radius * scale.scaleHeight + lineWidth, this.radius * scale.scaleWidth, this._prerenderingContext, this.style);
        }

        /**
         * determine whether the point is in the object
         * basically just the pythagorean theorem
         * @param {number} x the x coordinate
         * @param {number} y the y coordinate
         * @return {boolean} whether or not the point is in the object
         */

    }, {
        key: 'pointIsInObject',
        value: function pointIsInObject(x, y) {

            var offset = this.offset;

            //don't bother checking the bounding box because
            //pythagorean formula is closed-form
            var a = x - offset.x;
            var b = y - offset.y;
            var c = this.radius;

            //thanks pythagoras~!
            return a * a + b * b <= c * c;
            //use the below when scaling is reimplemented
            /*
            return (
            CanvasObject.prototype.PointIsInObject.call(this, x, y) &&
            Math.pow((x - this.offset.x), 2) / Math.pow((this.radius * this.GlobalScale.scaleWidth), 2) + Math.pow((y - this.offset.y), 2) / Math.pow((this.radius * this.GlobalScale.scaleHeight), 2) <= 1
            );*/
        }
    }, {
        key: 'boundingBox',
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
}(_PrimitiveComponent3.default);

exports.default = Circle;

},{"./PrimitiveComponent":9,"./Renderer":11}],5:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

var _PrimitiveComponent2 = require('./PrimitiveComponent');

var _PrimitiveComponent3 = _interopRequireDefault(_PrimitiveComponent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * The Composition class is an extension of the Primitive that is
 * composed of other extensions of the Primitive. The Composition
 * is used to establish the Scene graph as the parent of all other
 * objects on screen. This is the key abstraction of the [composite
 * pattern](https://en.wikipedia.org/wiki/Composite_pattern): an
 * action taken on the parent element acts upon all of the children,
 * and transatively, all of their children.
 */
var Composition = function (_PrimitiveComponent) {
    _inherits(Composition, _PrimitiveComponent);

    /**
     * @param {object} options object settings
     */
    function Composition(options) {
        _classCallCheck(this, Composition);

        var _this = _possibleConstructorReturn(this, (Composition.__proto__ || Object.getPrototypeOf(Composition)).call(this, options));

        options = options || {};
        _this._children = options.children || [];
        return _this;
    }

    /**
     * children of this composition
     * @type {Array} children the which compose this object
     */


    _createClass(Composition, [{
        key: 'childrenAt',


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
        key: 'childAt',
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
        key: 'addChild',
        value: function addChild(child) {
            child.parent = this;
            this.children.push(child);
            _set(Composition.prototype.__proto__ || Object.getPrototypeOf(Composition.prototype), 'needsRender', true, this);
            _set(Composition.prototype.__proto__ || Object.getPrototypeOf(Composition.prototype), 'needsDraw', true, this);
            //TODO: make this hook more generic
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
        key: 'removeChild',
        value: function removeChild(child) {
            if (child) {
                var index = this.children.indexOf(child);
                if (index >= 0) {
                    _set(Composition.prototype.__proto__ || Object.getPrototypeOf(Composition.prototype), 'needsRender', true, this);
                    _set(Composition.prototype.__proto__ || Object.getPrototypeOf(Composition.prototype), 'needsDraw', true, this);
                    return this.children.splice(index, 1);
                }
            }
        }
    }, {
        key: 'render',


        /**
         * @override
         * override the render functiont to render the children onto this compositions prerendering canvas
         */
        value: function render() {
            // required to make sure that the drawing occurs within the bounds of this composition
            var offset = {
                top: -this.boundingBox.top,
                left: -this.boundingBox.left,
                bottom: -this.boundingBox.bottom,
                right: -this.boundingBox.right
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
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
                    }
                } finally {
                    if (_didIteratorError) {
                        throw _iteratorError;
                    }
                }
            }

            ;

            // `destination-out` will erase things
            //this._prerenderingContext.globalCompositeOperation = 'destination-out';
            //_.each(this.masks, function (m) {
            //m.draw(renderContext, contextOffset);
            //});
            //renderContext.globalCompositeOperation = 'normal';
        }
    }, {
        key: 'children',
        get: function get() {
            return this._children;
        }

        /**
         * the bounding box of the composition (i.e., the containing bounds of all the children of this composition)
         * @type {{top:number, left:number, right:number, bottom:number}} boundingBox
         */

    }, {
        key: 'boundingBox',
        get: function get() {
            var top = null,
                left = null,
                bottom = null,
                right = null;

            var _iteratorNormalCompletion2 = true;
            var _didIteratorError2 = false;
            var _iteratorError2 = undefined;

            try {
                for (var _iterator2 = this.children[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                    var c = _step2.value;

                    top = top !== null && top < c.boundingBox.top ? top : c.boundingBox.top;
                    left = left !== null && left < c.boundingBox.left ? left : c.boundingBox.left;
                    bottom = bottom !== null && bottom > c.boundingBox.bottom ? bottom : c.boundingBox.bottom;
                    right = right !== null && right > c.boundingBox.right ? right : c.boundingBox.right;
                }
            } catch (err) {
                _didIteratorError2 = true;
                _iteratorError2 = err;
            } finally {
                try {
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
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
}(_PrimitiveComponent3.default);

exports.default = Composition;

},{"./PrimitiveComponent":9}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Renderer = require('./Renderer');

var _Renderer2 = _interopRequireDefault(_Renderer);

var _PrimitiveComponent2 = require('./PrimitiveComponent');

var _PrimitiveComponent3 = _interopRequireDefault(_PrimitiveComponent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * An ellipse
 */
var Ellipse = function (_PrimitiveComponent) {
    _inherits(Ellipse, _PrimitiveComponent);

    /**
     * @param {object} options options for the ellipse
     * @param {number} options.radius the major (horizontal) radius of the ellipse
     * @param {number} options.minorRadius the minor (vertical) radius of the ellipse
     */
    function Ellipse(options) {
        _classCallCheck(this, Ellipse);

        /**
         * @type {number} radius the major radius (horizontal) of the ellipse
         */
        var _this = _possibleConstructorReturn(this, (Ellipse.__proto__ || Object.getPrototypeOf(Ellipse)).call(this, options));

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
        key: 'render',


        /**
         * override the render function specifically for ellipses
         * @override
         */
        value: function render() {
            var scale = this.compoundScale;
            var lineWidth = this.style.lineWidth;
            //TODO: work out scaling of major/minor radius
            //this doesn't make sense
            _Renderer2.default.drawEllipse(this.radius * scale.scaleWidth + lineWidth, this.minorRadius * scale.scaleHeight + lineWidth, this.radius * scale.scaleWidth, this.minorRadius * scale.scaleHeight, this._prerenderingContext, this.style);
        }
        /**
         * determine whether the point is in the object
         * basically just the pythagorean theorem
         * @param {number} x the x coordinate
         * @param {number} y the y coordinate
         * @return {boolean} whether or not the point is in the object
         */

    }, {
        key: 'pointIsInObject',
        value: function pointIsInObject(x, y) {
            var scale = this.compoundScale;
            var offset = this.offset;

            var a = x - offset.x;
            var b = y - offset.y;

            var c1 = this.radius * scale.scaleWidth;
            var c2 = this.minorRadius * scale.scaleHeight;

            //see: http://math.stackexchange.com/questions/76457/check-if-a-point-is-within-an-ellipse
            return a * a / (c1 * c1) + b * b / (c2 * c2) <= 1;
        }
    }, {
        key: 'boundingBox',
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
}(_PrimitiveComponent3.default);

exports.default = Ellipse;

},{"./PrimitiveComponent":9,"./Renderer":11}],7:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Renderer = require('./Renderer');

var _Renderer2 = _interopRequireDefault(_Renderer);

var _PrimitiveComponent2 = require('./PrimitiveComponent');

var _PrimitiveComponent3 = _interopRequireDefault(_PrimitiveComponent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * an Image
 */
var Image = function (_PrimitiveComponent) {
    _inherits(Image, _PrimitiveComponent);

    /**
     * @param {Object} options
     */
    function Image(options) {
        _classCallCheck(this, Image);

        /**
         * @type {window.Image} unscaledImage the original image
         */
        var _this = _possibleConstructorReturn(this, (Image.__proto__ || Object.getPrototypeOf(Image)).call(this, options));

        _this.unscaledImage = options.image;
        return _this;
    }

    /**
     * get the bounding box
     * @type {{top: number, left: number, bottom: number, right:number}} boundingBox
     */


    _createClass(Image, [{
        key: 'render',


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
            _Renderer2.default.drawImage(0, 0, image, this._prerenderingContext, this.style);
        }
    }, {
        key: 'boundingBox',
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
}(_PrimitiveComponent3.default);

exports.default = Image;

},{"./PrimitiveComponent":9,"./Renderer":11}],8:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _withoutblas = require('vectorious/withoutblas');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * A line
 */
var Line = function () {
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
        this.p2 = _withoutblas.Vector.add(this.p1, this.direction);
    }

    /**
     * determine the location that this line intersects with another, if at all
     * @param {object} l the Line to test for intersection against this Line
     * @return {object} the vector of the location of intersection, or null if the lines are parallel
     */


    _createClass(Line, [{
        key: 'intersectionWith',
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
        key: 'intersection',
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
            return new _withoutblas.Vector([xNumerator / denominator, yNumerator / denominator]);
        }
    }]);

    return Line;
}();

exports.default = Line;

},{"vectorious/withoutblas":3}],9:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _withoutblas = require('vectorious/withoutblas');

var _Renderer = require('./Renderer');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * The base class of things that may be drawn on the canvas.
 * All drawable objects should inherit from this class.
 * Typically, it is unnecessary for application programmers to
 * call this directly, although they may wish to extend their own
 * classes with it.
 */
var PrimitiveComponent = function () {
    /**
     * @param {object} options
     */
    function PrimitiveComponent(options) {
        _classCallCheck(this, PrimitiveComponent);

        options = options || {};

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
        this._d = new _withoutblas.Vector([options.x || 0, options.y || 0]);

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
        key: 'enableDragging',


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
        key: 'disableDragging',
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
        key: 'dragStart',
        value: function dragStart(e) {
            //TODO: should probably be using an event registry so
            //multiple event callbacks can be registered
            this._mouseOffset = new _withoutblas.Vector([e.offsetX, e.offsetY]).subtract(this.offset);
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
        key: 'drag',
        value: function drag(e) {
            this.d = new _withoutblas.Vector([e.offsetX, e.offsetY]).subtract(this._mouseOffset);
            this.needsDraw = true;
        }

        /**
         * when dragging ends, update events
         * @param {object} e the event object
         */

    }, {
        key: 'dragEnd',
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
        key: 'draw',
        value: function draw(context, offset) {
            this.needsDraw = false;

            if (this.needsRender && this.render) {
                //ditch any old rendering artifacts - they are no longer viable
                delete this._prerenderingCanvas;
                delete this._prerenderingContext;

                //create a new canvas and context for rendering
                this._prerenderingCanvas = document.createElement('canvas');
                this._prerenderingContext = this._prerenderingCanvas.getContext('2d'); //text needs prerendering context defined for boundingBox measurements

                //make sure the new canvas has the appropriate dimensions
                this._prerenderingCanvas.width = this.boundingBox.right - this.boundingBox.left;
                this._prerenderingCanvas.height = this.boundingBox.bottom - this.boundingBox.top;

                this.render();
                this.needsRender = false;
            }

            //TODO: handle debug options
            //draw bounding boxes
            /*if (this.flags.DEBUG) {
            	this._prerenderingContext.beginPath();
            	this._prerenderingContext.lineWidth=2.0;
            	this._prerenderingContext.strokeStyle='#FF0000';
            	this._prerenderingContext.strokeRect(0,0,this._prerenderedImage.width, this._prerenderedImage.height);
            	this._prerenderingContext.closePath();
            }*/

            //TODO: handle bounding box drawing
            /*if (this.drawBoundingBox){
            	this._prerenderingContext.beginPath();
            	this._prerenderingContext.lineWidth=2.0;
            	this._prerenderingContext.strokeStyle=this.boundingBoxColor;
            	this._prerenderingContext.strokeRect(0,0,this._prerenderedImage.width, this._prerenderedImage.height);
            	this._prerenderingContext.closePath();
            }*/

            //offsets are for prerendering contexts of compositions
            var x = this.boundingBox.left + (offset && offset.left ? offset.left : 0);
            var y = this.boundingBox.top + (offset && offset.top ? offset.top : 0);
            _Renderer.Renderer.drawImage(x, y, this._prerenderingCanvas, context, this.style);
        }

        //TODO: provide more doc details around this
        /**
         * this method must be overridden by a subclass.
         *
         * the render method should be implemented by subclasses
         * @abstract
         */

    }, {
        key: 'render',
        value: function render() {}

        /**
         * check whether the point specified lies *inside* this objects bounding box
         *
         * @param {number} x the x coordinate
         * @param {number} y the y coordinate
         * @return {boolean} whether the point is within the bounding box
         */

    }, {
        key: 'pointIsInBoundingBox',
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
        key: 'pointIsInObject',
        value: function pointIsInObject(x, y) {
            return this.pointIsInBoundingBox(x, y);
        }

        /**
         * move the object on top of other objects (render last)
         */

    }, {
        key: 'moveToFront',
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
        key: 'moveToBack',
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
        key: 'moveForward',
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
        key: 'moveBackward',
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
        key: 'offset',
        get: function get() {
            return this.parent ? _withoutblas.Vector.add(this.d, this.parent.offset) : this.d;
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
        key: 'needsDraw',
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
        key: 'needsRender',
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
        key: 'scaleWidth',
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
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
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
        key: 'scaleHeight',
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
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
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
        key: 'scale',
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
        key: 'compoundScale',
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
        key: 'd',
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
        key: 'parent',
        get: function get() {
            return this._parent;
        }
        //TODO: provide links to things
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

exports.default = PrimitiveComponent;

},{"./Renderer":11,"vectorious/withoutblas":3}],10:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Renderer = require('./Renderer');

var _Renderer2 = _interopRequireDefault(_Renderer);

var _PrimitiveComponent2 = require('./PrimitiveComponent');

var _PrimitiveComponent3 = _interopRequireDefault(_PrimitiveComponent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/**
 * A rectangle
 */
var Rectangle = function (_PrimitiveComponent) {
  _inherits(Rectangle, _PrimitiveComponent);

  /**
   * @param {object} options the options for the object
   */
  function Rectangle(options) {
    _classCallCheck(this, Rectangle);

    /**
     * the width of the rectangle
     * @type {number} width
     */
    var _this = _possibleConstructorReturn(this, (Rectangle.__proto__ || Object.getPrototypeOf(Rectangle)).call(this, options));

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
    key: 'render',


    /**
     * render the rectangle
     * @override
     */
    value: function render() {
      var compoundScale = this.compoundScale;
      _Renderer2.default.drawRectangle(this.style.lineWidth, this.style.lineWidth, this.width * compoundScale.scaleWidth, this.height * compoundScale.scaleHeight, this._prerenderingContext, this.style);
    }
  }, {
    key: 'boundingBox',
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
}(_PrimitiveComponent3.default);

exports.default = Rectangle;

},{"./PrimitiveComponent":9,"./Renderer":11}],11:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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
    textBaseline: 'alphabetic'
};

//TODO: masking? it looks like this is done in the Composition, but that may be bugged out.

/**
 * A collection of high level static methods for drawing directly to canvas
 *
 */

var Renderer = function () {
    function Renderer() {
        _classCallCheck(this, Renderer);
    }

    _createClass(Renderer, null, [{
        key: 'clearRect',

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
        key: 'drawPath',
        value: function drawPath(vertices, context, style) {
            Object.assign(context, style);
            context.beginPath();
            var started = false;
            var x = 0;
            var y = 0;
            for (var v in vertices) {
                x = vertices[v].x;
                y = vertices[v].y;
                if (!started) {
                    context.moveTo(x, y);
                    started = true;
                } else {
                    context.lineTo(x, y);
                }
            }
            context.stroke();
            context.closePath();
        }

        /**
         * Draw a closed polygon with the given vertices
         * @param {object} vertices the path of vertices to be drawn
         * @param {object} context the 2D Context object for the canvas we're drawing onto
         * @param {object} style the style options to be used when drawing the polygon
         */

    }, {
        key: 'drawPolygon',
        value: function drawPolygon(vertices, context, style) {
            Object.assign(context, style);
            context.beginPath();
            var started = false;
            var x = 0;
            var y = 0;
            for (var v in vertices) {
                x = vertices[v].x;
                y = vertices[v].y;
                if (!started) {
                    context.moveTo(x, y);
                    started = true;
                } else {
                    context.lineTo(x, y);
                }
            }
            context.lineTo(vertices[0].x, vertices[0].y);
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
        key: 'drawRectangle',
        value: function drawRectangle(x, y, width, height, context, style) {
            Object.assign(context, style);
            context.beginPath();
            context.rect(x, y, width, height);
            context.fill();
            context.stroke();
            context.closePath();
        }

        //TODO: provide support for rotation and startAngle parameters
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
        key: 'drawEllipse',
        value: function drawEllipse(x, y, radius, minorRadius, context, style) {
            Object.assign(context, style);
            context.beginPath();
            //TODO: 2017-05-22 this is currently not supported by IE
            context.ellipse(x, y, radius, minorRadius, 0, 0, 2 * Math.PI);
            context.fill();
            context.stroke();
            context.closePath();
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
        key: 'drawCircle',
        value: function drawCircle(x, y, radius, context, style) {
            Object.assign(context, style);
            context.beginPath();
            context.arc(x, y, radius, 0, 2 * Math.PI);
            //TODO: 2015-03-12 this is currently only supported by chrome & opera
            //context.ellipse(x, y, radius, radius, 0, 0, 2 * Math.PI);
            context.fill();
            context.stroke();
            context.closePath();
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
        key: 'drawText',
        value: function drawText(x, y, text, context, style) {
            Object.assign(context, style);
            context.beginPath();
            context.fillText(text, x, y);
            //TODO: implement stroke text if specified
            context.closePath();
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
        key: 'drawImage',
        value: function drawImage(x, y, image, context, style) {
            Object.assign(context, style);
            //no reason to draw 0-sized images
            if (image.width > 0 && image.height > 0) {
                context.beginPath();
                context.drawImage(image, x, y, image.width, image.height);
                context.closePath();
            }
        }

        //TODO: this should probably be exposed elsewhere/differently
        /**
         * Measure the text
         * @param {string} text the text to be measured
         * @param {object} context the 2D Context object for a canvas - required for measurement to occur, but may be arbitrary
         * @param {object} style the style options to be used when measuring the text
         * @return {object} [TextMetrics](https://developer.mozilla.org/en-US/docs/Web/API/TextMetrics) object containing info like Width
         */

    }, {
        key: 'measureText',
        value: function measureText(text, context, style) {
            Object.assign(context, style);
            return context.measureText(text);
        }
    }]);

    return Renderer;
}();

exports.default = Renderer;
exports.Renderer = Renderer;
exports.DEFAULTS = DEFAULTS;

},{}],12:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Renderer = require('./Renderer');

var _Renderer2 = _interopRequireDefault(_Renderer);

var _PrimitiveComponent2 = require('./PrimitiveComponent');

var _PrimitiveComponent3 = _interopRequireDefault(_PrimitiveComponent2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ALL_CHARS = '1234567890QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm.,`~;:\'"!?@#$%^&*()_+={}[]|<>/';

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
    fontHolder.style.font = font;

    //create an inline-block to place after the element
    var baselineRuler = document.createElement('div');
    baselineRuler.style.display = 'inline-block';
    baselineRuler.style.width = '1px';
    baselineRuler.style.height = '0';
    baselineRuler.style.verticalAlign = 'baseline';

    //place them in a wrapper and add it to the body
    var wrapper = document.createElement('div');
    wrapper.appendChild(fontHolder);
    wrapper.appendChild(baselineRuler);
    wrapper.style.whiteSpace = 'nowrap';
    document.body.appendChild(wrapper);

    //get their bounding rectangles and...
    var fontRect = fontHolder.getBoundingClientRect();
    var baselineRect = baselineRuler.getBoundingClientRect();

    //calculate their offset from top
    var fontTop = fontRect.top + document.body.scrollTop;
    var fontBottom = fontTop + fontRect.height;

    var baseline = baselineRect.top + document.body.scrollTop;

    document.body.removeChild(wrapper);

    //ascent equals the baseline location minus text top location
    var ascentFromBaseline = baseline - fontTop;

    //decent equals the text bottom location minuse the baseline location
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

var Text = function (_PrimitiveComponent) {
    _inherits(Text, _PrimitiveComponent);

    /**
     * @param {object} options the options for the text object
     */
    function Text(options) {
        _classCallCheck(this, Text);

        /**
         * @type {string} text the text to be rendered
         */
        var _this = _possibleConstructorReturn(this, (Text.__proto__ || Object.getPrototypeOf(Text)).call(this, options));

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
        key: '_updateStyle',
        value: function _updateStyle(options) {
            Object.assign(this.style, options, {
                font: this.fontStyle + ' ' + this.fontVariant + ' ' + this.fontWeight + ' ' + this.fontSize + '/' + this.lineHeight + ' ' + this.fontFamily,
                textAlign: this.textAlign,
                textBaseline: this.textBaseline
            });
        }

        /**
         * override the render function for text objects
         * @override
         */

    }, {
        key: 'render',
        value: function render() {
            this._textMetricsNeedUpdate = true;
            this._updateStyle();
            _Renderer2.default.drawText(0, this.textMetrics.ascent, this.text, this._prerenderingContext, this.style);

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
        key: 'textMetrics',
        get: function get() {
            if (this._textMetricsNeedUpdate || this._textMetrics === null) {
                this._updateStyle();
                this._textMetrics = _Renderer2.default.measureText(this.text, this._prerenderingContext, this.style);
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
        key: 'boundingBox',
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
}(_PrimitiveComponent3.default);

exports.default = Text;

},{"./PrimitiveComponent":9,"./Renderer":11}],13:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _set = function set(object, property, value, receiver) { var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent !== null) { set(parent, property, value, receiver); } } else if ("value" in desc && desc.writable) { desc.value = value; } else { var setter = desc.set; if (setter !== undefined) { setter.call(receiver, value); } } return value; };

var _Renderer = require('./Renderer');

var _Renderer2 = _interopRequireDefault(_Renderer);

var _PrimitiveComponent2 = require('./PrimitiveComponent');

var _PrimitiveComponent3 = _interopRequireDefault(_PrimitiveComponent2);

var _withoutblas = require('vectorious/withoutblas');

var _Line = require('./Line');

var _Line2 = _interopRequireDefault(_Line);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

//would name the file 'path', but damn near everything
//relies on the filesystem 'path' module

/**
 * An ordered set of vectors defining a path
 */
var VectorPath = function (_PrimitiveComponent) {
    _inherits(VectorPath, _PrimitiveComponent);

    /**
     * see PrimitiveComponent for more options
     * @param {Object} options the options for the object
     * @param {Object[]} options.vertices the vertices
     * @param {number} options.vertices[].x the y coordinate for a vertex
     * @param {number} options.vertices[].y the y coordinate for a vertex
     */
    function VectorPath(options) {
        _classCallCheck(this, VectorPath);

        var _this = _possibleConstructorReturn(this, (VectorPath.__proto__ || Object.getPrototypeOf(VectorPath)).call(this, options));

        options.vertices = options.vertices || [];

        //this.unscaledLineWidth = this.style.lineWidth;

        /**
         * the list of vertices as vectorious Vectors
         * @type {Vector[]} vertices
         */
        _this.vertices = options.vertices.map(function (v) {
            return new _withoutblas.Vector([v.x, v.y]);
        });

        var yCoordinates = _this.vertices.map(function (v) {
            return v.y;
        });
        var xCoordinates = _this.vertices.map(function (v) {
            return v.x;
        });

        //uses `apply` so we can supply the list as a list of arguments
        _this._left = Math.min.apply(null, xCoordinates);
        _this._top = Math.min.apply(null, yCoordinates);
        _this._right = Math.max.apply(null, xCoordinates);
        _this._bottom = Math.max.apply(null, yCoordinates);

        _set(VectorPath.prototype.__proto__ || Object.getPrototypeOf(VectorPath.prototype), 'd', new _withoutblas.Vector([_this._left, _this._top]), _this);

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
        key: 'pointIsInObject',


        /**
         * determine whether the point is in the object
         * even/odd line intersection test
         * @param {number} x the x coordinate
         * @param {number} y the y coordinate
         * @return {boolean} whether or not the point is in the object
         */
        value: function pointIsInObject(x, y) {
            var inside = false;
            if (_get(VectorPath.prototype.__proto__ || Object.getPrototypeOf(VectorPath.prototype), 'pointIsInObject', this).call(this, x, y)) {
                //create a line that travels from this point in any direction
                //if it intersects the polygon an odd number of times, it is inside

                //a line can be described as a vertex and a direction
                var l = new _Line2.default(new _withoutblas.Vector([x, y]), new _withoutblas.Vector([1, 0]));

                var compoundScale = this.compoundScale;
                var offset = this.offset;

                for (var i = 0; i < this._normalizedVertices.length; i++) {
                    var j = i + 1 >= this._normalizedVertices.length ? 0 : i + 1;

                    var v = scaleVectorXY(this._normalizedVertices[i], compoundScale.scaleWidth, compoundScale.scaleHeight).add(offset);

                    var w = scaleVectorXY(this._normalizedVertices[j], compoundScale.scaleWidth, compoundScale.scaleHeight).add(offset);

                    var edgeDirection = _withoutblas.Vector.subtract(w, v).normalize();
                    var edge = new _Line2.default(v, edgeDirection);
                    var intersection = edge.intersectionWith(l);

                    //if the lines are parallel/colocated, no need to count;
                    if (intersection === null) {
                        continue;
                    }

                    //TODO: should replace 0s with epsilons, where epsilon is
                    //the threshhold for considering two things as touching/intersecting
                    var intersectToTheRight = intersection.x - x >= 0;

                    //if the intersection is not to the right, no need to count
                    if (!intersectToTheRight) {
                        continue;
                    }

                    var negativeX = edgeDirection.x < 0;
                    var negativeY = edgeDirection.y < 0;

                    //technically speaking, bottom and top should be reversed,
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
        key: 'render',
        value: function render() {
            var boundingBox = this.boundingBox;
            var offset = this.offset;
            var compoundScale = this.compoundScale;
            //normalize the vertices (left- and top-most x/y-values should be 0 and 0)
            var pathToDraw = this._normalizedVertices.map(function (vertex) {
                return scaleVectorXY(vertex, compoundScale.scaleWidth, compoundScale.scaleHeight).subtract(new _withoutblas.Vector([boundingBox.left, boundingBox.top])).add(offset);
            });
            _Renderer2.default.drawPath(pathToDraw, this._prerenderingContext, this.style);
        }
    }, {
        key: 'boundingBox',
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
}(_PrimitiveComponent3.default);

exports.default = VectorPath;


function scaleVectorXY(vector, scaleX, scaleY) {
    return new _withoutblas.Vector([vector.x * scaleX, vector.y * scaleY]);
}

},{"./Line":8,"./PrimitiveComponent":9,"./Renderer":11,"vectorious/withoutblas":3}],"canvas-compositor":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.DEFAULTS = exports.Text = exports.Image = exports.VectorPath = exports.Line = exports.Rectangle = exports.Ellipse = exports.Circle = exports.Composition = exports.PrimitiveComponent = exports.Renderer = exports.CanvasCompositor = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Renderer = require('./Renderer');

var _Composition = require('./Composition');

var _Composition2 = _interopRequireDefault(_Composition);

var _PrimitiveComponent = require('./PrimitiveComponent');

var _PrimitiveComponent2 = _interopRequireDefault(_PrimitiveComponent);

var _Circle = require('./Circle');

var _Circle2 = _interopRequireDefault(_Circle);

var _Ellipse = require('./Ellipse');

var _Ellipse2 = _interopRequireDefault(_Ellipse);

var _Rectangle = require('./Rectangle');

var _Rectangle2 = _interopRequireDefault(_Rectangle);

var _Line = require('./Line');

var _Line2 = _interopRequireDefault(_Line);

var _VectorPath = require('./VectorPath');

var _VectorPath2 = _interopRequireDefault(_VectorPath);

var _Image = require('./Image');

var _Image2 = _interopRequireDefault(_Image);

var _Text = require('./Text');

var _Text2 = _interopRequireDefault(_Text);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

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

var CanvasCompositor = function () {
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
        this._context = this._canvas.getContext('2d');

        //acquire the padding on the canvas – this is necessary to properly
        //locate the mouse position
        //TODO: determine if border-box affects this, and adjust accordingly
        var style = window.getComputedStyle(this._canvas);

        var borderLeft = style.getPropertyValue('border-left') ? parseFloat(style.getPropertyValue('border-left')) : 0;
        var paddingLeft = style.getPropertyValue('padding-left') ? parseFloat(style.getPropertyValue('padding-left')) : 0;

        /**
         * @type {number} _leftPadding the padding on the left of the canvas, which
         * affects the offset of the mouse position
         */
        this._leftPadding = borderLeft + paddingLeft;

        var borderTop = style.getPropertyValue('border-top') ? parseFloat(style.getPropertyValue('border-top')) : 0;
        var paddingTop = style.getPropertyValue('padding-top') ? parseFloat(style.getPropertyValue('padding-top')) : 0;

        /**
         * @type {number} _topPadding the padding on the top of the canvas, which
         * affects the offset of the mouse position
         */
        this._topPadding = borderTop + paddingTop;

        //this._currentTime = 0;
        //this._lastRenderTime = 0;

        this._targetObject = null;

        this._scene = new _Composition2.default(this.canvas);

        this._bindEvents();

        this._eventRegistry = {
            onmouseup: [],
            onmousedown: [],
            onmousemove: [],
            onmouseout: [],
            onclick: []
        };

        this._animationLoop();
        //this._framerate = 0;
    }

    //TODO: expose the framerate
    /*set framerate(val) {
        this._framerate = val;
    }
     get framerate() {
        var framerateUpdatedEvent = new Event();
        return this._framerate;
    }*/

    //TODO: multiple target objects? in reverse order of render? in order of composition?
    /**
     * the object currently selected for interaction
     * @type {object}
     */


    _createClass(CanvasCompositor, [{
        key: '_animationLoop',


        /**
         * The animation loop for this instance of CanvasCompositor.
         * Upon receipt of the animation frame from `requestAnimationFrame`, the loop will check
         * whether enough time has passed to redraw for the target framerate.
         * It will only draw if somewhere along the scene graph, an object needs updating.
         * There is no need to invoke this directly, the constructor will do it.
         */
        value: function _animationLoop() {
            //console.log(this);
            //console.log();
            window.requestAnimationFrame(this._animationLoop.bind(this));
            //this._currentTime = +new Date();
            //set maximum of 60 fps and only redraw if necessary
            if ( /*this._currentTime - this._lastRenderTime >= this._targetFPS &&*/this.scene.needsDraw) {
                //this.framerate = 1 / (this._currentTime - this._lastRenderTime / 1000)
                //this._lastRenderTime = +new Date();
                _Renderer.Renderer.clearRect(0, 0, this._canvas.width, this._canvas.height, this._context);
                this.scene.draw(this._context);
            }
        }

        /**
         * add an event to the event registry
         *
         * @param {string} eventType the name of the type of event
         * @param {function} callback the callback to be triggered when the event occurs
         */

    }, {
        key: 'registerEvent',
        value: function registerEvent(eventType, callback) {
            if (this._eventRegistry[eventType]) {
                this._eventRegistry[eventType].push(callback);
            }
        }
    }, {
        key: 'removeEvent',


        /**
         * remove an event to the event registry
         *
         * @param {string} eventType the name of the type of event
         * @param {function} callback the callback to be removed from the event
         * @return {function} the callback that was removed
         */
        value: function removeEvent(eventType, callback) {
            if (this._eventRegistry[eventType]) {
                var index = this._eventRegistry[eventType].indexOf(callback);
                if (index >= 0) {
                    return this._eventRegistry[eventType].splice(index, 1);
                }
            }
        }
    }, {
        key: '_bindEvents',


        /**
         * attach interaction events to the canvas. the canvas compositor dispatches
         * events to relevant objects through bridges to the scene graph
         */
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
        key: '_handleMouseDown',
        value: function _handleMouseDown(e) {
            e.preventDefault();

            var x = e.offsetX - this._leftPadding;
            var y = e.offsetY - this._topPadding;

            //pass through x and y to propagated events
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
                    if (!_iteratorNormalCompletion && _iterator.return) {
                        _iterator.return();
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
        key: '_handleMouseUp',
        value: function _handleMouseUp(e) {
            e.preventDefault();

            var x = e.offsetX - this._leftPadding;
            var y = e.offsetY - this._topPadding;

            //pass through x and y to propagated events
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
                    if (!_iteratorNormalCompletion2 && _iterator2.return) {
                        _iterator2.return();
                    }
                } finally {
                    if (_didIteratorError2) {
                        throw _iteratorError2;
                    }
                }
            }

            ;

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
                    if (!_iteratorNormalCompletion3 && _iterator3.return) {
                        _iterator3.return();
                    }
                } finally {
                    if (_didIteratorError3) {
                        throw _iteratorError3;
                    }
                }
            }

            ;

            var clickedObject = this.scene.childAt(x, y);

            if (clickedObject && clickedObject.onmouseup) {
                clickedObject.onmouseup(e);
            }
        }
    }, {
        key: '_handleMouseMove',


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
                    if (!_iteratorNormalCompletion4 && _iterator4.return) {
                        _iterator4.return();
                    }
                } finally {
                    if (_didIteratorError4) {
                        throw _iteratorError4;
                    }
                }
            }

            ;

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
                    if (!_iteratorNormalCompletion5 && _iterator5.return) {
                        _iterator5.return();
                    }
                } finally {
                    if (_didIteratorError5) {
                        throw _iteratorError5;
                    }
                }
            }

            ;
        }
    }, {
        key: '_handleClick',


        /**
         * bridge the click event on the canvas to the
         * the objects in the scene graph
         */
        value: function _handleClick(e) {
            e.preventDefault();

            var x = e.offsetX - this._leftPadding;
            var y = e.offsetY - this._topPadding;

            //pass through x and y to propagated events
            e.canvasX = x;
            e.canvasY = y;

            //TODO: FF doesn't get this
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
                    if (!_iteratorNormalCompletion6 && _iterator6.return) {
                        _iterator6.return();
                    }
                } finally {
                    if (_didIteratorError6) {
                        throw _iteratorError6;
                    }
                }
            }

            ;

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
                    if (!_iteratorNormalCompletion7 && _iterator7.return) {
                        _iterator7.return();
                    }
                } finally {
                    if (_didIteratorError7) {
                        throw _iteratorError7;
                    }
                }
            }

            ;
        }
    }, {
        key: '_handleMouseOut',


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
                    if (!_iteratorNormalCompletion8 && _iterator8.return) {
                        _iterator8.return();
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
                    if (!_iteratorNormalCompletion9 && _iterator9.return) {
                        _iterator9.return();
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
        key: 'targetObject',
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
        key: 'scene',
        get: function get() {
            return this._scene;
        }
    }]);

    return CanvasCompositor;
}();

/*


	CanvasCompositor.prototype._bindEvents = function () {

        //TODO: typically, usage of stopPropagation() is a sign that things were done wrong.
		this._canvas.addEventListener('touchstart', function (e) {
			e.preventDefault();
			e.stopPropagation();
			_translateTouchEvent('mousedown', e);
		});
		this._canvas.addEventListener('touchend', function (e) {
			e.preventDefault();
			e.stopPropagation();
			_translateTouchEvent('mouseup', e);
		});
		this._canvas.addEventListener('touchmove', function (e) {
			e.preventDefault();
			e.stopPropagation();
			_translateTouchEvent('mousemove', e);
		});
		this._canvas.addEventListener('touchcancel', function (e) {
			e.preventDefault();
			e.stopPropagation();
			_translateTouchEvent('mouseout', e);
		});

		//there is no 'touch' event
		//should the press event be disabled?
		//should it be simulated?
		//can all functionality be covered by up+down/start+end events?
	};

	function _translateTouchEvent(type, e) {
		var mouseEventInit;
		if (e.touches.length) {
			mouseEventInit = {
				screenX: e.touches[0].screenX,
				screenY: e.touches[0].screenY,
				clientX: e.touches[0].clientX,
				clientY: e.touches[0].clientY,
				button: 0
			};
		} else {
			mouseEventInit = _lastKnownTouchLocation;
		}
		_lastKnownTouchLocation = mouseEventInit;
		var evt = new window.MouseEvent(type, mouseEventInit);
		e.target.dispatchEvent(evt);
	}
*/

exports.default = CanvasCompositor;
exports.CanvasCompositor = CanvasCompositor;
exports.Renderer = _Renderer.Renderer;
exports.PrimitiveComponent = _PrimitiveComponent2.default;
exports.Composition = _Composition2.default;
exports.Circle = _Circle2.default;
exports.Ellipse = _Ellipse2.default;
exports.Rectangle = _Rectangle2.default;
exports.Line = _Line2.default;
exports.VectorPath = _VectorPath2.default;
exports.Image = _Image2.default;
exports.Text = _Text2.default;
exports.DEFAULTS = _Renderer.DEFAULTS;

},{"./Circle":4,"./Composition":5,"./Ellipse":6,"./Image":7,"./Line":8,"./PrimitiveComponent":9,"./Rectangle":10,"./Renderer":11,"./Text":12,"./VectorPath":13}]},{},[])

//# sourceMappingURL=canvas-compositor.js.map
