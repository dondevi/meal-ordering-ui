/**
 * @author dondevi
 * @create 2018-06-21
 */

import axios from "framework/src/service/axios.js";

export function session (id) {
  return axios.get(`/api/account/session`);
}
