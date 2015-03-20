define(['lodash', 'canvas-object', 'renderer'], function (_, CanvasObject, Renderer) {
	'use strict';

	function Text(options) {
		CanvasObject.call(this, options);
		this.text = options.text;
		this.unscaledFontSize = options.fontSize || Text.DEFAULTS.fontSize;
		this.fontFamily = options.fontFamily || Text.DEFAULTS.fontFamily;
		this.fontStyle = options.fontStyle || Text.DEFAULTS.fontStyle;
		this.fontVariant = options.fontVariant || Text.DEFAULTS.fontVariant;
		this.fontWeight = options.fontWeight || Text.DEFAULTS.fontWeight;
		this.lineHeight = options.lineHeight || Text.DEFAULTS.lineHeight;
		this.textAlign = options.textAlign || Text.DEFAULTS.textAlign;
		this.textBaseline = options.textBaseline || Text.DEFAULTS.textBaseline;

		this._textMetricsNeedUpdate = true;
		this._textMetricsNeed = null;

		Object.defineProperty(this, 'fontSize', {
			configurable: true,
			enumerable: true,
			get: function(){
				return (parseFloat(this.unscaledFontSize) * this.GlobalFontScale) + 'px';
			}
		});

		Object.defineProperty(this, 'textMetrics', {
			configurable: true,
			enumerable: true,
			get: function(){
				if(this._textMetrics === null || this._textMetricsNeedUpdate){
					this._updateStyle();
					this._textMetrics = Renderer.measureText(this._prerenderingContext, this.text, this.style);
					this._textMetrics.height = parseFloat(this.fontSize);
					this._textMetricsNeedUpdate = false;
				}
				return this._textMetrics;
			}
		});

		Object.defineProperty(this, 'boundingBox', {
			configurable: true,
			enumerable: true,
			get: function () {
				this._textMetricsNeedUpdate = true;
				return {
					top: this.offset.y,
					left: this.offset.x,
					bottom: this.offset.y + this.textMetrics.height,
					right: this.offset.x + this.textMetrics.width
				};
			}
		});
	}

	_.assign(Text.prototype, CanvasObject.prototype);

	Text.prototype._updateStyle = function(options){
		_.assign(this.style, (options || {}), {
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

	Text.prototype.render = function _render() {
		this._updateStyle();
		Renderer.drawText(this._prerenderingContext, 0, 0, this.text, this.style);
	};

	Text.prototype.PointIsInObject = function (x, y) {
		//x & y are starting vertex of the baseline...
		var lowerBoundX = this.offset.x,
			lowerBoundY = this.offset.y,
			upperBoundX = this.offset.x + this.textMetrics.width,
			upperBoundY = this.offset.y + this.textMetrics.height;
		return (
			x > lowerBoundX &&
			y > lowerBoundY &&
			x < upperBoundX &&
			y < upperBoundY
		);
	};

	return Text;
});