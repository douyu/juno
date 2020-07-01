import {request} from "@@/plugin-request/request";

export async function zoneEnvTree() {
  return request(`/api/admin/resource/zone/zone_env`)
}
