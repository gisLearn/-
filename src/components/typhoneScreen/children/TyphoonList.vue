<template>
  <ul class="typhoon-list">
      <li class="typhoon-list-item" v-for="item in typhoonList" :key="item.typhoonNum">
          <div>
            <el-checkbox v-model="item.checked" @change="changetyphoonCheck(item)"></el-checkbox>
            <span class="typhoon-num">{{ item.typhoonNum }}</span>
            <span class="typhoon-name">{{ item.typhoonName }}</span>
          </div>
          <span>{{ item.typhoonEnName }}</span>
      </li>
  </ul>
</template>

<script setup>
import { defineEmits } from 'vue';
const emit = defineEmits(['typhoonCheck'])
const props = defineProps({
  typhoonList: { type: Array, default: () => [] }
})
const changetyphoonCheck = (item) => {
  emit('typhoonCheck', item)
}
</script>

<style lang="scss" scoped>
.typhoon-list {
  .typhoon-list-item {
    display: flex;
    color: #ffffff;
    align-items: center;
    justify-content: space-between;
    font-size: 14px;
    .typhoon-num {
      margin: 0 10px;
    }
    ::v-deep .el-checkbox {
      .el-checkbox__inner {
        background: transparent!important;
      }
    }
  }
}
</style>