/**
 * As many basic characters as possible to fit into a string in order to measure the height
 */
const ALL_CHARS = `1234567890QWERTYUIOPASDFGHJKLZXCVBNMqwertyuiopasdfghjklzxcvbnm.,\`~;:'"!?@#$%^&*()_+={}[]|\<>/`;

/**
 * this technique is informed by
 * http://stackoverflow.com/questions/1134586/how-can-you-find-the-height-of-text-on-an-html-canvas
 * it's a pretty awful hack, and will not work in canvases on non-browser runtimes
 * @param {string} font the long form font string
 */
export function getTextHeight(font) {
    //
    //TODO: figure out how cross-browser this is

    //create an element with every character in it with this font
    let fontHolder = document.createElement('span');
    fontHolder.innerText = ALL_CHARS;
    fontHolder.style.font = font;

    //create an inline-block to place after the element
    let baselineRuler = document.createElement('div');
    baselineRuler.style.display = 'inline-block';
    baselineRuler.style.width = '1px';
    baselineRuler.style.height = '0';
    baselineRuler.style.verticalAlign = 'baseline';

    //place them in a wrapper and add it to the body
    let wrapper = document.createElement('div');
    wrapper.appendChild(fontHolder);
    wrapper.appendChild(baselineRuler);
    wrapper.style.whiteSpace = 'nowrap';
    document.body.appendChild(wrapper);

    //get their bounding rectangles and...
    let fontRect = fontHolder.getBoundingClientRect();
    let baselineRect = baselineRuler.getBoundingClientRect();

    //calculate their offset from top
    let fontTop = fontRect.top + document.body.scrollTop;
    let fontBottom = fontTop + fontRect.height;

    let baseline = baselineRect.top + document.body.scrollTop;

    document.body.removeChild(wrapper);

    //ascent equals the baseline location minus text top location
    let ascentFromBaseline = baseline - fontTop;

    //decent equals the text bottom location minuse the baseline location
    let descentFromBaseline = fontBottom - baseline;

    return {
        height: fontRect.height,
        ascent: ascentFromBaseline,
        descent: descentFromBaseline
    };
}


/**
 * format a longform font style
 * @param {string} fontStyle the font style
 * @param {string} fontVariant the font variant
 * @param {string} fontWeight the font weight
 * @param {string} fontSize the font size
 * @param {string} lineHeight the font height
 * @param {string} fontFamily the font family
 */
export function formatFontString(fontStyle, fontVariant, fontWeight, fontSize, lineHeight, fontFamily) {
    return `${fontStyle} ${fontVariant} ${fontWeight} ${fontSize}/${lineHeight} ${fontFamily}`;
}

/**
 * Measure the text
 * @param {string} text the text to be measured
 * @param {object} context the 2D Context object for a canvas - required for measurement to occur, but may be arbitrary
 * @param {object} style the style options to be used when measuring the text
 * @return {object} [TextMetrics](https://developer.mozilla.org/en-US/docs/Web/API/TextMetrics) object containing info like Width
 */
export function measureText(text, context, style) {
    Object.assign(context, style);
    return context.measureText(text);
}
