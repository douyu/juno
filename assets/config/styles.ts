const env = process.env.NODE_ENV;
const staticPrefix = env === 'development' ? '' : '/ant';

export default [
    staticPrefix + '/js/codemirror/v5.62.3/lib/codemirror.css',
    // staticPrefix + '/js/antd/v4.3.4/antd.css'
];
