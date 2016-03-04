/**
 * Created by bqxu on 16/2/2.
 */
let d3 = require('d3');

export let showView = (el, {width,height,viewBox}) => {
  el.attr("width", `${width}`)
    .attr("height", `${height}`)
    .attr("viewBox", `${viewBox}`);
  return el;
};

export let viewBox = (x = 0, y = 0, width = 0, height = 0) => {
  return `${x} ${y} ${width} ${height}`;
};

export let appendRect = (parent, {width, height, x = 0, y = 0, rx = 0, ry = 0})=> {
  let rect = parent.append('rect');
  rect.attr("x", x);
  rect.attr("y", y);
  rect.attr("width", width);
  rect.attr("height", height);
  rect.attr("rx", rx);
  rect.attr("ry", ry);
  return rect;
};
