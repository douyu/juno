/**
 * 系统相关Model
 */

import { loadSystemConfig } from '@/services/system';
import { message } from 'antd';

const DefaultState = {
  configLoading: true,
  appUrl: 'http://localhost:50000/',
  authProxyEnabled: false,
  disableLoginForm: false,
  oauth: {
    // OAuth的配置项
  },
};

export default {
  namespace: 'system',
  state: DefaultState,
  effects: {
    *loadSystemConfig(_, { call, put }) {
      yield put({
        type: '_apply',
        payload: {
          configLoading: true,
        },
      });

      const res = yield call(loadSystemConfig);
      if (res.code !== 0) {
        message.error('加载系统设置失败');
        return res;
      }

      yield put({
        type: '_apply',
        payload: {
          ...res.data,
          configLoading: false,
        },
      });

      return res;
    },
  },
  reducers: {
    _apply(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
  },
};
