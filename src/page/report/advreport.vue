<template>
  <div class="advreport-page">
    <div class="top">
      <div class="top-title">
        <div class="left">广告主报表</div>
        <range-picker class="right" v-model="dateTime" @change="dateChange"></range-picker>
      </div>
    </div>
    <div class="data-map">
      <div class="map-title">数据趋势图</div>
      <div class="map-handle">
        <el-select class="list-select-down" v-model="mapQuery.column" @change="mapChange">
          <el-option
            v-for="(item,index) in mSelectArr"
            :key="index"
            :value="item.value"
            :label="item.label"
          >{{item.label}}</el-option>
        </el-select>
      </div>
      <div class="map">
        <ybar-chart :chartData="chartData" :unit="mapQuery.column == 'clickRate'? '%' : ''"></ybar-chart>
      </div>
    </div>
    <div class="data-table">
      <div class="table-title">数据详情</div>
      <div class="table-handle">
        <el-select
          class="list-select-down"
          placeholder="请选择广告主"
          v-model="tableQuery.filter"
          @change="tableAdvChange"
          clearable
        >
          <el-option v-for="(item,index) in advSelectArr" :key="index" :value="item">{{item}}</el-option>
        </el-select>
        <span class="table-export" @click="exportData">导出数据</span>
      </div>
      <div class="gcloud-table">
        <el-table :data="tableList" stripe @sort-change="tableSortChange">
          <el-table-column prop="groupName" label="广告主"></el-table-column>
          <el-table-column prop="date" label="日期" width="200"></el-table-column>
          <el-table-column prop="requestNum" label="请求数" sortable="custom" align="center"></el-table-column>
          <el-table-column prop="participationNum" label="竞价数" sortable="custom" align="center"></el-table-column>
          <el-table-column prop="participationRate" label="参竞率" sortable="custom" align="center">
            <template slot-scope="scope">{{   scope.row.participationRate=='-'? '-': scope.row.participationRate + '%' }}</template>
          </el-table-column>
          <el-table-column prop="successNum" label="竞价成功数" sortable="custom" align="center"></el-table-column>
          <el-table-column prop="successRate" label="竞价成功率" sortable="custom" align="center">
            <template slot-scope="scope">{{   scope.row.successRate=='-'? '-': scope.row.successRate + '%' }}</template>
          </el-table-column>
          <el-table-column prop="impressionNum" label="曝光数" sortable="custom" align="center"></el-table-column>
          <el-table-column prop="clickNum" label="点击数" sortable="custom" align="center"></el-table-column>
          <el-table-column prop="clickRate" label="点击率" sortable="custom" align="center">
            <template slot-scope="scope">{{   scope.row.clickRate=='-'? '-': scope.row.clickRate + '%' }}</template>
          </el-table-column>
          <el-table-column prop="cpm" label="CPM" sortable="custom" align="center"></el-table-column>
          <el-table-column prop="cpc" label="CPC" sortable="custom" align="center"></el-table-column>
        </el-table>
      </div>
      <div class="page-line" v-if="tableCount">
        <el-pagination
          class="page-box"
          background
          :page-size="tableQuery.pageSize"
          :current-page.sync="tableQuery.pageNo"
          prev-text="上一页"
          next-text="下一页"
          layout="prev, pager, next,slot,jumper"
          :total="tableCount"
          @current-change="tablePageChange"
        >
          <span class="page-info">共{{Math.ceil(tableCount/tableQuery.pageSize)}}页共{{tableCount}}条信息</span>
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
import { Vue, Component } from 'vue-property-decorator'
import { Getter } from 'vuex-class'
import rangePicker from "@/components/timepicker/timerangepicker";
import ybarChart from "@/components/echarts/ybarChart";
import { parseTime } from "@/utils/parseTime";
import { downLoadFile } from "@/utils/download";

