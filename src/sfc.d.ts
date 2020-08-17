declare module "*.vue" {
  import Vue from 'vue'
  export default Vue
}

declare module 'store/index.js'
declare module 'echarts'
declare module 'babel-polyfill'
declare module 'js-cookie'
declare module 'querystring'
declare module 'utils/config'

declare var window: Window
