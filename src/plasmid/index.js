/**
 * Created by bqxu on 16/2/2.
 */
require('./style.scss');
let {Scope} =require("./data/scope");
let {viewBox,showView} =require("./d3-ext/element");
let {transition,rotate} =require("./d3-ext/transition");
let {col_ge,ColorStore} =require("./d3-ext/color");
let {
  percent100,
  } =require("./d3-ext/scale");

var def = {
  outerSize: 375,
  innerSize: 375,
  _percent: 100
};

let {Pointer} = require('./ui/pointer');
let {Calibration} = require('./ui/calibration');
let {Feature} = require('./ui/feature');
let {Label} = require('./ui/label');
let {Button} = require('./ui/button');
let {Loop} = require('./ui/loop');

export class Plasmid {

  constructor(target, opts) {
    let svg, g, origin;
    let gbff, features;
    opts = Object.assign({}, def, opts);
    this.width = opts.outerSize;
    this.height = opts.outerSize;
    gbff = opts.gbff;
    if (!gbff) {
      return;
    }
    var svgDiv = document.createElement('div');
    target.appendChild(svgDiv);
    svgDiv.id = Math.ceil(Math.pow(10, 8) + 9 * Math.pow(10, 8) * Math.random());
    let className = svgDiv.className;
    className = className ? className.split(" ") : [];
    if (!className.find((n) => n == 'plasmid')) {
      className.push('plasmid');
      svgDiv.className = className.filter(x => true).join(' ');
    }

    this.svg = d3.select(svgDiv).append('svg').attr("id", `svg-${svgDiv.id}`);
    let scope = new Scope(this.width, this.height, gbff, svgDiv.id);
    scope.colorStore = new ColorStore();
    this.saveScope(scope);
    this.svg.append('g').attr("id", `dg-${svgDiv.id}`);
    showView(this.getSvg(), {
      width: this.getScope().width,
      height: this.getScope().height,
      viewBox: viewBox(0, 0, this.getScope().width, this.getScope().height)
    });
    this.render(this.svg, this.getDrawGroup(), this.getScope(), 1);
    this.$button = new Button(this.getScope());
    let $this = this;

    let zoomTimer = null;
    this.$button.onZoom(function (scale, r) {
      if (zoomTimer != null) {
        clearTimeout(zoomTimer);
        zoomTimer = null;
      }
      zoomTimer = setTimeout(function () {
        $this.render($this.svg, $this.getDrawGroup(), $this.getScope(), scale)
        zoomTimer = null;
      }, 500)
    });

    this.$button.onFull(() => {

    });

    this.$button.onExitFull(() => {

    });

    this.$button.onScale((_angle)=> {
      $this.getScope().angle = _angle;
      let {circle,id,angle}=$this.getScope();
      d3.select(`#dg-${id}`).attr("transform", transition({
        x: circle.translate().x, y: circle.translate().y
      }, {}, {angle: -angle}));
      d3.select(`#name-${id}`).attr("transform", rotate(angle));
    });
  };

  saveScope(scope) {
    this.scope = scope;
  }

  getScope() {
    return this.scope;
  }

  getSvg() {
    return d3.select(`#svg-${this.scope.id}`);
  }

  getDrawGroup() {
    return d3.select(`#dg-${this.scope.id}`);
  }

  getOptionGroup() {
    return d3.select(`#og-${this.scope.id}`);
  }

  getLimitGroup() {
    return d3.select(`#limit-${this.scope.id}`);
  }

  render(svg, g, scope, scale) {
    scope.scale(scale);
    let {id,name,angle,origin:{length},circle,limit}=this.scope;
    g.attr("transform", transition({
      x: circle.translate().x, y: circle.translate().y
    }, {}, {angle: -angle})).attr("fill", '##efefef');
    g.html("");
    let ng = g.append('g');
    ng.attr("id", `name-${id}`);
    ng.append('text').text(name).classed('title', true);
    ng.append('text').text(length + ' bp').attr('y', 10);
    this.$feature = new Feature(scope);
    this.$label = new Label(scope);
    this.$calibration = new Calibration(scope);
    this.$loop = new Loop(scope);
    this.$pointer = new Pointer(scope);
    this.$pointer.mouseMove(function () {

    });
    this.$pointer.svgClick(function () {

    })
  };
}

