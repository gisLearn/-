<!--
 * @Author: your name
 * @Date: 2023-09-12 21:24:11
 * @LastEditors: your name
 * @LastEditTime: 2023-09-14 22:25:05
 * @Description: 
 * @FilePath: \cesium_vue3\src\common\GetTimer.vue
-->
<template>
  <div class="Timer_content">
    <el-select
      v-model="value"
      placeholder="Select"
      style="width:120px"
      :popper-append-to-body="false"
    >
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value"
        :disabled="item.disabled"
      />
    </el-select>

    <el-date-picker v-model="value2" type="month" placeholder="Pick a month" style="width:120px" />
  </div>
</template>

<script setup>
const value = ref("广州市");
const value2 = ref("");

const options = [
  {
    value: "Option1",
    label: "Option1"
  },
  {
    value: "Option2",
    label: "Option2",
    disabled: true
  },
  {
    value: "Option3",
    label: "Option3"
  },
  {
    value: "Option4",
    label: "Option4"
  },
  {
    value: "Option5",
    label: "Option5"
  }
];
</script>

<style>
</style>