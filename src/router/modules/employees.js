import Layout from '@/layout'
export default {
  // 每个子模块 其实 都是外层是layout  组件位于layout的二级路由里面
  component: Layout,
  path: '/employees',
  name: 'employees',
  // 配置二级路的路由表
  children: [
    {
      path: '', // 这里当二级路由的path什么都不写的时候 表示该路由为当前路由的默认子路由，一级路由显示二级路由就会显示
      component: () => import('@/views/employees'),
      meta: { // 路由元信息  其实就是存储数据的对象 我们可以在这里放置一些信息
        title: '员工管理', // meta属性的里面的属性 随意定义 但是这里为什么要用title呢， 因为左侧导航会读取我们的路由里的meta里面的title作为显示菜单名称
        icon: 'employees'
      }
    }
  ]
}

// 当你的访问地址 是 /employees的时候 layout组件会显示 此时 你的二级路由的默认组件  也会显示
// 如果二级路由的path是空的 访问的是/employees，如果path:"t",访问的是employees/t
