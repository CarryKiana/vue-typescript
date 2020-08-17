import service from '../utils/request'
import qs from 'querystring'

let baseUrl = process.env.BASE_API

export default {
  // 查询ip黑名单列表
  getIpBlacklist: (data: any) => {
    return service({
      url: baseUrl + '',
      method: 'post',
      data: qs.stringify(data)
    })
  },
  // 导入黑名单
  importIpBlacklist: (data: any) => {
    return service({
      url: baseUrl + '',
      method: 'post',
      timeout: 125000,
      data
    })
  },
  // 移除Ip黑名单
  delIpBlacklistById: (data: any) => {
    return service({
      url: baseUrl + '',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}
