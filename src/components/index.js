// 该文件负责所有的公共的组件的全局注册   Vue.use
import PageTools from './PageTools'
export default {
  install(Vue) { // 使用这个是应为Vue.use()//执行的就是install可以拿到vue实例
    //  注册全局的通用栏组件对象
    Vue.component('PageTools', PageTools)
  }
}
