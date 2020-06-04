import request from "@/utils/request";
import { stringify } from "qs";

// 获取应用列表
export async function reqSelect(param) {
  return request(`/api/admin/analysis/topology/select?${stringify(param)}`);
}


export async function reqList(param) {
  return request(`/api/admin/analysis/topology/list?${stringify(param)}`);
}
