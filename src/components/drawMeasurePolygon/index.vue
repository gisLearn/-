<!--
 * @Author: your name
 * @Date: 2023-10-29 20:12:13
 * @LastEditors: your name
 * @LastEditTime: 2023-11-17 14:26:30
 * @Description: 
 * @FilePath: \cesium_vue3\src\components\drawMeasurePolygon\index.vue
-->
<template>
  <div class="home">
    <div id="cesiumContainer">
      <div class="home_tilte" @click="drawColorfun">
        <span>绘制测距测面:</span>
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
// 添加飞行方法
import FlyToObject from "@/utils/map/cesiumFlyto";

// 导入测距测面
import { measureDistance } from "@/components/drawMeasurePolygon/utils/measureDistance";
import { MeasureManager } from "@/components/drawMeasurePolygon/utils/measureArea";

const value = ref("");
const options = [
  {
    value: "distance",
    label: "测量距离"
  },
  {
    value: "area",
    label: "测量面积"
  },
  {
    value: "removeAll",
    label: "清除所有"
  }
];
onMounted(() => {
  initMap();
});
onBeforeUnmount(() => {
  viewer && viewer.destroy();
  viewer = null;
});

let flytopostion = null; //定位飞行
let measureEntityarray = []; //测量管理容器
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
    baseLayerPicker: false
    // imageryProvider: new Cesium.UrlTemplateImageryProvider({
    //   url: "https://map.geoq.cn/arcgis/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
    //   tilingScheme: new Cesium.WebMercatorTilingScheme(),
    //   // maximumLevel: 20,
    // }),
  });
  window.viewer = viewerobject;

  viewer.imageryLayers.removeAll();

  flytopostion = new FlyToObject({
    viewer
  });

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
let measureEntity = null; //绘制功能
let changeOption = e => {
  if (e == "distance") {
    measureEntity = new measureDistance(viewer);
    measureEntityarray.push(measureEntity);
  } else if (e == "area") {
    measureEntity = new MeasureManager(viewer);
    measureEntity.measurePolygon();
    measureEntityarray.push(measureEntity);
  } else if (e == "removeAll") {
    if (measureEntityarray.length > 0) {
      measureEntityarray.forEach(element => {
        element.clear();
      });
      measureEntityarray = [];
    }
  }
};
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
      width: 23%;
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