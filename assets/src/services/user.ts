import { request } from 'umi';

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
