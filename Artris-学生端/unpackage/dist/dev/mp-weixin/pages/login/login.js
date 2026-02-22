"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      formData: {
        username: "",
        password: ""
      },
      loading: false
    };
  },
  computed: {
    canLogin() {
      return this.formData.username.trim() && this.formData.password.trim();
    }
  },
  methods: {
    async handleLogin() {
      var _a, _b;
      if (!this.canLogin || this.loading)
        return;
      if (!this.formData.username.trim()) {
        common_vendor.index.showToast({
          title: this.$t("login.usernameRequired"),
          icon: "none"
        });
        return;
      }
      if (!this.formData.password.trim()) {
        common_vendor.index.showToast({
          title: this.$t("login.passwordRequired"),
          icon: "none"
        });
        return;
      }
      this.loading = true;
      try {
        const uniIdCo = common_vendor.tr.importObject("uni-id-co", {
          customUI: true
        });
        const isEmail = this.formData.username.includes("@");
        let loginResult;
        if (isEmail) {
          loginResult = await uniIdCo.loginByEmail({
            email: this.formData.username,
            password: this.formData.password
          });
        } else {
          loginResult = await uniIdCo.login({
            username: this.formData.username,
            password: this.formData.password
          });
        }
        if (loginResult.errCode === 0) {
          const userInfo = loginResult.userInfo || {};
          if (loginResult.token) {
            common_vendor.index.setStorageSync("uni_id_token", loginResult.token);
          }
          common_vendor.index.setStorageSync("userInfo", {
            _id: userInfo._id || loginResult.uid,
            username: userInfo.username || this.formData.username,
            email: userInfo.email || "",
            avatar: ((_a = userInfo.avatar_file) == null ? void 0 : _a.url) || "",
            school: ((_b = userInfo.extend) == null ? void 0 : _b.school) || userInfo.school || "Rhode Island School of Design"
          });
          common_vendor.index.showToast({
            title: this.$t("login.loginSuccess"),
            icon: "success"
          });
          setTimeout(() => {
            const pages = getCurrentPages();
            if (pages.length > 1) {
              common_vendor.index.navigateBack();
            } else {
              common_vendor.index.reLaunch({
                url: "/pages/home/home"
              });
            }
          }, 1500);
        } else {
          throw new Error(loginResult.errMsg || this.$t("login.loginError"));
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/login/login.vue:164", "登录失败:", error);
        common_vendor.index.showToast({
          title: error.message || this.$t("login.loginFailed"),
          icon: "none",
          duration: 2e3
        });
      } finally {
        this.loading = false;
      }
    },
    goToRegister() {
      common_vendor.index.navigateTo({
        url: "/pages/register/register"
      });
    },
    handleForgotPassword() {
      common_vendor.index.showToast({
        title: "功能开发中",
        icon: "none"
      });
    }
  }
};
if (!Array) {
  const _component_uni_icons = common_vendor.resolveComponent("uni-icons");
  _component_uni_icons();
}
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  return common_vendor.e({
    a: common_assets._imports_0,
    b: common_vendor.t(_ctx.$t("login.welcome")),
    c: common_vendor.t(_ctx.$t("login.subtitle")),
    d: common_vendor.p({
      type: "person",
      size: "20",
      color: "#999"
    }),
    e: _ctx.$t("login.usernamePlaceholder"),
    f: $data.formData.username,
    g: common_vendor.o(($event) => $data.formData.username = $event.detail.value),
    h: common_vendor.p({
      type: "locked",
      size: "20",
      color: "#999"
    }),
    i: _ctx.$t("login.passwordPlaceholder"),
    j: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args)),
    k: $data.formData.password,
    l: common_vendor.o(($event) => $data.formData.password = $event.detail.value),
    m: common_vendor.t(_ctx.$t("login.forgotPassword")),
    n: common_vendor.o((...args) => $options.handleForgotPassword && $options.handleForgotPassword(...args)),
    o: $data.loading
  }, $data.loading ? {
    p: common_vendor.t(_ctx.$t("common.loading"))
  } : {
    q: common_vendor.t(_ctx.$t("login.loginButton"))
  }, {
    r: !$options.canLogin ? 1 : "",
    s: !$options.canLogin || $data.loading,
    t: common_vendor.o((...args) => $options.handleLogin && $options.handleLogin(...args)),
    v: common_vendor.t(_ctx.$t("login.registerLink")),
    w: common_vendor.o((...args) => $options.goToRegister && $options.goToRegister(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-e4e4508d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/login/login.js.map
