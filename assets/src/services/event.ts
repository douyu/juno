import { stringify } from 'qs';
import request from '@/utils/request';

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
  return request(`/api/admin/confgov2/config/statics`);
}
