// axios二次封装
import axios from 'axios';
import { Indicator } from 'mint-ui';
import store from '@/store'
import router from '@/router'

export default{
  common:{
    method:'GET',
    data:{},
    params:{},
    headers:{}
  },
  $axios(options={}){
    options.method = options.method || this.common.method
    options.data = options.data || this.common.data
    options.params = options.params || this.common.params
    options.headers = options.headers || this.common.headers

    // 发送请求之前 当需要显示加载提示框时，调用 open 方法
    Indicator.open('加载中...');

    // 是否是登录状态
    if(options.headers.token){
      options.headers.token = store.state.user.token
      if( !options.headers.token ){
        router.push({
          path:'/login'
        })
      }
    }

    return axios(options).then(v => {
      let data = v.data.data
      return new Promise((res,rej)=>{
        if(!v) return rej()
        // 若有数据就结束加载
        // 有数据之后 调用 close 方法将其关闭
        setTimeout(() =>{
          Indicator.close();
        },500)
        // 把数据返回过去
        res(data)
      })
    })
  }
}