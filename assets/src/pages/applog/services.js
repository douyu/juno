import request from '@/utils/request';
import { stringify } from 'qs';

export async function getLogUrl(params) {
  return request(`/api/admin/logger/logstore?${stringify(params)}`);
}
