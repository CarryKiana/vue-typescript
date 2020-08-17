<template>
  <div
    class="time-box"
    :class="{ active: active }"
    @mousedown="changeActive"
    @mouseup="changeActive"
  >
    <span
      class="time-value"
      :class="{active: timeActiveNum == item}"
      v-for="(item,index) in timeArr"
      :key="index"
      @click="changeTime(item)"
    >近{{item}}天</span>
    <el-date-picker
      v-model="value"
      prefix-icon=" "
      type="daterange"
      range-separator="-"
      value-format="yyyy-MM-dd"
      start-placeholder="开始日期"
      end-placeholder="结束日期"
      :picker-options="pickerOptions"
      :clearable="clearable"
    ></el-date-picker>
  </div>
</template>
<script>
export default {
  name: "daterangepicker",
  model: {
    prop: "initTime"
  },
  props: {
    initTime: {
      type: Array,
      default: function() {
        return [];
      }
    },
    clearable: {
      type: Boolean,
      default: true
    },
    pickerOptions: {
      type: Object,
      default: function() {
        return {
          disabledDate(time) {
            return time.getTime() > Date.now() - 8.64e6;
          }
        };
      }
    }
  },
  data() {
    return {
      value: "",
      active: false,
      timeArr: [3, 7, 30],
      timeActiveNum: "",
      timeActive: false,
      isInit: true
    };
  },
  computed: {},
  watch: {
    value() {
      if (this.timeActive || this.isInit) {
        this.timeActive = false;
      } else {
        this.timeActiveNum = "";
      }
      this.$emit("input", this.value);
      if (!this.isInit) {
        this.$emit("change", this.value);
      } else {
        this.isInit = false;
      }
    }
  },
  created() {
    if (this.initTime) {
      this.value = [this.initTime[0], this.initTime[1]];
      this.timeActiveNum =
        (new Date(this.initTime[1]) - new Date(this.initTime[0])) /
          (24 * 3600 * 1000) +
        1;
    }
  },
  methods: {
    changeTime(num) {
      this.timeActive = true;
      let today = new Date();
      let end = new Date(today - 24 * 3600 * 1000);
      let start = new Date(end - (num - 1) * 24 * 3600 * 1000);
      this.timeActiveNum = num;
      this.value = [this.timeFormat(start), this.timeFormat(end)];
    },
    timeFormat(val) {
      return (
        val.getFullYear() +
        "-" +
        (val.getMonth() + 1).toString().padStart(2, "0") +
        "-" +
        val
          .getDate()
          .toString()
          .padStart(2, "0")
      );
    },
    changeActive() {
      this.active = !this.active;
    }
  }
};
</script>
<style lang="scss" scoped>
.time-box {
  border: 1px solid #dcdfe6;
  background-color: #fff;
  width: 450px;
  &:hover {
    border-color: #c0c4cc;
  }
  &.active {
    border-color: #006cff;
  }
  .time-value {
    padding: 0 10px;
    vertical-align: top;
    line-height: 32px;
    position: relative;
    color: #999;
    cursor: pointer;
    &:hover,
    &.active {
      color: #0058e6;
    }
    &:after {
      position: absolute;
      content: "";
      width: 1px;
      background-color: #dcdfe6;
      height: 20px;
      right: -2px;
      top: 0px;
    }
  }
  .el-range-editor {
    width: 250px;
    height: 32px;
    line-height: 32px;
    border: none;
    & /deep/ {
      .el-range-icon {
        display: none;
      }
      .el-range-separator {
        line-height: 24px;
      }
      .el-range__close-icon {
        line-height: 24px;
      }
    }
  }
}
</style>
