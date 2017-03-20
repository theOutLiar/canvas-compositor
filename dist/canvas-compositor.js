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

var _Primitive2 = require('./Primitive');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Composition = function (_Primitive) {
	_inherits(Composition, _Primitive);

	function Composition(canvas, children, masks) {
		_classCallCheck(this, Composition);

		var _this = _possibleConstructorReturn(this, (Composition.__proto__ || Object.getPrototypeOf(Composition)).call(this, canvas));

		_this.children = children || [];
		_this.masks = masks;
		return _this;
	}

	_createClass(Composition, [{
		key: 'boundingBox',
		get: function get() {
			var top = null,
			    left = null,
			    bottom = null,
			    right = null;

			var _iteratorNormalCompletion = true;
			var _didIteratorError = false;
			var _iteratorError = undefined;

			try {
				for (var _iterator = this.children[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
					var c = _step.value;

					top = top !== null && top < c.boundingBox.top ? top : c.boundingBox.top;
					left = left !== null && left < c.boundingBox.left ? left : c.boundingBox.left;
					bottom = bottom !== null && bottom > c.boundingBox.bottom ? bottom : c.boundingBox.bottom;
					right = right !== null && right > c.boundingBox.right ? right : c.boundingBox.right;
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

			return {
				top: top,
				left: left,
				bottom: bottom,
				right: right
			};
		}
	}]);

	return Composition;
}(_Primitive2.Primitive);

/*define(['lodash', 'canvas-object', 'renderer'], function (_, CanvasObject, Renderer) {
	'use strict';

	function Container(options) {
		CanvasObject.call(this, options);
		this.children = options.children || [];
		this.masks = options.masks || [];
	}

	_.assign(Container.prototype, CanvasObject.prototype);

	Container.prototype.masks = [];
	Container.prototype.children = [];
	Container.prototype.frontChildren = [];
	Container.prototype.backChildren = [];
	Container.prototype.middleChildren = [];
	Container.prototype.mostRecentlyAddedChild = null;

	Container.prototype.ChildrenAt = function _childrenAt(x, y) {
		return _.filter(this.children, function (c) {
			return c.PointIsInObject(x, y);
		});
	};

	Container.prototype.PressableChildrenAt = function _pressableChildrenAt(x, y) {
		return _.filter(this.children, function (c) {
			return c.PressIsInObject(x, y);
		});
	};

	Container.prototype.UpdateChildrenLists = function _updateChildrenLists() {
		this.frontChildren = _.filter(this.children, function (c) {
			return c.sticky && c.stickyPosition === CanvasObject.STICKY_POSITION.FRONT;
		});
		this.backChildren = _.filter(this.children, function (c) {
			return c.sticky && c.stickyPosition === CanvasObject.STICKY_POSITION.BACK;
		});
		this.middleChildren = _.filter(this.children, function (c) {
			return !c.sticky;
		});
	};

	Container.prototype.ChildAt = function _childAt(x, y) {
		//loop over the children in reverse because drawing order

		for (var fc = this.frontChildren.length - 1; fc >= 0; fc--) {
			if (this.frontChildren[fc].PointIsInObject(x, y)) {
				return this.frontChildren[fc];
			}
		}

		for (var mc = this.middleChildren.length - 1; mc >= 0; mc--) {
			if (this.middleChildren[mc].PointIsInObject(x, y)) {
				return this.middleChildren[mc];
			}
		}

		for (var bc = this.backChildren.length - 1; bc >= 0; bc--) {
			if (this.backChildren[bc].PointIsInObject(x, y)) {
				return this.backChildren[bc];
			}
		}

		return null;
	};

	Container.prototype.PressableChildAt = function _pressableChildAt(x, y) {
		if (this.pressPassThrough){
			return null;
		}

		//loop over the children in reverse because drawing order
		for (var fc = this.frontChildren.length - 1; fc >= 0; fc--) {
			if (this.frontChildren[fc].PressIsInObject(x, y)) {
				return this.frontChildren[fc];
			}
		}

		for (var mc = this.middleChildren.length - 1; mc >= 0; mc--) {
			if (this.middleChildren[mc].PressIsInObject(x, y)) {
				return this.middleChildren[mc];
			}
		}

		for (var bc = this.backChildren.length - 1; bc >= 0; bc--) {
			if (this.backChildren[bc].PressIsInObject(x, y)) {
				return this.backChildren[bc];
			}
		}

		return null;
	};

	Container.prototype.PointIsInObject = function _pointIsInObject(x, y) {
		//don't even bother checking the children
		//if the point isn't in the bounding box
		if (CanvasObject.prototype.PointIsInObject.call(this, x, y)) {
			for (var fc in this.frontChildren) {
				if (this.frontChildren[fc].PointIsInObject(x, y)) {
					return true;
				}
			}

			for (var mc in this.middleChildren) {
				if (this.middleChildren[mc].PointIsInObject(x, y)) {
					return true;
				}
			}

			for (var bc in this.backChildren) {
				if (this.backChildren[bc].PointIsInObject(x, y)) {
					return true;
				}
			}
		}
		return false;
	};

	Container.prototype.addChild = function _addChild(child) {
		child.parent = this;
		this.children.push(child);
		this.mostRecentlyAddedChild = child;
		this.UpdateChildrenLists();
		this.NeedsUpdate = true;
		this.NeedsRender = true;
		//TODO: make this hook more generic
		if (this.onchildadded) {
			this.onchildadded();
		}
	};

	Container.prototype.removeChild = function _removeChild(child) {
		if (child) {
			var index = this.children.indexOf(child);
			if (index >= 0) {
				this.children.splice(index, 1);
				this.UpdateChildrenLists();
				this.NeedsUpdate = true;
				this.NeedsRender = true;
			}
		}
	};

	Container.prototype.addMask = function _addMask(mask) {
		mask.parent = this;
		this.masks.push(mask);
		this.NeedsUpdate = true;
		this.NeedsRender = true;
	};


	//TODO: need to account for translation... should re-work math for this...
	Container.prototype.render = function _render() {
		var renderContext = this._prerenderingContext;
		var contextOffset = {
			top: -this.boundingBox.top,
			left: -this.boundingBox.left,
			bottom: -this.boundingBox.bottom,
			right: -this.boundingBox.right
		};

		_.each(this.backChildren, function (c) {
			c.draw(renderContext, contextOffset);
		});

		_.each(this.middleChildren, function (c) {
			c.draw(renderContext, contextOffset);
		});

		_.each(this.frontChildren, function (c) {
			c.draw(renderContext, contextOffset);
		});

		renderContext.globalCompositeOperation = 'destination-out';

		_.each(this.masks, function (m) {
			m.draw(renderContext, contextOffset);
		});
		renderContext.globalCompositeOperation = 'normal';
	}; //should be overridden by implementors

	Container.prototype.parent = null;
	Container.prototype.children = [];

	return Container;
});*/


exports.default = Composition;

},{"./Primitive":5}],5:[function(require,module,exports){
'use strict';

var _withoutblas = require('vectorious/withoutblas');

var _withoutblas2 = _interopRequireDefault(_withoutblas);

var _Renderer = require('./Renderer');

var _Renderer2 = _interopRequireDefault(_Renderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/*
 * The base class for things that may be drawn on the canvas.
 * All drawable objects should inherit from this class.
 * Typically, it is unnecessary for application programmers to
 * call this directly, although they may wish to extend their own
 * classes with it.
 */
var Primitive = function Primitive(canvas) {
	_classCallCheck(this, Primitive);

	this.canvas = canvas;
};

exports.Primitive = Primitive;

/*define(['lodash', 'vector', 'renderer'], function (_, Vector, Renderer) {
	'use strict';

	function CanvasObject(options) {
		this.d = new Vector([options.x || 0, options.y || 0]);

		this.style = _.assign({}, Renderer.DEFAULTS, options.style);
		this.unscaledLineWidth = this.style.lineWidth;

		this.pressPassThrough = options.pressPassThrough || false;
		this.draggable = options.draggable || false;

		this.drawBoundingBox = false;
		this.boundingBoxColor = '#cccccc';

		this._needsUpdate = false;
		this._needsRender = true;
		this._scaleWidth = 1;
		this._scaleHeight = 1;

		this._prerenderedImage = document.createElement('canvas');
		this._prerenderingContext = this._prerenderedImage.getContext('2d');

		this.parent = options.parent || null;
		if (this.draggable) {
			this.enableDragging();
		}

		this.sticky = false;
		this.stickyPosition = null;

		//TODO: putting defineProperty in constructor to make inheritable on
		//a tight schedule - would prefer to do this on the prototype, because
		//doing it otherwise means each instance has to create a copy of the
		//property/getters/setters, but properties on the prototype aren't
		//copied by _'s `assign` funcion
		Object.defineProperty(this, 'offset', {
			configurable: true,
			enumerable: true,
			get: function () {
				if (this.parent) {
					return this.d
						//.multiply(new Vector([this.parent.ScaleWidth, this.parent.ScaleHeight]))
						.add(this.parent.offset);
				} else {
					return this.d;
				}
			}
		});

		Object.defineProperty(this, 'NeedsUpdate', {
			configurable: true,
			enumerable: true,
			set: function (val) {
				if (this.parent && val) { //only mark the parent for update if true
					this.parent.NeedsUpdate = val;
				}
				return (this._needsUpdate = val);
			},
			get: function () {
				return this._needsUpdate;
			}
		});

		Object.defineProperty(this, 'NeedsRender', {
			configurable: true,
			enumerable: true,
			set: function (val) {
				if (this.parent && val) { //only mark the parent for update if true
					this.parent.NeedsRender = val;
				}
				return (this._needsRender = val);
			},
			get: function () {
				return this._needsRender;
			}
		});

		Object.defineProperty(this, 'Scale', {
			configurable: true,
			enumerable: true,
			set: function (val) {
				this.ScaleWidth = val;
				this.ScaleHeight = val;
			},
			get: function () {
				return {
					scaleWidth: this.ScaleWidth,
					scaleHeight: this.ScaleHeight
				};
			}
		});

		Object.defineProperty(this, 'ScaleWidth', {
			configurable: true,
			enumerable: true,
			set: function (val) {
				this.NeedsUpdate = true;
				this.NeedsRender = true;
				if (this.children){
					_.each(this.children, function (c){
						c.NeedsUpdate = true;
						c.NeedsRender = true;
					});
					_.each(this.masks, function (m){
						m.NeedsUpdate = true;
						m.NeedsRender = true;
					});
				}
				this._scaleWidth = val;
			},
			get: function () {
				return this._scaleWidth;
			}
		});

		Object.defineProperty(this, 'ScaleHeight', {
			configurable: true,
			enumerable: true,
			set: function (val) {
				this.NeedsUpdate = true;
				this.NeedsRender = true;
				if (this.children){
					_.each(this.children, function (c){
						c.NeedsUpdate = true;
						c.NeedsRender = true;
					});
					_.each(this.masks, function (m){
						m.NeedsUpdate = true;
						m.NeedsRender = true;
					});
				}
				this._scaleHeight = val;
			},
			get: function () {
				return this._scaleHeight;
			}
		});

		Object.defineProperty(this, 'GlobalScale', {
			configurable: true,
			enumerable: true,
			get: function () {
				var width = this._scaleWidth;
				var height = this._scaleHeight;

				if(this.parent){
					var parentScale = this.parent.GlobalScale;
					width *= parentScale.scaleWidth;
					height *= parentScale.scaleHeight;
				}

				return {
					scaleHeight: width,
					scaleWidth: height
				};
			}
		});

		Object.defineProperty(this, 'GlobalLineScale', {
			configurable: true,
			enumerable: true,
			get: function (){
				//not sure what the best approach for line scale is...
				return Math.min(this.GlobalScale.scaleWidth, this.GlobalScale.scaleHeight);
			}
		});

		Object.defineProperty(this, 'GlobalFontScale', {
			configurable: true,
			enumerable: true,
			get: function (){
				//not sure what the best approach for font scale is...
				return Math.min(this.GlobalScale.scaleWidth, this.GlobalScale.scaleHeight);
			}
		});
	}

	CanvasObject.prototype.enableDragging = function _enableDragging() {
		this.onpressdown = this.dragStart;
	};

	CanvasObject.prototype.disableDragging = function _disableDragging() {
		this.onpressdown = null;
		this.onpressmove = null;
		this.onpressup = null;
		this.onpresscancel = null;
		this.NeedsRender = true;
		this.NeedsUpdate = true;
	};

	CanvasObject.prototype.dragStart = function _dragStart(e) {
		this.mouseOffset = new Vector([e.offsetX, e.offsetY]).subtract(this.offset);
		this.onpressdown = null;
		this.onpressmove = this.drag;
		this.onpressup = this.dragEnd;
		this.onpresscancel = this.dragEnd;
	};

	CanvasObject.prototype.drag = function _drag(e) {
		this.d = new Vector([e.offsetX,e.offsetY]).subtract(this.mouseOffset);
		this.NeedsRender = true;
		this.NeedsUpdate = true;
	};

	CanvasObject.prototype.dragEnd = function _dragEnd(e) {
		this.onpressdown = this.dragStart;
		this.onpressmove = null;
		this.onpressup = null;
		this.onpresscancel = null;
		this.NeedsRender = true;
		this.NeedsUpdate = true;
	};

	CanvasObject.prototype.draggable = false;
	CanvasObject.prototype.context = null;
	CanvasObject.prototype.style = null;
	CanvasObject.prototype.scale = 1;

	CanvasObject.prototype.flags = {
		DEBUG: false
	};

	CanvasObject.prototype.draw = function _draw(context, contextOffset) {
		this.NeedsUpdate = false;

		if (this.NeedsRender && this.render) {
			delete this._prerenderedImage;
			delete this._prerenderingContext;
			this._prerenderedImage = document.createElement('canvas');
			// text needs prerendering context defined for boundingBox measurements
			this._prerenderingContext = this._prerenderedImage.getContext('2d');
			this._prerenderedImage.width = this.boundingBox.right - this.boundingBox.left;
			this._prerenderedImage.height = this.boundingBox.bottom - this.boundingBox.top;

			this.style.lineWidth = this.unscaledLineWidth * this.GlobalLineScale;
			this.render();
			this.NeedsRender = false;
		}
		//draw bounding boxes
		if (this.flags.DEBUG) {
			this._prerenderingContext.beginPath();
			this._prerenderingContext.lineWidth=2.0;
			this._prerenderingContext.strokeStyle='#FF0000';
			this._prerenderingContext.strokeRect(0,0,this._prerenderedImage.width, this._prerenderedImage.height);
			this._prerenderingContext.closePath();
		}

		if (this.drawBoundingBox){
			this._prerenderingContext.beginPath();
			this._prerenderingContext.lineWidth=2.0;
			this._prerenderingContext.strokeStyle=this.boundingBoxColor;
			this._prerenderingContext.strokeRect(0,0,this._prerenderedImage.width, this._prerenderedImage.height);
			this._prerenderingContext.closePath();
		}

		var x = this.boundingBox.left + (contextOffset && contextOffset.left ? contextOffset.left : 0);
		var y = this.boundingBox.top + (contextOffset && contextOffset.top ? contextOffset.top : 0);
		Renderer.drawImage(context, x, y, this._prerenderedImage, this.style);
	};

	CanvasObject.prototype.render = function _render() {}; //should be overridden by implementors

	CanvasObject.prototype.PointIsInBoundingBox = function _pointIsInBoundingBox(x, y){
		return (
			x > this.boundingBox.left &&
			y > this.boundingBox.top &&
			x < this.boundingBox.right &&
			y < this.boundingBox.bottom
		);
	};

	CanvasObject.prototype.PointIsInObject = function _pointIsInObject(x, y) {
		return this.PointIsInBoundingBox(x, y);
	}; //can (and should) be overridden by implementors

	CanvasObject.prototype.PressIsInObject = function _pressIsInObject(x, y) {
		if (this.pressPassThrough){
			return false;
		}

		return this.PointIsInObject(x, y);
	}; //can (and should) be overridden by implementors

	CanvasObject.prototype.UnPin = function _unpin(){
		this.sticky = false;
		this.stickyPosition = null;
		this.NeedsUpdate = true;
		this.NeedsRender = true;
		if(this.parent){
			this.parent.UpdateChildrenLists();
		}
	};

	CanvasObject.prototype.PinToFront = function _pinToFront(){
		this.sticky = true;
		this.stickyPosition = CanvasObject.STICKY_POSITION.FRONT;
		this.NeedsUpdate = true;
		this.NeedsRender = true;
		if(this.parent){
			this.parent.UpdateChildrenLists();
		}
	};

	CanvasObject.prototype.PinToBack = function _pinToFront(){
		this.sticky = true;
		this.stickyPosition = CanvasObject.STICKY_POSITION.BACK;
		this.NeedsUpdate = true;
		this.NeedsRender = true;
		if(this.parent){
			this.parent.UpdateChildrenLists();
		}
	};

	CanvasObject.prototype.MoveToFront = function _moveToFront() {
		if (this.parent){
			var index = this.parent.children.indexOf(this);
			if( index >= 0 ){
				this.parent.children.splice(index, 1);
				this.parent.children.splice(this.parent.children.length, 0, this);
				this.parent.UpdateChildrenLists();
				this.NeedsUpdate = true;
				this.NeedsRender = true;
			}
		}
	};

	CanvasObject.prototype.MoveToBack = function _moveToBack() {
		if (this.parent){
			var index = this.parent.children.indexOf(this);
			if( index >= 0 ){
				this.parent.children.splice(index, 1);
				this.parent.children.splice(0, 0, this);
				this.parent.UpdateChildrenLists();
				this.NeedsUpdate = true;
				this.NeedsRender = true;
			}
		}
	};

	CanvasObject.prototype.MoveForward = function _moveForward(){
		if (this.parent){
			var index = this.parent.children.indexOf(this);
			if( index >= 0 ){
				this.parent.children.splice(index, 1);
				this.parent.children.splice(index + 1, 0, this); //if index + 1 > siblings.length, inserts it at end
				this.parent.UpdateChildrenLists();
				this.NeedsUpdate = true;
				this.NeedsRender = true;
			}
		}
	};

	CanvasObject.prototype.MoveBackward = function _moveBackward(){
		if (this.parent){
			var index = this.parent.children.indexOf(this);
			if( index > 0 ){
				this.parent.children.splice(index, 1);
				this.parent.children.splice(index - 1, 0, this);
				this.parent.UpdateChildrenLists();
				this.NeedsUpdate = true;
				this.NeedsRender = true;
			}
		}
	};

	CanvasObject.STICKY_POSITION = { FRONT:'front', BACK: 'back' };

	CanvasObject.prototype.onpressdown = null;
	CanvasObject.prototype.onpressup = null;
	CanvasObject.prototype.onpressmove = null;
	CanvasObject.prototype.onpresscancel = null;

	return CanvasObject;
});
*/

},{"./Renderer":6,"vectorious/withoutblas":3}],6:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var DEFAULTS = exports.DEFAULTS = {
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

//TODO: masking? it looks like this is done in the Conposition, but that may be bugged out.

var Renderer = function () {
    function Renderer() {
        _classCallCheck(this, Renderer);
    }

    _createClass(Renderer, [{
        key: 'staticdrawText',
        value: function staticdrawText(x, y, text, context, style) {
            Object.assign(context, style);
            context.beginPath();
            context.fillText(text, x, y);
            //TODO: implement stroke text if specified
            context.closePath();
        }
    }], [{
        key: 'clearRect',
        value: function clearRect(x, y, width, height, context) {
            context.clearRect(x, y, width, height);
        }
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
    }, {
        key: 'drawEllipse',
        value: function drawEllipse(x, y, radius, minorRadius, context, style) {
            Object.assign(context, style);
            context.beginPath();
            //TODO: 2015-03-12 this is currently only supported by chrome & opera
            context.ellipse(x, y, radius, minorRadius, 0, 0, 2 * Math.PI);
            context.fill();
            context.stroke();
            context.closePath();
        }
    }, {
        key: 'drawCircle',
        value: function drawCircle(x, y, radius, context, style) {
            Object.assign(context, style);
            context.beginPath();
            //TODO: 2015-03-12 this is currently only supported by chrome & opera
            context.arc(x, y, radius, 0, 2 * Math.PI);
            context.fill();
            context.stroke();
            context.closePath();
        }
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

},{}],"canvas-compositor":[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.CanvasCompositor = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Primitive = require('./Primitive');

Object.keys(_Primitive).forEach(function (key) {
	if (key === "default" || key === "__esModule") return;
	Object.defineProperty(exports, key, {
		enumerable: true,
		get: function get() {
			return _Primitive[key];
		}
	});
});

var _Composition = require('./Composition');

Object.keys(_Composition).forEach(function (key) {
	if (key === "default" || key === "__esModule") return;
	Object.defineProperty(exports, key, {
		enumerable: true,
		get: function get() {
			return _Composition[key];
		}
	});
});

var _Renderer = require('./Renderer');

Object.keys(_Renderer).forEach(function (key) {
	if (key === "default" || key === "__esModule") return;
	Object.defineProperty(exports, key, {
		enumerable: true,
		get: function get() {
			return _Renderer[key];
		}
	});
});

var _Primitive2 = _interopRequireDefault(_Primitive);

var _Composition2 = _interopRequireDefault(_Composition);

var _Renderer2 = _interopRequireDefault(_Renderer);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//const FPS_EPSILON = 10; // +/- 10ms for animation loop to determine if enough time has passed to render
var DEFAULT_TARGET_FPS = 1000 / 60; //amount of time that must pass before rendering

/**
 * The CanvasCompositor class is the entry-point to usage of the `canvas-compositor`.
 * The application programmer is expected to hand over low-level control of the canvas
 * context to the high-level classes and methods exposed by CanvasCompositor.
 */

var CanvasCompositor = exports.CanvasCompositor = function () {
	/**
  * The CanvasCompositor class provides a context in which to
  * @param canvas {Object} This should be a canvas, either from the DOM or from the `canvas` package
  * @example
  * let cc = new CanvasCompositor(document.getElementById('myCanvas'));
  */
	function CanvasCompositor(canvas) {
		_classCallCheck(this, CanvasCompositor);

		this.canvas = canvas;
		this.context = this.canvas.getContext('2d');

		this._targetFPS = DEFAULT_TARGET_FPS;
		this._currentTime = 0;
		this._lastRenderTime = 0;
		this.scene = new _Composition2.default(this.canvas);
	}

	/**
  * The animation loop for this instance of CanvasCompositor.
  * Upon receipt of the animation frame from `requestAnimationFrame`, the loop will check
  * whether enough time has passed to redraw for the target framerate.
  * It will only draw if somewhere along the scene graph, an object needs updating.
  * There is no need to invoke this directly, the constructor will do it.
  */


	_createClass(CanvasCompositor, [{
		key: '_animationLoop',
		value: function _animationLoop() {
			window.requestAnimationFrame(animationLoop);
			this._currentTime = +new Date();
			//set maximum of 60 fps and only redraw if necessary
			if (this._currentTime - this._lastRenderTime >= this._targetFPS && this.Scene.NeedsUpdate) {
				this._lastRenderTime = +new Date();
				_Renderer2.default.clearRect(this._context, 0, 0, this._canvas.width, this._canvas.height);
				this.Scene.draw(this._context);
			}
		}
	}]);

	return CanvasCompositor;
}();

exports.default = CanvasCompositor;

/*
define(['lodash', 'renderer', 'canvas-object', 'vector-path', 'rectangle', 'ellipse', 'circle', 'text', 'image', 'container'], function (_, Renderer, CanvasObject, Path, Rectangle, Ellipse, Circle, Text, Image, Container) {
	'use strict';

	var _events = {
		PRESS_UP: 'onpressup',
		PRESS_DOWN: 'onpressdown',
		PRESS_MOVE: 'onpressmove',
		PRESS_CANCEL: 'onpresscancel',
		PRESS: 'onpress'
	};

	var _lastKnownTouchLocation;

	function CanvasCompositor(canvas, options) {
		this._canvas = canvas;
		this._context = this._canvas.getContext('2d');
		this._targetObject = null;

		this._updateThreshhold = 1000 / 60; //amount of time that must pass before rendering
		this._lastRenderTime = 0; //set to 0 to make sure first render happens right away
		this._currentTime = 0;
		this.style = _.extend({}, Renderer.DEFAULTS, options);

		this.Scene = new Container({
			x: 0,
			y: 0
		});

		this._bindEvents();
		this._eventRegistry = {
			onpressup: [],
			onpressdown: [],
			onpressmove: [],
			onpresscancel: [],
			onpress: []
		};

		this._animationLoop();
	}

	CanvasCompositor.prototype.registerEvent = function _registerEvent(eventType, callback) {
		if (this._eventRegistry[eventType]) {
			this._eventRegistry[eventType].push(callback);
		}
	};

	CanvasCompositor.prototype.removeEvent = function _removeEvent(eventType, callback) {
		if (this._eventRegistry[eventType]) {
			var index = this._eventRegistry[eventType].indexOf(callback);
			if (index >= 0) {
				return this._eventRegistry[eventType].splice(index, 1);
			}
		}
	};

	CanvasCompositor.prototype._bindEvents = function () {
		this._canvas.addEventListener('mousedown', _.bind(this._handlePressDown, this));
		this._canvas.addEventListener('mouseup', _.bind(this._handlePressUp, this));
		this._canvas.addEventListener('mousemove', _.bind(this._handlePressMove, this));
		this._canvas.addEventListener('mouseout', _.bind(this._handlePressCancel, this));
		this._canvas.addEventListener('click', _.bind(this._handlePress, this));

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

	CanvasCompositor.prototype._handlePressDown = function (e) {
		e.preventDefault();

		var style = window.getComputedStyle(this._canvas);
		var leftPadding = parseFloat(style.getPropertyValue('border-left')) +
			parseFloat(style.getPropertyValue('padding-left'));
		var topPadding = parseFloat(style.getPropertyValue('border-top')) +
			parseFloat(style.getPropertyValue('padding-top'));

		var x = e.offsetX - leftPadding;
		var y = e.offsetY - topPadding;

		//pass through x and y to propagated events
		e.canvasX = x;
		e.canvasY = y;

		_.each(this._eventRegistry[_events.PRESS_DOWN], function (callback) {
			callback(e);
		});

		var clickedObject = this.Scene.PressableChildAt(x, y);

		if (clickedObject && clickedObject.onpressdown) {
			clickedObject.onpressdown(e);
		}
	};

	CanvasCompositor.prototype._handlePressUp = function (e) {
		e.preventDefault();

		var style = window.getComputedStyle(this._canvas);
		var leftPadding = parseFloat(style.getPropertyValue('border-left')) +
			parseFloat(style.getPropertyValue('padding-left'));
		var topPadding = parseFloat(style.getPropertyValue('border-top')) +
			parseFloat(style.getPropertyValue('padding-top'));

		var x = e.offsetX - leftPadding;
		var y = e.offsetY - topPadding;

		//pass through x and y to propagated events
		e.canvasX = x;
		e.canvasY = y;

		_.each(this.Scene.children, function (c) {
			if (c.draggable && c.onpressup) {
				c.onpressup(e);
			}
		});

		_.each(this._eventRegistry[_events.PRESS_UP], function (callback) {
			callback(e);
		});

		var clickedObject = this.Scene.PressableChildAt(x, y);

		if (clickedObject && clickedObject.onpressup) {
			clickedObject.onpressup(e);
		}
	};

	CanvasCompositor.prototype._handlePressMove = function (e) {
		e.preventDefault();
		var objects = _.filter(this.Scene.children, function (c) {
			// `!!` is a quick hack to convert to a bool
			return !!(c.onpressmove);
		});

		_.each(this._eventRegistry[_events.PRESS_MOVE], function (callback) {
			callback(e);
		});

		_.each(objects, function (o) {
			o.onpressmove(e);
		});
	};

	CanvasCompositor.prototype._handlePress = function (e) {
		e.preventDefault();

		var style = window.getComputedStyle(this._canvas);
		var leftPadding = parseFloat(style.getPropertyValue('border-left')) +
			parseFloat(style.getPropertyValue('padding-left'));
		var topPadding = parseFloat(style.getPropertyValue('border-top')) +
			parseFloat(style.getPropertyValue('padding-top'));

		var x = e.offsetX - leftPadding;
		var y = e.offsetY - topPadding;

		//pass through x and y to propagated events
		e.canvasX = x;
		e.canvasY = y;

		var objects = _.filter(this.Scene.children, function (c) {
			// `!!` is a quick hack to convert to a bool
			return !!(c.onpress);
		});

		_.each(this._eventRegistry[_events.PRESS], function (callback) {
			callback(e);
		});

		_.each(objects, function (o) {
			o.onpress(e);
		});
	};

	CanvasCompositor.prototype._handlePressCancel = function (e) {
		e.preventDefault();

		var objects = _.filter(this.Scene.children, function (c) {
			// `!!` is a quick hack to convert to a bool
			return !!(c.onpresscancel);
		});

		_.each(objects, function (o) {
			o.onpresscancel(e);
		});

		_.each(this._eventRegistry[_events.PRESS_CANCEL], function (callback) {
			callback(e);
		});
	};

	Object.defineProperty(CanvasCompositor.prototype, 'targetObject', {
		configurable: true,
		enumerable: true,
		get: function _getTargetObject() {
			return this._targetObject;
		},
		set: function _setTargetObject(o) {
			this._targetObject = o;
		}
	});

	CanvasCompositor.prototype._animationLoop = function _animationLoop() {
		window.requestAnimationFrame(_.bind(this._animationLoop, this));
		this._currentTime = +new Date();
		//set maximum of 60 fps and only redraw if necessary
		if (this._currentTime - this._lastRenderTime >= this._updateThreshhold && this.Scene.NeedsUpdate) {
			this._lastRenderTime = +new Date();
			Renderer.clearRect(this._context, 0, 0, this._canvas.width, this._canvas.height);
			this.Scene.draw(this._context);
		}
	};

	//expose primitive canvas functions at high level
	CanvasCompositor.prototype.drawPath = function _drawPath(vertices) {
		Renderer.drawPath(this._context, vertices, this.style);
	};

	//expose primitive canvas functions at high level
	CanvasCompositor.prototype.drawRectangle = function _drawRectangle(x, y, width, height) {
		Renderer.drawRectangle(this._context, x, y, width, height || width, this.style);
	};

	//expose primitive canvas functions at high level
	CanvasCompositor.prototype.drawEllipse = function _drawEllipse(x, y, radius, minorRadius) {
		Renderer.drawEllipse(this._context, x, y, radius, (minorRadius || radius), this.style);
	};

	//expose primitive canvas functions at high level
	CanvasCompositor.prototype.drawCircle = function _drawCircle(x, y, radius) {
		Renderer.drawEllipse(this._context, x, y, radius, this.style);
	};

	//expose primitive canvas functions at high level
	CanvasCompositor.prototype.drawText = function _drawText(x, y, text) {
		Renderer.drawText(this._context, x, y, text, this.style);
	};

	//expose primitive canvas functions at high level
	CanvasCompositor.prototype.measureText = function _measureText(text) {
		Renderer.measureText(this._context, text, this.style);
	};

	//expose primitive canvas functions at high level
	CanvasCompositor.prototype.drawImage = function _drawImage(x, y, image) {
		Renderer.drawImage(this._context, x, y, image, this.style);
	};

	CanvasCompositor.prototype.draw = function _draw(canvasObject) {
		if (canvasObject) {
			canvasObject.draw();
			return;
		}
	};

	//get the context for direct drawing to the canvas
	CanvasCompositor.prototype.getContext = function _getContext() {
		return this._context;
	};

	CanvasCompositor.Path = Path;
	CanvasCompositor.Rectangle = Rectangle;
	CanvasCompositor.Ellipse = Ellipse;
	CanvasCompositor.Text = Text;
	CanvasCompositor.Image = Image;
	CanvasCompositor.Circle = Circle;
	CanvasCompositor.Container = Container;

	CanvasCompositor.Events = _events;

	CanvasCompositor.prototype.Scene = null;

	return CanvasCompositor;
});
*/

},{"./Composition":4,"./Primitive":5,"./Renderer":6}]},{},[])

//# sourceMappingURL=canvas-compositor.js.map
