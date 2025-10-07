<!--
 * @Author: your name
 * @Date: 2023-10-29 20:12:13
 * @LastEditors: lyq
 * @LastEditTime: 2024-03-27 18:35:02
 * @Description: 
 * @FilePath: \cesium_vue3\src\components\typhoon\index.vue
-->
<template>
  <div class="home">
    <div id="cesiumContainer">
      <div class="home_tilte" @click="drawColorfun">
        <span>绘制台风路径:</span>
        <div class="selectfun">
          <el-select @change="changeOption($event)" v-model="value" placeholder="Select">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
              :disabled="item.disabled"
            />
          </el-select>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 导入台风数据
import { typhoondata } from "@/components/typhoon/utils/tyTestData.js";
// 导入台风方法
import {
  typhoon,
  typhoonPopup
} from "@/components/typhoon/utils/typhoonNew.js";

// 添加弹窗方法
import Bubble from "@/components/typhoon/utils/index.js";
// 添加飞行方法
import FlyToObject from "@/utils/map/cesiumFlyto";
const value = ref("");
let viewer = null;
const options = [
  {
    value: "loadtyphoon",
    label: "加载台风"
  },
  {
    value: "removetyphoon",
    label: "清除台风"
  }
];
onMounted(() => {
  initMap();
});

onBeforeUnmount(() => {
  removeAll();
  viewer && viewer.destroy();
  viewer = null;
});

let flytopostion = null; //飞行定位
let tybubbles = null; //台风弹窗对象
let initMap = () => {
  Cesium.Ion.defaultAccessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiI1ZjQ3M2NiNi05Mjg4LTRhY2QtYjhhMy0yZjdlZDNlMDk5YjEiLCJpZCI6MjY1MzYsInNjb3BlcyI6WyJhc3IiLCJnYyJdLCJpYXQiOjE1ODc5MDM5NTN9.4ebCKPuQJoVEvBb68Y3jtvlycCF4YF5YFMDZp87HR5s";
  var viewerobject = new Cesium.Viewer("cesiumContainer", {
    timeline: false,
    scene3DOnly: true,
    animation: false,
    homeButton: false,
    geocoder: false,
    navigationHelpButton: false,
    infoBox: false,
    fullscreenButton: false,
    selectionIndicator: false,
    sceneMode: Cesium.SceneMode.SCENE3D,
    baseLayerPicker: false,

    // imageryProvider: new Cesium.UrlTemplateImageryProvider({
    //   url: "https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
    //   tilingScheme: new Cesium.WebMercatorTilingScheme(),
    //   // maximumLevel: 20,
    // }),
  });
  viewer = viewerobject;

  viewer.imageryLayers.removeAll();

  flytopostion = new FlyToObject({
    viewer
  });
  //  添加鼠标事件弹窗
  addHanderEvent();

  // 开启CustomShader模型材质贴图
  // Cesium.ExperimentalFeatures.enableModelExperimental = true;
  //  添加夜景地图
  var tdtLayer = new Cesium.UrlTemplateImageryProvider({
    url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png ",
    subdomains: ["a", "b", "c", "d"]
  });

  viewer.imageryLayers.addImageryProvider(tdtLayer);

  viewer._cesiumWidget._creditContainer.style.display = "none";

  viewer.camera.setView({
    destination: Cesium.Cartesian3.fromDegrees(
      113.36824706049,
      23.127818196783,
      2000
    ),
    orientation: {
      heading: Cesium.Math.toRadians(0),
      pitch: Cesium.Math.toRadians(-90),
      roll: Cesium.Math.toRadians(0)
    }
  });
};

// 台风加载方法
let ty = null;
let changeOption = e => {
  // 飞行定位
  flytopostion.flyto({
    lng: 114.4,
    lat: 19.5,
    hight: 800000,
    pitch: -60
  });
  if (ty == null) {
    let typhoonData = typhoondata.data[0];
    let ForecastPathStatus = {
      maindland: true, //预测路径中国大陆
      usa: true, //预测路径美国
      japan: true, //预测路径日本
      taiwan: true
    };
    let typhoonStatusinfo = { isCurrent: true, typhoonViewer: "viewer" };
    ty = new typhoon(
      viewer,
      Cesium,
      typhoonData,
      ForecastPathStatus,
      typhoonStatusinfo
    );
  }

  if (e == "loadtyphoon") {
    ty.ByIntervalDrawTyphoon();
  } else if (e == "removetyphoon") {
    ty.removeTyphoon();
    ty = null;
  }
};

// 清除所有方法
function removeAll() {
  if (ty) {
    ty.removeTyphoon();
    ty = null;
  }

  tybubbles && tybubbles.windowClose();
}

// 台风点击弹窗
/**
 * 鼠标单击事件
 */

function addHanderEvent() {
  let handler = new Cesium.ScreenSpaceEventHandler(viewer.canvas);

  handler.setInputAction(function(movement) {
    var drillPick = viewer.scene.drillPick(movement.position);
    var pick = viewer.scene.pick(movement.position);
    // 弹出台风信息框
    var inTyphoonPopup = typhoonPopup(drillPick, movement, viewer);
    console.log(inTyphoonPopup);
    if (Object.keys(inTyphoonPopup).length > 0) {
      bubbleEntityinfo(inTyphoonPopup);
    } else {
      if (tybubbles) {
        tybubbles.windowClose();
      }
    }
    // clickWatrStormAnyShowLine(drillPick, movement.position);
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

function bubbleEntityinfo(entityinfo) {
  if (tybubbles) {
    tybubbles.windowClose();
  }
  tybubbles = new Bubble({
    info: entityinfo,
    viewer
  });
}
</script>

<style lang="scss" scoped>
.home {
  position: relative;
  width: 100%;
  height: 100%;
  #cesiumContainer {
    width: 100%;
    height: 100%;
    .home_tilte {
      display: flex;

      line-height: 40px;
      z-index: 1000;
      position: absolute;
      width: 28%;
      height: 40px;
      margin-top: 5px;
      background: darkgray;
      border-radius: 5px;
      .selectfun {
        width: 250px;
        height: 40px;
      }
      span {
        margin-left: 10px;
      }
    }
  }
}
</style>