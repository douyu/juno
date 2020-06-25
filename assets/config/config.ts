// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
//import favicon from '../favicon.png';

const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  favicon: '/ant/home.png',
  layout: {
    name: ' ',
    locale: false,
    logo: '/ant/favicon.png',
    navTheme: 'light',
    // layout: 'topmenu',
    autoHideHeader: true,
  },
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: true,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  targets: {
    ie: 11,
  },
  // umi routes: https://umijs.org/docs/routing
  routes: [
    {
      path: '/user',
      layout: false,
      routes: [
        {
          name: 'login',
          path: '/user/login',
          layout: false,
          component: './user/login',
        },
      ],
    },
    {
      name: '工作台',
      icon: 'CrownOutlined',
      path: '/workspace',
      component: './workspace',
    },
    {
      name: '应用服务',
      icon: 'RocketOutlined',
      path: '/app',
      component: './app',
    },
    {
      path: '/analysis',
      name: '功能看板',
      icon: 'GlobalOutlined',
      routes: [
        {
          path: '/analysis/dashboard',
          name: '大盘',
          component: './analysis/bigboard/index',
        },
        {
          name: '依赖拓扑',
          path: '/analysis/topology',
          component: './analysis/topology/index',
        },
      ],
    },
    {
      path: '/resource',
      name: '资源中心',
      icon: 'UngroupOutlined',
      routes: [
        {
          name: '应用列表',
          path: '/resource/app/list',
          component: './resource/app/list',
        },
        {
          path: '/resource/app/create',
          component: './resource/app/create',
        },
        {
          path: '/resource/app/update',
          component: './resource/app/update',
        },
        {
          name: '可用区列表',
          path: '/resource/zone/list',
          component: './resource/zone/list',
        },
        {
          path: '/resource/zone/create',
          component: './resource/zone/create',
        },
        {
          path: '/resource/zone/update',
          component: './resource/zone/update',
        },
        {
          name: '节点列表',
          path: '/resource/node/list',
          component: './resource/node/list',
        },
        {
          path: '/resource/node/create',
          component: './resource/node/create',
        },
        {
          path: '/resource/node/update',
          component: './resource/node/update',
        },
        {
          name: '应用节点关系列表',
          path: '/resource/appnode/list',
          component: './resource/appnode/list',
        },
      ],
    },
    {
      path: '/confgo',
      name: '配置中心',
      icon: 'FileProtectOutlined',
      routes: [
        {
          name: '配置依赖解析模板',
          path: '/confgo/tpl/list',
          component: './confgo/tpl/list',
        },
        {
          path: '/confgo/tpl/create',
          component: './confgo/tpl/create',
        },
        {
          path: '/confgo/tpl/update',
          component: './confgo/tpl/update',
        },
      ],
    },
    {
      path: '/admin',
      name: '系统设置',
      icon: 'ToolOutlined',
      routes: [
        {
          name: '用户管理',
          path: '/admin/user',
          component: './user/manage',
        },
        {
          name: '系统设置',
          path: '/admin/config',
          component: './manage/manage',
        },
      ],
    },
    {
      path: '/',
      redirect: '/workspace',
    },
    {
      component: './404',
    },
  ],
  publicPath: '/ant/',
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'nav-theme': defaultSettings.navTheme,
    'primary-color': defaultSettings.primaryColor,
    'border-radius-base': '8px',
  },
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/ant/',
  },
});
