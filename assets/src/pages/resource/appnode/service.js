import request from '@/utils/request';
import { stringify } from 'qs';

// 获取应用列表
export async function getAppList(param) {
  return request(`/api/admin/resource/app_node/list?${stringify(param)}`);
}
