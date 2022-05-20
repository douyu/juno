/**
 * 系统相关Model
 */

import { uilist } from '../services/aliyunlog';
import { message } from 'antd';

export default {
  namespace: 'aliyunlog',
  state: { selectList: [] },
  effects: {
    *uilist(_, { call, put }) {
      const res = yield call(uilist);
      if (res.code !== 0) {
        message.error(res.msg || '系统错误');
        return res;
      }
      yield put({
        type: '_apply',
        payload: {
          selectList: (res.data && res.data.list) || [],
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
