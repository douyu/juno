import request from '@/utils/request';
import {stringify} from 'qs';

export async function checkDep() {
  return request(`/api/admin/pprof/dep/check`);
}

export async function installDep(params) {
  return request(`/api/admin/pprof/dep/install?${stringify(params)}`);
}

export async function getSysConfig(params) {
  return request(`/api/admin/pprof/config/list?${stringify(params)}`);
}

export async function loadSettings() {
  return request(`/api/v1/system/setting/list`)
}

export async function updateSetting(name, content) {
  return request(`/api/v1/system/setting/update`, {
    method: 'POST',
    data: {
      name,
      content
    }
  })
}
