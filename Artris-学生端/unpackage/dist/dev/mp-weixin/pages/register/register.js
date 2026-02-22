"use strict";
const common_vendor = require("../../common/vendor.js");
const common_assets = require("../../common/assets.js");
const _sfc_main = {
  data() {
    return {
      formData: {
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        school: ""
      },
      loading: false
    };
  },
  computed: {
    canRegister() {
      return this.formData.username.trim() && this.formData.email.trim() && this.formData.password.trim() && this.formData.confirmPassword.trim() && this.formData.school.trim();
    }
  },
  methods: {
    validateForm() {
      if (!this.formData.username.trim()) {
        common_vendor.index.showToast({
          title: "请输入用户名",
          icon: "none"
        });
        return false;
      }
      if (!this.formData.email.trim()) {
        common_vendor.index.showToast({
          title: "请输入邮箱",
          icon: "none"
        });
        return false;
      }
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(this.formData.email)) {
        common_vendor.index.showToast({
          title: this.$t("register.emailInvalid"),
          icon: "none"
        });
        return false;
      }
      if (!this.formData.password.trim()) {
        common_vendor.index.showToast({
          title: "请输入密码",
          icon: "none"
        });
        return false;
      }
      if (this.formData.password.length < 6) {
        common_vendor.index.showToast({
          title: this.$t("register.passwordTooShort"),
          icon: "none"
        });
        return false;
      }
      if (this.formData.password !== this.formData.confirmPassword) {
        common_vendor.index.showToast({
          title: this.$t("register.passwordMismatch"),
          icon: "none"
        });
        return false;
      }
      if (!this.formData.school.trim()) {
        common_vendor.index.showToast({
          title: "请输入学校名称",
          icon: "none"
        });
        return false;
      }
      return true;
    },
    async handleRegister() {
      var _a, _b;
      if (!this.canRegister || this.loading)
        return;
      if (!this.validateForm()) {
        return;
      }
      this.loading = true;
      try {
        const uniIdCo = common_vendor.tr.importObject("uni-id-co", {
          customUI: true
        });
        const registerResult = await uniIdCo.register({
          username: this.formData.username,
          email: this.formData.email,
          password: this.formData.password,
          nickname: this.formData.username,
          extend: {
            school: this.formData.school
          }
        });
        if (registerResult.errCode === 0) {
          if (registerResult.token) {
            common_vendor.index.setStorageSync("uni_id_token", registerResult.token);
          }
          const userInfo = registerResult.userInfo || {};
          common_vendor.index.setStorageSync("userInfo", {
            _id: userInfo._id || registerResult.uid,
            username: userInfo.username || this.formData.username,
            email: userInfo.email || this.formData.email,
            avatar: ((_a = userInfo.avatar_file) == null ? void 0 : _a.url) || "",
            school: ((_b = userInfo.extend) == null ? void 0 : _b.school) || this.formData.school
          });
          common_vendor.index.showToast({
            title: this.$t("register.registerSuccess"),
            icon: "success"
          });
          setTimeout(() => {
            common_vendor.index.reLaunch({
              url: "/pages/home/home"
            });
          }, 1500);
        } else {
          throw new Error(registerResult.errMsg || this.$t("register.registerFailed"));
        }
      } catch (error) {
        common_vendor.index.__f__("error", "at pages/register/register.vue:244", "注册失败:", error);
        common_vendor.index.showToast({
          title: error.message || this.$t("register.registerFailed"),
          icon: "none",
          duration: 2e3
        });
      } finally {
        this.loading = false;
      }
    },
    goToLogin() {
      common_vendor.index.navigateBack();
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
  return common_vendor.e({
    a: common_vendor.o($options.goBack),
    b: common_vendor.p({
      type: "left",
      size: "24",
      color: "#333"
    }),
    c: common_vendor.t(_ctx.$t("register.title")),
    d: common_assets._imports_0,
    e: common_vendor.t(_ctx.$t("register.createAccount")),
    f: common_vendor.t(_ctx.$t("register.subtitle")),
    g: common_vendor.p({
      type: "person",
      size: "20",
      color: "#999"
    }),
    h: _ctx.$t("register.usernamePlaceholder"),
    i: $data.formData.username,
    j: common_vendor.o(($event) => $data.formData.username = $event.detail.value),
    k: common_vendor.p({
      type: "email",
      size: "20",
      color: "#999"
    }),
    l: _ctx.$t("register.emailPlaceholder"),
    m: $data.formData.email,
    n: common_vendor.o(($event) => $data.formData.email = $event.detail.value),
    o: common_vendor.p({
      type: "locked",
      size: "20",
      color: "#999"
    }),
    p: _ctx.$t("register.passwordPlaceholder"),
    q: $data.formData.password,
    r: common_vendor.o(($event) => $data.formData.password = $event.detail.value),
    s: common_vendor.p({
      type: "locked",
      size: "20",
      color: "#999"
    }),
    t: _ctx.$t("register.confirmPasswordPlaceholder"),
    v: common_vendor.o((...args) => $options.handleRegister && $options.handleRegister(...args)),
    w: $data.formData.confirmPassword,
    x: common_vendor.o(($event) => $data.formData.confirmPassword = $event.detail.value),
    y: common_vendor.p({
      type: "home",
      size: "20",
      color: "#999"
    }),
    z: _ctx.$t("register.schoolPlaceholder"),
    A: $data.formData.school,
    B: common_vendor.o(($event) => $data.formData.school = $event.detail.value),
    C: $data.loading
  }, $data.loading ? {
    D: common_vendor.t(_ctx.$t("common.loading"))
  } : {
    E: common_vendor.t(_ctx.$t("register.registerButton"))
  }, {
    F: !$options.canRegister ? 1 : "",
    G: !$options.canRegister || $data.loading,
    H: common_vendor.o((...args) => $options.handleRegister && $options.handleRegister(...args)),
    I: common_vendor.t(_ctx.$t("register.loginLink")),
    J: common_vendor.o((...args) => $options.goToLogin && $options.goToLogin(...args))
  });
}
const MiniProgramPage = /* @__PURE__ */ common_vendor._export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-bac4a35d"]]);
wx.createPage(MiniProgramPage);
//# sourceMappingURL=../../../.sourcemap/mp-weixin/pages/register/register.js.map
