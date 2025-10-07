/*
 * @Author: your name
 * @Date: 2023-10-25 22:13:26
 * @LastEditors: your name
 * @LastEditTime: 2023-10-30 20:53:47
 * @Description: 
 * @FilePath: \cesium_vue3\src\main.js
 */
import { createApp } from 'vue'
// css
import '@/assets/css/reset.css'
import App from './App.vue'
import router from './router'
import store from './store'
import '@/assets/font/iconfont.css'

import * as ElIcon from '@element-plus/icons-vue'
import bus from '@/utils/bus.js'



const app = createApp(App).use(store).use(router)

// 注册全局路由
app.config.globalProperties.$bus = bus


Object.keys(ElIcon).forEach((key) => {
    app.component(key, ElIcon[key])
})


app.mount('#app')

