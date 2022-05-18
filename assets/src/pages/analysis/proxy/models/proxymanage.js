import { message } from 'antd';
import { itemList } from '../services/proxymanage';

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
    sub_path: '',
    proxy_addr: '',
    title: '',
    is_rewrite: 1,
  },
};

export default {
  namespace: 'proxymanage',
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
