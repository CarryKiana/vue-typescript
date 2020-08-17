import service from '../utils/request'
import qs from 'querystring'

let baseUrl: string = process.env.LOGIN_API

export default {
    // 用户信息列表
  getUserList: (data: any) => {
    return service({
      url: baseUrl + '/a/sys/userManage/list',
      method: 'post',
      data: qs.stringify(data)
    })
  },
    // 更改用户登录状态
  updateLoginFlag: (data: any) => {
    return service({
      url: baseUrl + '/a/sys/userManage/updateLoginFlag',
      method: 'post',
      data: qs.stringify(data)
    })
  },
    // 删除用户
  delete: (data: any) => {
    return service({
      url: baseUrl + '/a/sys/userManage/delete',
      method: 'post',
      data: qs.stringify(data)
    })
  },
    // 获取所有广告主
  getAdList: (data: any) => {
    return service({
      url: process.env.BASE_API + 'advertiser/list',
      method: 'post',
      data: qs.stringify(data)
    })
  },
    // 保存新增账号
  add: (data: any) => {
    return service({
      url: baseUrl + '/a/sys/userManage/save',
      method: 'post',
      data: qs.stringify(data)
    })
  },
    // 修改账号
  edit: (data: any) => {
    return service({
      url: baseUrl + '/a/sys/userManage/update',
      method: 'post',
      data: qs.stringify(data)
    })
  },
    // 获取用户信息
  getUserById: (data: any) => {
    return service({
      url: baseUrl + '/a/sys/userManage/getUserById',
      method: 'post',
      data: qs.stringify(data)
    })
  },
    // 获取计划列表
  planList: (data: any) => {
    return service({
      url: baseUrl + '/a/sys/userManage/planList',
      method: 'get',
      params: data
    })
  }
}
