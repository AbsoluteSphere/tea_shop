<template>
  <div class="swiper-main">
    <div class="swiper-container">
      <div class="swiper-wrapper">
        <div class="swiper-slide" v-for='(item, index) in swiperList' :key='index'>
          <img :src="item.imgUrl" alt="">
        </div>
      </div>
      <div class="swiper-pagination"></div>
    </div>
  </div>
</template>

<script>
import Swiper from 'swiper'
import 'swiper/css/swiper.min.css'

export default {
  name: 'Swiper',
  // 接收Home传来的item.data数组
  props: {
    swiperList: Array
  },
  mounted() {
    new Swiper('.swiper-container', {
      // direction: 'vertical', // 垂直切换选项
      loop: true, // 循环模式选项
      // autoplay: true,//等同于以下设置
      autoplay: {
        delay: 1000,
        stopOnLastSlide: false,
        // 用户操作swiper之后，是否禁止autoplay
        disableOnInteraction: false,
        // 开启此功能，鼠标置于swiper时暂停自动切换，鼠标离开时恢复自动切换
        pauseOnMouseEnter: true
      },

      // 如果需要分页器
      pagination: {
        el: '.swiper-pagination',
        type: 'bullets',
      },

      // 如果需要前进后退按钮
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      // 如果需要滚动条
      scrollbar: {
        el: '.swiper-scrollbar',
      },
    })
  }
}
</script>

<style scoped>
.swiper-main {
  position: relative;
  width: 100%;
  height: 142px;
}

.swiper-main img {
  width: 100%;
  height: 100%;
}

.swiper-container {
  height: 142px;
}

.swiper-pagination {
  width: 100%;
  bottom: 0;
}

::v-deep .swiper-pagination-bullet-active {
  background-color: #b0352f;
}

::v-deep .swiper-pagination-bullet {
  margin: 0 2px;
}
</style>