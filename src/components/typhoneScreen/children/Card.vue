<template>
  <div class="card">
    <div class="title">
        <img src="@/assets/image/screen/title_icon.png" width="20" alt="" />
        <span class="text">
          {{ title }}
        </span>
    </div>
    <slot></slot>
  </div>
</template>

<script setup>
const props = defineProps({
  title: { type: String, default: ''}
})
</script>

<style lang="scss" scoped>
.card {
width: 100%;
position: relative;
  .title {
    height: 40px;
    display: flex;
    align-items: center;
    color: #ffffff;
    background: url('@/assets/image/screen/title_border.png');
    background-position: left bottom;
    background-size: 410px 3px;
    background-repeat: no-repeat;
    margin-bottom: 20px;
    img {
    margin-right: 10px;
    }
  }
}
</style>