/**
 * Created by bqxu on 16/2/5.
 */
let {r4ge,r4unitGE,radian2angle,xy4angle,
  angle4RadianLength,minAngle4angle2Feature,
  unitGE4r,angle4xy,
  xy4ry,xy4rx
  } =require("../d3-ext/scale");
let {line,arc} =require("../d3-ext/shape");
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
    this.r1 = r4unitGE(this.ol, unitGE1);
    this.r2 = r4unitGE(this.ol, unitGE3);
    this.level = locFeatures(this.features, this.ol, this.rwidth);
    let scales = [this.r1, r4unitGE(this.ol, unitGE2), this.r2, this.rwidth];
    this.scales = scales.sort((a, b) => a - b);
    this.colorStore = null;
    this.Liner = d3.scale.linear()
      .domain([1, 50, 85, 100])
      .range(scales);
  }

  set gbff(gbff) {
    let {features=[],origin='',name}=gbff;
    this.origin = Array.from(origin);
    this.features = Array.from(features);
    this.name = name;
    this.ol = origin.length;
  }

  scale(percent) {
    this.percent = percent;
    let r = this.Liner(percent);
    let unitGE = unitGE4r(r, this.origin.length);
    let y = r + this.rwidth / 2;
    if (r < this.rwidth + 1) {
      y = this.rwidth;
      r = y;
    }
    this.distWidth = r;
    this.circle = new Circle(this.width / 2, y, r - Math.ceil(this.level / 2 + 5) * 10);
    let scales = this.scales;
    this.limit = {
      du: Math.floor((5 * this.Liner(100) / this.Liner(percent)) / 5) * 5,
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

  viewSpaceByPoint() {
    let viewAngle = this.viewAngle() / 2;
    let angle = this.angle;
    let {x:rx,y:ry}=this.circle;
    let r_outer = this.circle.r + Math.ceil(this.level / 2 + 3) * 10;
    let r_inner = this.circle.r - Math.ceil(this.level / 2 + 3) * 10;
    let labelFloor = Math.ceil(this.width / 20);
    let sitePoi = [];
    let sy = -this.rwidth;
    let ey = this.rwidth;
    if (viewAngle != 180) {
      sy = -(this.circle.r + (this.rwidth - 75));
      ey = -(this.circle.r - (this.rwidth + 75));
    }
    for (let i = 1; i < labelFloor; i++) {
      let y = sy + i * 20;
      let poi_outer = xy4ry(r_outer, y);
      if (poi_outer != null) {

        if (-poi_outer[0].y < ey) {
          if (this.rwidth > poi_outer[0].x + 20) {
            sitePoi.push({
              used: 0,
              x: poi_outer[0].x,
              y: y,
              w: Math.floor(this.rwidth - poi_outer[0].x),
              type: 'outer'
            });
            sitePoi.push({
              used: 0,
              x: poi_outer[1].x,
              y: y,
              w: Math.floor(this.rwidth + poi_outer[1].x),
              type: 'outer'
            });
          }
        }
      }
      let poi_inner = xy4ry(r_inner, y);
      if (poi_inner != null) {
        if (poi_outer[0].y < ey) {
          if (poi_inner[0].x > this.rwidth) {
            sitePoi.push({
              used: 0,
              x: this.rwidth - 10,
              y: y,
              w: Math.floor(this.rwidth - 10),
              type: 'inner'
            });
            sitePoi.push({
              used: 0,
              x: -(this.rwidth - 10),
              y: y,
              w: Math.floor(this.rwidth - 10),
              type: 'inner'
            });
          } else if (poi_inner[0].x > 10) {
            sitePoi.push({
              used: 0,
              x: poi_inner[0].x,
              y: y,
              w: Math.floor(poi_inner[0].x - 10),
              type: 'inner'
            });
            sitePoi.push({
              used: 0,
              x: poi_inner[1].x,
              y: y,
              w: Math.floor(poi_inner[0].x - 10),
              type: 'inner'
            });
          }
        }
      }
    }
    return {
      r_outer: r_outer,
      r_inner: r_inner,
      site_poi: sitePoi
    }
  }

  viewFeaturesByPoint() {
    let viewAngle = this.viewAngle() / 2;
    let angle = this.angle;
    let viewFeature = [];
    let features = this.features;
    let sy = this.rwidth;
    let ey = -this.rwidth;
    if (viewAngle != 180) {
      sy = -(this.circle.r + (this.rwidth - 75));
      ey = -( this.circle.r - (this.rwidth + 75));
    }
    features.forEach((d, index)=> {
      if (d.loc != null) {
        let startAngle = d.loc.startAngle;
        let endAngle = d.loc.endAngle;
        let level = d.loc.level;
        let width = (Math.round(level / 2 + 1) * 16 + 4 );
        if (level % 2 == 1) {
          width = 0 - (Math.round(level / 2) * 16 - 10 + 4);
        }
        let start = xy4angle(startAngle - this.angle, this.circle.r - width - 5);
        let startX = start.x;
        let startY = -start.y;
        let end = xy4angle(endAngle - this.angle, this.circle.r - width - 5);
        let endX = end.x;
        let endY = -end.y;
        let mid = xy4angle((endAngle + startAngle) / 2 - this.angle, this.circle.r - width - 5);
        let midX = mid.x;
        let midY = -mid.y;
        if (viewAngle == 180) {
          viewFeature.push({
            startX, startY, endX, endY,
            midX, midY, feature: d, index
          })
        } else {
          if (
            (startX >= -this.rwidth && startX <= this.rwidth && sy < startY && startY < ey) ||
            (endX >= -this.rwidth && endX <= this.rwidth && sy < endY && endY < ey) ||
            (startX <= -this.rwidth && endX >= this.rwidth)
          ) {
            if (startX < -this.rwidth) {
              startX = -this.rwidth;
              let sxy = xy4rx(this.circle.r - width - 5, startX);
              startY = sxy[1].y;
              startAngle = angle4xy(0, 0, startX, startY) + this.angle;
              if (startAngle < 0) {
                startAngle = 360 + startAngle;
              }
            }
            if (endX > this.rwidth) {
              endX = this.rwidth;
              let exy = xy4rx(this.circle.r - width - 5, startX);
              endY = exy[1].y;
              endAngle = angle4xy(0, 0, endX, endY) + this.angle;
              if (endAngle < 0) {
                endAngle = 360 + endAngle;
              }
            }
            mid = xy4angle((endAngle + startAngle) / 2 - this.angle, this.circle.r - width - 5);
            midX = mid.x;
            midY = -mid.y;
            viewFeature.push({
              startX, startY, endX, endY,
              midX, midY, feature: d, index
            })
          }
        }
      }
    });
    return viewFeature;
  }


  getSvg() {
    return d3.select(`#svg-${this.id}`);
  };

  getDrawGroup() {
    return d3.select(`#dg-${this.id}`);
  };

  getOptionGroup() {
    return d3.select(`#og-${this.id}`);
  };

  getLabelGroup() {
    return d3.select(`#lg-${this.id}`);
  }

  getLoopGroup() {
    return d3.select(`#loop-${this.id}`);
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
      let fl = [];
      ft.forEach(function (feature) {
        let flevel = feature.loc.level;
        if (d.loc.start >= feature.loc.start && d.loc.start <= feature.loc.end) {
          fl.push(flevel);
        } else if (d.loc.end >= feature.loc.start && d.loc.end <= feature.loc.end) {
          fl.push(flevel);
        }
      });

      let level = 0;
      if (fl.length > 0 && fl[0] == 0) {
        fl = fl.sort(function (i1, i2) {
          if (i1 < i2) {
            return -1;
          } else {
            return 1;
          }
        });
        for (let i = 0; i < fl.length; i++) {
          if (level == fl[i]) {
            level++;
          } else {
            break;
          }
        }
      }
      if (level >= levelMax) {
        levelMax = level;
      }
      d.loc.level = level;
      ft.push(d);
    } else {
      d.loc = null;
    }
  });
  return levelMax;
};

