/**
 * Created by bqxu on 16/2/2.
 */
let d3 = require("d3");
let angle2radian = function (angle) {
  return 2 * Math.PI / 360 * angle;
};

let radian2angle = function (radian) {
  return radian * 360 / 2 / Math.PI;
}

let angleX = function (angle) {
  return Math.sin(angle2radian(angle));
};

let angleY = function (angle) {
  return Math.cos(angle2radian(angle));
};

let geX = function (geLength, angle) {
  return Math.sin(angle2radian(angle4ge(geLength) * angle + angle4ge(geLength) / 4));
};

let geY = function (geLength, angle) {
  return Math.cos(angle2radian(angle4ge(geLength) * angle + angle4ge(geLength) / 4));
};

let xy4angle = function (angle, r = 1) {
  return {
    x: angleX(angle) * r,
    y: angleY(angle) * r
  }
};

let angle4ge = function (geLength) {
  return 360 / geLength;
};

let radian4ge = function (geLength) {
  return angle2radian(360 / geLength);
};

let r4ge = function (geLength, geWidth) {

  return geWidth * 180 / Math.PI / angle4ge(geLength);
};

let radianLength4angle = function (r, angle) {
  return angle * Math.PI * r / 180;
};

let radian4xy = function (rx, ry, x, y) {
  let a = x - rx;
  let b = y - ry;
  let c = Math.sqrt(a * a + b * b);
  if (a > 0 && b < 0) {
    return Math.asin(a / c);
  } else if (a > 0 && b > 0) {
    return Math.asin(b / c) + 90 * Math.PI / 180;
  } else if (b < 0 && a < 0) {
    return Math.asin(a / c);
  } else {
    return -(Math.asin(b / c) + 90 * Math.PI / 180);
  }
};

let angle4xy = function (rx, ry, x, y) {
  return radian2angle(radian4xy(rx, ry, x, y));
};

var scaleLinear = function (diameter, width) {
  return d3.scale.linear().domain([0, diameter]).range([0, width]);
};

export {
  xy4angle,
  r4ge,angle4ge,
  geX,geY,
  radianLength4angle,
  radian4ge,angle4xy,
  scaleLinear
};
