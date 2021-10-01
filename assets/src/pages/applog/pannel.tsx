import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'dva';

import { useFullscreen } from 'ahooks';
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons/lib';
import styles from './index.less';

function GrafanaPannel(props: any) {
  const ref = useRef<any>();
  const logRef = useRef<any>();
  // let [iframeVisible, setIframeVisible] = useState(false);

  const [isFullscreen, { toggleFull }] = useFullscreen(ref);
  const { url } = props;

  return (
    <div
      style={{
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flex: 'auto',
        // marginLeft: iframeVisible ? 0 : -68,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}
      ref={ref}
    >
      <div
        onClick={() => {
          toggleFull();
        }}
        className={styles.btnFullScreen}
      >
        {isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
      </div>
      <iframe
        name="grafana"
        src={url}
        ref={logRef}
        scrolling="no"
        width="100%"
        frameBorder={0}
        style={{
          overflow: 'hidden',
          flex: 'auto',
          marginRight: 0,
        }}
      />
    </div>
  );
}

export default connect(() => ({}))(GrafanaPannel);
