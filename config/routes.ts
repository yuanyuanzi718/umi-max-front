export default [
  {
    path: '/login',
    component: '@/pages/Login',
    exact: true,
    layout: false,
  },
  {
    path: '/',
    redirect: '/home',
  },
  {
    name: '首页',
    path: '/home',
    component: '@/pages/Home',
    exact: true,
    wrappers: ['@/wrappers/auth'],
  },
  {
    name: '个人中心',
    path: '/center',
    component: '@/pages/Center',
    exact: true,
    wrappers: ['@/wrappers/auth'],
  },
  {
    name: '用户管理',
    exact: true,
    path: '/user',
    component: '@/pages/User',
    wrappers: ['@/wrappers/auth'],
  },
  {
    name: '新闻管理',
    exact: true,
    path: '/news',
    component: '@/pages/News',
    wrappers: ['@/wrappers/auth'],
  },
  {
    name: '产品管理',
    exact: true,
    path: '/product',
    component: '@/pages/Product',
    wrappers: ['@/wrappers/auth'],
  },
  { path: '*', component: '@/pages/404.tsx' },
];
