"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_i18n = require("../../utils/i18n.js");
const Header = () => "../../components/Header/Header.js";
const BottomNav = () => "../../components/BottomNav/BottomNav.js";
const _sfc_main = {
  components: {
    Header,
    BottomNav
  },
  data() {
    return {
      currentDate: /* @__PURE__ */ new Date(),
      weekdays: ["common.sunday", "common.monday", "common.tuesday", "common.wednesday", "common.thursday", "common.friday", "common.saturday"],
      todaySchedule: [
        {
          id: "1",
          name: "李伟",
          startTime: "10:00",
          endTime: "11:00",
          description: "Portfolio Review · 作品集指导",
          status: "confirmed"
        },
        {
          id: "2",
          name: "张芳",
          startTime: "14:00",
          endTime: "15:30",
          description: "基础素描 · 1.5小时",
          status: "pending"
        },
        {
          id: "3",
          name: "忙碌时间",
          startTime: "16:30",
          endTime: "18:00",
          description: "私人行程，不接受预约",
          status: "exception",
          isBusy: true
        }
      ]
    };
  },
  computed: {
    currentMonth() {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth() + 1;
      return `${year}年 ${month}月`;
    },
    todayDate() {
      const date = /* @__PURE__ */ new Date();
      const weekdays = ["日", "一", "二", "三", "四", "五", "六"];
      const month = date.getMonth() + 1;
      const day = date.getDate();
      const weekday = weekdays[date.getDay()];
      return `${month}月${day}日, 周${weekday}`;
    },
    calendarDates() {
      const year = this.currentDate.getFullYear();
      const month = this.currentDate.getMonth();
      const firstDay = new Date(year, month, 1);
      const startDate = new Date(firstDay);
      startDate.setDate(startDate.getDate() - startDate.getDay());
      const dates = [];
      const today = /* @__PURE__ */ new Date();
      today.setHours(0, 0, 0, 0);
      for (let i = 0; i < 42; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        const isOtherMonth = date.getMonth() !== month;
        const isToday = date.getTime() === today.getTime();
        dates.push({
          day: date.getDate(),
          date,
          otherMonth: isOtherMonth,
          isToday,
          hasClass: !isOtherMonth && (date.getDate() === 5 || date.getDate() === 6 || date.getDate() === 10),
          isSelected: false
        });
      }
      return dates;
    }
  },
  methods: {
    $t(key, params) {
      return utils_i18n.i18n.t(key, params);
    },
    prevMonth() {
      const newDate = new Date(this.currentDate);
      newDate.setMonth(newDate.getMonth() - 1);
      this.currentDate = newDate;
    },
    nextMonth() {
      const newDate = new Date(this.currentDate);
      newDate.setMonth(newDate.getMonth() + 1);
      this.currentDate = newDate;
    },
    selectDate(date) {
      if (!date.otherMonth)
        ;
    },
    getStatusText(status) {
      const statusMap = {
        confirmed: this.$t("schedule.confirmed"),
        pending: this.$t("schedule.pendingConfirm"),
        exception: this.$t("schedule.exception")
      };
      return statusMap[status] || "";
    },
    handleSettings() {
    },
    modifySettings() {
    },
    viewAppointment(id) {
      common_vendor.index.navigateTo({
        url: `/pages/appointment-detail/appointment-detail?id=${id}`
      });
    },
    addException() {
    }
  }
};
if (!Array) {
  const _easycom_Header2 = common_vendor.resolveComponent("Header");
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  const _easycom_BottomNav2 = common_vendor.resolveComponent("BottomNav");
  (_easycom_Header2 + _component_uni_icons + _easycom_BottomNav2)();
}
const _easycom_Header = () => "../../components/Header/Header.js";
const _easycom_BottomNav = () => "../../components/BottomNav/BottomNav.js";
if (!Math) {
  (_easycom_Header + _easycom_BottomNav)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o($options.handleSettings),
    b: common_vendor.p({
      title: $options.$t("schedule.title"),
      rightIcon: "settings"
    }),
    c: common_vendor.p({
      type: "left",
      size: "20",
      color: "#666"
    }),
    d: common_vendor.o((...args) => $options.prevMonth && $options.prevMonth(...args)),
    e: common_vendor.t($options.currentMonth),
    f: common_vendor.p({
      type: "right",
      size: "20",
      color: "#666"
    }),
    g: common_vendor.o((...args) => $options.nextMonth && $options.nextMonth(...args)),
    h: common_vendor.f($data.weekdays, (day, k0, i0) => {
      return {
        a: common_vendor.t($options.$t(day)),
        b: day
      };
    }),
    i: common_vendor.f($options.calendarDates, (date, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(date.day),
        b: date.hasClass
      }, date.hasClass ? {} : {}, {
        c: index,
        d: date.otherMonth ? 1 : "",
        e: date.hasClass ? 1 : "",
        f: date.isToday ? 1 : "",
        g: date.isSelected ? 1 : "",
        h: common_vendor.o(($event) => $options.selectDate(date), index)
      });
    }),
    j: common_vendor.p({
      type: "wallet",
      size: "24",
      color: "#fff"
    }),
    k: common_vendor.t($options.$t("schedule.bookingSettings")),
    l: common_vendor.t($options.$t("schedule.currentPrice")),
    m: common_vendor.t($options.$t("common.hour")),
    n: common_vendor.t($options.$t("schedule.modifySettings")),
    o: common_vendor.o((...args) => $options.modifySettings && $options.modifySettings(...args)),
    p: common_vendor.t($options.$t("schedule.todaySchedule")),
    q: common_vendor.t($options.todayDate),
    r: common_vendor.f($data.todaySchedule, (item, index, i0) => {
      return common_vendor.e({
        a: common_vendor.t(item.startTime),
        b: common_vendor.t(item.endTime),
        c: common_vendor.t(item.name),
        d: common_vendor.t($options.getStatusText(item.status)),
        e: common_vendor.n(item.status),
        f: common_vendor.t(item.description),
        g: !item.isBusy
      }, !item.isBusy ? {
        h: "e6e5e79f-4-" + i0,
        i: common_vendor.p({
          type: "more",
          size: "20",
          color: "#999"
        })
      } : {
        j: "e6e5e79f-5-" + i0,
        k: common_vendor.p({
          type: "close",
          size: "16",
          color: "#999"
        })
      }, {
        l: index,
        m: item.isBusy ? 1 : "",
        n: common_vendor.o(($event) => !item.isBusy && $options.viewAppointment(item.id), index)
      });
    }),
    s: common_vendor.p({
      type: "plus",
      size: "24",
      color: "#fff"
    }),
    t: common_vendor.t($options.$t("schedule.addException")),
    v: common_vendor.o((...args) => $options.addException && $options.addException(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e6e5e79f"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/schedule/schedule.js.map
