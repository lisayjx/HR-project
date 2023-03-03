// 专门处理权限路由得模块  任务：筛选动态路由存入routes
// 引入静态路由
import { constantRoutes, asyncRoutes } from '@/router/'

const state = {
  routes: constantRoutes // 所有人默认拥有静态路由
}
const mutations = {
// 修改路由
  setRoutes(state, newRoutes) { // {newRoutes可以认为是 用户登录 通过权限所得到的动态路由的部分
    // state.routes = [... state.routes, ...constantRoutes]//这么写业务逻辑不对
    // 有一种情况  张三 登录 获取了动态路由 追加到路由上，那么下一个人李四登陆的话岂不是把张三的路由也拥有了
  // 应该是每次更新 都应该在静态路由的基础上进行追加
    state.routes = [...constantRoutes, ...newRoutes]
  }
}
const actions = {
// 筛选权限路由，第二个参数为当前用户所拥有得菜单权限，menus: ["settings","permissions"，..]
// 从动态路由中筛选出 中和menus中能够对上的路由， asyncRoutes是所有的动态路由，asyncRoutes  [{path: 'setting',name: 'setting'},{}]
  filterRoutes(context, menus) {
    const routes = []// 里面是所有模块中满足权限要求得数组，routes就是当前用户所拥有的动态路由的权眼
    menus.forEach(key => {
      routes.push(...asyncRoutes.filter(item => item.name === key))
    })
    // 将routes交给mutations，再那里面进行修改state里的数据
    context.commit('setRoutes', routes)// 给左侧菜单用的
    return routes
    // 为什么还要return? state数据 是用来 显示左侧菜单用的  return  是给路由addRoutes用的
    // 这个return后的数据 返回给调用filterRoutes的地方，这个地方就是权限拦截处
  }

}
export default {
  namespaced: true,
  state,
  actions,
  mutations
}
