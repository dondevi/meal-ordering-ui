/**
 * @author dondevi
 * @create 2018-06-04
 */

import axios from "framework/src/service/axios.js";

export function list (params) {
  return axios.get("/api/department", { params });
}

export function tree (params) {
  // const query = `{
  //   departmentTree {
  //     ...department
  //     children {
  //       ...department
  //       children {
  //         ...department
  //       }
  //     }
  //   }
  // }
  // fragment department on Department { id, name }`;
  // return axios.get("graphql", {
  //   params: { query }
  // }).then(json => {
  //   return json.data.departmentTree;
  // });
  return axios.get("/api/department/tree", { params });
}

export function memberList (id, params) {
  return axios.get(`/api/department/${id}/member`, { params });
}

export function create (parent_id, name) {
  return axios.post("/api/department", { parent_id, name });
}

export function update (id, name) {
  return axios.put(`/api/department/${id}`, { name });
}

export function destroy (id) {
  return axios.delete(`/api/department/${id}`);
}
