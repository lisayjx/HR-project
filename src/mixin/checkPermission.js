// 放一次混入 终身使用的东西
// 做混入对象，检查访问权限
import store from '@/store'
export default {
  // 检查权限 要么有要么没有  key就是要检查的权限点  上面aa那种二级的
  methods: {
    // 去用户信息的points里找有没有key一样的，如果有，则认为有权限，如果没有则认为不能点击
    checkPermission(key) {
      const { userInfo } = store.state.user
      if (userInfo.roles && userInfo.roles.points) {
        return userInfo.roles.points.some(item => item === key)
      }
      return false
    }
  }
}
// true说明有权限，false说明没权限
