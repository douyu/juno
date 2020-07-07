import {
  createConfig,
  deleteConfig,
  loadConfigDetail,
  loadConfigDiff,
  loadConfigs,
  loadHistoryList,
  saveConfig,
  srvConfigPublish,
  srvLoadConfigInstances,
} from '@/services/config';
import { message } from 'antd';
import { parseConfigResource } from '@/utils/config';
import { batchCheckVersion } from '@/services/config_resource';

export default {
  *loadConfigInfo({ payload }, { call, put }) {
    const { aid, env } = payload;
    yield put({ type: '_apply', payload: { configListLoading: true } });

    const res = yield call(loadConfigs, aid, env);
    yield put({ type: '_apply', payload: { configListLoading: false } });

    if (res.code !== 0) {
      message.error(res.msg);
    }

    yield put({
      type: '_apply',
      payload: {
        configList: res.data,
      },
    });
  },
  *loadConfigInstances({ payload }, { call, put }) {
    const { aid, env, zoneCode, configurationID } = payload;
    yield put({ type: '_apply', payload: { configInstanceListLoading: true } });

    const res = yield call(srvLoadConfigInstances, aid, env, zoneCode, configurationID);
    yield put({ type: '_apply', payload: { configInstanceListLoading: false } });

    if (res.code !== 0) {
      message.warning(res.msg);
    }

    yield put({
      type: '_apply',
      payload: {
        configInstanceList: res.data,
      },
    });
  },
  *configPublish({ payload }, { call, put }) {
    const { id, version } = payload;
    console.log('id', id);
    console.log('version', version);
    yield put({ type: '_apply', payload: { configPublishLoading: true } });

    const res = yield call(srvConfigPublish, id, version);
    yield put({ type: '_apply', payload: { configPublishLoading: false } });

    if (res.code !== 0) {
      message.error(res.msg);
    } else {
      message.success('配置发布成功');
    }
  },
  *setZoneList({ payload }, { call, put }) {
    yield put({
      type: '_setZoneList',
      payload: payload,
    });
  },
  *setCurrentEnv({ payload }, { call, put }) {
    const { aid, env, appName } = payload;
    yield put({
      type: '_apply',
      payload: {
        aid,
        env,
        appName,
      },
    });
  },
  *showCreateModal({ payload }, { call, put }) {
    yield put({
      type: '_apply',
      payload: {
        visibleModalCreate: payload,
      },
    });
  },
  *create({ payload }, { call, put }) {
    const res = yield call(createConfig, payload);
    if (res.code !== 0) {
      message.error('创建失败: ' + res.msg);
      return res;
    }

    message.success('创建成功');

    return res;
  },
  *loadConfigDetail({ payload }, { call, put }) {
    const { id } = payload;

    yield put({
      type: '_apply',
      payload: {
        configFileLoading: true,
        visibleEditorMaskLayer: false,
      },
    });

    const res = yield call(loadConfigDetail, id);

    yield put({
      type: '_apply',
      payload: {
        configFileLoading: false,
      },
    });

    if (res.code !== 0) {
      message.error('加载配置失败，请重试(' + res.msg + ')');
      return;
    }

    yield put({
      type: '_apply',
      payload: {
        editorMode: 'code',
        currentConfig: res.data,
        currentContent: res.data.content,
      },
    });
  },
  *setEditor({ payload }, { put }) {
    yield put({
      type: '_apply',
      payload: {
        editorInstance: payload,
      },
    });
  },
  *setCurrentContent({ payload }, { put }) {
    yield put({
      type: '_apply',
      payload: {
        currentContent: payload,
      },
    });
  },
  *saveConfigFile({ payload }, { call, put }) {
    const { id, content } = payload;
    const res = yield call(saveConfig, id, payload.message, content);
    if (res.code !== 0) {
      message.error('保存失败:' + res.msg);
      return res;
    }

    message.success('保存成功!');

    yield put({
      type: '_setCurrentConfigContent',
      payload: content,
    });

    return res;
  },
  *showSaveModal({ payload }, { call, put }) {
    yield put({
      type: '_apply',
      payload: {
        visibleModalSave: payload,
      },
    });
  },
  *showHistoryModal({ payload }, { put }) {
    yield put({
      type: '_apply',
      payload: {
        visibleModalHistory: payload,
      },
    });
  },
  *loadHistory({ payload }, { call, put }) {
    const { id, page, size } = payload;
    yield put({
      type: '_apply',
      payload: {
        historyListLoading: true,
      },
    });

    const res = yield call(loadHistoryList, id, page, size);

    yield put({
      type: '_apply',
      payload: {
        historyListLoading: false,
      },
    });

    if (res.code !== 0) {
      message.error('历史版本列表加载失败: ' + res.msg);
      return res;
    }

    yield put({
      type: '_apply',
      payload: {
        historyList: res.data.list,
        historyListPagination: res.data.pagination,
      },
    });

    return res;
  },
  *showDiffEditor({ payload }, { call, put }) {
    const { /*配置版本对应的id*/ id } = payload;

    yield put({
      type: '_apply',
      payload: {
        configFileLoading: true,
        visibleEditorMaskLayer: false,
      },
    });

    const res = yield call(loadConfigDiff, id);

    yield put({
      type: '_apply',
      payload: {
        configFileLoading: false,
      },
    });

    if (res.code !== 0) {
      message.error('配置加载失败: ' + res.msg);
      return res;
    }

    yield put({
      type: '_apply',
      payload: {
        editorMode: 'diff',
        diffOriginConfig: res.data.origin,
        diffModifiedConfig: res.data.modified,
      },
    });

    return res;
  },
  *deleteConfig({ payload }, { call, put }) {
    const res = yield call(deleteConfig, payload);
    if (res.code === 0) {
      message.success('删除成功');
    } else {
      message.error('删除失败:' + res.msg);
    }

    return res;
  },
  *showModalInsertResource({ payload }, { call, put }) {
    yield put({
      type: '_apply',
      payload: {
        visibleModalInsertResource: payload,
      },
    });
  },
  *checkResource({ payload }, { call, put }) {
    const { content, zone, env } = payload;
    let reqPayload = parseConfigResource(content).map((item) => {
      return {
        ...item,
        zone,
        env,
      };
    });

    yield put({
      type: '_apply',
      payload: {
        resourceCheckLoading: true,
      },
    });

    const r = yield call(batchCheckVersion, reqPayload);
    if (r.code !== 0) {
      message.error('资源版本检查失败:' + r.msg);
      return;
    }

    yield put({
      type: '_apply',
      payload: {
        resourceCheckResult: r.data,
        resourceCheckLoading: false,
      },
    });
  },

  *showEditorMaskLayer({ payload }, { put }) {
    const { child, visible } = payload;
    yield put({
      type: '_apply',
      payload: {
        visibleEditorMaskLayer: visible,
        editorMaskLayerChild: child,
      },
    });
  },

  *setCurrentInstance({ payload }, { call, put }) {
    yield put({
      type: '_apply',
      payload: {
        currentInstance: payload,
      },
    });
  },
};
