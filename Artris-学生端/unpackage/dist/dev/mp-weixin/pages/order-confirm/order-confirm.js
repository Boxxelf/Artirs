"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      mentorId: "",
      appointmentDate: "",
      appointmentTime: "",
      mentor: {},
      orderPrice: 380,
      discount: 20,
      totalAmount: 360
    };
  },
  onLoad(options) {
    if (options.mentorId) {
      this.mentorId = options.mentorId;
    }
    if (options.date) {
      this.appointmentDate = options.date;
    }
    if (options.time) {
      this.appointmentTime = options.time;
    }
    this.loadMentorInfo();
  },
  methods: {
    async loadMentorInfo() {
      try {
        const res = await common_vendor.tr.callFunction({
          name: "mentors",
          data: {
            action: "getDetail",
            data: {
              mentorId: this.mentorId
            }
          }
        });
        if (res.result.code === 0) {
          this.mentor = res.result.data;
          this.orderPrice = this.mentor.price || 380;
          this.totalAmount = this.orderPrice - this.discount;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/order-confirm/order-confirm.vue:98", "加载导师信息失败:", error);
      }
    },
    goBack() {
      common_vendor.index.navigateBack();
    },
    async handlePay() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      const uniIdToken = common_vendor.index.getStorageSync("uni_id_token");
      if (!userInfo || !userInfo._id || !uniIdToken) {
        common_vendor.index.showModal({
          title: "提示",
          content: "请先登录后再创建订单",
          confirmText: "去登录",
          cancelText: "取消",
          success: (res) => {
            if (res.confirm) {
              common_vendor.index.navigateTo({
                url: "/pages/login/login"
              });
            }
          }
        });
        return;
      }
      try {
        const ordersObj = common_vendor.tr.importObject("orders");
        const createRes = await ordersObj.create({
          mentor_id: this.mentorId,
          appointment_date: this.appointmentDate,
          appointment_time: this.appointmentTime,
          duration: 60,
          course_name: "作品集指导",
          price: this.orderPrice,
          discount: this.discount,
          total_amount: this.totalAmount,
          user_id: userInfo._id
          // 备用方案：如果 token 无法获取，使用用户ID
        });
        if (createRes.code === 0) {
          common_vendor.index.navigateTo({
            url: `/pages/success/success?orderId=${createRes.data.order_id}&orderNo=${createRes.data.order_no}&mentorName=${this.mentor.name}`
          });
        } else {
          common_vendor.index.showToast({
            title: createRes.message || "创建订单失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/order-confirm/order-confirm.vue:153", "创建订单失败:", error);
        if (error.message && error.message.includes("未登录")) {
          common_vendor.index.showModal({
            title: "提示",
            content: "请先登录后再创建订单",
            showCancel: false
          });
        } else {
          common_vendor.index.showToast({
            title: error.message || "创建订单失败",
            icon: "none"
          });
        }
      }
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
    c: common_vendor.t(_ctx.$t("booking.confirmOrder")),
    d: $data.mentor.avatar,
    e: common_vendor.t($data.mentor.name),
    f: common_vendor.t(_ctx.$t("booking.portfolioGuidance")),
    g: common_vendor.t($data.appointmentDate),
    h: common_vendor.t($data.appointmentTime),
    i: common_vendor.t(_ctx.$t("booking.courseFee")),
    j: common_vendor.t($data.orderPrice.toFixed(2)),
    k: common_vendor.t(_ctx.$t("booking.coupon")),
    l: common_vendor.t($data.discount.toFixed(2)),
    m: common_vendor.t(_ctx.$t("booking.totalAmount")),
    n: common_vendor.t($data.totalAmount.toFixed(2)),
    o: common_vendor.t(_ctx.$t("booking.totalAmount")),
    p: common_vendor.t($data.totalAmount.toFixed(2)),
    q: common_vendor.t(_ctx.$t("booking.payNow")),
    r: common_vendor.o((...args) => $options.handlePay && $options.handlePay(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e7689724"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/order-confirm/order-confirm.js.map
