import React, { useEffect, useState } from 'react';
import { connect } from 'dva';
import styles from './index.less';
import { Select, Modal, message } from 'antd';
import { DatabaseOutlined } from '@ant-design/icons';
import OptionButton from '@/pages/app/components/Config/components/OptionButton';

function Publish(props: any) {
  const {
    aid,
    env,
    zoneCode,
    loadConfigInstances,
    configList,
    configInstanceListLoading,
    configInstanceList,
    configPublish,
    loadConfigHistorys,
    historyList,
    historyListLoading,
  } = props;

  const [visible, setVisible] = useState(false);
  const [configureID, setConfigureID] = useState(0);
  const [version, setVerison] = useState('');

  useEffect(() => {
    loadConfigInstances(aid, env, zoneCode);
  }, [aid, env, zoneCode]);

  let publishStart = () => {
    console.log('configureID', configureID);
    if (configureID == 0) {
      message.error('请选择配置文件再进行发布');
      return;
    }
    setVisible(true);
    loadConfigHistorys(configureID);
  };

  let selectVersion = (val: string) => {
    setVerison(val);
  };

  let handleCancel = () => {
    setVisible(false);
  };

  let handleOk = () => {
    console.log('configureID', configureID);
    console.log('version', version);
    configPublish(configureID, version);
    setVisible(false);
  };

  let selectConfigFile = (val: number) => {
    setConfigureID(val);
  };

  return (
    <div className={styles.publish}>
      <Select
        style={{ width: '100%' }}
        loading={configInstanceListLoading}
        onSelect={selectConfigFile}
      >
        {configList.map((item: any, index: any) => {
          return (
            <Select.Option value={item.id} key={index}>
              {item.name}.{item.format}
            </Select.Option>
          );
        })}
      </Select>

      <div style={{ marginTop: '10px' }}>
        <OptionButton onClick={publishStart}>发布</OptionButton>
      </div>

      <ul className={styles.instanceList}>
        {configInstanceList != undefined &&
          configInstanceList.map((item: any, index: any) => {
            return (
              <li key={index}>
                <div className={styles.icon}>
                  <DatabaseOutlined />
                </div>
                <div className={styles.instanceInfo}>
                  <p>
                    <span className={styles.infoTitle}>Host:</span>
                    <span>{item.host_name}</span>
                  </p>
                  <p>
                    <span className={styles.infoTitle}>Version:</span>
                    <span>{item.version}</span>
                  </p>
                </div>
              </li>
            );
          })}
      </ul>

      <Modal title="配置发布" visible={visible} onOk={handleOk} onCancel={handleCancel}>
        <Select style={{ width: '100%' }} loading={historyListLoading} onSelect={selectVersion}>
          {historyList != undefined &&
            historyList.map((item: any, index: any) => {
              return (
                <Select.Option value={item.version} key={index}>
                  {item.version}.{item.change_log}
                </Select.Option>
              );
            })}
        </Select>
      </Modal>
    </div>
  );
}

const mapStateToProps = ({ config }: any) => {
  console.log('mapStateToProps -> config', config);
  return {
    aid: config.aid,
    env: config.env,
    configList: config.configList,
    configInstanceList: config.configInstanceList,
    zoneCode: config.zoneCode,
    historyList: config.historyList,
    historyListLoading: config.historyListLoading,
  };
};

const mapDispatchToProps = (dispatch: any) => {
  return {
    loadConfigInstances: (aid: any, env: any, zoneCode: any) =>
      dispatch({
        type: 'config/loadConfigInstances',
        payload: {
          aid,
          env,
          zoneCode,
        },
      }),

    loadConfigHistorys: (id: number) =>
      dispatch({
        type: 'config/loadHistory',
        payload: {
          id,
          page: 0,
          size: 10000,
        },
      }),

    configPublish: (id: number, version: string) =>
      dispatch({
        type: 'config/configPublish',
        payload: {
          id,
          version,
        },
      }),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Publish);
