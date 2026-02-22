"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const utils_i18n = require("./utils/i18n.js");
if (!Math) {
  "./pages/home/home.js";
  "./pages/mentors/mentors.js";
  "./pages/mentor-detail/mentor-detail.js";
  "./pages/booking/booking.js";
  "./pages/order-confirm/order-confirm.js";
  "./pages/success/success.js";
  "./pages/appointments/appointments.js";
  "./pages/messages/messages.js";
  "./pages/chat/chat.js";
  "./pages/profile/profile.js";
  "./pages/folder/folder.js";
  "./pages/settings/settings.js";
  "./pages/search/search.js";
  "./pages/login/login.js";
  "./pages/register/register.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:6", "App Launch");
    const lang = utils_i18n.i18n.getLanguage();
    common_vendor.index.__f__("log", "at App.vue:9", "Current language:", lang);
    this.checkLoginStatus();
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:15", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:18", "App Hide");
  },
  methods: {
    async checkLoginStatus() {
      var _a, _b;
      try {
        const uniIdToken = common_vendor.index.getStorageSync("uni_id_token");
        if (!uniIdToken) {
          const userInfo = common_vendor.index.getStorageSync("userInfo");
          if (!userInfo || !userInfo._id) {
            common_vendor.index.removeStorageSync("userInfo");
            common_vendor.index.removeStorageSync("uni_id_token");
            return;
          }
        }
        try {
          const uniIdCo = common_vendor.tr.importObject("uni-id-co", {
            customUI: true
          });
          const userInfo = await uniIdCo.checkToken();
          if (userInfo.errCode === 0 && userInfo.userInfo) {
            const user = userInfo.userInfo;
            common_vendor.index.setStorageSync("userInfo", {
              _id: user._id,
              username: user.username || "",
              email: user.email || "",
              avatar: ((_a = user.avatar_file) == null ? void 0 : _a.url) || "",
              school: ((_b = user.extend) == null ? void 0 : _b.school) || user.school || "Rhode Island School of Design"
            });
          } else {
            common_vendor.index.removeStorageSync("userInfo");
            common_vendor.index.removeStorageSync("uni_id_token");
          }
        } catch (error) {
          common_vendor.index.__f__("error", "at App.vue:59", "检查登录状态失败:", error);
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at App.vue:63", "检查登录状态出错:", error);
      }
    }
  },
  globalData: {
    i18n: utils_i18n.i18n
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  app.config.globalProperties.$t = utils_i18n.i18n.t;
  app.config.globalProperties.$i18n = utils_i18n.i18n;
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
