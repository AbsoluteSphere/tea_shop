<template>
  <header>
    <h1>
      <i class="iconfont icon-chaye"></i>
      <span>茗茶</span>
    </h1>
    <div class="search" @click="goSearch">
      <i class="iconfont icon-fangdajing"></i>
      <span>搜您喜欢的...</span>
    </div>
    <div class="kefu">
      <i class="iconfont icon-kefu"></i>
    </div>
  </header>
</template>

<script>

export default {
  name: 'Header',
  methods: {
    goSearch() {
      this.$router.push('/search')
    }
  }
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

header h1 {
  width: 80px;
  line-height: 44px;
  font-size: 22px;
  font-weight: normal;
  font-family: '楷体';
}

header h1 i {
  font-size: 32px;
}

.search {
  display: flex;
  align-items: center;
  width: 240px;
  height: 30px;
  background: white;
  border-radius: 12px;
}

.search i {
  padding: 0 6px;
  font-size: 24px;
  color: #ccc;
}

.search span {
  font-size: 14px;
  color: #ccc;
}

.kefu i {
  font-size: 24px;
  color: white;
}
</style>