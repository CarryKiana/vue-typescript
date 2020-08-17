<template>
  <div class="ybarchart" :class="{ nochart: showBg }" :style="{height:height,width:width}"></div>
</template>
<script>
export default {
  name: "yBarChart", // 纵向柱状折线图
  props: {
    width: {
      type: String,
      default: "100%"
    },
    height: {
      type: String,
      default: "100%"
    },
    rotate: {
      type: Number,
      default: 0
    },
    unit: {
      type: String,
      default: "%"
    },
    chartData: {
      type: Object,
      require: true,
      default: function() {
        return {
          title: "",
          AxisDate: [],
          data: []
        };
      }
    },
    mixOptions: {
      type: Object,
      default: function() {
        return {};
      }
    },
    noMaxYAxis: {
      type: Boolean,
      default: false
    },
    isdispose: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      chart: null,
      showBg: false

      // chartData: {
      //     AxisDate:['OPPO', 'vivo', '华为', '小米', '苹果', '三星', '魅族', '金立', '乐视', '酷派'],
      //     data: ['33.33', '20.52', '13.32', '10.06', '9.63', '5.66', '2.43', '1.04', '0.66', '0.60'],
      //     title: '设备品牌',
      //     paramName: '收入(元)'
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
    let resizeEvt =
      "orientationchange" in window ? "orientationchange" : "resize";
    window.addEventListener(resizeEvt, this.chart.resize, false);
    document.addEventListener("DOMContentLoaded", this.chart.resize, false);
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
        grid: {
          left: "10%",
          right: "10%",
          bottom: "10%",
          top: "10%",
          containLabel: true
        },
        tooltip: {
          trigger: "axis",
          formatter: "{b} <br/> {a} : {c}" + this.unit
        },
        xAxis: [
          {
            type: "category",
            data: data.AxisDate,
            axisLabel: {
              rotate: this.rotate
            }
          }
        ],
        yAxis: [
          {
            type: "value",
            name: this.chartData.paramName,
            // max: 100,
            axisLabel: { formatter: "{value} " + this.unit },
            splitLine: {
              lineStyle: {
                type: "dashed"
              }
            }
          }
        ],
        series: [
          {
            name: data.title,
            type: "bar",
            data: data.data,
            barWidth: 20,
            itemStyle: {
              normal: {
                color: function(params) {
                  // build a color map as your need.
                  var colorList = [
                    "#3A78FF",
                    "#3A78FF",
                    "#3A78FF",
                    "#3A78FF",
                    "#3A78FF",
                    "#3A78FF",
                    "#3A78FF",
                    "#3A78FF",
                    "#3A78FF",
                    "#3A78FF",
                    "#3A78FF",
                    "#3A78FF",
                    "#3A78FF",
                    "#3A78FF",
                    "#3A78FF",
                    "#3A78FF",
                    "#3A78FF",
                    "#3A78FF",
                    "#3A78FF",
                    "#3A78FF"
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

        option.yAxis[0].name = data.title;

        option.yAxis.push({
          type: "value",
          name: data.title2,
          position: "right",
          axisLabel: {
            formatter: "{value}"
          },
          splitLine: {
            lineStyle: {
              type: "dashed"
            }
          }
        });

        option.series.push({
          name: data.title2,
          data: data.data2,
          type: "line",
          smooth: true,
          symbol: "circle",
          showSymbol: true,
          yAxisIndex: 1,
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
      if (this.noMaxYAxis) {
        option.yAxis[0].max = null;
        // option.yAxis[0]. minInterval = 1;
      }

      option = Object.assign(option, this.mixOptions);

      this.chart.setOption(option);
    }
  }
};
</script>
<style lang="scss" scoped>
.nochart {
  background: url(../../assets/images/bg-ybar.png) no-repeat center !important;
  & /deep/ div {
    visibility: hidden;
  }
}
</style>

