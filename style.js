define(['lodash'], function (_) {
    'use strict';

    function Style(options) {
        _.assign(this.CurrentStyle, Style.DEFAULTS, options || {});
    }

    Style.DEFAULTS = {
        //direction: 'inherit',
        fillStyle: 'black',
        //filter: 'none',
        strokeStyle: 'black',
        lineCap: 'butt',
        lineWidth: 1.0,
        lineJoin: 'miter',
        miterLimit: 10,
        font: '10px sans-serif',
        textAlign: 'start',
        textBaseline: 'alphabetic'
    };

    Style.prototype.CurrentStyle = Style.DEFAULTS;

    return Style;
});