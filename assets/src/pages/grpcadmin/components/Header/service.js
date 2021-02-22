import request from "@/utils/request";
import { stringify } from "qs";

// 获取应用过滤信息
export async function getAppListSrv() {
  return request(`/api/app/filter/list?langs=Go`);
}

// 获取环境和机房数据
export async function getEnv() {
  return request(`/api/app/env`);
}