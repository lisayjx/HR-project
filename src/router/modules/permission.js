import Layout from '@/layout'
export default {

  component: Layout,
  path: '/permission',
  name: 'employees',

  children: [
    {
      path: '',
      component: () => import('@/views/employees'),
      meta: {
        title: '权限管理',
        icon: 'permission'
      }
    }
  ]
}

