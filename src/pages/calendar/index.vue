<!--
/**
 * =============================================================================
 *  Calendar 日历视图
 * =============================================================================
 *
 * @author dondevi
 * @create 2017-08-24
 *
 * @update 2017-08-25 dondevi
 *   1.Develop
 * @update 2017-08-30 dondevi
 *   1.Impletement
 * @update 2017-09-30 dondevi
 *   1.Update: Theme !
 *   2.Remove: <el-tooltip>
 */
-->

<template>
  <div class="content flex unselect">

    <table class="calendar-view" :class="{ loading: loading }">

      <thead>
        <tr>
           <th v-for="weekday in weekdays">
             <abbr v-text="filterWeekday(weekday.value)"></abbr>
           </th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="week in calendar">
          <td v-for="day in week" v-bind:class="getItemClass(day)">

            <div class="cell">
              <div class="cell-title" slot="reference" v-on:click="setItemActive(day)">
                <time v-text="filterDay(day.value)"></time>
              </div>
              <div class="cell-content" v-if="!day.isDisable">
                <el-checkbox-button
                  v-for="(groups, type) in day.meta"
                  v-if="!/^__/.test(type)"
                  :key="type"
                  :label="type"
                  :checked="!!groups.__orderId"
                  @change="setOrder(groups.__orderId, day.text, type)">
                </el-checkbox-button>
              </div>
            </div>

          </td>
        </tr>
      </tbody>
    </table>

    <div class="calendar-panel">

      <header class="calendar-panel-header">
        <el-tooltip effect="light" content="上月" placement="bottom">
          <el-button size="small" icon="el-icon-d-arrow-left"
            @click="setDate('month', -1)"></el-button>
        </el-tooltip>
        <el-tooltip effect="light" content="上天" placement="bottom">
          <el-button size="small" icon="el-icon-arrow-left"
            @click="setDate('day', -1)"></el-button>
        </el-tooltip>
        <el-tooltip effect="light" content="回今" placement="bottom">
          <el-button size="small" @click="setDate('today')">
            <strong> {{ activeDate }} </strong>
          </el-button>
        </el-tooltip>
        <el-tooltip effect="light" content="下天" placement="bottom">
          <el-button size="small" icon="el-icon-arrow-right"
            @click="setDate('day', 1)"></el-button>
        </el-tooltip>
        <el-tooltip effect="light" content="下月" placement="bottom">
          <el-button size="small" icon="el-icon-d-arrow-right"
            @click="setDate('month', 1)"></el-button>
        </el-tooltip>
      </header>

      <div class="calendar-panel-body">
        <div v-for="(groups, type) in nowMeta" v-if="!/^__/.test(type)">
          <header> {{ type }}
            <template v-if="groups.__count">
              <small>x</small> {{ groups.__count }}
            </template>
          </header>
          <dl class="staff-list" v-for="(orders, group) in groups" v-if="!/^__/.test(group)">
            <dt> {{ group }}
              <template>
                <small>x</small> {{ orders.length }}
              </template>
            </dt>
            <dd v-for="order in orders"
                :class="{ active: order.dstaff === groups.__userName }">
              {{ order.dstaff }}
            </dd>
          </dl>
        </div>
      </div>

    </div>

  </div>
</template>





