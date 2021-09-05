const env = process.env.NODE_ENV;
const staticPrefix = env === 'development' ? '' : '/ant';

export default [
    // {
    //     src: staticPrefix + '/js/codemirror/v5.62.3/lib/codemirror.css'
    // },
    {
        src: staticPrefix + '/js/antd/v4.3.4/antd.css'
    }
];
