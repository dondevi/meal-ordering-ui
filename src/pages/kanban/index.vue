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
  <div class="table-wrap unselect" :class="{ loading: loading }">
    <table class="table">
      <thead>
        <tr>
          <th colspan="2" v-for="day in dayList">
            {{ day.text }} {{ day.weekDay }}
            <template v-if="day.meta">
              <small>x</small> {{ day.meta.__count }}
            </template>
          </th>
        </tr>
        <tr>
          <template v-for="day in dayList">
            <th v-for="(groups, type) in day.meta" v-if="!/^__/.test(type)">
              {{ type }} <small>x</small> {{ groups.__count }}
            </th>
          </template>
        </tr>
        <tr>
          <template v-for="day in dayList">
            <th v-for="(groups, type) in day.meta" v-if="!/^__/.test(type)">
              <el-button type="success" :plain="true" size="mini" icon="edit" v-if="!groups.__orderId"
                @click.native="setOrder(groups.__orderId, day.text, type)">订餐</el-button>
              <el-button type="danger" size="mini" icon="close" v-if="groups.__orderId"
                @click.native="setOrder(groups.__orderId, day.text, type)">取消</el-button>
            </th>
          </template>
        </tr>
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
                    :class="{ active: order.dstaff === groups.__userName }">
                  {{ order.dstaff }}
                </dd>
              </dl>
            </td>
          </template>
        </tr>
      </tbody>
    </table>
  </div>
</template>





<script>
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
            "午餐": { __count: 0 }, "晚餐": { __count: 0 }, __count: 0,
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
        var date = new Date();
        var labels = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];
        date.setDate(date.getDate() - 1);
        var dayList =  new Array(this.dayNum).fill(undefined).map(item => {
          date.setDate(date.getDate() + 1);
          return {
            text: date.format(),
            weekDay: labels[date.getDay()],
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
  .table-wrap {
    width: 100%;
    height: 100%;
    overflow: auto;
    background: linear-gradient(to bottom, #20a0ff, #324057);
    color: #fff;
  }
  .table {
    table-layout: fixed;
    min-width: 100%;
    min-height: calc(100% - 2px);
  }
  .el-button {
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
