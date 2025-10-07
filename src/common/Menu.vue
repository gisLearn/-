<!--
 * @Author: dwzhuyugang 834737857@qq.com
 * @Date: 2023-05-06 22:59:26
 * @LastEditors: your name
 * @LastEditTime: 2023-10-29 16:38:34
 * @FilePath: \cesium_vue3\src\common\Menu.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div>
    <el-menu
      router
      active-text-color="#409eff"
      background-color="#304156"
      class="el-menu-vertical-demo"
      :default-openeds="['1']"
      :collapse="isCollapse"
      :default-active="routerUrl.currentPahtinde"
      text-color="#fff"
      @open="handleOpen"
      @close="handleClose"
    >
      <el-menu-item>
        <div class="menu-style">地理信息展示系统</div>
      </el-menu-item>

      <el-sub-menu index="1">
        <template #title>
          <el-icon :size="20">
            <location />
          </el-icon>
          <span>cesium功能</span>
        </template>
        <el-menu-item-group v-for="(item,index) in objrouterUrl.cesium" :key="index">
          <el-menu-item @click="changeUlr(item.path)" :index="item.path">
            <i :class="item.iconClass"></i>
            {{item.name}}
          </el-menu-item>
        </el-menu-item-group>
      </el-sub-menu>
    </el-menu>
  </div>
</template>

<script setup>
let router = useRouter();
const cxt = getCurrentInstance();
const bus = cxt.appContext.config.globalProperties.$bus;

const routerUrl = reactive({
  cesium: [
    // {
    //   title: "台风功能",
    //   iconClass: "fa fa-users",
    //   path: "/home/typhoon",
    //   key: "c-1"
    // },
    // {
    //   title: "测量距离",
    //   iconClass: "fa fa-users",
    //   path: "/home/measure",
    //   key: "c-2"
    // },
    // {
    //   title: "色斑图效果",
    //   iconClass: "fa fa-users",
    //   path: "/home/seacolor",
    //   key: "c-3"
    // },
    // {
    //   title: "三维绘制工具",
    //   iconClass: "fa fa-users",
    //   path: "/home/drawtool",
    //   key: "c-4"
    // },
    // {
    //   title: "孪生城市",
    //   iconClass: "fa fa-users",
    //   path: "/home/luanshengcity",
    //   key: "c-5"
    // }
  ],
  openlayer: [],
  threejs: [],
  defaultpath: "/home/typhoon",
  currentPahtinde: router.currentRoute.value.fullPath.split("/")[2]
});

const isCollapse = ref(false);

onMounted(() => {
  routerUrl.cesium = router.options.routes[1].children;

  console.log(routerUrl);

  bus.on("Bus_menuIsCollapse", menuIsCollapse);
});

const objrouterUrl = reactive(routerUrl);
const handleOpen = (key, keypath) => {
  console.log(key);
  console.log(keypath);
};

const handleClose = (key, keypath) => {
  console.log(key);
  console.log(keypath);
};

const changeUlr = path => {
  console.log(path);
  // objrouterUrl.defaultpath = path;
  console.log(router);
};

// 更改界面状态
const menuIsCollapse = isstaus => {
  isCollapse.value = isstaus;
};

//
</script>

<style lang="scss" scoped>
.el-menu {
  border-right: solid 0px;
}
//
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 300px;
  height: calc(100vh);
}

.menu-style {
  font-size: 25px;
  text-align: center;
  color: chartreuse;
}

.el-menu--collapse {
  width: 100px;
  height: 100vh;
}
</style>