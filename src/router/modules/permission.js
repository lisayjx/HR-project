import Layout from '@/layout'
export default {

  component: Layout,
  path: '/permission',
  name: 'permissions',

  children: [
    {
      path: '',
      component: () => import('@/views/permission'),
      name: 'permissions',
      meta: {
        title: '权限管理',
        icon: 'permission'
      }
    }
  ]
}

