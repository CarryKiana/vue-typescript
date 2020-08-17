import service from '../utils/request'
import qs from 'querystring'

let baseUrl: string = process.env.BASE_API

export default {
    // 获取离线报表表格分页内容
  getOfflineReportData: (data: any) => {
    return service({
      url: baseUrl + 'report/getOfflineReportData',
      method: 'post',
      data: qs.stringify(data)
    })
  },
    // 获取下拉选项列表
  getSelectedList: (data: any) => {
    return service({
      url: baseUrl + 'report/getGroupNameSet',
      method: 'post',
      data: qs.stringify(data)
    })
  },
    // 获取柱状图数据
  getOfflineReportChartData: (data: any) => {
    return service({
      url: baseUrl + 'report/getOfflineReportTrend',
      method: 'post',
      data: qs.stringify(data)
    })
  }
}
