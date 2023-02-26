// 负责所有全局自定义组件的注册
// 引入组件
import PageTools from './PageTools'
import UploadExcel from './UploadExcel'
import ImageUpload from './ImageUpload'
// 导出一个对象
export default {
  install(Vue) { // vue全局对象
    // 组件的注册
    Vue.component('PageTools', PageTools)
    Vue.component('UploadExcel', UploadExcel)
    Vue.component('ImageUpload', ImageUpload)
  }

}
