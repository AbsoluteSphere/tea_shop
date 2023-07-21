<template>
  <div class='login container'>
    <Header></Header>
    <section>
      <div class='login-tel'>
        <input type="text" v-model='userTel' placeholder="请输入手机号" pattern="[0-9]*">
      </div>
      <div class='login-code'>
        <input type="text" placeholder="请输入短信验证码" pattern="[0-9]*" v-model="userCode">
        <!-- disabled是button标签自带的状态属性 -->
        <button :disabled="disabled" @click='sendCode'>{{ codeMsg }}</button>
      </div>
      <div class='login-btn' @click="login">登 录</div>
      <div class='tab'>
        <span @click='goUserLogin'>密码登录</span>
        <span @click="goRegister">快速注册</span>
      </div>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script>
import Tabbar from '@/components/common/Tabbar.vue'
import Header from './Header'
import { Toast } from 'mint-ui';
import http from '@/common/api/request.js'
import { mapMutations } from 'vuex';

export default {
  components: {
    Header,
    Tabbar
  },
  data() {
    return {
      // true禁用,默认false
      disabled: false,
      userTel: '',
      //验证规则
      rules: {
        //手机号验证
        userTel: {
          rule: /^1[23456789]\d{9}$/,
          msg: '手机号不能为空，并且是11位数字'
        }
      },
      // 倒计时
      codeNum: 6,
      codeMsg: '获取短信验证码',
      // 后端发出的验证码
      code: '',
      // 用户输入的验证码
      userCode: ' '
    }
  },
  methods: {
    ...mapMutations(['USER_LOGIN']),
    //点击获取短信验证码按钮
    sendCode() {
      // 首先判断手机号是否符合标准
      if (!this.validate('userTel')) return;
      // 判断数据库里是否存在该用户
      http.$axios({
        url: '/api/codeLogin',
        method: 'POST',
        data: {
          phone: this.userTel
        }
      }).then(resu => {
        // 若数据库查询的到
        if (resu.success) {
          // 验证码验证
          // 请求短信验证码接口
          //发送请求，后端验证
          http.$axios({
            url: '/api/code',
            method: 'POST',
            data: {
              // 给后端传手机号
              phone: this.userTel
            }
          }).then(res => {
            console.log(res);//输出验证码
            if (res.success) {
              this.code = res.data
              // 传给vuex的user
              this.USER_LOGIN(resu.data);
            }
          })
          //禁用按钮
          this.disabled = true;
          //倒计时
          let timer = setInterval(() => {
            --this.codeNum;
            this.codeMsg = `重新发送 ${this.codeNum}`;
          }, 1000)
          //判断什么时候停止定时器
          setTimeout(() => {
            clearInterval(timer);
            this.codeNum = 6;
            this.disabled = false;
            this.codeMsg = '获取短信验证码';
          }, 6000)
        }
        // 若无数据，提示请注册
        Toast(resu.msg)
        // console.log(resu);
      })
    },
    // 点击跳转密码登录页面
    goUserLogin() {
      this.$router.push('/userLogin');
    },
    // 点击跳转注册页面
    goRegister() {
      this.$router.push('/register')
    },
    //验证信息提示
    validate(key) {
      let bool = true;
      if (!this.rules[key].rule.test(this[key])) {
        //提示信息
        Toast(this.rules[key].msg);
        bool = false;
        return false;
      }
      return bool;
    },
    // 点击登录触发方法
    login() {
      if (this.code == this.userCode) {
        // console.log('登录成功');
        Toast('登录成功')
        //登录成功 ==》跳转页面，存储用户信息
        //跳转到我的页面中
        this.$router.push({
          path: '/my'
        })
      }
    },
  }
}
</script>

<style scoped lang='scss'>
section {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f5f5;
  font-size: 14px;

  div {
    margin: 10px 0;
    width: 335px;
    height: 44px;
  }

  input {
    box-sizing: border-box;
    padding: 0 10px;
    line-height: 44px;
    background-color: #FFFFFF;
    border: 1px solid #ccc;
    border-radius: 6px;
  }

  .login-tel {
    margin-top: 30px;

    input {
      width: 335px;
    }
  }

  .login-code {
    display: flex;

    input {
      flex: 1;
      border-top-right-radius: 0;
      border-bottom-right-radius: 0;
      border-right: none;
    }

    button {
      padding: 0 0.533333rem;
      line-height: 44px;
      color: #fff;
      background-color: #b0352f;
      border: 0;
      border-top-right-radius: 6px;
      border-bottom-right-radius: 6px;
    }
  }

  .login-btn {
    line-height: 44px;
    color: #fff;
    text-align: center;
    background-color: #b0352f;
    border-radius: 6px;
  }

  .tab {
    display: flex;
    justify-content: space-between;
    font-size: 0.373333rem;
  }
}
</style>
