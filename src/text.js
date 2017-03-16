define(['lodash', 'canvas-object', 'renderer'], function (_, CanvasObject, Renderer) {
	'use strict';

	var ALL_CHARS = '1234567890QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm';

	//this is a version of:
	//http://stackoverflow.com/questions/1134586/how-can-you-find-the-height-of-text-on-an-html-canvas
	//it's a pretty awful hack.
	function _getTextHeight(font){
		//create an element with every character in it with this font
		var fontHolder = document.createElement('span');
		fontHolder.innerText = ALL_CHARS;
		fontHolder.style.font = font;

		//create an inline-block to place after the element
		var baselineRuler = document.createElement('div');
		baselineRuler.style.display = 'inline-block';
		baselineRuler.style.width = '1px';
		baselineRuler.style.height = '0';
		baselineRuler.style.verticalAlign = 'baseline';

		//place them in a wrapper and add it to the body
		var wrapper = document.createElement('div');
		wrapper.appendChild(fontHolder);
		wrapper.appendChild(baselineRuler);
		wrapper.style.whiteSpace = 'nowrap';
		document.body.appendChild(wrapper);

		//get their bounding rectangles and...
		var fontRect = fontHolder.getBoundingClientRect();
		var baselineRect = baselineRuler.getBoundingClientRect();

		//calculate their offset from top
		var fontTop = fontRect.top + document.body.scrollTop;
		var fontBottom = fontTop + fontRect.height;

		var baseline = baselineRect.top + document.body.scrollTop;

		document.body.removeChild(wrapper);

		//ascent equals the baseline location minus text top location
		var ascentFromBaseline = baseline - fontTop;

		//decent equals the text bottom location minuse the baseline location
		var descentFromBaseline = fontBottom - baseline;

		return {
			height: fontRect.height,
			ascent: ascentFromBaseline,
			descent: descentFromBaseline
		};
	}

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
					_.extend(this._textMetrics, _getTextHeight(this.style.font));
					this._textMetricsNeedUpdate = false;
				}
				return this._textMetrics;
			}
		});

		Object.defineProperty(this, 'boundingBox', {
			configurable: true,
			enumerable: true,
			get: function () {
				return {
					top: this.offset.y - this.textMetrics.ascent,
					left: this.offset.x,
					bottom: this.offset.y + this.textMetrics.descent,
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
		textBaseline: 'alphabetic'
	};

	Text.prototype.render = function _render() {
		this._textMetricsNeedUpdate = true;
		this._updateStyle();
		Renderer.drawText(this._prerenderingContext, 0, this.textMetrics.ascent, this.text, this.style);

		if(this.flags.DEBUG){
			Renderer.drawPath(this._prerenderingContext, [{x:0, y:this.textMetrics.ascent}, {x:this.textMetrics.width, y: this.textMetrics.ascent}], {strokeStyle:'Blue'});
			Renderer.drawCircle(this._prerenderingContext, 0, this.textMetrics.ascent, 3, {strokeStyle: 'Blue', fillStyle: 'Blue'});
		}
	};

	Text.prototype.PointIsInObject = function (x, y) {
		return CanvasObject.prototype.PointIsInObject.call(this, x, y);
	};

	return Text;
});