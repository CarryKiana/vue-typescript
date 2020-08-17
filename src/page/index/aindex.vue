<template>
  <div class="main-page">
    <div class="title">首页</div>
    <div class="data-show">
      <div class="item">
        <div class="item-title">待审核素材</div>
        <div class="item-data">{{detail.auditingMaterialIds.length}}</div>
      </div>
      <div class="item">
        <div class="item-title">审核不通过素材</div>
        <div class="item-data">{{detail.auditNotPassMaterialIds.length}}</div>
      </div>
      <div class="item">
        <div class="item-title">本周待投放订单</div>
        <div class="item-data">{{detail.waitLaunchingOrderCount}}</div>
      </div>
      <div class="item">
        <div class="item-title">投放中订单</div>
        <div class="item-data">{{detail.launchingOrderCount}}</div>
      </div>
      <div class="item">
        <div class="item-title">异常订单</div>
        <div class="item-data">{{detail.exceptionOrderCount}}</div>
      </div>
    </div>
    <div class="data-map">
      <div class="map-title">数据趋势图</div>
      <div class="map-handle">
        <el-select class="list-select-down" v-model="query.firstValue" @change="selectChange">
          <el-option
            v-for="(item,index) in selectArr"
            :key="index"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
        <el-select v-model="query.secondValue" @change="selectChange">
          <el-option value="无">无</el-option>
          <el-option
            v-for="(item,index) in selectArr"
            :key="index"
            :value="item.value"
            :label="item.label"
          ></el-option>
        </el-select>
        <range-picker v-model="dateTime" @change="timeChange"></range-picker>
      </div>
      <div class="map">
        <double-line-chart :chartData="chartData"></double-line-chart>
      </div>
    </div>
  </div>
</template>

<script>
import rangePicker from "@/components/timepicker/timerangepicker";
import doubleLineChart from "@/components/echarts/operatedoublelinechart";
import { parseTime } from "@/utils/parseTime";
import { Vue, Component } from 'vue-property-decorator'

@Component({
  components: {
    rangePicker,
    doubleLineChart
  }
})
export default class AIndex extends Vue {
  query = {
    firstValue: "impressionNum",
    secondValue: "clickNum",
    startTime: "",
    endTime: ""
  }
  selectArr = [
    { label: "曝光数", value: "impressionNum" },
    { label: "点击数", value: "clickNum" },
    { label: "点击率", value: "clickRate" },
    { label: "CPM", value: "cpm" },
    { label: "CPC", value: "cpc" }
  ]
  dateTime = []
  detail = {
    auditingMaterialIds:[],
    auditNotPassMaterialIds: []
  }
  reportData = {}
  chartData = {
    // title: "数据趋势图",
    xAxisData: [],
    data: [],
    data2: [],
    unit: "",
    unit2: "",
    paramName: "",
    paramName2: ""
  }
  data() {
    return {
      dateTime:  [
        parseTime(new Date() - 3 * 24 * 3600 * 1000, "{y}-{m}-{d}"),
        parseTime(new Date() - 24 * 3600 * 1000, "{y}-{m}-{d}")
      ]
    }
  }
  created() {
    this.getGeneralOrderAndMaterial();
    this.getGeneralOfflineReportData();
  }
  // 获取离线报表数据
  getGeneralOfflineReportData() {
    let data = {
      begin: this.dateTime[0],
      end: this.dateTime[1]
    };
    this.$api.aindex.getGeneralOfflineReportData(data).then(res => {
      if (res.ret == 0) {
        this.reportData = res.data || [];
        this.showReportData();
      } else {
        this.$gidMessage("获取报表数据失败");
      }
    });
  }
  // 筛选显示条件改变
  selectChange() {
    if (this.query.firstValue == this.query.secondValue) {
      this.$gidMessage("指标重复请重新选择");
    } else {
      this.showReportData();
    }
  }
  // 筛选显示图表数据
  showReportData() {
    let paramNameItem = this.selectArr.filter(item => {
      return item.value == this.query.firstValue;
    });
    let paramName2Item = this.selectArr.filter(item => {
      return item.value == this.query.secondValue;
    });
    let data = {
      xAxisData:
        this.reportData.map(item => {
          return item.date;
        }) || [],
      data:
        this.reportData.map(item => {
          return item[this.query.firstValue];
        }) || [],
      data2:
        this.reportData.map(item => {
          return item[this.query.secondValue];
        }) || [],
      unit: this.query.firstValue == "clickRate" ? "%" : "",
      unit2: this.query.secondValue == "clickRate" ? "%" : "",
      paramName: paramNameItem.length ? paramNameItem[0].label : "",
      paramName2: paramName2Item.length ? paramName2Item[0].label : ""
    };
    this.chartData = data;
  }
  // 获取订单和素材概况信息
  getGeneralOrderAndMaterial() {
    this.$api.aindex.getGeneralOrderAndMaterial({isAdmin: true}).then(res => {
      if (res.ret == 0) {
        this.detail = res.data ? res.data : {};
      } else {
        this.$gidMessage(res.msg);
      }
    });
  }
  timeChange(val) {
    this.getGeneralOfflineReportData();
  }
}
</script>

<style lang="scss" scoped>
.main-page {
  .title {
    height: 50px;
    line-height: 50px;
    border-radius: 4px;
    background-color: #fff;
    padding: 0 20px;
    font-size: 16px;
    color: #666;
    font-weight: bold;
  }
  .data-show {
    padding: 15px 0 20px;
    display: flex;
    .item {
      flex: 0 0 18%;
      width: 18%;
      padding-top: 12%;
      background-color: #fff;
      border-radius: 5px;
      position: relative;
      &:not(:last-child) {
        margin-right: 2.5%;
      }
      &:nth-child(1) {
        background: url("~@/assets/images/findex-bg-ball.png") right center/100%
            100% no-repeat,
          url("~@/assets/images/findex-bg2.jpg") center/100% 100% no-repeat;
      }
      &:nth-child(2) {
        background: url("~@/assets/images/findex-bg-ball.png") right center/100%
            100% no-repeat,
          url("~@/assets/images/findex-bg3.jpg") center/100% 100% no-repeat;
      }
      &:nth-child(3) {
        background: url("~@/assets/images/findex-bg-ball.png") right center/100%
            100% no-repeat,
          url("~@/assets/images/findex-bg4.jpg") center/100% 100% no-repeat;
      }
      &:nth-child(4) {
        background: url("~@/assets/images/findex-bg-ball.png") right center/100%
            100% no-repeat,
          url("~@/assets/images/findex-bg5.jpg") center/100% 100% no-repeat;
      }
      &:nth-child(5) {
        background: url("~@/assets/images/findex-bg-ball.png") right center/100%
            100% no-repeat,
          url("~@/assets/images/findex-bg6.jpg") center/100% 100% no-repeat;
      }
      .item-title {
        position: absolute;
        top: 15%;
        left: 10%;
        color: #fff;
        font-size: 14px;
        font-weight: bold;
      }
      .item-data {
        font-size: 40px;
        font-weight: bold;
        position: absolute;
        top: 30%;
        left: 10%;
        color: #fff;
      }
    }
  }
  .data-map {
    background-color: #fff;
    border-radius: 5px;
    .map-title {
      padding: 20px;
      font-size: 16px;
      color: #333;
      font-weight: bold;
    }
    .map-handle {
      padding: 0 20px;
      .time-box {
        float: right;
      }
    }
    .map {
      width: 100%;
      height: calc(45vh);
    }
  }
}
</style>

