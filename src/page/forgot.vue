<template>
  <div class="login-page" v-if="pageVisible">
    <div class="content">
      <span class="go-back" @click="goBack">&gt;返回登录</span>
      <div class="title">忘记密码</div>
      <el-form ref="forgotform" class="login-form" :model="form" :rules="formRules">
        <el-form-item class="login-item">
          <el-input class="phone" placeholder="请输入手机号" disabled v-model.trim="form.phone">
            <i slot="prefix" class="el-input__icon"></i>
          </el-input>
        </el-form-item>
        <el-form-item class="login-item" prop="code">
          <el-input class="code" placeholder="请输入短信验证码" v-model="form.code">
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
        <el-form-item class="login-item" prop="password">
          <el-input class="password" placeholder="请输入密码" type="password" v-model="form.password">
            <i slot="prefix" class="el-input__icon"></i>
          </el-input>
        </el-form-item>
        <el-form-item class="login-item" prop="password2">
          <el-input class="password" placeholder="请再次输入密码" type="password" v-model="form.password2">
            <i slot="prefix" class="el-input__icon"></i>
          </el-input>
        </el-form-item>
        <el-form-item class="login-item">
          <div class="confirm-btn" @click="updatePassword">确认修改</div>
        </el-form-item>
      </el-form>
    </div>
  </div>
  <!-- <gid-success></gid-success> -->
</template>

<script lang="ts">
import { Vue, Component, Prop } from 'vue-property-decorator'

let validatePass = (rule, value, callback) => {
  if (value == "") {
    callback(new Error("请输入密码"));
  } else if (
    /(?=.*[a-z])(?=.*\d)(?=.*[#@!~%^&*])[a-z\d#@!~%^&*]{8,16}/i.test(
      value
    ) == false
  ) {
    callback(
      new Error("请设置8-16位包含字母、数字及特殊字符(如：#@!~%^&*)的密码")
    );
  } else if (value.length > 16) {
    new Error("请设置8-16位包含字母、数字及特殊字符(如：#@!~%^&*)的密码");
  } else {
    callback();
  }
};
let validPassAgain = (rule, value, callback) => {
  if (value == "") {
    callback(new Error("请再次输入密码"));
  } else if (value != this.form.password) {
    callback(new Error("密码请保持一致"));
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

@Component
export default class Forgot extends Vue {
  @Prop(String) phone!:string
  form = {
    phone: "",
    password: "",
    password2: "",
    code: ""
  }
  formRules = {
    password: [{ validator: validatePass }],
    password2: [{ validator: validPassAgain }],
    code: [{ validator: validateSmsCode }]
  }
  smsMessage = "获取短信验证码" // 获取短信验证码文案
  smsTime = 60 // 短信验证码获取间隔
  pageVisible = true
  mounted() {
    if (!this.phone) {
      this.goBack();
    } else {
      this.form.phone = this.phone;
    }
    document.addEventListener("keyup", ev => {
      if (ev.keyCode == 13 && !this['_isDestroyed']) {
        this.updatePassword();
      }
    });
  }
  // 返回登录页面
  goBack() {
    this.$router.push({ path: "/" });
  }
  // 获取短信验证码
  getPhoneCode() {
    if (this.smsTime != 60) {
      return;
    }
    let data = {
      phone: this.form.phone,
      smsVerificationCodeType: 1
    };
    this.$api.login.getPhoneCode(data).then(res => {
      if (res.ret == 0) {
        this.downTime();
        this.$gidMessage("获取短信验证码成功", true);
      } else {
        this.$gidMessage(res.ret);
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
  // 确认修改密码
  updatePassword() {
    this.$refs.forgotform['validate'](valid => {
      if (valid) {
        let data = {
          phone: this.form.phone,
          password: this.form.password,
          code: this.form.code
        };
        this.$api.login.updatePassword(data).then(res => {
          if (res.ret == 0) {
            this.showSuvvessTip();
          } else {
            this.$gidMessage(res.msg);
          }
        });
      }
    });
  }
  showSuvvessTip() {
    this.$gidSuccess({
      title: "修改密码成功！",
      time: 3,
      unit: "s",
      subtitle: "后跳转至登录页",
      successCallback: this.goBack
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
    // background: url(~@/assets/images/dspadmin_box_bg.png) center center/100%
    //   transparent no-repeat;
    border-radius: 15px;
    margin: 0 auto;
    margin-top: calc(50vh - 300px);
    position: relative;
    .go-back {
      position: absolute;
      top: 30px;
      left: 28px;
      font-size: 16px;
      color: $fontTitle;
      cursor: pointer;
      &:hover {
        color: $blueLight;
      }
    }
    .title {
      font-size: 30px;
      color: $fontTitle;
      font-weight: bold;
      padding: 50px 0 20px;
      text-align: center;
      line-height: 40px;
    }
    .login-form {
      padding: 0 150px;
      .login-item {
        position: relative;
        margin-bottom: 22px;
        .el-input {
          &.phone {
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
            background-color: #fff;
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
            display: inline-block;
            width: 30px;
            height: 30px;
            padding-top: 1px;
            cursor: pointer;
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
    }
  }
}
</style>