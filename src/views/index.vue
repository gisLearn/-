<!--
 * @Author: your name
 * @Date: 2023-10-25 22:13:26
 * @LastEditors: your name
 * @LastEditTime: 2023-10-29 21:10:56
 * @Description
 * @FilePath: \cesium_vue3\src\views\index.vue
-->
<template>
  <div class="home">
    <el-container>
      <el-container class="main_aside">
        <el-aside width="auto">
          <Menu />
        </el-aside>
        <el-main :style="objcss.isCollapse">
          <div class="mapHeader">
            <Header />
          </div>
          <div class="mapMain">
            <router-view></router-view>
          </div>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
// @ is an alias to /src
import Header from "@/common/Header";
import Menu from "@/common/Menu";
export default {
  name: "HomeView",
  components: {
    Header,
    Menu
  }
};
</script>

<script setup>
const cxt = getCurrentInstance();
let widthCollapse = 110;
let widthexpend = 300;
const bus = cxt.appContext.config.globalProperties.$bus;
let objcss = reactive({
  isCollapse: `margin-left: ${widthexpend}px;width: calc(100% - ${widthexpend}px)`
});
onMounted(() => {
  bus.on("Bus_menuIsCollapse", menuIsCollapse);
});

const menuIsCollapse = isstaus => {
  if (!isstaus) {
    objcss.isCollapse = `margin-left: ${widthexpend}px;width: calc(100% - ${widthexpend}px)`;
  } else {
    objcss.isCollapse = `margin-left: ${widthCollapse}px;width: calc(100% - ${widthCollapse}px)`;
  }
};
</script>

<style lang="scss">
// .home {
//   width: 100vw;
//   height: 100vh;
// }

.home {
  // position: absolute;
  width: 100vw;
  height: 100vh;
  // background-color: aqua;

  .el-aside {
    position: absolute;
    height: 100%;
    height: calc(100%);
    // background-color: #545c64;
  }

  .el-main {
    padding: 0px;
    .mapHeader {
      width: 100%;
      height: 60px;
      background: #409eff;
    }

    .mapMain {
      width: 100%;
      height: calc(100vh - 60px);
      background-color: chocolate;
    }
  }
}
</style>
