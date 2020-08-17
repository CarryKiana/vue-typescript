<template>
  <transition name="fade">
    <div class="success-tip-page" v-if="isShow">
      <div class="success-tip-box">
        <div class="success-tip-title">{{cTitle}}</div>
        <div class="success-tip-times">{{showTime}}{{cUnit}}&nbsp;{{cSubtitle}}</div>
      </div>
    </div>
  </transition>
</template>
<script>
export default {
  name: "gid-success",
  props: {
    pTitle: {
      type: String,
      default: ""
    },
    pTime: {
      type: Number
    },
    pUnit: {
      type: String,
      default: ""
    },
    pSuntitle: {
      type: String,
      default: ""
    },
    handleCallback: {
      type: Function
    }
  },
  data() {
    return {
      title: "修改密码成功！",
      time: 3,
      unit: "s",
      subtitle: "后跳转至登录页",
      showTime: 0,
      isShow: true,
      successCallback: null
    };
  },
  computed: {
    cTitle() {
      return this.pTitle || this.title;
    },
    cTime() {
      return this.pTime || this.time;
    },
    cUnit() {
      return this.pUnit || this.unit;
    },
    cSubtitle() {
      return this.pSubtitle || this.subtitle;
    }
  },
  mounted() {
    this.showTime = this.cTime;
    this.autoPlay();
  },
  methods: {
    autoPlay() {
      setTimeout(() => {
        if (this.showTime > 1) {
          this.showTime--;
          this.autoPlay();
        } else {
          this.showTime = 0;
          this.callback();
        }
      }, 1000);
    },
    callback() {
      if (this.handleCallback) {
        this.handleCallback();
      }
      if (this.successCallback) {
        this.successCallback();
      }
      this.isShow = false;
      this.$emit("success");
    }
  }
};
</script>
<style lang="scss" scoped>
.success-tip-page {
  background: url(~@/assets/images/dspadmin_bg.png) center center/cover #fff
    no-repeat;
  min-height: 100vh;
  left: 0;
  right: 0;
  top: 0;
  min-width: 1280px;
  background-color: #fff;
  position: absolute;
  z-index: 100;
  .success-tip-box {
    width: 300px;
    height: 300px;
    margin: 0 auto;
    background: url(~@/assets/images/icon-i-get-it.png) no-repeat center center;
    position: absolute;
    top: calc(50% - 150px);
    left: calc(50% - 150px);
    .success-tip-title {
      text-align: center;
      color: #0058e6;
      font-size: 24px;
    }
    .success-tip-times {
      position: absolute;
      bottom: 10px;
      width: 100%;
      text-align: center;
      color: #999;
      opacity: 0.7;
      font-size: 14px;
    }
  }
}
</style>
