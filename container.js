define(['lodash', 'canvas-object', 'renderer'], function (_, CanvasObject, Renderer) {
	'use strict';

	function Container(options) {
		CanvasObject.call(this, options);
		this.children = options.children || [];
		this.masks = options.masks || [];

		Object.defineProperty(this, 'boundingBox', {
			configurable: true,
			enumerable: true,
			get: function () {
				var top = null,
					left = null,
					bottom = null,
					right = null;

				_.each(this.children, function (c) {
					top = top !== null && top < c.boundingBox.top ? top : c.boundingBox.top;
					left = left !== null && left < c.boundingBox.left ? left : c.boundingBox.left;
					bottom = bottom !== null && bottom > c.boundingBox.bottom ? bottom : c.boundingBox.bottom;
					right = right !== null && right > c.boundingBox.right ? right : c.boundingBox.right;
				});

				return {
					top: top,
					left: left,
					bottom: bottom,
					right: right
				};
			}
		});
	}

	_.assign(Container.prototype, CanvasObject.prototype);

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
		this.NeedsUpdate = true;
		this.NeedsRender = true;
	};

	Container.prototype.addMask = function _addMask(mask) {
		mask.parent = this;
		//mask.d = mask.d.add(this.d);
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

		_.each(this.children, function (c) {
			c.draw(renderContext, contextOffset);
		});
		renderContext.globalCompositeOperation = 'destination-out';
		contextOffset = {
			top: -this.boundingBox.top,
			left: -this.boundingBox.left,
			bottom: -this.boundingBox.bottom,
			right: -this.boundingBox.right
		};
		_.each(this.masks, function (m) {
			m.draw(renderContext, contextOffset);
		});
		renderContext.globalCompositeOperation = 'normal';
	}; //should be overridden by implementors

	Container.prototype.parent = null;
	Container.prototype.children = [];

	return Container;
});