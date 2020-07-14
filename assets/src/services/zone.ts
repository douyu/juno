import request from "@/utils/request";

export async function zoneEnvTree() {
  return request(`/api/admin/resource/zone/zone_env`)
}
