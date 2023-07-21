<template>
  <div class="home">
    <!-- 头部 -->
    <div class="header">
      <Header></Header>
      <!-- change中有index -->
      <ly-tabs @change="changeTab" v-model="value" :activeColor="options.activeColor">
        <ly-tab-item v-for="(items, index) in items" :key="index" :name="index" :title="items.label" />
      </ly-tabs>
    </div>
    <!-- 内容 -->
    <!-- 引入better-scroll插件后一定要给父元素加类 -->
    <section class="wrapper" ref="wrapper">
      <div>
        <!-- 子元素一定要比父元素高,必须添加在mounted中 -->
        <div v-for="(item, index) in newData" :key="index">
          <!-- 滚动的元素一定要再装在一个盒子里 -->
          <!-- 父传子Home->Swipe item.data -->
          <Swiper v-if="item.type == 'swiperList'" :swiperList="item.data"></Swiper>
          <Icons v-if="item.type == 'iconList'" :iconList="item.data"></Icons>
          <Recommend v-if="item.type == 'recommendList'" :recommendList="item.data"></Recommend>
          <Ad v-if="item.type == 'adList'" :adList="item.data"></Ad>
          <Like v-if="item.type == 'likeList'" :likeList="item.data"></Like>
        </div>
      </div>
    </section>
    <!-- 底部 -->
    <Tabbar></Tabbar>
  </div>
</template>

<script>
// 导入组件
import Header from '@/components/home/Header.vue'
import Swiper from '@/components/home/Swiper.vue'
import Icons from '@/components/home/Icons.vue'
import Recommend from '@/components/home/Recommend.vue'
import Like from '@/components/home/Like.vue'
import Ad from '../components/home/Ad.vue'
import Tabbar from '@/components/common/Tabbar.vue'
// 引用的插件
import BetterScroll from 'better-scroll'
import http from '@/common/api/request.js'

export default {
  name: "Home",
  components: {
    Header,
    Swiper,
    Icons,
    Recommend,
    Like,
    Ad,
    Tabbar,
  },
  data() {
    return {
      value: 0,
      items: [
        // 清空，因为数据是从后端server得来的
        // { label: '推荐' },
        // { label: '大红袍' },
        // { label: '铁观音' },
        // { label: '绿茶' },
        // { label: '普洱' },
        // { label: '茶具' },
        // { label: '花茶' },
      ],
      newData: [],
      options: {
        activeColor: '#b0352f'
      },
      oBetterScroll: '',
      tBetterScroll: ''
    }
  },
  created() {
    this.getData()
  },
  // created不行，因为没有dom节点
  // mounted() {
  // BetterScroll插件要先渲染了数据再加载，否则距离计算有问题
  // this.$refs获取dom节点
  // console.log(this.$refs.wrapper);
  // .wrapper可用this.$refs.wrapper替换
  // new BetterScroll('.wrapper', {
  //   movable: true,
  //   zoom: true
  // })
  // },
  methods: {
    async getData() {

      // 拿到后端接口
      let res = await http.$axios({
        url: '/api/index_list/0/data/1'
      })

      // console.log(res.data.data.topBar);
      // this.items = res.data.data.topBar
      // Object.freeze冻结一个对象,一个被冻结的对象再也不能被修改
      this.items = Object.freeze(res.topBar)
      // console.log(res.data.data.data);
      this.newData = Object.freeze(res.data)

      // this.$nextTick()当dom都加载完毕再执行
      this.$nextTick(() => {
        this.oBetterScroll = new BetterScroll(this.$refs.wrapper, {
          movable: true,
          zoom: true,
          click: true
        })
      })
    },

    // 负责点击请求
    async addData(index) {
      let res = await http.$axios({
        url: '/api/index_list/' + index + '/data/1'
      });
      // console.log(res);
      // constructor得到对象类型res.data.data.constructor!=Array
      // instanceof直接判断两个是否同类型
      if (res instanceof Array) {
        this.newData = res
      } else {
        this.newData = res.data
      }
      // this.$nextTick()当dom都加载完毕再执行
      this.$nextTick(() => {
        this.tBetterScroll = new BetterScroll(this.$refs.wrapper, {
          movable: true,
          zoom: true,
          click: true
        })
      })
    },
    // 点击切换导航
    changeTab(index) {
      // 根据index的值找到切换哪一个
      // console.log(index);
      this.addData(index)
    }
  }
};
</script>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 83px;
  z-index: 11;
}

section {
  flex: 1;
  margin-top: 83px;
  overflow: hidden;
}

.ly-tabs {
  border: none;
}

::v-deep.tabbar {
  border-top: 1px solid #cccccc;
}
</style>