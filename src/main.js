/**
 * =============================================================================
 *  Main
 * =============================================================================
 *
 * @author dondevi
 * @create 2017-08-24
 *
 */

import Vue from "vue";

// Initial Nomalize.css
import "normalize.css";

// Initial Axios
import axios from "axios";
Vue.prototype.$axios = axios;

// Initial Element UI
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
Vue.use(ElementUI);


// Initial Common
import "themes/default/index.css";
import "modules/date.js";

// Service
import "mock";
import "service/index.js";

// Initial app & router
import router from "src/router/index.js";
import session from "src/router/session.js";
import app from "src/app.vue";
new Vue({ router, render: h => h(app) }).$mount("#app");
