import effects from './effects';
import reducers from './reducers';

export default {
  namespace: 'HttpDebug',
  state: {
    currentRequest: null,
    currentRequestLoading: false,

    currentRequestID: 0,
    response: null,
    folderTree: [],

    sendStatus: 'not_start', // 请求发起状态(not_start: 未发起, sending: 正在发请求, done: 已完成)

    responseStatus: 'success',
    responseError: '',

    // history
    history: [],
    historyLoading: false,
    historyPagination: {
      current: 0,
      pageSize: 0,
      total: 0,
    },

    // 当前应用端口
    httpPort: 0,
    // 当前应用地址列表
    addrList: [],

    // 正在编辑用例名称
    nameEditing: false,

    // 当前应用名
    currentAppName: '',

    // Modal: 新建 Collection
    visibleModalNewCollection: false,
    confirmNewCollectionLoading: false,

    // Modal: 新建用例
    visibleModalNewTestCase: false,
    confirmNewTestCaseLoading: false,
    selectedCollection: 0, // 通过右键选择的collection id

    // 测试用例集合
    collections: [],
    collectionsLoading: false,
    collectionsPagination: {
      current: 0,
      pageSize: 0,
      total: 0,
    },

    visibleModalScriptEditor: false,
  },
  effects: effects,
  reducers: reducers,
};
