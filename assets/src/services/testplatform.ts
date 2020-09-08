import request from "@/utils/request";
import {stringify} from "qs";

export async function fetchPipelines(payload: { app_name: string, env?: string, zone_code?: string }) {
  return request(`/api/admin/test/platform/pipeline/list?${stringify(payload)}`)
}

export async function fetchTasks(pipelineID: number, page: number, pageSize = 10) {
  return request(`/api/admin/test/platform/pipeline/tasks?${stringify({
    pipeline_id: pipelineID,
    page,
    page_size: pageSize,
  })}`)
}

export async function fetchTaskSteps(taskID: number) {
  return request(`/api/admin/test/platform/pipeline/tasks/steps?${stringify({
    task_id: taskID
  })}`)
}

export async function fetchWorkerZones() {
  return request(`/api/admin/test/platform/worker/zones`)
}

export async function createPipeline(fields: any) {
  return request(`/api/admin/test/platform/pipeline/create`, {
    method: 'POST',
    data: fields
  })
}

export async function deletePipeline(id: number) {
  return request(`/api/admin/test/platform/pipeline/delete?id=${id}`, {
    method: 'POST',
  })
}

export async function updatePipeline(payload: any) {
  return request(`/api/admin/test/platform/pipeline/update`, {
    method: 'POST',
    data: payload
  })
}

export async function runPipeline(id: number) {
  return request(`/api/admin/test/platform/pipeline/run?id=${id}`, {
    method: 'POST',
  })
}
