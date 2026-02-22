"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const BottomNav = () => "../../components/BottomNav/BottomNav.js";
const _sfc_main = {
  components: {
    BottomNav
  },
  data() {
    return {
      selectedCategory: "all",
      categories: [
        { value: "all", label: "home.categories.all" },
        { value: "illustration", label: "home.categories.illustration" },
        { value: "product", label: "home.categories.product" },
        { value: "architecture", label: "home.categories.architecture" }
      ],
      featuredMentors: [],
      successCases: [],
      loading: false
    };
  },
  onLoad() {
    this.loadData();
  },
  onShow() {
    this.loadData();
  },
  methods: {
    async loadData() {
      this.loading = true;
      try {
        const mentorsRes = await common_vendor.tr.callFunction({
          name: "mentors",
          data: {
            action: "getFeatured"
          }
        });
        if (mentorsRes.result.code === 0) {
          this.featuredMentors = mentorsRes.result.data || [];
        }
        try {
          const casesRes = await common_vendor.tr.callFunction({
            name: "success_cases",
            data: {
              action: "getList",
              data: {
                limit: 4
              }
            }
          });
          common_vendor.index.__f__("log", "at pages/home/home.vue:168", "成功案例查询结果:", casesRes);
          if (casesRes && casesRes.result) {
            if (casesRes.result.code === 0 && Array.isArray(casesRes.result.data)) {
              this.successCases = casesRes.result.data;
              common_vendor.index.__f__("log", "at pages/home/home.vue:173", "成功案例数据:", this.successCases);
            } else {
              common_vendor.index.__f__("log", "at pages/home/home.vue:175", "成功案例查询返回异常:", casesRes.result);
              this.successCases = [];
            }
          } else {
            common_vendor.index.__f__("log", "at pages/home/home.vue:179", "成功案例查询结果格式异常:", casesRes);
            this.successCases = [];
          }
        } catch (caseError) {
          common_vendor.index.__f__("warn", "at pages/home/home.vue:183", "云函数调用失败，尝试直接查询数据库:", caseError.message);
          try {
            const db = common_vendor.tr.database();
            const directRes = await db.collection("success_cases").orderBy("create_date", "desc").limit(4).get();
            if (directRes && directRes.data && directRes.data.length > 0) {
              this.successCases = directRes.data;
              common_vendor.index.__f__("log", "at pages/home/home.vue:195", "直接查询成功，获取到数据:", this.successCases.length, "条");
            } else {
              this.successCases = [];
            }
          } catch (directError) {
            common_vendor.index.__f__("error", "at pages/home/home.vue:200", "直接查询也失败:", directError);
            this.successCases = [];
          }
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/home/home.vue:205", "加载数据失败:", error);
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    },
    selectCategory(value) {
      this.selectedCategory = value;
    },
    goToSearch() {
      common_vendor.index.navigateTo({
        url: "/pages/search/search"
      });
    },
    goToMentors() {
      common_vendor.index.redirectTo({
        url: "/pages/mentors/mentors"
      });
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
    handleExplore() {
      this.goToMentors();
    },
    handleNotification() {
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
  return {
    a: common_assets._imports_0,
    b: common_vendor.o($options.handleNotification),
    c: common_vendor.p({
      type: "bell",
      size: "24",
      color: "#333"
    }),
    d: common_vendor.p({
      type: "search",
      size: "18",
      color: "#999"
    }),
    e: common_vendor.t(_ctx.$t("home.searchPlaceholder")),
    f: common_vendor.o((...args) => $options.goToSearch && $options.goToSearch(...args)),
    g: common_vendor.t(_ctx.$t("home.heroTitle")),
    h: common_vendor.t(_ctx.$t("home.heroSubtitle")),
    i: common_vendor.t(_ctx.$t("home.exploreNow")),
    j: common_vendor.o((...args) => $options.handleExplore && $options.handleExplore(...args)),
    k: common_vendor.f($data.categories, (cat, index, i0) => {
      return {
        a: common_vendor.t(_ctx.$t(cat.label)),
        b: index,
        c: $data.selectedCategory === cat.value ? 1 : "",
        d: common_vendor.o(($event) => $options.selectCategory(cat.value), index)
      };
    }),
    l: common_vendor.t(_ctx.$t("home.featuredMentors")),
    m: common_vendor.t(_ctx.$t("home.allMentors")),
    n: common_vendor.p({
      type: "right",
      size: "14",
      color: "#00B4D8"
    }),
    o: common_vendor.o((...args) => $options.goToMentors && $options.goToMentors(...args)),
    p: common_vendor.f($data.featuredMentors, (mentor, k0, i0) => {
      var _a;
      return {
        a: mentor.avatar,
        b: common_vendor.t(mentor.name),
        c: common_vendor.t(mentor.school),
        d: common_vendor.t(mentor.degree),
        e: common_vendor.t(((_a = mentor.specialties) == null ? void 0 : _a.join(" | ")) || ""),
        f: common_vendor.t(mentor.experience),
        g: "07e72d3c-3-" + i0,
        h: common_vendor.t(mentor.rating),
        i: common_vendor.t(mentor.price),
        j: common_vendor.o(($event) => $options.goToBooking(mentor._id), mentor._id),
        k: mentor._id,
        l: common_vendor.o(($event) => $options.goToMentorDetail(mentor._id), mentor._id)
      };
    }),
    q: common_vendor.t(_ctx.$t("mentor.yearsExperience")),
    r: common_vendor.p({
      type: "star-filled",
      size: "14",
      color: "#FFA500"
    }),
    s: common_vendor.t(_ctx.$t("mentor.pricePerSession")),
    t: common_vendor.t(_ctx.$t("mentor.bookNow")),
    v: common_vendor.t(_ctx.$t("home.successCases")),
    w: common_vendor.t(_ctx.$t("home.moreAdmissions")),
    x: common_vendor.p({
      type: "right",
      size: "14",
      color: "#00B4D8"
    }),
    y: common_vendor.f($data.successCases, (caseItem, index, i0) => {
      return {
        a: caseItem.image,
        b: common_vendor.t(caseItem.school),
        c: common_vendor.t(caseItem.degree),
        d: common_vendor.t(caseItem.student_name),
        e: index
      };
    }),
    z: common_vendor.t(_ctx.$t("home.moreAdmissions"))
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-07e72d3c"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/home/home.js.map
