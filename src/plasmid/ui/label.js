/**
 * Created by bqxu on 16/3/3.
 */
let {line,arc} =require("../d3-ext/shape");
let {
  angle4ge,
  xy4angle,
  angle4RadianLength
  } =require("../d3-ext/scale");

export class Label {

  constructor(scope) {
    this.scope = scope;
    let {angle,origin,colorStore}=this.scope;
    let feature = scope.getDrawGroup().select(`#features-${scope.id}`);
    let ol = origin.length;
    let geAngle = angle4ge(ol);
    let $this = this;
    this.scope.viewFIndex().forEach(function (fIndex) {
      let fPath = feature.select(`#defPath-${scope.id}-${fIndex}`);
      let fLine = feature.select(`#line-${scope.id}-${fIndex}`);
      let fText = feature.select(`#text-${scope.id}-${fIndex}`);
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

