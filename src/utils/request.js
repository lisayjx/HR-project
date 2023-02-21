import axios from 'axios'
import { Message } from 'element-ui' // 单独引入 Message
import store from '@/store'
import { getTimeStamp } from '@/utils/auth'
import router from '@/router'

const service = axios.create({
// 当执行 npm run dev=>.evn.development=> '/api'=> 跨域代理
// 当执行 npm run build=>.evn.production=> 运维去整跨域
// VUE_APP_BASE_API值在生产环境是api，在开发环境是/prod-api
  baseURL: process.env.VUE_APP_BASE_API, //  '/api'
  timeout: 7000 // 设置超时时间
})

const timeStampOut = 3600// token过期时间戳 一个小时
function checkTimeStamp() {
  // 当前时间-存入本地的时间戳>time 就过期
  // 除1000因为时间戳都是毫秒，要变成秒
  return (Date.now() - getTimeStamp()) / 1000 > timeStampOut
}

// 请求拦截器
service.interceptors.request.use((config) => {
  if (store.getters.token) {
    // 检查token是否过期
    if (checkTimeStamp()) {
      // 过期了
      store.dispatch('user/logout')
      router.push('/login')
      return Promise.reject(new Error('token超时了'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截器
service.interceptors.response.use(response => {
  const { success, data, message } = response.data
  if (success) {
    return data
  } else {
    // 业务已经错误了 不能then了，应该进catch
    Message.error(message)
    // 为了让他进入catch写的promise，  此时message就是错误讯息但不是错误对象，所以写的new
    return Promise.reject(new Error(message))
    // 这里是人为的发现错误 需要new实例化一下这个错误
  }
}, error => {
  // 后端返回token超时的状态码
  if (error.response && error.response.data && error.response.data.code === 10002) {
    store.dispatch('user/logout')
    router.push('/login')
  } else {
    Message.error(error.message)// 提示错误信息
  }

  return Promise.reject(error) // 返回执行错误 让当前执行链跳出成功 直接进入catch
})

export default service
