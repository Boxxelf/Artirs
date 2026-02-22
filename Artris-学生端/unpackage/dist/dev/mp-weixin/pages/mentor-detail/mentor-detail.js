"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      mentorId: "",
      mentor: {}
    };
  },
  onLoad(options) {
    if (options.id) {
      this.mentorId = options.id;
      this.loadMentorDetail();
    }
  },
  methods: {
    async loadMentorDetail() {
      try {
        const res = await common_vendor.tr.callFunction({
          name: "mentors",
          data: {
            action: "getDetail",
            data: {
              mentorId: this.mentorId
            }
          }
        });
        if (res.result.code === 0) {
          this.mentor = res.result.data;
        } else {
          common_vendor.index.showToast({
            title: res.result.message || "加载失败",
            icon: "none"
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/mentor-detail/mentor-detail.vue:85", "加载导师详情失败:", error);
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
        });
      }
    },
    goBack() {
      common_vendor.index.navigateBack();
    },
    goToChat() {
      common_vendor.index.navigateTo({
        url: `/pages/chat/chat?mentorId=${this.mentorId}`
      });
    },
    goToBooking() {
      common_vendor.index.navigateTo({
        url: `/pages/booking/booking?mentorId=${this.mentorId}`
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
    c: common_vendor.t(_ctx.$t("mentor.detail")),
    d: common_vendor.p({
      type: "list",
      size: "24",
      color: "#333"
    }),
    e: $data.mentor.avatar,
    f: common_vendor.t($data.mentor.name),
    g: common_vendor.t($data.mentor.school),
    h: common_vendor.t($data.mentor.degree),
    i: common_vendor.t(_ctx.$t("mentor.follow")),
    j: common_vendor.t(_ctx.$t("mentor.message")),
    k: common_vendor.o((...args) => $options.goToChat && $options.goToChat(...args)),
    l: common_vendor.t(_ctx.$t("mentor.intro")),
    m: common_vendor.t($data.mentor.intro || "暂无简介"),
    n: common_vendor.t(_ctx.$t("mentor.startingFrom")),
    o: common_vendor.t($data.mentor.price),
    p: common_vendor.t(_ctx.$t("mentor.pricePerSession")),
    q: common_vendor.t(_ctx.$t("mentor.bookNow")),
    r: common_vendor.p({
      type: "calendar",
      size: "18",
      color: "#ffffff"
    }),
    s: common_vendor.o((...args) => $options.goToBooking && $options.goToBooking(...args))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-13b0faeb"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mentor-detail/mentor-detail.js.map
