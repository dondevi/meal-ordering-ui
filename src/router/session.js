/**
 * =============================================================================
 *  Session 会话管理
 * =============================================================================
 *
 * @author dondevi
 * @create 2017-08-24
 *
 */

import router from "router";
import { getUserInfo as IMPORT_getUserInfo } from "service";

router.beforeEach((to, from, next) => {
  if ("/login" === to.path) {
    return next();
  }
  IMPORT_getUserInfo(json => {
    if (json) {
      window.userInfo = json;
      next();
    } else {
      router.replace("/login");
    }
  });
});
