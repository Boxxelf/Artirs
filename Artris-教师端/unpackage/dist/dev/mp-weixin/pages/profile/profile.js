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
      teacherInfo: {
        name: "张老师",
        avatar: "https://lh3.googleusercontent.com/aida-public/AB6AXuBJeKs3Yaii9HmmO39mMjZiTI-LbMXxJ9WnS6KPq6TN4iwzJmfNRAGgjPozkECSVX1eAzT2bnhhjvU2Hbz7rkZ2jJ1gUu9wJO1NZ6whUYUziPgRYPknRquis7TLDPucknjwmHluSgVevmqm_Mtez5_Cna6ZIYEWq7WdZnevgO3I8LyDip5CGdfOJIGxs1B4eOqcIxeu3R4wT4RWURMspKvhNXpupf2FlL-6jJcH8yFan38D-L56OOyd7cixmuHnOpnoRXqLvVqiUz6L",
        school: "RISD",
        degree: "MFA"
      }
    };
  },
  methods: {
    $t(key, params) {
      return utils_i18n.i18n.t(key, params);
    },
    handleSettings() {
    },
    editProfile() {
    },
    serviceSettings() {
    },
    accountPayment() {
    },
    handleLogout() {
      common_vendor.index.showModal({
        title: this.$t("common.confirm"),
        content: "确定要退出登录吗？",
        success: (res) => {
          if (res.confirm) {
            common_vendor.index.removeStorageSync("userInfo");
            common_vendor.index.removeStorageSync("uniIdToken");
            common_vendor.index.reLaunch({
              url: "/pages/home/home"
            });
          }
        }
      });
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
      title: $options.$t("profile.title"),
      rightIcon: "settings"
    }),
    c: $data.teacherInfo.avatar,
    d: common_vendor.p({
      type: "checkmarkempty",
      size: "16",
      color: "#fff"
    }),
    e: common_vendor.t($data.teacherInfo.name),
    f: common_vendor.t($data.teacherInfo.school),
    g: common_vendor.t($data.teacherInfo.degree),
    h: common_vendor.t($options.$t("profile.verifiedMentor")),
    i: common_vendor.t($options.$t("profile.accepting")),
    j: common_vendor.t($options.$t("profile.totalSessions")),
    k: common_vendor.t($options.$t("profile.studentRating")),
    l: common_vendor.t($options.$t("profile.monthlyEarnings")),
    m: common_vendor.t($options.$t("profile.professionalIdentity")),
    n: common_vendor.p({
      type: "compose",
      size: "24",
      color: "#fff"
    }),
    o: common_vendor.t($options.$t("profile.mentorProfile")),
    p: common_vendor.t($options.$t("profile.updateProfile")),
    q: common_vendor.p({
      type: "right",
      size: "20",
      color: "#ccc"
    }),
    r: common_vendor.o((...args) => $options.editProfile && $options.editProfile(...args)),
    s: common_vendor.t($options.$t("profile.academicManagement")),
    t: common_vendor.p({
      type: "settings",
      size: "24",
      color: "#fff"
    }),
    v: common_vendor.t($options.$t("profile.serviceSettings")),
    w: common_vendor.t($options.$t("profile.defineServices")),
    x: common_vendor.p({
      type: "right",
      size: "20",
      color: "#ccc"
    }),
    y: common_vendor.o((...args) => $options.serviceSettings && $options.serviceSettings(...args)),
    z: common_vendor.p({
      type: "wallet",
      size: "24",
      color: "#fff"
    }),
    A: common_vendor.t($options.$t("profile.accountPayment")),
    B: common_vendor.t($options.$t("profile.managePayment")),
    C: common_vendor.p({
      type: "right",
      size: "20",
      color: "#ccc"
    }),
    D: common_vendor.o((...args) => $options.accountPayment && $options.accountPayment(...args)),
    E: common_vendor.p({
      type: "closeempty",
      size: "20",
      color: "#ff4757"
    }),
    F: common_vendor.t($options.$t("profile.logout")),
    G: common_vendor.o((...args) => $options.handleLogout && $options.handleLogout(...args)),
    H: common_vendor.t($options.$t("profile.version"))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-dd383ca2"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/profile.js.map
