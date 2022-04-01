import { message } from 'antd';
import { getAppListSrv, getEnv } from './service';

const formatData = (res, value, key) => {
  if (key) {
    return res.code === 0 ? res[key] : value;
  }
  return res.code === 0 ? res.data : value;
};

export default {
  namespace: 'appHeaderModel',

  state: {
    appList: [],
    idcList: [],
  },
  effects: {
    *getAppList({ payload }, { call, put }) {
      const response = yield call(getAppListSrv, payload);
      const { code, data, msg } = response;
      if (code !== 0) {
        return;
      }
      yield put({
        type: '_list',
        payload: data,
      });
    },
    *getEnv({ payload }, { call, put }) {
      const response = yield call(getEnv, payload);
      const { code, data, msg } = response;
      if (code !== 0) {
        return;
      }
      yield put({
        type: '_env',
        payload: data,
      });
    },
  },

  reducers: {
    _list(state, { payload }) {
      return {
        ...state,
        appList: payload,
      };
    },
    _env(state, { payload }) {
      return {
        ...state,
        idcList: payload.idcList,
      };
    },
  },
};
