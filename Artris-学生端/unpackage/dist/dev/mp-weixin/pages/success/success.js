"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      orderId: "",
      orderNo: "",
      appointmentId: "",
      // 兼容旧参数
      mentorName: ""
    };
  },
  onLoad(options) {
    if (options.orderId) {
      this.orderId = options.orderId;
    }
    if (options.orderNo) {
      this.orderNo = options.orderNo;
    }
    if (options.appointmentId) {
      this.appointmentId = options.appointmentId;
      this.orderId = options.appointmentId;
    }
    if (options.mentorName) {
      this.mentorName = decodeURIComponent(options.mentorName);
    }
  },
  methods: {
    goToAppointments() {
      common_vendor.index.redirectTo({
        url: "/pages/appointments/appointments"
      });
    },
    goToHome() {
      common_vendor.index.redirectTo({
        url: "/pages/home/home"
      });
    }
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.t(_ctx.$t("success.title")),
    b: common_vendor.t(_ctx.$t("success.message", {
      mentor: $data.mentorName
    })),
    c: common_vendor.t(_ctx.$t("success.viewAppointments")),
    d: common_vendor.o((...args) => $options.goToAppointments && $options.goToAppointments(...args)),
    e: common_vendor.t(_ctx.$t("success.backHome")),
    f: common_vendor.o((...args) => $options.goToHome && $options.goToHome(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e6c8cd0e"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/success/success.js.map
