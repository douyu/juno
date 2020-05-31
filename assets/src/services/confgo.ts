import { request } from 'umi';

export async function ServiceConfigItemCheck(body: any) {
  const { id, caid, key, value, comment, resource_id } = body;
  return request(`/api/admin/confgo/item/check`, {
    method: 'POST',
    data: { id, caid, key, value, comment, resource_id },
  });
}
