import React, { useRef } from 'react';
import { connect } from 'dva';
import { useFullscreen } from 'ahooks';
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons/lib';
import { Empty } from 'antd';

import styles from './index.less';

function GrafanaPannel(props: any) {
  const ref = useRef();
  const [isFullscreen, { toggleFull }] = useFullscreen(ref);
  const { aid, env, appName, zoneCode, versionKey, dashboardPath, version } = props;
  // const { version } = props.settings;
  const currentVersion =
    (Array.isArray(version) &&
      version.find((item) => versionKey && item.versionKey === versionKey)) ||
    {};

  console.log('renderGrafana---aid', aid);

  if (!dashboardPath) {
    return (
      <div style={{ marginTop: 10 }}>
        <Empty description={'请选择监控类型'} style={{ padding: '100px' }} />
      </div>
    );
  }

  if (zoneCode === '' || zoneCode === 'all') {
    return (
      <div style={{ marginTop: 10 }}>
        <Empty description={'请选择可用区'} style={{ padding: '100px' }} />
      </div>
    );
  }

  console.log('renderGrafana -> zoneCode', zoneCode);

  const datasource = `${env}.${zoneCode}.${currentVersion.name || ''}`;

  const url = `${dashboardPath}&var-appname=${appName}&var-env=${env}&var-datasource=${datasource}&var-aid=${aid}&from=now-30m&to=now&kiosk=tv`;

  return (
    <div
      style={{
        overflow: 'hidden',
        marginLeft: '10px',
        position: 'relative',
        display: 'flex',
        flex: 'auto',
        flexDirection: 'column',
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
        scrolling="no"
        width="100%"
        id="grafana-iframe"
        // height={2000}
        frameBorder={0}
        style={{
          // marginLeft: '-72px',
          overflow: 'hidden',
          flex: 'auto',
          // ,position:'absolute',top:195,bottom:0,
        }}
      />
    </div>
  );
}

export default connect(() => ({}))(GrafanaPannel);
