/*
 * @Author: dwzhuyugang 834737857@qq.com
 * @Date: 2023-06-04 18:10:54
 * @LastEditors: dwzhuyugang 834737857@qq.com
 * @LastEditTime: 2023-06-05 20:42:26
 * @FilePath: \cesium_vue3\src\maputils\cesiumutils\CesiumEvent.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 引入屏幕点击事件类型
import { pickFeatureFromScreen } from "@/maputils/cesiumutils/PickFeatureScreen";


// cesium时间点击功能封装
class HanderEvent {
    constructor(option) {
        this.viewer = option.viewer;
        this.MapHandler = new Cesium.ScreenSpaceEventHandler(this.viewer.scene.canvas);
        this.leftclick = Cesium.ScreenSpaceEventType.LEFT_CLICK;


    }

    clickEvent(callback) {

        this.MapHandler.setInputAction(movement => {

            // // 选择新要素
            const pickedFeature = this.viewer.scene.pick(movement.position);

            callback && callback(pickedFeature);
        }, this.leftclick);
    }
}

export { HanderEvent }