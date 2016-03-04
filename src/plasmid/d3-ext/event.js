/**
 * Created by bqxu on 16/2/2.
 */
var d3 = require('d3');
var {angle2radian,angle4xy}=require('./scale');
var {translate}=require('./transition');
export class AngleLine {

  constructor(inner, {
    warp,
    container,
    }) {
    let drag = d3.behavior.drag();
    drag.on('drag', (d)=> {
      let width = warp.attr('width');
      let x = d3.event.x;
      let left = inner.attr("width");
      if (x < 0) {
        x = 0
      }
      if (x > width - left) {
        x = width - left;
      }
      inner.attr("transform", function () {
        return translate(x, 0);
      });
      this.moveXHandler && this.moveXHandler(360 * x / (width - left));
    });
    inner.call(drag);
  }

  onMoveX(moveXHandler) {
    this.moveXHandler = moveXHandler;
  }
}

export class ZoomLine {

  constructor(inner, {
    warp,
    container,
    }) {
    let drag = d3.behavior.drag();
    drag.on('drag', (d)=> {
      let height = warp.attr('height');
      let y = d3.event.y;
      let top = inner.attr("height");
      if (y < 0) {
        y = 0
      }

      if (y > height - top) {
        y = height - top;
      }

      inner.attr("transform", function () {
        return translate(0, y);
      });
      this.moveYHandler && this.moveYHandler(100 * y / (height - top));
    });
    inner.call(drag);
  }

  onMoveY(moveYHandler) {
    this.moveYHandler = moveYHandler;
  }
}

export class PointerLine {
  constructor(inner, {
    scope
    }) {
    this.scope = scope;
    let drag = d3.behavior.drag();
    let $this = this;
    drag.on('drag', (d)=> {
      let height = $this.getWarp().attr('height');
      let width = $this.getWarp().attr('width');
      let y = d3.event.y;
      let x = d3.event.x;
      if (y < -height / 2) {
        y = -height / 2
      }
      if (y > height / 2) {
        y = height;
      }
      if (x > width / 2) {
        x = width / 2
      }
      if (x < -width / 2) {
        x = -width / 2;
      }
      let angle = angle4xy(0, 0, y, x);
      this.moveXYHandler && this.moveXYHandler(90 - angle);
    });
    inner.call(drag);
  }

  onMoveXY(moveXYHandler) {
    this.moveXYHandler = moveXYHandler;
  }

  getWarp() {
    let {id}=this.scope;
    return d3.select(`#svg-${id}`);
  }
}


export class ZoomArea {
  constructor() {

  }
}
