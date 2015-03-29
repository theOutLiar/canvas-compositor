define(['lodash'], function (_) {
	'use strict';

	//TODO: would like to use SVG if/where/when possible - not sure of performance implications
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
		drawPath: function _drawPath(context, vertices, style) {
			_.assign(context, style || {});
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
		drawRectangle: function _drawRectangle(context, x, y, width, height, style) {
			_.assign(context, style || {});
			context.beginPath();
			context.rect(x, y, width, height);
			context.fill();
			context.stroke();
			context.closePath();
		},
		drawEllipse: function _drawEllipse(context, x, y, radius, minorRadius, style) {
			_.assign(context, style || {});
			context.beginPath();
			//TODO: 2015-03-12 this is currently only supported by chrome & opera
			context.ellipse(x, y, radius, minorRadius, 0, 0, 2 * Math.PI);
			context.fill();
			context.stroke();
			context.closePath();
		},
		drawCircle: function _drawCircle(context, x, y, radius, style){
			_.assign(context, style || {});
			context.beginPath();
			//TODO: 2015-03-12 this is currently only supported by chrome & opera
			context.arc(x, y, radius, 0, 2 * Math.PI);
			context.fill();
			context.stroke();
			context.closePath();
		},
		drawText: function _drawText(context, x, y, text, style) {
			_.assign(context, style || {});
			context.beginPath();
			context.fillText(text, x, y);
			//TODO: implement stroke text if specified
			context.closePath();
		},
		measureText: function _measureText(context, text, style) {
			_.assign(context, style || {});
			return context.measureText(text);
		},
		drawImage: function _drawImage(context, x, y, image, style) {
			_.assign(context, style || {});
			//no reason to draw 0-sized images
			if(image.width > 0 && image.height > 0){
				context.beginPath();
				context.drawImage(image, x, y);
				context.closePath();
			}
		}
	};

	return Renderer;
});