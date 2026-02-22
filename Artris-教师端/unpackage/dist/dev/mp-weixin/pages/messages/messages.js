"use strict";
const utils_i18n = require("../../utils/i18n.js");
const common_vendor = require("../../common/vendor.js");
const Header = () => "../../components/Header/Header.js";
const BottomNav = () => "../../components/BottomNav/BottomNav.js";
const _sfc_main = {
  components: {
    Header,
    BottomNav
  },
  methods: {
    $t(key, params) {
      return utils_i18n.i18n.t(key, params);
    }
  }
};
if (!Array) {
  const _easycom_Header2 = common_vendor.resolveComponent("Header");
  const _easycom_BottomNav2 = common_vendor.resolveComponent("BottomNav");
  (_easycom_Header2 + _easycom_BottomNav2)();
}
const _easycom_Header = () => "../../components/Header/Header.js";
const _easycom_BottomNav = () => "../../components/BottomNav/BottomNav.js";
if (!Math) {
  (_easycom_Header + _easycom_BottomNav)();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return {
    a: common_vendor.p({
      title: $options.$t("messages.title")
    }),
    b: common_vendor.t($options.$t("messages.developing"))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ecc172b4"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/messages/messages.js.map
