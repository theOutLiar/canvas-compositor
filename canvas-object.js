define(['lodash', 'vector', 'renderer'], function (_, Vector, Renderer) {
	'use strict';

	function CanvasObject(options) {
		this.d = new Vector([options.x || 0, options.y || 0]);

		this.style = _.assign({}, Renderer.DEFAULTS, options.style);
		this.unscaledLineWidth = this.style.lineWidth;

		this.pressPassThrough = options.pressPassThrough || false;
		this.draggable = options.draggable || false;

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
				//not sure what the best approach for line scale is...
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
		/*draw bounding boxes*/
		if (this.flags.DEBUG) {
			this._prerenderingContext.beginPath();
			this._prerenderingContext.lineWidth=2.0;
			this._prerenderingContext.strokeStyle='#FF0000';
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
		if (this.pressPassThrough){
			return false;
		}

		return this.PointIsInBoundingBox(x, y);
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
				this.parent.children.splice(0, 0, this); //if index + 1 > siblings.length, inserts it at end
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