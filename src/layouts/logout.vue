<!--
/**
 * @author dondevi
 * @create 2018-06-22
 */
-->

<script>
  import { Dialog, Notify } from "quasar";
  import service from "src/service/index.js";

  export default {
    beforeRouteEnter (to, from, next) {
      Dialog.create({
        title: "退出登录", message: "确认退出？", ok: true, cancel: true
      }).then(() => {
        return service.auth.logout().then(data => {
          Notify.create({ type: "positive", message: "已退出登录" });
          next({ path: "/login", replace: true });
        });
      }).catch(error => next(false));
    },
  };
</script>
