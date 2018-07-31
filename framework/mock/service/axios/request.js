/**
 * =============================================================================
 *  Mock Axios Request
 * =============================================================================
 *
 * @author dondevi
 * @create 2017-11-29
 *
 * @update 2018-07-31 dondevi
 */

import { getResponse } from "../respond.js";

/**
 * Adapter for mock
 * @param  {Object} config - Axios config
 * @return {Promise}
 */
export default function axiosAdapter (config) {
  return new Promise((resolve, reject) => {
    const url      = config.url.replace(config.baseURL, "");
    const request  = transformRequest(config.data, config.headers);
    const response = getResponse(url, request);
    const axiosResponse = { ...response, config };
    settle(resolve, reject, axiosResponse);
  });
}

/**
 * Transform request param
 * @param  {*} request - request body
 */
function transformRequest (request, headers) {
  // if (/x-www-form-urlencoded/.test(headers["Content-Type"])) {
  //   return { param: unserialize(request) }
  // }
  // if (/application\/json/.test(headers["Content-Type"])) {
    return JSON.parse(request);
  // }
}

/**
 * Process Promise via HTTP status
 * @see https://github.com/mzabriskie/axios/blob/master/lib/core/settle.js
 * @param {Function} resolve  - Promise resolve
 * @param {Function} reject   - Promise reject
 * @param {object}   response - Axios response
 */
function settle (resolve, reject, response) {
  const { url, validateStatus } = response.config;
  const { status } = response;
  if (!status || !validateStatus || validateStatus(status)) {
    return resolve(response);
  }
  const error = new Error(`Request failed: ${url} [${status}]`);
  error.config = response.config;
  error.response = response;  // For process logic in catch()
  reject(error);
};
