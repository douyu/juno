export interface ResponseData<T> {
  code: ResponseCode
  msg: string
  data: T
}

export enum ResponseCode {
  OK = 0,
  InternalError = 1,
}
