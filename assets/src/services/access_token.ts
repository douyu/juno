import request from '@/utils/request';
import { stringify } from 'qs';

export async function fetchAccessTokenList(page = 0, pageSize = 10) {
  return request(
    `/api/admin/openAuth/accessToken/list?${stringify({ page, page_size: pageSize })}`,
  );
}

export async function createAccessToken(payload: { name: string }) {
  return request(`/api/admin/openAuth/accessToken/create`, {
    method: 'POST',
    data: {
      name: payload.name,
    },
  });
}

export async function deleteAccessToken(appId: string) {
  return request(`/api/admin/openAuth/accessToken/delete`, {
    method: 'POST',
    data: {
      app_id: appId,
    },
  });
}
