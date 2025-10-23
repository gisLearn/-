<template>
  <div class="weather-info">
    <div class="weather-info-box">
      <img src="@/assets/image/screen/weather.png" width="20" alt="" />
      <ul class="weather-info-detail">
        <li v-for="(item, index) in weatherList" :key="index">
          <span>{{ item.label }}</span>
          <p>{{ item.value }}{{ item.unit }}</p>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  weatherList: { type: Array, default: () => [] }
})
</script>

<style lang="scss" scoped>
.weather-info {
  .weather-info-box {
    display: flex;
    img {
      width: 143px;
      height: 143px;
    }
    .weather-info-detail {
      display: flex;
      flex-wrap: wrap;
      font-size: 14px;
      margin-top: 20px;
      li {
        width: 50px;
        span {
          color: #ffffff;
        }
        p {
          margin-top: 4px;
          color: #18fefe;
        }
      }
    }
  }
}
</style>