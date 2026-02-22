"use strict";
Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
const common_vendor = require("./common/vendor.js");
const utils_i18n = require("./utils/i18n.js");
if (!Math) {
  "./pages/home/home.js";
  "./pages/schedule/schedule.js";
  "./pages/earnings/earnings.js";
  "./pages/messages/messages.js";
  "./pages/profile/profile.js";
  "./pages/appointment-detail/appointment-detail.js";
}
const _sfc_main = {
  onLaunch: function() {
    common_vendor.index.__f__("log", "at App.vue:6", "App Launch");
    const lang = utils_i18n.i18n.getLanguage();
    common_vendor.index.__f__("log", "at App.vue:9", "Current language:", lang);
  },
  onShow: function() {
    common_vendor.index.__f__("log", "at App.vue:12", "App Show");
  },
  onHide: function() {
    common_vendor.index.__f__("log", "at App.vue:15", "App Hide");
  },
  globalData: {
    i18n: utils_i18n.i18n
  }
};
function createApp() {
  const app = common_vendor.createSSRApp(_sfc_main);
  return {
    app
  };
}
createApp().app.mount("#app");
exports.createApp = createApp;
//# sourceMappingURL=../.sourcemap/mp-weixin/app.js.map
