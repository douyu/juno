
import { message } from "antd";
import { pluginList } from "../services/plugin";

const defaultStates = {
    pluginList: [],
}

export default {
    namespace: 'plugin',
    state: defaultStates,
    effects: {
        *pluginListFunc({ }, { call, put }) {
            const res = yield call(pluginList)
            if (res.code !== 0) {
                message.error("加载插件列表失败")
                return res
            }

            yield put({
                type: '_apply',
                payload: {
                    pluginList: res.data.list,
                }
            })
            return res
        },
    },
    reducers: {
        _apply(state, { payload }) {
            return {
                ...state,
                ...payload
            }
        }
    }
}
