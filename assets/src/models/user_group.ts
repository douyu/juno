import {Effect, Reducer} from "@@/plugin-dva/connect";
import {queryUserGroups, queryUserListWithGroupInfo} from "@/services/permission";
import {message} from "antd";
import {Pagination} from "@/models/connect";

export interface User {
  uid: number,
  user_name: string,
  nick_name: string,
  access: string,
  groups: string[]
}

export interface UserGroupItem {
  name: string
}

export interface UserGroupModelState {
  users?: User[]
  userSearchText?: string
  currentEditUser?: User
  userGroups: UserGroupItem[]
  visibleModalChangeUserGroup: boolean
  usersLoading: boolean
  usersPagination: Pagination
}

const DefaultState: UserGroupModelState = {
  users: [],
  userGroups: [],
  usersPagination: {
    current: 0,
    total: 0,
    pageSize: 0
  },
  usersLoading: false,
  visibleModalChangeUserGroup: false,
}

export interface UserGroupModelType {
  namespace: 'userGroup';
  state: UserGroupModelState;
  effects: {
    fetch: Effect
    fetchUserList: Effect
    showModalChangeUserGroup: Effect
  };
  reducers: {
    saveUserGroups: Reducer<UserGroupModelState>
    saveUserList: Reducer<UserGroupModelState>
    setUsersLoading: Reducer<UserGroupModelState>
    setSearchText: Reducer<UserGroupModelState>
    apply: Reducer<UserGroupModelState>
  };
}

const UserGroupModel: UserGroupModelType = {
  namespace: 'userGroup',
  state: DefaultState,
  effects: {
    * fetch({payload}, {put, call}) {
      const res = yield call(queryUserGroups)
      const {code, msg, data} = res
      if (code !== 0) {
        message.error("加载用户组列表失败: " + msg)
        return
      }

      yield put({
        type: 'userGroup/saveUserGroups',
        payload: data
      })
    },
    * fetchUserList({payload}, {put, call}) {
      const {page, pageSize = 10, groupName, search} = payload

      yield put({
        type: 'setUsersLoading',
        payload: true
      })

      const res = yield call(queryUserListWithGroupInfo, page, pageSize, groupName, search)
      const {code, data = {list: [], pagination: {}}, msg} = res

      if (code !== 0) {
        message.error("加载用户列表失败:" + msg)
        return
      }

      yield put({
        type: 'saveUserList',
        payload: data
      })
    },
    * showModalChangeUserGroup({payload}, {put, call}) {
      const {visible, user} = payload
      yield put({
        type: 'apply',
        payload: {
          visibleModalChangeUserGroup: visible,
          currentEditUser: user
        }
      })
    }
  },
  reducers: {
    saveUserList(state = DefaultState, {payload}): UserGroupModelState {
      const {list, pagination} = payload

      return {
        ...state,
        users: list,
        usersPagination: pagination,
        usersLoading: false
      }
    },
    setUsersLoading(state = DefaultState, {payload}): UserGroupModelState {
      return {
        ...state,
        usersLoading: payload
      }
    },
    setSearchText(state = DefaultState, {payload}): UserGroupModelState {
      return {
        ...state,
        userSearchText: payload
      }
    },
    apply(state = DefaultState, {payload}): UserGroupModelState {
      return {
        ...state,
        ...payload
      }
    },
    saveUserGroups(state = DefaultState, {payload}): UserGroupModelState {
      return {
        ...state,
        userGroups: payload
      }
    }
  }
}

export default UserGroupModel