<script>
  import "pages/mixin.css";
  import mixin from "pages/mixin.js";
  export default {
    mixins: [mixin],

    data: () => ({
      weekdays: [],
      calendar: [],
      activeItem: {
        text: new Date().format(),
      },
      minDate: new Date().format(),
      startDate: "",
      endDate: "",
      nowMeta: {},
    }),
    computed: {
      activeDate () {
        return this.activeItem.text;
      },
    },
    watch: {
      activeDate: {
        immediate: true,
        handler (nowValue, oldValue) {
          var nowMonth = nowValue && nowValue.slice(0, 7) ;
          var oldMonth = oldValue && oldValue.slice(0, 7);
          if (nowMonth && nowMonth !== oldMonth) {
            this.calendar = this.getCalendar("", this.activeDate, this.minDate);
          }
        },
      },
      calendar: {
        immediate: true,
        handler () {
          this.getOrderList();
        },
      },
      orderList () {
        this.calendar.forEach(week => {
          week.forEach(day => {
            var meta = Object.assign({
              "午餐": {}, "晚餐": {}
            }, this.orderList[day.text]);
            Object.assign(day, { meta });
            if (day.isActive) {
              this.nowMeta = day.meta;
            }
          });
        });
      },
    },

    created () {
      this.weekdays = this.getWeekdays();
    },

    methods: {
      getWeekdays () {
        // Array: 7 weekdays for showing 1 week
        return new Array(7).fill(undefined).map((day, index) => ({
          value: index
        }));
      },
      getCalendar (viewDate, activeDate, minDate, maxDate) {
        viewDate = viewDate || activeDate;
        var workDateObj = getWorkDateObj(viewDate);
        var nowDate = new Date().format();
        var calendar = new Array(6).fill(undefined).map(week =>
          // 2D Array: 6 weeks x 7 days for showing 1 month
          new Array(7).fill(undefined).map(day => {
            var workDate = workDateObj.format();
            var offsetMonth = 7;
            var offsetDay = 10;
            day = {
              value:     workDateObj.getDate(),
              text:      workDate,
              isOut:     workDate.slice(0, offsetMonth) !==
                         viewDate.slice(0, offsetMonth),
              isNow:     workDate.slice(0, offsetDay) ===
                         nowDate.slice(0, offsetDay),
              isActive:  workDate.slice(0, offsetDay) ===
                         activeDate.slice(0, offsetDay) && activeDate,
              isDisable: (minDate && workDate < minDate) ||
                         (maxDate && workDate > maxDate),
            };
            if (1 == day.value) {
              day.value = (workDateObj.getMonth() + 1) + "-" + day.value;
            }
            if (day.isActive) {
              this.activeItem = day;
            }
            workDateObj.setDate(workDateObj.getDate() + 1);
            return day;
          })
        );
        workDateObj.setDate(workDateObj.getDate() - 1);
        this.startDate = nowDate;
        this.endDate = workDateObj.format();
        return calendar;
      },
      getItemClass: item => ({
        "out": item.isOut,       "now": item.isNow,
        "active": item.isActive, "disable": item.isDisable
      }),
      setItemActive (item) {
        if (item.isDisable) { return; }
        if (item.isActive) { return; }
        this.activeItem.isActive = false;
        this.activeItem = item;
        this.nowMeta = item.meta;
        item.isActive = true;
      },
      filterWeekday (value) {
        var labels = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
        return labels[value] || value;
      },
      filterDay (value) {
        return value;
      },
      setDate (type, offset) {
        var activeDateObj = new Date(this.activeDate);
        switch(type) {
          case "today":
            activeDateObj = new Date();
            break;
          case "month":
            activeDateObj.setMonth(activeDateObj.getMonth() + offset);
            break;
          case "day":
            activeDateObj.setDate(activeDateObj.getDate() + offset);
            break;
        }
        var activeDate = activeDateObj.format();
        var activeItem = null;
        this.calendar.forEach(week => {
          week.forEach(day => {
            if (day.text === activeDate) {
              activeItem = day;
            }
          });
        });
        if (activeItem) {
          this.setItemActive(activeItem);
        } else {
          this.activeItem = { text: activeDate };
        }
      },
    }
  };

  function getWorkDateObj (viewDate) {
    var workDateObj = new Date(viewDate);
    // Set to first day
    workDateObj.setDate(1);
    // Set to Sunday
    workDateObj.setDate(workDateObj.getDate() - workDateObj.getDay());
    return workDateObj;
  }
</script>





