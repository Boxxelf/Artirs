"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_i18n = require("../../utils/i18n.js");
const Header = () => "../../components/Header/Header.js";
const _sfc_main = {
  components: {
    Header
  },
  data() {
    return {
      loading: false,
      appointmentId: "",
      appointment: {
        studentName: "Li Hua (李华)",
        studentEmail: "lihua@example.com",
        studentAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBknlES0wQDeF2sr5hQS532ikgkjc5rAdu4n2QvnsOCctcHAzab1khpHYKHFRvgTtk6sXfNUlUdoY1fyFVsZT5vIGK0Zoqd9wApg47d4BPRxvSog4ehB0oYQqtJ5BroNhXHVl1BABK1ZAEGJeQ_Qq5wwAWPeSr41Uq4M1qwf86TD7ltzqq6IenwC3wyMGxq8uwtQuR6UnZkj_9C3yRYN0Ty7sYKESFZJqw1E9A4No6pY0AfZkACOjhTPfjm0mGgOv-B2-D8zhgrJWsn",
        courseType: "作品集指导 (Portfolio Guidance)",
        date: "2023-10-12",
        time: "14:00 - 15:00",
        duration: 1
      }
    };
  },
  onLoad(options) {
    if (options.id) {
      this.appointmentId = options.id;
      this.loadAppointment();
    }
  },
  methods: {
    $t(key, params) {
      return utils_i18n.i18n.t(key, params);
    },
    async loadAppointment() {
      var _a, _b, _c, _d;
      try {
        const ordersObj = common_vendor.tr.importObject("orders");
        const res = await ordersObj.getDetail(this.appointmentId);
        if (res.code === 0 && res.data) {
          const order = res.data;
          this.appointment = {
            studentName: ((_a = order.student) == null ? void 0 : _a.username) || "未知学生",
            studentEmail: ((_b = order.student) == null ? void 0 : _b.email) || "",
            studentAvatar: ((_d = (_c = order.student) == null ? void 0 : _c.avatar_file) == null ? void 0 : _d.url) || "",
            courseType: order.course_name || "作品集指导",
            date: order.appointment_date || "",
            time: order.appointment_time || "",
            duration: (order.duration || 60) / 60
          };
        } else {
          common_vendor.index.showToast({
            title: res.message || "加载失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/appointment-detail/appointment-detail.vue:117", "加载订单详情失败:", error);
        if (error.message && error.message.includes("未登录")) {
          common_vendor.index.showModal({
            title: "提示",
            content: "请先登录",
            showCancel: false
          });
        }
      }
    },
    async handleConfirm() {
      if (this.loading)
        return;
      this.loading = true;
      try {
        const zoomResult = await this.createZoomMeeting();
        if (!zoomResult.success) {
          throw new Error("创建会议失败");
        }
        const emailResult = await this.sendEmail(zoomResult.data);
        if (!emailResult.success) {
          throw new Error("发送邮件失败");
        }
        await this.updateAppointmentStatus("confirmed", {
          zoom_meeting_id: zoomResult.data.meetingId || zoomResult.data.id,
          zoom_join_url: zoomResult.data.joinUrl || zoomResult.data.join_url
        });
        common_vendor.index.showToast({
          title: this.$t("appointment.confirmSuccess"),
          icon: "success"
        });
        setTimeout(() => {
          common_vendor.index.navigateBack();
        }, 1500);
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/appointment-detail/appointment-detail.vue:164", "确认预约失败:", error);
        common_vendor.index.showToast({
          title: this.$t("appointment.confirmFailed"),
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    },
    async createZoomMeeting() {
      try {
        const result = await common_vendor.tr.callFunction({
          name: "zoom",
          data: {
            action: "createMeeting",
            topic: `${this.appointment.courseType} - ${this.appointment.studentName}`,
            duration: this.appointment.duration * 60,
            start_time: `${this.appointment.date}T${this.appointment.time.split(" - ")[0]}:00`
          }
        });
        return {
          success: true,
          data: result.result
        };
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/appointment-detail/appointment-detail.vue:190", "创建 Zoom 会议失败:", error);
        return {
          success: false,
          error: error.message
        };
      }
    },
    async sendEmail(zoomData) {
      try {
        const result = await common_vendor.tr.callFunction({
          name: "brevo",
          data: {
            action: "sendAppointmentEmail",
            data: {
              studentEmail: this.appointment.studentEmail,
              mentorEmail: "mentor@artris.com",
              // 从用户信息获取
              studentName: this.appointment.studentName,
              mentorName: "Zhang Laoshi",
              // 从用户信息获取
              appointmentDate: this.appointment.date,
              appointmentTime: this.appointment.time,
              zoomJoinUrl: zoomData.joinUrl
            }
          }
        });
        return {
          success: result.result.code === 0,
          data: result.result
        };
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/appointment-detail/appointment-detail.vue:220", "发送邮件失败:", error);
        return {
          success: false,
          error: error.message
        };
      }
    },
    async updateAppointmentStatus(status, zoomData = {}) {
      try {
        const ordersObj = common_vendor.tr.importObject("orders");
        const res = await ordersObj.updateStatus(this.appointmentId, status, zoomData);
        if (res.code !== 0) {
          throw new Error(res.message || "更新订单状态失败");
        }
        return res;
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/appointment-detail/appointment-detail.vue:239", "更新订单状态失败:", error);
        throw error;
      }
    },
    handleReject() {
      common_vendor.index.showModal({
        title: this.$t("common.confirm"),
        content: "确定要拒绝这个预约吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              await this.updateAppointmentStatus("cancelled");
              common_vendor.index.showToast({
                title: "已拒绝",
                icon: "success"
              });
              setTimeout(() => {
                common_vendor.index.navigateBack();
              }, 1500);
            } catch (error) {
              common_vendor.index.showToast({
                title: error.message || "操作失败",
                icon: "none"
              });
            }
          }
        }
      });
    }
  }
};
if (!Array) {
  const _easycom_Header2 = common_vendor.resolveComponent("Header");
  _easycom_Header2();
}
const _easycom_Header = () => "../../components/Header/Header.js";
if (!Math) {
  _easycom_Header();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.p({
      title: $options.$t("appointment.title"),
      showBack: true
    }),
    b: common_vendor.t($options.$t("appointment.studentInfo")),
    c: $data.appointment.studentAvatar,
    d: common_vendor.t($data.appointment.studentName),
    e: common_vendor.t($data.appointment.studentEmail),
    f: common_vendor.t($options.$t("appointment.courseInfo")),
    g: common_vendor.t($options.$t("appointment.courseType")),
    h: common_vendor.t($data.appointment.courseType),
    i: common_vendor.t($options.$t("appointment.appointmentTime")),
    j: common_vendor.t($data.appointment.date),
    k: common_vendor.t($data.appointment.time),
    l: common_vendor.t($options.$t("common.duration")),
    m: common_vendor.t($data.appointment.duration),
    n: common_vendor.t($options.$t("common.hour")),
    o: common_vendor.t($options.$t("appointment.rejectAppointment")),
    p: common_vendor.o((...args) => $options.handleReject && $options.handleReject(...args)),
    q: $data.loading,
    r: $data.loading
  }, $data.loading ? {
    s: common_vendor.t($options.$t("appointment.confirming"))
  } : {
    t: common_vendor.t($options.$t("appointment.confirmAppointment"))
  }, {
    v: common_vendor.o((...args) => $options.handleConfirm && $options.handleConfirm(...args)),
    w: $data.loading
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-722ac895"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/appointment-detail/appointment-detail.js.map
