export interface Job {
  id: number
  name: string
  cron: string
  username: string
  app_name: string
  env: string
  zone: string
  status: TaskStatus
  last_executed_at: string
  created_at: string
  script: string
  timeout: number
  retry_count: number
  retry_interval: number
  timers: Timer[]
  enable: boolean
}

export interface Timer {
  cron: string
  nodes: string[]
}

export enum TaskStatus {
  Processing = 'processing',
  Success = "success",
  Failed = "failed"
}

export interface Task {
  id: number
  job_id: number
  status: TaskStatus
  executed_at: string
  finished_at: string
  retry_count: number
  execute_type: TaskExecuteType
}

export enum TaskExecuteType {
  Auto = 0,
  Manual = 1
}

export interface TaskDetail extends Task {
  script: string
  log: string
}

export interface State {
}

export const DefaultState: State = {}

export interface Type {
  namespace: string
  state: State
  effects: Effects
  reducers: Reducers
}

export interface Effects {
}

export interface Reducers {
}
