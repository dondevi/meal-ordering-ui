/**
 * @author dondevi
 * @create 2018-06-24
 */

import axios from "framework/src/service/axios.js";

export function list (params) {
  return axios.get("/api/order", { params });
}

export function create (data) {
  return axios.post("/api/order", data);
}

export function destroy (id) {
  return axios.delete(`/api/order/${id}`);
}
