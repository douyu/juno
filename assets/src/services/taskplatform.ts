import request from '@/utils/request';
import { stringify } from 'qs';
import { Job, TaskDetail } from '@/models/cronjob/types';
import { ResponseData } from '@/models/types';

export async function fetchJobs(page = 0, pageSize = 10, filters: any) {
  return request(
    `/api/admin/cronjob/list?${stringify({
      page,
      page_size: pageSize,
      ...filters,
    })}`,
  );
}

export async function createJob(job: Job) {
  return request(`/api/admin/cronjob/create`, {
    method: 'POST',
    data: job,
  });
}

export async function deleteJob(id: number) {
  return request(`/api/admin/cronjob/delete?id=${id}`, {
    method: 'POST',
  });
}

export async function updateJob(job: Job) {
  return request(`/api/admin/cronjob/update`, {
    method: 'POST',
    data: job,
  });
}

export async function dispatchJob(id: number, node: string) {
  return request(`/api/admin/cronjob/dispatch?id=${id}&node=${node}`, {
    method: 'POST',
  });
}

export async function fetchTasks(id: number, page = 0, pageSize = 10, filter: any) {
  return request(
    `/api/admin/cronjob/task/list?${stringify(
      {
        id,
        page,
        page_size: pageSize,
        ...filter,
      },
      {
        indices: false,
      },
    )}`,
  );
}

export async function fetchTaskDetail(taskId: number) {
  return new Promise<ResponseData<TaskDetail>>((resolve, reject) => {
    request(`/api/admin/cronjob/task/detail?taskId=${taskId}`).then((r) => {
      if (r.code === 0) {
        resolve(r);
      } else {
        reject(r);
      }
    });
  });
}
