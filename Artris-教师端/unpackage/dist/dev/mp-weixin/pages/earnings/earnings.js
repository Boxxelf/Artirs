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
  data() {
    return {
      chartData: [
        { month: "1月", height: "65%", value: "¥5.2k" },
        { month: "2月", height: "85%", value: "¥7.1k" },
        { month: "3月", height: "60%", value: "¥4.8k" },
        { month: "4月", height: "75%", value: "¥6.2k" },
        { month: "5月", height: "100%", value: "¥8.5k" },
        { month: "6月", height: "45%", value: "¥3.9k" }
      ],
      incomeDetails: [
        { name: "李明华", time: "2024-06-12 14:30", amount: "¥500.00", course: "写生基础课" },
        { name: "王小丫", time: "2024-06-11 09:00", amount: "¥320.00", course: "色彩理论进阶" },
        { name: "陈志强", time: "2024-06-10 18:15", amount: "¥800.00", course: "1对1私教课" }
      ]
    };
  },
  methods: {
    $t(key, params) {
      return utils_i18n.i18n.t(key, params);
    },
    toggleVisibility() {
    },
    handleWithdraw() {
    },
    handleSettings() {
    },
    viewAllDetails() {
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
    a: common_vendor.o($options.toggleVisibility),
    b: common_vendor.p({
      title: $options.$t("earnings.title"),
      showBack: true,
      rightIcon: "eye"
    }),
    c: common_vendor.t($options.$t("earnings.totalBalance")),
    d: common_vendor.p({
      type: "wallet",
      size: "24",
      color: "rgba(255,255,255,0.5)"
    }),
    e: common_vendor.t($options.$t("earnings.withdraw")),
    f: common_vendor.o((...args) => $options.handleWithdraw && $options.handleWithdraw(...args)),
    g: common_vendor.p({
      type: "settings",
      size: "20",
      color: "#fff"
    }),
    h: common_vendor.o((...args) => $options.handleSettings && $options.handleSettings(...args)),
    i: common_vendor.t($options.$t("earnings.incomeOverview")),
    j: common_vendor.t($options.$t("earnings.growth")),
    k: common_vendor.f($data.chartData, (item, index, i0) => {
      return {
        a: common_vendor.t(item.value),
        b: item.height,
        c: common_vendor.t(item.month),
        d: index
      };
    }),
    l: common_vendor.t($options.$t("earnings.incomeDetails")),
    m: common_vendor.t($options.$t("earnings.viewAll")),
    n: common_vendor.o((...args) => $options.viewAllDetails && $options.viewAllDetails(...args)),
    o: common_vendor.f($data.incomeDetails, (item, index, i0) => {
      return {
        a: "e8bd3cb6-3-" + i0,
        b: common_vendor.t(item.name),
        c: common_vendor.t(item.time),
        d: common_vendor.t(item.amount),
        e: common_vendor.t(item.course),
        f: index
      };
    }),
    p: common_vendor.p({
      type: "person",
      size: "20",
      color: "#fff"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e8bd3cb6"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/earnings/earnings.js.map
