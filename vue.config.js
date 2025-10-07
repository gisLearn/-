/*
 * @Author: your name
 * @Date: 2024-03-10 21:53:08
 * @LastEditors: your name
 * @LastEditTime: 2025-09-10 20:32:16
 * @Description: 
 * @FilePath: \cesium_vue3\vue.config.js
 */
const { defineConfig } = require('@vue/cli-service')

const AutoImport = require('unplugin-auto-import/webpack')
const Components = require('unplugin-vue-components/webpack')
const { ElementPlusResolver } = require('unplugin-vue-components/resolvers')

module.exports = defineConfig({
  transpileDependencies: true,
  configureWebpack: {
    devServer: {
      client: { overlay: false },
      /* 使用代理 */
      proxy: {
        '/api': {
          target: 'http://localhost:8091',  // 目标代理服务器地址
          changeOrigin: true,                          // 允许跨域
          pathRewrite: {
            "^/api": ''
          }
        },
      },

    },
    plugins: [
      AutoImport({
        // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
        imports: ['vue', 'vue-router', 'vuex'],
        resolvers: [ElementPlusResolver()],
        // resolvers: [
        //   // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
        //   ElementPlusResolver(),
        // ],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      })
    ]
  }
})
