/**
 * =============================================================================
 *  Router 前端路由
 * =============================================================================
 *
 * @author dondevi
 * @create 2017-08-24
 *
 */

import Vue from "vue";
import VueRouter from "vue-router";
Vue.use(VueRouter);

import login from "views/login";
import logout from "views/logout";
import main from "views/main";

import kanban from "pages/kanban";
import calendar from "pages/calendar";

// resolve => require.ensure([], () => resolve(require("./Foo.vue")), "group");

const routes = [
  { path: "/", redirect: "calendar", component: main, children: [
    { path: "calendar", component: calendar },
    { path: "kanban", component: kanban },
  ] },
  { path: "/login", component: login },
  { path: "/logout", component: logout },
];

const router = new VueRouter({ routes });

export default router;
