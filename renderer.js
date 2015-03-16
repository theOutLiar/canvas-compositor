define(['lodash'], function (_) {
	'use strict';

	var Renderer = {
		DEFAULTS: {
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
		},
		mask: false,
		clearRect: function _clearRect(context, x, y, width, height) {
			context.clearRect(x, y, width, height);
		},
		drawPath: function _draw(context, vertices, style) {
			_.assign(context, style);
			context.beginPath();
			var started = false;
			var x = 0;
			var y = 0;
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
		},
		drawRectangle: function _draw(context, x, y, width, height, style) {
			_.assign(context, style);
			context.beginPath();
			context.rect(x, y, width, height);
			context.fill();
			context.stroke();
			context.closePath();
		},
		drawEllipse: function _draw(context, x, y, radius, minorRadius, style) {
			_.assign(context, style);
			context.beginPath();
			//TODO: 2015-03-12 this is currently only supported by chrome & opera
			context.ellipse(x, y, radius, minorRadius, 0, 0, 2 * Math.PI);
			context.fill();
			context.stroke();
			context.closePath();
		},
		drawText: function _draw(context, x, y, text, style) {
			_.assign(context, style);
			context.beginPath();
			context.fillText(text, x, y);
			//TODO: does it make sense to `strokeText`
			//at all?! wtf are the implications of
			//lineWidth to the text measurements?
			//this._context.strokeText(text, x, y);
			context.closePath();
		},
		measureText: function _measureText(context, text, style) {
			_.assign(context, style);
			return context.measureText(text);
		},
		drawImage: function _draw(context, x, y, image, style) {
			_.assign(context, style);
			context.drawImage(image, x, y);
		}
	};

	return Renderer;
});