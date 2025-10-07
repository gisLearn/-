<!--
 * @Author: your name
 * @Date: 2023-10-29 20:12:13
 * @LastEditors: your name
 * @LastEditTime: 2023-11-05 09:06:45
 * @Description: 
 * @FilePath: \cesium_vue3\src\components\addmilitaryaffairsplotting\index.vue
-->
<template>
  <div class="home">
    <div id="cesiumContainer">
      <div class="home_tilte" @click="drawColorfun">
        <span>添加军事标绘:</span>
        <div></div>
        <div class="selectfun">
          <el-select @change="changeOption($event)" v-model="value" placeholder="Select">
            <span ref="optionelement"></span>
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
// 添加色斑图方法
import DrawHelper from "@/components/addmilitaryaffairsplotting/utils/DrawWorker";
// 添加飞行方法
import FlyToObject from "@/utils/map/cesiumFlyto";
const value = ref("");
const optionelement = ref();
console.log(optionelement);
const options = [
  {
    value: "polygonCreated",
    label: "钳击箭头"
  },
  {
    value: "tailedAttackCreated",
    label: "攻击箭头"
  },
  {
    value: "straightArrowCreated",
    label: "箭头创建"
  }
];
onMounted(() => {
  initMap();
});

onBeforeUnmount(() => {
  viewer && viewer.destroy();
  viewer = null;
});

let flytopostion = null; //定位对象
let drawHelper = null; //绘制工具
let toolbar = null; //绘制工具监听
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

  drawHelper = new DrawHelper(viewer);
  let toolbarhtml = optionelement.value;
  console.log(toolbar);
  toolbar = drawHelper.addToolbar(toolbarhtml, {
    buttons: ["polygon", "extent", "tailedAttackArrow"]
  });

  var scene = viewer.scene;
  toolbar.addListener("polygonCreated", function(event) {
    console.log("钳击箭头");
    var polygon = new DrawHelper.PolygonPrimitive({
      positions: event.positions,
      custom: event.custom,
      material: Cesium.Material.fromType(Cesium.Material.ColorType)
    });
    scene.primitives.add(polygon);
    polygon.setEditable();
    polygon.addListener("onEdited", function(event) {
      console.log("钳击箭头");
    });
  });
  toolbar.addListener("tailedAttackCreated", function(event) {
    console.log("攻击箭头");
    var polygon = new DrawHelper.TailedAttackPrimitive({
      positions: event.positions,
      custom: event.custom,
      material: Cesium.Material.fromType(Cesium.Material.ColorType)
    });
    scene.primitives.add(polygon);
    polygon.setEditable();
    polygon.addListener("onEdited", function(event) {
      console.log("攻击箭头");
    });
  });
  toolbar.addListener("straightArrowCreated", function(event) {
    var arrow = event.arrow;
    console.log("箭头创建");
    var straightArrowPrimitive = new DrawHelper.StraightArrowPrimitive({
      arrow: arrow,
      material: Cesium.Material.fromType(Cesium.Material.ColorType)
    });
    scene.primitives.add(straightArrowPrimitive);
    straightArrowPrimitive.setEditable();
    straightArrowPrimitive.addListener("onEdited", function(event) {
      console.log("箭头创建");
    });
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

let changeOption = e => {
  flytopostion.flyto({
    lng: 114.4,
    lat: 19.5,
    hight: 800000,
    pitch: -60
  });

  // if (e == "polygonCreated") {
 

  // toolbar.addListener("polygonCreated", function(event) {
  //   loggingMessage("钳击箭头");
  //   var polygon = new DrawHelper.PolygonPrimitive({
  //     positions: event.positions,
  //     custom: event.custom,
  //     material: Cesium.Material.fromType(Cesium.Material.ColorType)
  //   });
  //   scene.primitives.add(polygon);
  //   polygon.setEditable();
  //   polygon.addListener("onEdited", function(event) {
  //     loggingMessage("钳击箭头");
  //   });
  // });
  // }
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