import { request } from '@umijs/max';

export async function getList(params: any, options?: { [key: string]: any }) {
  return request<any>('/adminapi/user/list', {
    method: 'get',
    params: { ...params },
    ...(options || {}),
  });
}

export async function create(params?: any, options?: { [key: string]: any }) {
  return request<any>('/adminapi/user/create', {
    method: 'post',
    data: params,
    ...(options || {}),
  });
}

export async function detail(params?: any, options?: { [key: string]: any }) {
  return request<any>(`/adminapi/user/detail/${params}`, {
    method: 'get',
    params: {},
    ...(options || {}),
  });
}

export async function update(params?: any, options?: { [key: string]: any }) {
  return request<any>(`/adminapi/user/list/${params._id}`, {
    method: 'put',
    data: params,
    ...(options || {}),
  });
}

export async function del(params?: any, options?: any) {
  return request<any>(`/adminapi/user/list/${params}`, {
    method: 'delete',
    data: {},
    ...(options || {}),
  });
}
