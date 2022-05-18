import React, { useEffect, useRef } from 'react';
import { useFullscreen } from 'ahooks';
import LeftSide from './components/LeftSide/index';
import styles from './index.less';
import Editor from './components/Editor/index';
import { connect } from 'dva';
import ModalSave from './components/ModalSave';
import ModalHistory from './components/ModalHistory';
import EditorMaskLayer from './components/EditorMaskLayer';
import ModalDiff from './components/ModalDiff';

function ConfigEdit(props) {
  const { aid, env, zoneList, zoneCode, appName, serviceVersion, publishVersion } = props;
  const ref = useRef();
  const [isFullscreen, { setFull, exitFull, toggleFull }] = useFullscreen(ref);
  useEffect(() => {
    if (!appName) return;
    if (!env) return;

    // reset
    props.dispatch({
      type: 'config/showEditorMaskLayer',
      payload: {
        visible: false,
      },
    });
    props.dispatch({
      type: 'config/setLeftSideActiveMenu',
      payload: 'config-edit',
    });

    // load config-file list
    props.dispatch({
      type: 'config/loadConfigInfo',
      payload: {
        appName,
        env,
      },
    });

    props.dispatch({
      type: 'config/clearCurrentConfig',
    });
  }, [appName, env]);

  useEffect(() => {
    props.dispatch({
      type: 'config/setZoneList',
      payload: zoneList,
    });
  }, [zoneList]);

  useEffect(() => {
    // 从上级拿到数据后写到 "config" model 里面
    props.dispatch({
      type: 'config/setCurrentEnv',
      payload: {
        aid,
        env,
        appName,
        zoneCode,
        publishVersion,
        serviceVersion,
      },
    });
  }, [aid, appName, env, zoneCode, publishVersion, serviceVersion]);

  return (
    <div className={styles.container} style={{ overflow: 'hidden' }} ref={ref}>
      <LeftSide
        onFullScreen={(full) => {
          full ? setFull() : exitFull();
        }}
        isFullScreen={isFullscreen}
      />

      <div className={styles.main}>
        <EditorMaskLayer />

        <Editor env={env} appName={appName} />
      </div>

      <ModalSave env={env} appName={appName} />

      <ModalHistory />

      <ModalDiff />
    </div>
  );
}

export default connect(() => ({}))(ConfigEdit);
