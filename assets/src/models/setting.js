/**
 * 系统设置model
 */

import {loadSettings, updateSetting} from "@/pages/manage/services";
import {message} from "antd";

const defaultStates = {
  configDepSetting: {
    interval: 720, // 间隔时间，单位分钟
  },

  // 原始设置内容
  settings: {},
  tmpSetting: {},

  onEdit: {
    grafana: false,
    config_dep: false, // 配置依赖
  },

  savingSetting: false
}

export default {
  namespace: 'setting',
  state: defaultStates,
  effects: {
    // 设置编辑状态
    * setEdit(action, context) {
      const {payload} = action

      yield context.put({
        type: '_setEdit',
        payload: {
          name: payload.name,
          value: payload.value
        }
      })
    },
    // 保存设置
    * saveSetting({payload}, {call, put}) {
      const res = yield call(updateSetting, payload.name, payload.content)
      if (res.code !== 0) {
        message.error("保存设置失败:" + res.msg)
        return res
      }
      message.success("保存成功")

      yield put({
        type: '_setEdit',
        payload: {
          name: payload.name,
          value: false
        }
      })

      return res
    },
    * loadSettings({payload}, {call, put}) {
      const res = yield call(loadSettings)
      if (res.code !== 0) {
        message.error("加载设置失败:" + res.msg)
        return
      }

      let settings = res.data
      Object.keys(settings).map(name => {
        settings[name] = unMarshalSetting(name, settings[name])
      })

      yield put({
        type: '_setSettings',
        payload: settings
      })

      return res
    }
  },
  reducers: {
    _setEdit(state, {payload}) {
      let onEdit = state.onEdit
      onEdit[payload.name] = payload.value
      state.onEdit = onEdit

      return state
    },
    _setSettings(state, {payload}) {
      return {
        ...state,
        settings: payload,
      }
    },
  }
}

// 从临时配置
function loadTempSetting(settings) {
  return {
    grafana: settings.grafana,
    config_dep: settings.config_dep
  }
}

function unMarshalSetting(name, value) {
  switch (name) {
    case 'etcd':
    case 'config_dep':
    case 'grafana':
    case 'gateway':
      return JSON.parse(value)
    case 'version':
      const tmp = JSON.parse(value);
      return tmp instanceof Array ? tmp : [];
    default:
      return value
  }
}
