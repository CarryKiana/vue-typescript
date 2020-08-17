<template>
  <transition name="fade">
    <div
      class="nav-notice gid-message"
      :class="{noheight: !isShowHeight, blue: cIsSuccess}"
      v-if="isShow"
    >
      <p>
        <span class="notice-msg">{{cMessage}}</span>
        <em class="notice-close" v-if="cShowClose" @click="close">&times;</em>
      </p>
    </div>
  </transition>
</template>

<script>
export default {
  name: "gid-message",
  props: {
    message: {
      type: String,
      default: ""
    },
    isSuccess: {
      type: Boolean,
      default: false
    },
    showClose: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      dMessage: "",
      time: 3000,
      isShowHeight: true,
      isShow: true,
      dIsSuccess: null,
      dShowClose: false
    };
  },
  computed: {
    cMessage() {
      return this.dMessage || this.message;
    },
    cIsSuccess() {
      return this.dIsSuccess || this.isSuccess;
    },
    cShowClose() {
      return this.dShowClose || this.showClose;
    }
  },
  watch: {
    isShowHeight: {
      handler: function() {
        if (this.isShowHeight == false) {
          setTimeout(() => {
            this.isShow = false;
          }, 2000);
        }
      }
    }
  },
  mounted() {
    this.autoClose();
  },
  methods: {
    autoClose() {
      setTimeout(() => {
        this.isShowHeight = false;
      }, this.time);
    },
    close() {
      this.isShowHeight = false;
    }
  }
};
</script>
<style lang="scss" scoped>
.gid-message {
  min-width: 250px;
  position: fixed;
  width: auto;
  padding: 0 50px 0 30px;
  top: 59px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 99999;
  overflow: hidden;
  background-color: rgba($color: #fd7075, $alpha: 0.7);
  transition: all 0.5s;
  &.blue {
    background-color: rgba($color: #3a78ff, $alpha: 0.7);
  }
  .notice-close {
    cursor: pointer;
    margin-left: 15px;
    font-size: 20px;
    color: #999;
  }

  &.noheight {
    height: 0;
  }

  p {
    padding: 8px 10px 12px 10px;
    text-align: center;
    color: #fff;
    font-size: 14px;
    position: relative;
    padding: 10px;
    .notice-msg {
      position: relative;
      font-weight: bold;
    }
    .notice-close {
      position: absolute;
      top: 6px;
      right: -20px;
    }
  }
}
</style>
