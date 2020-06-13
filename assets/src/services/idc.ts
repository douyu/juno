import { request } from 'umi';

export async function ServiceGetIdcList() {
  return request('/api/admin/resource/zone/list');
}
