/**
 * Created by bqxu on 16/3/3.
 */
let {AngleLine,ZoomLine,ZoomArea} =require("../d3-ext/event");
let {transition,translate,rotate} =require("../d3-ext/transition");
let {appendRect} =require("../d3-ext/element");

export class Button {

  constructor(svg, scope) {
    this.svg = svg;
    this.scope = scope;
    let {id,width,height}=this.scope;
    this.g = this.svg.append('g').attr("id", `og-${id}`)
      .attr("transform", translate(width / 2, height / 2)).attr("fill", '##efefef')
      .html('');
    this.zoom();
    this.rotate();
    this.full();
  }

  zoom() {
    let {width,height}=this.scope;
    let g_zoom = this.g.append('g').attr("transform", translate(-width / 2 + 10, -height / 2 + 10)).classed("rotate_warp", true);
    let zoom_warp = appendRect(g_zoom, {
      x: 4,
      y: 0,
      width: 3,
      height: 200,
      rx: 3,
      ry: 3
    }).classed("rotate", true);

    let zoom_inner = appendRect(g_zoom, {
      width: 10,
      height: 10,
      rx: 3,
      ry: 3
    }).classed("rotate_inner", true);

    let zoomLine = new ZoomLine(zoom_inner, {
      warp: zoom_warp,
      container: this.svg
    });

    let zoomarea = new ZoomArea(zoom_inner, {
      warp: zoom_warp,
      container: this.svg
    });


    zoomLine.onMoveY((angle) => {
      this.zoomHandler && this.zoomHandler(angle);
    });
  }

  rotate() {
    let {width,height}=this.scope;
    let g_rotate = this.g.append('g').attr("transform", translate(-width / 2, width / 2 - 10)).classed("rotate_warp", true);
    let rotate_warp = appendRect(g_rotate, {
      width: width,
      height: 10,
      rx: 3,
      ry: 3
    }).classed("rotate", true);
    let rotate_inner = appendRect(g_rotate, {
      width: 10,
      height: 10,
      rx: 3,
      ry: 3
    }).classed("rotate_inner", true);

    let angelLine = new AngleLine(rotate_inner, {
      warp: rotate_warp,
      container: this.svg
    });

    angelLine.onMoveX((angle) => {
      this.scaleHandler && this.scaleHandler(angle);
    });
  }


  full() {
    let {width,height}=this.scope;
    let g_full = this.g.append('g').attr("transform", translate(width / 2 - 30, -width / 2 + 10)).classed("btn-full", true);
    let rect_full = appendRect(g_full, {
      width: 16,
      height: 16
    });
    var $this = this;
    g_full.append('text').html("X")
      .attr("transform", translate(8, 8));

    let full = 0;
    rect_full.on('click', function () {
      if (full == 1) {
        $this.exitFullHandler && $this.exitFullHandler();
        full = 0;
      } else {
        $this.fullHandler && $this.fullHandler();
        full = 1;
      }
    });
  }

  onZoom(zoomHandler) {
    this.zoomHandler = zoomHandler;
  }

  onClickSub(subHandler) {
    this.subHandler = subHandler;
  }

  onFull(fullHandler) {
    this.fullHandler = fullHandler;
  }

  onScale(scaleHandler) {
    this.scaleHandler = scaleHandler;
  }

  onExitFull(exitFullHandler) {
    this.exitFullHandler = exitFullHandler;
  }
}

