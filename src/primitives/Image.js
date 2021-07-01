import Component from '../core/Component';
import { drawImage } from '../graphics/Renderer';

/**
 * an Image
 */
export default class Image extends Component {
  /**
   * @param {Object} options
   */
  constructor(options) {
    super(options);
    /**
     * @type {window.Image} unscaledImage the original image
     */
    this.unscaledImage = options.image;
  }

  /**
   * get the bounding box
   * @type {{top: number, left: number, bottom: number, right:number}} boundingBox
   */
  get boundingBox() {
    let compoundScale = this.compoundScale;
    let offset = this.offset;
    return {
      top: offset.y,
      left: offset.x,
      bottom: offset.y + (compoundScale.scaleHeight * this.unscaledImage.height),
      right: offset.x + (compoundScale.scaleWidth * this.unscaledImage.width)
    };
  }

  /**
   * override the render function for images specifically
   * @override
   */
  render() {
    let scale = this.compoundScale;
    let image = new window.Image();
    image.src = this.unscaledImage.src;
    image.width = this.unscaledImage.width * scale.scaleWidth;
    image.height = this.unscaledImage.height * scale.scaleHeight;
    drawImage(0, 0, image, this._prerenderingContext, this.style);
  };
}
