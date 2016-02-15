/**
 * Created by bqxu on 16/2/2.
 */
let d3 = require('d3');

var SVG = (el, {width,height,viewBox}) => {
  "use strict";
  el.attr("width", `${width}`)
    .attr("height", `${height}`)
    .attr("viewBox", `${viewBox}`);
  return el;
};

var appendSVG = function (parent, {width,height,viewBox}) {
  "use strict";
  let el = parent.append('svg');
  return SVG(el, {width, height, viewBox});
};

var viewBox = (x = 0, y = 0, width = 0, height = 0) => {
  return `${x} ${y} ${width} ${height}`;
};

export {SVG,appendSVG,viewBox};
