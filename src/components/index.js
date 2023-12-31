// 该文件负责所有的公共的组件的全局注册   Vue.use
import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'
import ScreenFull from './ScreenFull'
import ThemePicker from './ThemePicker'
import Lang from './lang'
import TagsView from './TagsView'

export default {
  install(Vue) { // 使用这个是应为Vue.use()//执行的就是install可以拿到vue实例
    //  注册全局的通用栏组件对象
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel) // 注册导入excel组件
    Vue.component('ImageUpload', ImageUpload) // 注册导入excel组件
    Vue.component('ScreenFull', ScreenFull) // 全屏插件
    Vue.component('ThemePicker', ThemePicker) // 颜色主题
    Vue.component('Lang', Lang)// 多语言切换
    Vue.component('TagsView', TagsView) // tab
  }
}

