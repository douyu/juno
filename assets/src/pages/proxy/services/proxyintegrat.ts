import request from '@/utils/request';

export async function uilist() {
  return request('/api/admin/proxyintegrat/uilist');
}
