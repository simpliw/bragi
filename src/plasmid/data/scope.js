/**
 * Created by bqxu on 16/2/5.
 */
let {r4ge,r4unitGE,radian2angle,angle4RadianLength,minAngle4angle2Feature} =require("../d3-ext/scale");
let unitGE1 = 30;
let unitGE2 = 12;
let unitGE3 = 3;

export class Scope {

  constructor(width, height, gbff = {}, id) {
    this.width = width;
    this.height = height;
    this.gbff = gbff;
    this.id = id;
    this.showR = Math.min(this.width, this.height);
    this.percent = 100;
    this.angle = 0;
    this.mouseAngle = 0;
    this.lineWidth = 10;
    this.rwidth = this.showR / 2;
    this.distWidth = this.rwidth;
    this.r1 = r4unitGE(this.ol, unitGE1);
    this.r2 = r4unitGE(this.ol, unitGE3);
    this.level = locFeatures(this.features, this.ol, this.rwidth);
    let scales = [this.r1, r4unitGE(this.ol, unitGE2), this.r2, this.rwidth];
    this.scales = scales.sort((a, b) => a - b);
    this.colorStore = null;
  }

  set gbff(gbff) {
    let {features=[],origin='',name}=gbff;
    this.origin = origin;
    this.features = features;

    this.name = name;
    this.ol = origin.length;
  }

  scale(percent) {
    this.percent = percent;
    let ol = this.origin.length;
    let unitGE = unitGE1 * this.percent / 100;
    let r = r4ge(ol, unitGE);
    let y = r + this.rwidth / 2;
    if (r < this.rwidth + 1) {
      y = this.rwidth;
      r = y;
    }
    this.distWidth = r;
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
    let ft = [];
    let levelMax = this.level;
    let cr = this.circle.r;
    this.features.forEach(function (d) {
      if (d.loc) {
        let ftl = ft.length;
        let used = [];
        while (ftl--) {
          let feature = ft[ftl];
          if (d.loc.level % 2 != feature.loc.level % 2) {
            continue;
          }
          let _labelLength = `${feature.qualifier.label}`.length;
          let tlevel = feature.loc.level2;
          let tWidth = (Math.round(tlevel / 2 + 1) * 16 + Math.round(levelMax / 2 + 1) * 16 - 6);
          if (d.loc.level % 2 == 1) {
            tWidth = 0 - (Math.round(tlevel / 2) * 16 + Math.round(levelMax / 2 + 1) * 16 - 6);
          }
          let ta = angle4RadianLength(cr + tWidth, _labelLength * 12);
          if (d.loc.startAngle >= feature.loc.startAngle && d.loc.startAngle <= feature.loc.startAngle + 2 * ta) {
            used.push(tlevel)
          }
        }
        used.sort((a, b) => a > b);
        let tl = d.loc.level % 2;
        if (tl == used[0]) {
          for (var i = 0; i < used.length; i++) {
            if (used[i] != tl) {
              break;
            }
            tl = used[i] + 2;
          }
        }
        d.loc.level2 = tl;
        ft.push(d);
      }
    });
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
      let ftl = ft.length;
      let fl = 0;
      while (ftl--) {
        let feature = ft[ftl];
        let flevel = feature.loc.level;
        if (d.loc.start >= feature.loc.start && d.loc.start <= feature.loc.end) {
          if (flevel >= fl) {
            fl = flevel + 1;
          }
        } else if (d.loc.end >= feature.loc.start && d.loc.end <= feature.loc.end) {
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
