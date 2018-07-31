<!--
/**
 * =============================================================================
 *  Calendar
 * =============================================================================
 *
 * @author dondevi
 * @create 2018-06-24
 */
-->

<template>
  <q-page class="row non-selectable" @keypress="doShortcut">
    <table class="col calendar-view" :class="{ loading: loading }">

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
                <label
                  v-for="(groups, type) in day.meta"
                  v-if="!/^__/.test(type)"
                  :class="{ 'is-checked': groups.__orderId }">
                  <input type="checkbox" :checked="groups.__orderId"
                    @change="setOrder(groups.__orderId, day.text, type)" hidden />
                  {{ { "lunch": "午餐", "dinner": "晚餐" }[type] }}
                </label>
              </div>
            </div>

          </td>
        </tr>
      </tbody>
    </table>

    <q-layout-drawer side="right" v-model="drawer" :content-style="{width:'340px'}">
      <div class="calendar-panel">

        <header class="calendar-panel-header">
          <q-btn size="small" icon="first_page" @click="setDate('month', -1)">
            <q-tooltip>上月</q-tooltip>
          </q-btn>
          <q-btn size="small" icon="chevron_left" @click="setDate('day', -1)">
            <q-tooltip>上天</q-tooltip>
          </q-btn>
          <q-btn size="small" @click="setDate('today')">
            <strong> {{ activeDate }} </strong>
            <q-tooltip>回今</q-tooltip>
          </q-btn>
          <q-btn size="small" icon="chevron_right" @click="setDate('day', 1)">
            <q-tooltip>下天</q-tooltip>
          </q-btn>
          <q-btn size="small" icon="last_page" @click="setDate('month', 1)">
            <q-tooltip>下月</q-tooltip>
          </q-btn>
        </header>

        <div class="calendar-panel-body">
          <div v-for="(groups, type) in nowMeta" v-if="!/^__/.test(type)">
            <header> {{ { "lunch": "午餐", "dinner": "晚餐" }[type] }}
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
                  :class="{ active: order.member_name === groups.__userName }">
                {{ order.member_name }}
              </dd>
            </dl>
          </div>
        </div>
      </div>
    </q-layout-drawer>

  </q-page>
</template>





<script>
  import { date } from "quasar";
  import "pages/mixin.css";
  import mixin from "pages/mixin.js";

  export default {

    mixins: [mixin],
    data: () => ({
      drawer: true,
      weekdays: [],
      calendar: [],
      activeItem: {
        text: date.formatDate(new Date(), "YYYY-MM-DD"),
      },
      minDate: date.formatDate(new Date(), "YYYY-MM-DD"),
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
              "lunch": {}, "dinner": {}
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
      this.initWeekdays();
      window.addEventListener("keydown", this.doShortcut);
    },
    destroyed () {
      window.removeEventListener("keydown", this.doShortcut);
    },

    methods: {
      initWeekdays () {
        // Array: 7 weekdays for showing 1 week
        this.weekdays = new Array(7).fill(undefined).map((day, index) => ({
          value: index
        }));
      },
      getCalendar (viewDate, activeDate, minDate, maxDate) {
        viewDate = viewDate || activeDate;
        var workDateObj = getWorkDateObj(viewDate);
        var nowDate = date.formatDate(new Date(), "YYYY-MM-DD");
        var calendar = new Array(6).fill(undefined).map(week =>
          // 2D Array: 6 weeks x 7 days for showing 1 month
          new Array(7).fill(undefined).map(day => {
            var workDate = date.formatDate(workDateObj, "YYYY-MM-DD");
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
        this.endDate = date.formatDate(workDateObj, "YYYY-MM-DD");
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
        var labels = ["日", "一", "二", "三", "四", "五", "六"];
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
        var activeDate = date.formatDate(activeDateObj, "YYYY-MM-DD");
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
      doShortcut (event) {
        switch (event.key) {
          case "ArrowLeft": this.setDate('day', -1); break;
          case "ArrowRight": this.setDate('day', 1); break;
          case "ArrowUp": this.setDate('day', -7); break;
          case "ArrowDown": this.setDate('day', 7); break;
          case "PageUp": this.setDate('month', -1); break;
          case "PageDown": this.setDate('month', 1); break;
        };
      },
    },
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
  .q-layout-page {
    height: calc(100vh - 53px);
  }
  .calendar-view {
    height: 100%;
    table-layout: fixed;
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
      outline: 1px solid #027be3;
    }
    .calendar-view td.active .cell-title {
      color: #027be3;
      font-weight: bold;
    }
    .calendar-view td.now .cell-title {
      background-color: #027be3;
      color: #fff;
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
  .cell-content > label {
    flex-grow: 1;
    width: 50%;
    height: 100%;
  }

  .calendar-panel {
    display: flex;
    flex-direction: column;
    height: 100%;
    background: linear-gradient(to bottom, #027be3, #324057);
    color: #fff;
  }
  .calendar-panel-header {
    display: flex;
    justify-content: center;
    padding: 20px 0;
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

  .cell-content > label {
    display: flex;
    align-items: center;
    flex-direction: column;
    justify-content: center;
    width: 100%;
    height: 100%;
    vertical-align: middle;
    cursor: pointer;
  }
  .cell-content > label:before {
    content: "done";
    display: block;
    width: 22px;
    height: 22px;
    margin-bottom: 5px;
    background-color: #f5f5f5;
    border-radius: 50%;
    color: transparent;
    font-family: "Material Icons";
    font-size: 10px;
    line-height: 22px;
  }
  .cell-content > label.is-checked:before {
    background-color: transparent;
    box-shadow: none;
  }
  .cell-content > label.is-checked:before {
    background-color: #027be3;
    color: #fff;
  }

  .calendar-panel-header > .q-btn,
  .calendar-panel-body > div > header {
    background-color: rgba(255,255,255,0.1);
    border: none;
    box-shadow: none;
    color: #fff;
  }
  .calendar-view td .cell-title:hover     { background-color: #fbfbfb; }
  .calendar-view td.out .cell-title:hover { background-color: #fafafa; }
  .cell-content > label                   { color: rgba(0,0,0,0) !important; }
  .cell-content > label:hover             { color: rgba(0,0,0,0.7) !important; background-color: #fcfcfc; }
  .cell-content > label.is-checked:hover  { color: rgba(0,0,0,0.4) !important; }
</style>

