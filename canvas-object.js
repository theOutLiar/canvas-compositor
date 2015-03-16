define(['lodash', 'vector', 'renderer'], function (_, Vector, Renderer) {
	'use strict';

	function CanvasObject(options) {
		this.x = options.x || 0;
		this.y = options.y || 0;
		this.style = _.assign({}, Renderer.DEFAULTS, options.style);
		this.draggable = options.draggable || false;
		this._needsUpdate = false;
		this._needsRedraw = true;
		this._prerenderedImage = document.createElement('canvas');
		this._prerenderingContext = this._prerenderedImage.getContext('2d');
		this.parent = options.parent || null;
		if (this.draggable) {
			this.enableDragging();
		}
		//putting defineProperty in constructor to make inheritable
		//on a tight schedule - would prefer to do this on the
		//prototype, because doing it otherwise means each instance
		//has to create a copy of the property/getters/setters
		Object.defineProperty(this, 'translation', {
			configurable: true,
			enumerable: true,
			set: function (val) {
				this._translation = new Vector([val.x, val.y]);
			},
			get: function () {
				if (this.parent) {
					return this._translation.add(this.parent.translation);
				} else {
					return this._translation;
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

		Object.defineProperty(this, 'NeedsRedraw', {
			configurable: true,
			enumerable: true,
			set: function (val) {
				if (this.parent && val) { //only mark the parent for update if true
					this.parent.NeedsRedraw = val;
				}
				return (this._needsRedraw = val);
			},
			get: function () {
				return this._needsRedraw;
			}
		});
	}

	CanvasObject.prototype.affixToPressPoint = function _affixToPressPoint(x, y) {
		this.mouseOffset = {
			x: x - (this.x + this.translation.x),
			y: y - (this.y + this.translation.y)
		};
	};

	CanvasObject.prototype.enableDragging = function _enableDragging() {
		this.onpressdown = this.dragStart;
	};

	CanvasObject.prototype.disableDragging = function _disableDragging() {
		this.onpressdown = null;
		this.onpressmove = null;
		this.onpressup = null;
		this.onpresscancel = null;
		this.NeedsRedraw = true;
		this.NeedsUpdate = true;
	};

	CanvasObject.prototype.dragStart = function _dragStart(e) {
		this.mouseOffset = {
			x: e.offsetX - (this.x + this.translation.x),
			y: e.offsetY - (this.y + this.translation.y)
		};
		this.onpressdown = null;
		this.onpressmove = this.drag;
		this.onpressup = this.dragEnd;
		this.onpresscancel = this.dragEnd;
	};

	CanvasObject.prototype.drag = function _drag(e) {
		this.translation = {
			x: e.offsetX - this.mouseOffset.x - this.x,
			y: e.offsetY - this.mouseOffset.y - this.y
		};
		this.NeedsRedraw = true;
		this.NeedsUpdate = true;
	};

	CanvasObject.prototype.dragEnd = function _dragEnd(e) {
		this.onpressdown = this.dragStart;
		this.onpressmove = null;
		this.onpressup = null;
		this.onpresscancel = null;
		this.NeedsRedraw = true;
		this.NeedsUpdate = true;
	};

	CanvasObject.prototype.x = 0;
	CanvasObject.prototype.y = 0;
	CanvasObject.prototype.draggable = false;
	CanvasObject.prototype.context = null;
	CanvasObject.prototype.style = null;
	CanvasObject.prototype.scale = 1;
	CanvasObject.prototype._translation = new Vector([0, 0]); //how much it's been translated

	CanvasObject.prototype._needsUpdate = false;

	CanvasObject.prototype.mouseOffset = {
		x: 0,
		y: 0
	};

	CanvasObject.prototype.draw = function _draw(context, contextOffset) {
		this.NeedsUpdate = false;

		if (this.NeedsRedraw && this.render) {
			this.updateBoundingRectangle();
			delete this._prerenderedImage;
			delete this._prerenderingContext;
			this._prerenderedImage = document.createElement('canvas');
			this._prerenderedImage.width = this.boundingRectangle.right - this.boundingRectangle.left;
			this._prerenderedImage.height = this.boundingRectangle.bottom - this.boundingRectangle.top;
			this._prerenderingContext = this._prerenderedImage.getContext('2d');
			this.render();
			this.NeedsRedraw = false;
		}

		var x = this.boundingRectangle.left - (contextOffset && contextOffset.left ? contextOffset.left : 0);
		var y = this.boundingRectangle.top - (contextOffset && contextOffset.top ? contextOffset.top : 0);
		Renderer.drawImage(context, x, y, this._prerenderedImage);
	};

	CanvasObject.prototype.render = function _render() {}; //should be overridden by implementors

	CanvasObject.prototype.PointIsInObject = function _pointIsInObject() {
		return false;
	}; //should be overridden by implementors

	CanvasObject.prototype.onpressdown = null;
	CanvasObject.prototype.onpressup = null;
	CanvasObject.prototype.onpressmove = null;
	CanvasObject.prototype.onpresscancel = null;

	return CanvasObject;
});