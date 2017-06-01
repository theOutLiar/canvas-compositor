import Renderer from './Renderer';
import PrimitiveComponent from './PrimitiveComponent';

//uhh... i looked up *SO* much stuff on this, and even tried to work out the math myself,
//but this is ridiculous - where does this come from?
function _cubicBezier(start, c1, c2, end, t) {
    return start * (1 - t) * (1 - t) * (1 - t) + 3 * c1 * t * (1 - t) * (1 - t) + 3 * c2 * t * t * (1 - t) + end * t * t * t;
}


function _getExtremes(start, c1, c2, end) {

    let a = 3 * end - 9 * c2 + 9 * c1 - 3 * start;
    let b = 6 * c2 - 12 * c1 + 6 * start;
    let c = 3 * c1 - 3 * start;

    let solutions = [];
    let localExtrema = [];

    //"discriminant"
    let disc = b * b - 4 * a * c;

    if (disc >= 0) {
        if (!Math.abs(a) > 0 && Math.abs(b) > 0) {
            solutions.push(-c / b);
        } else if (Math.abs(a) > 0) {
            solutions.push((-b + Math.sqrt(disc)) / (2 * a));
            solutions.push((-b - Math.sqrt(disc)) / (2 * a));
        } else {
            throw new Error("no solutions!?!?!");
        }

        for (let t of solutions) {
            if (0 <= t && t <= 1) {
                localExtrema.push(_cubicBezier(start, c1, c2, end, t));
            }
        }
    }

    localExtrema.push(start, end);

    return localExtrema;
}

export default class Bezier extends PrimitiveComponent {
    constructor(options) {
        super(options);
        this._start = options.start;
        this._end = options.end;
        this._control1 = options.control1;
        this._control2 = options.control2;

        this._boundingBox = null;
        this._boundingBoxNeedsUpdate = true;

        //?
        //super.d = new Vector([this.boundingBox.left, this.boundingBox.top])
    }

    get boundingBox() {

        if (this._boundingBox === null || this._boundingBoxNeedsUpdate) {
            let xExtrema = _getExtremes(this._start.x, this._control1.x, this._control2.x, this._end.x);
            let yExtrema = _getExtremes(this._start.y, this._control1.y, this._control2.y, this._end.y);
            this._boundingBox = {
                top: Math.min.apply(null, yExtrema),
                right: Math.max.apply(null, xExtrema),
                bottom: Math.max.apply(null, yExtrema),
                left: Math.min.apply(null, xExtrema)
            }
            this._boundingBoxNeedsUpdate = false;
        }
        return this._boundingBox;
    }

    pointIsInObject(x, y) {
        return this.pointIsInBoundingBox(x, y);
    }

    render() {
        Renderer.drawBezier({
                x: this._start.x - this.offset.x,
                y: this._start.y - this.offset.y
            }, {
                x: this._end.x - this.offset.x,
                y: this._end.y - this.offset.x
            }, {
                x: this._control1.x - this.offset.x,
                y: this._control1.y - this.offset.y
            }, {
                x: this._control2.x - this.offset.x,
                y: this._control2.y - this.offset.y
            },
            this._prerenderingContext,
            this.style
        );
    }
}
