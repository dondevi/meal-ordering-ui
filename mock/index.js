/**
 * =============================================================================
 *  Simple Mock
 * =============================================================================
 *
 * @author dondevi
 * @create 2017-08-24
 *
 */

import userInfo from "mock/dingchan.js";
import departList from "mock/jbumen.json";
import staffList from "mock/s_staff.json";
import orderList from "mock/jdingchan.json";

import { axiosDefaults } from "service";

const isMock = /mock/.test(window.location.search);

if (isMock) {
  setOrderDate(orderList);
  axiosDefaults.adapter = config => {
    return new Promise((resolve, reject) => {
      var response = true;
      if (/dingchan.asp/.test(config.url)) {
        response = userInfo;
      }
      if (/s_staff.asp/.test(config.url)) {
        response = staffList;
      }
      if (/jbumen.asp/.test(config.url)) {
        response = departList;
      }
      if (/jdingchan.asp/.test(config.url)) {
        response = orderList;
      }
      resolve({ data: response });
    });
  };
}

function setOrderDate (orderList) {
  var date = new Date().format("YYYY-M-");
  var day = new Date().format("D");
  orderList.forEach(order => {
    order["driqi"] = {
      "2017-8-24": date + day,
      "2017-8-25": date + (+day + 1),
      "2017-8-28": date + (+day + 2),
      "2017-8-29": date + (+day + 3),
      "2017-8-30": date + (+day + 4),
    }[order["driqi"]];
  });
}
