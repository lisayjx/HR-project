// 权限拦截
import router from '@/router'
import store from '@/store'
import NProgress from 'nprogress' // 引入一份进度条插件
import 'nprogress/nprogress.css' // 引入进度条样式
/*
next() 放行
next(false)跳转终止
next(地址)跳转到某个地址
*/
const whiteList = ['/login', '/404']
// 路由前置守卫
router.beforeEach(async(to, from, next) => {
  NProgress.start() // 开启进度条

  // 1.如果有token
  if (store.getters.token) {
    if (to.path === '/login') { // 如果要去登录页
      next('/') // 跳转到主页
    } else { // 如果去别的页
      if (!store.getters.userId) { // 如果没有userId ，就去通知actions获取用户信息
        await store.dispatch('user/getUserInfo') // 加await为了因为我们想获取完资料再去放行
      }
      next() // 放行
    }
  } else { // 2.如果没有token
    if (whiteList.indexOf(to.path) > -1) { // 如果要去的地址在白名单
      next()
    } else {
      next('/login')
    }
  }
})

// 路由后置守卫
router.afterEach(() => {
  NProgress.done() // 手动强制关闭一次  为了解决 手动切换地址时  进度条的不关闭的问题
})
