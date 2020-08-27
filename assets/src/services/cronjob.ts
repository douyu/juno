import {TaskDetail, TaskStatus} from "@/models/cronjob/types";
import {ResponseCode, ResponseData} from "@/models/types";

export async function fetchTaskDetail(taskId: number) {
  return new Promise<ResponseData<TaskDetail>>((resolve) => {
    setTimeout(() => {
      return resolve({
        code: ResponseCode.OK,
        msg: "",
        data: {
          id: 1,
          job_id: 1,
          status: TaskStatus.Success,
          executed_at: "2020-02-01 12:00:00",
          finished_at: "2020-02-01 12:00:01",
          retry_count: 1,
          script: "echo hello",
          logs: "hello",
        }
      });
    }, 2000)
  })
}
