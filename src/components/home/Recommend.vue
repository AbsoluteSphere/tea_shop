<template>
  <div class="recommend">
    <Card>
      <!-- 在此处<span>修改插槽</span> -->
      <!-- <span>修改插槽</span> -->
    </Card>
    <ul>
      <li v-for="(item, index) in recommendList" :key="index">
        <h2>
          <img v-lazy="item.imgUrl" alt="">
        </h2>
        <div>
          <h3>{{ item.name }}</h3>
          <p>{{ item.content }}</p>
          <div class="price">
            <span>￥</span>
            <b>{{ item.price }}</b>
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import Card from './Card.vue'
export default {
  components: {
    Card
  },
  // 接收Home传来的item.data数组
  props: {
    recommendList: Array
  },
  data() {
    return {
      // recommendList: [
      //   {
      //     id: 1,
      //     name: '龙井1號铁罐250g',
      //     content: '鲜爽甘醇 口粮首选',
      //     price: '68',
      //     imgUrl: './images/recommend.jpeg'
      //   },
      //   {
      //     id: 2,
      //     name: '龙井1號铁罐250g',
      //     content: '鲜爽甘醇 口粮首选',
      //     price: '68',
      //     imgUrl: './images/recommend.jpeg'
      //   },
      //   {
      //     id: 3,
      //     name: '龙井1號铁罐250g',
      //     content: '鲜爽甘醇 口粮首选',
      //     price: '68',
      //     imgUrl: './images/recommend.jpeg'
      //   },
      //   {
      //     id: 4,
      //     name: '龙井1號铁罐250g',
      //     content: '鲜爽甘醇 口粮首选',
      //     price: '68',
      //     imgUrl: './images/recommend.jpeg'
      //   }
      // ]
    }
  }
}
</script>

<style scoped>
.recommend ul li {
  position: relative;
}

.recommend ul li h2 {
  text-align: center;
}

.recommend ul li img {
  width: 360px;
  height: 140px;
  border-radius: 12px;
}

.recommend ul li img[lazy=loading] {
  background: #f7f7f7;
}

.recommend ul li>div {
  position: absolute;
  right: 0;
  top: 0;
  display: flex;
  flex-direction: column;
  padding: 30px;
}

.recommend ul li>div h3 {
  font-size: 16px;
}

.recommend ul li>div p {
  font-size: 16px;
}

.price {
  margin-top: 25px;
  text-align: right;
  color: red;
}

.price span {
  font-size: 16px;
}
</style>