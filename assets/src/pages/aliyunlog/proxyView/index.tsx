import React, { useEffect, useState } from 'react';
import { getCompleteLogSearchUrl } from '../services/aliyunlog';

export default function (props) {
  let [proxyURL, updateProxyURL] = useState('');
  useEffect(() => {
    const { region, project, logstore, remark } = props;
    getCompleteLogSearchUrl({ region, project, logstore, remark }).then((res) => {
      if (res.code == 0) {
        updateProxyURL(res.data);
      }
    });
  }, []);
  return (
    <div
      style={{
        width: '100%',
        display: 'flex',
        flex: 1,
      }}
    >
      {proxyURL && (
        <iframe
          src={proxyURL}
          style={{
            border: 'none',
            width: '100%',
            flex: 1,
          }}
        />
      )}
    </div>
  );
}
