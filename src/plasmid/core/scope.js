/**
 * Created by bqxu on 16/2/5.
 */
let {r4ge} =require("../d3-ext/scale");
let unitGE100 = 30;

class Scope {

  constructor(origin, features, width, height) {
    this.origin = locOrigin(origin);
    this.features = features;
    this.width = width;
    this.height = height;
    let ol = this.origin.length;
    //case1:显示 origin ATCG  & features label
    //case2:显示 origin color & features label
    //case2:show origin & no label
    //origin 一个环

    //unitGE=3;     font 8
    //unitGE=18;    font 16
    //unitGE=30;    font 16
    //500 width
    //200ge       100%
    //200ge       33%
    //20ge        10%

    this.r100 = r4ge(ol, unitGE100);
    this.rwidth = width / 2;
    this.level = locFeatures(this.features, ol);
  }

  scale(percent) {
    let ol = this.origin.length;
    let unitGE = unitGE100 * percent / 100;
    let r = r4ge(ol, unitGE);
    let y = r + this.rwidth / 2;
    if (r < this.rwidth) {
      y = this.rwidth;
      r = y;
    }
    return {
      circle: new Circle(this.width / 2, y, r),
      limit: {
        r: r,
        du: 5 * 100 / percent
      },
      origin: {}
    };
  }
}

class Circle {
  constructor(x, y, r) {
    this.x = x;
    this.y = y;
    this.r = r;
  }


  translate() {
    return {
      x: this.x,
      y: this.y
    }
  }
}

var locFeatures = function (features, length) {
  let ft = [];
  let levelMax = 0;
  features.forEach(function (d) {
    var match = /(\d+)\.\.(\d+)/.exec(d.location.replace(/[<>]/g, ''));
    if (match) {
      d.loc = {start: Number(match[1]), end: Number(match[2])};
      d.loc.length = d.loc.end - d.loc.start + 1;
      if (/^complement/.test(d.location)) {
        d.loc.complement = "true";
      }
      d.loc.startAngle = d.loc.start / length * 360;
      d.loc.endAngle = d.loc.end / length * 360;
      d.loc.angle = d.loc.length / length * 360;

      if (d.qualifier.label === undefined && d.qualifier.note !== undefined) {
        d.qualifier.label = d.qualifier.note;
      }
      let ftl = ft.length;
      let fl = 0;
      while (ftl--) {
        let feature = ft[ftl];
        let flevel = d.loc.level;
        if (d.loc.start >= feature.loc.start && d.loc.start <= feature.loc.end || d.loc.end >= feature.loc.start && d.loc.end <= feature.loc.end) {
          if (flevel >= fl) {
            fl = flevel + 1;
          }
        }
      }
      if (fl >= levelMax) {
        levelMax = fl;
      }
      d.loc.level = fl;
      ft.push(d);
    } else {
      d.loc = null;
    }
  });
  return levelMax;
};

var locOrigin = function (origin) {
  var res = [];
  origin.forEach(function (data, index) {
    res.push({
      data: data,
      index: index
    })
  });
  return res;
};

export {Scope}
