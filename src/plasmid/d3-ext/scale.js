/**
 * Created by bqxu on 16/2/2.
 */
let d3 = require("d3");
let angle2radian = function (angle) {
  return 2 * Math.PI / 360 * angle;
};

let radian2angle = function (radian) {
  return radian * 360 / 2 / Math.PI;
};

let angleX = function (angle) {
  return Math.sin(angle2radian(angle));
};

let angleY = function (angle) {
  return Math.cos(angle2radian(angle));
};

let geX = function (geLength, index) {
  return Math.sin(angle2radian(angle4ge(geLength) * index + angle4ge(geLength) / 2));
};

let geY = function (geLength, index) {
  return Math.cos(angle2radian(angle4ge(geLength) * index + angle4ge(geLength) / 2));
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

var r4unitGE = function (geLength, unitGE, unitGE1 = 30) {
  return (r4ge(geLength, unitGE1) * unitGE / unitGE1).toFixed(8);
};

var percent100 = function (per, sum) {
  return per * 100 / sum;
};

var angle4RadianLength = function (r, length) {
  return length * 180 / r / Math.PI
};

var angle42angle = function (a, b) {
  let c = Math.abs(a - b);
  return c > 180 ? 360 - c : c;
};

var minAngle4angle2Feature = function (feature, angle) {
  let angleA = (feature.loc.startAngle + feature.loc.endAngle) / 2;
  let aArr = [];
  aArr.push(angle42angle(angleA, angle));
  aArr.push(angle42angle(feature.loc.startAngle, angle));
  aArr.push(angle42angle(feature.loc.endAngle, angle));
  aArr.sort(function (ia, ib) {
    if (ia < ib) {
      return -1
    }
    return 1;
  });
  return aArr[0];
};

export {
  xy4angle,
  percent100,
  r4ge,angle4ge,
  geX,geY,
  radianLength4angle,
  angle4RadianLength,
  radian4ge,angle4xy,
  r4unitGE,
  scaleLinear,
  angle42angle,
  radian2angle,
  minAngle4angle2Feature
};
