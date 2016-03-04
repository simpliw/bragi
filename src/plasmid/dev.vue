<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <h1>
    Plasmid
  </h1>
  <div style="display: inline-block;width: 900px;margin: 0 auto">
    <div style="display: inline-block;width: 550px">
      <div id="gene" style="width: 600px;height: 600px;display: inline-block">

      </div>
    </div>
  </div>
</template>
<style>

</style>
<script type="text/javascript">
  let {Plasmid} = require('./index');
  let {parse} = require('./data/parse');
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
        plasmid: this.plasmid
      };
    },
    computed: {},
    methods: {},
    attached: function () {

    },
    ready: function () {
      var $this = this;

      $.ajax({url: this.gbff.pB039}).done(function (data) {
        $this.plasmid = new Plasmid(document.getElementById("gene"), {
          gbff: parse(data),
          outerSize: 500
        });
      });
    }
  }

</script>
