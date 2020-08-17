// 文件模拟表单下载
export function downLoadFile (url: string, method: string, data: object, containBaseUrl: string) {
  let body = document.getElementsByTagName('body')[0]
  let form = document.createElement('form')
    // form.setAttribute('target', '_blank')
  body.appendChild(form)
  if (containBaseUrl) {
    form.action = url
  } else {
    form.action = process.env.BASE_API + url
  }
  form.method = method
  let str = ''
  for (let key in data) {
    str += `<input type="hidden" name="${key}" value="${data[key]}">`
  }
  str += `<input type="hidden" name="pageUrl" value="${window.location.href}">`
  form.innerHTML = str
  form.submit()
  form.parentNode.removeChild(form)

}
