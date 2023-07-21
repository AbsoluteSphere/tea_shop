<template>
  <header>
    <div class="header-return" @click="goBack">
      <i class="iconfont icon-fanhui"></i>
    </div>
    <div class="search-main">
      <i class="iconfont icon-fangdajing"></i>
      <form action="" onsubmit="return false" @keyup.enter="searchList">
        <!-- search框内有个小×，input没有× -->
        <input style="color: black;" type="text" placeholder="搜索您喜欢的产品..." v-model="searchValue">
      </form>
    </div>
    <div class="search-button" @click="searchList">搜索</div>
  </header>
</template>

<script>

export default {
  name: 'Header',
  data() {
    return {
      // 接受参数 $route : 路由信息对象，只读对象
      searchValue: this.$route.query.key,
      searchArr: []
    }
  },
  methods: {
    goBack() {
      // go(-1): 原页面表单中的内容会丢失；
      // this.$router.go(-1)：后退+刷新；
      // this.$router.go(0)：刷新；
      // this.$router.go(1) ：前进
      // back(): 原页表表单中的内容会保留；
      // this.$router.back():后退 ；
      // this.$router.back(0) 刷新；
      // this.$router.back(1)：前进
      this.$router.back()
    },
    searchList() {
      // 如果搜索的关键字是空，直接return
      if (!this.searchValue) return
      // 判断之前有没有搜索的本地存储
      if (!localStorage.getItem('searchList')) {
        // 没有就设置一个
        localStorage.setItem('searchList', [])
      } else {
        // 之前有就获取这个数组
        // 本地存储返回的永远是JSON字符串即string''类型，存进去的格式是数组[]但实际是字符串形式
        // 要用json.parse转换为对象才可以存进去[]
        // JSON.parse() 方法用于将一个 JSON 字符串转换为对象
        this.searchArr = JSON.parse(localStorage.getItem('searchList'))
      }

      // 不管有没有都要增加数据，这是给数组添加
      // unshift往前放,push往后增加,增加输入的搜索关键词
      this.searchArr.unshift(this.searchValue)

      // ES6去重
      // Set是es6新增的数据结构，似于数组，但它的一大特性就是所有元素都是唯一的，没有重复的值，我们一般称为集合。
      // Set本身是一个构造函数，用来生成 Set 数据结构
      // Set类型是{.,.,.},去重后要用es6的[...]或Array.from解构成数组
      let newArr = new Set(this.searchArr)

      // 给本地存储赋值
      // JSON.stringify() 方法用于将 JavaScript 值转换为 JSON 字符串
      localStorage.setItem('searchList', JSON.stringify([...newArr]))

      // 如果路径没有变化，不跳转
      if (this.searchValue === this.$route.query.key) return

      // 跳转页面,传参  $router : 是路由操作对象，只写对象
      this.$router.push({
        name: 'list',
        // 传递本页面输入的内容
        query: {
          key: this.searchValue
        }
      })
    }
  },
}
</script>

<style scoped>
header {
  display: flex;
  justify-content: space-around;
  align-items: center;
  width: 100vw;
  height: 44px;
  background-color: #b0352f;
  color: white;
}

.header-return i {
  font-size: 26px;
  padding: 0 10px;
}

.search-main {
  display: flex;
  align-items: center;
  width: 270px;
  height: 30px;
  background: white;
  border-radius: 12px;
}

.search-main>i {
  padding: 0 8px;
  font-size: 24px;
  color: #ccc;
}

.search-main form {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

.search-main form input {
  width: 100%;
  font-size: 16px;
  padding-right: 10px;
}

.search-button {
  font-size: 16px;
  padding: 0 10px;
}
</style>