//获取配置 confu
import request from '@/utils/request';
import { stringify } from 'qs';

export async function loadConfigs(aid, env) {
  return request(`/api/admin/confgov2/config/list?${stringify({ aid, env })}`);
}

export async function srvLoadConfigInstances(aid, env, zoneCode, configurationID) {
  return request(
    `/api/admin/confgov2/config/instance/list?${stringify({
      aid,
      env,
      zone_code: zoneCode,
      configuration_id: configurationID,
    })}`,
  );
}

export async function srvConfigPublish(id, version) {
  console.log('id', id);
  console.log('version', version);
  return request(`/api/admin/confgov2/config/publish`, {
    method: 'post',
    data: { id: id, version: version },
  });
}

export async function createConfig(payload) {
  payload.aid = parseInt(payload.aid);
  return request(`/api/admin/confgov2/config/create`, {
    method: 'post',
    data: payload,
  });
}

export async function loadConfigDetail(id) {
  return request(`/api/admin/confgov2/config/detail?id=${id}`);
}

export async function saveConfig(id, message, content) {
  return request(`/api/admin/confgov2/config/update`, {
    method: 'POST',
    data: {
      id,
      message,
      content,
    },
  });
}

export async function loadHistoryList(id, page = 0, size = 10) {
  const query = stringify({ id, page, size });
  return request(`/api/admin/confgov2/config/history?${query}`, {
    method: 'GET',
  });
}

export async function loadConfigDiff(id) {
  return request(`/api/admin/confgov2/config/diff?id=${id}`);
}

export async function deleteConfig(id) {
  return request(`/api/admin/confgov2/config/delete?id=${id}`, {
    method: 'POST',
  });
}
