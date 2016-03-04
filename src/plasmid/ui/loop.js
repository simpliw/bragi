/**
 * Created by bqxu on 16/3/3.
 */
let {
  angle4ge,radian4ge,
  geX,geY,
  } =require("../d3-ext/scale");
let {col_ge,ColorStore} =require("../d3-ext/color");
let {transition,rotate,translate} =require("../d3-ext/transition");

export class Loop {
  constructor(scope) {
    this.scope = scope;
    this.width = 10;
    let {id,limit}=this.scope;
    scope.getDrawGroup().append('g').attr("id", `loop-${id}`);
    if (limit.level() == '1') {
      this.renderOrigin();
    } else if (limit.level() == '2') {
      this.renderColor();
    } else {
      this.renderLine();
    }
  }


  renderLine() {
    let {circle:{r}}=this.scope;
    this.scope.getLoopGroup().html("");
    this.scope.getLoopGroup().append("path")
      .attr('d', d3.svg.arc()
        .startAngle(0)
        .endAngle(2 * Math.PI * 0.99999)
        .innerRadius(r)
        .outerRadius(r - this.width)
      ).attr("fill", 'green');
  }

  renderOrigin() {
    let {origin,circle:{r}}=this.scope;
    this.scope.getLoopGroup().html("");
    let ol = origin.length;
    this.scope.getLoopGroup().selectAll("g").data(origin).enter().append('g').append('text').text(function (d) {
      return d;
    }).attr("fill", function (d) {
      return col_ge(d);
    }).attr("transform", function (data, index) {

      return transition({
        x: r * geX(ol, index), y: -r * geY(ol, index)
      }, {}, {
        angle: index * angle4ge(ol)
      })
    }).style("font-size", '16px').style("font-weight", '500');
  }

  renderColor() {
    let {origin,circle:{r}}=this.scope;
    let originRadian = radian4ge(origin.length);
    this.scope.getLoopGroup().html("");
    let g = this.scope.getLoopGroup().selectAll("g").data(origin).enter().append('g');
    g.append("path").attr('d', d3.svg.arc()
      .startAngle(function (data, index) {
        return index * originRadian
      })
      .endAngle(function (data, index) {
        return (index + 1) * originRadian
      })
      .innerRadius(function (d) {
        return r - 10;
      })
      .outerRadius(function (d) {
        return r;
      })
    ).attr("fill", function (d, i) {
      return col_ge(d);
    });
  }

}
