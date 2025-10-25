/*
 * @Author: your name
 * @Date: 2023-11-13 21:01:01
 * @LastEditors: lyq
 * @LastEditTime: 2024-01-26 17:51:23
 * @Description: 
 * @FilePath: \cesium_vue3\src\components\typhoon\utils\index.js
 */
/*
 * @Author: your name
 * @Date: 2023-11-13 21:01:01
 * @LastEditors: your name
 * @LastEditTime: 2023-11-13 21:15:13
 * @Description: 
 * @FilePath: \cesium_vue3\src\components\labelHtmlByListen\utils\index.js
 */
/**
 * @descripion:
 * @param {Viewer} viewer
 * @param {Cartesian2} position
 * @param {String} title
 * @param {String} id
 * @return {*}
 */

import { createApp } from 'vue'
import Label from "../common/TyphoonPopup.vue";


// let node = document.getElementById('my-node')
// if (!node) {
//     node = document.createElement('div', { id: 'my-node' })
// }
// let WindowVm = Vue.extend(Label);
export default class Bubble {

    constructor(val) {
        this.viewer = val.viewer;
        //  this.height = val.height;
        this.position = val.postionValue;
        let typhooninfo = val.info
        this.node = document.createElement('div', { id: typhooninfo.name })
        this.app = createApp(Label, {
            typhooninfo
        })


        this.app.config.globalProperties.closeEvent = e => {
            this.windowClose();
        }

        // this.vmInstance.mount(node)
        this.vmInstance = this.app.mount(this.node)

        // 获取事件总线
        //    vue2绑定对应方法
        // this.vmInstance.closeEvent = e => {
        //     this.windowClose();
        // }

        val.viewer.cesiumWidget.container.appendChild(this.vmInstance.$el); //将字符串模板生成的内容添加到DOM上

        this.addPostRender();

    }

    //添加场景事件
    addPostRender() {
        this.viewer.scene.postRender.addEventListener(this.postRender, this);
    }

    //场景渲染事件 实时更新窗口的位置 使其与笛卡尔坐标一致
    postRender() {
        if (!this.vmInstance.$el || !this.vmInstance.$el.style) return;
        const canvasHeight = this.viewer.scene.canvas.height;
        const windowPosition = new Cesium.Cartesian2();
        Cesium.SceneTransforms.wgs84ToWindowCoordinates(
            this.viewer.scene,
            this.position,
            windowPosition
        );
        this.vmInstance.$el.style.bottom =
            canvasHeight - windowPosition.y + 260 + "px";
        const elWidth = this.vmInstance.$el.offsetWidth;
        this.vmInstance.$el.style.left = windowPosition.x - elWidth / 2 + 110 + "px";

        const camerPosition = this.viewer.camera.position;
        let heightcamera = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(camerPosition).height;

        let height = this.viewer.scene.globe.ellipsoid.cartesianToCartographic(camerPosition).height;
        height += this.viewer.scene.globe.ellipsoid.maximumRadius;
        if ((!(Cesium.Cartesian3.distance(camerPosition, this.position) > height)) && this.viewer.camera.positionCartographic.height < 50000000) {
            this.vmInstance.$el.style.display = "block";
        } else {
            this.vmInstance.$el.style.display = "none";
        }

        if(heightcamera>1300000){
            this.vmInstance.$el.style.display = "none";

        }else{
            this.vmInstance.$el.style.display = "block";

        }
    }
    //关闭 
    windowClose() {
        if (this.vmInstance) {

            this.vmInstance.$el.remove();
            this.app.unmount();
            // this.app.$destroy();
        }
        //this.vmInstance.$el.style.display = "none"; //删除dom
        this.viewer.scene.postRender.removeEventListener(this.postRender, this); //移除事件监听
    }
}