@Component({
  components: {
    rangePicker,
    ybarChart
  }
})
export default class Advreport extends Vue {
  dateTime = []
  mapQuery = {
    column: "impressionNum",
    begin: "",
    end: "",
    groupType: "advertiser" // 广告主
  }
  chartData = {
    AxisDate: [],
    data: [],
    title: "",
    paramName: ""
  }
  mSelectArr = [
    { label: "曝光数", value: "impressionNum" },
    { label: "点击数", value: "clickNum" },
    { label: "点击率", value: "clickRate" },
    { label: "CPM", value: "cpm" },
    { label: "CPC", value: "cpc" }
  ]
  advSelectArr = [] // 广告主下拉列表
  tableQuery = {
    filter: "",
    begin: "",
    end: "",
    groupType: "advertiser",
    pageNo: 1,
    pageSize: 10,
    sortColumn: "", // 排序
    userId: ""
  }
  tableCount = undefined
  tableList = []
  data() {
    return {
      dateTime: [
      parseTime(new Date() - 3 * 24 * 3600 * 1000, "{y}-{m}-{d}"),
      parseTime(new Date() - 24 * 3600 * 1000, "{y}-{m}-{d}")
      ],
      tableCount: undefined
    }
  }
  @Getter('user') user
  created() {
    this.getOfflineReportChartData();
    this.getSelectedList();
    this.getOfflineReportData();
    if (this.user.userId) {
      this.tableQuery.userId = this.user.userId;
    }
    if (this.$route.query.msg == 1) {
      this.$gidMessage("导出数据失败");
      this.$router.push({ path: this.$route.path });
    } else if (this.$route.query.msg == 2) {
      this.$gidMessage("没有数据");
      this.$router.push({ path: this.$route.path });
    }
  }
  // 获取柱状图数据
  getOfflineReportChartData() {
    if (this.dateTime) {
      this.mapQuery.begin = this.dateTime[0];
      this.mapQuery.end = this.dateTime[1];
    }
    this.$api.report.getOfflineReportChartData(this.mapQuery).then(res => {
      if (res.ret == 0) {
        let temp = res.data || [];
        this.chartData = {
          AxisDate: temp.map(item => {
            return item.columnName;
          }),
          data: temp.map(item => {
            return item.columnValue < 0 ? 0 :item.columnValue;
          }),
          title: this.mSelectArr.filter(item => {
            return item.value == this.mapQuery.column;
          })[0].label,
          paramName: this.mSelectArr.filter(item => {
            return item.value == this.mapQuery.column;
          })[0].label
        };
      } else {
        this.$gidMessage(res.msg);
      }
    });
  }
  // 查询柱状图数参数改变
  mapChange() {
    this.getOfflineReportChartData();
  }
  // 获取下拉列表
  getSelectedList() {
    let data = {
      begin: this.dateTime[0],
      end: this.dateTime[1],
      groupType: "advertiser"
    };
    this.$api.report.getSelectedList(data).then(res => {
      if (res.ret == 0) {
        this.advSelectArr = res.data || [];
      } else {
        this.$gidMessage(res.msg);
      }
    });
  }
  // 获取广告主表格数据
  getOfflineReportData() {
    if (this.dateTime) {
      this.tableQuery.begin = this.dateTime[0];
      this.tableQuery.end = this.dateTime[1];
    }
    this.$api.report.getOfflineReportData(this.tableQuery).then(res => {
      this.tableList = res.data && res.data.list ? res.data.list : [];
      this.tableCount =
        res.data && res.data.count ? res.data.count : undefined;
    });
  }
  // 广告主表格分页切换
  tablePageChange(val) {
    this.tableQuery.pageNo = val;
    this.getOfflineReportData();
  }
  // 广告主表格广告主切换
  tableAdvChange(val) {
    this.tableQuery.pageNo = 1;
    this.getOfflineReportData();
  }
  // 表格排序
  tableSortChange({ column, prop, order }) {
    this.tableQuery.sortColumn = prop;
    if (order == "descending") {
      this.tableQuery.increaseFlag = false;
    } else if (order == "ascending") {
      this.tableQuery.increaseFlag = true;
    } else {
      this.tableQuery.increaseFlag = true;
    }
    this.tableQuery.pageNo = 1;
    this.getOfflineReportData();
  }
  // 时间改变
  dateChange(val) {
    if (val) {
      this.getOfflineReportChartData();
      this.getSelectedList();
      this.getOfflineReportData();
    }
  }
  // 导出日志
  exportData() {
    if (!this.tableList.length) {
      this.$gidMessage("暂无数据");
      return;
    }
    let data = Object.assign({}, this.tableQuery, {
      pageUrl: location.href
    });
    downLoadFile("report/exportOfflineReportData", "post", data);
  }
}
</script>

<style lang="scss" scoped>
.advreport-page {
  .top {
    padding: 25px 20px 50px;
    background-color: #fff;
    border-radius: 4px;
    .top-title {
      border-bottom: 1px solid #ccc;
      position: relative;
    }
    .left {
      color: #666;
      font-size: 16px;
      font-weight: bold;
      height: 50px;
      line-height: 30px;
    }
    .right {
      position: absolute;
      top: 0;
      right: 20px;
    }
  }
  .data-map {
    background-color: #fff;
    border-radius: 5px;
    margin-top: 10px;
    .map-title {
      padding: 20px;
      font-size: 14px;
      color: #000;
    }
    .map-handle {
      padding: 0 20px;
    }
    .map {
      width: 100%;
      height: calc(45vh);
    }
  }
  .data-table {
    background-color: #fff;
    border-radius: 5px;
    margin-top: 20px;
    .table-title {
      padding: 20px;
      font-size: 14px;
      color: #000;
    }
    .table-handle {
      padding: 0 20px;
    }
    .gcloud-table {
      padding: 10px 20px;
    }
    .table-export {
      background: url(~@/assets/images/icon-export.png) no-repeat left center;
      padding-left: 20px;
      float: right;
      color: $blue;
      cursor: pointer;
    }
  }
}
</style>

