/**
 * =============================================================================
 *  Minxin OA service
 * =============================================================================
 *
 * @author dondevi
 * @create 2018-06-24
 */

export default {
  data: () => ({
    loading: false,
    departList: null,
    orderList: null,
  }),
  methods: {
    getOrderList (callback) {
      this.loading = true;
      this.$service.order.list({
        start_date: this.startDate,
        end_date: this.endDate,
      }).then(data => {
        this.orderList = convertOrderList(data, this.$session.user);
        callback && callback(this.orderList);
      }).catch(error => error).then(() => {
        this.loading = false;
      });
    },
    createOrder (date, type) {
      this.loading = true;
      const { id: account_id, member_name, department_name } = this.$session.user;
      this.$service.order.create({
        type,
        date,
        account_id,
        member_name,
        department_name,
      }).then(data => {
        this.$q.notify({ type: "positive", message: "订餐成功" });
        this.getOrderList();
      }).catch(error => error).then(() => {
        this.loading = false;
      });
    },
    deleteOrder (id) {
      this.loading = true;
      this.$service.order.destroy(id).then(data => {
        this.$q.notify({ type: "positive", message: "取消成功" });
        this.getOrderList();
      }).catch(error => error).then(() => {
        this.loading = false;
      });
    },
    setOrder(id, date, type) {
      id ? this.deleteOrder(id) : this.createOrder(date, type);
    },
  },
};


function convertOrderList (orderList, user) {
  var dates = { __count: orderList.length };
  orderList.forEach(order => {
    var { date, type, department_name } = order;
    var types = dates[date] || (dates[date] = { __count: 0 });
    var groups = types[type] || (types[type] = { __count: 0 });
    var orders = groups[department_name] || (groups[department_name] = []);
    if (order.member_name === user.member_name) {
      groups["__orderId"] = order.id;
      groups["__userName"] = order.member_name;
    }
    types["__count"] += 1;
    groups["__count"] += 1;
    orders.push(order);
  });
  return dates;
}
