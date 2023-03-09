/* eslint-disable */
// 该文件由 OneAPI 自动生成，请勿手动修改！
import { request } from '@umijs/max';

export async function login(
  params?: API.UserInfoVO,
  options?: { [key: string]: any },
) {
  return request<API.Result_UserInfo_>('/adminapi/user/login', {
    method: 'POST',
    data: params,
    ...(options || {}),
  });
}
