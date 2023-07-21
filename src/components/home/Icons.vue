<template>
  <ul class="icons">
    <li v-for="(item, index) in iconList" :key="index">
      <img :src="item.imgUrl" alt="">
      <span>{{ item.title }}</span>
    </li>
  </ul>
</template>

<script>
export default {
  // 接收Home传来的item.data数组
  props: {
    iconList: Array
  },
  data() {
    return {
      // iconList: [
      //   {
      //     id: 1,
      //     title: '自饮茶',
      //     imgUrl: './images/icons1.png'
      //   },
      //   {
      //     id: 2,
      //     title: '茶具',
      //     imgUrl: './images/icons2.png'
      //   },
      //   {
      //     id: 3,
      //     title: '茶礼盒',
      //     imgUrl: './images/icons3.png'
      //   },
      //   {
      //     id: 4,
      //     title: '领福利',
      //     imgUrl: './images/icons4.png'
      //   },
      //   {
      //     id: 5,
      //     title: '官方验证',
      //     imgUrl: './images/icons5.png'
      //   }
      // ]
    }
  }
}
</script>

<style scoped>
.icons {
  padding: 14px 0;
  display: flex;
  /* 每个li水平平均铺开 */
  justify-content: space-around;
}

.icons li {
  /* li中的标签垂直摆放 */
  display: flex;
  flex-direction: column;
  align-items: center;
}

.icons img {
  width: 38px;
  height: 38px;
}

.icons span {
  padding: 4px 0;
  font-size: 14px;
}
</style>