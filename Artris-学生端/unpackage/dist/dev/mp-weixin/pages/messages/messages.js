"use strict";
const common_vendor = require("../../common/vendor.js");
const BottomNav = () => "../../components/BottomNav/BottomNav.js";
const _sfc_main = {
  components: {
    BottomNav
  },
  data() {
    return {
      conversations: [],
      loading: false
    };
  },
  onLoad() {
    this.loadConversations();
  },
  onShow() {
    this.loadConversations();
  },
  methods: {
    async loadConversations() {
      this.loading = true;
      try {
        const userInfo = common_vendor.index.getStorageSync("userInfo") || {};
        const res = await common_vendor.tr.callFunction({
          name: "messages",
          data: {
            action: "getList",
            data: {
              user_id: userInfo._id || "test_student"
            }
          }
        });
        if (res.result.code === 0) {
          this.conversations = res.result.data || [];
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/messages/messages.vue:86", "加载消息失败:", error);
        common_vendor.index.showToast({
          title: "加载失败",
          icon: "none"
        });
      } finally {
        this.loading = false;
      }
    },
    goToChat(userId) {
      common_vendor.index.navigateTo({
        url: `/pages/chat/chat?userId=${userId}`
      });
    },
    formatTime(timestamp) {
      if (!timestamp)
        return "";
      const date = new Date(timestamp);
      const now = /* @__PURE__ */ new Date();
      const diff = now - date;
      const minutes = Math.floor(diff / 6e4);
      if (minutes < 1)
        return "刚刚";
      if (minutes < 60)
        return `${minutes}分钟前`;
      if (minutes < 1440)
        return `${Math.floor(minutes / 60)}小时前`;
      return `${date.getMonth() + 1}-${date.getDate()}`;
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
    a: common_vendor.t(_ctx.$t("messages.title")),
    b: common_vendor.f($data.conversations, (conversation, k0, i0) => {
      var _a, _b, _c, _d, _e;
      return common_vendor.e({
        a: (_b = (_a = conversation.other_user) == null ? void 0 : _a.avatar_file) == null ? void 0 : _b.url
      }, ((_d = (_c = conversation.other_user) == null ? void 0 : _c.avatar_file) == null ? void 0 : _d.url) ? {
        b: conversation.other_user.avatar_file.url
      } : {
        c: "ecc172b4-0-" + i0,
        d: common_vendor.p({
          type: "contact-filled",
          size: "40",
          color: "#00B4D8"
        })
      }, {
        e: common_vendor.t(((_e = conversation.other_user) == null ? void 0 : _e.username) || "用户"),
        f: common_vendor.t($options.formatTime(conversation.create_date)),
        g: common_vendor.t(conversation.content),
        h: conversation.unread
      }, conversation.unread ? {} : {}, {
        i: conversation.other_user_id,
        j: common_vendor.o(($event) => $options.goToChat(conversation.other_user_id), conversation.other_user_id)
      });
    }),
    c: $data.loading
  }, $data.loading ? {
    d: common_vendor.t(_ctx.$t("common.loading"))
  } : {}, {
    e: !$data.loading && $data.conversations.length === 0
  }, !$data.loading && $data.conversations.length === 0 ? {
    f: common_vendor.t(_ctx.$t("messages.noMessages"))
  } : {});
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-ecc172b4"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/messages/messages.js.map
