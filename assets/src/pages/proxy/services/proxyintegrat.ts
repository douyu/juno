import request from '@/utils/request';
import { stringify } from 'qs';

export async function uilist() {
  return request('/api/admin/proxyintegrat/uilist');
}

export async function traceURL(params) {
  return request(`/api/admin/proxyintegrat/traceURL?${stringify(params)}`);
}
