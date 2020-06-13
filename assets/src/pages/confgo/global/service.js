import request from "@/utils/request";
import { stringify } from "qs";

// 获取资源列表
export async function getAdminResource(params) {
  return request(`/api/configserver/resource/list/admin`, {
    method: 'POST',
    body: JSON.stringify(params),
    headers:{
      'Content-Type': 'application/json; charset=utf-8',
    }
  })
}

// 获取资源列表
export async function getResource(params) {
  return request(`/api/configserver/resource/get`, {
    method: 'POST',
    body: JSON.stringify(params),
    headers:{
      'Content-Type': 'application/json; charset=utf-8',
    }
  })
}

// 添加资源
export async function addResource(params) {
  return request(`/api/configserver/resource/add`, {
    method: 'POST',
    body: JSON.stringify(params),
    headers:{
      'Content-Type': 'application/json; charset=utf-8',
    }
  })
}

// 更新资源
export async function updateResource(params) {
  return request(`/api/configserver/resource/update`, {
    method: 'POST',
    body: JSON.stringify(params),
    headers:{
      'Content-Type': 'application/json; charset=utf-8',
    }
  })
}

export async function appFilterListApi(params) {
  return request(`/api/app/filter/list?${stringify(params)}`);
}


// 获取关联资源
export async function getRelatedResource(params) {
  return request(`/api/configserver/resource/list/related`, {
    method: 'POST',
    body: JSON.stringify(params),
    headers:{
      'Content-Type': 'application/json; charset=utf-8',
    }
  })
}

//检查资源配置是否更新
export async function checkResourceConfig(params) {
  return request(`/api/configserver/resource/check`, {
    method: 'POST',
    body: JSON.stringify(params),
    headers:{
      'Content-Type': 'application/json; charset=utf-8',
    }
  })
}


//检查资源配置是否更新
export async function checkResourceAppdep(params) {
  return request(`/api/configserver/resource/list/dep`, {
    method: 'POST',
    body: JSON.stringify(params),
    headers:{
      'Content-Type': 'application/json; charset=utf-8',
    }
  })
}

// /resource/replace/auto
export async function resourceAutoReplace(params) {
  return request(`/api/configserver/resource/replace/auto`, {
    method: 'POST',
    body: JSON.stringify(params),
    headers:{
      'Content-Type': 'application/json; charset=utf-8',
    }
  })
}

export async function resourceMatch(params) {
  return request(`/api/configserver/resource/match`, {
    method: 'POST',
    body: JSON.stringify(params),
    headers:{
      'Content-Type': 'application/json; charset=utf-8',
    }
  })
}

//查看授权应用
export async function getResourceAuthApp(params) {
  return request(`/api/configserver/resource/assign/list`, {
    method: 'POST',
    body: JSON.stringify(params),
    headers:{
      'Content-Type': 'application/json; charset=utf-8',
    }
  })
}

export async function delResourceAssign(params) {
  return request(`/api/configserver/resource/assign/del`, {
    method: 'POST',
    body: JSON.stringify(params),
    headers:{
      'Content-Type': 'application/json; charset=utf-8',
    }
  })
}

export async function addResourceAssign(params) {
  return request(`/api/configserver/resource/assign/add`, {
    method: 'POST',
    body: JSON.stringify(params),
    headers:{
      'Content-Type': 'application/json; charset=utf-8',
    }
  })
}
