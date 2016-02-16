/**
 * Created by bqxu on 16/2/5.
 */
let {r4ge,r4unitGE,radian2angle,angle4RadianLength,minAngle4angle2Feature} =require("../d3-ext/scale");
let unitGE1 = 30;
let unitGE2 = 12;
let unitGE3 = 3;

class Scope {

  constructor(origin, features, width, height, id) {
    this.origin = locOrigin(origin);
    this.features = features;
    this.width = width;
    this.height = height;
    this.angle = 0;
    this.id = id;
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
    this.rwidth = width / 2;
    this.r1 = r4unitGE(ol, unitGE1);
    this.r2 = r4unitGE(ol, unitGE3);
    this.level = locFeatures(this.features, ol, this.rwidth);
    let scales = [this.r1, r4unitGE(ol, unitGE2), this.r2, this.rwidth];
    this.scales = scales.sort((a, b) => a - b);
  }

  scale(percent) {
    let ol = this.origin.length;
    let unitGE = unitGE1 * percent / 100;
    let r = r4ge(ol, unitGE);
    let y = r + this.rwidth / 2;
    if (r < this.rwidth) {
      y = this.rwidth;
      r = y;
    }
    this.circle = new Circle(this.width / 2, y, r - Math.ceil(this.level / 2 + 5) * 10);
    this.limit = {
      r: r - 5 * 10,
      du: Math.floor((5 * 100 / percent) / 5) * 5,
      level: function () {
        let _unitGE = Math.round(unitGE);
        if (_unitGE < unitGE3) {
          return '3';
        } else if (_unitGE < unitGE2) {
          return '2';
        } else if (_unitGE > unitGE3) {
          return '1';
        }
      }
    };
    return this;
  }

  viewAngle() {
    if (this.circle.r > this.rwidth) {
      return 2 * radian2angle(Math.asin(this.rwidth / this.circle.r))
    }
    return 360;
  }

  viewFIndex() {
    let viewAngle = this.viewAngle() / 2;
    let angle = this.angle;
    let rIndex = [];
    let features = this.features;
    features.forEach(function (d, index) {
      if (d.loc != null) {
        let startAngle = d.loc.startAngle;
        let endAngle = d.loc.endAngle;
        if (viewAngle == 180) {
          rIndex.push(index);
          return;
        }
        if (angle < viewAngle) {
          if (startAngle < viewAngle - angle) {
            rIndex.push(index);
          } else if (360 + viewAngle - angle < endAngle) {
            rIndex.push(index);
          }
        } else if (angle > 360 - viewAngle) {
          if (endAngle > angle - viewAngle) {
            rIndex.push(index);
          } else if (startAngle < viewAngle - (360 - angle)) {
            rIndex.push(index);
          }
        } else {
          if (startAngle < angle - viewAngle && endAngle > angle - viewAngle) {
            rIndex.push(index);
          } else if (startAngle < angle + viewAngle && endAngle > angle + viewAngle) {
            rIndex.push(index);
          } else if (startAngle > angle - viewAngle && endAngle < angle + viewAngle) {
            rIndex.push(index);
          }
        }
      }
    });

    rIndex.sort(function (a, b) {
      let aO = features[a];
      let bO = features[b];
      if (minAngle4angle2Feature(aO, angle) < minAngle4angle2Feature(bO, angle)) {
        return -1
      }
      return 1;
    });
    return rIndex;
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

var locFeatures = function (features, length, r2) {
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
      let labelLength = `${d.qualifier.label}`.length;
      let ta = angle4RadianLength(r2, labelLength * 12);
      let ftl = ft.length;
      let fl = 0;
      let tl = 0;
      while (ftl--) {
        let feature = ft[ftl];
        let flevel = feature.loc.level;
        let tlevel = feature.loc.level2;
        if (d.loc.start >= feature.loc.start && d.loc.start <= feature.loc.end) {
          if (flevel >= fl) {
            fl = flevel + 1;
          }
        } else if (d.loc.end >= feature.loc.start && d.loc.end <= feature.loc.end) {
          if (flevel >= fl) {
            fl = flevel + 1;
          }
        }
        if (d.loc.start - ta >= feature.loc.start && d.loc.start - ta <= feature.loc.end) {
          if (tlevel >= fl) {
            tl = tlevel + 1;
          }
        } else if (d.loc.end + ta >= feature.loc.start && d.loc.end <= feature.loc.end + ta) {
          if (tlevel >= fl) {
            tl = tlevel + 1;
          }
        }
      }
      if (fl >= levelMax) {
        levelMax = fl;
      }
      d.loc.level = fl;
      d.loc.level2 = tl;
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
