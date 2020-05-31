import request from "@/utils/request";
import { stringify } from "qs";

// 获取应用详细信息,机房信息
export async function pprofListRule(params) {
  return request(`/api/admin/pprof/list?${stringify(params)}`);
}

// run pprof
export async function runRule(params) {
  return request(`/api/admin/pprof/run`, {
    method: "POST",
    data: params
  });
}

export async function pprofRemark(params) {
  return request(`/api/admin/pprof/remark`, {
    method: "POST",
    data: params
  });
}

export async function viewSvgRule(params) {
  return request(`/api/admin/pprof/viewsvg?${stringify(params)}`);
}

export async function checkDep(params) {
  return request(`/api/admin/pprof/checkDep?${stringify(params)}`);
}
