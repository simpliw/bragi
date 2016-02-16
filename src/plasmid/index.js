/**
 * Created by bqxu on 16/2/2.
 */
require('./style.scss');
let {Scope} =require("./core/scope");
let {col_ge,ColorStore} =require("./d3-ext/color");
let {viewBox,appendSVG} =require("./d3-ext/layout");
let {line,ring} =require("./d3-ext/shape");
let {transition,scale,rotate,translate} =require("./d3-ext/transition");
let {
  r4ge,
  angle4ge,radian4ge,
  geX,geY,
  radianLength4angle,
  angle4xy,
  xy4angle,
  scaleLinear,
  percent100
  } =require("./d3-ext/scale");

var def = {
  outerSize: 500,
  innerSize: 500,
  scale: 1
};

let colorStore = new ColorStore();
var init = (target, opts)=> {
  let svg, g, origin;
  let gbff, features;
  let width = 500;
  let height = 500;
  let _percent = 100;
  let _angle = 0;

  opts = Object.assign({}, def, opts);
  opts.id = Math.ceil(Math.pow(10, 8) + 9 * Math.pow(10, 8) * Math.random());
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
  let plasmid = render(svg, g, origin, features, width);
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
    }
  }
};

let renderBuild = function (svg, g, scope, scale, circle, limit) {
  g.attr("transform", transition({
    x: circle.translate().x, y: circle.translate().y
  }, {}, {angle: -scope.angle})).attr("fill", '##efefef');
  g.html("");
  if (limit.level() == '1') {
    renderOrigin(g, circle.x, circle.y, circle.r, scope.origin);
  } else if (limit.level() == '2') {
    renderColor(g, circle.x, circle.y, circle.r, scope.origin)
  } else {
    renderLoop(g, circle.x, circle.y, circle.r, 10);
  }
  renderFeatures(g, circle.x, circle.y, circle.r, scope.features, scope.origin.length);
  renderLimit(g, circle.x, circle.y, limit.r, limit.du, scope.origin.length);
  setLine(svg, g, scope, scale);
};

let render = function (svg, g, origin, features, width) {
  let scope = new Scope(origin, features, width, width);
  scope.angle = 0;
  let $width = scope.r2;
  let scales = scope.scales;
  let scale = scope.scale(percent100($width, scope.r1));
  let circle = scale.circle;
  let limit = scale.limit;
  renderBuild(svg, g, scope, scale, circle, limit);
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
      scale = scope.scale(percent100($width, scope.r1));
      circle = scale.circle;
      limit = scale.limit;
      renderBuild(svg, g, scope, scale, circle, limit);
    },
    transition: function (angle) {
      scope.angle = angle;
      g.attr("transform", transition({
        x: circle.translate().x, y: circle.translate().y
      }, {}, {
        angle: -angle
      }))
    },
    getScale: function () {
      return percent100($width, scope.r1);
    }
  }
};

var setLine = function (svg, g, scope, scale) {
  let ig = g.append('g');
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
    let $x = d3.event.offsetX;
    let $y = d3.event.offsetY;
    let angle = angle4xy(scale.circle.x, scale.circle.y, $x, $y);
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
  })
};

let renderLoop = function (g, cX, cY, r, width) {
  g = g.append('g');
  g.append("path")
    .attr('d', d3.svg.arc()
      .startAngle(0)
      .endAngle(2 * Math.PI * 0.99999)
      .innerRadius(r)
      .outerRadius(r - width)
    ).attr("fill", 'green');
};

var renderOrigin = function (g, cX, cY, r, origin) {
  let ol = origin.length;
  g = g.append('g');
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

var renderColor = function (g, cX, cY, r, origin) {
  let ol = origin.length;
  let originRadian = radian4ge(ol);
  g = g.append('g');
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

var renderFeatures = function (g, cX, cY, r, features, ol) {
  let angle = angle4ge(ol);
  g = g.append('g');
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
  })
};

var renderLimit = function (g, cX, cY, r, limit, ol) {
  let angle = angle4ge(ol);
  let li = [];
  let _limit = 0;
  while (_limit < ol) {
    li.push(_limit);
    _limit += limit;
  }
  g = g.append('g');
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
