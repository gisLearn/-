<template>
  <div :id="id" class="box">
    <div class="pine"></div>
    <div class="box-wrap">
      <div class="close" @click="closeClick">X</div>
      <div class="area">
        <div class="area-title fontColor">台风信息</div>
      </div>
      <div class="content">
        <div class="data-li" v-for="(item, index) in tableSet" :key="index">
          <div class="data-label textColor">{{item.name}}</div>
          <div class="data-value">
            <span class="label-num yellowColor">{{item.value}}</span>
          </div>
        </div>
        <!-- <div class="data-li">
          <div class="data-label textColor">实时水位：</div>
          <div class="data-value">
            <span class="label-num yellowColor">100</span>
            <span class="label-unit textColor">m³/s</span>
          </div>
        </div>-->
      </div>
    </div>

    <!-- <img src="./layer_border.png" alt="Norway"> -->
  </div>
</template>

<script setup>
let show = ref(true);
const ctx = getCurrentInstance().appContext.config.globalProperties;
let props = defineProps({
  typhooninfo: {
    type: Object,
    default: {}
  }
});

const tableSet = computed(() => {
  let info = [];
  let obj = props.typhooninfo.properties;
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const element = obj[key];
      let infovalue = { name: key, value: element };
      info.push(infovalue);
    }
  }

  return info || [];
}); // 表格设置

onMounted(() => {
  console.log(tableSet);
});

function closeClick() {
  console.log(ctx);
  if (ctx.closeEvent) {
    ctx.closeEvent();
  }
}
</script>

<script>
export default {
  name: "DynamicLabel"
};
</script>


<style lang="scss">
.box {
  width: 200px;
  position: relative;
  bottom: 0;
  left: 0;
}
.close {
  position: absolute;
  color: #fff;
  top: 1px;
  right: 10px;
  text-shadow: 2px 2px 2px #022122;
  cursor: pointer;
  animation: fontColor 1s;
}
.box-wrap {
  position: absolute;
  left: 19%;
  top: 0;
  width: 100%;
  height: 163px;
  border-radius: 5px 0px 5px 0px;
  // border-radius: 50px 0px 50px 0px;

  border: 1px solid #38e1ff;
  background-color: #38e1ff4a;
  box-shadow: 0 0 10px 2px #29baf1;
  animation: slide 2s;
}
.box-wrap .area {
  position: absolute;
  top: 20px;
  right: 0;
  width: 95%;
  height: 30px;
  background-image: linear-gradient(to left, #4cdef9, #4cdef96b);
  border-radius: 30px 0px 0px 0px;
  animation: area 1s;
}
.pine {
  position: absolute;
  // left: 0;
  // bottom: -83px;
  width: 100px;
  height: 100px;
  box-sizing: border-box;
  line-height: 120px;
  text-indent: 5px;
}

.pine::before {
  content: "";
  position: absolute;
  left: -23px;
  bottom: -109px;
  width: 72%;
  height: 10px;
  box-sizing: border-box;
  border-bottom: 1px solid #38e1ff;
  transform-origin: bottom center;
  transform: rotateZ(118deg) scale(1.5);
  animation: slash 0.5s;
  filter: drop-shadow(1px 0px 2px #03abb4);
  /* transition: slash 2s; */
}

.area .area-title {
  text-align: center;
  line-height: 30px;
}
.textColor {
  font-size: 11px;
  font-weight: 600;
  color: #ffffff;
  text-shadow: 1px 1px 5px #002520d2;
  animation: fontColor 1s;
}
.yellowColor {
  font-size: 10px;
  font-weight: 600;
  color: #f09e28;
  text-shadow: 1px 1px 5px #002520d2;
  animation: fontColor 1s;
}

.fontColor {
  font-size: 11px;
  font-weight: 800;
  color: #ffffff;
  text-shadow: 1px 1px 5px #002520d2;
  animation: fontColor 1s;
}
.content {
  // padding: 55px 10px 10px 10px;
  margin-top: 58px;
  overflow: auto;
  position: absolute;
  width: 200px;
  height: 92px;
}
.content .data-li {
  display: flex;
  padding: 4px 14px;
  justify-content: space-between;
}

.content .data-label {
  text-align: left;
  width: 40%;
}

.content .data-value {
  text-align: left;
  width: 60%;
}

@keyframes fontColor {
  0% {
    color: #ffffff00;
    text-shadow: 1px 1px 5px #00252000;
  }
  40% {
    color: #ffffff00;
    text-shadow: 1px 1px 5px #00252000;
  }
  100% {
    color: #ffffff;
    text-shadow: 1px 1px 5px #002520d2;
  }
}

@keyframes slide {
  0% {
    border: 1px solid #38e1ff00;
    background-color: #38e1ff00;
    box-shadow: 0 0 10px 2px #29baf100;
  }

  100% {
    border: 1px solid #38e1ff;
    background-color: #38e1ff4a;
    box-shadow: 0 0 10px 2px #29baf1;
  }
}
@keyframes area {
  0% {
    width: 0%;
  }
  25% {
    width: 0%;
  }

  100% {
    width: 95%;
  }
}

/* img{
            position:absolute;
            left:30%;
            top:0;
            width: 100%;
            box-shadow: 0 0 10px 2px #29baf1;
        } */

@keyframes slash {
  0% {
    transform: rotateZ(118deg) scale(0);
  }

  100% {
    transform: rotateZ(118deg) scale(1.5);
  }
}
</style>
