import request from "@/utils/request";
import {stringify} from 'qs';

export async function bindProtoToApp(param: { proto_id: number, app_name: string }) {
  return request(`/api/admin/test/grpc/proto/bind`, {
    method: 'POST',
    data: param
  })
}

export async function loadAppServiceTree() {
  return request("/api/admin/test/grpc/appServiceTree", {
    method: 'GET'
  });
}

export async function loadUseCases(serviceID: number) {
  return request(`/api/admin/test/grpc/useCases?service_id=${serviceID}`, {
    method: "GET",
  });
}

export async function loadUseCaseById(id: number) {
  return request(`/api/admin/test/grpc/useCases/detail?id=${id}`, {
    method: 'GET'
  });
}

export async function loadGrpcMethod(id: number) {
  return request(`/api/admin/test/grpc/proto/methods/detail?id=${id}`, {
    method: 'GET'
  })
}

export async function createUserCase(payload: any) {
  return request(`/api/admin/test/grpc/useCases/create`, {
    method: 'POST',
    data: payload
  });
}

export async function updateUserCase(payload: any) {
  return request(`/api/admin/test/grpc/useCases/update`, {
    method: 'POST',
    data: payload
  });
}

export async function deleteUserCase(id: number) {
  return request(`/api/admin/test/grpc/useCases/delete?id=${id}`, {
    method: 'POST',
  });
}

export async function sendRequest(payload: any) {
  return request(`/api/admin/test/grpc/request/send`, {
    method: 'POST',
    data: payload
  })
}

export async function historyList(payload: any) {
  return request(`/api/grpcDebug/history?${stringify(payload)}`)
}

export async function historyItem(id: number) {
  return request(`/api/admin/test/grpc/request/history/detail?history_id=${id}`)
}

export async function loadPublicList(appName: string, serviceName: string) {
  return request(`/api/grpcDebug/publicCases?appName=${appName}&serviceName=${serviceName}`)
}

export async function loadPublicCase(caseId: number) {
  return request(`/api/grpcDebug/publicCases/item?id=${caseId}`)
}

export async function loadGrpcProtoList() {
  return request(`/api/admin/test/grpc/proto`)
}

export async function bindProtoApp(params: any) {
  return request(`/api/grpcDebug/proto/bindApp`, {
    method: 'POST',
    data: params
  })
}

export async function loadHistoryList(payload: { service_id: number, page: number, page_size: number }) {
  return request(`/api/admin/test/grpc/request/history?${stringify(payload)}`)
}
