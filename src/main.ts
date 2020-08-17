// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
require('es6-promise').polyfill()
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from '@/store/index'
import api from './api'
import gidMessage from './plugins'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import BabelPolyfill from 'babel-polyfill'
import './assets/scss/global.scss'
import echarts from 'echarts'
import theme from './assets/js/theme.js'
declare module 'vue/types/vue' {
  interface Vue {
    $api: any,
    $gidMessage: any,
    $gidSuccess: any
  }
}
Vue.use(ElementUI)
Vue.prototype.$api = api
Vue.config.productionTip = false
Vue.prototype.$echarts = echarts
echarts.registerTheme('theme', theme)
// 注册自定义提示插件
Vue.use(gidMessage)

/* eslint-disable no-new */
// tslint:disable
new Vue({
  el: '#app',
  store,
  router,
  components: {
    App
  },
  template: '<App/>'
})
