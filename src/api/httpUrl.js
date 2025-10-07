/*
 * @Author: your name
 * @Date: 2023-10-24 15:21:26
 * @LastEditors: your name
 * @LastEditTime: 2023-10-26 20:42:11
 * @Description: 
 * @FilePath: \etone_cloudrender\src\api\httpUrl.js
 */
/* 接口配置 */
let ENVI = 'pro'
if (window.location.href.indexOf('dev') !== -1) ENVI = 'dev';
if (window.location.href.indexOf('pre') !== -1) ENVI = 'pre';

// let baseUrl = 'https://nqi.gmcc.net:20443'
let baseUrl = 'http://192.168.8.191:8081'
// let baseUrl = 'http://192.168.11.120:8888'//何铮本地

let config = {
  'root': `${baseUrl}`, //8081端口






  // 'root': '/nqi-api', // 20443
  // 'rootUrl_local': '/dev-api', // 阳豪本地
  // 'rootUrl': '/nqi-api/ltemr-cicd', // dev GIS统一呈现
  // // 'rootUrl': '/dev-api', // dev GIS统一呈现
  // 'rootUrl_gis': '/nqi-api/pro-consumer-cicd',
  // 'rootUrl_bd': '/nqi-api/pro-consumer-cicd/api/ETb82a11', // 百度api
  // 'rootUrl_dugis': '/nqi-api/pro-consumer-cicd/api/ET12fe5b', // dugis
}

const httpUrl = {

  SenceModule: { // 获取帧率数据
    // 配置
    'getlogging': config.root + '/prod-api/smartpark/logging', // 配置过滤项
    // 'getlogging': config.root + '/smartpark/logging', // 场景帧率渲染

    'getrenderLog': config.root + '/prod-api/smartpark/renderLog', // 配置过滤项
  },




}

export default httpUrl
// module.exports = httpUrl
