<!--
 * @Author: dwzhuyugang 834737857@qq.com
 * @Date: 2023-05-06 22:28:33
 * @LastEditors: your name
 * @LastEditTime: 2023-10-29 16:40:42
 * @FilePath: \cesium_vue3\src\common\Header.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="Header">
    <div class>
      <el-icon v-if="isexpend" :size="22" @click="isexpendfun">
        <Expand />
      </el-icon>
      <el-icon v-else-if="!isexpend" :size="22" @click="isexpendfun">
        <Fold />
      </el-icon>
    </div>
    <span>朱宇刚</span>
  </div>
</template>

<script setup>
let isexpend = ref(true);

const cxt = getCurrentInstance();
const bus = cxt.appContext.config.globalProperties.$bus;

onMounted(() => {});

const isexpendfun = () => {
  isexpend.value = !isexpend.value;
  bus.emit("Bus_menuIsCollapse", isexpend.value);
};
</script>

<style lang="scss" scoped>
.Header {
  display: flex;
  justify-content: space-between;
  line-height: 60px;
  color: #fff;
  h4 {
    font-size: 22px;
  }
}
</style>