<template>
  <div class="xbarchart" :class="{ nochart: showBg }" :style="{height:height,width:width}"></div>
</template>
<script>
export default {
  name: "xBarChart", // 横向柱状图

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
      require: true,
      default: function() {
        return {
          title: "设备品牌",
          AxisDate: [],
          data: []
        };
      }
    },
    unit: {
      type: String,
      default: "%"
    },
    mixOptions: {
      type: Object,
      default: function() {
        return {};
      }
    },
    tooltipSimple: {
      type: Boolean,
      default: false
    },
    isdispose: {
      type: Boolean,
      default: false
    },
    xbarMax: {
      type: Number,
      default: null
    }
  },
  data() {
    return {
      chart: null,
      showBg: false
      // chartData: {
      //     AxisDate:["军事资讯", "报纸杂志", "学术资讯", "社会生活", "汽车资讯", "财经资讯", "综合资讯", "体育资讯", "游戏攻略", "时尚娱乐", "科技资讯", "时政要闻", "本地新闻", "国内新闻", "国际新闻"],
      //     data: ["0.01", "0.07", "0.15", "0.24", "0.28", "2.31", "3.14", "3.59", "4.03", "6.23", "14.83", "16.28", "16.28", "16.28", "16.28"],
      //     title: '新闻资讯'
      // }
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
  },
  methods: {
    // 处理数据都为0的情况
    checkZero() {
      if (
        this.chartData.data.length == 0 ||
        this.chartData.data.every(item => item == 0)
      ) {
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
      let option = {
        tooltip: {
          trigger: "item",
          formatter: "{b} <br/>{a} : {c}" + this.unit
        },
        grid: {
          left: "15%",
          right: "15%",
          bottom: "5%",
          top: "5%",
          containLabel: true
        },
        xAxis: [
          {
            // min: -5,
            max: this.xbarMax,
            type: "value",
            axisLabel: {
              show: false,
              interval: "0",
              formatter: "{value}" + this.unit
            },
            axisLine: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            }
            // inverse: true
          }
        ],
        yAxis: [
          {
            type: "category",
            data: data.AxisDate,
            splitLine: {
              show: false
            },
            axisLine: {
              show: false
            },
            axisTick: {
              show: false
            }
          }
        ],
        series: [
          {
            name: data.title,
            type: "bar",
            data: data.data,
            barWidth: 10,
            label: {
              normal: {
                show: true,
                position: "right",
                formatter: "{c}" + this.unit
              }
            },
            itemStyle: {
              normal: {
                barBorderRadius: 10,
                color: function(params) {
                  // build a color map as your need.
                  var colorList = [
                    "#e05155",
                    "#7ca5e2",
                    "#eca66a",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA",
                    "#CCB2AA"
                  ];
                  return colorList[data.data.length - 1 - params.dataIndex];
                }
              }
            }
          }
        ]
      };

      //触媒偏好-添加第二y轴 折线
      if (data.showLine) {
        option.grid.bottom = "15%";

        option.visualMap = [
          {
            show: false,
            type: "continuous",
            seriesIndex: 1,
            dimension: 0,
            min: 0,
            max: data.AxisDate.length - 1,
            color: ["#ECA66A", "#E05155"]
          }
        ];
        option.xAxis.push({
          type: "value",
          name: data.title2,
          position: "bottom",
          nameLocation: "start",
          nameTextStyle: {
            color: "#999"
          },
          offset: 15,
          axisLabel: {
            formatter: "{value}"
          },

          axisLine: {
            show: true,
            lineStyle: {
              color: "#EFEFEF"
            }
          },
          splitLine: {
            show: false
          },
          axisTick: {
            show: true
          }
        });

        option.series.push({
          name: data.title2,
          data: data.data2,
          type: "line",
          smooth: true,
          symbol: "circle",
          showSymbol: true,
          xAxisIndex: 1,
          symbolSize: "6",
          itemStyle: {
            normal: {
              lineStyle: {
                width: 3,
                shadowColor: "rgba(0,0,0,0.15)",
                shadowBlur: 4,
                shadowOffsetY: 6
              }
            }
          }
        });
        option.tooltip = {
          trigger: "axis",
          formatter: function(params) {
            return (
              params[0].axisValue +
              "<br/>" +
              params[0].seriesName +
              " : " +
              params[0].data +
              "%<br/>" +
              params[1].seriesName +
              " : " +
              params[1].data
            );
          }
        };
      }

      if (this.tooltipSimple) {
        option.tooltip = {
          trigger: "item",
          formatter: "{b}: {c}" + this.unit,
          padding: [5, 20, 5, 10]
        };
      }

      option = Object.assign(option, this.mixOptions);
      this.chart.setOption(option);
    }
  }
};
</script>
<style lang="scss" scoped>
.nochart {
  background: url(../../assets/images/bg-xbar.png) no-repeat center !important;
  & /deep/ div {
    visibility: hidden;
  }
}
</style>