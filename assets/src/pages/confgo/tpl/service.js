import request from '@/utils/request';
import { stringify } from 'qs';

// 获取应用列表
export async function reqList(param) {
  return request(`/api/admin/confgo/tpl/list?${stringify(param)}`);
}

// 获取应用信息
export async function reqInfo(param) {
  return request(`/api/admin/confgo/tpl/info?${stringify(param)}`);
}

export async function reqCreate(params) {
  return request('/api/admin/confgo/tpl/create', {
    method: 'POST',
    data: { ...params },
  });
}

export async function reqUpdate(params) {
  return request('/api/admin/confgo/tpl/update', {
    method: 'POST',
    data: { ...params },
  });
}

export async function reqDelete(params) {
  return request('/api/admin/confgo/tpl/delete', {
    method: 'POST',
    data: { ...params },
  });
}
