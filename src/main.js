import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n elementUi语言包

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'
// 引入所有需要全局注册的组件
import components from './components'
// 引入全局注册的过滤器
import * as filters from '@/filters'
// 引入全局的混入
import checkPermission from '@/mixin/checkPermission'
Vue.mixin(checkPermission) // 表示所有的组件都拥有了检查的方法
// 导入语言包
import i18n from '@/lang'

import '@/icons' // icon
import '@/permission' // permission control

// 自定义指令
import * as directives from '@/directives'
// {imagerror: {}, abc1: {}, ...}
// 注册自定义指令
// 遍历所有的导出的指令对象 完成自定义全局注册
// ['iamgerror', 'abc1', ...]
Object.keys(directives).forEach(key => {
  Vue.directive(key, directives[key])
  // Vue.derective('iamgerror', {})
  // Vue.derective('abc1', {})
  // Vue.derective('abc2', {})
})

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI, {
  // ElementUI本身支持i18n的处理
  // 此时i18n就会根据当前的local属性去寻找对应的显示内容
  i18n: (key, value) => i18n.t(key, value)// t方法回去对应的语言包里寻找对应的内容
})

// 这里面的组件全局都可以用
Vue.use(components)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  i18n, // 语言包
  render: h => h(App)
})
