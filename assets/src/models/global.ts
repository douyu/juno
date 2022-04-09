import { Effect, Reducer, Subscription } from 'umi';

import { NoticeIconData } from '@/components/NoticeIcon';
import { queryNotices } from '@/services/user';
import { ConnectState } from './connect.d';
import { MenuDataItem } from '@ant-design/pro-layout';
import { loadMenu } from '@/services/menu';
import { message } from 'antd';
import * as Icon from '@ant-design/icons';
import React from 'react';

export interface NoticeItem extends NoticeIconData {
  id: string;
  type: string;
  status: string;
}

export interface GlobalModelState {
  collapsed: boolean;
  notices: NoticeItem[];
  menu: MenuDataItem[];
}

const DefaultGlobalModelState: GlobalModelState = {
  collapsed: true,
  notices: [],
  menu: [],
};

export interface GlobalModelType {
  namespace: 'global';
  state: GlobalModelState;
  effects: {
    fetchNotices: Effect;
    clearNotices: Effect;
    changeNoticeReadState: Effect;
    fetchMenu: Effect;
  };
  reducers: {
    changeLayoutCollapsed: Reducer<GlobalModelState>;
    saveNotices: Reducer<GlobalModelState>;
    saveClearedNotices: Reducer<GlobalModelState>;
    saveMenu: Reducer<GlobalModelState>;
  };
  subscriptions: { setup: Subscription };
}

const GlobalModel: GlobalModelType = {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    menu: [],
  },

  effects: {
    *fetchNotices(_, { call, put, select }) {
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      const unreadCount: number = yield select(
        (state: ConnectState) => state.global.notices.filter((item) => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: data.length,
          unreadCount,
        },
      });
    },
    *clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count: number = yield select((state: ConnectState) => state.global.notices.length);
      const unreadCount: number = yield select(
        (state: ConnectState) => state.global.notices.filter((item) => !item.read).length,
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: count,
          unreadCount,
        },
      });
    },
    *changeNoticeReadState({ payload }, { put, select }) {
      const notices: NoticeItem[] = yield select((state: ConnectState) =>
        state.global.notices.map((item) => {
          const notice = { ...item };
          if (notice.id === payload) {
            notice.read = true;
          }
          return notice;
        }),
      );

      yield put({
        type: 'saveNotices',
        payload: notices,
      });

      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: notices.length,
          unreadCount: notices.filter((item) => !item.read).length,
        },
      });
    },
    *fetchMenu({ payload }, { call, put }) {
      const res = yield call(loadMenu);
      let { code, msg = '', data = [] } = res;

      const menuDataRender = (menu = []) => {
        return menu.map((item: any) => {
          item.icon = React.createElement(Icon[item.icon]);

          item.children && menuDataRender(item.children);
          return item;
        });
      };

      if (code !== 0) {
        message.error('加载菜单失败:' + msg);
      }

      data = menuDataRender(data);
      yield put({
        type: 'saveMenu',
        payload: data,
      });
    },
  },

  reducers: {
    changeLayoutCollapsed(state = DefaultGlobalModelState, { payload }): GlobalModelState {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state = DefaultGlobalModelState, { payload }): GlobalModelState {
      return {
        ...state,
        collapsed: false,
        notices: payload,
      };
    },
    saveClearedNotices(state = DefaultGlobalModelState, { payload }): GlobalModelState {
      return {
        ...state,
        collapsed: false,
        notices: state.notices.filter((item): boolean => item.type !== payload),
      };
    },
    saveMenu(state = DefaultGlobalModelState, { payload }): GlobalModelState {
      return {
        ...state,
        menu: payload,
      };
    },
  },

  subscriptions: {
    setup({ history }): void {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      history.listen(({ pathname, search }): void => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};

export default GlobalModel;
