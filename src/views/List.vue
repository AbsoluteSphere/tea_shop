<template>
  <div class='list'>
    <header v-show="isShow">
      <div class="returns" @click="goBack">
        <i class="iconfont icon-fanhui"></i>
      </div>
      <div class="search">
        <i class="iconfont icon-fangdajing"></i>
        <span>搜索您喜欢的...</span>
      </div>
      <div class="gohome">
        <img src="@/assets/images/home.png" alt="">
      </div>
    </header>
    <section>
      <!-- 左侧滑动 -->
      <div class="list-left" ref="left">
        <ul class="l-item">
          <li v-for="(item, index) in leftData" :key="index" @click="goScroll(index)"
            :class='currentIndex == index ? "active" : ""'>{{ item.name }}</li>
        </ul>
      </div>
      <!-- 右侧滑动 -->
      <div class="list-right" ref="right">
        <div>
          <ul v-for="(items, index) in rightData" :key="index">
            <!-- items的内容是{ { id,name,list[] },{ id,name,list[] } } -->
            <li class="shop-list" v-for="(item, i) in items" :key="i">
              <!-- item的内容是{id,name,list[]} -->
              <h5>{{ item.name }}</h5>
              <ul class="r-content">
                <li v-for="(value, j) in item.list" :key="j">
                  <!-- item.list才是{id,name,imgUrl} -->
                  <img :src="value.imgUrl" alt="">
                  <span>{{ value.name }}</span>
                </li>
              </ul>
            </li>
          </ul>
        </div>
      </div>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script>
import Tabbar from '@/components/common/Tabbar.vue'
// 对后端发出请求
import http from '@/common/api/request.js'
// 滚动插件
import BetterScroll from 'better-scroll'

export default {
  name: "List",
  components: {
    Tabbar
  },
  data() {
    return {
      // 左侧数据
      leftData: [],
      // 右侧数据
      rightData: [],
      // 右侧滑动
      rightBetterScroll: '',
      // 承载右侧每一块的高度值
      allHeight: [],
      // 右侧滚动距离
      scrollY: '',
      // 默认显示头部
      isShow: true
    }
  },
  computed: {
    // 由于要比较运算，用计算属性性能较高
    currentIndex() {
      let i = this.allHeight.findIndex((item, index) => {
        // findIndex方法返回的是满足条件的第一项元素的下标index
        return this.scrollY >= item && this.scrollY < this.allHeight[index + 1]
      })
      return i
    }
  },
  async created() {
    let res = await http.$axios({
      url: '/api/goods/list'
    })
    // console.log(res);返回[{…}, {…}, {…}, {…}, {…}, {…}, {…}]
    // console.log(res[0].data);返回[{…}]
    // 左侧导航数组
    let leftArr = []
    // 右侧内容数组
    let rightArr = []
    res.forEach(element => {
      leftArr.push({
        id: element.id,
        name: element.name
      })
      // console.log(element);返回[{…}]相当于res[i].data
      // console.log(element.data);返回{id:0,name:"推荐",list:Array(6)}
      rightArr.push(element.data)
    })
    // console.log(leftArr);
    this.leftData = leftArr
    this.rightData = rightArr

    // this.$nextTick()当dom都加载完毕再执行滚动插件
    this.$nextTick(() => {
      // 左侧滑动
      new BetterScroll(this.$refs.left, {
        // better-scroll默认取消click事件
        click: true,
        // etter-scroll默认取消scroll事件
        // probeType：默认为0
        // 建议修改成：2|3
        probeType: 3
      })
      // 右侧滑动
      this.rightBetterScroll = new BetterScroll(this.$refs.right, {
        click: true,
        probeType: 3,
        // 取消回弹效果
        bounce: false
      })
      // 统计右侧所有版块高度值，并放入数组中
      let height = 0
      this.allHeight.push(height)
      // 获取右侧每一块的高度
      // console.log(this.$refs.right.getElementsByClassName('shop-list'));
      let uls = this.$refs.right.getElementsByClassName('shop-list')
      // 把dom对象转换成真正的数组
      Array.from(uls).forEach(element => {
        // clientHeight获取高度
        // console.log(element.clientHeight);
        height += element.clientHeight
        this.allHeight.push(height)
      })
      // console.log(this.allHeight);
      // on('scroll', (position)=>{})方法得到右侧滚动的值
      this.rightBetterScroll.on('scroll', (position) => {
        // console.log(position);
        // Math.abs()取绝对值
        this.scrollY = Math.abs(position.y)

        if (this.scrollY > 50) {
          this.isShow = false
        } else {
          this.isShow = true
        }
      })
    })
  },
  methods: {
    goScroll(index) {
      // console.log(index);
      // scrollTo(x,y,滚动时间)
      this.rightBetterScroll.scrollTo(0, -this.allHeight[index], 200)
    },
    goBack() {
      this.$router.push({
        path: '/home'
      })
    }
  }
};
</script>

<style scoped lang="scss">
.list {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 44px;
  background: #b0352f;

  .returns {
    line-height: 44px;
    padding: 0 10px;

    i {
      color: #fff;
      font-size: 26px;
    }
  }

  .search {
    display: flex;
    align-items: center;
    flex: 1;
    padding: 3px 10px;
    background: #FFFFFF;
    border-radius: 14px;

    i {
      font-size: 24px;
      color: #666;
    }

    span {
      padding-left: 5px;
      font-size: 18px;
      color: #666;
    }
  }

  .gohome {
    padding: 0 8px;

    img {
      width: 30px;
      height: 30px;
    }
  }
}

section {
  display: flex;
  flex: 1;
  overflow: hidden;
}

.list-left {
  width: 90px;
  background: #fff;
  overflow: hidden;
  border-right: 1px solid #cccccc;

  .l-item {
    display: flex;
    flex-direction: column;

    li {
      margin: 15px 0;
      width: 90px;
      line-height: 30px;
      padding-left: 30px;
      font-size: 14px;
      overflow: hidden;

      &.active {
        color: #b0352f;
        border-left: 3px solid #b0352f;
      }
    }
  }
}

.list-right {
  flex: 1;
  height: 100%;
  overflow: hidden;

  .shop-list {
    text-align: center;

    h5 {
      font-size: 20px;
      font-weight: 400;
      padding: 15px 0;
    }

    .r-content {
      display: flex;
      flex-wrap: wrap;

      li {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        width: 33.3%;
        padding: 10px 0;

        img {
          width: 53px;
          height: 53px;
        }

        span {
          font-size: 14px;
          width: 70%;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis
        }
      }
    }
  }
}

::v-deep.tabbar {
  border-top: 1px solid #cccccc;
}
</style>


