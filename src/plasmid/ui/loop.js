/**
 * Created by bqxu on 16/3/3.
 */
let {
  angle4ge,radian4ge,
  geX,geY,
  } =require("../d3-ext/scale");

export class Loop {
  constructor(svg, g, scope) {
    this.svg = svg;
    this.scope = scope;
    this.width = 10;
    let {id,limit}=this.scope;
    this.g = g.append('g').attr("id", `loop-${id}`);
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
    this.g.html("");
    this.g.append("path")
      .attr('d', d3.svg.arc()
        .startAngle(0)
        .endAngle(2 * Math.PI * 0.99999)
        .innerRadius(r)
        .outerRadius(r - this.width)
      ).attr("fill", 'green');
  }

  renderOrigin() {
    this.g.html("");
    let {origin,circle:{r}}=this.scope;
    let ol = origin.length;
    g = this.g.selectAll("g").data(origin).enter().append('g');
    g.append('text').text(function (data) {
      return data.data;
    }).attr("fill", function (data) {
      return col_ge(data.data);
    }).attr("transform", function (data, index) {
      return transition({
        x: r * geX(ol, index), y: -r * geY(ol, index)
      }, {}, {
        angle: index * angle4ge(ol)
      })
    }).style("font-size", '16px').style("font-weight", '500').attr({});
  }

  renderColor() {
    this.g.html("");
    let {origin,circle:{r}}=this.scope;
    let originRadian = radian4ge(origin.ol);
    g = this.g.selectAll("g").data(this.origin).enter().append('g');
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
    ).attr("fill", function (data, i) {
      return col_ge(data.data);
    });
  }

}
