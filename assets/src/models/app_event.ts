import { Pagination } from '@/models/connect';
import { Effect, Reducer } from 'umi';
import { ServiceEventList } from '@/services/event';
import { message } from 'antd';

interface AppEventItem {
  id: number;
  app_name: string;
  aid: number;
  zone_code: string;
  env: string;
  host_name: string;
  user_name: string;
  uid: number;
  operation: string;
  create_time: number;
  source: string;
  metadata: string;
  operation_name: string;
  source_name: string;
}

export interface AppEventState {
  list: AppEventItem[];
  pagination: Pagination;
  listLoading: boolean;
}

const DefaultAppEventState: AppEventState = {
  list: [],
  pagination: {
    current: 0,
    pageSize: 10,
    total: 0,
  },
  listLoading: false,
};

export interface AppEventModelType {
  namespace: 'appEvent';
  state: AppEventState;
  effects: {
    fetch: Effect;
    clear: Effect;
  };
  reducers: {
    saveList: Reducer<AppEventState>;
    saveLoading: Reducer<AppEventState>;
  };
}

const AppEventModel: AppEventModelType = {
  namespace: 'appEvent',
  state: DefaultAppEventState,
  effects: {
    *fetch({ payload }, { call, put }) {
      yield put({ type: 'saveLoading', payload: true });
      yield put({
        type: 'saveList',
        payload: { list: [], pagination: DefaultAppEventState.pagination },
      });

      const res = yield call(ServiceEventList, payload);

      yield put({ type: 'saveLoading', payload: false });

      if (res.code === 14000) {
        return res;
      }

      if (res.code !== 0) {
        message.error('加载事件流失败: ' + res.msg);
        return res;
      }

      yield put({ type: 'saveList', payload: res.data });

      return res;
    },
    *clear({ payload }, { put }) {
      yield put({
        type: 'saveList',
        payload: { list: [], pagination: DefaultAppEventState.pagination },
      });
    },
  },
  reducers: {
    saveList: (state = DefaultAppEventState, { payload }): AppEventState => {
      return {
        ...state,
        list: payload.list,
        pagination: payload.pagination,
      };
    },
    saveLoading: (state = DefaultAppEventState, { payload }): AppEventState => {
      return {
        ...state,
        listLoading: payload,
      };
    },
  },
};

export default AppEventModel;
