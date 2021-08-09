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
      getCluterInfo(currentInstance.name,appName,env,config.id,currentInstance).then(res=>{
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
            <div className={styles.instanceInfoTitle}>使用文档</div>
          </div>
          <div className={styles.instanceInfoContent}><a href={k8sClusters2 && k8sClusters2.doc ?k8sClusters2.doc:""}>点击查看</a></div>
        </li>
        <li key="2">
          <div className={styles.instanceInfoName}>
            <div className={styles.instanceInfoTitle}>同步时间</div>
          </div>
          <div className={styles.instanceInfoContent}>{k8sClusters2 && k8sClusters2.created_at? moment(k8sClusters2.created_at).format('YYYY-MM-DD HH:mm:ss') : ""}</div>
        </li>
        <li key="3">
          <div className={styles.instanceInfoName}>
            <div className={styles.instanceInfoTitle}>配置状态</div>
          </div>
          <div className={styles.instanceInfoContent}>{k8sClusters2 && k8sClusters2.sync_status? k8sClusters2.sync_status : ""}</div>
        </li>
        <li key="4">
          <div className={styles.instanceInfoName}>
            <div className={styles.instanceInfoTitle}>配置版本</div>
          </div>
          <div className={styles.instanceInfoContent}>{k8sClusters2 && k8sClusters2.version? <Tag>{k8sClusters2?k8sClusters2.version:""}</Tag> : ""} {k8sClusters2?k8sClusters2.change_log:""}</div>
        </li>
        <li key="5">
          <div className={styles.instanceInfoName}>
            <div className={styles.instanceInfoTitle}>参考路径</div>
          </div>
          <div className={styles.instanceInfoContent}>
            {k8sClusters2 && k8sClusters2.config_file_path? <div key="0" className={styles.configPathItem}>
              <span>{k8sClusters2.config_file_path}</span>
              <CopyOutlined onClick={() => {
                copyToClipBoard(k8sClusters2.config_file_path)
                message.success("已复制到剪切板")
              }} className={styles.configPathCopyBtn}/>
            </div>: ""}
          </div>
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
