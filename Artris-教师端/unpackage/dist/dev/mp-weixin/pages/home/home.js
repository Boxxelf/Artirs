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
      currentLang: "zh",
      teacherInfo: {
        name: "Zhang Laoshi",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAOuBhXWLMC5dnN26A_egpSOtmZW8SYgolExbubdhGFsqTpSDxkLM747DPRcF12-CgE5bVbmODaKwaz0hBJAzwJHzFj4MMZHR_6b3p0Biic1tvKKC7H6IXq6YvuxkbHsb5oHRSvvbC6qTi7W7aBdrPMpWLfEs2WXCQz2oTyY-6Lk-pyDI7dHfupuMNKCMbQ2KjnXUy-PQL4E5B_Od--V6LJu8UsZo_SeBKKTnG0dIGqwNGa1N9ToAlyHmC6Y1ITq48SlbSihROq-1a2",
        school: "Rhode Island School of Design"
      },
      currentClass: {
        id: "1",
        studentName: "Li Hua (李华)",
        studentAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBknlES0wQDeF2sr5hQS532ikgkjc5rAdu4n2QvnsOCctcHAzab1khpHYKHFRvgTtk6sXfNUlUdoY1fyFVsZT5vIGK0Zoqd9wApg47d4BPRxvSog4ehB0oYQqtJ5BroNhXHVl1BABK1ZAEGJeQ_Qq5wwAWPeSr41Uq4M1qwf86TD7ltzqq6IenwC3wyMGxq8uwtQuR6UnZkj_9C3yRYN0Ty7sYKESFZJqw1E9A4No6pY0AfZkACOjhTPfjm0mGgOv-B2-D8zhgrJWsn",
        courseName: "当代艺术基础课程",
        timeRange: "14:00 - 15:00",
        minutesLeft: 5
      },
      todayClasses: [
        {
          id: "2",
          studentName: "Wang Fang (王芳)",
          studentAvatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuAA4j1oAYugUrY7vv-wZggpeOQsdQ6Ns9hRKTCJPL47_s3ZD3xdGDqqYtlHeK2NvJabuB1GFtD_zsfVozO1_TpP8GG-E0xYMtITbqqSlrtIVbWgbQOfCRuF8B4QO2QgVMDbXUc9kzf1m7XKRMLRBBe46YcOfe6vfKc6q_tn4RbUgUTAL6515S7jTGVW7rCc7O-3Fh19E03HArdRPrRyShhkvNTqwPDi-sN6BtTFREKlTDdyKFznwnxHpic2j0JKGvBUQY6S8mj3rlGQ",
          courseName: "作品集点评与指导",
          timeRange: "16:30 - 17:30"
        }
      ]
    };
  },
  onLoad() {
    this.currentLang = utils_i18n.i18n.getLanguage();
  },
  methods: {
    $t(key, params) {
      return utils_i18n.i18n.t(key, params);
    },
    toggleLanguage() {
      const newLang = this.currentLang === "zh" ? "en" : "zh";
      utils_i18n.i18n.setLanguage(newLang);
      this.currentLang = newLang;
      common_vendor.index.showToast({
        title: this.$t("common.success"),
        icon: "success"
      });
      setTimeout(() => {
        this.$forceUpdate();
      }, 100);
    },
    handleNotification() {
      common_vendor.index.navigateTo({
        url: "/pages/messages/messages"
      });
    },
    goToEarnings() {
      common_vendor.index.redirectTo({
        url: "/pages/earnings/earnings"
      });
    },
    goToSchedule() {
      common_vendor.index.redirectTo({
        url: "/pages/schedule/schedule"
      });
    },
    enterClassroom(classId) {
      common_vendor.index.navigateTo({
        url: `/pages/classroom/classroom?id=${classId}`
      });
    },
    viewClassDetail(classId) {
    }
  }
};
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  const _easycom_Header2 = common_vendor.resolveComponent("Header");
  const _easycom_BottomNav2 = common_vendor.resolveComponent("BottomNav");
  (_component_uni_icons + _easycom_Header2 + _easycom_BottomNav2)();
}
const _easycom_Header = () => "../../components/Header/Header.js";
const _easycom_BottomNav = () => "../../components/BottomNav/BottomNav.js";
if (!Math) {
  (_easycom_Header + _easycom_BottomNav)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_vendor.t($data.currentLang === "zh" ? "EN" : "中文"),
    b: common_vendor.o((...args) => $options.toggleLanguage && $options.toggleLanguage(...args)),
    c: common_vendor.p({
      type: "bell",
      size: "24",
      color: "#666"
    }),
    d: common_vendor.o((...args) => $options.handleNotification && $options.handleNotification(...args)),
    e: common_vendor.o($options.handleNotification),
    f: common_vendor.p({
      title: $options.$t("home.title"),
      showBadge: true
    }),
    g: $data.teacherInfo.avatar,
    h: common_vendor.p({
      type: "checkmarkempty",
      size: "14",
      color: "#fff"
    }),
    i: common_vendor.t($data.teacherInfo.name),
    j: common_vendor.t($options.$t("home.professionalMentor")),
    k: common_vendor.t($data.teacherInfo.school),
    l: common_vendor.t($options.$t("home.expectedIncome")),
    m: common_vendor.t($options.$t("home.viewBill")),
    n: common_vendor.p({
      type: "right",
      size: "14",
      color: "#FF6B35"
    }),
    o: common_vendor.o((...args) => $options.goToEarnings && $options.goToEarnings(...args)),
    p: common_vendor.p({
      type: "calendar",
      size: "18",
      color: "#FF6B35"
    }),
    q: common_vendor.t($options.$t("home.completedHours")),
    r: common_vendor.p({
      type: "calendar",
      size: "24",
      color: "#fff"
    }),
    s: common_vendor.t($options.$t("home.pendingConfirm")),
    t: common_vendor.t($options.$t("home.newAppointments")),
    v: common_vendor.o((...args) => $options.goToSchedule && $options.goToSchedule(...args)),
    w: common_vendor.p({
      type: "star",
      size: "24",
      color: "#fff"
    }),
    x: common_vendor.t($options.$t("home.pendingReply")),
    y: common_vendor.t($options.$t("home.newReviews")),
    z: common_vendor.t($options.$t("home.todaySchedule")),
    A: $data.currentClass
  }, $data.currentClass ? {
    B: common_vendor.t($options.$t("home.inProgress")),
    C: $data.currentClass.studentAvatar,
    D: common_vendor.t($data.currentClass.studentName),
    E: common_vendor.t($data.currentClass.courseName),
    F: common_vendor.t($data.currentClass.timeRange),
    G: common_vendor.t($options.$t("home.minutesLeft", {
      minutes: $data.currentClass.minutesLeft
    })),
    H: common_vendor.p({
      type: "videocam",
      size: "20",
      color: "#fff"
    }),
    I: common_vendor.t($options.$t("home.enterClassroom")),
    J: common_vendor.o(($event) => $options.enterClassroom($data.currentClass.id))
  } : {}, {
    K: common_vendor.f($data.todayClasses, (classItem, index, i0) => {
      return {
        a: classItem.studentAvatar,
        b: common_vendor.t(classItem.studentName),
        c: common_vendor.t(classItem.courseName),
        d: common_vendor.t(classItem.timeRange),
        e: index,
        f: common_vendor.o(($event) => $options.viewClassDetail(classItem.id), index)
      };
    }),
    L: common_vendor.t($options.$t("home.laterToday"))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-07e72d3c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/home/home.js.map
