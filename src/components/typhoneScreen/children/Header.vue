<template>
  <div class="header-wrap">
    <img src="@/assets/image/screen/top_title.png"  class="header-logo" />
    <h1>广东省风暴潮系统</h1>
  </div>
</template>
<script setup></script>
<style  lang="scss" scoped>
  .header-wrap {
    width: 100%;
    background: url("@/assets/image/screen/top_bg.png") no-repeat;
    background-size: 100% 100%;
    height: 56px;
    position: relative;
    .header-logo {
      width: 100%;
      height: 100%;
    }
    h1 {
      position: absolute;
      top: 50%;
      left: 50%;
      font-size: 18px;
      transform: translate(-40%, -70%);
      color: #ffffff;
    }
  }
</style>
