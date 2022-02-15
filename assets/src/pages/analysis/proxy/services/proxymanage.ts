import request from '@/utils/request';
import { stringify } from 'qs';

export async function itemList(payload: any) {
  const { current = 0, pageSize = 10, query = '' } = payload;
  let param = {
    current,
    pageSize,
    query,
  };
  // 防止参数为空的情况
  const queryData = stringify(param, {
    indices: false,
  });
  return request(`/api/admin/proxyintegrat/proxyManageList?${queryData}`);
}

export async function createItem(payload: any) {
  return request(`/api/admin/proxyintegrat/proxyManageCreateOrUpdate`, {
    method: 'POST',
    data: payload,
  });
}
