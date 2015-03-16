define(['lodash', 'canvas-object', 'renderer'], function (_, CanvasObject, Renderer) {
	'use strict';

	function Container(options) {
		CanvasObject.call(this, options);
		this.children = options.children || [];
		this.masks = options.masks || [];
		this.updateBoundingRectangle();
	}

	_.assign(Container.prototype, CanvasObject.prototype);

	Container.prototype.updateBoundingRectangle = function _updateBoundingRectangle() {
		var top = null,
			left = null,
			bottom = null,
			right = null;

		_.each(this.children, function(c){
			top = top !== null && top < c.boundingRectangle.top ? top : c.boundingRectangle.top;
			left = left !== null && left < c.boundingRectangle.left ? left : c.boundingRectangle.left;
			bottom = bottom !== null && bottom > c.boundingRectangle.bottom ? bottom : c.boundingRectangle.bottom;
			right = right !== null && right > c.boundingRectangle.right ? right : c.boundingRectangle.right;
		});
		this.x = left;
		this.y = top;
		this.boundingRectangle = {
			top: top + this.translation.y,
			left: left + this.translation.x,
			bottom: bottom + this.translation.y,
			right: right + this.translation.x
		};
	};

	Container.prototype.masks = [];
	Container.prototype.children = [];
	Container.prototype.ChildrenAt = function _childrenAt(x, y) {
		return _.filter(this.children, function (c) {
			return c.PointIsInObject(x, y);
		});
	};

	Container.prototype.ChildAt = function _childAt(x, y) {
		//loop over the children in reverse because drawing order
		for (var c = this.children.length - 1; c >= 0; c--) {
			if (this.children[c].PointIsInObject(x, y)) {
				return this.children[c];
			}
		}
		return null;
	};

	Container.prototype.PointIsInObject = function _pointIsInObject(x, y) {
		for (var c in this.children) {
			if (this.children[c].PointIsInObject(x, y)) {
				return true;
			}
		}
		return false;
	};

	Container.prototype.addChild = function _addChild(child) {
		child.parent = this;
		this.children.push(child);
		this.updateBoundingRectangle();
		this.NeedsUpdate = true;
		this.NeedsRedraw = true;
	};

	Container.prototype.addMask = function _addMask(mask) {
		mask.parent = this;
		this.masks.push(mask);
		this.NeedsUpdate = true;
		this.NeedsRedraw = true;
	};


	//TODO: need to account for translation... should re-work math for this...
	Container.prototype.render = function _render() {
		var renderContext = this._prerenderingContext;
		var contextOffset = {
			top: this.boundingRectangle.top - this.translation.y,
			left: this.boundingRectangle.left - this.translation.x,
			bottom: this.boundingRectangle.bottom - this.translation.y,
			right: this.boundingRectangle.right - this.translation.x
		};

		_.each(this.children, function (c) {
			c.draw(renderContext, contextOffset);
		});

		renderContext.globalCompositeOperation = 'destination-out';
		_.each(this.masks, function (m){
			m.draw(renderContext, contextOffset);
		});
		renderContext.globalCompositeOperation = 'normal';
	}; //should be overridden by implementors

	Container.prototype.parent = null;
	Container.prototype.children = [];

	return Container;
});