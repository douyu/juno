import request from '@/utils/request';
import { stringify } from 'qs';

export async function query() {
  return request<API.CurrentUser[]>('/api/users');
}

export async function queryCurrent() {
  return request<API.CurrentUser>('/api/admin/public/user/info');
}

export async function queryNotices(): Promise<any> {
  return request('/api/notices');
}

export async function sha512(str: string) {
  return crypto.subtle.digest('SHA-512', new TextEncoder().encode(str)).then((buf) => {
    return Array.prototype.map
      .call(new Uint8Array(buf), (x) => ('00' + x.toString(16)).slice(-2))
      .join('');
  });
}

export async function PostAppViewHistory(params: any) {
  params['aid'] = parseInt(params['aid']);
  return request('/api/admin/public/user/appViewHistory', {
    method: 'POST',
    data: params,
  });
}

export async function GetAppViewHistory() {
  return request(`/api/admin/public/user/appViewHistory`);
}

export async function PostAppConfig(params: any) {
  params['aid'] = parseInt(params['aid']);
  return request('/api/admin/public/user/appConfig', {
    method: 'POST',
    data: params,
  });
}

export async function GetAppConfig(aid: number) {
  return request(`/api/admin/public/user/appConfig?aid=` + aid);
}

export async function PostAppVisit(params: any) {
  params['aid'] = parseInt(params['aid']);
  return request('/api/admin/public/user/tabVisit', {
    method: 'POST',
    data: params,
  });
}

export async function GetAppVisit(param: any) {
  return request(`/api/admin/public/user/tabVisit?${stringify(param)}`);
}
