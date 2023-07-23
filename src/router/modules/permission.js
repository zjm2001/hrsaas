// 导出属于权限管理的路由规则
import Layout from '@/layout'
export default {
  path: '/permission',
  name: 'permissions',
  component: Layout,

  children: [{
    name: 'permissions',
    path: '',
    component: () => import('@/views/permission'),

    meta: {
      title: '权限管理',
      icon: 'lock'
    }
  }]
}
