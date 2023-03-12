/* eslint-disable */
// 该文件由 OneAPI 自动生成，请勿手动修改！
import { request } from '@umijs/max';

export async function upload(params?: any, options?: { [key: string]: any }) {
  return request<API.Result_UserInfo_>('/adminapi/user/upload', {
    method: 'POST',
    data: params,
    ...(options || {}),
  });
}
