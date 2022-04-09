import { fetchProviderList, fetchAggregationList } from '@/services/provider';
import { message } from 'antd';

const Model = {
  namespace: 'providerModel',
  state: {
    listAggData: [],
  },

  effects: {
    *fetchAggregationList({ payload }, { call, put }) {
      const response = yield call(fetchAggregationList, payload);
      const { code, data, msg } = response;
      if (code !== 0) {
        // message.error("错误信息:"+msg);
        //数据清空
        yield put({
          type: '_fetchAggregationList',
          payload: [],
        });
        // return;
      } else {
        yield put({
          type: '_fetchAggregationList',
          payload: data,
        });
      }
    },
  },
  reducers: {
    _fetchAggregationList(state, action) {
      return {
        ...state,
        listAggData: action.payload,
      };
    },
  },
};

export default Model;
