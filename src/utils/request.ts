require('es6-promise').polyfill()
import axios from 'axios'
import store from '../store'
import Vue from 'vue'
// 跨域验证配置
axios.defaults.withCredentials = true
// 实例化请求对象
const service = axios.create({
  baseURL: process.env.BASE_API,
  timeout: 5000
})

// 请求拦截
service.interceptors.request.use(config => {
  return config
}, error => {
    // console.log(error)
  return Promise.reject(error)
})

// 响应拦截
service.interceptors.response.use(res => {
    // 这里可以做请求是否成功、是否没有权限的统一判断处理
  return res.data
}, error => {
    // console.log(error);
    // error.config ,error.code,error.message,error.response
    // 超时配置
  if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
    Vue.prototype.$gidMessage('请求超时,请重试！')
  }
  if (+error.response.status === 401) {
        // 清cookie，回登录页
    store.dispatch('delUserInfo').then(() => {
      location.reload()
    }).catch(_ => _)
  } else {
    return Promise.reject(error)
  }
})

export default service
