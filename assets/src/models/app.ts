import {Effect} from "dva";
import {Reducer} from "umi";
import {AppListWithEnv, ServiceAppList} from "@/services/app";
import {message} from "antd";
import {Pagination} from "@/models/connect";

export interface AppItem {
  aid: number
  gid: number
  name: string
  app_name: string
  level: number
  biz_domain: string
  users: string[]
  web_url: string
  git_url: string
  http_port: string
  rpc_port: string
  govern_port: string
}

export interface AppItemWithEnv extends AppItem {
  envs: string[]
}

export interface AppModelState {
  list: AppItem[]
  listWithEnv: AppItemWithEnv[]
  loading: boolean
  pagination: Pagination
}

const DefaultState: AppModelState = {
  list: [],
  listWithEnv: [],
  loading: false,
  pagination: {
    current: 0,
    pageSize: 0,
    total: 0
  }
}

export interface AppModelType {
  namespace: 'app',
  state: AppModelState,
  effects: {
    fetch: Effect
    fetchListWithEnv: Effect
  },
  reducers: {
    saveList: Reducer<AppModelState>,
    apply: Reducer<AppModelState>,
    saveListWithEnv: Reducer<AppModelState>
  }
}

const AppModel: AppModelType = {
  namespace: 'app',
  state: DefaultState,
  effects: {
    * fetch({payload}, {call, put}) {
      const {page, pageSize = 10} = payload

      yield put({
        type: 'apply',
        payload: {
          loading: true
        }
      })

      const res = yield call(ServiceAppList, page, pageSize)
      if (res.code !== 0) {
        message.error("加载应用列表失败:" + res.msg)
        return
      }

      yield put({
        type: 'saveList',
        payload: res.data
      })
    },
    * fetchListWithEnv({payload}, {call, put}) {
      const {page, pageSize, searchText} = payload
      const res = yield call(AppListWithEnv, page, pageSize, searchText)
      if (res.code !== 0) {
        message.error("加载应用列表失败:" + res.msg)
        return
      }

      yield put({
        type: 'saveListWithEnv',
        payload: res.data
      })
    }
  },
  reducers: {
    saveList(state = DefaultState, {payload}): AppModelState {
      return {
        ...state,
        list: payload.list,
        loading: false,
        pagination: payload.pagination
      }
    },
    saveListWithEnv(state = DefaultState, {payload}): AppModelState {
      return {
        ...state,
        listWithEnv: payload.list,
        loading: false,
        pagination: payload.pagination
      }
    },
    apply(state = DefaultState, {payload}): AppModelState {
      return {
        ...state,
        ...payload
      }
    }
  }
}

export default AppModel
