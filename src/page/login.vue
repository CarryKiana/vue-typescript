<template>
  <div class="login-page">
    <div class="content">
      <div class="title">登录</div>
      <div class="subtitle">DSP后台管理系统</div>
      <el-form ref="loginform" class="login-form" :model="form" :rules="formRules">
        <el-form-item class="login-item" prop="loginName">
          <el-input class="loginName" placeholder="请输入手机号" v-model.trim="form.loginName">
            <i slot="prefix" class="el-input__icon"></i>
          </el-input>
        </el-form-item>
        <el-form-item class="login-item" prop="password">
          <el-input class="password" type="password" placeholder="请输入密码" v-model="form.password">
            <i slot="prefix" class="el-input__icon"></i>
          </el-input>
        </el-form-item>
        <el-form-item class="login-item" prop="code">
          <el-input class="code" placeholder="请输入图形验证码" v-model="form.code">
            <i slot="prefix" class="el-input__icon"></i>
          </el-input>
          <div class="code-box picture-box">
            <img class="code-img" :src="pictureCode" alt>
            <span class="refresh" @click="getPictureCode"></span>
          </div>
        </el-form-item>
        <el-form-item class="login-item" prop="smsVerificationCode">
          <el-input class="code" placeholder="请输入短信验证码" v-model="form.smsVerificationCode">
            <i slot="prefix" class="el-input__icon"></i>
          </el-input>
          <div class="code-box">
            <div
              class="get-code-btn"
              :class="{disable: smsMessage !='获取短信验证码'}"
              @click="getPhoneCode"
            >{{smsMessage}}</div>
          </div>
        </el-form-item>
        <div class="login-item" style="height:30px;">
          <el-checkbox class="left" v-model="remember">记住用户名</el-checkbox>
          <span class="right" @click="getUserType">忘记密码</span>
        </div>
        <el-form-item class="login-item">
          <div class="confirm-btn" @click="login">登录</div>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog :visible.sync="advDialogVisible" width="320px" center top="30vh">
      <div class="list-wrap">
        <p class="dialog-h" style="text-align:center;">提示</p>
        <p style="text-align:center;">请您关闭广告拦截插件，
          <br>或将本网站加入插件白名单,
          <br>否则将影响产品功能的使用
        </p>
      </div>
      <div class="btn-line">
        <div class="btn-center">
          <em class="dialog-btn" @click="advDialogVisible= false">确定</em>
          <em class="dialog-btn cancel" @click="advDialogVisible=false">取消</em>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script lang="ts">
import { getUid } from "@/utils/uuid";
import { mapGetters } from "Vuex";
import { JSEncrypt } from "jsencrypt";
import { Vue, Component, Prop } from 'vue-property-decorator'
import { Getter, Action } from 'vuex-class'

let validatePhone = (rule, value, callback) => {
  if (value == "") {
    callback(new Error("请输入手机号"));
  } else if (/^1\d{10}$/g.test(value) === false) {
    callback(new Error("手机号格式错误"));
  } else {
    callback();
  }
};
let validatePass = (rule, value, callback) => {
  if (value == "") {
    callback(new Error("请输入密码"));
  } else {
    callback();
  }
};
let validateCode = (rule, value, callback) => {
  if (value == "") {
    callback("请输入图形验证码");
  } else if (value.length != 4) {
    callback("验证码格式错误");
  } else {
    callback();
  }
};
let validateSmsCode = (rule, value, callback) => {
  if (value == "") {
    callback("请输入短信验证码");
  } else if (value.length != 6) {
    callback("验证码格式错误");
  } else {
    callback();
  }
};

