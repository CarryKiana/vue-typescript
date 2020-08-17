<template>
  <div class="doublelinechart" :class="{nochart: showBg}" :style="{height:height,width: width}"></div>
</template>
<script>
export default {
  name: "doublelinechart", // 双折线图
  props: {
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "100%"
    },
    chartData: {
      type: Object,
      required: true,
      default: function() {
        return {
          title: "数据趋势图",
          xAxisData: [],
          data: [],
          data2: [],
          unit: "unit",
          unit2: "unit2",
          paramName: "paramName",
          paramName2: "paramName2"
        };
      }
    },
    mixOptions: {
      type: Object,
      default: function() {
        return {};
      }
    }
  },
  data() {
    return {
      chart: null,
      showBg: false
    };
  },
  watch: {
    chartData: {
      handler: function() {
        if (this.isdispose) {
          this.chart && this.chart.dispose();
        }
        this.chart = this.$echarts.init(this.$el, "theme");
        this.drawChart(this.chartData);
      }
    }
  },
  mounted() {
    if (this.isdispose) {
      this.chart && this.chart.dispose();
    }
    this.chart = this.$echarts.init(this.$el, "theme");
    this.drawChart(this.chartData);
    let resizeEvt =
      "orientationchange" in window ? "orientationchange" : "resize";
    window.addEventListener(resizeEvt, this.chart.resize, false);
    document.addEventListener("DOMContentLoaded", this.chart.resize, false);
  },
  methods: {
    // 处理数据都为0的情况
    checkZero() {
      if (this.chartData.data.length == 0 && this.chartData.data2.length == 0) {
        this.showBg = true;
      } else {
        this.showBg = false;
      }
    },
    drawChart(data) {
      this.checkZero();
      if (this.showBg) {
        return;
      }
      let option = {};
      if (this.chartData.paramName2 == "无") {
        option = {
          legend: {
            bottom: 50,
            right: 50,
            itemGap: 30,
            itemWidth: 16,
            textStyle: {
              color: "#666"
            },
            data: [
              {
                name: this.chartData.paramName
              }
            ],
            selectedMode: false
          },
          title: {
            show: true,
            text: this.chartData.title,
            textStyle: {
              color: "#000",
              fontSize: 16,
              fontWeight: "700"
            },
            top: "25",
            left: "30"
          },
          color: ["#84D8BA", "#365CFF"],
          tooltip: {
            trigger: "axis",
            backgroundColor: "#fff",
            padding: 0,
            formatter: params => {
              return (
                ' <div style="padding:14px 20px;box-shadow: 0 1px 8px 0 #DDDDDD;border-radius: 5px;">' +
                params[0].axisValue +
                "<br/>" +
                params[0].seriesName +
                "：<span style='font-size: 16px;color:#84D8BA;font-weight: 700;line-height: 22px;margin-right:25px;'>" +
                params[0].data +
                this.chartData.unit +
                "</span>" +
                "</div>"
              );
            },
            textStyle: {
              color: "#333",
              fontSize: 12
            }
          },
          grid: {
            left: "40",
            top: "170",
            right: "40",
            bottom: "100",
            containLabel: true
          },
          xAxis: [
            {
              type: "category",
              boundaryGap: true,
              data: this.chartData.xAxisData
            }
          ],
          yAxis: [
            {
              type: "value",
              name: this.chartData.paramName,
              splitNumber: 10,
              minInterval: 1,
              //max: dataList.unit ? '100' : null,
              axisLabel: {
                formatter: "{value}" + this.chartData.unit
              },

              splitLine: {
                lineStyle: {
                  type: "dashed"
                }
              }
            }
          ],
          series: [
            {
              name: this.chartData.paramName,
              data: this.chartData.data,
              type: "line",
              smooth: true,
              showSymbol: true,
              symbolSize: "6",
              itemStyle: {
                normal: {
                  lineStyle: {
                    // 系列级个性化折线样式
                    width: 3
                    //shadowColor: 'rgba(0,0,0,0.13)',
                    //shadowBlur: 5,
                    //shadowOffsetY: 6,
                  }
                }
              }
            }
          ]
        };
      } else {
        option = {
          legend: {
            bottom: 50,
            right: 50,
            itemGap: 30,
            itemWidth: 16,
            textStyle: {
              color: "#666"
            },
            data: [
              {
                name: this.chartData.paramName
              },
              {
                name: this.chartData.paramName2
              }
            ],
            selectedMode: false
          },
          title: {
            show: true,
            text: this.chartData.title,
            textStyle: {
              color: "#000",
              fontSize: 16,
              fontWeight: "700"
            },
            top: "25",
            left: "30"
          },
          color: ["#84D8BA", "#365CFF"],
          tooltip: {
            trigger: "axis",
            backgroundColor: "#fff",
            padding: 0,
            formatter: params => {
              let str =
                ' <div style="padding:14px 20px;box-shadow: 0 1px 8px 0 #DDDDDD;border-radius: 5px;">' +
                params[0].axisValue +
                "<br/>" +
                params[0].seriesName +
                "：<span style='font-size: 16px;color:#84D8BA;font-weight: 700;line-height: 22px;margin-right:25px;'>" +
                params[0].data +
                this.chartData.unit +
                "</span>";
              if (params[1]) {
                str +=
                  params[1].seriesName +
                  "：<span style='font-size: 16px;color:#7D96FF;font-weight: 700;line-height: 22px;'>" +
                  params[1].data +
                  this.chartData.unit2 +
                  "</span>";
              }
              str += "</div>";
              return str;
            },
            textStyle: {
              color: "#333",
              fontSize: 12
            }
          },
          grid: {
            left: "40",
            top: "50",
            right: "40",
            bottom: "100",
            containLabel: true
          },
          xAxis: [
            {
              type: "category",
              boundaryGap: true,
              data: this.chartData.xAxisData
            }
          ],
          yAxis: [
            {
              type: "value",
              name: this.chartData.paramName,
              splitNumber: 10,
              minInterval: 1,

              //max: dataList.unit ? '100' : null,
              axisLabel: {
                formatter: "{value}" + this.chartData.unit
              },

              splitLine: {
                lineStyle: {
                  type: "dashed"
                }
              }
            },
            {
              type: "value",
              name: this.chartData.paramName2,
              splitNumber: 10,
              //max: dataList.unit2 ? '100' : null,
              minInterval: 1,
              position: "right",
              axisLabel: {
                formatter: "{value}" + this.chartData.unit2
              },
              splitLine: {
                lineStyle: {
                  type: "dashed"
                }
              }
            }
          ],
          series: [
            {
              name: this.chartData.paramName,
              data: this.chartData.data,
              type: "line",
              smooth: true,
              showSymbol: true,
              symbolSize: "6",
              itemStyle: {
                normal: {
                  lineStyle: {
                    // 系列级个性化折线样式
                    width: 3
                    //shadowColor: 'rgba(0,0,0,0.13)',
                    //shadowBlur: 5,
                    //shadowOffsetY: 6,
                  }
                }
              }
            },
            {
              name: this.chartData.paramName2,
              data: this.chartData.data2,
              type: "line",
              smooth: true,
              showSymbol: true,
              yAxisIndex: 1,
              symbolSize: "6",
              itemStyle: {
                normal: {
                  lineStyle: {
                    // 系列级个性化折线样式
                    width: 3
                    //shadowColor: 'rgba(0,0,0,0.13)',
                    //shadowBlur: 5,
                    //shadowOffsetY: 6,
                  }
                }
              }
            }
          ]
        };
      }

      //todo
      //IE10下不能使用itemStyle.shadow,会报错 SCRIPT65535: 意外地调用了方法或属性访问。
      if (
        navigator.userAgent.indexOf("MSIE") == "-1" &&
        navigator.userAgent.indexOf(".NET") == "-1"
      ) {
        // $.each(option.series, function(index, value, array) {
        //   value.itemStyle.normal.lineStyle = {
        //     width: 3,
        //     shadowColor: "rgba(0,0,0,0.13)",
        //     shadowBlur: 5,
        //     shadowOffsetY: 6
        //   };
        // });
        option.series.forEach(value => {
          value.itemStyle.normal.lineStyle = {
            width: 3,
            shadowColor: "rgba(0,0,0,0.13)",
            shadowBlur: 5,
            shadowOffsetY: 6
          };
        });
      }
      option = Object.assign(option, this.mixOptions);
      this.chart.setOption(option);
    }
  }
};
</script>
<style lang="scss" scoped>
.nochart {
  background: url(../../assets/images/double-line-default.png) no-repeat center !important;
  & /deep/ div {
    visibility: hidden;
  }
}
</style>