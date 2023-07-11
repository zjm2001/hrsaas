import router from '@/router/index'
import store from '@/store' // 引入vuex store实例
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式
const whiteList = ['/login', '/404'] // 白名单不受权限控制
// 路由前置卫士
router.beforeEach((to, from, next) => {
  NProgress.start() // 开启进度条
  // 最先判断是否有token
  if (store.getters.token) {
    // 如果有token判断是否是去登录页
    if (to.path === '/login') {
      // 是去登录页
      next('/') // 直接跳回主页
    } else {
      // 有token且不是去登录页直接放行
      next()
    }
  } else {
    // 如果没有token
    if (whiteList.indexOf(to.path) > -1) {
      // 如果是名单直接放行
      next()
    } else {
      // 没有token且不是白名单则直接跳转登录页
      next('/login')
    }
  }
  NProgress.done() // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
})
// 后置卫士
router.afterEach((to, from, next) => {
  NProgress.done() // 关闭进度条
})
