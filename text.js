define(['lodash', 'canvas-object', 'renderer'], function (_, CanvasObject, Renderer) {
	'use strict';

	function Text(options) {
		CanvasObject.call(this, options);
		this.text = options.text;
		this.fontSize = options.fontSize || Text.DEFAULTS.fontSize;
		this.fontFamily = options.fontFamily || Text.DEFAULTS.fontFamily;
		this.fontStyle = options.fontStyle || Text.DEFAULTS.fontStyle;
		this.fontVariant = options.fontVariant || Text.DEFAULTS.fontVariant;
		this.fontWeight = options.fontWeight || Text.DEFAULTS.fontWeight;
		this.lineHeight = options.lineHeight || Text.DEFAULTS.lineHeight;
		this.textAlign = options.textAlign || Text.DEFAULTS.textAlign;
		this.textBaseline = options.textBaseline || Text.DEFAULTS.textBaseline;

		_.assign(this.style, options.style, {
			font: Text.FormatFontString(
				this.fontStyle,
				this.fontVariant,
				this.fontWeight,
				this.fontSize,
				this.lineHeight,
				this.fontFamily),
			textAlign: this.textAlign,
			textBaseline: this.textBaseline
		});

		this.textMetrics = Renderer.measureText(this._prerenderingContext, this.text, this.style);
		this.textMetrics.height = parseFloat(this.fontSize);
		this.updateBoundingRectangle();
	}

	Text.prototype.updateBoundingRectangle = function _updateBoundingRectangle(){
		this.boundingRectangle = {
			top: this.y + this.translation.y,
			left: this.x + this.translation.x,
			bottom: this.y + this.translation.y + this.textMetrics.height,
			right: this.x  + this.translation.x + this.textMetrics.width
		};
	};

	Text.FormatFontString = function _formatFontString(style, variant, weight, size, lineheight, family) {
		return style + ' ' + variant + ' ' + weight + ' ' + size + '/' + lineheight + ' ' + family;
	};

	Text.DEFAULTS = {
		fontSize: '16px',
		fontFamily: 'sans-serif',
		fontStyle: 'normal',
		fontVariant: 'normal',
		fontWeight: 'normal',
		lineHeight: 'normal',
		textAlign: 'start',
		//using 'top' instead of default 'alphabetic' because
		//baseline messes with ability to detect where text
		//is located. this will probably need to change.
		textBaseline: 'top'
	};

	_.assign(Text.prototype, CanvasObject.prototype);

	Text.prototype.render = function _render() {
		Renderer.drawText(this._prerenderingContext, 0, 0, this.text, this.style);
	};

	Text.prototype.PointIsInObject = function (x, y) {
		//x & y are starting vertex of the baseline...
		var lowerBoundX = this.x + this.translation.x,
			lowerBoundY = this.y + this.translation.y,
			upperBoundX = this.x + this.translation.x + this.textMetrics.width,
			upperBoundY = this.y + this.translation.y + this.textMetrics.height;
		return (
			x > lowerBoundX &&
			y > lowerBoundY &&
			x < upperBoundX &&
			y < upperBoundY
		);
	};

	return Text;
});