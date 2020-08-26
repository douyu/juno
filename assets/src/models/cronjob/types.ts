export interface Job {
  id: number
  name: string
  cron: string
  username: string
  app_name: string
  status: JobStatus
  last_executed_at: string
  created_at: string
}

export enum JobStatus {
  Processing = 'processing',
  Success = "success",
  Failed = "failed"
}

export interface Task {

}

export interface State {
}

export const DefaultState: State = {
}

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
