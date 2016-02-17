/*
 Bragi Docs
 */
var Vue = require('vue');
var Router = require('vue-router');

// Install router
Vue.use(Router);

// Routing
var router = new Router();

router.map({
  '/amazeui': {
    component: require('./amazeui/docs.vue')
  },
  '/plasmid': {
    component: require('./plasmid/docs.vue')
  },
  '/plasmid-dev': {
    component: require('./plasmid/dev.vue')
  },
  '/status-progressbar': {
    component: require('./status-progressbar/docs.vue')
  }
});

router.redirect({
  '*': '/amazeui'
});

router.start(require('./docs.vue'), '#app');
