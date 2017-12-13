/**
 * =============================================================================
 *  Service
 * =============================================================================
 *
 * @author dondevi
 * @create 2017-08-25
 *
 */

import router from "router";
import axios from "axios";

var host = "";
var path = host + "/";
var path_oa = host + "/api-oa";

axios.defaults.headers.post["X-Requested-With"] = "XMLHttpRequest";
axios.defaults.transformRequest = data => {
  var params = new URLSearchParams();
  for (let key in data) {
    params.append(key, data[key]);
  }
  return params;
};

axios.defaults.validateStatus = status => {
  if (status >= 400 && status < 500) {
    return router.replace("login");
  }
  return status >= 200 && status < 300;
}

export function login (userID, userPassword, autologin, callback) {
  var url = path_oa + "/login.asp";
  var params = new URLSearchParams();
  return axios.post(url, {
    userID, userPassword, autologin,
  }).then(response => {
    callback && callback(response.data);
  });
}

export function logout (callback) {
  var url = path_oa + "/logout.asp";
  return axios.get(url).then(response => {
    callback && callback(response.data);
  });
}

export function getUserInfo (callback) {
  var url = path_oa + "/dingchan.asp";
  return axios.get(url).then(response => {
    try {
      var uname = response.data.match(/uname='([^']+)'$/m)[1];
      var urealname = response.data.match(/urealname='([^']+)'$/m)[1];
      var json = { uname, urealname };
    } catch (exception) {
      json = null;
    }
    callback && callback(json);
  });
}

export function getStaffList (callback) {
  var url = path_oa + "/json/s_staff.asp";
  return axios.post(url, {
    act: "get_name",
    g: "",
  }).then(response => {
    callback && callback(response.data);
  });
}

export function getDepartList (callback) {
  var url = path_oa + "/json/jbumen.asp";
  return axios.post(url, {
    act: "get",
  }).then(response => {
    callback && callback(response.data);
  });
}

export function getOrderList (startDate, endDate, callback) {
  var url = path_oa + "/json/jdingchan.asp";
  return axios.post(url, {
    act: "get",
    sd: startDate,
    ed: endDate,
  }).then(response => {
    callback && callback(response.data);
  });
}

export function createOrder (date, type, staff, callback) {
  var url = path_oa + "/json/jdingchan.asp";
  return axios.post(url, {
    act: "dingchan",
    rq: date,
    sd: type,
    id: "",
    ds: staff,
  }).then(response => {
    callback && callback(response.data);
  });
}

export function deleteOrder (id, date, type, staff, callback) {
  var url = path_oa + "/json/jdingchan.asp";
  return axios.post(url, {
    act: "dingchan",
    rq: date,
    sd: type,
    id: id,
    ds: staff,
  }).then(response => {
    callback && callback(response.data);
  });
}

export const axiosDefaults = axios.defaults;
