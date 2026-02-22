"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      applications: [],
      materials: [
        { name: "作品集", progress: 80 }
      ]
    };
  },
  onLoad() {
    this.loadApplications();
  },
  methods: {
    async loadApplications() {
      try {
        const userInfo = common_vendor.index.getStorageSync("userInfo") || {};
        const res = await common_vendor.tr.database().collection("applications").where({
          student_id: userInfo._id || "test_student"
        }).get();
        if (res.data) {
          this.applications = res.data || [];
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/folder/folder.vue:72", "加载申请资料失败:", error);
      }
    },
    getDaysLeft(deadline) {
      if (!deadline)
        return 0;
      const now = /* @__PURE__ */ new Date();
      const deadlineDate = new Date(deadline);
      const diff = deadlineDate - now;
      return Math.ceil(diff / (1e3 * 60 * 60 * 24));
    },
    goBack() {
      common_vendor.index.navigateBack();
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
    c: common_vendor.t(_ctx.$t("folder.title")),
    d: common_vendor.f($data.applications, (application, k0, i0) => {
      return {
        a: common_vendor.t(application.school_name),
        b: application.progress + "%",
        c: common_vendor.t(_ctx.$t("folder.daysLeft", {
          days: $options.getDaysLeft(application.deadline)
        })),
        d: application._id
      };
    }),
    e: common_vendor.t(_ctx.$t("folder.processing")),
    f: common_vendor.t(_ctx.$t("folder.applicationList")),
    g: common_vendor.f($data.materials, (material, index, i0) => {
      return {
        a: common_vendor.t(material.name),
        b: common_vendor.t(_ctx.$t("folder.completed", {
          percent: material.progress
        })),
        c: "d1c75cef-1-" + i0,
        d: index
      };
    }),
    h: common_vendor.p({
      type: "loop",
      size: "24",
      color: "#00B4D8"
    })
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-d1c75cef"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/folder/folder.js.map
