<template lang="jade">
.am-container.am-padding
  #header.am-margin-top-lg.am-text-center Bragi
  div.am-text-right v{{ package.version }}
  hr
  ul.am-avg-sm-2.am-avg-md-3
    li
      a(v-link="{ path: '/amazeui' }") amazeui
    li
      a(v-link="{ path: '/plasmid' }") plasmid
    li
      a(v-link="{ path: '/plasmid-dev' }") plasmid-dev
    li
      a(v-link="{ path: '/status-progressbar' }") status-progressbar
  hr
  router-view
</template>

<script>
export default {
  data: function() {
    return {
      package: require('json!../package.json')
    }
  }
}
</script>

<style lang="scss">
#header {
  font-size: 96px;
}
</style>
