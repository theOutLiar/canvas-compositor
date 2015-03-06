define(['lodash'], function (_) {
    'use strict';

    function Style(options) {
        _.assign(this.CurrentStyle, Style.DEFAULTS, options || {});
    }

    Style.DEFAULTS = {
        strokeStyle: 'black',
        fillStyle: 'black',
        lineCap: 'butt',
        lineWidth: 1.0,
        lineJoin: 'miter',
        miterLimit: 10
    };

    Style.prototype.CurrentStyle = Style.DEFAULTS;

    return Style;
});