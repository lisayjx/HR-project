import request from '@/utils/request'

// 请求登录
export function login(data) {
  return request({
    method: 'POST',
    url: '/sys/login',
    data
  })
}
// 获取用户信息
export function getUserInfo() {
  return request({
    method: 'POST',
    url: '/sys/profile'
  })
}
// 获取员工基本信息
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

export function logout() {

}
