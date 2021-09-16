import React, { useRef, useEffect, useState } from 'react';
import { connect } from 'dva';
import $ from 'jquery';
import { useFullscreen } from 'ahooks';
import { FullscreenOutlined, FullscreenExitOutlined } from '@ant-design/icons/lib';
import { Empty } from 'antd';

import styles from './index.less';

function GrafanaPannel(props: any) {
  const ref = useRef<any>();
  const granfanRef = useRef<any>();
  let [iframeVisible, setIframeVisible] = useState(false);
  const [isFullscreen, { toggleFull }] = useFullscreen(ref);
  const { aid, env, appName, zoneCode, versionKey, dashboardPath, version } = props;
  // const { version } = props.settings;
  const currentVersion =
    (Array.isArray(version) &&
      version.find((item) => versionKey && item.versionKey === versionKey)) ||
    {};

  console.log('renderGrafana---aid', aid);
  useEffect(() => {
    setTimeout(()=>{
      $('#grafana-iframe').on('load', () => {
        // $(granfanRef.current.contentDocument).find('sidemenu').css({ display: 'none' });
        // setIframeVisible(true);
      });
    })
    return () => {
      setIframeVisible(false);
    };
  }, [dashboardPath]);
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

  const url = `${dashboardPath}&var-appname=${appName}&var-env=${env}&var-datasource=${datasource}&var-aid=${aid}&from=now-30m&to=now`;
  return (
    <div
      style={{
        overflow: 'hidden',
        position: 'relative',
        display: 'flex',
        flex: 'auto',
        marginLeft: iframeVisible ? 0 : -68,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        // transition: iframeVisible ? 'margin-left 1.5s' : '',
      }}
      ref={ref}
    >
      <div
        onClick={() => {
          //触发全屏的时候将sidemenu给隐藏
          if (!isFullscreen) {
            $(granfanRef.current.contentDocument).find('sidemenu').css({ display: 'none' });
            setIframeVisible(true);
          }
          toggleFull();
        }}
        className={styles.btnFullScreen}
      >
        {isFullscreen ? <FullscreenExitOutlined /> : <FullscreenOutlined />}
      </div>
      <iframe
        name="grafana"
        src={url}
        // ref="grafana"
        ref={granfanRef}
        // ref={(item)=>{this.grafana=item}}
        scrolling="no"
        width="100%"
        id="grafana-iframe"
        // height={2000}
        frameBorder={0}
        style={{
          // visibility: iframeVisible ? 'visible' : 'hidden',
          // marginLeft: '-72px',
          overflow: 'hidden',
          flex: 'auto',
          marginRight: 0,
          // ,position:'absolute',top:195,bottom:0,
        }}
      />
    </div>
  );
}

export default connect(() => ({}))(GrafanaPannel);
