/**
 * 系统设置model
 */

import {loadSettings, updateSetting} from "@/pages/manage/services";
import {message} from "antd";

const defaultStates = {
  grafanaEdit: false,
  grafanaConfig: {
    host: '',
    header_name: '',
    api_dashboard_addr: '',
    instance_dashboard_addr: '',
    overview_dashboard_addr: '',
  },

  configDepSetting: {
    interval: 720, // 间隔时间，单位分钟
  },

  // 原始设置内容
  settings: {},

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

      if (!payload.value) {
        context.put({
          type: '_resetSettingField',
          payload: payload.name
        })
      }

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
      console.log(settings)

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
        ...loadTempSetting(payload)
      }
    },
    _resetSettings(state,) {
      return {
        ...state,
        ...loadTempSetting(state.settings)
      }
    },
    _resetSettingField(state, {payload}) {
      let settings = {}
      settings[payload] = state.settings[payload]
      return {
        ...state,
        ...loadTempSetting(settings)
      }
    }
  }
}

// 从临时配置
function loadTempSetting(settings) {
  return {
    grafanaConfig: settings.grafana,
    configDepSetting: settings.config_dep
  }
}

function unMarshalSetting(name, value) {
  switch (name) {
    case 'etcd':
    case 'config_dep':
    case 'gateway':
      return JSON.parse(value)
    case 'grafana':
      const tmp = JSON.parse(value);
      return tmp instanceof Array ? tmp : [];
    default:
      return value
  }
}
