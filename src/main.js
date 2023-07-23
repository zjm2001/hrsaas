import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import '@/styles/index.scss' // global css
import App from './App'
import store from './store'
import router from './router'
import '@/icons' // icon
import '@/permission' // permission control
import * as directives from '@/directives'
import Component from '@/components'
import * as filters from '@/filters' // 引入工具类
import Print from 'vue-print-nb'
import checkPermission from '@/mixin/checkPermission'
import i18n from '@/lang'
// 注册自定义指令
// 遍历所有的导出的指令对象 完成自定义全局注册
Object.keys(directives).forEach(key => {
  // 注册自定义指令
  Vue.directive(key, directives[key])
})

Vue.use(Print)

Vue.use(Component) // 注册自己的插件
Vue.config.productionTip = false

// 注册全局的过滤器
Object.keys(filters).forEach(key => {
  // 注册过滤器
  Vue.filter(key, filters[key])
})
// 全局混入检查对象(所有组件都要一个检查方法)
Vue.mixin(checkPermission)
// 设置element为当前的语言
Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value)
})
new Vue({
  el: '#app',
  router,
  store,
  i18n,
  render: h => h(App)
})
