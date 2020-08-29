export default [
  {
    path: '/',
    component: '@/layouts/index',
    routes: [
      { path: '/', redirect: '/index' },
      {
        path: '/index',
        title: '首页',
        component: './Console',
      },
      // { component: './404' },
    ],
  },
]
