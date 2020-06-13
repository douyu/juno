import { request } from 'umi';
import { stringify } from 'qs';

export async function ServiceEventList(param: any) {
  return request(`/api/admin/event/list?${stringify(param)}`);
}

export async function ServiceStatistics() {
  return request(`/api/admin/analysis/index`);
}

export async function ServiceNodeStatistics() {
  return request(`/api/admin/resource/node/statics`);
}

export async function ServiceCmcStatistics() {
  return request(`/api/admin/confgo/config/statics`);
}
