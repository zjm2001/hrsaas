import Vue from 'vue'
import 'normalize.css/normalize.css' // A modern alternative to CSS resets
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import locale from 'element-ui/lib/locale/lang/en' // lang i18n
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
// 注册自定义指令
// 遍历所有的导出的指令对象 完成自定义全局注册
Object.keys(directives).forEach(key => {
  // 注册自定义指令
  Vue.directive(key, directives[key])
})

Vue.use(Print)
Vue.use(ElementUI, { locale })

Vue.use(Component) // 注册自己的插件
Vue.config.productionTip = false

// 注册全局的过滤器
Object.keys(filters).forEach(key => {
  // 注册过滤器
  Vue.filter(key, filters[key])
})
new Vue({
  el: '#app',
  router,
  store,
  render: h => h(App)
})
