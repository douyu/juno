import { request } from 'umi';

export interface LoginParamsType {
  userName: string;
  password: string;
  mobile: string;
  captcha: string;
  type: string;
}

export async function accountLogin(params: LoginParamsType) {

    return request<API.LoginStateType>('/api/admin/user/login', {
      method: 'POST',
      data: params,
    });

}

export async function getFakeCaptcha(mobile: string) {
  return request(`/api/login/captcha?mobile=${mobile}`);
}

export async function outLogin() {
  return request('/api/admin/public/user/logout');
}
