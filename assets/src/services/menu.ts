import request from '@/utils/request';

export async function loadMenu() {
  return request(`/api/admin/permission/menu/list`);
}
