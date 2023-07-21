<template>
  <div class="search-list">
    <div class="headers">
      <Header></Header>
      <ul>
        <li v-for="(item, index) in searchList.data" :key="index" @click="changeTab(index)">
          <div>
            <!-- 进入页面默认综合高亮 -->
            <span :class='searchList.currentIndex == index ? "active" : ""'>{{ item.name }}</span>
            <!-- 数组下标为0时是综合，不显示 -->
            <div class="icon" v-if="index != 0">
              <i class="iconfont icon-shangjiantou" :class="item.status == 1 ? 'active' : ''"></i>
              <i class="iconfont icon-xiajiantou" :class="item.status == 2 ? 'active' : ''"></i>
            </div>
          </div>
        </li>
      </ul>
    </div>
    <section ref="wrapper">
      <div>
        <!-- goodList.length表示存在 -->
        <ul v-if="goodList.length">
          <li v-for="(item, index) in goodList" :key="index">
            <img :src="item.imgUrl" alt="">
            <h5>{{ item.name }}</h5>
            <div>
              <div class="price">
                <span>￥</span>
                <b>{{ item.price }}</b>
              </div>
              <div class="buy">立即购买</div>
            </div>
          </li>
        </ul>
        <h4 v-else>暂无数据</h4>
      </div>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script>
import Header from '@/components/search/Header.vue'
import Tabbar from '@/components/common/Tabbar.vue'
import BetterScroll from 'better-scroll'
// 引入二次封装过的axios插件request.js
import http from '@/common/api/request.js'
export default {
  data() {
    return {
      goodList: [],
      BetterScroll: '',
      searchList: {
        // 控制哪一个头部标签会亮的下标值
        currentIndex: 0,
        data: [
          // status:0 都不亮
          // status:0 上箭头亮
          // status:0 下箭头亮
          { name: '综合', key: 'zh' },
          // 设置key为了知道是要把那一个属性排序
          { name: '价格', status: 0, key: 'price' },
          { name: '销量', status: 0, key: 'num' }
        ]
      },

    }
  },
  // 当页面中有某些数据依赖其他数据进行变动的时候，可以使用计算属性。
  // 使用计算属性，当值不变就走默认属性；只有值变动了才会使用计算属性
  computed: {
    orderBy() {
      // 首先要知道是哪个对象
      let obj = this.searchList.data[this.searchList.currentIndex];
      // 针对于状态，判断是升序还是降序
      let val = obj.status == '1' ? 'asc' : 'desc';
      return {
        [obj.key]: val
        // 等同于返回下面的一个对象
        // {
        //   price:asc
        // }
      }
    }
  },
  components: {
    Header,
    Tabbar
  },
  created() {
    this.getData();
  },
  methods: {
    getData() {
      http.$axios({
        url: '/api/goods/shopList',
        // get请求，前端给后端传数据
        params: {
          searchName: this.$route.query.key,
          ...this.orderBy
          // 将对象变为字符串等同于price:asc
        }
        // 传过去之后.then接收
      }).then(res => {
        this.goodList = res;
        // console.log(res);
      })
    },
    // 切换效果
    changeTab(index) {
      // 给每一个searchList的currentIndex赋值
      this.searchList.currentIndex = index;
      // 点击的下标对应数据的哪一个
      let item = this.searchList.data[index];
      // 取消所有的状态值，即都变成0
      this.searchList.data.forEach((v, i) => {
        // 循环到的下标不等于当前点击的下标就置零
        if (i != index) {
          v.status = 0;
        }
      })
      // 当前点击的改变状态
      if (index == this.searchList.currentIndex) {
        // 重复点击切换亮的箭头,初始为1上箭头亮
        item.status = item.status == 1 ? 2 : 1;
      }
      // 发送请求进行数据排序
      this.getData();
    }
  },
  // 监听到路由发生变化就再次请求
  watch: {
    $route() {
      this.getData();
    }
  },
  mounted() {
    this.BetterScroll = new BetterScroll(this.$refs.wrapper, {
      probeType: 3,
      // 取消顶部回弹
      bounce: false,
      click: true
    })
  }
}
</script>

<style scoped lang="scss">
/* 头部部分 */
.search-list {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;

  .headers ul {
    display: flex;
    justify-content: space-around;
    padding: 15px 0;
    font-size: 16px;
    color: #333;

    li {
      width: 48px;

      i {
        font-size: 10px;
        padding-left: 4px;
      }

      div {
        position: relative;
        display: inline-block;
        align-items: center;

        .icon {
          position: absolute;
          display: flex;
          flex-direction: column;
          left: 100%;
          top: -2px;
        }
      }
    }
  }
}

/* 内容部分 */
section {
  flex: 1;
  overflow: hidden;

  ul {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;

    li {
      display: flex;
      flex-direction: column;
      width: 50%;
      font-size: 14px;
      align-items: center;

      img {
        width: 170px;
        height: 170px;
      }

      h5 {
        padding: 2px;
        width: 90%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
    }
  }
}

section ul li>div {
  width: 90%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding: 8px;
}

section ul li div .price {
  color: red;
  font-size: 15px;
}

section ul li div .buy {
  width: 68px;
  height: 22px;
  background: #b0352f;
  border-radius: 6px;
  color: white;
  text-align: center;
  line-height: 22px;
  font-size: 14px;
}

/* 点击高亮 */
.active {
  color: red;
}
</style>