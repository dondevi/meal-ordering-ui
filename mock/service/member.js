/**
 * @author dondevi
 * @create 2018-06-13
 */

import axios from "framework/src/service/axios.js";

export function list (params) {
  return axios.get("/api/member", { params });
}

export function departmentList (id, params) {
  return axios.get(`/api/member/${id}/department`, { params });
}

export function create (data) {
  return axios.post("api/member", data);
}

export function update (id, data) {
  return axios.put(`/api/member/${id}`, data);
}

export function destroy (id) {
  return axios.delete(`/api/member/${id}`);
}

export function batchDestroy (ids) {
  return axios.delete(`/api/members/${ids}`);
}
