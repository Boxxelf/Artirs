"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      mentorId: "",
      selectedDate: "",
      selectedTime: "",
      currentYear: (/* @__PURE__ */ new Date()).getFullYear(),
      currentMonth: (/* @__PURE__ */ new Date()).getMonth() + 1,
      availableDates: [],
      availableTimes: ["14:00", "15:00", "16:00", "17:00", "18:00", "19:00"]
    };
  },
  onLoad(options) {
    if (options.mentorId) {
      this.mentorId = options.mentorId;
    }
    this.generateDates();
  },
  methods: {
    generateDates() {
      const dates = [];
      const today = /* @__PURE__ */ new Date();
      for (let i = 0; i < 14; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        const weekday = weekdays[date.getDay()];
        dates.push({
          value: this.formatDate(date),
          day: date.getDate(),
          weekday
        });
      }
      this.availableDates = dates;
    },
    formatDate(date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    selectDate(date) {
      this.selectedDate = date;
    },
    selectTime(time) {
      this.selectedTime = time;
    },
    goBack() {
      common_vendor.index.navigateBack();
    },
    goToConfirm() {
      if (!this.selectedDate || !this.selectedTime) {
        common_vendor.index.showToast({
          title: "请选择日期和时间",
          icon: "none"
        });
        return;
      }
      common_vendor.index.navigateTo({
        url: `/pages/order-confirm/order-confirm?mentorId=${this.mentorId}&date=${this.selectedDate}&time=${this.selectedTime}`
      });
    }
  }
};
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.o($options.goBack),
    b: common_vendor.p({
      type: "left",
      size: "24",
      color: "#333"
    }),
    c: common_vendor.t(_ctx.$t("booking.selectTime")),
    d: common_vendor.t($data.currentYear),
    e: common_vendor.t($data.currentMonth),
    f: common_vendor.p({
      type: "calendar",
      size: "20",
      color: "#00B4D8"
    }),
    g: common_vendor.f($data.availableDates, (date, index, i0) => {
      return {
        a: common_vendor.t(date.weekday),
        b: common_vendor.t(date.day),
        c: index,
        d: $data.selectedDate === date.value ? 1 : "",
        e: common_vendor.o(($event) => $options.selectDate(date.value), index)
      };
    }),
    h: common_vendor.t(_ctx.$t("booking.selectTime")),
    i: common_vendor.f($data.availableTimes, (time, index, i0) => {
      return {
        a: common_vendor.t(time),
        b: index,
        c: $data.selectedTime === time ? 1 : "",
        d: common_vendor.o(($event) => $options.selectTime(time), index)
      };
    }),
    j: common_vendor.t(_ctx.$t("common.next")),
    k: common_vendor.p({
      type: "right",
      size: "16",
      color: "#ffffff"
    }),
    l: !$data.selectedDate || !$data.selectedTime,
    m: common_vendor.o((...args) => $options.goToConfirm && $options.goToConfirm(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-d331dabb"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/booking/booking.js.map
