// 配置编辑 Model

import effects from '@/models/config/effects';
import reducers from '@/models/config/reducers';

const defaultState = {
  // 配置列表
  configList: [],
  configListLoading: false,

  zoneList: [],

  // 实例列表
  configInstanceList: [],
  configInstanceListLoading: false,

  // 模态窗口状态
  visibleModalCreate: false,
  visibleModalSave: false,
  visibleModalHistory: false, // 历史版本窗口
  visibleModalInsertResource: false,

  aid: 0,
  env: '',
  zoneCode: '',
  appName: '',

  // 配置发布
  configPublishLoading: false,

  // 当前正在编辑的配置文件
  currentConfig: null,
  configFileLoading: false,
  // 当前编辑器的内容
  currentContent: '',

  // 当前的Editor示例
  editorMode: 'code', // code || diff (code: 代码模式，diff：代码对比模式)
  editorInstance: null,

  // Diff配置
  diffOriginConfig: {},
  diffModifiedConfig: {},

  // 历史版本列表
  historyList: [],
  historyListPagination: {},
  historyListLoading: false,

  // 当前依赖的资源版本检查结果
  resourceCheckResult: [],
  resourceCheckLoading: false,

}

export default {
  namespace: 'config',
  state: defaultState,
  effects: effects,
  reducers: reducers,
};
