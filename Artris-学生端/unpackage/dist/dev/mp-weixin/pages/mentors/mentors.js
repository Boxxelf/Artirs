"use strict";
const common_vendor = require("../../common/vendor.js");
const BottomNav = () => "../../components/BottomNav/BottomNav.js";
const _sfc_main = {
  components: {
    BottomNav
  },
  data() {
    return {
      mentors: [],
      loading: false,
      page: 1,
      pageSize: 10,
      hasMore: true
    };
  },
  onLoad() {
    this.loadMentors();
  },
  onReachBottom() {
    if (this.hasMore && !this.loading) {
      this.loadMore();
    }
  },
  methods: {
    async loadMentors() {
      this.loading = true;
      try {
        const res = await common_vendor.tr.callFunction({
          name: "mentors",
          data: {
            action: "getList",
            data: {
              page: this.page,
              pageSize: this.pageSize
            }
          }
        });
        if (res.result.code === 0) {
          if (this.page === 1) {
            this.mentors = res.result.data || [];
          } else {
            this.mentors = [...this.mentors, ...res.result.data || []];
          }
          this.hasMore = res.result.data.length === this.pageSize;
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/mentors/mentors.vue:121", "加载导师失败:", error);
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    },
    loadMore() {
      this.page++;
      this.loadMentors();
    },
    goToMentorDetail(mentorId) {
      common_vendor.index.navigateTo({
        url: `/pages/mentor-detail/mentor-detail?id=${mentorId}`
      });
    },
    goToSearch() {
      common_vendor.index.navigateTo({
        url: "/pages/search/search"
      });
    },
    showPriceFilter() {
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
    a: common_vendor.p({
      type: "home",
      size: "24",
      color: "#00B4D8"
    }),
    b: common_vendor.t(_ctx.$t("mentor.title")),
    c: common_vendor.p({
      type: "search",
      size: "24",
      color: "#666"
    }),
    d: common_vendor.o((...args) => $options.goToSearch && $options.goToSearch(...args)),
    e: common_vendor.t(_ctx.$t("common.filter") || "按价格"),
    f: common_vendor.p({
      type: "down",
      size: "14",
      color: "#666"
    }),
    g: common_vendor.o((...args) => $options.showPriceFilter && $options.showPriceFilter(...args)),
    h: common_vendor.f($data.mentors, (mentor, k0, i0) => {
      return common_vendor.e({
        a: mentor.avatar,
        b: common_vendor.t(mentor.name),
        c: mentor.available
      }, mentor.available ? {
        d: common_vendor.t(_ctx.$t("mentor.availableThisWeek"))
      } : {}, {
        e: common_vendor.t(mentor.school),
        f: common_vendor.t(mentor.degree),
        g: "980f856e-3-" + i0,
        h: common_vendor.t(mentor.rating),
        i: common_vendor.t(mentor.price),
        j: mentor._id,
        k: common_vendor.o(($event) => $options.goToMentorDetail(mentor._id), mentor._id)
      });
    }),
    i: common_vendor.p({
      type: "star-filled",
      size: "18",
      color: "#FFA500"
    }),
    j: common_vendor.t(_ctx.$t("mentor.pricePerHour")),
    k: $data.loading
  }, $data.loading ? {
    l: common_vendor.t(_ctx.$t("common.loading"))
  } : {}, {
    m: !$data.loading && $data.mentors.length === 0
  }, !$data.loading && $data.mentors.length === 0 ? {
    n: common_vendor.t(_ctx.$t("common.noData"))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-980f856e"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/mentors/mentors.js.map
