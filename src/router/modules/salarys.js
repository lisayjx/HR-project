import Layout from '@/layout'
export default {

  component: Layout,
  path: '/salarys',
  name: 'salarys',

  children: [
    {
      path: '',
      component: () => import('@/views/salarys'),
      meta: {
        title: '工资',
        icon: 'salarys'
      }
    }
  ]
}

