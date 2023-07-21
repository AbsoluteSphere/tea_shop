<template>
  <div id="app">
    <!-- 只要用到keep-alive会多两个生命周期 -->
    <keep-alive>
      <router-view></router-view>
    </keep-alive>
  </div>
</template>

<script>
export default {
  created() {
    this.$store.commit('INIT_USER')
  }
}
</script>