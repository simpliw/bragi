/**
 * Created by bqxu on 16/2/2.
 */
let d3 = require("d3");
export let angle2radian = (angle)  => {
  return 2 * Math.PI / 360 * angle;
};

export let radian2angle = (radian)=> {
  return radian * 360 / 2 / Math.PI;
};

export let angleX = (angle) => {
  return Math.sin(angle2radian(angle));
};

export let angleY = (angle) => {
  return Math.cos(angle2radian(angle));
};

export let geX = (geLength, index)=> {
  return Math.sin(angle2radian(angle4ge(geLength) * index + angle4ge(geLength) / 2));
};

export let geY = (geLength, index)=> {
  return Math.cos(angle2radian(angle4ge(geLength) * index + angle4ge(geLength) / 2));
};

export let xy4angle = (angle, r = 1)=> {
  return {
    x: angleX(angle) * r,
    y: angleY(angle) * r
  }
};

export let angle4ge = (geLength)=> {
  return 360 / geLength;
};

export let radian4ge = (geLength) => {
  return angle2radian(360 / geLength);
};

export let r4ge = (geLength, geWidth)=> {
  return geWidth * 180 / Math.PI / angle4ge(geLength);
};

export let radianLength4angle = (r, angle) => {
  return angle * Math.PI * r / 180;
};

export let radian4xy = (rx, ry, x, y) => {
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

export let angle4xy = (rx, ry, x, y)=> {
  return radian2angle(radian4xy(rx, ry, x, y));
};

export let scaleLinear = (diameter, width) => {
  return d3.scale.linear().domain([0, diameter]).range([0, width]);
};

export let r4unitGE = (geLength, unitGE, unitGE1 = 30)=> {
  return parseFloat((r4ge(geLength, unitGE1) * unitGE / unitGE1).toFixed(8));
};

export let unitGE4r = (r, geLength) => {
  return parseFloat((2 * Math.PI * r / geLength).toFixed(8));
};

export let percent100 = (per = 100, sum = 100)=> {
  return per * 100 / sum;
};

export let angle4RadianLength = (r, length) => {
  return length * 180 / r / Math.PI
};

export let angle42angle = (a, b)=> {
  let c = Math.abs(a - b);
  return c > 180 ? 360 - c : c;
};

export let minAngle4angle2Feature = (feature, angle)=> {
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


export let xy4ry = (r, y, cx = 0, cy = 0)=> {
  if (Math.abs(y - cy) > r) {
    return null;
  }
  let a = Math.sqrt(Math.pow(r, 2) - Math.pow(cy - y, 2));
  if (a == 0) {
    return null;
  }
  return [{
    x: cx + a,
    y: y
  }, {
    x: cx - a,
    y: y
  }]
};

export let xy4rx = (r, x, cx = 0, cy = 0)=> {
  if (Math.abs(x - cx) > r) {
    return null;
  }
  let a = Math.sqrt(Math.pow(r, 2) - Math.pow(cx - x, 2));
  if (a == 0) {
    return null;
  }
  return [{
    y: cy + a,
    x: x
  }, {
    y: cy - a,
    x: x
  }]
};

export let lineLength = (fx, fy, dx, dy)=> {
  return Math.sqrt(Math.pow(dx - fx, 2) + Math.pow(dy - fy, 2))
};
