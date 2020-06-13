import request from 'umi-request';
import { BasicListItemDataType } from './data.d';

interface ParamsType extends Partial<BasicListItemDataType> {
  count?: number;
}

export async function ServiceUserList(params: ParamsType) {
  params['pageSize'] = 5;
  return request('/api/admin/user/list', {
    params,
  });
}

export async function ServiceUserDelete(params: ParamsType) {
  const { ...restParams } = params;
  return request('/api/admin/user/delete', {
    method: 'POST',
    data: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function ServiceUserCreate(params: ParamsType) {
  const { ...restParams } = params;
  console.log('restParams', restParams);
  return request('/api/admin/user/create', {
    method: 'POST',
    data: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function ServiceUserUpdate(params: ParamsType) {
  const { ...restParams } = params;
  return request('/api/admin/user/update', {
    method: 'POST',
    data: {
      ...restParams,
      method: 'update',
    },
  });
}
