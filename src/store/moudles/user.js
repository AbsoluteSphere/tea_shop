import {USER_LOGIN,INIT_USER} from './mutations-types.js'
export default{
  state:{
    // 登录状态
    loginStatus:false,
    // token
    token:null,
    // 用户信息
    userInfo:{}
  },
  getters:{

  },
  mutations:{
    // 设置登录的用户属性
    // stae是固有的,user是登录成功后后端返回过来的数据
    [USER_LOGIN](state,user){
      state.loginStatus = true
      state.token = user.token
      state.userInfo = user
      // console.log(state,user);
      localStorage.setItem('UserInfo',JSON.stringify(user))
    },
    // 读取登录的用户
    [INIT_USER](state){
      let userInfo = JSON.parse(localStorage.getItem('UserInfo'))
      // 如果用户纪录存在
      if(userInfo){
        state.loginStatus = true
        state.token = userInfo.token
        state.userInfo = userInfo
      }
    },
    // 退出登录
    loginOut(state){
      state.loginStatus = false
      state.token = null
      state.userInfo = {}
      localStorage.removeItem('UserInfo')
    }
  },
  actions:{

  }
}