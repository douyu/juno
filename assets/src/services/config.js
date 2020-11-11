//获取配置 confu
import request from '@/utils/request';
import {stringify} from 'qs';

export async function loadConfigs(appName, env) {
  return request(`/api/admin/confgov2/config/list?${stringify({app_name: appName, env})}`);
}

export async function srvLoadConfigInstances(env, zoneCode, configurationID) {
  return request(
    `/api/admin/confgov2/config/instance/list?${stringify({
      env,
      zone_code: zoneCode,
      id: configurationID,
    })}`,
  );
}

export async function srvConfigPublish(id, version, host_name, pub_k8s) {
  return request(`/api/admin/confgov2/config/publish`, {
    method: 'post',
    data: {id, version, host_name, pub_k8s},
  });
}

export async function createConfig(payload) {
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
  const query = stringify({id, page, size});
  return request(`/api/admin/confgov2/config/history?${query}`, {
    method: 'GET',
  });
}

export async function loadConfigDiff(configID, historyID) {
  return request(`/api/admin/confgov2/config/diff?id=${configID}&history_id=${historyID}`);
}

export async function loadConfigVersionDiff(serviceVersion,publishVersion) {
  return request(`/api/admin/confgov2/config/diffVersion?serviceVersion=${serviceVersion}&publishVersion=${publishVersion}`);
}

export async function deleteConfig(id) {
  return request(`/api/admin/confgov2/config/delete?id=${id}`, {
    method: 'POST',
  });
}

export async function fetchInstanceConfig(id, hostName) {
  return request(`/api/admin/confgov2/config/instance/configContent?${stringify({
    id,
    host_name: hostName
  })}`)
}

export async function fetchLock(id) {
  return request(`/api/admin/confgov2/config/lock?id=${id}`, {
    method: 'POST'
  })
}

export async function unLock(id) {
  return request(`/api/admin/confgov2/config/unlock?id=${id}`, {
    method: 'POST'
  })
}
