import service from '../utils/request'
import qs from 'querystring'
let baseUrl: string = process.env.LOGIN_API

export default {
    // 登录
  login: (data: any) => {
    return service({
      url: baseUrl + '',
      method: 'post',
      data: qs.stringify(data)
    })
  },
    // 查询用户类型
  getUserType: (data: any) => {
    return service({
      url: baseUrl + '',
      method: 'post',
      data: qs.stringify(data)
    })
  },
    // 获取手机验证码 /smsVerificationCodeType登录传0修改密码传1
  getPhoneCode: (data: any) => {
    return service({
      url: baseUrl + '',
      method: 'get',
      params: data
    })
  },
    // 获取图片验证码
  getPictureCode: (uuid: string): string => {
    return baseUrl + '' + uuid
  },
    // 忘记/修改密码
  updatePassword: (data: any) => {
    return service({
      url: baseUrl + '',
      method: 'post',
      data: qs.stringify(data)
    })
  },
    // 退出
  logout: (data: any) => {
    return service({
      url: baseUrl + '',
      method: 'get'
    })
  },
    // 判断用户是否在登录状态
  isLogin: (data: any) => {
    return service({
      url: baseUrl + '',
      method: 'get',
      params: data
    })
  },
    // 密码加密登录成功后传sessionId给后台
  onlyOneLogin: (data: any) => {
    return service({
      url: process.env.BASE_API + '',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}
