<template>
  <div class='login container'>
    <Header></Header>
    <section>
      <div class='login-tel'>
        <input type="text" v-model='userTel' placeholder="请输入手机号" pattern="[0-9]*">
      </div>
      <div class='login-tel'>
        <input type="text" v-model='userPwd' placeholder="请输入密码">
      </div>
      <div class='login-btn' @click='login'>登 录</div>
      <div class='tab'>
        <span @click='goLogin'>短信登录</span>
        <span @click="goRecovery">找回密码</span>
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
  data() {
    return {
      //用户输入的手机号
      userTel: '',
      //用户输入的密码
      userPwd: '',
      //验证规则
      rules: {
        //手机号验证
        userTel: {
          rule: /^(13[0-9]|14[5|7]|15[0|1|2|3|5|6|7|8|9]|18[0|1|2|3|5|6|7|8|9])\d{8}$/,
          msg: '手机号不能为空，并且是11位数字'
        },
        //密码验证
        userPwd: {
          // \w 匹配任何字类字符，包括下划线。与“[A-Za-z0-9_]”等效
          rule: /^\w{6,12}$/,
          msg: '密码不能为空，并且要求6,12位'
        }
      }
    }
  },
  components: {
    Header,
    Tabbar
  },
  methods: {
    ...mapMutations(['USER_LOGIN']),
    //验证信息判断提示
    validate(str) {
      let bool = true;
      // test() 方法用于检测一个字符串是否匹配某个模式.
      if (!this.rules[str].rule.test(this[str])) {
        //不匹配则提示信息
        Toast(this.rules[str].msg);
        bool = false;
        return bool;
      }
      return bool;
    },
    //点击登录按钮
    login() {
      //前端验证
      // 如果validate为false则条件语句为true，终止函数，validate方法会直接提示信息
      // 如果validate为true,则条件语句为false,函数继续执行,validate方法直接返回了bool值,没有提示信息
      if (!this.validate('userTel')) return;
      if (!this.validate('userPwd')) return;
      //发送请求，后端验证
      http.$axios({
        url: '/api/pwdLogin',
        method: 'POST',
        // Get请求传数据用params
        // Post请求传数据用data
        data: {
          userTel: this.userTel,
          userPwd: this.userPwd
        }
      }).then(res => {
        //提示信息
        Toast(res.msg);
        // console.log(res);
        console.log(res.data);
        //登录成功 ==》跳转页面，存储用户信息
        // 传给vuex的user
        this.USER_LOGIN(res.data);
        //跳转到我的页面中
        this.$router.push({
          path: '/my'
        })
        //登录失败
        if (!res.succcess) return;
      })
    },
    // 点击跳转手机验证登录页面
    goLogin() {
      this.$router.push('/login');
    },
    // 点击跳转注册页面
    goRegister() {
      this.$router.push('/register')
    },
    // 找回密码页面
    goRecovery() {
      this.$router.push('/recovery')
    }
  }
}
</script>

<style scoped lang='scss'>
section {
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: #f5f5f5;

  div {
    margin: 0.266666rem 0;
    width: 8.933333rem;
    height: 1.173333rem;
  }

  input {
    box-sizing: border-box;
    padding: 0 0.266666rem;
    line-height: 1.173333rem;
    background-color: #FFFFFF;
    border: 1px solid #ccc;
    border-radius: 6px;
  }

  .login-tel {
    margin-top: 0.8rem;

    input {
      width: 8.933333rem;
    }
  }

  .login-code {
    display: flex;

    input {
      flex: 1;
    }

    button {
      padding: 0 0.533333rem;
      line-height: 1.173333rem;
      color: #fff;
      background-color: #b0352f;
      border: 0;
      border-radius: 6px;
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
