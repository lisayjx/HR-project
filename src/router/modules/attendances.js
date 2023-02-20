import Layout from '@/layout'
export default {

  component: Layout,
  path: '/attendances',
  name: 'attendances',

  children: [
    {
      path: '',
      component: () => import('@/views/attendances'),
      meta: {
        title: '考勤',
        icon: 'attendances'
      }
    }
  ]
}

