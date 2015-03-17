define(['lodash', 'vector', 'renderer'], function (_, Vector, Renderer) {
	'use strict';

	function CanvasObject(options) {
		this.d = new Vector([options.x || 0, options.y || 0]);
		this.style = _.assign({}, Renderer.DEFAULTS, options.style);
		this.draggable = options.draggable || false;
		this._needsUpdate = false;
		this._needsRender = true;
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
		Object.defineProperty(this, 'offset', {
			configurable: true,
			enumerable: true,
			get: function () {
				if (this.parent) {
					return this.d.add(this.parent.offset);
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

			this.render();
			this.NeedsRender = false;
		}
		/*draw bounding boxes*/
		if(this.flags.DEBUG){
			this._prerenderingContext.beginPath();
			this._prerenderingContext.lineWidth=2.0;
			this._prerenderingContext.strokeStyle='#FF0000';
			this._prerenderingContext.strokeRect(0,0,this._prerenderedImage.width, this._prerenderedImage.height);
			this._prerenderingContext.closePath();
		}

		var x = this.boundingBox.left + (contextOffset && contextOffset.left ? contextOffset.left : 0);
		var y = this.boundingBox.top + (contextOffset && contextOffset.top ? contextOffset.top : 0);
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