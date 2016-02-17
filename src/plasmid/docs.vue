<template lang="jade">
h1 Plasmid

h2 使用方式
h3 解析
pre {{ pre.parser }}
h3 渲染
pre {{ pre.render }}

h2 使用案例
.am-g.am-margin-top
  .am-u-md-6
    h3 选择文件
    select(v-model= "selected")
      option(v-for="(k, v) in gbff", :value="v") {{ k }}
    template(v-if="selected")
      h3 解析结果
      pre.am-pre-scrollable {{ parsed | json }}
  .am-u-md-6(v-if="selected")
    h3 渲染结果
    span#plasmid

h2 更多用例
h3 #1 Features on the complement sequence
span.plasmid(data-outerSize="400", :data-gbffUrl="gbff.pB039")
span.plasmid(data-outerSize="400", :data-gbffUrl="gbff.pB039_F")
h3 #2 Flexible view size
span.plasmid(data-outerSize="200", :data-gbffUrl="gbff.pY108")
span.plasmid(data-outerSize="300", :data-gbffUrl="gbff.pY108")
span.plasmid(data-outerSize="400", :data-gbffUrl="gbff.pY108")
h3 #3 Compatibility
span.plasmid(data-outerSize="400", :data-gbffUrl="gbff.pHCKanP")
</template>

<script>
require('./jquery.js');

export default {
  data: function() {
    return {
      pre: {
        parser: `$.ajax({ url: GBFF_URL }).done(function(data) { console.log($.Plasmid.parse(data)); })`,
        render: `$('#plasmid').Plasmid({ gbffUrl: GBFF_URL })`
      },
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
      selected: null,
      selected_data: null
    };
  },
  computed: {
    parsed: function() {
      return this.selected_data ? $.Plasmid.parse(this.selected_data) : '';
    }
  },
  watch: {
   selected: function(val) {
     var self = this;
     if (val) {
       $.ajax({ url: val }).done(function(data) { self.selected_data = data; })
       $('#plasmid').Plasmid({ gbffUrl: val });
     } else {
        self.selected_data = null;
     }
   },
 },
 attached: function() {
   $(document).ready(function() {
     $('pre').each(function(i, block) {
       hljs.highlightBlock(block);
     });
   });

   $('span.plasmid').each(function() {
     $(this).Plasmid({ outerSize: $(this).attr('data-outerSize'), gbffUrl: $(this).attr('data-gbffUrl') });
   });
 }
}
</script>
