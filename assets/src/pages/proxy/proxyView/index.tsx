import React, { useState, useEffect } from 'react';
import { traceURL } from "../services/proxyintegrat"

export default function (props) {
  let [dynamicUrl, updateDynamicUrl] = useState('');
  const { proxyURL, panelType } = props;
  //支持动态嵌入页面
  if (panelType == "alitrace") {
    useEffect(() => {
      traceURL({ toURL: proxyURL }).then((res) => {
        if (res.code == 0) {
          updateDynamicUrl(res.data && res.data.url);
        }
      })
    }, [])
    return dynamicUrl !== '' ? <div
      style={{
        width: '100%',
        display: 'flex',
        flex: 1,
      }}
    >
      <iframe
        src={dynamicUrl}
        style={{
          border: 'none',
          width: '100%',
          flex: 1,
        }}
      />
    </div > : <div>请设置代理页面</div>
  }
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flex: 1,
      }}
    >
      <iframe
        src={proxyURL}
        style={{
          border: 'none',
          width: '100%',
          flex: 1,
        }}
      />
    </div>
  );
}
