<template>
  <!-- 右侧底部 -->
  <div class="right-tools-btns">
    <!-- 底图切换 -->
    <div class="change-layers">
      <div
        class="layer-container-box"
        @mouseenter="mouseenter"
        @mouseleave="mouseleave"
      >
        <div class="container" :class="{ 'container-hover': drawerHover }">
          <div
            :class="{
              'active-image-wrapper': activeBaseMap === baseMapList[0],
            }"
            class="image-wrapper image-wrapper1"
            @click="changeBaseMap(baseMapList[0])"
          >
            <span class="layer-label">{{ baseMapList[0] }}&nbsp;</span>
          </div>
          <div
            :class="{
              'active-image-wrapper': activeBaseMap === baseMapList[1],
            }"
            class="image-wrapper image-wrapper2"
            @click="changeBaseMap(baseMapList[1])"
          >
            <span class="layer-label">{{ baseMapList[1] }}&nbsp;</span>
          </div>
          <div
            :class="{
              'active-image-wrapper': activeBaseMap === baseMapList[2],
            }"
            class="image-wrapper image-wrapper3"
            @click="changeBaseMap(baseMapList[2])"
          >
            <span class="layer-label">{{ baseMapList[2] }}&nbsp;</span>
          </div>
          <!-- <div
            :class="{
              'active-image-wrapper': activeBaseMap === baseMapList[3],
            }"
            class="image-wrapper image-wrapper4"
            @click="changeBaseMap(baseMapList[3])"
          >
            <span class="layer-label">{{ baseMapList[3] }}&nbsp;</span>
          </div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, getCurrentInstance } from 'vue'

const { proxy } = getCurrentInstance()

const cxt = getCurrentInstance();
const bus = cxt.appContext.config.globalProperties.$bus;

const panoramaControlFlag = ref(false)
const drawerHover = ref(false)
const baseMapList = ref(["夜景地图", "电子地图", "影像地图"])
const activeBaseMap = ref("")

const borderStyle = computed(() => {
  return {
    width: "8px",
    height: "8px",
    border: "1px solid rgba(0,187,255, 0.45)",
  }
})

const mouseleave = () => {
  setTimeout(() => {
    drawerHover.value = false
  }, 300)
}

const mouseenter = () => {
  drawerHover.value = true
}

// 切换底图
const changeBaseMap = (type) => {
  bus.emit("pagechangeImageFunctionByName", type)
  activeBaseMap.value = type
  bus.emit("Bus_changeOption", type)
}

// 添加全景图
const addPanoramaImage = () => {
  panoramaControlFlag.value = !panoramaControlFlag.value
  bus.emit("pageisAddPhotoSherePointList", panoramaControlFlag.value)
}
</script>

<style lang="scss" scoped>
.right-tools-btns {
  position: fixed;
  z-index: 25;
  display: flex;
  align-items: flex-end;
  justify-content: flex-end;
  box-sizing: border-box;
  flex-direction: column;
  transition: all 0.6s linear;

  .btn-box {
    position: relative;
    width: 46px;
    height: 46px;
    background: rgba(24, 159, 208, 0.14);
    margin-bottom: 8px;
    font-family: MicrosoftYaHei, MicrosoftYaHei;
    font-weight: normal;
    font-size: 14px;
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    box-sizing: border-box;
    cursor: pointer;
    transition: 0.6s;

    &:hover {
      background: rgba(24, 159, 208, 0.51);
    }

    .btn-box.active {
      background: rgba(24, 159, 208, 0.3);
    }
  }

  .panorama-control {
    text-align: center;
    font-size: 14px;
    color: #ffffff;
    margin-bottom: 35px;

    .btn-box {
      background: url("~@/assets/layer/panorama_icon.png") no-repeat center;
      background-size: 100% 100%;

      &:hover,
      &.active-panorama-btn-box {
        background: rgba(24, 159, 208, 0.51)
          url("~@/assets/layer/panorama_icon.png") no-repeat center;
        background-size: 100% 100%;
      }
    }
  }

  .nav-bar .btn-box {
    background: none;
  }

  .zoom-control .btn-box {
    background: none;
  }

  .change-layers {
    height: 72px;
    width: 100%;
    .layer-container-box {
      position: absolute;
      right: 0px;
      overflow: hidden;
      z-index: 100;

      .container {
        position: relative;
        //   float: right;
        width: 108px;
        /* 根据需要调整宽度 */
        height: 72px;
        /* 根据需要调整高度 */
        overflow: hidden;
        /* 隐藏超出容器的内容 */
        transition: all linear 0.3s 0s;
        cursor: pointer;
        .image-wrapper,
        .image-wrapper2,
        .image-wrapper3,
        .image-wrapper4 {
          position: absolute;
          top: 0;
          right: 0;
          width: 92px;
          height: 72px;
          transition: all linear 0.3s 0.1s;
          &.active-image-wrapper {
            z-index: 11;
          }

          img {
            width: 100%;
            height: 100%;
            transition: all 0.3s ease;
          }
          &:hover {
            transform: scale(1.05);
            .layer-label {
              color: rgb(0, 168, 255);
            }
          }
        }

        .image-wrapper {
          .layer-label {
            background: rgba(0, 0, 0, 0.702);
            height: 20px;
            font-size: 12px;
            color: #ffffff;
            position: absolute;
            bottom: 0;
            left: 0;
            display: inline-block;
            height: 20px;
            text-align: right;
            width: 90px;
            margin-left: 1px;
            margin-bottom: 1px;
          }
        }

        .image-wrapper1 {
          z-index: 10;
          background: url("~@/assets/layer/night_map.png") no-repeat center;
          background-size: 100% 100%;
        }

        .image-wrapper2 {
          z-index: 9;
          // right: 4px;
          border-left: 4px solid rgba(0, 0, 0, 0.6);
          background: url("~@/assets/layer/incline_map.png") no-repeat center;
          background-size: 100% 100%;
        }

        .image-wrapper3 {
          z-index: 8;
          // right: 8px;
          border-left: 4px solid rgba(0, 0, 0, 0.4);
          background: url("~@/assets/layer/image_map.png") no-repeat center;
          background-size: 100% 100%;
        }

        .image-wrapper4 {
          z-index: 7;
          // right: 8px;
          border-left: 4px solid rgba(0, 0, 0, 0.4);
          background: url("~@/assets/layer/night_map.png") no-repeat center;
          background-size: 100% 100%;
        }
      }

      .container:hover,
      .container-hover {
        width: 494px;

        img {
          border: 1px solid #504650;
        }

        .image-wrapper {
          border-left: none;
        }

        .image-wrapper2 {
          right: 100px;
          border-left: none;
        }

        .image-wrapper3 {
          z-index: 8;
          right: 200px;
          border-left: none;
        }
        .image-wrapper4 {
          z-index: 8;
          right: 300px;
          border-left: none;
        }
      }
    }
  }
}
</style>