import App from './App'
import i18n from './utils/i18n.js'

// #ifndef VUE3
import Vue from 'vue'
import './uni.promisify.adaptor'
Vue.config.productionTip = false
Vue.prototype.$t = i18n.t
App.mpType = 'app'
const app = new Vue({
  ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  // 全局注册 i18n
  app.config.globalProperties.$t = i18n.t
  app.config.globalProperties.$i18n = i18n
  return {
    app
  }
}
// #endif