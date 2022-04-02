import React from 'react';
import { PluginProps } from '../type';
import { connect } from 'dva';
import ProxyView from '../../../proxy/proxyView';

export function WebEmbedPlugin(props: PluginProps) {
  if (props.meta && props.meta[props.env]) {
    let url = props.meta[props.env].proxyURL;
    if (/#APP_NAME/g.test(url)) {
      url = url.replaceAll('#APP_NAME', props.appName);
      url = url.replaceAll('#ENV', props.env);
      url = url.replaceAll('#DATASOURCE', props.datasource);
      url = url.replaceAll('#AID', props.aid);
    }
    return (
      <div style={{ display: 'flex' }}>
        <ProxyView proxyURL={url} />
      </div>
    );
  }
  return <div style={{ display: 'flex' }}></div>;
}
export default connect(({}) => {
  return {};
})(WebEmbedPlugin);
