import {zoneEnvTree} from "@/services/zone";
import {message} from "antd";
import {configResourceList, createResourceVersion, loadResourceTags} from "@/services/config_resource";

const defaultStates = {
  zoneEnv: {},
  list: [],
  listLoading: false,
  pagination: {
    current: 0,
    total: 0,
    pageSize: 0
  },

  // create modal
  modalConfigResourceVisible: false,
  // edit modal
  modalConfigResourceEditVisible: false,
  currentEditResource: {
    id: 0,
    name: '',
    env: '',
    zone_code: '',
    description: '',
  },

  // 现有的Tag
  tags: []
}

export default {
  namespace: 'configResource',
  state: defaultStates,
  effects: {
    * loadZoneEnvTree({payload}, {call, put}) {
      const res = yield call(zoneEnvTree)
      if (res.code !== 0) {
        message.error("加载可用区列表失败")
        return res
      }

      yield put({
        type: '_apply',
        payload: {zoneEnv: res.data}
      })

      return res
    },
    * loadList({payload}, {call, put}) {
      yield put({
        type: '_apply',
        payload: {
          listLoading: true
        }
      })

      const res = yield call(configResourceList, payload)

      if (res.code !== 0) {
        message.error("加载资源列表失败")
        return res
      }

      yield put({
        type: '_apply',
        payload: {
          list: res.data.list,
          pagination: res.data.pagination,
          listLoading: false
        }
      })

      return res
    },

    * showModalCreateResource({payload}, {call, put}) {
      yield put({
        type: '_apply',
        payload: {
          modalConfigResourceVisible: payload
        }
      })
    },

    * showModalEdit({payload}, {put}) {
      const {visible, ...rest} = payload
      yield put({
        type: '_apply',
        payload: {
          currentEditResource: {
            ...rest,
          },
          modalConfigResourceEditVisible: visible
        }
      })
    },

    * createResourceVersion({payload}, {call, put}) {
      const res = yield call(createResourceVersion, payload)

      if (res.code !== 0) {
        message.error("资源更新失败:" + res.msg)
        return res
      }

      message.success("资源更新成功")
      return res
    },

    * loadTags(_, {call, put}) {
      const res = yield call(loadResourceTags)

      if (res.code !== 0) {
        message.error("加载Tag列表失败:" + res.msg)
        return res
      }

      yield put({
        type: '_apply',
        payload: {
          tags: res.data
        }
      })

      return res
    }
  },
  reducers: {
    _apply(state, {payload}) {
      return {
        ...state,
        ...payload
      }
    }
  }
}
