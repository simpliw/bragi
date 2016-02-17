<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <h1>
    Plasmid
  </h1>
  <div style="display: inline-block;width: 900px;margin: 0 auto">
    <div style="display: inline-block;width: 550px">
      <div class="scale" style="width: 550px;height: 40px;display: inline-block">
        <input type="button" value="+" v-on:click="upScale">
        <input type="button" value="-" v-on:click="downScale">
        <input type="text" value="100" v-model="scale" readonly>%
        <input type="button" value="max" v-on:click="maxScale">
        <input type="button" value="min" v-on:click="minScale">
      </div>
      <div id="gene" style="width: 600px;height: 600px;display: inline-block">

      </div>
      <div id="scroll" style="display: inline-block;width: 600px;height: 10px;position: relative">
        <div class="box" id="box" style="width: 10px;height: 10px;background: black" v-on:drag="scroll"
             draggable="true"></div>
      </div>
    </div>
    <div id="features" style="width: 300px;display: inline-block">
      <ul>
        <template v-for="feature in featureList">
          <li>

          </li>
        </template>
      </ul>
    </div>
  </div>
  <div id="origins" style="width: 900px;margin: 0 auto">

  </div>
</template>
<style>

</style>
<script type="text/javascript">
  let {init} = require('./index');
  let {parse} = require('./core/parse');
  let {Drag} = require('./core/drag');
  let $ = require('jquery');
  export default {
    data: function () {
      return {
        gbff: {
          pB002: require('file!./gbff/pB002.gb'),
          pB039: require('file!./gbff/pB039.gb'),
          pB039_F: require('file!./gbff/pB039_F.gb'),
          pHCKanP: require('file!./gbff/pHCKanP.gb'),
          pY001: require('file!./gbff/pY001.gb'),
          pY108: require('file!./gbff/pY108.gb'),
          pY122: require('file!./gbff/pY122.gb'),
          pY157: require('file!./gbff/pY157.gb'),
          pY178: require('file!./gbff/pY178.gb'),
          pYB006: require('file!./gbff/pYB006.gb'),
          pZ531: require('file!./gbff/pZ531.gb')
        },
        scale: this.scale,
        plasmid: this.plasmid
      };
    },
    computed: {},
    methods: {
      upScale: function () {
        var $this = this;
        var $plasmid = $this.plasmid;
        $plasmid.reset('+');
        $this.scale = $plasmid.getScale();
      },
      downScale: function () {
        var $this = this;
        var $plasmid = $this.plasmid;
        $plasmid.reset('-');
        $this.scale = $plasmid.getScale();
      },
      maxScale: function () {
        var $this = this;
        var $plasmid = $this.plasmid;
        $plasmid.reset('max');
        $this.scale = $plasmid.getScale();
      },
      minScale: function () {
        var $this = this;
        var $plasmid = $this.plasmid;
        $plasmid.reset('min');
        $this.scale = $plasmid.getScale();
      }
    },
    attached: function () {

    },
    ready: function () {
      var $this = this;

      $.ajax({url: this.gbff.pB039}).done(function (data) {
        $this.plasmid = init(document.getElementById("gene"), {
          gbff: parse(data),
          event: {
            mouseover: function () {

            },
            click: function () {
              console.log(111);
              console.log($this.plasmid.getAngle());
              $("#box").css("left", $this.plasmid.getAngle() / 360 * $this.dragHandler.maxLeft);
              $this.scale = $this.plasmid.getScale();
            }
          }
        });
        $this.scale = $this.plasmid.getScale();
      });

      var box = document.getElementById("box");
      var scroll = document.getElementById("scroll");
      var dragHandler = new Drag(box, {limit: true, lockY: true, maxContainer: scroll});
      //开始拖拽时方法
      dragHandler.onStart = function () {
      };

      //开始拖拽时方法
      dragHandler.onMove = function () {
        var $plasmid = $this.plasmid;
        $plasmid.transition(this.drag.offsetLeft / this.maxLeft * 360);
      };

      //开始拖拽时方法
      dragHandler.onStop = function () {

      };
      $this.dragHandler = dragHandler;
    }
  }

</script>
