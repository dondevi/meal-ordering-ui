/**
 * =============================================================================
 *  Minxin OA service
 * =============================================================================
 * @author dondevi
 * @create 2017-08-28
 *
 * @update 2017-08-30 dondevi
 *   1.Add: getDepartList()
 */

import {
  getDepartList as IMPORT_getDepartList,
  getOrderList as IMPORT_getOrderList,
  createOrder as IMPORT_createOrder,
  deleteOrder as IMPORT_deleteOrder
} from "service";

export default {
  data: () => ({
    loading: false,
    departList: null,
    orderList: null,
  }),
  methods: {
    getDepartList (callback) {
      if (this.departList) {
        return callback && callback(this.departList);
      }
      IMPORT_getDepartList(json => {
        this.departList = json;
        callback && callback(json);
      });
    },
    getOrderList (callback) {
      this.loading = true;
      IMPORT_getOrderList(this.startDate, this.endDate, orderList => {
        this.getDepartList(departList => {
          this.loading = false;
          this.orderList = convertOrderList(orderList, departList);
          callback && callback(this.orderList);
        });
      });
    },
    createOrder (date, type) {
      this.loading = true;
      IMPORT_createOrder(date, type, "", json => {
        this.$message.success("订餐成功");
        this.getOrderList();
      }).catch(error => {
        this.loading = false;
        this.$message.error("订餐失败");
      });
    },
    deleteOrder (id, date, type) {
      this.loading = true;
      IMPORT_deleteOrder(id, date, type, "", json => {
        this.$message.success("取消成功");
        this.getOrderList();
      }).catch(error => {
        this.$message.error("取消失败");
        this.loading = false;
      });
    },
    setOrder(id, date, type) {
      id ? this.deleteOrder(id, date, type) : this.createOrder(date, type);
    },
  },
};


function convertOrderList (orderList, departList) {
  var dates = { __count: orderList.length };
  orderList.forEach(order => {
    var { driqi, dshiduan, sgroup } = order;
    if ( 1 == sgroup) { return; }
    driqi = new Date(driqi).format();
    sgroup = getGroupName(sgroup, departList);
    var types = dates[driqi] || (dates[driqi] = { __count: 0 });
    var groups = types[dshiduan] || (types[dshiduan] = { __count: 0 });
    var orders = groups[sgroup] || (groups[sgroup] = []);
    if (order.dstaff === window.userInfo.urealname) {
      groups["__orderId"] = order.id;
      groups["__userName"] = order.dstaff;
    }
    types["__count"] += 1;
    groups["__count"] += 1;
    orders.push(order);
  });
  return dates;
}

function getGroupName (id, departList) {
  var depart = departList.find(depart => {
    return depart["id"] == id;
  });
  return depart && depart["gname"];
}
