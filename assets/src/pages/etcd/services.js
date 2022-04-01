import request from '@/utils/request';
import { stringify } from 'qs';

export async function etcdList(params) {
  return request(`/api/admin/etcd/list?${stringify(params)}`);
}
