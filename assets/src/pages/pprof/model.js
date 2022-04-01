import { pprofListRule, runRule, viewSvgRule, pprofRemark } from './services';

const Model = {
  namespace: 'pprofModel',
  state: {
    pprofList: [], // 根据应用信息,机房信息,获取pprof
  },
  effects: {
    *list({ payload }, { call, put }) {
      const response = yield call(pprofListRule, payload);
      const { code, data, msg } = response;
      yield put({
        type: '_list',
        payload: data,
      });
    },
    *run({ payload, callback }, { call, put }) {
      const response = yield call(runRule, payload);
      if (callback) callback(response);
    },
    *viewsvg({ payload, callback }, { call, put }) {
      const response = yield call(viewSvgRule, payload);
      if (callback) callback(response);
    },
    *remark({ payload, callback }, { call, put }) {
      const response = yield call(pprofRemark, payload);
      if (callback) callback(response);
    },
  },
  reducers: {
    _list(state, { payload }) {
      return {
        ...state,
        pprofList: payload,
      };
    },
  },
};

export default Model;
