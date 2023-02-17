// 引入 读取 设置 删除 本地存储得文件
import { getToken, setToken, removeToken, setTimeStamp } from '@/utils/auth'
// 引入请求接口
import { login, getUserInfo, getUserDetailById } from '@/api/user'

const state = {
// 初始化state，从缓存中读取token
  token: getToken(),
  // 用户信息
  userInfo: {} // 定义一个空的对象 不是null 因为后边我要开发userInfo的属性给别人用  userInfo.name
}
// 他来修改state里的数据
const mutations = {
// 设置token
  setToken(state, token) { // token是传过来的参数
    state.token = token
    // 同步缓存（同步到本地存储）
    setToken(token)
  },
  // 删除token
  removeToken(state) {
    state.token = null
    // 同步到缓存
    removeToken()
  },
  // 设置用户信息
  setUserInfo(state, baseUserInfo) {
    state.userInfo = { ...baseUserInfo }// 用 浅拷贝的方式去赋值对象 因为这样数据更新之后，才会触发组件的更新
  },
  // 删除用户信息
  removeUserInfo(state) {
    state.userInfo = {}
  }

}

const actions = {
  // 请求登录
  async login(context, data) { // 也需要参数 调用action时 传递过来的参数
    const re = await login(data)
    context.commit('setToken', re) // re是后端返回的用户token
    setTimeStamp() // 往本地存一个token时间戳
  },
  // 获取用户信息
  async getUserInfo(context) {
    const re = await getUserInfo()
    const re2 = await getUserDetailById(re.userId)
    const baseUserInfo = { ...re, ...re2 }
    context.commit('setUserInfo', baseUserInfo) // re是获取到用户信息，re2是为了获取用户头像
    return baseUserInfo // 这里为什么要返回 为后面权限埋下伏笔
  },
  // 退出登录
  logout(context) {
    context.commit('removeToken')
    context.commit('removeUserInfo')
  }

}

export default {
  namespaced: true, // 正确写法 别忘了加d 或者别忘了这个属性
  state,
  mutations,
  actions
}
