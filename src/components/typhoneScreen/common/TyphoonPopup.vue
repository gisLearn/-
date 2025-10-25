<template>
  <div  class="box">
    <div class="pine"></div>
    <div class="box-wrap">
      <!-- <div class="close" @click="closeClick">X</div> -->
      <div class="area">
        <div class="area-title fontColor">{{props.typhooninfo.name+" "+props.typhooninfo.lte_pci}}</div>
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
  let obj = props.typhooninfo;
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
  console.log(props)
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


<style scoped>
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
  left: -50%;
  top: 209px;
  width: 34%;
  height: 28px;
  border-radius: 5px 0px 5px 0px;
 
  
  border: 1px dotted #38e1ff;
  background-color: rgba(202, 225, 194, 1.290196);
  box-shadow: 0 0 10px 2px #29baf1;
  /* animation: slide 5s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  animation-direction: alternate; */


}

.box-wrap .area {
  position: absolute;
  top: 2px;
  right: 0;
  width: 95%;
  height: 25px;
  
  background-image: linear-gradient(to left, rgb(100, 200, 10), rgba(70, 66, 210, 1.419608));
  border-radius: 30px 0px 0px 0px;
  /* animation: areaimage 5s; */
  animation-name: areaimage;
      /* 2、动画持续时间 */
      animation-duration: 6s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in;
  animation-direction: alternate;

}
.pine {
  position: absolute;
  /* // left: 0;
  // bottom: -83px; */
  width: 20px;
  height: 13px;
  box-sizing: border-box;
  line-height: 120px;
  text-indent: 5px;
}

.pine::before {
  content: "";
  position: absolute;
  left: -45px;
    bottom: -235px;
    width: 103%;
  height: 10px;
  box-sizing: border-box;
  border-bottom: 2px dotted #38e1ff;
  transform-origin: bottom center;
  transform: rotateZ(92deg) scale(1.5);
  animation: slash 0.5s;
  filter: drop-shadow(1px 0px 2px #03abb4);
  /* transition: slash 2s; */
}

.area .area-title {
  text-align: center;
  line-height: 25px;
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
  animation: fontColor 1s ;

}

.fontColor {
  font-size: 8px;
  font-weight: 800;
  color: #ffffff;
  text-shadow: 1px 1px 5px #002520d2;


  animation-name: fontColor;
      /* 2、动画持续时间 */
      animation-duration: 3s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in;
  animation-direction: alternate;
}
.content {
  /* // padding: 55px 10px 10px 10px; */
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
    color: #ffffff;
    text-shadow: 1px 1px 5px #00252000;
  }
  40% {
    color: #ffffff;
    text-shadow: 1px 5px 5px #d16e1100;
  }
  100% {
    color: #ffffff;
    text-shadow: 1px 10px 5px #2bb6a3d2;
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
@keyframes areaimage {
  0% {

    background-image: linear-gradient(to left, rgb(119, 33, 145), rgba(100, 200, 100, 1.419608));
  }
  25% {
    background-image: linear-gradient(to right, rgb(22, 123, 190), rgba(100, 200, 100, 1.419608));
  }

  100% {
    background-image: linear-gradient(to left, rgb(100, 200, 10), rgba(70, 66, 210, 1.419608));

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
