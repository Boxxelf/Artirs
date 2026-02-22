"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  name: "Header",
  props: {
    title: {
      type: String,
      default: "Artris"
    },
    showBack: {
      type: Boolean,
      default: false
    },
    rightIcon: {
      type: String,
      default: "bell"
    },
    showBadge: {
      type: Boolean,
      default: false
    }
  },
  methods: {
    goBack() {
      common_vendor.index.navigateBack();
    },
    handleRightClick() {
      this.$emit("rightClick");
    }
  }
};
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: $props.showBack
  }, $props.showBack ? {
    b: common_vendor.p({
      type: "left",
      size: "24",
      color: "#666"
    }),
    c: common_vendor.o((...args) => $options.goBack && $options.goBack(...args))
  } : {
    d: common_assets._imports_0
  }, {
    e: common_vendor.t($props.title),
    f: common_vendor.p({
      type: $props.rightIcon,
      size: "24",
      color: "#666"
    }),
    g: $props.rightIcon === "bell" && $props.showBadge
  }, $props.rightIcon === "bell" && $props.showBadge ? {} : {}, {
    h: common_vendor.o((...args) => $options.handleRightClick && $options.handleRightClick(...args))
  });
}
const Component = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-5ada1ca4"]]);
wx.createComponent(Component);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/components/Header/Header.js.map
