import { Effect, Reducer } from 'umi';
import {
  ServiceUserCreate,
  ServiceUserList,
  ServiceUserDelete,
  ServiceUserUpdate,
} from './service';

import { BasicListItemDataType } from './data.d';

export interface StateType {
  list: BasicListItemDataType[];
}

export interface ModelType {
  namespace: string;
  state: StateType;
  effects: {
    fetch: Effect;
    appendFetch: Effect;
    submit: Effect;
  };
  reducers: {
    queryList: Reducer<StateType>;
    appendList: Reducer<StateType>;
  };
}

const Model: ModelType = {
  namespace: 'userAndmanage',

  state: {
    list: [],
    total: 0,
  },

  effects: {
    *fetch({ payload }, { call, put }) {
      const response = yield call(ServiceUserList, payload);
      yield put({
        type: 'queryList',
        payload: Array.isArray(response.data.list) ? response.data : [],
      });
    },
    *appendFetch({ payload }, { call, put }) {
      const response = yield call(ServiceUserList, payload);
      yield put({
        type: 'appendList',
        payload: Array.isArray(response.data.list) ? response.data : [],
      });
    },
    *submit({ payload }, { call, put }) {
      let callback;
      if (payload.uid) {
        callback = Object.keys(payload).length === 1 ? ServiceUserDelete : ServiceUserUpdate;
      } else {
        callback = ServiceUserCreate;
      }
      yield call(callback, payload); // post

      const response = yield call(ServiceUserList, {});
      yield put({
        type: 'queryList',
        payload: Array.isArray(response.data.list) ? response.data : [],
      });
    },
  },

  reducers: {
    queryList(state, action) {
      return {
        ...state,
        list: action.payload.list,
        total: action.payload.total,
      };
    },
    appendList(state = { list: [] }, action) {
      return {
        ...state,
        list: state.list.concat(action.payload.list),
        total: action.payload.total,
      };
    },
  },
};

export default Model;