<style scoped>

  .calendar-view {
    table-layout: fixed;
    width: calc(100% - 340px);
    height: 100%;
    background-color: #ddd;
    border-collapse: separate;
    border-spacing: 1px;
    text-align: center;
  }
    .calendar-view th,
    .calendar-view td {
      background-color: #fff;
      border: none;
    }
    .calendar-view th {
      padding: 12px 10px;
    }
  .calendar-view > tbody > tr {
    height: 16.6667%;
  }
    .calendar-view td {
      padding: 0;
      vertical-align: top;
    }
    .calendar-view td.now time {
      font-weight: bold;
      text-decoration: underline;
    }
    .calendar-view td.disable {
      opacity: 0.9;
    }
    .calendar-view td.disable .cell-title {
      background-color: transparent !important;
      border-bottom: none;
      cursor: default;
    }
    .calendar-view td.out {
      background-color: #fff;
      opacity: 0.6;
    }
    .calendar-view td.out .cell-title {
      color: #888;
    }
    .calendar-view td.active {
      outline: 1px solid #20a0ff;
    }
    .calendar-view td.active .cell-title {
      font-weight: bold;
    }

  .cell {
    display: flex;
    flex-direction: column;
    height: 100%;
  }
  .cell-title {
    padding: 5px;
    cursor: pointer;
  }
  .cell-content {
    display: flex;
    height: 100%;
  }
  .cell-content > .el-checkbox-button {
    flex-grow: 1;
    width: 50%;
    height: 100%;
  }

  .calendar-panel {
    display: flex;
    flex-direction: column;
    width: 340px;
    height: 100%;
    margin-left: -1px;
    background: linear-gradient(to bottom, #20a0ff, #324057);
  }
  .calendar-panel-header {
    display: flex;
    justify-content: center;
    padding: 22px 0 20px;
  }
  .calendar-panel-body {
    display: flex;
    justify-content: center;
    height: 100%;
  }
  .calendar-panel-body > div {
    display: flex;
    flex-grow: 1;
    flex-direction: column;
    align-items: center;
    width: 50%;
    height: 100%;
    overflow: auto;
  }
  .calendar-panel-body > div:first-child {
    border-right: 1px solid rgba(255,255,255,0.2);
  }
  .calendar-panel-body > div > header {
    width: 100%;
    padding: 10px 0;
    margin-bottom: 2px;
    font-weight: bold;
    text-align: center;
  }

  .cell-content >>>.el-checkbox-button__inner {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
    background-color: transparent;
    border: none !important;
    border-radius: 0 !important;
    vertical-align: middle;
  }
  .cell-content >>>.el-checkbox-button__inner:before {
    content: "\E611";
    display: block;
    width: 22px;
    height: 22px;
    margin-bottom: 5px;
    background-color: #ededed;
    border-radius: 50%;
    color: transparent;
    font-size: 10px;
    font-family: element-icons;
    line-height: 22px;
  }
  .cell-content >>>.is-checked .el-checkbox-button__inner {
    background-color: transparent;
    box-shadow: none;
  }
  .cell-content >>>.is-checked .el-checkbox-button__inner:before {
    background-color: #20a0ff;
    color: #fff;
  }

  .calendar-panel-header > .el-button,
  .calendar-panel-body > div > header {
    background-color: rgba(255,255,255,0.1);
    border: none;
    color: #fff;
  }
  .calendar-view td .cell-title:hover     { background-color: #fbfbfb; }
  .calendar-view td.out .cell-title:hover { background-color: #fafafa; }
  .cell-content >>>.el-checkbox-button__inner                   { color: rgba(0,0,0,0) !important; }
  .cell-content >>>.el-checkbox-button__inner:hover             { color: rgba(0,0,0,0.7) !important; background-color: #fcfcfc; }
  .cell-content >>>.is-checked .el-checkbox-button__inner:hover { color: rgba(0,0,0,0.4) !important; }
</style>

