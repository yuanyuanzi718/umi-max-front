import { defineConfig } from '@umijs/max';
import routes from './routes';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {},
  routes,
  npmClient: 'npm',
  proxy: {
    '/adminapi': {
      target: 'http://localhost:3000',
      changeOrigin: true,
      // 'pathRewrite': { '^/adminapi': '' },
    },
  },
});
