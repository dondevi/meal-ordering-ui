import service from "src/service/index.js";

export default ({ Vue }) => {
  Vue.prototype.$service = service;
};
