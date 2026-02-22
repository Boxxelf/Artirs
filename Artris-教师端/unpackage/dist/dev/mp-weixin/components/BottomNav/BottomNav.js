"use strict";
const common_vendor = require("../../common/vendor.js");
const utils_i18n = require("../../utils/i18n.js");
const _sfc_main = {
  name: "BottomNav",
  data() {
    return {
      currentPath: "",
      navList: [
        {
          path: "/pages/home/home",
          icon: "home",
          textKey: "nav.home"
        },
        {
          path: "/pages/schedule/schedule",
          icon: "calendar",
          textKey: "nav.schedule"
        },
        {
          path: "/pages/earnings/earnings",
          icon: "wallet",
          textKey: "nav.earnings"
        },
        {
          path: "/pages/messages/messages",
          icon: "chat",
          textKey: "nav.messages"
        },
        {
          path: "/pages/profile/profile",
          icon: "contact",
          textKey: "nav.profile"
        }
      ]
    };
  },
  methods: {
    $t(key) {
      return utils_i18n.i18n.t(key);
    },
    updateCurrentPath() {
      const pages = getCurrentPages();
      if (pages.length > 0) {
        this.currentPath = "/" + pages[pages.length - 1].route;
      }
    },
    switchTab(path) {
      if (this.currentPath !== path) {
        common_vendor.index.redirectTo({
          url: path
        });
      }
    }
  },
  onLoad() {
    this.updateCurrentPath();
  },
  onShow() {
    this.updateCurrentPath();
  }
};
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.navList, (item, index, i0) => {
      return {
        a: "a73deb8d-0-" + i0,
        b: common_vendor.p({
          type: item.icon,
          size: 24,
          color: $data.currentPath === item.path ? "#FF6B35" : "#8a8a8a"
        }),
        c: common_vendor.t($options.$t(item.textKey)),
        d: $data.currentPath === item.path ? 1 : "",
        e: index,
        f: $data.currentPath === item.path ? 1 : "",
        g: common_vendor.o(($event) => $options.switchTab(item.path), index)
      };
    })
  };
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-a73deb8d"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/BottomNav/BottomNav.js.map
