<template>
  <div class="typhoon-info">
    <ul class="typhoon-check-list">
      <li v-for="item in typhoonList.filter(item => item.checked)"
        :key="item.typhoonNum"
        :class="{'active': item.typhoonNum === activeTyphoon.typhoonNum}"
        @click="changeActiveTyphoon(item)">{{ item.typhoonName }}</li>
    </ul>
    <div class="typhoon-info-wrap" v-if="activeTyphoon">
      <div class="typhoon-info-box"
        v-for="(subItem, subIndex) in activeTyphoon.points"
        :key="subIndex">
        <ul class="typhoon-info-list">
          <li class="typhoon-info-item">
            <span>预报机构</span>
            <p>中国</p>
          </li>
          <li class="typhoon-info-item">
            <span>过去时间</span>
            <p>{{ subItem.time }}</p>
          </li>
          <li class="typhoon-info-item">
            <span>中心位置</span>
            <p>{{ subItem.lat }}°E，{{ subItem.lng }}°N</p>
          </li>
          <li class="typhoon-info-item">
            <span>最大风力</span>
            <p>{{ subItem.strong }}级</p>
          </li>
          <li class="typhoon-info-item">
            <span>最大风速</span>
            <p>{{ subItem.speed }}米/秒</p>
          </li>
          <li class="typhoon-info-item">
            <span>中心气压</span>
            <p>{{ subItem.movespeed }}百帕</p>
          </li>
          <li class="typhoon-info-item">
            <span>移动速度</span>
            <p>{{ subItem.movespeed }}公里/小时</p>
          </li>
          <li class="typhoon-info-item">
            <span>移动方向</span>
            <p>{{ subItem.movedirection }}</p>
          </li>
          <li class="typhoon-info-item">
            <div class="typhoon-circle-wrap">
              <div class="typhoon-circle" v-if="subItem.radius7">
                <span class="circle-flag">七级风圈</span>
                <ol class="circle-item">
                  <li v-for="(thirdItem, thirdIndex) in subItem.radius7.split('|')" :key="thirdIndex">
                    <span>{{circleDirection[thirdIndex]}}</span>
                    <p>{{ thirdItem }}</p>
                  </li>
                </ol>
              </div>
              <div class="typhoon-circle" v-if="subItem.radius10">
                <span class="circle-flag">十级风圈</span>
                <ol class="circle-item">
                  <li v-for="(thirdItem, thirdIndex) in subItem.radius10.split('|')" :key="thirdIndex">
                    <span>{{circleDirection[thirdIndex]}}</span>
                    <p>{{ thirdItem }}</p>
                  </li>
                </ol>
              </div>
              <div class="typhoon-circle" v-if="subItem.radius12">
                <span class="circle-flag">十二级风圈</span>
                <ol class="circle-item">
                  <li v-for="(thirdItem, thirdIndex) in subItem.radius12.split('|')" :key="thirdIndex">
                    <span>{{circleDirection[thirdIndex]}}</span>
                    <p>{{ thirdItem }}</p>
                  </li>
                </ol>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineExpose } from "vue"

const props = defineProps({
  typhoonList: { type: Array, default: () => [] }
})
const activeTyphoon = ref(null)
defineExpose({
  changeActiveTyphoon(value) {
    activeTyphoon.value = value
  }
})
const points = ref("")
// 风圈风向
const circleDirection = ref(['东北', '东南', '东北', '东南'])
const changeActiveTyphoon = (value) => {
  activeTyphoon.value = value
}
</script>

<style lang="scss" scoped>
.typhoon-info {
  .typhoon-check-list {
    width: 100%;
    display: flex;
    margin-bottom: 10px;
    li {
      padding: 0 12px;
      height: 20px;
      line-height: 20px;
      color: #999999;
      font-size: 12px;
      border: 1px solid #999999;
      margin-right: 10px;
      cursor: pointer;
      &.active {
        color: #18fefe;
        border: 1px solid #18fefe;
      }
    }
  }

  .typhoon-info-wrap {
    height: calc(100vh - 460px);
    overflow-y: scroll;
  }
  .typhoon-info-box {
    width: 100%;
    display: flex;
    margin-bottom: 10px;
    &:before {
      content: "";
      display: inline-block;
      width: 4px;
      height: 4px;
      border-radius: 50%;
      background: #38e1ff;
      margin-top: 4px;
      margin-right: 10px;
    }
  }
  .typhoon-info-list {
    flex: 1;
    .typhoon-info-item {
      display: flex;
      color: #eeeeee;
      font-size: 14px;
      justify-content: space-between;
      line-height: 24px;
      .typhoon-circle-wrap {
        width: 100%;
        display: flex;
        flex-direction: column;
        .typhoon-circle {
          width: 100%;
          display: flex;
          justify-content: space-between;
          &:nth-of-type(1) {
            .circle-flag {
              color: #25BF2A;
            }
          }
          &:nth-of-type(2) {
            .circle-flag {
              color: #F08A2D;
            }
          }
          &:nth-of-type(3) {
            .circle-flag {
              color: #FE3AA3;
            }
          }
          .circle-item {
            display: flex;
            li {
              margin-left: 10px;
            }
          }
        }
      }
    }
  }
}
</style>