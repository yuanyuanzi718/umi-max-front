import { request } from '@umijs/max';

export async function getList(params: any, options?: { [key: string]: any }) {
  return request<any>('/adminapi/news/list', {
    method: 'get',
    params: { ...params },
    ...(options || {}),
  });
}

export async function statusOperation(
  params?: any,
  options?: { [key: string]: any },
) {
  return request<any>('/adminapi/news/publish', {
    method: 'post',
    data: params,
    ...(options || {}),
  });
}

export async function create(params?: any, options?: { [key: string]: any }) {
  return request<any>('/adminapi/news/create', {
    method: 'post',
    data: params,
    ...(options || {}),
  });
}

export async function update(params?: any, options?: { [key: string]: any }) {
  return request<any>(`/adminapi/news/list/${params._id}`, {
    method: 'post',
    data: params,
    ...(options || {}),
  });
}

export async function del(params?: any, options?: any) {
  return request<any>(`/adminapi/news/list/${params}`, {
    method: 'delete',
    data: {},
    ...(options || {}),
  });
}
