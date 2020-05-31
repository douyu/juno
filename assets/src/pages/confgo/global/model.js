import { getRelatedResource, getAdminResource, getResourceAuthApp, appFilterListApi } from './service'

const formatData = (res, value, key) => {
  if (key) {
    return res.code === 0 ? res[key] : value
  }
  return res.code === 0 ? res.data : value
};


export default {
  namespace: 'configResource',

  state: {
    resourceData: {
      list: [],
      totalCount: 0,
    },//资源列表
    relatedList: [],//配置文件关联的资源列表
    authList: [],
    options: [],
    appList: [],
  },
  effects: {
    *queryList({ payload }, { call, put }) {
      const res = yield call(getAdminResource, payload);
      console.log("res", res)
      yield put({
        type: 'setList',
        payload: formatData(res, {})
      })
    },
    *queryRelatedList({ payload }, { call, put }) {
      const res = yield call(getRelatedResource, payload);
      yield put({
        type: 'setRelatedList',
        payload: formatData(res, [])
      })
    },
    *queryAppList({ payload }, { call, put }) {
      const res = yield call(appFilterListApi, payload);
      yield put({
        type: 'setAppList',
        payload: formatData(res, {}),
      })
    },
    *queryAuthList({ payload }, { call, put }) {
      const res = yield call(getResourceAuthApp, payload);
      yield put({
        type: 'setAuthList',
        payload: formatData(res, {}),
      })
    }
  },

  reducers: {
    setList(state, { payload }) {
      return {
        ...state,
        resourceData: payload,
      }
    },
    setRelatedList(state, { payload }) {
      return {
        ...state,
        relatedList: payload,
      }
    },
    setAuthList(state, { payload }) {
      const { appList = [] } = state;
      const authList = payload;
      let options = [];
      for (let app of appList) {
        let tag = true;
        for (let auth of authList) {
          if (auth.aid === app.aid) {
            tag = false;
            break;
          }
        }
        if (tag) {
          options.push(app);
        }
      }
      return {
        ...state,
        authList: authList,
        options: options,
      }
    },
    setAppList(state, { payload }) {
      return {
        ...state,
        appList: payload,
      }
    }
  }
}
