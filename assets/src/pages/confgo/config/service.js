import { stringify } from 'qs';
import request from '@/utils/request';

export async function publishCmc(body) {
  return request(`/api/admin/confgo/config/publish`, {
    method: 'POST',
    data: body,
  });
}

// 发布状态
export async function publishStatus(body) {
  return request(`/api/admin/confgo/config/status/list`, {
    method: 'POST',
    data: body,
  });
}

export async function delConfigFile(body) {
  return request(`/api/admin/confgo/config/delete`, {
    method: 'POST',
    data: body,
  });
}

export async function getPublishList(body) {
  return request(`/api/admin/confgo/version/list`, {
    method: 'POST',
    data: body,
  });
}

export async function getPublishChangeList(body) {
  return request(`/api/admin/confgo/version/change`, {
    method: 'POST',
    data: body,
  });
}

export async function getOriginPublishChange(body) {
  return request(`/api/admin/confgo/version/diff`, {
    method: 'POST',
    data: body,
  });
}

//获取配置中心应用列表
export async function ConfuAppConfigList(body) {
  return request(`/api/admin/confgo/app_config/info`, {
    method: 'POST',
    data: body,
  });
}

//应用添加配置文件 confu/addfile
export async function ConfuAddfile(body) {
  const { aid, appName, env, zone_code, file_name, create, file_typ } = body;
  return request(`/api/admin/confgo/config/create`, {
    method: 'POST',
    data: { aid: aid, app_name: appName, env, zone_code, file_name, format: file_typ, create },
  });
}

//获取配置 confu
export async function ConfuItems(body) {
  const { caid } = body;
  return request(`/api/admin/confgo/config/info`, {
    method: 'POST',
    data: { caid },
  });
}

//添加配置 /confu/add
export async function ConfuAddItem(body) {
  const { caid, key, value, comment, resource_id, is_public } = body;
  return request(`/api/admin/confgo/item/create`, {
    method: 'POST',
    data: { caid, key, value, comment, resource_id,is_public },
  });
}

// 获取资源列表
export async function getAdminResource(params) {
  return request(`/api/admin/confgo/global/list/user`, {
    method: 'POST',
    body: JSON.stringify(params),
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
    },
  });
}

//更新配置 /confu/update
export async function ConfuUpdateItem(body) {
  const { id, caid, key, value, comment, resource_id,is_public } = body;
  return request(`/api/admin/confgo/item/update`, {
    method: 'POST',
    data: { id, caid, key, value, comment, resource_id,is_public },
  });
}

//删除配置 /confu/del
export async function ConfuDelItem(body) {
  const { id } = body;
  return request(`/api/admin/confgo/item/delete`, {
    method: 'POST',
    data: { id },
  });
}

//文本diff配置 /confu/updateNew
export async function ConfuUpdateNewItem(body) {
  const { caid, config_text } = body;
  return request(`/api/admin/confgo/config/update`, {
    method: 'POST',
    data: { caid, config_text },
  });
}

// 操作日志列表
export async function ConfuChangeList(body) {
  const { caid, page, limit } = body;
  return request(`/api/admin/confgo/config/record`, {
    method: 'POST',
    data: { caid, page, limit },
  });
}

// 回滚到上个版本
export async function RollbackVersion(body) {
  const { caid } = body;
  return request(`/api/admin/confgo/config/rollback`, {
    method: 'POST',
    data: { caid },
  });
}

// 同步实例状态
export async function SyncConfigNodes(body) {
  return request(`/api/admin/confgo/config/status/sync`, {
    method: 'POST',
    data: body,
  });
}

// 同步文件状态
export async function ReloadEtcdWatch(body) {
  return request(`/api/admin/confgo/status/reload`, {
    method: 'POST',
    data: body,
  });
}

//格式化toml文本
export async function TomlContentFormat(content) {
  return request(`/api/admin/confgo/config/fmt/toml`, {
    method: 'POST',
    data: {
      content,
    },
  });
}

export function SupervisorAction({ app_name, zone_code, host_name, action }) {
  return new Promise((s, f) => {
    post(`/api/admin/confgo/app/restart`, {
      app_name,
      zone_code: zone_code,
      host_name,
      action,
    })
      .then((rs) => {
        const { code, data } = rs;
        return s(data);
      })
      .catch((err) => {
        return f(err);
      });
  });
}

const post = function (url, data) {
  return request(url, {
    method: 'POST',
    data,
  });
};

export async function fileKeyDiff(params) {
  return request(`/api/admin/confgo/config/diff`, {
    method: 'POST',
    data: params,
  });
}
