/**
 * Created by bqxu on 16/3/3.
 */
let {line,arc} =require("../d3-ext/shape");
let {transition,translate,rotate} =require("../d3-ext/transition");
let {
  angle4ge,
  xy4angle,
  angle4RadianLength,lineLength
  } =require("../d3-ext/scale");

export class Label {

  constructor(scope) {
    this.scope = scope;
    let {angle,origin,colorStore,id,features,width,height}=this.scope;
    let ol = origin.length;
    let geAngle = angle4ge(ol);
    scope.getDrawGroup().append('g').attr("id", `lg-${scope.id}`);
    scope.getLabelGroup().html('');
    let g = scope.getLabelGroup().selectAll("g").data(features).enter().append('g');
    g.append('text').attr("id", function (d, index) {
      return `label-${id}-${index}`;
    }).text((d) => {
      return d.qualifier.label;
    });

    g.append('path')
      .attr('id', function (d, index) {
        return `label-path-${id}-${index}`;
      });
    this.labelView();
  }


  labelView() {
    let scope = this.scope;
    scope.getLabelGroup().selectAll('text').style('fill', 'none');
    scope.getLabelGroup().selectAll('path').style('stroke', 'none');
    let feature = scope.viewFeaturesByPoint();
    let {site_poi,r_outer,r_inner} = scope.viewSpaceByPoint();
    site_poi = site_poi.sort(function (x, y) {
      if (x.x > y.x) {
        return 1
      } else if (x.x < 0 && x.x == y.x && x.y < y.y) {
        return 1
      } else if (x.x > 0 && x.x == y.x && x.y > y.y) {
        return 1
      } else {
        return -1;
      }
    });
    let poiSiteObj = {};
    feature.forEach(function (vf) {
      let {  startX, startY, endX, endY,
        midX, midY, feature: d,index}=vf;
      let label = d3.selectAll(`#label-${scope.id}-${index}`);
      vf.labelLength = parseInt(label.style("width"));
      let sL = site_poi.length;
      let poiIndex = 0;
      let poi = site_poi[poiIndex];
      let lineMin = lineLength(poi.x, poi.y, midX, midY);
      if (sL > 1) {
        for (let i = 0; i < sL; i++) {
          let poi1 = site_poi[i];
          let pl1 = lineLength(poi1.x, poi1.y, midX, midY);
          if (lineMin > pl1) {
            poiIndex = i;
            poi = poi1;
            lineMin = pl1;
          }
        }
      }
      if (!poiSiteObj[`${poi.x}_${poi.y}`]) {
        poiSiteObj[`${poi.x}_${poi.y}`] = {
          num: 0,
          cache: [],
          poi: poi,
          index: poiIndex
        };
      }
      let psite = poiSiteObj[`${poi.x}_${poi.y}`];
      psite.num = psite.num + 1;
      psite.cache.push({
        vf: vf,
        pathLength: lineMin
      });
    });

    let poiSiteArr = [];
    for (let key in poiSiteObj) {
      let poiSite = poiSiteObj[key];
      poiSite.cache = poiSite.cache.sort(function (a, b) {
        if (a.pathLength > b.pathLength) {
          return -1;
        } else {
          return 1;
        }
      });
      poiSiteArr.push(poiSite);
    }
    poiSiteArr = poiSiteArr.sort(function (a, b) {
      if (a.num > b.num) {
        return -1;
      } else {
        return 1;
      }
    });
    let poiDistArr = [];
    for (let {num,cache, poi:_poi,index} of poiSiteArr) {
      cache.forEach(function ({pathLength,vf}) {
        let disPoi = null;
        let disIndex = null;
        let disPathLength = null;
        let px = null;
        let py = null;
        poiDistArr.forEach((poiDist)=> {
          if (poiDist.index == index) {
            if (poiDist.w - poiDist.used > vf.labelLength) {
              disPoi = poiDist.poi;
              disIndex = index;
              if (disPoi.type = 'inner') {
                if (disPoi.x < 0) {
                  px = disPoi.x + poiDist.used;
                  py = disPoi.y;

                } else {
                  px = disPoi.x - poiDist.used;
                  py = disPoi.y;
                }
              } else {
                if (disPoi.x < 0) {
                  px = disPoi.x - poiDist.used;
                  py = disPoi.y;

                } else {
                  px = disPoi.x + poiDist.used;
                  py = disPoi.y;
                }
              }
              disPathLength = lineLength(vf.midX, vf.midY, px, py);
            }
          }
        });
        let i = 0;
        let sL = site_poi.length;
        while (i < sL) {
          let _disPoi = null;
          let f = false;
          poiDistArr.forEach((poiDist)=> {
            if (poiDist.index == i) {
              f = true;
              if (poiDist.w - poiDist.used > vf.labelLength) {
                _disPoi = poiDist.poi;
              }
            }
          });
          if (!f) {
            if (_disPoi == null) {
              _disPoi = site_poi[i];
            }
            if (_disPoi.w - _disPoi.used > vf.labelLength) {
              let _px = null;
              let _py = null;
              if (_disPoi.type = 'inner') {
                if (_disPoi.x < 0) {
                  _px = _disPoi.x;
                  _py = _disPoi.y;

                } else {
                  _px = _disPoi.x;
                  _py = _disPoi.y;
                }
              } else {
                if (_disPoi.x < 0) {
                  _px = _disPoi.x;
                  _py = _disPoi.y;

                } else {
                  _px = _disPoi.x;
                  _py = _disPoi.y;
                }
              }
              let _disPathLength = lineLength(_px, _py, vf.midX, vf.midY);
              if (disPathLength == null || _disPathLength < disPathLength) {
                disPoi = _disPoi;
                disIndex = i;
                disPathLength = _disPathLength;
                px = _px;
                py = _py;
              }
            }
          }
          i++;
        }
        if (disIndex == null) {
          return;
        }
        let disSite = null;

        poiDistArr.forEach((poiDist)=> {
          if (poiDist.index == disIndex) {
            disSite = poiDist;
          }
        });

        if (!disSite) {
          disSite = {
            index: disIndex,
            poi: disPoi,
            w: disPoi.w,
            used: 0,
            cache: []
          };
          poiDistArr.push(disSite);
        }
        disPoi = disSite.poi;
        let disPx = null;
        let disPy = null;
        if (disPoi.type = 'inner') {
          if (disPoi.x < 0) {
            disPx = disPoi.x + disSite.used;
            disPy = disPoi.y;

          } else {
            disPx = disPoi.x - disSite.used;
            disPy = disPoi.y;
          }
        } else {
          if (disPoi.x < 0) {
            disPx = disPoi.x - disSite.used;
            disPy = disPoi.y;

          } else {
            disPx = disPoi.x + disSite.used;
            disPy = disPoi.y;
          }
        }
        let fxx = disSite.used;
        disSite.used = disSite.used + vf.labelLength + 10;
        disSite.cache.push({
          px: disPx,
          py: disPy,
          vf
        });
      });
    }

    poiDistArr.forEach(({poi,cache,w,used})=> {
      cache.forEach(({px, py, vf})=> {
        let label = d3.selectAll(`#label-${scope.id}-${vf.index}`);
        let labelPath = d3.selectAll(`#label-path-${scope.id}-${vf.index}`);
        label.classed("label-start", null);
        label.classed("label-end", null);
        label.attr('transform', function () {
          if (scope.viewAngle() != 360) {
          }
          return translate(px, py);
        }).style('fill', (d) => {
          return scope.colorStore.getColor(d.key);
        });
        if (poi.type == 'inner') {
          if (px < 0) {
            label.classed('label-start', true);
          } else {
            label.classed('label-end', true);
          }
        } else {
          if (px > 0) {
            label.classed('label-start', true);
          } else {
            label.classed('label-end', true);
          }
        }
        labelPath.style('stroke', (d) => {
          return scope.colorStore.getColor(d.key);
        }).attr('d', function (d) {
          return line({x: vf.midX, y: vf.midY}, {x: px, y: py});
        })
      })
    })
  }

}

