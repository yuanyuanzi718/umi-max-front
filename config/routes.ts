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
    name: '权限演示',
    exact: true,
    path: '/access',
    component: '@/pages/Access',
    wrappers: ['@/wrappers/auth'],
  },
  {
    name: 'CRUD 示例',
    exact: true,
    path: '/table',
    component: '@/pages/Table',
    wrappers: ['@/wrappers/auth'],
  },
  { path: '*', component: '@/pages/404.tsx' },
];
