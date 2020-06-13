import request from "@/utils/request";
import { stringify } from "qs";

// 获取应用过滤信息
export async function getHomeInfo() {
  return request(`/api/home`);
}

// 获取实例事件列表
export async function eventList(eventType) {
  let payload = {
      "eventType":eventType,
  };
  return request(`/api/event/list?${stringify(payload)}`);
}

// 获取实例事件列表
export async function eventPodUrl(podName) {
  let payload = {
      "podName":podName,
  };
  return request(`/api/event/pod?${stringify(payload)}`);
}