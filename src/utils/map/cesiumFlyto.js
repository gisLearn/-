/*
 * @Author: dwzhuyugang 834737857@qq.com
 * @Date: 2023-05-22 21:17:14
 * @LastEditors: dwzhuyugang 834737857@qq.com
 * @LastEditTime: 2023-05-22 21:46:00
 * @FilePath: \cesium_vue3\src\maputils\cesiumutils\cesiumFlyto.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
export default class FlyToObject {
    constructor(option) {
        this.viewer = option.viewer;//绘制实体
    }

    setView({ lng, lat, hight = 0, heading = 0, pitch = 0, roll = 0 }) {
        this.viewer.camera.setView({
            destination: Cesium.Cartesian3.fromDegrees(lng, lat, hight),
            orientation: {
                heading: Cesium.Math.toRadians(heading), // east, default value is 0.0 (north)
                pitch: Cesium.Math.toRadians(pitch),    // default value (looking down)
                roll: roll                             // default value
            }
        });
    }

    flyto({ lng, lat, hight = 0, heading = 0, pitch = 0, roll = 0, callback }) {
        this.viewer.camera.flyTo({
            destination: Cesium.Cartesian3.fromDegrees(lng, lat, hight),
            orientation: {
                heading: Cesium.Math.toRadians(heading), // east, default value is 0.0 (north)
                pitch: Cesium.Math.toRadians(pitch),    // default value (looking down)
                roll: roll                             // default value
            },
            complete: callback && callback(),
            duration: 4

        });
    }

}