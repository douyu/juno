import request from "@/utils/request";
import { stringify } from "qs";


export async function checkDep() {
  return request(`/api/admin/pprof/checkDep`);
}

export async function installDep(params) {
  return request(`/api/admin/pprof/installDep?${stringify(params)}`);
}

export async function getSysConfig(params) {
  return request(`/api/admin/pprof/getSysConfig?${stringify(params)}`);
}

export async function setSysConfig(params) {
  return request(`/api/admin/pprof/setSysConfig?${stringify(params)}`);
}
