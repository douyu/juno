import request from "@/utils/request";
import {stringify} from "qs";

export async function configResourceList(payload: any) {
  const {page = 0, pageSize = 10, query = '', env = [], zone = [], tag} = payload
  let param = {
    page,
    pageSize,
    query,
    tag
  }

  // 防止参数为空的情况
  if (env) param["env"] = env
  if (zone) param["zone"] = zone

  const queryData = stringify(param, {
    indices: false
  })

  return request(`/api/admin/confgov2/resource/list?${queryData}`)
}

export async function createResource(payload: any) {
  return request(`/api/admin/confgov2/resource/create`, {
    method: 'POST',
    data: payload
  })
}

export async function createResourceVersion(payload: any) {
  return request(`/api/admin/confgov2/resource/createVersion`, {
    method: 'POST',
    data: payload
  })
}

export async function loadResourceTags() {
  return request(`/api/admin/confgov2/resource/tags`)
}

export async function loadResourceDetail(id = 0) {
  return request(`/api/admin/confgov2/resource/detail?${stringify({id})}`)
}

export async function loadResourceByNameVersion(env: string, zone: string, name: string) {
  return request(`/api/admin/confgov2/resource/getByName?${stringify({
    env,
    zone,
    name,
  })}`)
}

export async function batchCheckVersion(payload: any[]) {
  return request(`/api/admin/confgov2/resource/batchCheckVersion`, {
    method: 'POST',
    data: payload
  })
}

export async function getCluterInfo(appName,env,payload) {
  return request(`/api/admin/confgov2/config/list?cluster=cluster&appName=`+appName+"&env="+env, {
    method: 'GET',
    data: payload,
  })
}
