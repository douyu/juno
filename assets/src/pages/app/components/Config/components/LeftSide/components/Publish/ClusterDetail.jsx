import React, {useEffect, useState} from 'react';
import {connect} from 'dva';
import styles from './InstanceDetail.less';
import {CopyOutlined, DatabaseOutlined, EyeOutlined, ReloadOutlined} from '@ant-design/icons';
import {Button, message, Modal, Space, Spin, Tag} from 'antd';
import {ServiceAppAction} from '@/services/confgo';
import ModalRealtimeConfig from './ModalRealtimeConfig';
import copyToClipBoard from 'copy-to-clipboard'
import {getCluterInfo} from "@/services/config_resource";
import moment from 'moment';
const {confirm} = Modal;

function ClusterDetail(props) {
  const {currentInstance, dispatch, config, appName, env} = props;
  const [visibleRestartModal, setVisibleRestartModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState('');
  const [k8sClusters2, setK8sClusters2] = useState()


  useEffect(() => {
    if (k8sClusters2 == undefined){
      getCluterInfo(appName,env,currentInstance).then(res=>{
        setK8sClusters2(res.data)

      })
    }

  });






  if (!currentInstance) {
    return <div/>;
  }






  return (
    <div className={styles.instanceDetail}>
      <div className={styles.topHeader}>
        <div style={{fontSize: '48px', textAlign: 'center', padding: '10px'}}>
          <DatabaseOutlined/>
        </div>
        <div style={{padding: '10px'}}>
          <div style={{fontSize: '24px', fontWeight: 'bold'}}>{currentInstance.host_name}</div>
          <div>
            {currentInstance.region_name} {currentInstance.zone_name} {currentInstance.ip}
          </div>
          <div style={{marginTop: '10px'}}>
            <Space>
            </Space>
          </div>
        </div>
      </div>

      <ul className={styles.instanceInfoList}>
        <li key="1">
          <div className={styles.instanceInfoName}>
            <div className={styles.instanceInfoTitle}>配置版本</div>
          </div>
          <div className={styles.instanceInfoContent}>{k8sClusters2? k8sClusters2.version.substring(0, 7) : "未同步"}</div>
        </li>
        <li key="2">
          <div className={styles.instanceInfoName}>
            <div className={styles.instanceInfoTitle}>修改备注</div>
          </div>
          <div className={styles.instanceInfoContent}>{k8sClusters2? k8sClusters2.change_log : "未同步"}</div>
        </li>
        <li key="3">
          <div className={styles.instanceInfoName}>
            <div className={styles.instanceInfoTitle}>同步时间</div>
          </div>
          <div className={styles.instanceInfoContent}>{k8sClusters2? moment(k8sClusters2.created_at).format('YYYY-MM-DD HH:mm:ss') : "未同步"}</div>
        </li>
      </ul>

      <Modal
        title="操作面板"
        visible={visibleRestartModal}
        onOk={() => setVisibleRestartModal(false)}
        onCancel={() => setVisibleRestartModal(false)}
      >
        <div>
          <Spin spinning={loading}/>
        </div>
        <div style={{backgroundColor: 'black', borderRadius: '5px'}}>
          <p style={{color: 'green'}}>{content}</p>
        </div>
      </Modal>
      <ModalRealtimeConfig/>
    </div>
  );
}

const mapStateToProps = ({config}) => {
  return {
    acd: config.acd,
    currentInstance: config.currentInstance,
    appName: config.appName,
    env: config.env,
  };
};

export default connect(mapStateToProps)(ClusterDetail);
