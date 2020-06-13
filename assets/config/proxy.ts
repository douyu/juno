/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */
export default {
  dev: {
    '/api/admin': {
      target: 'http://192.168.56.101:50000',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  test: {
    '/api/admin': {
      target: 'http://192.168.56.101:50000',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/admin': {
      target: 'http://192.168.56.101:50000',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};
