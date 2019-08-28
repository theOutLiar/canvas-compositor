import { PrimitiveComponent } from './PrimitiveComponent';

/**
 * The Composition class is an extension of the Primitive that is
 * composed of other extensions of the Primitive. The Composition
 * is used to establish the Scene graph as the parent of all other
 * objects on screen. This is the key abstraction of the [composite
 * pattern](https://en.wikipedia.org/wiki/Composite_pattern): an
 * action taken on the parent element acts upon all of the children,
 * and transatively, all of their children.
 */
export class Composition extends PrimitiveComponent {
    /**
     * @param {object} options object settings
     */
    constructor(options) {
        super(options);
        options = options || {};
        /**
         * The children of this composition
         */
        this._children = options.children || [];
    }

    /**
     * children of this composition
     * @type {Array} children the which compose this object
     */
    get children() {
        return this._children;
    }

    /**
     * the bounding box of the composition (i.e., the containing bounds of all the children of this composition)
     * @type {{top:number, left:number, right:number, bottom:number}} boundingBox
     */
    get boundingBox() {
        let top = Infinity,
            left = Infinity,
            bottom = -Infinity,
            right = -Infinity;

        for (let c of this.children) {
            let boundingBox = c.boundingBox;
            top = Math.min(boundingBox.top, top);
            left = Math.min(boundingBox.left, left);
            bottom = Math.max(boundingBox.bottom, bottom);
            right = Math.max(boundingBox.right, right);
        };

        return {
            top: top,
            left: left,
            bottom: bottom,
            right: right
        };
    }


    /**
     * the an array of children that are found at (x, y)
     * @return {object} childrenAt all the children below the point
     * @param {number} x the x coordinate
     * @param {number} y the y coordinate
     */
    childrenAt(x, y) {
        return this.children.filter((c) => c.PointIsInObject(x, y));
    }

    /**
     * get the top-most child at the (x, y)
     * @return {object} childAt the first child below the point
     * @param {number} x the x coordinate
     * @param {number} y the y coordinate
     */
    childAt(x, y) {
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
    addChild(child) {
        child.parent = this;
        this.children.push(child);
        super.needsRender = true;
        super.needsDraw = true;
        //TODO: make this hook more generic
        //by using a registry
        //if (this.onchildadded) {
        //  this.onchildadded();
        //}
    }

    /**
     * add multiple children to the composition
     * @param {object} children the list of children to be added
     */
    addChildren(children){
        for (let c of children){
            this.addChild(c);
        }
    }

    /**
     * remove a child from this composition
     * @param {object} child the child to be removed
     * @return {object} the child removed
     */
    removeChild(child) {
        if (child) {
            var index = this.children.indexOf(child);
            if (index >= 0) {
                super.needsRender = true;
                super.needsDraw = true;
                return this.children.splice(index, 1);
            }
        }
    };

    /**
     * @override
     * override the render functiont to render the children onto this compositions prerendering canvas
     */
    render() {
        // required to make sure that the drawing occurs within the bounds of this composition
        let boundingBox = this.boundingBox;
        var offset = {
            top: -boundingBox.top,
            left: -boundingBox.left,
            bottom: -boundingBox.bottom,
            right: -boundingBox.right
        };

        for (let c of this.children) {
            c.draw(this._prerenderingContext, offset);
        };

        // `destination-out` will erase things
        //this._prerenderingContext.globalCompositeOperation = 'destination-out';
        //_.each(this.masks, function (m) {
        //m.draw(renderContext, contextOffset);
        //});
        //renderContext.globalCompositeOperation = 'normal';
    };
}
