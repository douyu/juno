import {Effect} from "dva";
import {Reducer} from "@@/plugin-dva/connect";

export enum JobType {
  CodeCheck = "code_check",
  GitPull = "git_pull",
  UnitTest = "unit_test",
  HttpTest = "http_test"
}

export enum StepType {
  SubPipeline = 1,
  Job = 2
}

export interface Pipeline {
  id: number
  name: string
  app_name: string
  env: string
  zone_code: string
  branch: string
  desc: PipelineDesc
  status: "" | "running" | "waiting" | "failed" | "success"
  run_count: number
}

export interface PipelineDesc {
  parallel: boolean
  steps: PipelineStep[]
}

export interface PipelineStep {
  type: StepType
  name: string
  sub_pipeline: PipelineDesc | null
  job_payload: TestJobPayload | null
}

interface TestJobPayload {
  type: JobType
  payload: any
}

export interface Task {
  task_id: number
  name: string
  app_name: string
  env: string
  zone_code: string
  branch: string
  desc: PipelineDesc
  status: "pending" | "running" | "failed" | "success"
  created_at: string
}

export interface TaskStepStatus {
  id: number
  task_id: number
  step_name: string
  status: "waiting" | "running" | "failed" | "success"
  logs: string
}

export interface TestPlatformState {
  pipelines: Pipeline[]
  pipelinesLoading: boolean

  tasks: Task[]
  tasksLoading: boolean
}

export const DefaultState: TestPlatformState = {
  pipelines: [],
  pipelinesLoading: false,

  tasks: [],
  tasksLoading: false,
}

export interface TestPlatformType {
  namespace: string
  state: TestPlatformState
  effects: Effects
  reducers: Reducers
}

export interface Effects {
  fetchPipelines: Effect
  fetchTasks: Effect
}

export interface Reducers {
  savePipelines: Reducer<TestPlatformState>
  setPipelinesLoading: Reducer<TestPlatformState>

  saveTasks: Reducer<TestPlatformState>
  setTasksLoading: Reducer<TestPlatformState>
}

export const StepNames = {
  [JobType.GitPull]: {
    title: 'Git Pull',
    description: '拉代码'
  },
  [JobType.CodeCheck]: {
    title: '静态检查',
    description: '通过 golint 工具对 Go 代码进行静态检查'
  },
  [JobType.UnitTest]: {
    title: '单元测试',
    description: '执行代码目录下所有单元测试'
  }
}

export interface WorkerZone {
  zone_name: string,
  zone_code: string,
  zone_count: number
}
