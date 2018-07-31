<!--
/**
 * =============================================================================
 *  Kanban 看板视图
 * =============================================================================
 *
 * @author dondevi
 * @create 2017-08-24
 *
 * @update 2017-08-30 dondevi
 *   1.Impletement
 * @update 2017-09-30 dondevi
 *   1.Update: Theme !
 */
-->

<template>
  <q-page class="row non-selectable">

    <table class="col table" :class="{ loading: loading }">
      <thead>
        <tr>
          <th colspan="2" v-for="day in dayList">
            {{ day.weekDay }}
            <template v-if="day.meta">
              <small>x</small> {{ day.meta.__count }}
            </template>
            <q-tooltip>{{ day.text }}</q-tooltip>
          </th>
        </tr>
        <tr>
          <template v-for="day in dayList">
            <th v-for="(groups, type) in day.meta" v-if="!/^__/.test(type)">
              {{ { 'lunch': '午餐', 'dinner': '晚餐' }[type] }}
              <small>x</small> {{ groups.__count }}
            </th>
          </template>
        </tr>
        <!-- <tr>
          <template v-for="day in dayList">
            <th v-for="(groups, type) in day.meta" v-if="!/^__/.test(type)">
              <el-button type="success" :plain="true" size="mini" icon="edit" v-if="!groups.__orderId"
                @click.native="setOrder(groups.__orderId, day.text, type)">订餐</el-button>
              <el-button type="danger" size="mini" icon="close" v-if="groups.__orderId"
                @click.native="setOrder(groups.__orderId, day.text, type)">取消</el-button>
            </th>
          </template>
        </tr> -->
      </thead>
      <tbody>
        <tr>
          <template v-for="day in dayList">
            <td v-for="(groups, type) in day.meta" v-if="!/^__/.test(type)">
              <dl class="staff-list" v-for="(orders, group) in groups" v-if="!/^__/.test(group)">
                <dt>
                  {{ group }} <small>x</small> {{ orders.length }}
                </dt>
                <dd v-for="order in orders"
                    :class="{ active: order.member_name === groups.__userName }">
                  {{ order.member_name }}
                </dd>
              </dl>
            </td>
          </template>
        </tr>
      </tbody>
    </table>

  </q-page>
</template>





<script>
  import { date } from "quasar";
  import "pages/mixin.css";
  import mixin from "pages/mixin.js";

  export default {
    mixins: [mixin],
    data: () => ({
      dayNum: 5,
      startDate: "",
      endDate: "",
      dayList: [],
    }),
    watch: {
      dayList () {
        this.getOrderList();
      },
      orderList () {
        this.dayList.forEach(day => {
          var meta = Object.assign({
            "lunch": { __count: 0 }, "dinner": { __count: 0 }, __count: 0,
          }, this.orderList[day.text]);
          Object.assign(day, { meta });
          if (day.isActive) {
            this.nowMeta = day.meta;
          }
        });
      },
    },
    created () {
      this.dayList = this.getDayList();
    },
    methods: {
      getDayList () {
        var now = new Date();
        var labels = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
        now.setDate(now.getDate() - 1);
        var dayList =  new Array(this.dayNum).fill(undefined).map(item => {
          now.setDate(now.getDate() + 1);
          return {
            text: date.formatDate(now, "YYYY-MM-DD"),
            weekDay: labels[now.getDay()],
          };
        });
        this.startDate = dayList[0].text;
        this.endDate = dayList[dayList.length - 1].text;
        return dayList;
      },
    },
  };
</script>





<style scoped>
  .q-layout-page {
    height: calc(100vh - 53px);
  }
  .table {
    table-layout: fixed;
    height: 100%;
    margin-bottom: -1px;
    background: linear-gradient(to bottom, #027be3, #324057);
    color: #fff;
  }
  .q-btn {
    border: none;
    background-color: rgba(255,255,255,0.1);
    color: #fff;
  }
    th, td {
      border: 1px solid rgba(255,255,255,0.1);
    }
    thead > tr:nth-child(1) {
      background-color: rgba(255,255,255,0.1);
    }
    thead > tr:nth-child(2) {
      background-color: rgba(255,255,255,0.05);
    }
    th {
      padding: 8px 0;
    }
    td {
      width: 10%;
      padding: 0;
      text-align: center;
      white-space: normal;
      vertical-align: top;
    }
</style>
