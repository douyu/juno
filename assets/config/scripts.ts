const env = process.env.NODE_ENV;
const staticPrefix = env === 'development' ? '' : '/ant';

export default [
  //prettier
  // {
  //   src: staticPrefix + '/js/prettier/v2.0.5/standalone.js',
  // },
  // {
  //   src: staticPrefix + '/js/prettier/v2.0.5/parser-babel.js',
  // },
  // {
  //   src: staticPrefix + '/js/prettier/v2.0.5/parser-html.js',
  // },
  // {
  //   src: staticPrefix + '/js/prettier/v2.0.5/parser-yaml.js',
  // },
  //echarts
  {
    src: staticPrefix + '/js/echarts/v4.7.0/echarts.min.js',
  },
  //react
  {
    src: staticPrefix + '/js/react/v16.3.1/react.production.min.js',
  },
  {
    src: staticPrefix + '/js/react/v16.3.1/react-dom.production.min.js',
  },
  //antd
  {
    src: staticPrefix + '/js/antd/v4.3.4/antd.min.js',
  },
  // {
  //   src:  'https://oresource.melican.cn/jquery/3.4.1/jquery.min.js',
  // },
];
