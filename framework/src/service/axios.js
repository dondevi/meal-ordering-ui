/**
 * @author dondevi
 * @create 2018-06-13
 *
 * @update 2018-06-21 dondevi
 *   1.Add: hancleVerifyError()
 * @update 2018-07-16 dondevi
 *   1.Add: xsrfCookieName, xsrfHeaderName
 */

import axios from "axios";
import { Notify } from "quasar";

/**
 * Axios instance for export
 */
export const axiosInstance = axios.create();
export const axiosDefaults = axiosInstance.defaults;  // 暴露给 Mock
export default axiosInstance;

/**
 * Axios default config
 * @see https://www.npmjs.com/package/axios#request-config
 * @see https://github.com/mzabriskie/axios/blob/master/lib/defaults.js
 * @type {Object}
 */
// axiosDefaults.baseURL = "/";
// axiosDefaults.transformRequest.unshift(transformRequest);
// axiosDefaults.transformResponse.push(transformResponse);
axiosDefaults.xsrfCookieName = "csrfToken";
axiosDefaults.xsrfHeaderName = "x-csrf-token";

/**
 * Axios interceptor
 * @see https://github.com/axios/axios#interceptors
 */
axiosInstance.interceptors.request.use(handleRequest, handleError);
axiosInstance.interceptors.response.use(handleResponse, handleError);

// validateStatus: function (status) {
//   return status >= 200 && status < 300; // default
// };

/**
 * Transform request data
 * @param  {*} data
 */
// function transformRequest (data, headers) {
//   return {
//     requestNo: Date.now(),
//     param: data,
//   };
// }

/**
 * Transform response data lasahd
 * @param  {*} data
 */
// function transformResponse (data, headers) {
//   return data;
// }

/**
 * Do something before request
 * @param {Object} config
 */
function handleRequest (config) {
  // config.params = transformRequest(config.params);
  return config;
}

/**
 * Do something with response
 * @param {Object} response
 */
function handleResponse (response) {
  const { data } = response;
  if (data.message) {
    return handleError({ response });
  }
  return data;
}

/**
 * Handle error from request or response
 * @param  {Object} error
 */
function handleError (error) {
  const { response, request, config } = error;
  if (response) { handleResponseError(response); }
  else if (request) { handleRequestError(config); }
  else { handleCodeError(error); }
  return Promise.reject(error);
}

/**
 * Handle request error
 * @param {Object} request
 */
function handleRequestError (config) {
  Notify.create({
    message: `No Response`,
    detail: config.url,
    timeout: 0,
    icon: "portable_wifi_off",
    type: "warning",
    position: "top-right",
    actions: [{ icon: "close" }],
  });
}

/**
 * Handle response error
 * @param {Object} response
 */
function handleResponseError (response) {
  const { status, data, config: { url, silent } } = response;
  if (silent) { return; }  // Custom config
  switch (status) {
    case 200: handleBusinessError(url, data); break;
    case 401:
    case 403: handleAuthError(url, data); break;
    case 422: handleVerifyError(url, data); break;
    default: handleHttpError(status, url, data); break;
  }
}

/**
 * Handle code error
 * @param {Object} error
 */
function handleCodeError (error) {
  Notify.create({
    message: error.message,
    timeout: 0,
    icon: "bug_report",
    type: "negative",
    position: "bottom-right",
    actions: [{ icon: "close" }],
  });
}

/**
 * Handle business error
 * @param {String} url
 * @param {Object} data
 */
function handleBusinessError (url, data) {
  Notify.create({
    message: data.message,
    // detail: url,
    timeout: 5000,
    icon: "clear",
    position: "top",
  });
}

/**
 * Handle auth error
 * @param {String} url
 * @param {Object} data
 */
import Router from "src/router/index.js";
function handleAuthError (url, data) {
  Notify.create({
    message: "Authentication Failed !",
    // detail: url,
    timeout: 5000,
    icon: "fingerprint",
    type: "warning",
    position: "top",
    actions: [{ label: "Login" }],
    onDismiss () {
      Router.replace("/login");
    },
  });
}

/**
 * Handle verification error
 * @param {String} url
 * @param {Object} data
 */
function handleVerifyError (url, { message, errors }) {
  const list = errors.map(({ field, message }) => `[${field}] ${message}`).join("\n");
  Notify.create({
    message: `[422] ${message}`,
    detail: `${url}\n${list}`,
    timeout: 0,
    icon: "block",
    type: "negative",
    position: "top-right",
    actions: [{ icon: "close" }],
  });
}

/**
 * Handle communication error
 * @param {Number} status
 * @param {String} url
 * @param {Object} data
 */
function handleHttpError (status, url, data) {
  Notify.create({
    message: `[${status}] ${data && data.message || "HTTP Error"}`,
    detail: url,
    timeout: 0,
    icon: /^4/.test(status) ? "http" : "bug_report",
    type: "negative",
    position: "top-right",
    actions: [{ icon: "close" }],
  });
}
