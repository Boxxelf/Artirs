"use strict";
const common_vendor = require("../../common/vendor.js");
const _sfc_main = {
  data() {
    return {
      userId: "",
      otherUserId: "",
      currentUserId: "",
      otherUser: {},
      messages: [],
      inputText: "",
      scrollTop: 0
    };
  },
  onLoad(options) {
    if (options.userId) {
      this.otherUserId = options.userId;
    } else if (options.mentorId) {
      this.otherUserId = options.mentorId;
    }
    const userInfo = common_vendor.index.getStorageSync("userInfo") || {};
    this.currentUserId = userInfo._id || "test_student";
    this.loadChatHistory();
  },
  methods: {
    async loadChatHistory() {
      try {
        const res = await common_vendor.tr.callFunction({
          name: "messages",
          data: {
            action: "getChatHistory",
            data: {
              user_id: this.currentUserId,
              other_user_id: this.otherUserId
            }
          }
        });
        if (res.result.code === 0) {
          this.messages = res.result.data || [];
          this.$nextTick(() => {
            this.scrollToBottom();
          });
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/chat/chat.vue:83", "加载聊天记录失败:", error);
      }
    },
    async sendMessage() {
      if (!this.inputText.trim())
        return;
      try {
        const res = await common_vendor.tr.callFunction({
          name: "messages",
          data: {
            action: "send",
            data: {
              from_user_id: this.currentUserId,
              to_user_id: this.otherUserId,
              content: this.inputText
            }
          }
        });
        if (res.result.code === 0) {
          this.inputText = "";
          this.loadChatHistory();
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/chat/chat.vue:107", "发送消息失败:", error);
        common_vendor.index.showToast({
          title: "发送失败",
          icon: "none"
        });
      }
    },
    scrollToBottom() {
      this.scrollTop = 99999;
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
  var _a;
  return {
    a: common_vendor.o($options.goBack),
    b: common_vendor.p({
      type: "left",
      size: "24",
      color: "#333"
    }),
    c: common_vendor.t(((_a = $data.otherUser) == null ? void 0 : _a.username) || "聊天"),
    d: common_vendor.p({
      type: "list",
      size: "24",
      color: "#333"
    }),
    e: common_vendor.f($data.messages, (message, index, i0) => {
      return {
        a: common_vendor.t(message.content),
        b: message.from_user_id === $data.currentUserId ? 1 : "",
        c: index,
        d: message.from_user_id === $data.currentUserId ? 1 : ""
      };
    }),
    f: $data.scrollTop,
    g: _ctx.$t("messages.inputPlaceholder"),
    h: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args)),
    i: $data.inputText,
    j: common_vendor.o(($event) => $data.inputText = $event.detail.value),
    k: common_vendor.p({
      type: "right",
      size: "20",
      color: "#ffffff"
    }),
    l: $data.inputText.trim() ? 1 : "",
    m: common_vendor.o((...args) => $options.sendMessage && $options.sendMessage(...args)),
    n: !$data.inputText.trim()
  };
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-0a633310"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/chat/chat.js.map
