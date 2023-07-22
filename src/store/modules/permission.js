import { constantRoutes, asyncRoutes } from '@/router'
const state = {
  routes: constantRoutes // 所有人默认拥有静态路由
}
const mutations = {
  // 定义修改routes
  setRoutes(state, newRoutes) {
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
  filterRoutes(context, menus) {
    const routes = []
    menus.forEach(key => {
      // 判断动态路由 对象name属性等于key的值
      routes.push(...asyncRoutes.filter(item => item.name === key)) // 得到一个数组 有可能 有元素 也有可能是空数组
    })
    context.commit('setRoutes', routes) // 将动态路由提交给mutations
    return routes // 这里为什么还要return  state数据 是用来 显示左侧菜单用的  return  是给路由addRoutes用的
  }

}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
