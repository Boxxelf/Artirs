"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_i18n = require("../../utils/i18n.js");
const _sfc_main = {
  data() {
    return {
      currentLanguage: "zh",
      notificationsEnabled: true
    };
  },
  onLoad() {
    this.currentLanguage = utils_i18n.i18n.getLanguage();
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    },
    showLanguagePicker() {
      common_vendor.index.showActionSheet({
        itemList: [this.$t("settings.chinese"), this.$t("settings.english")],
        success: (res) => {
          const lang = res.tapIndex === 0 ? "zh" : "en";
          utils_i18n.i18n.setLanguage(lang);
          this.currentLanguage = lang;
          common_vendor.index.showToast({
            title: "语言已切换",
            icon: "success"
          });
          setTimeout(() => {
            common_vendor.index.reLaunch({
              url: "/pages/home/home"
            });
          }, 1e3);
        }
      });
    },
    toggleNotifications(e) {
      this.notificationsEnabled = e.detail.value;
    },
    async handleLogout() {
      common_vendor.index.showModal({
        title: "提示",
        content: "确定要退出登录吗？",
        success: async (res) => {
          if (res.confirm) {
            try {
              const uniIdCo = common_vendor.tr.importObject("uni-id-co", {
                customUI: true
              });
              await uniIdCo.logout();
            } catch (error) {
              common_vendor.index.__f__("error", "at pages/settings/settings.vue:93", "退出登录失败:", error);
            }
            common_vendor.index.removeStorageSync("userInfo");
            common_vendor.index.removeStorageSync("uni_id_token");
            common_vendor.index.removeStorageSync("uni_id_token_expired");
            common_vendor.index.showToast({
              title: "已退出登录",
              icon: "success"
            });
            setTimeout(() => {
              common_vendor.index.reLaunch({
                url: "/pages/home/home"
              });
            }, 1e3);
          }
        }
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
    c: common_vendor.t(_ctx.$t("settings.title")),
    d: common_vendor.t(_ctx.$t("settings.language")),
    e: common_vendor.t($data.currentLanguage === "zh" ? _ctx.$t("settings.chinese") : _ctx.$t("settings.english")),
    f: common_vendor.p({
      type: "right",
      size: "18",
      color: "#ccc"
    }),
    g: common_vendor.o((...args) => $options.showLanguagePicker && $options.showLanguagePicker(...args)),
    h: common_vendor.t(_ctx.$t("settings.notifications")),
    i: $data.notificationsEnabled,
    j: common_vendor.o((...args) => $options.toggleNotifications && $options.toggleNotifications(...args)),
    k: common_vendor.t(_ctx.$t("settings.logout")),
    l: common_vendor.o((...args) => $options.handleLogout && $options.handleLogout(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-7fad0a1c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/settings/settings.js.map
