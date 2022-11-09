// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';
//import favicon from '../favicon.png';
import MonacoEditorWebpackPlugin from 'monaco-editor-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import scripts from './scripts';
import styles from './styles';
const { REACT_APP_ENV } = process.env;
export default defineConfig({
  hash: true,
  devtool: 'eval',
  antd: {},
  dva: {
    hmr: true,
  },
  analyze: {
    analyzerMode: 'server',
    analyzerHost: '0.0.0.0',
    analyzerPort: 8888,
    openAnalyzer: true,
    // generate stats file while ANALYZE_DUMP exist
    generateStatsFile: false,
    statsFilename: 'stats.json',
    logLevel: 'info',
    defaultSizes: 'parsed', // stat  // gzip
  },
  styles: styles,
  mfsu: {},
  externals: {
    jquery: 'jQuery',
    echarts: 'echarts',
    // lodash: '_',
    'prettier/standalone': 'prettier',
    // react: 'React',
    // 'react-dom': 'ReactDOM',
    // antd: 'antd',
    codemirror: 'CodeMirror',
  },
  scripts: scripts,
  favicon: '/ant/home.png',
  locale: {
    // default zh-CN
    default: 'zh-CN',
    // default true, when it is true, will use `navigator.language` overwrite default
    antd: false,
    baseNavigator: true,
  },
  dynamicImport: {
    loading: '@/components/PageLoading/index',
  },
  // chunks: ['vendors', 'umi'],
  nodeModulesTransform: {
    type: 'none',
    exclude: [],
  },
  // webpack5 :{},
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
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          authority: ['admin', 'user'],
          routes: [
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
                  path: '/analysis/grafana',
                  name: 'Grafana',
                  component: './analysis/grafana/index',
                },
                {
                  path: '/analysis/proxy',
                  name: 'Grafana',
                  component: './proxy/index',
                },
                {
                  name: '依赖拓扑',
                  path: '/analysis/topology',
                  component: './analysis/topology/index',
                },
                {
                  name: '版本管理',
                  path: '/analysis/deppkg',
                  component: './analysis/deppkg/index',
                }
              ],
            },
            {
              path: '/cronjob',
              name: '任务中心',
              icon: 'ClockCircleOutlined',
              component: './cronjob/JobList',
            },
            {
              name: 'Task列表',
              path: '/cronjob/jobs/:jobId/tasks',
              component: './cronjob/TaskList',
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
                  name: '资源',
                  path: '/confgo/resource',
                  component: './confgo/resource/index',
                },
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
              path: '/permission',
              name: '权限设置',
              routes: [
                {
                  name: '用户组',
                  path: '/permission/user_group',
                  component: './permission/UserGroup',
                },
                {
                  name: '菜单接口权限',
                  path: '/permission/menu_api_permission',
                  component: './permission/MenuAPI',
                },
                {
                  name: '应用权限',
                  path: '/permission/app',
                  component: './permission/App',
                },
              ],
            },
            {
              path: '/test',
              name: '测试平台',
              routes: [
                {
                  name: 'GRPC测试',
                  path: '/test/grpc',
                  component: './test/grpc/index',
                },
                {
                  name: 'HTTP测试',
                  path: '/test/http',
                  component: './test/http/index',
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
                {
                  name: '代理设置',
                  path: '/admin/proxy',
                  component: './analysis/proxy/index',
                },
                {
                  name: 'Access Tokens',
                  path: '/admin/accessTokens',
                  component: './manage/AccessTokens',
                },
                {
                  name: '操作统计',
                  path: '/admin/stat',
                  component: './manage/UserStat',
                },
              ],
            },
            {
              path: '/',
              redirect: '/workspace',
            },
          ],
        },

        {
          component: './404',
        },
      ],
    },
  ],
  publicPath: '/ant/',
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    'nav-theme': defaultSettings.navTheme,
    'primary-color': defaultSettings.primaryColor,
    'border-radius-base': '8px',
  },
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/ant/',
  },
  chainWebpack(config, { env, webpack, createCSSRule }) {
    config.plugin('monaco-editor').use(MonacoEditorWebpackPlugin, [
      {
        languages: ['javascript', 'typescript', 'json', 'shell'],
        features: [
          'coreCommands',
          'find',
          'comment',
          'format',
          'bracketMatching',
          'wordOperations',
          'suggest',
          'multicursor',
          'links',
        ],
      },
    ]);
    if (process.env.NODE_ENV === 'production') {
      //gzip压缩
      config.plugin('compression-webpack-plugin').use(CompressionPlugin, [
        {
          test: /\.js$|\.html$|\.css$/, //匹配文件名
          threshold: 10240, //对超过10k的数据压缩
          deleteOriginalAssets: false, //不删除源文件
        },
      ]);
    }
  },
});
