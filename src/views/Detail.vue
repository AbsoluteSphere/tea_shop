<template>
  <div class="detail">
    <!-- 首部导航 -->
    <header>
      <!-- 初始时首部 -->
      <div class="header-return" v-show="isShow">
        <div @click="goBack">
          <i class="iconfont icon-fanhui"></i>
        </div>
        <div>
          <i class="iconfont icon-shouye"></i>
        </div>
      </div>
      <!-- 下滑后的首部 -->
      <div class="header-bar" v-show="!isShow" :style="styleOption">
        <div>
          <i class="iconfont icon-fanhui"></i>
        </div>
        <div>
          <span>商品详情</span>
          <span>商品评价</span>
        </div>
        <div>
          <i class="iconfont icon-shouye"></i>
        </div>
      </div>
    </header>
    <section ref="wrapper">
      <div>
        <!-- 轮播图 -->
        <div class="swiper-main">
          <div class="swiper-container">
            <div class="swiper-wrapper">
              <div class="swiper-slide" v-for='(item, index) in swiperList' :key='index'>
                <img :src="item.imgUrl" alt="">
              </div>
            </div>
          </div>
          <div class="swiper-pagination"></div>
        </div>
        <!-- 商品描述 -->
        <div class='goods-name'>
          <h1>{{ goods.name }}</h1>
          <div>{{ goods.content }}</div>
        </div>
        <div class='goods-price'>
          <div class='oprice'>
            <span>¥</span>
            <b>{{ goods.price * 0.8 }}</b>
          </div>
          <div class='pprice'>
            <span>价格:</span>
            <del>{{ goods.price }}</del>
          </div>
          <!-- 图片，为了让有下滑空间 -->
          <div>
            <img style="width: 300px;height: 300px;" :src="goods.imgUrl" alt="">
            <img style="width: 300px;height: 300px;" :src="goods.imgUrl" alt="">
          </div>
        </div>
      </div>
    </section>
    <!-- 底部 -->
    <footer>
      <ul>
        <li>
          <i class="iconfont icon-kefu"></i>
          <span>客服</span>
        </li>
        <li>
          <i class="iconfont icon-gouwuche"></i>
          <span>购物车</span>
        </li>
        <li>
          <i class="iconfont icon-shoucang"></i>
          <span>收藏</span>
        </li>
      </ul>
      <div class="add-cart" @click="addCard">加入购物车</div>
      <div>立即购买</div>
    </footer>
  </div>
</template>

<script>
// 导入轮播图插件
import Swiper from 'swiper'
import 'swiper/css/swiper.min.css'
import BetterScroll from 'better-scroll'
import http from '@/common/api/request.js'

export default {
  name: 'Detail',
  data() {
    return {
      id: 0,
      isShow: true,
      BetterScroll: '',
      styleOption: {},
      goods: {},
      swiperList: [
        { imgUrl: '/images/goods-list1.jpeg' },
        { imgUrl: '/images/like.jpeg' },
        { imgUrl: '/images/lc2.jpeg' }
      ]
    }
  },
  created() {
    // this.id = this.$route.query.id;
    // 接收Like传来的id
    // console.log(this.$route.params.id);
    // 调用请求接口函数
    this.getData()
  },
  methods: {
    goBack() {
      this.$router.back()
    },
    // 请求后端的接口
    async getData() {
      // 获取Like点击的id号,即路径传值参数
      let id = this.$route.query.id
      // console.log(id);
      let res = await http.$axios({
        url: '/api/goods/id',
        // 前端给后端传送id
        params: {
          id
        }
      })
      // console.log(res);
      this.goods = res
    },
    // 加入购物车
    addCard() {
      let id = this.$route.query.id
      http.$axios({
        url: '/api/addCard',
        method: "post",
        data: {
          goodsId: id
        },
        // 哪一个用户
        headers: {
          token: true
        }
      }).then(res => {
        console.log(res);
      })
    }
  },
  mounted() {
    new Swiper('.swiper-container', {
      // direction: 'vertical', // 垂直切换选项
      loop: true, // 循环模式选项
      pagination: {
        el: '.swiper-pagination',
        type: 'fraction'
      },
      autoplay: false,//等同于以下设置
      // autoplay: {
      //   delay: 1000,
      //   stopOnLastSlide: false,
      //   disableOnInteraction: false,
      //   pauseOnMouseEnter: true
      // }
    }),
      this.BetterScroll = new BetterScroll(this.$refs.wrapper, {
        probeType: 3,
        // 取消顶部回弹
        bounce: false,
        click: true
      })
    this.BetterScroll.on('scroll', (pos) => {
      let posY = Math.abs(pos.y);
      let opacity = posY / 200;
      opacity = opacity > 1 ? 1 : opacity;
      this.styleOption = {
        opacity: opacity
      }
      if (posY >= 50) {
        this.isShow = false;
      } else {
        this.isShow = true;
      }
    })
  },
  // activated() {
  //   //判断当前url , id和之前id是否一致
  //   if (this.$route.query.id != this.id) {
  //     this.getData();
  //     this.id = this.$route.query.id;
  //   }
  // },
}
</script>

<style scoped lang="scss">
// 首部导航
.detail {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

header {
  position: fixed;
  left: 0;
  top: 0;
  z-index: 999;
  width: 100%;
  height: 50px;

  .header-return {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 50px;

    div {
      margin: 0 10px;
      width: 34px;
      height: 34px;
      text-align: center;
      line-height: 34px;
      background: rgba(0, 0, 0, 0.3);
      border-radius: 50%;

      i {
        color: #fff;
        font-size: 30px;
      }
    }
  }

  .header-bar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    height: 50px;
    font-size: 16px;
    background-color: #fff;

    span {
      padding: 0 20px;
    }

    i {
      padding: 0 10px;
      font-size: 26px;
    }
  }
}

section {
  flex: 1;
  overflow: hidden;

  // 轮播图
  .swiper-main {
    position: relative;
    width: 100%;
    height: 375px;
  }

  .swiper-main img {
    width: 100%;
    height: 375px;
  }

  .swiper-pagination {
    width: 95%;
    bottom: 0;
    text-align: right;
    right: 20px;
    color: #fff;
    font-size: 16px;
  }

  // 商品描述
  .goods-name {
    margin: 8px;
    padding-bottom: 10px;
    border-bottom: 1px solid #CCCCCC;

    h1 {
      font-size: 16px;
      font-weight: 500;
    }

    div {
      padding: 2px 0;
      font-size: 12px;
      color: #999999;
    }
  }

  .goods-price {
    padding: 0 8px;

    .oprice {
      color: red;

      span {
        font-size: 12px;
      }
    }

    .pprice {
      color: #999999;
      font-size: 12px;
    }
  }
}

// 底部
footer {
  display: flex;
  width: 100%;
  height: 50px;
  background: #fff;
  border-top: 1px solid #cccccc;

  ul {
    display: flex;
    align-items: center;
    width: 36%;
    height: 100%;

    li {
      flex: 1;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;

      i {
        font-size: 18px;
        color: grey;
      }

      span {
        font-size: 14px;
        color: grey;
      }
    }
  }

  div {
    flex: 1;
    width: 50%;
    text-align: center;
    line-height: 50px;
    font-size: 16px;
    color: #fff;
    background: red;

    &.add-cart {
      background: #ff9500;
    }
  }
}
</style>