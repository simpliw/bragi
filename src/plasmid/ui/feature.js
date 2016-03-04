/**
 * Created by bqxu on 16/3/3.
 */
let {line,ring} =require("../d3-ext/shape");

export class Feature {
  constructor(svg, g, scope) {
    this.svg = svg;
    this.scope = scope;
    let {features,id,circle:{r}} = this.scope;
    this.g = g.append('g').attr("id", `features-${id}`);
    g = this.g.selectAll("g").data(features).enter().append('g');
    g.append("path").attr("id", function (d, index) {
      return `features-${id}-${index}`;
    }).attr('d', (d) => {
      if (d.loc != null) {
        let level = d.loc.level;
        let width = (Math.round(level / 2 + 1) * 16 + 4 );
        if (level % 2 == 1) {
          width = 0 - (Math.round(level / 2) * 16 - 10 + 4);
        }
        if (d.loc.complement == 'true') {
          return ring(r - width, d.loc.endAngle, d.loc.startAngle)
        } else {
          return ring(r - width, d.loc.startAngle, d.loc.endAngle)
        }
      }
    }).style('fill', (d) => {
      return this.scope.colorStore.getColor(d.key);
    });
    g.append("defs").append("path")
      .attr("id", function (d, index) {
        return `defPath-${id}-${index}`;
      });
    g.append("text")
      .style('fill', (d) => {
        return this.scope.colorStore.getColor(d.key);
      }).attr("id", function (d, index) {
        return `text-${id}-${index}`;
      })
      .append("textPath").text((d) => {
      return d.qualifier.label;
    }).attr("id", (d, index) => {
      return `textPath-${id}-${index}`;
    }).attr("xlink:href", (d, index) => {
      return `#defPath-${id}-${index}`;
    });
    g.append("path").attr("id", (d, index) => {
      return `line-${id}-${index}`;
    });
  };
}
