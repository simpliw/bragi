/**
 * Created by bqxu on 16/3/3.
 */
let {line} =require("../d3-ext/shape");
let {
  angle4ge,
  geX,geY,
  } =require("../d3-ext/scale");
let {transition} =require("../d3-ext/transition");

export class Calibration {

  constructor(svg, g, scope) {
    this.svg = svg;
    this.g = g;
    this.scope = scope;
    let id = scope.id;
    let ol = scope.origin.length;
    let {du}=scope.limit;
    let {r}=scope.circle;
    let angle = angle4ge(ol);
    let li = [];
    let _limit = 0;
    while (_limit < ol) {
      li.push(_limit);
      _limit += du;
    }
    this.g = g.append('g').attr("id", `limit-${id}`);
    g = this.g.selectAll("g").data(li).enter().append('g');
    g.append("path").attr('d', function (data) {
        return line({
          x: r * Math.cos(( data * angle - 90) / 180 * Math.PI),
          y: r * Math.sin((data * angle - 90) / 180 * Math.PI)
        }, {
          x: ( r + 15) * Math.cos((data * angle - 90) / 180 * Math.PI),
          y: ( r + 15) * Math.sin((data * angle - 90) / 180 * Math.PI)
        });
      }
    ).attr("stroke", 'black').attr("stroke-width", '2px');
    g.append('text').text(function (data) {
      return data;
    }).attr("fill", function (data) {
      return 'black';
    }).attr("transform", function (data, index) {
      return transition({
        x: (r + 20) * geX(ol, data),
        y: -(r + 20) * geY(ol, data)
      }, {}, {
        angle: data * angle4ge(ol)
      })
    }).style("font-size", '16px').style("font-weight", '500')
  }
}
