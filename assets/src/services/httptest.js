import request from '@/utils/request';
import { stringify } from 'qs';

export async function createCollection(appName, name) {
  return request('/api/admin/test/http/collections/create', {
    method: 'POST',
    data: {
      app_name: appName,
      name,
    },
  });
}

export async function fetchCollections(appName, page = 0, pageSize = 1000) {
  return request(
    `/api/admin/test/http/collections?${stringify({
      app_name: appName,
      page,
      page_size: pageSize,
    })}`,
  );
}

export async function createTestCase(payload) {
  return request('/api/admin/test/http/useCases/create', {
    method: 'POST',
    data: payload,
  });
}

export async function fetchTestCase(id) {
  return request(`/api/admin/test/http/useCases/detail?id=${id}`);
}

export async function saveTestCase(params) {
  return request(`/api/admin/test/http/useCases/update`, {
    method: 'POST',
    data: params,
  });
}

export async function fetchHttpAddrList(appName) {
  return request(`/api/admin/resource/app/httpAddrList?app_name=${appName}`);
}

export async function getFolderTree() {
  return request('/api/postman/http/folderTree');
}

export async function createRequest(name, parentFolder, params) {
  return request('/api/postman/http/request/create', {
    method: 'POST',
    data: {
      name,
      parentFolder: parseInt(parentFolder),
      ...params,
    },
  });
}
export async function deleteTestCase(id) {
  return request('/api/admin/test/http/useCases/delete', {
    method: 'POST',
    data: {
      id: parseInt(id),
    },
  });
}

export async function deleteCollection(id) {
  return request('/api/admin/test/http/collections/delete', {
    method: 'POST',
    data: {
      collection_id: parseInt(id),
    },
  });
}

export async function sendRequest(params) {
  return request(`/api/admin/test/http/request/send`, {
    method: 'POST',
    data: params,
  });
}

export async function loadHistory(params) {
  return request(`/api/admin/test/http/request/history?${stringify(params)}`);
}

export async function loadHistoryDetail(id) {
  return request(`/api/admin/test/http/request/history/detail?history_id=${id}`);
}
