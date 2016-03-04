/**
 * Created by bqxu on 16/2/2.
 */
var d3 = require('d3');
var {angle2radian,angle4xy}=require('./scale');
var {translate}=require('./transition');
export class AngleLine {

  constructor(inner, {
    warp,
    container
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
    scope
    }) {
    let drag = d3.behavior.drag();
    let zoom = d3.behavior.zoom();
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
      zoom.scale(100 * y / (height - top));
    });
    inner.call(drag);

    let $this = this;
    zoom.scaleExtent([1, 100])
      .on('zoom', function () {
        let scale = d3.event.scale;
        scale = parseInt(scale);
        if (scope.zoomScale == scale) {
          return;
        }
        scope.zoomScale = scale;
        let height = warp.attr('height');
        let top = inner.attr("height");
        let y = height - top;
        let sy = scope.Liner(scale);
        inner.attr("transform", function () {
          this.setCapture && this.setCapture();
          return translate(0, scale * y / 100);
        });
        $this.zoomHandler && $this.zoomHandler(scale, sy);
      });

    container.call(zoom);
  }

  onZoom(zoomHandler) {
    this.zoomHandler = zoomHandler;
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
      let {circle}=$this.scope;
      let {x:tx,y:ty}=circle.translate();
      let angle = angle4xy(circle.x - tx, circle.y - ty, x, y);
      this.moveXYHandler && this.moveXYHandler(angle);
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
