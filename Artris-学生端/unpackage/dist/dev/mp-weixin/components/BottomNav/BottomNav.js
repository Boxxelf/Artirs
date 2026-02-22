"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  name: "BottomNav",
  data() {
    return {
      currentPath: "",
      navList: [
        {
          path: "/pages/home/home",
          icon: "●",
          textKey: "nav.home"
        },
        {
          path: "/pages/mentors/mentors",
          icon: "○",
          textKey: "nav.mentors"
        },
        {
          path: "/pages/appointments/appointments",
          icon: "◐",
          textKey: "nav.appointments"
        },
        {
          path: "/pages/messages/messages",
          icon: "◑",
          textKey: "nav.messages"
        },
        {
          path: "/pages/profile/profile",
          icon: "◉",
          textKey: "nav.profile"
        }
      ]
    };
  },
  onLoad() {
    this.updateCurrentPath();
  },
  onShow() {
    this.updateCurrentPath();
  },
  methods: {
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
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.f($data.navList, (item, index, i0) => {
      return {
        a: common_vendor.t(item.icon),
        b: $data.currentPath === item.path ? 1 : "",
        c: common_vendor.t(_ctx.$t(item.textKey)),
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
