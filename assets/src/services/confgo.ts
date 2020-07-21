import { stringify } from 'qs';
import request from "@/utils/request";

export async function ServiceConfigItemCheck(body: any) {
  const { id, caid, key, value, comment, resource_id, is_public } = body;
  return request(`/api/admin/confgo/item/check`, {
    method: 'POST',
    data: { id, caid, key, value, comment, resource_id, is_public },
  });
}


export async function ServiceConfigItemList(param: any) {
  return request(`/api/admin/confgo/item/list?${stringify(param)}`);
}
