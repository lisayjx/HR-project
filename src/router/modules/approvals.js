import Layout from '@/layout'
export default {
  component: Layout,
  path: '/approvals',
  name: 'approvals',
  children: [
    {
      path: '',
      component: () => import('@/views/approvals'),
      meta: {
        title: '审批',
        icon: 'approvals'
      }
    }
  ]
}

