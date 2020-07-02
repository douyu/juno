import React, {useEffect} from 'react';
import LeftSide from "./components/LeftSide/index";
import styles from './index.less';
import Editor from "./components/Editor/index";
import {connect} from 'dva';
import ModalSave from "@/pages/app/components/Config/components/ModalSave";
import ModalHistory from "@/pages/app/components/Config/components/ModalHistory";

function ConfigEdit(props) {
  const {aid, env, zoneList, appName} = props;

  useEffect(() => {
    // load config-file list
    props.dispatch({
      type: 'config/loadConfigInfo',
      payload: {
        aid, env
      }
    });

    props.dispatch({
      type: 'config/setZoneList',
      payload: zoneList
    })

    // 从上级拿到数据后写到 "config" model 里面
    props.dispatch({
      type: 'config/setCurrentEnv',
      payload: {
        aid,
        env,
        appName
      }
    })
  }, [aid, env, zoneList]);

  return (
    <div className={styles.container}>
      <LeftSide/>
      <Editor/>

      <ModalSave/>

      <ModalHistory/>
    </div>
  );
}

export default connect(() => ({}))(ConfigEdit);
