<!--
/**
 * =============================================================================
 *  Logout 退出
 * =============================================================================
 *
 * @author dondevi
 * @create 2017-08-29
 *
 */
-->

<script>
  import router from "router";
  import { logout } from "service";
  export default {
    beforeRouteEnter (to, from, next) {
      logout(json => {
        router.replace("/login");
      });
    },
  };
</script>
