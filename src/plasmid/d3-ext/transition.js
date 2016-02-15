/**
 * Created by bqxu on 16/2/2.
 */

var transition = (t, s, r)=> {
  let trans = translate(t.x, t.y);
  trans += scale(s.x, s.y);
  trans += rotate(r.angle, r.x, r.y);
  return trans;
};

var translate = (x = 0, y = 0)=> {
  return `translate(${x} ${y})`
};

var scale = (x = 1, y = 1)=> {
  return `scale(${x} ${y})`;
};

var skewX = function (angle) {
  return `skewX(${angle})`;
};

var skewY = function (angle) {
  return `skewY(${angle})`;
};

var rotate = function (angle = 0, x = 0, y = 0) {
  return `rotate(${angle} ${x} ${y})`
};


export {transition,translate,scale,rotate};
