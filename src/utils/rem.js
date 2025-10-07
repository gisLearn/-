import _ from 'lodash' //Lodash 是一个一致性、模块化、高性能的 JavaScript 实用工具库。
// rem等比适配配置文件
// 基准大小
const baseSize = 16;
// 设置 rem 函数
export const setRem = () => {
  // 当前页面屏幕分辨率相对于 1280宽的缩放比例，可根据自己需要修改
  // console.log(document.documentElement.clientWidth);
  const scale = document.documentElement.clientWidth / 1440;
  // 设置页面根节点字体大小（“Math.min(scale, 3)” 指最高放大比例为3，可根据实际业务需求调整）
  (document.getElementsByTagName('html')[0].style)['font-size'] = `${baseSize * Math.min(scale, 1.5)}px`;
}

// 创建一个 debounced（防抖动）函数
let setDomFontSizeDebounce = _.debounce(setRem, 400)
window.addEventListener('resize',setDomFontSizeDebounce)