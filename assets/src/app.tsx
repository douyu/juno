import React from 'react';
import { history } from 'umi';
import RightContent from '@/components/RightContent';
import Footer from '@/components/Footer';
import { queryCurrent } from './services/user';
import defaultSettings, { DefaultSettings } from '../config/defaultSettings';

export async function getInitialState(): Promise<{
  currentUser?: API.CurrentUser;
  settings?: DefaultSettings;
}> {
  // 如果是登录页面，不执行
  if (history.location.pathname !== '/user/login') {
    try {
      const res = await queryCurrent();
      if (res.data != null && res.data.userName != '') {
        return {
          currentUser: res.data,
          settings: defaultSettings,
        };
      } else {
        history.push('/user/login');
      }
    } catch (error) {
      history.push('/user/login');
    }
  }
  return {
    settings: defaultSettings,
  };
}

export const layout = {
  rightRender: () => {
    return <RightContent />;
  },
  footerRender: () => <Footer />,
};