@Component({})
export default class Login extends Vue {
  form = {
    loginName: "",
    password: "",
    code: "",
    smsVerificationCode: "",
    uuid: ""
  }
  formRules = {
    loginName: [{ validator: validatePhone }],
    password: [{ validator: validatePass }],
    code: [{ validator: validateCode }],
    smsVerificationCode: [{ validator: validateSmsCode }]
  }
  smsMessage = "获取短信验证码" // 获取短信验证码文案
  smsTime = 60 // 短信验证码获取间隔
  pictureCode = "" // 图片验证码路径
  remember = false // 记住密码
  advDialogVisible = false
  sysUserType:any = ''
  @Getter('user') user;
  created() {
    this.getPictureCode();
    this.remember = !!this.user.remember;
    if (this.remember) {
      this.form.loginName = this.user.phone;
    }
    document.addEventListener("keyup", ev => {
      if (ev.keyCode == 13 && !this['_isDestroyed']) {
        this.login();
      }
    });
    // if (!window.killads) {
    if (!window.hasOwnProperty('killads')) {
      this.advDialogVisible = true;
    }
  }
  // 前往忘记密码页面
  goToForgotPage() {
    this.$router.push({
      name: "forgot",
      params: { phone: this.form.loginName }
    });
  }
  // 生成uuid参数
  initUuid() {
    this.form.uuid = getUid();
  }
  // 获取/刷新图形验证码
  getPictureCode() {
    this.initUuid();
    this.pictureCode = this.$api.login.getPictureCode(this.form.uuid);
  }
  // 获取短信验证码
  getPhoneCode() {
    if (this.smsTime != 60) {
      return;
    }
    this.$refs.loginform['validateField']("loginName", errorMessage => {
      if (!errorMessage) {
        let data = {
          mobile: this.form.loginName
        };
        this.$api.login.getUserType(data).then(res => {
          if (res.ret == 0) {
            let data = {
              phone: this.form.loginName,
              smsVerificationCodeType: 0
            };
            this.$api.login.getPhoneCode(data).then(res => {
              if (res.ret == 0) {
                this.downTime();
                this.$gidMessage("获取短信验证码成功", true);
              } else {
                this.$gidMessage(res.ret);
              }
            });
          } else {
            this.$gidMessage(res.msg);
          }
        });
      }
    });
  }
  // 短信验证码获取间隔计时
  downTime() {
    this.smsMessage = this.smsTime-- + "S 后再次获取";
    if (this.smsTime >= 0) {
      setTimeout(_ => {
        this.downTime();
      }, 1000);
    } else {
      this.smsMessage = "获取短信验证码";
      this.smsTime = 60;
    }
  }
  // 查询用户类型
  getUserType() {
    this.$refs.loginform['validateField']("loginName", errorMessage => {
      if (!errorMessage) {
        let data = {
          mobile: this.form.loginName
        };
        this.$api.login.getUserType(data).then(res => {
          if (res.ret == 0) {
            // 用户类型：(内部：1系统管理人员，2运营管理人员，3投放运营人员)，(外部：4广告代理商，5广告主)
            this.sysUserType = res.msg;
            if (this.sysUserType == 4 || this.sysUserType == 5) {
              this.$gidMessage("您不具备后台修改的权限");
            } else {
              this.goToForgotPage();
            }
          } else {
            this.$gidMessage(res.msg);
          }
        });
      }
    });
  }
  // 登录
  login(): void {
    this.$refs.loginform['validate'](valid => {
      if (valid) {
        let encryptor = new JSEncrypt();
        encryptor.setPublicKey(
          "MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCL6wzyRJ9q99pY05klTS4xu8dH3c2byXdIowVXOHoHwi4mvoB6CXZ72qBhSXIoPEKnWfk46cigBytUk3+YlF+hPzZaL9/XbTj7+xrUm9B3ZTZCTDKWL3OtoXStSmiZkbIxLJNuFaDfoIRFnDMmP28IYWo4nsV3dQKGmVDlUZ0UewIDAQAB"
        );
        let data = Object.assign({}, this.form);
        data.password = encryptor.encrypt(data.password);
        this.$api.login.login(data).then(res => {
          if (res.ret == 0) {
            this.$api.login
              .onlyOneLogin({ configValue: res.data.sessionId })
              .then(_ => {
                let data = Object.assign(
                  {},
                  { remember: this.remember, phone: this.form.loginName },
                  res.data
                );
                this.$store.dispatch("saveUserInfo", data);
                if (data.userType == 1) {
                  this.$router.push({ path: "/user" });
                } else if (data.userType == 2 || data.userType == 3) {
                  this.$router.push({ path: "/aindex" });
                } else {
                  this.$gidMessage("您不具备登录后台的权限");
                  this.$api.login.logout();
                }
              })
              .catch(_ => {
                this.$gidMessage("接口出错");
              });
          } else {
            this.getPictureCode();
            this.$gidMessage(res.msg);
          }
        });
      }
    });
  }
}
</script>

