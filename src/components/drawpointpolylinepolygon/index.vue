<!--
 * @Author: your name
 * @Date: 2023-10-29 20:12:13
 * @LastEditors: your name
 * @LastEditTime: 2023-11-09 16:13:00
 * @Description: 
 * @FilePath: \cesium_vue3\src\components\drawpointpolylinepolygon\index.vue
-->
<template>
  <div class="home">
    <div id="cesiumContainer">
      <div class="home_tilte" @click="drawColorfun">
        <span>绘制圆正方形面:</span>
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
// 添加点线面绘制方法
import {
  DrawRectangle,
  DrawCircle,
  DrawPolygon
} from "@/components/drawpointpolylinepolygon/utils/DrawTool";

// 绘制直线和贝塞尔曲线

import CreateLineArrow from "@/components/drawpointpolylinepolygon/utils/CreateLineArrow";
// 添加飞行方法
import FlyToObject from "@/utils/map/cesiumFlyto";
const value = ref("");
const options = [
  {
    value: "Rectangle",
    label: "矩形绘制"
  },
  {
    value: "Circle",
    label: "圆形绘制"
  },
  {
    value: "Polygon",
    label: "面绘制"
  },
  {
    value: "CreateLineArrow",
    label: "绘制直线"
  },
  {
    value: "CreateDrawCurve",
    label: "绘制曲线"
  }
];
onMounted(() => {
  initMap();
});

onBeforeUnmount(() => {
  viewer && viewer.destroy();
  viewer = null;
});

let flytopostion = null;
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
let drawsObj = null;
let changeOption = e => {
  if (e == "Rectangle") {
    drawsObj = new DrawRectangle({
      viewer: viewer,
      callback: function callbackFun(obj) {
        // console.log("画完了~~", drawsObj.getData());
        this.entity = obj;
        let rectdata = drawsObj.getDatawkt();
        console.log(rectdata.wkt);
        drawsObj.destroy(); //销毁handler事件交互
      }
    });
    drawsObj.startCreate();
  } else if (e == "Circle") {
    drawsObj = new DrawCircle({
      viewer: viewer,
      callback: function callbackFun(obj) {
        let rectdata = drawsObj.getDatawkt();
        console.log(rectdata.wkt);
        this.entity = obj;

        drawsObj.destroy(); //销毁handler事件交互
      }
    });
    drawsObj.startCreate();
  } else if (e == "Polygon") {
    drawsObj = new DrawPolygon({
      viewer: viewer,
      callback: function callbackFun(obj) {
        let rectdata = drawsObj.getDatawkt();
        console.log(rectdata.wkt);

        this.entity = obj;
        drawsObj.destroy(); //销毁handler事件交互
      }
    });
    drawsObj.startCreate();
  } else if (e == "CreateLineArrow") {
    CreateLineArrow(
      viewer,
      [],
      {
        color: Cesium.Color.RED,
        width: 25,
        straight: true
      },
      function(e) {
        console.log(e);
      }
    );
  } else if (e == "CreateDrawCurve") {
    CreateLineArrow(
      window.viewer,
      [],
      {
        color: Cesium.Color.GREEN,
        width: 25,
        straight: false
      },
      function(e) {
        console.log(e);
      }
    );
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
      width: 25%;
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