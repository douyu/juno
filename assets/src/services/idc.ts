import request from '@/utils/request';

export async function ServiceGetIdcList() {
  return request('/api/admin/resource/zone/list');
}
