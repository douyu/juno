import request from '@/utils/request';
import { stringify } from 'qs';

export async function checkDep() {
  return request(`/api/admin/pprof/dep/check`);
}

export async function installDep(params) {
  return request(`/api/admin/pprof/dep/install?${stringify(params)}`);
}

export async function getSysConfig(params) {
  return request(`/api/admin/pprof/config/list?${stringify(params)}`);
}

export async function setSysConfig(params) {
  return request(`/api/admin/pprof/config/update`, {
    method: 'POST',
    data: params,
  });
}

export async function delSysConfig(params) {
  return request(`/api/admin/pprof/config/delete?${stringify(params)}`);
}
