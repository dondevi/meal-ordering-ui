/**
 * @author dondevi
 * @create 2018-06-21
 */

import axios from "framework/src/service/axios.js";

export function login (data) {
  return axios.post("/api/auth/login", data);
}

export function check () {
  return axios.get("/api/auth/check", { silent: true });
}

export function logout () {
  return axios.get("/api/auth/logout");
}
