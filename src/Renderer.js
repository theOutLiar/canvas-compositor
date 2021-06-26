/**
 * Erase everything drawn on the supplied rectangle for the given context.
 * @param {number} x the x coordinate of the top left corner
 * @param {number} y the y coordinate of the top left corner
 * @param {number} width the x coordinate
 * @param {number} height the y coordinate
 * @param {object} context the 2D Context object for the canvas we're drawing onto
 */
export function clearRect(x, y, width, height, context) {
  context.clearRect(x, y, width, height);
}

/**
 * Draw a path, unclosed, with the given vertices
 * @param {object} vertices the path of vertices to be drawn
 * @param {object} context the 2D Context object for the canvas we're drawing onto
 * @param {object} style the style options to be used when drawing the path
 */
export function drawPath(vertices, context, style) {
  Object.assign(context, style);
  context.beginPath();
  context.moveTo(vertices[0].x, vertices[0].y);
  for (let v = 1; v < vertices.length; v++) {
    context.lineTo(vertices[v].x, vertices[v].y);
  }

  context.setLineDash(style.lineDash);
  context.stroke();
}

/**
 * Draw a closed polygon with the given vertices
 * @param {object} vertices the path of vertices to be drawn
 * @param {object} context the 2D Context object for the canvas we're drawing onto
 * @param {object} style the style options to be used when drawing the polygon
 */
export function drawPolygon(vertices, context, style) {
  Object.assign(context, style);
  context.beginPath();
  context.moveTo(vertices[0].x, vertices[0].y);
  for (let v = 1; v < vertices.length; v++) {
    context.lineTo(vertices[v].x, vertices[v].y);
  }
  context.closePath();
  context.setLineDash(style.lineDash);
  context.stroke();
}

/**
 * Draw a Bezier curve
 * @param {object} start the starting vertex
 * @param {object} end the ending vertext
 * @param {object} c1 control point 1
 * @param {object} c2 control point 2
 * @param {object} context the 2D Context object for the canvas we're drawing onto
 * @param {object} style the style options to be used when drawing the curve
 */
export function drawBezier(start, end, c1, c2, context, style) {
  Object.assign(context, style);
  //must `beginPath()` before `moveTo` to get correct starting position
  context.beginPath();
  context.moveTo(start.x, start.y);
  context.bezierCurveTo(c1.x, c1.y, c2.x, c2.y, end.x, end.y);
  context.setLineDash(style.lineDash);
  context.stroke();
  context.closePath();
}

/**
 * Draw a rectangle
 * @param {number} x the x coordinate of the top let corner
 * @param {number} y the y coordinate of the top left corner
 * @param {number} width the x coordinate
 * @param {number} height the y coordinate
 * @param {object} context the 2D Context object for the canvas we're drawing onto
 * @param {object} style the style options to be used when drawing the rectangle
 */
export function drawRectangle(x, y, width, height, context, style) {
  Object.assign(context, style);
  context.rect(x, y, width, height);
  context.fill();
  context.setLineDash(style.lineDash);
  context.stroke();
}

//TODO: provide support for rotation and startAngle parameters
/**
 * Draw an ellipse
 * @param {number} x the x coordinate of the center of the ellipse
 * @param {number} y the y coordinate of the center of the ellipse
 * @param {number} radius the larger radius of the ellipse
 * @param {number} minorRadius the smaller radius of the ellipse
 * @param {object} context the 2D Context object for the canvas we're drawing onto
 * @param {object} style the style options to be used when drawing the ellipse
 */
export function drawEllipse(x, y, radius, minorRadius, context, style) {
  Object.assign(context, style);
  //TODO: 2017-05-22 this is currently not supported by IE
  context.ellipse(x, y, radius, minorRadius, 0, 0, 2 * Math.PI);
  context.fill();
  context.setLineDash(style.lineDash);
  context.stroke();
}

/**
 * Draw a circle
 * @param {number} x the x coordinate of the center of the circle
 * @param {number} y the y coordinate of the center of the circle
 * @param {number} radius of the circle
 * @param {object} context the 2D Context object for the canvas we're drawing onto
 * @param {object} style the style options to be used when drawing the circle
 */
export function drawCircle(x, y, radius, context, style) {
  Object.assign(context, style);
  context.arc(x, y, radius, 0, 2 * Math.PI);
  //TODO: 2015-03-12 this is currently only supported by chrome & opera
  //context.ellipse(x, y, radius, radius, 0, 0, 2 * Math.PI);
  context.fill();
  context.setLineDash(style.lineDash);
  context.stroke();
}

/**
 * Draw text
 * @param {number} x the x coordinate of the top let corner
 * @param {number} y the y coordinate of the top left corner
 * @param {string} text the text to be drawn
 * @param {object} context the 2D Context object for the canvas we're drawing onto
 * @param {object} style the style options to be used when drawing the text
 */
export function drawText(x, y, text, context, style) {
  Object.assign(context, style);
  context.fillText(text, x, y);
  //TODO: implement stroke text if specified
}

/**
 * Draw an image
 * @param {number} x the x coordinate of the top let corner
 * @param {number} y the y coordinate of the top left corner
 * @param {object} image the image to be drawn to the canvas
 * @param {object} context the 2D Context object for the canvas we're drawing onto
 * @param {object} style the style options to be used when drawing the image
 */
export function drawImage(x, y, image, context, style) {
  Object.assign(context, style);
  //no reason to draw 0-sized images
  if (image.width > 0 && image.height > 0) {
    context.drawImage(image, x, y, image.width, image.height);
  }
}
