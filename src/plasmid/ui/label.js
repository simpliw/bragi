/**
 * Created by bqxu on 16/3/3.
 */
let {line,arc} =require("../d3-ext/shape");
let {transition,translate,rotate} =require("../d3-ext/transition");
let {
  angle4ge,
  xy4angle,
  angle4RadianLength
  } =require("../d3-ext/scale");

export class Label {

  constructor(scope) {
    this.scope = scope;
    let {angle,origin,colorStore,id,features,width,height}=this.scope;
    let ol = origin.length;
    let geAngle = angle4ge(ol);
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
    console.log(this.scope.viewAngle());
    let scope = this.scope;
    let geAngle = angle4ge(scope.origin.length);
    let viewAngle = scope.viewAngle();
    let {site_poi,r_outer,r_inner}=this.scope.viewSpace();
    scope.getDrawGroup().append('g').append('path').attr('d', function () {
      return arc(r_outer, 0, 359)
    }).style('fill', 'none').style("stroke", '#000');

    scope.getDrawGroup().append('g').append('path').attr('d', function () {
      return arc(r_inner, 0, 359)
    }).style('fill', 'none').style("stroke", '#000');
    let viewFeatures = this.scope.viewFeatures();
    let $this = this;
    scope.getLabelGroup().selectAll('text').style('fill', 'none');
    scope.getLabelGroup().selectAll('path').style('fill', 'none');
    viewFeatures.forEach(function (vf) {
      let label = d3.selectAll(`#label-${scope.id}-${vf.index}`);
      let labelPath = d3.select(`#label-path-${scope.id}-${vf.index}`);
      let labelLength = parseInt(label.style("width"));
      let {startAngle,endAngle}=vf.feature.loc;
      let start = xy4angle(startAngle - scope.angle, scope.circle.r);
      let end = xy4angle(endAngle, scope.circle.r);
      let poi = null;
      let index = null;
      for (let i = 0; i < site_poi.length; i++) {
        let s_poi = site_poi[i];
        if (s_poi.used == 0) {
          if (Math.abs(s_poi.x) < scope.width / 2) {
            if (Math.abs(s_poi.y - (-start.y)) < 120 && Math.abs(s_poi.x - start.x) < 120) {
              if (Math.abs(s_poi.w) >= labelLength) {
                poi = s_poi;
                s_poi.used = labelLength;
                break;
              }
            }
          }
        }
      }
      if (poi != null) {
        label.style('fill', (d) => {
          return $this.scope.colorStore.getColor(vf.feature.key);
        }).attr('transform', function () {
          if (scope.viewAngle() == 360) {
            return translate(poi.x, poi.y);
          } else {
            let y = poi.y + scope.circle.y - scope.width / 2;
            return translate(poi.x, y);
          }
        }).attr('text-anchor', function () {
          label.classed("label-start", null);
          label.classed("label-end", null);
          if (poi.type == 'outer') {
            if (poi.x > 0) {
              label.classed("label-start", true);
              return 'start'
            } else {
              label.classed("label-end", true);
              return 'end'
            }
          } else {
            if (poi.x < 0) {
              label.classed("label-start", true);
              return 'start'
            } else {
              label.classed("label-end", true);
              return 'end'
            }
          }
        });
        labelPath.style('fill', (d) => {
          return $this.scope.colorStore.getColor(d.key);
        }).attr('d', function (d) {

        })
      }
    });

  }

  constructor2(scope) {
    this.scope = scope;
    let {angle,origin,colorStore}=this.scope;
    let $feature = scope.getDrawGroup().select(`#features-${scope.id}`);
    let ol = origin.length;
    let geAngle = angle4ge(ol);
    let $this = this;

    this.scope.viewFeatures().forEach(function ({index,feature}) {
      let fPath = $feature.select(`#defPath-${scope.id}-${index}`);
      let fLine = $feature.select(`#line-${scope.id}-${index}`);
      let fText = $feature.select(`#text-${scope.id}-${index}`);
      fPath.attr("d", (d)=> {
        let startAngle = d.loc.startAngle;
        let endAngle = d.loc.endAngle;
        let level = d.loc.level;
        let tLevel = d.loc.level2;
        let fAngle = startAngle;
        let tAngle = startAngle + tLevel * geAngle;
        let _viewAngle = $this.scope.viewAngle();
        if (_viewAngle < 180) {
          if (startAngle < angle + _viewAngle && angle - _viewAngle < endAngle) {
            if (startAngle > angle) {
              fAngle = startAngle;
              tAngle = startAngle + tLevel * geAngle;
            } else if (endAngle < angle) {
              fAngle = endAngle;
              tAngle = endAngle - tLevel * geAngle;
            } else {
              fAngle = angle;
              tAngle = angle + tLevel * geAngle;
            }
          } else if (startAngle > angle) {
            fAngle = endAngle;
            tAngle = endAngle - tLevel * geAngle;
          }
        }
        let fWidth = (Math.round(level / 2 + 1) * 16 + 10);
        let tWidth = (Math.round(tLevel / 2 + 1) * 16 + Math.round(scope.level / 2 + 1) * 16);
        let tWidth2 = (Math.round(tLevel / 2 + 1) * 16 + Math.round(scope.level / 2 + 1) * 16 - 6);
        if (level % 2 == 1) {
          fWidth = 0 - (Math.round(level / 2) * 16 );
          tWidth = 0 - (Math.round(tLevel / 2) * 16 + Math.round(scope.level / 2 + 1) * 16);
          tWidth2 = 0 - (Math.round(tLevel / 2) * 16 + Math.round(scope.level / 2 + 1) * 16 - 6);
        }
        let {x:fx,y:fy} = xy4angle(fAngle, scope.circle.r - fWidth);
        let {x:tx2=0,y:ty2=0} = xy4angle(tAngle, scope.circle.r - tWidth2);
        fLine.attr('stroke', function (d) {
          return colorStore.getColor(d.key);
        }).attr('d', function () {
          return line({
            x: fx,
            y: -fy
          }, {
            x: tx2,
            y: -ty2
          })
        }).attr("stroke-width", '2px');
        let _length = `${d.qualifier.label}`.length;
        fText.attr("x", 0)
          .attr("y", _length * _length);
        fText.classed("text-path", true);
        let _a = angle4RadianLength(scope.circle.r - tWidth, _length * 12);
        return arc(scope.circle.r - tWidth, tAngle, tAngle + _a);
      });
    })
  };
}

