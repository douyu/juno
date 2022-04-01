import { stringify } from 'qs';
import request from '@/utils/request';

export async function ServiceNodeUpdate(params: Resource.Node) {
  return request('/api/admin/resource/node/update', {
    method: 'POST',
    data: params,
  });
}

export async function ServiceTransferList(param: any) {
  return request(`/api/admin/resource/node/transfer/list?${stringify(param)}`);
}

export async function ServiceTransferPut(params: Resource.Transfer) {
  console.log('params', params);
  return request('/api/admin/resource/node/transfer/put', {
    method: 'POST',
    data: params,
  });
}
