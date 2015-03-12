define(['lodash', 'renderer'], function (_, Renderer) {
    function CanvasObject(options) {
        this.x = options.x || 0;
        this.y = options.y || 0;
        this.style = _.assign({}, options.style);
        this.draggable = options.draggable || false;
        this._needsUpdate = false;
        if (this.draggable) {
            this.enableDragging();
        }
    }

    CanvasObject.prototype.affixToPressPoint = function _affixToPressPoint(x, y){
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
        this.NeedsUpdate(true);
    };

    CanvasObject.prototype.dragEnd = function _dragEnd(e) {
        this.onpressdown = this.dragStart;
        this.onpressmove = null;
        this.onpressup = null;
        this.onpresscancel = null;
        this.NeedsUpdate(true);
    };

    CanvasObject.prototype.x = 0;
    CanvasObject.prototype.y = 0;
    CanvasObject.prototype.draggable = false;
    CanvasObject.prototype.context = null;
    CanvasObject.prototype.style = null;
    CanvasObject.prototype.scale = 1;
    CanvasObject.prototype.translation = {
        x: 0,
        y: 0
    }; //how much it's been translated

    CanvasObject.prototype.mouseOffset = {
        x: 0,
        y: 0
    };

    CanvasObject.prototype.draw = function _draw() {
        this.NeedsUpdate(false);
        if(this.render){
            this.render();
        }
    };

    CanvasObject.prototype.render = function _render(){}; //should be overridden by implementors

    CanvasObject.prototype.PointIsInObject = function _pointIsInObject() {
        return false;
    }; //should be overridden by implementors

    CanvasObject.prototype.onpressdown = null;
    CanvasObject.prototype.onpressup = null;
    CanvasObject.prototype.onpressmove = null;
    CanvasObject.prototype.onpresscancel = null;

    CanvasObject.prototype.NeedsUpdate = function(val){
        if(val===undefined){
            return this._needsUpdate;
        }else {
            if(this.parent){
                this.parent.NeedsUpdate(val);
            }
            return (this._needsUpdate = val);
        }
    };

    return CanvasObject;
});