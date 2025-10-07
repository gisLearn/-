/*
 * @Author: una
 * @Date: 2022-02-16 16:41:13
 * @LastEditors: your name
 * @LastEditTime: 2023-11-06 20:40:02
 * @Description: 坐标转换：弧度与度、笛卡尔弧度经纬度、百度火星、84墨卡托
 * https://blog.csdn.net/weixin_45782925/article/details/123365834
 */

/** 
* 3D地图坐标转换工具
* @constructor
* @extends {Cesium}
* @example
let coordinatesTool = new E3DMap.Base.Coordinates()
* 
*/
class Coordinates {
  constructor() {
    this.params = {
      x_PI: 3.14159265358979324 * 3000.0 / 180.0,
      PI: 3.1415926535897932384626,
      a: 6378245.0,
      ee: 0.00669342162296594323
    }
  }

  // 校验经纬度（弧度）
  checkLonDegree(value) {
    if (value > 180 || value < -180) {
      return false;
    }
    return true;
  }
  checkLatDegree(value) {
    if (value > 90 || value < -90) {
      return false;
    }
    return true;
  }

  // 校验经纬度（弧度）
  checkLonRadian(value) {
    if (value > Math.PI || value < -Math.PI) {
      return false;
    }
    return true;
  }
  checkLatRadian(value) {
    if (value > Math.PI / 2.0 || value < -Math.PI / 2.0) {
      return false;
    }
    return true;
  }


  /**
* 3D地图弧度 转 度
* @param {Number} radian 例如"0-2Π"
* @return {Number} 角度
*/
  RadianToDegrees(radian) {
    return radian ? Cesium.Math.toDegrees(radian) : null
  }

  /**
   *3D地图度 转 弧度
   * @param {Number} deg 例如"-180-180/-90-90"
   * @return {Number} 弧度'0-2Π'
   */
  DegreesToRadian(deg) {
    return deg ? Cesium.Math.toRadians(deg) : null
  }



  /**
 *3D地图笛卡尔3 转 弧度
 * @param {Object} cartesian 笛卡尔坐标系例如"{x:0,y:0,z:0}"
 * @return {Number} 弧度'0-2Π'
 */
  Cartesian3ToCartographic(cartesian) {
    return cartesian ? Cesium.Cartesian3.fromCartesian(cartesian) : null
  }





  /**
 *3D地图弧度 转 笛卡尔3
 * @param {Number} cartographic 例如"0-2Π"
 * @return {Object} 例如"{x:0,y:0,z:0}"
 */
  CartographicToCartesian3(cartographic) {
    return cartographic ? Cesium.Cartesian3.fromRadians(cartographic.longitude, cartographic.latitude, cartographic.height || 0) : null

  }


  /**
*3D地图84经纬度 转 弧度
* @param {Object | Array} position 例如"经纬度数据[经度,纬度,高度]/{longitude,latitude,height}"
* @return {Number} cartographic 例如"0-2Π"
*/
  WGS84ToCartographic(position) {
    if (position) {
      let longitude, latitude, height
      if (Array.isArray(position)) {
        longitude = position[0]
        latitude = position[1]
        height = position[2] || 0
      } else {
        longitude = position.longitude
        latitude = position.latitude
        height = position.height || 0
      }
      return Cesium.Cartographic.fromDegrees(longitude, latitude, height)
    } else {
      return Cesium.Cartographic.ZERO
    }
  }



  /**
*3D地图 弧度 转 84经纬度
 *@param {Number} cartographic 地图弧度例如"0-2Π" 
* @return {Object} position 弧度转为84经纬度坐标{longitude,latitude,height}" 
*/
  CartographicToWGS84(cartographic) {
    if (cartographic) {
      return {
        longitude: this.RadianToDegrees(cartographic.longitude),
        latitude: this.RadianToDegrees(cartographic.latitude),
        height: cartographic.height || 0
      }
    }
  }

  /**
*3D地图 笛卡尔3 转 84经纬度
*@param {Object} cartesian 笛卡尔坐标系例如"{x:0,y:0,z:0}" 
* @return {Object} position 弧度转为84经纬度坐标{longitude,latitude,height}" 
*/
  Cartesian3ToWGS84(cartesian) {
    if (cartesian) {
      const ellipsoid = Cesium.Ellipsoid.WGS84
      let cartographic = ellipsoid.cartesianToCartographic(cartesian)
      // let cartographic = this.Cartesian3ToCartographic(cartesian) // 笛卡尔 转 弧度
      return this.CartographicToWGS84(cartographic)
    }
  }


