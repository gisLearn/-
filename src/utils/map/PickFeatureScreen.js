/*
 * @Author: dwzhuyugang 834737857@qq.com
 * @Date: 2023-06-04 18:04:35
 * @LastEditors: dwzhuyugang 834737857@qq.com
 * @LastEditTime: 2023-06-05 20:23:55
 * @FilePath: \cesium_vue3\src\maputils\cesiumutils\PickFeatureScreen.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: dwzhuyugang 834737857@qq.com
 * @Date: 2023-06-04 18:04:35
 * @LastEditors: dwzhuyugang 834737857@qq.com
 * @LastEditTime: 2023-06-04 18:07:20
 * @FilePath: \cesium_vue3\src\maputils\cesiumutils\PickFeatureScreen.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE 
 */
/**
    * 拾取屏幕像素位置的cesium要素，并判断是什么类型
    * @param x 像素横坐标
    * @param y 像素纵坐标
    * @returns {*}
    */
function pickFeatureFromScreen({ x, y, viewer }) {
    // 存放拾取结果
    let resp = {
        pickResult: null,
    }

    // 从像素坐标拾取对象
    let pickCartesian2 = new Cesium.Cartesian2(x, y)
    let feature = viewer.scene.pick(pickCartesian2);

    // 判断拾取结果
    if (Cesium.defined(feature)) {
        // feature.primitive.constructor.name 也可以获取类型
        resp.pickResult = feature // 拾取结果

        if (feature.hasOwnProperty('id') && feature.id instanceof Cesium.Entity) {
            // 是entity: {collection, id, primitive}
            resp.type = 'Entity'
            resp.detailType = feature.primitive.constructor.name
            resp.entity = feature.id
        } else if (feature.primitive instanceof Cesium.Cesium3DTileset) {
            // 是3DTile: {content, primitive}
            resp.type = 'Cesium3DTileset'
        } else if (feature.primitive instanceof Cesium.Billboard) {
            // 是primitive-billboard: {collection, id, primitive}
            resp.type = 'Billboard'
            resp.id = feature.id
            resp.billboardCollection = feature.collection
            resp.billboard = feature.primitive
        } else if (feature.primitive instanceof Cesium.Primitive) {
            // 是primitive: { primitive}
            resp.type = 'Primitive'
            resp.primitive = feature.primitive
        } else if (feature.primitive instanceof Cesium.Model) {
            // 是mode
            resp.type = 'Primitive'
            resp.detailType = 'Model'
            resp.primitive = feature.primitive
        } else if (feature.primitive instanceof Cesium.ModelExperimental) {
            resp.type = 'ModelExperimental'
            resp.detailType = feature.primitive.type
            resp.primitive = feature.primitive
        }
    }
    return resp
};

export { pickFeatureFromScreen };