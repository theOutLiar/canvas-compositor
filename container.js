define(['lodash', 'canvas-object'], function (_, CanvasObject) {
    'use strict';

    function Container(options) {
        CanvasObject.call(this, options);
        this.parent = options.parent || null;
    }

    _.assign(Container.prototype, CanvasObject.prototype);

    Container.prototype.children = [];
    Container.prototype.ChildrenAt = function _childrenAt(x, y) {
        return _.filter(this.children, function (c) {
            return c.IsPointInObject(x, y);
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

    Container.prototype.addChild = function _addChild(child){
        child.parent = this;
        this.children.push(child);
        this.NeedsUpdate(true);
    };

    Container.prototype.render = function _render() {
        _.each(this.children, function(cObj){
            cObj.draw();
        });
        this.NeedsUpdate(false);
    }; //should be overridden by implementors

    Container.prototype.parent = null;
    Container.prototype.children = [];

    Container.prototype.NeedsUpdate = function(val){
        if(val===undefined){
            return this._needsUpdate;
        }else {
            if(this.parent){
                this.parent.NeedsUpdate(val);
            }
            return (this._needsUpdate = val);
        }
    };

    return Container;
});