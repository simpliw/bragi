/**
 * Created by bqxu on 16/2/2.
 */
require('./style.scss');
let {Scope} =require("./core/scope");
let {col_ge,ColorStore} =require("./d3-ext/color");
let {viewBox,appendSVG} =require("./d3-ext/layout");
let {line,ring,arc} =require("./d3-ext/shape");
let {transition,scale,rotate,translate} =require("./d3-ext/transition");
let {
  r4ge,
  angle4ge,radian4ge,
  geX,geY,
  radianLength4angle,
  angle4xy,
  xy4angle,
  scaleLinear,
  percent100,
  angle4RadianLength
  } =require("./d3-ext/scale");

var def = {
  outerSize: 500,
  innerSize: 500,
  scale: 1
};

let colorStore = new ColorStore();
let init = (target, opts)=> {
  let svg, g, origin;
  let gbff, features;
  let width = 500;
  let height = 500;
  let _percent = 100;
  let _angle = 0;

  opts = Object.assign({}, def, opts);
  if (!target.id) {
    target.id = Math.ceil(Math.pow(10, 8) + 9 * Math.pow(10, 8) * Math.random());
  }
  gbff = opts.gbff;
  if (!gbff) {
    return;
  }
  origin = Array.from(gbff.origin);
  features = Array.from(gbff.features);
  let className = target.className;
  className = className ? className.split(" ") : [];
  if (!className.find((n) => n == 'plasmid')) {
    className.push('plasmid');
    target.className = className.filter(x => true).join(' ');
  }
  svg = appendSVG(d3.select(target), {
    width: width,
    height: height,
    viewBox: viewBox(0, 0, width, width)
  });
  g = svg.append('g');
  let plasmid = render(svg, g, origin, features, width, target.id, opts.gbff.name, opts.event);
  return {
    reset: function (percent) {
      plasmid.scale(percent)
    },
    transition: function (angle) {
      _angle = angle;
      plasmid.transition(angle);
    },
    getScale: function () {
      return plasmid.getScale();
    },
    getAngle: function () {
      return plasmid.getAngle();
    }
  }
};

let renderBuild = function (svg, g, scope, scale, circle, limit, name) {
  g.attr("transform", transition({
    x: circle.translate().x, y: circle.translate().y
  }, {}, {angle: -scope.angle})).attr("fill", '##efefef');
  g.html("");
  let ng = g.append('g');
  ng.attr("id", `name-${scope.id}`);
  ng.append('text').text(name).classed('title', true);
  ng.append('text').text(scope.origin.length + ' bp').attr('y', 10);
  setLine(svg, g, scope, scale, scope.id);
  renderFeatures(g, circle.x, circle.y, circle.r, scope.features, scope.origin.length, scope.id);
  setFeatureLabel(g, scope);
  renderLimit(g, circle.x, circle.y, limit.r, limit.du, scope.origin.length, scope.id);
  if (limit.level() == '1') {
    renderOrigin(g, circle.x, circle.y, circle.r, scope.origin, scope.id);
  } else if (limit.level() == '2') {
    renderColor(g, circle.x, circle.y, circle.r, scope.origin, scope.id)
  } else {
    renderLoop(g, circle.x, circle.y, circle.r, 10, scope.id);
  }
};

let render = function (svg, g, origin, features, width, id, name, events = {}) {
  let scope = new Scope(origin, features, width, width, id);
  scope.events = events;
  scope.angle = 0;
  let $width = scope.rwidth;
  let scales = scope.scales;
  distRender(svg, g, scope, $width);
  return {
    scale: function (per) {
      let index = scales.findIndex((x)=>x == $width);
      if (index < 0) {
        index = 0;
      }
      if (per == '+') {
        index++;
        if (index >= scales.length) index--;
      } else if (per == '-') {
        index--;
        if (index < 0) index++;
      } else if (per == 'max') {
        index = scales.length - 1;
      } else if (per == 'min') {
        index = 0;
      }
      $width = scales[index];
      distRender(svg, g, scope, $width)
    },
    transition: function (angle) {
      scope.angle = angle;
      g.attr("transform", transition({
        x: scope.circle.translate().x, y: scope.circle.translate().y
      }, {}, {
        angle: -angle
      }));
      let ng = g.select(`#name-${scope.id}`);
      ng.attr("transform", transition({}, {}, {angle: scope.angle})).attr("fill", '##efefef');
      setFeatureLabel(g, scope);
    },
    getScale: function () {
      return scope.percent;
    },
    getAngle: function () {
      return scope.angle;
    }
  }
};

var distRender = function (svg, g, scope, $width) {
  let scale = scope.scale(percent100($width, scope.r1));
  renderBuild(svg, g, scope, scale, scale.circle, scale.limit, name);
};

