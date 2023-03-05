// 多语言实例化文件
import Vue from 'vue'
import VueI18n from 'vue-i18n' // 引入国际化的包
// 把内容写入到cookie
import Cookie from 'js-cookie' // 引入cookie包，不用下载，js带的
import elementEN from 'element-ui/lib/locale/lang/en' // 引入element-ui的英文包
import elementZH from 'element-ui/lib/locale/lang/zh-CN' // 引入element-ui的中文包
import elementJA from 'element-ui/lib/locale/lang/ja' // 引入element-ui的日文包
import customZH from './zh' // 引入自定义中文包
import customEN from './en' // 引入自定义英文包

Vue.use(VueI18n)
// 导出一个实例对象
export default new VueI18n({
// i18n选项
// 先去缓存里读，有没有存储这个类型，如果没有就用zh，||后面放的就是默认值
  locale: Cookie.get('language') || 'en', // 当前的多语言的类型，随意定义的字符串，中文zh/英文en/日本ja
  messages: { // 当前的语言包
    // 有多少类型就有多少语言包，对象里放的就是语言包
    // 语言包：elementUi的语言包+自定义语言包
    zh: {
      ...elementZH, ...customZH
    },
    en: {
      ...elementEN, ...customEN
    },
    ja: {
      ...elementJA
    }
  }
})
