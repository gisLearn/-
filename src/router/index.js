/*
 * @Author: your name
 * @Date: 2023-10-25 22:13:26
 * @LastEditors: your name
 * @LastEditTime: 2025-09-10 20:30:38
 * @Description: 
 * @FilePath: \cesium_vue3\src\router\index.js
 */
/*
 * @Author: your name
 * @Date: 2023-10-25 22:13:26
 * @LastEditors: your name
 * @LastEditTime: 2023-10-26 21:26:52
 * @Description: 
 * @FilePath: \cesium_vue3\src\router\index.js
 */
import { createRouter, createWebHashHistory } from 'vue-router'
import HomeView from '../views/index.vue'

const routes = [
  {
    path: '/',
    // name: 'home',
    redirect: '/home/drawMeasurePolygon',
    // component: HomeView,
    hidden: true,
  },
  // {
  //   path: '/:pathMatch(.*)*',//vue3中解决路由地址问题方法
  //   redirect: '/home',
  //   name: 'notFound',
  //   hidden: true,
  //   component: () => import('@/components/NoFound.vue')

  // },
  {
    path: '/home',
    name: 'home',
    redirect: '/home/drawMeasurePolygon',
    component: HomeView,
    children: [
      {
        // path: '/home/typhoon',//可以不用这样写跳转时候父级已经加入此路由
        path: 'typhoon',
        name: '台风功能',
        iconClass: 'fa fa-list',
        component: () => import('@/components/typhoon/index.vue')
      },
      {
        // path: '/home/typhoon',//可以不用这样写跳转时候父级已经加入此路由
        path: 'drawMeasurePolygon',
        name: '绘制测距测面',
        iconClass: 'fa fa-list',
        component: () => import('@/components/drawMeasurePolygon/index.vue')
      },
      {
        // path: '/home/typhoon',//可以不用这样写跳转时候父级已经加入此路由
        path: 'drawpointpolylinepolygon',
        name: '绘制圆正方形',
        iconClass: 'fa fa-list',
        component: () => import('@/components/drawpointpolylinepolygon/index.vue')
      },
      {
        // path: '/home/typhoon',//可以不用这样写跳转时候父级已经加入此路由
        path: 'addmilitaryaffairsplotting',
        name: '添加军事标绘',
        iconClass: 'fa fa-list',
        component: () => import('@/components/addmilitaryaffairsplotting/index.vue')
      }
    ]
  }

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
