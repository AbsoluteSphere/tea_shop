<template>
  <div class="like">
    <Card>
      <span>猜你喜欢</span>
    </Card>
    <ul>
      <li v-for="(item, index) in likeList" :key="index" @click="goDetail(item.id)">
        <h2>
          <!-- v-lazy懒加载图片 -->
          <img v-lazy="item.imgUrl" alt="">
        </h2>
        <h3>{{ item.name }}</h3>
        <div>
          <span>￥</span>
          <b>{{ item.price }}</b>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import Card from './Card.vue';
export default {
  name: 'Name',
  components: {
    Card
  },
  // 接收Home传来的item.data数组
  props: {
    likeList: Array
  },
  methods: {
    goDetail(id) {
      // alert(1)
      this.$router.push({
        path: '/detail',
        // 给后端传id
        // query显式路由传值
        query: {
          id
        }
        // params隐式传值要多加name:router里的name
        // name: 'Detail',
        // params: {
        //   id
        // }
      })
    }
  }
}
</script>

<style scoped>
/* 在ul中添加开启弹性盒子 */
.like ul {
  display: flex;
  /* 换行 */
  flex-wrap: wrap;
}

.like ul li {
  width: 50%;
  /* 每个li中的元素都竖直排列 */
  display: flex;
  flex-direction: column;
  /* 让每个li居中 */
  justify-content: center;
  align-items: center;
}

.like h3 {
  /* 要给固定的宽，不然会居中 */
  width: 92%;
  font-size: 14px;
  font-weight: 400;
  color: #222;
  /* 让超过宽度的文字隐藏成省略号 */
  overflow: hidden;
  text-overflow: ellipsis;
  /* 规定段落中的文本不进行换行 */
  white-space: nowrap;
}

.like ul li>div {
  width: 92%;
  padding: 6px 0;
  text-align: left;
  color: red;
}

.like ul li>div span {
  font-size: 16px;
}

.like ul li>div b {
  font-size: 18px;
}

.like img {
  width: 176px;
  height: 176px;
}

img[lazy=loading] {
  background: #f7f7f7;
}
</style>