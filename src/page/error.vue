<template>
  <div class="error-page">
    <div class="nopage">
      <div class="notice">该页面迷路了，还是回首页看看吧～</div>
      <div class="time">
        <span>{{seconds}}</span> 秒后
        <a @click="goIndex()">返回首页</a>
      </div>
    </div>
  </div>
</template>
 
<script lang="ts">
import { Vue, Component } from 'vue-property-decorator'

@Component
export default class PageError extends Vue {
  seconds:number = 5
  timer:any = null

  beforeMount() {
    var self = this;
    self.timer = setInterval(task, 1000);
    function task() {
      var n = self.seconds
      n--;
      if (n > 0) {
        self.seconds = n;
      } else {
        self.$router.push({ path: "/" });
      }
    }
  }
  destroyed() {
    clearInterval(this.timer);
  }
  //首页
  goIndex() {
    this.$router.push({ path: "/" });
  }
}
</script>
<style lang="scss" scoped>
</style>
