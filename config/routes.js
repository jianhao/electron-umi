export default [
  {
    path: '/',
    component: '@/layouts/index',
    routes: [
      { path: '/', redirect: '/customerManage' },
      {
        path: '/customerManage',
        title: '客户管理',
        component: './CustomerManage',
      },
      // { component: './404' },
    ],
  },
]