let setLine = function (svg, g, scope, scale, id) {
  let ig = g.append('g');
  ig.attr("id", `line-${id}`);
  let ol = scope.origin.length;
  let ang4ge = angle4ge(ol);
  let path = ig.append("path")
    .attr('d', function () {
      return line({
        x: 0,
        y: -(scale.limit.r - (Math.ceil(scope.level / 2) + 4) * 20)
      }, {
        x: 0,
        y: -(scale.limit.r + 35)
      });
    }).attr("stroke", 'black').attr("stroke-width", '2px');
  let text = ig.append("text")
    .text('0').style("font-size", '16px').style("font-weight", '300')
    .attr("transform", function (data, index) {
      return transition({
        x: 0,
        y: -(scale.limit.r + 35)
      }, {}, {
        angle: 0
      })
    });
  svg.on('mousemove', function (event) {
    let poi = d3.mouse(document.getElementById(scope.id));
    let $x = poi[0];
    let $y = poi[1];
    let angle = angle4xy(scale.circle.x, scale.circle.y, $x, $y);
    scope.mouseAngle = angle;
    let index = Math.floor((angle + scope.angle) / ang4ge);
    let ang = index * ang4ge;
    let xy = xy4angle(ang, scale.limit.r + 35);
    path.attr("transform", function () {
      return rotate(ang, 0, 0)
    });
    let _index = index;
    if (_index < 0) {
      _index = ol + index
    } else if (_index > ol) {
      _index = _index - ol;
    }
    text.text(_index).attr("transform", function (data, index) {
      return transition({
        x: xy.x,
        y: -xy.y
      }, {}, {
        angle: ang
      })
    });
    scope.events.mousemove && scope.events.mousemove();
  }, false);
  let svgClick = 0;
  let timeClick = null;
  svg.on("click", function () {
    if (timeClick) {
      clearTimeout(timeClick);
    }
    timeClick = setTimeout(function () {
      if (svgClick > 1) {
        scope.angle = scope.mouseAngle + scope.angle;
        scope.mouseAngle = 0;
        distRender(svg, g, scope, scope.r1);
        scope.events.click && scope.events.click();
        timeClick = null;
      }
      svgClick = 0;
    }, 500);
    svgClick++;
  });
};

let renderLoop = function (g, cX, cY, r, width, id) {
  g = g.append('g');
  g.attr("id", `loop-${id}`);
  g.append("path")
    .attr('d', d3.svg.arc()
      .startAngle(0)
      .endAngle(2 * Math.PI * 0.99999)
      .innerRadius(r)
      .outerRadius(r - width)
    ).attr("fill", 'green');
};

let renderOrigin = function (g, cX, cY, r, origin, id) {
  let ol = origin.length;
  g = g.append('g');
  g.attr("id", `origin-${id}`);
  g = g.selectAll("g").data(origin).enter().append('g');
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
};

let renderColor = function (g, cX, cY, r, origin, id) {
  let ol = origin.length;
  let originRadian = radian4ge(ol);
  g = g.append('g');
  g.attr("id", `color-${id}`);
  g = g.selectAll("g").data(origin).enter().append('g');
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
};

let renderFeatures = function (g, cX, cY, r, features, ol, id) {
  g = g.append('g');
  g.attr("id", `features-${id}`);
  g = g.selectAll("g").data(features).enter().append('g');
  g.append("path").attr('d', function (d) {
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
  }).style('fill', function (d) {
    return colorStore.getColor(d.key);
  }).attr("id", function (d, index) {
    return `features-${id}-${index}`;
  });
  g.append("defs").append("path")
    .attr("id", function (d, index) {
      return `defPath-${id}-${index}`;
    });
  g.append("text")
    .style('fill', function (d) {
      return colorStore.getColor(d.key);
    }).attr("id", function (d, index) {
      return `text-${id}-${index}`;
    })
    .append("textPath").text(function (d) {
    return d.qualifier.label;
  }).attr("id", function (d, index) {
    return `textPath-${id}-${index}`;
  }).attr("xlink:href", function (d, index) {
    return `#defPath-${id}-${index}`;
  });
  g.append("path").attr("id", function (d, index) {
    return `line-${id}-${index}`;
  });
};

var setFeatureLabel = function (g, scope) {
  let feature = g.select(`#features-${scope.id}`);
  let viewFIndex = scope.viewFIndex();
  let viewAngle = scope.viewAngle() / 2;
  let angle = scope.angle;
  let ol = scope.origin.length;
  let geAngle = angle4ge(ol);
  viewFIndex.forEach(function (fIndex) {
    let fPath = feature.select(`#defPath-${scope.id}-${fIndex}`);
    let fLine = feature.select(`#line-${scope.id}-${fIndex}`);
    let fText = feature.select(`#text-${scope.id}-${fIndex}`);
    fPath.attr("d", function (d) {
      let startAngle = d.loc.startAngle;
      let endAngle = d.loc.endAngle;
      let level = d.loc.level;
      let tLevel = d.loc.level2;
      let fAngle = startAngle;
      let tAngle = startAngle + tLevel * geAngle;
      if (viewAngle < 180) {
        if (startAngle < angle + viewAngle && angle - viewAngle < endAngle) {
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
      } else {
        fAngle = (startAngle + endAngle) / 2;
        tAngle = (startAngle + endAngle) / 2 + tLevel * geAngle;
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


let renderLimit = function (g, cX, cY, r, limit, ol, id) {
  let angle = angle4ge(ol);
  let li = [];
  let _limit = 0;
  while (_limit < ol) {
    li.push(_limit);
    _limit += limit;
  }
  g = g.append('g');
  g.attr("id", `limit-${id}`);
  g = g.selectAll("g").data(li).enter().append('g');
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
};

export  {init};
