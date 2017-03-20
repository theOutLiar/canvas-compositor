export const DEFAULTS = {
    //direction: 'inherit',
    fillStyle: 'black',
    //filter: 'none',
    strokeStyle: 'black',
    lineCap: 'round',
    lineWidth: 1.0,
    lineJoin: 'round',
    miterLimit: 10,
    font: '10px sans-serif',
    textAlign: 'start',
    textBaseline: 'alphabetic'
}

//TODO: masking? it looks like this is done in the Conposition, but that may be bugged out.

export default class Renderer {

    constructor() {}

    static clearRect(x, y, width, height, context) {
        context.clearRect(x, y, width, height);
    }

    static drawPath(vertices, context, style) {
        Object.assign(context, style);
        context.beginPath();
        let started = false;
        let x = 0;
        let y = 0;
        for (var v in vertices) {
            x = vertices[v].x;
            y = vertices[v].y;
            if (!started) {
                context.moveTo(x, y);
                started = true;
            } else {
                context.lineTo(x, y);
            }
        }
        context.stroke();
        context.closePath();
    }

    static drawPolygon(vertices, context, style) {
        Object.assign(context, style);
        context.beginPath();
        let started = false;
        let x = 0;
        let y = 0;
        for (var v in vertices) {
            x = vertices[v].x;
            y = vertices[v].y;
            if (!started) {
                context.moveTo(x, y);
                started = true;
            } else {
                context.lineTo(x, y);
            }
        }
        context.lineTo(vertices[0].x, vertices[0].y);
        context.stroke();
        context.closePath();
    }

    static drawRectangle(x, y, width, height, context, style) {
        Object.assign(context, style);
        context.beginPath();
        context.rect(x, y, width, height);
        context.fill();
        context.stroke();
        context.closePath();
    }

    static drawEllipse(x, y, radius, minorRadius, context, style) {
        Object.assign(context, style);
        context.beginPath();
        //TODO: 2015-03-12 this is currently only supported by chrome & opera
        context.ellipse(x, y, radius, minorRadius, 0, 0, 2 * Math.PI);
        context.fill();
        context.stroke();
        context.closePath();
    }

    static drawCircle(x, y, radius, context, style) {
        Object.assign(context, style);
        context.beginPath();
        //TODO: 2015-03-12 this is currently only supported by chrome & opera
        context.arc(x, y, radius, 0, 2 * Math.PI);
        context.fill();
        context.stroke();
        context.closePath();
    }

    staticdrawText(x, y, text, context, style) {
        Object.assign(context, style);
        context.beginPath();
        context.fillText(text, x, y);
        //TODO: implement stroke text if specified
        context.closePath();
    }

    static drawImage(x, y, image, context, style) {
        Object.assign(context, style);
        //no reason to draw 0-sized images
        if (image.width > 0 && image.height > 0) {
            context.beginPath();
            context.drawImage(image, x, y, image.width, image.height);
            context.closePath();
        }
    }

    //TODO: this should probably be exposed elsewhere/differently
    static measureText(text, context, style) {
        Object.assign(context, style);
        return context.measureText(text);
    }
}