<style lang="scss" scoped>
.login-page {
  min-height: 100vh;
  background: url(~@/assets/images/dspadmin_bg.png) center center/cover #fff
    no-repeat;
  .content {
    width: 700px;
    height: 600px;
    // background-color: #fff;
    background: url(~@/assets/images/dspadmin_box_bg.png) center center/100%
      transparent no-repeat;
    border-radius: 15px;
    margin: 0 auto;
    margin-top: calc(50vh - 300px);
    position: relative;
    .title {
      font-size: 30px;
      color: #666;
      font-weight: bold;
      padding: 50px 0 20px;
      text-align: center;
      line-height: 40px;
    }
    .subtitle {
      position: absolute;
      text-align: center;
      width: 200px;
      left: 250px;
      top: -20%;
      font-size: 24px;
      color: #fff;
      font-weight: bold;
    }
    .login-form {
      padding: 0 150px;
      .login-item {
        position: relative;
        margin-bottom: 22px;
        .el-input {
          &.loginName {
            & /deep/ .el-input__prefix {
              position: absolute;
              width: 70px;
              background: url(~@/assets/images/icon-person.png) no-repeat 20px
                center/20px 20px transparent;
            }
          }
          &.password {
            & /deep/ .el-input__prefix {
              position: absolute;
              width: 70px;
              background: url(~@/assets/images/icon-password.png) no-repeat 20px
                center/20px 20px transparent;
            }
          }
          &.code {
            & /deep/ .el-input__prefix {
              position: absolute;
              width: 70px;
              background: url(~@/assets/images/icon-code.png) no-repeat 20px
                center/20px 20px transparent;
            }
          }
          & /deep/ .el-input__inner {
            background-color: #fff;
            padding-left: 70px;
            position: relative;
          }
          & /deep/ .el-input__icon {
            width: 1px;
            background-color: #bdccd9;
            height: 25px;
            top: 7.5px;
            left: 50px;
            position: absolute;
          }
        }
        & /deep/ .el-form-item__error {
          padding-left: 55px;
          position: absolute;
          white-space: nowrap;
          font-weight: bold;
        }
        .left {
          float: left;
        }
        .right {
          float: right;
          padding: 0 10px;
          cursor: pointer;
          &:hover {
            color: $fontTitle;
          }
        }
        .code-box {
          background-color: #dfdfdf;
          position: absolute;
          width: 160px;
          height: 38px;
          top: 1px;
          right: 1px;
          &.picture-box {
            width: 150px;
          }
          .code-img {
            width: 120px;
            height: 38px;
            position: absolute;
            right: 38px;
            top: 0px;
          }
          .refresh {
            background: url(~@/assets/images/icon-refresh.png) no-repeat center
              center/28px 28px;
            width: 38px;
            height: 37px;
            cursor: pointer;
            position: absolute;
            right: 0;
            top: 0;
          }
          & /deep/ {
            .login-popper {
              background-color: red;
            }
          }
          .get-code-btn {
            color: #999;
            text-align: center;
            width: 100%;
            height: 100%;
            line-height: 40px;
            background-color: #aed5fb;
            color: #3a78ff;
            cursor: pointer;
            &.disable {
              opacity: 0.7;
              background-color: #b6cbe0;
              color: #999;
            }
          }
        }
        .confirm-btn {
          background-color: #3a78ff;
          color: #fff;
          font-size: 18px;
          text-align: center;
          height: 50px;
          line-height: 50px;
          box-shadow: 0px 5px 10px 0px rgba(59, 121, 255, 0.5);
          cursor: pointer;
          &:hover {
            opacity: 0.7;
          }
        }
      }
    }
  }
}
@media screen and (max-height: 900px) {
  .login-page {
    height: 900px;
    .content {
      margin-top: 150px;
      .subtitle {
        top: -50px;
      }
    }
  }
}
</style>