// 导出属于工资的路由规则
import Layout from '@/layout'
export default {
  path: '/salarys',
  name: 'salarys',
  component: Layout,

  children: [{
    path: '',
    component: () => import('@/views/salarys'),

    meta: {
      title: '工资',
      icon: 'money'
    }
  }]
}
