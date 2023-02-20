import Layout from '@/layout'
export default {

  component: Layout,
  path: '/social',
  name: 'social',

  children: [
    {
      path: '',
      component: () => import('@/views/social'),
      meta: {
        title: '社保',
        icon: 'social'
      }
    }
  ]
}

