import {
  createCollection,
  fetchCollections,
  getFolderTree,
  fetchTestCase,
  loadHistory,
  sendRequest,
  saveTestCase,
  createTestCase,
  fetchHttpAddrList,
  loadHistoryDetail,
} from '@/services/httptest';
import { message } from 'antd';

export default {
  *loadTestCase({ payload }, { call, put }) {
    yield put({
      type: '_apply',
      payload: {
        currentRequestLoading: true,
      },
    });
    const res = yield call(fetchTestCase, payload.id);

    yield put({
      type: '_apply',
      payload: {
        currentRequestLoading: false,
      },
    });

    if (res.code === 0) {
      yield put({
        type: '_setCurrentRequest',
        payload: res.data,
      });
    }
    return res;
  },
  *updateCurrentRequest({ payload }, { put }) {
    yield put({
      type: '_updateCurrentRequest',
      payload: payload,
    });
  },
  *sendRequest({ payload }, { call, put }) {
    yield put({
      type: '_setSendStatus',
      payload: 'sending',
    });

    const res = yield call(sendRequest, payload);
    if (res.code !== 0) {
      message.error(res.msg);
      yield put({
        type: '_setResponse',
        payload: {
          response: null,
          status: 'fail',
          error: res.msg,
        },
      });
    } else {
      yield put({
        type: '_setResponse',
        payload: {
          response: res.data,
          status: 'success',
          error: '',
        },
      });
    }
  },
  *saveTestCase({ payload }, { call, put }) {
    if (typeof payload.body !== 'string') {
      try {
        payload.body = JSON.stringify(payload.body);
      } catch (e) {
        payload.body = '';
      }
    }

    const res = yield call(saveTestCase, payload);

    if (res.code === 0) {
      message.success('保存成功');
    } else {
      message.error(res.msg);
    }

    return res;
  },
  *loadHistory({ payload }, { call, put }) {
    yield put({
      type: '_apply',
      payload: {
        historyLoading: true,
      },
    });

    const res = yield call(loadHistory, payload);
    if (res.code === 0) {
      yield put({
        type: '_setHistory',
        payload: res.data,
      });
    }
  },
  *loadHistoryDetail({ payload }, { call, put }) {
    yield put({
      type: '_apply',
      payload: {
        currentRequestLoading: true,
      },
    });

    const res = yield call(loadHistoryDetail, payload);
    if (res.code !== 0) {
      message.error(res.msg);
      return res;
    }

    yield put({
      type: '_apply',
      payload: {
        currentRequestLoading: false,
        currentRequest: {
          ...res.data,
          id: undefined,
        },
      },
    });

    return res;
  },
  *createCollection({ payload }, { call, put }) {
    const { name, appName } = payload;

    yield put({
      type: '_apply',
      payload: {
        confirmNewCollectionLoading: true,
      },
    });

    const res = yield call(createCollection, appName, name);

    yield put({
      type: '_apply',
      payload: {
        confirmNewCollectionLoading: false,
        visibleModalNewCollection: res.code !== 0,
      },
    });

    if (res.code !== 0) {
      message.error(res.msg);
    }

    return res;
  },

  *createTestCase({ payload }, { call, put }) {
    yield put({
      type: '_apply',
      payload: {
        confirmNewTestCaseLoading: true,
        currentRequestLoading: true,
      },
    });

    const res = yield call(createTestCase, payload);
    if (res.code !== 0) {
      message.error(res.msg);
    } else {
      message.success('创建成功');
    }

    let updatePayload = {
      confirmNewTestCaseLoading: false,
      visibleModalNewTestCase: res.code !== 0,
      currentRequestLoading: false,
    };

    if (res.code === 0) {
      updatePayload.currentRequest = res.data;
    }

    yield put({
      type: '_apply',
      payload: updatePayload,
    });

    return res;
  },

  *showModalNewCollection({ payload }, { call, put }) {
    yield put({
      type: '_apply',
      payload: {
        visibleModalNewCollection: payload,
      },
    });
  },

  *showModalNewTestCase({ payload }, { call, put }) {
    yield put({
      type: '_apply',
      payload: {
        visibleModalNewTestCase: payload.visible,
        selectedCollection: payload.collectionID,
      },
    });
  },

  *setCurrentApp({ payload }, { call, put }) {
    yield put({
      type: '_apply',
      payload: {
        currentAppName: payload,
      },
    });
  },

  *fetchCollections({ payload }, { call, put }) {
    const { appName, page = 0, pageSize = 1000 } = payload;
    yield put({
      type: '_apply',
      payload: {
        collectionsLoading: true,
      },
    });

    const res = yield call(fetchCollections, appName, page, pageSize);

    if (res.code !== 0) {
      message.error(res.msg);
      return res;
    }

    yield put({
      type: '_apply',
      payload: {
        collectionsLoading: false,
        collections: res.data.list,
        collectionsPagination: res.data.pagination,
      },
    });

    return res;
  },

  *fetchAppHttpAddrList({ payload }, { call, put }) {
    const res = yield call(fetchHttpAddrList, payload);
    if (res.code !== 0) {
      message.error('获取应用地址列表失败:' + res.msg);
      return res;
    }

    yield put({
      type: '_apply',
      payload: {
        httpPort: res.data.port,
        addrList: res.data.hosts,
      },
    });

    return res;
  },

  *showModalScriptEditor({ payload }, { call, put }) {
    yield put({
      type: '_apply',
      payload: {
        visibleModalScriptEditor: payload,
      },
    });
  },
};
