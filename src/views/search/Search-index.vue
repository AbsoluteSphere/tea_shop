<template>
  <div class="search-index">
    <Header></Header>
    <section>
      <!-- 历史搜索部分 -->
      <div class="search-history" v-if="searchArr.length">
        <h2>
          <i class="iconfont icon-shijian"></i>
          <span>历史搜索</span>
          <span @click="clearStorage">清空搜索记录</span>
        </h2>
        <ul>
          <li v-for="(item, index) in searchArr" :key="index" @click="gosearchList(item)">
            {{ item }}
          </li>
        </ul>
      </div>
      <div v-else>暂无搜索纪录</div>
      <hr>
    </section>
    <Tabbar></Tabbar>
  </div>
</template>

<script>
import Header from '@/components/search/Header.vue'
import Tabbar from '@/components/common/Tabbar.vue'
// 局部引入mint-ui的Message box
import { MessageBox } from 'mint-ui';

export default {
  name: 'Search',
  data() {
    return {
      searchArr: []
    }
  },
  components: {
    Tabbar,
    Header
  },
  created() {
    this.searchArr = JSON.parse(localStorage.getItem('searchList')) || []
  },
  methods: {
    clearStorage() {
      MessageBox({
        title: '提示',
        message: '确定执行此操作?',
        showCancelButton: true
      }).then(res => {
        // console.log(res);
        if (res == 'confirm') {
          // 清空本地储存
          localStorage.removeItem('searchList')
          // 搜索记录是靠数组渲染的，要清空数组
          this.searchArr = []
        }
      })
    },
    // 点击历史搜索，进入搜索结果页面
    gosearchList(item) {
      this.$router.push({
        name: 'list',
        query: {
          key: item
        }
      })
    }
  }
}
</script>

<style scoped>
.search-index {
  display: flex;
  flex-direction: column;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

section {
  /* flex必须给一个任意数值session才会占位置 */
  flex: 1;
  overflow: hidden;
  background: #f5f5f5;
}

.search-history h2 {
  position: relative;
  padding: 10px 10px;
  font-weight: 400;
  font-size: 18px;
}

.search-history h2 span:last-child {
  position: absolute;
  right: 20px;

}

.search-history h2 i {
  padding-right: 5px;
  color: red;
  font-size: 20px;
}

.search-history ul {
  padding: 0 10px;
  display: flex;
  /* flex-wrap用于设置项目换行属性 */
  flex-wrap: wrap;
}

.search-history ul li {
  margin: 5px;
  padding: 2px 4px;
  border: 1px solid #ccc;
  font-size: 14px;
  border-radius: 10%;
}
</style>