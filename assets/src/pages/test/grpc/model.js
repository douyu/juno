import {
  createUserCase,
  deleteUserCase,
  historyItem,
  loadAppServiceTree,
  loadGrpcMethod, loadGrpcProtoList, loadPublicCase, loadPublicList,
  loadUseCaseById,
  loadUseCases,
  sendRequest,
  updateUserCase
} from "@/services/grpctest";
import {formatProtoDesc} from "@/utils/proto";
import {grpcAddrList} from "@/services/app";
import {message} from 'antd';

const StorageKeySettings = 'grpc_debug.settings';

export default {
  namespace: 'grpcDebugModel',
  state: {
    app_service_tree: [],
    use_cases: [],
    node_addr_list: {
      port: 0,
      hosts: []
    },
    selected_service: [],
    editor: {
      form: {
        case_name: "",
        input: "",
        autoTestId: 0,
        metadata: []
      },
      response: "",
      info: {
        app_name: "",
        service_name: "",
        method_name: ""
      }
    },
    selected_user_case: '',
    right_menu_visible: false,
    right_menu_position: {
      x: 0,
      y: 0
    },
    right_menu: [],
    response: null,
    active_tab: 'api',
    selected_history_id: 0,
    public_cases: [],
    setting_dialog_visible: false,
    settings: {
      localhost: "127.0.0.1"
    },
    service_bind_dialog_visible: false,
    proto_list: [],
    app_list: [],
  },
  effects: {
    * changeTab({payload}, {call, put}) {
      yield put({
        type: 'apply',
        payload: {
          active_tab: payload
        }
      })
    },
    * loadAppServiceTree(_, {call, put}) {
      let res = yield call(loadAppServiceTree);
      if (res.code === 0) {
        let payload = {app_service_tree: res.data || []};
        yield put({
          type: 'apply',
          payload: payload
        })
      } else {
        message.error("加载应用服务列表失败:" + res.msg);
      }

      return res;
    },
    * loadUserCases({payload}, {call, put}) {
      yield put({
        type: 'apply',
        payload: {
          selected_service: [payload.appName, payload.serviceID],
          node_addr_list: {
            port: 0,
            hosts: []
          } // clean addr list
        }
      });

      let res = yield call(loadUseCases, payload.serviceID);
      if (res.code === 0) {
        yield put({
          type: 'apply',
          payload: {
            use_cases: res.data
          }
        });
      } else {
        message.error("加载测试用例失败:" + res.msg);
      }

      res = yield call(grpcAddrList, {app_name: payload.appName});
      yield put({
        type: 'apply',
        payload: {
          node_addr_list: res.data,
        }
      })
    },
    * loadUseCase({payload}, {call, put}) {
      let res = yield call(loadUseCaseById, payload.id);
      if (res.code === 0) {
        let data = res.data;
        yield put({
          type: 'apply',
          payload: {
            editor: {
              form: {
                id: data.id,
                case_name: data.name,
                input: data.input,
                method_id: data.method_id,
                metadata: data.metadata
              },
              info: {
                app_name: data.app_name,
                service_name: data.service_name,
                method_name: data.method_name
              }
            }
          }
        });
      } else {
        message.error("加载用例失败" + res.msg);
      }
      return res;
    },
    * newUseCase({payload}, {call, put}) {
      let res = yield call(loadGrpcMethod, payload.id);
      if (res.code === 0) {
        yield put({
          type: 'apply',
          payload: {
            editor: {
              form: {
                case_name: res.data.name + "-" + (new Date()).getTime(),
                input: JSON.stringify(formatProtoDesc(res.data.input_type), null, 2),
                method_id: parseInt(payload.id),
                metadata: []
              },
              info: {
                app_name: res.data.app_name,
                service_name: res.data.service.name,
                method_name: res.data.name,
              }
            },
            response: null
          }
        });
      } else {
        message.error("加载Grpc Method信息失败:" + res.msg);
      }
      return res;
    },
    * changeSelectedUserCase({payload}, {call, put}) {
      yield put({
        type: 'apply',
        payload: {
          selected_user_case: payload
        }
      })
    },
    * createUserCase({payload}, {call, put}) {
      let res = yield call(createUserCase, payload);
      if (res.code === 0) {
        yield put({
          type: 'apply',
          payload: {
            selected_user_case: 'case:' + res.data.id,
          }
        });
        yield put({
          type: '_setCurrentCaseId',
          payload: res.data.id
        });
        message.success("保存成功")
      } else {
        message.error("保存失败:" + res.msg)
      }
      return res
    },
    * updateCaseInput({payload}, {call, put}) {
      yield put({
        type: '_updateCaseInput',
        payload: payload
      })
    },
    * updateUserCase({payload}, {call, put}) {
      let res = yield call(updateUserCase, payload);
      if (res.code === 0) {
        message.success("保存成功");
      } else {
        message.error("更新用例失败:" + res.msg);
      }
    },
    * showRightMenu({payload}, {call, put}) {
      yield put({
        type: 'apply',
        payload: {
          right_menu_visible: payload.visible,
          right_menu_position: payload.position,
          right_menu: payload.menu
        }
      })
    },
    * deleteUserCase({payload}, {call, put}) {
      let res = yield call(deleteUserCase, payload.id);
      if (res.code === 0) {
        message.success("删除成功")
      } else {
        message.error(res.msg);
      }
      return res;
    },
    * sendRequest({payload}, {call, put}) {
      let res = yield call(sendRequest, payload);
      if (res.code === 0) {
        let data = res.data;
        let output = data.output;
        try {
          output = JSON.parse(output);
          output = JSON.stringify(output, null, 2);
        } catch (e) {
          console.error("invalid response data:");
          console.error(e);
        }
        data.output = output;
        yield put({
          type: 'apply',
          payload: {
            response: data,
          }
        })
      } else {
        message.error(res.msg);
      }
    },
    * loadHistoryItem({payload}, {call, put}) {
      let res = yield call(historyItem, payload);
      yield put({
        type: 'apply',
        payload: {
          selected_history_id: payload
        }
      });
      if (res.code === 0) {
        let input = res.data.input;
        let output = res.data.output;
        try {
          output = JSON.stringify(JSON.parse(output), null, 2);
        } catch (e) {
          console.error(e);
        }
        try {
          input = JSON.stringify(JSON.parse(input), null, 2);
        } catch (e) {
          console.error(e);
        }
        yield put({
            type: 'apply',
            payload: {
              editor: {
                form: {
                  case_name: res.data.method_name + "-" + (new Date()).getTime(),
                  input: input,
                  method_id: res.data.method_id,
                  metadata: res.data.metadata
                },
                info: {
                  app_name: res.data.app_name,
                  service_name: res.data.service_name,
                  method_name: res.data.method_name,
                }
              },
              response: {
                status: res.data.status,
                error: res.data.error,
                time_cost: res.data.time_cost,
                output: output
              },
            },
          }
        )
      } else {
        message.error("记载历史记录失败:" + res.msg)
      }
      return res
    },
    * loadPublicCases({payload}, {call, put}) {
      let res = yield call(loadPublicList, payload.appName, payload.serviceName);
      if (res.code === 0) {
        yield put({
          type: 'apply',
          payload: {
            public_cases: res.data
          }
        })
      } else {
        message.error(res.msg);
      }
    },
    * loadPublicCase({payload}, {call, put}) {
      let res = yield call(loadPublicCase, payload);
      if (res.code === 0) {
        let input = res.data.input;
        try {
          input = JSON.stringify(JSON.parse(input), null, 2);
        } catch (e) {
          console.error(e);
        }
        yield put({
            type: 'apply',
            payload: {
              editor: {
                form: {
                  case_name: res.data.methodName + "-" + (new Date()).getTime(),
                  input: input,
                  autoTestId: res.data.autoTestId,
                  metadata: res.data.metadata
                },
                info: {
                  app_name: res.data.appName,
                  service_name: res.data.serviceName,
                  method_name: res.data.methodName,
                }
              },
              response: null
            },
          }
        )
      } else {
        message.error(res.msg);
      }
    },
    * loadSettings({payload}, {call, put}) {
      let settings = null;
      let settingStr = localStorage.getItem(StorageKeySettings);
      try {
        settings = JSON.parse(settingStr);
        yield put({
          type: 'apply',
          payload: {
            settings: settings
          }
        })
      } catch (e) {
        localStorage.removeItem(StorageKeySettings);
      }
    },
    * saveSettings({payload}, {put}) {
      yield put({
        type: '_saveSettings',
        payload
      });
    },
    * showSettings({payload}, {put}) {
      yield put({
        type: 'apply',
        payload: {
          setting_dialog_visible: payload
        }
      })
    },
    * updateMetadata({payload}, {put}) {
      yield put({
        type: '_updateMetadata',
        payload
      });
    },
    * showServiceBindDialog({payload}, {put}) {
      yield put({
        type: 'apply',
        payload: {
          service_bind_dialog_visible: payload
        }
      })
    },
    * loadProtoList({payload}, {call, put}) {
      let res = yield call(loadGrpcProtoList);
      if (res.code === 0) {
        yield put({
          type: 'apply',
          payload: {
            proto_list: res.data
          }
        })
      } else {
        message.error(res.msg);
      }
    },
  },
  reducers: {
    apply(state, {payload}) {
      return {...state, ...payload}
    },
    _updateCaseInput(state, {payload}) {
      let editor = state.editor;
      editor.form.input = payload;
      return {
        ...state,
        editor
      }
    },
    _setCurrentCaseId(state, {payload}) {
      let editor = state.editor;
      editor.form.id = payload;
      return {
        ...state,
        editor
      }
    },
    _saveSettings(state, {payload}) {
      localStorage.setItem('grpc_debug.settings', JSON.stringify(payload));
      return {
        ...state,
        settings: payload,
        setting_dialog_visible: false,
      }
    },
    _updateMetadata(state, {payload}) {
      let editor = state.editor;
      editor.form.metadata = payload;
      return {
        ...state,
        editor
      }
    }
  }
};
