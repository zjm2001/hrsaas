// 导出属于组织架构的路由规则
import Layout from '@/layout'
export default {
  path: '/departments',
  name: 'departments',
  component: Layout,

  children: [{
    name: 'departments',
    path: '',
    component: () => import('@/views/departments'),

    meta: {
      title: '组织架构',
      icon: 'tree'
    }
  }]
}
