/**
 * Created by bqxu on 16/2/2.
 */
require('./style.scss');
let {Scope} =require("./data/scope");
let {viewBox,showView} =require("./d3-ext/element");
let {transition,rotate,translate} =require("./d3-ext/transition");
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
    let {width,height}=this.getScope();
    this.svg.append('g').attr("id", `dg-${svgDiv.id}`);
    this.svg.append('g').attr("id", `og-${svgDiv.id}`).attr("transform", translate(width / 2, height / 2));
    showView(this.getScope().getSvg(), {
      width: width,
      height: height,
      viewBox: viewBox(0, 0, width, height)
    });
    this.render(this.getScope(), 2);

    this.$button = new Button(this.getScope());
    let $this = this;

    let zoomTimer = null;
    this.$button.onZoom(function (scale, r) {
      if (zoomTimer != null) {
        clearTimeout(zoomTimer);
        zoomTimer = null;
      }
      zoomTimer = setTimeout(function () {
        $this.render($this.getScope(), scale);
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
      scope.getLabelGroup().attr("transform", rotate(angle));
      $this.$label.labelView();
    });
  };

  saveScope(scope) {
    this.scope = scope;
  }

  getScope() {
    return this.scope;
  }

  render(scope, scale) {
    let g = scope.getDrawGroup();
    scope._scale = scale;
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

