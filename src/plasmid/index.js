/**
 * Created by bqxu on 16/2/2.
 */
let {Scope} =require("./core/scope");
let {col_ge} =require("./d3-ext/color");
let {viewBox,appendSVG} =require("./d3-ext/layout");
let {line,ring} =require("./d3-ext/shape");
let {transition,scale,rotate,translate} =require("./d3-ext/transition");
let {
  r4ge,
  angle4ge,radian4ge,
  geX,geY,
  radianLength4angle,
  angle4xy,
  scaleLinear
  } =require("./d3-ext/scale");

var def = {
  outerSize: 500,
  innerSize: 500,
  scale: 1
};

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
  svg = appendSVG(d3.select(target), {
    width: width,
    height: height,
    viewBox: viewBox(0, 0, width, width)
  });
  g = svg.append('g');
  render(svg, g, origin, features, width);
  return {
    reset: function (percent) {
      _percent = percent;
      render(svg, g, origin, features, width, _percent, _angle);
    },
    transition: function (angle) {
      _angle = angle;
      render(svg, g, origin, features, width, _percent, _angle);
    }
  }
};


let render = function (svg, g, origin, features, width, percent = 100, angle = 0) {
  let scope = new Scope(origin, features, width, width);
  let scale = scope.scale(0.1);
  let circle = scale.circle;
  let limit = scale.limit;
  let level = scope.level;
  g.attr("transform", translate(circle.translate().x, circle.translate().y)).attr("fill", '##efefef');
  g.html("");
  if (circle.r > scope.rwidth) {
    renderOrigin(g, circle.x, circle.y, circle.r, scope.origin, 10);
  } else {
    renderLoop(g, circle.x, circle.y, circle.r, 10);
  }
  renderFeatures(g, circle.x, circle.y, circle.r, scope.features, scope.origin.length);
  renderLimit(g, circle.x, circle.y, limit.r, limit.du, scope.origin.length);
  setLine(svg, g, circle.x, circle.y, circle.r, width);
  return {
    scale: function (per) {
      var percent = 100;
      switch (per) {
        case '+1':
          break;
        case '-1':
          break;
        case 'max':
          break;
        case 'min':
          break;
        default:
          break;
      }
      render(svg, g, origin, features, width, percent)
    },
    transition: function (angle) {
      console.log(angle);
    }
  }
};

var setLine = function (svg, g, cX, cY, r, width) {
  let ig = g.append('g');
  let path = ig.append("path")
    .attr('d', function () {
      return line({
        x: 0,
        y: -(r - width / 8)
      }, {
        x: 0,
        y: -(r + width / 8)
      });
    }).attr("stroke", 'black').attr("stroke-width", '3px');
  svg.on('mousemove', function (event) {
    let $x = d3.event.offsetX;
    let $y = d3.event.offsetY;
    let angle = angle4xy(cX, cY, $x, $y);
    path.attr("transform", function () {
      return rotate(angle, 0, 0)
    });
  })
};

let renderLoop = function (g, cX, cY, r, unitGE) {
  g = g.append('g');
  g.append("path")
    .attr('d', d3.svg.arc()
      .startAngle(0)
      .endAngle(2 * Math.PI * 0.99999)
      .innerRadius(r - 5 * unitGE / 4)
      .outerRadius(r - unitGE)
    ).attr("fill", 'green');
};

var renderOrigin = function (g, cX, cY, r, origin, unitGE) {
  let ol = origin.length;
  let originRadian = radian4ge(ol);
  g = g.append('g');
  g = g.selectAll("g").data(origin).enter().append('g');
  let stroke = false;
  if (stroke) {
    g.append("path").attr('d', d3.svg.arc()
      .startAngle(function (data, index) {
        return index * originRadian
      })
      .endAngle(function (data, index) {
        return (index + 1) * originRadian
      })
      .innerRadius(function (d) {
        return r - unitGE;
      })
      .outerRadius(function (d) {
        return r;
      })
    ).attr("fill", function (data, i) {
      return 'none';
      //return col_ge(data);
    }).attr("stroke", function (data, i) {
      return 'none';
      //return col_ge(data);
    }).attr("stroke-width", function () {
      return "1px";
    });
  }
  g.append('text').text(function (data) {
    return data.data;
  }).attr("fill", function (data) {
    return col_ge(data.data);
  }).attr("transform", function (data, index) {
    return transition({
      x: (r - 3 * unitGE / 4) * geX(ol, index), y: -(r - 3 * unitGE / 4) * geY(ol, index)
    }, {}, {
      angle: index * angle4ge(ol)
    })
  }).style("font-size", '16px').style("font-weight", '500')
};

var renderFeatures = function (g, cX, cY, r, features, ol) {
  let angle = angle4ge(ol);
  g = g.append('g');
  g = g.selectAll("g").data(features).enter().append('g');
  g.append("path").attr('d', function (d) {
    if (d.loc != null) {
      if (d.loc.complement == 'true') {
        return ring(r, d.loc.endAngle, d.loc.startAngle, -2)
      } else {
        return ring(r, d.loc.startAngle, d.loc.endAngle)
      }
    }
  }).style('fill', function (d) {
    return 'grey';
  })
};

var renderLimit = function (g, cX, cY, r, limit, ol) {
  let li = [];
  let _limit = 0;
  limit = 100;
  while (_limit < ol) {
    li.push(_limit);
    _limit += limit;
  }
  g = g.append('g');
  g = g.selectAll("g").data(li).enter().append('g');
  g.append("path").attr('d', function (data) {
      return line({
        x: r * Math.cos(( data - 90) / 180 * Math.PI),
        y: r * Math.sin((data - 90) / 180 * Math.PI)
      }, {
        x: ( r - 10) * Math.cos((data - 90) / 180 * Math.PI),
        y: ( r - 10) * Math.sin((data - 90) / 180 * Math.PI)
      });
    }
  ).attr("stroke", 'black').attr("stroke-width", '2px');
};
export  {init};
