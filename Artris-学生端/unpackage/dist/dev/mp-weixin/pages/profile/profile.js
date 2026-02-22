"use strict";
const common_vendor = require("../../common/vendor.js");
const BottomNav = () => "../../components/BottomNav/BottomNav.js";
const _sfc_main = {
  components: {
    BottomNav
  },
  data() {
    return {
      userInfo: {},
      isLoggedIn: false
    };
  },
  onLoad() {
    this.checkLoginStatus();
  },
  onShow() {
    this.checkLoginStatus();
  },
  methods: {
    checkLoginStatus() {
      const userInfo = common_vendor.index.getStorageSync("userInfo");
      const uniIdToken = common_vendor.index.getStorageSync("uni_id_token");
      if (userInfo && userInfo._id && uniIdToken) {
        this.isLoggedIn = true;
        this.userInfo = userInfo;
      } else {
        this.isLoggedIn = false;
        this.userInfo = {};
      }
    },
    loadUserInfo() {
      const userInfo = common_vendor.index.getStorageSync("userInfo") || {};
      this.userInfo = userInfo;
    },
    goToLogin() {
      common_vendor.index.navigateTo({
        url: "/pages/login/login"
      });
    },
    goToSettings() {
      common_vendor.index.navigateTo({
        url: "/pages/settings/settings"
      });
    },
    goToFolder() {
      common_vendor.index.navigateTo({
        url: "/pages/folder/folder"
      });
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
    a: common_vendor.o($options.goToSettings),
    b: common_vendor.p({
      type: "settings",
      size: "24",
      color: "#333"
    }),
    c: $data.isLoggedIn
  }, $data.isLoggedIn ? common_vendor.e({
    d: $data.userInfo.avatar
  }, $data.userInfo.avatar ? {
    e: $data.userInfo.avatar
  } : {
    f: common_vendor.p({
      type: "contact-filled",
      size: "80",
      color: "#00B4D8"
    })
  }, {
    g: common_vendor.t($data.userInfo.username || "用户"),
    h: common_vendor.t($data.userInfo.school || "Rhode Island School of Design")
  }) : {
    i: common_vendor.p({
      type: "contact-filled",
      size: "80",
      color: "#00B4D8"
    }),
    j: common_vendor.o((...args) => $options.goToLogin && $options.goToLogin(...args))
  }, {
    k: $data.isLoggedIn
  }, $data.isLoggedIn ? {
    l: common_vendor.t(_ctx.$t("profile.totalHours")),
    m: common_vendor.t(_ctx.$t("profile.favoriteMentors")),
    n: common_vendor.t(_ctx.$t("profile.completedReviews"))
  } : {}, {
    o: $data.isLoggedIn
  }, $data.isLoggedIn ? {
    p: common_vendor.p({
      type: "folder",
      size: "24",
      color: "#00B4D8"
    }),
    q: common_vendor.t(_ctx.$t("profile.applicationFolder")),
    r: common_vendor.p({
      type: "right",
      size: "18",
      color: "#ccc"
    }),
    s: common_vendor.o((...args) => $options.goToFolder && $options.goToFolder(...args)),
    t: common_vendor.p({
      type: "heart",
      size: "24",
      color: "#00B4D8"
    }),
    v: common_vendor.t(_ctx.$t("profile.myFavorites")),
    w: common_vendor.p({
      type: "right",
      size: "18",
      color: "#ccc"
    })
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-dd383ca2"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/profile/profile.js.map
