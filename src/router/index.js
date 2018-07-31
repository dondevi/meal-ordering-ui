import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

import routes from "./routes";
const Router = new VueRouter({
  /*
   * NOTE! Change Vue Router mode from quasar.conf.js -> build -> vueRouterMode
   *
   * When going with "history" mode, please also make sure "build.publicPath"
   * is set to something other than an empty string.
   * Example: "/" instead of ""
   */
  // Leave as is and change from quasar.conf.js instead!
  mode: process.env.VUE_ROUTER_MODE,
  base: process.env.VUE_ROUTER_BASE,
  scrollBehavior: () => ({ y: 0 }),
  routes,
});


import service from "src/service/index.js";
Router.beforeEach((to, from, next) => {
  service.auth.check().then(() => {
    if (Vue.prototype.$session.user) { return; }
    return service.account.session().then(data => {
      Vue.prototype.$session.user = data;
    });
  }).then(() => {
    if (to.path === "/login") { return "/"; }
  }).catch(error => {
    if (to.path !== "/login") { return "/login"; }
  }).then(path => {
    path ? next({ path, replace: true }) : next();
  });
});

export default Router;
