<template>
  <div class="tabbar">
    <ul>
      <li v-for="(item, index) in routerList" :key="index" @click="switchTab(item.path)">
        <img :src="$route.path.includes(item.path) ? item.selected : item.active" alt="" />
        <span :class="$route.path.includes(item.path) ? 'active' : ''">
          {{ item.title }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  data() {
    return {
      routerList: [
        {
          title: "首页",
          path: "/home",
          // 默认图片
          active: "/images/home.png",
          // 选中后的图片
          selected: "/images/home-select.png",
        },
        {
          title: "分类",
          path: "/list",
          active: "/images/list.png",
          selected: "/images/list-select.png",
        },
        {
          title: "购物车",
          path: "/cart",
          active: "/images/cart.png",
          selected: "/images/cart-select.png",
        },
        {
          title: "我的",
          path: "/my",
          active: "/images/my.png",
          selected: "/images/my-select.png",
        },
      ],
    };
  },
  methods: {
    switchTab(path) {
      //判断是否点击的是同一个路由
      if (this.$route.path == path) return;
      //对应跳转页面
      this.$router.replace(path);
    },
  },
};
</script>

<style scoped>
.tabbar {
  width: 100%;
  height: 60px;
  background-color: white;
}

.tabbar ul {
  display: flex;
  justify-content: space-around;
  align-items: center;
  /* 为了居中 */
  width: 100%;
  height: 100%;
}

.tabbar ul li {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.tabbar ul li img {
  width: 31px;
  height: 31px;
}

.tabbar ul li span {
  font-size: 16px;
}

.active {
  color: red;
}
</style>
