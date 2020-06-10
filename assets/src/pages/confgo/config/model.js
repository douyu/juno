import {
  publishStatus,
  ConfuItems,
  appInfoSrv,
  ConfuChangeList,
  getPublishList,
  getPublishChangeList,
  ConfuAppConfigList,
  getAdminResource,
} from './service';

const Model = {
  namespace: 'confuNew',

  state: {
    app: {},
    apps: [],
    resourceData: {},
    statusList: [], //配置项生效实例列表
    configList: [], //配置项k-v列表,
    file_path: '',
    configText: '', //配置项文本
    configAppList: [], //应用列表
    appConfigList: [], //应用配置文件列表,
    configHistoryList: [], //应用历史版本列表
    configChangeList: [], //应用变更历史列表
    publishChangeData: {}, //每个版本变更列表
    appIdcList: [], // 获取一个应用的机房列表
    msg: '',
  },
  effects: {
    *queryList({ payload }, { call, put }) {
      const res = yield call(getAdminResource, payload);
      yield put({
        type: 'setList',
        payload: formatData(res, {}),
      });
    },
    *queryPublishChange({ payload }, { call, put }) {
      const res = yield call(getPublishChangeList, payload);
      yield put({
        type: 'setPublishChangeData',
        payload: formatData(res, {}),
      });
    },
    *queryHistoryList({ payload }, { call, put }) {
      const res = yield call(getPublishList, payload);
      yield put({
        type: 'setConfigHistoryList',
        payload: formatData(res, []),
      });
    },
    *queryAppDetail({ payload }, { call, put }) {
      const res = yield call(getAppDetail, payload);
      yield put({
        type: 'setApp',
        payload: formatData(res, {}),
      });
      return res;
    },
    *queryAppList({ payload }, { call, put }) {
      const res = yield call(getAppList, payload);
      yield put({
        type: 'setApps',
        payload: formatData(res, []),
      });
      return res;
    },
    *queryStatusList({ payload }, { call, put }) {
      const res = yield call(publishStatus, payload);
      yield put({
        type: 'setStatusList',
        payload: formatData(res, []),
      });
      return res;
    },
    *queryConfig({ payload }, { call, put }) {
      let { caid } = payload;
      caid = caid * 1;
      const res = yield call(ConfuItems, { caid });
      yield put({
        type: 'setConfigList',
        payload: formatData(res, {}),
      });
    },
    *queryConfigApps({ payload }, { call, put }) {
      const { id, aid, env = 'all' } = payload;
      const res = yield call(ConfuAppList, { id, aid, env });
      yield put({
        type: 'setConfigAppList',
        payload: formatData(res, {}),
      });
    },
    *queryAppConfigs({ payload }, { call, put }) {
      const { id, aid, app_name, env, zone_code } = payload;
      if (aid === 0) {
        const res = {};
        yield put({
          type: 'setAppConfigList',
          payload: formatData(res, {}),
        });
      } else {
        const res = yield call(ConfuAppConfigList, { id, aid, app_name, env, zone_code });
        yield put({
          type: 'setAppConfigList',
          payload: formatData(res, {}),
        });
        if (res.code !== 0) {
          yield put({
            type: '_setMsg',
            payload: res.msg,
          });
        } else {
          yield put({
            type: '_setMsg',
            payload: '',
          });
        }
      }
    },
    *queryConfigChangeList({ payload }, { call, put }) {
      const { caid, page, limit } = payload;
      const res = yield call(ConfuChangeList, { caid, page, limit });
      yield put({
        type: 'setConfigChangeList',
        payload: formatData(res, []),
      });
    },
  },

  reducers: {
    setList(state, { payload }) {
      return {
        ...state,
        resourceData: payload,
      };
    },
    setPublishChangeData(state, { payload }) {
      return {
        ...state,
        publishChangeData: payload,
      };
    },
    setConfigHistoryList(state, { payload }) {
      return {
        ...state,
        configHistoryList: payload,
      };
    },
    setApp(state, { payload }) {
      return {
        ...state,
        app: payload,
      };
    },
    setApps(state, { payload }) {
      return {
        ...state,
        apps: payload,
      };
    },
    _setMsg(state, { payload }) {
      return {
        ...state,
        msg: payload,
      };
    },
    setStatusList(state, { payload }) {
      return {
        ...state,
        statusList: payload,
      };
    },
    setAppConfigList(state, { payload }) {
      const app = payload[0] || {};
      const { app_name, format, language, name, aid } = app;
      const temp = {};

      payload.forEach((item) => {
        const { zone_code } = item;
        if (!temp[zone_code]) {
          temp[zone_code] = [item];
        } else {
          temp[zone_code].push(item);
        }
      });

      let list = [
        {
          aid: aid,
          app_name,
          format,
          language,
          name,
          configs: payload,
          files: temp,
        },
      ];
      return {
        ...state,
        appConfigList: list,
      };
    },
    setConfigList(state, { payload }) {
      //解析成列表
      const { configList = [], configText, commonText = '', file_path } = payload;
      // const data = parseConfigTree();
      return {
        ...state,
        configList: configList,
        configText: configText,
        commonText: commonText,
        file_path: file_path,
      };
    },
    setConfigAppList(state, { payload }) {
      //解析应用为数组
      // const list = Object.keys(payload).map(aid=>{
      //   const val = payload[aid];
      //   const app = val[0] || {};
      //   const {app_name,format,language,name} = app;
      //   return {
      //     aid:aid,
      //     app_name,format,language,name,
      //     configs:val,
      //   };
      // });
      return {
        ...state,
        configAppList: payload,
      };
    },
    setConfigChangeList(state, { payload }) {
      return {
        ...state,
        configChangeList: payload,
      };
    },
    setConfigReset(state, { payload }) {
      return {
        ...state,
        statusList: [], //配置项生效实例列表
        configList: [], //配置项k-v列表,
        configText: '', //配置项文本
        configAppList: [], //应用列表
        appConfigList: [], //应用配置文件列表,
        configHistoryList: [], //应用历史版本列表
        configChangeList: [], //应用变更历史列表
        publishChangeData: {}, //每个版本变更列表
      };
    },
  },
};

export default Model;

const formatData = (res, value, key) => {
  if (key) {
    return res.code === 0 ? res[key] : value;
  }
  return res.code === 0 ? res.data : value;
};

//提取一层子结构
const parseConfigTree = (data) => {
  const keys = data
    .map((v) => v.key)
    .map((v) => {
      let key = v.split('.')[0];
      if (v.startsWith('jupiter')) {
        key = v.split('.').slice(0, 2).join('.');
      }
      return key;
    });
  const parentKeys = {};
  keys.forEach((key) => {
    parentKeys[key] = 1;
  });

  const map = {};
  data.forEach((v) => {
    let key = v.key.split('.')[0];
    if (v.key.startsWith('jupiter')) {
      key = v.key.split('.').slice(0, 2).join('.');
    }
    if (parentKeys[key]) {
      if (!map[key]) {
        map[key] = [v];
      } else {
        map[key].push(v);
      }
    }
  });
  return Object.keys(map).map((v) => {
    return {
      key: v,
      status: 5,
      children: map[v],
    };
  });
};
