// api/admin/plugin/pluginList

import request from '@/utils/request';
import { stringify } from 'qs';

export async function pluginList() {
  return request(`/api/admin/plugin/pluginList`);
}
