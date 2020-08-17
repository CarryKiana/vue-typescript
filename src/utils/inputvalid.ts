import Vue from 'vue'
// 输入框敏感字符检测
export function inputValid (text: string): boolean {
  if (!text) {
    return true
  }
  let reg = /^[^<>'"&\\/#()]+$/
  if (!reg.test(text)) {
    Vue.prototype.$gidMessage('输入格式不正确，请检查!')
    return false
  } else {
    return true
  }
}
