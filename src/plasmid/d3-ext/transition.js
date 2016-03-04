/**
 * Created by bqxu on 16/2/2.
 */

export let transition = (t, s, r)=> {
  let trans = translate(t.x, t.y);
  trans += scale(s.x, s.y);
  trans += rotate(r.angle, r.x, r.y);
  return trans;
};

export let translate = (x = 0, y = 0)=> {
  return `translate(${x} ${y})`
};

export let scale = (x = 1, y = 1)=> {
  return `scale(${x} ${y})`;
};

export let skewX = function (angle) {
  return `skewX(${angle})`;
};

export let skewY = function (angle) {
  return `skewY(${angle})`;
};

export let rotate = function (angle = 0, x = 0, y = 0) {
  return `rotate(${angle} ${x} ${y})`
};
