// 运行时配置
import type { RequestConfig } from '@umijs/max';
export const request: RequestConfig = {
  timeout: 5000,
  errorConfig: {
    errorHandler() { },
    errorThrower() { },
  },
  requestInterceptors: [
    [
      (url, options) => {
        const token = localStorage.getItem('token');
        options.headers.Authorization = `Bearer ${token}`;
        return { url, options };
      },
      (error: any) => {
        return Promise.reject(error);
      },
    ],
  ],
  responseInterceptors: [
    [
      (response) => {
        const { authorization } = response.headers;
        if (authorization) {
          localStorage.setItem('token', authorization);
        }
        return response;
      },
      (error: any) => {
        const { status } = error.response;
        if (status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
        return Promise.reject(error);
      },
    ],
  ],
};

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<any> {
  return {
    name: 'adam',
  };
}

export const layout = () => {
  return {
    title: '工作台',
    logo: 'https://img.alicdn.com/tfs/TB1YYanxET1gK0jSZFhXXaAtVXa-275-282.png',
    menu: {
      locale: false,
    },
    layout: "mix",
    // rightContentRender: false,  //头像位置
    // unAccessible: <div>'unAccessible'</div>,
    // // 自定义 404 页面
    // noFound: <div>'noFound'</div>,
  };
};
