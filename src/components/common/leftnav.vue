<template>
  <div class="leftnav">
    <div class="logo" @click="logoAction"></div>
    <el-row>
      <el-col>
        <el-menu
          :default-active="$route.path"
          class="el-menu-vertical-demo"
          :default-openeds="['1','2']"
          @open="handleOpen"
          @close="handleClose"
          router
          background-color="#676D7F"
          text-color="#fff"
        >
          <template v-for="(item,index) in routes" v-if="!item.hidden">
            <el-submenu :index="index+''" v-if="!item.leaf&&showItem(item)" :key="index">
              <template slot="title">
                <i :class="item.icon"></i>
                {{item.meta.name}}
              </template>
              <el-menu-item
                v-for="child in item.children"
                :index="child.path"
                :key="child.path"
                v-if="!child.hidden&&showItem(item)"
              >{{child.meta.name}}</el-menu-item>
            </el-submenu>
            <el-menu-item
              v-if="item.leaf&&item.children.length>0&&showItem(item)"
              :index="item.children[0].path"
              class="oneitem"
              :key="index"
            >
              <i :class="item.icon"></i>
              {{item.children[0].meta.name}}
            </el-menu-item>
          </template>
        </el-menu>
      </el-col>
    </el-row>
  </div>
</template>
<script>
import { backRoutes } from "@/router/router";
import { mapGetters } from "Vuex";
export default {
  name: "leftnav",
  data() {
    return {
      routes: backRoutes
    };
  },
  computed: {
    ...mapGetters(["user"])
  },
  mounted() {},
  methods: {
    handleOpen(key, keyPath) {},
    handleClose(key, keyPath) {},
    showItem(item) {
      return item.meta.access.indexOf(+this.user.userType) != -1;
    },
    logoAction() {
      if (this.user.userType == 1) {
        this.$router.push({ path: "/user" });
      } else if (this.user.userType == 2 || this.user.userType == 3) {
        this.$router.push({ path: "/aindex" });
      }
    }
  }
};
</script>
<style lang="scss" scoped>
.logo {
  width: 138px;
  height: 60px;
  cursor: pointer;
  font-family: MicrosoftYaHei;
  font-weight: 700;
  font-size: 20px;
  color: #ffffff;
  background: url(~@/assets/images/logo.png) center no-repeat;
}
</style>
