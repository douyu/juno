import request from './node_modules/@/utils/request';
import { stringify } from 'qs';

// 获取应用过滤信息
export async function getHomeInfo() {
  return request(`/api/home`);
}

export async function ServiceAppNodeCreate(body) {
  return request(`/api/admin/resource/app/node/put`, {
    method: 'POST',
    data: body,
  });
}

export async function ServiceAppList() {
  return request(`/api/admin/resource/app/list`);
}

export async function ServiceAppCreate(body) {
  return request(`/api/admin/resource/app/put`, {
    method: 'POST',
    data: body,
  });
}
