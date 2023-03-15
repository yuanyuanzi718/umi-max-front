import { request } from '@umijs/max';

export async function getList(params: any, options?: { [key: string]: any }) {
  return request<any>('/adminapi/product/list', {
    method: 'get',
    params: { ...params },
    ...(options || {}),
  });
}

export async function create(params?: any, options?: { [key: string]: any }) {
  return request<any>('/adminapi/product/create', {
    method: 'post',
    data: params,
    ...(options || {}),
  });
}

export async function del(params?: any, options?: any) {
  return request<any>(`/adminapi/product/list/${params}`, {
    method: 'delete',
    data: {},
    ...(options || {}),
  });
}

export async function update(params?: any, options?: { [key: string]: any }) {
  return request<any>(`/adminapi/product/list/${params._id}`, {
    method: 'post',
    data: params,
    ...(options || {}),
  });
}
