"use strict";
const common_vendor = require("../../common/vendor.js");
const BottomNav = () => "../../components/BottomNav/BottomNav.js";
const _sfc_main = {
  components: {
    BottomNav
  },
  data() {
    return {
      activeTab: "upcoming",
      appointments: [],
      loading: false
    };
  },
  onLoad() {
    this.loadAppointments();
  },
  onShow() {
    this.loadAppointments();
  },
  methods: {
    async loadAppointments() {
      this.loading = true;
      try {
        const token = common_vendor.index.getStorageSync("uni_id_token");
        const userInfo = common_vendor.index.getStorageSync("userInfo");
        common_vendor.index.__f__("log", "at pages/appointments/appointments.vue:100", "预约页面 - token:", token ? "存在" : "不存在");
        common_vendor.index.__f__("log", "at pages/appointments/appointments.vue:101", "预约页面 - userInfo:", userInfo);
        if (!token || !userInfo || !userInfo._id) {
          common_vendor.index.__f__("warn", "at pages/appointments/appointments.vue:104", "预约页面 - 用户未登录，显示空列表");
          this.appointments = [];
          this.loading = false;
          return;
        }
        const status = this.activeTab === "upcoming" ? "confirmed" : "completed";
        const ordersObj = common_vendor.tr.importObject("orders");
        const res = await ordersObj.getList({
          role: "student",
          status,
          user_id: userInfo._id
          // 备用方案：如果 token 无法获取，使用用户ID
        });
        common_vendor.index.__f__("log", "at pages/appointments/appointments.vue:121", "预约页面 - 订单列表响应:", res);
        if (res.code === 0) {
          this.appointments = res.data || [];
        } else {
          if (res.message && res.message.includes("未登录")) {
            common_vendor.index.__f__("warn", "at pages/appointments/appointments.vue:128", "预约页面 - 云对象返回未登录");
            this.appointments = [];
          } else {
            common_vendor.index.showToast({
              title: res.message || "加载失败",
              icon: "none"
            });
          }
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/appointments/appointments.vue:138", "加载订单失败:", error);
        if (error.message && error.message.includes("未登录")) {
          common_vendor.index.__f__("warn", "at pages/appointments/appointments.vue:142", "预约页面 - 捕获到未登录错误");
          this.appointments = [];
        } else {
          common_vendor.index.showToast({
            title: error.message || "加载失败",
            icon: "none"
          });
        }
      } finally {
        this.loading = false;
      }
    },
    switchTab(tab) {
      this.activeTab = tab;
      this.loadAppointments();
    },
    getStatusText(status) {
      const statusMap = {
        pending: "待确认",
        confirmed: "即将开始",
        completed: "已完成",
        cancelled: "已取消"
      };
      return statusMap[status] || status;
    },
    enterClassroom(appointment) {
      if (appointment.zoom_join_url) {
        common_vendor.index.showModal({
          title: "提示",
          content: "请使用邮件中的 Zoom 链接进入课堂",
          showCancel: false
        });
      } else {
        common_vendor.index.showToast({
          title: "会议链接未生成",
          icon: "none"
        });
      }
    }
  }
};
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  const _easycom_BottomNav2 = common_vendor.resolveComponent("BottomNav");
  (_component_uni_icons + _easycom_BottomNav2)();
}
const _easycom_BottomNav = () => "../../components/BottomNav/BottomNav.js";
if (!Math) {
  _easycom_BottomNav();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t(_ctx.$t("appointments.title")),
    b: common_vendor.t(_ctx.$t("appointments.upcoming")),
    c: $data.activeTab === "upcoming" ? 1 : "",
    d: common_vendor.o(($event) => $options.switchTab("upcoming")),
    e: common_vendor.t(_ctx.$t("appointments.completed")),
    f: $data.activeTab === "completed" ? 1 : "",
    g: common_vendor.o(($event) => $options.switchTab("completed")),
    h: common_vendor.f($data.appointments, (appointment, k0, i0) => {
      var _a, _b, _c, _d;
      return common_vendor.e({
        a: (_a = appointment.mentor) == null ? void 0 : _a.avatar,
        b: common_vendor.t((_b = appointment.mentor) == null ? void 0 : _b.name),
        c: common_vendor.t(((_d = (_c = appointment.mentor) == null ? void 0 : _c.specialties) == null ? void 0 : _d[0]) || "UI/UX 专家"),
        d: common_vendor.t($options.getStatusText(appointment.status)),
        e: common_vendor.n(appointment.status),
        f: common_vendor.t(appointment.course_name || "作品集指导"),
        g: common_vendor.t(appointment.appointment_date),
        h: common_vendor.t(appointment.appointment_time),
        i: appointment.status === "confirmed"
      }, appointment.status === "confirmed" ? {
        j: "7c6f8f1a-0-" + i0,
        k: common_vendor.p({
          type: "videocam",
          size: "16",
          color: "#ffffff"
        }),
        l: common_vendor.t(_ctx.$t("appointments.enterClassroom")),
        m: common_vendor.o(($event) => $options.enterClassroom(appointment), appointment._id)
      } : {}, {
        n: appointment._id
      });
    }),
    i: $data.loading
  }, $data.loading ? {
    j: common_vendor.t(_ctx.$t("common.loading"))
  } : {}, {
    k: !$data.loading && $data.appointments.length === 0
  }, !$data.loading && $data.appointments.length === 0 ? {
    l: common_vendor.t(_ctx.$t("common.noData"))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7c6f8f1a"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/appointments/appointments.js.map
