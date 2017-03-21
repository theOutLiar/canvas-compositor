import { Primitive } from './Primitive';

export default class Composition extends Primitive {
    constructor(children, masks) {
        super();
        this.children = children || [];
        this.masks = masks;
    }

    get boundingBox() {
        var top = null,
            left = null,
            bottom = null,
            right = null;

        for (var c of this.children) {
            top = top !== null && top < c.boundingBox.top ? top : c.boundingBox.top;
            left = left !== null && left < c.boundingBox.left ? left : c.boundingBox.left;
            bottom = bottom !== null && bottom > c.boundingBox.bottom ? bottom : c.boundingBox.bottom;
            right = right !== null && right > c.boundingBox.right ? right : c.boundingBox.right;
        };

        return {
            top: top,
            left: left,
            bottom: bottom,
            right: right
        };
    }
}

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
