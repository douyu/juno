/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/ant/js': {
      target: 'http://localhost:9999',
      changeOrigin: true,
      pathRewrite: { '^/ant': '' },
    },
    '/api/admin': {
      target: 'http://localhost:50000',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
    '/api/url': {
      target: 'http://clive.dz11.com',
      changeOrigin: true,
      pathRewrite: { '^': '/log' },
    },
    '/api/v1': {
      target: 'http://localhost:50000',
      changeOrigin: true,
    },
    '/grafana': {
      target: 'http://localhost:50000',
      changeOrigin: true,
    },
    '/proxy': {
      target: 'http://localhost:50000',
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
