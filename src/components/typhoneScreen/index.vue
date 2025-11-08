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
        <div class="mapLayer">
          <MapLayer/>
        </div>
        
      </div>

     
    </div>
   
    <!-- 克里金插值中的canvasMap -->
    <canvas id="canvasMap" style="display:none;"></canvas>
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
import MapLayer from './children/MapLayer.vue'
// 导入台风数据
import { typhoondata } from "@/components/typhoon/utils/tyTestData.js";
// 导入台风方法
import {
  typhoon,
  typhoonPopup
} from "@/components/typhoon/utils/typhoonNew.js";
// 添加弹窗方法
import Bubble from "@/components/typhoon/utils/index.js";

// // 导入点位数据
import gdqxjpoint from "@/components/typhoneScreen/utils/gdqxjpoint.js";
// // 导入克里金插值对象
import {
  loadKring,
  _getJsonData,
  addLYBuildingPoint,
  removeLYBuildingPoint,
  changepointshow
} from "@/components/typhoneScreen/utils/kringinginsance.js";

let viewer = null;
const typhoonInfoRef = ref("")

// 克里金插值颜色表
let kringColors = [
    {
      min: 0, //最小值
      max: 15, //最大值
      color: [
        //渐变色值
        "#137902",
        "#127C00",
        "#138600",
        "#159400",
        "#389E26",
        "#39A526",
        "#39AF24",
        "#3CB925",
        "#43C92B",
        "#4BD931",
        "#50EA34",
        "#55FF36",
        "#76FF5D",
        "#8FFF7B",
        "#A8FF99"
      ] //颜色渐变条
    },
    {
      min: 15,
      max: 30,
      color: [
        //渐变色值
        "#025ABD",
        "#005DC7",
        "#0062D1",
        "#0066D8",
        "#0068DF",
        "#006BE6",
        "#0B78F2",
        "#1B80F3",
        "#2F8AF1",
        "#419AFF",
        "#5AA8FF",
        "#77B7FF",
        "#8CC2FF",
        "#A6D0FF",
        "#BFDDFF"
      ]
    },
    {
      min: 30,
      max: 45,
      color: [
        //渐变色值
        "#FFF3C7",
        "#FFF0B7",
        "#FFEEA8",
        "#FFEB9D",
        "#FFE682",
        "#FFE061",
        "#FFD83B",
        "#FFCD04",
        "#FAC800",
        "#F5C400",
        "#ECBD00",
        "#E4B700",
        "#D6AC00",
        "#CAA200",
        "#C49D00"
      ]
    },
    {
      min: 45,
      max: 70,
      color: [
        //渐变色值
        "#FFD8D8",
        "#FFCDCC",
        "#FFB6B5",
        "#FFAEAD",
        "#FF9E9D",
        "#FF908F",
        "#FF7977",
        "#FF605E",
        "#F54F4D",
        "#F53F3D",
        "#EF2C29",
        "#E61B18",
        "#DC0906",
        "#CB0502",
        "#BF0300"
      ]
    }
  ];

let  instance =null;//克里金对象


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
  viewer.camera.flyTo({ destination: Cesium.Cartesian3.fromDegrees(113.486138, 23.465411, 1300000.0) });
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

  //绘制热力图
  setTimeout(() => {
    drawHeatMapEntity();
  }, 3000);
  

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

  var options = {};
      // 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是Cesium.Cartographic 和 Cesium.Rectangle.
      options.defaultResetView = Cesium.Rectangle.fromDegrees(80, 22, 130, 50);
      // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
      options.enableCompass = true;
      // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件将不会添加到地图中。
      options.enableZoomControls = true;
      // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
      options.enableDistanceLegend = true;
      // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
      options.enableCompassOuterRing = true;

      CesiumNavigation.umd(viewer, options);
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


// 绘制热力图实体Entity
function drawHeatMapEntity() {
  removeScenekring();
 
    let pointarray = gdqxjpoint.features;
  let heatMapPoint = [];
  pointarray.forEach(element => {
    let objpoint = {
      lng: element.geometry.coordinates[0],
      lat: element.geometry.coordinates[1],
      name:element.properties.name,
      lte_pci: element.properties.value
    };

    heatMapPoint.push(objpoint);
  });


  kringColors[3].color.reverse();
  
 
  let minmax = _getJsonData().minmaxvalue;
  let coords = _getJsonData().coords;
  let ex = _getJsonData().ex;

   instance = new loadKring(
    viewer,
    heatMapPoint,
    kringColors,
    minmax,
    coords,
    ex
  );
  let entity = instance.init();
  
 
}

// 移除k克里金热力图
function removeScenekring(){
  if(instance){
    instance.removeSceneEntity();
    instance=null;
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
    .mapLayer{
    // position:relative;
      // width:120px;
      // height: 90px;
      // background-color: #ffffff;
      margin-left: -50px;
      margin-top: 320px;
    }
     
  }
  #cesiumContainer {
    width: 100%;
    height: 100%;
    flex: 1;
    position: relative;
  }
}
</style>