"use strict";
const common_vendor = require("../../common/vendor.js");
const BottomNav = () => "../../components/BottomNav/BottomNav.js";
const _sfc_main = {
  components: {
    BottomNav
  },
  data() {
    return {
      keyword: "",
      mentors: [],
      loading: false
    };
  },
  onLoad(options) {
    if (options.keyword) {
      this.keyword = decodeURIComponent(options.keyword);
      this.doSearch();
    }
  },
  methods: {
    onInput(e) {
      this.keyword = e.detail.value;
    },
    async doSearch() {
      if (!this.keyword.trim())
        return;
      this.loading = true;
      try {
        const res = await common_vendor.tr.callFunction({
          name: "mentors",
          data: {
            action: "getList",
            data: {
              keyword: this.keyword,
              page: 1,
              pageSize: 20
            }
          }
        });
        if (res.result.code === 0) {
          this.mentors = res.result.data || [];
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/search/search.vue:101", "搜索失败:", error);
        common_vendor.index.showToast({
          title: "搜索失败",
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    },
    goToMentorDetail(mentorId) {
      common_vendor.index.navigateTo({
        url: `/pages/mentor-detail/mentor-detail?id=${mentorId}`
      });
    },
    goToBooking(mentorId) {
      common_vendor.index.navigateTo({
        url: `/pages/booking/booking?mentorId=${mentorId}`
      });
    },
    goBack() {
      common_vendor.index.navigateBack();
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
    a: common_vendor.o($options.goBack),
    b: common_vendor.p({
      type: "left",
      size: "24",
      color: "#333"
    }),
    c: _ctx.$t("home.searchPlaceholder"),
    d: common_vendor.o((...args) => $options.doSearch && $options.doSearch(...args)),
    e: common_vendor.o([($event) => $data.keyword = $event.detail.value, (...args) => $options.onInput && $options.onInput(...args)]),
    f: $data.keyword,
    g: common_vendor.t(_ctx.$t("common.search")),
    h: common_vendor.o((...args) => $options.doSearch && $options.doSearch(...args)),
    i: common_vendor.t(_ctx.$t("search.found", {
      count: $data.mentors.length
    })),
    j: common_vendor.f($data.mentors, (mentor, k0, i0) => {
      return {
        a: mentor.avatar,
        b: common_vendor.t(mentor.name),
        c: common_vendor.t(mentor.school),
        d: common_vendor.t(mentor.degree),
        e: common_vendor.t(mentor.price),
        f: common_vendor.o(($event) => $options.goToBooking(mentor._id), mentor._id),
        g: mentor._id,
        h: common_vendor.o(($event) => $options.goToMentorDetail(mentor._id), mentor._id)
      };
    }),
    k: common_vendor.t(_ctx.$t("mentor.pricePerSession")),
    l: common_vendor.t(_ctx.$t("mentor.bookNow")),
    m: $data.loading
  }, $data.loading ? {
    n: common_vendor.t(_ctx.$t("common.loading"))
  } : {}, {
    o: !$data.loading && $data.mentors.length === 0 && $data.keyword
  }, !$data.loading && $data.mentors.length === 0 && $data.keyword ? {
    p: common_vendor.t(_ctx.$t("search.noResults"))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-c10c040c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/search/search.js.map