  /**
*3D地图 84经纬度 转 笛卡尔3
*@param {Array|Object} lonlat 例如"经纬度数据[经度,纬度,高度]/{longitude,latitude,height}" 
* @return {Object} cartesian 笛卡尔坐标系例如"{x:0,y:0,z:0}"  
*/
  WGS84ToCartesian3(lonlat) {

    if (lonlat) {
      let longitude, latitude, height
      if (Array.isArray(lonlat)) {
        longitude = lonlat[0]
        latitude = lonlat[1]
        height = lonlat[2] || 0
      } else {
        longitude = lonlat.longitude
        latitude = lonlat.latitude
        height = lonlat.height || 0
      }
      return Cesium.Cartesian3.fromDegrees(
        longitude,
        latitude,
        height,
        Cesium.Ellipsoid.WGS84
      )
    } else {
      return Cesium.Cartographic.ZERO
    }

    // return lonlat
    //     ? Cesium.Cartesian3.fromDegrees(
    //       lonlat.longitude,
    //       lonlat.latitude,
    //       lonlat.height = lonlat.height || 0,
    //       Cesium.Ellipsoid.WGS84
    //     )
    //     : Cesium.Cartesian3.ZERO

  }


  LonLatToCartesian3(lonlat) {
    return lonlat
      ? Cesium.Cartesian3.fromDegrees(
        lonlat.longitude,
        lonlat.latitude,
        0,
        Cesium.Ellipsoid.WGS84
      )
      : Cesium.Cartesian3.ZERO

  }


  LonLatHeightToCartesian3(lonlat) {
    return lonlat
      ? Cesium.Cartesian3.fromDegrees(
        lonlat.longitude,
        lonlat.latitude,
        lonlat.height,
        Cesium.Ellipsoid.WGS84
      )
      : Cesium.Cartesian3.ZERO

  }



  /**
*3D地图 84经纬度转笛卡尔2（屏幕坐标）
*@param {Array|Object} lonlat 例如"经纬度数据[经度,纬度,高度]/{longitude,latitude,height}" 
@param {Object} scene 地图场景转换参数viewer.scene
* @return {Object} cartesian 屏幕坐标系例如"{x:0,y:0}"  
*/
  WGS84ToCartesian2(lonlat, scene) {
    if (scene) {
      let cartesian = this.WGS84ToCartesian3(lonlat)
      let cartesian2 = Cesium.SceneTransforms.wgs84ToWindowCoordinates(scene, cartesian);
      return cartesian2
    }
  }



  /**
*3D地图墨卡托转84经纬度
*@param {Object} mercator 例如墨卡托坐标系"{longitude,latitude}" 
* @return {Object} lonlat 84坐标的投影坐标系"{longitude,latitude}"  
*/
  WebMercatorToWGS84(mercator) {
    let x = mercator.longitude / 20037508.34 * 180;
    let y = mercator.latitude / 20037508.34 * 180;
    y = 180 / Math.PI * (2 * Math.atan(Math.exp(y * Math.PI / 180)) - Math.PI / 2);
    let lonlat = { longitude: x, latitude: y }
    return lonlat
  }

  /**
   * @description: 84经纬度 转 墨卡托
   * @param {Object} lonlat
   * @return {Object} mercator 
   */

  /**
*3D地图84经纬度转墨卡托
*@param {Object} lonlat 84坐标的投影坐标系"{longitude,latitude}" 
* @return {Object} mercator 例如墨卡托坐标系"{longitude,latitude}"  
*/
  WGS84ToWebMercator(lonlat) {
    let x = lonlat.longitude * 20037508.34 / 180;
    let y = Math.log(Math.tan((90 + lonlat.latitude) * Math.PI / 360)) / (Math.PI / 180)
    y = y * 20037508.34 / 180;
    let mercator = { longitude: x, latitude: y } // { "latitude":2609364, "longitude":12330196} 3857
    return mercator
  }


