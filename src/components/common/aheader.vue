<template>
  <div class="a-header">
    <div class="title">系统管理</div>
    <div class="right-wrap">
      <div class="welcome">
        您好~
        <span>{{user |userNameFilter}}</span>
      </div>
      <div class="exit" @click="changepass">修改密码</div>
      <div class="exit" @click="logout">退出</div>
    </div>
  </div>
</template>
 
 
<script>
import { mapGetters } from "Vuex";
export default {
  name: "aheader",
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["user"])
  },
  filters: {
    userNameFilter(user) {
      return (
        user.loginName ||
        (user.phone
          ? user.phone.replace(/^(\w{3})(\w{4})(\w*)$/, "$1****$3")
          : "")
      );
    }
  },
  mounted() {},
  methods: {
    logout() {
      this.$api.login.logout().then(res => {
        if (res.ret == 0) {
          this.$store.dispatch("delUserInfo");
          this.$router.push({ path: "/" });
        } else {
          this.$gidMessage(res.msg);
        }
      });
    },
    // 前往修改密码
    changepass() {
      this.$router.push({ path: "/changepass" });
    }
  }
};
</script>
<style lang="scss" scoped>
</style>
