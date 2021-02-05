import { message } from 'antd';
import { getAppListSrv, getEnv} from './service'
import { fetchProviderList, fetchAggregationList } from "@/services/provider";

const formatData = (res, value, key) => {
  if (key) {
    return res.code === 0 ? res[key] : value
  }
  return res.code === 0 ? res.data : value
};

export default {
  namespace: 'headerModel',

  state: {
    appList: [],
    idcList: [],
  },
  effects: {
    *getAppList({payload}, {call, put}) {
      const response = yield call(getAppListSrv, payload);
      const {code, data, msg} = response;
      if (code !== 0) {
        return;
      }
      yield put({
        type: "_list",
        payload: data
      });
    },
    *getEnv({payload}, {call, put}) {
      const response = yield call(getEnv, payload);
      const {code, data, msg} = response;
      if (code !== 0) {
        return;
      }
      yield put({
        type: "_env",
        payload: data
      });
    },
    *fetchAggregationList({ payload }, { call, put }) {
      const response = yield call(fetchAggregationList, payload);
      const { code, data, msg } = response;
      if (code !== 0) {
        // message.error("错误信息:"+msg);
        //数据清空
        yield put({
          type: "_fetchAggregationList",
          payload: [],
        });
        // return;
      }else {
        yield put({
          type: "_fetchAggregationList",
          payload: data
        });
      }
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
  }
}
