import { Pagination } from '@/models/connect';
import { Effect } from 'dva';
import { Reducer } from '@@/plugin-dva/connect';
import { fetchAccessTokenList } from '@/services/access_token';
import { message } from 'antd';

export interface AccessTokenModelType {
  namespace: 'accessToken';
  state: AccessTokenState;
  effects: {
    fetchList: Effect;
  };
  reducers: {
    saveList: Reducer<AccessTokenState>;
    setListLoading: Reducer<AccessTokenState>;
  };
}

export interface AccessTokenItem {
  id: number;
  app_id: string;
  name: string;
  app_secret: string;
}

export interface AccessTokenState {
  list: AccessTokenItem[];
  pagination: Pagination;
  listLoading: boolean;
}

const DefaultState: AccessTokenState = {
  list: [],
  pagination: {
    current: 0,
    total: 0,
    pageSize: 0,
  },
  listLoading: false,
};

const AccessTokenModel: AccessTokenModelType = {
  namespace: 'accessToken',
  state: DefaultState,
  effects: {
    *fetchList({ payload: { page = 0, pageSize = 10 } }, { put, call }) {
      yield put({ type: 'setListLoading', payload: true });

      const res = yield call(fetchAccessTokenList, page, pageSize);
      const { code, data } = res;
      if (code !== 0) {
        message.error('获取Access Token列表失败: ' + res.msg);
      }

      yield put({
        type: 'saveList',
        payload: {
          list: data.list || [],
          pagination: data.pagination || { current: 0, pageSize: 0, total: 0 },
        },
      });
    },
  },
  reducers: {
    saveList(state = DefaultState, { payload }) {
      return {
        ...state,
        list: payload.list,
        pagination: payload.pagination,
        listLoading: false,
      };
    },
    setListLoading(state = DefaultState, { payload }) {
      return {
        ...state,
        listLoading: payload && true,
      };
    },
  },
};

export default AccessTokenModel;
