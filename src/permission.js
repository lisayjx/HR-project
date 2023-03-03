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
        // async函效所return的内容用await就可以接收到
        const { roles } = await store.dispatch('user/getUserInfo') // 获取用户资料， 加await为了因为我们想获取完资料再去放行
        // 获取到用户资料就能得到menus里面是用户的路由权限，开始筛选用户的可用路由
        // actions中函数 默认是Promise对象 调用这个对象 想要获取返回的值话 必须 加 await或者是then
        // actions是做异步操作的,routes就是筛选得到的动态路由
        const routes = await store.dispatch('permission/filterRoutes', roles.menus)
        // 把得到的动态路由放入路由表中，因为默认的路由表只有静态路由
        router.addRoutes([...routes, { path: '*', redirect: '/404', hidden: true }]) // 添加动态路由到路由表
        // 如果进行了addRoutes请用next(to.path)否则会导致刷新路由权限失效这是一个已知缺陷
        next(to.path) // to.path相当于去我要去的地址
        // 进门了，但是进门之后我要去的地方的路还没有铺好，直接走会掉坑里，
        // 多做一次跳转，再从门外往里进一次，跳转之前把路铺好，再次进来的时候路就铺好了
      } else {
        next() // 放行
      }
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
