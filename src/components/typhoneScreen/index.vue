<template>
  <div class="home">
    <Header />
    <div id="cesiumContainer">
      <div class="home_left">
        <Card title="台风路径">
          <TyphoonList :typhoonList="typhoonList" @typhoonCheck="changetyphoonCheck"/>
        </Card>
        <Card title="台风逐点信息">
          <div class="typhoon-info">
            <TyphoonInfo :typhoonList="typhoonList" ref="typhoonInfoRef"/>
          </div>
        </Card>
      </div>
      <div class="home_right">
        <Card title="环境气象信息">
          <Weather :weatherList="weatherList" />
        </Card>
        <Card title="水情">
          <LineEchart />
        </Card>
      </div>
    </div>
  </div>
</template>

<script setup>
import axios from 'axios'
import Header from './children/Header'
import Card from './children/Card.vue'
import TyphoonList from './children/TyphoonList.vue'
import TyphoonInfo from './children/TyphoonInfo.vue'
import Weather from './children/Weather.vue'
import LineEchart from './children/LineEchart.vue'
// 导入台风数据
import { typhoondata } from "@/components/typhoon/utils/tyTestData.js";
// 导入台风方法
import {
  typhoon,
  typhoonPopup
} from "@/components/typhoon/utils/typhoonNew.js";
// 添加弹窗方法
import Bubble from "@/components/typhoon/utils/index.js";

let viewer = null;
const typhoonInfoRef = ref("")

const weatherList = ref([
  { label: '温度', value: '23', unit: '℃'},
  { label: '风速', value: '40', unit: 'm/s'},
  { label: '湿度', value: '23', unit: 'RH'},
  { label: '风向', value: '东南', unit: ''},
  { label: '气压', value: '20', unit: 'PA'}
])
const typhoonList = ref([{
    typhoonName: '山竹',
    typhoonNum: '201822',
    typhoonEnName: 'MANGKHUT',
    checked: false
}, {
    typhoonName: '榴莲',
    typhoonNum: '201823',
    typhoonEnName: 'DURIAN',
    checked: false
}, {
    typhoonName: '潭美',
    typhoonNum: '201824',
    typhoonEnName: 'TRAMI',
    checked: false
}, {
    typhoonName: '康妮',
    typhoonNum: '201825',
    typhoonEnName: 'KONG-REY',
    checked: false
}, {
    typhoonName: '玉兔',
    typhoonNum: '201826',
    typhoonEnName: 'YUTU',
    checked: false
}])
onMounted(() => {
  initMap();
  viewer.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(103.486138, 30.465411, 10000000.0) });
});

onBeforeUnmount(() => {
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
  });
  viewer = viewerobject;

  viewer.imageryLayers.removeAll();

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

// 台风点击弹窗
let addHanderEvent = () => {
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
  }, Cesium.ScreenSpaceEventType.LEFT_CLICK);
}

let bubbleEntityinfo = (entityinfo) => {
  if (tybubbles) {
    tybubbles.windowClose();
  }
  tybubbles = new Bubble({
    info: entityinfo,
    viewer
  });
}

// 勾选台风
let changetyphoonCheck = (item) => {
  if (item.checked) {
    typhoonInfoRef.value.changeActiveTyphoon(item)
    axios.get(`./data/typhoon/${item.typhoonNum}.json`).then(res => {
      console.log(res)
      let typhoonData = res.data.data[0]
      console.log(typhoonData)
      let ForecastPathStatus = {
        maindland: true, //预测路径中国大陆
        usa: true, //预测路径美国
        japan: true, //预测路径日本
        taiwan: true
      }
      let typhoonStatusinfo = { isCurrent: true, typhoonViewer: "viewer" }
      item.ty = new typhoon(
        viewer,
        Cesium,
        typhoonData,
        ForecastPathStatus,
        typhoonStatusinfo
      );
      item.points = typhoonData.points
      item.ty.ByIntervalDrawTyphoon()
    })
  } else {
    item.ty.removeTyphoon()
  }
   
}

</script>

<style lang="scss" scoped>
.home {
  position: relative;
  width: 100%;
  height: 100%;
  background: #000000;
  display: flex;
  flex-direction: column;

  .card {
    width: 100%;
    position: relative;
    .title {
      height: 40px;
      display: flex;
      align-items: center;
      color: #ffffff;
      background: url('@/assets/image/screen/title_border.png');
      background-position: left bottom;
      background-size: 410px 3px;
      background-repeat: no-repeat;
      margin-bottom: 20px;
      img {
        margin-right: 10px;
      }
    }
  }
  .home_left {
    position: absolute;
    height: 100%;
    width: 300px;
    top: 0;
    left: 0;
    padding: 20px;
    z-index: 100;
    background: rgba(19, 27, 29, 0.9);
  }
  .home_right {
    position: absolute;
    height: 100%;
    width: 300px;
    top: 0;
    right: 0;
    padding: 20px;
    z-index: 10;
    background: rgba(19, 27, 29, 0.9);
     
  }
  #cesiumContainer {
    width: 100%;
    height: 100%;
    flex: 1;
    position: relative;
  }
}
</style>