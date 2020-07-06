import { request } from 'umi';
import { stringify } from 'qs';

export async function ServiceAppInfo(aid: number, appName: string) {
  return request(`/api/admin/resource/app/info?aid=` + aid + `&app_name=` + appName);
}

export async function ServiceAppEnvZone(appName: string) {
  return request(`/api/admin/resource/app_env_zone/list?app_name=` + appName);
}

export async function ServiceAppList() {
  return request(`/api/admin/resource/app/list?pageSize=10000`);
}

export async function ServiceAppNodeTransferList(param: any) {
  return request(`/api/admin/resource/app_node/transfer/list?${stringify(param)}`);
}

export async function ServiceAppNodeTransferPut(params: any) {
  params['aid'] = parseInt(params['aid']);
  return request('/api/admin/resource/app_node/transfer/put', {
    method: 'POST',
    data: params,
  });
}

export async function ServiceGetAppList(param: any) {
  return request(`/api/admin/resource/app_node/list?${stringify(param)}`);
}
