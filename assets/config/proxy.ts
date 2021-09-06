/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/ant': {
      target: 'http://localhost:9999',
      changeOrigin: true,
      pathRewrite: { '^/ant': '' },
    },
    '/api/admin': {
      target: 'http://juno.melican.cn',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/api/v1': {
      target: 'https://juno.melican.cn',
      changeOrigin: true,
    },
    '/grafana': {
      target: 'http://grafana.melican.cn',
      changeOrigin: true,
    },
  },
  test: {
    '/ant/': {
      target: 'http://localhost:8000',
      changeOrigin: true,
      pathRewrite: { '^/ant': '' },
    },
    '/api/admin': {
      target: 'http://192.168.56.101:50000',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/grafana': {
      target: 'http://192.168.56.101:50000',
    },
  },
  pre: {
    '/ant/': {
      target: 'http://localhost:8000',
      changeOrigin: true,
      pathRewrite: { '^/ant': '' },
    },
    '/api/admin': {
      target: 'http://127.0.0.1:50000',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/grafana': {
      target: 'http://127.0.0.1:50000',
    },
  },
};