  BD09ToGCJ02({ lng, lat }) {
    lng = +lng;
    lat = +lat;
    const x = lng - 0.0065;
    const y = lat - 0.006;
    const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * this.params.x_PI);
    const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * this.params.x_PI);
    const gg_lng = z * Math.cos(theta);
    const gg_lat = z * Math.sin(theta);
    return [gg_lng, gg_lat]
  }


  GCJ02ToBD09({ lng, lat }) {
    lat = +lat;
    lng = +lng;
    const z = Math.sqrt(lng * lng + lat * lat) + 0.00002 * Math.sin(lat * this.params.x_PI);
    const theta = Math.atan2(lat, lng) + 0.000003 * Math.cos(lng * this.params.x_PI);
    const bd_lng = z * Math.cos(theta) + 0.0065;
    const bd_lat = z * Math.sin(theta) + 0.006;
    return [bd_lng, bd_lat]
  }


  WGS84ToGCJ02({ lng, lat }) {
    lat = +lat;
    lng = +lng;
    if (this.outOfChina(lng, lat)) {
      return [lng, lat]
    } else {
      let dlat = this.transformLat(lng - 105.0, lat - 35.0);
      let dlng = this.transformLng(lng - 105.0, lat - 35.0);
      const radlat = lat / 180.0 * this.params.PI;
      let magic = Math.sin(radlat);
      magic = 1 - this.params.ee * magic * magic;
      let sqrtmagic = Math.sqrt(magic);
      dlat = (dlat * 180.0) / ((this.params.a * (1 - this.params.ee)) / (magic * sqrtmagic) * this.params.PI);
      dlng = (dlng * 180.0) / (this.params.a / sqrtmagic * Math.cos(radlat) * this.params.PI);
      let mglat = lat + dlat;
      let mglng = lng + dlng;
      return [mglng, mglat]
    }
  }


  GCJ02ToWGS84({ lng, lat }) {
    lat = +lat;
    lng = +lng;
    if (this.outOfChina(lng, lat)) {
      return [lng, lat]
    } else {
      let dlat = this.transformLat(lng - 105.0, lat - 35.0);
      let dlng = this.transformLng(lng - 105.0, lat - 35.0);
      const radlat = lat / 180.0 * this.params.PI;
      let magic = Math.sin(radlat);
      magic = 1 - this.params.ee * magic * magic;
      let sqrtmagic = Math.sqrt(magic);
      dlat = (dlat * 180.0) / ((this.params.a * (1 - this.params.ee)) / (magic * sqrtmagic) * this.params.PI);
      dlng = (dlng * 180.0) / (this.params.a / sqrtmagic * Math.cos(radlat) * this.params.PI);
      let mglat = lat + dlat;
      let mglng = lng + dlng;
      return [lng * 2 - mglng, lat * 2 - mglat]
    }
  }


  BD09ToWGS84({ lng, lat }) {
    let gcj02 = this.BD09ToGCJ02({ lng, lat })
    return this.GCJ02ToWGS84({ lng: gcj02[0], lat: gcj02[1] })
  }


  WGS84ToBD09({ lng, lat }) {
    let gcj02 = this.WGS84ToGCJ02({ lng, lat })
    return this.GCJ02ToBD09({ lng: gcj02[0], lat: gcj02[1] })
  }

  transformLat(lng, lat) {
    lat = +lat;
    lng = +lng;
    let ret = -100.0 + 2.0 * lng + 3.0 * lat + 0.2 * lat * lat + 0.1 * lng * lat + 0.2 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * this.params.PI) + 20.0 * Math.sin(2.0 * lng * this.params.PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lat * this.params.PI) + 40.0 * Math.sin(lat / 3.0 * this.params.PI)) * 2.0 / 3.0;
    ret += (160.0 * Math.sin(lat / 12.0 * this.params.PI) + 320 * Math.sin(lat * this.params.PI / 30.0)) * 2.0 / 3.0;
    return ret
  }

  transformLng(lng, lat) {
    lat = +lat;
    lng = +lng;
    let ret = 300.0 + lng + 2.0 * lat + 0.1 * lng * lng + 0.1 * lng * lat + 0.1 * Math.sqrt(Math.abs(lng));
    ret += (20.0 * Math.sin(6.0 * lng * this.params.PI) + 20.0 * Math.sin(2.0 * lng * this.params.PI)) * 2.0 / 3.0;
    ret += (20.0 * Math.sin(lng * this.params.PI) + 40.0 * Math.sin(lng / 3.0 * this.params.PI)) * 2.0 / 3.0;
    ret += (150.0 * Math.sin(lng / 12.0 * this.params.PI) + 300.0 * Math.sin(lng / 30.0 * this.params.PI)) * 2.0 / 3.0;
    return ret
  }


  outOfChina(lng, lat) {
    lat = +lat;
    lng = +lng;
    // 纬度 3.86~53.55, 经度 73.66~135.05 
    return !(lng > 73.66 && lng < 135.05 && lat > 3.86 && lat < 53.55);
  }


  coordinatesChange(obj, from, to, scene) {
    const functionName = `${from}To${to}`
    return this[functionName] ? this[functionName](obj, scene) : obj
  }


  batchChange(arr, from, to, scene) {
    return arr.reduce((result, item) => {
      result.push(this.coordinatesChange(item, from, to, scene))
      return result
    }, [])
  }

}

export { Coordinates }

