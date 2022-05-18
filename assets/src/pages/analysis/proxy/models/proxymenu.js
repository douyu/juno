import { message } from 'antd';
import { itemList } from '../services/proxymenu';

const defaultStates = {
  list: [],
  listLoading: false,
  pagination: {
    current: 0,
    total: 0,
    pageSize: 0,
  },

  // create modal
  modalConfigVisible: false,
  // edit modal
  modalConfigEditVisible: false,
  currentEditResource: {
    id: 0,
    proxy_url: '',
    title: '',
    panel_type: '',
    key: '',
  },
};

export default {
  namespace: 'proxymenu',
  state: defaultStates,
  effects: {
    *loadList({ payload }, { call, put }) {
      const res = yield call(itemList, payload);
      if (res.code !== 0) {
        message.error('加载资源列表失败');
        return res;
      }

      yield put({
        type: '_apply',
        payload: {
          list: res.data.list,
          pagination: res.data.pagination,
        },
      });
      return res;
    },
    *showModalCreate({ payload }, { call, put }) {
      yield put({
        type: '_apply',
        payload: {
          modalConfigVisible: payload,
        },
      });
    },
    *showModalEdit({ payload }, { put }) {
      const { visible, ...rest } = payload;
      yield put({
        type: '_apply',
        payload: {
          currentEditResource: {
            ...rest,
          },
          modalConfigEditVisible: visible,
        },
      });
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
