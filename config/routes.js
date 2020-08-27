export default [
  {
    path: '/',
    component: '@/layouts/index',
    routes: [
      { path: '/', redirect: '/home' },
      {
        path: '/home',
        title: '首页',
        component: './Home',
      },
      // { component: './404' },
    ],
  },
]
