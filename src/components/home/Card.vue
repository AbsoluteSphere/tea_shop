<template>
  <div class="title">
    <!-- 由于每一个路由都有这一项，直接设一个插槽方便在此处改 -->
    <slot>
      <span>火爆推荐</span>
    </slot>
  </div>
</template>

<script>
export default {
  name: 'Card'
}
</script>

<style scoped>
.title {
  /* width: 100%; */
  text-align: center;
  padding: 10px;
}

.title span {
  font-size: 18px;
  position: relative;
}

/* 左右小圆点，注意一定要content: '' */
.title span::after {
  content: '';
  display: block;
  position: absolute;
  top: 8px;
  right: -15px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #d4c0a7;
}

.title span::before {
  content: '';
  position: absolute;
  display: block;
  top: 8px;
  left: -15px;
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #d4c0a7;
}
</style>