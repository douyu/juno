import request from '@/utils/request';
import { stringify } from 'qs';
export async function uilist() {
  return request('/api/admin/aliyunlog/logStoreMenu');
}

// export async function getCompleteLogSearchUrl(data) {
//   return request(`/api/url/completeLogSearchUrl?${stringify(data)}`);
// }

export async function getCompleteLogSearchUrl(data) {
  return request(`/api/admin/aliyunlog/completeLogSearchUrl?${stringify(data)}`);
}