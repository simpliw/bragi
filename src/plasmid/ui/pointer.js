/**
 * Created by bqxu on 16/3/3.
 */
let {line} =require("../d3-ext/shape");
let {
  angle4ge,
  angle4xy,
  xy4angle,
  } =require("../d3-ext/scale");
let {transition,rotate,translate} =require("../d3-ext/transition");
let {PointerLine} =require('../d3-ext/event');

export class Pointer {
  constructor(_svg, _g, scope) {
    this.$svg = _svg;
    this.$scope = scope;
    let {id,circle,origin:{length:ol}} = this.$scope;
    let ang4ge = angle4ge(ol);
    let r = (circle.r - (Math.ceil(scope.level / 2) + 3) * 20);
    this.$g = _g.append('g').attr("id", `line-${id}`)
      .attr("transform", function () {
        return translate(
          0,
          -r
        )
      });
    let path = this.$g.append("path")
      .attr('d', () => {
        return line({
          x: 0,
          y: 0
        }, {
          x: 0,
          y: -((Math.ceil(scope.level / 2) + 3) * 20 + 30)
        });
      }).attr("stroke", 'black').attr("stroke-width", '2px');
    let text = this.$g.append("text")
      .text('0')
      .style("font-size", '16px')
      .style("font-weight", '300')
      .attr("transform", function () {
        return translate(
          0,
          -((Math.ceil(scope.level / 2) + 3) * 20 + 35)
        )
      });
    this.$pointerLine = new PointerLine(this.$g, {scope: scope});
    this.$pointerLine.onMoveXY((ang) => {
      let {x,y}=xy4angle(ang, r);
      d3.select(`#line-${id}`).attr("transform", function () {
        return transition({
          x: -x, y: y
        }, {}, {
          angle: ang - 180
        })
      });
    });
  };

  mouseMove(mouseMove) {
    this.mouseMove = mouseMove;
  }

  svgClick(svgClick) {
    this.svgClick = svgClick;
  }
}
;
