import request from "@/utils/request";

export async function loadSystemConfig() {
  return request("/api/admin/system/config")
}
